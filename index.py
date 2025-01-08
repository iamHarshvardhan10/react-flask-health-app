from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from flask_pymongo import PyMongo
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from bson import ObjectId
import numpy as np
import matplotlib.pyplot as plt
from sklearn.ensemble import RandomForestClassifier
from lime import lime_tabular
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
import io
from dotenv import load_dotenv
import os
import matplotlib
matplotlib.use('Agg')  # Set a non-interactbackend
import matplotlib.pyplot as plt


load_dotenv()

app = Flask(__name__)
CORS(app)
# 
app.config['MONGO_URI'] = os.getenv('MONGO_URI')
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')  
mongo = PyMongo(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)

def generate_dummy_data():
    X = np.random.rand(100, 20)
    y = np.random.choice([0, 1, 2], size=100)
    return X, y

def create_lime_explanation(model, X, feature_names):
    explainer = lime_tabular.LimeTabularExplainer(
        X,
        feature_names=feature_names,
        class_names=["Class 0", "Class 1", "Class 2"],
        mode="classification"
    )
    exp = explainer.explain_instance(X[0], model.predict_proba)
    fig = exp.as_pyplot_figure()
    img_buffer = io.BytesIO()
    fig.savefig(img_buffer, format='png')
    img_buffer.seek(0)
    plt.close(fig)
    return img_buffer

def create_gene_health_pie_chart(data):
    labels = ['Healthy', 'Unhealthy', 'Undiagnosed']
    plt.figure(figsize=(6, 6))
    plt.pie(data, labels=labels, autopct='%1.1f%%', startangle=90)
    plt.title('Gene Health Distribution')
    img_buffer = io.BytesIO()
    plt.savefig(img_buffer, format='png')
    img_buffer.seek(0)
    plt.close()
    return img_buffer

from PIL import Image

def generate_pdf(user_data, lime_img, pie_chart_img):
    buffer = io.BytesIO()
    c = canvas.Canvas(buffer, pagesize=letter)
    width, height = letter

    c.setFont("Helvetica-Bold", 16)
    c.drawString(200, height - 50, "Health and Cancer Risk Report")

    c.setFont("Helvetica", 12)
    y_position = height - 100
    c.drawString(50, y_position, "Patient Information:")
    y_position -= 20
    for key, value in user_data.items():
        c.drawString(50, y_position, f"{key}: {value}")
        y_position -= 20

    # Convert lime_img to PIL image
    lime_img.seek(0)
    lime_pil_img = Image.open(lime_img)
    lime_temp_path = "lime_temp.png"
    lime_pil_img.save(lime_temp_path)

    c.drawString(50, y_position, "LIME Explanation Plot:")
    y_position -= 20
    c.drawImage(lime_temp_path, 50, y_position - 300, width=500, height=300)
    y_position -= 320

    # Convert pie_chart_img to PIL image
    pie_chart_img.seek(0)
    pie_pil_img = Image.open(pie_chart_img)
    pie_temp_path = "pie_temp.png"
    pie_pil_img.save(pie_temp_path)

    c.drawString(50, y_position, "Gene Health Distribution Pie Chart:")
    y_position -= 20
    c.drawImage(pie_temp_path, 50, y_position - 300, width=500, height=300)

    c.save()
    buffer.seek(0)

    # Cleanup temporary files
    os.remove(lime_temp_path)
    os.remove(pie_temp_path)

    return buffer


@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    existing_user = mongo.db.users.find_one({'email': data['email']})
    if existing_user:
        return jsonify({"message": "Email already exists"}), 400
    
    hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
    new_user = {
        'name': data['name'],
        'age': data['age'],
        'blood_group': data['bloodGroup'],
        'email': data['email'],
        'password': hashed_password
    }
    mongo.db.users.insert_one(new_user)
    return jsonify({"message": "User registered successfully"}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = mongo.db.users.find_one({'email': data['email']})
    if user and bcrypt.check_password_hash(user['password'], data['password']):
        access_token = create_access_token(identity=str(user['_id']))
        return jsonify(access_token=access_token), 200
    return jsonify({"message": "Invalid credentials"}), 401

@app.route('/assessment', methods=['POST'])
@jwt_required()
def submit_assessment():
    user_id = get_jwt_identity()
    data = request.get_json()
    
    assessment_data = {
        'user_id': ObjectId(user_id),
        **data
    }
    mongo.db.assessments.insert_one(assessment_data)

    user = mongo.db.users.find_one({'_id': ObjectId(user_id)})
    user_data = {
        "Name": user['name'],
        "Age": user['age'],
        "Blood Group": user['blood_group'],
        **data
    }

    X, y = generate_dummy_data()
    model = RandomForestClassifier(n_estimators=10)
    model.fit(X, y)

    feature_names = [f"Feature {i}" for i in range(20)]
    lime_img = create_lime_explanation(model, X, feature_names)
    pie_chart_img = create_gene_health_pie_chart([25, 50, 25])

    pdf_buffer = generate_pdf(user_data, lime_img, pie_chart_img)

    return send_file(
        pdf_buffer,
        as_attachment=True,
        download_name='health_report.pdf',
        mimetype='application/pdf'
    )

if __name__ == '__main__':
    app.run(debug=True)


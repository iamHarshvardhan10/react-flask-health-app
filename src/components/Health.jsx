import { useState } from "react";
import axios from "axios";

const Health = () => {
  const [formData, setFormData] = useState({
    family_history_cancer: "",
    genetic_test: "",
    family_health_conditions: "",
    diet: "",
    smoking_habit: "",
    exercise_frequency: "",
    sun_exposure: "",
    weight: "Healthy",
    genetic_mutations: "",
    pollution_exposure: "",
    unusual_growths: "",
    doctor_visits: "",
    unusual_symptoms: "",
    medications: "",
    allergies: "",
  });

  const handleChange = (e) => {
    if (e.target.type === "radio") {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    } else if (e.target.type === "text") {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5000/assessment",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          responseType: "blob",
        }
      );

      const file = new Blob([response.data], { type: "application/pdf" });
      const fileURL = URL.createObjectURL(file);
      const fileLink = document.createElement("a");
      fileLink.href = fileURL;
      fileLink.download = "health_report.pdf";
      fileLink.click();
      URL.revokeObjectURL(fileURL);
      fileLink.remove();

      alert("Assessment submitted successfully and report generated!");
    } catch (error) {
      console.error("Error submitting assessment:", error);
      alert(
        "Error submitting assessment and generating report. Please try again."
      );
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800 p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-7xl">
        <h2 className="text-4xl font-bold text-center text-black mb-8">
          Health Assessment Form
        </h2>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <div className="flex flex-col">
            <label>
              Family History of Cancer or Genetic Diseases?
              <div className="mt-2 flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="family_history_cancer"
                    value="Yes"
                    checked={formData.family_history_cancer === "Yes"}
                    onChange={handleChange}
                  />{" "}
                  Yes
                </label>
                <label className="ml-4 flex items-center gap-2">
                  <input
                    type="radio"
                    name="family_history_cancer"
                    value="No"
                    checked={formData.family_history_cancer === "No"}
                    onChange={handleChange}
                  />{" "}
                  No
                </label>
              </div>
            </label>
          </div>
          <div className="flex flex-col">
            <label>
              Have you or anyone in your family had a genetic test?
              <div className="mt-2 flex items-center">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="genetic_test"
                    value="Yes"
                    checked={formData.genetic_test === "Yes"}
                    onChange={handleChange}
                  />{" "}
                  Yes
                </label>
                <label className="ml-4">
                  <input
                    type="radio"
                    name="genetic_test"
                    value="No"
                    checked={formData.genetic_test === "No"}
                    onChange={handleChange}
                  />{" "}
                  No
                </label>
              </div>
            </label>
          </div>
          <div className="flex flex-col col-span-1">
            <label className="flex flex-col">
              Family Health Conditions:
              <input
                type="text"
                name="family_health_conditions"
                value={formData.family_health_conditions}
                onChange={handleChange}
                className="p-2 border border-gray-300 rounded-md mt-2"
              />
            </label>
          </div>
          <div className="flex flex-col">
            <label>
              Do you eat a lot of unhealthy foods?
              <div className="mt-2">
                <label>
                  <input
                    type="radio"
                    name="diet"
                    value="Yes"
                    checked={formData.diet === "Yes"}
                    onChange={handleChange}
                  />{" "}
                  Yes
                </label>
                <label className="ml-4">
                  <input
                    type="radio"
                    name="diet"
                    value="No"
                    checked={formData.diet === "No"}
                    onChange={handleChange}
                  />{" "}
                  No
                </label>
              </div>
            </label>
          </div>
          <div className="flex flex-col">
            <label>
              Do you smoke or have you ever smoked?
              <div className="mt-2">
                <label>
                  <input
                    type="radio"
                    name="smoking_habit"
                    value="Yes"
                    checked={formData.smoking_habit === "Yes"}
                    onChange={handleChange}
                  />{" "}
                  Yes
                </label>
                <label className="ml-4">
                  <input
                    type="radio"
                    name="smoking_habit"
                    value="No"
                    checked={formData.smoking_habit === "No"}
                    onChange={handleChange}
                  />{" "}
                  No
                </label>
              </div>
            </label>
          </div>
          <div className="flex flex-col">
            <label>
              Exercise Frequency:
              <div className="mt-2">
                <label>
                  <input
                    type="radio"
                    name="exercise_frequency"
                    value="None"
                    checked={formData.exercise_frequency === "None"}
                    onChange={handleChange}
                  />{" "}
                  None
                </label>
                <label className="ml-4">
                  <input
                    type="radio"
                    name="exercise_frequency"
                    value="1-2 times"
                    checked={formData.exercise_frequency === "1-2 times"}
                    onChange={handleChange}
                  />{" "}
                  1-2 times
                </label>
                <label className="ml-4">
                  <input
                    type="radio"
                    name="exercise_frequency"
                    value="3-4 times"
                    checked={formData.exercise_frequency === "3-4 times"}
                    onChange={handleChange}
                  />{" "}
                  3-4 times
                </label>
                <label className="ml-4">
                  <input
                    type="radio"
                    name="exercise_frequency"
                    value="5 or more times"
                    checked={formData.exercise_frequency === "5 or more times"}
                    onChange={handleChange}
                  />{" "}
                  5 or more times
                </label>
              </div>
            </label>
          </div>
          <div className="flex flex-col">
            <label>
              Sun Exposure:
              <div className="mt-2">
                <label>
                  <input
                    type="radio"
                    name="sun_exposure"
                    value="Yes"
                    checked={formData.sun_exposure === "Yes"}
                    onChange={handleChange}
                  />{" "}
                  Yes
                </label>
                <label className="ml-4">
                  <input
                    type="radio"
                    name="sun_exposure"
                    value="No"
                    checked={formData.sun_exposure === "No"}
                    onChange={handleChange}
                  />{" "}
                  No
                </label>
              </div>
            </label>
          </div>
          <div className="flex flex-col">
            <label>
              Weight Status:
              <select
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                className="p-3 border border-gray-300 rounded-md mt-2"
              >
                <option value="Healthy">Healthy</option>
                <option value="Overweight">Overweight</option>
                <option value="Obese">Obese</option>
              </select>
            </label>
          </div>
          <div className="flex flex-col">
            <label>
              Genetic Mutations:
              <div className="mt-2">
                <label>
                  <input
                    type="radio"
                    name="genetic_mutations"
                    value="Yes"
                    checked={formData.genetic_mutations === "Yes"}
                    onChange={handleChange}
                  />{" "}
                  Yes
                </label>
                <label className="ml-4">
                  <input
                    type="radio"
                    name="genetic_mutations"
                    value="No"
                    checked={formData.genetic_mutations === "No"}
                    onChange={handleChange}
                  />{" "}
                  No
                </label>
              </div>
            </label>
          </div>
          <div className="flex flex-col">
            <label>
              Pollution Exposure:
              <div className="mt-2">
                <label>
                  <input
                    type="radio"
                    name="pollution_exposure"
                    value="Yes"
                    checked={formData.pollution_exposure === "Yes"}
                    onChange={handleChange}
                  />{" "}
                  Yes
                </label>
                <label className="ml-4">
                  <input
                    type="radio"
                    name="pollution_exposure"
                    value="No"
                    checked={formData.pollution_exposure === "No"}
                    onChange={handleChange}
                  />{" "}
                  No
                </label>
              </div>
            </label>
          </div>
          <div className="flex flex-col">
            <label>
              Unusual Growths:
              <div className="mt-2">
                <label>
                  <input
                    type="radio"
                    name="unusual_growths"
                    value="Yes"
                    checked={formData.unusual_growths === "Yes"}
                    onChange={handleChange}
                  />{" "}
                  Yes
                </label>
                <label className="ml-4">
                  <input
                    type="radio"
                    name="unusual_growths"
                    value="No"
                    checked={formData.unusual_growths === "No"}
                    onChange={handleChange}
                  />{" "}
                  No
                </label>
              </div>
            </label>
          </div>
          <div className="flex flex-col">
            <label>
              Doctor Visits in the Last Year:
              <input
                type="text"
                name="doctor_visits"
                value={formData.doctor_visits}
                onChange={handleChange}
                className="p-3 border border-gray-300 rounded-md mt-2"
              />
            </label>
          </div>
          <div className="flex flex-col">
            <label className="flex flex-col">
              Any Unusual Symptoms:
              <input
                type="text"
                name="unusual_symptoms"
                value={formData.unusual_symptoms}
                onChange={handleChange}
                className="p-3 border border-gray-300 rounded-md mt-2"
              />
            </label>
          </div>
          <div className="flex flex-col">
            <label className="flex flex-col">
              Current Medications:
              <input
                type="text"
                name="medications"
                value={formData.medications}
                onChange={handleChange}
                className="p-3 border border-gray-300 rounded-md mt-2"
              />
            </label>
          </div>
          <div className="flex flex-col">
            <label className="flex flex-col">
              Any Known Allergies:
              <input
                type="text"
                name="allergies"
                value={formData.allergies}
                onChange={handleChange}
                className="p-3 border border-gray-300 rounded-md mt-2"
              />
            </label>
          </div>
          <div className="flex items-center">
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded-lg text-xl font-semibold hover:bg-blue-700"
            >
              Submit Assessment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Health;

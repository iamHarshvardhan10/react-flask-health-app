import { BrowserRouter, Route, Routes } from "react-router-dom";
import Health from "./components/Health";
import Register from "./components/Register";
import Login from "./components/Login";
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/health" element={<Health />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;

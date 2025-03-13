import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import EmployeeDashboard from "./pages/listarEmpleados/lista";
import EmployeeHours from "./pages/horasEmpleado/horas";
import "./pages/listarEmpleados/style.css";

function App() {
  return (
    <Router>
      <div className="app-container">
        <nav>
          <ul>
            <li><Link to="/">Dashboard</Link></li>
            <li><Link to="/horas">Registro de Horas</Link></li>
          </ul>
        </nav>
        <Routes>
          <Route path="/" element={<EmployeeDashboard />} />
          <Route path="/horas" element={<EmployeeHours />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;


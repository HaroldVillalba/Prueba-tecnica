import React, { useState, useEffect } from "react";
import employeeData from "../../employees.json";
import calculateHours  from "../../components/horas/hoursCalculation";
import calculateSalary  from "../../components/horas/salaryCalculation";
import "./horas.css";

const EmployeeHours = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [hoursSummary, setHoursSummary] = useState(null);
  const [salarySummary, setSalarySummary] = useState(null);

  useEffect(() => {
    if (employeeData.status === 200 && Array.isArray(employeeData.data)) {
      setEmployees(employeeData.data);
    }
  }, []);

  const handleEmployeeChange = (e) => {
    const employeeId = Number(e.target.value);
    const employee = employees.find(emp => Number(emp.id) === employeeId);

    if (!employee) {
      console.error("Empleado no encontrado con ID:", employeeId);
      return;
    }

    setSelectedEmployee(employee);

    const hoursData = calculateHours(employee);
    setHoursSummary(hoursData);

    if (hoursData) {
      const salaryData = calculateSalary(employee, hoursData);
      setSalarySummary(salaryData);
    }
  };

  return (
    <div className="hours-container">
      <h1>Registro de Horas Trabajadas</h1>
      <select onChange={handleEmployeeChange}>
        <option value="">Selecciona un empleado</option>
        {employees.map((emp) => (
          <option key={emp.id} value={emp.id}>
            {emp.attributes.first_name} {emp.attributes.last_name}
          </option>
        ))}
      </select>

      {selectedEmployee && hoursSummary && salarySummary && (
        <div className="summary">
          <h2>{selectedEmployee.attributes.first_name} {selectedEmployee.attributes.last_name}</h2>
          <p><strong>Horas trabajadas:</strong> {hoursSummary.totalWorkedHours.toFixed(2)}</p>
          <p><strong>Horas semanales establecidas:</strong> {hoursSummary.maxWeeklyHours}</p>
          <h3>Clasificación de horas extras:</h3>
          <ul>
            {Object.entries(hoursSummary.extraHours).map(([key, value]) => (
              <li key={key} className={`extra-${key}`}>
                {key}: {value.toFixed(2)} horas
              </li>
            ))}
          </ul>
          <h3>Salario estimado:</h3>
          <p><strong>Base:</strong> ${salarySummary.baseSalary.toFixed(2)}</p>
          <p><strong>Pago de horas extra:</strong> ${salarySummary.extraPay.toFixed(2)}</p>
          <p><strong>Total:</strong> ${salarySummary.totalSalary.toFixed(2)}</p>
        </div>
      )}
    </div>
  );
};

export default EmployeeHours;
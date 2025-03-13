import React from "react";
import WorkSchedule from "./detallesTurno";
import AccessRecords from "./registro";

const EmployeeDetails = ({ employee, weeklyHours }) => {
  return (
    <tr className="expanded-row">
      <td colSpan="6">
        <div className="expanded-content">
          <h3>📌 Información Personal</h3>
          <p><strong>Correo:</strong> {employee.attributes.email}</p>
          <p><strong>Teléfono:</strong> {employee.attributes.phone}</p>

          <WorkSchedule workshift={employee.relationships.workshifts[0]} />
          <AccessRecords employee={employee} weeklyHours={weeklyHours} />
        </div>
      </td>
    </tr>
  );
};

export default EmployeeDetails;
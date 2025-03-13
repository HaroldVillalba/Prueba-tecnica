import React from "react";

const WorkshiftSchedule = ({ workshiftDays }) => {
  if (!workshiftDays || workshiftDays.length === 0) {
    return <p>No hay horarios asignados.</p>;
  }

  return (
    <div>
      <h4>📅 Horarios de Trabajo</h4>
      <table className="schedule-table">
        <thead>
          <tr>
            <th>Día</th>
            <th>Entrada</th>
            <th>Salida</th>
          </tr>
        </thead>
        <tbody>
          {workshiftDays.map((day) => (
            <tr key={day.id}>
              <td>{["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"][day.attributes.day]}</td>
              <td>{day.attributes.start_at}</td>
              <td>{day.attributes.finished_at}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default WorkshiftSchedule;

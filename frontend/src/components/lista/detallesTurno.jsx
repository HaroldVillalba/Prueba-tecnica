import React from "react";

const WorkSchedule = ({ workshift }) => {
  if (!workshift) return <p>No hay horario asignado.</p>;

  const workshiftDays = workshift.relationships?.workshiftDays || [];

  return (
    <>
      <h3>🕒 Detalles del Turno</h3>
      <p><strong>Nombre:</strong> {workshift.attributes.name || "No asignado"}</p>
      <p><strong>Horas Semanales:</strong> {workshift.attributes.maximun_weekly_hours || "-"}</p>

      {workshiftDays.length > 0 && (
        <>
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
        </>
      )}
    </>
  );
};

export default WorkSchedule;

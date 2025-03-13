import React from "react";

const formatWorkedTime = (checkIn, checkOut, isPartTime) => {
  if (!checkOut) return "-";

  const diffInMinutes = (new Date(checkOut) - new Date(checkIn)) / (1000 * 60);
  const hours = diffInMinutes / 60;
  const roundedHours = (diffInMinutes % 60 < 45) ? Math.floor(hours) : Math.ceil(hours);

  // Si el empleado es de medio tiempo, no aplica reducción
  if (isPartTime) {
    return `${roundedHours}h`;
  }

  // Si trabaja 8 horas o más, se reducen 2 horas (excepto medio tiempo)
  return roundedHours >= 8 ? `${roundedHours - 2}h` : `${roundedHours}h`;
};



const formatHours = (totalHours) => {
  const horas = Math.floor(totalHours);
  const minutes = Math.round((totalHours - horas) * 60);
  if (minutes>=45){
    const hours = Math.ceil(totalHours);
    return `${hours}h`;
  }
  if (minutes<45){
    const hours = Math.floor(totalHours);
    return `${hours}h`;
  }
};

const AccessRecords = ({ employee, weeklyHours }) => {
  const accessRecords = employee.relationships?.accessControls || [];

  return (
      <div className="access-table-container">
      {accessRecords.length > 0 ? (
      <table className="access-table">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Entrada</th>
            <th>Salida</th>
            <th>Horas Trabajadas</th>
            <th>Horas Semana</th>
          </tr>
        </thead>
        <tbody>
          {accessRecords.map((record) => {
            const date = new Date(record.attributes.check_in);
            const day = date.getDay();
            const monday = new Date(date);
            monday.setDate(date.getDate() - day + (day === 0 ? -6 : 1));
            monday.setHours(0, 0, 0, 0);
            const weekKey = monday.getTime();
            const isSunday = day === 0;

            return (
              <tr key={record.id}>
                <td>{record.attributes.check_in.split(" ")[0]}</td>
                <td>{record.attributes.check_in.split(" ")[1]}</td>
                <td>{record.attributes.check_out ? record.attributes.check_out.split(" ")[1] : "-"}</td>
                <td>{formatWorkedTime(record.attributes.check_in, record.attributes.check_out)}</td>
                <td>{isSunday ? formatHours(weeklyHours[employee.id]?.[weekKey] || 0) : ""}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    ) : (
      <p>No hay registros de acceso.</p>
    )}

      </div>
  );
};

export default AccessRecords;

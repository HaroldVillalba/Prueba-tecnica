import React from "react";

const EmployeeRow = ({ employee, expandedRows, toggleExpandRow }) => {
    if (!employee) return null; // 🚨 Si `employee` es undefined, evitamos un error
  
    const fullName = `${employee.attributes?.first_name || ""} ${employee.attributes?.last_name || ""}`;
    const workshift = employee.relationships?.workshifts?.[0]?.attributes || {};
    const accessRecords = employee.relationships?.accessControls || [];
  
    return (
      <React.Fragment>
        <tr>
          <td>{employee.id || "-"}</td>
          <td>{fullName}</td>
          <td>{employee.attributes?.charge || "-"}</td>
          <td>${employee.attributes?.salary?.toLocaleString() || "0"}</td>
          <td>{workshift.name || "No asignado"}</td>
          <td>
            <button onClick={() => toggleExpandRow(employee.id)}>
              {expandedRows[employee.id] ? "Ocultar" : "Mostrar"} detalles
            </button>
          </td>
        </tr>
  
        {expandedRows[employee.id] && (
          <tr className="expanded-row">
            <td colSpan="6">
              <div className="expanded-content">
                <h3>📌 Información Personal</h3>
                <p><strong>Correo:</strong> {employee.attributes?.email || "No disponible"}</p>
                <p><strong>Teléfono:</strong> {employee.attributes?.phone || "No disponible"}</p>
  
                <h3>🛠 Registros de Acceso</h3>
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
                        const checkIn = record.attributes?.check_in || "";
                        const checkOut = record.attributes?.check_out || "";
                        return (
                          <tr key={record.id}>
                            <td>{checkIn.split(" ")[0]}</td>
                            <td>{checkIn.split(" ")[1] || "-"}</td>
                            <td>{checkOut ? checkOut.split(" ")[1] : "-"}</td>
                            <td>--</td>
                            <td>--</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                ) : (
                  <p>No hay registros de acceso.</p>
                )}
              </div>
            </td>
          </tr>
        )}
      </React.Fragment>
    );
  };
  
  export default EmployeeRow;
  
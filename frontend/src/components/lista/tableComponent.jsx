import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import EmployeeDetails from "./detallesEmpleado";

const EmployeeTable = ({ employees, expandedRows, toggleExpandRow, filters, setFilters, weeklyHours }) => {
  const [visibleFilters, setVisibleFilters] = useState({ id: false, name: false, charge: false, shift: false });

  const toggleFilterVisibility = (key) => {
    setVisibleFilters((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <table className="employee-table">
      <thead>
        <tr>
          <th>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              ID
              <FontAwesomeIcon icon={faSearch} onClick={() => toggleFilterVisibility("id")} style={{ cursor: "pointer" }} />
            </div>
            {visibleFilters.id && (
              <input
                type="text"
                placeholder="Buscar..."
                value={filters.id}
                onChange={(e) => setFilters({ ...filters, id: e.target.value })}
                style={{ width: "100%", maxWidth: "150px", boxSizing: "border-box", padding: "4px" }}
              />
            )}
          </th>

          <th>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              Nombre
              <FontAwesomeIcon icon={faSearch} onClick={() => toggleFilterVisibility("name")} style={{ cursor: "pointer" }} />
            </div>
            {visibleFilters.name && (
              <input
                type="text"
                placeholder="Buscar..."
                value={filters.name}
                onChange={(e) => setFilters({ ...filters, name: e.target.value })}
                style={{ width: "100%", maxWidth: "150px", boxSizing: "border-box", padding: "4px" }}
              />
            )}
          </th>

          <th>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              Puesto
              <FontAwesomeIcon icon={faSearch} onClick={() => toggleFilterVisibility("charge")} style={{ cursor: "pointer" }} />
            </div>
            {visibleFilters.charge && (
              <input
                type="text"
                placeholder="Buscar..."
                value={filters.charge}
                onChange={(e) => setFilters({ ...filters, charge: e.target.value })}
                style={{ width: "100%", maxWidth: "150px", boxSizing: "border-box", padding: "4px" }}
              />
            )}
          </th>

          <th>Salario</th>

          <th>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              Turno
              <FontAwesomeIcon icon={faSearch} onClick={() => toggleFilterVisibility("shift")} style={{ cursor: "pointer" }} />
            </div>
            {visibleFilters.shift && (
              <input
                type="text"
                placeholder="Buscar..."
                value={filters.shift}
                onChange={(e) => setFilters({ ...filters, shift: e.target.value })}
                style={{ width: "100%", maxWidth: "150px", boxSizing: "border-box", padding: "4px" }}
              />
            )}
          </th>

          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {employees.length > 0 ? (
          employees.map((employee) => (
            <React.Fragment key={employee.id}>
              <tr>
                <td>{employee.id}</td>
                <td>{`${employee.attributes.first_name} ${employee.attributes.last_name}`}</td>
                <td>{employee.attributes.charge}</td>
                <td>${employee.attributes.salary.toLocaleString()}</td>
                <td>{employee.relationships.workshifts[0]?.attributes?.name || "No asignado"}</td>
                <td>
                  <button onClick={() => toggleExpandRow(employee.id)}>
                    {expandedRows[employee.id] ? "Ocultar" : "Mostrar"} detalles
                  </button>
                </td>
              </tr>
              {expandedRows[employee.id] && (
                <tr>
                  <td colSpan="6">
                    <EmployeeDetails employee={employee} weeklyHours={weeklyHours} />
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))
        ) : (
          <tr>
            <td colSpan="6">No se encontraron empleados</td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default EmployeeTable;

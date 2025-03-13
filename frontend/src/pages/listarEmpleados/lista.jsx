import React, { useState, useEffect, useCallback } from "react";
import employeeData from "../../employees.json";
import EmployeeTable from "../../components/lista/tableComponent";
import "./style.css";

const EmployeeDashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [expandedRows, setExpandedRows] = useState({});
  const [weeklyHours, setWeeklyHours] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const employeesPerPage = 12;
  const [filters, setFilters] = useState({
    id: "",
    name: "",
    charge: "",
    salary: "",
    shift: "",
  });

  useEffect(() => {
    if (employeeData.status === 200 && Array.isArray(employeeData.data)) {
      setEmployees(employeeData.data);
    }
  }, []);

  const toggleExpandRow = (id) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const calculateWeeklyHours = useCallback(() => {
    const weeklyHoursMap = {};
    employees.forEach((employee) => {
      const accessRecords = employee.relationships?.accessControls || [];
      const weekMap = new Map();

      accessRecords.forEach((record) => {
        const checkIn = record.attributes?.check_in;
        const checkOut = record.attributes?.check_out;

        if (!checkIn || !checkOut) return;

        const date = new Date(checkIn);
        const day = date.getDay();
        const monday = new Date(date);
        monday.setDate(date.getDate() - day + (day === 0 ? -6 : 1));
        monday.setHours(0, 0, 0, 0);
        const weekKey = monday.getTime();

        if (!weekMap.has(weekKey)) {
          weekMap.set(weekKey, 0);
        }

        const diffInMinutes = (new Date(checkOut) - new Date(checkIn)) / (1000 * 60);
        weekMap.set(weekKey, weekMap.get(weekKey) + diffInMinutes / 60);
      });

      weeklyHoursMap[employee.id] = Object.fromEntries(weekMap);
    });

    setWeeklyHours(weeklyHoursMap);
  }, [employees]);

  useEffect(() => {
    calculateWeeklyHours();
  }, [calculateWeeklyHours]);

  // 🎯 Aplicar filtro antes de paginar
  const filteredEmployees = employees.filter((employee) => {
    if (!employee || !employee.attributes) return false;

    const fullName = `${employee.attributes.first_name} ${employee.attributes.last_name}`.toLowerCase();
    const charge = employee.attributes.charge ? employee.attributes.charge.toLowerCase() : "";
    const shift = employee.relationships.workshifts[0]?.attributes?.name?.toLowerCase() || "no asignado";
    const salary = employee.attributes.salary ? employee.attributes.salary.toString() : "";
    const id = employee.id ? employee.id.toString() : "";

    return (
      id.includes(filters.id) &&
      fullName.includes(filters.name.toLowerCase()) &&
      charge.includes(filters.charge.toLowerCase()) &&
      salary.includes(filters.salary) &&
      shift.includes(filters.shift.toLowerCase())
    );
  });

  // 🎯 Paginación después de filtrar
  const indexOfLastEmployee = currentPage * employeesPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
  const currentEmployees = filteredEmployees.slice(indexOfFirstEmployee, indexOfLastEmployee);

  return (
    <div className="dashboard-container">
      <h1>Lista de Empleados</h1>
      <EmployeeTable 
        employees={currentEmployees} 
        expandedRows={expandedRows} 
        toggleExpandRow={toggleExpandRow} 
        weeklyHours={weeklyHours}
        filters={filters}
        setFilters={setFilters} // 🎯 Pasamos los filtros al componente
      />

      <div className="pagination">
        {Array.from({ length: Math.ceil(filteredEmployees.length / employeesPerPage) }, (_, index) => (
          <button
            key={index}
            onClick={() => setCurrentPage(index + 1)}
            className={currentPage === index + 1 ? "active" : ""}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default EmployeeDashboard;

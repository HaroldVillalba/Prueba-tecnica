
const calculateSalary = (employee, totalWorkedHours) => {
  if (!employee || !employee.attributes || !totalWorkedHours) return null;

  const baseSalary = employee.attributes.salary;
  const workshift = employee.relationships.workshifts?.[0]?.attributes || {};
  const maxWeeklyHours = workshift.maximun_weekly_hours;
  const hourlyRate = baseSalary / (maxWeeklyHours*4);
  let extraPay = 0;

  const extraRates = {
    HED: 1.25, // 25%
    HEN: 1.75, // 75%
    HEDD: 2.0, // 100%
    HEDN: 2.5, // 150%
    RC: 1, // 35%
    RD: 1, // 75%
    RND: 1, // 110%
  };

  for (let key in extraRates) {
    extraPay += totalWorkedHours.extraHours[key] * hourlyRate * extraRates[key];
  }

  const totalSalary = (totalWorkedHours.totalWorkedHours * hourlyRate) + extraPay;

  return {
    baseSalary,
    extraPay,
    totalSalary,
  };
};

export default calculateSalary;

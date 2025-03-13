const calculateHours = (employee) => {
  if (!employee || !employee.relationships) {
    console.error("El empleado seleccionado no tiene datos válidos:", employee);
    return null;
  }

  const workshift = employee.relationships.workshifts?.[0]?.attributes || {};
  const maxWeeklyHours = workshift.maximun_weekly_hours || 0;
  const accessRecords = employee.relationships.accessControls || [];

  let totalWorkedHours = 0;
  let weeklyHoursMap = {};
  let extraHours = { HED: 0, HEN: 0, HEDD: 0, HEDN: 0, RC: 0, RD: 0, RND: 0 };

  const isSundayOrHoliday = (date) => {
    const day = date.getDay();
    return day === 0; // Domingo
    // Aquí podrías agregar más lógica para verificar festivos si tienes una lista
  };

  accessRecords.forEach((record) => {
    if (!record.attributes?.check_in || !record.attributes?.check_out) return;

    const checkIn = new Date(record.attributes.check_in);
    const checkOut = new Date(record.attributes.check_out);
    let workedHours = (checkOut - checkIn) / (1000 * 60 * 60); // Convierte a horas

    // Si es menor a 45 minutos, no se cuenta
    if (workedHours < 0.75) return;

    const dayKey = checkIn.toISOString().split("T")[0]; // Usa la fecha como clave

    // **Horario administrativo: restar 2 horas de almuerzo**
    if (workshift.schedule_type === "administrative") {
      if (checkIn.getHours() <= 12 && checkOut.getHours() >= 14) {
        workedHours -= 2;
      }
    }

    // **Horario flexible: restar 2 horas después de 9 horas trabajadas**
    if (workshift.schedule_type === "flexible" && workedHours > 9) {
      workedHours -= 2;
    }

    totalWorkedHours += workedHours;
    weeklyHoursMap[dayKey] = (weeklyHoursMap[dayKey] || 0) + workedHours;

    const checkInHour = checkIn.getHours();
    const checkOutHour = checkOut.getHours();
    const isSunday = isSundayOrHoliday(checkIn);

    // **Clasificación de Horas Extras**
    let extraDayHours = 0;
    let extraNightHours = 0;

    if (weeklyHoursMap[dayKey] > 8) {
      extraDayHours = Math.max(0, weeklyHoursMap[dayKey] - 8);
    }

    // **Horas nocturnas: entre 9:00 p.m. - 6:00 a.m.**
    let nightHours = 0;
    if (checkInHour < 6) {
      nightHours += Math.min(6 - checkInHour, workedHours);
    }
    if (checkOutHour >= 21) {
      nightHours += Math.min(checkOutHour - 21, workedHours);
    }

    extraNightHours = Math.min(extraDayHours, nightHours);
    extraDayHours -= extraNightHours; // Restamos las que ya contamos como nocturnas

    // **Asignar a la categoría correcta**
    if (isSunday) {
      extraHours.HEDD += extraDayHours;
      extraHours.HEDN += extraNightHours;
    } else {
      extraHours.HED += extraDayHours;
      extraHours.HEN += extraNightHours;
    }

    // **Recargos**
    if (nightHours > 0) {
      extraHours.RC += nightHours * 0.35;
      if (isSunday) {
        extraHours.RND += nightHours * 1.1;
      }
    }
    if (isSunday) {
      extraHours.RD += workedHours * 0.75;
    }
  });

  return {
    totalWorkedHours,
    maxWeeklyHours,
    extraHours,
  };
};

export default calculateHours;

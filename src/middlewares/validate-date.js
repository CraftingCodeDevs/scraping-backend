const validateDate = async (req = request, res = response, next) => {
  let { day, month, year } = req.body;

  day = parseInt(day);
  month = parseInt(month);
  year = parseInt(year);

  switch (month) {
    case 1:
      validateDays(res, day, 31);
      break;
    case 2:
      if (year % 4 === 0) {
        validateDays(res, day, 29);
      } else {
        validateDays(res, day, 28);
      }
      break;
    case 3:
      validateDays(res, day, 31);
      break;
    case 4:
      validateDays(res, day, 30);
      break;
    case 5:
      validateDays(res, day, 31);
      break;
    case 6:
      validateDays(res, day, 30);
      break;
    case 7:
      validateDays(res, day, 31);
      break;
    case 8:
      validateDays(res, day, 31);
      break;
    case 9:
      validateDays(res, day, 30);
      break;
    case 10:
      validateDays(res, day, 31);
      break;
    case 11:
      validateDays(res, day, 30);
      break;
    case 12:
      validateDays(res, day, 31);
      break;
    default:
      return res.status(400).json({
        status: 400,
        error: 'Invalid month'
      });
  }
  next();
};

const validateDays = (res, day, limit) => {
  if (day > limit) {
    return res.status(400).json({
      status: 400,
      error: `Invalid day ${day} for selected month`,
    });
  }
};

module.exports = {
  validateDate,
};
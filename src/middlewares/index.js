const validate = require('./validate');
const validateJWT = require('./validate-jwt');
const validateLogin = require('./validate-login');
const validateRoles = require('./validate-roles');
const validateDate = require('./validate-date');

module.exports = {
    ...validate,
    ...validateJWT,
    ...validateLogin,
    ...validateRoles,
    ...validateDate
};
const { Role, Company, User } = require('../database/mongo/index');

const isValidRole = async (_id = '') => {
    const roleExists = await Role.findById({ _id });
    if (!roleExists) {
        throw new Error(`The ${_id} role is not registered`);
    }
}

const isValidCompany = async (_id = '') => {
    const companyExists = await Company.findById({ _id });
    if (!companyExists) {
        throw new Error(`The ${_id} company is not registered`);
    }
}

const isValidUser = async (_id = '') => {
    const userExists = await User.findById({ _id });
    if (!userExists) {
        throw new Error(`The ${_id} user is not registered`);
    }
}

module.exports = {
    isValidRole,
    isValidCompany,
    isValidUser
}
const { response, request } = require("express");
const roles = ['ADMIN_ROLE', 'USER_ROLE'];

const isAdminRole = (req = request, res = response, next) => {
    if (!req.user) {
        return res.status(500).json({
            msg: 'The token must be validated - talk to the administrator admin'
        });
    }
    const { role, name } = req.user;
    if (role.name !== 'ADMIN_ROLE') {
        return res.status(401).json({
            msg: `${name} is not an administrator, permission denied`
        });
    }

    next();

}

const hasAnyRole = (req = request, res = response, next) => {
    if (!req.user) {
        return res.status(500).json({
            msg: 'The token must be validated - talk to the administrator'
        });
    }
    if (!roles.includes(req.user.role.name)) {
        return res.status(401).json({
            msg: `This endpoint requires a valid role ${roles}`
        });
    }
    next();
}

module.exports = {
    isAdminRole,
    hasAnyRole
}
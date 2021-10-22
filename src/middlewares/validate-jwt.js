const { response, request } = require('express');
const jwt = require('jsonwebtoken');

const { User } = require('../database/mongo/index');

const validateJWT = async (req = request, res = response, next) => {
    const token = req.header('token');

    if (!token) {
        return res.status(401).json({
            message: 'The request does not have a token'
        });
    }

    try {
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        const user = await User.findById(uid).populate('role', 'name').populate('company');

        //Usuario existe?
        if (!user) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        if (!user.status) {
            return res.status(401).json({ message: 'Invalid token - talk to the administrator' });
        }
        if(!user.company.status){
            return res.status(401).json({ message: 'Invalid token - company inactive' });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error(error);
        return res.status(401).json({
            message: 'Invalid token'
        });
    }

};


module.exports = {
    validateJWT
};
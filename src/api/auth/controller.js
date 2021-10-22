
const { request } = require("express");

const { User } = require('../../database/mongo/index');
const { generateJWT } = require('../../utils/generate-jwt');


const login = async (req = request) => {
    const { user } = req;
    //Generar JWT
    const token = await generateJWT(user._id);

    return {
        user,
        token
    };
};

const tokenRenew = async (req = request) => {
    const { usuario } = req;
    //Generar JWT
    const token = await generateJWT(usuario.uid);

    return {
        usuario,
        token
    };
};

module.exports = {
    login,
    tokenRenew
};
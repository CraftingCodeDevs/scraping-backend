const { response, request } = require("express");
const bycriptjs = require('bcryptjs');

const {User} = require('../database/mongo/index');
//const { generateJWT } = require('../utils/generate-jwt');

const validateLogin = async (req = request, res = response, next) => {
    const { email, password } = req.body;

    try {
        //Verificar si el email existe
        const user = await User.findOne({ email })
        .populate('role', 'name')
        .populate('company');

        if (!user) {
            return res.status(400).json({
                msg: 'invalid username or password'
            });
        }

        //Verificar si el usuario esta activo
        if (!user.status) {
            return res.status(400).json({
                msg: 'invalid username or password'
            });
        }
        //Verificar la contraseña
        const isValidPassword = bycriptjs.compareSync(password, user.password);
        if (!isValidPassword) {
            return res.status(400).json({
                msg: 'invalid username or password'
            });
        }
        
        //Verficar si la compañia esta activa
        if (!user.company.status) {
            return res.status(400).json({
                msg: 'invalid username or password'
            });
        }

        req.user = user;
        next();


    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Algo salio mal, comuniquese con el administrador" });
    }

}

module.exports = {
    validateLogin
}
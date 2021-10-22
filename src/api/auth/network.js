const express = require('express');

const { err, success } = require('../../network/response');
const router = express.Router();
const controller = require('./controller');
const { validateLogin, validateJWT } = require('../../middlewares/index');

router.post('/login', validateLogin, login);
router.get('/', validateJWT, tokenRenew);

async function login(req, res) {
    try {
        const result = await controller.login(req);
        success(req, res, result, 200);
    } catch (error) {
        console.error(error);
        err(req, res, error, 500, 'Internal server error, contact the administrator');
    }
}

async function tokenRenew(req, res) {
    try {
        const result = await controller.tokenRenew(req);
        success(req, res, result, 200);
    } catch (error) {
        console.error(error);
        err(req, res, error, 500, 'Internal server error, contact the administrator');
    }
}

module.exports = router;
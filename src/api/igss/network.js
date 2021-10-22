const express = require('express');
const { check } = require('express-validator');
const timeout = require('connect-timeout');

const { err, success } = require('../../network/response');
const router = express.Router();
const controller = require('./controller');
const { validateJWT, validate, validateDate } = require('../../middlewares');
const { getLastOne, sortArray } = require('../../helpers/sort-array');

function haltOnTimeout(req, res, next) {
    if (!req.timedout) next();
}

router.post('/', [
    timeout('160s'),
    validateJWT,
    check('name', 'El nombre es requerido').notEmpty(),
    check('dpi', 'El dpi es requerido').notEmpty().isLength({ min: 13, max: 13 }),
    check('day', 'El dia es requerido y debe ser texto').notEmpty().isString(),
    check('month', 'El mes es requerido y debe ser texto').notEmpty().isString(),
    check('year', 'El año es requerido y debe ser texto').notEmpty().isString(),
    validateDate,
    validate,
    haltOnTimeout,],
    AllContributions);

router.post('/last-contribution', [
    timeout('160s'),
    validateJWT,
    check('name', 'El nombre es requerido').notEmpty(),
    check('dpi', 'El dpi es requerido').notEmpty().isLength({ min: 13, max: 13 }),
    check('day', 'El dia es requerido y debe ser texto').notEmpty().isString(),
    check('month', 'El mes es requerido y debe ser texto').notEmpty().isString(),
    check('year', 'El año es requerido y debe ser texto').notEmpty().isString(),
    validateDate,
    validate,
    haltOnTimeout,],
    lastContribution);

async function AllContributions(req, res) {
    try {

        if (req.body.day === '22') req.body.day = '222';
        const result = await controller.scrapingIgss(req.body);
        result.contribuciones = sortArray(result.contribuciones);
        success(req, res, result, 200);
    } catch (error) {
        console.error(error);
        err(req, res, {
            name: req.body.name,
            dpi: req.body.dpi,
            data: [{
                noPatronal: "n/a",
                patrono: "Afiliado, sin informacion que mostrar.",
                nombreComercial: "n/a",
                contribuciones: "n/a",
                aporte: "n/a",
            }]
        }, 500, 'Error interno, comuniquese con el administrador');
    }
}

async function lastContribution(req, res) {
    try {
        if (req.body.day === '22') req.body.day = '222';
        const { name, dpi, data } = await controller.scrapingIgss(req.body);
        const lastOne = getLastOne(data);
        success(req, res, { name, dpi, data: lastOne }, 200);
    } catch (error) {
        console.error(error);
        err(req, res, {
            name: req.body.name,
            dpi: req.body.dpi,
            data: {
                noPatronal: "n/a",
                patrono: "Afiliado, sin informacion que mostrar.",
                nombreComercial: "n/a",
                contribuciones: "n/a",
                aporte: "n/a",
            }
        }, 500, 'Error interno, comuniquese con el administrador');
    }
}

module.exports = router;
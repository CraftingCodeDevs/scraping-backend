const express = require('express');
const { check } = require('express-validator');

const { err, success } = require('../../network/response');
const { isValidUser, isValidCompany, isValidRole } = require('../../utils/db-validators');
const { validateJWT, validate, isAdminRole } = require('../../middlewares')
const router = express.Router();
const controller = require('./controller');

router.get('/', [
    validateJWT,
    isAdminRole,
], getUsers);

router.get('/:id', [
    validateJWT,
    isAdminRole,
    check('id', 'Invalid id').notEmpty().isMongoId().custom(isValidUser),
    validate
], getUser);

router.post('/', [
    validateJWT,
    isAdminRole,
    check('name', 'Name is required').notEmpty(),
    check('email', 'Email is required').notEmpty().isEmail(),
    check('password', 'Insecure password').notEmpty().isLength({ min: 9 }),
    check('role', 'invalid role').custom(isValidRole),
    check('company', 'invalid company').custom(isValidCompany),
    validate
], postUser);

router.put('/:id', [
    validateJWT,
    isAdminRole,
    check('id', 'Invalid id').notEmpty().isMongoId().custom(isValidUser),
    check('email', 'Email is required').optional().isEmail(),
    check('password', 'Insecure password').optional().isLength({ min: 9 }),
    check('role', 'invalid role').optional().custom(isValidRole),
    check('company', 'invalid company').optional().custom(isValidCompany),
    validate
], updateUser);

router.delete('/:id', [
    validateJWT,
    isAdminRole,
    check('id', 'Invalid id').notEmpty().isMongoId().custom(isValidUser),
    validate
], deleteUser);


async function getUsers(req, res) {
    try {
        const result = await controller.get(req);
        success(req, res, result, 200);
    } catch (error) {
        console.error(error);
        err(req, res, error, 500, 'Internal server error, contact the administrator');
    }
}

async function getUser(req, res) {
    try {
        const result = await controller.getOne(req);
        success(req, res, result, 200);
    } catch (error) {
        console.error(error);
        err(req, res, error, 500, 'Internal server error, contact the administrator');
    }
}

async function postUser(req, res) {
    try {
        const result = await controller.post(req);
        success(req, res, result, 200);
    } catch (error) {
        console.error(error);
        err(req, res, error, 500, 'Internal server error, contact the administrator');
    }
}

async function updateUser(req, res) {
    try {
        const result = await controller.put(req);
        success(req, res, result, 200);
    } catch (error) {
        console.error(error);
        err(req, res, error, 500, 'Internal server error, contact the administrator');
    }
}

async function deleteUser(req, res) {
    try {
        const result = await controller.remove(req);
        success(req, res, result, 200);
    } catch (error) {
        console.error(error);
        err(req, res, error, 500, 'Internal server error, contact the administrator');
    }
}

module.exports = router;
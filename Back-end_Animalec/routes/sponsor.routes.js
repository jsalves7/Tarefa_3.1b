const express = require('express');
let router = express.Router();
const SponsorController = require('../controllers/sponsor.controller');
const {
    body,
    param
} = require('express-validator');
const AuthController = require("../controllers/auth.controller");

const URL_OPTIONS = {
    protocols: ['http', 'https'],
    require_protocol: true
};

const validators = [
    body('name').isString().not().isEmpty(),
    body('type').optional({ checkFalsy: true }).isIn(['empresa', 'instituicao', 'particular']),
    body('email').isEmail(),
    body('website').optional({ checkFalsy: true }).isURL(URL_OPTIONS),
    body('logo').optional({ checkFalsy: true }).isURL(URL_OPTIONS),
    body('description').optional().isString(),
    body('since').optional({ checkFalsy: true }).isISO8601(),
    body('animals').optional().isArray(),
    body('animals.*').isMongoId()
];

router.route('/')
    .get(AuthController.checkAuth, SponsorController.get)
    .post(AuthController.checkAuth, validators, SponsorController.create);

router.route("/deactivate/:id")
    .put(AuthController.checkAuth, [param("id").isMongoId()], SponsorController.deactivate);

router.route("/activate/:id")
    .put(AuthController.checkAuth, [param("id").isMongoId()], SponsorController.activate);

router.route('/:id')
    .get(AuthController.checkAuth, [param("id").isMongoId()], SponsorController.getOne)
    .put(AuthController.checkAuth, [param("id").isMongoId()].concat(validators), SponsorController.update)
    .delete(AuthController.checkAuth, [param("id").isMongoId()], SponsorController.delete);

module.exports = router;

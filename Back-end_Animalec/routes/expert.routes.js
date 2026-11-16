const express = require('express');
let router = express.Router();
const ExpertController = require('../controllers/expert.controller');
const {
    body,
    param
} = require('express-validator');
const AuthController = require("../controllers/auth.controller");

const GROUPS = ['anfibio', 'ave', 'mamifero', 'peixe', 'reptil'];
const URL_OPTIONS = {
    protocols: ['http', 'https'],
    require_protocol: true
};

const validators = [
    // valores em array passariam nos validadores seguintes e falhariam no Mongoose (500)
    body(['name', 'title', 'institution', 'email', 'website', 'photo', 'bio']).custom(value => !Array.isArray(value)).withMessage('Valor inválido'),
    body('name').isString().not().isEmpty(),
    body('title').optional().isString(),
    body('institution').optional().isString(),
    body('email').isEmail(),
    body('website').optional({ checkFalsy: true }).isURL(URL_OPTIONS),
    body('photo').optional({ checkFalsy: true }).isURL(URL_OPTIONS),
    body('bio').optional().isString(),
    body('specialization.groups').optional().isArray(),
    body('specialization.groups.*').isString().isIn(GROUPS),
    body('specialization.animals').optional().isArray(),
    body('specialization.animals.*').isString().isMongoId()
];

router.route('/')
    .get(AuthController.checkAuth, ExpertController.get)
    .post(AuthController.checkAuth, validators, ExpertController.create);

router.route("/deactivate/:id")
    .put(AuthController.checkAuth, [param("id").isMongoId()], ExpertController.deactivate);

router.route("/activate/:id")
    .put(AuthController.checkAuth, [param("id").isMongoId()], ExpertController.activate);

router.route('/:id')
    .get(AuthController.checkAuth, [param("id").isMongoId()], ExpertController.getOne)
    .put(AuthController.checkAuth, [param("id").isMongoId()].concat(validators), ExpertController.update)
    .delete(AuthController.checkAuth, [param("id").isMongoId()], ExpertController.delete);

module.exports = router;

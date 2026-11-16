const Expert = require('../models/expert.model');
const Animal = require('../models/animal.model');
const {
    validationResult
} = require('express-validator');
const ExpertMessages = require("../messages/expert.messages");

const FIELDS = ["name", "title", "institution", "email", "website", "photo", "bio"];
const INTERNAL_ERROR = { http: 500, code: "InternalError", type: "error" };
const POPULATE = ["specialization.animals", "name group"];

// Devolve uma cópia da mensagem com o corpo, para não partilhar estado entre pedidos
const withBody = (message, body) => Object.assign({}, message, { body });

// Só os campos do modelo são aceites (evita atualizar _id, __v ou operadores)
const pickFields = (body) => {
    let data = {};
    FIELDS.forEach(field => {
        if (body[field] !== undefined) data[field] = body[field];
    });
    if (body.specialization) {
        const groups = body.specialization.groups || [];
        const animals = body.specialization.animals || [];
        data.specialization = {
            groups: [...new Set(groups)],
            animals: [...new Set(animals.map(String))]
        };
    }
    return data;
};

// Regra de negócio: todos os animais associados têm de existir
const animalsExist = (ids, callback) => {
    if (!ids || ids.length === 0) return callback(null, true);
    Animal.countDocuments({
        _id: {
            $in: ids
        }
    }, (error, count) => callback(error, count === ids.length));
};

// Valida as regras de negócio e devolve a mensagem de erro (ou null se estiver tudo bem)
const checkBusinessRules = (data, callback) => {
    const spec = data.specialization;
    if (!spec || spec.groups.length + spec.animals.length === 0)
        return callback(null, ExpertMessages.error.e2);
    animalsExist(spec.animals, (error, exist) => {
        if (error) return callback(error);
        return callback(null, exist ? null : ExpertMessages.error.e1);
    });
};

exports.get = (req, res) => {
    Expert.find({}).populate(...POPULATE).exec((error, experts) => {
        if (error) return res.status(500).send(INTERNAL_ERROR);
        let message = withBody(ExpertMessages.success.s2, experts);
        return res.status(message.http).send(message);
    });
}

exports.getOne = (req, res) => {
    const errors = validationResult(req).array();
    if (errors.length > 0) return res.status(406).send(errors);

    Expert.findOne({
        _id: req.params.id
    }).populate(...POPULATE).exec((error, expert) => {
        if (error) return res.status(500).send(INTERNAL_ERROR);
        if (!expert) return res.status(ExpertMessages.error.e0.http).send(ExpertMessages.error.e0);
        let message = withBody(ExpertMessages.success.s2, expert);
        return res.status(message.http).send(message);
    });
}

exports.create = (req, res) => {
    const errors = validationResult(req).array();
    if (errors.length > 0) return res.status(406).send(errors);

    const data = pickFields(req.body);
    checkBusinessRules(data, (error, rule) => {
        if (error) return res.status(500).send(INTERNAL_ERROR);
        if (rule) return res.status(rule.http).send(rule);

        new Expert(data).save((error, expert) => {
            if (error) return res.status(500).send(INTERNAL_ERROR);
            let message = withBody(ExpertMessages.success.s0, expert);
            return res.header("location", "/experts/" + expert._id).status(message.http).send(message);
        });
    });
}

exports.update = (req, res) => {
    const errors = validationResult(req).array();
    if (errors.length > 0) return res.status(406).send(errors);

    const data = pickFields(req.body);
    checkBusinessRules(data, (error, rule) => {
        if (error) return res.status(500).send(INTERNAL_ERROR);
        if (rule) return res.status(rule.http).send(rule);

        Expert.findOneAndUpdate({
            _id: req.params.id
        }, {
            $set: data
        }, {
            new: true
        }).populate(...POPULATE).exec((error, expert) => {
            if (error) return res.status(500).send(INTERNAL_ERROR);
            if (!expert) return res.status(ExpertMessages.error.e0.http).send(ExpertMessages.error.e0);
            let message = withBody(ExpertMessages.success.s1, expert);
            return res.status(message.http).send(message);
        });
    });
}

exports.delete = (req, res) => {
    const errors = validationResult(req).array();
    if (errors.length > 0) return res.status(406).send(errors);

    Expert.deleteOne({
        _id: req.params.id
    }, (error, result) => {
        if (error) return res.status(500).send(INTERNAL_ERROR);
        if (result.deletedCount <= 0) return res.status(ExpertMessages.error.e0.http).send(ExpertMessages.error.e0);
        return res.status(ExpertMessages.success.s3.http).send(ExpertMessages.success.s3);
    });
}

const setActive = (active, successMessage) => (req, res) => {
    const errors = validationResult(req).array();
    if (errors.length > 0) return res.status(406).send(errors);

    Expert.updateOne({
        _id: req.params.id
    }, {
        $set: {
            active: active
        }
    }, (error, result) => {
        if (error) return res.status(500).send(INTERNAL_ERROR);
        if (result.n <= 0) return res.status(ExpertMessages.error.e0.http).send(ExpertMessages.error.e0);
        return res.status(successMessage.http).send(successMessage);
    });
}

exports.activate = setActive(true, ExpertMessages.success.s5);
exports.deactivate = setActive(false, ExpertMessages.success.s4);

// Vista pública: só registos ativos e campos não sensíveis (sem email)
exports.getByAnimal = (req, res) => {
    const errors = validationResult(req).array();
    if (errors.length > 0) return res.status(406).send(errors);

    Expert.find({
        "specialization.animals": req.params.id,
        active: true
    }).select("name title institution photo website").exec((error, experts) => {
        if (error) return res.status(500).send(INTERNAL_ERROR);
        let message = withBody(ExpertMessages.success.s2, experts);
        return res.status(message.http).send(message);
    });
}

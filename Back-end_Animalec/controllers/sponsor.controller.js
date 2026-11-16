const Sponsor = require('../models/sponsor.model');
const Animal = require('../models/animal.model');
const {
    validationResult
} = require('express-validator');
const SponsorMessages = require("../messages/sponsor.messages");

const FIELDS = ["name", "type", "email", "website", "logo", "description", "animals", "since"];
const INTERNAL_ERROR = { http: 500, code: "InternalError", type: "error" };

// Devolve uma cópia da mensagem com o corpo, para não partilhar estado entre pedidos
const withBody = (message, body) => Object.assign({}, message, { body });

// Só os campos do modelo são aceites (evita atualizar _id, __v ou operadores)
const pickFields = (body) => {
    let data = {};
    FIELDS.forEach(field => {
        if (body[field] !== undefined) data[field] = body[field];
    });
    // o formulário envia "" quando não há tipo ou data
    if (data.type === "") delete data.type;
    if (data.since === "") delete data.since;
    if (data.animals) data.animals = [...new Set(data.animals.map(String))];
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

exports.get = (req, res) => {
    Sponsor.find({}).populate("animals", "name group").exec((error, sponsors) => {
        if (error) return res.status(500).send(INTERNAL_ERROR);
        let message = withBody(SponsorMessages.success.s2, sponsors);
        return res.status(message.http).send(message);
    });
}

exports.getOne = (req, res) => {
    const errors = validationResult(req).array();
    if (errors.length > 0) return res.status(406).send(errors);

    Sponsor.findOne({
        _id: req.params.id
    }).populate("animals", "name group").exec((error, sponsor) => {
        if (error) return res.status(500).send(INTERNAL_ERROR);
        if (!sponsor) return res.status(SponsorMessages.error.e0.http).send(SponsorMessages.error.e0);
        let message = withBody(SponsorMessages.success.s2, sponsor);
        return res.status(message.http).send(message);
    });
}

exports.create = (req, res) => {
    const errors = validationResult(req).array();
    if (errors.length > 0) return res.status(406).send(errors);

    const data = pickFields(req.body);
    animalsExist(data.animals, (error, exist) => {
        if (error) return res.status(500).send(INTERNAL_ERROR);
        if (!exist) return res.status(SponsorMessages.error.e1.http).send(SponsorMessages.error.e1);

        new Sponsor(data).save((error, sponsor) => {
            if (error) return res.status(500).send(INTERNAL_ERROR);
            let message = withBody(SponsorMessages.success.s0, sponsor);
            return res.header("location", "/sponsors/" + sponsor._id).status(message.http).send(message);
        });
    });
}

exports.update = (req, res) => {
    const errors = validationResult(req).array();
    if (errors.length > 0) return res.status(406).send(errors);

    const data = pickFields(req.body);
    const changes = { $set: data };
    // tipo ou data vazios limpam o campo
    const unset = {};
    if (req.body.type === "") unset.type = 1;
    if (req.body.since === "") unset.since = 1;
    if (Object.keys(unset).length > 0) changes.$unset = unset;
    animalsExist(data.animals, (error, exist) => {
        if (error) return res.status(500).send(INTERNAL_ERROR);
        if (!exist) return res.status(SponsorMessages.error.e1.http).send(SponsorMessages.error.e1);

        Sponsor.findOneAndUpdate({
            _id: req.params.id
        }, changes, {
            new: true
        }).populate("animals", "name group").exec((error, sponsor) => {
            if (error) return res.status(500).send(INTERNAL_ERROR);
            if (!sponsor) return res.status(SponsorMessages.error.e0.http).send(SponsorMessages.error.e0);
            let message = withBody(SponsorMessages.success.s1, sponsor);
            return res.status(message.http).send(message);
        });
    });
}

exports.delete = (req, res) => {
    const errors = validationResult(req).array();
    if (errors.length > 0) return res.status(406).send(errors);

    Sponsor.deleteOne({
        _id: req.params.id
    }, (error, result) => {
        if (error) return res.status(500).send(INTERNAL_ERROR);
        if (result.deletedCount <= 0) return res.status(SponsorMessages.error.e0.http).send(SponsorMessages.error.e0);
        return res.status(SponsorMessages.success.s3.http).send(SponsorMessages.success.s3);
    });
}

const setActive = (active, successMessage) => (req, res) => {
    const errors = validationResult(req).array();
    if (errors.length > 0) return res.status(406).send(errors);

    Sponsor.updateOne({
        _id: req.params.id
    }, {
        $set: {
            active: active
        }
    }, (error, result) => {
        if (error) return res.status(500).send(INTERNAL_ERROR);
        if (result.n <= 0) return res.status(SponsorMessages.error.e0.http).send(SponsorMessages.error.e0);
        return res.status(successMessage.http).send(successMessage);
    });
}

exports.activate = setActive(true, SponsorMessages.success.s5);
exports.deactivate = setActive(false, SponsorMessages.success.s4);

// Vista pública: só registos ativos e campos não sensíveis (sem email)
exports.getByAnimal = (req, res) => {
    const errors = validationResult(req).array();
    if (errors.length > 0) return res.status(406).send(errors);

    Sponsor.find({
        animals: req.params.id,
        active: true
    }).select("name type logo website").exec((error, sponsors) => {
        if (error) return res.status(500).send(INTERNAL_ERROR);
        let message = withBody(SponsorMessages.success.s2, sponsors);
        return res.status(message.http).send(message);
    });
}

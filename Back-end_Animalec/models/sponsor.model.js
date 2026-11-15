const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const CONFIG = require('../config/config');

const sponsorSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['empresa', 'instituicao', 'particular']
    },
    email: {
        type: String,
        required: true
    },
    website: String,
    logo: String,
    description: String,
    animals: [{
        type: Schema.Types.ObjectId,
        ref: CONFIG.mongodb.collections.animal
    }],
    since: Date,
    active: {
        type: Boolean,
        default: true
    }
});

module.exports = global.mongoConnection.model(CONFIG.mongodb.collections.sponsor, sponsorSchema);

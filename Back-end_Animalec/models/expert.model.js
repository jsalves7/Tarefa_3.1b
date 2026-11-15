const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const CONFIG = require('../config/config');

const expertSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    title: String,
    institution: String,
    email: {
        type: String,
        required: true
    },
    website: String,
    photo: String,
    bio: String,
    specialization: {
        groups: [String],
        animals: [{
            type: Schema.Types.ObjectId,
            ref: CONFIG.mongodb.collections.animal
        }]
    },
    active: {
        type: Boolean,
        default: true
    }
});

module.exports = global.mongoConnection.model(CONFIG.mongodb.collections.expert, expertSchema);

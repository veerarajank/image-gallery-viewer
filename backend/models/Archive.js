const mongoose = require('mongoose');
const archiveSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    imgCollection: String
}, {
    collection: 'Archives'
})
module.exports = mongoose.model('Archive', archiveSchema)
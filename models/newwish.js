const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const ListSchema = new Schema({

    name: String,
    items: [{
        type: Schema.Types.ObjectId,
        ref: 'Wishlist'
    }],
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    authorID: String,
    date: {
        type: Date,
        default:Date.now
    }

})

module.exports = mongoose.model('List', ListSchema);
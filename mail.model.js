const mongoose = require('mongoose');


mongoose.set('useCreateIndex', true);

const mailSchema = mongoose.Schema({
    date: {
        type: Date
    },
    subject: {
        type: String
    },
    from: {
        type: String
    },
    to: {
        type: String
    }
});


module.exports = mongoose.model('mail', mailSchema);
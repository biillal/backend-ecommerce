const mongoose = require('mongoose');

const database = () => {
    try {
        mongoose.connect(process.env.URL)
        console.log('database connection');
    } catch (error) {
        console.log(error);
    }
}

module.exports = database
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//create a scheme for products to let user know what products they can buy
//show in the main page
var schema = new Schema({
    imagePath: {type: String, required: true},
    title: {type: String, required: true},
    description: {type: String, required: true},
    price: {type: Number, required: true}
});

module.exports = mongoose.model('Product', schema);

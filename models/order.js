var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//create a schema for order that make user can review what product bought in the past
//show in the My Order List page
var schema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    cart: {type: Object, required: true},
    address: {type: String, required: true},
    name: {type: String, required: true},
    paymentId: {type: String, required: true}
});

module.exports = mongoose.model('Order', schema);

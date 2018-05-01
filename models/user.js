var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

//create a schema for user information
//show in User Account page
var userSchema = new Schema({
    email: {type: String, required: true},
    password: {type: String, required: true},
    nickname: {type: String, required: true},
    surname: {type: String, required: true},
    lastname: {type: String, required: true}
});

//function to check if the sign up password is valid
userSchema.methods.encryptPassword = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);
};

//function to check if the sign in password is valid
userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', userSchema);

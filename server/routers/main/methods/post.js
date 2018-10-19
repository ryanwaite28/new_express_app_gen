'use strict';

const bcrypt = require('bcrypt-nodejs');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const models = require('../../../models').models;
const chamber = require('../../../chamber');
const templateEngine = require('../../../templateEngine');
const google = require('../../../firebase_config/index');



/* --- POST Functions --- */

function sign_up(request, response) {
  (async function() {
    if(request.session.id) { return response.json({ error: true, message: "Client already signed in" }) }

    var { fname, mname, lname, email, password, password_verify } = request.body;
    if(email) { email = email.toLowerCase(); }

    if(!fname) {
      return response.json({ error: true, message: 'First Name field is required' });
    }
    if(!mname) {
      return response.json({ error: true, message: 'Middle Name field is required' });
    }
    if(!lname) {
      return response.json({ error: true, message: 'Last Name field is required' });
    }
    if(!email) {
      return response.json({ error: true, message: 'Email Address field is required' });
    }
    if(!password) {
      return response.json({ error: true, message: 'Password field is required' });
    }
    if(!password_verify) {
      return response.json({ error: true, message: 'Password Confirmation field is required' });
    }

    if(!chamber.validateName(fname)) {
      return response.json({ error: true, message: 'First name must be letters only, 2-50 characters long' });
    }
    if(!chamber.validateName(mname)) {
      return response.json({ error: true, message: 'Middle name must be letters only, 2-50 characters long' });
    }
    if(!chamber.validateName(lname)) {
      return response.json({ error: true, message: 'Last name must be letters only, 2-50 characters long' });
    }

    if(!chamber.validateEmail(email)) {
      return response.json({ error: true, message: 'Email is invalid' });
    }
    if(!chamber.validatePassword(password)) {
      return response.json({
        error: true,
        message: 'Password must be: at least 7 characters, upper and/or lower case alphanumeric'
      });
    }
    if(password !== password_verify) {
      return response.json({ error: true, message: 'Passwords must match' });
    }

    var check_email = await models.Users.findOne({ where: { email } });
    if(check_email) {
      return response.json({ error: true, message: 'Email already in use' });
    }

    /* Data Is Valid */

    password = bcrypt.hashSync(password);
    let new_user = await models.Users.create({ fname, mname, lname, email, password });
    let user = new_user.dataValues;
    delete user['password'];
    request.session.id = chamber.uniqueValue();
    request.session.you = user;

    return response.json({ session_id: request.session.id, online: true, user, message: 'Signed Up!' });
  })()
}


/*  Exports  */

module.exports = {
  sign_up
}

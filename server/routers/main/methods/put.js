'use strict';

const bcrypt = require('bcrypt-nodejs');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const models = require('../../../models').models;
const chamber = require('../../../chamber');
const templateEngine = require('../../../templateEngine');
const google = require('../../../firebase_config/index');



/* --- PUT Functions --- */



function sign_in(request, response) {
  (async function() {
    if(request.session.id) { return response.json({ error: true, message: "Client already signed in" }) }
    let { email, password } = request.body;
    if(email) { email = email.toLowerCase(); }
    if(!email) {
      return response.json({ error: true, message: 'Email Address field is required' });
    }
    if(!chamber.validateEmail(email)) {
      return response.json({ error: true, message: 'Email is invalid' });
    }
    if(!password) {
      return response.json({ error: true, message: 'Password field is required' });
    }
    var check_account = await models.Users.findOne({ where: { email } });
    if(!check_account) {
      return response.json({ error: true, message: 'Invalid credentials.' });
    }
    if(bcrypt.compareSync(password, check_account.dataValues.password) === false) {
      return response.json({ error: true, message: 'Invalid credentials.' });
    }
    var user = check_account.dataValues;
    delete user['password'];
    request.session.id = chamber.uniqueValue();
    request.session.you = user;
    return response.json({ session_id: request.session.id, online: true, user, message: 'Signed In!' });
  })()
}

function sign_out(request, response) {
  request.session.reset();
  return response.json({ online: false, successful: true });
}


/*  Account Handlers  */

function update_icon(request, response) {
  let icon_image = request.files && request.files.icon_image || null;
  if(!icon_image) {
    return response.json({ error: true, message: 'no file with name \"icon_image\" found...' });
  }
  let allowed = ['jpeg', 'jpg', 'png'];
  let type = icon_image.mimetype.split('/')[1];
  if(!allowed.includes(type)) {
    return response.json({ error: true, message: 'invalid file type: jpg or png required...' });
  }
  google.upload_chain(icon_image, request.session.you.icon)
  .then(res => {
    console.log(res);
    models.Users.update({icon: res.link}, {where: { id: request.session.you.id }});
    request.session.you.icon = res.link;
    return response.json({ link: res.link, user: request.session.you, message: 'Icon updated!' });
  })
  .catch(err => {
    console.log('err', err);
    return response.json({ error: true, message: 'could not upload...' });
  });
}

function change_user_password(request, response) {
  let { old_password, new_password, new_password_verify } = request.body;
  if(!old_password) {
    return response.json({ error: true, message: 'Old Password field is required' });
  }
  if(!new_password) {
    return response.json({ error: true, message: 'New Password field is required' });
  }
  if(!new_password_verify) {
    return response.json({ error: true, message: 'New Password Confirmation field is required' });
  }
  if(!chamber.validatePassword(new_password)) {
    return response.json({
      error: true,
      message: 'New Password must be: at least 7 characters, upper and/or lower case alphanumeric'
    });
  }
  if(new_password !== new_password_verify) {
    return response.json({ error: true, message: 'New Passwords must match' });
  }
  models.Users.findOne({ where: { id: request.session.you.id } })
  .then(account => {
    if(bcrypt.compareSync(old_password, account.dataValues.password) === false) {
      return response.json({
        error: true,
        message: 'Old Password is incorrect'
      });
    }
    models.Users.update({ password: bcrypt.hashSync(new_password) }, { where: { id: request.session.you.id } })
    .then(resp => {
      return response.json({
        message: 'Password updated successfully!'
      });
    })
    .catch(err => {
      console.log('err', err);
      return response.json({ error: true, message: 'could not upload...' });
    });
  })
  .catch(err => {
    console.log('err', err);
    return response.json({ error: true, message: 'could not upload...' });
  });
}




/* --- Exports --- */

module.exports = {
  sign_out,
  sign_in,
  update_icon,
  change_user_password
}

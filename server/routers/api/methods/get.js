'use strict';

const bcrypt = require('bcrypt-nodejs');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const models = require('../../../models').models;
const chamber = require('../../../chamber');



/* --- GET Functions --- */

function get_method(request, response) {
  
}





/* --- Exports --- */

module.exports = {
  get_method,
}

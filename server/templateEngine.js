'use strict';

const nunjucks = require('nunjucks');
const chamber = require('./chamber');

function installExpressApp(app) {
  nunjucks.configure( chamber.paths['html'] , {
    autoescape: true,
    express: app
  });
}

/* --- Functions --- */

function test_dom(user_field) {
  return nunjucks.render('templates/test_dom.html', { user_field });
}

/* --- Exports --- */

module.exports = {
  installExpressApp,
  test_dom
}

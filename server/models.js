const Sequelize = require('sequelize');
const chamber = require('./chamber');


/* --- Production Database --- */

// const database_connect_string = "";
// const sequelize = new Sequelize(database_connect_string, {
//   dialect: 'postgres',
//   dialectOptions: {
//     ssl: true
//   }
// });



/* --- Development Database --- */

const sequelize = new Sequelize({
  password: null,
  dialect: 'sqlite',
  storage: 'database.sqlite',
});



/* --- Models --- */

let models = {};


models.Users = sequelize.define('users', {
  fname:           { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
  mname:           { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
  lname:           { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
  email:           { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
  password:        { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
  icon:            { type: Sequelize.STRING(500), allowNull: true, defaultValue: '' },
  verified:        { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
  certified:       { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
  unique_value:    { type: Sequelize.STRING, unique: true, defaultValue: chamber.uniqueValue }
}, { freezeTableName: true, indexes: [{ unique: true, fields: ['email', 'unique_value'] }] });

models.ResetPasswordRequests = sequelize.define('reset_password_requests', {
  user_email:      { type: Sequelize.INTEGER, allowNull: false, references: { model: models.Users, key: 'email' } },
  date_created:    { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
  unique_value:    { type: Sequelize.STRING, unique: true, defaultValue: chamber.greatUniqueValue }
}, { freezeTableName: true, indexes: [{ unique: true, fields: ['user_email', 'unique_value'] }] });





models.ApiKeys = sequelize.define('api_keys', {
  key:                 { type: Sequelize.STRING, unique: true, defaultValue: chamber.greatUniqueValue },
  firstname:           { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
  middlename:          { type: Sequelize.STRING, allowNull: true, defaultValue: '' },
  lastname:            { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
  email:               { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
  phone:               { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
  website:             { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
  verified:            { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
  date_created:        { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
  requests_count:      { type: Sequelize.INTEGER, defaultValue: 0 }
}, {
  freezeTableName: true,
  indexes: [{unique: true, fields: ['email', 'key'] }]
});


/* --- Initialize Database --- */

sequelize.sync({ force: false })
.then(() => { console.log('Database Initialized!'); })
.catch((error) => { console.log('Database Failed!', error); });


/* --- Exports --- */

module.exports = {
  sequelize,
  models
}

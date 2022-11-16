'use strict';
const {encrypt} =require("../criptografia")

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('usuarios', [
      { nome: 'John Doe', senha:encrypt('123'), usuario: 'doe' },
      { nome: 'Picolo', usuario: 'luiz', senha: encrypt('123') },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('usuarios', null, {});
  }
};

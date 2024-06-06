'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Users', [
      {
        email: 'farras@gmail.com',
        name: 'farras',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        email: 'khaliq@gmail.com',
        name: 'khaliq',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        email: 'nauval@gmail.com',
        name: 'nauval',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});

  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  }
};

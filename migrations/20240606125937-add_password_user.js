'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn(
      'Users',
      'password',
      {
        type: Sequelize.DataTypes.STRING,
      }
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Users', 'password');
  }
};

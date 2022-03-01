const sequelize = require('../config/dbconnection');
const { Time } = require('../models');


const userdata = [
    {
        time: '9:00'
    },
    {
        time: '10:00'
    },
    {
        time: '11:00'
    },
    {
        time: '12:00'
    },
    {
        time: '1:00'
    },
    {
        time: '2:00'
    },
    {
        time: '3:00'
    },
    {
        time: '4:00'
    },
    {
        time: '5:00'
    },
  ];
  
  const seedsTime = () => Time.bulkCreate(userdata);
  
  module.exports = seedsTime;
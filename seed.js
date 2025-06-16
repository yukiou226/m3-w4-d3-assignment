require('dotenv').config();
const mongoose = require('mongoose');
const Registration = require('./models/Registration');

mongoose.connect(process.env.DATABASE, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const seedData = [
  { name: 'Sheba', email: 'sheba@meow.com' },
  { name: 'booboo', email: 'boo@doggiemail.com' },
  { name: 'kittie', email: 'kit@meowland.com' },
  { name: 'pancho', email: 'panch@doggieland.com' },
  { name: 'pancho', email: 'pancho@doggieland.com' },
  { name: 'Mary Jane', email: 'maryjane@email.com' },
  
];

Registration.insertMany(seedData)
  .then(() => {
    console.log('Seeding successful');
    mongoose.connection.close();
  })
  .catch((err) => {
    console.error('Seeding error:', err);
  });

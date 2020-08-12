const fs = require('fs');
const mongoose = require('mongoose');
const User = require('../models/userModel');

// console.log(process.env.PHONE);

const DB = 'mongodb+srv://prashant:<password>@cluster0-yfpqt.mongodb.net/project1-app?retryWrites=true&w=majority'.replace('<password>', 'prashant21102001');

mongoose.connect(DB , {
    useNewUrlParser : true,
    useCreateIndex : true,
    useFindAndModify : false,
    useUnifiedTopology: true ,
}).then(() => console.log("DB connection successfull"));

// READ JSON FILE
const users = JSON.parse(fs.readFileSync(`./users.json`, 'utf-8'));

// IMPORT DATA INTO DB
const importData = async () => {
try {
    await User.create(users, { validateBeforeSave: false });

    console.log('Data successfully loaded!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// DELETE ALL DATA FROM DB
const deleteData = async () => {
    try {
        await User.deleteMany();
        console.log('Data successfully deleted!');
    } catch (err) {
        console.log(err);
    }
    process.exit();
};


if (process.argv[2] === '--import') {
    // console.log("test1");
    importData();
    // console.log("test2");
    
} else if (process.argv[2] === '--delete') {
    deleteData();
}

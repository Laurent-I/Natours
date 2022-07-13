const fs = require('fs'); 
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Tour=  require('./../../models/tourModel')

dotenv.config({ path: './config.env' });
// console.log(process.env)

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose.connect(DB, {
  useNewUrlParser: true,
  useCreateIndex: true,
  // useUnifiedTopology:true,
  useFindAndModify:false
})
.then(con => console.log('DB connection successfully established!'));

// READ JSON FILE
const tours= JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8'));

//IMPORT DATA INTO DB
const importData = async () => {
    try{
        await Tour.create(tours);
        console.log('Data successfully loaded');
    }catch(err){
        console.log(err);
    }
    process.exit();
}

//DELETE ALL DATA FROM DB;

const deleteData = async () =>{
    try{
        await Tour.deleteMany();
        console.log('Data deleted successfully');
    }catch(err){
        console.log(err)
    }
    process.exit();
}

if(process.argv[2]=== '--import'){
    importData();
}else if(process.argv[2]=== '--delete'){
    deleteData();
}

console.log(process.argv);
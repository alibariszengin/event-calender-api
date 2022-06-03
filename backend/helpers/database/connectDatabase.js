const mongoose = require('mongoose');

const connectDatabase = () => {

    //mongoose.set('useFindAndModify',false);
    //mongoose.set('useCreateIndex',true);
    //mongoose.set('useUnifiedTopology',true);
    mongoose.connect(process.env.MONGO_URI, {
        
    useNewUrlParser:true,
    //useFindAndModify: false,
    //useCreateIndex: true,
    useUnifiedTopology:true

    })
    .then(()=>{
        console.log("MongoDb Connection Successful")
    })
    .catch(err =>{
        console.error(err);
    })
}

module.exports = connectDatabase;
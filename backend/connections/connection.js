const mongoose = require('mongoose')
function connect() {
    mongoose.connect(process.env.MONGO_URL)
    .then(()=>{
        console.log("connnection successful")
    })
    .catch((err) => console.log(err))
}
mongoose.set('strictQuery', false);

module.exports = connect
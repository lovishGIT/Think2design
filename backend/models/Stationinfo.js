const mongoose  = require('mongoose');
// import validator from "validator";
const geocoder = require('./geocoder');
const stationSchema = new mongoose.Schema({
    ename :{
        type : String,
        require: true,
         
    },
    eaddress:{
        type : String,
        require: true,
        
    },
    city :{
        type : String,
        require: true,
        
    },
    state:{
        type:String,
        require:true
    },
    pincode:{
        type:String,
        require:true
    },
    location: {
        type: {
          type: String, // Don't do `{ location: { type: String } }`
          enum: ['Point'], // 'location.type' must be 'Point'
        },
        coordinates: {
          type: [Number],
          index: '2dsphere'
        },
        formattedAddress:String,
      },
    draft:{
        type:Boolean,
        require:true,
        default:false
    }
   
    // address : String
})

// we will create a new collection
// User is a colllection


stationSchema.pre('save',async function(next){
    const loc = await geocoder.geocode(this.eaddress)
    this.location = {
        type: 'POINT',
        coordinates: [loc[0].longitude,loc[0].latitude],
        formattedAddress:loc[0].formattedAddress
   
    }
    next();
})
const StationInfo = new mongoose.model('StationInfo',stationSchema);



module.exports =  StationInfo
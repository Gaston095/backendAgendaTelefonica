const mongoose = require("mongoose");
    
mongoose.set("strictQuery", false);

const url = process.env.MONGOBD_URI

mongoose.connect(url)
    .then(result => {
        console.log('Connected to MONGODB')
    })
    .catch(error => {
        console.log('error connecting to MONGODB', error.message)
    })
  
const personSchema = new mongoose.Schema({
   name: {
    type: String,
    minLength: [3, 'Must be at least 3 characters long'],
    required: true
   },
   number: {
    type: String,
    minLength: [8, 'Must be at least 8 characters long'],
    required: true
   },
});
  
  
personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
     returnedObject.id = returnedObject._id.toString()
     delete returnedObject._id
     delete returnedObject.__v
   }
})

module.exports = mongoose.model("Person", personSchema)
  
var mongoose = require('mongoose')
var ObjectId = mongoose.ObjectId;

// Define collection and schema for post item
var postingSchema = new mongoose.Schema({
  userID:{
    type: ObjectId
  },
  userName:{
    type: String
  },
  title: {
    type: String
  },
  content:{
    type: String
  },
  datePosted:{
    type: Date
  }
},
)

const Posting = mongoose.model('Posting', postingSchema);
module.exports = Posting;
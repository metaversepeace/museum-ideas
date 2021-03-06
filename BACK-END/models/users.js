const mongoose = require('mongoose')

let userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    exhibitTopics: [{ 
        type: String, 
        required: true }],
})
  
module.exports = mongoose.model('User', userSchema)
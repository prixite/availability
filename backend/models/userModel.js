const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const validator = require('validator')

const Schema = mongoose.Schema

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    userRole:{
        type: String,
        required: true
    },
    startTime:{
        type:String, default: ''
    },
    endTime:{
        type: String, default: ''
    },
    weekAvailableHours:{
      type: Number, default: 0
    },
    monthAvailableHours:{
      type: Number, default: 0
    },
    lastMessage:{
      type:String, default: ''
    }
}, {timestamps: true})

userSchema.statics.signup = async function(name, email, password, userRole, startTime, endTime) {

    if (!name || !email || !password || !userRole) {
        throw Error('All fields must be filled')
      }
      if (!validator.isEmail(email)) {
        throw Error('Email not valid')
      }
      if (!validator.isStrongPassword(password)) {
        throw Error('Password not strong enough')
      }    

    const exists = await this.findOne({ email })
  
    if (exists) {
      throw Error('Email already in use')
    }
  
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)
  
    const user = await this.create({ name, email, password: hash, userRole, startTime, endTime })
  
    return user
  }


  userSchema.statics.login = async function(email, password) {

    if (!email || !password) {
      throw Error('All fields must be filled')
    }
  
    const user = await this.findOne({ email })
    if (!user) {
      throw Error('Incorrect email')
    }
  
    const match = await bcrypt.compare(password, user.password)
    if (!match) {
      throw Error('Incorrect password')
    }
  
    return user
  }

module.exports = mongoose.model('User', userSchema)
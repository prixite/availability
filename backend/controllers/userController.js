const { default: mongoose } = require('mongoose')
const jwt = require('jsonwebtoken')
const User = require('../models/userModel')


const createToken = (_id) => {
    return jwt.sign({_id}, process.env.SECRET, { expiresIn: '1d' })
}


const getUsers = async (req, res) => { 
    const users = await User.find({}).sort({createdAt: -1})
    res.status(200).json(users)
}

const getUser = async (req, res) => {

    const {id} =  req.params

    if(!mongoose.Types.ObjectId.isValid(id)){ res.status(404).json({error: "No user found"})}

    const user = await User.findById(id)
    
    if(!user){ res.status(404).json({error: "No user found"})}

    res.status(200).json(user)

}

const setAvailability = async (req, res) => { 

    const {user_id} =  req.body

    if(!mongoose.Types.ObjectId.isValid(user_id)){ res.status(404).json({error: "No user found"})}

    const user = await User.findOneAndUpdate({_id:user_id}, {...req.body})

    if(!user){ res.status(404).json({error: "No user found"})}

    res.status(200).json(user)
}






const createUser = async (req, res) => {

    const {name, email, password, userRole, startTime, endTime} = req.body

    try{
        const user = await User.signup(name, email, password, userRole, startTime, endTime)
        const user_id = user._id
        const token = createToken(user._id)
        res.status(200).json({user_id, userRole, email, token})
    }
    catch(error){
        return res.status(400).json({error: error.message})
    }
}






const loginUser = async (req, res) => {

    const {email, password} = req.body

    try {
      const user = await User.login(email, password)
  
      // create a token
      const token = createToken(user._id)
      const user_id = user._id
      const userRole = user.userRole
  
      res.status(200).json({user_id, userRole, email, token})
    } catch (error) {
      res.status(400).json({error: error.message})
    }
    
}

module.exports = {
    getUsers,
    getUser,
    setAvailability,
    createUser,
    loginUser
}
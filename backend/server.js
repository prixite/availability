const { App } = require('@slack/bolt')
const cron = require('node-cron');
const User = require('./models/userModel')
require('dotenv').config()

const express = require ('express')
const mongoose = require ('mongoose')
const userroutes =  require ('./routes/users')

const app = express()

const app2 = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET
  });

  

// middleware which will run before sending response
app.use(express.json())
app.use((req, res, next)=>{
    console.log(req.path, req.method)
    next()
})

app.get('/', (req, res)=>{
    res.json({msg: 'Homepage'})
})

app.use('/user',userroutes)

mongoose.connect(process.env.MONGO_URI)
.then(async() => {
    app.listen(process.env.PORT, async ()=>{
        console.log('Connected to DB and listening on port', process.env.PORT)

    //await something()

    cron.schedule('*/1 * * * *', async () => {

        let allUsers = [];

        const result = await app2.client.users.list({
            token: process.env.SLACK_BOT_TOKEN
          });
    
           const dbusers = await User.find({})

           result.members.forEach( (member) => { 
            if(member.deleted === false && member.is_bot === false && member.is_email_confirmed === true)
            allUsers.push({
              "Name": member.real_name,
              "Email": member.profile.email,
              "Password": "Password@123",
              "userRole": (member.is_admin ? 'Admin' : 'Developer')
          })
        });

        const newUsersNo = allUsers.length - dbusers.length
        const newusers = allUsers.slice(-newUsersNo);
        console.log(newUsersNo)

        if (newUsersNo > 0) {
            newusers.forEach( async (member) => { 
                //await User.signup(member.real_name, member.profile.email, "Password@123", member.is_admin ? 'Admin' : 'Developer' )
                await User.signup(member.Name, member.Email, member.Password, member.userRole)
                console.log('User has been added to db')
            });
        }
        else {
        console.log('No new user has joined our workspace');}

    });
     
    })
    
})
.catch((err) => {console.log(err)})

var something = (function() {
    var executed = false;
    return async function() {
        if (!executed) {
            executed = true;
            const result = await app2.client.users.list({
                token: process.env.SLACK_BOT_TOKEN
              });
            
              result.members.forEach( async (member) => { 
                if(member.deleted === false && member.is_bot === false && member.is_email_confirmed === true)
                await User.signup(member.real_name, member.profile.email, "Password@123", member.is_admin ? 'Admin' : 'Developer' )
            });
        }
    };
})();
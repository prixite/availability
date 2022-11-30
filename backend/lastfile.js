const { App } = require('@slack/bolt')
const cron = require('node-cron');
const User = require('./models/userModel')
const userroutes =  require ('./routes/users')
const express = require ('express')
const mongoose = require ('mongoose')
const http = require('http');
require('dotenv').config()
const { createMessageAdapter } = require('@slack/interactive-messages');
const slackInteractions = createMessageAdapter(process.env.SLACK_SIGNING_SECRET);

// Both Apps
const expressapp = express()
const slackapp = new App({
    token: "xoxb-4293173167665-4277863248693-asASsd2lLhiki6mzxAR0gsPY",
    signingSecret: process.env.SLACK_SIGNING_SECRET
  });

// Middlewares
expressapp.use(express.json())
expressapp.use((req, res, next)=>{
    console.log(req.path, req.method)
    next()
})
expressapp.use('/user',userroutes)
expressapp.use('/slack/actions', slackInteractions.expressMiddleware());
expressapp.get('/', (req, res)=>{
    res.json({msg: 'Homepage'})
})

// Functions for sending messages, generating random number, finding differnece between message send and response time in minutes
const requestTime = new Date();

async function publishMessage(channelId) {
    try {
      const result = await slackapp.client.chat.postMessage({
        token: "xoxb-4293173167665-4277863248693-asASsd2lLhiki6mzxAR0gsPY",
        channel: channelId,
        text: "fallback text message",
        blocks: [
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": "Hi there. On which project you are working on?"
            }
          },
          {
            "dispatch_action": true,
            "type": "input",
            "element": {
              "type": "plain_text_input",
              "action_id": "plain_text_input-action"
            },
            "label": {
              "type": "plain_text",
              "text": "Let us know",
              "emoji": true
            }
          }
        ]
      });
      return requestTime;
    }
    catch (error) {
      console.error(error);
    }
  }

  function diff_minutes(dt2, dt1) 
  {
   var diff =(dt2 - dt1) / 1000;
   diff /= 60;
   return Math.abs(Math.round(diff));
  }

  function between(min, max) {  
    return Math.floor(
      Math.random() * (max - min) + min
    )
  }

mongoose.connect(process.env.MONGO_URI)
.then(async() => {

    http.createServer(expressapp).listen(process.env.PORT, async ()=>{


  let userChannelIds = [];

  const result = await slackapp.client.users.list({
    token: process.env.SLACK_BOT_TOKEN
  });

  result.members.forEach( (member) => { 
    if(member.deleted === false && member.is_bot === false && member.is_email_confirmed === true)
    userChannelIds.push(member.id)
});

        console.log('Connected to DB and listening on port', process.env.PORT)

    //await something()

    cron.schedule('*/1 * * * *', async () => {

        let allUsers = [];

        var timestamps = [];
    for(let i=0; i<userChannelIds.length; i++){
        timestamps.push(between(1, 60))
    }

        const result = await slackapp.client.users.list({
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

        console.log(timestamps)
    var count=0;
    var refreshId = setInterval(async function(){ 
        if(timestamps.includes(count)){
            const reqtime = await publishMessage(userChannelIds[timestamps.indexOf(count)]);
            slackInteractions.action({ actionId: 'plain_text_input-action' }, (payload, respond) => {
            const responseTime = new Date();
            console.log(`The user ${payload.user.username} is working on ${payload.actions[0].value} This hour will be marked: ${diff_minutes(responseTime,reqtime)<10?"Green":"Red"}`);
            
            respond({
              text: 'Thanks for letting us know'
            });
          
            });
            console.log('Message sent');
            count+=1;
        }
        else if(count===60){
            clearInterval(refreshId);
        }
        else{
            console.log(count)
            count+=1;
        }
    }, 1000);

    });
     
    })
    
})
.catch((err) => {console.log(err)})

var something = (function() {
    var executed = false;
    return async function() {
        if (!executed) {
            executed = true;
            const result = await slackapp.client.users.list({
                token: process.env.SLACK_BOT_TOKEN
              });
            
              result.members.forEach( async (member) => { 
                if(member.deleted === false && member.is_bot === false && member.is_email_confirmed === true)
                await User.signup(member.real_name, member.profile.email, "Password@123", member.is_admin ? 'Admin' : 'Developer' )
            });
        }
    };
})();


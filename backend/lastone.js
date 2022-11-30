const { App } = require('@slack/bolt')
require("dotenv").config();
const { createMessageAdapter } = require('@slack/interactive-messages');
const http = require('http');
const express = require('express');
const cron = require('node-cron');


const slackInteractions = createMessageAdapter(process.env.SLACK_SIGNING_SECRET);

const app = express();

const slackapp = new App({
  token: "xoxb-4293173167665-4277863248693-asASsd2lLhiki6mzxAR0gsPY",
  signingSecret: process.env.SLACK_SIGNING_SECRET
});

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

app.use('/slack/actions', slackInteractions.expressMiddleware());

const port = 3000;

http.createServer(app).listen(port, async() => {

  let userChannelIds = [];

  const result = await slackapp.client.users.list({
    token: process.env.SLACK_BOT_TOKEN
  });

  result.members.forEach( (member) => { 
    if(member.deleted === false && member.is_bot === false && member.is_email_confirmed === true)
    userChannelIds.push(member.id)
});

console.log(`server listening on port ${port}`);

  cron.schedule('*/1 * * * *', async () => {  

    var timestamps = [];
    for(let i=0; i<userChannelIds.length; i++){
        timestamps.push(between(1, 60))
    }

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
});
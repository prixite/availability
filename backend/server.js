require("dotenv").config();
const { App } = require("@slack/bolt");
const cron = require("node-cron");
const User = require("./models/userModel");
const userroutes = require("./routes/users");
const express = require("express");
const mongoose = require("mongoose");
const http = require("http");
const cors = require("cors");
const path = require("path");

const { createMessageAdapter } = require("@slack/interactive-messages");
const slackInteractions = createMessageAdapter(
  process.env.SLACK_SIGNING_SECRET
);

// Both Apps
const expressapp = express();
const slackapp = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
});

// Middlewares
expressapp.use(cors());

expressapp.use(express.json());

expressapp.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});
expressapp.use("/user", userroutes);
expressapp.use("/slack/actions", slackInteractions.expressMiddleware());

if (process.env.NODE_ENV === "production") {
  expressapp.use(express.static(path.join(__dirname, "static")));
  expressapp.use((req, res, next) => {
    res.sendFile(path.join(__dirname, "static", "index.html"));
  });
}

// Functions for sending messages, generating random number, finding differnece between message send and response time in minutes
const requestTime = new Date();

async function publishMessage(channelId) {
  try {
    const result = await slackapp.client.chat.postMessage({
      token: process.env.SLACK_BOT_TOKEN,
      channel: channelId,
      text: "fallback text message",
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: "Hi there. On which project you are working on?",
          },
        },
        {
          dispatch_action: true,
          type: "input",
          element: {
            type: "plain_text_input",
            action_id: "plain_text_input-action",
          },
          label: {
            type: "plain_text",
            text: "Let us know",
            emoji: true,
          },
        },
      ],
    });
    return requestTime;
  } catch (error) {
    console.error(error);
  }
}

function diff_minutes(dt2, dt1) {
  var diff = (dt2 - dt1) / 1000;
  diff /= 60;
  return Math.abs(Math.round(diff));
}

function between(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    http.createServer(expressapp).listen(process.env.PORT, async () => {
      let userChannelIds = [];

      const result = await slackapp.client.users.list({
        token: process.env.SLACK_USER_TOKEN,
      });

      result.members.forEach((member) => {
        if (
          member.deleted === false &&
          member.is_bot === false &&
          member.is_email_confirmed === true
        )
          userChannelIds.push(member.id);
      });

      console.log("Connected to DB and listening on port", process.env.PORT);

      //await something()

      cron.schedule("0 0 * * *", async () => {
        let allUsers = [];

        const result1 = await slackapp.client.users.list({
          token: process.env.SLACK_USER_TOKEN,
        });

        const dbusers = await User.find({});

        result1.members.forEach((member) => {
          if (
            member.deleted === false &&
            member.is_bot === false &&
            member.is_email_confirmed === true
          )
            allUsers.push({
              Name: member.real_name,
              Email: member.profile.email,
              Password: "Password@123",
              userRole: member.is_admin ? "Admin" : "Developer",
            });
        });

        const newUsersNo = allUsers.length - dbusers.length;
        const newusers = allUsers.slice(-newUsersNo);
        console.log(newUsersNo);

        if (newUsersNo > 0) {
          newusers.forEach(async (member) => {
            await User.signup(
              member.real_name,
              member.profile.email,
              "Password@123",
              member.is_admin ? "Admin" : "Developer"
            );
            await User.signup(
              member.Name,
              member.Email,
              member.Password,
              member.userRole
            );
            console.log("User has been added to db");
          });
        } else {
          console.log("No new user has joined our workspace");
        }

        cron.schedule("*/60 * * * *", async () => {
          const newUserIds = [];

          dbusers.map((user) => {
            const currentHour = new Date().getHours();

            if (user && user.startTime && user.endTime) {
              const startTime = user.startTime.split(":")[0];
              const endTime = user.endTime.split(":")[0];
              if (currentHour >= startTime && currentHour <= endTime) {
                console.log("Yes, the user is between startTime and endTime");
                newUserIds.push(user._id);
              } else {
                console.log(
                  "No, the user is not between startTime and endTime"
                );
              }
            } else {
              console.log("No startTime and endTime for this user");
            }
          });

          var timestamps = [];
          for (let i = 0; i < newUserIds.length; i++) {
            timestamps.push(between(1, 60));
          }

          console.log(timestamps);
          var count = 0;
          var refreshId = setInterval(async function () {
            if (timestamps.includes(count)) {
              const reqtime = await publishMessage(
                userChannelIds[timestamps.indexOf(count)]
              );
              slackInteractions.action(
                { actionId: "plain_text_input-action" },
                (payload, respond) => {
                  const responseTime = new Date();

                  console.log(
                    `The user ${payload.user.username} is working on ${
                      payload.actions[0].value
                    } This hour will be marked: ${
                      diff_minutes(responseTime, reqtime) < 10 ? "Green" : "Red"
                    }`
                  );

                  if (diff_minutes(responseTime, reqtime) < 10) {
                    User.weekAvailableHours = User.weekAvailableHours + 1;
                    User.monthAvailableHours = User.monthAvailableHours + 1;
                  }

                  User.lastMessage = payload.actions[0].value;

                  respond({
                    text: "Thanks for letting us know",
                  });
                }
              );
              console.log("Message sent");
              count += 1;
            } else if (count === 60) {
              clearInterval(refreshId);
            } else {
              console.log(count);
              count += 1;
            }
          }, 60000);
        });
      });
    });
  })
  .catch((err) => {
    console.log(err);
  });

var something = (function () {
  var executed = false;
  return async function () {
    if (!executed) {
      executed = true;
      const result = await slackapp.client.users.list({
        token: process.env.SLACK_USER_TOKEN,
      });

      result.members.forEach(async (member) => {
        if (
          member.deleted === false &&
          member.is_bot === false &&
          member.is_email_confirmed === true
        )
          await User.signup(
            member.real_name,
            member.profile.email,
            "Password@123",
            member.is_admin ? "Admin" : "Developer"
          );
      });
    }
  };
})();

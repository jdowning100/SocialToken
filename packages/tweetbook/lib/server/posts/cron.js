import { SyncedCron } from 'meteor/percolatestudio:synced-cron';
// import moment from 'moment';
import { Posts } from '../../modules/posts/index.js';
import Users from 'meteor/vulcan:users';
import { throwError } from 'ethers/errors';
var RedisSMQ = require("rsmq");
var rsmq = new RedisSMQ( {host: "127.0.0.1", port: 6379, ns: "rsmq"} );
var RSMQWorker = require( "rsmq-worker" );
var balanceWorker = new RSMQWorker("rsmq-getbalance", {interval: [1], invisibletime: 1})
var responseWorker = new RSMQWorker("rsmq-getresponse", {interval: [.1]})
const request = require('request');
var last = 0;
const { spawn } = require('child_process');
SyncedCron.options = {
  log: true,
  collectionName: 'cronHistory',
  utc: false,
  collectionTTL: 172800
};

const bound = Meteor.bindEnvironment((callback) => {callback();});

const addJob = function () {
  SyncedCron.add({
    name: 'checkUserBalances',
    schedule(parser) {
      return parser.text('every 10 seconds');
    },
    job() {
      let users = Users.find().fetch()
      for(let i of users){
        if(i.address != undefined){
          balanceWorker.send(JSON.stringify({address: i.address, userId: i._id}), (err, resp) => console.log("Message sent "+resp))
        }
        else{
          Users.update({ _id: i._id }, { $set: { 'balance': 0 } });
        }
        
      }
      }
  })
  
}



responseWorker.on("message", (msg, next, id) => {
  bound( () => {
  console.log(msg+ " " + id)
  let json = JSON.parse(msg)
  if(json.balance != undefined){
    
    Users.update({ _id: json.userId }, { $set: { 'balance': json.balance } });
    }
    next()
  })
})

Meteor.startup(function () {



  rsmq.createQueue({qname:"rsmq-newpost"}, function (err, resp) {
    if (resp===1) {
      console.log("Posts queue created")
    }
  });
  rsmq.createQueue({qname:"rsmq-newlike"}, function(err, resp){
    if (resp===1) {
      console.log("Likes queue created")
    }
  })
  rsmq.createQueue({qname:"rsmq-getbalance"}, function(err, resp){
    if (resp===1) {
      console.log("Balances queue created")
    }
  })
  rsmq.createQueue({qname:"rsmq-getresponse"}, function(err, resp){
    if (resp===1) {
      console.log("Response queue created")
    }
  })
  balanceWorker.start();
  responseWorker.start();


  addJob();

  Meteor.methods({
    'getUser'(userId){
      console.log("Returning "+Users.findOne(userId)+" for "+JSON.stringify(userId))
      return Users.findOne(userId);
     
    },
    'followUser'(userId, userIdToFollow){
      console.log(userId + " " + userIdToFollow)
      Users.update({ _id: userId }, { $addToSet: { 'following': userIdToFollow } });
      Users.update({ _id: userIdToFollow }, { $addToSet: { 'followers': userId } });
    },
    'unfollowUser'(userId, userIdToUnFollow){
      Users.update({ _id: userId }, { $pull: { 'following': userIdToUnFollow } });
      Users.update({ _id: userIdToUnFollow }, { $pull: { 'followers': userId } });
    },
    async 'getBalance'(userId, address){
      let user = {};
      if(userId != undefined){
        user = Users.findOne(userId);
      }
      else if(address != undefined){
        user.address = address;
      }
      else{throw new Error("getBalance params undefined")}

        
    
      
      return 0;
    },
    'getUserData'(userId){
      var user = Users.findOne(userId);
      if(user.services.twitter){
        return {accessToken: user.services.twitter.accessToken, accessTokenSecret: user.services.twitter.accessTokenSecret};
      }
    },


  })
});


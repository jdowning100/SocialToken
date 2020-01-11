/*

Voting callbacks

*/

import { Posts } from '../../../modules/posts/index.js';
import Users from 'meteor/vulcan:users';
import { addCallback } from 'meteor/vulcan:core';
import { performVoteServer } from 'meteor/vulcan:voting';
import { CryptoUtils, Client, LoomProvider } from 'loom-js'
import { inspect } from 'util'
const Web3 = require('web3')
var RedisSMQ = require("rsmq");
var rsmq = new RedisSMQ( {host: "127.0.0.1", port: 6379, ns: "rsmq"} );
const client = new Client('default','ws://127.0.0.1:46658/websocket','ws://127.0.0.1:46658/queryws',)
const web3 = new Web3(new LoomProvider(client, CryptoUtils.generatePrivateKey()))

/**
 * @summary Make users upvote their own new posts
 */
function PostsNewUpvoteOwnPost(post) {
  var postAuthor = Users.findOne(post.userId);
  return {...post, ...performVoteServer({ document: post, voteType: 'star', collection: Posts, user: postAuthor, updateDocument: true })};
}

//addCallback('posts.new.after', PostsNewUpvoteOwnPost);

function SendPostToChain(post) {
  console.log(post)
  var postAuthor = Users.findOne(post.userId)
  rsmq.sendMessage({qname:"rsmq-newpost", message: JSON.stringify(
    {
      post: post.body,
      postID: post._id,
      author: postAuthor,
  }
  )}, function (err, resp) {
    if (resp) {
      console.log("Message sent. ID:", resp);
    }
  });
}

addCallback('posts.new.async', SendPostToChain);


function CreateNewUser(user) {
  Users.update({ _id: user.data._id }, { $set: { 'postCount': 0, 'following': [], 'followers': [], 'balance': 0 } });
  console.log("User creation callback for user " + Users.findOne(user.data._id))

  let newAccount = web3.eth.accounts.create()
  const privateKey = newAccount.privateKey;
  const address = newAccount.address;
  Users.update(user.data._id, {
    $set: {
      address: address,
      privateKey: privateKey
    }
  });
  console.log(JSON.stringify(Users.findOne(user.data._id)))
}
addCallback('user.create.async', CreateNewUser)


function PostUpvoted(options){
  console.log("got an upvote")
  let authorOfPost = Users.findOne(options.document.userId)
  console.log(authorOfPost)
  rsmq.sendMessage({qname:"rsmq-newlike", message: JSON.stringify(
    {
      author: authorOfPost,
      postID: options.document._id,
      authorOfLike: options.user
  }
  )}, function (err, resp) {
    if (resp) {
      console.log("Message sent. ID:", resp);
    }
  });
}

addCallback("upvote.async", PostUpvoted);

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const {
  Address, Contracts, Client, LocalAddress, CryptoUtils, LoomProvider, OfflineWeb3Signer, createDefaultTxMiddleware, EvmContract, NonceTxMiddleware, SignedTxMiddleware, Contract
} = require('loom-js')
const { MapEntry } = require('./mapentry')
const { Message } = require('google-protobuf')
const ethutil = require('ethereumjs-util')
const Web3 = require('web3')
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var RSMQWorker = require( "rsmq-worker" );
var postsWorker = new RSMQWorker( "rsmq-newpost" );
var likesWorker = new RSMQWorker("rsmq-newlike")
var balanceWorker = new RSMQWorker("rsmq-getbalance", {interval: [1], invisibletime: 1})
var responseWorker = new RSMQWorker("rsmq-getresponse", {interval: [1], invisibletime: 1})
var app = express();
postsWorker.start()
likesWorker.start();
balanceWorker.start();
responseWorker.start();

process.on('unhandledRejection', (reason, p) => { console.log(JSON.stringify(reason)) });
const privateKey = CryptoUtils.B64ToUint8Array("dtVw8k4ZO34zCzNVOhQacnP+0tIStju9zrbvKAi+ERvYvSz0FNyuFrXmgYEX8hvGrg++amilcuxmSozGyAVvMw==")
const publicKey = CryptoUtils.publicKeyFromPrivateKey(privateKey)
const tokenContractAddress = '0x30cd623cfde4e91c2c8ab4a2e525a030802840ec'
const socialNetworkAddress = '0x8d448086ece175a209adb5de56404d358ab1ea85'
const client = new Client(
  'default',
  'ws://127.0.0.1:46658/websocket',
  'ws://127.0.0.1:46658/queryws',
  )
  client.txMiddleware = [
	  new NonceTxMiddleware(publicKey, client),
	  new SignedTxMiddleware(privateKey)
  ]
  const web3 = new Web3(new LoomProvider(client, privateKey))
  const from = LocalAddress.fromPublicKey(publicKey).toString()
  const socialNetwork = [
    {
      "constant": false,
      "inputs": [
        {
          "name": "post",
          "type": "string"
        },
        {
          "name": "postHash",
          "type": "bytes32"
        },
        {
          "name": "v",
          "type": "uint8"
        },
        {
          "name": "r",
          "type": "bytes32"
        },
        {
          "name": "s",
          "type": "bytes32"
        },
        {
          "name": "_user",
          "type": "address"
        },
        {
          "name": "sentFromBackend",
          "type": "bool"
        },
        {
          "name": "id",
          "type": "string"
        }
      ],
      "name": "submitPost",
      "outputs": [
        {
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "hash",
          "type": "bytes32"
        },
        {
          "name": "v",
          "type": "uint8"
        },
        {
          "name": "r",
          "type": "bytes32"
        },
        {
          "name": "s",
          "type": "bytes32"
        },
        {
          "name": "_user",
          "type": "address"
        },
        {
          "name": "sentFromBackend",
          "type": "bool"
        },
        {
          "name": "poster",
          "type": "address"
        },
        {
          "name": "id",
          "type": "string"
        }
      ],
      "name": "submitLike",
      "outputs": [
        {
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "",
          "type": "address"
        },
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "database",
      "outputs": [
        {
          "name": "post",
          "type": "string"
        },
        {
          "name": "likes",
          "type": "uint256"
        },
        {
          "name": "id",
          "type": "string"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "sender",
      "outputs": [
        {
          "name": "",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [],
      "name": "testSender",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "newRate",
          "type": "uint256"
        }
      ],
      "name": "changeRate",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "numPosts",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "addresses",
      "outputs": [
        {
          "name": "",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "token",
      "outputs": [
        {
          "name": "",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "name": "_token",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "name": "sender",
          "type": "address"
        }
      ],
      "name": "newSender",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "name": "post",
          "type": "string"
        }
      ],
      "name": "newPost",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "name": "id",
          "type": "string"
        }
      ],
      "name": "newLike",
      "type": "event"
    }
  ]
const abi = [
	{
		"constant": true,
		"inputs": [],
		"name": "name",
		"outputs": [
			{
				"name": "",
				"type": "string"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "spender",
				"type": "address"
			},
			{
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "approve",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "totalSupply",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "from",
				"type": "address"
			},
			{
				"name": "to",
				"type": "address"
			},
			{
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "transferFrom",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "decimals",
		"outputs": [
			{
				"name": "",
				"type": "uint32"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "spender",
				"type": "address"
			},
			{
				"name": "addedValue",
				"type": "uint256"
			}
		],
		"name": "increaseAllowance",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "owner",
				"type": "address"
			}
		],
		"name": "balanceOf",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "symbol",
		"outputs": [
			{
				"name": "",
				"type": "string"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "spender",
				"type": "address"
			},
			{
				"name": "subtractedValue",
				"type": "uint256"
			}
		],
		"name": "decreaseAllowance",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "to",
				"type": "address"
			},
			{
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "transfer",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "owner",
				"type": "address"
			},
			{
				"name": "spender",
				"type": "address"
			}
		],
		"name": "allowance",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"name": "owner",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"name": "from",
				"type": "address"
			},
			{
				"indexed": true,
				"name": "to",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "Transfer",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": true,
				"name": "spender",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "Approval",
		"type": "event"
	}
]
const contract = new web3.eth.Contract(socialNetwork, socialNetworkAddress, {from})
const tokenContract = new web3.eth.Contract(abi, tokenContractAddress, {from})
postsWorker.on( "message", function( msg, next, id ){
  // process your message
  console.log("Message id : " + id);
  let json = JSON.parse(msg)
  console.log(json);
  if(!json.author.address){
    next()
  }
  (async function(){
    let sig = await web3.eth.accounts.sign(json.post, json.author.privateKey);
    let tx = await contract.methods.submitPost(json.post, sig.messageHash, sig.v, sig.r, sig.s, json.author.address, true, json.postID).send()
    console.log(tx)
    
  })()
  next()
});

postsWorker.on('deleted', (id) => console.log("Message deleted: "+id))


likesWorker.on("message", (msg, next, id) => {
  console.log("Message id : " + id);
  let json = JSON.parse(msg)
  console.log(json);
  (async function(){
    let sig = await web3.eth.accounts.sign(`I like this message: ${json.postID}`, json.authorOfLike.privateKey);
    let tx = await contract.methods.submitLike(sig.messageHash, sig.v, sig.r, sig.s, json.authorOfLike.address, true, json.author.address, `${json.postID}`).send()
    console.log(tx)
  })()
  next()
})

likesWorker.on('deleted', (id) => console.log("Message deleted: "+id))


balanceWorker.on("message", (msg, next, id) => {
  console.log(msg)
  let json = JSON.parse(msg)
  if(json.address != undefined){
    (async function(){
    let balance = await tokenContract.methods.balanceOf(json.address).call()
    responseWorker.send(JSON.stringify({balance: balance / Math.pow(10, 18), userId: json.userId}), () => console.log("Sent balance for "+json.address))
    })()
  }
  next()
})






var sig1, sig2;
const message = "This is a signed message";


(async function(){
	
	
	  
	
	
	
  
  let newAccount = web3.eth.accounts.create()
  console.log("Eth account: " + newAccount.address)
  sig2 = await web3.eth.accounts.sign(message, newAccount.privateKey);

  console.log(sig2)
  console.log(web3.eth.accounts.recover(sig2))
	const contract = new web3.eth.Contract(abi, tokenContractAddress, {from})
  console.log("from: " + from)
  
  //let tx = await contract.methods.transfer("0x8d448086ece175a209adb5de56404d358ab1ea85", '7700000000000000000000000000').send()
  /*console.log('tx1: '+tx)
  const contract2 = new web3.eth.Contract(socialNetwork, '0xb5d9ba1beed61cceb125d7b33e4b5421c7128e32', {from})
  let tx2 = await contract2.methods.submitPost(message, sig2.messageHash, sig2.v, sig2.r, sig2.s, newAccount.address, true, '_test123').send()
  console.log('tx2: '+tx2)


	//let tx = await contract.methods.testRecovery(message, sig2.v, sig2.r, sig2.s).call()
  //console.log("Recovery :" + tx)
	

	
	  


	/*
 
  sig2 = await web3.eth.accounts.sign(message, privateKey); 
  console.log(sig2)
  
  console.log(web3.eth.accounts.recover(sig2))
  let loomAddr = LocalAddress.fromPublicKey(CryptoUtils.B64ToUint8Array("EYmBs/RdG7zjCJWBwN9fh6LhNkBUTuoptkuh24QELW4="))
  console.log(loomAddr.toString())


  const callerAddr = new Address(client.chainId, loomAddr)
  let addr = Address.fromString(contractAddress)
  const evmContract = new EvmContract({
    addr,
    callerAddr,
    client
  })
  let ret = evmContract.callAsync()

  let newAccount = web3.eth.accounts.create()
  const contract = new web3.eth.Contract(abi, contractAddress)
  var tx = contract.methods.testSender()
  var encodedAbi = tx.encodeABI();

  var transaction = {
    from: newAccount.address,
    to: contractAddress,
    gas: 2000000,
    data: encodedAbi
  }

  web3.eth.accounts.signTransaction(transaction, newAccount.privateKey).then( signed => {
    var sentTx = web3.eth.sendSignedTransaction(signed.rawTransaction);

    sentTx.on('transactionHash', hash => {
      console.log(hash)
    })

    sentTx.on('error', error => {
      console.log(error)
    })
    

  })*/






  /*let ethAddr = new Address("eth", LocalAddress.fromHexString(web3.eth.accounts.recover(sig2)))
  
  let loomAddr = LocalAddress.fromPublicKey(CryptoUtils.B64ToUint8Array("EYmBs/RdG7zjCJWBwN9fh6LhNkBUTuoptkuh24QELW4="))



  let loomAddress = new Address("loom", loomAddr)
  const addressMapper = await Contracts.AddressMapper.createAsync(client, loomAddress)
  const mapping = await addressMapper.getMappingAsync(ethAddr)
console.log("From: " + mapping.from + " To " + mapping.to)

  console.log(loomAddr.toString())
  console.log()

  const sig = sig2.signature.slice(2)

  let mode = 1 // Geth
  const r = ethutil.toBuffer('0x' + sig.substring(0, 64)) 
  const s = ethutil.toBuffer('0x' + sig.substring(64, 128))
  let v = parseInt(sig.substring(128, 130), 16)
  
  console.log( {r: ethutil.bufferToHex(r), s: ethutil.bufferToHex(s), v: v} )*/
  
})();










// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

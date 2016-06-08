<properties
	pageTitle="Azure AD v2.0 NodeJS Web API | Microsoft Azure"
	description="How to build a NodeJS Web API accepts tokens from both personal Microsoft Account and work or school accounts."
	services="active-directory"
	documentationCenter="nodejs"
	authors="brandwe"
	manager="mbaldwin"
	editor=""/>

<tags
	ms.service="active-directory"
	ms.workload="identity"
  	ms.tgt_pltfrm="na"
	ms.devlang="javascript"
	ms.topic="article"
	ms.date="05/31/2016"
	ms.author="brandwe"/>

# Secure a Web API using node.js

> [AZURE.NOTE]
	Not all Azure Active Directory scenarios & features are supported by the v2.0 endpoint.  To determine if you should use the v2.0 endpoint, read about [v2.0 limitations](active-directory-v2-limitations.md).

With Azure Active Directory the v2.0 endpoint, you can protect a Web API using [OAuth 2.0](active-directory-v2-protocols.md#oauth2-authorization-code-flow) access tokens, enabling users with both personal Microsoft account and work or school accounts to securely access your Web API.

**Passport** is authentication middleware for Node.js. Extremely flexible and modular, Passport can be unobtrusively dropped in to any Express-based or Resitify web application. A comprehensive set of strategies support authentication using a username and password, Facebook, Twitter, and more. We have developed a strategy for Microsoft Azure Active Directory. We will install this module and then add the Microsoft Azure Active Directory `passport-azure-ad` plug-in.

## Download
The code for this tutorial is maintained [on GitHub](https://github.com/AzureADQuickStarts/AppModelv2-WebAPI-nodejs).  To follow along, you can [download the app's skeleton as a .zip](https://github.com/AzureADQuickStarts/AppModelv2-WebAPI-nodejs/archive/skeleton.zip) or clone the skeleton:

```git clone --branch skeleton https://github.com/AzureADQuickStarts/AppModelv2-WebAPI-nodejs.git```

The completed application is provided at the end of this tutorial as well.


## 1. Register an app
Create a new app at [apps.dev.microsoft.com](https://apps.dev.microsoft.com), or follow these [detailed steps](active-directory-v2-app-registration.md).  Make sure to:

- Copy down the **Application Id** assigned to your app, you'll need it soon.
- Add the **Mobile** platform for your app.
- Copy down the **Redirect URI** from the portal. You must use the default value of `urn:ietf:wg:oauth:2.0:oob`.


## 2: Download node.js for your platform
To successfully use this sample, you must have a working installation of Node.js.

Install Node.js from [http://nodejs.org](http://nodejs.org).

## 3: Install MongoDB on to your platform

To successfully use this sample, you must have a working installation of MongoDB. We will use MongoDB to make our REST API persistant across server instances.

Install MongoDB from [http://mongodb.org](http://www.mongodb.org).

> [AZURE.NOTE] This walkthrough assumes that you use the default installation and server endpoints for MongoDB, which at the time of this writing is: mongodb://localhost

## 4: Install the Restify modules in to your Web API

We will be using Resitfy to build our REST API. Restify is a minimal and flexible Node.js application framework derived from Express that has a robust set of features for building REST APIs on top of Connect.

### Install Restify

From the command-line, change directories to the azuread directory. If the **azuread** directory does not exist, create it.

`cd azuread` - or- `mkdir azuread;`

Type the following command:

`npm install restify`

This command installs Restify.

#### Did you get an error?

When using npm on some operating systems, you may receive an error of Error: EPERM, chmod '/usr/local/bin/..' and a request to try running the account as an administrator. If this occurs, use the sudo command to run npm at a higher privilege level.

#### Did you get an error regarding DTrace?

You may see something like this when installing Restify:

```Shell
clang: error: no such file or directory: 'HD/azuread/node_modules/restify/node_modules/dtrace-provider/libusdt'
make: *** [Release/DTraceProviderBindings.node] Error 1
gyp ERR! build error
gyp ERR! stack Error: `make` failed with exit code: 2
gyp ERR! stack     at ChildProcess.onExit (/usr/local/lib/node_modules/npm/node_modules/node-gyp/lib/build.js:267:23)
gyp ERR! stack     at ChildProcess.EventEmitter.emit (events.js:98:17)
gyp ERR! stack     at Process.ChildProcess._handle.onexit (child_process.js:789:12)
gyp ERR! System Darwin 13.1.0
gyp ERR! command "node" "/usr/local/lib/node_modules/npm/node_modules/node-gyp/bin/node-gyp.js" "rebuild"
gyp ERR! cwd /Volumes/Development HD/azuread/node_modules/restify/node_modules/dtrace-provider
gyp ERR! node -v v0.10.11
gyp ERR! node-gyp -v v0.10.0
gyp ERR! not ok
npm WARN optional dep failed, continuing dtrace-provider@0.2.8
```


Restify provides a powerful mechanism to trace REST calls using DTrace. However, many operating systems do not have DTrace available. You can safely ignore these errors.


The output of this command should appear similar to the following:


	restify@2.6.1 node_modules/restify
	├── assert-plus@0.1.4
	├── once@1.3.0
	├── deep-equal@0.0.0
	├── escape-regexp-component@1.0.2
	├── qs@0.6.5
	├── tunnel-agent@0.3.0
	├── keep-alive-agent@0.0.1
	├── lru-cache@2.3.1
	├── node-uuid@1.4.0
	├── negotiator@0.3.0
	├── mime@1.2.11
	├── semver@2.2.1
	├── spdy@1.14.12
	├── backoff@2.3.0
	├── formidable@1.0.14
	├── verror@1.3.6 (extsprintf@1.0.2)
	├── csv@0.3.6
	├── http-signature@0.10.0 (assert-plus@0.1.2, asn1@0.1.11, ctype@0.5.2)
	└── bunyan@0.22.0(mv@0.0.5)


## 5: Install Passport.js into your Web API

[Passport](http://passportjs.org/) is authentication middleware for Node.js. Extremely flexible and modular, Passport can be unobtrusively dropped in to any Express-based or Resitify web application. A comprehensive set of strategies support authentication using a username and password, Facebook, Twitter, and more. We have developed a strategy for Azure Active Directory. We will install this module and then add the Azure Active Directory strategy plug-in.

From the command-line, change directories to the azuread directory.

Enter the following command to install passport.js

`npm install passport`

The output of the commadn should appear similar to the following:

	passport@0.1.17 node_modules\passport
	├── pause@0.0.1
	└── pkginfo@0.2.3

## 6: Add Passport-Azure-AD to your Web API

Next, we will add the OAuth strategy, using passport-azuread, a suite of strategies that connect Azure Active Directory with  Passport. We will use this strategy for Bearer Tokens in this Rest API sample.

> [AZURE.NOTE] Although OAuth2 provides a framework in which any known token type can be issued, only certain token types have gained wide-spread use. For protecting endpoints, that has turned out to be Bearer Tokens. Bearer tokens are the most widely issued type of token in OAuth2, and many implementations assume that bearer tokens are the only type of token issued.

From the command-line, change directories to the azuread directory

Type the following command to install Passport.js passport-azure-ad module:

`npm install passport-azure-ad`

The output of the command should appear similar to the following:

``
passport-azure-ad@1.0.0 node_modules/passport-azure-ad
├── xtend@4.0.0
├── xmldom@0.1.19
├── passport-http-bearer@1.0.1 (passport-strategy@1.0.0)
├── underscore@1.8.3
├── async@1.3.0
├── jsonwebtoken@5.0.2
├── xml-crypto@0.5.27 (xpath.js@1.0.6)
├── ursa@0.8.5 (bindings@1.2.1, nan@1.8.4)
├── jws@3.0.0 (jwa@1.0.1, base64url@1.0.4)
├── request@2.58.0 (caseless@0.10.0, aws-sign2@0.5.0, forever-agent@0.6.1, stringstream@0.0.4, tunnel-agent@0.4.1, oauth-sign@0.8.0, isstream@0.1.2, extend@2.0.1, json-stringify-safe@5.0.1, node-uuid@1.4.3, qs@3.1.0, combined-stream@1.0.5, mime-types@2.0.14, form-data@1.0.0-rc1, http-signature@0.11.0, bl@0.9.4, tough-cookie@2.0.0, hawk@2.3.1, har-validator@1.8.0)
└── xml2js@0.4.9 (sax@0.6.1, xmlbuilder@2.6.4)
``

## 7: Add MongoDB modules to your Web API

We will be using MongoDB as our datastore For that reason, we need to install both the widely used plug-in to manage models and schemas called Mongoose, as well as the database driver for MongoDB, also called MongoDB.


* `npm install mongoose`
* `npm install mongodb`

## 8: Install additional modules

Next, we'll install the remaining required modules.


From the command-line, change directories to the **azuread** folder if not already there:

`cd azuread`


Enter the following commands to install the following modules in your node_modules directory:

* `npm install crypto`
* `npm install assert-plus`
* `npm install posix-getopt`
* `npm install util`
* `npm install path`
* `npm install connect`
* `npm install xml-crypto`
* `npm install xml2js`
* `npm install xmldom`
* `npm install async`
* `npm install request`
* `npm install underscore`
* `npm install grunt-contrib-jshint@0.1.1`
* `npm install grunt-contrib-nodeunit@0.1.2`
* `npm install grunt-contrib-watch@0.2.0`
* `npm install grunt@0.4.1`
* `npm install xtend@2.0.3`
* `npm install bunyan`
* `npm update`


## 9: Create a server.js with your dependencies

The server.js file will be providing the majority of our functionality for our Web API server. We will be adding most of our code to this file. For production purposes you would refactor the functionality in to smaller files, such as separate routes and controllers. For the purpose of this demo we will use server.js for this functionality.

From the command-line, change directories to the **azuread** folder if not already there:

`cd azuread`

Create a `server.js` file in our favorite editor and add the following information:

```Javascript
'use strict';
/**
* Module dependencies.
*/
var util = require('util');
var assert = require('assert-plus');
var mongoose = require('mongoose/');
var bunyan = require('bunyan');
var restify = require('restify');
var config = require('./config');
var passport = require('passport');
var OIDCBearerStrategy = require('passport-azure-ad').OIDCStrategy;
```

Save the file. We will return to it shortly.

## 10: Create a config file to store your Azure AD settings

This code file passes the configuration parameters from your Azure Active Directory Portal to Passport.js. You created these configuration values when you added the Web API to the portal in the first part of the walkthrough. We will explain what to put in the values of these parameters after you've copied the code.


From the command-line, change directories to the **azuread** folder if not already there:

`cd azuread`

Create a `config.js` file in our favorite editor and add the following information:

```Javascript
// Don't commit this file to your public repos. This config is for first-run
exports.creds = {
mongoose_auth_local: 'mongodb://localhost/tasklist', // Your mongo auth uri goes here
issuer: 'https://sts.windows.net/**<your application id>**/',
audience: '<your redirect URI>',
identityMetadata: 'https://login.microsoftonline.com/common/.well-known/openid-configuration' // For using Microsoft you should never need to change this.
};

```



### Required Values

*IdentityMetadata*: This is where passport-azure-ad will look for your configuration data for the IdP as well as the keys to validate the JWT tokens. You probably do not want to change this if using Azure Active Directory.

*audience*: Your redirect URI from the portal.

> [AZURE.NOTE]
We roll our keys at frequent intervals. Please ensure that you are always pulling from the "openid_keys" URL and that the app can access the internet.


## 11: Add configuration to your server.js file

We need to read these values from the Config file you just created across our application. To do this, we simply add the .config file as a required resource in our application and then set the global variables to those in the config.js document

From the command-line, change directories to the **azuread** folder if not already there:

`cd azuread`

Open your `server.js` file in our favorite editor and add the following information:

```Javascript
var config = require('./config');
```
Then, add a new section to `server.js` with the following code:

```Javascript
// We pass these options in to the ODICBearerStrategy.
var options = {
// The URL of the metadata document for your app. We will put the keys for token validation from the URL found in the jwks_uri tag of the in the metadata.
identityMetadata: config.creds.identityMetadata,
issuer: config.creds.issuer,
audience: config.creds.audience
};
// array to hold logged in users and the current logged in user (owner)
var users = [];
var owner = null;
// Our logger
var log = bunyan.createLogger({
name: 'Microsoft Azure Active Directory Sample'
});
```

## Step 12: Add The MongoDB Model and Schema Information using Moongoose

Now all this preparation is going to start paying off as we wind these three files together in to a REST API service.

For this walkthrough we will be using MongoDB to store our Tasks as discussed in ***Step 4***.

If you recall from the config.js file we created in Step 11, we called our database *tasklist*, as that was what we put at the end of our mogoose_auth_local connection URL. You don't need to create this database beforehand in MongoDB, it will create this for us on first run of our server application (assuming it does not already exist).

Now that we've told the server what MongoDB database we'd like to use, we need to write some additional code to create the model and schema for our server's Tasks.

#### Discussion of the model

Our Schema model is very simple, and you expand it as required.

NAME - The name of who is assigned to the task. A ***String***

TASK - The task itself. A ***String***

DATE - The date that the task is due. A ***DATETIME***

COMPLETED - If the Task is completed or not. A ***BOOLEAN***

#### Creating the schema in the code


From the command-line, change directories to the **azuread** folder if not already there:

`cd azuread`

Open your `server.js` file in our favorite editor and add the following information below the configuration entry:

```Javascript
// MongoDB setup
// Setup some configuration
var serverPort = process.env.PORT || 8080;
var serverURI = (process.env.PORT) ? config.creds.mongoose_auth_mongohq : config.creds.mongoose_auth_local;
// Connect to MongoDB
global.db = mongoose.connect(serverURI);
var Schema = mongoose.Schema;
log.info('MongoDB Schema loaded');
```
This will connect to the MongoDB server and hand back a Schema object to us.

#### Using the Schema, create our model in the code

Below the code you wrote above, add the following code:

```Javascript
// Here we create a schema to store our tasks and users. Pretty simple schema for now.
var TaskSchema = new Schema({
owner: String,
task: String,
completed: Boolean,
date: Date
});
// Use the schema to register a model
mongoose.model('Task', TaskSchema);
var Task = mongoose.model('Task');
```
As you can tell from the code, we create our Schema and then create a model object we will use to store our data throughout the code when we define our ***Routes***.

## Step 13: Add our Routes for our Task REST API server

Now that we have a database model to work with, let's add the routes we will use for our REST API server.

### About Routes in Restify

Routes work in Restify in the exact same way they do using the Express stack. You define routes using the URI that you expect the client applicaitons to call. Usually, you define your routes in a separate file. For our purposes, we will put our routes in the server.js file. We recommend you factor these in to their own file for production use.

A typical pattern for a Restify Route is:

```Javascript
function createObject(req, res, next) {
// do work on Object
_object.name = req.params.object; // passed value is in req.params under object
///...
return next(); // keep the server going
}
....
server.post('/service/:add/:object', createObject); // calls createObject on routes that match this.
```


This is the pattern at the most basic level. Resitfy (and Express) provide much deeper functionaltiy such as defining application types and doing complex routing across different endpoints. For our purposes, we will keep these routes very simply.

#### Add default routes to our server

We will now add the basic CRUD routes of Create, Retrieve, Update, and Delete.

From the command-line, change directories to the **azuread** folder if not already there:

`cd azuread`

Open your `server.js` file in our favorite editor and add the following information below the database entries you made above:

```Javascript
/**
*
* APIs for our REST Task server
*/
// Create a task
function createTask(req, res, next) {
// Resitify currently has a bug which doesn't allow you to set default headers
// This headers comply with CORS and allow us to mongodbServer our response to any origin
res.header("Access-Control-Allow-Origin", "*");
res.header("Access-Control-Allow-Headers", "X-Requested-With");
// Create a new task model, fill it up and save it to Mongodb
var _task = new Task();
if (!req.params.task) {
req.log.warn({
params: p
}, 'createTodo: missing task');
next(new MissingTaskError());
return;
}
_task.owner = owner;
_task.task = req.params.task;
_task.date = new Date();
_task.save(function(err) {
if (err) {
req.log.warn(err, 'createTask: unable to save');
next(err);
} else {
res.send(201, _task);
}
});
return next();
}
// Delete a task by name
function removeTask(req, res, next) {
Task.remove({
task: req.params.task,
owner: owner
}, function(err) {
if (err) {
req.log.warn(err,
'removeTask: unable to delete %s',
req.params.task);
next(err);
} else {
log.info('Deleted task:', req.params.task);
res.send(204);
next();
}
});
}
// Delete all tasks
function removeAll(req, res, next) {
Task.remove();
res.send(204);
return next();
}
// Get a specific task based on name
function getTask(req, res, next) {
log.info('getTask was called for: ', owner);
Task.find({
owner: owner
}, function(err, data) {
if (err) {
req.log.warn(err, 'get: unable to read %s', owner);
next(err);
return;
}
res.json(data);
});
return next();
}
/// Simple returns the list of TODOs that were loaded.
function listTasks(req, res, next) {
// Resitify currently has a bug which doesn't allow you to set default headers
// This headers comply with CORS and allow us to mongodbServer our response to any origin
res.header("Access-Control-Allow-Origin", "*");
res.header("Access-Control-Allow-Headers", "X-Requested-With");
log.info("listTasks was called for: ", owner);
Task.find({
owner: owner
}).limit(20).sort('date').exec(function(err, data) {
if (err)
return next(err);
if (data.length > 0) {
log.info(data);
}
if (!data.length) {
log.warn(err, "There is no tasks in the database. Add one!");
}
if (!owner) {
log.warn(err, "You did not pass an owner when listing tasks.");
} else {
res.json(data);
}
});
return next();
}
```

### Add some error handling for the routes

It makes sense to add some error handling so we can communicate back to the client the problem we encountered in a way it can understand.

Add the following code underneath the code you've written above:

```Javascript
///--- Errors for communicating something interesting back to the client
function MissingTaskError() {
restify.RestError.call(this, {
statusCode: 409,
restCode: 'MissingTask',
message: '"task" is a required parameter',
constructorOpt: MissingTaskError
});
this.name = 'MissingTaskError';
}
util.inherits(MissingTaskError, restify.RestError);
function TaskExistsError(owner) {
assert.string(owner, 'owner');
restify.RestError.call(this, {
statusCode: 409,
restCode: 'TaskExists',
message: owner + ' already exists',
constructorOpt: TaskExistsError
});
this.name = 'TaskExistsError';
}
util.inherits(TaskExistsError, restify.RestError);
function TaskNotFoundError(owner) {
assert.string(owner, 'owner');
restify.RestError.call(this, {
statusCode: 404,
restCode: 'TaskNotFound',
message: owner + ' was not found',
constructorOpt: TaskNotFoundError
});
this.name = 'TaskNotFoundError';
}
util.inherits(TaskNotFoundError, restify.RestError);
```


## Step 14: Create your Server!

We have our database defined, we have our routes in place, and the last thing to do is add our server instance that will manage our calls.

Restify (and Express) have a lot of deep customization you can do for a REST API server, but again we will use the most basic setup for our purposes.

```Javascript
/**
* Our Server
*/
var server = restify.createServer({
name: "Microsoft Azure Active Directroy TODO Server",
version: "2.0.1"
});
// Ensure we don't drop data on uploads
server.pre(restify.pre.pause());
// Clean up sloppy paths like //todo//////1//
server.pre(restify.pre.sanitizePath());
// Handles annoying user agents (curl)
server.pre(restify.pre.userAgentConnection());
// Set a per request bunyan logger (with requestid filled in)
server.use(restify.requestLogger());
// Allow 5 requests/second by IP, and burst to 10
server.use(restify.throttle({
burst: 10,
rate: 5,
ip: true,
}));
// Use the common stuff you probably want
server.use(restify.acceptParser(server.acceptable));
server.use(restify.dateParser());
server.use(restify.queryParser());
server.use(restify.gzipResponse());
server.use(restify.bodyParser({
mapParams: true
}));
```
## 15: Adding the routes (without authentication for now)

```Javascript
/// Now the real handlers. Here we just CRUD
/**
/*
/* Each of these handlers are protected by our OIDCBearerStrategy by invoking 'oidc-bearer'
/* in the pasport.authenticate() method. We set 'session: false' as REST is stateless and
/* we don't need to maintain session state. You can experiement removing API protection
/* by removing the passport.authenticate() method like so:
/*
/* server.get('/tasks', listTasks);
/*
**/
server.get('/tasks', listTasks);
server.get('/tasks', listTasks);
server.get('/tasks/:owner', getTask);
server.head('/tasks/:owner', getTask);
server.post('/tasks/:owner/:task', createTask);
server.post('/tasks', createTask);
server.del('/tasks/:owner/:task', removeTask);
server.del('/tasks/:owner', removeTask);
server.del('/tasks', removeTask);
server.del('/tasks', removeAll, function respond(req, res, next) {
res.send(204);
next();
});
// Register a default '/' handler
server.get('/', function root(req, res, next) {
var routes = [
'GET /',
'POST /tasks/:owner/:task',
'POST /tasks (for JSON body)',
'GET /tasks',
'PUT /tasks/:owner',
'GET /tasks/:owner',
'DELETE /tasks/:owner/:task'
];
res.send(200, routes);
next();
});
server.listen(serverPort, function() {
var consoleMessage = '\n Microsoft Azure Active Directory Tutorial';
consoleMessage += '\n +++++++++++++++++++++++++++++++++++++++++++++++++++++';
consoleMessage += '\n %s server is listening at %s';
consoleMessage += '\n Open your browser to %s/tasks\n';
consoleMessage += '+++++++++++++++++++++++++++++++++++++++++++++++++++++ \n';
consoleMessage += '\n !!! why not try a $curl -isS %s | json to get some ideas? \n';
consoleMessage += '+++++++++++++++++++++++++++++++++++++++++++++++++++++ \n\n';
});
```
## 16: Before we add OAuth support, let's run the server.

Test out your server before we add authentication

The easiest way to do this is by using curl in a command line. Before we do that, we need a simple utility that allows us to parse output as JSON. To do that, install the json tool as all the examples below use that.

`$npm install -g jsontool`

This installs the JSON tool globally. Now that we’ve accomplished that – let’s play with the server:

First, make sure that your monogoDB isntance is running..

`$sudo mongod`

Then, change to the directory and start curling..

`$ cd azuread`
`$ node server.js`

`$ curl -isS http://127.0.0.1:8080 | json`

```Shell
HTTP/1.1 2.0OK
Connection: close
Content-Type: application/json
Content-Length: 171
Date: Tue, 14 Jul 2015 05:43:38 GMT
[
"GET /",
"POST /tasks/:owner/:task",
"POST /tasks (for JSON body)",
"GET /tasks",
"PUT /tasks/:owner",
"GET /tasks/:owner",
"DELETE /tasks/:owner/:task"
]
```

Then, we can add a task this way:

`$ curl -isS -X POST http://127.0.0.1:8888/tasks/brandon/Hello`

The response should be:

```Shell
HTTP/1.1 201 Created
Connection: close
Access-Control-Allow-Origin: *
Access-Control-Allow-Headers: X-Requested-With
Content-Type: application/x-www-form-urlencoded
Content-Length: 5
Date: Tue, 04 Feb 2014 01:02:26 GMT
Hello
```
And we can list tasks for Brandon this way:

`$ curl -isS http://127.0.0.1:8080/tasks/brandon/`

If all this works out, we are ready to add OAuth to the REST API server.

**You have a REST API server with MongoDB!**

## 17: Add Authentication to our REST API Server

Now that we have a running REST API (congrats, btw!) let's get to making it useful against Azure AD.

From the command-line, change directories to the **azuread** folder if not already there:

`cd azuread`

### 1: Use the oidcbearerstrategy that is included with passport-azure-ad

So far we have built a typical REST TODO server without any kind of authorization. This is where we start putting that together.

First, we need to indicate that we want to use Passport. Put this right after your other server configuration:

```Javascript
// Let's start using Passport.js

server.use(passport.initialize()); // Starts passport
server.use(passport.session()); // Provides session support
```

> [AZURE.TIP]
When writing APIs you should always link the data to something unique from the token that the user can’t spoof. When this server stores TODO items, it stores them based on the subscription ID of the user in the token (called through token.sub) which we put in the “owner” field. This ensures that only that user can access his TODOs and no one else can access the TODOs entered. There is no exposure in the API of “owner” so an external user can request other’s TODOs even if they are authenticated.

Next, let’s use the Open ID Connect Bearer strategy that comes with passport-azure-ad. Just look at the code for now, I’ll explain it shortly. Put this after what you pated above:

```Javascript
/**
/*
/* Calling the OIDCBearerStrategy and managing users
/*
/* Passport pattern provides the need to manage users and info tokens
/* with a FindorCreate() method that must be provided by the implementor.
/* Here we just autoregister any user and implement a FindById().
/* You'll want to do something smarter.
**/
var findById = function(id, fn) {
for (var i = 0, len = users.length; i < len; i++) {
var user = users[i];
if (user.sub === id) {
log.info('Found user: ', user);
return fn(null, user);
}
}
return fn(null, null);
};
var oidcStrategy = new OIDCBearerStrategy(options,
function(token, done) {
log.info('verifying the user');
log.info(token, 'was the token retreived');
findById(token.sub, function(err, user) {
if (err) {
return done(err);
}
if (!user) {
// "Auto-registration"
log.info('User was added automatically as they were new. Their sub is: ', token.sub);
users.push(token);
owner = token.sub;
return done(null, token);
}
owner = token.sub;
return done(null, user, token);
});
}
);
passport.use(oidcStrategy);
```

Passport uses a similar pattern for all it’s Strategies (Twitter, Facebook, etc.) that all Strategy writers adhere to. Looking at the strategy you see we pass it a function() that has a token and a done as the parameters. The strategy will dutifully come back to us once it does all it’s work. Once it does we’ll want to store the user and stash the token so we won’t need to ask for it again.

> [AZURE.IMPORTANT]
The code above takes any user that happens to authenticate to our server. This is known as auto registration. In production servers you wouldn’t want to let anyone in without first having them go through a registration process you decide. This is usually the pattern you see in consumer apps who allow you to register with Facebook but then ask you to fill out additional information. If this wasn’t a command line program, we could have just extracted the email from the token object that is returned and then asked them to fill out additional information. Since this is a test server we simply add them to the in-memory database.

### 2. Finally, protect some endpoints

You protect endpoints by specifying the passport.authenticate() call with the protocol you wish to use.

Let’s edit our route in our server code to do something more interesting:

```Javascript
server.get('/tasks', passport.authenticate('oidc-bearer', {
session: false
}), listTasks);
server.get('/tasks', passport.authenticate('oidc-bearer', {
session: false
}), listTasks);
server.get('/tasks/:owner', passport.authenticate('oidc-bearer', {
session: false
}), getTask);
server.head('/tasks/:owner', passport.authenticate('oidc-bearer', {
session: false
}), getTask);
server.post('/tasks/:owner/:task', passport.authenticate('oidc-bearer', {
session: false
}), createTask);
server.post('/tasks', passport.authenticate('oidc-bearer', {
session: false
}), createTask);
server.del('/tasks/:owner/:task', passport.authenticate('oidc-bearer', {
session: false
}), removeTask);
server.del('/tasks/:owner', passport.authenticate('oidc-bearer', {
session: false
}), removeTask);
server.del('/tasks', passport.authenticate('oidc-bearer', {
session: false
}), removeTask);
server.del('/tasks', passport.authenticate('oidc-bearer', {
session: false
}), removeAll, function respond(req, res, next) {
res.send(204);
next();
});
```

## 18: Run your server application again and ensure it rejects you

Let's use `curl` again to see if we now have OAuth2 protection against our endpoints. We will do this before runnning any of our client SDKs against this endpoint. The headers returned should be enough to tell us we are down the right path.

First, make sure that your monogoDB isntance is running..

	$sudo mongod

Then, change to the directory and start curling..

	$ cd azuread
	$ node server.js

Try a basic POST:

`$ curl -isS -X POST http://127.0.0.1:8080/tasks/brandon/Hello`

```Shell
HTTP/1.1 401 Unauthorized
Connection: close
WWW-Authenticate: Bearer realm="Users"
Date: Tue, 14 Jul 2015 05:45:03 GMT
Transfer-Encoding: chunked
```

A 401 is the response you are looking for here, as that indicates that the Passport layer is trying to redirect to the authorize endpoint, which is exactly what you want.


## Congratulations! You have a REST API Service using OAuth2!

You've went as far as you can with this server without using an OAuth2 compatible client. You will need to go through an additional walkthrough.

If you were just looking for information on how to implement a REST API using Restify and OAuth2, you have more than enough code to keep developing your service and learning how to build on this example.

## Next Steps

For reference, the completed sample (without your configuration values) [is provided as a .zip here](https://github.com/AzureADQuickStarts/AppModelv2-WebAPI-nodejs/archive/complete.zip), or you can clone it from GitHub:

```git clone --branch complete https://github.com/AzureADQuickStarts/AppModelv2-WebAPI-nodejs.git```

You can now move onto more advanced topics.  You may want to try:

[Secure a Node.js web app using the v2.0 endpoint >>](active-directory-v2-devquickstarts-node-web.md)

For additional resources, check out:
- [The v2.0 developer guide >>](active-directory-appmodel-v2-overview.md)
- [StackOverflow "azure-active-directory" tag >>](http://stackoverflow.com/questions/tagged/azure-active-directory)

## Get security updates for our products

We encourage you to get notifications of when security incidents occur by visiting [this page](https://technet.microsoft.com/security/dd252948) and subscribing to Security Advisory Alerts.

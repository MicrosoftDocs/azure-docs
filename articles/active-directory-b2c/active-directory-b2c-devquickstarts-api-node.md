<properties
	pageTitle="B2C Preview: Secure a web API by using Node.js | Microsoft Azure"
	description="How to build a Node.js web API that accepts tokens from a B2C tenant"
	services="active-directory-b2c"
	documentationCenter=""
	authors="brandwe"
	manager="msmbaldwin"
	editor=""/>

<tags
	ms.service="active-directory-b2c"
	ms.workload="identity"
  	ms.tgt_pltfrm="na"
	ms.devlang="javascript"
	ms.topic="hero-article"
	ms.date="07/22/2016"
	ms.author="brandwe"/>

# B2C preview: Secure a web API by using Node.js

> [AZURE.NOTE] This article does not cover how to implement sign-in, sign-up and profile management by using Azure AD B2C. It focuses on calling web APIs after the user has been authenticated. You should start with the [.NET web app getting started tutorial](active-directory-b2c-devquickstarts-web-dotnet.md) to learn about the basics of Azure Active Directory B2C if you haven't already.


> [AZURE.NOTE]	This sample was written to be connected to by using our [iOS B2C sample application](active-directory-b2c-devquickstarts-ios.md). Do this walk-through first, and then follow along with that sample.

**Passport** is authentication middleware for Node.js. Extremely flexible and modular, Passport can be unobtrusively installed in any Express-based or Restify web application. A comprehensive set of strategies supports authentication by using a user name and password, Facebook, Twitter, and more. We have developed a strategy for Azure Active Directory (Azure AD). You will install this module and then add the Azure AD `passport-azure-ad` plug-in.

To do this, you’ll need to:

1. Register an application with Azure AD.
2. Set up your app to use Passport's `azure-ad-passport` plug-in.
3. Configure a client application to call the "to-do list" web API.

The code for this tutorial [is maintained on GitHub](https://github.com/AzureADQuickStarts/B2C-WebAPI-nodejs). To follow along, you can [download the app's skeleton as a .zip file](https://github.com/AzureADQuickStarts/B2C-WebAPI-nodejs/archive/skeleton.zip) or clone the skeleton:

```git clone --branch skeleton https://github.com/AzureADQuickStarts/B2C-WebAPI-nodejs.git```

The completed application is provided at the end of this tutorial.

> [AZURE.WARNING] 	For our B2C preview, you must use the same **Client ID**/**Application ID** and policies for both the web API task server and the client that connects to it. This is also true for our iOS and Android tutorials. If you have previously created an application in either of those Quickstarts, use those values; don't create new ones.


## Get an Azure AD B2C directory

Before you can use Azure AD B2C, you must create a directory, or tenant.  A directory is a container for all of your users, apps, groups, and more.  If you don't have one already, [create a B2C directory](active-directory-b2c-get-started.md) before you continue.

## Create an application

Next, you need to create an app in your B2C directory that gives Azure AD some information that it needs to securely communicate with your app. In this case, both the client app and web API will be represented by a single **Application ID**, because they comprise one logical app. To create an app, follow [these instructions](active-directory-b2c-app-registration.md). Be sure to:

- Include a **web app/web api** in the application
- Enter `http://localhost/TodoListService` as a **Reply URL**. It is the default URL for this code sample.
- Create an **Application secret** for your application and copy it. You will need it later. You will need it shortly. Note that this value needs to be [XML escaped](https://www.w3.org/TR/2006/REC-xml11-20060816/#dt-escape) before you use it.
- Copy the **Application ID** that is assigned to your app. You will also need this later.

[AZURE.INCLUDE [active-directory-b2c-devquickstarts-v2-apps](../../includes/active-directory-b2c-devquickstarts-v2-apps.md)]

## Create your policies

In Azure AD B2C, every user experience is defined by a [policy](active-directory-b2c-reference-policies.md). This app contains three identity experiences: sign up, sign in, and sign in with Facebook. You need to create one policy of each type, as described in the
[policy reference article](active-directory-b2c-reference-policies.md#how-to-create-a-sign-up-policy).  When you create your three policies, be sure to:

- Choose the **Display name** and other sign-up attributes in your sign-up policy.
- Choose the **Display name** and **Object ID** application claims in every policy.  You can choose other claims as well.
- Copy down the **Name** of each policy after you create it. It should have the prefix `b2c_1_`.  You'll need those policy names later.

[AZURE.INCLUDE [active-directory-b2c-devquickstarts-policy](../../includes/active-directory-b2c-devquickstarts-policy.md)]

After you have created your three policies, you're ready to build your app.

Note that this article does not cover how to use the policies that you just created. To learn about how policies work in Azure AD B2C, start with the [.NET web app getting started tutorial](active-directory-b2c-devquickstarts-web-dotnet.md).

## Download Node.js for your platform

To successfully use this sample, you must have a working installation of Node.js.

Install Node.js from [nodejs.org](http://nodejs.org).

## Install MongoDB for your platform

To successfully use this sample, you must also have a working installation of MongoDB. You will use MongoDB to make your REST API persistent across server instances.

Install MongoDB from [mongodb.org](http://www.mongodb.org).

> [AZURE.NOTE] This walk-through assumes that you will use the default installation and server endpoints for MongoDB, which at the time of this writing is `mongodb://localhost`.

## Install the Restify modules in your web API

You will use Restify to build your REST API. Restify is a minimal and flexible Node.js application framework derived from Express. It has a robust set of features for building REST APIs on top of Connect.

### Install Restify

From the command line, change your directory to `azuread`. If the `azuread` directory doesn't exist, create it.

`cd azuread` or `mkdir azuread;`

Enter the following command:

`npm install restify`

This command installs Restify.

#### Did you get an error?

In some operating systems, when you use `npm`, you may receive the error `Error: EPERM, chmod '/usr/local/bin/..'` and a request that you run the account as an administrator. If this occurs, use the `sudo` command to run `npm` at a higher privilege level.

#### Did you get a DTrace error?

You may see something like this when you install Restify:

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

Restify provides a powerful mechanism for tracing REST calls by using DTrace. However, many operating systems do not have DTrace available. You can safely ignore these errors.

The output of the command should appear similar to this:

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
	└── bunyan@0.22.0 (mv@0.0.5)

## Install Passport in your web API

[Passport](http://passportjs.org/) is authentication middleware for Node.js. Extremely flexible and modular, Passport can be unobtrusively installed in any Express-based or Restify web application. A comprehensive set of strategies supports authentication by using a user name and password, Facebook, Twitter, and more. We have developed a strategy for Azure AD. You will install this module and then add the Azure AD strategy plug-in.

From the command line, change your directory to `azuread`, if it's not already there.

Enter the following command to install Passport:

`npm install passport`

The output of the command should be similar to this:

	passport@0.1.17 node_modules\passport
	├── pause@0.0.1
	└── pkginfo@0.2.3

## Add passport-azuread to your web API

Next, add the OAuth strategy by using `passport-azuread`, a suite of strategies that connect Azure AD with Passport. Use this strategy for bearer tokens in the REST API sample.

> [AZURE.NOTE] Although OAuth2 provides a framework in which any known token type can be issued, only certain token types have gained widespread use. The tokens for protecting endpoints are bearer tokens. These are the most widely issued type of token in OAuth2. Many implementations assume that bearer tokens are the only type of token issued.

From the command line, change your directory to `azuread`, if it's not already there.

Enter the following command to install the Passport `passport-azure-ad` module:

`npm install passport-azure-ad`

The output of the command should be similar to this:

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

## Add MongoDB modules to your web API

You will use MongoDB as your data store. For that reason, you need to install both Mongoose, a widely used plug-in for managing models and schemas, and the database driver for MongoDB, also called MongoDB.

* `npm install mongoose`
* `npm install mongodb`

## Install additional modules

Next, install the remaining required modules.

From the command line, change your directory to `azuread`, if it's not already there:

`cd azuread`

Enter the following commands to install the modules in your `node_modules` directory:

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


## Create a server.js file with your dependencies

The `server.js` file will provide the majority of the functionality for your Web API server. You will add most of our code to this file. For production purposes, you should refactor the functionality into smaller files, such as separate routes and controllers. For the purpose of this tutorial, use server.js for this functionality.

From the command line, change your directory to `azuread`, if it's not already there:

`cd azuread`

Create a `server.js` file in an editor. Add the following information:

```Javascript
'use strict';
/**
* Module dependencies.
*/
var fs = require('fs');
var path = require('path');
var util = require('util');
var assert = require('assert-plus');
var mongoose = require('mongoose/');
var bunyan = require('bunyan');
var restify = require('restify');
var config = require('./config');
var passport = require('passport');
var OIDCBearerStrategy = require('passport-azure-ad').BearerStrategy;
```

Save the file. You will return to it later.

## Create a config.js file to store your Azure AD settings

This code file passes the configuration parameters from your Azure AD Portal to the `Passport.js` file. You created these configuration values when you added the web API to the portal in the first part of the walk-through. We will explain what to put in the values of these parameters after you copy the code.

From the command line, change your directory to `azuread`, if it's not already there:

`cd azuread`

Create a `config.js` file in an editor. Add the following information:

```Javascript
// Don't commit this file to your public repos. This config is for first-run
exports.creds = {
mongoose_auth_local: 'mongodb://localhost/tasklist', // Your mongo auth uri goes here
audience: '<your audience URI>',
identityMetadata: 'https://login.microsoftonline.com/common/.well-known/openid-configuration', // For using Microsoft you should never need to change this.
tenantName:'<tenant name>',
policyName:'b2c_1_<sign in policy name>',
};

```

[AZURE.INCLUDE [active-directory-b2c-devquickstarts-tenant-name](../../includes/active-directory-b2c-devquickstarts-tenant-name.md)]

### Required values

`IdentityMetadata`: This is where `passport-azure-ad` will look for your configuration data for the identity provider. It will also look here for the keys to validate the JSON web tokens. You probably don't want to change this if you use Azure AD.

`audience`: The uniform resource identifier (URI) from the portal that identifies your service. Our sample uses  `http://localhost/TodoListService`.

`tenantName`: Your tenant name (for example, **contoso.onmicrosoft.com**).

`policyName`: The policy that you want to validate the tokens coming in to your server. This should be the same policy that you use on the client application for sign-in.

> [AZURE.NOTE] For our B2C preview, use the same policies across both client and server setup. If you have already completed a walk-through and created these policies, you don't need to do so again. Because you completed the walk-through, you shouldn't need to set up new policies for client walk-throughs on the site.

## Add configuration to your server.js file

You need to read the values from the `config.js` file you just created across your application. To do this, add the `.config` file as a required resource in your application, and then set the global variables to those in the `config.js` document.

From the command line, change your directory to `azuread`, if it's not already there:

`cd azuread`

Open the `server.js` file in an editor. Add the following information:

```Javascript
var config = require('./config');
```
Add a new section to `server.js` that includes the following code:

```Javascript
// We pass these options in to the ODICBearerStrategy.
var options = {
// The URL of the metadata document for your app. We will put the keys for token validation from the URL found in the jwks_uri tag of the in the metadata.
    identityMetadata: config.creds.identityMetadata,
    clientID: config.creds.clientID,
    tenantName: config.creds.tenantName,
    policyName: config.creds.policyName,
    validateIssuer: config.creds.validateIssuer,
    audience: config.creds.audience
};
// array to hold logged-in users and the current logged-in user (owner)
var users = [];
var owner = null;
// Our logger
var log = bunyan.createLogger({
name: 'Microsoft Azure Active Directory Sample'
});
```

## Add the MongoDB model and schema information by using Mongoose

The earlier preparation will pay off as you bring these three files together in a REST API service.

For this walk-through, use MongoDB to store your tasks, as discussed earlier.

In the `config.js` file you created, you called your database **tasklist**. That was also what you put at the end of the `mongoose_auth_local` connection URL. You don't need to create this database beforehand in MongoDB. It will create the database for you on the first run of your server application, if it doesn't already exist.

After you tell the server which MongoDB database to use, you need to write some additional code to create the model and schema for your server tasks.

### Expand the model

This schema model is very simple. You can expand it as required.

`name`: Who is assigned to the task. This is a **string**.

`task`: The task itself. This is a **string**.

`date`: The date that the task is due. This is a **datetime**.

`completed`: Whether the task is complete or not. This is a **Boolean**.

### Create the schema in the code

From the command line, change your directory to `azuread`, if it's not already there:

`cd azuread`

Open the `server.js` file in an editor. Add the following information below the configuration entry:

```Javascript
// MongoDB setup
// Set up some configuration
var serverPort = process.env.PORT || 8080;
var serverURI = (process.env.PORT) ? config.creds.mongoose_auth_mongohq : config.creds.mongoose_auth_local;
// Connect to MongoDB
global.db = mongoose.connect(serverURI);
var Schema = mongoose.Schema;
log.info('MongoDB Schema loaded');
```
This will connect to the MongoDB server and hand back a schema object.

### Use the schema to create the model in the code

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
You first create the schema, and then you create a model object that you will use to store your data throughout the code when you define your **routes**.

## Add routes for your REST API task server

Now that you have a database model to work with, add the routes you will use for your REST API server.

### About routes in Restify

Routes work in Restify in exactly the same way that they work when they use the Express stack. You define routes by using the URI that you expect the client applications to call. In most cases, you should define your routes in a separate file. For the purposes of this tutorial, you will put your routes in the `server.js` file. We recommend that you factor these into their own file for production use.

A typical pattern for a Restify route is:

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

This is the pattern at its most basic level. Restify and Express can provide much deeper functionality, such as defining application types and doing complex routing across different endpoints. For the purposes of this tutorial, we will keep these routes simple.

#### Add default routes to your server

You will now add the basic CRUD routes of **create**, **retrieve**, **update**, and **delete**.

From the command line, change your directory to `azuread`, if it's not already there:

`cd azuread`

Open the `server.js` file in an editor. Add the following information below the database entries you made above:

```Javascript
/**
*
* APIs for our REST task server
*/
// Create a task
function createTask(req, res, next) {
// Restify currently has a bug that doesn't allow you to set default headers
// The headers comply with CORS and allow us to mongodbServer our response to any origin
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
// Restify currently has a bug that doesn't allow you to set default headers
// The headers comply with CORS and allow us to mongodbServer our response to any origin
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

#### Add error handling for the routes

You should add some error handling, so that you can communicate any problems you encounter back to the client in a way that it can understand.

Add the following code below the code you wrote above:

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


## Create your server

You have now defined your database and put your routes in place. The last thing for you to do is to add the server instance that will manage your calls.

Restify and Express provide deep customization for a REST API server, but you will use the most basic setup here.

```Javascript
/**
* Our server
*/
var server = restify.createServer({
name: "Microsoft Azure Active Directory TODO Server",
version: "2.0.1"
});
// Ensure that we don't drop data on uploads
server.pre(restify.pre.pause());
// Clean up sloppy paths like //todo//////1//
server.pre(restify.pre.sanitizePath());
// Handle annoying user agents (curl)
server.pre(restify.pre.userAgentConnection());
// Set a per request bunyan logger (with requestid filled in)
server.use(restify.requestLogger());
// Allow five requests/second by IP, and burst to 10
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
## Add the routes to the server (without authentication)

```Javascript
/// Now the real handlers. Here we just CRUD
/**
/*
/* Each of these handlers is protected by our OIDCBearerStrategy by invoking 'oidc-bearer'
/* in the passport.authenticate() method. We set 'session: false' as REST is stateless and
/* we don't need to maintain session state. You can experiment with removing API protection
/* by removing the passport.authenticate() method like this:
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
## Run the server before you add OAuth support

You should test your server before you add authentication.

The easiest way to do this is by using `curl` in a command line. But before you do that, you need a simple utility that allows you to parse output as JSON. First, install the JSON tool.

`$npm install -g jsontool`

This installs the JSON tool globally. After you install the JSON tool, test the server:

Make sure that your MongoDB instance is running.

`$sudo mongodb`

Change to the `azuread` directory and use `curl`.

`$ cd azuread`
`$ node server.js`

`$ curl -isS http://127.0.0.1:8080 | json`

```Shell
HTTP/1.1 200 OK
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

Add a task:

`$ curl -isS -X POST http://127.0.0.1:8080/tasks/brandon/Hello`

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
You can list tasks for the user "Brandon" this way:

`$ curl -isS http://127.0.0.1:8080/tasks/brandon/`

If this works out, you are ready to add OAuth to the REST API server.

You have a REST API server with MongoDB.

## Add authentication to your REST API server

Now that you have a running REST API server, you can make it useful against Azure AD.

From the command line, change your directory to `azuread`, if it's not already there:

`cd azuread`

### Use the OIDCBearerStrategy that is included with passport-azure-ad

So far, you have built a typical REST ToDo server without any kind of authorization. Now you can start to put together the authorization.

First, you need to indicate that you want to use Passport. Add this directly below your other server configuration:

```Javascript
// Let's start using Passport.js

server.use(passport.initialize()); // Starts Passport
server.use(passport.session()); // Provides session support
```

> [AZURE.TIP]
When you write APIs, you should always link the data to something unique from the token that the user can’t spoof. When the server stores ToDo items, it does so based on the **Object ID** of the user in the token (called through token.oid) which goes in in the “owner” field. This ensures that only the user can access his ToDo items, and that no one else can access the ToDo items that have been entered. There is no exposure in the API of “owner,” so an external user can request others’ ToDo items even if they are authenticated.

Next, use the bearer strategy that comes with `passport-azure-ad`. (We'll just look at the code for now.) Put this after what you pated above:

```Javascript
/**
/*
/* Calling the OIDCBearerStrategy and managing users
/*
/* Passport pattern provides the need to manage users and info tokens
/* with a FindorCreate() method that must be provided by the implementer.
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
log.info(token, 'was the token retrieved');
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

Passport uses a pattern for all of its strategies (including Twitter and Facebook) that is similar to the strategies all strategy writers adhere to. You pass it a `function()` that has `token` and `done` as parameters. The strategy will come back to you after it has done all of its work. You should then store the user and save the token so that you don’t need to ask for it again.

> [AZURE.IMPORTANT]
The code above takes any user who happens to authenticate to your server. This is known as autoregistration. In production servers, you wouldn’t want to let in any users without first having them go through a registration process you have decided on. This is usually the pattern you see in consumer apps that allow you to register by using Facebook but then ask you to fill out additional information. If this wasn’t a command-line program, we could have extracted the email from the token object that is returned and then asked users to fill out additional information. Because this is a test server, we simply add them to the in-memory database.

### Protect endpoints

You protect endpoints when you specify the `passport.authenticate()` call by using the protocol you want to use.

You can edit the route in your server code to do something more interesting:

```Javascript
server.get('/tasks', passport.authenticate('oauth-bearer', {
session: false
}), listTasks);
server.get('/tasks', passport.authenticate('oauth-bearer', {
session: false
}), listTasks);
server.get('/tasks/:owner', passport.authenticate('oauth-bearer', {
session: false
}), getTask);
server.head('/tasks/:owner', passport.authenticate('oauth-bearer', {
session: false
}), getTask);
server.post('/tasks/:owner/:task', passport.authenticate('oauth-bearer', {
session: false
}), createTask);
server.post('/tasks', passport.authenticate('oauth-bearer', {
session: false
}), createTask);
server.del('/tasks/:owner/:task', passport.authenticate('oauth-bearer', {
session: false
}), removeTask);
server.del('/tasks/:owner', passport.authenticate('oauth-bearer', {
session: false
}), removeTask);
server.del('/tasks', passport.authenticate('oauth-bearer', {
session: false
}), removeTask);
server.del('/tasks', passport.authenticate('oauth-bearer', {
session: false
}), removeAll, function respond(req, res, next) {
res.send(204);
next();
});
```

## Run your server application again to verify that it rejects you

You can use `curl` again to see if you now have OAuth2 protection against your endpoints. Do this before you run any of your our client SDKs against this endpoint. The headers that are returned should be enough to tell you that you are on the right path.

Make sure that your MongoDB instance is running:

	$sudo mongodb

Change to the directory and use `curl`:

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

A 401 error is the response you want. It indicates that the Passport layer is trying to redirect to the authorize endpoint.


## You now have a REST API service that uses OAuth2

You have gone as far as you can with this server without using an OAuth2-compatible client. For that, you will need an additional walk-through.

If you are looking just for information on how to implement a REST API by using Restify and OAuth2, you now have sufficient code so that you can continue to develop your service and build on this example.

For reference, the completed sample (without your configuration values) [is provided as a .zip file](https://github.com/AzureADQuickStarts/B2C-WebAPI-nodejs/archive/complete.zip). You can also clone it from GitHub:

```git clone --branch complete https://github.com/AzureADQuickStarts/B2C-WebAPI-nodejs.git```


## Next steps

You can now move to more advanced topics, such as:

[Connect to a web API by using iOS with B2C](active-directory-b2c-devquickstarts-ios.md)

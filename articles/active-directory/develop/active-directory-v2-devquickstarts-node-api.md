---
title: Secure an Azure Active Directory v2.0 web API by using Node.js | Microsoft Docs
description: Learn how to build a Node.js web API that accepts tokens both from a personal Microsoft account and from work or school accounts.
services: active-directory
documentationcenter: nodejs
author: xerners
manager: mbaldwin
editor: ''

ms.assetid: 0b572fc1-2aaf-4cb6-82de-63010fb1941d
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: javascript
ms.topic: article
ms.date: 09/16/2016
ms.author: xerners

---
# Secure a web API by using Node.js
> [!NOTE]
> Not all Azure Active Directory scenarios and features work with the v2.0 endpoint. To determine whether you should use the v2.0 endpoint or the v1.0 endpoint, read about [v2.0 limitations](active-directory-v2-limitations.md).
> 
> 

When you use the Azure Active Directory (Azure AD) v2.0 endpoint, you can use [OAuth 2.0](active-directory-v2-protocols.md) access tokens to protect your web API. With OAuth 2.0 access tokens, users who have both a personal Microsoft account and work or school accounts can securely access your web API.

*Passport* is authentication middleware for Node.js. Flexible and modular, Passport can be unobtrusively dropped into any Express-based or restify web application. In Passport, a comprehensive set of strategies support authentication by using a username and password, Facebook, Twitter, or other options. We have developed a strategy for Azure AD. In this article, we show you how to install the module, and then add the Azure AD `passport-azure-ad` plug-in.

## Download
The code for this tutorial is maintained [on GitHub](https://github.com/AzureADQuickStarts/AppModelv2-WebAPI-nodejs). To follow the tutorial, you can [download the app's skeleton as a .zip file](https://github.com/AzureADQuickStarts/AppModelv2-WebAPI-nodejs/archive/skeleton.zip), or clone the skeleton:

```git clone --branch skeleton https://github.com/AzureADQuickStarts/AppModelv2-WebAPI-nodejs.git```

You also can get the completed application at the end of this tutorial.

## 1: Register an app
Create a new app at [apps.dev.microsoft.com](https://apps.dev.microsoft.com/?referrer=https://azure.microsoft.com/documentation/articles&deeplink=/appList), or follow [these detailed steps](active-directory-v2-app-registration.md) to register an app. Make sure you:

* Copy the **Application Id** assigned to your app. You'll need it for this tutorial.
* Add the **Mobile** platform for your app.
* Copy the **Redirect URI** from the portal. You must use the default URI value of `urn:ietf:wg:oauth:2.0:oob`.

## 2: Install Node.js
To use the sample for this tutorial, you must [install Node.js](http://nodejs.org).

## 3: Install MongoDB
To successfully use this sample, you must [install MongoDB](http://www.mongodb.org). In this sample, you use MongoDB to make your REST API persistent across server instances.

> [!NOTE]
> In this article, we assume that you use the default installation and server endpoints for MongoDB: mongodb://localhost.
> 
> 

## 4: Install the restify modules in your web API
We use Resitfy to build our REST API. Restify is a minimal and flexible Node.js application framework that's derived from Express. Restify has a robust set of features that you can use to build REST APIs on top of Connect.

### Install restify
1.  At a command prompt, change the directory to **azuread**:

    `cd azuread`

    If the **azuread** directory does not exist, create it:

    `mkdir azuread`

2.  Install restify:

    `npm install restify`

    The output of this command should look like this:

    ```
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
    ```

#### Did you get an error?
On some operating systems, when you use the `npm` command, you might see this message: `Error: EPERM, chmod '/usr/local/bin/..'`. The error is followed by a request that you try running the account as an administrator. If this occurs, use the command `sudo` to run `npm` at a higher privilege level.

#### Did you get an error related to DTrace?
When you install restify, you might see this message:

```Shell
clang: error: no such file or directory: 'HD/azuread/node_modules/restify/node_modules/dtrace-provider/libusdt'
make: *** [Release/DTraceProviderBindings.node] Error 1
gyp ERR! build error
gyp ERR! stack Error: `make` failed with exit code: two
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

Restify has a powerful mechanism to trace REST calls by using DTrace. However, DTrace is not available on many operating systems. You can safely ignore this error message.


## 5: Install Passport.js in your web API
1.  At the command prompt, change the directory to **azuread**.

2.  Install Passport.js:

    `npm install passport`

    The output of the command should look like this:

    ```
     passport@0.1.17 node_modules\passport
    ├── pause@0.0.1
    └── pkginfo@0.2.3
    ```

## 6: Add passport-azure-ad to your web API
Next, add the OAuth strategy, by using passport-azuread. `passport-azuread` is a suite of strategies that connect Azure AD with Passport. We use this strategy for bearer tokens in this REST API sample.

> [!NOTE]
> Although OAuth 2.0 provides a framework in which any known token type can be issued, certain token types are commonly used. Bearer tokens are commonly used to protect endpoints. Bearer tokens are the most widely issued type of token in OAuth 2.0. Many OAuth 2.0 implementations assume that bearer tokens are the only type of token issued.
> 
> 

1.  At a command prompt, change the directory to **azuread**.

    `cd azuread`

2.  Install the Passport.js `passport-azure-ad` module:

    `npm install passport-azure-ad`

    The output of the command should look like this:

    ```
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
    ```

## 7: Add MongoDB modules to your web API
In this sample, we use MongoDB as our data store. 

1.  Install Mongoose, a widely used plug-in, to manage models and schemas: 

    `npm install mongoose`

2.  Install the database driver for MongoDB, which is also called MongoDB:

    `npm install mongodb`

## 8: Install additional modules
Install the remaining required modules.

1.  At a command prompt, change the directory to **azuread**:

    `cd azuread`

2.  Enter the following commands. The commands install the following modules in your node_modules directory:

    *   `npm install crypto`
    *   `npm install assert-plus`
    *   `npm install posix-getopt`
    *   `npm install util`
    *   `npm install path`
    *   `npm install connect`
    *   `npm install xml-crypto`
    *   `npm install xml2js`
    *   `npm install xmldom`
    *   `npm install async`
    *   `npm install request`
    *   `npm install underscore`
    *   `npm install grunt-contrib-jshint@0.1.1`
    *   `npm install grunt-contrib-nodeunit@0.1.2`
    *   `npm install grunt-contrib-watch@0.2.0`
    *   `npm install grunt@0.4.1`
    *   `npm install xtend@2.0.3`
    *   `npm install bunyan`
    *   `npm update`

## 9: Create a Server.js file for your dependencies
A Server.js file holds the majority of the functionality for your web API server. Add most of your code to this file. For production purposes, you can refactor the functionality into smaller files, like for separate routes and controllers. In this article, we use Server.js for this purpose.

1.  At a command prompt, change the directory to **azuread**:

    `cd azuread`

2.  Using an editor of your choice, create a Server.js file. Add the following information to the file:

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

3.  Save the file. You will return to it shortly.

## 10: Create a config file to store your Azure AD settings
This code file passes the configuration parameters from your Azure AD portal to Passport.js. You created these configuration values when you added the web API to the portal at the beginning of the article. After you copy the code, we'll explain what to put in the values of these parameters.

1.  At a command prompt, change the directory to **azuread**:

    `cd azuread`

2.  In an editor, create a Config.js file. Add the following information:

    ```Javascript
    // Don't commit this file to your public repos. This config is for first-run.
    exports.creds = {
    mongoose_auth_local: 'mongodb://localhost/tasklist', // Your Mongo auth URI goes here.
    issuer: 'https://sts.windows.net/**<your application id>**/',
    audience: '<your redirect URI>',
    identityMetadata: 'https://login.microsoftonline.com/common/.well-known/openid-configuration' // For Microsoft, you should never need to change this.
    };

    ```



### Required values

*   **IdentityMetadata**: This is where `passport-azure-ad` looks for your configuration data for the identity provider (IDP) and the keys to validate the JSON Web Tokens (JWTs). If you are using Azure AD, you probably don't want to change this.

*   **audience**: Your redirect URI from the portal.

> [!NOTE]
> Roll your keys at frequent intervals. Be sure that you always pull from the "openid_keys" URL, and that the app can access the Internet.
> 
> 

## 11: Add the configuration to your Server.js file
Your application needs to read the values from the config file you just created. Add the .config file as a required resource in your application. Set the global variables to those that are in Config.js.

1.  At the command prompt, change the directory to **azuread**:

    `cd azuread`

2.  In an editor, open Server.js. Add the following information:

    ```Javascript
    var config = require('./config');
    ```

3.  Add a new section to Server.js:

    ```Javascript
    // Pass these options in to the ODICBearerStrategy.
    var options = {
    // The URL of the metadata document for your app. Put the keys for token validation from the URL found in the jwks_uri tag in the metadata.
    identityMetadata: config.creds.identityMetadata,
    issuer: config.creds.issuer,
    audience: config.creds.audience
    };
    // Array to hold signed-in users and the current signed-in user (owner).
    var users = [];
    var owner = null;
    // Your logger
    var log = bunyan.createLogger({
    name: 'Microsoft Azure Active Directory Sample'
    });
    ```

## 12: Add the MongoDB model and schema information by using Mongoose
Next, connect these three files in a REST API service.

In this article, we use MongoDB to store our tasks. We discuss this in *step 4*.

In the Config.js file you created in step 11, your database is called *tasklist*. That was what you put at the end of your mongoose_auth_local connection URL. You don't need to create this database beforehand in MongoDB. The database is created on the first run of your server application (assuming the database does not already exist).

You've told the server what MongoDB database to use. Next, you need to write some additional code to create the model and schema for your server's tasks.

### The model
The schema model is very basic. You can expand it if you need to. 

The schema model has these values:

*   **NAME**. The person assigned to the task. This is a **string** value.
*   **TASK**. The name of the task. This is a **string** value.
*   **DATE**. The date that the task is due. This is a **datetime** value.
*   **COMPLETED**. Whether the task is completed. This is a **Boolean** value.

### Create the schema in the code
1.  At a command prompt, change the directory to **azuread**:

    `cd azuread`

2.  In your editor, open Server.js. Below the configuration entry, add the following information:

    ```Javascript
    // MongoDB setup.
    // Set up some configuration.
    var serverPort = process.env.PORT || 8080;
    var serverURI = (process.env.PORT) ? config.creds.mongoose_auth_mongohq : config.creds.mongoose_auth_local;
    // Connect to MongoDB.
    global.db = mongoose.connect(serverURI);
    var Schema = mongoose.Schema;
    log.info('MongoDB Schema loaded');
    ```

This code connects to the MongoDB server. It also returns a schema object.

#### Using the schema, create your model in the code
Below the preceding code, add the following code:

```Javascript
// Create a basic schema to store your tasks and users.
var TaskSchema = new Schema({
owner: String,
task: String,
completed: Boolean,
date: Date
});
// Use the schema to register a model.
mongoose.model('Task', TaskSchema);
var Task = mongoose.model('Task');
```

As you can tell from the code, first you create your schema. Next, you create a model object. You use the model object to store your data throughout the code when you define your **routes**.

## 13: Add your routes for your task REST API server
Now that you have a database model to work with, add the routes you'll use for your REST API server.

### About routes in restify
Routes in restify work exactly the same way they do when you use the Express stack. You define routes by using the URI that you expect the client applications to call. Usually, you define your routes in a separate file. In this tutorial, we put our routes in Server.js. For production use, we recommend that you factor routes into their own file.

A typical pattern for a restify route is:

```Javascript
function createObject(req, res, next) {
// Do work on object.
_object.name = req.params.object; // Passed value is in req.params under object.
///...
return next(); // Keep the server going.
}
....
server.post('/service/:add/:object', createObject); // calls createObject on routes that match this.
```


This is the pattern at the most basic level. Restify (and Express) provide much deeper functionality, like the ability to define application types, and complex routing across different endpoints.

#### Add default routes to your server
Add the basic CRUD routes: **create**, **retrieve**, **update**, and **delete**.

1.  At a command prompt, change the directory to **azuread**:

    `cd azuread`

2.  In an editor, open Server.js. Below the database entries you made earlier, add the following information:

    ```Javascript
    /**
    *
    * APIs for your REST task server
    */
    // Create a task.
    function createTask(req, res, next) {
    // Resitify currently has a bug that doesn't allow you to set default headers.
    // These headers comply with CORS, and allow you to use MongoDB Server as your response to any origin.
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    // Create a new task model, fill it, and save it to MongoDB.
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
    // Delete a task by name.
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
    // Delete all tasks.
    function removeAll(req, res, next) {
    Task.remove();
    res.send(204);
    return next();
    }
    // Get a specific task based on name.
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
    /// Returns the list of TODOs that were loaded.
    function listTasks(req, res, next) {
    // Resitify currently has a bug that doesn't allow you to set default headers.
    // These headers comply with CORS, and allow us to use MongoDB Server as our response to any origin.
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
    log.warn(err, "There are no tasks in the database. Add one!");
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

### Add error handling for the routes
Add some error handling so you can communicate back to the client about the problem you encountered.

Add the following code below the code, which you've already written:

```Javascript
///--- Errors for communicating something more information back to the client.
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


## 14: Create your server
The last thing to do is to add your server instance. The server instance manages your calls.

Restify (and Express) have deep customization that you can use with a REST API server. In this tutorial, we use the most basic setup.

```Javascript
/**
* Your server
*/
var server = restify.createServer({
name: "Microsoft Azure Active Directory TODO Server",
version: "2.0.1"
});
// Ensure that you don't drop data on uploads.
server.pre(restify.pre.pause());
// Clean up imprecise paths like //todo//////1//.
server.pre(restify.pre.sanitizePath());
// Handle annoying user agents (curl).
server.pre(restify.pre.userAgentConnection());
// Set a per-request Bunyan logger (with requestid filled in).
server.use(restify.requestLogger());
// Allow 5 requests/second by IP address, and burst to 10.
server.use(restify.throttle({
burst: 10,
rate: 5,
ip: true,
}));
// Use common commands, such as:
server.use(restify.acceptParser(server.acceptable));
server.use(restify.dateParser());
server.use(restify.queryParser());
server.use(restify.gzipResponse());
server.use(restify.bodyParser({
mapParams: true
}));
```
## 15: Add the routes (without authentication, for now)
```Javascript
/// Use CRUD to add the real handlers.
/**
/*
/* Each of these handlers is protected by your Open ID Connect Bearer strategy. Invoke 'oidc-bearer'
/* in the pasport.authenticate() method. Because REST is stateless, set 'session: false'. You 
/* don't need to maintain session state. You can experiment with removing API protection.
/* To do this, remove the passport.authenticate() method:
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
## 16: Run the server
It's a good idea to test your server before you add authentication.

The easiest way to test your server is by using curl at a command prompt. To do this, you need a simple utility that you can use to parse output as JSON. 

1.  Install the JSON tool that we use in the following examples:

    `$npm install -g jsontool`

    This installs the JSON tool globally.

2.  Make sure that your MongoDB instance is running:

    `$sudo mongod`

3.  Change the directory to **azuread**, and then run curl:

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

4.  To add a task:

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

5.  List tasks for Brandon:

    `$ curl -isS http://127.0.0.1:8080/tasks/brandon/`

If all these commands run without errors, you are ready to add OAuth to the REST API server.

*You now have a REST API server with MongoDB!*

## 17: Add authentication to your REST API server
Now that you have a running REST API, set it up to use it with Azure AD.

At a command prompt, change the directory to **azuread**:

`cd azuread`

### Use the oidcbearerstrategy that's included with passport-azure-ad
So far, you've built a typical REST TODO server without any kind of authorization. Now, add authentication.

First,  indicate that you want to use Passport. Put this right after your earlier server configuration:

```Javascript
// Start using Passport.js.

server.use(passport.initialize()); // Starts passport
server.use(passport.session()); // Provides session support
```

> [!TIP]
> When you write APIs, it's a good idea to always link the data to something unique from the token that the user can’t spoof. When this server stores TODO items, it stores them based on the user subscription ID in the token (called through token.sub). You put the token.sub in the “owner” field. This ensures that only that user can access the user's TODOs. No one else can access the TODOs that were entered. There is no exposure in the API for “owner.” An external user can request other users' TODOs, even if they are authenticated.
> 
> 

Next, use the Open ID Connect Bearer strategy that comes with `passport-azure-ad`. Put this after what you pasted earlier:

```Javascript
/**
/*
/* Calling the OIDCBearerStrategy and managing users.
/*
/* Because of the Passport pattern, you need to manage users and info tokens
/* with a FindorCreate() method. The method must be provided by the implementor.
/* In the following code, you autoregister any user and implement a FindById().
/* It's a good idea to do something more advanced.
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
log.info('User was added automatically, because they were new. Their sub is: ', token.sub);
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

Passport uses a similar pattern for all its strategies (Twitter, Facebook, and so on). All strategy writers adhere to the pattern. Pass the strategy a `function()` that uses a token and `done` as parameters. The strategy is returned after it does all its work. Store the user and stash the token so you don’t need to ask for it again.

> [!IMPORTANT]
> The preceding code takes any user that can authenticate to your server. This is known as auto-registration. On a production server, you wouldn’t want to let anyone in without first having them go through a registration process that you choose. This is usually the pattern you see in consumer apps. The app might allow you to register with Facebook, but then it asks you to enter additional information. If you weren't using a command-line program for this tutorial, you could extract the email from the token object that is returned. Then, you might ask the user to enter additional information. Because this is a test server, you add the user directly to the in-memory database.
> 
> 

### Protect endpoints
Protect endpoints by specifying the **passport.authenticate()** call with the protocol that you want to use.

You can edit your route in your server code for a more advanced option:

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

## 18: Run your server application again
Use curl again to see if you have OAuth 2.0 protection against your endpoints. Do this before you run any of your client SDKs against this endpoint. The headers returned should tell you if your authentication is working correctly.

1.  Make sure that your MongoDB isntance is running:

    `$sudo mongod`

2.  Change to the **azuread** directory, and then use curl:

    `$ cd azuread`

    `$ node server.js`

3.  Try a basic POST:

    `$ curl -isS -X POST http://127.0.0.1:8080/tasks/brandon/Hello`

    ```Shell
    HTTP/1.1 401 Unauthorized
    Connection: close
    WWW-Authenticate: Bearer realm="Users"
    Date: Tue, 14 Jul 2015 05:45:03 GMT
    Transfer-Encoding: chunked
    ```

A 401 response indicates that the Passport layer is trying to redirect to the authorize endpoint, which is exactly what you want.

*You now have a REST API service that uses OAuth 2.0!*

You've gone as far as you can with this server without using an OAuth 2.0-compatible client. For that, you will need to review an additional tutorial.

## Next steps
For reference, the completed sample (without your configuration values) is provided as [a .zip file](https://github.com/AzureADQuickStarts/AppModelv2-WebAPI-nodejs/archive/complete.zip). You also can clone it from GitHub:

```git clone --branch complete https://github.com/AzureADQuickStarts/AppModelv2-WebAPI-nodejs.git```

Now, you can move on to more advanced topics. You might want to try [Secure a Node.js web app using the v2.0 endpoint](active-directory-v2-devquickstarts-node-web.md).

Here are some additional resources:

* [Azure AD v2.0 developer guide](active-directory-appmodel-v2-overview.md)
* [Stack Overflow "azure-active-directory" tag](http://stackoverflow.com/questions/tagged/azure-active-directory)

### Get security updates for our products
We encourage you to sign up to be notified when security incidents occur. On the [Microsoft Technical Security Notifications](https://technet.microsoft.com/security/dd252948) page, subscribe to Security Advisories Alerts.


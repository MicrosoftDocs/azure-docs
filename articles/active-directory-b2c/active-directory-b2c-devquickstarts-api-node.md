---
title: 'Azure AD B2C: Secure a web API by using Node.js | Microsoft Docs'
description: How to build a Node.js web API that accepts tokens from a B2C tenant
services: active-directory-b2c
documentationcenter: ''
author: dstrockis
manager: mbaldwin
editor: ''

ms.assetid: fc2b9af8-fbda-44e0-962a-8b963449106a
ms.service: active-directory-b2c
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: javascript
ms.topic: hero-article
ms.date: 01/07/2017
ms.author: xerners

---
# Azure AD B2C: Secure a web API by using Node.js
<!-- TODO [AZURE.INCLUDE [active-directory-b2c-devquickstarts-web-switcher](../../includes/active-directory-b2c-devquickstarts-web-switcher.md)]-->

With Azure Active Directory (Azure AD) B2C, you can secure a web API by using OAuth 2.0 access tokens. These tokens allow your client apps that use Azure AD B2C to authenticate to the API. This article shows you how to create a "to-do list" API that allows users to add and list tasks. The web API is secured using Azure AD B2C and only allows authenticated users to manage their to-do list.

> [!NOTE]
> This sample was written to be connected to by using our [iOS B2C sample application](active-directory-b2c-devquickstarts-ios.md). Do the current walk-through first, and then follow along with that sample.
>
>

**Passport** is authentication middleware for Node.js. Flexible and modular, Passport can be unobtrusively installed in any Express-based or Restify web application. A comprehensive set of strategies supports authentication by using a user name and password, Facebook, Twitter, and more. We have developed a strategy for Azure Active Directory (Azure AD). You install this module and then add the Azure AD `passport-azure-ad` plug-in.

To do this sample, you need to:

1. Register an application with Azure AD.
2. Set up your application to use Passport's `azure-ad-passport` plug-in.
3. Configure a client application to call the "to-do list" web API.

## Get an Azure AD B2C directory
Before you can use Azure AD B2C, you must create a directory, or tenant.  A directory is a container for all users, apps, groups, and more.  If you don't have one already, [create a B2C directory](active-directory-b2c-get-started.md) before you continue.

## Create an application
Next, you need to create an app in your B2C directory that gives Azure AD some information that it needs to securely communicate with your app. In this case, both the client app and web API are represented by a single **Application ID**, because they comprise one logical app. To create an app, follow [these instructions](active-directory-b2c-app-registration.md). Be sure to:

* Include a **web app/web api** in the application
* Enter `http://localhost/TodoListService` as a **Reply URL**. It is the default URL for this code sample.
* Create an **Application secret** for your application and copy it. You need this data later. Note that this value needs to be [XML escaped](https://www.w3.org/TR/2006/REC-xml11-20060816/#dt-escape) before you use it.
* Copy the **Application ID** that is assigned to your app. You need this data later.

[!INCLUDE [active-directory-b2c-devquickstarts-v2-apps](../../includes/active-directory-b2c-devquickstarts-v2-apps.md)]

## Create your policies
In Azure AD B2C, every user experience is defined by a [policy](active-directory-b2c-reference-policies.md). This app contains two identity experiences: sign up and sign in. You need to create one policy of each type, as described in the
[policy reference article](active-directory-b2c-reference-policies.md#create-a-sign-up-policy).  When you create your three policies, be sure to:

* Choose the **Display name** and other sign-up attributes in your sign-up policy.
* Choose the **Display name** and **Object ID** application claims in every policy.  You can choose other claims as well.
* Copy down the **Name** of each policy after you create it. It should have the prefix `b2c_1_`.  You need those policy names later.

[!INCLUDE [active-directory-b2c-devquickstarts-policy](../../includes/active-directory-b2c-devquickstarts-policy.md)]

After you have created your three policies, you're ready to build your app.

To learn about how policies work in Azure AD B2C, start with the [.NET web app getting started tutorial](active-directory-b2c-devquickstarts-web-dotnet.md).

## Download the code
The code for this tutorial [is maintained on GitHub](https://github.com/AzureADQuickStarts/B2C-WebAPI-NodeJS). To build the sample as you go, you can [download a skeleton project as a .zip file](https://github.com/AzureADQuickStarts/B2C-WebAPI-NodeJS/archive/skeleton.zip). You can also clone the skeleton:

```
git clone --branch skeleton https://github.com/AzureADQuickStarts/B2C-WebAPI-NodeJS.git
```

The completed app is also [available as a .zip file](https://github.com/AzureADQuickStarts/B2C-WebAPI-NodeJS/archive/complete.zip) or on the `complete` branch of the same repository.

## Download Node.js for your platform
To successfully use this sample, you need a working installation of Node.js.

Install Node.js from [nodejs.org](http://nodejs.org).

## Install MongoDB for your platform
To successfully use this sample, you need a working installation of MongoDB. We use MongoDB to make your REST API persistent across server instances.

Install MongoDB from [mongodb.org](http://www.mongodb.org).

> [!NOTE]
> This walk-through assumes that you use the default installation and server endpoints for MongoDB, which at the time of this writing is `mongodb://localhost`.
>
>

## Install the Restify modules in your web API
We use Restify to build your REST API. Restify is a minimal and flexible Node.js application framework derived from Express. It has a robust set of features for building REST APIs on top of Connect.

### Install Restify
From the command line, change your directory to `azuread`. If the `azuread` directory doesn't exist, create it.

`cd azuread` or `mkdir azuread;`

Enter the following command:

`npm install restify`

This command installs Restify.

#### Did you get an error?
In some operating systems, when you use `npm`, you may receive the error `Error: EPERM, chmod '/usr/local/bin/..'` and a request that you run the account as an administrator. If this problem occurs, use the `sudo` command to run `npm` at a higher privilege level.

#### Did you get a DTrace error?
You may see something like this text when you install Restify:

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

The output of the command should appear similar to this text:

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
From the command line, change your directory to `azuread`, if it's not already there.

Install Passport using the following command:

`npm install passport`

The output of the command should be similar to this text:

    passport@0.1.17 node_modules\passport
    ├── pause@0.0.1
    └── pkginfo@0.2.3

## Add passport-azuread to your web API
Next, add the OAuth strategy by using `passport-azuread`, a suite of strategies that connect Azure AD with Passport. Use this strategy for bearer tokens in the REST API sample.

> [!NOTE]
> Although OAuth2 provides a framework in which any known token type can be issued, only certain token types have gained widespread use. The tokens for protecting endpoints are bearer tokens. These types of tokens are the most widely issued in OAuth2. Many implementations assume that bearer tokens are the only type of token issued.
>
>

From the command line, change your directory to `azuread`, if it's not already there.

Install the Passport `passport-azure-ad` module using the following command:

`npm install passport-azure-ad`

The output of the command should be similar to this text:

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
This sample uses MongoDB as your data store. For that install Mongoose, a widely used plug-in for managing models and schemas.

* `npm install mongoose`

## Install additional modules
Next, install the remaining required modules.

From the command line, change your directory to `azuread`, if it's not already there:

`cd azuread`

Install the modules in your `node_modules` directory:

* `npm install assert-plus`
* `npm install ejs`
* `npm install ejs-locals`
* `npm install express`
* `npm install bunyan`

## Create a server.js file with your dependencies
The `server.js` file provides the majority of the functionality for your Web API server.

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

Save the file. You return to it later.

## Create a config.js file to store your Azure AD settings
This code file passes the configuration parameters from your Azure AD Portal to the `Passport.js` file. You created these configuration values when you added the web API to the portal in the first part of the walk-through. We explain what to put in the values of these parameters after you copy the code.

From the command line, change your directory to `azuread`, if it's not already there:

`cd azuread`

Create a `config.js` file in an editor. Add the following information:

```Javascript
// Don't commit this file to your public repos. This config is for first-run
exports.creds = {
clientID: <your client ID for this Web API you created in the portal>
mongoose_auth_local: 'mongodb://localhost/tasklist', // Your mongo auth uri goes here
audience: '<your audience URI>', // the Client ID of the application that is calling your API, usually a web API or native client
identityMetadata: 'https://login.microsoftonline.com/<tenant name>/.well-known/openid-configuration', // Make sure you add the B2C tenant name in the <tenant name> area
tenantName:'<tenant name>',
policyName:'b2c_1_<sign in policy name>' // This is the policy you'll want to validate against in B2C. Usually this is your Sign-in policy (as users sign in to this API)
passReqToCallback: false // This is a node.js construct that lets you pass the req all the way back to any upstream caller. We turn this off as there is no upstream caller.
};

```

[!INCLUDE [active-directory-b2c-devquickstarts-tenant-name](../../includes/active-directory-b2c-devquickstarts-tenant-name.md)]

### Required values
`clientID`: The client ID of your Web API application.

`IdentityMetadata`: This is where `passport-azure-ad` looks for your configuration data for the identity provider. It also looks for the keys to validate the JSON web tokens.

`audience`: The uniform resource identifier (URI) from the portal that identifies your calling application.

`tenantName`: Your tenant name (for example, **contoso.onmicrosoft.com**).

`policyName`: The policy that you want to validate the tokens coming in to your server. This policy should be the same policy that you use on the client application for sign-in.

> [!NOTE]
> For now, use the same policies across both client and server setup. If you have already completed a walk-through and created these policies, you don't need to do so again. Because you completed the walk-through, you shouldn't need to set up new policies for client walk-throughs on the site.
>
>

## Add configuration to your server.js file
To read the values from the `config.js` file you created, add the `.config` file as a required resource in your application, and then set the global variables to those in the `config.js` document.

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
    // The URL of the metadata document for your app. We put the keys for token validation from the URL found in the jwks_uri tag of the in the metadata.
    identityMetadata: config.creds.identityMetadata,
    clientID: config.creds.clientID,
    tenantName: config.creds.tenantName,
    policyName: config.creds.policyName,
    validateIssuer: config.creds.validateIssuer,
    audience: config.creds.audience,
    passReqToCallback: config.creds.passReqToCallback

};
```

Next, let's add some placeholders for the users we receive from our calling applications.

```Javascript
// array to hold logged in users and the current logged in user (owner)
var users = [];
var owner = null;
```

Let's go ahead and create our logger too.

```Javascript
// Our logger
var log = bunyan.createLogger({
    name: 'Microsoft Azure Active Directory Sample'
});
```

## Add the MongoDB model and schema information by using Mongoose
The earlier preparation pays off as you bring these three files together in a REST API service.

For this walk-through, use MongoDB to store your tasks, as discussed earlier.

In the `config.js` file, you called your database **tasklist**. That name was also what you put at the end of the `mongoose_auth_local` connection URL. You don't need to create this database beforehand in MongoDB. It creates the database for you on the first run of your server application.

After you tell the server which MongoDB database to use, you need to write some additional code to create the model and schema for your server tasks.

### Expand the model
This schema model is simple. You can expand it as required.

`owner`: Who is assigned to the task. This object is a **string**.  

`Text`: The task itself. This object is a **string**.

`date`: The date that the task is due. This object is a **datetime**.

`completed`: If the task is complete. This object is a **Boolean**.

### Create the schema in the code
From the command line, change your directory to `azuread`, if it's not already there:

`cd azuread`

Open the `server.js` file in an editor. Add the following information below the configuration entry:

```Javascript
// MongoDB setup
// Setup some configuration
var serverPort = process.env.PORT || 3000; // Note we are hosting our API on port 3000
var serverURI = (process.env.PORT) ? config.creds.mongoose_auth_mongohq : config.creds.mongoose_auth_local;

// Connect to MongoDB
global.db = mongoose.connect(serverURI);
var Schema = mongoose.Schema;
log.info('MongoDB Schema loaded');

// Here we create a schema to store our tasks and users. Pretty simple schema for now.
var TaskSchema = new Schema({
    owner: String,
    Text: String,
    completed: Boolean,
    date: Date
});

// Use the schema to register a model
mongoose.model('Task', TaskSchema);
var Task = mongoose.model('Task');
```
You first create the schema, and then you create a model object that you use to store your data throughout the code when you define your **routes**.

## Add routes for your REST API task server
Now that you have a database model to work with, add the routes you use for your REST API server.

### About routes in Restify
Routes work in Restify in the same way that they work when they use the Express stack. You define routes by using the URI that you expect the client applications to call.

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

Restify and Express can provide much deeper functionality, such as defining application types and doing complex routing across different endpoints. For the purposes of this tutorial, we keep these routes simple.

#### Add default routes to your server
You now add the basic CRUD routes of **create** and **list** for our REST API. Other routes can be found in the `complete` branch of the sample.

From the command line, change your directory to `azuread`, if it's not already there:

`cd azuread`

Open the `server.js` file in an editor. Below the database entries you made above add the following information:

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

    if (!req.params.Text) {
        req.log.warn({
            params: req.params
        }, 'createTodo: missing task');
        next(new MissingTaskError());
        return;
    }

    _task.owner = owner;
    _task.Text = req.params.Text;
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
```

```Javascript
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


#### Add error handling for the routes
Add some error handling so that you can communicate any problems you encounter back to the client in a way that it can understand.

Add the following code:

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
You have now defined your database and put your routes in place. The last thing for you to do is to add the server instance that manages your calls.

Restify and Express provide deep customization for a REST API server, but we use the most basic setup here.

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
})); // Allows for JSON mapping to REST
server.use(restify.authorizationParser()); // Looks for authorization headers

// Let's start using Passport.js

server.use(passport.initialize()); // Starts passport
server.use(passport.session()); // Provides session support


```
## Add the routes to the server (without authentication)
```Javascript
server.get('/api/tasks', passport.authenticate('oauth-bearer', {
    session: false
}), listTasks);
server.get('/api/tasks', passport.authenticate('oauth-bearer', {
    session: false
}), listTasks);
server.get('/api/tasks/:owner', passport.authenticate('oauth-bearer', {
    session: false
}), getTask);
server.head('/api/tasks/:owner', passport.authenticate('oauth-bearer', {
    session: false
}), getTask);
server.post('/api/tasks/:owner/:task', passport.authenticate('oauth-bearer', {
    session: false
}), createTask);
server.post('/api/tasks', passport.authenticate('oauth-bearer', {
    session: false
}), createTask);
server.del('/api/tasks/:owner/:task', passport.authenticate('oauth-bearer', {
    session: false
}), removeTask);
server.del('/api/tasks/:owner', passport.authenticate('oauth-bearer', {
    session: false
}), removeTask);
server.del('/api/tasks', passport.authenticate('oauth-bearer', {
    session: false
}), removeTask);
server.del('/api/tasks', passport.authenticate('oauth-bearer', {
    session: false
}), removeAll, function respond(req, res, next) {
    res.send(204);
    next();
});


// Register a default '/' handler

server.get('/', function root(req, res, next) {
    var routes = [
        'GET     /',
        'POST    /api/tasks/:owner/:task',
        'POST    /api/tasks (for JSON body)',
        'GET     /api/tasks',
        'PUT     /api/tasks/:owner',
        'GET     /api/tasks/:owner',
        'DELETE  /api/tasks/:owner/:task'
    ];
    res.send(200, routes);
    next();
});
```

```Javascript

server.listen(serverPort, function() {

    var consoleMessage = '\n Microsoft Azure Active Directory Tutorial';
    consoleMessage += '\n +++++++++++++++++++++++++++++++++++++++++++++++++++++';
    consoleMessage += '\n %s server is listening at %s';
    consoleMessage += '\n Open your browser to %s/api/tasks\n';
    consoleMessage += '+++++++++++++++++++++++++++++++++++++++++++++++++++++ \n';
    consoleMessage += '\n !!! why not try a $curl -isS %s | json to get some ideas? \n';
    consoleMessage += '+++++++++++++++++++++++++++++++++++++++++++++++++++++ \n\n';

    //log.info(consoleMessage, server.name, server.url, server.url, server.url);

});

```

## Add authentication to your REST API server
Now that you have a running REST API server, you can make it useful against Azure AD.

From the command line, change your directory to `azuread`, if it's not already there:

`cd azuread`

### Use the OIDCBearerStrategy that is included with passport-azure-ad
> [!TIP]
> When you write APIs, you should always link the data to something unique from the token that the user can’t spoof. When the server stores ToDo items, it does so based on the **oid** of the user in the token (called through token.oid), which goes in the “owner” field. This value ensures that only that user can access their own ToDo items. There is no exposure in the API of “owner,” so an external user can request others’ ToDo items even if they are authenticated.
>
>

Next, use the bearer strategy that comes with `passport-azure-ad`.

```Javascript
var findById = function(id, fn) {
    for (var i = 0, len = users.length; i < len; i++) {
        var user = users[i];
        if (user.oid === id) {
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
                log.info('User was added automatically as they were new. Their sub is: ', token.oid);
                users.push(token);
                owner = token.oid;
                return done(null, token);
            }
            owner = token.sub;
            return done(null, user, token);
        });
    }
);

passport.use(oidcStrategy);
```

Passport uses the same pattern for all its strategies. You pass it a `function()` that has `token` and `done` as parameters. The strategy comes back to you after it has done all of its work. You should then store the user and save the token so that you don’t need to ask for it again.

> [!IMPORTANT]
> The code above takes any user who happens to authenticate to your server. This process is known as autoregistration. In production servers, don't let in any users access the API without first having them go through a registration process. This process is usually the pattern you see in consumer apps that allow you to register by using Facebook but then ask you to fill out additional information. If this program wasn’t a command-line program, we could have extracted the email from the token object that is returned and then asked users to fill out additional information. Because this is a sample, we add them to an in-memory database.
>
>

## Run your server application to verify that it rejects you
You can use `curl` to see if you now have OAuth2 protection against your endpoints. The headers returned should be enough to tell you that you are on the right path.

Make sure that your MongoDB instance is running:

    $sudo mongodb

Change to the directory and run the server:

    $ cd azuread
    $ node server.js

In a new terminal window, run `curl`

Try a basic POST:

`$ curl -isS -X POST http://127.0.0.1:3000/api/tasks/brandon/Hello`

```Shell
HTTP/1.1 401 Unauthorized
Connection: close
WWW-Authenticate: Bearer realm="Users"
Date: Tue, 14 Jul 2015 05:45:03 GMT
Transfer-Encoding: chunked
```

A 401 error is the response you want. It indicates that the Passport layer is trying to redirect to the authorize endpoint.

## You now have a REST API service that uses OAuth2
You have implemented a REST API by using Restify and OAuth! You now have sufficient code so that you can continue to develop your service and build on this example. You have gone as far as you can with this server without using an OAuth2-compatible client. For that next step use an additional walk-through like our [Connect to a web API by using iOS with B2C](active-directory-b2c-devquickstarts-ios.md) walkthrough.

## Next steps
You can now move to more advanced topics, such as:

[Connect to a web API by using iOS with B2C](active-directory-b2c-devquickstarts-ios.md)

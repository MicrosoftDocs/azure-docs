<properties
	pageTitle="Azure AD NodeJS Getting Started | Microsoft Azure"
	description="How to build a Node.js Web API that integrates with Azure AD for authentication."
	services="active-directory"
	documentationCenter="nodejs"
	authors="brandwe"
	manager="terrylan"
	editor=""/>

<tags
	ms.service="active-directory"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="javascript"
	ms.topic="article"
	ms.date="04/28/2015"
	ms.author="brandwe"/>

# Getting Started With WEB-API for Node

This walkthrough will give you  a quick and easy way to set up a REST API Service that is integrated with  Azure Active Directory for API protection using the OAuth2 protocol. The sample server included in the download are designed to run on any platform but target OSX and Linux.

By the end of this walk-through, you should be able to build a running REST API server with the following features:

* A node.js server running an REST API interface with JSON using MongoDB as persistant storage
* REST APIs leveraging OAuth2 API protection with Bearner tokens using Azure Active Directory


We've released all of the source code for this running example in GitHub under an Apache 2.0 license, so feel free to clone (or even better, fork!) and provide feedback and pull requests.

## About Node.js Modules

We will be using Node.js modules in this walkthrough. Modules are loadable JavaScript packages that provide specific functionality for your application. You usually install modules by using the Node.js NPM command-line tool in the NPM installation directory, but some modules, such as the HTTP module, are included the core Node.js package.
Installed modules are saved in the node_modules directory at the root of your Node.js installation directory. Each module in the node_modules directory maintains its own node_modules directory that contains any modules that it depends on, and each required module has a node_modules directory. This recursive directory structure represents the dependency chain.

This dependency chain structure results in a larger application footprint, but it guarantees that all dependencies are met and that the version of the modules used in development will also be used in production. This makes the production app behavior more predictable and prevents versioning problems that might affect users.

## Step 1: Register a Azure AD Tenant

To use this sample you will need a Azure Active Directory Tenant. If you're not sure what a tenant is or how you would get one, see  [How to get an Azure AD tenant](active-directory-howto-tenant.md).

## Step 2: Add A Web API to your tenant

After you get your Azure Active Directory tenant, add this sample app to your tenant so you can use it to protect the API.

To enable your app to authenticate users, you'll first need to register a new application in your tenant.

- Sign into the Azure Management Portal.
- In the left hand nav, click on **Active Directory**.
- Select the tenant where you wish to register the application.
- Click the **Applications** tab, and click add in the bottom drawer.
- Follow the prompts and create a new **Web Application and/or WebAPI**.
    - The **name** of the application will describe your application to end-users
    -	The **Sign-On URL** is the base URL of your app.  The skeleton’s default is `https://localhost:8888`.
    - The **App ID URI** is a unique identifier for your application.  The convention is to use `https://<tenant-domain>/<app-name>`, e.g. `https://contoso.onmicrosoft.com/my-first-aad-app`
- Once you’ve completed registration, AAD will assign your app a unique client identifier.  You’ll need this value in the next sections, so copy it from the Configure tab.

## Step 3: Download node.js for your platform
To successfully use this sample, you must have a working installation of Node.js.

Install Node.js from [http://nodejs.org](http://nodejs.org).

## Step 4: Install MongoDB on to your platform

To successfully use this sample, you must have a working installation of MongoDB. We will use MongoDB to make our REST API persistant across server instances.

Install MongoDB from [http://mongodb.org](http://www.mongodb.org).

**NOTE:** This walkthrough assumes that you use the default installation and server endpoints for MongoDB, which at the time of this writing is: mongodb://localhost


## Step 5: Install the Restify modules in to your Web API

We will be using Resitfy to build our REST API. Restify is a minimal and flexible Node.js application framework derived from Express that has a robust set of features for building REST APIs on top of Connect.

### Install Restify

From the command-line, change directories to the azuread directory. If the **azuread** directory does not exist, create it.

`cd azuread - or- mkdir azuread; cd azuread`

Type the following command:

`npm install restify`

This command installs Restify.

#### DID YOU GET AN ERROR?

When using npm on some operating systems, you may receive an error of Error: EPERM, chmod '/usr/local/bin/..' and a request to try running the account as an administrator. If this occurs, use the sudo command to run npm at a higher privilege level.

#### DID YOU GET AN ERROR REGARDING DTRACE?

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
	└── bunyan@0.22.0 (mv@0.0.5)


## Step 6: Install Passport.js in to your Web API

[Passport](http://passportjs.org/) is authentication middleware for Node.js. Extremely flexible and modular, Passport can be unobtrusively dropped in to any Express-based or Resitify web application. A comprehensive set of strategies support authentication using a username and password, Facebook, Twitter, and more. We have developed a strategy for Azure Active Directory. We will install this module and then add the Azure Active Directory strategy plug-in.

From the command-line, change directories to the azuread directory.

Enter the following command to install passport.js

`npm install passport`

The output of the commadn should appear similar to the following:

	passport@0.1.17 node_modules\passport
	├── pause@0.0.1
	└── pkginfo@0.2.3

## Step 7: Add Passport.js Bearer Token Support to your Web API

Next, we will add the Bearer strategy, using passport-bearer-http, a Bearner handler for [Passport](http://passportjs.org/). We will also add JWT token handler support by using node-jwt.

**NOTE:** Although OAuth2 provides a framework in which any known token type can be issued, only certain token types have gained wide-spread use. For protecting endpoints, that has turned out to be Bearer Tokens. Bearer tokens are the most widely issued type of token in OAuth2, and many implementations assume that bearer tokens are the only type of token issued.

From the command-line, change directories to the **azuread** directory.

Type the following command to install Passport.js modules:

- `npm install passport-oauth`
- `npm install passport-http-bearer`
- `npm install node-jwt`

The output of the commamd should appear similar to the following:

	ms-passport-wsfed-saml2@0.3.8 node_modules\passport-oauth  
	├── xtend@2.0.3
	├── xml-crypto@0.0.9
	├── xmldom@0.1.13
	└── xml2js@0.1.14 (sax@0.5.2)


## Step 8: Add MongoDB modules to your Web API

We will be using MongoDB as our datastore For that reason, we need to install both the widely used plug-in to manage models and schemas called Mongoose, as well as the database driver for MongoDB, also called MongoDB.


* `npm install mongoose`
* `npm install mongodb`

## Step 9:  Install additional modules

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


## Step 10: Create a server.js with your dependencies

The server.js file will be providing the majority of our functionality for our Web API server. We will be adding most of our code to this file. For production purposes you would refactor the functionality in to smaller files, such as separate routes and controllers. For the purpose of this demo we will use server.js for this functionality.

From the command-line, change directories to the **azuread** folder if not already there:

`cd azuread`

Create a `server.js` file in our favorite editor and add the following information:

```Javascript
	'use strict';

	/**
 	* Module dependencies.
 	*/

	var fs = require('fs');
	var path = require('path');
	var util = require('util');
	var assert = require('assert-plus');
	var bunyan = require('bunyan');
	var getopt = require('posix-getopt');
	var mongoose = require('mongoose/');
	var restify = require('restify');
```

Save the file. We will return to it shortly.

## Step 11: Create a config file to store your Azure AD settings

This code file passes the configuration parameters from your Azure Active Directory Portal to Passport.js. You created these configuration values when you added the Web API to the portal in the first part of the walkthrough. We will explain what to put in the values of these parameters after you've copied the code.


From the command-line, change directories to the **azuread** folder if not already there:

`cd azuread`

Create a `config.js` file in our favorite editor and add the following information:

```Javascript
// Don't commit this file to your public repos
    exports.creds = {
    mongoose_auth_local: 'mongodb://localhost/tasklist', // Your mongo auth uri goes here
    openid_configuration: 'https://login.microsoftonline.com/common/.well-known/openid-configuration', // For using Microsoft you should never need to change this.
    openid_keys: 'https://login.microsoftonline.com/common/discovery/keys', // For using Microsoft you should never need to change this. If absent will attempt to get from openid_configuration
}

```



**NOTE:** You will most likely never need to change these values.

**NOTE:** We roll our keys at frequent intervals. Please ensure that you are always pulling from the "openid_keys" URL and that the app can access the internet.


## Step 12: Add configuration to your server.js file

We need to read these values from the Config file you just created across our application. To do this, we simply add the .config file as a required resource in our application and then set the global variables to those in the config.js document

From the command-line, change directories to the **azuread** folder if not already there:

`cd azuread`

Open your `server.js` file in our favorite editor and add the following information:

```Javascript
var config = require('./config');
```
Then, add a new section to `server.js` with the following code:

```Javascript
/**
* Setup some configuration
*/
var mongoose = require('mongoose/');
var serverPort = process.env.PORT || 8888;
var serverURI = ( process.env.PORT ) ? config.creds.mongoose_auth_mongohq : config.creds.mongoose_auth_local;

```
## Step 13: Create a metadata.js helper file to aid in parsing metadata/tokens

Since the goal is to keep only application logic in the server.js file, it makes sense to put some helper methods in a separate file. These methods simply help us parse the OpenID Connect metadata and do not relate to the core scenario. It's better to stuff them away. We will be adding more to this file as we go through the Walkthrough.

***NOTE:*** You'll notice that this metadata.js file parses XML for SAML and WS-Fed as well as JSON for OpenID Connect. That is by design as you'll use this file in our other samples as well. You can safely ignore it now.

From the command-line, change directories to the **azuread** folder if not already there:

`cd azuread`

Create a `metadata.js` file in our favorite editor and add the following information:

```Javascript

'use strict';

var xml2js = require('xml2js');
var request = require('request');
var aadutils = require('./aadutils');
var async = require('async');

// Logging

var bunyan = require('bunyan');
var log = bunyan.createLogger({name: 'Microsoft OpenID Connect Passport Strategy'});

var Metadata = function (url, authtype) {


  if(!url) {
    throw new Error("Metadata: url is a required argument");
  }
  if(!authtype) {
    throw new Error('OIDCBearerStrategy requires an authentication type specified to metadata parser. Valid types are saml, wsfed, or odic"');
  }

  this.url = url;
  this.metadata = null;
  this.authtype = authtype;
  log.info(authtype, 'Metadata requested for authentication type');
};

Object.defineProperty(Metadata, 'url', {
  get: function () {
    return this.url;
  }
});

Object.defineProperty(Metadata, 'saml', {
  get: function () {
    return this.saml;
  }
});

Object.defineProperty(Metadata, 'wsfed', {
  get: function () {
    return this.wsfed;
  }
});

Object.defineProperty(Metadata, 'oidc', {
  get: function () {
    return this.oidc;
  }
});


Object.defineProperty(Metadata, 'metadata', {
  get: function () {
    return this.metadata;
  }
});

Metadata.prototype.updateSamlMetadata = function(doc, next) {
  log.info('Request to update the SAML Metadata');
  try {

    this.saml = {};

    var entity = aadutils.getElement(doc, 'EntityDescriptor');
    var idp = aadutils.getElement(entity, 'IDPSSODescriptor');
    var signOn = aadutils.getElement(idp[0], 'SingleSignOnService');
    var signOff = aadutils.getElement(idp[0], 'SingleLogoutService');
    var keyDescriptor = aadutils.getElement(idp[0], 'KeyDescriptor');
    this.saml.loginEndpoint = signOn[0].$.Location;
    this.saml.logoutEndpoint = signOff[0].$.Location;

    // copy the x509 certs from the metadata
    this.saml.certs = [];
    for (var j=0;j<keyDescriptor.length;j++) {
      this.saml.certs.push(keyDescriptor[j].KeyInfo[0].X509Data[0].X509Certificate[0]);
    }
    next(null);
  } catch (e) {
    next(new Error('Invalid SAMLP Federation Metadata ' + e.message));
  }
};

Metadata.prototype.updateOidcMetadata = function(doc, next) {
  log.info('Request to update the Open ID Connect Metadata');
  try {
    this.oidc = {};

    var issuer = doc['issuer'];
    var keyDescriptor = aadutils.getElement(idp[0], 'keys');

    // copy the x509 certs from the metadata
    this.oidc.certs = [];
    for (var j=0;j<keyDescriptor.length;j++) {
      this.oidc.certs.push(keyDescriptor[j].KeyInfo[0].X509Data[0].X509Certificate[0]);
    }
    next(null);
  } catch (e) {
    next(new Error('Invalid Open ID Connect Federation Metadata ' + e.message));
  }
};


Metadata.prototype.updateWsfedMetadata = function(doc, next) {
  log.info('Request to update the WS Federation Metadata');
  try {
    this.wsfed = {};
    var entity = aadutils.getElement(doc, 'EntityDescriptor');
    var roles = aadutils.getElement(entity, 'RoleDescriptor');
    for(var i = 0; i < roles.length; i++) {
      var role = roles[i];
      if(role['fed:SecurityTokenServiceEndpoint']) {
        var endpoint = role['fed:SecurityTokenServiceEndpoint'];
        var endPointReference = aadutils.getFirstElement(endpoint[0],'EndpointReference');
        this.wsfed.loginEndpoint = aadutils.getFirstElement(endPointReference,'Address');

        var keyDescriptor = aadutils.getElement(role, 'KeyDescriptor');
        // copy the x509 certs from the metadata
        this.wsfed.certs = [];
        for (var j=0;j<keyDescriptor.length;j++) {
          this.wsfed.certs.push(keyDescriptor[j].KeyInfo[0].X509Data[0].X509Certificate[0]);
        }
        break;
      }
    }

    return next(null);
  } catch (e) {
    next(new Error('Invalid WSFED Federation Metadata ' + e.message));
  }
};

Metadata.prototype.fetch = function(callback) {
  var self = this;
  log.info("Fetching metadata from the provided metadata URL: " + self.url);
  async.waterfall([
    // fetch the Federation metadata for the AAD tenant
    function(next){
      request(self.url, function (err, response, body) {
        if(err) {
          next(err);
        } else if(response.statusCode !== 200) {
          next(new Error("Error:" + response.statusCode +  " Cannot get AAD Federation metadata from " + self.url));
        } else {
          log.info(body, "retreived");
          next(null, body);
        }
      });
    },
    function(body, next){
      // parse the AAD Federation metadata xml

      if(self.authtype == "saml" || self.authtype == "wsfed") {
      log.info(body, "Parsing XML retreived from the endpoint");
      var parser = new xml2js.Parser({explicitRoot:true});
      // Note: xml responses from Azure AAD have a leading \ufeff which breaks xml2js parser!
      parser.parseString(body.replace("\ufeff", ""), function (err, data) {
        self.metatdata = data;
        next(err);

      });
    } else if(self.authtype == "oidc") {
      log.info(body, "Parsing JSON retreived from the endpoint");
      JSON.parse(body, function (err, data) {
        self.metatdata = data;
        next(err);
      });

    } else {

       next(new Error("Error: No Authentication type specified to metadata parser. Valid types are saml, wsfed, or odic"));
    }

    },

    function(next){
      if(self.authtype = "saml") {
      // update the SAML SSO endpoints and certs from the metadata
      self.updateSamlMetadata(self.metatdata, next);
    }},
    function(next){
      if(self.authtype = "wsfed") {
      // update the SAML SSO endpoints and certs from the metadata
      self.updateWsfedMetadata(self.metatdata, next);
    }},
    function(next){
      if(self.authtype = "oidc") {
      self.updateOidcMetadata(self.metadata, next);
    }},
  ], function (err) {
    // return err or success (err === null) to callback
    callback(err);
  });
};

exports.Metadata = Metadata;
```
As you can see from the code, it simply takes the openid URL you passed in `config.js` and then parses it for information which we will use in the `server.js` file. You are more than welcome to investigate this code and expand it if needed.

### Load the metadata.js file in your server.js

We need to tell our server where to get the methods you jus wrote.

From the command-line, change directories to the **azuread** folder if not already there:

`cd azuread`

Open your `server.js` file in our favorite editor and add the following information:

```Javascript
var metadata = require('./metadata);
```
Next, add to the end of the `Configuration` section this call to send the metadata document in our `config.js` to the parser we just wrote:

```Javascript
this.aadutils = new var Metadata = require('./metadata').Metadata;
```

## Step 14: Add The MongoDB Model and Schema Information using Moongoose

Now all this preparation is going to start paying off as we wind these three files together in to a REST API service.

For this walkthrough we will be using MongoDB to store our Tasks as discussed in ***Step 4***.

If you recall from the `config.js` file we created in ***Step 11*** we called our database `tasklist` as that was what we put at the end of our mogoose_auth_local connection URL. You don't need to create this database beforehand in MongoDB, it will create this for us on first run of our server application (assuming it does not already exist).

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
/**
*
* Connect to MongoDB
*/

global.db = mongoose.connect(serverURI);
var Schema = mongoose.Schema;  
```
This will connect to the MongoDB server and hand back a Schema object to us.

#### Using the Schema, create our model in the code

Below the code you wrote above, add the following code:

```Javascript
/**
/ Here we create a schema to store our tasks. Pretty simple schema for now.
*/

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

## Step 15: Add our Routes for our Task REST API server

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
 * APIs
 */

function createTask(req, res, next) {

	// Resitify currently has a bug which doesn't allow you to set default headers
  	// This headers comply with CORS and allow us to mongodbServer our response to any origin

  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");

    // Create a new task model, fill it up and save it to Mongodb
  var _task = new Task();

        if (!req.params.task) {
                req.log.warn('createTask: missing task');
                next(new MissingTaskError());
                return;
        }


  _task.owner = req.params.owner;
   _task.task = req.params.task;
   _task.date = new Date();

  _task.save(function (err) {
  	if (err) {
        req.log.warn(err, 'createTask: unable to save');
        next(err);
    } else {
    res.send(201, _task);

			}
  });

  return next();

}


/**
 * Deletes a Task by name
 */
function removeTask(req, res, next) {

        Task.remove( { task:req.params.task }, function (err) {
                if (err) {
                        req.log.warn(err,
                                     'removeTask: unable to delete %s',
                                     req.params.task);
                        next(err);
                } else {
                        res.send(204);
                        next();
                }
        });
}

/**
 * Deletes all Tasks. A wipe
 */
function removeAll(req, res, next) {
        Task.remove();
        res.send(204);
        return next();
}    });
}


/**
 *
 *
 *
 */
function getTask(req, res, next) {


        Task.find(req.params.name, function (err, data) {
                if (err) {
                        req.log.warn(err, 'get: unable to read %s', req.params.name);
                        next(err);
                        return;
                }

                res.json(data);
        });

        return next();
}


/**
 * Simple returns the list of TODOs that were loaded.
 *
 */

function listTasks(req, res, next) {
  // Resitify currently has a bug which doesn't allow you to set default headers
  // This headers comply with CORS and allow us to mongodbServer our response to any origin

  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");

  console.log("server getTasks");

  Task.find().limit(20).sort('date').exec(function (err,data) {

    if (err)
      return next(err);

    if (data.length > 0) {
            console.log(data);
        }

    if (!data.length) {
            console.log('there was a problem');
            console.log(err);
            console.log("There is no tasks in the database. Did you initalize the database as stated in the README?");
        }

    else {

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


function TaskExistsError(name) {
        assert.string(name, 'name');

        restify.RestError.call(this, {
                statusCode: 409,
                restCode: 'TaskExists',
                message: name + ' already exists',
                constructorOpt: TaskExistsError
        });

        this.name = 'TaskExistsError';
}
util.inherits(TaskExistsError, restify.RestError);


function TaskNotFoundError(name) {
        assert.string(name, 'name');

        restify.RestError.call(this, {
                statusCode: 404,
                restCode: 'TaskNotFound',
                message: name + ' was not found',
                constructorOpt: TaskNotFoundError
        });

        this.name = 'TaskNotFoundError';
}

util.inherits(TaskNotFoundError, restify.RestError);
```


## Step 16: Create your Server!

We have our database defined, we have our routes in place, and the last thing to do is add our server instance that will manage our calls.

Restify (and Express) have a lot of deep customization you can do for a REST API server, but again we will use the most basic setup for our purposes.

```Javascript
/**
 * Our Server
 */


var server = restify.createServer({
        name: "Azure Active Directroy TODO Server",
    version: "1.0.0",
    formatters: {
        'application/json': function(req, res, body){
            if(req.params.callback){
                var callbackFunctionName = req.params.callback.replace(/[^A-Za-z0-9_\.]/g, '');
                return callbackFunctionName + "(" + JSON.stringify(body) + ");";
            } else {
                return JSON.stringify(body);
            }
        },
        'text/html': function(req, res, body){
            if (body instanceof Error)
                        return body.stack;

                      if (Buffer.isBuffer(body))
                        return body.toString('base64');

                return util.inspect(body);
        },
        'application/x-www-form-urlencoded': function(req, res, body){
            if (body instanceof Error) {
                    res.statusCode = body.statusCode || 500;
                    body = body.message;
            } else if (typeof (body) === 'object') {
                body = body.task || JSON.stringify(body);
            } else {
                body = body.toString();
            }

        res.setHeader('Content-Length', Buffer.byteLength(body));
        return (body);
        }
    }
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

        // This lets us push JSON to the REST API endpoint as well. Maps x: y as /name:value

        server.use(restify.bodyParser({ mapParams: false }));

        /// Now the real handlers. Here we just CRUD

        server.get('/tasks', listTasks);
        server.head('/tasks', listTasks);
        server.get('/tasks/:name', getTask);
        server.head('/tasks/:name', getTask);
        server.post('/tasks/:name/:task', createTask);
        server.del('/tasks/:name/:task', removeTask);
        server.del('/tasks/:name', removeTask);
        server.del('/tasks', removeAll, function respond(req, res, next) { res.send(204); next(); });


        // Register a default '/' handler

        server.get('/', function root(req, res, next) {
                var routes = [
                        'GET     /',
                        'POST    /tasks/:name/:task',
                        'GET     /tasks',
                        'PUT     /tasks/:name',
                        'GET     /tasks/:name',
                        'DELETE  /tasks/:name/:task'
                ];
                res.send(200, routes);
                next();
        });

  server.listen(serverPort, function() {

  var consoleMessage = '\n Azure Active Directory Tutorial'
  consoleMessage += '\n +++++++++++++++++++++++++++++++++++++++++++++++++++++'
  consoleMessage += '\n %s server is listening at %s';
  consoleMessage += '\n Open your browser to %s/tasks\n';
  consoleMessage += '+++++++++++++++++++++++++++++++++++++++++++++++++++++ \n'
  consoleMessage += '\n !!! why not try a $curl -isS %s | json to get some ideas? \n'
  consoleMessage += '+++++++++++++++++++++++++++++++++++++++++++++++++++++ \n\n'  

  console.log(consoleMessage, server.name, server.url, server.url, server.url);

});
```

## Step 17: Before we add OAuth support, let's run the server.

It's a good idea to make sure we have no mistakes before we continue on to the OAuth part of the Walkthrough.

The easiest way to do this is by using `curl` in a command line. Before we do that, we need a simple utility that allows us to parse output as JSON. To do that, install the [json](https://github.com/trentm/json) tool as all the examples below use that.

	$npm install -g jsontool

This installs the JSON tool globally. Now that we've accomplished that - let's play with the server:

First, make sure that your monogoDB isntance is running..

	$sudo mongod

Then, change to the directory and start curling..

	$ cd azuread
	$ node server.js

	$ curl -isS http://127.0.0.1:8888 | json
	HTTP/1.1 200 OK
	Connection: close
	Content-Type: application/x-www-form-urlencoded
	Content-Length: 145
	Date: Wed, 29 Jan 2014 03:41:24 GMT

	[
  	"GET     /",
  	"POST    /tasks/:owner/:task",
  	"GET     /tasks",
  	"DELETE  /tasks",
  	"PUT     /tasks/:owner",
  	"GET     /tasks/:owner",
  	"DELETE  /tasks/:task"
	]

Then, we can add a task this way:

	$ curl -isS -X POST http://127.0.0.1:8888/tasks/brandon/Hello

The response should be:

	HTTP/1.1 201 Created
	Connection: close
	Access-Control-Allow-Origin: *
	Access-Control-Allow-Headers: X-Requested-With
	Content-Type: application/x-www-form-urlencoded
	Content-Length: 5
	Date: Tue, 04 Feb 2014 01:02:26 GMT

	Hello

And we can list tasks for Brandon this way:

	$ curl -isS http://127.0.0.1:8888/tasks/brandon/

If all this works out, we are ready to add OAuth to the REST API server.

## Step 18: Add Passport.js code to our REST API Server

Now that we have a running REST API (congrats, btw!) let's get to making it useful against Azure AD.

From the command-line, change directories to the **azuread** folder if not already there:

`cd azuread`

### Step 1: Add our Passport modules

Open your `server.js` file in our favorite editor and add the following information below where you previously stated the modules to load. This is towards the top of the file and should be right after the `var aadutils = require('./aadutils');` import.

```Javascript
/*
*
* Load our old friend Passport for OAuth2 flows
*/

var passport = require('passport')
  , OAuth2Strategy = require('passport-oauth').OAuth2Strategy;
```

### 2. Tell our server we are using authentication

Open your `server.js` file in our favorite editor and add the following information **below the server.get()** where you defined your Routes but above the **server.listen()** method.


We need to tell Restify to begin using its `authorizationParser()` and look at the contents of the Authorization header.

```Javascript
        server.use(restify.authorizationParser());


```


### 3. Add the Passport OAuth2 module to our code

Here we use the specific OAuth2 parameters we added to the config.js file. If our `aadutils.js` file did its job parsing our Federation Metadata document, all these values should be populated for us even if they are blank in the config.js file.

```Javascript
// Now our own handlers for authentication/authorization
// Here we only use Oauth2 from Passport.js

passport.use('provider', new OAuth2Strategy({
    authorizationURL: authEndpoint,
    tokenURL: tokenEndpoint,
    clientID: clientID,
    clientSecret: clientSecret,
    callbackURL: callbackURL
  },
  function(accessToken, refreshToken, profile, done) {
    User.findOrCreate({ UserId: profile.id }, function(err, user) {
      done(err, user);
    });
  }
));

// Let's start using Passport.js

server.use(passport.initialize());

```
### Step 4: Add Routes for OAuth authentication

```Javascript
// Redirect the user to the OAuth 2.0 provider for authentication.  When
// complete, the provider will redirect the user back to the application at
//     /auth/provider/callback

server.get('/auth/provider', passport.authenticate('provider'));

// The OAuth 2.0 provider has redirected the user back to the application.
// Finish the authentication process by attempting to obtain an access
// token.  If authorization was granted, the user will be logged in.
// Otherwise, authentication has failed.

server.get('/auth/provider/callback',
  passport.authenticate('provider', { successRedirect: '/',
                                      failureRedirect: '/login' }));
```

### Step 5: Add a IsAuthenticated() Helper Method to the Routes

```Javascript
// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.

var ensureAuthenticated = function(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
};

```

### Step 6: Add a caching mechnaism for the cookies

```Javascript
// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.
passport.serializeUser(function(user, done) {
  done(null, user.email);
});

passport.deserializeUser(function(id, done) {
  findByEmail(id, function (err, user) {
    done(err, user);
  });
});
```
### Step 7: Finally, protect some endpoints

You protect endpoints by specifying the passport.authenticate() call with the protocol you wish to use.

Let's edit our route in our server code to do something more interesting:

```Javascript
server.get('/tasks', passport.authenticate('provider', { session: false }), listTasks);
```


## Step 19: Run your server application again and ensure it rejects you

Let's use `curl` again to see if we now have OAuth2 protection against our endpoints. We will do this before runnning any of our client SDKs against this endpoint. The headers returned should be enough to tell us we are down the right path.

First, make sure that your monogoDB isntance is running..

	$sudo mongod

Then, change to the directory and start curling..

	$ cd azuread
	$ node server.js

Try a basic GET:

	$ curl -isS http://127.0.0.1:8888/tasks/
	HTTP/1.1 302 Moved Temporarily
	Connection: close
	Location: https://login.windows.net/468a75f4-f9a7-4dc4-a527-4f4522734790/oauth2/authorize?response_type=code&redirect_uri=&client_id=123
	Content-Length: 0
	Date: Tue, 04 Feb 2014 02:15:14 GMT


A 302 is the response you are looking for here, as that indicates that the Passport layer is trying to redirect to the authorize endpoint, which is exactly what you want.

## Congratulations! You have a REST API Service using OAuth2!

You've went as far as you can with this server without using an OAuth2 compatible client. You will need to go through an additional walkthrough.

If you were just looking for information on how to implement a REST API using Restify and OAuth2, you have more than enough code to keep developing your service and learning how to build on this example.

If you are interested in the next steps in your ADAL journey, here are some supported ADAL clients we recommend for you to keep working:

Simply clone down to your developer machine and configure as stated in the Walkthrough.

[ADAL for iOS](https://github.com/MSOpenTech/azure-activedirectory-library-for-ios)

[ADAL for Android](https://github.com/MSOpenTech/azure-activedirectory-library-for-android)

[ADAL for .Net](http://msdn.microsoft.com/library/windowsazure/jj573266.aspx)

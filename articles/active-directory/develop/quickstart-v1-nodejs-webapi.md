---
title: Secure a Web API with Azure AD | Microsoft Docs
description: Learn how to build a Node.js REST web API that integrates with Azure AD for authentication.
services: active-directory
documentationcenter: nodejs
author: rwike77
manager: CelesteDG

ms.assetid: 7654ab4c-4489-4ea5-aba9-d7cdc256e42a
ms.service: active-directory
ms.subservice: develop
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: javascript
ms.topic: quickstart
ms.date: 09/24/2018
ms.author: ryanwi
ms.custom: aaddev
#Customer intent: As an application developer, I want to learn how to build a Node.js REST web API that integrates with Azure Active Directory for authentication.
ms.collection: M365-identity-device-management
---

# Quickstart: Secure a Web API with Azure Active Directory

[!INCLUDE [active-directory-develop-applies-v1](../../../includes/active-directory-develop-applies-v1.md)]

In this quickstart, you'll learn how to secure a [Restify](http://restify.com/) API endpoint with [Passport](http://passportjs.org/) using the [passport-azure-ad](https://github.com/AzureAD/passport-azure-ad) module to handle communication with Azure Active Directory (Azure AD).

The scope of this quickstart covers the concerns regarding securing API endpoints. The concerns of signing in and retaining authentication tokens are not implemented here and are the responsibility of a client application. For details surrounding a client implementation, review [Node.js web app sign-in and sign-out with Azure AD](quickstart-v1-openid-connect-code.md).

The full code sample associated with this article is available on [GitHub](https://github.com/Azure-Samples/active-directory-node-webapi-basic).

## Prerequisites

To get started, complete these prerequisites.

### Create the sample project

The server application requires a few package dependencies to support Restify and Passport as well as account information that is passed to Azure AD.

To begin, add the following code into a file named `package.json`:

```Shell
{
  "name": "active-directory-webapi-nodejs",
  "version": "0.0.1",
  "scripts": {
    "start": "node app.js"
  },
  "dependencies": {
    "passport": "0.4.0",
    "passport-azure-ad": "4.0.0",
    "restify": "7.7.0"
  }
}
```

Once `package.json` is created, run `npm install` in your command prompt to install the package dependencies.

#### Configure the project to use Active Directory

To get started configuring the application, there are a few account-specific values you can obtain from the Azure CLI. The easiest way to get started with the CLI is to use the Azure Cloud Shell.

[!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)]

Enter the following command in the cloud shell:

```azurecli-interactive
az ad app create --display-name node-aad-demo --homepage http://localhost --identifier-uris http://node-aad-demo
```

The [arguments](/cli/azure/ad/app?view=azure-cli-latest#az-ad-app-create) for the `create` command include:

| Argument  | Description |
|---------|---------|
|`display-name` | Friendly name of the registration |
|`homepage` | Url where users can sign in and use your application |
|`identifier-uris` | Space separated unique URIs that Azure AD can use for this application |

Before you can connect to Azure Active Directory, you need the following information:

| Name  | Description | Variable Name in Config File |
| ------------- | ------------- | ------------- |
| Tenant Name  | [Tenant name](quickstart-create-new-tenant.md) you want to use for authentication | `tenantName`  |
| Client ID  | Client ID is the OAuth term used for the AAD _Application ID_. |  `clientID`  |

From the registration response in the Azure Cloud Shell, copy the `appId` value and create a new file named `config.js`. Next, add in the following code and replace your values with the bracketed tokens:

```JavaScript
const tenantName    = //<YOUR_TENANT_NAME>;
const clientID      = //<YOUR_APP_ID_FROM_CLOUD_SHELL>;
const serverPort    = 3000;

module.exports.serverPort = serverPort;

module.exports.credentials = {
  identityMetadata: `https://login.microsoftonline.com/${tenantName}.onmicrosoft.com/.well-known/openid-configuration`, 
  clientID: clientID
};
```

For more information regarding the individual configuration settings, review the [passport-azure-ad](https://github.com/AzureAD/passport-azure-ad#5-usage) module documentation.

### Implement the server

The [passport-azure-ad](https://github.com/AzureAD/passport-azure-ad#5-usage) module  features two authentication strategies: [OIDC](https://github.com/AzureAD/passport-azure-ad#51-oidcstrategy) and [Bearer](https://github.com/AzureAD/passport-azure-ad#52-bearerstrategy) strategies. The server implemented in this article uses the Bearer strategy to secure the API endpoint.

### Step 1: Import dependencies

Create a new file named `app.js` and paste in the following text:

```JavaScript
const
      restify = require('restify')
    , restifyPlugins = require ('restify').plugins
    , passport = require('passport')
    , BearerStrategy = require('passport-azure-ad').BearerStrategy
    , config = require('./config')
    , authenticatedUserTokens = []
    , serverPort = process.env.PORT || config.serverPort
;
```

In this section of code:

- The `restify` and plugins modules are referenced in order to set up a Restify server.
- The `passport` and `passport-azure-ad` modules are responsible for communicating with Azure AD.
- The `config` variable is initialized with values from the `config.js` file created in the previous step.
- An array is created for `authenticatedUserTokens` to store user tokens as they are passed into secured endpoints.
- The `serverPort` is either defined from the process environment's port or from the configuration file.

### Step 2: Instantiate an authentication strategy

As you secure an endpoint, you must provide a strategy responsible for determining whether or not the current request originates from an authenticated user. Here the `authenticatonStrategy` variable is an instance of the `passport-azure-ad` `BearerStrategy` class. Add the following code after the `require` statements.

```JavaScript
const authenticationStrategy = new BearerStrategy(config.credentials, (token, done) => {
    let currentUser = null;

    let userToken = authenticatedUserTokens.find((user) => {
        currentUser = user;
        user.sub === token.sub;
    });

    if(!userToken) {
        authenticatedUserTokens.push(token);
    }

    return done(null, currentUser, token);
});
```

This implementation uses auto-registration by adding authentication tokens into the `authenticatedUserTokens` array if they do not already exist.

Once a new instance of the strategy is created, you must pass it into Passport via the `use` method. Add the following code to `app.js` to use the strategy in Passport.

```JavaScript
passport.use(authenticationStrategy);
```

### Step 3: Server configuration

With the authentication strategy defined, you can now set up the Restify server with some basic settings and set to use Passport for security.

```JavaScript
const server = restify.createServer({ name: 'Azure Active Directory with Node.js Demo' });
server.use(restifyPlugins.authorizationParser());
server.use(passport.initialize());
server.use(passport.session());
```
This server is initialized and configured to parse authorization headers and then set to use Passport.

### Step 4: Define routes

You can now define routes and decide which to secure with Azure AD. This project includes two routes where the root level is open and the `/api` route is set to require authentication.

In `app.js` add the following code for the root level route:

```JavaScript
server.get('/', (req, res, next) => {
    res.send(200, 'Try: curl -isS -X GET http://127.0.0.1:3000/api');
    next();
});
```

The root route allows all requests through the route and returns a message that includes a command to test the `/api` route. By contrast, the `/api` route is locked down using [`passport.authenticate`](http://passportjs.org/docs/authenticate). Add the following code after the root route.

```JavaScript
server.get('/api', passport.authenticate('oauth-bearer', { session: false }), (req, res, next) => {
    res.json({ message: 'response from API endpoint' });
    return next();
});
```

This configuration only allows authenticated requests that include a bearer token access to `/api`. The option of `session: false` is used to disable sessions to require that a token is passed with each request to the API.

Finally, the server is set to listen on the configured port by calling the `listen` method.

```JavaScript
server.listen(serverPort);
```

## Run the sample

Now that the server is implemented, you can start the server by opening up a command prompt and enter:

```shell
npm start
```

With the server running, you can submit a request to the server to test the results. To demonstrate the response from the root route, open a bash shell and enter the following code:

```shell
curl -isS -X GET http://127.0.0.1:3000/
```

If you have configured your server correctly, the response should look similar to:

```shell
HTTP/1.1 200 OK
Server: Azure Active Directory with Node.js Demo
Content-Type: application/json
Content-Length: 49
Date: Tue, 10 Oct 2017 18:35:13 GMT
Connection: keep-alive

Try: curl -isS -X GET http://127.0.0.1:3000/api
```

Next, you can test the route that requires authentication by entering the following command into your bash shell:

```shell
curl -isS -X GET http://127.0.0.1:3000/api
```

If you have configured the server correctly, then the server should respond with a status of `Unauthorized`.

```shell
HTTP/1.1 401 Unauthorized
Server: Azure Active Directory with Node.js Demo
WWW-Authenticate: token is not found
Date: Tue, 10 Oct 2017 16:22:03 GMT
Connection: keep-alive
Content-Length: 12

Unauthorized
```

Now that you have created a secure API, you can implement a client that is able to pass authentication tokens to the API.

## Next steps

* You must implement a client counterpart to connect to the server that handles signing in, signing out and managing tokens. For code-based examples, refer to the client applications in [iOS](https://github.com/MSOpenTech/azure-activedirectory-library-for-ios) and [Android](https://github.com/MSOpenTech/azure-activedirectory-library-for-android).
* For a step-by-step tutorial, see [Node.js web app sign-in and sign-out with Azure AD](quickstart-v1-openid-connect-code.md).

---
title: Azure AD Node.js Getting Started | Microsoft Docs
description: How to build a Node.js REST web API that integrates with Azure AD for authentication.
services: active-directory
documentationcenter: nodejs
author: craigshoemaker
manager: routlaw

ms.assetid: 7654ab4c-4489-4ea5-aba9-d7cdc256e42a
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: javascript
ms.topic: article
ms.date: 10/13/2017
ms.author: cshoe
ms.custom: aaddev
---
# Get started with web APIs for Node.js

Azure Active Directory (AAD) provides a flexible service used to secure API endpoints while allowing connections through a wide array of clients. This article demonstrates how to set up Azure Active Directory secured  endpoints in REST-based application. By the end of this article you learn to protect a [Restify](http://restify.com/) API endpoint with [Passport](http://passportjs.org/) using the [passport-azure-ad](https://github.com/AzureAD/passport-azure-ad) module to handle communication to AAD. 

> [!NOTE] This document only covers the concerns of the API - specifically securing endpoints. The concerns of signing in and out and retaining authentication tokens are implemented in the context of a client application. For details surrounding implementing clients, review the articles found in the [Next steps section](#next-steps).
> 
>

[The full code sample associated with this article is available on GitHub](https://github.com/Azure-Samples/node-active-directory-get-started).

## Get started
This simple server application requires a few package dependencies to support Restify and Passport as well as account information that is passed to AAD.

### Package dependencies
To begin, copy the following code and add it into a file named `package.json`:

```Shell
{
  "name": "active-directory-webapi-nodejs",
  "version": "0.0.1",
  "scripts": {
    "start": "node app.js"
  },
  "dependencies": {
    "passport": "0.4.0",
    "passport-azure-ad": "3.0.8",
    "restify": "6.0.1",
    "restify-plugins": "1.6.0"
  }
}
```

Once `package.json` is created, then type `npm install` in your command prompt to install the package dependencies. With this foundation set, the next step is to define the configuration values used by Azure Active Directory to handle authentication and authorization operations.

### Configuration values

To get started configuring the application, there are a few account-specific values you must obtain from either the [Azure portal](https://portal.azure.com) or the [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli).

> [!NOTE] If you haven't yet, you need to [register an application with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-app-registration)
>
>

Before you can connect to Azure Active Directory, you need the following information:

| Name  | Description | Variable Name in Config File |
| ------------- | ------------- | ------------- |
| Tenant Name  | The tenant name you want to use for authentication.  | `tenantName`  |
| Client ID  | The Client ID is the OAuth term used for the AAD _Application ID_. |  `clientID`  |
| Client Secret  | The client secret is the OAuth term used for an _Application Key_, which you can generate in AAD. | `clientSecret` |

Once you have your account-specific information, create a new file named `config.js` and replace your values with the bracketed tokens:

```JavaScript
const tenantName    = <YOUR_TENANT_NAME>;
const clientID      = <YOUR_CLIENT_ID>;
const clientSecret  = <YOUR_CLIENT_SECRET>;
const serverPort    = 3000;

module.exports.serverPort = serverPort;

module.exports.credentials = {
  identityMetadata: `https://login.microsoftonline.com/${tenantName}.onmicrosoft.com/.well-known/openid-configuration`, 
  clientID: clientID,
  responseType: 'code id_token',  
  clientSecret: clientSecret, 
  validateIssuer: true,
  useCookieInsteadOfSession: true,
  cookieEncryptionKeys: [ 
    { 'key': '12345678901234567890123456789012', 'iv': '123456789012' },
    { 'key': 'abcdefghijklmnopqrstuvwxyzabcdef', 'iv': 'abcdefghijkl' }
  ]
};
```
As this module is interpreted, your values are fed into the appropriate settings required to interact with AAD. For more information regarding the individual configuration settings, review [passport-azure-ad](https://github.com/AzureAD/passport-azure-ad#5-usage) module.

Now that the package and project configuration settings are defined you can begin to implement the server.

## Implement the server
The [passport-azure-ad](https://github.com/AzureAD/passport-azure-ad#5-usage) module  features two authentication strategies: [OIDC](https://github.com/AzureAD/passport-azure-ad#51-oidcstrategy) and [Bearer](https://github.com/AzureAD/passport-azure-ad#52-bearerstrategy) strategies. The server implemented in this article uses the Bearer strategy to secure the API endpoint.

### Project dependencies
Create a new file named `app.js` and paste in the following text:

```JavaScript
const
      restify = require('restify')
    , restifyPlugins = require('restify-plugins')
    , passport = require('passport')
    , BearerStrategy = require('passport-azure-ad').BearerStrategy
    , config = require('./config')
    , authenticatedUserTokens = []
    , serverPort = process.env.PORT || config.serverPort
;
```

In this section of code:

- The `restify` and `restify-plugins` modules are referenced in order to set up a Restify server.

- The `passport` and `passport-azure-ad` modules are responsible for handling the heavy lifting when communicating with AAD.

- The `config` variable is initialized with your configuration information.

- An array is created for `authenticatedUserTokens` to store user tokens as they are passed into secured endpoints.

- The `serverPort` is either defined from the process environment's port or from the configuration file.

### Authentication strategy
As you secure an endpoint, you must provide a strategy responsible for determining whether or not the current request originates from an authenticated user. Here the `authenticatonStrategy` variable is an instance of the `passport-azure-ad` `BearerStrategy` class:

```JavaScript
const authenticationStrategy = new BearerStrategy(config.credentials, (token, done) => {
    let userToken = authenticatedUserTokens.find((user) => user.sub === token.sub);

    if(!userToken) {
        authenticatedUserTokens.push(token);
    }

    return done(null, user, token);
});
```
This implementation uses auto-registration by adding authentication tokens into the `authenticatedUserTokens` array if they do not already exist.

Once the new instance of the strategy is created, you must pass it into Passport via the `use` method:

```JavaScript
passport.use(authenticationStrategy);
```

### Server configuration
With the authentication strategy defined, you can now set up the Restify server with some basic default settings and set to use Passport for security.

```JavaScript
const server = restify.createServer({ name: 'Azure Active Directroy with Node.js Demo' });
server.use(restifyPlugins.authorizationParser());
server.use(passport.initialize());
server.use(passport.session());
```
This server is initialized and configured to parse authorization headers and then set to use Passport.


### Routes
You can now define routes and decide which to secure with AAD. This project includes two routes where the root level is open and the `/api` route is set to require authentication.

In `app.js` add the following code for the root level route:

```JavaScript
server.get('/', (req, res, next) => {
    res.send(200, 'Try: curl -isS -X GET http://127.0.0.1:3000/api');
    next();
});
```

The root route allows all requests through the route and returns a message that includes a command to test the `/api` route. By contrast, the `/api` route is locked down using [`passport.authenticate`](http://passportjs.org/docs/authenticate).

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

> [!NOTE] The code snippets in this section use server port 3000. If you have configured your server to use a different port, make sure to change the value as you copy and paste the `curl` statements in this section.
>
>

Now that the configuration and server is implemented you can start the server by opening up a command prompt and entering:

```Shell
npm start
```

With the server running, you can submit a request to the server to test the results. To demonstrate the response from the root route, open a bash shell and enter the following code:

```Shell 
curl -isS -X GET http://127.0.0.1:3000/
```

If you have configured your server correctly, the response should look similar to:

```Shell
HTTP/1.1 200 OK
Server: Azure Active Directroy with Node.js Demo
Content-Type: application/json
Content-Length: 49
Date: Tue, 10 Oct 2017 18:35:13 GMT
Connection: keep-alive

Try: curl -isS -X GET http://127.0.0.1:3000/api
```

Next, you can test the route that requires authentication by entering the following command into your bash shell:

```Shell 
curl -isS -X GET http://127.0.0.1:3000/api
```

If you have configured the server correctly, then the server should respond with a status of `Unauthorized`.

```Shell
HTTP/1.1 401 Unauthorized
Server: Azure Active Directroy with Node.js Demo
WWW-Authenticate: token is not found
Date: Tue, 10 Oct 2017 16:22:03 GMT
Connection: keep-alive
Content-Length: 12

Unauthorized
```
Now that you have created a secure API, you can implement a client that is able to pass authentication tokens to the API.

## Next steps
As stated in the introduction, you must implement a client counterpart to connect to the server that handles signing in, signing out and managing tokens. For more information, please review [Node.js web app sign-in and sign-out with Azure AD](active-directory-devquickstarts-openidconnect-nodejs.md).

For code-based examples, you may clone client applications in [iOS](https://github.com/MSOpenTech/azure-activedirectory-library-for-ios) and [Android](https://github.com/MSOpenTech/azure-activedirectory-library-for-android).

[!INCLUDE [active-directory-devquickstarts-additional-resources](../../../includes/active-directory-devquickstarts-additional-resources.md)]

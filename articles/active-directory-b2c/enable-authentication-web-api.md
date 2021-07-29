---
title: Enable authentication in a web API using Azure Active Directory B2C
description:  Using Azure Active Directory B2C to protect a web API.
services: active-directory-b2c
author: msmimart
manager: celestedg
ms.service: active-directory
ms.workload: identity
ms.topic: reference
ms.date: 06/25/2021
ms.author: mimart
ms.subservice: B2C
ms.custom: "b2c-support"
---

# Enable authentication in your own web API using Azure Active Directory B2C

To authorize access to a web API, only serve requests that include a valid Azure AD B2C-issued access token. This article guides you on how to enable Azure AD B2C authorization to your web API. After completing the steps in this article, only users who obtain a valid access token are authorized to call your web API endpoints.  

## Prerequisites

Before you start reading this article, read one of the following articles. These articles guide you how to configure authentication for apps that call web APIs. Then follow the steps in this article to replace the sample web API with your own web API.   

- [Configure authentication in a sample ASP.NET core](configure-authentication-sample-web-app-with-api.md)
- [Configure authentication in a sample Single Page application](configure-authentication-sample-spa-app.md)

## Overview

Token-based authentication ensures that requests to a web API are accompanied by a valid access token.  The app takes the following steps:

1. Authenticates a user with Azure AD B2C.
1. Acquires an access token with required permission (scopes) for the web API endpoint.
1. Passes the access token as a bearer token in the authentication header of the HTTP request using this format: 
    ```http
    Authorization: Bearer <token>
    ```    

The web API takes the following steps:

1. Reads the bearer token from the authorization header in the HTTP request.
1. Validates the token. 
1. Validates the permissions (scopes) in the token.
1. The web API reads the claims that are encoded in the token (optional).
1. The web API responds to the HTTP request. 

### App registration overview

To enable your app to sign in with Azure AD B2C and call a web API, you must register two applications in the Azure AD B2C directory.  

- The **web, mobile, or SPA application** registration enables your app to sign in with Azure AD B2C. The app registration process generates an *Application ID*, also known as the *client ID*,  that uniquely identifies your application. For example, **App ID: 1**.

- The  **web API** registration enables your app to call a protected web API. The registration exposes the web API permissions (scopes). The app registration process generates an *Application ID*, that uniquely identifies your web api.  For example, **App ID: 2**. Grant your app (App ID: 1) permissions to the web API scopes (App ID: 2). 

The following diagrams describe the app registrations and the application architecture.

![App registrations and the application architecture for an app with web API.](./media/enable-authentication-web-api/app-with-api-architecture.png) 

## Prepare your development environment  

In the next steps, you are going to create a new web API project. Select your programming language, ASP.NET Core, or Node.js. Make sure you have a computer that's running either: 

#### [ASP.NET Core](#tab/csharpclient)

* [Visual Studio Code](https://code.visualstudio.com/download)
* [C# for Visual Studio Code (latest version)](https://marketplace.visualstudio.com/items?itemName=ms-dotnettools.csharp)
* [.NET 5.0 SDK](https://dotnet.microsoft.com/download/dotnet)

#### [Node.js](#tab/nodejsgeneric)

* [Visual Studio Code](https://code.visualstudio.com/), or another code editor.
* [Node.js runtime](https://nodejs.org/en/download/)

---


## Create a protected web API

In this step, you create a new web API project. Select your desired programming language, **ASP.NET Core**, or **Node.js**.

#### [ASP.NET Core](#tab/csharpclient)

Use the [dotnet new](/dotnet/core/tools/dotnet-new) command. The dotnet new command creates a new folder named **TodoList** with the web api project assets. Enter into the directory, and open [VS Code](https://code.visualstudio.com/). 

```dotnetcli
dotnet new webapi -o TodoList
cd TodoList
code . 
```

When prompted to **add required assets to the project**, select **Yes**.


#### [Node.js](#tab/nodejsgeneric)

Use [Express](https://expressjs.com/) for [Node.js](https://nodejs.org/) to build a web API. To create a web API, follow these steps:

1. Create a new folder named **TodoList**. Then enter into the folder.
1. Create a file **app.js**.
1. Open the command shell, and enter `npm init -y`. This command creates a default **package.json** file for your Node.js project.
1. In the command shell, enter `npm install express`. This command installs the Express framework.

--- 

## Install the dependencies

In this section, you add the authentication library to your web API project. The authentication library parses the HTTP authentication header, validates the token, and extracts claims. For more details, review the documentation for the library.


#### [ASP.NET Core](#tab/csharpclient)

To add the authentication library, install the package by running the following command:

```dotnetcli
dotnet add package Microsoft.Identity.Web
```

#### [Node.js](#tab/nodejsgeneric)

To add the authentication library, install the packages by running the following command:

```
npm install passport
npm install passport-azure-ad
npm install morgan
```
 
The [morgen package](https://www.npmjs.com/package/morgan) is an HTTP request logger middleware for node.js.

---

## Initiate the authentication library

In this section, you add the necessary code to initiate the authentication library.

#### [ASP.NET Core](#tab/csharpclient)

Open `Startup.cs`, at the beginning of the class add the following `using` declarations:

```csharp
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Identity.Web;
```


Find the `ConfigureServices(IServiceCollection services)` function.  Then add the following code snippet before `services.AddControllers();` line of code.


```csharp
public void ConfigureServices(IServiceCollection services)
{
    // Adds Microsoft Identity platform (Azure AD B2C) support to protect this Api
    services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddMicrosoftIdentityWebApi(options =>
    {
        Configuration.Bind("AzureAdB2C", options);

        options.TokenValidationParameters.NameClaimType = "name";
    },
    options => { Configuration.Bind("AzureAdB2C", options); });
    // End of the Microsoft Identity platform block    

    services.AddControllers();
}
```

Find the `Configure` function. Then add the following code snippet immediately after the `app.UseRouting();` line of code.


```csharp
app.UseAuthentication();
```

After the change, your code should look like the following snippet:

```csharp
public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
{
    if (env.IsDevelopment())
    {
        app.UseDeveloperExceptionPage();
    }

    app.UseHttpsRedirection();

    app.UseRouting();
    
    // Add the following line 
    app.UseAuthentication();
    // End of the block you add
    
    app.UseAuthorization();

    app.UseEndpoints(endpoints =>
    {
        endpoints.MapControllers();
    });
}
```

#### [Node.js](#tab/nodejsgeneric)

Add the following JavaScript code to your *app.js* file.

```javascript
// Import the required libraries
const express = require('express');
const morgan = require('morgan');
const passport = require('passport');
const config = require('./config.json');

// Import the passport Azure AD library
const BearerStrategy = require('passport-azure-ad').BearerStrategy;

// Set the Azure AD B2C options
const options = {
    identityMetadata: `https://${config.credentials.tenantName}.b2clogin.com/${config.credentials.tenantName}.onmicrosoft.com/${config.policies.policyName}/${config.metadata.version}/${config.metadata.discovery}`,
    clientID: config.credentials.clientID,
    audience: config.credentials.clientID,
    issuer: config.credentials.issuer,
    policyName: config.policies.policyName,
    isB2C: config.settings.isB2C,
    scope: config.resource.scope,
    validateIssuer: config.settings.validateIssuer,
    loggingLevel: config.settings.loggingLevel,
    passReqToCallback: config.settings.passReqToCallback
}

// Instantiate the passport Azure AD library with the Azure AD B2C options
const bearerStrategy = new BearerStrategy(options, (token, done) => {
        // Send user info using the second argument
        done(null, { }, token);
    }
);

// Use the required libraries
const app = express();

app.use(morgan('dev'));

app.use(passport.initialize());

passport.use(bearerStrategy);

//enable CORS (for testing only -remove in production/deployment)
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, Origin, X-Requested-With, Content-Type, Accept');
    next();
});
```
--- 

## Add the endpoints

In this section you add two endpoints to your web API:

- Anonymous `/public` endpoint. This endpoint returns the current date and time. Use this endpoint to debug your web api with anonymous calls.
- Protected `/hello` endpoint. This endpoint returns the value of the `name` claim within the access token.

To add the anonymous endpoint:

#### [ASP.NET Core](#tab/csharpclient)

Under the */Controllers* folder, add a `PublicController.cs` file. Then add the following code snippet to the *PublicController.cs* file.

```csharp
using System;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace TodoList.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class PublicController : ControllerBase
    {
        private readonly ILogger<PublicController> _logger;

        public PublicController(ILogger<PublicController> logger)
        {
            _logger = logger;
        }

        [HttpGet]
        public ActionResult Get()
        {
            return Ok( new {date = DateTime.UtcNow.ToString()});
        }
    }
}
```

#### [Node.js](#tab/nodejsgeneric)

Add the following JavaScript code to the *app.js* file:


```javascript
// API anonymous endpoint
app.get('/public', (req, res) => res.send( {'date': new Date() } ));
```

--- 

To add the protected endpoint:

#### [ASP.NET Core](#tab/csharpclient)

Under the */Controllers* folder, add a `HelloController.cs` file. Then add the following code to the *HelloController.cs* file.

```csharp
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Identity.Web.Resource;

namespace TodoList.Controllers
{
    [Authorize]
    [RequiredScope("tasks.read")]
    [ApiController]
    [Route("[controller]")]
    public class HelloController : ControllerBase
    {

        private readonly ILogger<HelloController> _logger;
        private readonly IHttpContextAccessor _contextAccessor;

        public HelloController(ILogger<HelloController> logger, IHttpContextAccessor contextAccessor)
        {
            _logger = logger;
            _contextAccessor = contextAccessor;
        }

        [HttpGet]
        public ActionResult Get()
        {
            return Ok( new { name = User.Identity.Name});
        }
    }
}
```

The `HelloController` controller is decorated with the [AuthorizeAttribute](/aspnet/core/security/authorization/simple). The Authorize attribute limits access to that controller authenticated users. 

The controller is also decorated with the `[RequiredScope("tasks.read")]`. The [RequiredScopeAttribute](/dotnet/api/microsoft.identity.web.resource.requiredscopeattribute.-ctor) verifies that the web API is called with the right scopes, `tasks.read`. 

#### [Node.js](#tab/nodejsgeneric)

Add the following JavaScript code to the *app.js* file. 

```javascript
// API protected endpoint
app.get('/hello',
    passport.authenticate('oauth-bearer', {session: false}),
    (req, res) => {
        console.log('Validated claims: ', req.authInfo);
        
        // Service relies on the name claim.  
        res.status(200).json({'name': req.authInfo['name']});
    }
);
```

The `/hello` endpoint first calls the `passport.authenticate()` function. The authentication function limits access to that controller authenticated users. 

The authentication function also verifies that the web API is called with the right scopes. The allowed scopes are located in the [configuration file](#configure-the-web-api). 

--- 

## Configure the web server

In a development environment, set the web API to listen on incoming HTTP requests port number. In this example, use HTTP port 6000. The base URI of the web API will be: <http://localhost:6000>

#### [ASP.NET Core](#tab/csharpclient)

Add the following json snippet to the *appsettings.json* file. 

```json
"Kestrel": {
    "EndPoints": {
      "Http": {
        "Url": "http://localhost:6000"
      }
    }
  }
```

#### [Node.js](#tab/nodejsgeneric)

Add the following JavaScript code to the *app.js* file. 

```javascript
// Starts listening on port 6000
const port = process.env.PORT || 6000;

app.listen(port, () => {
    console.log('Listening on port ' + port);
});
```
--- 

## Configure the web API

In this section, you add configurations to a configuration file. The file contains information about your Azure AD B2C identity provider. The web API app uses this information to validate the access token the web app passes as a bearer token.

#### [ASP.NET Core](#tab/csharpclient)

Under the project root folder, open the `appsettings.json` file.  Add the following settings:


```json
{
  "AzureAdB2C": {
    "Instance": "https://contoso.b2clogin.com",
    "Domain": "contoso.onmicrosoft.com",
    "ClientId": "<web-api-app-application-id>",
    "SignedOutCallbackPath": "/signout/<your-sign-up-in-policy>",
    "SignUpSignInPolicyId": "<your-sign-up-in-policy>"
  },
  // More setting here
}
```

Update the following properties of the app settings: 

|Section  |Key  |Value  |
|---------|---------|---------|
|AzureAdB2C|Instance| The first part of your Azure AD B2C [tenant name](tenant-management.md#get-your-tenant-name). For example, `https://contoso.b2clogin.com`.|
|AzureAdB2C|Domain| Your Azure AD B2C tenant full [tenant name](tenant-management.md#get-your-tenant-name). For example, `contoso.onmicrosoft.com`.|
|AzureAdB2C|ClientId| The web API application ID. In the [diagram above](#app-registration-overview), it's the application with *App ID: 2*. For guidance how to get your web API application registration ID, see [Prerequisites](#prerequisites). |
|AzureAdB2C|SignUpSignInPolicyId|The user flows, or custom policy. For guidance how to get your user flow or policy, see [Prerequisites](#prerequisites).  |


#### [Node.js](#tab/nodejsgeneric)

Under the project root folder, create a `config.json` file, and add the following JSON snippet.  

```json
{
    "credentials": {
        "tenantName": "<your-tenant-name>",
        "clientID": "<your-webapi-application-ID>",
        "issuer": "https://<your-tenant-name>.b2clogin.com/<your-tenant-ID>/v2.0/"
    },
    "policies": {
        "policyName": "b2c_1_susi"
    },
    "resource": {
        "scope": ["tasks.read"]
    },
    "metadata": {
        "discovery": ".well-known/openid-configuration",
        "version": "v2.0"
    },
    "settings": {
        "isB2C": true,
        "validateIssuer": true,
        "passReqToCallback": false,
        "loggingLevel": "info"
    }
}
```

Update the following properties of the app settings:

|Section  |Key  |Value  |
|---------|---------|---------|
| credentials | tenantName | The first part of your Azure AD B2C [tenant name](tenant-management.md#get-your-tenant-name). For example, `contoso`.|
| credentials |clientID | The web API application ID. In the [diagram above](#app-registration-overview), it's the application with *App ID: 2*. For guidance how to get your web API application registration ID, see [Prerequisites](#prerequisites). |
| credentials | issuer| The token issuer `iss` claim value. Azure AD B2C by default returns the token in the following format: `https://<your-tenant-name>.b2clogin.com/<your-tenant-ID>/v2.0/`. Replace the `<your-tenant-name>` with the first part of your Azure AD B2C [tenant name](tenant-management.md#get-your-tenant-name). Replace the `<your-tenant-ID>` with your [Azure AD B2C tenant ID](tenant-management.md#get-your-tenant-id). |
| policies | policyName | The user flows, or custom policy. The user flows, or custom policy. For guidance how to get your user flow or policy, see [Prerequisites](#prerequisites).|
| resource | scope | The scopes of your web API application registration. For guidance how to get your web API scope, see [Prerequisites](#prerequisites).|

--- 

## Run and test the web API

Finally you run the web API with your Azure AD B2C environment settings. 

#### [ASP.NET Core](#tab/csharpclient)

In the command shell, run the following command to start the web application:

```bush
 dotnet run
```

You should see the following output. This output means your app is up and running and ready to receive requests.

```
Now listening on: http://localhost:6000
```

To stop the program, in the command shell press `Ctrl+C`. You can rerun the app using the `node app.js` command.

> [!TIP]
> Alternatively to run the `dotnet run` command, use [VS Code debugger](https://code.visualstudio.com/docs/editor/debugging). VS Code's built-in debugger helps accelerate your edit, compile and debug loop.

Open a browser and go to `http://localhost:6000/public`. In the browser window, you should see the following text displayed the current date and time.




#### [Node.js](#tab/nodejsgeneric)

In the command shell, run the following command to start the web application:

```bush
node app.js
```

You should see the following output. This output means your app is up and running and ready to receive requests.

```
Example app listening on port 6000!
```

To stop the program, in the command shell press `Ctrl+C`. You can rerun the app using the `node app.js` command.

> [!TIP]
> Alternatively to run the `node app.js` command, use [VS Code debugger](https://code.visualstudio.com/docs/editor/debugging). VS Code's built-in debugger helps accelerate your edit, compile and debug loop.

Open a browser and go to `http://localhost:6000/public`. In the browser window, you should see the following text displayed the current date and time.

---

## Calling the web API from your app

First try to call the protected web API endpoint without an access token. Open a browser and go to `http://localhost:6000/hello`. The API will return unauthorized HTTP error message, confirming that web API is protected with a bearer token.

Continue to configure your app to call the web API. For guidance, see the [Prerequisites](#prerequisites) section.

## Next steps

Get the complete example on GitHub:

#### [ASP.NET Core](#tab/csharpclient)

* [.NET Core web api using Microsoft identity library](https://github.com/Azure-Samples/active-directory-aspnetcore-webapp-openidconnect-v2/tree/master/4-WebApp-your-API/4-2-B2C/TodoListService)

#### [Node.js](#tab/nodejsgeneric)

* [Node.js Web API using the Passport.js library](https://github.com/Azure-Samples/active-directory-b2c-javascript-nodejs-webapi)

---

---
title: Tutorial - Web app accesses Microsoft Graph as the user | Azure
description: In this tutorial, you learn how to access data in Microsoft Graph for a signed-in user.
services: microsoft-graph, app-service-web
author: rwike77
manager: CelesteDG

ms.service: app-service
ms.topic: tutorial
ms.workload: identity
ms.date: 03/08/2022
ms.author: ryanwi
ms.reviewer: stsoneff
ms.devlang: csharp
ms.custom: azureday1, devx-track-js, AppServiceConnectivity
ms.subservice: web-apps
#Customer intent: As an application developer, I want to learn how to access data in Microsoft Graph for a signed-in user.
---

# Tutorial: Access Microsoft Graph from a secured JavaScript app as the user

[!INCLUDE [tutorial-content-above-code](./includes/tutorial-connect-app-access-microsoft-graph-as-user/intro.md)]

## Call Microsoft Graph from Node.js

Your web app now has the required permissions and also adds Microsoft Graph's client ID to the login parameters.

To see this code as part of a sample application, see the: 
* [Sample on GitHub](https://github.com/Azure-Samples/ms-identity-easyauth-nodejs-storage-graphapi/tree/main/2-WebApp-graphapi-on-behalf).

### Install client library packages

Install the [@azure/identity](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/identity/identity/README.md) and the [@microsoft/microsoft-graph-client](https://www.npmjs.com/package/@microsoft/microsoft-graph-client?activeTab=readme) packages in your project with npm.

```bash
npm install @microsoft/microsoft-graph-client
```

### Configure authentication information

Create an object to hold the [authentication settings](https://github.com/Azure-Samples/ms-identity-easyauth-nodejs-storage-graphapi/blob/main/2-WebApp-graphapi-on-behalf/app.js):

```javascript
// partial code in app.js
const appSettings = {
    appCredentials: {
        clientId: process.env.WEBSITE_AUTH_CLIENT_ID, // Enter the client Id here,
        tenantId: "common", // Enter the tenant info here,
        clientSecret: process.env.MICROSOFT_PROVIDER_AUTHENTICATION_SECRET // Enter the client secret here,
    },
    authRoutes: {
        redirect: "/.auth/login/aad/callback", // Enter the redirect URI here
        error: "/error", // enter the relative path to error handling route
        unauthorized: "/unauthorized" // enter the relative path to unauthorized route
    },
    protectedResources: {
        graphAPI: {
            endpoint: "https://graph.microsoft.com/v1.0/me", // resource endpoint
            scopes: ["User.Read"] // resource scopes
        },
    },
}
```

### Call Microsoft Graph on behalf of the user

The following code shows how to call [Microsoft Graph controller](https://github.com/Azure-Samples/ms-identity-easyauth-nodejs-storage-graphapi/blob/main/2-WebApp-graphapi-on-behalf/controllers/graphController.js) as the app and get some user information.

```javascript
// controllers/graphController.js

// get the name of the app service instance from environment variables
const appServiceName = process.env.WEBSITE_SITE_NAME;

const graphHelper = require('../utils/graphHelper');

exports.getProfilePage = async(req, res, next) => {

    try {
        // get user's access token scoped to Microsoft Graph from session
        // use token to create Graph client
        const graphClient = graphHelper.getAuthenticatedClient(req.session.protectedResources["graphAPI"].accessToken);

        // return user's profile
        const profile = await graphClient
            .api('/me')
            .get();

        res.render('profile', { isAuthenticated: req.session.isAuthenticated, profile: profile, appServiceName: appServiceName });   
    } catch (error) {
        next(error);
    }
}
```

The previous code relies on the following [getAuthenticatedClient](https://github.com/Azure-Samples/ms-identity-easyauth-nodejs-storage-graphapi/blob/main/2-WebApp-graphapi-on-behalf/utils/graphHelper.js) function to return Microsoft Graph client.

```javascript
// utils/graphHelper.js

const graph = require('@microsoft/microsoft-graph-client');

getAuthenticatedClient = (accessToken) => {
    // Initialize Graph client
    const client = graph.Client.init({
        // Use the provided access token to authenticate requests
        authProvider: (done) => {
            done(null, accessToken);
        }
    });

    return client;
}
```


[!INCLUDE [second-part](./includes/tutorial-connect-app-access-microsoft-graph-as-user/end.md)]

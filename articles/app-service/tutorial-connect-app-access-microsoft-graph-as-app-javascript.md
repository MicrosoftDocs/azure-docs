---
title: Tutorial - JavaScript Web app accesses Microsoft Graph as the app| Azure
description: In this tutorial, you learn how to access data in Microsoft Graph from a JavaScript web app by using managed identities.
services: microsoft-graph, app-service-web
author: rwike77
manager: CelesteDG

ms.service: app-service
ms.topic: tutorial
ms.workload: identity
ms.date: 03/14/2023
ms.author: ryanwi
ms.reviewer: stsoneff
ms.devlang: javascript
ms.custom: azureday1, devx-track-js, AppServiceConnectivity
ms.subservice: web-apps
#Customer intent: As an application developer, I want to learn how to access data in Microsoft Graph by using managed identities.
---

# Tutorial: Access Microsoft Graph from a secured JavaScript app as the app

[!INCLUDE [tutorial-content-above-code](./includes/tutorial-microsoft-graph-as-app/introduction.md)]

## Call Microsoft Graph with Node.js

Your web app now has the required permissions and also adds Microsoft Graph's client ID to the login parameters.

The `DefaultAzureCredential` class from [@azure/identity](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/identity/identity/README.md) package is used to get a token credential for your code to authorize requests to Azure Storage. Create an instance of the `DefaultAzureCredential` class, which uses the managed identity to fetch tokens and attach them to the service client. The following code example gets the authenticated token credential and uses it to create a service client object, which gets the users in the group.

To see this code as part of a sample application, see the: 
* [sample on GitHub](https://github.com/Azure-Samples/ms-identity-easyauth-nodejs-storage-graphapi/tree/main/3-WebApp-graphapi-managed-identity).

> [!NOTE]
> The [@azure/identity](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/identity/identity/README.md) package isn't required in your web app for basic authentication/authorization or to authenticate requests with Microsoft Graph. It's possible to [securely call downstream APIs](tutorial-auth-aad.md#call-api-securely-from-server-code) with only the App Service authentication/authorization module enabled.
> 
> However, the App Service authentication/authorization is designed for more basic authentication scenarios. For more complex scenarios (handling custom claims, for example), you need the [@azure/identity](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/identity/identity/README.md) package. There's a little more setup and configuration work in the beginning, but the `@azure/identity` package can run alongside the App Service authentication/authorization module. Later, when your web app needs to handle more complex scenarios, you can disable the App Service authentication/authorization module and `@azure/identity` will already be a part of your app.

### Install client library packages

Install the [@azure/identity](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/identity/identity/README.md) and the [@microsoft/microsoft-graph-client](https://www.npmjs.com/package/@microsoft/microsoft-graph-client?activeTab=readme) packages in your project with npm.

```bash
npm install @azure/identity @microsoft/microsoft-graph-client
```

### Configure authentication information

Create an object to hold the [authentication settings](https://github.com/Azure-Samples/ms-identity-easyauth-nodejs-storage-graphapi/blob/main/3-WebApp-graphapi-managed-identity/app.js):

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
        unauthorized: "/unauthorized" // enter the relative path to unauthorized route
    },
}
```

### Call Microsoft Graph on behalf of the app

The following code shows how to call [Microsoft Graph controller](https://github.com/Azure-Samples/ms-identity-easyauth-nodejs-storage-graphapi/blob/main/2-WebApp-graphapi-on-behalf/controllers/graphController.js) as the app and get some user information.

```javascript
// graphController.js

const graphHelper = require('../utils/graphHelper');
const { DefaultAzureCredential } = require("@azure/identity");

exports.getUsersPage = async(req, res, next) => {

    const defaultAzureCredential = new DefaultAzureCredential();
    
    try {
        // get app's access token scoped to Microsoft Graph
        const tokenResponse = await defaultAzureCredential.getToken("https://graph.microsoft.com/.default");

        // use token to create Graph client
        const graphClient = graphHelper.getAuthenticatedClient(tokenResponse.token);

        // return profiles of users in Graph
        const users = await graphClient
            .api('/users')
            .get();

        res.render('users', { user: req.session.user, users: users });   
    } catch (error) {
        next(error);
    }
}
```

The previous code relies on the following [getAuthenticatedClient](https://github.com/Azure-Samples/ms-identity-easyauth-nodejs-storage-graphapi/blob/main/3-WebApp-graphapi-managed-identity/utils/graphHelper.js) function to return Microsoft Graph client.

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


[!INCLUDE [tutorial-clean-up-steps](./includes/tutorial-cleanup.md)]

[!INCLUDE [tutorial-content-below-code](./includes/tutorial-microsoft-graph-as-app/cleanup.md)]

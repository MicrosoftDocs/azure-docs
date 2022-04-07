---
title: Tutorial - JavaScript Web app accesses Microsoft Graph as the app| Azure
description: In this tutorial, you learn how to access data in Microsoft Graph from a JavaScript web app by using managed identities.
services: microsoft-graph, app-service-web
author: rwike77
manager: CelesteDG

ms.service: app-service-web
ms.topic: tutorial
ms.workload: identity
ms.date: 01/21/2022
ms.author: ryanwi
ms.reviewer: stsoneff
ms.devlang: javascript
ms.custom: azureday1, devx-track-azurepowershell
#Customer intent: As an application developer, I want to learn how to access data in Microsoft Graph by using managed identities.
---

# Tutorial: Access Microsoft Graph from a secured JavaScript app as the app

[!INCLUDE [tutorial-content-above-code](./includes/tutorial-microsoft-graph-as-app/introduction.md)]

## Call Microsoft Graph

The `DefaultAzureCredential` class from [@azure/identity](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/identity/identity/README.md) package is used to get a token credential for your code to authorize requests to Azure Storage. Create an instance of the `DefaultAzureCredential` class, which uses the managed identity to fetch tokens and attach them to the service client. The following code example gets the authenticated token credential and uses it to create a service client object, which gets the users in the group.

To see this code as part of a sample application, see the: * [sample on GitHub](https://github.com/Azure-Samples/ms-identity-easyauth-nodejs-storage-graphapi/tree/main/3-WebApp-graphapi-managed-identity).

```nodejs
const graphHelper = require('../utils/graphHelper');
const { DefaultAzureCredential } = require("@azure/identity");

exports.getUsersPage = async(req, res, next) => {

    const defaultAzureCredential = new DefaultAzureCredential();
    
    try {
        const tokenResponse = await defaultAzureCredential.getToken("https://graph.microsoft.com/.default");

        const graphClient = graphHelper.getAuthenticatedClient(tokenResponse.token);

        const users = await graphClient
            .api('/users')
            .get();

        res.render('users', { user: req.session.user, users: users });   
    } catch (error) {
        next(error);
    }
}
```

To query Microsoft Graph, the sample uses the [Microsoft Graph JavaScript SDK](https://github.com/microsoftgraph/msgraph-sdk-javascript). The code for this is located in [utils/graphHelper.js](https://github.com/Azure-Samples/ms-identity-easyauth-nodejs-storage-graphapi/blob/main/3-WebApp-graphapi-managed-identity/controllers/graphController.js) of the full sample:

```nodejs
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
---

[!INCLUDE [tutorial-clean-up-steps](./includes/tutorial-cleanup.md)]

[!INCLUDE [tutorial-content-below-code](./includes/tutorial-microsoft-graph-as-app/cleanup.md)]
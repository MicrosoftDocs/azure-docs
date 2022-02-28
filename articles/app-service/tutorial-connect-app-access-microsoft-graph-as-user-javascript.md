---
title: Tutorial - Web app accesses Microsoft Graph as the user | Azure
description: In this tutorial, you learn how to access data in Microsoft Graph for a signed-in user.
services: microsoft-graph, app-service-web
author: rwike77
manager: CelesteDG

ms.service: app-service-web
ms.topic: tutorial
ms.workload: identity
ms.date: 03/01/2022
ms.author: ryanwi
ms.reviewer: stsoneff
ms.devlang: csharp
ms.custom: azureday1
#Customer intent: As an application developer, I want to learn how to access data in Microsoft Graph for a signed-in user.
---

# Tutorial: Access Microsoft Graph from a secured .NET app as the user

[!INCLUDE [clean up resources](./includes/scenario-secure-app-clean-up-resources.md)]

## Call Microsoft Graph from Node.js

Your web app now has the required permissions and also adds Microsoft Graph's client ID to the login parameters.

```javascript
const graph = require('@microsoft/microsoft-graph-client');

// Some code omitted for brevity.

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
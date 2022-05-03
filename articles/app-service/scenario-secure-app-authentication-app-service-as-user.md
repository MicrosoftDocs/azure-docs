---
title: Tutorial - Add user authentication to a web app on Azure App Service | Azure
description: In this tutorial, you learn how to enable user authentication and authorization for a web app running on Azure App Service. Limit access to the web app to users in your organization​.
services: active-directory, app-service-web
author: rwike77
manager: CelesteDG

ms.service: app-service-web
ms.topic: tutorial
ms.workload: identity
ms.date: 02/25/2022
ms.author: ryanwi
ms.reviewer: stsoneff
ms.custom: azureday1
#Customer intent: As an application developer, enable authentication and authorization for a web app running on Azure App Service.
---

# Tutorial: Add user authentication to your web app running on Azure App Service

[!INCLUDE [start](./includes/tutorial-set-up-app-service-authentication/intro.md)]

## Connect to backend services as user

User authentication can begin with authenticating the user to your app service as described in the previous section. 

:::image type="content" source="./media/scenario-secure-app-authentication-app-service/web-app-sign-in.svg" alt-text="Diagram that shows user sign-in." border="false":::

Once the app service has the authenticated identity, your system needs to **connect to backend services as the user**:

* A database example is a SQL database which imposes its own security for that identity on tables
    
* A storage example is Blob Storage which imposes its own security for that identity on containers and blobs

* A user needs access to Microsoft Graph to access their own email.

[!INCLUDE [start](./includes/tutorial-set-up-app-service-authentication/after.md)]

> [!div class="nextstepaction"]
> [App service accesses Graph](scenario-secure-app-authentication-app-service-as-user.md)
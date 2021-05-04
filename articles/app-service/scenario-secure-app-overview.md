---
title: Tutorial - Build a secure web app on Azure App Service | Azure
description: In this tutorial, you learn how to build a web app by using Azure App Service, enable authentication, call Azure Storage, and call Microsoft Graph. 
services: active-directory, app-service-web, storage, microsoft-graph
author: rwike77
manager: CelesteDG

ms.service: app-service-web
ms.topic: tutorial
ms.workload: identity
ms.date: 04/02/2021
ms.author: ryanwi
ms.reviewer: stsoneff
ms.custom: azureday1
#Customer intent: As an application developer, I want to learn how to secure access to a web app running on Azure App Service.
---

# Tutorial: Enable authentication in App Service and access storage and Microsoft Graph

This tutorial describes a common application scenario in which you learn how to:

- [Configure authentication for a web app](scenario-secure-app-authentication-app-service.md) and limit access to users in your organization​. See A in the diagram.
- [Securely access Azure Storage](scenario-secure-app-access-storage.md) for the web application using managed identities​. See B in the diagram.
- Access data in Microsoft Graph [for the signed-in user​](scenario-secure-app-access-microsoft-graph-as-user.md) or [for the web application](scenario-secure-app-access-microsoft-graph-as-app.md) using managed identities​. See C in the diagram.
- [Clean up the resources](scenario-secure-app-clean-up-resources.md) you created for this tutorial.

:::image type="content" source="./media/scenario-secure-app-overview/web-app.svg" alt-text="Diagram that shows application scenarios in Microsoft identity platform." border="false":::

To begin, learn how to enable authentication for a web app.

> [!div class="nextstepaction"]
> [Configure authentication for a web app](scenario-secure-app-authentication-app-service.md)

---
title: Tutorial - Build a secure web app on Azure App Service | Azure
description: In this tutorial, you learn how to build a web app by using Azure App Service, enable authentication, call Azure Storage, and call Microsoft Graph. 
services: active-directory, app-service-web, storage, microsoft-graph
author: rwike77
manager: CelesteDG

ms.service: app-service
ms.topic: tutorial
ms.workload: identity
ms.date: 12/10/2021
ms.author: ryanwi
ms.reviewer: stsoneff
ms.custom: azureday1, AppServiceIdentity
#Customer intent: As an application developer, I want to learn how to secure access to a web app running on Azure App Service.
ms.subservice: web-apps
---

# Tutorial: Enable authentication in App Service and access storage and Microsoft Graph

This tutorial describes a common application scenario (for example, an employee dashboard for your company) in which you learn how to:

- [Configure authentication for a web app](scenario-secure-app-authentication-app-service.md) and limit access to users in your organization. See A in the diagram.
- [Securely access the Azure data plane](scenario-secure-app-access-storage.md) (Azure Storage, Azure SQL Database, Azure Key Vault, or other services) from the web application using managed identities to get non-user data. See B in the diagram.
- Access data in Microsoft Graph [for the signed-in user](scenario-secure-app-access-microsoft-graph-as-user.md) to get user data, or [for the web application](scenario-secure-app-access-microsoft-graph-as-app.md) using managed identities to get non-user data. See C in the diagram.

:::image type="content" source="./media/scenario-secure-app-overview/web-app.svg" alt-text="Diagram that shows application scenarios in Microsoft identity platform." border="false":::

To begin, learn how to enable authentication for a web app.

> [!div class="nextstepaction"]
> [Configure authentication for a web app](scenario-secure-app-authentication-app-service.md)

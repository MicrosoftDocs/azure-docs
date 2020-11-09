---
title: Tutorial - build a secure a web app on Azure App Service | Azure
description: In this tutorial you learn how to build a web app using Azure App Service, enable authentication, call Azure storage, and call Microsoft Graph. 
services: active-directory, app-service-web, storage, microsoft-graph
author: rwike77
manager: CelesteDG

ms.service: app-service-web
ms.topic: tutorial
ms.workload: identity
ms.date: 10/27/2020
ms.author: ryanwi
ms.reviewer: stsoneff
#Customer intent: As an application developer, I want to learn how to secure access to a web app running on Azure App Service.
---

# Tutorial: enable authentication in App Service and access storage and Microsoft Graph

This tutorial describes a common application scenario, you learn how to:

- [(A) Configure authentication for a web app](scenario-secure-app-authentication-app-service.md) and limit access to users in your organization​.
- [(B) Securely access Azure storage](scenario-secure-app-access-storage.md) on behalf of the web application using managed identities​.
- (C) Access data in Microsoft Graph [on behalf of the signed-in user​](scenario-secure-app-access-microsoft-graph-as-user.md) or [on behalf of the web application](scenario-secure-app-access-microsoft-graph-as-app.md) using managed identities​.
- [Clean up the resources](scenario-secure-app-clean-up-resources.md) you created for this tutorial.

:::image type="content" source="./media/scenario-secure-app-overview/webapp.svg" alt-text="Application scenarios in Microsoft identity platform" border="false":::

## Next steps

> [!div class="nextstepaction"]
> [Configure authentication for a web app](scenario-secure-app-authentication-app-service.md)

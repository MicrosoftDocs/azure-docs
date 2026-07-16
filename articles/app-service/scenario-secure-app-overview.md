---
title: Secure access patterns for web apps on Azure App Service | Azure
description: Learn about secure access patterns for a web app on Azure App Service, including enabling authentication, accessing Azure data plane services, and calling Microsoft Graph.
author: cephalin
ms.author: cephalin
ms.service: azure-app-service
ms.topic: concept-article
ms.date: 03/27/2026
ms.custom: azureday1, AppServiceIdentity
#Customer intent: As an application developer, I want to learn how to secure access to a web app running on Azure App Service.
---

# Enable authentication in App Service and access storage and Microsoft Graph

This article describes a common application scenario, for example, an employee dashboard for your company, in which you learn how to:

- [Configure authentication for a web app](scenario-secure-app-authentication-app-service.md) and limit access to users in your organization. See A in the diagram.
- [Securely access the Azure data plane](scenario-secure-app-access-storage.md), which includes Azure Storage, Azure SQL Database, Azure Key Vault, or other services, from the web application using managed identities to get data unrelated to the user. See B in the diagram.
- Access data in Microsoft Graph [for the signed-in user](scenario-secure-app-access-microsoft-graph-as-user.md) to get user data, or [for the web application](scenario-secure-app-access-microsoft-graph-as-app.md) using managed identities to get data unrelated to the user. See C in the diagram.

:::image type="content" source="./media/scenario-secure-app-overview/web-app.svg" alt-text="Diagram that shows application scenarios in Microsoft identity platform." border="false":::

To begin, learn how to enable authentication for a web app.

> [!div class="nextstepaction"]
> [Configure authentication for a web app](scenario-secure-app-authentication-app-service.md)

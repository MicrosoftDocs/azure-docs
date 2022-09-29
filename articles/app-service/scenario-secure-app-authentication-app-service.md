---
title: Tutorial - Add app authentication to a web app on Azure App Service | Azure
description: In this tutorial, you learn how to enable app authentication and authorization for a web app running on Azure App Service. Limit access to the web app to users in your organization​.
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

# Tutorial: Add app authentication to your web app running on Azure App Service

[!INCLUDE [start](./includes/tutorial-set-up-app-service-authentication/intro.md)]

## Connect to backend services as app

User authentication can begin with authenticating the user to your app service as described in the previous section. 

:::image type="content" source="./media/scenario-secure-app-authentication-app-service/web-app-sign-in.svg" alt-text="Diagram that shows user sign-in." border="false":::

Once the app service has the authenticated identity, your system needs to **connect to backend services as the app**:

* Use [managed identity](tutorial-connect-overview.md#connect-to-azure-services-with-managed-identity). If managed identity isn't available, then use [Key Vault](tutorial-connect-overview.md#connect-to-key-vault-with-managed-identity). 

* The user identity doesn't need to flow further. Any additional security to reach backend services is handled with the app service's identity. 

[!INCLUDE [start](./includes/tutorial-set-up-app-service-authentication/after.md)]

> [!div class="nextstepaction"]
> [App service accesses storage](scenario-secure-app-access-storage.md)

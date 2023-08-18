---
title: Tutorial - Add authentication to a web app on Azure App Service | Azure
description: In this tutorial, you learn how to enable authentication and authorization for a web app running on Azure App Service. Limit access to the web app to users in your organization​.
services: active-directory, app-service-web
author: rwike77
manager: CelesteDG

ms.service: app-service
ms.topic: include
ms.workload: identity
ms.date: 02/25/2022
ms.author: ryanwi
ms.reviewer: stsoneff
ms.custom: azureday1
#Customer intent: As an application developer, enable authentication and authorization for a web app running on Azure App Service.
ms.subservice: web-apps
---

Learn how to enable authentication for your web app running on Azure App Service and limit access to users in your organization.

In this tutorial, you learn how to:

> [!div class="checklist"]
>
> * Configure authentication for the web app.
> * Limit access to the web app to users in your organization by using Azure Active Directory (Azure AD) as the identity provider.

## Automatic authentication provided by App Service

App Service provides built-in authentication and authorization support, so you can sign in users with no code in your web app. Using the optional App Service authentication/authorization module simplifies authentication and authorization for your app. When you are ready for custom authentication and authorization, you build on this architecture.

App service authentication provides:

* Easily turn on and configure through the Azure portal and app settings. 
* No SDKs, specific languages, or changes to application code are required.​ 
* Several identity providers are supported:
    * Azure AD
    * Microsoft Account
    * Facebook
    * Google
    * Twitter

When the authentication/authorization module is enabled, every incoming HTTP request passes through it before being handled by your app code.​​ To learn more, see [Authentication and authorization in Azure App Service](../../overview-authentication-authorization.md).

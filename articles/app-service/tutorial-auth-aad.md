---
title: 'Tutorial: Authenticate users E2E' 
description: Learn how to use App Service authentication and authorization to secure your App Service apps end-to-end, including access to remote APIs.
keywords: app service, azure app service, authN, authZ, secure, security, multi-tiered, azure active directory, azure ad
ms.devlang: csharp
ms.topic: tutorial
ms.date: 02/13/2023
ms.custom: "devx-track-csharp, seodec18, devx-track-azurecli"
zone_pivot_groups: app-service-platform-windows-linux
---

# Tutorial: Authenticate and authorize users end-to-end in Azure App Service

[Azure App Service](overview.md) provides a highly scalable, self-patching web hosting service. In addition, App Service has built-in support for [user authentication and authorization](overview-authentication-authorization.md). This tutorial shows how to secure your apps with App Service authentication and authorization. It uses a ASP.NET Core app with an Angular.js front end as an example. App Service authentication and authorization support all language runtimes, and you can learn how to apply it to your preferred language by following the tutorial.

Here's a more comprehensive list of things you learn in the tutorial:

> [!div class="checklist"]
> * Enable built-in authentication and authorization
> * Secure apps against unauthenticated requests
> * Use Azure Active Directory as the identity provider
> * Access a remote app on behalf of the signed-in user
> * Secure service-to-service calls with token authentication
> * Use access tokens from server code
> * Use access tokens from client (browser) code

You can follow the steps in this tutorial on macOS, Linux, Windows.

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

## Prerequisites

## Create local app

In this step, you set up the local project. You use the same project to deploy a back-end API app and a front-end web app.

### Clone and run the sample application

## Deploy apps to Azure

In this step, you deploy the project to two App Service apps. One is the front-end app and the other is the back-end app.

### Create Azure resources

## Configure auth

### Enable authentication and authorization for back-end app

### Enable authentication and authorization for front-end app

### Grant front-end app access to back end

### Configure App Service to return a usable access token

### Configure CORS

### Deploy apps to Azure

### Browse to the apps

## When access tokens expire

Your access token expires after some time. For information on how to refresh your access tokens without requiring users to reauthenticate with your app, see [Refresh identity provider tokens](configure-authentication-oauth-tokens.md#refresh-auth-tokens).

## Clean up resources


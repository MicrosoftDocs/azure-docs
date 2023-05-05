---
title: Sign in users in your ASP.NET Core headless app using Microsoft Entra - Prepare tenant
description: Learn about how to prepare your Azure Active Directory (Azure AD) tenant for customers to sign in users in your ASP.NET Core headless application by using Microsoft Entra.
services: active-directory
author: SHERMANOUKO
manager: mwongerapk

ms.author: shermanouko
ms.service: active-directory
ms.workload: identity
ms.subservice: ciam
ms.topic: how-to
ms.date: 05/05/2023
ms.custom: developer

#Customer intent: As a dev, devops, I want to learn about how to enable authentication in my own ASP.NET Core headless app with Azure Active Directory (Azure AD) for customers tenant
---

# Sign in users in your ASP.NET Core headless app using Microsoft Entra - Prepare tenant

In this article, you prepare your Azure Active Directory (Azure AD) for customers tenant for authentication. To prepare your tenant, you do the following tasks:

- Register an ASP.NET Core headless application in the Microsoft Entra admin center. 

- Create a sign in flow in Microsoft Entra admin center.

- Associate your headless application with the user flow. 

After you complete the tasks, you'll collect an *Application (client) ID* and *primary domain name*.

<!-- If you've already registered a headless application in the Microsoft Entra admin center, and associated it with a user flow, you can skip the steps in this article and move to [Prepare your ASP.NET Core headless app](how-to-). -->

## Register the headless app

[!INCLUDE [active-directory-b2c-register-app](./includes/register-app/register-client-app-common.md)]

## Enable public client flow

[!INCLUDE [enable-public-client-flow](./includes/register-app/enable-public-client-flow.md)]

## Grant API permissions

Since this app signs-in users, add delegated permissions:

[!INCLUDE [active-directory-b2c-grant-delegated-permissions](./includes/register-app/grant-api-permission-sign-in.md)] 

## Create a user flow 

[!INCLUDE [active-directory-b2c-app-integration-add-user-flow](./includes/configure-user-flow/create-sign-in-sign-out-user-flow.md)] 

## Associate the headless application with the user flow

[!INCLUDE [active-directory-b2c-app-integration-add-user-flow](./includes/configure-user-flow/add-app-user-flow.md)]

<!-- ## Next steps

> [!div class="nextstepaction"]
> [Prepare your Node.js web app >](how-to-web-app-node-sign-in-prepare-app.md) -->

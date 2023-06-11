---
title: Sign in users in your own Node.js web application  - prepare your tenant
description: Learn how to prepare your Azure Active Directory (Azure AD) tenant for customers to sign in users in your own Node.js web application.
services: active-directory
author: kengaderdus
manager: mwongerapk

ms.author: kengaderdus
ms.service: active-directory
ms.workload: identity
ms.subservice: ciam
ms.topic: how-to
ms.date: 05/22/2023
ms.custom: developer

#Customer intent: As a dev, devops, I want to learn about how to enable authentication in my own Node.js web app with Azure Active Directory (Azure AD) for customers tenant
---

# Sign in users in your own Node.js web application  - prepare your tenant

In this article, you prepare your Azure Active Directory (Azure AD) for customers tenant for authentication. To prepare your tenant, you do the following tasks:

- Register a web application in the Microsoft Entra admin center. 

- Create a sign in and sign out user flow in Microsoft Entra admin center.

- Associate your web application with the user flow. 

After you complete the tasks, you'll collect an *Application (client) ID*, a *Client secret* and a *Directory (tenant) ID*.

If you've already registered a web application in the Microsoft Entra admin center, and associated it with a user flow, you can skip the steps in this article and move to [Prepare your Node.js web app](how-to-web-app-node-sign-in-prepare-app.md).

## Register the web app

[!INCLUDE [active-directory-b2c-register-app](./includes/register-app/register-client-app-common.md)]
[!INCLUDE [active-directory-b2c-app-integration-add-user-flow](./includes/register-app/add-platform-redirect-url-node.md)]  

## Add app client secret 

[!INCLUDE [active-directory-b2c-add-client-secret](./includes/register-app/add-app-client-secret.md)] 

## Grant API permissions

[!INCLUDE [active-directory-b2c-grant-delegated-permissions](./includes/register-app/grant-api-permission-sign-in.md)] 

## Create a user flow 

[!INCLUDE [active-directory-b2c-app-integration-add-user-flow](./includes/configure-user-flow/create-sign-in-sign-out-user-flow.md)] 

## Associate the web application with the user flow

[!INCLUDE [active-directory-b2c-app-integration-add-user-flow](./includes/configure-user-flow/add-app-user-flow.md)]

## Next steps

> [!div class="nextstepaction"]
> [Start building your Node.js web app >](how-to-web-app-node-sign-in-prepare-app.md)
---
title: Sign in users in a Node.js browserless application using the Device Code flow - Prepare tenant
description: Learn how to build a browserless application to sign in and sign out users - Prepare tenant
services: active-directory
author: Dickson-Mwendia
manager: mwongerapk

ms.author: dmwendia
ms.service: active-directory
ms.workload: identity
ms.subservice: ciam
ms.topic: how-to
ms.date: 05/09/2023
ms.custom: developer, devx-track-js
#Customer intent: As a dev, devops, I want to learn about how to build a Node.js browserless application to authenticate users with my Microsoft Entra ID for customers tenant
---

# Sign in users in your own Node.js browserless application - Prepare your tenant

In this article, you prepare your Microsoft Entra ID for customers tenant for authentication. To prepare your tenant, you do the following tasks:

- Register a browserless application in the Microsoft Entra admin center. 

- Create a sign in and sign out user flow in Microsoft Entra admin center.

- Associate your browserless application with the user flow. 

After you complete the tasks, you'll collect an *Application (client) ID* and a *Directory (tenant) ID*.

If you've already registered a browserless application in the Microsoft Entra admin center, and associated it with a user flow, you can skip the steps in this article and move to [Prepare your Node.js browserless app](how-to-browserless-app-node-sign-in-prepare-app.md).

## Register the application

[!INCLUDE [active-directory-b2c-register-app](./includes/register-app/register-client-app-common.md)]
[!INCLUDE [active-directory-b2c-enable-public-client-flow](./includes/register-app/enable-public-client-flow.md)]  

## Grant API permissions

[!INCLUDE [active-directory-b2c-grant-delegated-permissions](./includes/register-app/grant-api-permission-sign-in.md)] 

## Create a user flow 

[!INCLUDE [active-directory-b2c-app-integration-add-user-flow](./includes/configure-user-flow/create-sign-in-sign-out-user-flow.md)] 

## Associate the browserless application with the user flow

[!INCLUDE [active-directory-b2c-app-integration-add-user-flow](./includes/configure-user-flow/add-app-user-flow.md)]

## Next steps

Prepare your app to sign in users in a Microsoft Entra ID for customers tenant:

> [!div class="nextstepaction"]
> [Prepare your app to sign in users >](how-to-browserless-app-node-sign-in-prepare-app.md)

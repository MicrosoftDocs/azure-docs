---
title: Sign in users in your ASP.NET browserless app using Device Code flow - Prepare tenant
description: Learn about how to prepare your Azure Active Directory (Azure AD) for customers tenant to sign in users in your ASP.NET browserless application by using Device Code flow.
services: active-directory
author: SHERMANOUKO
manager: mwongerapk

ms.author: shermanouko
ms.service: active-directory
ms.workload: identity
ms.subservice: ciam
ms.topic: how-to
ms.date: 05/10/2023
ms.custom: developer

#Customer intent: As a dev, devops, I want to learn about how to enable authentication in my own ASP.NET browserless app with Azure Active Directory (Azure AD) for customers tenant
---

# Sign in users in your ASP.NET browserless app using Device Code flow- Prepare tenant

In this article, you prepare your Azure Active Directory (Azure AD) for customers tenant for authentication.

## Register the browserless app

[!INCLUDE [active-directory-b2c-register-app](./includes/register-app/register-client-app-common.md)]

## Enable public client flow

[!INCLUDE [enable-public-client-flow](./includes/register-app/enable-public-client-flow.md)]

## Grant API permissions

Since this app signs-in users, add delegated permissions:

[!INCLUDE [active-directory-b2c-grant-delegated-permissions](./includes/register-app/grant-api-permission-sign-in.md)] 

## Create a user flow 

[!INCLUDE [active-directory-b2c-app-integration-add-user-flow](./includes/configure-user-flow/create-sign-in-sign-out-user-flow.md)] 

## Associate the browserless app with the user flow

[!INCLUDE [active-directory-b2c-app-integration-add-user-flow](./includes/configure-user-flow/add-app-user-flow.md)]

## Next steps

> [!div class="nextstepaction"]
> [Prepare your ASP.NET browserless app >](how-to-browserless-app-dotnet-sign-in-prepare-app.md)

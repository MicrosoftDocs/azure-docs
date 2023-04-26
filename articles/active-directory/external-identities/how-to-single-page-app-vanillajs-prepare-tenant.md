---
title: Sign in users to a vanilla JavaScript Single-page application using Microsoft Entra - Prepare your tenant
description: Learn how to register a vanilla JavaScript single-page app (SPA) with your CIAM tenant.
services: active-directory
author: OwenRichards1
manager: CelesteDG

ms.author: owenrichards
ms.service: active-directory
ms.workload: identity
ms.subservice: ciam
ms.topic: how-to
ms.date: 04/26/2023
ms.custom: developer

#Customer intent: As a developer, I want to learn how to configure vanilla JavaScript single-page app (SPA) to sign in and sign out users with my CIAM tenant.
---

# Sign in users to a vanilla JS Single-page application using Microsoft Entra - Prepare your tenant

This article describes how to register a single-page application (SPA) with your CIAM tenant. A user flow is also created and associated with the SPA, allowing users to sign in and sign out of the application.

In this article:

> [!div class="checklist"]
>
> * Register a single-page application (SPA) with Microsoft Entra
> * Grant API permissions
> * Create a user flow
> * Associate the SPA with the user flow


## Register the Single-page application (SPA)

[!INCLUDE [active-directory-b2c-register-app](./customers/includes/register-app/register-client-app-common.md)]
[!INCLUDE [active-directory-b2c-app-integration-add-user-flow](./customers/includes/register-app/add-platform-redirect-url-vanilla-js.md)]

## Grant API permissions

[!INCLUDE [active-directory-b2c-grant-delegated-permissions](./customers/includes/register-app/grant-api-permission-sign-in.md)]

## Create a user flow

[!INCLUDE [active-directory-b2c-app-integration-add-user-flow](./customers/includes/configure-user-flow/create-sign-in-sign-out-user-flow.md)]

## Associate the SPA with the user flow

[!INCLUDE [active-directory-b2c-app-integration-add-user-flow](./customers/includes/configure-user-flow/add-app-user-flow.md)]

## Next steps

> [!div class="nextstepaction"]
> [Prepare your Vanilla JS SPA](how-to-single-page-app-vanillajs-prepare-app.md)
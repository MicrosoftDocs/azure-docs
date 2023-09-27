---
title: Tutorial - Prepare your customer tenant to authenticate users in a Vanilla JavaScript single-page application
description: Learn how to configure your Microsoft Entra ID for customers tenant for authentication with a Vanilla JavaScript single-page app (SPA).
services: active-directory
author: OwenRichards1
manager: CelesteDG

ms.author: owenrichards
ms.service: active-directory
ms.subservice: ciam
ms.custom: devx-track-js
ms.topic: tutorial
ms.date: 08/17/2023
#Customer intent: As a developer, I want to learn how to configure a Vanilla JavaScript single-page app (SPA) to sign in and sign out users with my Microsoft Entra ID for customers tenant.
---

# Tutorial: Prepare your customer tenant to authenticate a Vanilla JavaScript single-page app

This tutorial series demonstrates how to build a Vanilla JavaScript single-page application (SPA) and prepare it for authentication using the Microsoft Entra admin center. You'll use the [Microsoft Authentication Library for JavaScript](/javascript/api/overview/msal-overview) library to authenticate your app with your Microsoft Entra ID for customers tenant. Finally, you'll run the application and test the sign-in and sign-out experiences.

In this tutorial;

> [!div class="checklist"]
> * Register a SPA in the Microsoft Entra admin center, and record its identifiers
> * Define the platform and URLs
> * Grant permissions to the SPA to access the Microsoft Graph API
> * Create a sign in and sign out user flow in the Microsoft Entra admin center
> * Associate your SPA with the user flow

## Prerequisites

- An Azure subscription. If you don't have one, [create a free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
- This Azure account must have permissions to manage applications. Any of the following Microsoft Entra roles include the required permissions:

    * Application administrator
    * Application developer
    * Cloud application administrator

- A Microsoft Entra ID for customers tenant. If you haven't already, [create one now](https://aka.ms/ciam-free-trial?wt.mc_id=ciamcustomertenantfreetrial_linkclick_content_cnl). You can use an existing customer tenant if you have one.

## Register the SPA and record identifiers

[!INCLUDE [active-directory-b2c-register-app](./includes/register-app/register-client-app-common.md)]

## Add a platform redirect URL

[!INCLUDE [active-directory-b2c-app-integration-add-user-flow](./includes/register-app/add-platform-redirect-url-vanilla-js.md)]

## Grant API permissions

[!INCLUDE [active-directory-b2c-grant-delegated-permissions](./includes/register-app/grant-api-permission-sign-in.md)]

## Create a user flow

[!INCLUDE [active-directory-b2c-app-integration-add-user-flow](./includes/configure-user-flow/create-sign-in-sign-out-user-flow.md)]

## Associate the SPA with the user flow

[!INCLUDE [active-directory-b2c-app-integration-add-user-flow](./includes/configure-user-flow/add-app-user-flow.md)]

## Next steps

> [!div class="nextstepaction"]
> [Prepare your Vanilla JS SPA](tutorial-single-page-app-Vanillajs-prepare-app.md)

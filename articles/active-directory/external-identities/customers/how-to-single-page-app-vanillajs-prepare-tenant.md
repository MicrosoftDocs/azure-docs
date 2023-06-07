---
title: Prepare your customer tenant to authenticate a vanilla JavaScript single-page application.
description: Learn how to configure your Azure Active Directory (AD) for customers tenant for authentication with a vanilla JavaScript single-page app (SPA).
services: active-directory
author: OwenRichards1
manager: CelesteDG
ms.author: owenrichards
ms.service: active-directory
ms.subservice: ciam
ms.topic: how-to
ms.date: 05/25/2023


#Customer intent: As a developer, I want to learn how to configure vanilla JavaScript single-page app (SPA) to sign in and sign out users with my Azure Active Directory (AD) for customers tenant.
---

# Prepare your customer tenant to authenticate a vanilla JavaScript single-page application.

This how-to guide demonstrates how to prepare your Azure Active Directory (Azure AD) for customers tenant for authentication. You'll register a single-page application (SPA) in the Microsoft Entra admin center, and record its identifiers. You'll then create a sign in and sign out user flow in the Microsoft Entra admin center and associate your SPA with the user flow.

## Prerequisites

- Azure AD for customers tenant. If you don't already have one, <a href="https://aka.ms/ciam-free-trial?wt.mc_id=ciamcustomertenantfreetrial_linkclick_content_cnl" target="_blank">sign up for a free trial</a>.
- If you have already registered a SPA in the Microsoft Entra admin center, and associated it with a user flow, you can skip the steps in this article and move to [Prepare a vanilla JavaScript single-page app for authentication](how-to-single-page-app-vanillajs-prepare-app.md).

## Register the SPA

[!INCLUDE [active-directory-b2c-register-app](./includes/register-app/register-client-app-common.md)]
[!INCLUDE [active-directory-b2c-app-integration-add-user-flow](./includes/register-app/add-platform-redirect-url-vanilla-js.md)]

## Grant API permissions

[!INCLUDE [active-directory-b2c-grant-delegated-permissions](./includes/register-app/grant-api-permission-sign-in.md)]

## Create a user flow

[!INCLUDE [active-directory-b2c-app-integration-add-user-flow](./includes/configure-user-flow/create-sign-in-sign-out-user-flow.md)]

## Associate the SPA with the user flow

[!INCLUDE [active-directory-b2c-app-integration-add-user-flow](./includes/configure-user-flow/add-app-user-flow.md)]

## Next steps

> [!div class="nextstepaction"]
> [Prepare your Vanilla JS SPA](how-to-single-page-app-vanillajs-prepare-app.md)
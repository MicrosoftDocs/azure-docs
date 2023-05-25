---
title: Prepare your customer tenant to authenticate users in a React single-page app (SPA)
description: Learn how to configure your Azure Active Directory (AD) for customers tenant for authentication with a React single-page app (SPA).
services: active-directory
author: garrodonnell
manager: celestedg
ms.service: active-directory
ms.workload: identity
ms.subservice: ciam
ms.topic: how-to
ms.date: 05/23/2023
ms.author: godonnell

#Customer intent: As a dev I want to prepare my customer tenant for building a single-page app (SPA) with React
---
# Prepare your customer tenant to authenticate users in a React single-page app (SPA)

Before your applications can interact with Microsoft identity platform they must be registered in a customer tenant that you manage and must be associated with a user flow.

In this article, you learn how to register your application and record identifies, create a user flow and associate that user flow with your application.

## Prerequisites

An Azure subscription. If you don't have one, [create a free account](https://aka.ms/ciam-free-trial?wt.mc_id=ciamcustomertenantfreetrial_linkclick_content_cnl) before you begin.

This Azure account must have permissions to manage applications. Any of the following Azure AD roles include the required permissions:
* Application administrator
* Application developer
* Cloud application administrator

If you haven't already created your own customer tenant, [create one now](https://aka.ms/ciam-free-trial?wt.mc_id=ciamcustomertenantfreetrial_linkclick_content_cnl). You can use an existing customer tenant if you have one.

## Register the application and record identifiers
[!INCLUDE [register-client-app-common](./includes/register-app/register-client-app-common.md)]

## Add a platform redirect URL
[!INCLUDE [add-platform-redirect-url-react](./includes/register-app/add-platform-redirect-url-react.md)]

## Grant sign-in permissions
[!INCLUDE [grant-api-permission-sign-in](./includes/register-app/grant-api-permission-sign-in.md)]

## Create a sign-in and sign-up user flow
[!INCLUDE [register-client-app-common](./includes/configure-user-flow/create-sign-in-sign-out-user-flow.md)]

## Associate the application with your user flow
[!INCLUDE [add-app-user-flow](./includes/configure-user-flow/add-app-user-flow.md)]

## Next steps

> [!div class="nextstepaction"]
> [Start building your React single-page app](./how-to-single-page-application-react-prepare-app.md)

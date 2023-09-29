---
title: "Tutorial: Prepare your customer tenant to sign in user in .NET WPF application"
description: Learn about how to prepare your Microsoft Entra ID for customers tenant to sign in users to your .NET WPF application
services: active-directory
author: SHERMANOUKO
manager: mwongerapk

ms.author: shermanouko
ms.service: active-directory
ms.subservice: ciam
ms.custom: devx-track-dotnet
ms.topic: tutorial
ms.date: 07/26/2023
---

# Tutorial: Prepare your customer tenant to sign in user in .NET WPF application

The first step in securing your applications is to register them. In this tutorial, you prepare your Microsoft Entra ID for customers tenant for authentication. This tutorial is part of a series that guides you to add authentication to a .NET Windows Presentation Form (WPF) app that signs in and signs out users using Microsoft Entra ID for customers.

In this tutorial, you learn how to:

> [!div class="checklist"]
>
> - Register a WPF desktop application in the Microsoft Entra admin center
> - Create a sign-in and sign-out user flow in customers tenant.
> - Associate your WPF desktop app with the user flow.

## Prerequisites

- Microsoft Entra ID for customers tenant. If you don't already have one, [sign up for a free trial](https://aka.ms/ciam-free-trial?wt.mc_id=ciamcustomertenantfreetrial_linkclick_content_cnl).
 
## Register the desktop app

[!INCLUDE [active-directory-b2c-register-app](./includes/register-app/register-client-app-common.md)]

## Specify your app platform

[!INCLUDE [active-directory-b2c-wpf-app-platform](./includes/register-app/add-platform-redirect-url-wpf.md)]  

## Grant API permissions

Since this app signs-in users, add delegated permissions:

[!INCLUDE [active-directory-b2c-grant-delegated-permissions](./includes/register-app/grant-api-permission-sign-in.md)] 

## Create a user flow 

[!INCLUDE [active-directory-b2c-app-integration-add-user-flow](./includes/configure-user-flow/create-sign-in-sign-out-user-flow.md)] 

## Associate the WPF application with the user flow

[!INCLUDE [active-directory-b2c-app-integration-add-user-flow](./includes/configure-user-flow/add-app-user-flow.md)]

## Record your registration details

The next step after this tutorial is to build a WPF desktop app that authenticates users. Ensure you have the following details:

- The Application (client) ID of the WPF desktop app that you registered.
- The Directory (tenant) subdomain where you registered your WPF desktop app.

## Next steps

In the next tutorial, you configure your WPF desktop app.

> [!div class="nextstepaction"]
> [Build your WPF desktop app >](./tutorial-desktop-wpf-dotnet-sign-in-build-app.md)

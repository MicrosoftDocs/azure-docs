---
title: "Tutorial: Register and configure .NET MAUI app in a customer tenant"
description: The tutorials provide a step-by-step guide on how to register and configure a .NET MAUI desktop app with Microsoft Entra External ID for the customer's tenant.
author: henrymbuguakiarie
manager: mwongerapk

ms.author: henrymbugua
ms.service: active-directory
ms.topic: tutorial
ms.subservice: ciam
ms.custom: devx-track-dotnet
ms.date: 06/05/2023
---

# Tutorial: Register and configure .NET MAUI app in a customer tenant

This three-part tutorial series demonstrates how to build a .NET Multi-platform App UI (MAUI) desktop app that authenticates using Microsoft Entra ID for customers tenant. 

The tutorial aims to demonstrate how to create a .NET MAUI app that uses cross-platform code while enhancing the default application class with _Window_ platform-specific code.

Part one involves the registration of the .NET MAUI desktop app within the customer's tenant. In part two, you create the .NET MAUI desktop app, while in part three, you implement the sign-in and sign-out code to enable secure authentication.

In this tutorial, you learn how to:

> [!div class="checklist"]
>
> - Register a .NET MAUI desktop app in customers tenant.
> - Create a sign-in and sign-out user flow in customers tenant.
> - Associate your .NET MAUI desktop app with the user flow.

## Prerequisites

- Microsoft Entra ID for customers tenant. If you don't already have one, <a href="https://aka.ms/ciam-free-trial?wt.mc_id=ciamcustomertenantfreetrial_linkclick_content_cnl" target="_blank">sign up for a free trial</a>.

## Register .NET MAUI desktop app

[!INCLUDE [active-directory-b2c-register-app](./includes/register-app/register-client-app-common.md)]
[!INCLUDE [active-directory-b2c-app-integration-add-platform](./includes/register-app/add-platform-redirect-url-dotnet-maui.md)]

## Grant API permissions

[!INCLUDE [active-directory-b2c-grant-delegated-permissions](./includes/register-app/grant-api-permission-sign-in.md)]

## Create a user flow

[!INCLUDE [active-directory-b2c-app-integration-add-user-flow](./includes/configure-user-flow/create-sign-in-sign-out-user-flow.md)]

## Associate the .NET MAUI desktop app with the user flow

[!INCLUDE [active-directory-b2c-app-integration-add-user-flow](./includes/configure-user-flow/add-app-user-flow.md)]

## Next steps

> [!div class="nextstepaction"]
> [Tutorial: Sign in users in .NET MAUI app](tutorial-desktop-app-maui-sign-in-prepare-app.md)

---
title: "Tutorial: Register and configure .NET MAUI app in a customer tenant"
description: The tutorials provide a step-by-step guide on how to register and configure a .NET MAUI app with Azure AD for the customer's tenant.
author: henrymbuguakiarie
manager: mwongerapk

ms.author: henrymbugua
ms.service: active-directory
ms.topic: tutorial
ms.subservice: ciam
ms.date: 06/05/2023
---

# Tutorial: Register and configure .NET MAUI app in a customer tenant

This tutorial demonstrates how to register and configure a .NET Multi-platform App UI (.NET MAUI) in customer's tenant.

In this tutorial:

> [!div class="checklist"]
>
> - Register a .NET MAUI desktop application in customers tenant.
> - Create a sign-in and sign-out user flow in customers tenant.
> - Associate your .NET MAUI desktop application with the user flow.

## Prerequisites

- Azure Active Directory (Azure AD) for customers tenant. If you don't already have one, <a href="https://aka.ms/ciam-free-trial?wt.mc_id=ciamcustomertenantfreetrial_linkclick_content_cnl" target="_blank">sign up for a free trial</a>.

## Register .NET MAUI desktop application

[!INCLUDE [active-directory-b2c-register-app](./includes/register-app/register-client-app-common.md)]
[!INCLUDE [active-directory-b2c-app-integration-add-platform](./includes/register-app/add-platform-redirect-url-dotnet-maui.md)]

## Grant API permissions

[!INCLUDE [active-directory-b2c-grant-delegated-permissions](./includes/register-app/grant-api-permission-sign-in.md)]

## Create a user flow

[!INCLUDE [active-directory-b2c-app-integration-add-user-flow](./includes/configure-user-flow/create-sign-in-sign-out-user-flow.md)]

## Associate the .NET MAUI desktop application with the user flow

[!INCLUDE [active-directory-b2c-app-integration-add-user-flow](./includes/configure-user-flow/add-app-user-flow.md)]

## Next steps

> [!div class="nextstepaction"] 
> [Tutorial: Create a .NET MAUI shell app](tutorial-desktop-app-maui-sign-in-prepare-app.md)

---
title: "Tutorial: Register and configure .NET browserless app authentication details in a customer tenant"
description: Learn how to register and configure .NET browserless app authentication details in a customer tenant so as to sign in users using Device Code flow.
services: active-directory
author: SHERMANOUKO
manager: mwongerapk

ms.author: shermanouko
ms.service: active-directory
ms.workload: identity
ms.custom: devx-track-dotnet
ms.subservice: ciam
ms.topic: tutorial
ms.date: 07/24/2023
#Customer intent: As a dev, devops, I want to learn how to register and configure .NET browserless app authentication details in a customer tenant so as to sign in users using Device Code flow.
---

# Tutorial: Register and configure .NET browserless app authentication details in a customer tenant

In this article, you prepare your Microsoft Entra ID for customers tenant for authentication. This tutorial is part of a series that guides you through the steps of building an app that authenticates users against External ID for Customers using the device code flow.

In this tutorial, you learn how to:

> [!div class="checklist"]
>
> - Register a .NET browserless app in the Microsoft Entra admin center
> - Create a sign-in and sign-out user flow in customers tenant.
> - Associate your browserless app with the user flow.

## Prerequisites

Microsoft Entra ID for customers tenant. If you don't already have one, [sign up for a free trial](https://aka.ms/ciam-free-trial?wt.mc_id=ciamcustomertenantfreetrial_linkclick_content_cnl).

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

## Record your registration details

The next step after this tutorial is to build a WPF desktop app that authenticates users. Ensure you have the following details:

- The Application (client) ID of the .NET browserless app that you registered.
- The Directory (tenant) subdomain where you registered your .NET browserless app. If your primary domain is *contoso.onmicrosoft.com*, your Directory (tenant) subdomain is *contoso*. If you don't have your primary domain, learn how to [read tenant details](how-to-create-customer-tenant-portal.md#get-the-customer-tenant-details).

## Next steps

> [!div class="nextstepaction"]
> [Sign-in users to your .NET browserless app >](./tutorial-browserless-app-dotnet-sign-in-build-app.md)

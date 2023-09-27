---
title: "Tutorial: Prepare your customer tenant to authorize a .NET daemon application"
description: Learn about how to prepare your Microsoft Entra ID for customers tenant to acquire an access token using client credentials flow in your .NET daemon application
services: active-directorya
author: SHERMANOUKO
manager: mwongerapk

ms.author: shermanouko
ms.service: active-directory
ms.subservice: ciam
ms.custom: devx-track-dotnet
ms.topic: tutorial
ms.date: 07/28/2023
---

# Tutorial: Prepare your customer tenant to authorize a .NET daemon application

The first step in securing your applications is to register them. In this tutorial, you prepare your Microsoft Entra ID for customers tenant for authorization. This tutorial is part of a series that guides you to develop a .NET daemon app that calls your own custom protected web API using Microsoft Entra ID for customers.

In this tutorial, you learn how to:

> [!div class="checklist"]
>
> - Register a web API and configure app permissions the Microsoft Entra admin center.
> - Register a client daemon application and grant it app permissions in the Microsoft Entra admin center
> - Create a client secret for your daemon application in the Microsoft Entra admin center.

## Prerequisites

Microsoft Entra ID for customers tenant. If you don't already have one, [sign up for a free trial](https://aka.ms/ciam-free-trial?wt.mc_id=ciamcustomertenantfreetrial_linkclick_content_cnl).

## 1. Register a web API application

[!INCLUDE [active-directory-b2c-app-integration-add-user-flow](./includes/register-app/register-api-app.md)]

## 2. Configure app roles

[!INCLUDE [active-directory-b2c-app-integration-add-user-flow](./includes/register-app/add-app-role.md)]

## 3. Configure idtyp token claim

[!INCLUDE [active-directory-b2c-app-integration-add-user-flow](./includes/register-app/add-optional-claims-access.md)]

## 4. Register the daemon app

[!INCLUDE [active-directory-b2c-register-app](./includes/register-app/register-client-app-common.md)]

## 5. Create a client secret

[!INCLUDE [active-directory-b2c-app-integration-add-user-flow](./includes/register-app/add-app-client-secret.md)]

## 6. Grant API permissions to the daemon app

[!INCLUDE [active-directory-b2c-app-integration-add-user-flow](./includes/register-app/grant-api-permissions-app-permissions.md)]

## 6. Record your app registration details

The next step after this tutorial is to build a daemon app that calls your web API. Ensure you have the following details:

- The Application (client) ID of the client daemon app that you registered.
- The Directory (tenant) subdomain where you registered your daemon app. If you don't have your tenant name, learn how to [read your tenant details](how-to-create-customer-tenant-portal.md#get-the-customer-tenant-details).
- The application secret value for the daemon app you created.
- The Application (client) ID of the web API app you registered.

## Next steps

In the next tutorial, you configure your daemon and web API applications.

> [!div class="nextstepaction"]
> [Build your daemon application >](tutorial-daemon-dotnet-call-api-build-app.md)

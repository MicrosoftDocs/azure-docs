---
title: "Tutorial: Register and configure .NET daemon app authentication details in a customer tenant"
description: Learn about how to prepare your Azure Active Directory (Azure AD) for customers tenant to acquire an access token using client credentials flow in your .NET daemon application
services: active-directorya
author: SHERMANOUKO
manager: mwongerapk

ms.author: shermanouko
ms.service: active-directory
ms.subservice: ciam
ms.topic: tutorial
ms.date: 07/13/2023
---

# Tutorial: Register and configure .NET daemon app authentication details in a customer tenant

The first step in securing your applications is to register them. In this tutorial, you prepare your Azure Active Directory (Azure AD) for customers tenant for authorization. This tutorial is part of a series that guides you to develop a .NET daemon app that calls your own custom protected web API using Azure AD for customers.

In this tutorial, you learn how to:

> [!div class="checklist"]
>
> - Register a web API and configure app permissions the Microsoft Entra admin center.
> - Register a client daemon application and grant it app permissions in the Microsoft Entra admin center
> - Create a client secret for your daemon application in the Microsoft Entra admin center.

## 1. Register a web API application

[!INCLUDE [active-directory-b2c-app-integration-add-user-flow](./includes/register-app/register-api-app.md)]

## 2. Configure app roles

[!INCLUDE [active-directory-b2c-app-integration-add-user-flow](./includes/register-app/add-app-role.md)]

## 3. Configure optional claims

[!INCLUDE [active-directory-b2c-app-integration-add-user-flow](./includes/register-app/add-optional-claims-access.md)]

## 4. Register the daemon app

[!INCLUDE [active-directory-b2c-register-app](./includes/register-app/register-client-app-common.md)]

## 5. Create a client secret

[!INCLUDE [active-directory-b2c-app-integration-add-user-flow](./includes/register-app/add-app-client-secret.md)]

## 6. Grant API permissions to the daemon app

[!INCLUDE [active-directory-b2c-app-integration-add-user-flow](./includes/register-app/grant-api-permissions-app-permissions.md)]

## 6. Pick your registration details

The next step after this tutorial is to build a daemon app that calls your web API. Ensure you have the following details:

- The Application (client) ID of the client daemon app that you registered.
- The Directory (tenant) subdomain where you registered your daemon app.
- The secret value for the daemon app you created.
- The Application (client) ID of the web API app you registered.

## Next steps

In the next tutorial, you configure your daemon and web API applications.

> [!div class="nextstepaction"]
> [Prepare your daemon application >](tutorial-daemon-dotnet-call-api-build-app.md)

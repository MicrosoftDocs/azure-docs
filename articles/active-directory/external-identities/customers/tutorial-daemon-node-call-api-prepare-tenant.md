---
title: 'Tutorial: Prepare your customer tenant to authorize a Node.js daemon application'
description: Learn how to prepare your customer tenant to authorize your Node.js daemon application
services: active-directory
author: kengaderdus
manager: mwongerapk

ms.author: kengaderdus
ms.service: active-directory
ms.workload: identity
ms.subservice: ciam
ms.topic: tutorial
ms.date: 07/26/2023
ms.custom: developer, devx-track-js
---

# Tutorial: Prepare your customer tenant to authorize a Node.js daemon application

In this tutorial, you learn how to acquire an access token, then call a web API in a Node.js daemon application. You enable the client daemon app to acquire an access token using its own identity. To do so, you first register your application in your Azure Active Directory (Azure AD) for customers tenant.

In this tutorial, you'll:

> [!div class="checklist"]
> - Register a web API and configure app permissions in the Microsoft Entra admin center.
> - Register a client daemon application, the grant it app permissions in the Microsoft Entra admin center.
> - Create a client secret for your daemon application in the Microsoft Entra admin center.

If you've already registered a client daemon application and a web API in the Microsoft Entra admin center, you can skip the steps in this tutorial, then proceed to [Acquire access token for calling an API](tutorial-daemon-node-call-api-build-app.md).

## Prerequisites

- An Azure AD for customers tenant. If you don't already have one, <a href="https://aka.ms/ciam-free-trial?wt.mc_id=ciamcustomertenantfreetrial_linkclick_content_cnl" target="_blank">sign up for a free trial</a>. 

## Register a web API application

[!INCLUDE [active-directory-b2c-app-integration-add-user-flow](./includes/register-app/register-api-app.md)]

## Configure app roles

[!INCLUDE [active-directory-b2c-app-integration-add-user-flow](./includes/register-app/add-app-role.md)]

## Configure idtyp token claim

[!INCLUDE [active-directory-b2c-app-integration-add-user-flow](./includes/register-app/add-optional-claims-access.md)]

## Register the daemon app

[!INCLUDE [active-directory-b2c-register-app](./includes/register-app/register-client-app-common.md)]

## Create a client secret

[!INCLUDE [active-directory-b2c-app-integration-add-user-flow](./includes/register-app/add-app-client-secret.md)]

## Grant API permissions to the daemon app

[!INCLUDE [active-directory-b2c-app-integration-add-user-flow](./includes/register-app/grant-api-permissions-app-permissions.md)]

## Collect your app registration details 

In the next step, you prepare your daemon app application. Make sure you've the following details:

- The Application (client) ID of the client daemon app that you registered.
- The Directory (tenant) subdomain where you registered your daemon app. If you don't have your tenant name, learn how to [read your tenant details](how-to-create-customer-tenant-portal.md#get-the-customer-tenant-details). 
- The application secret value for the daemon app you created.
- The Application (client) ID of the web API app you registered.


## Next steps

In the next tutorial, you prepare your daemon Node.js application.

> [!div class="nextstepaction"]
> [Prepare your daemon application](tutorial-daemon-node-call-api-build-app.md)

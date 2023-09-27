---
title: 'Tutorial: Prepare your customer tenant to sign in users in a Node.js web app'
description: Learn how to prepare your Microsoft Entra ID for customers tenant to sign in users in your Node.js web application.
services: active-directory
author: kengaderdus
manager: mwongerapk

ms.author: kengaderdus
ms.service: active-directory
ms.workload: identity
ms.subservice: ciam
ms.topic: tutorial
ms.date: 07/27/2023
ms.custom: developer, devx-track-js
#Customer intent: As a dev, devops, I want to learn about how to enable authentication in my own Node.js web app with Microsoft Entra ID for customers tenant
---

# Tutorial: Prepare your customer tenant to sign in users in a Node.js web app

This tutorial demonstrates how to prepare your Microsoft Entra ID for customers tenant to sign in users in a Node.js web application.


In this tutorial, you'll;

> [!div class="checklist"]
>
> - Register a web application in the Microsoft Entra admin center. 
> - Create a sign in and sign out user flow in Microsoft Entra admin center.
> - Associate your web application with the user flow. 


If you've already registered a web application in the Microsoft Entra admin center, and associated it with a user flow, you can skip the steps in this article and move to [Prepare your Node.js web app](tutorial-web-app-node-sign-in-prepare-app.md).

## Prerequisites

- Microsoft Entra ID for customers tenant. If you don't already have one, <a href="https://aka.ms/ciam-free-trial?wt.mc_id=ciamcustomertenantfreetrial_linkclick_content_cnl" target="_blank">sign up for a free trial</a>. 

## Register the web app

[!INCLUDE [active-directory-b2c-register-app](./includes/register-app/register-client-app-common.md)]
[!INCLUDE [active-directory-b2c-app-integration-add-user-flow](./includes/register-app/add-platform-redirect-url-node.md)]  

## Add app client secret 

[!INCLUDE [active-directory-b2c-add-client-secret](./includes/register-app/add-app-client-secret.md)] 

## Grant API permissions

[!INCLUDE [active-directory-b2c-grant-delegated-permissions](./includes/register-app/grant-api-permission-sign-in.md)] 

## Create a user flow 

[!INCLUDE [active-directory-b2c-app-integration-add-user-flow](./includes/configure-user-flow/create-sign-in-sign-out-user-flow.md)] 

## Associate the web application with the user flow

[!INCLUDE [active-directory-b2c-app-integration-add-user-flow](./includes/configure-user-flow/add-app-user-flow.md)]

## Collect your app registration details 

Make sure you record the following details for use is later steps:

- The *Application (client) ID* of the client web app that you registered.
- The *Directory (tenant) subdomain* where you registered your web app. If you don't have your tenant name, learn how to [read your tenant details](how-to-create-customer-tenant-portal.md#get-the-customer-tenant-details). 
- The *Client secret* value for the web app you created.

## Next steps

> [!div class="nextstepaction"]
> [Start building your Node.js web app >](tutorial-web-app-node-sign-in-prepare-app.md)

---
title: "Tutorial: Prepare your customer tenant to sign in users in a Node.js CLI application"
description: Learn how to register and configure a Node.js CLI application to signs in users in an Azure AD for customers tenant
services: active-directory
author: Dickson-Mwendia
manager: mwongerapk

ms.author: dmwendia
ms.service: active-directory
ms.workload: identity
ms.subservice: ciam
ms.topic: tutorial
ms.date: 08/04/2023
ms.custom: developer, devx-track-js

#Customer intent: As a dev, devops, I want to learn how to register and configure a Node.js CLI application to signs in users in an Azure AD for customers tenant
---

# Prepare your customer tenant to sign in users in a Node.js CLI application

In this tutorial series, you learn how to build a Node.js command line interface (CLI) application that authenticates users against Azure AD for customers. The Node CLI application you build uses the [Microsoft Authentication Library for Node](/javascript/api/%40azure/msal-node) (MSAL Node) to handle authentication.

In this article, the first of a three-part tutorial series, you'll;

> [!div class="checklist"]
>
> - Register a Node.js CLI app in the Microsoft Entra admin center. 
> - Configure the application's platform settings
> - Grant permissions to the Node CLI app
> - Create a sign in and sign out user flow in Microsoft Entra admin center.
> - Associate your Node.js CLI app with the user flow. 

## Prerequisites


- An Azure AD for customers tenant. If you don't already have one, <a href="https://aka.ms/ciam-free-trial?wt.mc_id=ciamcustomertenantfreetrial_linkclick_content_cnl" target="_blank">sign up for a free trial</a>.

## Register the Node.js CLI app

[!INCLUDE [active-directory-b2c-register-app](./includes/register-app/register-client-app-common.md)] 


## Add platform configurations

[!INCLUDE [active-directory-b2c-app-integration-add-platform-configurations](./includes/register-app/add-platform-redirect-url-node-cli.md)]

[!INCLUDE [active-directory-b2c-enable-public-client-flow](./includes/register-app/enable-public-client-flow.md)]  

## Grant API permissions

Since this app signs in users, add delegated permissions. These permissions allow the app to act on behalf of a signed-in user and access resources that the user has permissions to access. 

[!INCLUDE [active-directory-b2c-grant-delegated-permissions](./includes/register-app/grant-api-permission-sign-in.md)] 

## Create a user flow 

[!INCLUDE [active-directory-b2c-app-integration-add-user-flow](./includes/configure-user-flow/create-sign-in-sign-out-user-flow.md)] 

## Associate the Node.js CLI application with the user flow

[!INCLUDE [active-directory-b2c-app-integration-add-user-flow](./includes/configure-user-flow/add-app-user-flow.md)]


## Next steps

Prepare your app to sign in users in an Azure AD for customers tenant:

> [!div class="nextstepaction"]
> [Prepare your app to sign in users >](tutorial-cli-app-node-sign-in-prepare-app.md)

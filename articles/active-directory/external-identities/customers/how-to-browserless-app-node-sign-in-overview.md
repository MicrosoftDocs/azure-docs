---
title: Sign in users in your own Node.js browserless application using the Device Code flow - Overview
description: Learn how to build a Node.js browserless application that signs in users using the Device Code flow - Overview.
services: active-directory
author: Dickson-Mwendia
manager: mwongerapk

ms.author: dmwendia
ms.service: active-directory
ms.workload: identity
ms.subservice: ciam
ms.topic: how-to
ms.date: 05/09/2023
ms.custom: developer, devx-track-js
#Customer intent: As a dev, devops, I want to learn about how to build a Node.js browserless application to authenticate users with my Microsoft Entra ID for customers tenant
---

# Sign in users in your own Node.js browserless application using the Device Code flow - Overview

In this article, you learn how to build a Node.js browserless application that signs in users. The client application you build uses the [OAuth 2.0 device code flow](../../develop/v2-oauth2-device-code.md) to sign in users interactively, using another device such as a mobile phone.

We've organized the content into three separate articles so it's easy for you to follow: 

- [Prepare your Microsoft Entra ID for customers tenant](how-to-browserless-app-node-sign-in-prepare-tenant.md) tenant guides you how to register your app and configure user flows in the Microsoft Entra admin center.
- [Prepare your Node.js browserless application](how-to-browserless-app-node-sign-in-prepare-app.md) guides you how to set up your Node.js app structure.
- [Add sign-in and sign-out](how-to-browserless-app-node-sign-in-sign-out.md) guides you how to add authentication support to your application using MSAL Node. 

## Overview

The device code flow is an OAuth2.0 grant flow that allows users to sign in to input-constrained devices like smart TVs, IoT devices, and printers. In a typical interactive authentication experience, External ID for customers requires a web browser for user sign-in. In our browserless application scenario, the app uses the [Microsoft Authentication Library (MSAL) for Node](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-node) to obtain tokens through a flow that involves the following steps:

1. The application receives a code from the authorization server that is used to initiate authentication.
1. The application prompts the user to use another device and navigate to a URL (for instance, https://microsoft.com/devicelogin), where they're prompted to enter the code.
1. That URL leads the user through a normal authentication experience, including consent prompts and multi-factor authentication if necessary.
1. Upon successful authentication, the app receives the required tokens through a back channel to enable it to perform the web API calls it needs. 

## Prerequisites

- [Node.js](https://nodejs.org).

- [Visual Studio Code](https://code.visualstudio.com/download) or another code editor.

- Microsoft Entra ID for customers tenant. If you don't already have one, <a href="https://aka.ms/ciam-free-trial?wt.mc_id=ciamcustomertenantfreetrial_linkclick_content_cnl" target="_blank">sign up for a free trial</a>.


If you want to run a sample Node.js browserless application rather than building it from scratch, complete the steps in [Sign in users in a sample Node.js browserless application by using the Device Code flow](./sample-browserless-app-node-sign-in.md)

## Next steps

Learn how to prepare your External ID for customers tenant:

> [!div class="nextstepaction"]
> [Prepare your Microsoft Entra ID for customers tenant >](how-to-browserless-app-node-sign-in-prepare-tenant.md)

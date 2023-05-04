---
title: Sign in users in a sample Node.js headless application by using Microsoft Entra
description: Learn how to configure a headless application to sign in and sign out users by using Microsoft Entra - Overview.
services: active-directory
author: Dickson-Mwendia
manager: mwongerapk

ms.author: dmwendia
ms.service: active-directory
ms.workload: identity
ms.subservice: ciam
ms.topic: how-to
ms.date: 04/30/2023
ms.custom: developer

#Customer intent: As a dev, devops, I want to learn about how to configure a sample Node.js headless application to authenticate users with my Azure Active Directory (Azure AD) for customers tenant
---

# Sign in users in your own Node.js headless application by using Microsoft Entra

In this article, you learn how to build a Node.js headless application that signs in users. The client application you build uses the OAuth 2.0 device code flow to sign in users interactively, using another device such as a mobile phone. Using the device code flow, the application will:

- Authenticate a user.
- Acquire an access token to call a web API.

We've broken down this article into three separate articles so it's easy for you to follow: 

- [Prepare your Azure AD for customers tenant](how-to-headless-app-node-sign-in-prepare-tenant.md) tenant guides you how to register your app and configure user flows in the Microsoft Entra admin center.
- [Prepare your Node.js headless application](how-to-headless-app-node-sign-in-prepare-app.md) guides you how to set up your Node.js app structure.
- [Add sign-in and sign-out](how-to-headless-app-node-sign-in-sign-out.md) guides you how to add authentication support to your application using MSAL Node. 

## Overview

The device code flow is an OAuth2.0 grant flow that allows users to sign in to input-constrained devices like smart TVs, IoT devices, and printers. In a typical interactive authentication experience, Azure AD for customers requires a web browser for user sign-in. In our headless application scenario, the app uses the [Microsoft Authentication Library (MSAL) for Node](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-node) to obtain tokens through a flow that involves the following steps:

1. The application checks with the authorization server for a device and code used to initiate authentication.
1. The application asks the user to use another device and navigate to a URL (for instance, http://microsoft.com/devicelogin), where they are prompted to enter the code.
1. That URL leads the user through a normal authentication experience, including consent prompts and multi-factor authentication if necessary.
1. Upon successful authentication, the app receives the required tokens through a back channel and uses it to perform the web API calls it needs. 

## Prerequisites

- [Node.js](https://nodejs.org).

- [Visual Studio Code](https://code.visualstudio.com/download) or another code editor.

- Azure AD for customers tenant. If you don't already have one, [sign up for a free trial](https://aka.ms/ciam-hub-free-trial). 


If you want to run a sample Node.js headless application to get a feel of how things work, complete the steps in [Sign in users in a sample Node.js headless application by using Microsoft Entra](how-to-headless-app-node-sample-sign-in.md)

## Next steps

Learn how to prepare your Azure AD for customers tenant.

> [!div class="nextstepaction"]
> [Prepare your Azure AD for customers tenant >](how-to-headless-app-node-sign-in-prepare-tenant.md)

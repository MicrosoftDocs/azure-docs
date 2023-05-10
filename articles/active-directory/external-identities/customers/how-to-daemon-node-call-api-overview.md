---
title: Call an API in your Node.js daemon application
description: Learn how to configure your Node.js daemon application that calls an API. The API is protected by Azure Active Directory (Azure AD) for customers 
services: active-directory
author: kengaderdus
manager: mwongerapk

ms.author: kengaderdus
ms.service: active-directory
ms.workload: identity
ms.subservice: ciam
ms.topic: how-to
ms.date: 05/22/2023
ms.custom: developer

#Customer intent: As a dev, devops, I want to create a Node.js daemon application that acquires an access token, then calls an API protected by Azure Active Directory (Azure AD) for customers tenant
---

# Call an API in your Node.js daemon application

In this article, you learn how to acquire an access token, then call a web API in your own Node.js daemon application. You add authorization to your daemon application against your Azure Active Directory (Azure AD) for customers tenant. 

We've organized the content into three separate articles so it's easy for you to follow: 

- [Prepare your Azure AD for customers tenant](how-to-daemon-node-call-api-prepare-app.md) tenant guides you how to register your app and configure user flows in the Microsoft Entra admin center.

- [Prepare your daemon application](how-to-daemon-node-call-api-prepare-app.md) guides you how to set up your Node.js app structure.

- [Acquire an access token and call API](how-to-daemon-node-call-api-call-api.md) guides you how to acquire an access token using client credentials flow, then use the token to call a web API.

## Overview

The [OAuth 2.0 client credentials grant flow](../../develop/v2-oauth2-client-creds-grant-flow.md) permits a web service (confidential client) to use its own credentials, instead of impersonating a user, to authenticate when calling another web service. 

The client credentials grant flow is commonly used for server-to-server interactions that must run in the background, without immediate interaction with a user.

The application you build uses [Microsoft Authentication Library (MSAL) for Node](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-node) to simplify adding authorization to your node daemon application.


## Prerequisites

- [Node.js](https://nodejs.org).

- [Visual Studio Code](https://code.visualstudio.com/download) or another code editor.

- Azure AD for customers tenant. If you don't already have one, [sign up for a free trial](https://aka.ms/ciam-free-trial?wt.mc_id=ciamcustomertenantfreetrial_linkclick_content_cnl). 


If you want to run a sample Node.js daemon application to get a feel of how things work, complete the steps in [Call an API in a sample Node.js daemon application](how-to-daemon-node-sample-call-api.md).

## Next steps

Next, learn how to prepare your Azure AD for customers tenant.

> [!div class="nextstepaction"]
> [Prepare your Azure AD for customers tenant for authorization >](how-to-daemon-node-call-api-prepare-tenant.md)
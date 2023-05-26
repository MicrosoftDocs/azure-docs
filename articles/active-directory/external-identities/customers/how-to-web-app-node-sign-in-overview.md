---
title: Sign in users in your own Node.js web application
description: Learn about how to Sign in users in your own Node.js web application.
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

#Customer intent: As a dev, devops, I want to learn about how to enable authentication in my own Node.js web app with Azure Active Directory (Azure AD) for customers tenant
---

# Sign in users in your own Node.js web application  

In this article, you learn how to sign in users in your own Node.js web application that you build. You add authentication to your web application against your Azure Active Directory (Azure AD) for customers tenant. 

We've organized the content into three separate articles so it's easy for you to follow: 

- [Prepare your Azure AD for customers tenant](how-to-web-app-node-sign-in-prepare-tenant.md) tenant guides you how to register your app and configure user flows in the Microsoft Entra admin center.

- [Prepare your web application](how-to-web-app-node-sign-in-prepare-app.md) guides you how to set up your Node.js app structure.

- [Add sign-in and sign-out](how-to-web-app-node-sign-in-sign-in-out.md) guides you how to add authentication to your application by using MSAL.

## Overview

OpenID Connect (OIDC) is an authentication protocol that's built on OAuth 2.0. You can use OIDC to securely sign users in to an application. The application you build uses [Microsoft Authentication Library (MSAL) for Node](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-node) to simplify adding authentication to your node web application.

The sign-in flow involves the following steps:

1. Users go to the web app and initiate a sign-in flow.

1. The app initiates an authentication request and redirects users to Azure AD for customers.

1. Users sign up, sign in or reset the password. Users cal also sign in with a social account it's configured.

1. After users sign in successfully, Azure AD for customers returns an ID token to the web app.

1. The web app reads the ID token claims, and then displays a secure page to users.

## Prerequisites

- [Node.js](https://nodejs.org).

- [Visual Studio Code](https://code.visualstudio.com/download) or another code editor.

- Azure AD for customers tenant. If you don't already have one, <a href="https://aka.ms/ciam-free-trial?wt.mc_id=ciamcustomertenantfreetrial_linkclick_content_cnl" target="_blank">sign up for a free trial</a>. 


If you want to run a sample Node.js web application to get a feel of how things work, complete the steps in [Sign in users in a sample Node.js web application](how-to-web-app-node-sample-sign-in.md)

## Next steps

Next, learn how to prepare your Azure AD for customers tenant.

> [!div class="nextstepaction"]
> [Prepare your Azure AD for customers tenant for authentication >](how-to-web-app-node-sign-in-prepare-tenant.md)

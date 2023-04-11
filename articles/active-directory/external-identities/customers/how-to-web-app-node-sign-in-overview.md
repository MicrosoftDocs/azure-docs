---
title: Sign in users in my own Node.js web application by using Microsoft Entra - Overview
description: Learn about how to Sign in users in your own Node.js web application by using Microsoft Entra.
services: active-directory
author: kengaderdus
manager: mwongerapk

ms.author: kengaderdus
ms.service: active-directory
ms.workload: identity
ms.subservice: ciam
ms.topic: how-to
ms.date: 04/30/2023
ms.custom: developer

#Customer intent: As a dev, devops, I want to learn about how to enable authentication in my own Node.js web app with Azure Active Directory (Azure AD) for customers tenant
---

# Sign in users in my own Node.js web application by using Microsoft Entra 

In this article, you learn how to sign in users in your own Node.js web application that you build. This article uses [Microsoft Authentication Library (MSAL) for Node](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-node) to simplify adding authentication to your node web application. You authenticate your wen app against your Azure Active Directory (Azure AD) for customers tenant. 

We've broken down this article into three separate articles so it's easy for you to follow: 

- [Prepare your Azure AD for customers tenant](how-to-web-app-node-sign-in-prepare-tenant.md) tenant guides you how register your app and configure user flows in the Microsoft Entra admin center.

- [Prepare your web application](how-to-web-app-node-sign-in-prepare-app.md) guides you how to set up your Node.js app structure.

- [Add sign-in and sign-out](how-to-web-app-node-sign-in-sign-in-out.md) guides you how to add authentication to your application by using MSAL.

## Prerequisites

- [Node.js](https://nodejs.org).

- [Visual Studio Code](https://code.visualstudio.com/download) or another code editor.

- Azure AD for customers tenant. If you don't already have one, [sign up for a free trial](https://developer.microsoft.com/identity/customers). 


If you want to run a sample Node.js web application to get a feel of how things work, complete the steps in [Sign in users in a sample Node.js web application by using Microsoft Entra](how-to-web-app-node-sample-sign-in.md)

## Next steps

Next, learn how to prepare your Azure AD for customers tenant.

> [!div class="nextstepaction"]
> [Prepare your Azure AD for customers tenant >](how-to-web-app-node-sign-in-prepare-tenant.md)
---
title: "Tutorial: Prepare your single-page app (SPA) for auth"
titleSuffix: Microsoft identity platform
description: In this tutorial, you will learn about the authorization code flow in a React single-page application
services: active-directory
author: Dickson-Mwendia
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: tutorial
ms.workload: identity
ms.date: 09/27/2021
ms.author: dmwendia
ms.reviewer: marsma, dhruvmu
ms.custom: include
---

# Tutorial: Prepare your single-page app (SPA) for auth

In this tutorial, you build a single-page application (SPA) that signs in users and calls Microsoft Graph by using the authorization code flow with PKCE. The SPA you build uses the Microsoft Authentication Library (MSAL).

Follow the steps in this tutorial to:

> [!div class="checklist"]
> - Create a React project with npm
> - Register the application in the Azure portal
> - Add code to support user sign-in and sign-out
> - Add code to call Microsoft Graph API
> - Add code to call a web API and get user data
> - Test the app
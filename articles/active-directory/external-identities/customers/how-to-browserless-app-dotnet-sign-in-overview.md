---
title: Sign in users to an ASP.NET browserless app using Device Code flow
description: Learn about how to Sign in users in your ASP.NET browserless app using Device Code flow.
services: active-directory
author: SHERMANOUKO
manager: mwongerapk

ms.author: shermanouko
ms.service: active-directory
ms.workload: identity
ms.subservice: ciam
ms.topic: how-to
ms.date: 05/10/2023
ms.custom: developer

#Customer intent: As a dev, devops, I want to learn about how to enable authentication in my ASP.NET browserless app with Azure Active Directory (Azure AD) for customers tenant
---

# Sign in users to an ASP.NET browserless app using Device Code flow

In this series of articles, you learn how to sign in users to your ASP.NET browserless app. The articles guide you through the steps of building an app that authenticates users against Azure Active Directory (Azure AD) for Customers using the device code flow.

The article series is broken down into the following steps:

1. Overview (this article)
1. [Prepare your tenant](how-to-browserless-app-dotnet-sign-in-prepare-tenant.md)
1. [Sign in user](how-to-browserless-app-dotnet-sign-in-sign-in.md)

## Prerequisites

- [.NET 7 SDK](https://dotnet.microsoft.com/download/dotnet/7.0).

- [Visual Studio Code](https://code.visualstudio.com/download) or another code editor.

- Azure AD for customers tenant. If you don't already have one, <a href="https://aka.ms/ciam-free-trial?wt.mc_id=ciamcustomertenantfreetrial_linkclick_content_cnl" target="_blank">sign up for a free trial</a>.

##  OAuth 2.0 device authorization grant flow

The Microsoft identity platform supports the [device authorization grant](https://tools.ietf.org/html/rfc8628), which allows users to sign in to input-constrained devices such as a smart TV, IoT device, or a printer. To enable this flow:

1. The device provides a verification url to the user. The user navigates to this url in a browser on another device to sign in.
1. The user inputs a code provided by the device which is then verified if it matches the code issues by the device.
1. Once the user is signed in, the device is able to get access tokens and refresh tokens as needed. 

For more information, see [device code flow in the Microsoft identity platform](/azure/active-directory/develop/v2-oauth2-device-code).

If you want to run a sample ASP.NET browserless app to get a feel of how things work, complete the steps in [Sign in users in a sample ASP.NET browserless app](./how-to-browserless-app-dotnet-sample-sign-in.md)

## Next steps

Next, learn how to prepare your Azure AD for customers tenant.

> [!div class="nextstepaction"]
> [Prepare your Azure AD for customers tenant >](how-to-browserless-app-dotnet-sign-in-prepare-tenant.md)

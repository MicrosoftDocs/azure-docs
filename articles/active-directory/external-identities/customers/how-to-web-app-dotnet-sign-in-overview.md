---
title: Sign in users in your own ASP.NET web application by using Microsoft Entra - Overview
description: Learn about how to Sign in users in your own ASP.NET web application by using Microsoft Entra.
services: active-directory
author: cilwerner
manager: celestedg

ms.author: cwerner
ms.service: active-directory
ms.workload: identity
ms.subservice: ciam
ms.topic: how-to
ms.date: 04/30/2023
ms.custom: developer

#Customer intent: As a dev, devops, I want to learn about how to enable authentication in my own ASP.NET web app with Azure Active Directory (Azure AD) for customers tenant
---

# How-to guide: Sign in users in your own ASP.NET web application by using Microsoft Entra 

This how-to guide shows you how to build an ASP.NET web application and sign in users. You'll register the web application on an Azure Active Directory (Azure AD) for customers tenant and add authentication.

This how-to series is made up of the following steps:

- [Prepare your Azure AD for customers tenant](how-to-web-app-dotnet-sign-in-prepare-tenant.md) registers your app and configures user flows in the Microsoft Entra admin center.
- [Prepare your web application](how-to-web-app-dotnet-sign-in-prepare-app.md) sets up your ASP.NET app structure.
- [Add sign-in and sign-out](how-to-web-app-dotnet-sign-in-sign-out.md) adds authentication to your application by using MSAL.

## Overview

OpenID Connect (OIDC) is an authentication protocol that's built on OAuth 2.0. You can use OIDC to securely sign users in to an application. The application you build uses [Microsoft Identity Web](https://github.com/AzureAD/microsoft-identity-web) to simplify adding authentication to your ASP.NET web application.

The sign-in flow involves the following steps:

1. Users go to the web app and initiate a sign-in flow.
1. The app initiates an authentication request and redirects users to Azure AD for customers.
1. Users sign up, sign in or reset the password. Users can also sign in with a configured social account.
1. After users sign in successfully, Azure AD for customers returns an ID token to the web app.
1. The web app reads the ID token claims, and then displays a secure page to users.

## Prerequisites

- A minimum requirement of [.NET Core 6.0 SDK](https://dotnet.microsoft.com/download/dotnet).
- [Visual Studio Code](https://code.visualstudio.com/download) or another code editor.
- Azure AD for customers tenant. If you don't already have one, [sign up for a free trial](https://developer.microsoft.com/identity/customers). 


If you want to run a sample ASP.NET web application to get a feel of how things work, complete the steps in [Sign in users in a sample Node.js web application by using Microsoft Entra](how-to-web-app-dotnet-sample-sign-in.md)

## Next steps

Next, learn how to prepare your Azure AD for customers tenant.

> [!div class="nextstepaction"]
> [Prepare your Azure AD for customers tenant](how-to-web-app-dotnet-sign-in-prepare-tenant.md)
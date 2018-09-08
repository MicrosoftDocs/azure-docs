---
title: Application types in Azure Active Directory | Microsoft Docs
description: Describes the types of apps and scenarios supported by the Azure Active Directory v2.0 endpoint.
services: active-directory
documentationcenter: ''
author: CelesteDG
manager: mtillman
editor: ''

ms.service: active-directory
ms.component: develop
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 09/24/2018
ms.author: celested
ms.reviewer: saeeda, jmprieur, andret
ms.custom: aaddev
---

# Application types in Azure Active Directory

The Azure Active Directory (Azure AD) supports authentication for a variety of modern app architectures, all of them based on industry-standard protocols [OAuth 2.0 or OpenID Connect](active-directory-v2-protocols.md).

This article describes the types of apps that you can build by using Azure AD regardless of your preferred language or platform. It notes differences you need to know when writing a particular app that works with the v1.0 endpoint or v2.0 endpoint. The information in this article is designed to help you understand high-level scenarios before you start working with the code.

> [!NOTE]
> The v2.0 endpoint doesn't support all Azure AD scenarios and features. To determine whether you should use the v2.0 endpoint, read about [v2.0 limitations](active-directory-v2-limitations.md).

## The basics

You must register each app that uses the v2.0 endpoint in the [Microsoft Application Registration Portal](https://apps.dev.microsoft.com). The app registration process collects and assigns these values for your app:

* An **Application ID** that uniquely identifies your app
* A **Redirect URI** that you can use to direct responses back to your app
* A few other scenario-specific values

For details, learn how to [register an app](quickstart-v2-register-an-app.md).

After the app is registered, the app communicates with Azure AD by sending requests to the Azure AD v2.0 endpoint. We provide open-source frameworks and libraries that handle the details of these requests. You also have the option to implement the authentication logic yourself by creating requests to these endpoints:

```
https://login.microsoftonline.com/common/oauth2/v2.0/authorize
https://login.microsoftonline.com/common/oauth2/v2.0/token
```
<!-- TODO: Need a page for libraries to link to -->

## Daemons and server-side apps

Apps that have long-running processes or that operate without interaction with a user also need a way to access secured resources, such as Web APIs. These apps can authenticate and get tokens by using the app's identity, rather than a user's delegated identity, with the OAuth 2.0 client credentials flow.

In this flow, the app interacts directly with the `/token` endpoint to obtain endpoints:

![Daemon app authentication flow](./media/v2-app-types/convergence_scenarios_daemon.png)

To build a daemon app, see the [client credentials documentation](v2-oauth2-client-creds-grant-flow.md), or try a [.NET sample app](https://github.com/Azure-Samples/active-directory-dotnet-daemon-v2).

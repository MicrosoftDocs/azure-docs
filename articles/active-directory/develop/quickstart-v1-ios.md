---
title: Sign in and call Microsoft Graph from iOS | Azure
description: Learn how to sign in users and call the Microsoft Graph API from my iOS app.
services: active-directory
author: rwike77
manager: CelesteDG

ms.assetid: 42303177-9566-48ed-8abb-279fcf1e6ddb
ms.service: active-directory
ms.subservice: develop
ms.workload: identity
ms.tgt_pltfrm: mobile-ios
ms.devlang: objective-c
ms.topic: quickstart
ms.date: 10/25/2019
ms.author: ryanwi
ms.custom: aaddev
ms.reviewer: brandwe
#Customer intent: As an application developer, I want to know how to sign in users and call the Microsoft Graph API from my iOS app.
---

# Quickstart: Sign in users and call the Microsoft Graph API from an iOS app (v1.0)

[Microsoft identity platform](v2-overview.md) is an evolution of the Azure Active Directory (Azure AD) developer platform. It allows developers to build applications that sign in all Microsoft identities and get tokens to call Microsoft APIs such as Microsoft Graph or APIs that developers have built.

[Microsoft Authentication Library (MSAL)](msal-overview.md) enables developers to acquire tokens from the Microsoft identity platform endpoint in order to access secured Web APIs. Active Directory Authentication Library (ADAL) integrates with the Azure AD for developers (v1.0) endpoint, where MSAL integrates with the Microsoft identity platform (v2.0) endpoint.

For new macOS and iOS applications, we recommend you use Microsoft identity platform (v2.0) and MSAL to acquire tokens and access secured web APIs: [Quickstart: Sign in users and call the Microsoft Graph API from an iOS or macOS app](quickstart-v2-ios.md).

---
title: Azure AD Xamarin getting started | Microsoft Docs
description: Build Xamarin applications that integrate with Azure AD for sign-in and call Azure AD-protected APIs using OAuth.
services: active-directory
author: rwike77
manager: CelesteDG

ms.assetid: 198cd2c3-f7c8-4ec2-b59d-dfdea9fe7d95
ms.service: active-directory
ms.subservice: develop
ms.workload: identity
ms.tgt_pltfrm: mobile-xamarin
ms.devlang: dotnet
ms.topic: quickstart
ms.date: 07/17/2019
ms.author: ryanwi
ms.reviewer: jmprieur
ms.custom: aaddev
---

# Quickstart: Build a Xamarin app that integrates Microsoft sign-in

[Microsoft identity platform](v2-overview.md) is an evolution of the Azure Active Directory (Azure AD) developer platform. It allows developers to build applications that sign in all Microsoft identities and get tokens to call Microsoft APIs such as Microsoft Graph or APIs that developers have built.

[Microsoft Authentication Library (MSAL)](msal-overview.md) enables developers to acquire tokens from the Microsoft identity platform endpoint in order to access secured Web APIs. Active Directory Authentication Library (ADAL) integrates with the Azure AD for developers (v1.0) endpoint, where MSAL integrates with the Microsoft identity platform (v2.0) endpoint.

## Next steps

For new Xamarin applications, we recommend you use Microsoft identity platform (v2.0) and MSAL to acquire tokens and access secured web APIs. See [Integrate Microsoft identity and the Microsoft Graph into a Xamarin forms app using MSAL](https://github.com/azure-samples/active-directory-xamarin-native-v2#integrate-microsoft-identity-and-the-microsoft-graph-into-a-xamarin-forms-app-using-msal) (without the optional steps) to get started.

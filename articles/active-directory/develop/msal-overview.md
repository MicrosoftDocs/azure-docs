---
title: Learn about Microsoft Authentication Library (MSAL) | Azure
description: Microsoft Authentication Library (MSAL) enables application developers to acquire tokens in order to call secured Web APIs. These Web APIs can be the Microsoft Graph, other Microsoft APIS, third party Web APIs, or your own Web API. MSAL supports multiple application architectures and platforms.
services: active-directory
documentationcenter: dev-center-name
author: rwike77
manager: celested
editor: ''

ms.service: active-directory
ms.subservice: develop
ms.devlang: na
ms.topic: overview
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 04/12/2019
ms.author: ryanwi
ms.reviewer: saeeda
ms.custom: aaddev
#Customer intent: As an application developer, I want to learn about the Microsoft Authentication Library so I can decide if this platform meets my application development needs and requirements.
ms.collection: M365-identity-device-management
---

# Overview of Microsoft Authentication Library (MSAL)
Microsoft Authentication Library (MSAL) enables developers to acquire [tokens](active-directory-dev-glossary.md#security-token) from Azure AD in order to access secured Web APIs. These Web APIs can be the Microsoft Graph, other Microsoft APIS, 3rd party Web APIs, or your own Web API. MSAL SDKs are available for .NET, JavaScript, Android, and iOS, which support many different application architectures and platforms.

MSAL gives you many ways to get tokens, with a consistent API for a number of platforms. Using MSAL provides the following benefits:

* No need to directly use the OAuth libraries or code against the protocol in your application.
* Acquires tokens on behalf of a user or on behalf of an application.
* Maintains a token cache and refreshes tokens for you when they are close to expire. You don't need to handle token expiration on your own.
* Helps you specify which audience you want your application to sign-in (your org, several orgs, work and school and Microsoft personal accounts, social identities with Azure AD B2C, users in sovereign and national clouds).
* Helps you set up your application from configuration files.
* Helps you troubleshoot your app by exposing actionable exceptions, logging and telemetry.

## Supports multiple languages and frameworks

| Library | Supported platforms and frameworks|
| --- | --- | 
| [MSAL.NET](https://github.com/AzureAD/microsoft-authentication-library-for-dotnet)| .NET Framework, .NET Core, Xamarin Android, Xamarin iOS, Universal Windows Platform|
| [MSAL.js (preview)](https://github.com/AzureAD/microsoft-authentication-library-for-js)| JavaScript/TypeScript frameworks such as AngularJS, Ember.js, or Durandal.js|
| [MSAL for Android (preview)](https://github.com/AzureAD/microsoft-authentication-library-for-android)|Android|
| [MSAL for Objective-C (preview)](https://github.com/AzureAD/microsoft-authentication-library-for-objc)|iOS|
| [MSAL for Python (preview)](https://github.com/AzureAD/microsoft-authentication-library-for-python) | |)
| [MSAL for Java (preview)](https://github.com/AzureAD/microsoft-authentication-library-for-java) ||

## Differences between ADAL and MSAL
Active Directory Authentication Library (ADAL) integrates with the Azure AD v1.0 endpoint, where MSAL integrates with the Azure AD v2.0 endpoint. The v1.0 endpoint supports work accounts, but not personal accounts. The v2.0 endpoint is the unification of Microsoft personal accounts and work accounts into a single authentication system. Additionally, with MSAL you can also get authentications for Azure AD B2C.

For more specific information, read about the differences between [ADAL.NET and MSAL.NET](msal-compare-msaldotnet-and-adaldotnet.md) and [ADAL.js and MSAL.js](msal-compare-msaljs-and-adaljs.md).

             


## Next steps
* Learn about the [application scenarios](v2-scenarios-overview.md) where you can use MSAL.
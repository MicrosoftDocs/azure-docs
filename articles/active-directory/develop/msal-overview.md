---
title: Learn about MSAL | Azure
titleSuffix: Microsoft identity platform
description: Microsoft Authentication Library (MSAL) enables application developers to acquire tokens in order to call secured Web APIs. These Web APIs can be the Microsoft Graph, other Microsoft APIS, third-party Web APIs, or your own Web API. MSAL supports multiple application architectures and platforms.
services: active-directory
author: TylerMSFT
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: conceptual
ms.workload: identity
ms.date: 10/30/2019
ms.author: twhitney
ms.reviewer: saeeda
ms.custom: aaddev, identityplatformtop40
#Customer intent: As an application developer, I want to learn about the Microsoft Authentication Library so I can decide if this platform meets my application development needs and requirements.
---

# Overview of Microsoft Authentication Library (MSAL)
Microsoft Authentication Library (MSAL) enables developers to acquire [tokens](developer-glossary.md#security-token) from the Microsoft identity platform endpoint in order to access secured Web APIs. These Web APIs can be the Microsoft Graph, other Microsoft APIS, third-party Web APIs, or your own Web API. MSAL is available for .NET, JavaScript, Android, and iOS, which support many different application architectures and platforms.

MSAL gives you many ways to get tokens, with a consistent API for a number of platforms. Using MSAL provides the following benefits:

* No need to directly use the OAuth libraries or code against the protocol in your application.
* Acquires tokens on behalf of a user or on behalf of an application (when applicable to the platform).
* Maintains a token cache and refreshes tokens for you when they are close to expire. You don't need to handle token expiration on your own.
* Helps you specify which audience you want your application to sign in (your org, several orgs, work, and school and Microsoft personal accounts, social identities with Azure AD B2C, users in sovereign, and national clouds).
* Helps you set up your application from configuration files.
* Helps you troubleshoot your app by exposing actionable exceptions, logging, and telemetry.

## Application types and scenarios
Using MSAL, a token can be acquired from a number of application types: web applications, web APIs, single-page apps (JavaScript), mobile and native applications, and daemons and server-side applications.

MSAL can be used in many application scenarios, including the following:

* [Single page applications (JavaScript)](scenario-spa-overview.md)
* [Web app signing in users](scenario-web-app-sign-user-overview.md)
* [Web application signing in a user and calling a web API on behalf of the user](scenario-web-app-call-api-overview.md)
* [Protecting a web API so only authenticated users can access it](scenario-protected-web-api-overview.md)
* [Web API calling another downstream web API on behalf of the signed-in user](scenario-web-api-call-api-overview.md)
* [Desktop application calling a web API on behalf of the signed-in user](scenario-desktop-overview.md)
* [Mobile application calling a Web API on behalf of the user who's signed-in interactively](scenario-mobile-overview.md).
* [Desktop/service daemon application calling web API on behalf of itself](scenario-daemon-overview.md)

## Languages and frameworks

| Library | Supported platforms and frameworks|
| --- | --- |
| [MSAL.NET](https://github.com/AzureAD/microsoft-authentication-library-for-dotnet)| .NET Framework, .NET Core, Xamarin Android, Xamarin iOS, Universal Windows Platform|
| [MSAL.js](https://github.com/AzureAD/microsoft-authentication-library-for-js)| JavaScript/TypeScript frameworks such as AngularJS, Ember.js, or Durandal.js|
| [MSAL for Android](https://github.com/AzureAD/microsoft-authentication-library-for-android)|Android|
| [MSAL for iOS and macOS](https://github.com/AzureAD/microsoft-authentication-library-for-objc)|iOS and macOS|
| [MSAL Java (preview)](https://github.com/AzureAD/microsoft-authentication-library-for-java)|Java|
| [MSAL Python (preview)](https://github.com/AzureAD/microsoft-authentication-library-for-python)|Python|

## Differences between ADAL and MSAL

Active Directory Authentication Library (ADAL) integrates with the Azure AD for developers (v1.0) endpoint, where MSAL integrates with the Microsoft identity platform (v2.0) endpoint. The v1.0 endpoint supports work accounts, but not personal accounts. The v2.0 endpoint is the unification of Microsoft personal accounts and work accounts into a single authentication system. Additionally, with MSAL you can also get authentications for Azure AD B2C.

For more specific information, read about [migrating to MSAL.NET from ADAL.NET](msal-net-migration.md) and [migrating to MSAL.js from ADAL.js](msal-compare-msal-js-and-adal-js.md).

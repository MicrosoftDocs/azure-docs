---
title: Learn about MSAL
description: The Microsoft Authentication Library (MSAL) enables application developers to acquire tokens in order to call secured web APIs. These web APIs can be the Microsoft Graph, other Microsoft APIs, third-party web APIs, or your own web API. MSAL supports multiple application architectures and platforms.
services: active-directory
author: cilwerner
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: conceptual
ms.workload: identity
ms.date: 09/20/2022
ms.author: cwerner
ms.reviewer: saeeda
ms.custom: aaddev, identityplatformtop40, has-adal-ref
#Customer intent: As an application developer, I want to learn about the Microsoft Authentication Library so I can decide if this platform meets my application development needs and requirements.
---

# Overview of the Microsoft Authentication Library (MSAL)

The Microsoft Authentication Library (MSAL) enables developers to acquire [security tokens](developer-glossary.md#security-token) from the Microsoft identity platform to authenticate users and access secured web APIs. It can be used to provide secure access to Microsoft Graph, other Microsoft APIs, third-party web APIs, or your own web API. MSAL supports many different application architectures and platforms including .NET, JavaScript, Java, Python, Android, and iOS.

MSAL gives you many ways to get tokens, with a consistent API for many platforms. Using MSAL provides the following benefits:

* No need to directly use the OAuth libraries or code against the protocol in your application.
* Acquires tokens on behalf of a user or application (when applicable to the platform).
* Maintains a token cache and refreshes tokens for you when they're close to expiring. You don't need to handle token expiration on your own.
* Helps you specify which audience you want your application to sign in. The sign in audience can include personal Microsoft accounts, social identities with Azure AD B2C organizations, work, school, or users in sovereign and national clouds.
* Helps you set up your application from configuration files.
* Helps you troubleshoot your app by exposing actionable exceptions, logging, and telemetry.

> [!VIDEO https://www.youtube.com/embed/zufQ0QRUHUk]

## Application types and scenarios
Using MSAL, a token can be acquired for many application types: web applications, web APIs, single-page apps (JavaScript), mobile and native applications, and daemons and server-side applications.

MSAL can be used in many application scenarios, including the following:

* [Single page applications (JavaScript)](scenario-spa-overview.md)
* [Web app signing in users](scenario-web-app-sign-user-overview.md)
* [Web application signing in a user and calling a web API on behalf of the user](scenario-web-app-call-api-overview.md)
* [Protecting a web API so only authenticated users can access it](scenario-protected-web-api-overview.md)
* [Web API calling another downstream web API on behalf of the signed-in user](scenario-web-api-call-api-overview.md)
* [Desktop application calling a web API on behalf of the signed-in user](scenario-desktop-overview.md)
* [Mobile application calling a web API on behalf of the user who's signed-in interactively](scenario-mobile-overview.md).
* [Desktop/service daemon application calling web API on behalf of itself](scenario-daemon-overview.md)

## Languages and frameworks

| Library | Supported platforms and frameworks|
| --- | --- |
| [MSAL for Android](https://github.com/AzureAD/microsoft-authentication-library-for-android)|Android|
| [MSAL Angular](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-angular)| Single-page apps with Angular and Angular.js frameworks|
| [MSAL for iOS and macOS](https://github.com/AzureAD/microsoft-authentication-library-for-objc)|iOS and macOS|
| [MSAL Go (Preview)](https://github.com/AzureAD/microsoft-authentication-library-for-go)|Windows, macOS, Linux|
| [MSAL Java](https://github.com/AzureAD/microsoft-authentication-library-for-java)|Windows, macOS, Linux|
| [MSAL.js](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-browser)| JavaScript/TypeScript frameworks such as Vue.js, Ember.js, or Durandal.js|
| [MSAL.NET](https://github.com/AzureAD/microsoft-authentication-library-for-dotnet)| .NET Framework, .NET Core, Xamarin Android, Xamarin iOS, Universal Windows Platform|
| [MSAL Node](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-node)|Web apps with Express, desktop apps with Electron, Cross-platform console apps|
| [MSAL Python](https://github.com/AzureAD/microsoft-authentication-library-for-python)|Windows, macOS, Linux|
| [MSAL React](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-react)| Single-page apps with React and React-based libraries (Next.js, Gatsby.js)|

## Migrate apps that use ADAL to MSAL

Active Directory Authentication Library (ADAL) integrates with the Azure Active Directory (Azure AD) for developers (v1.0) endpoint, where MSAL integrates with the Microsoft identity platform. The v1.0 endpoint supports work accounts, but not personal accounts. The v2.0 endpoint is the unification of Microsoft personal accounts and work accounts into a single authentication system. Additionally, with MSAL you can also get authentications for Azure AD B2C.

For more information about how to migrate to MSAL, see [Migrate applications to the Microsoft Authentication Library (MSAL)](msal-migration.md).

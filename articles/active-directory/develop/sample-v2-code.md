---
title: Microsoft identity platform code samples | Microsoft Docs
description: Provides an index of available Microsoft identity platform (V2 endpoint) code samples, organized by scenario.
services: active-directory
documentationcenter: dev-center-name
author: CelesteDG
manager: mtillman
editor: ''

ms.assetid: a242a5ff-7300-40c2-ba83-fb6035707433
ms.service: active-directory
ms.subservice: develop
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 10/26/2018
ms.author: celested
ms.reviewer: jmprieur
ms.custom: aaddev
ms.collection: M365-identity-device-management
---

# Microsoft identity platform code samples (v2.0 endpoint)

[!INCLUDE [active-directory-develop-applies-v2-msal](../../../includes/active-directory-develop-applies-v2-msal.md)]

You can use Microsoft identity platform to:

- Add authentication and authorization to your web applications and web APIs.
- Require an access token to access a protected web API.

This article briefly describes and provides you with links to samples for the Microsoft identity platform endpoint. These samples show you how it's done, along with code snippets that you can use in your applications. On the code sample page, you'll find detailed readme topics that help with requirements, installation, and set up. Comments within the code are there to help you understand the critical sections.

> [!NOTE]
> If you are interested in v1.0 samples, see [Azure AD code samples (v1.0 endpoint)](sample-v1-code.md).

To understand the basic scenario for each sample type, see [App types for the Microsoft identity platform endpoint](v2-app-types.md).

You can also contribute to the samples on GitHub. To learn how, see [Microsoft Azure Active Directory samples and documentation](https://github.com/Azure-Samples?page=3&query=active-directory).

## Single-page applications (SPA)

These samples show how to write a single-page application secured with Microsoft identity platform. These samples use one of the flavors of MSAL.js:

* [Microsoft Authentication Library for JavaScript](https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-core)
* [Microsoft Authentication Library for Angular](https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-angular)
* [Microsoft Authentication Library for AngularJS](https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-angularjs)

| Platform | Calls Microsoft Graph |
| -------- | --------------------- |
| ![JavaScript](media/sample-v2-code/logo_js.png) JavaScript (msal.js)  | [javascript-graphapi-web-v2](https://github.com/Azure-Samples/active-directory-javascript-graphapi-web-v2) |
| ![Angular JS](media/sample-v2-code/logo_angular.png) JavaScript (MSAL AngularJS) | [MsalAngularjsDemoApp](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-angularjs/samples/MsalAngularjsDemoApp)
| ![Angular](media/sample-v2-code/logo_angular.png) JavaScript (MSAL Angular) | [MSALAngularDemoApp](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-angular/samples/MSALAngularDemoApp) |

## Web applications

The following samples illustrate web applications that sign in users. Some samples also demonstrate the application calling Microsoft Graph, or your own web API with the user's identity.

| Platform | Only signs in users | Signs in users and calls Microsoft Graph |
| -------- | ------------------- | --------------------------------- |
| ![ASP.NET Core](media/sample-v2-code/logo_NETcore.png)</p>ASP.NET Core 2.1 | [ASP.NET Core WebApp signs-in users tutorial](https://aka.ms/aspnetcore-webapp-sign-in) | Same sample in the [ASP.NET Core Web App calls Microsoft Graph](https://aka.ms/aspnetcore-webapp-call-msgraph) phase |
| ![ASP.NET](media/sample-v2-code/logo_NETframework.png)</p> ASP.NET | [ASP.NET Quickstart](https://github.com/AzureAdQuickstarts/AppModelv2-WebApp-OpenIDConnect-DotNet) </p> [dotnet-webapp-openidconnect-v2](https://github.com/azure-samples/active-directory-dotnet-webapp-openidconnect-v2)  |  [dotnet-admin-restricted-scopes-v2](https://github.com/azure-samples/active-directory-dotnet-admin-restricted-scopes-v2) </p> |[msgraph-training-aspnetmvcapp](https://github.com/microsoftgraph/msgraph-training-aspnetmvcapp)
| ![Node.js](media/sample-v2-code/logo_nodejs.png)  |                   | [Node.js Quickstart](https://github.com/azureadquickstarts/appmodelv2-webapp-openidconnect-nodejs) |
| ![Ruby](media/sample-v2-code/logo_ruby.png) |                   | [msgraph-training-rubyrailsapp](https://github.com/microsoftgraph/msgraph-training-rubyrailsapp) |

## Desktop and mobile public client apps

The following samples show public client applications (desktop/mobile applications) that access the Microsoft Graph API or your own Web API in the name of a user. All these client applications use Microsoft Authentication Libraries (MSAL).

| Client application | Platform | Flow/Grant | Calls Microsoft Graph | Calls an ASP.NET Core 2.0 Web API |
| ------------------ | -------- |  ----------| ---------- | ------------------------- |
| Desktop (WPF)      | ![.NET/C#](media/sample-v2-code/logo_NET.png) | interactive | [dotnet-desktop-msgraph-v2](https://github.com/azure-samples/active-directory-dotnet-desktop-msgraph-v2) | [dotnet-native-aspnetcore-v2](https://aka.ms/msidentity-aspnetcore-webapi) |
| Desktop (Console)   | ![.NET/C# (Desktop)](media/sample-v2-code/logo_NET.png) | Integrated Windows Authentication | [dotnet-iwa-v2](https://github.com/azure-samples/active-directory-dotnet-iwa-v2) |  |
| Desktop (Console)   | ![.NET/C# (Desktop)](media/sample-v2-code/logo_NETcore.png) | Username/Password |[dotnetcore-up-v2](https://github.com/azure-samples/active-directory-dotnetcore-console-up-v2) |  |
| Mobile (Android, iOS, UWP)   | ![.NET/C# (Xamarin)](media/sample-v2-code/logo_xamarin.png) | interactive |[xamarin-native-v2](https://github.com/azure-samples/active-directory-xamarin-native-v2) |  |
| Mobile (iOS)       | ![iOS / Objective C or swift](media/sample-v2-code/logo_iOS.png) | interactive |[ios-swift-native-v2](https://github.com/azure-samples/active-directory-ios-swift-native-v2) </p> [ios-native-nxoauth2-v2](https://github.com/azure-samples/active-directory-ios-native-nxoauth2-v2) |  |
| Mobile (Android)   | ![Android / Java](media/sample-v2-code/logo_Android.png) | interactive |  [android-native-v2](https://github.com/azure-samples/active-directory-android-native-v2 ) |  |

## Daemon applications

The following samples show an application that accesses the Microsoft Graph API with its own identity (with no user).

| Client application | Platform | Flow/Grant | Calls Microsoft Graph |
| ------------------ | -------- | ---------- | -------------------- |
| Console | ![.NET Core](media/sample-v2-code/logo_NETcore.png)</p> ASP.NET  | Client Credentials | [dotnetcore-daemon-v2](https://github.com/azure-samples/active-directory-dotnetcore-daemon-v2) |
| Web app | ![ASP.NET](media/sample-v2-code/logo_NETframework.png)</p> ASP.NET  | Client Credentials | [dotnet-daemon-v2](https://github.com/azure-samples/active-directory-dotnet-daemon-v2) |

## Headless applications

The following sample shows a public client application running on a device without a web browser. The app can be a command-line tool, or running on Linux/Mac, or an IoT application. The sample features an app accessing the Microsoft Graph API in the name of a user who signs-in interactively on another device (such as a mobile phone). This client application uses MicroSoft Authentication Libraries (MSAL).

| Client application | Platform | Flow/Grant | Calls Microsoft Graph |
| ------------------ | -------- |  ----------| ---------- |
| Desktop (Console)   | ![.NET/C# (Desktop)](media/sample-v2-code/logo_NETcore.png) | Device code flow |[dotnetcore-devicecodeflow-v2](https://github.com/azure-samples/active-directory-dotnetcore-devicecodeflow-v2) |

## Web APIs

The following sample shows how to protect a web API with the Microsoft identity platform endpoint. This API is exercised by a WPF application, but it can be called by any application. The web API also calls Microsoft Graph.

| Platform | Sample |
| -------- | ------------------- |
| ![.NET/C#](media/sample-v2-code/logo_NET.png) | WebAPI (service) of [dotnet-native-aspnetcore-v2](https://aka.ms/msidentity-aspnetcore-webapi-calls-msgraph) |

## Other Microsoft Graph samples

To learn about [samples](https://github.com/microsoftgraph/msgraph-community-samples/tree/master/samples#aspnet) and tutorials that demonstrate different usage patterns for the Microsoft Graph API, including authentication with Azure AD, see [Microsoft Graph Community samples & tutorials](https://github.com/microsoftgraph/msgraph-community-samples).

## See also

- [Azure Active Directory (v1.0) developer's guide](v1-overview.md)
- [Azure AD Graph API conceptual and reference](https://msdn.microsoft.com/library/azure/hh974476.aspx)
- [Azure AD Graph API Helper Library](https://www.nuget.org/packages/Microsoft.Azure.ActiveDirectory.GraphClient)

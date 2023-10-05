---
title: Code samples for Azure Active Directory v1.0
description: Provides an index of Azure Active Directory (v1.0 endpoint) code samples, organized by scenario.
documentationcenter: dev-center-name
author: jmprieur
manager: CelesteDG
ms.service: active-directory
ms.subservice: azuread-dev
ms.topic: sample
ms.workload: identity
ms.date: 07/15/2019
ms.author: ryanwi
ms.reviewer: jmprieur
ms.custom: aaddev
ROBOTS: NOINDEX
---

# Azure Active Directory code samples (v1.0 endpoint)

[!INCLUDE [active-directory-azuread-dev](../../../includes/active-directory-azuread-dev.md)]

You can use Azure Active Directory (Azure AD) to add authentication and authorization to your web applications and web APIs.

This section provides links to samples you can use to learn more about the Azure AD v1.0 endpoint. These samples show you how it's done along with code snippets that you can use in your applications. On the code sample page, you'll find detailed read-me topics that help with requirements, installation, and set-up. And the code is commented to help you understand the critical sections.

> [!NOTE]
> If you are interested in Microsoft Entra V2 code samples, see [v2.0 code samples by scenario](../develop/sample-v2-code.md?toc=/azure/active-directory/azuread-dev/toc.json&bc=/azure/active-directory/azuread-dev/breadcrumb/toc.json).

> [!WARNING]
> Support for Active Directory Authentication Library (ADAL) will end in December, 2022. Apps using ADAL on existing OS versions will continue to work, but technical support and security updates will end. Without continued security updates, apps using ADAL will become increasingly vulnerable to the latest security attack patterns. For more information, see [Migrate apps to MSAL](../develop/msal-migration.md).

To understand the basic scenario for each sample type, see [Authentication scenarios for Azure AD](v1-authentication-scenarios.md).

You can also contribute to our samples on GitHub. To learn how, see [Azure Active Directory samples and documentation](https://github.com/Azure-Samples?page=3&query=active-directory).

## Single-page applications

This sample shows how to write a single-page application secured with Azure AD.

| Platform | Calls its own API | Calls another Web API |
|--|--|--|
| ![This image shows the JavaScript logo](media/sample-v2-code/logo-js.png) | [javascript-singlepageapp](https://github.com/Azure-Samples/active-directory-javascript-singlepageapp-dotnet-webapi) |
| ![This image shows the Angular JS logo](media/sample-v2-code/logo-angular.png) | [angularjs-singlepageapp](https://github.com/Azure-Samples/active-directory-angularjs-singlepageapp) | [angularjs-singlepageapp-cors](https://github.com/Azure-Samples/active-directory-angularjs-singlepageapp-dotnet-webapi) |

## Web Applications

### Web Applications signing in users, calling Microsoft Graph, or a Web API with the user's identity

The following samples illustrate Web applications signing users. Some of these applications also call the Microsoft Graph or your own Web API, in the name of the signed-in user.

| Platform | Only signs in users | Calls Microsoft Graph | Calls another ASP.NET or ASP.NET Core 2.0 Web API |
|--|--|--|--|
| ![This image shows the ASP.NET Core logo](media/sample-v2-code/logo-netcore.png)</p>ASP.NET Core 2.0 | [dotnet-webapp-openidconnect-aspnetcore](https://github.com/Azure-Samples/active-directory-dotnet-webapp-openidconnect-aspnetcore) | [webapp-webapi-multitenant-openidconnect-aspnetcore](https://github.com/Azure-Samples/active-directory-webapp-webapi-multitenant-openidconnect-aspnetcore/) </p>(Azure AD Graph) | [dotnet-webapp-webapi-openidconnect-aspnetcore](https://github.com/Azure-Samples/active-directory-dotnet-webapp-webapi-openidconnect-aspnetcore) |
| ![This image shows the ASP.NET Framework logo](media/sample-v2-code/logo-netframework.png)</p> ASP.NET 4.5 | </p> [webapp-WSFederation-dotNet](https://github.com/Azure-Samples/active-directory-dotnet-webapp-wsfederation) </p> [dotnet-webapp-webapi-oauth2-useridentity](https://github.com/Azure-Samples/active-directory-dotnet-webapp-webapi-oauth2-useridentity) | [dotnet-webapp-multitenant-openidconnect](https://github.com/Azure-Samples/active-directory-dotnet-webapp-multitenant-openidconnect)</p> (Azure AD Graph) |
| ![This image shows the Python logo](media/sample-v2-code/logo-python.png) |  | [python-webapp-graphapi](https://github.com/Azure-Samples/active-directory-python-webapp-graphapi) |
| ![This image shows the Java log](media/sample-v2-code/logo-java.png) |  | [java-webapp-openidconnect](https://github.com/azure-samples/active-directory-java-webapp-openidconnect) |
| ![This image shows the PHP logo](media/sample-v2-code/logo-php.png) |  | [php-graphapi-web](https://github.com/Azure-Samples/active-directory-php-graphapi-web) |

### Web applications demonstrating role-based access control (authorization)

The following samples show how to implement role-based access control (RBAC). RBAC is used to restrict the permissions of certain features in a web application to certain users. The users are authorized depending on whether they belong to an **Azure AD group** or have a given application **role**.

| Platform | Sample | Description |
|--|--|--|
| ![This image shows the ASP.NET Framework logo](media/sample-v2-code/logo-netframework.png)</p> ASP.NET 4.5 | [dotnet-webapp-groupclaims](https://github.com/Azure-Samples/active-directory-dotnet-webapp-groupclaims) </p>  [dotnet-webapp-roleclaims](https://github.com/Azure-Samples/active-directory-dotnet-webapp-roleclaims) | A .NET 4.5 MVC web app that uses Azure AD **roles** for authorization |

## Desktop and mobile public client applications calling Microsoft Graph or a Web API

The following samples illustrate public client applications (desktop/mobile applications) that access the Microsoft Graph or a Web API in the name of a user. Depending on the devices and platforms, applications can sign in users in different ways (flows/grants):

- Interactively
- Silently (with integrated Windows authentication on Windows, or username/password)
- By delegating the interactive sign-in to another device (device code flow used on devices which don't provide web controls)

| Client application | Platform | Flow/Grant | Calls Microsoft Graph | Calls an ASP.NET or ASP.NET Core 2.x Web API |
|------------------ | -------- | ---------- | -------------------- | ------------------------- |
| Desktop (WPF) | ![This image shows the .NET/C# logo](media/sample-v2-code/logo-net.png) | Interactive | Part of [`dotnet-native-multitarget`](https://github.com/azure-samples/active-directory-dotnet-native-multitarget) | [`dotnet-native-desktop`](https://github.com/Azure-Samples/active-directory-dotnet-native-desktop) </p> [`dotnet-native-aspnetcore`](https://github.com/Azure-Samples/active-directory-dotnet-native-aspnetcore/)</p> [`dotnet-webapi-manual-jwt-validation`](https://github.com/azure-samples/active-directory-dotnet-webapi-manual-jwt-validation) |
| Mobile (UWP) | ![This image shows the .NET/C#/UWP](media/sample-v2-code/logo-windows.png) | Interactive | [`dotnet-native-uwp-wam`](https://github.com/azure-samples/active-directory-dotnet-native-uwp-wam) </p> This sample uses [WAM](/windows/uwp/security/web-account-manager), not [ADAL.NET](https://aka.ms/adalnet) | [`dotnet-windows-store`](https://github.com/Azure-Samples/active-directory-dotnet-windows-store) (UWP application using ADAL.NET to call a single tenant Web API) </p> [`dotnet-webapi-multitenant-windows-store`](https://github.com/Azure-Samples/active-directory-dotnet-webapi-multitenant-windows-store) (UWP application using ADAL.NET to call a multi-tenant Web API) |
| Mobile (Android, iOS, UWP) | ![This image shows the .NET/C# (Xamarin)](media/sample-v2-code/logo-xamarin.png) | Interactive | [`dotnet-native-multitarget`](https://github.com/azure-samples/active-directory-dotnet-native-multitarget) |
| Mobile (Android) | ![This image shows the Android logo](media/sample-v2-code/logo-android.png) | Interactive | [`android`](https://github.com/Azure-Samples/active-directory-android) |
| Mobile (iOS) | ![This image shows iOS / Objective C or Swift](media/sample-v2-code/logo-ios.png) | Interactive | [`nativeClient-iOS`](https://github.com/azureadquickstarts/nativeclient-ios) |
| Desktop (Console) | ![This image shows the .NET/C# logo](media/sample-v2-code/logo-net.png) | Username / Password </p> Integrated Windows authentication | | [`dotnet-native-headless`](https://github.com/azure-samples/active-directory-dotnet-native-headless) |
| Desktop (Console) | ![This image shows the Java logo](media/sample-v2-code/logo-java.png) | Username / Password | | [`java-native-headless`](https://github.com/Azure-Samples/active-directory-java-native-headless) |
| Desktop (Console) | ![This image shows the .NET Core/C# logo](media/sample-v2-code/logo-netcore.png) | Device code flow | | [`dotnet-deviceprofile`](https://github.com/Azure-Samples/active-directory-dotnet-deviceprofile) |

## Daemon applications (accessing web APIs with the application's identity)

The following samples show desktop or web applications that access the Microsoft Graph or a web API with no user (with the application identity).

Client application | Platform | Flow/Grant | Calls an ASP.NET or ASP.NET Core 2.0 Web API
------------------ | -------- | ---------- | --------------------
Daemon app (Console)          | ![This image shows the .NET Framework logo](media/sample-v2-code/logo-netframework.png) | Client Credentials with app secret or certificate | [dotnet-daemon](https://github.com/azure-samples/active-directory-dotnet-daemon)</p> [dotnet-daemon-certificate-credential](https://github.com/azure-samples/active-directory-dotnet-daemon-certificate-credential)
Daemon app (Console)         | ![This image shows the .NET Core logo](media/sample-v2-code/logo-netcore.png) | Client Credentials with certificate| [dotnetcore-daemon-certificate-credential](https://github.com/Azure-Samples/active-directory-dotnetcore-daemon-certificate-credential)
ASP.NET Web App  | ![This image shows the .NET Framework logo](media/sample-v2-code/logo-netframework.png) | Client credentials | [dotnet-webapp-webapi-oauth2-appidentity](https://github.com/Azure-Samples/active-directory-dotnet-webapp-webapi-oauth2-appidentity)

## Web APIs

<a name='web-api-protected-by-azure-active-directory'></a>

### Web API protected by Azure Active Directory

The following sample shows how to protect a Node.js web API with Azure AD.

In the previous sections of this article, you can also find other samples illustrating a client application **calling** an ASP.NET or ASP.NET Core **Web API**. These samples are not mentioned again in this section, but you will find them in the last column of the tables above or below

| Platform | Sample |
|--------|-------------------|
| ![This image shows the Node.js logo](media/sample-v2-code/logo-nodejs.png)  | [node-webapi](https://github.com/Azure-Samples/active-directory-node-webapi) |

### Web API calling Microsoft Graph or another Web API

The following samples demonstrate a web API that calls another web API. The second sample shows how to handle Conditional Access.

| Platform |  Calls Microsoft Graph | Calls another ASP.NET or ASP.NET Core 2.0 Web API |
| -------- |  --------------------- | ------------------------- |
| ![This image shows the ASP.NET Framework logo](media/sample-v2-code/logo-netframework.png)</p> ASP.NET 4.5 | [dotnet-webapi-onbehalfof](https://github.com/azure-samples/active-directory-dotnet-webapi-onbehalfof) </p> [dotnet-webapi-onbehalfof-ca](https://github.com/azure-samples/active-directory-dotnet-webapi-onbehalfof-ca) | [dotnet-webapi-onbehalfof](https://github.com/azure-samples/active-directory-dotnet-webapi-onbehalfof) </p> [dotnet-webapi-onbehalfof-ca](https://github.com/azure-samples/active-directory-dotnet-webapi-onbehalfof-ca) |

## Other Microsoft Graph samples

For samples and tutorials that demonstrate different usage patterns for the Microsoft Graph API, including authentication with Azure AD, see [Microsoft Graph Community Samples & Tutorials](https://github.com/microsoftgraph/msgraph-community-samples).

## See also

- [Azure Active Directory Developer's Guide](v1-overview.md)
- [Azure Active Directory Authentication libraries](active-directory-authentication-libraries.md)
- [Microsoft Graph API conceptual and reference](/graph/use-the-api)

---
title: Azure Active Directory code samples | Microsoft Docs
description: Provides an index of Azure Active Directory (v1 endpoint) code samples, organized by scenario.
services: active-directory
documentationcenter: dev-center-name
author: jmprieur
manager: mtillman
editor: ''

ms.assetid: a242a5ff-7300-40c2-ba83-fb6035707433
ms.service: active-directory
ms.component: develop
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 04/24/2018
ms.author: celested
ms.reviewer: jmprieur
ms.custom: aaddev
---

# Azure Active Directory code samples (V1 endpoint)

[!INCLUDE [active-directory-devguide](../../../includes/active-directory-devguide.md)]

You can use Microsoft Azure Active Directory (Azure AD) to add authentication and authorization to your web applications and web APIs.

This section provides links to samples you can use to learn more about the Azure AD V1 endpoint. These samples show you how it's done along with code snippets that you can use in your applications. On the code sample page, you'll find detailed read-me topics that help with requirements, installation, and set-up. And the code is commented to help you understand the critical sections.

> [!NOTE]
> If you are interested in Azure AD V2 code samples, see [v2.0 code samples by scenario](sample-v2-code.md).

To understand the basic scenario for each sample type, see [Authentication scenarios for Azure AD](authentication-scenarios.md).

You can also contribute to our samples on GitHub. To learn how, see [Microsoft Azure Active Directory samples and documentation](https://github.com/Azure-Samples?page=3&query=active-directory).

## Desktop and mobile public client applications calling Microsoft Graph or a Web API

The following samples show public client applications (desktop/mobile applications) that access the Microsoft Graph or a Web API in the name of a user.

Client application | Platform | Flow/Grant | Calls Microsoft Graph | Calls an ASP.NET or ASP.NET Core 2.0 Web API
------------------ | -------- | ---------- | -------------------- | -------------------------
Desktop (WPF)           | .NET/C# | Interactive | [dotnet-native-multitarget](https://github.com/azure-samples/active-directory-dotnet-native-multitarget) | [Dotnet-native-desktop](https://github.com/Azure-Samples/active-directory-dotnet-native-desktop) </p> [dotnet-native-aspnetcore](https://azure.microsoft.com/resources/samples/active-directory-dotnet-native-aspnetcore/)</p> [dotnet-webapi-manual-jwt-validation](https://github.com/azure-samples/active-directory-dotnet-webapi-manual-jwt-validation)
Mobile (UWP)            | .NET/C#  | Interactive | [dotnet-native-uwp-wam](https://github.com/azure-samples/active-directory-dotnet-native-uwp-wam) |  [dotnet-windows-store](https://github.com/Azure-Samples/active-directory-dotnet-windows-store) (single tenant Web API) </p> [dotnet-webapi-multitenant-windows-store](https://github.com/Azure-Samples/active-directory-dotnet-webapi-multitenant-windows-store) (multi-tenant Web API)|
Mobile (Android, iOS, UWP)   | .NET/C# (Xamarin) | Interactive | [dotnet-native-multitarget](https://github.com/azure-samples/active-directory-dotnet-native-multitarget) |
Mobile (Android)           | Android/Java | Interactive |   [android](https://github.com/Azure-Samples/active-directory-android) |
Mobile (iOS)           | iOS/Objective C | Interactive |   [nativeClient-iOS](https://github.com/azureadquickstarts/nativeclient-ios) |
Desktop (Console)          | .NET/C# | Username / Password </p> Windows Integrated Authentication | | [dotnet-native-headless](https://github.com/azure-samples/active-directory-dotnet-native-headless)
Desktop (Console)           | .NET Core/C# | Device profile | | [dotnet-deviceprofile](https://github.com/Azure-Samples/active-directory-dotnet-deviceprofile)

## Web Applications

### Web Applications signing in users, calling Microsoft Graph, or a Web API with the user's identity

 Platform | Only signs in users | Calls Microsoft Graph or AAD Graph| Calls another ASP.NET or ASP.NET Core 2.0 Web API
 -------- | ------------------- | --------------------- | -------------------------
ASP.NET 4.5 | [webApp-openidconnect-dotnet](https://docs.microsoft.com/azure/active-directory/develop/guidedsetups/active-directory-aspnetwebapp-v1) </p> [webapp-WSFederation-dotNet](https://github.com/Azure-Samples/active-directory-dotnet-webapp-wsfederation) | [dotnet-webapp-multitenant-openidconnect](https://github.com/Azure-Samples/active-directory-dotnet-webapp-multitenant-openidconnect) (AAD Graph) |
ASP.NET Core 2.0 | [dotnet-webapp-openidconnect-aspnetcore](https://github.com/Azure-Samples/active-directory-dotnet-webapp-openidconnect-aspnetcore) | [webapp-webapi-multitenant-openidconnect-aspnetcore](https://github.com/Azure-Samples/active-directory-webapp-webapi-multitenant-openidconnect-aspnetcore/) (AAD Graph) | [dotnet-webapp-webapi-openidconnect-aspnetcore](https://github.com/Azure-Samples/active-directory-dotnet-webapp-webapi-openidconnect-aspnetcore)
ASP.NET 4.5 | [dotnet-webapp-webapi-oauth2-useridentity](https://github.com/Azure-Samples/active-directory-dotnet-webapp-webapi-oauth2-useridentity) | |
Python | | [python-webapp-graphapi](https://github.com/Azure-Samples/active-directory-python-webapp-graphapi)  |
Java | | [java-webapp-openidconnect](https://github.com/azure-samples/active-directory-java-webapp-openidconnect)  |
PHP | | [php-graphapi-web](https://github.com/Azure-Samples/active-directory-php-graphapi-web)  |

### Web applications demonstrating role-based access control (authorization)

The following samples show how to implement role-based access control, which is used to restrict the permissions of certain features of a web application to certain users. The users are authorized depending on whether they belong to an Azure AD group or role.

Platform | Sample | Description
 -------- | ------------------- | ---------------------
ASP.NET 4.5 | [dotnet-webapp-groupclaims](https://github.com/Azure-Samples/active-directory-dotnet-webapp-groupclaims) | A .NET 4.5 MVC web app that uses Azure AD **groups** for authorization
ASP.NET 4.5 | [dotnet-webapp-roleclaims](https://github.com/Azure-Samples/active-directory-dotnet-webapp-roleclaims) | A .NET 4.5 MVC web app that uses Azure AD **roles** for authorization

## Daemon applications (accessing Web APIs with the application's identity)

The following samples show desktop or web applications that access the Microsoft Graph or a web API with no user (with the application identity).

Client application | Platform | Flow/Grant | Calls Microsoft Graph | Calls an ASP.NET or ASP.NET Core 2.0 Web API
------------------ | -------- | ---------- | -------------------- | -------------------------
Daemon app (Console)          | .NET/C#  | Client Credentials with app secret or certificate | | [dotnet-daemon](https://github.com/azure-samples/active-directory-dotnet-daemon)</p> [dotnet-daemon-certificate-credential](https://github.com/azure-samples/active-directory-dotnet-daemon-certificate-credential)
Daemon app (Console)         | .NET Core/C# | Client Credentials with certificate| | [dotnetcore-daemon-certificate-credential](https://github.com/Azure-Samples/active-directory-dotnetcore-daemon-certificate-credential)
Desktop            | Java | Client credentials |   [java-native-headless](https://github.com/azure-samples/active-directory-java-native-headless) |
ASP.NET Web App  | .NET/C# | Client credentials |    | [dotnet-webapp-webapi-oauth2-appidentity](https://github.com/Azure-Samples/active-directory-dotnet-webapp-webapi-oauth2-appidentity)

## Web APIs

### Web API protected by Azure Active Directory

The following sample shows how to protect a node.js web API with Azure AD.

Platform | Sample | Description
 -------- | ------------------- | ---------------------
Node.js | [node-webapi](https://github.com/Azure-Samples/active-directory-node-webapi) |  NodeJS web API that is secured using Azure AD and OAuth 2.0 access tokens.

### Web API calling Microsoft Graph or another Web API

The following samples demonstrate a web API that calls another web API. The second sample shows how to handle conditional access.

 Platform |  Calls Microsoft Graph | Calls another ASP.NET or ASP.NET Core 2.0 Web API
 -------- |  --------------------- | -------------------------
ASP.NET 4.5 | [dotnet-webapi-onbehalfof](https://github.com/azure-samples/active-directory-dotnet-webapi-onbehalfof) |[dotnet-webapi-onbehalfof](https://github.com/azure-samples/active-directory-dotnet-webapi-onbehalfof)
ASP.NET 4.5 | [dotnet-webapi-onbehalfof-ca](https://github.com/azure-samples/active-directory-dotnet-webapi-onbehalfof-ca) |[dotnet-webapi-onbehalfof-ca](https://github.com/azure-samples/active-directory-dotnet-webapi-onbehalfof-ca)

## Single page applications

This sample shows how to write a single page application secured with Azure AD.

 Platform |  Calls Microsoft Graph | Calls its own API | Calls another Web API
 -------- |  --------------------- | ------------------ | ----------------
JavaScript / ASP.NET 4.x |  | [javascript-singlepageapp](https://github.com/Azure-Samples/active-directory-javascript-singlepageapp-dotnet-webapi) |
JavaScript (AngularJS) / ASP.NET 4.x |  | [angularjs-singlepageapp](https://github.com/Azure-Samples/active-directory-angularjs-singlepageapp) |
JavaScript (AngularJS) / ASP.NET 4.x |  |  | [angularjs-singlepageapp-cors](https://github.com/Azure-Samples/active-directory-angularjs-singlepageapp-dotnet-webapi)

## Other Microsoft Graph samples

For samples and tutorials that demonstrate different usage patterns for the Microsoft Graph API, including authentication with Azure AD, see [Microsoft Graph Community Samples & Tutorials](https://github.com/microsoftgraph/msgraph-community-samples).

## See also

[Azure Active Directory Developer's Guide](azure-ad-developers-guide.md)

[Azure AD Graph API Conceptual and Reference](https://msdn.microsoft.com/library/azure/hh974476.aspx)

[Azure AD Graph API Helper Library](https://www.nuget.org/packages/Microsoft.Azure.ActiveDirectory.GraphClient)

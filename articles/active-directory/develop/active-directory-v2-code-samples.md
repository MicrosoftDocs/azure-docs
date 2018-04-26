---
title: Azure Active Directory Code Samples | Microsoft Docs
description: An index of Azure Active Directory code samples, organized by scenario.
services: active-directory
documentationcenter: dev-center-name
author: jmprieur
manager: mtillman
editor: ''

ms.assetid: a242a5ff-7300-40c2-ba83-fb6035707433
ms.service: active-directory
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 04/26/2018
ms.author: jmprieur
ms.custom: aaddev

---
# Azure Active Directory Code Samples (V2 endpoint)

You can use Microsoft Azure Active Directory (Azure AD) to:

- add authentication and authorization to your web applications and web APIs.
- require an access token to access a protected web API.

This article provides you with links to samples for the Azure AD V2 endpoint.
These samples show you how it's done, along with code snippets that you can use in your applications. On the code sample page, you'll find detailed read-me topics that help with requirements, installation, and set-up. And the code is commented to help you understand the critical sections.

> [!NOTE]
> This article links to Azure AD V2 samples. If you are interested in Azure AD V1 samples, see  [code samples article](active-directory-code-samples.md).
>

To understand the basic scenario for each sample type, see [App types for the Azure Active Directory v2.0 endpoint](active-directory-v2-flows).

Contribute to the samples on GitHub: [Microsoft Azure Active Directory Samples and Documentation](https://github.com/Azure-Samples?page=3&query=active-directory).

## Desktop and mobile public client applications calling Microsoft Graph or a Web API

The following samples show public client applications (desktop/mobile applications) which access the Microsoft Graph or a Web API in the name of a user.

Client application | Platform | Flow/Grant | Calls Microsoft Graph | Calls an ASP.NET Core 2.0 Web API
------------------ | -------- | ---------- | -------------------- | -------------------------
Desktop (WPF)      | .NET/C#  | Interactive | [dotnet-desktop-msgraph-v2](http://github.com/azure-samples/active-directory-dotnet-desktop-msgraph-v2) <p/> [dotnet-admin-restricted-scopes-v2](https://github.com/azure-samples/active-directory-dotnet-admin-restricted-scopes-v2) | [dotnet-native-aspnetcore-v2](https://GitHub.com/azure-samples/active-directory-dotnet-native-aspnetcore-v2)
Mobile (UWP)   | .NET/C# (UWP) | Interactive | [dotnet-native-uwp-v2](https://github.com/azure-samples/active-directory-dotnet-native-uwp-v2) |
Mobile (Android, iOS, UWP)   | .NET/C# (Xamarin) | Interactive | [xamarin-native-v2](https://Github.com/azure-samples/active-directory-xamarin-native-v2) |
Mobile (iOS)       | iOS / Objective C or swift | Interactive | [ios-swift-native-v2](https://github.com/azure-samples/active-directory-ios-swift-native-v2) <p/> [ios-native-nxoauth2-v2](https://github.com/azure-samples/active-directory-ios-native-nxoauth2-v2) |
Mobile (Android)   | Android / Java | Interactive |   [android-native-v2](https://github.com/azure-samples/active-directory-android-native-v2 ) |

## Web Applications

### Web Applications signing in users, calling Microsoft Graph, or a Web API with the user's identity

 Platform | Only signs in users | Sings in users and Calls Microsoft Graph | Calls another ASP.NET or ASP.NET Core 2.0 Web API
 -------- | ------------------- | --------------------------------- | -------------------------
ASP.NET 4.x | [appmodelv2-webapp-openIDConnect-dotNet](https://GitHub.com/AzureAdQuickstarts/AppModelv2-WebApp-OpenIDConnect-DotNet) <p/> [dotnet-webapp-openidconnect-v2](https://GitHub.com/azure-samples/active-directory-dotnet-webapp-openidconnect-v2)  |              [aspnet-connect-rest-sample](https://github.com/microsoftgraph/aspnet-connect-rest-sample)   |
ASP.NET Core 2.0 | [aspnetcore-webapp-openidconnect-v2](https://github.com/Azure-Samples/active-directory-aspnetcore-webapp-openidconnect-v2) |              [aspnetcore-connect-sample](https://github.com/microsoftgraph/aspnetcore-connect-sample)   | *none yet*
Node.js      |                   | [AppModelv2-WebApp-OpenIDConnect-nodejs](https://github.com/azureadquickstarts/appmodelv2-webapp-openidconnect-nodejs)     |
Ruby      |                   | [ruby-connect-rest-sample](https://github.com/microsoftgraph/ruby-connect-rest-sample)     |

## Daemon applications (accessing Web APIs with the application's identity)

The following samples show desktop or web applications that access the Microsoft Graph or a Web API with no user (with the application identity)

Client application | Platform | Flow/Grant | Calls Microsoft Graph | Calls an ASP.NET or ASP.NET Core 2.0 Web API
------------------ | -------- | ---------- | -------------------- | -------------------------
Web app | .NET/C#  | Client Credentials | [dotnet-daemon-v2](https://github.com/azure-samples/active-directory-dotnet-daemon-v2) |

## Single page applications

This sample shows how to write a single page application secured with Azure AD

 Platform |  Calls Microsoft Graph | Calls another API
 -------- |  --------------------- | -------------------------
JavaScript (msal.js)  | [javascript-graphapi-v2](https://github.com/azure-samples/active-directory-javascript-graphapi-v2) |
JavaScript (msal.js + AngularJS) | [angular-connect-rest-sample](https://github.com/microsoftgraph/angular-connect-rest-sample) |
JavaScript (Hello.JS)  | [javascript-graphapi-web-v2](https://github.com/azure-samples/active-directory-javascript-graphapi-web-v2) |
JavaScript (hello.js + Angular 4) | [angular4-connect-sample](https://github.com/microsoftgraph/angular4-connect-sample) |

## Web APIs

### Web API protected by Azure Active Directory

The following sample shows how to protect a web API with the Azure Active Directory V2 endpoint

Platform | Sample | Description
 -------- | ------------------- | ---------------------
Node.js | [dotnet-native-aspnetcore-v2](https://GitHub.com/azure-samples/active-directory-dotnet-native-aspnetcore-v2) | Calling a ASP.NET Core Web API from a WPF application using Azure AD V2

### Web API calling Microsoft Graph or another Web API

None yet

## Other Microsoft Graph samples

See [Microsoft Graph Community Samples & Tutorials](https://github.com/microsoftgraph/msgraph-community-samples) for [samples](https://github.com/microsoftgraph/msgraph-community-samples/tree/master/samples#aspnet) and tutorials that demonstrate different usage patterns for the Microsoft Graph API, including authentication with Azure Active Directory.

## See also

### Other Resources

[Azure Active Directory Developer's Guide](active-directory-developers-guide.md)

[Azure AD Graph API Conceptual and Reference](https://msdn.microsoft.com/library/azure/hh974476.aspx)

[Azure AD Graph API Helper Library](https://www.nuget.org/packages/Microsoft.Azure.ActiveDirectory.GraphClient)

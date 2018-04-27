---
title: Azure Active Directory for developers | Microsoft Docs
description: This article provides an overview of signing in Microsoft work and school accounts by using Azure Active Directory.
services: active-directory
author: jmprieur
manager: mtillman
editor: ''

ms.assetid: 5c872c89-ef04-4f4c-98de-bc0c7460c7c2
ms.service: active-directory
ms.devlang: na
ms.topic: hero-article
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 04/24/2018
ms.author: jmprieur
ms.custom: aaddev
---
# Azure Active Directory for developers

Azure Active Directory (Azure AD) is a cloud identity service that allows developers to build apps which securely sign in users with a Microsoft work or school account. Azure AD supports developers building both single-tenant, line-of-business (LOB) apps, as well as developers looking to develop multi-tenant apps. In addition to basic sign in, Azure AD also lets apps call both Microsoft APIs like [Microsoft Graph](https://developer.microsoft.com/en-us/graph/docs/concepts/overview) and custom APIs that are built on the Azure AD platform.  This documentation shows you how to add Azure AD support to your application by using industry standard protocols like OAuth2.0 and OpenID Connect.

> [!NOTE]
> Most of the content on this page focuses on the Azure AD v1 endpoint, which supports only Microsoft work or school accounts. If you want to sign in consumer or personal Microsoft accounts, please see more information on the [Azure AD v2.0 endpoint](active-directory-appmodel-v2-overview.md). The Azure AD v2.0 endpoint offers a unified developer experience for apps which want to sign in both users with Azure AD accounts (work and school) and personal Microsoft accounts.

| | |
| --- | --- |
|[Authentication basics](active-directory-authentication-scenarios.md) | An introduction to authentication with Azure AD. |
|[Types of applications](active-directory-authentication-scenarios.md#application-types-and-scenarios) | An overview of the authentication scenarios that are supported by Azure AD. |                                

## Get started
The guided setups below walk you through building an app on your preferred platform using the Azure Active Directory Library (ADAL) SDK. If you're looking for information on using the Microsoft Authentication Library (MSAL), please see our documentation on the [Azure AD v2.0 endpoint](active-directory-appmodel-v2-overview.md).

|  |  |  |  |
| --- | --- | --- | --- |
| <center>![Mobile and desktop apps](./media/active-directory-developers-guide/NativeApp_Icon.png)<br />Mobile and desktop apps</center> | [Overview](active-directory-authentication-scenarios.md#native-application-to-web-api)<br /><br />[iOS](active-directory-devquickstarts-ios.md)<br /><br />[Android](active-directory-devquickstarts-android.md) | [.NET (WPF)](active-directory-devquickstarts-dotnet.md)<br /><br />[.NET (UWP)](active-directory-devquickstarts-windowsstore.md)<br /><br />[Xamarin](active-directory-devquickstarts-xamarin.md) | [Cordova](active-directory-devquickstarts-cordova.md) |
| <center>![Web apps](./media/active-directory-developers-guide/Web_app.png)<br />Web apps</center> | [Overview](active-directory-authentication-scenarios.md#web-browser-to-web-application)<br /><br />[ASP.NET](active-directory-devquickstarts-webapp-dotnet.md)<br /><br />[Java](active-directory-devquickstarts-webapp-java.md) | [Python](https://github.com/Azure-Samples/active-directory-python-webapp-graphapi)<br/><br/> [Node.js](active-directory-devquickstarts-openidconnect-nodejs.md) | |
| <center>![Single page apps](./media/active-directory-developers-guide/SPA.png)<br />Single page apps</center> | [Overview](active-directory-authentication-scenarios.md#single-page-application-spa)<br /><br />[AngularJS](active-directory-devquickstarts-angular.md)<br /><br />[JavaScript](https://github.com/Azure-Samples/active-directory-javascript-singlepageapp-dotnet-webapi) |  |  |
| <center>![Web APIs](./media/active-directory-developers-guide/Web_API.png)<br />Web APIs</center> | [Overview](active-directory-authentication-scenarios.md#web-application-to-web-api)<br /><br />[ASP.NET](active-directory-devquickstarts-webapi-dotnet.md)<br /><br />[Node.js](active-directory-devquickstarts-webapi-nodejs.md) | &nbsp; |
| <center>![Service-to-service](./media/active-directory-developers-guide/Service_App.png)<br />Service-to-service</center> | [Overview](active-directory-authentication-scenarios.md#daemon-or-server-application-to-web-api)<br /><br />[.NET](active-directory-code-samples.md#daemon-applications-accessing-web-apis-with-the-applications-identity)|  |

## How-to guides
The guides below walk you through some of the most common tasks in Azure AD.

|                                                                           |  |
|---------------------------------------------------------------------------| --- |
|[Application registration](active-directory-integrating-applications.md)           | How to register an application in Azure AD. |
|[Multi-tenant applications](active-directory-devhowto-multi-tenant-overview.md)    | How to sign in any Microsoft work account. |
|[OAuth and OpenID Connect protocols](active-directory-protocols-openid-connect-code.md)| How to sign in users and call web APIs by using the Microsoft authentication protocols. |
|[Additional guides](active-directory-developers-guide-index.md#guides)        |  A list of guides that are available for Azure AD.   |

## Reference topics
The following articles provide detailed information on APIs, protocol messages, and terms that are used in Azure AD.

|                                                                                   | |
| ----------------------------------------------------------------------------------| --- |
| [Authentication Libraries (ADAL)](active-directory-authentication-libraries.md)   | An overview of the libraries and SDKs that are provided by Azure AD. |
| [Code samples](active-directory-code-samples.md)                                  | A list of all of the Azure AD code samples. |
| [Glossary](active-directory-dev-glossary.md)                                      | Terminology and definitions of words that are used throughout this documentation. |
| [Additional reference topics](active-directory-developers-guide-index.md#reference)| A list of reference topics that are available for Azure AD.   |


[!INCLUDE [Help and support](../../../includes/active-directory-develop-help-support-include.md)]

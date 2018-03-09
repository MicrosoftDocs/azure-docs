---
title: Azure Active Directory for developers | Microsoft Docs
description: This article provides an overview of signing in Microsoft work and school accounts by using Azure Active Directory.
services: active-directory
author: dstrockis
manager: mtillman
editor: ''

ms.assetid: 5c872c89-ef04-4f4c-98de-bc0c7460c7c2
ms.service: active-directory
ms.devlang: na
ms.topic: hero-article
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 04/07/2017
ms.author: dastrock
ms.custom: aaddev
---
# Azure Active Directory for developers
Azure Active Directory (Azure AD) is a cloud identity service that allows developers to securely sign in users with a Microsoft work or school account. This documentation shows you how to add Azure AD support to your application by using the industry standard protocols: OAuth2.0 and OpenID Connect.

| | |
| --- | --- |
|[Authentication basics](active-directory-authentication-scenarios.md) | An introduction to authentication with Azure AD. |
|[Types of applications](active-directory-authentication-scenarios.md#application-types-and-scenarios) | An overview of the authentication scenarios that are supported by Azure AD. |                                
                                                                              
## Get started
The following guided setups walk you through using the Microsoft authentication libraries to sign in Azure AD users.

|  |  |  |  |
| --- | --- | --- | --- |
| <center>![Mobile and desktop apps](./media/active-directory-developers-guide/NativeApp_Icon.png)<br />Mobile and desktop apps</center> | [Overview](active-directory-authentication-scenarios.md#native-application-to-web-api)<br /><br />[iOS](active-directory-devquickstarts-ios.md)<br /><br />[Android](active-directory-devquickstarts-android.md) | [.NET (WPF)](active-directory-devquickstarts-dotnet.md)<br /><br />[.NET (UWP)](active-directory-devquickstarts-windowsstore.md)<br /><br />[Xamarin](active-directory-devquickstarts-xamarin.md) | [Cordova](active-directory-devquickstarts-cordova.md) |
| <center>![Web apps](./media/active-directory-developers-guide/Web_app.png)<br />Web apps</center> | [Overview](active-directory-authentication-scenarios.md#web-browser-to-web-application)<br /><br />[ASP.NET](active-directory-devquickstarts-webapp-dotnet.md)<br /><br />[Java](active-directory-devquickstarts-webapp-java.md) | [Node.js](active-directory-devquickstarts-openidconnect-nodejs.md) |  |
| <center>![Single page apps](./media/active-directory-developers-guide/SPA.png)<br />Single page apps</center> | [Overview](active-directory-authentication-scenarios.md#single-page-application-spa)<br /><br />[AngularJS](active-directory-devquickstarts-angular.md)<br /><br />[JavaScript](https://github.com/Azure-Samples/active-directory-javascript-singlepageapp-dotnet-webapi) |  |  |
| <center>![Web APIs](./media/active-directory-developers-guide/Web_API.png)<br />Web APIs</center> | [Overview](active-directory-authentication-scenarios.md#web-application-to-web-api)<br /><br />[ASP.NET](active-directory-devquickstarts-webapi-dotnet.md)<br /><br />[Node.js](active-directory-devquickstarts-webapi-nodejs.md) | &nbsp; |
| <center>![Service-to-service](./media/active-directory-developers-guide/Service_App.png)<br />Service-to-service</center> | [Overview](active-directory-authentication-scenarios.md#daemon-or-server-application-to-web-api)<br /><br />[.NET](active-directory-code-samples.md#server-or-daemon-application-to-web-api)|  |

## How-to guides
The following guides inform you how to perform common tasks with Azure AD.

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


> [!NOTE]
> If you need to sign in Microsoft personal accounts, you may want to consider using the [Azure AD v2.0 endpoint](active-directory-appmodel-v2-overview.md). The Azure AD v2.0 endpoint is the unification of Microsoft personal accounts and Microsoft work accounts (from Azure AD) into a single authentication system.


[!INCLUDE [Help and support](../../../includes/active-directory-develop-help-support-include.md)]

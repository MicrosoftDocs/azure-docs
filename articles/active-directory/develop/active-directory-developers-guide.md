---
title: Azure Active Directory for developers | Microsoft Docs
description: This article provides an overview of signing in Microsoft work and school accounts using Azure Active Directory.
services: active-directory
author: bryanla
manager: mbaldwin
editor: ''

ms.assetid: 5c872c89-ef04-4f4c-98de-bc0c7460c7c2
ms.service: active-directory
ms.devlang: na
ms.topic: hero-article
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 04/07/2017
ms.author: bryanla
ms.custom: aaddev
ms.custom: aaddev
---
# Azure Active Directory for developers
Azure Active Directory is a cloud identity service that allows developers to securely sign-in any user with a work or school account backed by Microsoft.  The documentation here shows you how to add Azure AD support to your application using industry standard authentication protocols, OAuth & OpenID Connect.

| | |
| --- | --- |
|[Auth basics](active-directory-authentication-scenarios.md) | An introduction to authentication with Azure AD |
|[Types of applications](active-directory-authentication-scenarios.md#application-types-and-scenarios) | An overview of the authentication scenarios supported by Azure AD |                                
                                                                              
## Get started
These guided setups walk you through using our authentication libraries to sign in Azure Active Directory users.

|  |  |  |  |
| --- | --- | --- | --- |
| <center>![Mobile & Desktop Apps](./media/active-directory-developers-guide/NativeApp_Icon.png)<br />Mobile & Desktop Apps</center> | [Overview](active-directory-authentication-scenarios.md#native-application-to-web-api)<br /><br />[iOS](active-directory-devquickstarts-ios.md)<br /><br />[Android](active-directory-devquickstarts-android.md) | [.NET](active-directory-devquickstarts-dotnet.md)<br /><br />[Windows](active-directory-devquickstarts-windowsstore.md)<br /><br />[Xamarin](active-directory-devquickstarts-xamarin.md) | [Cordova](active-directory-devquickstarts-cordova.md)<br /><br />[OAuth 2.0](active-directory-protocols-oauth-code.md) |
| <center>![Web Apps](./media/active-directory-developers-guide/Web_app.png)<br />Web Apps</center> | [Overview](active-directory-authentication-scenarios.md#web-browser-to-web-application)<br /><br />[ASP.NET](active-directory-devquickstarts-webapp-dotnet.md)<br /><br />[Java](active-directory-devquickstarts-webapp-java.md) | [NodeJS](active-directory-devquickstarts-openidconnect-nodejs.md)<br /><br />[OpenID Connect 1.0](active-directory-protocols-openid-connect-code.md) |  |
| <center>![Single Page Apps](./media/active-directory-developers-guide/SPA.png)<br />Single Page Apps</center> | [Overview](active-directory-authentication-scenarios.md#single-page-application-spa)<br /><br />[AngularJS](active-directory-devquickstarts-angular.md)<br /><br />[JavaScript](https://github.com/Azure-Samples/active-directory-javascript-singlepageapp-dotnet-webapi) |  |  |
| <center>![Web APIs](./media/active-directory-developers-guide/Web_API.png)<br />Web APIs</center> | [Overview](active-directory-authentication-scenarios.md#web-application-to-web-api)<br /><br />[ASP.NET](active-directory-devquickstarts-webapi-dotnet.md)<br /><br />[NodeJS](active-directory-devquickstarts-webapi-nodejs.md) | &nbsp; |
| <center>![Service-to-service](./media/active-directory-developers-guide/Service_App.png)<br />Service-to-Service</center> | [Overview](active-directory-authentication-scenarios.md#daemon-or-server-application-to-web-api)<br /><br />[.NET](active-directory-code-samples.md#server-or-daemon-application-to-web-api)<br /><br />[OAuth 2.0 Client Credentials](active-directory-protocols-oauth-service-to-service.md) |  |

## Guides
These articles inform you how to perform common tasks with Azure Active Directory.

|                                                                           |  |
|---------------------------------------------------------------------------| --- |
|[App registration](active-directory-integrating-applications.md)           | How to register an app in Azure AD |
|[Multi-tenant apps](active-directory-devhowto-multi-tenant-overview.md)    | How to sign in any Microsoft work account |
|[OAuth & OpenID Connect](active-directory-protocols-openid-connect-code.md)| How to sign-in users and call web APIs using our modern auth protocols |
|[More guides...](active-directory-developers-guide-index.md#guides)        |     |

## Reference
These articles provide detailed information on APIs, protocol messages, and terms used in Azure Active Directory.

|                                                                                   | |
| ----------------------------------------------------------------------------------| --- |
| [Authentication Libraries (ADAL)](active-directory-authentication-libraries.md)   | An overview of the libraries & SDKs provided by Azure AD |
| [Code Samples](active-directory-code-samples.md)                                  | A list of all Azure AD code samples |
| [Glossary](active-directory-dev-glossary.md)                                      | Terminology and definitions of words used throughout this documentation |
| [More reference material...](active-directory-developers-guide-index.md#reference)|     |

## Help & Support
These are the best places to get help with developing on Azure Active Directory.

|  |  
|---|
|[Stack Overflow's `azure-active-directory` and `adal` tags](http://stackoverflow.com/questions/tagged/azure-active-directory+or+adal)      |
|[Feedback on Azure Active Directory](https://feedback.azure.com/forums/169401-azure-active-directory/category/164757-developer-experiences)|
| [Try out Microsoft Dev Chat (free for a limited time)](http://aka.ms/devchat) |

<br />

> [!NOTE]
> If you need to sign-in Microsoft personal accounts, you may want to consider using the [Azure AD v2.0 endpoint](active-directory-appmodel-v2-overview.md).  The Azure AD v2.0 endpoint is the unification of Microsoft personal accounts & Microsoft work accounts (from Azure AD) into a single authentication system.

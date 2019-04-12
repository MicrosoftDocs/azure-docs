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

MSAL is a token acquisition library, it is not used to protect a Web API. The token can be acquired from a number of different application types: Web applications, Mobile or Desktop applications, Web APIs, and application running on devices that don't have a browser (or iOT). 

Depending on your scenario it provides you with various way of getting a token, with a consistent API for a number of platforms. It also adds value by:

* acquires tokens on behalf of a user or on behalf of an application
* maintains a token cache and refreshes tokens for you when they are close to expire. you don't need to handle expiration on your own.
* helps you specify which audience you want your application to sign-in (your org, several orgs, work and school and Microsoft personal accounts, Social identities with Azure AD B2C, users in sovereign and national clouds)
* helps you set up your application from configuration files
* helps you troubleshoot your app by exposing actionable exceptions, logging and telemetry.

## Supported languages and frameworks

## Differences between ADAL and MSAL
Active Directory Authentication Library (ADAL) integrates with the Azure AD v1.0 endpoint, where MSAL integrates with the Azure AD v2.0 endpoint. The v1.0 endpoint supports work accounts, but not personal accounts. The v2.0 endpoint is the unification of Microsoft personal accounts and work accounts into a single authentication system. Additionally, with MSAL you can also get authentications for Azure AD B2C.

For more specific information, read about the differences between [ADAL.NET and MSAL.NET](msal-compare-msaldotnet-and-adaldotnet.md) and [ADAL.js and MSAL.js](msal-compare-msaljs-and-adaljs.md).

## Ways to authenticate (interactive, integrated Windows, username/pw, device code flow)

## Client applications
Contrary to ADAL.NET (which proposes the notion of [AuthenticationContext](https://github.com/AzureAD/azure-activedirectory-library-for-dotnet/wiki/AuthenticationContext:-the-connection-to-Azure-AD), which is a connection to Azure AD), MSAL.NET, proposes a clean separation between public client applications, and [confidential client applications](https://tools.ietf.org/html/rfc6749):

* **Confidential client applications** are applications which run on servers (Web Apps, Web API, or even service/daemon applications). They are considered difficult to access, and therefore capable of keeping an application secret. Confidential clients are able to hold configuration time secrets. Each instance of the client has a distinct configuration (including clientId and secret). These values are difficult for end users to extract. A web app is the most common confidential client. The clientId is exposed through the web browser, but the secret is passed only in the back channel and never directly exposed. 

   Confidential client apps:

   ![image](./media/msal-overview/WebApp.png) ![image](./media/msal-overview/WebAPI.png) ![image](./media/msal-overview/DaemonService.png)

* On the contrary **public client applications** are applications which run on devices (phones for instance) or desktop machines. They are not trusted to safely keep application secrets, and therefore access Web APIs in the name of the user only (they only support public client flows). Public clients are unable to hold configuration time secrets, and as a result have no client secret.

  Public client applications:

  ![image](./media/msal-overview/DesktopApp.png)  ![image](./media/msal-overview/BrowserlessApp.png)
  ![image](./media/msal-overview/MobileApp.png)

## Acquiring and caching tokens
There are many ways of acquiring a token. They are detailed in the next topics. Some require user interactions through a web browser. Some don't require any user interactions. In general the way to acquire a token is different depending on if the application is a public client application (Desktop / Mobile) or a confidential client application (Web App, Web API, daemon application like a windows service).

For both public client and confidential client applications, MSAL.NET maintains a token cache (or two caches in the case of confidential client applications), and applications should try to get a token from the cache first before any other means, except in the case of Client Credentials, which does look at the application cache by itself.

## Exceptions and errors
Exceptions in MSAL are intended for app developers to troubleshoot and not for displaying to end-users. Exception messages are not localized.

When processing exceptions and errors, you can use the exception type itself and the error code to distinguish between exceptions.  For a list of error codes, see [Authentication and authorization error codes](reference-aadsts-error-codes.md).

### Handling conditional access and claims challenges
When getting tokens silently, your application may receive errors when a [conditional access claims challenge](conditional-access-dev-guide.md#scenario-single-page-app-spa-using-adaljs) such as MFA policy is required by an API you are trying to access.

The pattern to handle this error is to interactively aquire a token using MSAL. This prompts the user and gives them the opportunity to satisfy the required CA policy.

For examples, see how to handle claims challenge exceptions using [MSAL JS](msaljs-handle-conditional-access.md).

In certain cases when calling an API requiring conditional access, you can receive a claims challenge in the error from the API. For instance if the conditional access policy is to have a managed device (Intune) the error will be something like [AADSTS53000: Your device is required to be managed to access this resource](reference-aadsts-error-codes.md) or something similar. In this case, you can pass the claims in the acquire token call so that the user is prompted to satisfy the appropriate policy.

For examples, see how to handle claims challenge exceptions using [MSAL.NET](msaldotnet-handle-claims-challenge.md) and [MSAL JS](msaljs-handle-claims-challenge.md).

## Single sign-on
## Prompt behavior
## Logging               


## Next steps
* Learn about the [application scenarios](v2-scenarios-overview.md) where you can use MSAL.
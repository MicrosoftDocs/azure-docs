---
title: Differences between MSAL JS and ADAL JS | Azure
description: Learn about the differences between the MSAL JS and ADAL JS libraries.
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
ms.date: 04/10/2019
ms.author: ryanwi
ms.reviewer: saeeda
ms.custom: aaddev
---

# Differences between MSAL JS and ADAL JS
MSAL.js integrates with the Azure AD v2.0 endpoint, whereas ADAL.js integrates with the Azure AD v1.0 endpoint. The v1.0 endpoint supports work accounts, but not personal accounts. The v2.0 endpoint is the unification of Microsoft personal accounts and work accounts into a single authentication system. Additionally, with MSAL.js you can also get authentications for Azure AD B2C.

## Key differences in authentication with v1.0 versus v2.0 endpoint

### Scope instead of resource parameter in authentication requests

Azure AD v2.0 protocol uses scopes instead of resource in the requests. In other words, when your application needs to request tokens with permissions for a resource such as MS Graph, the difference in values passed to the library methods is as follows:

v1.0: resource=https://graph.microsoft.com

v2.0: scope = https://graph.microsoft.com/User.Read

You can request scopes for any resource API using URI of the API in this format: appidURI/scope For example: https://mytenant.onmicrosoft.com/myapi/api.read

Note: For the MS Graph API, a scope value user.read maps to https://graph.microsoft.com/User.Read and can be used interchangeably.

### Dynamic scopes for incremental consent.

When building applications using Azure AD v1.0, you needed to register the full set of permissions(static scopes) required by the application for the user to consent to at the time of login. In Azure AD v2.0, you can use the scope parameter to request the permissions at the time you want them. These are called dynamic scopes. This allows the user to provide incremental consent to scopes. So if at the beginning you just want the user to sign in to your application and you don’t need any kind of access, you can do so. If later you need the ability to read the calendar of the user, you can then request the calendar scope in the acquireToken methods and get the user's consent. For example:

var scopes = ["https://graph.microsoft.com/User.Read", "https://graph.microsoft.com/Calendar.Read"];
acquireTokenPopup(scopes);

### Scopes for V1.0 APIs

When getting tokens for V1.0 APIs using MSAL.js, you can request all the static scopes registered on the API by appending .default to the App ID URI of the API as scope. For example:

var scopes = [ appidURI + "/.default"];
acquireTokenPopup(scopes);
Refer Azure AD v1.0 and v2.0 comparison for more details.
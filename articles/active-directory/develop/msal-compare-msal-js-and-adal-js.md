---
title: Differences between MSAL.js and ADAL.js | Azure
description: Learn about the differences between Microsoft Authentication Library for JavaScript (MSAL.js) and Azure AD Authentication Library for JavaScript (ADAL.js) and how to choose which to use.
services: active-directory
documentationcenter: dev-center-name
author: navyasric
manager: celested
editor: ''

ms.service: active-directory
ms.subservice: develop
ms.devlang: na
ms.topic: overview
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 04/10/2019
ms.author: nacanuma
ms.reviewer: saeeda
ms.custom: aaddev
#Customer intent: As an application developer, I want to learn about the differences between the ADAL.js and MSAL.js libraries so I can migrate my applications to MSAL.js.
ms.collection: M365-identity-device-management
---

# Differences between MSAL JS and ADAL JS
Both Microsoft Authentication Library for JavaScript (MSAL.js) and Azure AD Authentication Library for JavaScript (ADAL.js) are used to authenticate Azure AD entities and request tokens from Azure AD. Up until now, most developers have worked with Azure AD v1.0 platform to authenticate Azure AD identities (work and school accounts) by requesting tokens using ADAL. Now, using MSAL.js, you can authenticate a broader set of Microsoft identities (Azure AD identities and Microsoft accounts, and social and local accounts through Azure AD B2C) through Microsoft identity platform (previously known as Azure AD v2.0 platform). 

This article describes how to choose between the Microsoft Authentication Library for JavaScript (MSAL.js) and Azure AD Authentication Library for JavaScript (ADAL.js) and compares the two libraries.

## Choosing between ADAL.js and MSAL.js

In most cases you want to use MSAL.js and the Azure AD v2.0 endpoint, which is the latest generation of Microsoft authentication libraries. Using MSAL.js, you acquire tokens for users signing-in to your application with Azure AD (work and school accounts), Microsoft (personal) accounts (MSA), or Azure AD B2C. 

If you are already familiar with the v1.0 endpoint (and ADAL.js), you might want to read [What's different about the v2.0 endpoint?](active-directory-v2-compare.md).

However, you still need to use ADAL.js if your application needs to sign in users with earlier versions of [Active Directory Federation Services (ADFS)](/windows-server/identity/active-directory-federation-services). 

## Key differences in authentication

* Scope instead of resource parameter in authentication requests

Azure AD v2.0 protocol uses scopes instead of resource in the requests. In other words, when your application needs to request tokens with permissions for a resource such as MS Graph, the difference in values passed to the library methods is as follows:

v1.0: resource=https://graph.microsoft.com

v2.0: scope = https://graph.microsoft.com/User.Read

You can request scopes for any resource API using URI of the API in this format: appidURI/scope For example: https://mytenant.onmicrosoft.com/myapi/api.read

For the MS Graph API, a scope value `user.read` maps to https://graph.microsoft.com/User.Read and can be used interchangeably.

* Dynamic scopes for incremental consent.

    When building applications using Azure AD v1.0, you needed to register the full set of permissions(static scopes) required by the application for the user to consent to at the time of login. In Azure AD v2.0, you can use the scope parameter to request the permissions at the time you want them. These are called dynamic scopes. This allows the user to provide incremental consent to scopes. So if at the beginning you just want the user to sign in to your application and you don’t need any kind of access, you can do so. If later you need the ability to read the calendar of the user, you can then request the calendar scope in the acquireToken methods and get the user's consent. For example:

    ```javascript
    var scopes = ["https://graph.microsoft.com/User.Read", "https://graph.microsoft.com/Calendar.Read"];
    acquireTokenPopup(scopes);
    ```

* Scopes for V1.0 APIs

    When getting tokens for V1.0 APIs using MSAL.js, you can request all the static scopes registered on the API by appending default to the App ID URI of the API as scope. For example:

    ```javascript
    var scopes = [ appidURI + "/.default"];
    acquireTokenPopup(scopes);
    ```

## Next steps
For more information, refer to [Azure AD v1.0 and v2.0 comparison](active-directory-v2-compare.md).
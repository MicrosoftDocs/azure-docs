---
title: AD FS support in Microsoft Authentication Library for Python
titleSuffix: Microsoft identity platform
description: Learn about Active Directory Federation Services (AD FS) support in Microsoft Authentication Library for Java (MSAL4j).
services: active-directory
documentationcenter: dev-center-name
author: sangonzal
manager: henrikm
editor: ''

ms.service: active-directory
ms.subservice: develop
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 11/21/2019
ms.author: sagonzal
ms.reviewer: navyasri.canumalla
ms.custom: aaddev
#Customer intent: As an application developer, I want to learn about AD FS support in MSAL for Java so I can decide if this platform meets my application development needs and requirements.
ms.collection: M365-identity-device-management
---

Active Directory Federation Services (AD FS) in Windows Server enables you to add OpenID Connect and OAuth 2.0 based authentication and authorization to applications you are developing. Those applications can authenticate users directly against AD FS. For more information, read [AD FS Scenarios for Developers](https://docs.microsoft.com/en-us/windows-server/identity/ad-fs/overview/ad-fs-scenarios-for-developers).


There are usually two ways of authenticating against AD FS:

- MSAL Python talks to Azure Active Directory, which itself is federated with other identity providers (IdPs). In the case we are interested in the federation happens through AD FS.
- MSAL Python talks directly to an AD FS authority. This is only supported from AD FS 2019 and above.

## MSAL connects to Azure AD, which is federated with AD FS
MSAL Python supports connecting to Azure AD, which signs in managed-users (users managed in Azure AD) or federated users (users managed by another identity provider such as AD FS). MSAL Python does not know about the fact that users are federated. As far as it’s concerned, it talks to Azure AD.

The authority you use in this case is the usual authority (authority host name + tenant, common, or organizations).

### Acquiring a token interactively for federated users
When you call the acquire_token_by_authorization_code or acquire_token_by_device_flow , the user experience is typically:

1. The user enters their account ID.
2. Azure AD displays briefly the message "Taking you to your organization's page".
The user is redirected to the sign-in page of the identity provider. The sign-in page is usually customized with the logo of the organization.
3. Supported AD FS versions in this federated scenario are AD FS v2, AD FS v3 (Windows Server 2012 R2), and AD FS v4 (AD FS 2016).

### Acquiring a token using acquire_token_by_username_password
When acquiring a token using acquire_token_by_username_password, MSAL Python gets the identity provider which to contact based on the username. MSAL Python receives a SAML token after contacting the identity provider. MSAL Python then provides the SAML token to Azure AD as a user assertion (similar to the on-behalf-of flow) to get back a JWT.

## MSAL connects directly to AD FS

In that case the authority you'll want to use to build your application is something like `https://somesite.contoso.com/adfs/`

MSAL Python supports ADFS 2019 (PR is [Adjusting token cache to work with ADFS 2019 #77](https://github.com/AzureAD/microsoft-authentication-library-for-python/pull/77))

However for MSAL Python we have no **current** plans to support, a direct connection to ADFS 2016 (it does not suport PKCE and still uses resources, not scope) or ADFS v2 (which is not OIDC compliant). If you need to support today scenarios requiring a direct connection to ADFS 2016, please use the latest version of ADAL Python. When you have upgraded your on-premise system to ADFS 2019, you'll be able to use MSAL Python

## See also

- For the federated case, see [Configure Azure Active Directory sign in behavior for an application by using a Home Realm Discovery policy](https://docs.microsoft.com/en-us/azure/active-directory/manage-apps/configure-authentication-for-federated-users-portal)
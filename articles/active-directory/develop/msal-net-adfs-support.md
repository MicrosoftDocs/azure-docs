---
title: ADFS support in Microsoft Authentication Library for .NET | Azure
description: Learn about Active Directory Federation Services (ADFS) support in Microsoft Authentication Library for .NET (MSAL.NET).
services: active-directory
documentationcenter: dev-center-name
author: rwike77
manager: CelesteDG
editor: ''

ms.service: active-directory
ms.subservice: develop
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 05/31/2019
ms.author: jmprieur
ms.reviewer: saeeda
ms.custom: aaddev
#Customer intent: As an application developer, I want to learn about ADFS support in MSAL.NET so I can decide if this platform meets my application development needs and requirements.
ms.collection: M365-identity-device-management
---

# Active Directory Federation Services support in MSAL.NET
There are two cases:

MSAL.NET talks to Azure Active Directory, which itself is federated with other identity providers (IdPs). In the case we are interested in the federation happens through ADFS.
MSAL.NET talks directly to an ADFS authority. This can only happen if ADFS is OIDC compliant (from ADFS 2019). One of the scenarios this highlights is Azure Stack support

## Identity providers are federated with Azure AD
MSAL.NET supports talking to Azure AD, which itself signs-in managed users (users managed in Azure AD), or federated users (users managed by another identity provider, which, in the case we are interested is federated through ADFS). MSAL.NET does not know about the fact that users are federated. As far as it’s concerned, it talks to Azure AD.

The authority you'll use in the case is the usual authority (common, or organizations, or tenanted)

Acquiring a token interactively
When you call AcquireTokenInteractive(), in term of user experience:

the user enter their upn (or the account or loginHint is provided part of the call to AcquireTokenAsync)
Azure AD displays briefly "Taking you to your organization's page",
and then redirects the user is to the sign-in page of the identity provider (usually customized with the logo of the organization)
Supported ADFS versions in this federated scenario are ADFS v2 , ADFS v3 (Windows Server 2012 R2) and ADFS v4 (ADFS 2016)

Acquiring a token using AcquireTokenByIntegratedAuthentication or AcquireTokenByUsernamePassword
In that case, from the username, MSAL.NET goes to Azure Active Directory (userrealm endpoint) passing the username, and it gets information about the IdP to contact. It does, passing the username (and the password in the case of AcquireTokenByUsernamePassword) and receives a SAML 1.1 token, which it provides to Azure Active Directory as a user assertion (similar to the on-behalf-of flow) to get back a JWT.

## MSAL connects directly to ADFS
In that case the authority you'll want to use to build your application is something like https://somesite.contoso.com/adfs/

MSAL.NET will support ADFS 2019 (PR is ADFS Compatibility with MSAL #834), which is/will be Open ID Connect compliant after a service pack is applied to Windows Server.

Update the service pack is pending (ETA May)

ADFS 2019 will be enabled in MSAL.NET 4.0 (May)

However for MSAL.NET we have no current plans to support, a direct connection to ADFS 2016 or ADFS v2 (which are not OIDC compliant). If you need to support today scenarios requiring a direct connection to ADFS 2016, please use the latest version of ADAL. When you have upgraded your on-premise system to ADFS 2019, you'll be able to use MSAL.NET
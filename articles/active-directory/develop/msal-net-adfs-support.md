---
title: AD FS support in Microsoft Authentication Library for .NET | Azure
description: Learn about Active Directory Federation Services (AD FS) support in Microsoft Authentication Library for .NET (MSAL.NET).
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
ms.date: 06/03/2019
ms.author: jmprieur
ms.reviewer: saeeda
ms.custom: aaddev
#Customer intent: As an application developer, I want to learn about AD FS support in MSAL.NET so I can decide if this platform meets my application development needs and requirements.
ms.collection: M365-identity-device-management
---

# Active Directory Federation Services support in MSAL.NET
Active Directory Federation Services (AD FS) in Windows Server enables you to add OpenID Connect and OAuth 2.0 based authentication and authorization to applications you are developing, and have those applications authenticate users directly against AD FS. For more information, read [AD FS Scenarios for Developers](/windows-server/identity/ad-fs/overview/ad-fs-scenarios-for-developers).

Microsoft Authentication Library for .NET (MSAL.NET) supports two scenarios for authenticating against AD FS:

- MSAL.NET talks to Azure Active Directory, which itself is *federated* with AD FS.
- MSAL.NET talks *directly* to an AD FS authority, where the version of AD FS is OpenID Connect compliant (starting in AD FS 2019). Connecting directly to AD FS allows MSAL.NET to authenticate with apps running in [Azure Stack](https://azure.microsoft.com/overview/azure-stack/).

## MSAL connects to Azure AD, which is federated with AD FS
MSAL.NET supports connecting to Azure AD, which signs in managed-users (users managed in Azure AD) or federated users (users managed by another identity provider such as AD FS). MSAL.NET does not know about the fact that users are federated. As far as it’s concerned, it talks to Azure AD.

The [authority](msal-client-application-configuration.md#authority) you use in this case is the usual authority (common, or organizations, or tenant).

### Acquiring a token interactively
When you call the `AcquireTokenInteractive` method, the user experience is typically:

1. The user enters their UPN (or the account or login hint, which is provided as part of the call to the `AcquireTokenAsync` method).
2. Azure AD displays briefly the message "Taking you to your organization's page".
3. The user is redirected to the sign-in page of the identity provider. The sign-in page is usually customized with the logo of the organization.

In this scenario, supported AD FS versions in this federated scenario are AD FS v2, AD FS v3 (Windows Server 2012 R2), and AD FS v4 (AD FS 2016).

### Acquiring a token using AcquireTokenByIntegratedAuthentication or AcquireTokenByUsernamePassword
In that case, from the username, MSAL.NET goes to Azure Active Directory (userrealm endpoint) passing the username, and it gets information about the IdP to contact. It does, passing the username (and the password in the case of `AcquireTokenByUsernamePassword`) and receives a [SAML 1.1 token](reference-saml-tokens.md), which it provides to Azure Active Directory as a user assertion (similar to the [on-behalf-of flow](msal-authentication-flows.md#on-behalf-of)) to get back a JWT.

## MSAL connects directly to AD FS
In that case the authority you'll want to use to build your application is something like `https://somesite.contoso.com/adfs/`.

MSAL.NET will support AD FS 2019 (PR is AD FS Compatibility with MSAL #834), which is/will be Open ID Connect compliant after a service pack is applied to Windows Server.

Update the service pack is pending (ETA May)

AD FS 2019 will be enabled in MSAL.NET 4.0 (May)

However for MSAL.NET we have no current plans to support, a direct connection to AD FS 2016 or AD FS v2 (which are not OpenID Connect compliant). If you need to support today scenarios requiring a direct connection to AD FS 2016, please use the latest version of ADAL. When you have upgraded your on-premise system to AD FS 2019, you'll be able to use MSAL.NET
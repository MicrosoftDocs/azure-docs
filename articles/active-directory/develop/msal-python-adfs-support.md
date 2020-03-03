---
title: Azure AD FS support (MSAL Python)
titleSuffix: Microsoft identity platform
description: Learn about Active Directory Federation Services (AD FS) support in Microsoft Authentication Library for Python
services: active-directory
author: abhidnya13    
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: conceptual
ms.workload: identity
ms.date: 11/23/2019
ms.author: abpati
ms.reviewer: nacanuma
ms.custom: aaddev
#Customer intent: As an application developer, I want to learn about AD FS support in MSAL for Python so I can decide if this platform meets my application development needs and requirements.
---

# Active Directory Federation Services support in MSAL for Python

Active Directory Federation Services (AD FS) in Windows Server enables you to add OpenID Connect and OAuth 2.0 based authentication and authorization to your apps by using the Microsoft Authentication Library (MSAL) for Python. Using the MSAL for Python library, your app can authenticate users directly against AD FS. For more information about scenarios, see [AD FS Scenarios for Developers](/windows-server/identity/ad-fs/ad-fs-development).

There are usually two ways of authenticating against AD FS:

- MSAL Python talks to Azure Active Directory, which itself is federated with other identity providers. The federation happens through AD FS. MSAL Python connects to Azure AD, which signs in users that are managed in Azure AD (managed users) or users managed by another identity provider such as AD FS (federated users). MSAL Python doesn't  know that a user is federated. It simply talks to Azure AD. The [authority](msal-client-application-configuration.md#authority) you use in this case is the usual authority (authority host name + tenant, common, or organizations).
- MSAL Python talks directly to an AD FS authority. This is only supported by AD FS 2019 and later.

## Connect to Active Directory federated with AD FS

### Acquire a token interactively for a federated user

The following applies whether you connect directly to Active Directory Federation Services (AD FS) or through Active Directory.

When you call `acquire_token_by_authorization_code` or `acquire_token_by_device_flow`, the user experience is typically as follows:

1. The user enters their account ID.
2. Azure AD displays briefly the message "Taking you to your organization's page" and the user is redirected to the sign-in page of the identity provider. The sign-in page is usually customized with the logo of the organization.

The supported AD FS versions in this federated scenario are:
- Active Directory Federation Services FS v2
- Active Directory Federation Services v3 (Windows Server 2012 R2)
- Active Directory Federation Services v4 (AD FS 2016)

### Acquire a token via username and password

The following applies whether you connect directly to Active Directory Federation Services (AD FS) or through Active Directory.

When you acquire a token using `acquire_token_by_username_password`, MSAL Python gets the identity provider to contact based on the username. MSAL Python gets a [SAML 1.1 token](reference-saml-tokens.md) from the identity provider, which it then provides to Azure AD which returns the JSON Web Token (JWT).

## Connecting directly to AD FS

When you connect directory to AD FS, the authority you'll want to use to build your application will be something like `https://somesite.contoso.com/adfs/`

MSAL Python supports ADFS 2019.

It does not support a direct connection to ADFS 2016 or ADFS v2. If you need to support scenarios requiring a direct connection to ADFS 2016, use the latest version of ADAL Python. Once you have upgraded your on-premises system to ADFS 2019, you can use MSAL Python.

## Next steps

- For the federated case, see [Configure Azure Active Directory sign in behavior for an application by using a Home Realm Discovery policy](../manage-apps/configure-authentication-for-federated-users-portal.md)
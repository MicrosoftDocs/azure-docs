---
title: Azure Active Directory authentication protocols | Microsoft Docs
description: An overview of the authentication protocols supported by Azure Active Directory (AD)
documentationcenter: dev-center-name
author: CelesteDG
services: active-directory
manager: mtillman
editor: ''

ms.assetid: 7a838ae2-c24c-4304-b6c0-e77fb888e6c0
ms.service: active-directory
ms.component: develop
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 04/27/2017
ms.author: celested
ms.custom: aaddev
ms.reviewer: hirsin
---

# Azure Active Directory authentication protocols
Azure Active Directory (Azure AD) supports several of the most widely used authentication and authorization protocols. The topics in this section describe the supported protocols and their implementation in Azure AD. The topics included a review of supported claim types, an introduction to the use of federation metadata, detailed OAuth 2.0. and SAML 2.0 protocol reference documentation, and a troubleshooting section.

## Authentication Protocols Articles and Reference
* [Important Information About Signing Key Rollover in Azure AD](active-directory-signing-key-rollover.md) – Learn about Azure AD’s signing key rollover cadence, changes you can make to update the key automatically, and discussion for how to update the most common application scenarios.
* [Supported Token and Claim Types](v1-id-and-access-tokens.md) - Learn about the claims in the tokens that Azure AD issues.
* [Federation Metadata](azure-ad-federation-metadata.md) - Learn how to find and interpret the metadata documents that Azure AD generates.
* [OAuth 2.0 in Azure AD](v1-protocols-oauth-code.md) - Learn about the implementation of OAuth 2.0 in Azure AD.
* [OpenID Connect 1.0](v1-protocols-openid-connect-code.md) - Learn how to use OAuth 2.0, an authorization protocol, for authentication.
* [Service to Service Calls with Client Credentials](v1-oauth2-client-creds-grant-flow.md) - Learn how to use OAuth 2.0 client credentials grant flow for service to service calls.
* [Service to Service Calls with On-Behalf-Of Flow](v1-oauth2-on-behalf-of-flow.md) - Learn how to use OAuth 2.0 On-Behalf-Of flow for service to service calls.
* [SAML Protocol Reference](active-directory-saml-protocol-reference.md) - Learn about the Single Sign-On and Single Sign-out SAML profiles of Azure AD.

## See Also
[Azure Active Directory Developer's Guide](azure-ad-developers-guide.md)

[Active Directory Code Samples](sample-v1-code.md)

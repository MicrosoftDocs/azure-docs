---
title: Azure Active Directory Authentication Protocols | Microsoft Docs
description: An overview of the authentication protocols supported by Azure Active Directory (AD)
documentationcenter: dev-center-name
author: bryanla
services: active-directory
manager: mbaldwin
editor: ''

ms.assetid: 7a838ae2-c24c-4304-b6c0-e77fb888e6c0
ms.service: active-directory
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 04/27/2017
ms.author: priyamo
ms.custom: aaddev

---
# Azure Active Directory Authentication Protocols
Azure Active Directory (Azure AD) supports several of the most widely used authentication and authorization protocols. The topics in this section describe the supported protocols and their implementation in Azure AD. The topics included a review of supported claim types, an introduction to the use of federation metadata, detailed OAuth 2.0. and SAML 2.0 protocol reference documentation, and a troubleshooting section.

## Authentication Protocols Articles and Reference
* [Important Information About Signing Key Rollover in Azure AD](active-directory-signing-key-rollover.md) – Learn about Azure AD’s signing key rollover cadence, changes you can make to update the key automatically, and discussion for how to update the most common application scenarios.
* [Supported Token and Claim Types](active-directory-token-and-claims.md) - Learn about the claims in the tokens that Azure AD issues.
* [Federation Metadata](active-directory-federation-metadata.md) - Learn how to find and interpret the metadata documents that Azure AD generates.
* [OAuth 2.0 in Azure AD](active-directory-protocols-oauth-code.md) - Learn about the implementation of OAuth 2.0 in Azure AD.
* [OpenID Connect 1.0](active-directory-protocols-openid-connect-code.md) - Learn how to use OAuth 2.0, an authorization protocol, for authentication.
* [Service to Service Calls with Client Credentials](active-directory-protocols-oauth-service-to-service.md) - Learn how to use OAuth 2.0 client credentials grant flow for service to service calls.
* [Service to Service Calls with On-Behalf-Of Flow](active-directory-protocols-oauth-on-behalf-of.md) - Learn how to use OAuth 2.0 On-Behalf-Of flow for service to service calls.
* [SAML Protocol Reference](active-directory-saml-protocol-reference.md) - Learn about the Single Sign-On and Single Sign-out SAML profiles of Azure AD.

## See Also
[Azure Active Directory Developer's Guide](active-directory-developers-guide.md)

[Using Azure AD for Authentication](../../app-service-web/web-sites-authentication-authorization.md)

[Active Directory Code Samples](active-directory-code-samples.md)

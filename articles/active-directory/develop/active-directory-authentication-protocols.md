---
title: Microsoft identity platform authentication protocols
description: An overview of the authentication protocols supported by Microsoft identity platform
author: rwike77
services: active-directory
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: conceptual
ms.workload: identity
ms.date: 12/18/2019
ms.author: ryanwi
ms.custom: aaddev
ms.reviewer: hirsin
---

# Microsoft identity platform authentication protocols

Microsoft identity platform supports several of the most widely used authentication and authorization protocols. The topics in this section describe the supported protocols and their implementation in Microsoft identity platform. The topics included a review of supported claim types, an introduction to the use of federation metadata, detailed OAuth 2.0. and SAML 2.0 protocol reference documentation, and a troubleshooting section.

## Authentication protocols articles and reference

* [Important Information About Signing Key Rollover in Microsoft identity platform](active-directory-signing-key-rollover.md) – Learn about Microsoft identity platform’s signing key rollover cadence, changes you can make to update the key automatically, and discussion for how to update the most common application scenarios.
* [Supported Token and Claim Types](id-tokens.md) - Learn about the claims in the tokens that Microsoft identity platform issues.
* [OAuth 2.0 in Microsoft identity platform](v2-oauth2-auth-code-flow.md) - Learn about the implementation of OAuth 2.0 in Microsoft identity platform.
* [OpenID Connect 1.0](v2-protocols-oidc.md) - Learn how to use OAuth 2.0, an authorization protocol, for authentication.
* [Service to Service Calls with Client Credentials](v2-oauth2-client-creds-grant-flow.md) - Learn how to use OAuth 2.0 client credentials grant flow for service to service calls.
* [Service to Service Calls with On-Behalf-Of Flow](v2-oauth2-on-behalf-of-flow.md) - Learn how to use OAuth 2.0 On-Behalf-Of flow for service to service calls.
* [SAML Protocol Reference](active-directory-saml-protocol-reference.md) - Learn about the Single Sign-On and Single Sign-out SAML profiles of Microsoft identity platform.

## See also

* [Microsoft identity platform overview](v2-overview.md)
* [Active Directory Code Samples](sample-v2-code.md)

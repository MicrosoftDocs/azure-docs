---
title: TLS and cipher suite requirements - Azure AD B2C
titleSuffix: Azure AD B2C
description: Notes for developers on HTTPS cipher suite and TLS requirements when interacting with web API endpoints.

author: kengaderdus
manager: CelesteDG

ms.service: active-directory

ms.topic: reference
ms.date: 04/30/2021
ms.custom: 
ms.author: kengaderdus
ms.subservice: B2C
---

# Azure Active Directory B2C TLS and cipher suite requirements

Azure Active Directory B2C (Azure AD B2C) connects to your endpoints through [API connectors](api-connectors-overview.md) and [identity providers](oauth2-technical-profile.md) within [user flows](user-flow-overview.md). This article discusses the TLS and cipher suite requirements for your endpoints.

The endpoints configured with API connectors and identity providers must be published to a publicly-accessible HTTPS URI. Before a secure connection is established with the endpoint, the protocol and cipher is negotiated between Azure AD B2C and the endpoint based on the capabilities of both sides of the connection.

Azure AD B2C must be able to connect to your endpoints using the Transport Layer Security (TLS) and cipher suites as described in this article.

## TLS versions

TLS version 1.2 is a cryptographic protocol that provides authentication and data encryption between servers and clients. Your endpoint must support secure communication over **TLS version 1.2**. Older TLS versions 1.0 and 1.1 are deprecated. 

## Cipher suites

Cipher suites are sets of cryptographic algorithms. They provide essential information on how to communicate data securely when using the HTTPS protocol through TLS.

Your endpoint must support at least one of the following ciphers:

- TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256
- TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384
- TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256
- TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384
- TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA256
- TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA384
- TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA256
- TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA384

## Endpoints in scope

The following endpoints used in your Azure AD B2C environment must comply with the requirements described in this article:

- [API connectors](api-connectors-overview.md) 
- OAuth1
    - Token endpoint 
    - User info endpoint
- OAuth2 and OpenId connect identity providers
    - OpenId Connect discovery endpoint
    - OpenId Connect JWKS endpoint
    - Token endpoint 
    - User info endpoint
- [ID token hint](id-token-hint.md)
    - OpenId Connect discovery endpoint
    - OpenId Connect JWKS endpoint
- [SAML identity provider](saml-service-provider.md) metadata endpoint
- [SAML service provider](identity-provider-generic-saml.md) metadata endpoint

## Check your endpoint compatibility

To verify that your endpoints comply with the requirements described in this article, perform a test using a TLS cipher and scanner tool. Test your endpoint using [SSLLABS](https://www.ssllabs.com/ssltest/analyze.html).


## Next steps

See also following articles:

- [Troubleshooting applications that don't support TLS 1.2](../cloud-services/applications-dont-support-tls-1-2.md)
- [Cipher Suites in TLS/SSL (Schannel SSP)](/windows/win32/secauthn/cipher-suites-in-schannel)
- [How to enable TLS 1.2](/mem/configmgr/core/plan-design/security/enable-tls-1-2)
- [Solving the TLS 1.0 Problem](/security/engineering/solving-tls1-problem)
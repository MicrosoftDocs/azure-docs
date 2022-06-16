---
title: Current and upcoming standards
description: This article outlines current and upcoming standards
services: active-directory
author: barclayn
manager: rkarlin
ms.service: decentralized-identity
ms.subservice: verifiable-credentials
ms.topic: how-to
ms.date: 06/16/2021
ms.author: barclayn
# Customer intent: As a developer I am looking for information around the open standards supported by Microsoft Entra verified ID
---

# Entra Verified ID Supported Standards

[!INCLUDE [Verifiable Credentials announcement](../../../includes/verifiable-credentials-brand.md)]

This page outlines currently supported open standards for Microsoft Entra Verified ID. The full document outlining how to build an implementation that interoperates with Microsoft is [JWT VC Presentation Profile](https://identity.foundation/jwt-vc-presentation-profile/).

## Standard Bodies

- [OpenID Foundation (OIDF)](https://openid.net/foundation/)
- [Decentralized Identity Foundation (DIF)](https://identity.foundation/)
- [World Wide Web Consortium (W3C)](https://www.w3.org/)
- [Internet Engineering Task Force (IETF)](https://www.ietf.org/)

## Supported Standards

Entra Verified ID supports the following open standards:

| Component in a Tech Stack | Open Standard | Standard Body |
|:------|:-----|:-----|
| Data Model | [Verifiable Credentials Data Model v1.1](https://www.w3.org/TR/vc-data-model) | W3C VC WG |
| Credential Format | [JSON Web Token VC (JWT-VC)](https://www.w3.org/TR/vc-data-model/#json-web-token) - encoded as JSON and signed as a JWS ([RFC7515](https://datatracker.ietf.org/doc/html/rfc7515)) | W3C VC WG /IETF |
| Entity Identifier (Issuer, Verifier) | [did:web](https://github.com/w3c-ccg/did-method-web) | W3C CCG |
| Entity Identifier (Issuer, Verifier, User) | [did:ion](https://github.com/decentralized-identity/ion)| DIF |
| User Authentication | [Self-Issued OpenID Provider v2](https://openid.net/specs/openid-connect-self-issued-v2-1_0.html)| OIDF |
| Presentation | [OpenID for Verifiable Credentials](https://openid.net/specs/openid-connect-4-verifiable-presentations-1_0.html) | OIDF|
| Query language | [Presentation Exchange v1.0](https://identity.foundation/presentation-exchange/spec/v1.0.0/)| DIF |
| User Authentication | [Self-Issued OpenID Provider v2](https://openid.net/specs/openid-connect-self-issued-v2-1_0.html)| OIDF |
| Trust in DID Owner | [Well Known DID Configuration](https://identity.foundation/.well-known/resources/did-configuration)| DIF |
| Revocation |[Verifiable Credential Status List 2021](https://github.com/w3c-ccg/vc-status-list-2021/tree/343b8b59cddba4525e1ef355356ae760fc75904e)| W3C CCG |

## Supported Algorithms

Entra Verified ID supports the following Key Types for the JWS signature verification:

|Key Type|JWT Algorithm|
|--------|-------------|
|secp256k1|ES256K|
|Ed25519|EdDSA|

## Next steps

- [Get started with verifiable credentials](verifiable-credentials-configure-tenant.md)

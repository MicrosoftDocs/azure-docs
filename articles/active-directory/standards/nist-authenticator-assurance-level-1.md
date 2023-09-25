---
title: Achieve NIST AAL1 with Microsoft Entra ID
description: Guidance on achieving NIST authenticator assurance level 1 (AAL1) with Microsoft Entra ID.
services: active-directory 
ms.service: active-directory
ms.subservice: fundamentals
ms.workload: identity
ms.topic: how-to
author: gargi-sinha
ms.author: gasinh
manager: martinco
ms.reviewer: martinco
ms.date: 12/8/2022
ms.custom: it-pro
ms.collection: M365-identity-device-management
---

# NIST authenticator assurance level 1 with Microsoft Entra ID 

The National Institute of Standards and Technology (NIST) develops technical requirements for US federal agencies implementing identity solutions. Organizations must meet these requirements when working with federal agencies. 

Before you begin authenticator assurance level 1 (AAL1), you can review the following resources:

* [NIST overview](nist-overview.md): Understand AAL levels
* [Authentication basics](nist-authentication-basics.md): Terminology and authentication types
* [NIST authenticator types](nist-authenticator-types.md): Authenticator types
* [NIST AALs](nist-about-authenticator-assurance-levels.md): AAL components, Microsoft Entra authentication methods, and Trusted Platform Modules (TPMs). 

## Permitted authenticator types

To achieve AAL1, you can use any NIST single-factor or multifactor [permitted authenticator](nist-authenticator-types.md). 

|Microsoft Entra authentication method|NIST authenticator type |
| - | - |
|Password |Memorized Secret |
|Phone (SMS): Not recommended | Single-factor out-of-band |
|Microsoft Authenticator App (Passwordless)|Multi-factor out-of-band |
|Single-factor software certificate | Single-factor crypto software |
|Multi-factor Software Certificate (PIN Protected) <br> Windows Hello for Business with software TPM <br> | Multi-factor crypto software | 
|Hardware protected certificate (smartcard/security key/TPM) <br> FIDO 2 security key <br> Windows Hello for Business with hardware TPM <br> | Multi-factor crypto hardware


> [!TIP]
> We recommend you select at a minimum phishing resistant AAL2 authneticators. Select AAL3 authenticators as necessary for business reasons, industry standards, or compliance requirements.

## FIPS 140 validation

### Verifier requirements

Microsoft Entra ID uses the Windows FIPS 140 Level 1 cryptographic module for its authentication cryptographic operations. It's therefore a FIPS 140-compliant verifier required by government agencies.

## Man-in-the-middle resistance 

Communications between the claimant and Microsoft Entra ID are over an authenticated, protected channel, to resist man-in-the-middle (MitM) attacks. This configuration satisfies the MitM-resistance requirements for AAL1, AAL2, and AAL3.

## Next steps 

[NIST overview](nist-overview.md)

[Learn about AALs](nist-about-authenticator-assurance-levels.md)

[Authentication basics](nist-authentication-basics.md)

[NIST authenticator types](nist-authenticator-types.md)

[Achieve NIST AAL1 with Microsoft Entra ID](nist-authenticator-assurance-level-1.md)

[Achieve NIST AAL2 with Microsoft Entra ID](nist-authenticator-assurance-level-2.md)

[Achieve NIST AAL3 with Microsoft Entra ID](nist-authenticator-assurance-level-3.md) 

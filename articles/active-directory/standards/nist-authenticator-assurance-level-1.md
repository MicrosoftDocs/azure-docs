---
title: Achieve NIST AAL1 with Azure Active Directory
description: Guidance on achieving NIST authenticator assurance level 1 (AAL1) with Azure Active Directory.
services: active-directory 
ms.service: active-directory
ms.subservice: fundamentals
ms.workload: identity
ms.topic: how-to
author: gargi-sinha
ms.author: gasinh
manager: martinco
ms.reviewer: martinco
ms.date: 09/13/2022
ms.custom: it-pro
ms.collection: M365-identity-device-management
---

# Achieve NIST authenticator assurance level 1 with Azure Active Directory

The National Institute of Standards and Technology (NIST) develops the technical requirements for US federal agencies that implement identity solutions. Meeting these requirements is also required for organizations working with federal agencies. 

Before you attempt to achieve authenticator assurance level 1 (AAL1), you might want to see the following resources:
* [NIST overview](nist-overview.md): Understand the different AAL levels.
* [Authentication basics](nist-authentication-basics.md): Important terminology and authentication types.
* [NIST authenticator types](nist-authenticator-types.md): Understand each of the authenticator types.
* [NIST AALs](nist-about-authenticator-assurance-levels.md): Covers the components of the AALs, how Azure Active Directory (Azure AD) authentication methods map to them, and understanding trusted platform modules (TPMs). 

## Permitted authenticator types

 To achieve AAL1, you can use any NIST single-factor or multifactor [permitted authenticator](nist-authenticator-types.md). The following table contains those not covered in [AAL2](nist-authenticator-assurance-level-2.md) and [AAL3](nist-authenticator-assurance-level-2.md).

| Azure AD authentication method| NIST authenticator type |
| - | - |
| Password |Memorized Secret |
| Phone (SMS)|  Out-of-Band |
|  FIDO 2 security key <br>Microsoft Authenticator app for iOS (Passwordless)<br>Windows Hello for Business with software TPM <br>Smartcard (Active Directory Federation Services) |  Multi-factor Crypto software |

> [!TIP]
> We recommend that you meet at least AAL2. Meet AAL3 if necessary for business reasons, industry standards, or compliance requirements.

## FIPS 140 validation

### Verifier requirements

Azure AD uses the Windows FIPS 140 Level 1 overall validated cryptographic ‎module for all its authentication related cryptographic operations. It's therefore a FIPS 140 compliant verifier as required by government agencies.

## Man-in-the-middle resistance 

All communications between the claimant and Azure AD are performed over an authenticated, protected channel, to provide resistance to man-in-the-middle (MitM) attacks. This satisfies the MitM resistance requirements for AAL1, AAL2, and AAL3.

## Next steps 

[NIST overview](nist-overview.md)

[Learn about AALs](nist-about-authenticator-assurance-levels.md)

[Authentication basics](nist-authentication-basics.md)

[NIST authenticator types](nist-authenticator-types.md)

[Achieve NIST AAL1 with Azure AD](nist-authenticator-assurance-level-1.md)

[Achieve NIST AAL2 with Azure AD](nist-authenticator-assurance-level-2.md)

[Achieve NIST AAL3 with Azure AD](nist-authenticator-assurance-level-3.md) 

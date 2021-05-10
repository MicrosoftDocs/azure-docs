---
title: Achieving NIST AAL1 with the Azure Active Directory
description: Guidance on achieving NIST authenticator assurance level 1 (AAL 1) with Azure Active Directory.
services: active-directory 
ms.service: active-directory
ms.subservice: fundamentals
ms.workload: identity
ms.topic: how-to
author: barbaraselden
ms.author: baselden
manager: mtillman
ms.reviewer: martinco
ms.date: 4/26/2021
ms.custom: it-pro
ms.collection: M365-identity-device-management
---

# Achieving NIST Authenticator assurance level 1 with Azure Active Directory

The National Institute of Standards and Technology (NIST) develops the technical requirements for US federal agencies implementing identity solutions. Meeting these requirements is also required for organizations working with federal agencies. This article guides you to achieve NIST authentication assurance level 1 (AAL1). 

Resources you may want to see prior to trying to achieve AAL 1:
* [NIST overview](nist-overview.md) - understand the different AAL levels.
* [Authentication basics](nist-authentication-basics.md) - Important terminology and authentication types.
* [NIST authenticator types](nist-authenticator-types.md)- Understand each of the authenticator types.
* [NIST AALs](nist-about-authenticator-assurance-levels.md) - the components of the AALs, how Microsoft Azure Active Directory authentication methods map to them, and understanding trusted platform modules (TPMs). 

## Permitted authenticator types

 Any NIST single- or multi-factor [permitted authenticator](nist-authenticator-types.md) can be used to achieve AAL1. the following table contains those not covered in [AAL2](nist-authenticator-assurance-level-2.md) and [AAL3](nist-authenticator-assurance-level-2.md).

| Azure AD Authentication Method| NIST Authenticator Type |
| - | - |
| Password |Memorized Secret |
| Phone (SMS)|  Out-of-Band |
|  FIDO 2 security key <br>Microsoft Authenticator app for iOS (Passwordless)<br>Windows Hello for Business with software TPM <br>Smartcard (ADFS) |  Multi-factor Crypto software |

> [!TIP]
> We recommend that you meet at least AAL 2, unless business reasons, industry standards, or compliance requirements dictate that you meet AAL3.

## FIPS 140 validation

### Verifier requirements

Azure AD is using the Windows FIPS 140 Level 1 overall validated cryptographic   
‎module for all its authentication related cryptographic operations. It is therefore a FIPS 140 compliant verifier as required by government agencies.

## Man-in-the-middle (MitM) resistance 

All communications between the claimant and Azure AD are performed over an authenticated protected channel to provide resistance to MitM attacks. This satisfies the MitM resistance requirements for AAL1, AAL2 and AAL3.

## Next Steps 

[NIST overview](nist-overview.md)

[Learn about AALs](nist-about-authenticator-assurance-levels.md)

[Authentication basics](nist-authentication-basics.md)

[NIST authenticator types](nist-authenticator-types.md)

[Achieving NIST AAL1 with Azure AD](nist-authenticator-assurance-level-1.md)

[Achieving NIST AAL2 with Azure AD](nist-authenticator-assurance-level-2.md)

[Achieving NIST AAL3 with Azure AD](nist-authenticator-assurance-level-3.md) 
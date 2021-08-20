---
title: Achieve NIST AAL3 by using Azure Active Directory
description: This article provides guidance on achieving NIST authenticator assurance level 3 (AAL3) by using Azure Active Directory.
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

# Achieve NIST authenticator assurance level 3 by using Azure Active Directory

This article helps you achieve National Institute of Standards and Technology authenticator assurance level (NIST AAL) 3. You might want to review these resources before you try to achieve AAL3:
* [NIST overview](nist-overview.md): Understand the different AAL levels.
* [Authentication basics](nist-authentication-basics.md): Important terminology and authentication types.
* [NIST authenticator types](nist-authenticator-types.md): Understand each of the authenticator types.
* [NIST AALs](nist-about-authenticator-assurance-levels.md): Covers the components of the AALs and how Azure Active Directory (Azure AD) authentication methods map to them.

## Permitted authenticator types
Microsoft offers authentication methods that enable you to meet required NIST authenticator types. This section provides Microsoft recommendations.
 

| Azure AD authentication methods| NIST authenticator type |
| - | -|
| **Recommended methods**|    |
| FIDO2 security key<br>or<br> Smart card (Active Directory Federation Services [AD FS])<br>or<br>Windows Hello for Business with hardware TPM| Multifactor cryptographic hardware |
| **Additional methods**|   |
| Password<br> and<br>(Hybrid Azure AD joined with hardware TPM <br>or <br> Azure AD joined with hardware TPM)| Memorized secret<br>and<br> Single-factor cryptographic hardware |
| Password <br>and<br>(Single-factor one-time password hardware (from an OTP manufacturer) <br>or<br>Hybrid Azure AD joined with software TPM <br>or <br> Azure AD joined with software TPM <br>or<br> Compliant managed device)| Memorized secret <br>and<br>Single-factor one-time password hardware<br> and<br>Single-factor cryptographic software |

### Our recommendations 

We recommend using a multifactor cryptographic hardware authenticator to achieve AAL3. Passwordless authentication eliminates the greatest attack surface, the password, and offers users a streamlined authentication method. If your organization is completely cloud based, we recommend that you use FIDO2 security keys.

Note that FIDO2 keys and Windows Hello for Business haven't been validated at the required FIPS 140 Security Level. So federal customers need to conduct risk assessment and evaluation before accepting these authenticators as AAL3.

For detailed guidance, see [Plan a passwordless authentication deployment in Azure Active Directory](../authentication/howto-authentication-passwordless-deployment.md).

For more information on implementing Windows Hello for Business, see the [Windows Hello for Business deployment guide](/windows/security/identity-protection/hello-for-business/hello-deployment-guide).

## FIPS 140 validation

### Verifier requirements

Azure AD uses the Windows FIPS 140 Level 1 Overall validated cryptographic   
‎module for all of its authentication-related cryptographic operations. So it's a FIPS-140 compliant verifier.

### Authenticator requirements

Single-factor and multifactor cryptographic hardware authenticators have different authenticator requirements. 

**Single-factor cryptographic hardware** authenticators are required to be:

* FIPS 140 Level 1 Overall (or higher).

* FIPS 140 Level 3 Physical Security (or higher).

Azure AD joined and Hybrid Azure AD joined devices meet this requirement when: 

* You run [Windows in a FIPS-140 approved mode of operation](/windows/security/threat-protection/fips-140-validation). 

* On a machine with a TPM that's FIPS 140 Level 1 Overall (or higher) with FIPS 140 Level 3 Physical Security. 

   * Find compliant TPMs by searching for "Trusted Platform Module" and "TPM" on the [Cryptographic Module Validation Program](https://csrc.nist.gov/Projects/cryptographic-module-validation-program/validated-modules/Search) page.

Check with your mobile device vendor to learn about your vendor's adherence with FIPS 140.

**Multifactor cryptographic hardware** authenticators are required to be: 

* FIPS 140 Level 2 Overall (or higher).

* FIPS 140 Level 3 Physical Security (or higher).

FIDO2 security keys, smart cards, and Windows Hello for Business can help you meet these requirements.

* FIDO2 key providers are in various stages of FIPS certification, including some that have completed validation. We recommend you review the [list of supported FIDO2 key vendors](../authentication/concept-authentication-passwordless.md#fido2-security-key-providers) and check with your provider for current FIPS validation status.

* Smart cards are a proven technology. Multiple vendor products meet FIPS requirements.

   * Learn more on the [Cryptographic Module Validation Program](https://csrc.nist.gov/Projects/cryptographic-module-validation-program/validated-modules/Search) page.

**Windows Hello for Business**

FIPS 140 requires the entire cryptographic boundary, including software, firmware, and hardware, to be in scope for evaluation. Windows operating systems are open computing platforms that can be paired with thousands of combinations of hardware. Microsoft can't maintain FIPS certifications for each combination. You should evaluate the following individual certifications of components as part of your risk assessment for using Windows Hello for Business as an AAL3 authenticator:

* **Windows 10 and Windows Server** use the [US Government Approved Protection Profile for General Purpose Operating Systems Version 4.2.1](https://www.niap-ccevs.org/Profile/Info.cfm?PPID=442&id=442) from the National Information Assurance Partnership (NIAP). NIAP oversees a national program to evaluate commercial off-the-shelf (COTS) information technology (IT) products for conformance to the international Common Criteria. 

* **Windows Cryptographic Library** [has achieved FIPS Level 1 Overall in the NIST Cryptographic Module Validation Program](https://csrc.nist.gov/Projects/cryptographic-module-validation-program/Certificate/3544) (CMVP). The CMVP, a joint effort between NIST and the Canadian Center for Cyber Security, validates cryptographic modules against FIPS standards. 

* Choose a **Trusted Platform Module (TPM)** that's FIPS 140 Level 2 Overall and FIPS 140 Level 3 Physical Security. It's your organization's responsibility to ensure that the hardware TPM you're using meets the requirements of the AAL level you want to achieve.   
‎To determine which TPMs meet the current standards, go to the [NIST Computer Security Resource Center Cryptographic Module Validation Program](https://csrc.nist.gov/Projects/cryptographic-module-validation-program/validated-modules/Search) page. In the **Module Name** box, enter **Trusted Platform Module**. The resulting list contains hardware TPMs that meet the current standards.

## Reauthentication 

At the AAL3 level, NIST requires reauthentication every 12 hours, regardless of user activity. Reauthentication is also required after any period of inactivity that lasts 15 minutes or longer. Presentation of both factors is required.

To meet the requirement for reauthentication regardless of user activity, Microsoft recommends configuring [user sign-in frequency](../conditional-access/howto-conditional-access-session-lifetime.md) to 12 hours. 

NIST also allows the use of compensating controls for confirming the subscriber's presence:

* You can set a session inactivity timeout of 15 minutes by locking the device at the OS level. You can do so by using Microsoft Endpoint Configuration Manager, Group Policy Object (GPO), or Intune. You must also require local authentication for the subscriber to unlock it.

* You can achieve timeout regardless of activity by running a scheduled task (by using Configuration Manager, GPO, or Intune) that locks the machine after 12 hours, regardless of activity.

## Man-in-the-middle resistance 

All communications between the claimant and Azure AD are done over an authenticated, protected channel to provide resistance to man-in-the-middle (MitM) attacks. This configuration satisfies the MitM resistance requirements for AAL1, AAL2, and AAL3.

## Verifier impersonation resistance

All Azure AD authentication methods that meet AAL3 use cryptographic authenticators that bind the authenticator output to the specific session being authenticated. They do so by using a private key controlled by the claimant for which the public key is known to the verifier. This configuration satisfies the verifier-impersonation resistance requirements for AAL3.

## Verifier compromise resistance

All Azure AD authentication methods that meet AAL3 do one of the following:
- Use a cryptographic authenticator that requires the verifier to store a public key that corresponds to a private key held by the authenticator. 
- Store the expected authenticator output by using FIPS-140 validated hash algorithms. 

For more information, see [Azure AD Data Security Considerations](https://aka.ms/AADDataWhitepaper).

## Replay resistance

All Azure AD authentication methods that meet AAL3 use either nonce or challenges. These methods are resistant to replay attacks because the verifier will easily detect replayed authentication transactions. Such transactions won't contain the appropriate nonce or timeliness data.

## Authentication intent

The goal of authentication intent is to make it more difficult for directly connected physical authenticators (like multifactor cryptographic devices) to be used without the subject's knowledge. For example, by malware on the endpoint.

NIST allows the use of compensating controls for mitigating malware risk. Any Intune-compliant device that runs Windows Defender System Guard and Windows Defender ATP meets this mitigation requirement.

## Next steps 

[NIST overview](nist-overview.md)

[Learn about AALs](nist-about-authenticator-assurance-levels.md)

[Authentication basics](nist-authentication-basics.md)

[NIST authenticator types](nist-authenticator-types.md)

[Achieving NIST AAL1 by using Azure AD](nist-authenticator-assurance-level-1.md)

[Achieving NIST AAL2 by using Azure AD](nist-authenticator-assurance-level-2.md)
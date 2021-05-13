---
title: Achieving NIST AAL3 with the Azure Active Directory
description: Guidance on achieving NIST authenticator assurance level 3 (AAL 3) with Azure Active Directory.
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

# Achieving NIST authenticator assurance level 3 with the Azure Active Directory

This article guides you to achieving National Institute of Standards and Technology authenticator assurance level (NIST AAL) 3. Resources you may want to see prior to trying to achieve AAL 3:
* [NIST overview](nist-overview.md) - understand the different AAL levels.
* [Authentication basics](nist-authentication-basics.md) - Important terminology and authentication types.
* [NIST authenticator types](nist-authenticator-types.md)- Understand each of the authenticator types.
* [NIST AALs](nist-about-authenticator-assurance-levels.md) - the components of the AALs, and how Microsoft Azure Active Directory authentication methods map to them.

## Permitted authenticator types
Microsoft offers authentication methods that enable you to meet required NIST authenticator types. Please see our recommendations.
 

| Azure AD Authentication Methods| NIST Authenticator Type |
| - | -|
| **Recommended methods**|    |
| FIDO2 security key **OR**<br> Smartcard (AD FS) **OR**<br>Windows Hello for Business w/ hardware TPM| Multi-factor cryptographic hardware |
| **Additional methods**|   |
| Password **AND**<br>(Hybrid Azure AD Joined w/ hardware TPM **OR** <br> Azure AD joined w/ hardware TPM)| Memorized secret **+** Single-factor crypto hardware |
| Password **AND**<br>Single-factor one-time-password hardware (from OTP manufacturers) **OR**<br>Hybrid Azure AD Joined w/ software TPM **OR** <br> Azure AD joined w/ software TPM **OR**<br> Compliant managed device| Memorized secret **AND**<br>Single-factor one-time password hardware **AND**<br>Single-factor crypto software |

### Our recommendations 

We recommend using a multi-factor cryptographic hardware authenticator to achieve AAL3. Passwordless authentication eliminates the greatest attack surface—the password—and offers users a streamlined method to authenticate. If your organization is completely cloud-based, we recommend using FIDO2 security keys.

Please note that FIDO2 keys and Windows Hello for Business have not been validated at the required FIPS 140 Security Level and as such federal customers would need to conduct risk assessment and evaluation before accepting these authenticators as AAL3.

For detailed guidance, see [Plan a passwordless authentication deployment in Azure Active Directory](https://docs.microsoft.com/azure/active-directory/authentication/howto-authentication-passwordless-deployment).

For more information on implementing Windows Hello for Business, see the [Windows Hello for Business deployment guide](https://docs.microsoft.com/windows/security/identity-protection/hello-for-business/hello-deployment-guide).

## FIPS 140 validation

### Verifier requirements

Azure AD is using the Windows FIPS 140 Level 1 overall validated cryptographic   
‎module for all its authentication related cryptographic operations. It is therefore a FIPS 140 compliant verifier.

### Authenticator requirements

Single-factor and multi-factor cryptographic hardware authenticators have different authenticator requirements. 

Single-factor cryptographic hardware authenticators are required to be 

* FIPS 140 Level 1 overall (or higher)

* FIPS 140 Level 3 Physical Security (or higher)

Azure AD joined and Hybrid Azure AD joined devices meet this requirement when 

* you run [Windows in a FIPS 140 approved mode of operation](https://docs.microsoft.com/windows/security/threat-protection/fips-140-validation) 

* on a machine with a TPM that is FIPS 140 Level 1 overall (or higher) with FIPS 140 Level 3 Physical Security. 

   * Find compliant TPMs by searching “Trusted Platform Module” and “TPM” under [Cryptographic Module Validation Program](https://csrc.nist.gov/Projects/cryptographic-module-validation-program/validated-modules/Search).

Check with your mobile device vendor to learn about their adherence with FIPS 140.

**Multi-factor cryptographic hardware** authenticators are required to be 

* FIPS 140 Level 2 overall (or higher)

* FIPS 140 Level 3 Physical Security (or higher)

FIDO2 security keys, Smartcards, and Windows Hello for Business can help you meet these requirements.

* FIDO2 keys are a very recent innovation and as such are still in the process of the undergoing FIPS certification.

* Smartcards are a proven technology with multiple vendor products meeting FIPS requirements.

   * Find out more on the [Cryptographic Module Validation Program](https://csrc.nist.gov/Projects/cryptographic-module-validation-program/validated-modules/Search).

**Windows Hello for Business**

FIPS 140 requires the entire cryptographic boundary including software, firmware, and hardware, to be in scope for evaluation. Windows operating systems are open computing platforms that can be paired with thousands of combinations of hardware. As such, Microsoft cannot maintain FIPS certifications for each combination. The following individual certifications of the components should be evaluated as part of the risk assessment for using WHfB as an AAL3 authenticator:

* **Microsoft Windows 10, and Microsoft Windows Server** use the [US Government Approved Protection Profile for General Purpose Operating Systems Version 4.2.1](https://www.niap-ccevs.org/Profile/Info.cfm?PPID=442&id=442). from the National Information Assurance Partnership (NIAP). NIAP oversees a national program to evaluate Commercial Off-The-Shelf (COTS) Information Technology (IT) products for conformance to the international Common Criteria. 

* **Microsoft Windows Cryptographic Library** [has achieved FIPS Level 1 overall in the NIST Cryptographic Module Validation Program](https://csrc.nist.gov/Projects/cryptographic-module-validation-program/Certificate/3544) (CMVP). The CMVP, a joint effort between the NIST and the Canadian Center for Cyber Security, validates cryptographic module to FIPS standards. 

* Choose a **Trusted Platform Module (TPM)** that is FIPS 140 Level 2 overall, and FIPS 140 Level 3 Physical Security. **As an organization, it is your responsibility to ensure that the hardware TPM you are using meets the needs of the AAL level you want to achieve**.   
‎To determine which TPMs meet the current standards, go to the [NIST Computer Security Resource Center Cryptographic Module Validation Program](https://csrc.nist.gov/Projects/cryptographic-module-validation-program/validated-modules/Search). In the Module name field, enter “Trusted platform module.” The resultant list contains hardware TPMS that meet the current standards.

## Reauthentication 

At AAL3 NIST requires reauthentication every 12 hours regardless of user activity, and after any period of inactivity lasting 15 minutes or longer. Presentation of both factors is required.

To meet the requirement for reauthentication regardless of user activity Microsoft recommends configuring [user sign-in frequency](https://aka.ms/NIST/38) to 12 hours. 

NIST also allows the use of compensating controls for confirming the subscriber’s presence:

* Session inactivity timeout of 15 minutes can be achieved by locking the device at the OS level by leveraging Microsoft System Center Configuration manager (SCCM), Group policy objects (GPO), or Intune. You must also require local authentication for the subscriber to unlock it.

* Timeout regardless of activity can be achieved by running a scheduled task (leveraging SCCM, GPO or Intune) that locks the machine after 12 hours regardless of activity.

## Man-in-the-middle (MitM) resistance 

All communications between the claimant and Azure AD are performed over an authenticated protected channel to provide resistance to MitM attacks. This satisfies the MitM resistance requirements for AAL1, AAL2 and AAL3.

## Verifier impersonation resistance

All Azure AD authentication methods that meet AAL3 leverage cryptographic authenticators that bind the authenticator output to the specific session being authenticated. They do this by using a private key controlled by the claimant for which the public key is known to the verifier. This satisfies the verifier impersonation resistance requirements for AAL3.

## Verifier compromise resistance

All Azure AD authentication methods that meet AAL3 either use a cryptographic authenticator that requires the verifier store a public key corresponding to a private key held by the authenticator or store the expected authenticator output using FIPS 140 validated hash algorithms. You can find more details under [Azure AD Data Security Considerations](https://aka.ms/AADDataWhitepaper).

## Replay resistance

All Azure AD authentication methods at AAL3 either use nonce or challenges and are resistant to replay attacks since the verifier will easily detect replayed authentication transactions since they will not contain the appropriate nonce or timeliness data.

## Authentication intent

The goal of authentication intent is to make it more difficult for directly connected physical authenticators (e.g., multi-factor cryptographic devices) to be used without the subject’s knowledge, such as by malware on the endpoint.

NIST allows the use of compensating controls for mitigating malware risk. Any Intune compliant device running Windows Defender System Guard and Windows Defender ATP meets this mitigation requirement.

## Next Steps 

[NIST overview](nist-overview.md)

[Learn about AALs](nist-about-authenticator-assurance-levels.md)

[Authentication basics](nist-authentication-basics.md)

[NIST authenticator types](nist-authenticator-types.md)

[Achieving NIST AAL1 with Azure AD](nist-authenticator-assurance-level-1.md)

[Achieving NIST AAL2 with Azure AD](nist-authenticator-assurance-level-2.md)

[Achieving NIST AAL3 with Azure AD](nist-authenticator-assurance-level-3.md) 

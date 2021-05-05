---
title: Achieving NIST AAL2 with the Azure Active Directory
description: Guidance on achieving NIST authenticator assurance level 2 (AAL 2) with Azure Active Directory.
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


# Achieving NIST authenticator assurance level 2 with Azure Active Directory

The National Institute of Standards and Technology (NIST) develops the technical requirements for US federal agencies implementing identity solutions. Meeting these requirements is also required for organizations working with federal agencies. This article guides you to achieve NIST authentication assurance level 2 (AAL2). 

Resources you may want to see prior to trying to achieve AAL 2:
* [NIST overview](nist-overview.md) - understand the different AAL levels.
* [Authentication basics](nist-authentication-basics.md) - Important terminology and authentication types.
* [NIST authenticator types](nist-authenticator-types.md)- Understand each of the authenticator types.
* [NIST AALs](nist-about-authenticator-assurance-levels.md) - the components of the AALs, and how Microsoft Azure Active Directory authentication methods map to them.

## Permitted Authenticator Types


| Azure AD Authentication method| NIST Authenticator type | 
| - | - |
| **Recommended methods** |   | 
| Microsoft Authenticator app for iOS (Passwordless)<br>Windows Hello for Business w/ software TPM | Multi-factor crypto software |
| FIDO 2 security key<br>Microsoft Authenticator app for Android (Passwordless)<br>Windows Hello for Business w/ hardware TPM<br>Smartcard (ADFS) | Multi-factor crypto hardware |
| **Additional methods** |  |
| Password + Phone (SMS) | Memorized Secret + Out-of-Band |
| Password + Microsoft Authenticator App (OTP)<br>Password + SF OTP | Memorized Secret +  ‎Single-factor one-time password |
| Password + Azure AD joined with software TPM <br>Password + Compliant mobile device<br>Password + Hybrid Azure AD Joined with software TPM <br>Password + Microsoft Authenticator App (Notification) | Memorized Secret + ‎Single-factor crypto SW |
| Password + Azure AD joined with hardware TPM <br>Password + Hybrid Azure AD Joined with hardware TPM | Memorized Secret + ‎Single-factor crypto hardware |


### Our recommendations

We recommend using multi-factor cryptographic hardware or software authenticators to achieve AAL2. Passwordless authentication eliminates the greatest attack surface—the password—and offers users a streamlined method to authenticate. 

For detailed guidance on selecting a passwordless authentication method, see [Plan a passwordless authentication deployment in Azure Active Directory](https://docs.microsoft.com/azure/active-directory/authentication/howto-authentication-passwordless-deployment).

For more information on implementing Windows Hello for Business, see the [Windows Hello for Business deployment guide](https://docs.microsoft.com/windows/security/identity-protection/hello-for-business/hello-deployment-guide).

## FIPS 140 validation

The following information is a guide to achieving FIPS 140 validation.

### Verifier requirements

Azure AD is using the Windows FIPS 140 Level 1 overall validated cryptographic   
‎module for all its authentication related cryptographic operations. It is therefore a FIPS 140 compliant verifier as required by government agencies.

### Authenticator requirements

*Government agencies’ cryptographic authenticators are required to be FIPS 140 Level 1 overall validated*. This is not a requirement for non-governmental agencies. The following Azure AD authenticators meet the requirement when running on [Windows in a FIPS 140 approved mode of operation](https://docs.microsoft.com/windows/security/threat-protection/fips-140-validation)

* Password

* Azure AD joined w/ software or w/ hardware TPM

* Hybrid Azure AD Joined w/ software or w/ hardware TPM

* Windows Hello for Business w/ software or w/ hardware TPM

* Smartcard (ADFS) 

FIDO2 security keys, and the Microsoft Authenticator app (in all its modes - Notification, OTP and Passwordless) do not meet government agencies requirement for FIPS 140 Level 1 overall validation as of this writing.

* Microsoft Authenticator app is using FIPS 140 approved cryptography; however, it is not FIPS 140 Level 1 overall validated. 

* FIDO2 keys are a very recent innovation and as such are still in the process of the undergoing FIPS certification.

## Reauthentication 

At AAL2 NIST requires reauthentication every 12 hours regardless of user activity, and after any period of inactivity lasting 30 minutes or longer. Presentation of something you know or something you are is required, since the session secret is something you have.

To meet the requirement for reauthentication regardless of user activity, Microsoft recommends configuring [user sign-in frequency](https://docs.microsoft.com/azure/active-directory/conditional-access/howto-conditional-access-session-lifetime) to 12 hours. 

NIST also allows the use of compensating controls for confirming the subscriber’s presence:

* Session inactivity timeout of 30 minutes can be achieved by locking the device at the OS level by leveraging Microsoft System Center Configuration Manager (SCCM), Group policy objects (GPO), or Intune. You must also require local authentication for the subscriber to unlock it.

* Timeout regardless of activity can be achieved by running a scheduled task (leveraging SCCM, GPO or Intune) that locks the machine after 12 hours regardless of activity.

## Man-in-the-middle (MitM) resistance 

All communications between the claimant and Azure AD are performed over an authenticated protected channel to provide resistance to MitM attacks. This satisfies the MitM resistance requirements for AAL1, AAL2 and AAL3.

## Replay resistance

All Azure AD authentication methods at AAL2 use either nonce or challenges and are resistant to replay attacks since the verifier will easily detect replayed authentication transactions since they will not contain the appropriate nonce or timeliness data.

## Next Steps 

[NIST overview](nist-overview.md)

[Learn about AALs](nist-about-authenticator-assurance-levels.md)

[Authentication basics](nist-authentication-basics.md)

[NIST authenticator types](nist-authenticator-types.md)

[Achieving NIST AAL1 with Azure AD](nist-authenticator-assurance-level-1.md)

[Achieving NIST AAL2 with Azure AD](nist-authenticator-assurance-level-2.md)

[Achieving NIST AAL3 with Azure AD](nist-authenticator-assurance-level-3.md)  
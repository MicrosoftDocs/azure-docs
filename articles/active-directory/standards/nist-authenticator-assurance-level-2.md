---
title: Achieve NIST AAL2 with the Azure Active Directory
description: Guidance on achieving NIST authenticator assurance level 2 (AAL2) with Azure Active Directory.
services: active-directory 
ms.service: active-directory
ms.subservice: fundamentals
ms.workload: identity
ms.topic: how-to
author: gargi-sinha
ms.author: gasinh
manager: martinco
ms.reviewer: martinco
ms.date: 11/23/2022
ms.custom: it-pro
ms.collection: M365-identity-device-management
---

# NIST authenticator assurance level 2 with Azure Active Directory

The National Institute of Standards and Technology (NIST) develops technical requirements for US federal agencies implementing identity solutions. Organizations working with federal agencies must meet these requirements. 

Before starting authenticator assurance level 2 (AAL2), you can see the following resources:

* [NIST overview](nist-overview.md): Understand AAL levels
* [Authentication basics](nist-authentication-basics.md): Terminology and authentication types
* [NIST authenticator types](nist-authenticator-types.md): Authenticator types
* [NIST AALs](nist-about-authenticator-assurance-levels.md): AAL components and Azure Active Directory (Azure AD) authentication methods

## Permitted AAL2 authenticator types

The following table has authenticator types permitted for AAL2:

| Azure AD authentication method| NIST authenticator type | 
| - | - |
| **Recommended methods** |   | 
| Microsoft Authenticator app for iOS (passwordless) <br> Windows Hello for Business with software Trusted Platform Module (TPM) | Multi-factor crypto software |
| FIDO 2 security key <br> Microsoft Authenticator app for Android (passwordless) <br> Windows Hello for Business with hardware TPM <br>Smartcard (Active Directory Federation Services) | Multi-factor crypto hardware |
| **Additional methods** |  |
| Password and phone (SMS) | Memorized secret and out-of-band |
| Password and Microsoft Authenticator app one-time password (OTP) <br> Password and single-factor OTP | Memorized secret and single-factor OTP|
| Password and Azure AD joined with software TPM <br> Password and compliant mobile device <br> Password and Hybrid Azure AD Joined with software TPM <br> Password and Microsoft Authenticator app (Notification) | Memorized secret and single-factor crypto software |
| Password and Azure AD joined with hardware TPM <br> Password and Hybrid Azure AD joined with hardware TPM | Memorized secret and single-factor crypto hardware |

> [!NOTE]
> In Conditional Access policy, the Authenticator is verifier impersonation resistance, if you require a device to be compliant or Hybrid Azure AD joined.

### AAL2 recommendations

For AAL2, use multi-factor cryptographic hardware or software authenticators. Passwordless authentication eliminates the greatest attack surface (the password), and offers users a streamlined method to authenticate. 

For guidance on selecting a passwordless authentication method, see [Plan a passwordless authentication deployment in Azure Active Directory](../authentication/howto-authentication-passwordless-deployment.md). See also, [Windows Hello for Business deployment guide](/windows/security/identity-protection/hello-for-business/hello-deployment-guide)

## FIPS 140 validation

Use the following sections to learn about FIPS 140 validation.

### Verifier requirements

Azure AD uses the Windows FIPS 140 Level 1 overall validated cryptographic module for authentication cryptographic operations. It's therefore a FIPS 140-compliant verifier required by government agencies.

### Authenticator requirements

Government agency cryptographic authenticators are validated for FIPS 140 Level 1 overall. This requirement isn't for non-governmental agencies. The following Azure AD authenticators meet the requirement when running on [Windows in a FIPS 140-approved mode](/windows/security/threat-protection/fips-140-validation):

* Password

* Azure AD joined with software or with hardware TPM

* Hybrid Azure AD joined with software or with hardware TPM

* Windows Hello for Business with software or with hardware TPM

* Smartcard (Active Directory Federation Services) 

Although Microsoft Authenticator app (in notification, OTP, and passwordless modes) uses FIPS 140-approved cryptography, it's not validated for FIPS 140 Level 1.

FIDO 2 security key providers are in various stages of FIPS certification. We recommend you review the list of [supported FIDO 2 key vendors](../authentication/concept-authentication-passwordless.md#fido2-security-key-providers). Consult with your provider for current FIPS validation status.


## Reauthentication 

For AAL2, the NIST requirement is reauthentication every 12 hours, regardless of user activity. Reauthentication is required after a period of inactivity of 30 minutes or longer. Because the session secret is something you have, presenting something you know, or are, is required.

To meet the requirement for reauthentication, regardless of user activity, Microsoft recommends configuring [user sign-in frequency](../conditional-access/howto-conditional-access-session-lifetime.md) to 12 hours. 

With NIST you can use compensating controls to confirm subscriber presence:

* Set session inactivity time out to 30 minutes: Lock the device at the operating system level with Microsoft System Center Configuration Manager, group policy objects (GPOs), or Intune. For the subscriber to unlock it, require local authentication.

* Time out regardless of activity: Run a scheduled task (Configuration Manager, GPO, or Intune) to lock the machine after 12 hours, regardless of activity.

## Man-in-the-middle resistance 

Communications between the claimant and Azure AD are over an authenticated, protected channel. This configuration provides resistance to man-in-the-middle (MitM) attacks and satisfies the MitM resistance requirements for AAL1, AAL2, and AAL3.

## Replay resistance

Azure AD authentication methods at AAL2 use nonce or challenges. The methods resist replay attacks because the verifier detects replayed authentication transactions. Such transactions won't contain needed nonce or timeliness data.

## Next steps 

[NIST overview](nist-overview.md)

[Learn about AALs](nist-about-authenticator-assurance-levels.md)

[Authentication basics](nist-authentication-basics.md)

[NIST authenticator types](nist-authenticator-types.md)

[Achieve NIST AAL1 with Azure AD](nist-authenticator-assurance-level-1.md)

[Achieve NIST AAL2 with Azure AD](nist-authenticator-assurance-level-2.md)

[Achieve NIST AAL3 with Azure AD](nist-authenticator-assurance-level-3.md)

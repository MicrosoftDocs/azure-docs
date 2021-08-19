---
title: Achieve NIST AAL2 with the Azure Active Directory
description: Guidance on achieving NIST authenticator assurance level 2 (AAL2) with Azure Active Directory.
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


# Achieve NIST authenticator assurance level 2 with Azure Active Directory

The National Institute of Standards and Technology (NIST) develops the technical requirements for US federal agencies that implement identity solutions. Meeting these requirements is also required for organizations working with federal agencies. 

Before you attempt to achieve authenticator assurance level 2 (AAL2), you might want to see the following resources:
* [NIST overview](nist-overview.md): Understand the different AAL levels.
* [Authentication basics](nist-authentication-basics.md): Important terminology and authentication types.
* [NIST authenticator types](nist-authenticator-types.md): Understand each of the authenticator types.
* [NIST AALs](nist-about-authenticator-assurance-levels.md): Covers the components of the AALs, and how Azure Active Directory (Azure AD) authentication methods map to them.

## Permitted authenticator types

The following table provides details about the authenticator types permitted for AAL2:

| Azure AD authentication method| NIST authenticator type | 
| - | - |
| **Recommended methods** |   | 
| Microsoft Authenticator app for iOS (Passwordless)<br>Windows Hello for Business with software trusted platform module (TPM) | Multifactor crypto software |
| FIDO 2 security key<br>Microsoft Authenticator app for Android (Passwordless)<br>Windows Hello for Business with hardware TPM<br>Smartcard (Active Directory Federation Services) | Multifactor crypto hardware |
| **Additional methods** |  |
| Password + Phone (SMS) | Memorized Secret + Out-of-Band |
| Password + Microsoft Authenticator App (OTP)<br>Password + SF OTP | Memorized Secret +  ‎Single-factor one-time password |
| Password + Azure AD joined with software TPM <br>Password + Compliant mobile device<br>Password + Hybrid Azure AD Joined with software TPM <br>Password + Microsoft Authenticator App (Notification) | Memorized Secret + ‎Single-factor crypto SW |
| Password + Azure AD joined with hardware TPM <br>Password + Hybrid Azure AD joined with hardware TPM | Memorized Secret + ‎Single-factor crypto hardware |


### Our recommendations

To achieve AAL2, use multifactor cryptographic hardware or software authenticators. Passwordless authentication eliminates the greatest attack surface (the password), and offers users a streamlined method to authenticate. 

For detailed guidance on selecting a passwordless authentication method, see [Plan a passwordless authentication deployment in Azure Active Directory](../authentication/howto-authentication-passwordless-deployment.md).

For more information on implementing Windows Hello for Business, see the [Windows Hello for Business deployment guide](/windows/security/identity-protection/hello-for-business/hello-deployment-guide).

## FIPS 140 validation

The following sections discuss achieving FIPS 140 validation.

### Verifier requirements

Azure AD uses the Windows FIPS 140 Level 1 overall validated cryptographic ‎module for all its authentication related cryptographic operations. It's therefore a FIPS 140 compliant verifier as required by government agencies.

### Authenticator requirements

The cryptographic authenticators of government agencies are required to be validated for FIPS 140 Level 1 overall. This isn't a requirement for non-governmental agencies. The following Azure AD authenticators meet the requirement when running on [Windows in a FIPS 140 approved mode of operation](/windows/security/threat-protection/fips-140-validation):

* Password

* Azure AD joined with software or with hardware TPM

* Hybrid Azure AD joined with software or with hardware TPM

* Windows Hello for Business with software or with hardware TPM

* Smartcard (Active Directory Federation Services) 

While the Microsoft Authenticator app in all its modes (notification, OTP and passwordless) uses FIPS 140 approved cryptography, it is not FIPS 140 Level 1 validated.

FIDO2 security key providers are in various stages of FIPS certification, including some that have completed validation. We recommend you review the [list of supported FIDO2 key vendors](../authentication/concept-authentication-passwordless.md#fido2-security-key-providers) and check with your provider for current FIPS validation status.


## Reauthentication 

At the AAL2 level, NIST requires reauthentication every 12 hours, regardless of user activity. Reauthentication is also required after any period of inactivity lasting 30 minutes or longer. Presentation of something you know or something you are is required, because the session secret is something you have.

To meet the requirement for reauthentication regardless of user activity, Microsoft recommends configuring [user sign-in frequency](../conditional-access/howto-conditional-access-session-lifetime.md) to 12 hours. 

NIST also allows the use of compensating controls for confirming the subscriber’s presence:

* You can set session inactivity timeout to 30 minutes by locking the device at the operating system level by using Microsoft System Center Configuration Manager, group policy objects (GPOs), or Intune. You must also require local authentication for the subscriber to unlock it.

* Timeout regardless of activity can be achieved by running a scheduled task (using Configuration Manager, GPO, or Intune) that locks the machine after 12 hours, regardless of activity.

## Man-in-the-middle resistance 

All communications between the claimant and Azure AD are performed over an authenticated, protected channel, to provide resistance to man-in-the-middle (MitM) attacks. This satisfies the MitM resistance requirements for AAL1, AAL2, and AAL3.

## Replay resistance

All Azure AD authentication methods at AAL2 use either nonce or challenges. The methods are resistant to replay attacks because the verifier easily detects replayed authentication transactions. Such transactions won't contain the appropriate nonce or timeliness data.

## Next steps 

[NIST overview](nist-overview.md)

[Learn about AALs](nist-about-authenticator-assurance-levels.md)

[Authentication basics](nist-authentication-basics.md)

[NIST authenticator types](nist-authenticator-types.md)

[Achieve NIST AAL1 with Azure AD](nist-authenticator-assurance-level-1.md)

[Achieve NIST AAL2 with Azure AD](nist-authenticator-assurance-level-2.md)

[Achieve NIST AAL3 with Azure AD](nist-authenticator-assurance-level-3.md)
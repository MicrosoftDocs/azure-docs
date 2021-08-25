---
title: NIST authenticator types and aligned Azure Active Directory methods
description: Explanations of how Azure Active Directory authentication methods align with NIST authenticator types.
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

# NIST authenticator types and aligned Azure Active Directory methods

The authentication process begins when a claimant asserts its control of one of more authenticators that are associated with a subscriber. The subscriber can be a person or another entity.

| The National Institute of Standards and Technology (NIST) authenticator type| Azure Active Directory (Azure AD) authentication methods |
| - | - |
|  Memorized secret <br> (something you know)|  Password (Cloud accounts)  <br>Password (Federated)<br> Password (Password Hash Sync)<br>Password (Passthrough Authentication) |
|Look-up secret <br> (something you have)| None. A lookup secret is by definition data not held in a system. |
|Out-of-band <br>(something you have)| Phone (SMS) - not recommended |
| Single-factor one-time password <br>‎(something you have)| Microsoft Authenticator App (One-time password)  <br>Single factor one-time password ‎(through OTP manufacturers)<sup data-htmlnode="">1</sup> | 
| Multifactor one-time password<br>(something you have + something you know or something you are)| Multifactor one-time password ‎(through OTP manufacturers) <sup data-htmlnode="">1</sup>| 
|Single-factor crypto software<br>(something you have)|Compliant mobile device <br> Microsoft Authenticator App (Notification) <br> Hybrid Azure AD joined<sup data-htmlnode="">2</sup> with software TPM<br> Azure AD joined<sup data-htmlnode="">2</sup> with software TPM |
| Single-factor crypto hardware <br>(something you have) | Azure AD joined<sup data-htmlnode="">2</sup> with hardware TPM <br> Hybrid Azure AD joined<sup data-htmlnode="">2</sup> with hardware TPM|
|Multifactor crypto software<br>(something you have + something you know or something you are) | Microsoft Authenticator app for iOS (Passwordless)<br> Windows Hello for Business with software TPM |
|Multifactor crypto hardware <br>(something you have + something you know or something you are) |Microsoft Authenticator app for Android (Passwordless)<br> Windows Hello for Business with hardware TPM<br> Smartcard (Federated identity provider) <br> FIDO 2 security key |


<sup data-htmlnode="">1</sup> OATH-TOTP SHA-1 tokens of the 30-second or 60-second variety.

<sup data-htmlnode="">2</sup> For more information on device join states, see [Azure AD device identity documentation](../devices/index.yml). 

## Why SMS isn't recommended 

SMS text messages meet the NIST standard, but NIST doesn't recommend them. The risks of device swap, SIM changes, number porting, and other behaviors can cause problems. If these actions are taken maliciously, they can result in an insecure experience. Although SMS text messages aren't recommended, they're better than using a password alone, because they require more effort for hackers. 

## Next steps 

[NIST overview](nist-overview.md)

[Learn about AALs](nist-about-authenticator-assurance-levels.md)

[Authentication basics](nist-authentication-basics.md)

[NIST authenticator types](nist-authenticator-types.md)

[Achieve NIST AAL1 with Azure AD](nist-authenticator-assurance-level-1.md)

[Achieve NIST AAL2 with Azure AD](nist-authenticator-assurance-level-2.md)

[Achieve NIST AAL3 with Azure AD](nist-authenticator-assurance-level-3.md)
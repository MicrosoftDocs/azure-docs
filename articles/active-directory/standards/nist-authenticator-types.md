---
title: NIST Authenticator Types and aligned Azure Active Directory  methods
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

# NIST Authenticator Types and aligned Azure Active Directory methods

The authentication process begins when a claimant asserts its control of one of more authenticators that are associated with a subscriber. The subscriber may be a person or another entity.

| NIST Authenticator Type| Azure AD Authentication Methods |
| - | - |
|  Memorized secret <br> (Something you know)|  Password (Cloud accounts)  <br>Password (Federated)<br> Password (Password Hash Sync)<br>Password (Passthrough Authentication) |
|Look-up secret <br> (Something you have)| None. A lookup secret is by definition data not held in a system. |
|Out-of-band <br>(Something you have)| Phone (SMS) - not recommended |
| Single-factor one-time password <br>‎(Something you have)| Microsoft Authenticator App (One-time password)  <br>Single factor one-time password ‎(through OTP manufacturers)<sup data-htmlnode="">1</sup> | 
| Multi-factor one-time password<br>(something you have + something you know or something you are)| Multi-factor one-time password ‎(through OTP manufacturers) <sup data-htmlnode="">1</sup>| 
|Single-factor crypto software<br>(Something you have)|Compliant mobile device <br> Microsoft Authenticator App (Notification) <br> Hybrid Azure AD Joined<sup data-htmlnode="">2</sup> *with software TPM*<br> Azure AD joined<sup data-htmlnode="">2</sup> *with software TPM* |
| Single-factor crypto hardware <br>(Something you have) | Azure AD joined<sup data-htmlnode="">2</sup> *with hardware TPM* <br> Hybrid Azure AD Joined<sup data-htmlnode="">2</sup> *with hardware TPM*|
|Multi-factor crypto software<br>(Something you have + something you know or something you are) | Microsoft Authenticator app for iOS (Passwordless)<br> Windows Hello for Business *with software TPM* |
|Multi-factor crypto hardware <br>(Something you have + something you know or something you are) |Microsoft Authenticator app for Android (Passwordless)<br> Windows Hello for Business *with hardware TPM*<br> Smartcard (Federated identity provider) <br> FIDO 2 security key |


<sup data-htmlnode="">1</sup> OATH-TOTP SHA-1 tokens of the 30-second or 60-second variety.

<sup data-htmlnode="">2</sup> For more information on device join states, see [Azure AD device identity documentation](https://docs.microsoft.com/azure/active-directory/devices/). 

## Why SMS isn't recommended 

SMS text messages meet the NIST standard, but NIST doesn't recommend them. The risks of device swap, SIM changes, number porting, and other behaviors can cause issues. If these actions are taken maliciously, they can result in an insecure experience. While they aren't recommended, they're better than using a password alone, as they require more effort for hackers. 

## Next Steps 

[NIST overview](nist-overview.md)

[Learn about AALs](nist-about-authenticator-assurance-levels.md)

[Authentication basics](nist-authentication-basics.md)

[NIST authenticator types](nist-authenticator-types.md)

[Achieving NIST AAL1 with Azure AD](nist-authenticator-assurance-level-1.md)

[Achieving NIST AAL2 with Azure AD](nist-authenticator-assurance-level-2.md)

[Achieving NIST AAL3 with Azure AD](nist-authenticator-assurance-level-3.md) 

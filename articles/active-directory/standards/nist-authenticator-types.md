---
title: NIST authenticator types and aligned Azure Active Directory methods
description: Explanations of how Azure Active Directory authentication methods align with NIST authenticator types.
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

# NIST authenticator types and aligned Azure Active Directory methods

The authentication process begins when a claimant asserts its control of one of more authenticators associated with a subscriber. The subscriber is a person or another entity. Use the following table to learn about National Institute of Standards and Technology (NIST) authenticator types and associated Azure Active Directory (Azure AD) authentication methods.

|NIST authenticator type| Azure AD authentication method|
| - | - |
|Memorized secret <br> (something you know)|  Password: Cloud accounts, federated, password hash sync, passthrough authentication|
|Look-up secret <br> (something you have)| None: A look-up secret is data not held in a system|
|Out-of-band <br>(something you have)| Phone (SMS): Not recommended |
|Single-factor one-time password (OTP) <br> (something you have)| Microsoft Authenticator App OTP <br> Single-factor OTP (OTP manufacturers) <sup data-htmlnode="">1</sup>| 
|Multi-factor OTP <br> (something you have, know, or are)| Multi-factor OTP (OTP manufacturers) <sup data-htmlnode="">1</sup>| 
|Single-factor crypto software <br> (something you have)|Compliant mobile device <br> Microsoft Authenticator App (notification) <br> Hybrid Azure AD joined <sup data-htmlnode="">2</sup> with software TPM <br> Azure AD joined <sup data-htmlnode="">2</sup> with software TPM |
|Single-factor crypto hardware <br> (something you have) | Azure AD joined <sup data-htmlnode="">2</sup> with hardware TPM <br> Hybrid Azure AD joined <sup data-htmlnode="">2</sup> with hardware TPM|
|Multi-factor crypto software <br> (something you have, know, or are) | Microsoft Authenticator app for iOS (passwordless) <br> Windows Hello for Business with software TPM |
|Multi-factor crypto hardware <br> (something you have, you know, or are) |Microsoft Authenticator app for Android (passwordless) <br> Windows Hello for Business with hardware TPM <br> Smartcard (Federated identity provider) <br> FIDO 2 security key|

<sup data-htmlnode="">1</sup> 30-second or 60-second OATH-TOTP SHA-1 token

<sup data-htmlnode="">2</sup> For more information on device join states, see [Azure AD device identity](../devices/index.yml)

## SMS isn't recommended 

SMS text messages meet the NIST standard, but NIST doesn't recommend them. The risks of device swap, SIM changes, number porting, and other behaviors can cause issues. If these actions are malicious, they can result in an insecure experience. Although SMS text messages aren't recommended, they're better than using only a password, because they require more effort for hackers. 

## Next steps 

[NIST overview](nist-overview.md)

[Learn about AALs](nist-about-authenticator-assurance-levels.md)

[Authentication basics](nist-authentication-basics.md)

[NIST authenticator types](nist-authenticator-types.md)

[Achieve NIST AAL1 with Azure AD](nist-authenticator-assurance-level-1.md)

[Achieve NIST AAL2 with Azure AD](nist-authenticator-assurance-level-2.md)

[Achieve NIST AAL3 with Azure AD](nist-authenticator-assurance-level-3.md)

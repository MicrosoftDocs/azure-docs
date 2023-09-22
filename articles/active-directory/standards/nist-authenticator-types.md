---
title: NIST authenticator types and aligned Microsoft Entra methods
description: Explanations of how Microsoft Entra authentication methods align with NIST authenticator types.
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

# NIST authenticator types and aligned Microsoft Entra methods

The authentication process begins when a claimant asserts its control of one of more authenticators associated with a subscriber. The subscriber is a person or another entity. Use the following table to learn about National Institute of Standards and Technology (NIST) authenticator types and associated Microsoft Entra authentication methods.

|NIST authenticator type| Microsoft Entra authentication method|
| - | - |
|Memorized secret <br> (something you know)|  Password: Cloud accounts, federated, password hash sync, passthrough authentication|
|Look-up secret <br> (something you have)| None|
|Single-factor out-of-band <br>(something you have)| Microsoft Authenticator App (Push Notification) <br> Phone (SMS): Not recommended |
Multi-factor Out-of-band <br> (something you have + something you know/are) | Microsoft Authenticator App (Passwordless) |
|Single-factor one-time password (OTP) <br> (something you have)| Microsoft Authenticator App (OTP) <br> Single-factor Hardware/Software OTP<sup data-htmlnode="">1</sup>|
|Multi-factor OTP <br> (something you have + something you know/are)| Treated as single-factor OTP| 
|Single-factor crypto software <br> (something you have)|Single-factor software certificate <br> Microsoft Entra joined <sup data-htmlnode="">2</sup> with software TPM <br> Microsoft Entra hybrid joined <sup data-htmlnode="">2</sup> with software TPM  <br> Compliant mobile device |
|Single-factor crypto hardware <br> (something you have) | Microsoft Entra joined <sup data-htmlnode="">2</sup> with hardware TPM <br> Microsoft Entra hybrid joined <sup data-htmlnode="">2</sup> with hardware TPM|
|Multi-factor crypto software <br> (something you have + something you know/are) | Multi-factor Software Certificate (PIN Protected) <br> Windows Hello for Business with software TPM |
|Multi-factor crypto hardware <br> (something you have + something you know/are) |Hardware protected certificate (smartcard/security key/TPM) <br> Windows Hello for Business with hardware TPM <br> FIDO 2 security key|

<sup data-htmlnode="">1</sup> 30-second or 60-second OATH-TOTP SHA-1 token

<sup data-htmlnode="">2</sup> For more information on device join states, see [Microsoft Entra device identity](../devices/index.yml)

## Public Switch Telephone Network (PSTN) SMS/Voice are not recommended

NIST does not recommend SMS or voice. The risks of device swap, SIM changes, number porting, and other behaviors can cause issues. If these actions are malicious, they can result in an insecure experience. Although SMS/Voice are not recommended, they are better than using only a password, because they require more effort for hackers.

## Next steps

[NIST overview](nist-overview.md)

[Learn about AALs](nist-about-authenticator-assurance-levels.md)

[Authentication basics](nist-authentication-basics.md)

[NIST authenticator types](nist-authenticator-types.md)

[Achieve NIST AAL1 with Microsoft Entra ID](nist-authenticator-assurance-level-1.md)

[Achieve NIST AAL2 with Microsoft Entra ID](nist-authenticator-assurance-level-2.md)

[Achieve NIST AAL3 with Microsoft Entra ID](nist-authenticator-assurance-level-3.md)

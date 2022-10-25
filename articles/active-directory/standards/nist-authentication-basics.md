---
title: NIST authentication basics and Azure Active Directory
description: This article defines important terminology and describes trusted platform modules and authentication factors for NIST.
services: active-directory 
ms.service: active-directory
ms.subservice: fundamentals
ms.workload: identity
ms.topic: how-to
author: gargi-sinha
ms.author: gasinh
manager: martinco
ms.reviewer: martinco
ms.date: 09/13/2022
ms.custom: it-pro
ms.collection: M365-identity-device-management
---

# NIST authentication basics 

To understand National Institute of Standards and Technology (NIST) guidelines, you need to know the terminology. You also need to understand Trusted Platform Module (TPM) technology and authentication factors. This article provides that information. 

## Terminology

The following terminology is used throughout these NIST articles.

|Term| Definition. *Italicized* terms are defined in this table.|
| - | - |
| Assertion| A statement from a *verifier* to a *relying party* that contains information about the *subscriber*. An assertion might contain verified attributes. |
|Authentication| The process of verifying the identity of a *subject*. |
| Authentication factor| Something you know, something you have, or something you are. Every *authenticator* has one or more authentication factors. |
| Authenticator| Something the *claimant* possesses and controls that's used to authenticate the *claimant’s* identity. |
| Claimant| A *subject* whose identity is to be verified via one or more *authentication* protocols. |
|Credential| An object or data structure that authoritatively binds an identity to at least one *authenticator* possessed and controlled by a *subscriber*. |
| Credential service provider (CSP)| A trusted entity that issues or registers *subscriber authenticators* and issues electronic *credentials* to *subscribers*. |
|Relying party| An entity that relies on a *verifier’s assertion* or a *claimant’s authenticators* and *credentials*, usually to grant access to a system. |
|  Subject| A person, organization, device, hardware, network, software, or service. |
| Subscriber| A party who has received a *credential* or *authenticator* from a *CSP*. |
|Trusted Platform Module  | A TPM is a tamper-resistant module that does cryptographic operations, including key generation. |
|  Verifier| An entity that verifies the *claimant’s* identity by verifying the claimant’s possession and control of *authenticators*. |


## About Trusted Platform Module technology

Trusted Platform Module technology is designed to provide hardware-based security-related functions. A TPM chip, or hardware TPM, is a secure cryptographic processor that helps you with actions like generating, storing, and limiting the use of cryptographic keys. 

Microsoft provides significant information on how TPMs work with Windows. For more information, see [Trusted Platform Module](/windows/security/information-protection/tpm/trusted-platform-module-top-node). 

A software TPM is an emulator that mimics hardware TPM functionality. 

 ## Authentication factors and their strengths

Authentication factors can be grouped into three categories:

![Graphic that provides examples of authentication factors, grouped by something you know, something you have, and something you are.](media/nist-authentication-basics/nist-authentication-basics-0.png)

The strength of an authentication factor is determined by how sure you can be that it's something that only the subscriber knows, has, or is.

NIST provides limited guidance about the relative strength of authentication factors. The rest of this section describes how we assess those strengths at Microsoft. 

**Something you know**. Passwords, the most common *something you know*, represent the largest attack surface. The following mitigations improve confidence in the affinity to the subscriber. They're effective at preventing password attacks like brute-force attacks, eavesdropping, and social engineering:

* [Password complexity requirements](https://www.microsoft.com/research/wp-content/uploads/2016/06/Microsoft_Password_Guidance-1.pdf)

* [Banned passwords](../authentication/tutorial-configure-custom-password-protection.md)

* [Leaked credentials identification](../identity-protection/overview-identity-protection.md)

* [Secure hashed storage](https://aka.ms/AADDataWhitepaper)

* [Account lockout](../authentication/howto-password-smart-lockout.md)

**Something you have**. The strength of *something you have* is based on how likely the subscriber is to keep it in possession and the difficulty for an attacker to gain access to it. For example, when you're trying to protect against internal threats, a personal mobile device or hardware key will have a higher affinity. So it will be more secure than a desktop computer in an office.

**Something you are**. The ease with which an attacker can obtain a copy of *something you are*, or spoof a biometric, matters. NIST is drafting a framework for biometrics. NIST currently won't accept biometrics as a separate authentication method. It must be a factor within multi-factor authentication. This precaution is in place because biometrics are probabilistic in nature. That is, they use algorithms that determine the likelihood of affinity. Biometrics don't necessarily provide an exact match, as passwords do. For more information, see [Strength of Function for Authenticators – Biometrics](https://pages.nist.gov/SOFA/SOFA.html) (SOFA-B). 

SOFA-B attempts to present a framework to quantify the strength of biometrics for:
- False match rate.
- False fail rate.
- Presentation attack detection error rate.
- Effort required to perform an attack. 

## ‎Single-factor authentication

You can implement single-factor authentication by using a single-factor authenticator that verifies *something you know* or *something you are*. A *something you are* factor is accepted as an authentication factor, but it's not accepted as an authenticator by itself. 

![Graphic that shows how single-factor authentication works.](media/nist-authentication-basics/nist-authentication-basics-1.png)

## Multifactor authentication

You can implement multifactor authentication either by using a multifactor authenticator or by using two single-factor authenticators. A multifactor authenticator requires two authentication factors to complete a single authentication transaction.

### Multifactor authentication by using two single-factor authenticators

Multifactor authentication requires two different authentication factors. These authenticators can be independent. For example: 

* Memorized secret (password) and out of band (SMS)

* Memorized secret (password) and one-time password (hardware or software)

These methods perform two independent authentication transactions with Azure Active Directory (Azure AD).

![Graphic that describes multifactor authentication via two separate authenticators.](media/nist-authentication-basics/nist-authentication-basics-2.png)


### Multifactor authentication by using a single multifactor authenticator

Multifactor factor authentication requires one authentication factor (*something you know* or *something you are*) to unlock a second authentication factor. The user experience is typically easier than that of multiple independent authenticators.

![Graphic that shows multifactor authentication by using a single multifactor authenticator.](media/nist-authentication-basics/nist-authentication-basics-3a.png)

One example is the Microsoft Authenticator app used in passwordless mode. With this method, the user attempts to access a secured resource (relying party), and receives a notification on the Authenticator app. The user responds to the notification by providing either a biometric (*something you are*) or a PIN (*something you know*). This factor unlocks the cryptographic key on the phone (*something you have*), which the verifier then validates.

## Next steps 

[NIST overview](nist-overview.md)

[Learn about AALs](nist-about-authenticator-assurance-levels.md)

[Authentication basics](nist-authentication-basics.md)

[NIST authenticator types](nist-authenticator-types.md)

[Achieving NIST AAL1 bu using Azure AD](nist-authenticator-assurance-level-1.md)

[Achieving NIST AAL2 by using Azure AD](nist-authenticator-assurance-level-2.md)

[Achieving NIST AAL3 by using Azure AD](nist-authenticator-assurance-level-3.md)

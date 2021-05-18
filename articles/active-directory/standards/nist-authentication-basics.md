---
title: NIST authentication basics and Azure Active Directory
description: Explanations of the terminology and authentication factors for NIST.
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

# NIST Authentication Basics 

Understanding the NIST guidelines requires that you have a firm grounding in the terminology, and the concepts of trusted platform modules (TPMs) and authentication factors.

## Terminology

The following terminology is used throughout these NIST-related articles.

|Term| Definition - *Italicized* terms are defined in this table|
| - | - |
| Assertion| A statement from a *verifier* to a *relying party* containing information about the *subscriber*. May contain verified attributes. |
|Authentication| The process of verifying the identity of a *subject*. |
| Authentication factor| Something you know, something you have, or something you are: Every *authenticator* has one or more authentication factors. |
| Authenticator| Something the *claimant* possesses and controls that is used to authenticate the *claimant’s* identity. |
| Claimant| A *subject* whose identity is to be verified using one or more authentication protocols. |
|Credential| An object or data structure that authoritatively binds an identity to at least one *authenticator* possessed and controlled by a *subscriber*. |
| Credential Service Provider (CSP)| A trusted entity that issues or registers *subscriber authenticators* and issues electronic *credentials* to *subscribers*. |
|Relying Party| An entity that relies on a *verifier’s assertion*, or a *claimant’s authenticators* and *credentials*, usually to grant access to a system. |
|  Subject| A person, organization, device, hardware, network, software, or service. |
| Subscriber| A party who has received a *credential* or *authenticator* from a *CSP*. |
|Trusted Platform Module (TPM)  | A TPM is a tamper resistant module that performs cryptographic operations including key generation. |
|  Verifier| An entity that verifies the *claimant’s* identity by verifying the claimant’s possession and control of *authenticators*. |


## About Trusted Platform Modules 

Trusted Platform Module (TPM) technology is designed to provide hardware-based, security-related functions. A TPM chip, or hardware TPM, is a secure crypto processor that helps you with actions such as generating, storing, and limiting the use of cryptographic keys. 

Microsoft provides significant information on how TPMs work with Microsoft Windows. For more information, see this article on the [Trusted Platform Module](https://docs.microsoft.com/windows/security/information-protection/tpm/trusted-platform-module-top-node). 

A software TPM is an emulator that mimics this functionality. 

 ## Authentication factors and their strengths

Authentication factors can be grouped into three categories. The following table presents example of the types of factors under each grouping.

![Pictorial representation of something you know, something you have, and something you are.](media/nist-authentication-basics/nist-authentication-basics-0.png)

The strength of an authentication factor is determined by how sure we can be that it is something that only the subscriber knows, has, or is.

There is limited guidance in NIST about the relative strength of authentication factors. Here at Microsoft, we assess the strengths as below. 

**Something you know**: Passwords, the most common something you know, represent the greatest attack surface. The following mitigations improve confidence in the affinity to the subscriber and are effective at preventing password attacks such as brute-force attacks, eavesdropping and social engineering:

* [Password complexity requirements](https://www.microsoft.com/research/wp-content/uploads/2016/06/Microsoft_Password_Guidance-1.pdf)

* [Banned passwords](https://docs.microsoft.com/azure/active-directory/authentication/tutorial-configure-custom-password-protection)

* [Leaked credentials identification](https://docs.microsoft.com/azure/active-directory/identity-protection/overview-identity-protection)

* [Secure hashed storage](https://aka.ms/AADDataWhitepaper)

* [Account lockout](https://docs.microsoft.com/azure/active-directory/authentication/howto-password-smart-lockout)

**Something you have**: The strength of something you have is based on how likely the subscriber is to keep it in possession, and the difficulty in an attacker gaining access to it. For example, a personal mobile device or hardware key will have a higher affinity, and therefore be more secure, than a desktop computer in an office when trying to protect against internal threat.

**Something you are**: The ease with which an attacker can obtain a copy of something you are, or spoof a biometric, matters. NIST is drafting a framework for biometrics. Today, NIST will not accept biometrics as a separate authentication method. It must be a factor within multi-factor authentication. This is since biometrics are probabilistic in nature. That is, they use algorithms that determine the likelihood that it is the same person. It is not necessarily an exact match, as a password is. See this document on the [Strength of Function for Authenticators – Biometrics](https://pages.nist.gov/SOFA/SOFA.html) (SOFA-B). SOFA-B attempts to present a framework to quantity biometrics’ strength in terms of false match rate, false, fail rate, presentation attack detection error rate, and effort required to launch an attack. 

## ‎Single-factor authentication

Single-factor authentication can be achieved by using a single-factor authenticator that constitutes something you know or something you are. While an authentication factor that is “something you are” is accepted as an authentication factor, it is not accepted as an authenticator by itself. 

![Conceptual image of single factor authentication.](media/nist-authentication-basics/nist-authentication-basics-1.png)

## Multi-factor authentication

Multi-factor authentication can be achieved by either a multi-factor authenticator or by a combination of two single-factor authenticators. A multi-factor authenticator requires two authentication factors to execute a single authentication transaction.

### Multi-factor authentication using two single-factor authenticators

Multi-factor authentication requires two different authentication factors. These can be two independent authenticators, such as 

* Memorized secret [password] and out of band [SMS]

* Memorized secret [password] and one-time password [hardware or software]

These methods perform two independent authentication transactions with Azure AD.

![Conceptual image of multi-factor authentication using two separate authenticators.](media/nist-authentication-basics/nist-authentication-basics-2.png)


### Multi-factor authentication using a single multi-factor authenticator

Multi-factor factor authentication requires one authentication factor (something you know or something you are) to unlock a second authentication factor. This is typically a simpler user experience than multiple independent authenticators.

![Conceptual image of multi-factor authentication a single multi-factor authenticator.](media/nist-authentication-basics/nist-authentication-basics-3a.png)

One example is the Microsoft Authenticator app used in the passwordless mode. With this method the user attempts to access a secured resource (relying party), and receives a notification on their authenticator app. The user responds to a notification by providing either a biometric (something you are) or a PIN (something you know), which then unlocks the cryptographic key on the phone (something you have) which is then validated by the verifier.

## Next Steps 

[NIST overview](nist-overview.md)

[Learn about AALs](nist-about-authenticator-assurance-levels.md)

[Authentication basics](nist-authentication-basics.md)

[NIST authenticator types](nist-authenticator-types.md)

[Achieving NIST AAL1 with Azure AD](nist-authenticator-assurance-level-1.md)

[Achieving NIST AAL2 with Azure AD](nist-authenticator-assurance-level-2.md)

[Achieving NIST AAL3 with Azure AD](nist-authenticator-assurance-level-3.md) 
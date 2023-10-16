---
title: Microsoft Entra PCI-DSS Multi-Factor Authentication guidance
description: Learn the authentication methods supported by Microsoft Entra ID to meet PCI MFA requirements
services: active-directory 
ms.service: active-directory
ms.subservice: standards
ms.workload: identity
ms.topic: how-to
author: jricketts
ms.author: jricketts
manager: martinco
ms.reviewer: martinco
ms.date: 04/18/2023
ms.custom: it-pro
ms.collection: 
---

# Microsoft Entra PCI-DSS Multi-Factor Authentication guidance 
**Information Supplement: Multi-Factor Authentication v 1.0**

Use the following table of authentication methods supported by Microsoft Entra ID to meet requirements in the PCI Security Standards Council [Information Supplement, Multi-Factor Authentication v 1.0](https://listings.pcisecuritystandards.org/pdfs/Multi-Factor-Authentication-Guidance-v1.pdf).

|Method|To meet requirements|Protection|MFA element|
|-|-|-|-|
|[Passwordless phone sign in with Microsoft Authenticator](../authentication/howto-authentication-passwordless-phone.md)|Something you have (device with a key), something you know or are (PIN or biometric) </br> In iOS, Authenticator Secure Element (SE) stores the key in Keychain. [Apple Platform Security, Keychain data protection](https://support.apple.com/guide/security/keychain-data-protection-secb0694df1a/web) </br> In Android, Authenticator uses Trusted Execution Engine (TEE) by storing the key in Keystore. [Developers, Android Keystore system](https://developer.android.com/training/articles/keystore) </br> When users authenticate using Microsoft Authenticator, Microsoft Entra ID generates a random number the user enters in the app. This action fulfills the out-of-band authentication requirement. |Customers configure device protection policies to mitigate device compromise risk. For instance, Microsoft Intune compliance policies. |Users unlock the key with the gesture, then Microsoft Entra ID validates the authentication method. |
|[Windows Hello for Business Deployment Prerequisite Overview](/windows/security/identity-protection/hello-for-business/hello-identity-verification) |Something you have (Windows device with a key), and something you know or are (PIN or biometric). </br> Keys are stored with device Trusted Platform Module (TPM). Customers use devices with hardware TPM 2.0 or later to meet the authentication method independence and out-of-band requirements. </br> [Certified Authenticator Levels](https://fidoalliance.org/certification/authenticator-certification-levels/)|Configure device protection policies to mitigate device compromise risk. For instance, Microsoft Intune compliance policies. |Users unlock the key with the gesture for Windows device sign in.|
|[Enable passwordless security key sign-in, Enable FIDO2 security key method](../authentication/howto-authentication-passwordless-security-key.md)|Something that you have (FIDO2 security key) and something you know or are (PIN or biometric). </br> Keys are stored with hardware cryptographic features. Customers use FIDO2 keys, at least Authentication Certification Level 2 (L2) to meet the authentication method independence and out-of-band requirement.|Procure hardware with protection against tampering and compromise.|Users unlock the key with the gesture, then Microsoft Entra ID validates the credential.  |
|[Overview of Microsoft Entra certificate-based authentication](../authentication/concept-certificate-based-authentication.md)|Something you have (smart card) and something you know (PIN). </br> Physical smart cards or virtual smartcards stored in TPM 2.0 or later, are a Secure Element (SE). This action meets the authentication method independence and out-of-band requirement.|Procure smart cards with protection against tampering and compromise.|Users unlock the certificate private key with the gesture, or PIN, then Microsoft Entra ID validates the credential. |

## Next steps

PCI-DSS requirements **3**, **4**, **9**, and **12** aren't applicable to Microsoft Entra ID, therefore there are no corresponding articles. To see all requirements, go to pcisecuritystandards.org: [Official PCI Security Standards Council Site](https://docs-prv.pcisecuritystandards.org/PCI%20DSS/Standard/PCI-DSS-v4_0.pdf).

To configure Microsoft Entra ID to comply with PCI-DSS, see the following articles. 

* [Microsoft Entra PCI-DSS guidance](pci-dss-guidance.md) 
* [Requirement 1: Install and Maintain Network Security Controls](pci-requirement-1.md)
* [Requirement 2: Apply Secure Configurations to All System Components](pci-requirement-2.md)
* [Requirement 5: Protect All Systems and Networks from Malicious Software](pci-requirement-5.md)
* [Requirement 6: Develop and Maintain Secure Systems and Software](pci-requirement-6.md)
* [Requirement 7: Restrict Access to System Components and Cardholder Data by Business Need to Know](pci-requirement-7.md)
* [Requirement 8: Identify Users and Authenticate Access to System Components](pci-requirement-8.md)
* [Requirement 10: Log and Monitor All Access to System Components and Cardholder Data](pci-requirement-10.md)
* [Requirement 11: Test Security of Systems and Networks Regularly](pci-requirement-11.md)
* [Microsoft Entra PCI-DSS Multi-Factor Authentication guidance](pci-dss-mfa.md) (You're here)

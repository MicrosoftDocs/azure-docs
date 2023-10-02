---
title: Microsoft Entra ID and PCI-DSS Requirement 5
description: Learn PCI-DSS defined approach requirements for protecting all systems and networks from malicious software
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

# Microsoft Entra ID and PCI-DSS Requirement 5

**Requirement 5: Protect All Systems and Networks from Malicious Software**
</br>**Defined approach requirements**

## 5.1 Processes and mechanisms for protecting all systems and networks from malicious software are defined and understood.

|PCI-DSS Defined approach requirements|Microsoft Entra guidance and recommendations|
|-|-|
|**5.1.1** All security policies and operational procedures that are identified in Requirement 5 are: </br> Documented </br> Kept up to date </br> In use </br> Known to all affected parties|Use the guidance and links herein to produce the documentation to fulfill requirements based on your environment configuration.|
|**5.1.2** Roles and responsibilities for performing activities in Requirement 5 are documented, assigned, and understood.|Use the guidance and links herein to produce the documentation to fulfill requirements based on your environment configuration.|

## 5.2 Malicious software (malware) is prevented, or detected and addressed.

|PCI-DSS Defined approach requirements|Microsoft Entra guidance and recommendations|
|-|-|
|**5.2.1** An anti-malware solution(s) is deployed on all system components, except for those system components identified in periodic evaluations per Requirement 5.2.3 that concludes the system components aren't at risk from malware.|Deploy Conditional Access policies that require device compliance. [Use compliance policies to set rules for devices you manage with Intune](/mem/intune/protect/device-compliance-get-started) </br> Integrate device compliance state with anti-malware solutions. [Enforce compliance for Microsoft Defender for Endpoint with Conditional Access in Intune](/mem/intune/protect/advanced-threat-protection) </br> [Mobile Threat Defense integration with Intune](/mem/intune/protect/mobile-threat-defense)|
|**5.2.2** The deployed anti-malware solution(s): </br> Detects all known types of malware. Removes, blocks, or contains all known types of malware.|Not applicable to Microsoft Entra ID.|
|**5.2.3** Any system components that aren't at risk for malware are evaluated periodically to include the following: </br> A documented list of all system components not at risk for malware. </br> Identification and evaluation of evolving malware threats for those system components. </br> Confirmation whether such system components continue to not require anti-malware protection.|Not applicable to Microsoft Entra ID.|
|**5.2.3.1** The frequency of periodic evaluations of system components identified as not at risk for malware is defined in the entity’s targeted risk analysis, which is performed according to all elements specified in Requirement 12.3.1.|Not applicable to Microsoft Entra ID.|

## 5.3 Anti-malware mechanisms and processes are active, maintained, and monitored.

|PCI-DSS Defined approach requirements|Microsoft Entra guidance and recommendations|
|-|-|
|**5.3.1** The anti-malware solution(s) is kept current via automatic updates.|Not applicable to Microsoft Entra ID.|
|**5.3.2** The anti-malware solution(s): </br> Performs periodic scans and active or real-time scans.</br> OR </br> Performs continuous behavioral analysis of systems or processes.|Not applicable to Microsoft Entra ID.|
|**5.3.2.1** If periodic malware scans are performed to meet Requirement 5.3.2, the frequency of scans is defined in the entity’s targeted risk analysis, which is performed according to all elements specified in Requirement 12.3.1.|Not applicable to Microsoft Entra ID.|
|**5.3.3** For removable electronic media, the anti-malware solution(s): </br> Performs automatic scans of when the media is inserted, connected, or logically mounted, </br> OR </br> Performs continuous behavioral analysis of systems or processes when the media is inserted, connected, or logically mounted.|Not applicable to Microsoft Entra ID.|
|**5.3.4** Audit logs for the anti-malware solution(s) are enabled and retained in accordance with Requirement 10.5.1.|Not applicable to Microsoft Entra ID.|
|**5.3.5** Anti-malware mechanisms can't be disabled or altered by users, unless specifically documented, and authorized by management on a case-by-case basis for a limited time period.|Not applicable to Microsoft Entra ID.|

## 5.4 Anti-phishing mechanisms protect users against phishing attacks.

|PCI-DSS Defined approach requirements|Microsoft Entra guidance and recommendations|
|-|-|
|**5.4.1** Processes and automated mechanisms are in place to detect and protect personnel against phishing attacks.|Configure Microsoft Entra ID to use phishing-resistant credentials. [Implementation considerations for phishing-resistant MFA](memo-22-09-multi-factor-authentication.md) </br> Use controls in Conditional Access to require authentication with phishing-resistant credentials. [Conditional Access authentication strength](../authentication/concept-authentication-strengths.md) </br> Guidance herein relates to identity and access management configuration. To mitigate phishing attacks, deploy workload capabilities, such as in Microsoft 365. [Anti-phishing protection in Microsoft 365](/microsoft-365/security/office-365-security/anti-phishing-protection-about?view=o365-worldwide&preserve-view=true)|

## Next steps

PCI-DSS requirements **3**, **4**, **9**, and **12** aren't applicable to Microsoft Entra ID, therefore there are no corresponding articles. To see all requirements, go to pcisecuritystandards.org: [Official PCI Security Standards Council Site](https://docs-prv.pcisecuritystandards.org/PCI%20DSS/Standard/PCI-DSS-v4_0.pdf).

To configure Microsoft Entra ID to comply with PCI-DSS, see the following articles. 

* [Microsoft Entra PCI-DSS guidance](pci-dss-guidance.md) 
* [Requirement 1: Install and Maintain Network Security Controls](pci-requirement-1.md) 
* [Requirement 2: Apply Secure Configurations to All System Components](pci-requirement-2.md)
* [Requirement 5: Protect All Systems and Networks from Malicious Software](pci-requirement-5.md) (You're here)
* [Requirement 6: Develop and Maintain Secure Systems and Software](pci-requirement-6.md)
* [Requirement 7: Restrict Access to System Components and Cardholder Data by Business Need to Know](pci-requirement-7.md)
* [Requirement 8: Identify Users and Authenticate Access to System Components](pci-requirement-8.md)
* [Requirement 10: Log and Monitor All Access to System Components and Cardholder Data](pci-requirement-10.md)
* [Requirement 11: Test Security of Systems and Networks Regularly](pci-requirement-11.md)
* [Microsoft Entra PCI-DSS Multi-Factor Authentication guidance](pci-dss-mfa.md)

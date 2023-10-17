---
title: Microsoft Entra ID and PCI-DSS Requirement 2
description: Learn PCI-DSS defined approach requirements for applying secure configurations to all system components
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

# Microsoft Entra ID and PCI-DSS Requirement 2

**Requirement 2: Apply Secure Configurations to All System Components**
</br> **Defined approach requirements**

## 2.1 Processes and mechanisms for applying secure configurations to all system components are defined and understood.

|PCI-DSS Defined approach requirements|Microsoft Entra guidance and recommendations|
|-|-|
|**2.1.1** All security policies and operational procedures that are identified in Requirement 2 are: </br> Documented </br> Kept up to date </br> In use</br>  Known to all affected parties|Use the guidance and links herein to produce the documentation to fulfill requirements based on your environment configuration.|
|**2.1.2** Roles and responsibilities for performing activities in Requirement 2 are documented, assigned, and understood.|Use the guidance and links herein to produce the documentation to fulfill requirements based on your environment configuration.|

## 2.2 System components are configured and managed securely.

|PCI-DSS Defined approach requirements|Microsoft Entra guidance and recommendations|
|-|-|
|**2.2.1** Configuration standards are developed, implemented, and maintained to: </br> Cover all system components. </br> Address all known security vulnerabilities.</br> Be consistent with industry-accepted system hardening standards or vendor hardening recommendations. </br> Be updated as new vulnerability issues are identified, as defined in Requirement 6.3.1. </br> Be applied when new systems are configured and verified as in place before or immediately after a system component is connected to a production environment.|See, [Microsoft Entra security operations guide](../architecture/security-operations-introduction.md)|
|**2.2.2** Vendor default accounts are managed as follows: </br> If the vendor default account(s) will be used, the default password is changed per Requirement 8.3.6. </br> If the vendor default account(s) will not be used, the account is removed or disabled.|Not applicable to Microsoft Entra ID.|
|**2.2.3** Primary functions requiring different security levels are managed as follows: </br> Only one primary function exists on a system component, </br> OR </br> Primary functions with differing security levels that exist on the same system component are isolated from each other,</br> OR </br> Primary functions with differing security levels on the same system component are all secured to the level required by the function with the highest security need.|Learn about determining least-privileged roles. [Least privileged roles by task in Microsoft Entra ID](../roles/delegate-by-task.md)|
|**2.2.4** Only necessary services, protocols, daemons, and functions are enabled, and all unnecessary functionality is removed or disabled.|Review Microsoft Entra settings and disable unused features. [Five steps to securing your identity infrastructure](../../security/fundamentals/steps-secure-identity.md) </br> [Microsoft Entra security operations guide](../architecture/security-operations-introduction.md)|
|**2.2.5** If any insecure services, protocols, or daemons are present: </br> Business justification is documented. </br> Additional security features are documented and implemented that reduce the risk of using insecure services, protocols, or daemons.|Review Microsoft Entra settings and disable unused features. [Five steps to securing your identity infrastructure](../../security/fundamentals/steps-secure-identity.md) </br> [Microsoft Entra security operations guide](../architecture/security-operations-introduction.md)|
|**2.2.6** System security parameters are configured to prevent misuse.|Review Microsoft Entra settings and disable unused features. [Five steps to securing your identity infrastructure](../../security/fundamentals/steps-secure-identity.md) </br> [Microsoft Entra security operations guide](../architecture/security-operations-introduction.md)|
|**2.2.7** All nonconsole administrative access is encrypted using strong cryptography.|Microsoft Entra ID interfaces, such the management portal, Microsoft Graph, and PowerShell, are encrypted in transit using TLS. [Enable support for TLS 1.2 in your environment for Microsoft Entra TLS 1.1 and 1.0 deprecation](/troubleshoot/azure/active-directory/enable-support-tls-environment?tabs=azure-monitor)|

## 2.3 Wireless environments are configured and managed securely.

|PCI-DSS Defined approach requirements|Microsoft Entra guidance and recommendations|
|-|-|
|**2.3.1** For wireless environments connected to the CDE or transmitting account data, all wireless vendor defaults are changed at installation or are confirmed to be secure, including but not limited to: </br> Default wireless encryption keys </br> Passwords on wireless access points </br> SNMP defaults </br> Any other security-related wireless vendor defaults|If your organization integrates network access points with Microsoft Entra ID for authentication, see [Requirement 1: Install and Maintain Network Security Controls](pci-requirement-1.md).|
|**2.3.2** For wireless environments connected to the CDE or transmitting account data, wireless encryption keys are changed as follows: </br> Whenever personnel with knowledge of the key leave the company or the role for which the knowledge was necessary. </br> Whenever a key is suspected of or known to be compromised.|Not applicable to Microsoft Entra ID.|

## Next steps

PCI-DSS requirements **3**, **4**, **9**, and **12** aren't applicable to Microsoft Entra ID, therefore there are no corresponding articles. To see all requirements, go to pcisecuritystandards.org: [Official PCI Security Standards Council Site](https://docs-prv.pcisecuritystandards.org/PCI%20DSS/Standard/PCI-DSS-v4_0.pdf).

To configure Microsoft Entra ID to comply with PCI-DSS, see the following articles. 

* [Microsoft Entra PCI-DSS guidance](pci-dss-guidance.md) 
* [Requirement 1: Install and Maintain Network Security Controls](pci-requirement-1.md) 
* [Requirement 2: Apply Secure Configurations to All System Components](pci-requirement-2.md) (You're here)
* [Requirement 5: Protect All Systems and Networks from Malicious Software](pci-requirement-5.md)
* [Requirement 6: Develop and Maintain Secure Systems and Software](pci-requirement-6.md)
* [Requirement 7: Restrict Access to System Components and Cardholder Data by Business Need to Know](pci-requirement-7.md)
* [Requirement 8: Identify Users and Authenticate Access to System Components](pci-requirement-8.md)
* [Requirement 10: Log and Monitor All Access to System Components and Cardholder Data](pci-requirement-10.md)
* [Requirement 11: Test Security of Systems and Networks Regularly](pci-requirement-11.md)
* [Microsoft Entra PCI-DSS Multi-Factor Authentication guidance](pci-dss-mfa.md)

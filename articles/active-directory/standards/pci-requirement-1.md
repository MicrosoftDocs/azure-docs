---
title: Microsoft Entra ID and PCI-DSS Requirement 1
description: Learn PCI-DSS defined approach requirements for installing and maintaining network security controls
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

# Microsoft Entra ID and PCI-DSS Requirement 1

**Requirement 1: Install and Maintain Network Security Controls**
</br> **Defined approach requirements**

## 1.1 Processes and mechanisms for installing and maintaining network security controls are defined and understood.

|PCI-DSS Defined approach requirements|Microsoft Entra guidance and recommendations|
|-|-|
|**1.1.1** All security policies and operational procedures that are identified in Requirement 1 are: </br> Documented </br> Kept up to date </br> In use </br> Known to all affected parties|Use the guidance and links herein to produce the documentation to fulfill requirements based on your environment configuration.|
|**1.1.2** Roles and responsibilities for performing activities in Requirement 1 are documented, assigned, and understood|Use the guidance and links herein to produce the documentation to fulfill requirements based on your environment configuration.|

## 1.2 Network security controls (NSCs) are configured and maintained.

|PCI-DSS Defined approach requirements|Microsoft Entra guidance and recommendations|
|-|-|
|**1.2.1** Configuration standards for NSC rulesets are: </br> Defined </br> Implemented </br> Maintained|Integrate access technologies such as VPN, remote desktop, and network access points with Microsoft Entra ID for authentication and authorization, if the access technologies support modern authentication. Ensure NSC standards, which pertain to identity-related controls, include definition of Conditional Access policies, application assignment, access reviews, group management, credential policies, etc. [Microsoft Entra operations reference guide](../architecture/ops-guide-intro.md)|
|**1.2.2** All changes to network connections and to configurations of NSCs are approved and managed in accordance with the change control process defined at Requirement 6.5.1|Not applicable to Microsoft Entra ID.|
|**1.2.3** An accurate network diagram(s) is maintained that shows all connections between the cardholder data environment (CDE) and other networks, including any wireless networks.|Not applicable to Microsoft Entra ID.|
|**1.2.4** An accurate data-flow diagram(s) is maintained that meets the following: </br> Shows all account data flows across systems and networks. </br> Updated as needed upon changes to the environment.|Not applicable to Microsoft Entra ID.|
|**1.2.5** All services, protocols, and ports allowed are identified, approved, and have a defined business need|Not applicable to Microsoft Entra ID.|
|**1.2.6** Security features are defined and implemented for all services, protocols, and ports in use and considered insecure, such that risk is mitigated.|Not applicable to Microsoft Entra ID.|
|**1.2.7** Configurations of NSCs are reviewed at least once every six months to confirm they're relevant and effective.|Use Microsoft Entra access reviews to automate group-membership reviews and applications, such as VPN appliances, which align to network security controls in your CDE. [What are access reviews?](../governance/access-reviews-overview.md)|
|**1.2.8** Configuration files for NSCs are: </br> Secured from unauthorized access </br> Kept consistent with active network configurations|Not applicable to Microsoft Entra ID.|

## 1.3 Network access to and from the cardholder data environment is restricted.    

|PCI-DSS Defined approach requirements|Microsoft Entra guidance and recommendations|
|-|-|
|**1.3.1** Inbound traffic to the CDE is restricted as follows: </br> To only traffic that is necessary. </br> All other traffic is specifically denied|Use Microsoft Entra ID to configure named locations to create Conditional Access policies. Calculate user and sign-in risk. Microsoft recommends customers populate and maintain the CDE IP addresses using network locations. Use them to define Conditional Access policy requirements. [Using the location condition in a Conditional Access policy](../conditional-access/location-condition.md)|
|**1.3.2** Outbound traffic from the CDE is restricted as follows: </br> To only traffic that is necessary. </br> All other traffic is specifically denied|For NSC design, include Conditional Access policies for applications to allow access to CDE IP addresses. </br> Emergency access or remote access to establish connectivity to CDE, such as virtual private network (VPN) appliances, captive portals, might need policies to prevent unintended lockout. [Using the location condition in a Conditional Access policy](../conditional-access/location-condition.md) </br> [Manage emergency access accounts in Microsoft Entra ID](../roles/security-emergency-access.md)|
|**1.3.3** NSCs are installed between all wireless networks and the CDE, regardless of whether the wireless network is a CDE, such that: </br> All wireless traffic from wireless networks into the CDE is denied by default. </br> Only wireless traffic with an authorized business purpose is allowed into the CDE.|For NSC design, include Conditional Access policies for applications to allow access to CDE IP addresses. </br> Emergency access or remote access to establish connectivity to CDE, such as virtual private network (VPN) appliances, captive portals, might need policies to prevent unintended lockout. [Using the location condition in a Conditional Access policy](../conditional-access/location-condition.md) </br> [Manage emergency access accounts in Microsoft Entra ID](../roles/security-emergency-access.md)|

## 1.4 Network connections between trusted and untrusted networks are controlled.

|PCI-DSS Defined approach requirements|Microsoft Entra guidance and recommendations|
|-|-|
|**1.4.1** NSCs are implemented between trusted and untrusted networks.|Not applicable to Microsoft Entra ID.|
|**1.4.2** Inbound traffic from untrusted networks to trusted networks is restricted to: </br> Communications with system components that are authorized to provide publicly accessible services, protocols, and ports. </br> Stateful responses to communications initiated by system components in a trusted network. </br> All other traffic is denied.|Not applicable to Microsoft Entra ID.|
|**1.4.3** Anti-spoofing measures are implemented to detect and block forged source IP addresses from entering the trusted network.|Not applicable to Microsoft Entra ID.|
|**1.4.4** System components that store cardholder data are not directly accessible from untrusted networks.|In addition to controls in the networking layer, applications in the CDE using Microsoft Entra ID can use Conditional Access policies. Restrict access to applications based on location. [Using the location condition in a Conditional Access policy](../conditional-access/location-condition.md)|
|**1.4.5** The disclosure of internal IP addresses and routing information is limited to only authorized parties.|Not applicable to Microsoft Entra ID.|

## 1.5 Risks to the CDE from computing devices that are able to connect to both untrusted networks and the CDE are mitigated.

|PCI-DSS Defined approach requirements|Microsoft Entra guidance and recommendations|
|-|-|
|**1.5.1** Security controls are implemented on any computing devices, including company- and employee-owned devices, that connect to both untrusted networks (including the Internet) and the CDE as follows: </br> Specific configuration settings are defined to prevent threats being introduced into the entity’s network. </br> Security controls are actively running. </br> Security controls are not alterable by users of the computing devices unless specifically documented and authorized by management on a case-by-case basis for a limited period.| Deploy Conditional Access policies that require device compliance. [Use compliance policies to set rules for devices you manage with Intune](/mem/intune/protect/device-compliance-get-started) </br> Integrate device compliance state with anti-malware solutions. [Enforce compliance for Microsoft Defender for Endpoint with Conditional Access in Intune](/mem/intune/protect/advanced-threat-protection) </br> [Mobile Threat Defense integration with Intune](/mem/intune/protect/mobile-threat-defense)|

## Next steps

PCI-DSS requirements **3**, **4**, **9**, and **12** aren't applicable to Microsoft Entra ID, therefore there are no corresponding articles. To see all requirements, go to pcisecuritystandards.org: [Official PCI Security Standards Council Site](https://docs-prv.pcisecuritystandards.org/PCI%20DSS/Standard/PCI-DSS-v4_0.pdf).

To configure Microsoft Entra ID to comply with PCI-DSS, see the following articles. 

* [Microsoft Entra PCI-DSS guidance](pci-dss-guidance.md) 
* [Requirement 1: Install and Maintain Network Security Controls](pci-requirement-1.md) (You're here)
* [Requirement 2: Apply Secure Configurations to All System Components](pci-requirement-2.md)
* [Requirement 5: Protect All Systems and Networks from Malicious Software](pci-requirement-5.md)
* [Requirement 6: Develop and Maintain Secure Systems and Software](pci-requirement-6.md)
* [Requirement 7: Restrict Access to System Components and Cardholder Data by Business Need to Know](pci-requirement-7.md)
* [Requirement 8: Identify Users and Authenticate Access to System Components](pci-requirement-8.md)
* [Requirement 10: Log and Monitor All Access to System Components and Cardholder Data](pci-requirement-10.md)
* [Requirement 11: Test Security of Systems and Networks Regularly](pci-requirement-11.md)
* [Microsoft Entra PCI-DSS Multi-Factor Authentication guidance](pci-dss-mfa.md)

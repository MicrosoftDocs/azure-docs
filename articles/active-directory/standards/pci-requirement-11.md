---
title: Microsoft Entra ID and PCI-DSS Requirement 11
description: Learn PCI-DSS defined approach requirements for regular testing of security and network security
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

# Microsoft Entra ID and PCI-DSS Requirement 11

**Requirement 11: Test Security of Systems and Networks Regularly**
</br>**Defined approach requirements**

## 11.1 Processes and mechanisms for regularly testing security of systems and networks are defined and understood.

|PCI-DSS Defined approach requirements|Microsoft Entra guidance and recommendations|
|-|-|
|**11.1.1** All security policies and operational procedures that are identified in Requirement 11 are: </br> Documented </br> Kept up to date </br> In use </br> Known to all affected parties|Use the guidance and links herein to produce the documentation to fulfill requirements based on your environment configuration.|
|**11.1.2** Roles and responsibilities for performing activities in Requirement 11 are documented, assigned, and understood.|Use the guidance and links herein to produce the documentation to fulfill requirements based on your environment configuration.|

## 11.2 Wireless access points are identified and monitored, and unauthorized wireless access points are addressed.

|PCI-DSS Defined approach requirements|Microsoft Entra guidance and recommendations|
|-|-|
|**11.2.1** Authorized and unauthorized wireless access points are managed as follows: </br> The presence of wireless (Wi-Fi) access points is tested for. </br> All authorized and unauthorized wireless access points are detected and identified. </br> Testing, detection, and identification occurs at least once every three months. </br> If automated monitoring is used, personnel are notified via generated alerts.|If your organization integrates network access points with Microsoft Entra ID for authentication, see [Requirement 1: Install and Maintain Network Security Controls](pci-requirement-1.md)|
|**11.2.2** An inventory of authorized wireless access points is maintained, including a documented business justification.|Not applicable to Microsoft Entra ID.|

## 11.3 External and internal vulnerabilities are regularly identified, prioritized, and addressed.

|PCI-DSS Defined approach requirements|Microsoft Entra guidance and recommendations|
|-|-|
|**11.3.1** Internal vulnerability scans are performed as follows: </br> At least once every three months. </br> High-risk and critical vulnerabilities (per the entity’s vulnerability risk rankings defined at Requirement 6.3.1) are resolved. </br> Rescans are performed that confirm all high-risk and critical vulnerabilities (as noted) have been resolved. </br> Scan tool is kept up to date with latest vulnerability information. </br> Scans are performed by qualified personnel and organizational independence of the tester exists.|Include servers that support Microsoft Entra hybrid capabilities. For example, Microsoft Entra Connect, Application proxy connectors, etc. as part of internal vulnerability scans. </br> Organizations using federated authentication: review and address federation system infrastructure vulnerabilities. [What is federation with Microsoft Entra ID?](../hybrid/connect/whatis-fed.md) </br> Review and mitigate risk detections reported by Microsoft Entra ID Protection.  Integrate the signals with a SIEM solution to integrate more with remediation workflows or automation. [Risk types and detection](../identity-protection/concept-identity-protection-risks.md) </br> Run the Microsoft Entra assessment tool regularly and address findings. [`AzureADAssessment`](https://github.com/AzureAD/AzureADAssessment) </br> [Security operations for infrastructure](../architecture/security-operations-infrastructure.md) </br> [Integrate Microsoft Entra logs with Azure Monitor logs](../reports-monitoring/howto-integrate-activity-logs-with-azure-monitor-logs.md)|
|**11.3.1.1** All other applicable vulnerabilities (those not ranked as high-risk or critical per the entity’s vulnerability risk rankings defined at Requirement 6.3.1) are managed as follows: </br> Addressed based on the risk defined in the entity’s targeted risk analysis, which is performed according to all elements specified in Requirement 12.3.1. </br> Rescans are conducted as needed.|Include servers that support Microsoft Entra hybrid capabilities. For example, Microsoft Entra Connect, Application proxy connectors, etc. as part of internal vulnerability scans. </br> Organizations using federated authentication: review and address federation system infrastructure vulnerabilities. [What is federation with Microsoft Entra ID?](../hybrid/connect/whatis-fed.md) </br> Review and mitigate risk detections reported by Microsoft Entra ID Protection.  Integrate the signals with a SIEM solution to integrate more with remediation workflows or automation. [Risk types and detection](../identity-protection/concept-identity-protection-risks.md) </br> Run the Microsoft Entra assessment tool regularly and address findings. [`AzureAD/AzureADAssessment`](https://github.com/AzureAD/AzureADAssessment) </br> [Security operations for infrastructure](../architecture/security-operations-infrastructure.md) </br> [Integrate Microsoft Entra logs with Azure Monitor logs](../reports-monitoring/howto-integrate-activity-logs-with-azure-monitor-logs.md)|
|**11.3.1.2** Internal vulnerability scans are performed via authenticated scanning as follows: </br> Systems that are unable to accept credentials for authenticated scanning are documented. </br> Sufficient privileges are used for those systems that accept credentials for scanning. </br> If accounts used for authenticated scanning can be used for interactive login, they're managed in accordance with Requirement 8.2.2.|Include servers that support Microsoft Entra hybrid capabilities. For example, Microsoft Entra Connect, Application proxy connectors, etc. as part of internal vulnerability scans. </br> Organizations using federated authentication: review and address federation system infrastructure vulnerabilities. [What is federation with Microsoft Entra ID?](../hybrid/connect/whatis-fed.md) </br> Review and mitigate risk detections reported by Microsoft Entra ID Protection. Integrate the signals with a SIEM solution to integrate more with remediation workflows or automation. [Risk types and detection](../identity-protection/concept-identity-protection-risks.md) </br> Run the Microsoft Entra assessment tool regularly and address findings. [`AzureADAssessment`](https://github.com/AzureAD/AzureADAssessment) </br> [Security operations for infrastructure](../architecture/security-operations-infrastructure.md) </br> [Integrate Microsoft Entra logs with Azure Monitor logs](../reports-monitoring/howto-integrate-activity-logs-with-azure-monitor-logs.md)|
|**11.3.1.3** Internal vulnerability scans are performed after any significant change as follows: </br> High-risk and critical vulnerabilities (per the entity’s vulnerability risk rankings defined at Requirement 6.3.1) are resolved. </br> Rescans are conducted as needed. </br> Scans are performed by qualified personnel and organizational independence of the tester exists (not required to be a Qualified Security Assessor (QSA) or Approved Scanning Vendor (ASV)).|Include servers that support Microsoft Entra hybrid capabilities. For example, Microsoft Entra Connect, Application proxy connectors, etc. as part of internal vulnerability scans. </br> Organizations using federated authentication: review and address federation system infrastructure vulnerabilities. [What is federation with Microsoft Entra ID?](../hybrid/connect/whatis-fed.md) </br> Review and mitigate risk detections reported by Microsoft Entra ID Protection. Integrate the signals with a SIEM solution to integrate more with remediation workflows or automation. [Risk types and detection](../identity-protection/concept-identity-protection-risks.md) </br> Run the Microsoft Entra assessment tool regularly and address findings. [`AzureADAssessment`](https://github.com/AzureAD/AzureADAssessment) </br> [Security operations for infrastructure](../architecture/security-operations-infrastructure.md) </br> [Integrate Microsoft Entra logs with Azure Monitor logs](../reports-monitoring/howto-integrate-activity-logs-with-azure-monitor-logs.md)|
|**11.3.2** External vulnerability scans are performed as follows: </br> At least once every three months. </br> By a PCI SSC ASV. </br> Vulnerabilities are resolved and ASV Program Guide requirements for a passing scan are met. </br> Rescans are performed as needed to confirm that vulnerabilities are resolved per the ASV Program Guide requirements for a passing scan.|Not applicable to Microsoft Entra ID.|
|**11.3.2.1** External vulnerability scans are performed after any significant change as follows: </br> Vulnerabilities that are scored 4.0 or higher by the CVSS are resolved. </br> Rescans are conducted as needed. </br> Scans are performed by qualified personnel and organizational independence of the tester exists (not required to be a QSA or ASV).|Not applicable to Microsoft Entra ID.|

## 11.4 External and internal penetration testing is regularly performed, and exploitable vulnerabilities and security weaknesses are corrected.

|PCI-DSS Defined approach requirements|Microsoft Entra guidance and recommendations|
|-|-|
|**11.4.1** A penetration testing methodology is defined, documented, and implemented by the entity, and includes: </br> Industry-accepted penetration testing approaches. </br> Coverage for the entire cardholder data environment (CDE) perimeter and critical systems. </br> Testing from both inside and outside the network. </br> Testing to validate any segmentation and scope-reduction controls. </br> Application-layer penetration testing to identify, at a minimum, the vulnerabilities listed in Requirement 6.2.4. </br> Network-layer penetration tests that encompass all components that support network functions and operating systems. </br> Review and consideration of threats and vulnerabilities experienced in the last 12 months. </br> Documented approach to assessing and addressing the risk posed by exploitable vulnerabilities and security weaknesses found during penetration testing. </br> Retention of penetration testing results and remediation activities results for at least 12 months.|[Penetration Testing Rules of Engagement, Microsoft Cloud](https://www.microsoft.com/msrc/pentest-rules-of-engagement)|
|**11.4.2** Internal penetration testing is performed: </br> Per the entity’s defined methodology. </br> At least once every 12 months. </br> After any significant infrastructure or application upgrade or change. </br> By a qualified internal resource or qualified external third-party. </br> Organizational independence of the tester exists (not required to be a QSA or ASV).|[Penetration Testing Rules of Engagement, Microsoft Cloud](https://www.microsoft.com/msrc/pentest-rules-of-engagement)|
|**11.4.3** External penetration testing is performed: </br> Per the entity’s defined methodology. </br> At least once every 12 months. </br> After any significant infrastructure or application upgrade or change. </br> By a qualified internal resource or qualified external third party. </br> Organizational independence of the tester exists (not required to be a QSA or ASV).|[Penetration Testing Rules of Engagement, Microsoft Cloud](https://www.microsoft.com/msrc/pentest-rules-of-engagement)|
|**11.4.4** Exploitable vulnerabilities and security weaknesses found during penetration testing are corrected as follows: </br> In accordance with the entity’s assessment of the risk posed by the security issue as defined in Requirement 6.3.1. </br> Penetration testing is repeated to verify the corrections.|[Penetration Testing Rules of Engagement, Microsoft Cloud](https://www.microsoft.com/msrc/pentest-rules-of-engagement)|
|**11.4.5** If segmentation is used to isolate the CDE from other networks, penetration tests are performed on segmentation controls as follows: </br> At least once every 12 months and after any changes to segmentation controls/methods. </br> Covering all segmentation controls/methods in use. </br> According to the entity’s defined penetration testing methodology. </br> Confirming that the segmentation controls/methods are operational and effective, and isolate the CDE from all out-of-scope systems. </br> Confirming effectiveness of any use of isolation to separate systems with differing security levels (see Requirement 2.2.3). </br> Performed by a qualified internal resource or qualified external third party. </br> Organizational independence of the tester exists (not required to be a QSA or ASV).|Not applicable to Microsoft Entra ID.|
|**11.4.6** *Additional requirement for service providers only*: If segmentation is used to isolate the CDE from other networks, penetration tests are performed on segmentation controls as follows: </br> At least once every six months and after any changes to segmentation controls/methods. </br> Covering all segmentation controls/methods in use. </br> According to the entity’s defined penetration testing methodology. </br> Confirming that the segmentation controls/methods are operational and effective, and isolate the CDE from all out-of-scope systems. </br> Confirming effectiveness of any use of isolation to separate systems with differing security levels (see Requirement 2.2.3). </br> Performed by a qualified internal resource or qualified external third party. </br> Organizational independence of the tester exists (not required to be a QSA or ASV).|Not applicable to Microsoft Entra ID.|
|**11.4.7** *Additional requirement for multi-tenant service providers only*: Multi-tenant service providers support their customers for external penetration testing per Requirement 11.4.3 and 11.4.4.|[Penetration Testing Rules of Engagement, Microsoft Cloud](https://www.microsoft.com/msrc/pentest-rules-of-engagement)|

## 11.5 Network intrusions and unexpected file changes are detected and responded to.

|PCI-DSS Defined approach requirements|Microsoft Entra guidance and recommendations|
|-|-|
|**11.5.1** Intrusion-detection and/or intrusion-prevention techniques are used to detect and/or prevent intrusions into the network as follows: </br> All traffic is monitored at the perimeter of the CDE. </br> All traffic is monitored at critical points in the CDE. </br> Personnel are alerted to suspected compromises. </br> All intrusion-detection and prevention engines, baselines, and signatures are kept up to date.|Not applicable to Microsoft Entra ID.|
|**11.5.1.1** *Additional requirement for service providers only*: Intrusion-detection and/or intrusion-prevention techniques detect, alert on/prevent, and address covert malware communication channels.|Not applicable to Microsoft Entra ID.|
|**11.5.2** A change-detection mechanism (for example, file integrity monitoring tools) is deployed as follows: </br> To alert personnel to unauthorized modification (including changes, additions, and deletions) of critical files. </br> To perform critical file comparisons at least once weekly.|Not applicable to Microsoft Entra ID.|

## 11.6 Unauthorized changes on payment pages are detected and responded to.

|PCI-DSS Defined approach requirements|Microsoft Entra guidance and recommendations|
|-|-|
|**11.6.1** A change- and tamper-detection mechanism is deployed as follows: </br> To alert personnel to unauthorized modification (including indicators of compromise, changes, additions, and deletions) to the HTTP headers and the contents of payment pages as received by the consumer browser. </br> The mechanism is configured to evaluate the received HTTP header and payment page. </br> The mechanism functions are performed as follows: At least once every seven days </br> OR </br> Periodically at the frequency defined in the entity’s targeted risk analysis, which is performed according to all elements|Not applicable to Microsoft Entra ID.|

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
* [Requirement 11: Test Security of Systems and Networks Regularly](pci-requirement-11.md) (You're here)
* [Microsoft Entra PCI-DSS Multi-Factor Authentication guidance](pci-dss-mfa.md)

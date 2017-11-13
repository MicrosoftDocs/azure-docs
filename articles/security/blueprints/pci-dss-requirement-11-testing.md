---

title: Azure Payment Processing Blueprint - Testing requirements 
description: PCI DSS Requirement 11
services: security
documentationcenter: na
author: simorjay
manager: mbaldwin
editor: tomsh

ms.assetid: 9753853b-ad80-4be4-9416-2583b8fd2029
ms.service: security
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 10/15/2017
ms.author: frasim

---

# Testing requirements for PCI DSS-compliant environments 
## PCI DSS Requirement 11

**Regularly test security systems and processes**

> [!NOTE]
> These requirements are defined by the [Payment Card Industry (PCI) Security Standards Council](https://www.pcisecuritystandards.org/pci_security/) as part of the [PCI Data Security Standard (DSS) Version 3.2](https://www.pcisecuritystandards.org/document_library?category=pcidss&document=pci_dss). Please refer to the PCI DSS for information on testing procedures and guidance for each requirement.

Vulnerabilities are being discovered continually by malicious individuals and researchers, and being introduced by new software. System components, processes, and custom software should be tested frequently to ensure security controls continue to reflect a changing environment.

## PCI DSS Requirement 11.1

**11.1** Implement processes to test for the presence of wireless access points (802.11), and detect and identify all authorized and unauthorized wireless access points on a quarterly basis.

> [!NOTE]
> Methods that may be used in the process include but are not limited to wireless network scans, physical/logical inspections of system components and infrastructure, network access control (NAC), or wireless IDS/IPS.
Whichever methods are used, they must be sufficient to detect and identify both authorized and unauthorized devices.


**Responsibilities:&nbsp;&nbsp;`Microsoft Azure Only`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | Azure does not permit or allow wireless connections in the Azure network environment. Internal security teams regularly scans for rogue wireless signals on a quarterly basis and rogue signals are investigated and removed. Customers are not permitted to deploy wireless technology in the Azure environment. |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | Wireless and SNMP are not implemented in the solution.|



### PCI DSS Requirement 11.1.1

**11.1.1** Maintain an inventory of authorized wireless access points including a documented business justification.

**Responsibilities:&nbsp;&nbsp;`Microsoft Azure Only`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | See "Microsoft Azure" section for [Requirement 11.1](#pci-dss-requirement-11-1). |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | Wireless and SNMP are not implemented in the solution.|



### PCI DSS Requirement 11.1.2

**11.1.2** Implement incident response procedures in the event unauthorized wireless access points are detected.


**Responsibilities:&nbsp;&nbsp;`Microsoft Azure Only`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | See "Microsoft Azure" section for [Requirement 11.1](#pci-dss-requirement-11-1). |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | Wireless and SNMP are not implemented in the solution.|



## PCI DSS Requirement 11.2

**11.2** Run internal and external network vulnerability scans at least quarterly and after any significant change in the network (such as new system component installations, changes in network topology, firewall rule modifications, product upgrades). 

> [!NOTE]
> Multiple scan reports can be combined for the quarterly scan process to show that all systems were scanned and all applicable vulnerabilities have been addressed. Additional documentation may be required to verify non-remediated vulnerabilities are in the process of being addressed.
> For initial PCI DSS compliance, it is not required that four quarters of passing scans be completed if the assessor verifies 1) the most recent scan result was a passing scan, 2) the entity has documented policies and procedures requiring quarterly scanning, and 3) vulnerabilities noted in the scan results have been corrected as shown in a re-scan(s). For subsequent years after the initial PCI DSS review, four quarters of passing scans must have occurred.


**Responsibilities:&nbsp;&nbsp;`Shared`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | Azure performs quarterly internal and external vulnerability scans. Scans are performed by qualified personnel. |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | The Contoso Webstore has been pen tested and vulnerability scanned in an 'as is' effort. The pen test results can be duplicated by using common tools such as nmap, or pentest-tools.com. The results of the Pen test will provide inconclusive attack surface, with no exploitable items. Additionally, [Azure Security Center](https://azure.microsoft.com/services/security-center/) and [Azure Advisor](/azure/advisor/advisor-security-recommendations) provide vulnerability information and remediation.|



### PCI DSS Requirement 11.2.1

**11.2.1** Perform quarterly internal vulnerability scans. Address vulnerabilities and perform rescans to verify all “high risk” vulnerabilities are resolved in accordance with the entity’s vulnerability ranking (per Requirement 6.1). Scans must be performed by qualified personnel.

**Responsibilities:&nbsp;&nbsp;`Shared`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | Microsoft Azure performs scans for vulnerabilities on in-scope underlying infrastructure. Microsoft Azure implements vulnerability scanning on server operating systems, databases, and network devices with the appropriate vulnerability scanning tools. Azure web applications are scanned with appropriate industry scanning solutions. Vulnerability scans are performed on a quarterly basis.<br /><br />Rescans are performed as needed against all systems, until all “high-risk” vulnerabilities (as identified in Requirement 6.1) are resolved. |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | The Contoso Webstore has been pen tested and vulnerability scanned in an 'as is' effort. The pen test results can be duplicated by using common tools such as nmap, or pentest-tools.com. The results of the Pen test will provide inconclusive attack surface, with no exploitable items. Additionally, [Azure Security Center](https://azure.microsoft.com/services/security-center/) and [Azure Advisor](/azure/advisor/advisor-security-recommendations) provide vulnerability information and remediation.|



### PCI DSS Requirement 11.2.2

**11.2.2** Perform quarterly external vulnerability scans, via an Approved Scanning Vendor (ASV) approved by the Payment Card Industry Security Standards Council (PCI SSC). Perform rescans as needed, until passing scans are achieved. 

> [!NOTE]
> Quarterly external vulnerability scans must be performed by an Approved Scanning Vendor (ASV), approved by the Payment Card Industry Security Standards Council (PCI SSC).
> Refer to the ASV Program Guide published on the PCI SSC website for scan customer responsibilities, scan preparation, etc.

**Responsibilities:&nbsp;&nbsp;`Shared`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | Microsoft Azure performs external scans for vulnerabilities on in-scope underlying infrastructure that is accessible externally. Scans are performed by an Approved Scan Vendor (ASV).<br /><br />Microsoft Azure subscribes to MSRC/OSSC monthly patch notifications and scans for vulnerabilities at least quarterly. Identified vulnerabilities are evaluated and remediated per established timeline based on the level of risk.<br /><br />Each quarter targeted comprehensive security vulnerability scanning against prioritized components of the Microsoft Azure environment is performed to identify security vulnerabilities. |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | When deploying the Contoso Webstore, customers of the demo are responsible for performing quarterly external vulnerability scans and rescans as needed against all PaaS instances in their cardholder data environment (CDE), using an Approved Scanning Vendor (ASV) approved by the Payment Card Industry Security Standards Council.<br /><br />|



### PCI DSS Requirement 11.2.3

**11.2.3** Perform internal and external scans, and rescans as needed, after any significant change. Scans must be performed by qualified personnel.

**Responsibilities:&nbsp;&nbsp;`Shared`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | Results are reported to stakeholders and remediation is tracked by the Azure Security Team through closure. Azure test results may be shared with customers under NDA. |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | Customers are responsible for performing quarterly internal and external vulnerability scans and rescans as needed against all PaaS instances in their CDE. Scans should be performed after significant changes in the in-scope environment.<br /><br />Scans must be performed by an ASV or personnel with organizational independence.|



## PCI DSS Requirement 11.3

**11.3** Implement a methodology for penetration testing that includes the following:
- Is based on industry-accepted penetration testing approaches (for example, NIST SP800-115)
- Includes coverage for the entire CDE perimeter and critical systems
- Includes testing from both inside and outside the network
- Includes testing to validate any segmentation and scope-reduction controls
- Defines application-layer penetration tests to include, at a minimum, the vulnerabilities listed in Requirement 6.5
- Defines network-layer penetration tests to include components that support network functions as well as operating systems
- Includes review and consideration of threats and vulnerabilities experienced in the last 12 months
- Specifies retention of penetration testing results and remediation activities results

**Responsibilities:&nbsp;&nbsp;`Shared`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | Microsoft Azure validates services using third party penetration testing based upon the OWASP (Open Web Application Security Project) top ten using CREST-certified testers. The results of testing are tracked through a risk register, which is audited and reviewed on a regular basis to ensure compliance to security practices. <br /><br />Microsoft also uses Red Teaming against Microsoft-managed infrastructure, services and applications. No end-customer data is deliberately targeted during Red Teaming and live site penetration testing. The tests are against Microsoft Azure infrastructure and platforms as well as Microsoft’s own applications and data. Customer tenants, applications and data hosted in Azure are never targeted.<br /><br />Microsoft Azure has employed an independent assessor to develop a system assessment plan and conduct a controls assessment. Controls assessments are performed annually and the results are reported to relevant parties. |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | The Contoso Webstore has been pen tested and vulnerability scanned in an 'as is' effort. The pen test results can be duplicated by using common tools such as nmap, or pentest-tools.com. The results of the Pen test will provide inconclusive attack surface, with no exploitable items. Additionally, [Azure Security Center](https://azure.microsoft.com/services/security-center/) and [Azure Advisor](/azure/advisor/advisor-security-recommendations) provide vulnerability information and remediation.|



### PCI DSS Requirement 11.3.1

**11.3.1** Perform *external* penetration testing at least annually and after any significant infrastructure or application upgrade or modification (such as an operating system upgrade, a sub-network added to the environment, or a web server added to the environment).

**Responsibilities:&nbsp;&nbsp;`Shared`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | See "Microsoft Azure" section for [Requirement 11.3](#pci-dss-requirement-11-3). |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | The Contoso Webstore has been pen tested and vulnerability scanned in an 'as is' effort. The pen test results can be duplicated by using common tools such as nmap, or pentest-tools.com. The results of the Pen test will provide inconclusive attack surface, with no exploitable items. Additionally, [Azure Security Center](https://azure.microsoft.com/services/security-center/) and [Azure Advisor](/azure/advisor/advisor-security-recommendations) provide vulnerability information and remediation.|



### PCI DSS Requirement 11.3.2

**11.3.2** Perform *internal* penetration testing at least annually and after any significant infrastructure or application upgrade or modification (such as an operating system upgrade, a sub-network added to the environment, or a web server added to the environment).

**Responsibilities:&nbsp;&nbsp;`Shared`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | Microsoft Azure contracts with independent assessors to perform penetration testing of the Microsoft Azure boundary. Red-Team exercises are also routinely performed and results used to make security improvements. |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | The Contoso Webstore has been pen tested and vulnerability scanned in an 'as is' effort. The pen test results can be duplicated by using common tools such as nmap, or pentest-tools.com. The results of the Pen test will provide inconclusive attack surface, with no exploitable items. Additionally, [Azure Security Center](https://azure.microsoft.com/services/security-center/) and [Azure Advisor](/azure/advisor/advisor-security-recommendations) provide vulnerability information and remediation.|



### PCI DSS Requirement 11.3.3

**11.3.3** Exploitable vulnerabilities found during penetration testing are corrected and testing is repeated to verify the corrections.

**Responsibilities:&nbsp;&nbsp;`Shared`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | Procedures have been established to monitor the Microsoft Azure platform components for known security vulnerabilities. <br /><br /><br /><br />Each quarter targeted comprehensive security vulnerability scanning against prioritized components of the Azure production environment is performed to identify security vulnerabilities. Results are reported to stakeholders and remediation is tracked by the team through closure. |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | [Azure Security Center](https://azure.microsoft.com/services/security-center/) and [Azure Advisor](/azure/advisor/advisor-security-recommendations), which provide vulnerability information and remediation, have been used to ensure that all outstanding issues were remediated for the Contoso Webstore demo CDE.|



### PCI DSS Requirement 11.3.4

**11.3.4** If segmentation is used to isolate the CDE from other networks, perform penetration tests at least annually and after any changes to segmentation controls/methods to verify that the segmentation methods are operational and effective, and isolate all out-of-scope systems from systems in the CDE.

**Responsibilities:&nbsp;&nbsp;`Shared`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | Procedures have been established to monitor the Microsoft Azure platform components for known security vulnerabilities. <br /><br /><br /><br />Each quarter targeted comprehensive security vulnerability scanning against prioritized components of the Azure production environment is performed to identify security vulnerabilities. Results are reported to stakeholders and remediation is tracked by the team through closure. |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | [Azure Security Center](https://azure.microsoft.com/services/security-center/) and [Azure Advisor](/azure/advisor/advisor-security-recommendations), which provide vulnerability information and remediation, have been used to ensure that all outstanding issues were remediated for the Contoso Webstore demo CDE.|



### PCI DSS Requirement 11.3.4.1

**11.3.4.1** *Additional requirement for service providers only:* If segmentation is used, confirm PCI DSS scope by performing penetration testing on segmentation controls at least every six months and after any changes to segmentation controls/methods.

> [!NOTE]
> This requirement is a best practice until January 31, 2018, after which it becomes a requirement.


**Responsibilities:&nbsp;&nbsp;`Shared`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | See "Microsoft Azure" section for [Requirement 11.3.4](#pci-dss-requirement-11-3-4). |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | [Azure Security Center](https://azure.microsoft.com/services/security-center/) and [Azure Advisor](/azure/advisor/advisor-security-recommendations), which provide vulnerability information and remediation, have been used to ensure that all outstanding issues were remediated for the Contoso Webstore demo CDE.|



## PCI DSS Requirement 11.4

**11.4** Use intrusion-detection and/or intrusion-prevention techniques to detect and/or prevent intrusions into the network. Monitor all traffic at the perimeter of the cardholder data environment as well as at critical points in the cardholder data environment, and alert personnel to suspected compromises.
Keep all intrusion-detection and prevention engines, baselines, and signatures up to date.

**Responsibilities:&nbsp;&nbsp;`Shared`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | Microsoft Azure conducts real-time analysis of events within its operational environment and IDS systems generate near real-time alerts about events that could potentially compromise the system. |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | The Contoso Webstore is a PaaS service, and network intrusion detection and prevention refer to Azure's responsibility. [Azure Security Center](https://azure.microsoft.com/services/security-center/) and [Azure Advisor](/azure/advisor/advisor-security-recommendations) provide intrusion alerting and remediation.|



## PCI DSS Requirement 11.5

**11.5** Deploy a change-detection mechanism (for example, file-integrity monitoring tools) to alert personnel to unauthorized modification (including changes, additions, and deletions) of critical system files, configuration files, or content files; and configure the software to perform critical file comparisons at least weekly. 

> [!NOTE]
> For change-detection purposes, critical files are usually those that do not regularly change, but the modification of which could indicate a system compromise or risk of compromise. Change-detection mechanisms such as file-integrity monitoring products usually come pre-configured with critical files for the related operating system. Other critical files, such as those for custom applications, must be evaluated and defined by the entity (that is, the merchant or service provider).

**Responsibilities:&nbsp;&nbsp;`Shared`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | Microsoft Azure maintains and notifies customers of potential changes and events that may impact security or availability of the services through an online Service Dashboard. Changes to the security commitments and security obligations of Microsoft Azure customers are updated on the Microsoft Azure website in a timely manner.<br /><br />Installation or changes to software on Microsoft Azure production environment is restricted to authorized administration personnel and follows change management procedures. |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | Contoso Webstore demo is a PaaS service and change detection has been implemented using OMS. For more information, see [PCI Guidance - Pre-Installed OMS Solutions](payment-processing-blueprint.md#oms-solutions).<br /><br />|



### PCI DSS Requirement 11.5.1

**11.5.1** Implement a process to respond to any alerts generated by the change-detection solution.

**Responsibilities:&nbsp;&nbsp;`Shared`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | Azure monitoring event rules provide an increased level of monitoring for high risk operations and assets. Azure-managed network devices are monitored for compliance with established security standards. |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | The Contoso Webstore alerts for changes are provided by the OMS implementation. For more information, see [PCI Guidance - Pre-Installed OMS Solutions](payment-processing-blueprint.md#oms-solutions).<br /><br /><br /><br />|



## PCI DSS Requirement 11.6

**11.6** Ensure that security policies and operational procedures for security monitoring and testing are documented, in use, and known to all affected parties.

**Responsibilities:&nbsp;&nbsp;`Customer Only`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | Not applicable. |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | The Contoso Webstore alerts for changes are provided by the OMS implementation. For more information, see [PCI Guidance - Pre-Installed OMS Solutions](payment-processing-blueprint.md#oms-solutions).<br /><br /><br /><br />|





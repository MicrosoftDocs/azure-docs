---

title: Web Applications for FedRAMP: System and Information Integrity
description: Web Applications for FedRAMP: System and Information Integrity
services: security
documentationcenter: na
author: jomolesk
manager: mbaldwin
editor: tomsh

ms.assetid: 2ff2778b-2c37-41b5-a39c-6594b3e3b10b
ms.service: security
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 11/15/2017
ms.author: jomolesk

---

> [!NOTE]
> These controls are defined by NIST and the U.S. Department of Commerce as part of the NIST Special Publication 800-53 Revision 4. Please refer to NIST 800-53 Rev. 4 for information on testing procedures and guidance for each control.
    
    

# System and Information Integrity (SI)

## NIST 800-53 Control SI-1

#### System and Information Integrity Policy and Procedures

**SI-1** The organization develops, documents, and disseminates to [Assignment: organization-defined personnel or roles] a system and information integrity policy that addresses purpose, scope, roles, responsibilities, management commitment, coordination among organizational entities, and compliance; and procedures to facilitate the implementation of the system and information integrity policy and associated system and information integrity controls; and reviews and updates the current system and information integrity policy [Assignment: organization-defined frequency]; and system and information integrity procedures [Assignment: organization-defined frequency].

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer's enterprise-level system and information integrity policy and procedures may be sufficient to address this control. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control SI-2.a

#### Flaw Remediation

**SI-2.a** The organization identifies, reports, and corrects information system flaws.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | This Azure Blueprint deploys the OMS Automation & Control solution to track the status of updates for the Windows virtual machines deployed in this architecture. From the OMS dashboard, the Update Management tile displays flaw remediation status for all deployed Windows servers. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control SI-2.b

#### Flaw Remediation

**SI-2.b** The organization tests software and firmware updates related to flaw remediation for effectiveness and potential side effects before installation.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer is responsible for testing updates related to flaw remediation for effectiveness and potential side effects prior to installation on customer-deployed resources. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control SI-2.c

#### Flaw Remediation

**SI-2.c** The organization installs security-relevant software and firmware updates within [Assignment: organization-defined time period] of the release of the updates.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | Windows virtual machines deployed by this Azure Blueprint are configured by default to receive automatic updates from Windows Update Service. This solution also deploys the OMS Automation & Control solution through which Update Deployments can be created to deploy patches to Windows servers when needed. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control SI-2.d

#### Flaw Remediation

**SI-2.d** The organization incorporates flaw remediation into the organizational configuration management process.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer is responsible for including flaw remediation in configuration management. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control SI-2 (1)

#### Flaw Remediation | Central Management

**SI-2 (1)** The organization centrally manages the flaw remediation process.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | This Azure Blueprint deploys the OMS Automation & Control solution to track the status of updates for the Windows virtual machines deployed in this architecture. From the OMS dashboard, the Update Management tile displays flaw remediation status for all deployed Windows servers. Update Deployments can be created to deploy patches to Windows servers when needed. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control SI-2 (2)

#### Flaw Remediation | Automated Flaw Remediation Status

**SI-2 (2)** The organization employs automated mechanisms [Assignment: organization-defined frequency] to determine the state of information system components with regard to flaw remediation.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | This Azure Blueprint deploys the OMS Automation & Control solution to track the status of updates for the Windows virtual machines deployed in this architecture. For each managed Windows computer, a scan is performed twice per day. Every 15 minutes the Windows API is called to query for the last update time to determine if status has changed, and if so a compliance scan is initiated. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control SI-2 (3).a

#### Flaw Remediation | Time to Remediate Flaws / Benchmarks for Corrective Actions

**SI-2 (3).a** The organization measures the time between flaw identification and flaw remediation.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer is responsible for remediating flaws within customer-deployed resources. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control SI-2 (3).b

#### Flaw Remediation | Time to Remediate Flaws / Benchmarks for Corrective Actions

**SI-2 (3).b** The organization establishes [Assignment: organization-defined benchmarks] for taking corrective actions.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer may rely on enterprise-level benchmarks for flaw remediation processes. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control SI-3.a

#### Malicious Code Protection

**SI-3.a** The organization employs malicious code protection mechanisms at information system entry and exit points to detect and eradicate malicious code.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | This Azure Blueprint deploys host-based antimalware protections for all deployed Windows virtual machines implemented using the Microsoft Antimalware virtual machine extension. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control SI-3.b

#### Malicious Code Protection

**SI-3.b** The organization updates malicious code protection mechanisms whenever new releases are available in accordance with organizational configuration management policy and procedures.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | This Azure Blueprint deploys host-based antimalware protections for all deployed Windows virtual machines implemented using the Microsoft Antimalware virtual machine extension. This extension is configured to automatically update both the antimalware engine and protection signatures as release become available. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control SI-3.c

#### Malicious Code Protection

**SI-3.c** The organization configures malicious code protection mechanisms to perform periodic scans of the information system [Assignment: organization-defined frequency] and real-time scans of files from external sources at [Selection (one or more); endpoint; network entry/exit points] as the files are downloaded, opened, or executed in accordance with organizational security policy; and [Selection (one or more): block malicious code; quarantine malicious code; send alert to administrator; [Assignment: organization-defined action]] in response to malicious code detection.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | This Azure Blueprint deploys host-based antimalware protections for all deployed Windows virtual machines implemented using the Microsoft Antimalware virtual machine extension. This extension is configured to perform both real-time and periodic scans (weekly), automatically update both the antimalware engine and protection signatures, and perform automatic remediation actions. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control SI-3.d

#### Malicious Code Protection

**SI-3.d** The organization addresses the receipt of false positives during malicious code detection and eradication and the resulting potential impact on the availability of the information system.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer is responsible for protecting against malicious code. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control SI-3 (1)

#### Malicious Code Protection | Central Management

**SI-3 (1)** The organization centrally manages malicious code protection mechanisms.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | This Azure Blueprint deploys host-based antimalware protections for all deployed Windows virtual machines implemented using the Microsoft Antimalware virtual machine extension. Azure OMS provides a centralized capability to review the current status of the antimalware solution. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control SI-3 (2)

#### Malicious Code Protection | Automatic Updates

**SI-3 (2)** The information system automatically updates malicious code protection mechanisms.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | This Azure Blueprint deploys host-based antimalware protections for all deployed Windows virtual machines implemented using the Microsoft Antimalware virtual machine extension. This extension is configured to automatically update both the antimalware engine and protection signatures as release become available. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control SI-3 (7)

#### Malicious Code Protection | Nonsignature-Based Detection

**SI-3 (7)** The information system implements nonsignature-based malicious code detection mechanisms.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | This Azure Blueprint deploys host-based antimalware protections for all deployed Windows virtual machines implemented using the Microsoft Antimalware virtual machine extension. This extension is configured to perform heuristic detection. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control SI-4.a

#### Information System Monitoring

**SI-4.a** The organization monitors the information system to detect attacks and indicators of potential attacks in accordance with [Assignment: organization-defined monitoring objectives]; and unauthorized local, network, and remote connections.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | This Azure Blueprint deploys the Log Analytics and the OMS Security and Audit solution. This solution provides a comprehensive view of security posture, attacks, and indicators of potential attacks. The Security and Audit dashboard provides high-level insight into the security state of deployed resources using data available across deployed OMS solutions. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control SI-4.b

#### Information System Monitoring

**SI-4.b** The organization identifies unauthorized use of the information system through [Assignment: organization-defined techniques and methods].

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | This Azure Blueprint deploys the  OMS Security and Audit solution. The Identify and Access domain provides a dashboard with an overview of the information system identity state, including number of failed attempts to log on and current number of accounts that are logged in. The information available in this dashboard can assist in identification of potential suspicious activity. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control SI-4.c

#### Information System Monitoring

**SI-4.c** The organization deploys monitoring devices strategically within the information system to collect organization-determined essential information; and at ad hoc locations within the system to track specific types of transactions of interest to the organization.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | This Azure Blueprint deploys the Log Analytics and the OMS Security and Audit solution. The Security and Audit dashboard provides high-level insight into the security state of deployed resources using data available across deployed OMS solutions, including insight into VM operating system monitoring data. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control SI-4.d

#### Information System Monitoring

**SI-4.d** The organization protects information obtained from intrusion-monitoring tools from unauthorized access, modification, and deletion.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | Logical access controls are used to protect monitoring information within this Azure Blueprint from unauthorized access, modification, and deletion. Azure Active Directory enforces approved logical access using role-based group memberships. The ability to view monitoring information and use monitoring tools can be limited to users that require those permissions. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control SI-4.e

#### Information System Monitoring

**SI-4.e** The organization heightens the level of information system monitoring activity whenever there is an indication of increased risk to organizational operations and assets, individuals, other organizations, or the Nation based on law enforcement information, intelligence information, or other credible sources of information.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer is responsible for monitoring customer-deployed resources. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control SI-4.f

#### Information System Monitoring

**SI-4.f** The organization obtains legal opinion with regard to information system monitoring activities in accordance with applicable federal laws, Executive Orders, directives, policies, or regulations.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer is responsible for monitoring customer-deployed resources. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control SI-4.g

#### Information System Monitoring

**SI-4.g** The organization provides [Assignment: organization-defined information system monitoring information] to [Assignment: organization-defined personnel or roles] [Selection (one or more): as needed; [Assignment: organization-defined frequency]].

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer is responsible for monitoring customer-deployed resources. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control SI-4 (1)

#### Information System Monitoring | System-Wide Intrusion Detection System

**SI-4 (1)** The organization connects and configures individual intrusion detection tools into an information system-wide intrusion detection system.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer is responsible for monitoring customer-deployed resources. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control SI-4 (2)

#### Information System Monitoring | Automated Tools for Real-Time Analysis

**SI-4 (2)** The organization employs automated tools to support near real-time analysis of events.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | This Azure Blueprint deploys the Log Analytics and various OMS solutions, including the Security and Audit solution. Log Analytics provides near real-time analysis of events across deployed resources. OMS solutions provides a comprehensive view of security posture across solution domains. OMS provides insight into the security state of deployed resources using data available across deployed OMS solutions. OMS can be configured to generate alerts based on defined criteria. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control SI-4 (4)

#### Information System Monitoring | Inbound and Outbound Communications Traffic

**SI-4 (4)** The information system monitors inbound and outbound communications traffic [Assignment: organization-defined frequency] for unusual or unauthorized activities or conditions.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer is responsible for monitoring customer-deployed resources. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control SI-4 (5)

#### Information System Monitoring | System-Generated Alerts

**SI-4 (5)** The information system alerts [Assignment: organization-defined personnel or roles] when the following indications of compromise or potential compromise occur: [Assignment: organization-defined compromise indicators].

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | This Azure Blueprint deploys various OMS solutions, including the Security and Audit solution. Log Analytics provides near real-time analysis of events across deployed resources. OMS solutions provides a comprehensive view of security posture across solution domains. OMS can be configured to generate alerts based on defined criteria. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control SI-4 (11)

#### Information System Monitoring | Analyze Communications Traffic Anomalies

**SI-4 (11)** The organization analyzes outbound communications traffic at the external boundary of the information system and selected [Assignment: organization-defined interior points within the system (e.g., subnetworks, subsystems)] to discover anomalies.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer is responsible for analyzing communications traffic anomalies for customer-deployed resources. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control SI-4 (14)

#### Information System Monitoring | Wireless Intrusion Detection

**SI-4 (14)** The organization employs a wireless intrusion detection system to identify rogue wireless devices and to detect attack attempts and potential compromises/breaches to the information system.

**Responsibilities:** `Azure Only`

|||
|---|---|
| **Customer** | No customer-controlled hardware, including wireless devices, is allowed in Azure datacenters. |
| **Provider (Microsoft Azure)** | Microsoft Azure regularly monitors for rogue wireless signals on a quarterly basis as discussed in AC-18. <br /> Microsoft Azure implements this control on behalf of both PaaS and IaaS customers. |


 ### NIST 800-53 Control SI-4 (16)

#### Information System Monitoring | Correlate Monitoring Information

**SI-4 (16)** The organization correlates information from monitoring tools employed throughout the information system.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | This Azure Blueprint deploys the Log Analytics and various OMS solutions, including the Security and Audit solution. OMS provides insight into the security state of deployed resources using data available across deployed OMS solutions. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control SI-4 (18)

#### Information System Monitoring | Analyze Traffic / Covert Exfiltration

**SI-4 (18)** The organization analyzes outbound communications traffic at the external boundary of the information system (i.e., system perimeter) and at [Assignment: organization-defined interior points within the system (e.g., subsystems, subnetworks)] to detect covert exfiltration of information.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer is responsible for analyzing communications traffic for customer-deployed resources. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control SI-4 (19)

#### Information System Monitoring | Individuals Posing Greater Risk

**SI-4 (19)** The organization implements [Assignment: organization-defined additional monitoring] of individuals who have been identified by [Assignment: organization-defined sources] as posing an increased level of risk.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer is responsible for monitoring individuals who pose a greater risk. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control SI-4 (20)

#### Information System Monitoring | Privileged Users

**SI-4 (20)** The organization implements [Assignment: organization-defined additional monitoring] of privileged users.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer is responsible for monitoring privileged users. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control SI-4 (22)

#### Information System Monitoring | Unauthorized Network Services

**SI-4 (22)** The information system detects network services that have not been authorized or approved by [Assignment: organization-defined authorization or approval processes] and [Selection (one or more): audits; alerts [Assignment: organization-defined personnel or roles]].

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer is responsible for detecting unauthorized network services. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control SI-4 (23)

#### Information System Monitoring | Host-Based Devices

**SI-4 (23)** The organization implements [Assignment: organization-defined host-based monitoring mechanisms] at [Assignment: organization-defined information system components].

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | This Azure Blueprint collects monitoring data from deployed resources, including data from host-based monitoring capabilities. The Microsoft Monitoring Agent is installed on all Windows virtual machines to collect monitoring data used by Log Analytics and other OMS solutions. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control SI-4 (24)

#### Information System Monitoring | Indicators of Compromise

**SI-4 (24)** The information system discovers, collects, distributes, and uses indicators of compromise.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer is responsible for discovering, collecting, distributing, and using indicators of compromise to customer-deployed resources. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control SI-5.a

#### Security Alerts, Advisories, and Directives

**SI-5.a** The organization receives information system security alerts, advisories, and directives from [Assignment: organization-defined external organizations] on an ongoing basis.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer is responsible for managing security alerts, advisories and directives for customer-deployed resources (to include applications, operating systems, databases, and software). |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control SI-5.b

#### Security Alerts, Advisories, and Directives

**SI-5.b** The organization generates internal security alerts, advisories, and directives as deemed necessary.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer is responsible for managing security alerts, advisories and directives for customer-deployed resources. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control SI-5.c

#### Security Alerts, Advisories, and Directives

**SI-5.c** The organization disseminates security alerts, advisories, and directives to: [Selection (one or more): [Assignment: organization-defined personnel or roles]; [Assignment: organization-defined elements within the organization]; [Assignment: organization-defined external organizations]].

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer is responsible for managing security alerts, advisories and directives for customer-deployed resources. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control SI-5.d

#### Security Alerts, Advisories, and Directives

**SI-5.d** The organization implements security directives in accordance with established time frames, or notifies the issuing organization of the degree of noncompliance.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer is responsible for managing security alerts, advisories and directives for customer-deployed resources. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control SI-5 (1)

#### Security Alerts, Advisories, and Directives | Automated Alerts and Advisories

**SI-5 (1)** The organization employs automated mechanisms to make security alert and advisory information available throughout the organization.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer is responsible for managing security alerts, advisories and directives for customer-deployed resources. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control SI-6.a

#### Security Function Verification

**SI-6.a** The information system verifies the correct operation of [Assignment: organization-defined security functions].

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer is responsible for security function verification for customer-deployed resources (to include applications, operating systems, databases, and software). |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control SI-6.b

#### Security Function Verification

**SI-6.b** The information system performs this verification [Selection (one or more): [Assignment: organization-defined system transitional states]; upon command by user with appropriate privilege; [Assignment: organization-defined frequency]].

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer is responsible for security function verification for customer-deployed resources. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control SI-6.c

#### Security Function Verification

**SI-6.c** The information system notifies [Assignment: organization-defined personnel or roles] of failed security verification tests.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer is responsible for security function verification for customer-deployed resources. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control SI-6.d

#### Security Function Verification

**SI-6.d** The information system [Selection (one or more): shuts the information system down; restarts the information system; [Assignment: organization-defined alternative action(s)]] when anomalies are discovered.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer is responsible for security function verification for customer-deployed resources. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control SI-7

#### Software, Firmware, and Information Integrity

**SI-7** The organization employs integrity verification tools to detect unauthorized changes to [Assignment: organization-defined software, firmware, and information].

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The virtual machines deployed by this Azure Blueprint run Windows operating systems. Windows provides real-time file integrity validation, protection, and recovery of core system files that are installed as part of Windows or authorized Windows system updates through the Windows Resource Protection (WRP) capability. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control SI-7 (1)

#### Software, Firmware, and Information Integrity | Integrity Checks

**SI-7 (1)** The information system performs an integrity check of [Assignment: organization-defined software, firmware, and information] [Selection (one or more): at startup; at [Assignment: organization-defined transitional states or security-relevant events]; [Assignment: organization-defined frequency]].

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The virtual machines deployed by this Azure Blueprint run Windows operating systems. Windows provides real-time file integrity validation, protection, and recovery of core system files that are installed as part of Windows or authorized Windows system updates through the Windows Resource Protection (WRP) capability. WRP enables real-time integrity checking. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control SI-7 (2)

#### Software, Firmware, and Information Integrity | Automated Notifications of Integrity Violations

**SI-7 (2)** The organization employs automated tools that provide notification to [Assignment: organization-defined personnel or roles] upon discovering discrepancies during integrity verification.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The virtual machines deployed by this Azure Blueprint run Windows operating systems. Windows provides real-time file integrity validation, protection, and recovery of core system files that are installed as part of Windows or authorized Windows system updates through the Windows Resource Protection (WRP) capability.  |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control SI-7 (5)

#### Software, Firmware, and Information Integrity | Automated Response to Integrity Violations

**SI-7 (5)** The information system automatically [Selection (one or more): shuts the information system down; restarts the information system; implements [Assignment: organization-defined security safeguards]] when integrity violations are discovered.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer is responsible for automatically responding to integrity violations within customer-deployed resources. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control SI-7 (7)

#### Software, Firmware, and Information Integrity | Integration of Detection and Response

**SI-7 (7)** The organization incorporates the detection of unauthorized [Assignment: organization-defined security-relevant changes to the information system] into the organizational incident response capability.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer is responsible for protecting software and information integrity for customer-deployed resources. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control SI-7 (14)

#### Software, Firmware, and Information Integrity | Binary or Machine Executable Code

**SI-7 (14)** The organization prohibits the use of binary or machine-executable code from sources with limited or no warranty and without the provision of source code; and provides exceptions to the source code requirement only for compelling mission/operational requirements and with the approval of the authorizing official.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer's enterprise-level system and information integrity procedures may establish requirements to obtain the source code of binary or machine executable code from some sources. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control SI-8.a

#### Spam Protection

**SI-8.a** The organization employs spam protection mechanisms at information system entry and exit points to detect and take action on unsolicited messages.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | There are no mail servers deployed as part of this Azure Blueprint. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control SI-8.b

#### Spam Protection

**SI-8.b** The organization updates spam protection mechanisms when new releases are available in accordance with organizational configuration management policy and procedures.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | There are no mail servers deployed as part of this Azure Blueprint. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control SI-8 (1)

#### Spam Protection | Central Management

**SI-8 (1)** The organization centrally manages spam protection mechanisms.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | There are no mail servers deployed as part of this Azure Blueprint. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control SI-8 (2)

#### Spam Protection | Automatic Updates

**SI-8 (2)** The information system automatically updates spam protection mechanisms.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | There are no mail servers deployed as part of this Azure Blueprint. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control SI-10

#### Information Input Validation

**SI-10** The information system checks the validity of [Assignment: organization-defined information inputs].

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer is responsible for information input validation for customer-deployed resources (to include applications, operating systems, databases, and software). |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control SI-11.a

#### Error Handling

**SI-11.a** The information system generates error messages that provide information necessary for corrective actions without revealing information that could be exploited by adversaries.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The resources deployed by this Azure Blueprint employ commercial operating systems and software applications. This software uses industry best practices to ensure sensitive information is not revealed in error messages. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control SI-11.b

#### Error Handling

**SI-11.b** The information system reveals error messages only to [Assignment: organization-defined personnel or roles].

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The resources deployed by this Azure Blueprint employ commercial operating systems and software applications. This software uses industry best practices to provide error messages that are appropriate in the context of the uses receiving the message. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control SI-12

#### Information Handling and Retention

**SI-12** The organization handles and retains information within the information system and information output from the system in accordance with applicable federal laws, Executive Orders, directives, policies, regulations, standards, and operational requirements.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer is responsible for handling and retaining information within customer-deployed resources (to include applications, operating systems, databases, and software) and information output from those resources. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control SI-16

#### Memory Protection

**SI-16** The information system implements [Assignment: organization-defined security safeguards] to protect its memory from unauthorized code execution.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The virtual machines deployed by this Azure Blueprint run Windows operating systems. Windows has protections in place for preventing code execution in restricted memory locations: No Execute (NX), Address Space Layout Randomization (ASLR), and Data Execution Prevention (DEP). |
| **Provider (Microsoft Azure)** | Not Applicable |

---

title: FedRAMP Azure Blueprint Automation - Risk Assessment
description: Web Applications for FedRAMP - Risk Assessment
services: security
documentationcenter: na
author: jomolesk
manager: mbaldwin
editor: tomsh

ms.assetid: 2293f56a-9666-4a67-9fde-b56182859c9f
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
    
    

# Risk Assessment (RA)

## NIST 800-53 Control RA-1

#### Risk Assessment Policy and Procedures

**RA-1** The organization develops, documents, and disseminates to [Assignment: organization-defined personnel or roles] a risk assessment policy that addresses purpose, scope, roles, responsibilities, management commitment, coordination among organizational entities, and compliance; and procedures to facilitate the implementation of the risk assessment policy and associated risk assessment controls; and reviews and updates the current risk assessment policy [Assignment: organization-defined frequency]; and risk assessment procedures [Assignment: organization-defined frequency].

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer's enterprise-level risk assessment policy and procedures may be sufficient to address this control. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control RA-2.a

#### Security Categorization

**RA-2.a** The organization categorizes information and the information system in accordance with applicable federal laws, Executive Orders, directives, policies, regulations, standards, and guidance.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer is responsible for categorizing customer-deployed resources and the information contained. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control RA-2.b

#### Security Categorization

**RA-2.b** The organization documents the security categorization results (including supporting rationale) in the security plan for the information system.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer is responsible for documenting the results of the security categorization defined in RA-02.a. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control RA-2.c

#### Security Categorization

**RA-2.c** The organization ensures that the authorizing official or authorizing official designated representative reviews and approves the security categorization decision.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer is responsible for ensuring the security categorization decision is reviewed and approved. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control RA-3.a

#### Risk Assessment

**RA-3.a** The organization conducts an assessment of risk, including the likelihood and magnitude of harm, from the unauthorized access, use, disclosure, disruption, modification, or destruction of the information system and the information it processes, stores, or transmits.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer is responsible for conducting a risk assessment. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control RA-3.b

#### Risk Assessment

**RA-3.b** The organization documents risk assessment results in [Selection: security plan; risk assessment report; [Assignment: organization-defined document]].

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer is responsible for conducting a risk assessment. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control RA-3.c

#### Risk Assessment

**RA-3.c** The organization reviews risk assessment results [Assignment: organization-defined frequency].

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer is responsible for conducting a risk assessment. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control RA-3.d

#### Risk Assessment

**RA-3.d** The organization disseminates risk assessment results to [Assignment: organization-defined personnel or roles].

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer is responsible for conducting a risk assessment. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control RA-3.e

#### Risk Assessment

**RA-3.e** The organization updates the risk assessment [Assignment: organization-defined frequency] or whenever there are significant changes to the information system or environment of operation (including the identification of new threats and vulnerabilities), or other conditions that may impact the security state of the system.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer is responsible for conducting a risk assessment. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control RA-5.a

#### Vulnerability Scanning

**RA-5.a** The organization scans for vulnerabilities in the information system and hosted applications [Assignment: organization-defined frequency and/or randomly in accordance with organization-defined process] and when new vulnerabilities potentially affecting the system/applications are identified and reported.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | This Azure Blueprint deploys the OMS Security and Audit solution. This solution provides a comprehensive view of security posture. Within the solution, two security domains, Update Assessment and Baseline Assessment, are available. Baseline Assessment assesses a set of registry keys, audit policy settings, and security policy settings along with Microsoft's recommended values for these settings. Update Assessment assesses the status of available updates on all deployed virtual machines. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control RA-5.b

#### Vulnerability Scanning

**RA-5.b** The organization employs vulnerability scanning tools and techniques that facilitate interoperability among tools and automate parts of the vulnerability management process by using standards for enumerating platforms, software flaws, and improper configurations; formatting checklists and test procedures; and measuring vulnerability impact.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | This Azure Blueprint deploys the OMS Security and Audit solution. Within the solution, two security domains, Update Assessment and Baseline Assessment, are available. Identified issues are assigned a severity rating. Common Configuration Enumeration (CCE) IDs are provided for Baseline Assessment rules.  |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control RA-5.c

#### Vulnerability Scanning

**RA-5.c** The organization analyzes vulnerability scan reports and results from security control assessments.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer is responsible for analyzing scan reports and results from security control assessments. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control RA-5.d

#### Vulnerability Scanning

**RA-5.d** The organization remediates legitimate vulnerabilities [Assignment: organization-defined response times] in accordance with an organizational assessment of risk.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer is responsible for remediating vulnerabilities in customer-deployed resources (to include applications, operating systems, databases, and software) in accordance with the customer risk assessment. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control RA-5.e

#### Vulnerability Scanning

**RA-5.e** The organization shares information obtained from the vulnerability scanning process and security control assessments with [Assignment: organization-defined personnel or roles] to help eliminate similar vulnerabilities in other information systems (i.e., systemic weaknesses or deficiencies).

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer is responsible for sharing information obtained from the vulnerability scanning process and security control assessments to help eliminate similar vulnerabilities across customer-deployed resources. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control RA-5 (1)

#### Vulnerability Scanning | Update Tool Capability

**RA-5 (1)** The organization employs vulnerability scanning tools that include the capability to readily update the information system vulnerabilities to be scanned.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | This Azure Blueprint deploys the OMS Security and Audit solution. Within the solution, two security domains, Update Assessment and Baseline Assessment, are available. The criteria against which these solutions assess is automatically updated. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control RA-5 (2)

#### Vulnerability Scanning | Update by Frequency / Prior to New Scan / When Identified

**RA-5 (2)** The organization updates the information system vulnerabilities scanned [Selection (one or more): [Assignment: organization-defined frequency]; prior to a new scan; when new vulnerabilities are identified and reported].

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | This Azure Blueprint deploys the OMS Security and Audit solution. Within the solution, two security domains, Update Assessment and Baseline Assessment, are available. The criteria against which these solutions assess is automatically updated. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control RA-5 (3)

#### Vulnerability Scanning | Breadth / Depth of Coverage

**RA-5 (3)** The organization employs vulnerability scanning procedures that can identify the breadth and depth of coverage (i.e., information system components scanned and vulnerabilities checked).

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | This Azure Blueprint deploys the OMS Security and Audit solution. Within the solution, two security domains, Update Assessment and Baseline Assessment, are available. Update Assessment performs assessment against both Windows and Linux virtual machines. Baseline assessment performs assessment against Windows virtual machines using a Microsoft developed baseline based on industry best practices. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control RA-5 (4)

#### Vulnerability Scanning | Discoverable Information

**RA-5 (4)** The organization determines what information about the information system is discoverable by adversaries and subsequently takes [Assignment: organization-defined corrective actions].

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer is responsible for taking action in response to discoverable information. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control RA-5 (5)

#### Vulnerability Scanning | Privileged Access

**RA-5 (5)** The information system implements privileged access authorization to [Assignment: organization-identified information system components] for selected [Assignment: organization-defined vulnerability scanning activities].

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The Microsoft Monitoring Agent service, which is configured on virtual machines deployed by this Azure Blueprint, is configured as an automatic service with necessary privileges for assessment activities. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control RA-5 (6)

#### Vulnerability Scanning | Automated Trend Analyses

**RA-5 (6)** The organization employs automated mechanisms to compare the results of vulnerability scans over time to determine trends in information system vulnerabilities.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | OMS provides the capability to create customized dashboard tiles to analyze data collected by Log Analytics and the Microsoft Monitoring Agent. These tiles can be customized to show trends over time. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control RA-5 (8)

#### Vulnerability Scanning | Review Historic Audit Logs

**RA-5 (8)** The organization reviews historic audit logs to determine if a vulnerability identified in the information system has been previously exploited.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer is responsible for reviewing historic audit logs. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control RA-5 (10)

#### Vulnerability Scanning | Correlate Scanning Information

**RA-5 (10)** The organization correlates the output from vulnerability scanning tools to determine the presence of multi-vulnerability/multi-hop attack vectors.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | This Azure Blueprint deploys the OMS Security and Audit solution. This solution provides a comprehensive view of security posture. The Security and Audit dashboard provides high-level insight into the security state of deployed resources using data available across deployed OMS solutions. |
| **Provider (Microsoft Azure)** | Not Applicable |

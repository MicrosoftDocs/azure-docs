---

title: Web Applications for FedRAMP: Security Assessment and Authorization 
description: Web Applications for FedRAMP: Security Assessment and Authorization 
services: security
documentationcenter: na
author: jomolesk
manager: mbaldwin
editor: tomsh

ms.assetid: 47c5914d-0d76-498a-9298-b3d9040791f8
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


# Security Assessment and Authorization (CA)

## NIST 800-53 Control CA-1

#### Security Assessment and Authorization Policy and Procedures

**CA-1** The organization develops, documents, and disseminates to [Assignment: organization-defined personnel or roles] a security assessment and authorization policy that addresses purpose, scope, roles, responsibilities, management commitment, coordination among organizational entities, and compliance; and procedures to facilitate the implementation of the security assessment and authorization policy and associated security assessment and authorization controls; and reviews and updates the current security assessment and authorization policy [Assignment: organization-defined frequency]; and security assessment and authorization procedures [Assignment: organization-defined frequency].

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer's enterprise-level security assessment and authorization policy and procedures may be sufficient to address this control. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control CA-2.a

#### Security Assessments

**CA-2.a** The organization develops a security assessment plan that describes the scope of the assessment including security controls and control enhancements under assessment; assessment procedures to be used to determine security control effectiveness; and assessment environment, assessment team, and assessment roles and responsibilities.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer is responsible for developing a security assessment plan for the customer-deployed system. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control CA-2.b

#### Security Assessments

**CA-2.b** The organization assesses the security controls in the information system and its environment of operation [Assignment: organization-defined frequency] to determine the extent to which the controls are implemented correctly, operating as intended, and producing the desired outcome with respect to meeting established security requirements.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer is responsible for assessing the security controls defined in CA-02.a on customer-deployed resources. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control CA-2.c

#### Security Assessments

**CA-2.c** The organization produces a security assessment report that documents the results of the assessment.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer is responsible for producing a security assessment report. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control CA-2.d

#### Security Assessments

**CA-2.d** The organization provides the results of the security control assessment to [Assignment: organization-defined individuals or roles].

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer is responsible for delivering the security assessment results to the required individuals/roles. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control CA-2 (1)

#### Security Assessments | Independent Assessors

**CA-2 (1)** The organization employs assessors or assessment teams with [Assignment: organization-defined level of independence] to conduct security control assessments.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer is responsible for employing independent assessors or assessment teams to conduct security control assessments. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control CA-2 (2)

#### Security Assessments | Specialized Assessments

**CA-2 (2)** The organization includes as part of security control assessments, [Assignment: organization-defined frequency], [Selection: announced; unannounced], [Selection (one or more): in-depth monitoring; vulnerability scanning; malicious user testing; insider threat assessment; performance/load testing; [Assignment: organization-defined other forms of security assessment]].

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer is responsible for the selection of additional testing to be included as part of security control assessments. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control CA-2 (3)

#### Security Assessments | External Organizations

**CA-2 (3)** The organization accepts the results of an assessment of [Assignment: organization-defined information system] performed by [Assignment: organization-defined external organization] when the assessment meets [Assignment: organization-defined requirements].

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer's enterprise-level security assessment and authorization procedures may address acceptance of results from assessments of cloud services offerings (e.g., Azure) performed by an external organization under FedRAMP (e.g., a third party assessment organization (3PAO) or another agency). Azure is assessed by a FedRAMP-approved third party assessment organization (3PAO) to verify compliance with FedRAMP security control and other requirements. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control CA-3.a

#### System Interconnections

**CA-3.a** The organization authorizes connections from the information system to other information systems through the use of Interconnection Security Agreements.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer's enterprise-level security assessment and authorization procedures may address authorization of system interconnections. Note: FedRAMP does not require ISAs between a CSP and a Federal agency. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control CA-3.b

#### System Interconnections

**CA-3.b** The organization documents, for each interconnection, the interface characteristics, security requirements, and the nature of the information communicated.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer's enterprise-level security assessment and authorization procedures may establish requirements to establish system interconnections. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control CA-3.c

#### System Interconnections

**CA-3.c** The organization reviews and updates Interconnection Security Agreements [Assignment: organization-defined frequency].

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer's enterprise-level security assessment and authorization procedures may establish ISA review and update processes. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control CA-3 (3)

#### System Interconnections | Unclassified Non-National Security System Connections

**CA-3 (3)** The organization prohibits the direct connection of an [Assignment: organization-defined unclassified, non-national security system] to an external network without the use of [Assignment; organization-defined boundary protection device].

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer's enterprise-level security assessment and authorization procedures may establish boundary protection requirements for system interconnections. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control CA-3 (5)

#### System Interconnections | Restrictions on External System Connections

**CA-3 (5)** The organization employs [Selection: allow-all, deny-by-exception; deny-all, permit-by-exception] policy for allowing [Assignment: organization-defined information systems] to connect to external information systems.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | Azure Application Gateway and network security groups are deployed to restrict external connectivity to resources deployed by this Azure Blueprint. Rulesets applied to network security groups are configured using a deny-by-default scheme. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control CA-5.a

#### Plan of Action and Milestones

**CA-5.a** The organization develops a plan of action and milestones for the information system to document the organization's planned remedial actions to correct weaknesses or deficiencies noted during the assessment of the security controls and to reduce or eliminate known vulnerabilities in the system.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer is responsible for developing a plan of action and milestones (POA&M) for customer-deployed resources (to include applications, operating systems, databases, and software). |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control CA-5.b

#### Plan of Action and Milestones

**CA-5.b** The organization updates existing plan of action and milestones [Assignment: organization-defined frequency] based on the findings from security controls assessments, security impact analyses, and continuous monitoring activities.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer is responsible for updating POA&M items defined in CA-05.a. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control CA-6.a

#### Security Authorization

**CA-6.a** The organization assigns a senior-level executive or manager as the authorizing official for the information system.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer may rely on an enterprise-level process where authorizing officials are assigned. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control CA-6.b

#### Security Authorization

**CA-6.b** The organization ensures that the authorizing official authorizes the information system for processing before commencing operations.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer may rely on an enterprise-level system authorization process. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control CA-6.c

#### Security Authorization

**CA-6.c** The organization updates the security authorization [Assignment: organization-defined frequency].

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer may rely on an enterprise-level system authorization process. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control CA-7.a

#### Continuous Monitoring

**CA-7.a** The organization develops a continuous monitoring strategy and implements a continuous monitoring program that includes establishment of [Assignment: organization-defined metrics] to be monitored.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer's enterprise-level continuous monitoring program may be sufficient to address this control. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control CA-7.b

#### Continuous Monitoring

**CA-7.b** The organization develops a continuous monitoring strategy and implements a continuous monitoring program that includes establishment of [Assignment: organization-defined frequencies] for monitoring and [Assignment: organization-defined frequencies] for assessments supporting such monitoring.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer's enterprise-level continuous monitoring program may be sufficient to address this control. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control CA-7.c

#### Continuous Monitoring

**CA-7.c** The organization develops a continuous monitoring strategy and implements a continuous monitoring program that includes ongoing security control assessments in accordance with the organizational continuous monitoring strategy.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer's enterprise-level continuous monitoring program may be sufficient to address this control. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control CA-7.d

#### Continuous Monitoring

**CA-7.d** The organization develops a continuous monitoring strategy and implements a continuous monitoring program that includes ongoing security status monitoring of organization-defined metrics in accordance with the organizational continuous monitoring strategy.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer's enterprise-level continuous monitoring program may be sufficient to address this control. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control CA-7.e

#### Continuous Monitoring

**CA-7.e** The organization develops a continuous monitoring strategy and implements a continuous monitoring program that includes correlation and analysis of security-related information generated by assessments and monitoring.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer's enterprise-level continuous monitoring program may be sufficient to address this control. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control CA-7.f

#### Continuous Monitoring

**CA-7.f** The organization develops a continuous monitoring strategy and implements a continuous monitoring program that includes response actions to address results of the analysis of security-related information.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer's enterprise-level continuous monitoring program may be sufficient to address this control. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control CA-7.g

#### Continuous Monitoring

**CA-7.g** The organization develops a continuous monitoring strategy and implements a continuous monitoring program that includes reporting the security status of organization and the information system to [Assignment: organization-defined personnel or roles] [Assignment: organization-defined frequency].

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer's enterprise-level continuous monitoring program may be sufficient to address this control. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control CA-7 (1)

#### Continuous Monitoring | Independent Assessment

**CA-7 (1)** The organization employs assessors or assessment teams with [Assignment: organization-defined level of independence] to monitor the security controls in the information system on an ongoing basis.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer's enterprise-level continuous monitoring program may establish a process for independent assessment of security controls. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control CA-7 (3)

#### Continuous Monitoring | Trend Analyses

**CA-7 (3)** The organization employs trend analyses to determine if security control implementations, the frequency of continuous monitoring activities, and/or the types of activities used in the continuous monitoring process need to be modified based on empirical data.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer's enterprise-level continuous monitoring program may establish a process for trend analysis. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control CA-8

#### Penetration Testing

**CA-8** The organization conducts penetration testing [Assignment: organization-defined frequency] on [Assignment: organization-defined information systems or system components].

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer may rely on an enterprise-level penetration testing assessment. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control CA-8 (1)

#### Penetration Testing | Independent Penetration Agent or Team

**CA-8 (1)** The organization employs an independent penetration agent or penetration team to perform penetration testing on the information system or system components.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer may rely on an enterprise-level penetration testing assessment performed by an independent agent or team. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control CA-9.a

#### Internal System Connections

**CA-9.a** The organization authorizes internal connections of [Assignment: organization-defined information system components or classes of components] to the information system.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer is responsible for authorizing internal connections across customer-deployed resources (e.g., system connections to VMs). |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control CA-9.b

#### Internal System Connections

**CA-9.b** The organization documents, for each internal connection, the interface characteristics, security requirements, and the nature of the information communicated.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer is responsible for documenting the details of each internal connection between the classes/resources defined in CA-09.a. |
| **Provider (Microsoft Azure)** | Not Applicable |

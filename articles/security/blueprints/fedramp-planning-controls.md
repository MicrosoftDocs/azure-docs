---

title: FedRAMP Azure Blueprint Automation - Planning
description: Web Applications for FedRAMP - Planning
services: security
documentationcenter: na
author: jomolesk
manager: mbaldwin
editor: tomsh

ms.assetid: 55032e87-763a-452d-bb22-9c28936d5bb4
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
    
    

# Planning (PL)

## NIST 800-53 Control PL-1

#### Security Planning Policy and Procedures

**PL-1** The organization develops, documents, and disseminates to [Assignment: organization-defined personnel or roles] a security planning policy that addresses purpose, scope, roles, responsibilities, management commitment, coordination among organizational entities, and compliance; and procedures to facilitate the implementation of the security planning policy and associated security planning controls; and reviews and updates the current security planning policy [Assignment: organization-defined frequency]; and security planning procedures [Assignment: organization-defined frequency].

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer's enterprise-level security planning policy and procedures may be sufficient to address this control. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control PL-2.a

#### System Security Plan

**PL-2.a** The organization develops a security plan for the information system that is consistent with the organization's enterprise architecture; explicitly defines the authorization boundary for the system; describes the operational context of the information system in terms of missions and business processes; provides the security categorization of the information system including supporting rationale; describes the operational environment for the information system and relationships with or connections to other information systems; provides an overview of the security requirements for the system; identifies any relevant overlays, if applicable; describes the security controls in place or planned for meeting those requirements including a rationale for the tailoring decisions; and is reviewed and approved by the authorizing official or designated representative prior to plan implementation.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer is responsible for developing a system security plan (SSP) that meets the criteria defined by the target authorization (e.g., FedRAMP). Customers may reference NIST Special Publication 800-18 R1, Guide for Developing Security Plans for Federal Information Systems. The customer SSP should address controls inherited from Microsoft Azure and refer to the Microsoft Azure SSP for implementation details. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control PL-2.b

#### System Security Plan

**PL-2.b** The organization distributes copies of the security plan and communicates subsequent changes to the plan to [Assignment: organization-defined personnel or roles].

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer is responsible for distributing the system security plan. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control PL-2.c

#### System Security Plan

**PL-2.c** The organization reviews the security plan for the information system [Assignment: organization-defined frequency].

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer is responsible for reviewing the system security plan. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control PL-2.d

#### System Security Plan

**PL-2.d** The organization updates the plan to address changes to the information system/environment of operation or problems identified during plan implementation or security control assessments.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer is responsible for updating the system security plan. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control PL-2.e

#### System Security Plan

**PL-2.e** The organization protects the security plan from unauthorized disclosure and modification.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer is responsible for protecting the system security plan. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control PL-2 (3)

#### System Security Plan | Plan / Coordinate With Other Organizational Entities

**PL-2 (3)** The organization plans and coordinates security-related activities affecting the information system with [Assignment: organization-defined individuals or groups] before conducting such activities in order to reduce the impact on other organizational entities.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer is responsible for planning and coordinating security-related activities to reduce the impact on other organizational entities. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control PL-4.a

#### Rules of Behavior

**PL-4.a** The organization establishes and makes readily available to individuals requiring access to the information system, the rules that describe their responsibilities and expected behavior with regard to information and information system usage.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer's enterprise-level rules of behavior may be sufficient to address this control. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control PL-4.b

#### Rules of Behavior

**PL-4.b** The organization receives a signed acknowledgment from such individuals, indicating that they have read, understand, and agree to abide by the rules of behavior, before authorizing access to information and the information system.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer's enterprise-level rules of behavior may be sufficient to address this control. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control PL-4.c

#### Rules of Behavior

**PL-4.c** The organization reviews and updates the rules of behavior [Assignment: organization-defined frequency].

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer's enterprise-level rules of behavior may be sufficient to address this control. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control PL-4.d

#### Rules of Behavior

**PL-4.d** The organization requires individuals who have signed a previous version of the rules of behavior to read and re-sign when the rules of behavior are revised/updated.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer's enterprise-level rules of behavior may be sufficient to address this control. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control PL-4 (1)

#### Rules of Behavior | Social Media and Networking Restrictions

**PL-4 (1)** The organization includes in the rules of behavior, explicit restrictions on the use of social media/networking sites and posting organizational information on public websites.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer's enterprise-level rules of behavior may include restrictions on social media / networking sites. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control PL-8.a

#### Information Security Architecture

**PL-8.a** The organization develops an information security architecture for the information system that describes the overall philosophy, requirements, and approach to be taken with regard to protecting the confidentiality, integrity, and availability of organizational information; describes how the information security architecture is integrated into and supports the enterprise architecture; and describes any information security assumptions about, and dependencies on, external services.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer is responsible for developing an information security architecture for customer-deployed resources. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control PL-8.b

#### Information Security Architecture

**PL-8.b** The organization reviews and updates the information security architecture [Assignment: organization-defined frequency] to reflect updates in the enterprise architecture.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer is responsible for reviewing and updating the information security architecture. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control PL-8.c

#### Information Security Architecture

**PL-8.c** The organization ensures that planned information security architecture changes are reflected in the security plan, the security Concept of Operations (CONOPS), and organizational procurements/acquisitions.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer is responsible for accounting for planned changes to the information security architecture. |
| **Provider (Microsoft Azure)** | Not Applicable |

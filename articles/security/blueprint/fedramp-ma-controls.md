---

title: Web Applications for FedRAMP: Maintenance
description: Web Applications for FedRAMP: Maintenance
services: security
documentationcenter: na
author: jomolesk
manager: mbaldwin
editor: tomsh

ms.assetid: 53acae01-bea9-4570-a9bc-734ff65262ba
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
    
    

# Maintenance (MA)

## NIST 800-53 Control MA-1

#### System Maintenance Policy and Procedures

**MA-1** The organization develops, documents, and disseminates to [Assignment: organization-defined personnel or roles] a system maintenance policy that addresses purpose, scope, roles, responsibilities, management commitment, coordination among organizational entities, and compliance; and procedures to facilitate the implementation of the system maintenance policy and associated system maintenance controls; and reviews and updates the current system maintenance policy [Assignment: organization-defined frequency]; and system maintenance procedures [Assignment: organization-defined frequency].

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer's enterprise-level system maintenance policy and procedures may be sufficient to address this control. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control MA-2.a

#### Controlled Maintenance

**MA-2.a** The organization schedules, performs, documents, and reviews records of maintenance and repairs on information system components in accordance with manufacturer or vendor specifications and/or organizational requirements.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer is responsible for controlled maintenance. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control MA-2.b

#### Controlled Maintenance

**MA-2.b** The organization approves and monitors all maintenance activities, whether performed on site or remotely and whether the equipment is serviced on site or removed to another location.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer is responsible for controlled maintenance. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control MA-2.c

#### Controlled Maintenance

**MA-2.c** The organization requires that [Assignment: organization-defined personnel or roles] explicitly approve the removal of the information system or system components from organizational facilities for off-site maintenance or repairs.

**Responsibilities:** `Azure Only`

|||
|---|---|
| **Customer** | Customers do not have physical access to any system resources in Azure datacenters. |
| **Provider (Microsoft Azure)** | Microsoft Azure requires that property assets (e.g., network device or server) requiring transfer offsite have explicit asset owner approval. |


 ## NIST 800-53 Control MA-2.d

#### Controlled Maintenance

**MA-2.d** The organization sanitizes equipment to remove all information from associated media prior to removal from organizational facilities for off-site maintenance or repairs.

**Responsibilities:** `Azure Only`

|||
|---|---|
| **Customer** | Customers do not have physical access to any system resources in Azure datacenters. |
| **Provider (Microsoft Azure)** | Microsoft Azure's Asset Protection Standard defines the asset handling precautions required for offsite transfer of assets. The Asset Protection Standard requires that data storage assets be cleared/purged in a manner consistent with NIST SP 800-88, Guidelines for Media Sanitization, prior to leaving the datacenter. |


 ## NIST 800-53 Control MA-2.e

#### Controlled Maintenance

**MA-2.e** The organization checks all potentially impacted security controls to verify that the controls are still functioning properly following maintenance or repair actions.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer is responsible for controlled maintenance. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control MA-2.f

#### Controlled Maintenance

**MA-2.f** The organization includes [Assignment: organization-defined maintenance-related information] in organizational maintenance records.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer is responsible for controlled maintenance. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control MA-2 (2).a

#### Controlled Maintenance | Automated Maintenance Activities

**MA-2 (2).a** The organization employs automated mechanisms to schedule, conduct, and document maintenance and repairs.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer is responsible for automating maintenance activities. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control MA-2 (2).b

#### Controlled Maintenance | Automated Maintenance Activities

**MA-2 (2).b** The organization produces up-to date, accurate, and complete records of all maintenance and repair actions requested, scheduled, in process, and completed.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer is responsible for automating maintenance activities. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control MA-3

#### Maintenance Tools

**MA-3** The organization approves, controls, and monitors information system maintenance tools.

**Responsibilities:** `Azure Only`

|||
|---|---|
| **Customer** | Customers do not have physical access to any system resources in Azure datacenters. |
| **Provider (Microsoft Azure)** | Microsoft Azure utilizes several tools to complete maintenance. Software maintenance tools are approved, controlled and maintained through the Microsoft Azure change and release process. <br /> The Site Services team maintains an inventory of approved maintenance tools for use within the datacenter (see MA-3). Maintenance personnel are directed to use the provided maintenance tools. Datacenter management approval is required in order to use tools not provided by the datacenter. Physical hand tools (screwdrivers, wrenches, etc.) are exempt from this control. <br /> Each facility contains a restricted physical lock box or access-controlled room for the storage of specialized maintenance tools, such as fluke ether scopes, fluke fiber channel testers, Ethernet toners, etc. The Site Services team performs routine inventory checks to verify the status of all tools. Access to lock box or maintenance storage room is tracked in the access badge reader logs, which are available in the event of an investigation. |


 ### NIST 800-53 Control MA-3 (1)

#### Maintenance Tools | Inspect Tools

**MA-3 (1)** The organization inspects the maintenance tools carried into a facility by maintenance personnel for improper or unauthorized modifications.

**Responsibilities:** `Azure Only`

|||
|---|---|
| **Customer** | Customers do not have physical access to any system resources in Azure datacenters. |
| **Provider (Microsoft Azure)** | Microsoft Azure's Site Services team maintains an inventory of approved maintenance tools for use within the datacenter (see MA-3 for further details). Maintenance personnel are directed to use the provided maintenance tools. DCM approval is required in order to use tools not provided by the datacenter. |


 ### NIST 800-53 Control MA-3 (2)

#### Maintenance Tools | Inspect Media

**MA-3 (2)** The organization checks media containing diagnostic and test programs for malicious code before the media are used in the information system.

**Responsibilities:** `Azure Only`

|||
|---|---|
| **Customer** | Customers do not have physical access to any system resources in Azure datacenters. |
| **Provider (Microsoft Azure)** | Microsoft Azure prohibits the use of mobile computing or storage media in the production environment of Microsoft Azure datacenters without datacenter management approval. Use of personally owned media is prohibited from being used in the production environment of Microsoft Azure datacenters. <br /> Microsoft Azure has implemented a process to inspect laptops prior to being used in the production environment of Microsoft Azure datacenters. Security officers are trained to challenge personnel using laptops in the production environment to verify that the laptops have undergone and passed inspection. |


 ### NIST 800-53 Control MA-3 (3)

#### Maintenance Tools | Prevent Unauthorized Removal

**MA-3 (3)** The organization prevents the unauthorized removal of maintenance equipment containing organizational information by verifying that there is no organizational information contained on the equipment; sanitizing or destroying the equipment; retaining the equipment within the facility; or obtaining an exemption from [Assignment: organization-defined personnel or roles] explicitly authorizing removal of the equipment from the facility.

**Responsibilities:** `Azure Only`

|||
|---|---|
| **Customer** | Customers do not have physical access to any system resources in Azure datacenters. |
| **Provider (Microsoft Azure)** | Microsoft Azure employs datacenter specific maintenance tools that are retained within the facility and are not removed. Each facility contains a restricted physical lock box or storage room that stores maintenance tools, such as fluke ether scopes, fluke fiber channel testers, Ethernet toners, etc. Access is controlled to the lock box or storage room in DCAT to prohibit unauthorized access to the maintenance tools. <br /> Organizational information is protected during maintenance by the controls in MA-4. To access organizational information, the user must have privileged accounts and authenticators. |


 ## NIST 800-53 Control MA-4.a

#### Nonlocal Maintenance

**MA-4.a** The organization approves and monitors nonlocal maintenance and diagnostic activities.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer is responsible for performing non-local maintenance on customer-deployed operating systems. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control MA-4.b

#### Nonlocal Maintenance

**MA-4.b** The organization allows the use of nonlocal maintenance and diagnostic tools only as consistent with organizational policy and documented in the security plan for the information system.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer is responsible for performing non-local maintenance on customer-deployed operating systems. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control MA-4.c

#### Nonlocal Maintenance

**MA-4.c** The organization employs strong authenticators in the establishment of nonlocal maintenance and diagnostic sessions.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer is responsible for performing non-local maintenance on customer-deployed operating systems. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control MA-4.d

#### Nonlocal Maintenance

**MA-4.d** The organization maintains records for nonlocal maintenance and diagnostic activities.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer is responsible for performing non-local maintenance on customer-deployed operating systems. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control MA-4.e

#### Nonlocal Maintenance

**MA-4.e** The organization terminates session and network connections when nonlocal maintenance is completed.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer is responsible for performing non-local maintenance on customer-deployed operating systems. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control MA-4 (2)

#### Nonlocal Maintenance | Document Nonlocal Maintenance

**MA-4 (2)** The organization documents in the security plan for the information system, the policies and procedures for the establishment and use of nonlocal maintenance and diagnostic connections.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer is responsible for documenting non-local maintenance in the security plan for customer-deployed operating systems. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control MA-4 (3)

#### Nonlocal Maintenance | Comparable Security / Sanitization

**MA-4 (3)** The organization requires that nonlocal maintenance and diagnostic services be performed from an information system that implements a security capability comparable to the capability implemented on the system being serviced; or removes the component to be serviced from the information system prior to nonlocal maintenance or diagnostic services, sanitizes the component (with regard to organizational information) before removal from organizational facilities, and after the service is performed, inspects and sanitizes the component (with regard to potentially malicious software) before reconnecting the component to the information system.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer is responsible for performing all non-local maintenance of customer-deployed operating systems from an information system that has comparable security. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control MA-4 (6)

#### Nonlocal Maintenance | Cryptographic Protection

**MA-4 (6)** The information system implements cryptographic mechanisms to protect the integrity and confidentiality of nonlocal maintenance and diagnostic communications.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer is responsible for implementing cryptographic mechanisms when performing non-local maintenance and diagnostics of customer-deployed operating systems. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control MA-5.a

#### Maintenance Personnel

**MA-5.a** The organization establishes a process for maintenance personnel authorization and maintains a list of authorized maintenance organizations or personnel.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer's enterprise-level system maintenance personnel authorization and escort processes may be sufficient to address this control. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control MA-5.b

#### Maintenance Personnel

**MA-5.b** The organization ensures that non-escorted personnel performing maintenance on the information system have required access authorizations.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer's enterprise-level system maintenance personnel authorization and escort processes may be sufficient to address this control. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control MA-5.c

#### Maintenance Personnel

**MA-5.c** The organization designates organizational personnel with required access authorizations and technical competence to supervise the maintenance activities of personnel who do not possess the required access authorizations.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer's enterprise-level system maintenance personnel authorization and escort processes may be sufficient to address this control. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control MA-5 (1).a

#### Maintenance Personnel | Individuals Without Appropriate Access

**MA-5 (1).a** The organization implements procedures for the use of maintenance personnel that lack appropriate security clearances or are not U.S. citizens, that include the following requirements maintenance personnel who do not have needed access authorizations, clearances, or formal access approvals are escorted and supervised during the performance of maintenance and diagnostic activities on the information system by approved organizational personnel who are fully cleared, have appropriate access authorizations, and are technically qualified; prior to initiating maintenance or diagnostic activities by personnel who do not have needed access authorizations, clearances or formal access approvals, all volatile information storage components within the information system are sanitized and all nonvolatile storage media are removed or physically disconnected from the system and secured.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer's enterprise-level system maintenance personnel authorization and escort processes may be sufficient to address this control. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control MA-5 (1).b

#### Maintenance Personnel | Individuals Without Appropriate Access

**MA-5 (1).b** The organization develops and implements alternate security safeguards in the event an information system component cannot be sanitized, removed, or disconnected from the system.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer's enterprise-level system maintenance personnel authorization and escort processes may be sufficient to address this control. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control MA-6

#### Timely Maintenance

**MA-6** The organization obtains maintenance support and/or spare parts for [Assignment: organization-defined information system components] within [Assignment: organization-defined time period] of failure.

**Responsibilities:** `Azure Only`

|||
|---|---|
| **Customer** | Customers do not have physical access to any system resources in Azure datacenters. |
| **Provider (Microsoft Azure)** | Microsoft Azure datacenters maintain resident maintenance personnel to support critical datacenter infrastructure systems as well as datacenter operations. The teams have identified critical security and technology system components which they maintain spares for onsite. Critical systems are designed in N+1 configurations and services are designed to be resilient. This allows the datacenter management team to meet recovery goals in the event of a service interruption or contingency plan situation. Critical information system services are provisioned from more than one datacenter to prevent an interruption in service due to an incident at one of the datacenters. Customer applications are responsible for deploying to multiple datacenters to provide for redundancy and resiliency. |

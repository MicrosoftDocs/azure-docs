---

title: Web Applications for FedRAMP - Configuration Management
description: Web Applications for FedRAMP - Configuration Management
services: security
documentationcenter: na
author: jomolesk
manager: mbaldwin
editor: tomsh

ms.assetid: 5b953c0d-236f-4b61-b2c5-df2199490c73
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

# Configuration Management (CM)

## NIST 800-53 Control CM-1

#### Configuration Management Policy and Procedures

**CM-1** The organization develops, documents, and disseminates to [Assignment: organization-defined personnel or roles] a configuration management policy that addresses purpose, scope, roles, responsibilities, management commitment, coordination among organizational entities, and compliance; and procedures to facilitate the implementation of the configuration management policy and associated configuration management controls; and reviews and updates the current configuration management policy [Assignment: organization-defined frequency]; and configuration management procedures [Assignment: organization-defined frequency].

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer's enterprise-level configuration management policy and procedures may be sufficient to address this control. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control CM-2

#### Baseline Configuration

**CM-2** The organization develops, documents, and maintains under configuration control, a current baseline configuration of the information system.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The Azure Resource Manager templates and accompanying resources that comprise this Azure Blueprint represent a "configuration as code" baseline for the deployed architecture. The solution is provided though GitHub, which can be used for configuration control. The solution includes a Desired State Configuration (DSC) baseline for each deployed virtual machine. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control CM-2 (1).a

#### Baseline Configuration | Reviews and Updates

**CM-2 (1).a** The organization reviews and updates the baseline configuration of the information system [Assignment: organization-defined frequency].

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer is responsible for reviewing and updating the baseline configuration of customer-deployed resources (to include applications, operating systems, databases, and software). |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control CM-2 (1).b

#### Baseline Configuration | Reviews and Updates

**CM-2 (1).b** The organization reviews and updates the baseline configuration of the information system when required due to [Assignment organization-defined circumstances].

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer is responsible for reviewing and updating the baseline configuration of customer-deployed resources when required. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control CM-2 (1).c

#### Baseline Configuration | Reviews and Updates

**CM-2 (1).c** The organization reviews and updates the baseline configuration of the information system as an integral part of information system component installations and upgrades.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer is responsible for reviewing and updating the baseline configuration of customer-deployed resources when required. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control CM-2 (2)

#### Baseline Configuration | Automation Support for Accuracy / Currency

**CM-2 (2)** The organization employs automated mechanisms to maintain an up-to-date, complete, accurate, and readily available baseline configuration of the information system.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The Azure Resource Manager templates and accompanying resources that comprise this Azure Blueprint represent a "configuration as code" baseline for the deployed architecture. The solution is provided though GitHub, which can be used for configuration control. In the Azure portal, an automation script is available for all deployed resources and provides an always up-to-date representation of those resources.  |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control CM-2 (3)

#### Baseline Configuration | Retention of Previous Configurations

**CM-2 (3)** The organization retains [Assignment: organization-defined previous versions of baseline configurations of the information system] to support rollback.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer is responsible for retaining previous versions of baseline configurations for customer-deployed resources. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control CM-2 (7).a

#### Baseline Configuration | Configure Systems, Components, or Devices for High-Risk Areas

**CM-2 (7).a** The organization issues [Assignment: organization-defined information systems, system components, or devices] with [Assignment: organization-defined configurations] to individuals traveling to locations that the organization deems to be of significant risk.

**Responsibilities:** `Not Applicable`

|||
|---|---|
| **Customer** | There are no customer-controlled physical devices within the scope of systems deployed on Azure. |
| **Provider (Microsoft Azure)** | Microsoft Azure customer content is never stored outside of Microsoft Azure, which is physically located within the continental United States. Microsoft Azure personnel do not travel with devices contained within the Microsoft Azure inventory. As such, this control is not applicable to Microsoft Azure. |


 ### NIST 800-53 Control CM-2 (7).b

#### Baseline Configuration | Configure Systems, Components, or Devices for High-Risk Areas

**CM-2 (7).b** The organization applies [Assignment: organization-defined security safeguards] to the devices when the individuals return.

**Responsibilities:** `Not Applicable`

|||
|---|---|
| **Customer** | There are no customer-controlled physical devices within the scope of systems deployed on Azure. |
| **Provider (Microsoft Azure)** | Microsoft Azure customer content is never stored outside of Microsoft Azure and Microsoft Azure personnel do not travel with devices contained within the Microsoft Azure inventory, thus this control is not applicable. |


 ## NIST 800-53 Control CM-3.a

#### Configuration Change Control

**CM-3.a** The organization determines the types of changes to the information system that are configuration-controlled.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer is responsible for determining what types of changes to customer-deployed resources (to include applications, operating systems, databases, and software) are configuration-controlled. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control CM-3.b

#### Configuration Change Control

**CM-3.b** The organization reviews proposed configuration-controlled changes to the information system and approves or disapproves such changes with explicit consideration for security impact analyses.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer is responsible for reviewing proposed configuration-controlled changes to customer-deployed resources. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control CM-3.c

#### Configuration Change Control

**CM-3.c** The organization documents configuration change decisions associated with the information system.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer is responsible for documenting configuration-controlled changes associated with customer-deployed resources (see CM-03.b). |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control CM-3.d

#### Configuration Change Control

**CM-3.d** The organization implements approved configuration-controlled changes to the information system.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer is responsible for implementing configuration-controlled changes approved in CM-03.b. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control CM-3.e

#### Configuration Change Control

**CM-3.e** The organization retains records of configuration-controlled changes to the information system for [Assignment: organization-defined time period].

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer is responsible for retaining a record of configuration-controlled changes to customer-deployed resources. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control CM-3.f

#### Configuration Change Control

**CM-3.f** The organization audits and reviews activities associated with configuration-controlled changes to the information system.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer is responsible for auditing and reviewing configuration changes. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control CM-3.g

#### Configuration Change Control

**CM-3.g** The organization coordinates and provides oversight for configuration change control activities through [Assignment: organization-defined configuration change control element (e.g., committee, board)] that convenes [Selection (one or more): [Assignment: organization-defined frequency]; [Assignment: organization-defined configuration change conditions]].

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer is responsible for coordinating and providing oversight for configuration change control activities. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control CM-3 (1).a

#### Configuration Change Control | Automated Document / Notification / Prohibition of Changes

**CM-3 (1).a** The organization employs automated mechanisms to document proposed changes to the information system.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer is responsible for employing automated mechanisms to document proposed changes (see CM-03.b). |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control CM-3 (1).b

#### Configuration Change Control | Automated Document / Notification / Prohibition of Changes

**CM-3 (1).b** The organization employs automated mechanisms to notify [Assignment: organized-defined approval authorities] of proposed changes to the information system and request change approval.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer is responsible for employing an automated mechanism to route and request approval for proposed changes to customer-deployed resources. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control CM-3 (1).c

#### Configuration Change Control | Automated Document / Notification / Prohibition of Changes

**CM-3 (1).c** The organization employs automated mechanisms to highlight proposed changes to the information system that have not been approved or disapproved by [Assignment: organization-defined time period].

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer is responsible for employing an automated mechanism to highlight unreviewed change proposals. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control CM-3 (1).d

#### Configuration Change Control | Automated Document / Notification / Prohibition of Changes

**CM-3 (1).d** The organization employs automated mechanisms to prohibit changes to the information system until designated approvals are received.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer is responsible for employing an automated mechanism to prohibit the implementation of unapproved changes to customer-deployed resources. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control CM-3 (1).e

#### Configuration Change Control | Automated Document / Notification / Prohibition of Changes

**CM-3 (1).e** The organization employs automated mechanisms to document all changes to the information system.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer is responsible for employing an automated mechanism to document all implemented changes to customer-deployed resources. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control CM-3 (1).f

#### Configuration Change Control | Automated Document / Notification / Prohibition of Changes

**CM-3 (1).f** The organization employs automated mechanisms to notify [Assignment: organization-defined personnel] when approved changes to the information system are completed.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer is responsible for employing an automated mechanism to provide notifications when approved changes to customer-deployed resources are completed. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control CM-3 (2)

#### Configuration Change Control | Test / Validate / Document Changes

**CM-3 (2)** The organization tests, validates, and documents changes to the information system before implementing the changes on the operational system.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer is responsible for testing, validating, and documenting changes to customer-deployed resources before implementation. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control CM-3 (4)

#### Configuration Change Control | Security Representative

**CM-3 (4)** The organization requires an information security representative to be a member of the [Assignment: organization-defined configuration change control element].

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer is responsible for assigning an information security representative to be a member of the change control element defined in CM-03.g. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control CM-3 (6)

#### Configuration Change Control | Cryptography Management

**CM-3 (6)** The organization ensures that cryptographic mechanisms used to provide [Assignment: organization-defined security safeguards] are under configuration management.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer is responsible for ensuring that cryptographic mechanisms are under configuration management. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control CM-4

#### Security Impact Analysis

**CM-4** The organization analyzes changes to the information system to determine potential security impacts prior to change implementation.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer is responsible for analyzing proposed changes to customer-deployed resources. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control CM-4 (1)

#### Security Impact Analysis | Separate Test Environments

**CM-4 (1)** The organization analyzes changes to the information system in a separate test environment before implementation in an operational environment, looking for security impacts due to flaws, weaknesses, incompatibility, or intentional malice.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer is responsible for analyzing proposed changes to customer-deployed resources in a test environment before implementation in an operational environment. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control CM-5

#### Access Restrictions for Change

**CM-5** The organization defines, documents, approves, and enforces physical and logical access restrictions associated with changes to the information system.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | Azure Active Directory account privileges are implemented using role-based access control by assigning users to roles providing strict control over which users can view and control deployed resources. Active Directory account privileges are implemented using role-based access control by assigning users to security groups. These security groups control the actions that users can take with respect to operating system configuration. These role-based schemes can be extended by the customer to meet mission needs. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control CM-5 (1)

#### Access Restrictions for Change | Automated Access Enforcement / Auditing

**CM-5 (1)** The information system enforces access restrictions and supports auditing of the enforcement actions.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | Azure Active Directory account privileges are implemented using role-based access control by assigning users to roles providing strict control over which users can view and control deployed resources. Active Directory account privileges are implemented using role-based access control by assigning users to security groups. These security groups control the actions that users can take with respect to operating system configuration. All accesses and access attempts are audited. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control CM-5 (2)

#### Access Restrictions for Change | Review System Changes

**CM-5 (2)** The organization reviews information system changes [Assignment: organization-defined frequency] and [Assignment: organization-defined circumstances] to determine whether unauthorized changes have occurred.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer is responsible for reviewing changes to customer-deployed resources to determine whether unauthorized changes have occurred. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control CM-5 (3)

#### Access Restrictions for Change | Signed Components

**CM-5 (3)** The information system prevents the installation of [Assignment: organization-defined software and firmware components] without verification that the component has been digitally signed using a certificate that is recognized and approved by the organization.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | Virtual machines deployed by this Azure Blueprint implement Windows AppLocker to specify which users can install and/or run particular applications. Further, all Windows operating system updates are digitally singed. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control CM-5 (5).a

#### Access Restrictions for Change | Limit Production / Operational Privileges

**CM-5 (5).a** The organization limits privileges to change information system components and system-related information within a production or operational environment.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer is responsible for limiting privileges to make changes within customer-deployed production or operational environments. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control CM-5 (5).b

#### Access Restrictions for Change | Limit Production / Operational Privileges

**CM-5 (5).b** The organization reviews and reevaluates privileges [Assignment: organization-defined frequency].

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer is responsible for reviewing and reevaluating privileges defined in CM-05(05).a. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control CM-6.a

#### Configuration Settings

**CM-6.a** The organization establishes and documents configuration settings for information technology products employed within the information system using [Assignment: organization-defined security configuration checklists] that reflect the most restrictive mode consistent with operational requirements.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | This Azure Blueprint includes a Desired State Configuration (DSC) baseline for each deployed virtual machine. These declarative PowerShell scripts define and configure the resources to which they are applied. The baseline DSC included for resources deployed by this solution can be extended by the customer to meet mission needs. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control CM-6.b

#### Configuration Settings

**CM-6.b** The organization implements the configuration settings.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | This Azure Blueprint includes a Desired State Configuration (DSC) baseline for each deployed virtual machine. The baselines is automatically applied to virtual machines during deployment using the custom script virtual machine extension. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control CM-6.c

#### Configuration Settings

**CM-6.c** The organization identifies, documents, and approves any deviations from established configuration settings for [Assignment: organization-defined information system components] based on [Assignment: organization-defined operational requirements].

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer is responsible for identifying, documenting, and approving any deviations from established configuration settings for customer-deployed resources. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control CM-6.d

#### Configuration Settings

**CM-6.d** The organization monitors and controls changes to the configuration settings in accordance with organizational policies and procedures.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | This Azure Blueprint deploys the Automation DSC. Automation DSC aligns machine configurations with a specific organization-defined configuration. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control CM-6 (1)

#### Configuration Settings | Automated Central Management / Application / Verification

**CM-6 (1)** The organization employs automated mechanisms to centrally manage, apply, and verify configuration settings for [Assignment: organization-defined information system components].

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | This Azure Blueprint deploys Azure Automation DSC. Automation DSC aligns machine configurations with a specific organization-defined configuration and continually monitors for changes. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control CM-6 (2)

#### Configuration Settings | Respond to Unauthorized Changes

**CM-6 (2)** The organization employs [Assignment: organization-defined security safeguards] to respond to unauthorized changes to [Assignment: organization-defined configuration settings].

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | This Azure Blueprint deploys Azure Automation DSC. Part of Azure's Operations Management Suite (OMS), Automation DSC can be configured to generate an alert or to remedy misconfigurations when detected. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control CM-7.a

#### Least Functionality

**CM-7.a** The organization configures the information system to provide only essential capabilities.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The resources deployed by this Azure Blueprint are configured to provide the least functionality for their intended purpose. A Desired State Configuration (DSC) baseline is included for each deployed virtual machine. These declarative PowerShell scripts define and configure the resources to which they are applied. The baseline DSC included for resources deployed by this solution can be extended by the customer to further limit functionality to meet mission needs. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control CM-7.b

#### Least Functionality

**CM-7.b** The organization prohibits or restricts the use of the following functions, ports, protocols, and/or services: [Assignment: organization-defined prohibited or restricted functions, ports, protocols, and/or services].

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | This Azure Blueprint deploys Azure Application Gateway and network security groups to restrict the use of ports and protocols to only those necessary. Application Gateway, network security groups, and DSC baselines for virtual machines can be further configured by the customer to restrict the use of functions, ports, protocols, and services to provide only the functionality intended. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control CM-7 (1).a

#### Least Functionality | Periodic Review

**CM-7 (1).a** The organization reviews the information system [Assignment: organization-defined frequency] to identify unnecessary and/or nonsecure functions, ports, protocols, and services.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer is responsible for reviewing customer-deployed resources (to include applications, operating systems, databases, and software) to identify unnecessary and/or unsecure functions, ports, protocols, and services. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control CM-7 (1).b

#### Least Functionality | Periodic Review

**CM-7 (1).b** The organization disables [Assignment: organization-defined functions, ports, protocols, and services within the information system deemed to be unnecessary and/or nonsecure].

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer is responsible for disabling functions, ports, protocols, and services that have been deemed to be unnecessary or unsecure. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control CM-7 (2)

#### Least Functionality | Prevent Program Execution

**CM-7 (2)** The information system prevents program execution in accordance with [Selection (one or more): [Assignment: organization-defined policies regarding software program usage and restrictions]; rules authorizing the terms and conditions of software program usage].

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer is responsible for preventing program execution in accordance with customer-defined software program usage policies. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control CM-7 (5).a

#### Least Functionality | Authorized Software / Whitelisting

**CM-7 (5).a** The organization identifies [Assignment: organization-defined software programs authorized to execute on the information system].

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer is responsible for identifying authorized software programs. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control CM-7 (5).b

#### Least Functionality | Authorized Software / Whitelisting

**CM-7 (5).b** The organization employs a deny-all, permit-by-exception policy to allow the execution of authorized software programs on the information system.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer is responsible for employing a deny-all, permit-by-exception policy to allow the execution of authorized software programs on customer-deployed resources. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control CM-7 (5).c

#### Least Functionality | Authorized Software / Whitelisting

**CM-7 (5).c** The organization reviews and updates the list of authorized software programs [Assignment: organization-defined frequency].

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer is responsible for reviewing and updating the list of authorized software programs. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control CM-8.a

#### Information System Component Inventory

**CM-8.a** The organization develops and documents an inventory of information system components that accurately reflects the current information system; includes all components within the authorization boundary of the information system; is at the level of granularity deemed necessary for tracking and reporting; and includes [Assignment: organization-defined information deemed necessary to achieve effective information system component accountability].

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | This Azure Blueprint deploys all resources to an Azure Resource Manager resource group. Azure Resource Manager provides an always up-to-date list of deployed resources and can be customized to tag and group resources for inventory management. Resources deployed by this solution are given a specific resource tag that can be associated with the system boundary. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control CM-8.b

#### Information System Component Inventory

**CM-8.b** The organization reviews and updates the information system component inventory [Assignment: organization-defined frequency].

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | This Azure Blueprint deploys all resources to an Azure Resource Manager resource group. Azure Resource Manager provides an always up-to-date list of deployed resources available for review in the Azure portal. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control CM-8 (1)

#### Information System Component Inventory | Updates During Installations / Removals

**CM-8 (1)** The organization updates the inventory of information system components as an integral part of component installations, removals, and information system updates.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | This Azure Blueprint deploys all resources to an Azure Resource Manager resource group. The resources blade in the Azure portal lists all deployed resources, providing an always up-to-date inventory as resources are deployed and removed. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control CM-8 (2)

#### Information System Component Inventory | Automated Maintenance

**CM-8 (2)** The organization employs automated mechanisms to help maintain an up-to-date, complete, accurate, and readily available inventory of information system components.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | This Azure Blueprint deploys all resources to an Azure Resource Manager resource group. The resources blade in the Azure portal lists all deployed resources, providing an always up-to-date inventory as resources are deployed and removed. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control CM-8 (3).a

#### Information System Component Inventory | Automated Unauthorized Component Detection

**CM-8 (3).a** The organization employs automated mechanisms [Assignment: organization-defined frequency] to detect the presence of unauthorized hardware, software, and firmware components within the information system.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer is responsible for employing automated mechanisms to detect the presence of unauthorized software within customer-deployed resources. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control CM-8 (3).b

#### Information System Component Inventory | Automated Unauthorized Component Detection

**CM-8 (3).b** The organization takes the following actions when unauthorized components are detected: [Selection (one or more): disables network access by such components; isolates the components; notifies [Assignment: organization-defined personnel or roles]].

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer is responsible for taking action when unauthorized software is detected. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control CM-8 (4)

#### Information System Component Inventory | Accountability Information

**CM-8 (4)** The organization includes in the information system component inventory information, a means for identifying by [Selection (one or more): name; position; role], individuals responsible/accountable for administering those components.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | This Azure Blueprint deploys all resources to an Azure Resource Manager resource group. Azure resource tags are key / value pairs that can be employed to categorize resources for accountability and/or management purposes. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control CM-8 (5)

#### Information System Component Inventory | No Duplicate Accounting of Components

**CM-8 (5)** The organization verifies that all components within the authorization boundary of the information system are not duplicated in other information system component inventories.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | This Azure Blueprint deploys all resources to an Azure Resource Manager resource group. Azure Resource Manager provides an always up-to-date list of deployed resources. Resources deployed by this solution are given a specific resource tag that can be associated with the system boundary. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control CM-9.a

#### Configuration Management Plan

**CM-9.a** The organization develops, documents, and implements a configuration management plan for the information system that addresses roles, responsibilities, and configuration management processes and procedures.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer is responsible for developing, documenting, and implementing a configuration management plan for customer-deployed resources. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control CM-9.b

#### Configuration Management Plan

**CM-9.b** The organization develops, documents, and implements a configuration management plan for the information system that establishes a process for identifying configuration items throughout the system development life cycle and for managing the configuration of the configuration items.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer is responsible for developing, documenting, and implementing a configuration management plan for customer-deployed resources. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control CM-9.c

#### Configuration Management Plan

**CM-9.c** The organization develops, documents, and implements a configuration management plan for the information system that defines the configuration items for the information system and places the configuration items under configuration management.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer is responsible for developing, documenting, and implementing a configuration management plan for customer-deployed resources. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control CM-9.d

#### Configuration Management Plan

**CM-9.d** The organization develops, documents, and implements a configuration management plan for the information system that protects the configuration management plan from unauthorized disclosure and modification.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer is responsible for developing, documenting, and implementing a configuration management plan for customer-deployed resources. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control CM-10.a

#### Software Usage Restrictions

**CM-10.a** The organization uses software and associated documentation in accordance with contract agreements and copyright laws.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | Windows and SQL Server licenses are included for the resources deployed by this Azure Blueprint. This is a built-in feature of Azure. Organizations with existing software license agreements may consider deploying alternative license models. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control CM-10.b

#### Software Usage Restrictions

**CM-10.b** The organization tracks the use of software and associated documentation protected by quantity licenses to control copying and distribution.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | Windows and SQL Server licenses are included for the resources deployed by this Azure Blueprint. The user is not required to separately track use of the licenses. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control CM-10.c

#### Software Usage Restrictions

**CM-10.c** The organization controls and documents the use of peer-to-peer file sharing technology to ensure that this capability is not used for the unauthorized distribution, display, performance, or reproduction of copyrighted work.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | There is no peer-to-peer file sharing capability deployed by this Azure Blueprint. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control CM-10 (1)

#### Software Usage Restrictions | Open Source Software

**CM-10 (1)** The organization establishes the following restrictions on the use of open source software: [Assignment: organization-defined restrictions].

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer's enterprise-level configuration management policy may address restrictions on the use of open source software. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control CM-11.a

#### User-Installed Software

**CM-11.a** The organization establishes [Assignment: organization-defined policies] governing the installation of software by users.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer is responsible for establishing a policy governing the installation of software on customer-deployed resources by users. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control CM-11.b

#### User-Installed Software

**CM-11.b** The organization enforces software installation policies through [Assignment: organization-defined methods].

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer is responsible for enforcing software installation policies. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control CM-11.c

#### User-Installed Software

**CM-11.c** The organization monitors policy compliance at [Assignment: organization-defined frequency].

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer is responsible for monitoring the compliance of customer-deployed resources with the policies identified in CM-11.a. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control CM-11 (1)

#### User-Installed Software | Alerts for Unauthorized Installations

**CM-11 (1)** The information system alerts [Assignment: organization-defined personnel or roles] when the unauthorized installation of software is detected.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer is responsible for providing alerts when the unauthorized installation of software is detected. |
| **Provider (Microsoft Azure)** | Not Applicable |


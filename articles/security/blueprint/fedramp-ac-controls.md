---

title: Web Applications for FedRAMP: Access Control
description: Web Applications for FedRAMP: Access Control
services: security
documentationcenter: na
author: jomolesk
manager: mbaldwin
editor: tomsh

ms.assetid: f7e6cd8f-b2df-4db6-8332-de97d86c5281
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
    
    

# Access Control (AC)

## NIST 800-53 Control AC-1

#### Access Control Policy and Procedures

**AC-1** The organization develops, documents, and disseminates to [Assignment: organization-defined personnel or roles] an access control policy that addresses purpose, scope, roles, responsibilities, management commitment, coordination among organizational entities, and compliance; and procedures to facilitate the implementation of the access control policy and associated access controls; and reviews and updates the current access control policy [Assignment: organization-defined frequency]; and access control procedures [Assignment: organization-defined frequency].

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer's enterprise-level access control policy and procedures may be sufficient to address this control. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control AC-2.a

#### Account Management

**AC-2.a** The organization identifies and selects the following types of information system accounts to support organizational missions/business functions: [Assignment: organization-defined information system account types].

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | This Azure Blueprint relies on and implements the following system account types: Azure Active Directory users (used to deploy the solution and manage access to Azure resources), Windows OS users (managed by Active Directory), SQL Server service account. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control AC-2.b

#### Account Management

**AC-2.b** The organization assigns account managers for information system accounts.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer is responsible for assigning managers to the accounts identified in AC-02.a. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control AC-2.c

#### Account Management

**AC-2.c** The organization establishes conditions for group and role membership.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer is responsible for establishing role and group membership criteria for customer-controlled account types (see AC-02.a). |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control AC-2.d

#### Account Management

**AC-2.d** The organization specifies authorized users of the information system, group and role membership, and access authorizations (i.e., privileges) and other attributes (as required) for each account.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer may rely on an established enterprise-level account authorization process. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control AC-2.e

#### Account Management

**AC-2.e** The organization requires approvals by [Assignment: organization-defined personnel or roles] for requests to create information system accounts.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer may rely on an established enterprise-level account authorization process. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control AC-2.f

#### Account Management

**AC-2.f** The organization creates, enables, modifies, disables, and removes information system accounts in accordance with [Assignment: organization-defined procedures or conditions].

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer may rely on an established enterprise-level account management process. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control AC-2.g

#### Account Management

**AC-2.g** The organization monitors the use of information system accounts.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | This Azure Blueprint implements the OMS Security and Audit solution's Identity and Access dashboard. This dashboard enables account managers to monitor use of information system accounts. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control AC-2.h

#### Account Management

**AC-2.h** The organization notifies account managers when accounts are no longer required; when users are terminated or transferred; and when individual information system usage or need-to-know changes.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer's enterprise-level access control procedures may establish a process to notify the appropriate account manager when an account is no longer needed. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control AC-2.i

#### Account Management

**AC-2.i** The organization authorizes access to the information system based on a valid access authorization; intended system usage; and other attributes as required by the organization or associated missions/business functions.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer's enterprise-level access control procedures may establish an access authorization process. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control AC-2.j

#### Account Management

**AC-2.j** The organization reviews accounts for compliance with account management requirements [Assignment: organization-defined frequency].

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer is responsible for reviewing customer-controlled accounts at the required frequency to determine if accounts are compliant with all organization requirements. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control AC-2.k

#### Account Management

**AC-2.k** The organization establishes a process for reissuing shared/group account credentials (if deployed) when individuals are removed from the group.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer's enterprise-level access control procedures may establish a process for managing group account credentials. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control AC-2 (1)

#### Account Management | Automated System Account Management

**AC-2 (1)** The organization employs automated mechanisms to support the management of information system accounts.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | This Azure Blueprint implements the OMS Security and Audit solution's Identity and Access dashboard. This dashboard enable account managers to monitor use of information system accounts. OMS can be configured to send alerts when atypical activity is suspected or other predefined events occur. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control AC-2 (2)

#### Account Management | Removal of Temporary / Emergency Accounts

**AC-2 (2)** The information system automatically [Selection: removes; disables] temporary and emergency accounts after [Assignment: organization-defined time period for each type of account].

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | This Azure Blueprint does not deploy temporary or emergency accounts. If not manually disabled, the deployed domain controller automatically disables all inactive accounts after 35 days. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control AC-2 (3)

#### Account Management | Disable Inactive Accounts

**AC-2 (3)** The information system automatically disables inactive accounts after [Assignment: organization-defined time period].

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The domain controller deployed by this Azure Blueprint is configured to disable all user accounts after 35 days of inactivity. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control AC-2 (4)

#### Account Management | Automated Audit Actions

**AC-2 (4)** The information system automatically audits account creation, modification, enabling, disabling, and removal actions and notifies,  [Assignment: organization-defined personnel or roles].

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | This Azure Blueprint implements the following system account types: Azure Active Directory users, Windows OS users, SQL Server service account. Azure Active Directory account management actions generate an event in the Azure activity log; OS-level account management actions generate an event in the system log. These logs collected by Log Analytics and stored in the OMS repository. OMS can be configured to send alerts when predefined events occur.  |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control AC-2 (5)

#### Account Management | Inactivity Logout

**AC-2 (5)** The organization requires that users log out when [Assignment: organization-defined time-period of expected inactivity or description of when to log out].

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer's enterprise-level access control policy may establish a policy that users log out when they anticipate to be inactive for a period of time (or other factors). |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control AC-2 (7).a

#### Account Management | Role-Based Schemes

**AC-2 (7).a** The organization establishes and administers privileged user accounts in accordance with a role-based access scheme that organizes allowed information system access and privileges into roles.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | This Azure Blueprint implements the following system account types: Azure Active Directory users, Windows OS users, SQL Server service account. Azure Active Directory account privileges are implemented using role-based access control by assigning users to roles; Active Directory account privileges are implemented using role-based access control by assigning users to security groups. These role-based schemes can be extended by the customer to meet mission needs. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control AC-2 (7).b

#### Account Management | Role-Based Schemes

**AC-2 (7).b** The organization monitors privileged role assignments.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | This Azure Blueprint implements the OMS Security and Audit Solution's Identity and Access Dashboard. This dashboard enables account managers to monitor use of information system accounts. This solution can be queried to report privileged role assignments. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control AC-2 (7).c

#### Account Management | Role-Based Schemes

**AC-2 (7).c** The organization takes [assignment: organization-defined actions] when privileged role assignments are no longer appropriate.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer is responsible for taking action on customer-controlled accounts when privileged role assignments are no longer appropriate. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control AC-2 (9)

#### Account Management | Restrictions on Use of Shared / Group Accounts

**AC-2 (9)** The organization only permits the use of shared/group accounts that meet [Assignment: organization-defined conditions for establishing shared/group accounts].

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | No shared/group accounts are enabled on resources deployed by this Azure Blueprint. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control AC-2 (10)

#### Account Management | Shared / Group Account Credential Termination

**AC-2 (10)** The information system terminates shared/group account credentials when members leave the group.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | No shared/group accounts are enabled on resources deployed by this Azure Blueprint. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control AC-2 (11)

#### Account Management | Usage Conditions

**AC-2 (11)** The information system enforces [Assignment: organization-defined circumstances and/or usage conditions] for [Assignment: organization-defined information system accounts].

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | This Azure Blueprint deploys a domain controller to which all deployed virtual machines are joined. A group policy may be established in Active Directory and configured to implement time-of-day restrictions or other account usage conditions. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control AC-2 (12).a

#### Account Management | Account Monitoring / Atypical Usage

**AC-2 (12).a** The organization monitors information system accounts for [Assignment: organization-defined atypical usage].

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | This Azure Blueprint implements the OMS Security and Audit solution's Identity and Access dashboard. This dashboard enables account managers to monitor access attempts against deployed resources. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control AC-2 (12).b

#### Account Management | Account Monitoring / Atypical Usage

**AC-2 (12).b** The organization reports atypical usage of information system accounts to [Assignment: organization-defined personnel or roles].

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | This Azure Blueprint implements the OMS Security and Audit solution's Identity and Access dashboard. This dashboard enable account managers to monitor access attempts against deployed resources. This solution can be configured to send alerts when atypical activity is suspected or other predefined events occur. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control AC-2 (13)

#### Account Management | Disable Accounts for High-Risk Individuals

**AC-2 (13)** The organization disables accounts of users posing a significant risk within [Assignment: organization-defined time period] of discovery of the risk.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer's enterprise-level access control policy and procedures may establish conditions for disabling accounts for users posing a significant risk to the organization. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control AC-3

#### Access Enforcement

**AC-3** The information system enforces approved authorizations for logical access to information and system resources in accordance with applicable access control policies.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | This Azure Blueprint enforces logical access authorizations using role-based access control enforced by Azure Active Directory by assigning users to roles, Active Directory by assigning users to security groups, and Windows OS-level controls. Azure Active Directory roles assigned to users or groups control logical access  to resources within Azure at the resource, group, or subscription level. Active Directory security groups control logical access to OS-level resources and functions. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control AC-4

#### Information Flow Enforcement

**AC-4** The information system enforces approved authorizations for controlling the flow of information within the system and between interconnected systems based on [Assignment: organization-defined information flow control policies].

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | This Azure Blueprint enforces information flow restrictions through the use of network security groups applied to the subnets in which resources are deployed, Application Gateway, and load balancer. Network security groups ensure that information flow is controlled between resources based on approved rules. Application Gateway and load balancer dynamically route traffic to specific resources based on approved roles. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control AC-4 (8)

#### Information Flow Enforcement | Security Policy Filters

**AC-4 (8)** The information system enforces information flow control using [Assignment: organization-defined security policy filters] as a basis for flow control decisions for [Assignment: organization-defined information flows].

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer is responsible for enforcing information flow control within customer-deployed resources. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control AC-4 (21)

#### Information Flow Enforcement | Physical / Logical Separation of Information Flows

**AC-4 (21)** The information system separates information flows logically or physically using [Assignment: organization-defined mechanisms and/or techniques] to accomplish [Assignment: organization-defined required separations by types of information].

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer is responsible for separating information flows within customer-deployed resources. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control AC-5.a

#### Separation of Duties

**AC-5.a** The organization separates [Assignment: organization-defined duties of individuals].

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer is responsible for the separation of duties across customer-controlled accounts. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control AC-5.b

#### Separation of Duties

**AC-5.b** The organization documents separation of duties of individuals.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer is responsible for documenting the separation of duties across customer-controlled accounts. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control AC-5.c

#### Separation of Duties

**AC-5.c** The organization defines information system access authorizations to support separation of duties.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | This Azure Blueprint implements role-based access control which can be configured to separate duties according to organization requirements. Azure Active Directory account privileges are implemented using role-based access control by assigning users to roles; Active Directory account privileges are implemented using role-based access control by assigning users to security groups. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control AC-6

#### Least Privilege

**AC-6** The organization employs the principle of least privilege, allowing only authorized accesses for users (or processes acting on behalf of users) which are necessary to accomplish assigned tasks in accordance with organizational missions and business functions.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | This Azure Blueprint implements role-based access control to restrict users to only privileges explicitly assigned. Azure Active Directory account privileges are implemented using role-based access control by assigning users to roles; Active Directory account privileges are implemented using role-based access control by assigning users to security groups.  |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control AC-6 (1)

#### Least Privilege | Authorize Access to Security Functions

**AC-6 (1)** The organization explicitly authorizes access to [Assignment: organization-defined security functions (deployed in hardware, software, and firmware) and security-relevant information].

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer's enterprise-level access control procedures may establish an access authorization process that includes access to security functions. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control AC-6 (2)

#### Least Privilege | Non-Privileged Access for Nonsecurity Functions

**AC-6 (2)** The organization requires that users of information system accounts, or roles, with access to [Assignment: organization-defined security functions or security-relevant information], use non-privileged accounts or roles, when accessing nonsecurity functions.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer's enterprise-level access control policy may require users to use non-privileged accounts when accessing nonsecurity functions. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control AC-6 (3)

#### Least Privilege | Network Access to Privileged Commands

**AC-6 (3)** The organization authorizes network access to [Assignment: organization-defined privileged commands] only for [Assignment: organization-defined compelling operational needs] and documents the rationale for such access in the security plan for the information system.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer's enterprise-level access control policy may define privileged commands that may be accessed over a network. Note: Customers have no physical access to Azure infrastructure. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control AC-6 (5)

#### Least Privilege | Privileged Accounts

**AC-6 (5)** The organization restricts privileged accounts on the information system to [Assignment: organization-defined personnel or roles].

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer's enterprise-level access control policy may define restrictions for the use of privileged accounts. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control AC-6 (7).a

#### Least Privilege | Review of User Privileges

**AC-6 (7).a** The organization reviews [Assignment: organization-defined frequency] the privileges assigned to [Assignment: organization-defined roles or classes of users] to validate the need for such privileges.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer is responsible for reviewing user privileges of customer-controlled accounts. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control AC-6 (7).b

#### Least Privilege | Review of User Privileges

**AC-6 (7).b** The organization reassigns or removes privileges, if necessary, to correctly reflect organizational mission/business needs.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer is responsible for reassigning or removing privileges for customer-controlled accounts when appropriate. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control AC-6 (8)

#### Least Privilege | Privilege Levels for Code Execution

**AC-6 (8)** The information system prevents [Assignment: organization-defined software] from executing at higher privilege levels than users executing the software.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | This Azure Blueprint implements role-based access control to restrict users to only privileges explicitly assigned. Virtual machine OS-level protections do not allow software to execute at a higher privilege level than users executing the software. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control AC-6 (9)

#### Least Privilege | Auditing Use of Privileged Functions

**AC-6 (9)** The information system audits the execution of privileged functions.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | This Azure Blueprint implements the Log Analytics service in OMS. Deployed VMs and Azure diagnostics storage accounts are connected sources to Log Analytics ensuring that execution of privileged functions is audited. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control AC-6 (10)

#### Least Privilege | Prohibit Non-Privileged Users From Executing Privileged Functions

**AC-6 (10)** The information system prevents non-privileged users from executing privileged functions to include disabling, circumventing, or altering implemented security safeguards/countermeasures.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | This Azure Blueprint implements role-based access control to restrict users to only privileges explicitly assigned.  |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control AC-7.a

#### Unsuccessful Logon Attempts

**AC-7.a** The information system enforces a limit of [Assignment: organization-defined number] consecutive invalid logon attempts by a user during a [Assignment: organization-defined time period].

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The Azure portal limits consecutive invalid logon attempts by users. A group policy is applied at the operating system level for all virtual machines deployed by this Azure Blueprint. The policy limits consecutive invalid logon attempts by users to not more than three within a 15 minute period. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control AC-7.b

#### Unsuccessful Logon Attempts

**AC-7.b** The information system automatically [Selection: locks the account/node for an [Assignment: organization-defined time period]; locks the account/node until released by an administrator; delays next logon prompt according to [Assignment: organization-defined delay algorithm]] when the maximum number of unsuccessful attempts is exceeded.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The Azure portal locks accounts after consecutive invalid logon attempts by users. A group policy is applied at the operating system level for all virtual machines deployed by this Azure Blueprint. The policy locks accounts for three hours after three consecutive invalid logon attempts by users. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control AC-7 (2)

#### Unsuccessful Logon Attempts | Purge / Wipe Mobile Device

**AC-7 (2)** The information system purges/wipes information from [Assignment: organization-defined mobile devices] based on [Assignment: organization-defined purging/wiping requirements/techniques] after [Assignment: organization-defined number] consecutive, unsuccessful device logon attempts.

**Responsibilities:** `Not Applicable`

|||
|---|---|
| **Customer** | Mobile devices are not within the scope of systems deployed on Azure. |
| **Provider (Microsoft Azure)** | Microsoft Azure does not allow mobile devices within the Azure boundary. As such, this control is not applicable to Microsoft Azure. |


 ## NIST 800-53 Control AC-8.a

#### System Use Notification

**AC-8.a** The information system displays to users [Assignment: organization-defined system use notification message or banner] before granting access to the system that provides privacy and security notices consistent with applicable federal laws, Executive Orders, directives, policies, regulations, standards, and guidance and states that users are accessing a U.S. Government information system; information system usage may be monitored, recorded, and subject to audit; unauthorized use of the information system is prohibited and subject to criminal and civil penalties; and use of the information system indicates consent to monitoring and recording.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | This Azure Blueprint deploys a domain controller to which all deployed virtual machines are joined. A group policy implements a system use notification that is displayed to users prior to login. Note: The Azure Blueprint implements an example system use notification. The customer must edit this text to meet organization and/or regulatory body requirements. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control AC-8.b

#### System Use Notification

**AC-8.b** The information system retains the notification message or banner on the screen until users acknowledge the usage conditions and take explicit actions to log on to or further access the information system.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | This Azure Blueprint deploys a domain controller to which all deployed virtual machines are joined. A group policy implements a system use notification that is displayed to users prior to logon. The user must acknowledge the notification in order to log in. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control AC-8.c

#### System Use Notification

**AC-8.c** The information system for publicly accessible systems displays system use information [Assignment: organization-defined conditions], before granting further access; displays references, if any, to monitoring, recording, or auditing that are consistent with privacy accommodations for such systems that generally prohibit those activities; and includes a description of the authorized uses of the system.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer is responsible for displaying a system use notification on all publicly accessible customer-deployed resources. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control AC-10

#### Concurrent Session Control

**AC-10** The information system limits the number of concurrent sessions for each [Assignment: organization-defined account and/or account type] to [Assignment: organization-defined number].

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | An operating system policy is implemented for virtual machines deployed by this Azure Blueprint. The policy implements concurrent session restrictions (two sessions). |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control AC-11.a

#### Session Lock

**AC-11.a** The information system prevents further access to the system by initiating a session lock after [Assignment: organization-defined time period] of inactivity or upon receiving a request from a user.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | This Azure Blueprint deploys a domain controller to which all deployed virtual machines are joined. A group policy implements an inactivity lock for RDP sessions. Users may manually initiate the lock. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control AC-11.b

#### Session Lock

**AC-11.b** The information system retains the session lock until the user reestablishes access using established identification and authentication procedures.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | This Azure Blueprint deploys a domain controller to which all deployed virtual machines are joined. A group policy implements an inactivity lock for RDP sessions. Users must reauthenticate to unlock the session.  |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control AC-11 (1)

#### Session Lock | Pattern-Hiding Displays

**AC-11 (1)** The information system conceals, via the session lock, information previously visible on the display with a publicly viewable image.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | This Azure Blueprint deploys a domain controller to which all deployed virtual machines are joined. A group policy implements an inactivity lock for RDP sessions. The session lock conceals information previously visible. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control AC-12

#### Session Termination

**AC-12** The information system automatically terminates a user session after [Assignment: organization-defined conditions or trigger events requiring session disconnect].

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The Remote Desktop session host configuration for the Windows virtual machines deployed by this Azure Blueprint can be configured to meet organization session termination requirements. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control AC-12 (1).a

#### Session Termination | User-Initiated Logouts / Message Displays

**AC-12 (1).a** The information system provides a logout capability for user-initiated communications sessions whenever authentication is used to gain access to [Assignment: organization-defined information resources].

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The Azure portal and virtual machine operating systems deployed by this Azure Blueprint enable uses to initiate a logout. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control AC-12 (1).b

#### Session Termination | User-Initiated Logouts / Message Displays

**AC-12 (1).b** The information system displays an explicit logout message to users indicating the reliable termination of authenticated communications sessions.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The Azure portal and virtual machine operating systems deployed by this Azure Blueprint enable uses to initiate a logout. The logout process provides indication to the users that the session has been terminated. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control AC-14.a

#### Permitted Actions Without Identification or Authentication

**AC-14.a** The organization identifies [Assignment: organization-defined user actions] that can be performed on the information system without identification or authentication consistent with organizational missions/business functions.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer is responsible for identifying actions that can be performed on the customer-deployed resources without identification or authentication (e.g., such as viewing a publicly accessible web page). |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control AC-14.b

#### Permitted Actions Without Identification or Authentication

**AC-14.b** The organization documents and provides supporting rationale in the security plan for the information system, user actions not requiring identification or authentication.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer is responsible for providing documentation for user actions not requiring identification or authentication on customer-deployed resources. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control AC-17.a

#### Remote Access

**AC-17.a** The organization establishes and documents usage restrictions, configuration/connection requirements, and implementation guidance for each type of remote access allowed.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer's enterprise-level access control policy may define remote access usage restrictions. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control AC-17.b

#### Remote Access

**AC-17.b** The organization authorizes remote access to the information system prior to allowing such connections.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer's enterprise-level access control procedures may establish a remote access authorization process. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control AC-17 (1)

#### Remote Access | Automated Monitoring / Control

**AC-17 (1)** The information system monitors and controls remote access methods.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | This Azure Blueprint provides remote access to the information system through the Azure portal, through remote desktop connection via a jumpbox, and through a customer-implemented web application. Accesses through the Azure portal and remote desktop sessions are audited and can be monitored through OMS. The customer must implement remote access controls, as necessary, to the web application. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control AC-17 (2)

#### Remote Access | Protection of Confidentiality / Integrity Using Encryption

**AC-17 (2)** The information system implements cryptographic mechanisms to protect the confidentiality and integrity of remote access sessions.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | Remote access to resources deployed by this Azure Blueprint, including the Azure portal, remote desktop connection, and web application gateway, are secured using TLS. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control AC-17 (3)

#### Remote Access | Managed Access Control Points

**AC-17 (3)** The information system routes all remote accesses through [Assignment: organization-defined number] managed network access control points.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | Remote access to the notional web application deployed by this Azure Blueprint is through an application gateway. Remote access to all other resources is through a jumpbox. There are no other publicly accessible endpoints. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control AC-17 (4).a

#### Remote Access | Privileged Commands / Access

**AC-17 (4).a** The organization authorizes the execution of privileged commands and access to security-relevant information via remote access only for [Assignment: organization-defined needs].

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer's enterprise-level access control policy may define privileged commands that may be accessed remotely and include a rationale. Note: Customers have no direct network access to Azure infrastructure. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control AC-17 (4).b

#### Remote Access | Privileged Commands / Access

**AC-17 (4).b** The organization documents the rationale for such access in the security plan for the information system.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer's enterprise-level access control policy may define privileged commands that may be accessed remotely and include a rationale. Note: Customers have no direct network access to Azure infrastructure. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control AC-17 (9)

#### Remote Access | Disconnect / Disable Access

**AC-17 (9)** The organization provides the capability to expeditiously disconnect or disable remote access to the information system within [Assignment: organization-defined time period].

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | This Azure Blueprint provides remote access to the information system through the Azure portal, through remote desktop connection via a jumpbox, and through a web application. If an Azure Active Directory account is disabled or removed, Azure portal access is disconnected immediately. Similarly, if a virtual machine OS-level account is disabled or removed, remote desktop access via the jumpbox is disconnected immediately. Customers must implement remote access disconnect for the web application. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control AC-18.a

#### Wireless Access

**AC-18.a** The organization establishes usage restrictions, configuration/connection requirements, and implementation guidance for wireless access.

**Responsibilities:** `Azure Only`

|||
|---|---|
| **Customer** | There is no wireless access within the scope of systems deployed on Azure. |
| **Provider (Microsoft Azure)** | Microsoft Azure establishes usage restrictions, configuration/connection requirements, and implementation guidance for wireless access via the Network Security Standard, which explicitly prohibits the use of wireless in the Microsoft Azure environment. |


 ## NIST 800-53 Control AC-18.b

#### Wireless Access

**AC-18.b** The organization authorizes wireless access to the information system prior to allowing such connections.

**Responsibilities:** `Azure Only`

|||
|---|---|
| **Customer** | There is no wireless access within the scope of systems deployed on Azure. |
| **Provider (Microsoft Azure)** | Microsoft Azure does not allow wireless access within Microsoft Azure datacenters. |


 ### NIST 800-53 Control AC-18 (1)

#### Wireless Access | Authentication and Encryption

**AC-18 (1)** The information system protects wireless access to the system using authentication of [Selection (one or more): users; devices] and encryption.

**Responsibilities:** `Azure Only`

|||
|---|---|
| **Customer** | There is no wireless access within the scope of systems deployed on Azure. |
| **Provider (Microsoft Azure)** | Microsoft Azure does not allow wireless access within the Microsoft Azure environment. |


 ### NIST 800-53 Control AC-18 (3)

#### Wireless Access | Disable Wireless Networking

**AC-18 (3)** The organization disables, when not intended for use, wireless networking capabilities internally embedded within information system components prior to issuance and deployment.

**Responsibilities:** `Azure Only`

|||
|---|---|
| **Customer** | There is no wireless access within the scope of systems deployed on Azure. |
| **Provider (Microsoft Azure)** | Microsoft Azure does not allow wireless access within the Microsoft Azure environment. |


 ### NIST 800-53 Control AC-18 (4)

#### Wireless Access | Restrict Configurations by Users

**AC-18 (4)** The organization identifies and explicitly authorizes users allowed to independently configure wireless networking capabilities.

**Responsibilities:** `Azure Only`

|||
|---|---|
| **Customer** | There is no wireless access within the scope of systems deployed on Azure. |
| **Provider (Microsoft Azure)** | Microsoft Azure does not allow wireless access within the Microsoft Azure environment. |


 ### NIST 800-53 Control AC-18 (5)

#### Wireless Access | Antennas / Transmission Power Levels

**AC-18 (5)** The organization selects radio antennas and calibrates transmission power levels to reduce the probability that usable signals can be received outside of organization-controlled boundaries.

**Responsibilities:** `Azure Only`

|||
|---|---|
| **Customer** | There is no wireless access within the scope of systems deployed on Azure. |
| **Provider (Microsoft Azure)** | Microsoft Azure does not allow wireless access within the Microsoft Azure environment. |


 ## NIST 800-53 Control AC-19.a

#### Access Control for Mobile Devices

**AC-19.a** The organization establishes usage restrictions, configuration requirements, connection requirements, and implementation guidance for organization-controlled mobile devices.

**Responsibilities:** `Not Applicable`

|||
|---|---|
| **Customer** | There are no customer-controlled mobile devices within the scope of systems deployed on Azure. |
| **Provider (Microsoft Azure)** | Microsoft Azure does not allow mobile devices within the Azure boundary. As such, this control is not applicable to Microsoft Azure. |


 ## NIST 800-53 Control AC-19.b

#### Access Control for Mobile Devices

**AC-19.b** The organization authorizes the connection of mobile devices to organizational information systems.

**Responsibilities:** `Not Applicable`

|||
|---|---|
| **Customer** | There are no customer-controlled mobile devices within the scope of systems deployed on Azure. |
| **Provider (Microsoft Azure)** | Microsoft Azure does not allow mobile devices within the Azure boundary. As such, this control is not applicable to Microsoft Azure. |


 ### NIST 800-53 Control AC-19 (5)

#### Access Control for Mobile Devices | Full Device / Container-Based  Encryption

**AC-19 (5)** The organization employs [Selection: full-device encryption; container encryption] to protect the confidentiality and integrity of information on [Assignment: organization-defined mobile devices].

**Responsibilities:** `Not Applicable`

|||
|---|---|
| **Customer** | There are no customer-controlled mobile devices within the scope of systems deployed on Azure. |
| **Provider (Microsoft Azure)** | Microsoft Azure does not allow mobile devices within the Azure boundary. As such, this control is not applicable to Microsoft Azure. |


 ## NIST 800-53 Control AC-20.a

#### Use of External Information Systems

**AC-20.a** The organization establishes terms and conditions, consistent with any trust relationships established with other organizations owning, operating, and/or maintaining external information systems, allowing authorized individuals to access the information system from external information systems.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer's enterprise-level access control policy may include a provision regarding the use of cloud service offerings under FedRAMP. Azure has been granted a provisional authorization to operate (P-ATO) by the FedRAMP Joint Authorization Board (JAB) enabling acquisition use of Azure cloud services by government agencies. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control AC-20.b

#### Use of External Information Systems

**AC-20.b** The organization establishes terms and conditions, consistent with any trust relationships established with other organizations owning, operating, and/or maintaining external information systems, allowing authorized individuals to process, store, or transmit organization-controlled information using external information systems.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer's enterprise-level access control policy may include a provision regarding the use of cloud service offerings under FedRAMP. Azure has been granted a provisional authorization to operate (P-ATO) by the FedRAMP Joint Authorization Board (JAB) enabling acquisition use of Azure cloud services by government agencies. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control AC-20 (1)

#### Use of External Information Systems | Limits on Authorized Use

**AC-20 (1)** The organization permits authorized individuals to use an external information system to access the information system or to process, store, or transmit organization-controlled information only when the organization verifies the implementation of required security controls on the external system as specified in the organization's information security policy and security plan; or retains approved information system connection or processing agreements with the organizational entity hosting the external information system.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer's enterprise-level information technology group may verify cloud service provider compliance with organization information security requirements and grant enterprise-wide approval to use associated cloud service offerings. Azure has been granted a provisional authorization to operate (P-ATO) by the FedRAMP Joint Authorization Board (JAB). Azure is assessed by a FedRAMP-approved third party assessment organization (3PAO) to verify compliance with FedRAMP security control and other requirements. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control AC-20 (2)

#### Use of External Information Systems | Portable Storage Devices

**AC-20 (2)** The organization [Selection: restricts; prohibits] the use of organization-controlled portable storage devices by authorized individuals on external information systems.

**Responsibilities:** `Azure Only`

|||
|---|---|
| **Customer** | Customers do not have physical access to any system resources in Azure datacenters. |
| **Provider (Microsoft Azure)** | Microsoft does not allow customer-controlled portable storage devices within the Microsoft Azure environment. |


 ## NIST 800-53 Control AC-21.a

#### Information Sharing

**AC-21.a** The organization facilitates information sharing by enabling authorized users to determine whether access authorizations assigned to the sharing partner match the access restrictions on the information for [Assignment: organization-defined information sharing circumstances where user discretion is required].

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer's enterprise-level  access control policy may include provisions regarding information sharing. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control AC-21.b

#### Information Sharing

**AC-21.b** The organization employs [Assignment: organization-defined automated mechanisms or manual processes] to assist users in making information sharing/collaboration decisions.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer may rely on an enterprise-level information sharing decision support capability. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control AC-22.a

#### Publicly Accessible Content

**AC-22.a** The organization designates individuals authorized to post information onto a publicly accessible information system.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer's enterprise-level access control procedures may designate individuals authorized to post publicly accessible information. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control AC-22.b

#### Publicly Accessible Content

**AC-22.b** The organization trains authorized individuals to ensure that publicly accessible information does not contain nonpublic information.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer may rely on enterprise-level training for individuals authorized to post publicly accessible information. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control AC-22.c

#### Publicly Accessible Content

**AC-22.c** The organization reviews the proposed content of information prior to posting onto the publicly accessible information system to ensure that nonpublic information is not included.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer's enterprise-level access control procedures may establish a review process for content proposed to be posted a publicly accessible system. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control AC-22.d

#### Publicly Accessible Content

**AC-22.d** The organization reviews the content on the publicly accessible information system for nonpublic information [Assignment: organization-defined frequency] and removes such information, if discovered.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer's enterprise-level access control procedures may establish a process for periodic review of content posted to publicly accessible systems. |
| **Provider (Microsoft Azure)** | Not Applicable |


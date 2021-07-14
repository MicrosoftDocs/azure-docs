---
title: Azure Active Directory security operations for privileged accounts
description: Learn to set baselines, then monitor and alert of potential security issues with privileged accounts in Azure Active directory.
services: active-directory
author: BarbaraSelden
manager: martinco
ms.service: active-directory
ms.workload: identity
ms.subservice: fundamentals
ms.topic: conceptual
ms.date: 07/15/2021
ms.author: baselden
ms.collection: M365-identity-device-management
---

# Security operations for privileged accounts

The security of business assets depends on the integrity of the privileged accounts that administer your IT systems. Cyber-attackers use credential theft attacks and other means to target privileged accounts and gain access to sensitive data.

Traditionally, organizational security has focused on the entry and exit points of a network as the security perimeter. However, software-as-a-service (SaaS) applications and personal devices on the Internet have made this approach less effective. 

Azure Active Directory (Azure AD) uses identity and access management (IAM) as the control plane. In your organization's identity layer, users assigned to privileged administrative roles are in control. The accounts used for access must be protected, whether the environment is on-premises, in the cloud, or a hybrid environment.

You are entirely responsible for all layers of security for your on-premises IT environment. When you use Azure services, prevention and response are the joint responsibilities of Microsoft as the cloud service provider and you as the customer.

* For more information on the shared responsibility model, visit [Shared responsibility in the cloud](../../security/fundamentals/shared-responsibility.md).

* For more information on securing access for privileged users, visit [Securing Privileged access for hybrid and cloud deployments in Azure AD](../roles/security-planning.md).

* For a wide range of videos, how-to guides, and content of key concepts for privileged identity, visit [Privileged Identity Management documentation](https://docs.microsoft.com/azure/active-directory/privileged-identity-management/).

## Where to look

The log files you use for investigation and monitoring are: 

* [Azure AD Audit logs](../reports-monitoring/concept-audit-logs.md)

* [Microsoft 365 Audit logs](/microsoft-365/compliance/auditing-solutions-overview?view=o365-worldwide) 

* [Azure Key Vault insights](../../azure-monitor/insights/key-vault-insights-overview.md)

From the Azure portal, you can view the Azure AD Audit logs and download as comma-separated value (CSV) or JavaScript Object Notation (JSON) files. The Azure portal has several ways to integrate Azure AD logs with other tools that allow for greater automation of monitoring and alerting:

* [Azure Sentinel](../../sentinel/overview.md) – enables intelligent security analytics at the enterprise level by providing security information and event management (SIEM) capabilities. 

* [Azure Monitor](../../azure-monitor/overview.md) – enables automated monitoring and alerting of various conditions. Can create or use workbooks to combine data from different sources.

* [Azure Event Hubs](../../event-hubs/event-hubs-about.md) integrated with a SIEM- [Azure AD logs can be pushed to other SIEMs](../reports-monitoring/tutorial-azure-monitor-stream-logs-to-event-hub.md) such as Splunk, ArcSight, QRadar, and Sumo Logic via the Azure Event Hub integration.

* [Microsoft Cloud App Security](/cloud-app-security/what-is-cloud-app-security) (MCAS) – enables you to discover and manage apps, govern across apps and resources, and check your cloud apps’ compliance. 

* Microsoft Graph - you can export the data and user MS Graph to do more analysis. For more information on MS Graph, visit [Microsoft Graph PowerShell SDK and Azure Active Directory Identity Protection](../identity-protection/howto-identity-protection-graph-api.md). 

* [Identity Protection](../identity-protection/overview-identity-protection.md)-- generates three key reports that you can use to help with your investigation:

   * Risky users – contains information about which users are at risk, details about detections, history of all risky sign-ins, and risk history.

   * Risky sign-ins – contains information surrounding the circumstance of a sign in that might indicate suspicious circumstances. For additional information on investigating information from this report, visit [How To: Investigate risk](../identity-protection/howto-identity-protection-investigate-risk.md). 

   * Risk detections – contains information about other risks triggered when a risk is detected and other pertinent information such as sign-in location and any details from Microsoft Cloud App Security (MCAS).

 

While we discourage the practice, privileged accounts can have standing administration rights. If you choose to use standing privileges, and the account is compromised, it can have the strongly negative impact. We recommend you prioritize monitoring privileged accounts and include the accounts in your Privileged Identity Management (PIM) configuration. For more information on PIM, see [Start using Privileged Identity Management](../privileged-identity-management/pim-getting-started.md). Additionally, we recommend you validate that admin accounts:

* Are required.

* Have the least privilege to execute the require activities.

* Are protected with MFA at a minimum.

* Are run from privileged access workstation (PAW) or secure admin workstation (SAW) devices. 

The remainder of this article describes what we recommend you monitor and alert on, and is organized by the type of threat. Where there are specific pre-built solutions we link to them following the table. Otherwise, you can build alerts using the preceding tools. Specifically, this article provides details on setting baselines, auditing sign-in and usage of privileged accounts, and tools and resources you can use to help maintain the integrity of your privileged accounts. The content is organized into the following topic areas:

* Emergency “break-glass” accounts 

* Privileged account sign in

* Privileged account changes

* Privileged groups

* Privilege assignment, and elevation

## Emergency access accounts

It's important that you prevent being accidentally locked out of your Azure Active Directory (Azure AD) tenant. You can mitigate the impact of an accidental lockout by creating emergency access accounts in your organization. Emergency access accounts are also known as “break glass” accounts, as in “break glass in case of emergency” messages found on physical security equipment like fire alarms.

Emergency access accounts are highly privileged, and they aren't assigned to specific individuals. Emergency access accounts are limited to emergency or break glass scenarios where normal privileged accounts can't be used. For example, when a Conditional Access policy is misconfigured and locks out all normal administrative accounts. Restrict emergency account use to only the times when it is absolutely necessary.

Also see our guidance on what to do in an emergency [Secure access practices for administrators in Azure AD](../roles/security-planning.md).

Send a high priority alert every time an emergency access account is used.

### Discovery

Since break glass accounts are only used if there is an emergency, your monitoring should discover no account activity. Send a high priority alert every time an emergency access account is used or changed.  Any of the following events might indicate a bad actor is trying to compromise your environments.

* Account used – monitor and alert on any activity using this type of account, including:

* Sign in

* Account password change 

* Account permission/roles changed 

* Credential or auth method added or changed 

For more information on managing emergency access accounts, see [Manage emergency access admin accounts in Azure AD](../roles/security-emergency-access.md). For detailed information on creating an alert for emergency account, see [Create an alert rule](../roles/security-emergency-access.md). 

## Privileged account sign in

Monitor all privileged account sign in activity by using the Azure AD Sign in logs as the data source. In addition to sign in success and failure information, the logs contain the following details:

* Interrupts
* Device
* Location
* Risk
* Application
* Date and time
* Is the account disabled
* Lockout
* MFA fraud
* CA failure

### Things to monitor

You can monitor privileged account sign-in events in the Azure AD Sign-in logs. Alert on and investigate the following events for privileged accounts.

| What to monitor | Risk level |  Where |  Filter/sub-filter | Notes |
| - | - | - | - | - |
| Sign-in failure, bad password threshold | High | Azure AD Sign-ins log | Status = Failure<br>-and-<br>error code = 50126 | Define a baseline threshold, and then monitor and adjust to suite your organizational behaviors and limit false alerts from being generated. |
| Failure due to CA requirement |High | Azure AD Sign-ins log | Status = Failure<br>-and-<br>error code = 53003<br>-and-<br>Failure reason = blocked by CA | This can be an indication an attacker is trying to get into the account |
| Privileged accounts that don't follow naming policy.| | Azure Subscription | [List Azure role assignments using the Azure portal - Azure RBAC](../../role-based-access-control/role-assignments-list-portal.md)| List role assignments for subscriptions and alert where sign in name doesn't match your organizations format. For example, ADM_ as a prefix. |
| Interrupt |  High/Medium | Azure AD Sign-ins | Status = Interrupted<br>-and-<br>error code = 50074<br>-and-<br>Failure reason = Strong Auth required<br>Status = Interrupted<br>-and-<br>Error code = 500121<br>Failure Reason = Authentication failed during strong authentication request | This can be an indication an attacker has the password for the account but can't pass the MFA challenge. |   |   |
| Privileged accounts that don't follow naming policy.| High | Azure AD directory | [List Azure AD role assignments](../roles/view-assignments.md)| List roles assignments for Azure AD roles alert where UPN doesn't match your organizations format. For example, ADM_ as a prefix. |
| Discover privileged accounts not registered for MFA. | High | Azure AD Graph API| Query for IsMFARegistered eq false for administrator accounts. [List credentialUserRegistrationDetails - Microsoft Graph beta](/graph/api/reportroot-list-credentialuserregistrationdetails?view=graph-rest-beta&tabs=http) | Audit and investigate to determine if intentional or an oversight. |
| Account lockout | High | Azure AD Sign-ins log | Status = Failure<br>-and-<br>error code = 50053 | Define a baseline threshold, and then monitor and adjust to suite your organizational behaviors and limit false alerts from being generated. |
| Account disabled/blocked for sign-ins | Low | Azure AD Sign-ins log | Status = Failure<br>-and-<br>Target = user UPN<br>-and-<br>error code = 50057 | This could indicate someone is trying to gain access to an account once they have left an organization. Although the account is blocked, it's still important to log and alert on this activity. |
| MFA fraud alert/block | High | Azure AD Sign-ins log | Succeeded = false<br>-and-<br>Result detail = MFA denied<br>-and-<br>Target = user | Privileged user has indicated they haven't instigated the MFA prompt and could indicate an attacker has the password for the account. |
| Privileged account sign-ins outside of expected controls. |  | Azure AD Sign-ins log | Status = failure<br>UserPricipalName = <Admin account><br>Location = <unapproved location><br>IP Address = <unapproved IP><br>Device Info= <unapproved Browser, Operating System> | Monitor and alert on any entries that you have defined as unapproved. |
| Outside of normal sign in times | High | Azure AD Sign-ins log | Status =success<br>-and-<br>Location =<br>-and-<br>Time = outside of working hours | Monitor and alert if sign-ins occur outside of expected times. It is important to find the normal working pattern for each privileged account and to alert if there are unplanned changes outside of normal working times. Sign-ins outside of normal working hours could indicate compromise or possible insider threats. | 
| Identity protection risk | High | Identity Protection logs | Risk state = at risk<br>-and-<br>Risk level = low/medium/high<br>-and-<br>Activity = Unfamiliar sign-in/TOR, etc. | This indicates there is some abnormality detected with the sign in for the account and should be alerted on. | 
| Password change | High | Azure AD Audit logs | Activity Actor = admin/self service<br>-and-<br>Target = user<br>-and-<br>Status = success/failure | Alert on any administrator account password changes, especially for Global admins, user admins, subscription admins, and emergency access accounts. Write a query targeted at all privileged accounts. | 
| Change in legacy authentication protocol | High | Azure AD Sign-ins log | Client App = Other client, IMAP, POP3, MAPI, SMTP etc.<br>-and-<br>Username = UPN<br>-and-<br>Application = Exchange (example) | Many attacks use legacy authentication and therefore if there is a change in auth protocol for the user it could be an indication of an attack. |
| New device or location | High | Azure AD Sign-ins log | Device Info = Device ID<br>-and-<br>Browser<br>-and-<br>OS<br>-and-<br>Compliant/Managed<br>-and-<br>Target = user<br>-and-<br>Location | Most admin activity should be from [privileged access devices](/security/compass/privileged-access-devices), from a limited number of locations. Therefore alert on new devices or locations. |
| Audit alert setting is changed. | High | Azure AD Audit logs | Service = PIM<br>-and-<br>Category = Role Management<br>-and-<br>Activity = Disable PIM Alert<br>-and-<br>Status = Success | Changes to a core alert should be alerted if unexpected. |


## Changes by privileged accounts 

Monitor all completed and attempted changes by a privileged account. This enables you to establish what is normal activity for each privileged account and alert on activity that deviates from the expected. The Azure AD audit logs are used to record this type of event. For more information on Azure AD Audit logs, see [Audit logs in Azure Active Directory](../reports-monitoring/concept-audit-logs.md). 

### Azure Active Directory Domain Services 

Privileged accounts that have been assigned permissions in Azure Active Directory Domain Services can perform tasks for Azure AD DS that affect the security posture of your Azure hosted virtual machines (VMs) that use Azure AD Domain Services. Enable security audits on VMs and monitor the logs. For more information on enabling Azure AD DS audits and for a list of what are considered sensitive privileges visit, see the following resources.

* [Enable security audits for Azure Active Directory Domain Services](../../active-directory-domain-services/security-audit-events.md)

* [Audit Sensitive Privilege Use](/windows/security/threat-protection/auditing/audit-sensitive-privilege-use)

| What to monitor                                                         | Risk level | Where               | Filter/sub-filter                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | Notes                                                                                                                                                                                                                                                                                                                                                                                                                             |
|-------------------------------------------------------------------------|------------|---------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Attempted and completed changes                                  | High       | Azure AD Audit logs | Date and time<br>-and-<br>Service<br>-and-<br>Category and name of the activity (what)<br>-and-<br>Status = success or failure<br>-and-<br>Target<br>-and-<br>Initiator / actor (who)                                                                                                                                                                                                                                                                                                | Any unplanned changes should be alerted on immediately. These logs should be retained to assist in any investigation. Any tenant level changes should be investigated immediately (link out to Infra doc) Changes that would lower the security posture of your tenant. For example: excluding accounts from MFA or conditional access. Alert on any [additions or changes to applications](security-operations-applications.md). |
| **EXAMPLE**<br>Attempted or completed change to high value apps or services | High       | Audit log           | Service<br>-and-<br>Category and name of the activity                                                                                                                                                                                                                                                                                                                                                                                                                                | <li>Date and time <li>Service <li>Category and name of the activity <li>Status = success or failure <li>Target <li>Initiator / actor (who)                                                                                                                                                                                                                                                                                        |
| Privileged changes in Azure AD DS                                             | High       | AD DS               | Look for event [4673](/windows/security/threat-protection/auditing/event-4673) | [Enable security audits for Azure Active Directory Domain Services](../../active-directory-domain-services/security-audit-events.md)<br>[Audit Sensitive Privilege Use](/windows/security/threat-protection/auditing/audit-sensitive-privilege-use). See article for list of all privileged events.                                                                                                                            |


## Changes to privileged accounts

Investigate changes to privileged accounts' authentication rules and privileges, especially if the change provides greater privilege or ability to perform tasks in your Azure AD environment. 

| What to monitor| Risk level| Where| Filter/sub-filter| Notes |
| - | - | - | - | - |
| Privileged account creation.| Medium| Azure AD Audit logs| Service = Core Directory<br>-and-<br>Category = user management<br>-and-<br>Activity Type = Add user<br>-correlate with-<br>Category Type = Role Management<br>-and-<br>Activity Type = Add member to role<br>-and-<br>Modified properties = Role.DisplayName| Monitor creation of any privileged accounts. Look for correlation that of short time span between creation and deletion of accounts. |
| Changes to authentication methods.| High| Azure AD Audit logs| Service = Authentication Method<br>-and-<br>Activity Type = User registered security info<br>-and-<br>Category = user management| This could be an indicated of an attacker adding an auth method to the account so they can have continued access. |
| Alert on changes to privileged account permissions.| High| Azure AD Audit logs| Category = Role Management<br>-and-<br>Activity Type – Add eligible member (permanent)<br>-and-<br>Activity Type – Add eligible member (eligible)<br>-and-<br>Status = Success/failure<br>-and-<br>Modified properties = Role.DisplayName| This is especially for accounts being assigned roles that aren't known or outside of their normal responsibilities. |
| Unused privileged accounts.| Medium| Azure AD Access Reviews| | Perform monthly review for inactive privileged user accounts. |
| Accounts exempt from Conditional Access| High| Azure Monitor Logs<br>-or-<br>Access Reviews| Conditional Access - Insights and Reporting| Any account exempt from CA is most likely bypassing security controls and  are more vulnerable to compromise. Break glass accounts are exempt. See information how to monitor break glass accounts in a subsequent section of this article.|


For more information on how to monitor for exceptions to Conditional Access policies, see [Conditional Access insights and reporting](../conditional-access/howto-conditional-access-insights-reporting.md).

For more information on discovering unused privileged accounts, see [Create an access review of Azure AD roles in Privileged Identity Management](../privileged-identity-management/pim-how-to-start-security-review.md)

 
## Assignment and elevation

Having privileged accounts that are permanently provisioned with elevated abilities can increase the attack surface and risk to your security boundary. Instead, employ just-in-time access using an elevation procedure. This type of system allows you to assign eligibility for privileged roles, and admins elevate their privileges to those roles only when performing tasks that need those privileges. Using an elevation process enables you to monitor elevations and non-use of privileged accounts. 

### Establish a baseline

To monitor for exceptions, you must first create a baseline. Determine the following

* Admin accounts 

   * Your privileged account strategy

   * Use of on-premises accounts to administer on-premises resources.

   * Use of cloud-based accounts to administer cloud-based resources.

   * Approach to separating and monitoring administrative permissions for on-premises and cloud-based resources.

* Privileged role protection 

   * Protection strategy for roles that have administrative privileges.

   * Organizational policy for using privileged accounts.

   * Strategy and principles for maintaining permanent privilege versus providing time bound and approved access

 

The following concepts and information will help you determine policies.

* Just in time admin principles – Use the Azure AD logs to capture information for performing administrative tasks that are common in your environment. Determine the typical amount of time needed to complete the tasks. 

* Just enough admin principles – [Determine the least privileged role](../roles/delegate-by-task.md),which may be a custom role, needed for administrative tasks. 

* Establish an elevation policy – Once you have insight into the type of elevated privilege need and how long is needed for each task, create policies that reflect elevated privileged usage for your environment. For example, defining a policy to limit Global Admin access to 1 hour.

 Once you establish your baseline and set policy, you can configure monitoring to detect and alert usage outside of policy. 

### Discovery

We recommend you pay particular attention to and investigate changes in assignment and elevation of privilege. 

### Things to monitor

You can monitor privileged account changes using Azure AD Audit logs and Azure Monitor logs. Specifically, we recommend the following be included in your monitoring process. 

| What to monitor| Risk level| Where| Filter/sub-filter| Notes |
| - | - | - | - | - |
| Added to eligible privileged role.| High| Azure AD Audit Logs| Service = PIM<br>-and-<br>Category = Role Management​<br>-and-<br>Activity Type – Add member to role completed (eligible)<br>-and-<br>Status = Success/failure​<br>-and-<br>Modified properties = Role.DisplayName| Any account eligible for a role is now being given privileged access. If the assignment is unexpected or into a role that isn't the responsibility of the account holder, investigate. |
| Roles assigned out of PIM.| High| Azure AD Audit Logs| Service = PIM<br>-and-<br>Category = Role Management​<br>-and-<br>Activity Type = Add member to role (permanent)<br>-and-<br>Status = Success/failure<br>-and-<br>Modified properties = Role.DisplayName| These should be closely monitored and alerted. Users shouldn't be assigned roles outside of PIM where possible. |
| Elevations| Medium| Azure AD Audit Logs| Service = PIM<br>-and-<br>Category = Role Management<br>-and-<br>Activity Type – Add member to role completed (PIM activation)<br>-and-<br>Status = Success/failure​<br>-and-<br>Modified properties = Role.DisplayName| Once elevated a privileged account can now make changes that could impact the security of your tenant. All elevations should be logged and if happening outside of the standard pattern for that user should be alerted and investigated if not planned. |
| Approvals and deny elevation| Low| Azure AD Audit Logs| Service = Access Review<br>-and-<br>Category = UserManagement<br>-and-<br>Activity Type = Request Approved/Denied<br>-and-<br>Initiated actor = UPN| Monitor all elevations as it could give a clear indication of timeline for an attack. |
| Changes to PIM settings| High| Azure AD Audit Logs| Service =PIM<br>-and-<br>Category = Role Management<br>-and-<br>Activity Type = Update role setting in PIM<br>-and-<br>Status Reason = MFA on activation disabled (example)| One of these actions could reduce the security of the PIM elevation and make it easier for attackers to acquire a privileged account. |
| Elevation not occurring on SAW/PAW| High| Azure AD Sign In logs| Device ID​<br>-and-<br>Browser<br>-and-<br>OS<br>-and-<br>Compliant/Managed<br>Correlate with:<br>Service = PIM<br>-and-<br>Category = Role Management<br>-and-<br>Activity Type – Add member to role completed (PIM activation)<br>-and-<br>Status = Success/failure<br>-and-<br>Modified properties = Role.DisplayName| If this is configured, any attempt to elevate on a non-PAW/SAW device should be investigated immediately as it could indicate an attacker trying to use the account. |
| Elevation to manage all Azure subscriptions| High| Azure Monitor| Activity Log/Directory Activity<br>Assigns the caller to user access administrator<br>-and-<br>Status = succeeded, success, fail<br>-and-<br>Event initiated by| This should be investigated immediately if not a planned change. This setting could allow an attacker access to Azure subscriptions in your environment. |


For more information about managing elevation, see [Elevate access to manage all Azure subscriptions and management groups](../../role-based-access-control/elevate-access-global-admin.md). For information on monitoring elevations using information available in the Azure AD logs, see [Azure Activity log](../../azure-monitor/essentials/activity-log.md), which is part of the Azure Monitor documentation.

For information about configuring alerts for Azure role, see [Configure security alerts for Azure resource roles in Privileged Identity Management](../privileged-identity-management/pim-resource-roles-configure-alerts.md). 

 ## Next steps

See these security operations guide articles:

[Azure AD security operations overview](security-operations-introduction.md)

[Security operations for user accounts](security-operations-user-accounts.md)

[Security operations for privileged accounts](security-operations-privileged-accounts.md)

[Security operations for Privileged Identity Management](security-operations-privileged-identity-management.md)

[Security operations for applications](security-operations-applications.md)

[Security operations for devices](security-operations-devices.md)

 
[Security operations for infrastructure](security-operations-infrastructure.md)
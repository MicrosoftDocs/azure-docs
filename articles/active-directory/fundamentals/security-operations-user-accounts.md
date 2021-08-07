---
title: Azure Active Directory security operations for user accounts
description: Guidance to establish baselines and how to monitor and alert on potential security issues with user accounts.
services: active-directory
author: BarbaraSelden
manager: martinco
ms.service: active-directory
ms.workload: identity
ms.subservice: fundamentals
ms.topic: conceptual
ms.date: 07/15/2021
ms.author: baselden
ms.custom: "it-pro, seodec18"
ms.collection: M365-identity-device-management
---

# Azure Active Directory security operations for user accounts

User identity is one of the most important aspects of protecting your organization and data. This article provides guidance for monitoring account creation, deletion, and account usage. The first portion covers how to monitor for unusual account creation and deletion. The second portion covers how to monitor for unusual account usage. 

If you have not yet read the [Azure Active Directory (Azure AD) security operations overview](security-operations-introduction.md), we recommend you do so before proceeding.

This article covers general user accounts. For privileged accounts, see Security operations – privileged accounts.

## Define a baseline

To discover anomalous behavior, you first must define what normal and expected behavior is. Defining what expected behavior for your organization is, helps you determine when unexpected behavior occurs. The definition also helps to reduce the noise level of false positives when monitoring and alerting. 

Once you define what you expect, you perform baseline monitoring to validate your expectations. With that information, you can monitor the logs for anything that falls outside of tolerances you define. 

Use the Azure AD Audit Logs, Azure AD Sign-in Logs, and directory attributes as your data sources for accounts created outside of normal processes. The following are suggestions to help you think about and define what normal is for your organization.

* **Users account creation** – evaluate the following:

   * Strategy and principles for tools and processes used for creating and managing user accounts. For example, are there standard attributes, formats that are applied to user account attributes. 

  * Approved sources for account creation. For example, originating in Active Directory (AD), Azure Active Directory or HR systems like Workday.

  * Alert strategy for accounts created outside of approved sources. Is there a controlled list of organizations your organization collaborates with?

  * Provisioning of guest accounts and alert parameters for accounts created outside of entitlement management or other normal processes.

  * Strategy and alert parameters for accounts created, modified, or disabled by an account that is not an approved user administrator.

  * Monitoring and alert strategy for accounts missing standard attributes, such as employee ID or not following organizational naming conventions.

  * Strategy, principles, and process for account deletion and retention.

* **On-premises user accounts** – evaluate the following for accounts synced with Azure AD Connect:

  * The forests, domains, and organizational units (OUs) in scope for synchronization. Who are the approved administrators who can change these settings and how often is the scope checked?

  * The types of accounts that are synchronized. For example, user accounts and or service accounts. 

  * The process for creating privileged on-premises accounts and how the synchronization of this type of account is controlled.

  * The process for creating on-premises user accounts and how the synchronization of this type of account is managed.

For more information for securing and monitoring on-premises accounts, see [Protecting Microsoft 365 from on-premises attacks](protect-m365-from-on-premises-attacks.md).

* **Cloud user accounts** – evaluate the following:

  * The process to provision and manage cloud accounts directly in Azure AD.

  * The process to determine the types of users provisioned as Azure AD cloud accounts. For example, do you only allow privileged accounts or do you also allow user accounts?

  * The process to create and maintain a list of trusted individuals and or processes expected to create and manage cloud user accounts.

  * The process to create and maintained an alert strategy for non-approved cloud-based accounts. 

## Where to look

The log files you use for investigation and monitoring are: 

* [Azure AD Audit logs](../reports-monitoring/concept-audit-logs.md)

* [Sign-in logs](../reports-monitoring/concept-all-sign-ins.md)

* [Microsoft 365 Audit logs](/microsoft-365/compliance/auditing-solutions-overview?view=o365-worldwide) 

* [Azure Key Vault logs](../../key-vault/general/logging.md?tabs=Vault)

* [Risky Users log](../identity-protection/howto-identity-protection-investigate-risk.md)

* [UserRiskEvents log](../identity-protection/howto-identity-protection-investigate-risk.md)

From the Azure portal you can view the Azure AD Audit logs and download as comma separated value (CSV) or JavaScript Object Notation (JSON) files. The Azure portal has several ways to integrate Azure AD logs with other tools that allow for greater automation of monitoring and alerting:

* **[Azure Sentinel](../../sentinel/overview.md)** – enables intelligent security analytics at the enterprise level by providing security information and event management (SIEM) capabilities. 

* **[Azure Monitor](../../azure-monitor/overview.md)** – enables automated monitoring and alerting of various conditions. Can create or use workbooks to combine data from different sources.

* **[Azure Event Hubs](../../event-hubs/event-hubs-about.md) integrated with a SIEM**- [Azure AD logs can be integrated to other SIEMs](../reports-monitoring/tutorial-azure-monitor-stream-logs-to-event-hub.md) such as Splunk, ArcSight, QRadar and Sumo Logic via the Azure Event Hub integration.

* **[Microsoft Cloud App Security](/cloud-app-security/what-is-cloud-app-security) (MCAS)** – enables you to discover and manage apps, govern across apps and resources, and check your cloud apps’ compliance. 

Much of what you will monitor and alert on are the effects of your Conditional Access policies. You can use the [Conditional Access insights and reporting workbook](../conditional-access/howto-conditional-access-insights-reporting.md) to examine the effects of one or more Conditional Access policies on your sign-ins, as well as the results of policies, including device state. This workbook enables you to view an impact summary, and identify the impact over a specific time period. You can also use the workbook to investigate the sign-ins of a specific user. 

 The remainder of this article describes what we recommend you monitor and alert on, and is organized by the type of threat. Where there are specific pre-built solutions we link to them or provide samples following the table. Otherwise, you can build alerts using the preceding tools. 

## Account creation

Anomalous account creation can indicate a security issue. Short lived accounts, accounts not following naming standards, and accounts created outside of normal processes should be investigated.

### Short-lived accounts

Account creation and deletion outside of normal identity management processes should be monitored in Azure AD. Short-lived accounts are accounts created and deleted in a short time span. This type of account creation and quick deletion could mean a bad actor is trying to avoid detection by creating accounts, using them, and then deleting the account.

Short-lived account patterns might indicate non-approved people or processes might have the right to create and delete accounts that fall outside of established processes and policies. This type of behavior removes visible markers from the directory. 

If the data trail for account creation and deletion is not discovered quickly, the information required to investigate an incident may no longer exist. For example, accounts might be deleted and then purged from the recycle bin. Audit logs are retained for 30 days. However, you can export your logs to Azure Monitor or a security information and event management (SIEM) solution for longer term retention. 

| What to monitor                                                  | Risk Level | Where               | Filter/sub-filter                                                                                                                                         | Notes                                                                                                                               |
|------------------------------------------------------------------|------------|---------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------|
| Account creation and deletion events within a close time frame.  | High       | Azure AD Audit logs | Activity: Add user<br>Status = success<br>-and-<br>Activity: Delete user<br>Status = success<br>                                                          | Search for user principal name (UPN) events. Look for accounts created and then deleted in under 24 hours.                          |
| Accounts created and deleted by non-approved users or processes. | Medium     | Azure AD Audit logs | Initiated by (actor) – USER PRINCIPAL NAME<br>-and-<br>Activity: Add user<br>Status = success<br>and-or<br>Activity: Delete user<br>Status = success      | If the actor are non-approved users, configure to send an alert.                                                                    |
| Accounts from non-approved sources.                              | Medium     | Azure AD Audit logs | Activity: Add user<br>Status = success<br>Target(s) = USER PRINCIPAL NAME                                                                                 | If the entry is not from an approved domain or is a known blocked domain, configure to send an alert.                               |
| Accounts assigned to a privileged role.                          | High       | Azure AD Audit logs | Activity: Add user<br>Status = success<br>-and-<br>Activity: Delete user<br>Status = success<br>-and-<br>Activity: Add member to role<br>Status = success | If the account is assigned to an Azure AD role, Azure role, or privileged group membership, alert and prioritize the investigation. |

Both privileged and non-privileged accounts should be monitored and alerted. However, since privileged accounts have administrative permissions, they should have higher priority in your monitor, alert, and respond processes. 

### Accounts not following naming policies

User accounts not following naming policies might have been created outside of organizational policies. 

A best practice is to have a naming policy for user objects. Having a naming policy makes management easier and helps provide consistency. The policy can also help discover when users have been created outside of approved processes. A bad actor might not be aware of your naming standards and might make it easier to detect an account provisioned outside of your organizational processes.

Organizations tend to have specific formats and attributes that are used for creating user and or privileged accounts. For example:

* Admin account UPN = ADM_firstname.lastname@tenant.onmicrosoft.com

* User account UPN = Firstname.Lastname@contoso.com

User accounts also frequently have an attribute that identifies a real user. For example, EMPID = XXXNNN. The following are suggestions to help you think about and define what normal is for your organization, as well as thing to consider when defining your baseline for log entries where accounts don’t follow your organization’s naming convention:

* Accounts that don’t follow the naming convention. For example, `nnnnnnn@contoso.com` versus `firstname.lastname@contoso.com`. 

* Accounts that don’t have the standard attributes populated or are not in the correct format. For example, not having a valid employee ID.

| What to monitor| Risk Level| Where| Filter/sub-filter| Notes |
| - | - | - | - | - |
| User accounts that do not have expected attributes defined.| Low| Azure AD Audit logs| Activity: Add user<br>Status = success| Look for accounts with your standard attributes either null or in the wrong format. For example, EmployeeID |
| User accounts created using incorrect naming format.| Low| Azure AD Audit logs| Activity: Add user<br>Status = success| Look for accounts with a UPN that does not follow your naming policy. |
| Privileged accounts that do not follow naming policy.| High| Azure Subscription| [List Azure role assignments using the Azure portal - Azure RBAC](../../role-based-access-control/role-assignments-list-portal.md)| List role assignments for subscriptions and alert where sign in name does not match your organizations format. For example, ADM_ as a prefix. |
| Privileged accounts that do not follow naming policy.| High| Azure AD directory| [List Azure AD role assignments](../roles/view-assignments.md)| List roles assignments for Azure AD roles alert where UPN does not match your organizations format. For example, ADM_ as a prefix. |



For more information on parsing, see:

* For Azure AD Audit logs - [Parse text data in Azure Monitor Logs](../../azure-monitor/logs/parse-text.md)

* For Azure Subscriptions - [List Azure role assignments using Azure PowerShell](../../role-based-access-control/role-assignments-list-powershell.md)

* For Azure Active Directory - [List Azure AD role assignments](../roles/view-assignments.md) 

### Accounts created outside normal processes

Having standard processes to create users and privileged accounts is important so that you can securely control the lifecycle of identities. If users are provisioned and deprovisioned outside of established processes, it can introduce security risks. Operating outside of established processes can also introduce identity management problems. Potential risks include:

* User and privileged accounts might not be governed to adhere to organizational policies. This can lead to a wider attack surface on accounts that are not managed correctly.

* It becomes harder to detect when bad actors create accounts for malicious purposes. By having valid accounts created outside of established procedures, it becomes harder to detect when accounts are created, or permissions modified for malicious purposes. 

We recommend that user and privileged accounts only be created following your organization policies. For example, an account should be created with the correct naming standards, organizational information and under scope of the appropriate identity governance. Organizations should have rigorous controls for who has the rights to create, manage, and delete identities. Roles to create these accounts should be tightly managed and the rights only available after following an established workflow to approve and obtain these permissions.

| What to monitor| Risk Level| Where| Filter/sub-filter| Notes |
| - | - | - | - | - |
| User accounts created or deleted by non-approved users or processes.| Medium| Azure AD Audit logs| Activity: Add user<br>Status = success<br>and-or-<br>Activity: Delete user<br>Status = success<br>-and-<br>Initiated by (actor) = USER PRINCIPAL NAME| Alert on accounts created by non-approved users or processes. Prioritize accounts created with heightened privileges. |
| User accounts created or deleted from non-approved sources.| Medium| Azure AD Audit logs| Activity: Add user<br>Status = success<br>-or-<br>Activity: Delete user<br>Status = success<br>-and-<br>Target(s) = USER PRINCIPAL NAME| Alert when the domain is non-approved or known blocked domain. |


## Unusual sign ins

Seeing failures for user authentication is normal. But seeing patterns or blocks of failures can be an indicator that something is happening with a user’s Identity. For example, in the case of Password spray or Brute Force attacks, or when a user account is compromised. It is critical that you monitor and alert when patterns emerge. This helps ensure you can protect the user and your organization’s data. 

Success appears to say all is well. But it can mean that a bad actor has successfully accessed a service. Monitoring successful logins helps you detect user accounts that are gaining access but are not user accounts that should have access. User authentication successes are normal entries in Azure AD Sign-Ins logs. We recommend you monitor and alert to detect when patterns emerge. This helps ensure you can protect user accounts and your organization’s data. 


As you design and operationalize a log monitoring and alerting strategy, consider the tools available to you through the Azure portal. Identity Protection enables you to automate the detection, protection, and remediation of identity-based risks. Identity protection uses intelligence-fed machine learning and heuristic systems to detect risk and assign a risk score for users and sign ins. Customers can configure policies based on a risk level for when to allow or deny access or allow the user to securely self-remediate from a risk. The following Identity Protection risk detections inform risk levels today:

| What to monitor | Risk Level | Where | Filter/sub-filter | Notes |
| - | - | - | - | - |
| Leaked credentials user risk detection| High| Azure AD Risk Detection logs| UX: Leaked credentials <br><br>API: See [riskDetection resource type - Microsoft Graph beta](/graph/api/resources/riskdetection?view=graph-rest-beta)| See [What is risk? Azure AD Identity Protection](../identity-protection/concept-identity-protection-risks.md) |
| Azure AD Threat Intelligence user risk detection| High| Azure AD Risk Detection logs| UX: Azure AD threat intelligence <br><br>API: See [riskDetection resource type - Microsoft Graph beta](/graph/api/resources/riskdetection?view=graph-rest-beta)| See [What is risk? Azure AD Identity Protection](../identity-protection/concept-identity-protection-risks.md) |
| Anonymous IP address sign-in risk detection| Varies| Azure AD Risk Detection logs| UX: Anonymous IP address <br><br>API: See [riskDetection resource type - Microsoft Graph beta](/graph/api/resources/riskdetection?view=graph-rest-beta)| See [What is risk? Azure AD Identity Protection](../identity-protection/concept-identity-protection-risks.md) |
| Atypical travel sign-in risk detection| Varies| Azure AD Risk Detection logs| UX: Atypical travel <br><br>API: See [riskDetection resource type - Microsoft Graph beta](/graph/api/resources/riskdetection?view=graph-rest-beta)| See [What is risk? Azure AD Identity Protection](../identity-protection/concept-identity-protection-risks.md) |
| Anomalous Token| Varies| Azure AD Risk Detection logs| UX: Anomalous Token <br><br>API: See [riskDetection resource type - Microsoft Graph beta](/graph/api/resources/riskdetection?view=graph-rest-beta)| See [What is risk? Azure AD Identity Protection](../identity-protection/concept-identity-protection-risks.md) |
| Malware linked IP address sign-in risk detection| Varies| Azure AD Risk Detection logs| UX: Malware linked IP address <br><br>API: See [riskDetection resource type - Microsoft Graph beta](/graph/api/resources/riskdetection?view=graph-rest-beta)| See [What is risk? Azure AD Identity Protection](../identity-protection/concept-identity-protection-risks.md) |
| Suspicious browser sign-in risk detection| Varies| Azure AD Risk Detection logs| UX: Suspicious browser <br><br>API: See [riskDetection resource type - Microsoft Graph beta](/graph/api/resources/riskdetection?view=graph-rest-beta)| See [What is risk? Azure AD Identity Protection](../identity-protection/concept-identity-protection-risks.md) |
| Unfamiliar sign-in properties sign-in risk detection| Varies| Azure AD Risk Detection logs| UX: Unfamiliar sign-in properties <br><br>API: See [riskDetection resource type - Microsoft Graph beta](/graph/api/resources/riskdetection?view=graph-rest-beta)| See [What is risk? Azure AD Identity Protection](../identity-protection/concept-identity-protection-risks.md) |
| Malicious IP address sign-in risk detection| Varies| Azure AD Risk Detection logs| UX: Malicious IP address<br><br>API: See [riskDetection resource type - Microsoft Graph beta](/graph/api/resources/riskdetection?view=graph-rest-beta)| See [What is risk? Azure AD Identity Protection](../identity-protection/concept-identity-protection-risks.md) |
| Suspicious inbox manipulation rules sign-in risk detection| Varies| Azure AD Risk Detection logs| UX: Suspicious inbox manipulation rules<br><br>API: See [riskDetection resource type - Microsoft Graph beta](/graph/api/resources/riskdetection?view=graph-rest-beta)| See [What is risk? Azure AD Identity Protection](../identity-protection/concept-identity-protection-risks.md) |
| Password Spray sign-in risk detection| High| Azure AD Risk Detection logs| UX: Password spray<br><br>API: See [riskDetection resource type - Microsoft Graph beta](/graph/api/resources/riskdetection?view=graph-rest-beta)| See [What is risk? Azure AD Identity Protection](../identity-protection/concept-identity-protection-risks.md) |
| Impossible travel sign-in risk detection| Varies| Azure AD Risk Detection logs| UX: Impossible travel<br><br>API: See [riskDetection resource type - Microsoft Graph beta](/graph/api/resources/riskdetection?view=graph-rest-beta)| See [What is risk? Azure AD Identity Protection](../identity-protection/concept-identity-protection-risks.md) |
| New country sign-in risk detection| Varies| Azure AD Risk Detection logs| UX: New country<br><br>API: See [riskDetection resource type - Microsoft Graph beta](/graph/api/resources/riskdetection?view=graph-rest-beta)| See [What is risk? Azure AD Identity Protection](../identity-protection/concept-identity-protection-risks.md) |
| Activity from anonymous IP address sign-in risk detection| Varies| Azure AD Risk Detection logs| UX: Activity from Anonymous IP address<br><br>API: See [riskDetection resource type - Microsoft Graph beta](/graph/api/resources/riskdetection?view=graph-rest-beta)| See [What is risk? Azure AD Identity Protection](../identity-protection/concept-identity-protection-risks.md) |
| Suspicious inbox forwarding sign-in risk detection| Varies| Azure AD Risk Detection logs| UX: Suspicious inbox forwarding<br><br>API: See [riskDetection resource type - Microsoft Graph beta](/graph/api/resources/riskdetection?view=graph-rest-beta)| See [What is risk? Azure AD Identity Protection](../identity-protection/concept-identity-protection-risks.md) |
| Azure AD threat intelligence sign-in risk detection| High| Azure AD Risk Detection logs| UX: Azure AD threat intelligence<br>API: See [riskDetection resource type - Microsoft Graph beta](/graph/api/resources/riskdetection?view=graph-rest-beta.md)| See [What is risk? Azure AD Identity Protection](../identity-protection/concept-identity-protection-risks.md) |

For more information, visit [What is Identity Protection](../identity-protection/overview-identity-protection.md). 


### What to look for

Configure monitoring on the data within the Azure AD Sign-ins Logs to ensure that alerting occurs and adheres to your organization’s security policies. Some examples of this are:

* **Failed Authentications**: As humans we all get our passwords wrong from time to time. However, many failed authentications can indicate that a bad actor is trying to obtain access. Attacks differ in ferocity but can range from a few attempts per hour to a much higher rate. For example, Password Spray normally preys on easier passwords against many accounts, while Brute Force attempts many passwords against targeted accounts. 

* **Interrupted Authentications**: An Interrupt in Azure AD represents an injection of an additional process to satisfy authentication, such as when enforcing a control in a CA policy. This is a normal event and can happen when applications are not configured correctly. But when you see many interrupts for a user account it could indicate something is happening with that account. 

  * For example, if you filtered on a user in Sign-in logs and see a large volume of sign in status = Interrupted and Conditional Access = Failure. Digging deeper it may show in authentication details that the password is correct, but that strong authentication is required. This could mean the user is not completing multi-factor authentication (MFA) which could indicate the user’s password is compromised and the bad actor is unable to fulfill MFA.

* **Smart lock out**: Azure AD provides a smart lockout service which introduces the concept of familiar and non-familiar locations to the authentication process. A user account visiting a familiar location might authenticate successfully while a bad actor unfamiliar with the same location is blocked after several attempts. Look for accounts that have been locked out and investigate further. 

* **IP Changes**: It is normal to see users originating from different IP addresses. However, Zero Trust states never trust and always verify. Seeing a large volume of IP addresses and failed sign ins can be an indicator of intrusion. Look for a pattern of many failed authentications taking place from multiple IP addresses. Note, virtual private network (VPN) connections can cause false positives. Regardless of the challenges, we recommend you monitor for IP address changes and if possible, use Azure AD Identity Protection to automatically detect and mitigate these risks.

* **Locations**: Generally, you expect a user account to be in the same geographical location. You also expect sign ins from locations where you have employees or business relations. When the user account comes from a different international location in less time than it would take to travel there, it can indicate the user account is being abused. Note, VPNs can cause false positives, we recommend you monitor for user accounts signing in from geographically distant locations and if possible, use Azure AD Identity Protection to automatically detect and mitigate these risks.

For this risk area we recommend you monitor both standard user accounts and privileged accounts but prioritize investigations of privileged accounts. Privileged accounts are the most important accounts in any Azure AD tenant. For specific guidance for privileged accounts, see Security operations – privileged accounts. 

### How to detect

You use Azure Identity Protection and the Azure AD sign-in logs to help discover threats indicated by unusual sign-in characteristics. Information about Identity Protection is available at [What is Identity Protection](../identity-protection/overview-identity-protection.md). You can also replicate the data to Azure Monitor or a SIEM for monitoring and alerting purposes. To define normal for your environment and to set a baseline, determine the following:

* the parameters that you consider normal for your user base.

* the average number of tries of a password over a time before the user calls the service desk or performs a self-service password reset.

* how many failed attempts you want to allow before alerting, and if it will be different for user accounts and privileged accounts.

* how many MFA attempts you want to allow before alerting, and if it will be different for user accounts and privileged accounts.

* if legacy authentication is enabled and your roadmap for discontinuing usage. 

* the known egress IP addresses are for your organization.

* the countries your users operate from.

* whether there are groups of users that remain stationary within a network location or country.

* Identify any other indicators for unusual sign ins that are specific to your organization. For example days or times of the week or year that your organization does not operate.

Once you have scoped what normal is for the types of accounts in your environment, consider the following to help determine which scenarios you want to monitor for and alert on, and to fine-tune your alerting.

* Do you need to monitor and alert if Identity Protection is configured?

* Are there stricter conditions applied to privileged accounts that you can use to monitor and alert on? For example, requiring privileged accounts only be used from trusted IP addresses.

* Are the baselines you set too aggressive? Having too many alerts might result in alerts being ignored or missed.

Configure Identity Protection to help ensure protection is in place that supports your security baseline policies. For example, blocking users if risk = high. This risk level indicates with a high degree of confidence that a user account is compromised. For more information on setting up sign in risk policies and user risk policies, visit [Identity Protection policies](../identity-protection/concept-identity-protection-policies.md). For more information on setting up conditional access, visit [Conditional Access: Sign-in risk-based Conditional Access](../conditional-access/howto-conditional-access-policy-risk.md).

The following are listed in order of importance based on the impact and severity of the entries.

### Monitoring for failed unusual sign ins

| What to monitor| Risk Level| Where| Filter/sub-filter| Notes |
| - |- |- |- |- |
| Failed sign-in attempts.| Medium - if Isolated Incident<br>High - if a number of accounts are experiencing the same pattern or a VIP.| Azure AD Sign-ins log| Status = failed<br>-and-<br>Sign-in error code 50126 - <br>Error validating credentials due to invalid username or password.| Define a baseline threshold, and then monitor and adjust to suite your organizational behaviors and limit false alerts from being generated. |
| Smart lock-out events.| Medium - if Isolated Incident<br>High - if a number of accounts are experiencing the same pattern or a VIP.| Azure AD Sign-ins log| Status = failed<br>-and-<br>Sign-in error code = 50053 – IdsLocked| Define a baseline threshold, and then monitor and adjust to suite your organizational behaviors and limit false alerts from being generated. |
| Interrupts| Medium - if Isolated Incident<br>High - if a number of accounts are experiencing the same pattern or a VIP.| Azure AD Sign-ins log| 500121, Authentication failed during strong authentication request. <br>-or-<br>50097, Device authentication is required or 50074, Strong Authentication is required. <br>-or-<br>50155, DeviceAuthenticationFailed<br>-or-<br>50158, ExternalSecurityChallenge - External security challenge was not satisfied<br>-or-<br>53003 and Failure reason = blocked by CA| Monitor and alert on interrupts.<br>Define a baseline threshold, and then monitor and adjust to suite your organizational behaviors and limit false alerts from being generated. |


The following are listed in order of importance based on the impact and severity of the entries.

| What to monitor| Risk Level| Where| Filter/sub-filter| Notes |
| - |- |- |- |- |
| Multi-factor authentication (MFA) fraud alerts.| High| Azure AD Sign-ins log| Status = failed<br>-and-<br>Details = MFA Denied<br>| Monitor and alert on any entry. |
| Failed authentications from countries you do not operate out of.| Medium| Azure AD Sign-ins log| Location = <unapproved location>| Monitor and alert on any entries. |
| Failed authentications for legacy protocols or protocols that are not used .| Medium| Azure AD Sign-ins log| Status = failure<br>-and-<br>Client app = Other Clients, POP, IMAP, MAPI, SMTP, ActiveSync| Monitor and alert on any entries. |
| Failures blocked by CA.| Medium| Azure AD Sign-ins log| Error code = 53003 <br>-and-<br>Failure reason = blocked by CA| Monitor and alert on any entries. |
| Increased failed authentications of any type.| Medium| Azure AD Sign-ins log| Capture increases in failures across the board. I.e., total failures for today is >10 % on the same day the previous week.| If you don’t have a set threshold, monitor and alert if failures increase by 10% or greater. |
| Authentication occurring at times and days of the week when countries do not conduct normal business operations.| Low| Azure AD Sign-ins log| Capture interactive authentication occurring outside of normal operating days\time. <br>Status = success<br>-and-<br>Location = <location><br>-and-<br>Day\Time = <not normal working hours>| Monitor and alert on any entries. |
| Account disabled/blocked for sign-ins| Low| Azure AD Sign-ins log| Status = Failure<br>-and-<br>error code = 50057, The user account is disabled.| This could indicate someone is trying to gain access to an account once they have left an organization. Although the account is blocked it is still important to log and alert on this activity. |


### Monitoring for successful unusual sign ins

 | What to monitor| Risk Level| Where| Filter/sub-filter| Notes |
| - |- |- |- |- |
| Authentications of privileged accounts outside of expected controls.| High| Azure AD Sign-ins log| Status = success<br>-and-<br>UserPricipalName = <Admin account><br>-and-<br>Location = <unapproved location><br>-and-<br>IP Address = <unapproved IP><br>Device Info= <unapproved Browser, Operating System><br>| Monitor and alert on successful authentication for privileged accounts outside of expected controls. Three common controls are listed. |
| When only single-factor authentication is required.| Low| Azure AD Sign-ins log| Status = success<br>Authentication requirement = Single-factor authentication| Monitor this periodically and ensure this is the expected behavior. |
| Discover privileged accounts not registered for MFA.| High| Azure Graph API| Query for IsMFARegistered eq false for administrator accounts. <br>[List credentialUserRegistrationDetails - Microsoft Graph beta | Microsoft Docs](/graph/api/reportroot-list-credentialuserregistrationdetails?view=graph-rest-beta&tabs=http)| Audit and investigate to determine if intentional or an oversight. |
| Successful authentications from countries your organization does not operate out of.| Medium| Azure AD Sign-ins log| Status = success<br>Location = <unapproved country>| Monitor and alert on any entries not equal to the city names you provide. |
| Successful authentication, session blocked by CA.| Medium| Azure AD Sign-ins log| Status = success<br>-and-<br>error code = 53003 – Failure reason, blocked by CA| Monitor and investigate when authentication is successful, but session is blocked by CA. |
| Successful authentication after you have disabled legacy authentication.| Medium| Azure AD Sign-ins log| status = success <br>-and-<br>Client app = Other Clients, POP, IMAP, MAPI, SMTP, ActiveSync| If your organization has disabled legacy authentication, monitor and alert when successful legacy authentication has taken place. |


On periodic basis, we recommend you review authentications to medium business impact (MBI) and high business impact (HBI) applications where only single-factor authentication is required. For each, you want to determine if single-factor authentication was expected or not. Additionally, review for successful authentication increases or at unexpected times based on the location. 

| What to monitor| Risk Level| Where| Filter/sub-filter| Notes |
| - | - |- |- |- |
| Authentications to MBI and HBI application using single-factor authentication.| Low| Azure AD Sign-ins log| status = success<br>-and-<br>Application ID = <HBI app> <br>-and-<br>Authentication requirement = single-factor authentication.| Review and validate this configuration is intentional. |
| Authentications at days and times of the week or year that countries do not conduct normal business operations.| Low| Azure AD Sign-ins log| Capture interactive authentication occurring outside of normal operating days\time. <br>Status = success<br>Location = <location><br>Date\Time = <not normal working hours>| Monitor and alert on authentications days and times of the week or year that countries do not conduct normal business operations. |
| Measurable increase of successful sign ins.| Low| Azure AD Sign-ins log| Capture increases in successful authentication across the board. I.e., total successes for today is >10 % on the same day the previous week.| If you don’t have a set threshold, monitor and alert if successful authentications increase by 10% or greater. |

## Next steps
See these security operations guide articles:

[Azure AD security operations overview](security-operations-introduction.md)

[Security operations for user accounts](security-operations-user-accounts.md)

[Security operations for privileged accounts](security-operations-privileged-accounts.md)

[Security operations for Privileged Identity Management](security-operations-privileged-identity-management.md)

[Security operations for applications](security-operations-applications.md)

[Security operations for devices](security-operations-devices.md)
 
[Security operations for infrastructure](security-operations-infrastructure.md)

---
title: Microsoft Entra security operations for consumer accounts
description: Guidance to establish baselines and how to monitor and alert on potential security issues with consumer accounts.
services: active-directory
author: jricketts
manager: martinco
ms.service: active-directory
ms.workload: identity
ms.subservice: fundamentals
ms.topic: conceptual
ms.date: 02/28/2023
ms.author: jricketts
ms.custom: "it-pro, seodec18"
ms.collection: M365-identity-device-management
---

# Microsoft Entra security operations for consumer accounts

Consumer identity activities are an important area for your organization to protect and monitor. This article is for Azure Active Directory B2C (Azure AD B2C) tenants and has guidance for monitoring consumer account activities. The activities are:

* Consumer account 
* Privileged account 
* Application 
* Infrastructure 

## Before you begin

Before using the guidance in this article, we recommend you read, [Microsoft Entra security operations guide](security-operations-introduction.md).

## Define a baseline

To discover anomalous behavior, define normal and expected behavior. Defining expected behavior for your organization helps you discover unexpected behavior. Use the definition to help reduce false positives, during monitoring and alerting.

With expected behavior defined, perform baseline monitoring to validate expectations. Then, monitor logs for what falls outside tolerance.

For accounts created outside normal processes, use the Microsoft Entra audit logs, Microsoft Entra sign-in logs, and directory attributes as your data sources. The following suggestions can help you define normal.

### Consumer account creation

Evaluate the following list:

* Strategy and principles for tools and processes to create and manage consumer accounts 
  * For example, standard attributes and formats applied to consumer account attributes
* Approved sources for account creation. 
  * For example, onboarding custom policies, customer provisioning or migration tool
* Alert strategy for accounts created outside approved sources. 
  * Create a controlled list of organizations your organization collaborates with
* Strategy and alert parameters for accounts created, modified, or disabled by an unapproved consumer account administrator
* Monitoring and alert strategy for consumer accounts missing standard attributes, such as customer number, or not following organizational naming conventions
* Strategy, principles, and process for account deletion and retention

## Where to look

Use log files to investigate and monitor. See the following articles for more:

* [Audit logs in Microsoft Entra ID](../reports-monitoring/concept-audit-logs.md)
* [Sign-in logs in Microsoft Entra ID (preview)](../reports-monitoring/concept-sign-ins.md)
* [How To: Investigate risk](../identity-protection/howto-identity-protection-investigate-risk.md)

### Audit logs and automation tools

From the Azure portal, you can view Microsoft Entra audit logs and download as comma separated value (CSV) or JavaScript Object Notation (JSON) files. Use the Azure portal to integrate Microsoft Entra logs with other tools to automate monitoring and alerting:

* **Microsoft Sentinel** – security analytics with security information and event management (SIEM) capabilities
  * [What is Microsoft Sentinel?](/azure/sentinel/overview)
* **Sigma rules** - an open standard for writing rules and templates that automated management tools can use to parse log files. If there are Sigma templates for our recommended search criteria, we added a link to the Sigma repo. Microsoft doesn't write, test, or manage Sigma templates. The repo and templates are created, and collected, by the IT security community.
  * [SigmaHR/sigma](https://github.com/SigmaHQ/sigma/tree/master/rules/cloud/azure)
* **Azure Monitor** – automated monitoring and alerting of various conditions. Create or use workbooks to combine data from different sources.
  * [Azure Monitor overview](/azure/azure-monitor/overview)
* **Azure Event Hubs integrated with a SIEM** - integrate Microsoft Entra logs with SIEMs such as Splunk, ArcSight, QRadar and Sumo Logic with Azure Event Hubs
  * [Azure Event Hubs-A big data streaming platform and event ingestion service](/azure/event-hubs/event-hubs-about)
  * [Tutorial: Stream Microsoft Entra logs to an Azure event hub](../reports-monitoring/howto-stream-logs-to-event-hub.md)
* **Microsoft Defender for Cloud Apps** – discover and manage apps, govern across apps and resources, and conform cloud app compliance
  * [Microsoft Defender for Cloud Apps overview](/defender-cloud-apps/what-is-defender-for-cloud-apps)
* **Identity Protection** - detect risk on workload identities across sign-in behavior and offline indicators of compromise
  * [Securing workload identities with Identity Protection](..//identity-protection/concept-workload-identity-risk.md)

Use the remainder of the article for recommendations on what to monitor and alert. Refer to the tables, organized by threat type. See links to pre-built solutions or samples following the table. Build alerts using the previously mentioned tools.

## Consumer accounts

| What to monitor | Risk level | Where | Filter / subfilter | Notes |
| - | - | - | - | - |
| Large number of account creations or deletions | High | Microsoft Entra audit logs | Activity: Add user<br>Status = success<br>Initiated by (actor) = CPIM Service<br>-and-<br>Activity: Delete user<br>Status = success<br>Initiated by (actor) = CPIM Service | Define a baseline threshold, and then monitor and adjust to suite your organizational behaviors. Limit false alerts. |
| Accounts created and deleted by non-approved users or processes| Medium | Microsoft Entra audit logs | Initiated by (actor) – USER PRINCIPAL NAME<br>-and-<br>Activity: Add user<br>Status = success<br>Initiated by (actor) != CPIM Service<br>and-or<br>Activity: Delete user<br>Status = success<br>Initiated by (actor) != CPIM Service | If the actors are non-approved users, configure to send an alert. |
| Accounts assigned to a privileged role| High | Microsoft Entra audit logs | Activity: Add user<br>Status = success<br>Initiated by (actor) == CPIM Service<br>-and-<br>Activity: Add member to role<br>Status = success | If the account is assigned to a Microsoft Entra role, Azure role, or privileged group membership, alert and prioritize the investigation. |
| Failed sign-in attempts| Medium - if Isolated incident<br>High - if many accounts are experiencing the same pattern | Microsoft Entra sign-in log | Status = failed<br>-and-<br>Sign-in error code 50126 - Error validating credentials due to invalid username or password.<br>-and-<br>Application == "CPIM PowerShell Client"<br>-or-<br>Application == "ProxyIdentityExperienceFramework" | Define a baseline threshold, and then monitor and adjust to suit your organizational behaviors and limit false alerts from being generated. |
| Smart lock-out events| Medium - if Isolated incident<br>High - if many accounts are experiencing the same pattern or a VIP | Microsoft Entra sign-in log | Status = failed<br>-and-<br>Sign-in error code = 50053 – IdsLocked<br>-and-<br>Application == "CPIM PowerShell Client"<br>-or-<br>Application =="ProxyIdentityExperienceFramework" | Define a baseline threshold, and then monitor and adjust to suit your organizational behaviors and limit false alerts. |
| Failed authentications from countries or regions you don't operate from| Medium | Microsoft Entra sign-in log | Status = failed<br>-and-<br>Location = \<unapproved location><br>-and-<br>Application == "CPIM PowerShell Client"<br>-or-<br>Application == "ProxyIdentityExperienceFramework" | Monitor entries not equal to provided city names. |
| Increased failed authentications of any type | Medium | Microsoft Entra sign-in log | Status = failed<br>-and-<br>Application == "CPIM PowerShell Client"<br>-or-<br>Application == "ProxyIdentityExperienceFramework" | If you don't have a threshold, monitor and alert if failures increase by 10%, or greater. |
| Account disabled/blocked for sign-ins | Low | Microsoft Entra sign-in log | Status = Failure<br>-and-<br>error code = 50057, The user account is disabled. | This scenario could indicate someone trying to gain access to an account after they left an organization. The account is blocked, but it's important to log and alert this activity. |
| Measurable increase of successful sign-ins | Low | Microsoft Entra sign-in log | Status = Success<br>-and-<br>Application == "CPIM PowerShell Client"<br>-or-<br>Application == "ProxyIdentityExperienceFramework" | If you don't have a threshold, monitor and alert if successful authentications increase by 10%, or greater. |

## Privileged accounts

| What to monitor | Risk level | Where | Filter / subfilter | Notes |
| - | - | - | - | - |
| Sign-in failure, bad password threshold | High | Microsoft Entra sign-in log | Status = Failure<br>-and-<br>error code = 50126 | Define a baseline threshold and monitor and adjust to suit your organizational behaviors. Limit false alerts. |
| Failure because of Conditional Access requirement | High | Microsoft Entra sign-in log | Status = Failure<br>-and-<br>error code = 53003<br>-and-<br>Failure reason = Blocked by Conditional Access | The event can indicate an attacker is trying to get into the account. |
| Interrupt | High, medium | Microsoft Entra sign-in log | Status = Failure<br>-and-<br>error code = 53003<br>-and-<br>Failure reason = Blocked by Conditional Access | The event can indicate an attacker has the account password, but can't pass the MFA challenge. |
| Account lockout | High | Microsoft Entra sign-in log | Status = Failure<br>-and-<br>error code = 50053 | Define a baseline threshold, then monitor and adjust to suit your organizational behaviors. Limit false alerts. |
| Account disabled or blocked for sign-ins | low | Microsoft Entra sign-in log | Status = Failure<br>-and-<br>Target = User UPN<br>-and-<br>error code = 50057 | The event could indicate someone trying to gain account access after they've left the organization. Although the account is blocked, log and alert this activity. |
| MFA fraud alert or block | High | Microsoft Entra sign-in log/Azure Log Analytics | Sign-ins>Authentication details<br> Result details = MFA denied, fraud code entered | Privileged user indicates they haven't instigated the MFA prompt, which could indicate an attacker has the account password. |
| MFA fraud alert or block | High | Microsoft Entra sign-in log/Azure Log Analytics | Activity type = Fraud reported - User is blocked for MFA or fraud reported - No action taken, based on fraud report tenant-level settings | Privileged user indicated no instigation of the MFA prompt. The scenario can indicate an attacker has the account password. |
| Privileged account sign-ins outside of expected controls | High | Microsoft Entra sign-in log | Status = Failure<br>UserPricipalName = \<Admin account> <br> Location = \<unapproved location> <br> IP address = \<unapproved IP><br>Device info = \<unapproved Browser, Operating System> | Monitor and alert entries you defined as unapproved. |
| Outside of normal sign-in times | High | Microsoft Entra sign-in log | Status = Success<br>-and-<br>Location =<br>-and-<br>Time = Outside of working hours | Monitor and alert if sign-ins occur outside expected times. Find the normal working pattern for each privileged account and alert if there are unplanned changes outside normal working times. Sign-ins outside normal working hours could indicate compromise or possible insider threat. |
| Password change | High | Microsoft Entra audit logs | Activity actor = Admin/self-service<br>-and-<br>Target = User<br>-and-<br>Status = Success or failure | Alert any admin account password changes, especially for global admins, user admins, subscription admins, and emergency access accounts. Write a query for privileged accounts. |
| Changes to authentication methods | High | Microsoft Entra audit logs | Activity: Create identity provider<br>Category: ResourceManagement<br>Target: User Principal Name | The change could indicate an attacker adding an auth method to the account to have continued access. |
| Identity Provider updated by non-approved actors | High | Microsoft Entra audit logs | Activity: Update identity provider<br>Category: ResourceManagement<br>Target: User Principal Name | The change could indicate an attacker adding an auth method to the account to have continued access. |
Identity Provider deleted by non-approved actors | High | Microsoft Entra access reviews | Activity: Delete identity provider<br>Category: ResourceManagement<br>Target: User Principal Name | The change could indicate an attacker adding an auth method to the account to have continued access. |

## Applications

| What to monitor | Risk level | Where | Filter / subfilter | Notes |
| - | - | - | - | - |
| Added credentials to applications | High | Microsoft Entra audit logs | Service-Core Directory, Category-ApplicationManagement<br>Activity: Update Application-Certificates and secrets management<br>-and-<br>Activity: Update Service principal/Update Application | Alert when credentials are: added outside normal business hours or workflows, types not used in your environment, or added to a non-SAML flow supporting service principal. |
| App assigned to an Azure role-based access control (RBAC) role, or Microsoft Entra role | High to medium | Microsoft Entra audit logs | Type: service principal<br>Activity: “Add member to role”<br>or<br>“Add eligible member to role”<br>-or-<br>“Add scoped member to role.” |N/A|
| App granted highly privileged permissions, such as permissions with “.All” (Directory.ReadWrite.All) or wide-ranging permissions (Mail.) | High | Microsoft Entra audit logs |N/A | Apps granted broad permissions such as “.All” (Directory.ReadWrite.All) or wide-ranging permissions (Mail.) |
| Administrator granting application permissions (app roles), or highly privileged delegated permissions | High | Microsoft 365 portal | “Add app role assignment to service principal”<br>-where-<br>Target(s) identifies an API with sensitive data (such as Microsoft Graph) “Add delegated permission grant”<br>-where-<br>Target(s) identifies an API with sensitive data (such as Microsoft Graph)<br>-and-<br>DelegatedPermissionGrant.Scope includes high-privilege permissions. | Alert when a global, application, or cloud application administrator consents to an application. Especially look for consent outside normal activity and change procedures. |
| Application is granted permissions for Microsoft Graph, Exchange, SharePoint, or Microsoft Entra ID. | High | Microsoft Entra audit logs | “Add delegated permission grant”<br>-or-<br>“Add app role assignment to service principal”<br>-where-<br>Target(s) identifies an API with sensitive data (such as Microsoft Graph, Exchange Online, and so on) | Use the alert in the preceding row. |
| Highly privileged delegated permissions granted on behalf of all users | High | Microsoft Entra audit logs | “Add delegated permission grant”<br>where<br>Target(s) identifies an API with sensitive data (such as Microsoft Graph)<br>DelegatedPermissionGrant.Scope includes high-privilege permissions<br>-and-<br>DelegatedPermissionGrant.ConsentType is “AllPrincipals”. | Use the alert in the preceding row. |
| Applications that are using the ROPC authentication flow | Medium | Microsoft Entra sign-in log | Status=Success<br>Authentication Protocol-ROPC | High level of trust is placed in this application because the credentials can be cached or stored. If possible, move to a more secure authentication flow. Use the process only in automated application testing, if ever. |
| Dangling URI | High | Microsoft Entra logs and Application Registration | Service-Core Directory<br>Category-ApplicationManagement<br>Activity: Update Application<br>Success – Property Name AppAddress | For example, look for dangling URIs pointing to a domain name that is gone, or one you don’t own. |
| Redirect URI configuration changes | High | Microsoft Entra logs | Service-Core Directory<br>Category-ApplicationManagement<br>Activity: Update Application<br>Success – Property Name AppAddress | Look for URIs not using HTTPS*, URIs with wildcards at the end or the domain of the URL, URIs that are **not** unique to the application, URIs that point to a domain you don't control. |
| Changes to AppID URI | High | Microsoft Entra logs | Service-Core Directory<br>Category-ApplicationManagement<br>Activity: Update Application<br>Activity: Update Service principal | Look for AppID URI modifications, such as adding, modifying, or removing the URI. |
| Changes to application ownership | Medium | Microsoft Entra logs | Service-Core Directory<br>Category-ApplicationManagement<br>Activity: Add owner to application | Look for instances of users added as application owners outside normal change management activities. |
| Changes to sign out URL | Low | Microsoft Entra logs | Service-Core Directory<br>Category-ApplicationManagement<br>Activity: Update Application<br>-and-<br>Activity: Update service principle | Look for modifications to a sign out URL. Blank entries or entries to non-existent locations would stop a user from terminating a session.

## Infrastructure

| What to monitor | Risk Level | Where | Filter / subfilter | Notes |
| - | - | - | - | - |
| New Conditional Access Policy created by non-approved actors | High | Microsoft Entra audit logs | Activity: Add Conditional Access policy<br>Category: Policy<br>Initiated by (actor): User Principal Name | Monitor and alert Conditional Access changes. Initiated by (actor): approved to make changes to Conditional Access? |
| Conditional Access Policy removed by non-approved actors | Medium | Microsoft Entra audit logs | Activity: Delete Conditional Access policy<br>Category: Policy<br>Initiated by (actor): User Principal Name | Monitor and alert Conditional Access changes. Initiated by (actor): approved to make changes to Conditional Access? |
| Conditional Access Policy updated by non-approved actors | High | Microsoft Entra audit logs | Activity: Update Conditional Access policy<br>Category: Policy<br>Initiated by (actor): User Principal Name | Monitor and alert Conditional Access changes. Initiated by (actor): approved to make changes to Conditional Access?<br>Review Modified Properties and compare old vs. new value |
| B2C custom policy created by non-approved actors | High | Microsoft Entra audit logs| Activity: Create custom policy<br>Category: ResourceManagement<br>Target: User Principal Name | Monitor and alert custom policy changes. Initiated by (actor): approved to make changes to custom policies? |
| B2C custom policy updated by non-approved actors | High | Microsoft Entra audit logs| Activity: Get custom policies<br>Category: ResourceManagement<br>Target: User Principal Name | Monitor and alert custom policy changes. Initiated by (actor): approved to make changes to custom policies? |
| B2C custom policy deleted by non-approved actors | Medium |Microsoft Entra audit logs | Activity: Delete custom policy<br>Category: ResourceManagement<br>Target: User Principal Name | Monitor and alert custom policy changes. Initiated by (actor): approved to make changes to custom policies? |
| User flow created by non-approved actors | High |Microsoft Entra audit logs | Activity: Create user flow<br>Category: ResourceManagement<br>Target: User Principal Name | Monitor and alert on user flow changes. Initiated by (actor): approved to make changes to user flows? |
| User flow updated by non-approved actors | High | Microsoft Entra audit logs| Activity: Update user flow<br>Category: ResourceManagement<br>Target: User Principal Name | Monitor and alert on user flow changes. Initiated by (actor): approved to make changes to user flows? |
| User flow deleted by non-approved actors | Medium | Microsoft Entra audit logs| Activity: Delete user flow<br>Category: ResourceManagement<br>Target: User Principal Name | Monitor and alert on user flow changes. Initiated by (actor): approved to make changes to user flows? |
| API connectors created by non-approved actors | Medium | Microsoft Entra audit logs| Activity: Create API connector<br>Category: ResourceManagement<br>Target: User Principal Name | Monitor and alert API connector changes. Initiated by (actor): approved to make changes to API connectors? |
| API connectors updated by non-approved actors | Medium | Microsoft Entra audit logs| Activity: Update API connector<br>Category: ResourceManagement<br>Target: User Principal Name: ResourceManagement | Monitor and alert API connector changes. Initiated by (actor): approved to make changes to API connectors? |
| API connectors deleted by non-approved actors | Medium | Microsoft Entra audit logs|Activity: Update API connector<br>Category: ResourceManagment<br>Target: User Principal Name: ResourceManagment | Monitor and alert API connector changes. Initiated by (actor): approved to make changes to API connectors? |
| Identity provider (IdP) created by non-approved actors | High |Microsoft Entra audit logs | Activity: Create identity provider<br>Category: ResourceManagement<br>Target: User Principal Name | Monitor and alert IdP changes. Initiated by (actor): approved to make changes to IdP configuration? |
| IdP updated by non-approved actors | High | Microsoft Entra audit logs| Activity: Update identity provider<br>Category: ResourceManagement<br>Target: User Principal Name | Monitor and alert IdP changes. Initiated by (actor): approved to make changes to IdP configuration? |
IdP deleted by non-approved actors | Medium | Microsoft Entra audit logs| Activity: Delete identity provider<br>Category: ResourceManagement<br>Target: User Principal Name | Monitor and alert IdP changes. Initiated by (actor): approved to make changes to IdP configuration? |


## Next steps

To learn more, see the following security operations articles:

* [Microsoft Entra security operations guide](security-operations-introduction.md)
* [Microsoft Entra security operations for user accounts](security-operations-user-accounts.md)
* [Security operations for privileged accounts in Microsoft Entra ID](security-operations-privileged-accounts.md)
* [Microsoft Entra security operations for Privileged Identity Management](security-operations-privileged-identity-management.md)
* [Microsoft Entra security operations guide for applications](security-operations-applications.md)
* [Microsoft Entra security operations for devices](security-operations-devices.md)
* [Security operations for infrastructure](security-operations-infrastructure.md)

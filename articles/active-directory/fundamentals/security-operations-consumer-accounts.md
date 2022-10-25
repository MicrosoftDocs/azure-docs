---
title: Azure Active Directory security operations for consumer accounts
description: Guidance to establish baselines and how to monitor and alert on potential security issues with consumer accounts.
services: active-directory
author: janicericketts
manager: martinco
ms.service: active-directory
ms.workload: identity
ms.subservice: fundamentals
ms.topic: conceptual
ms.date: 07/15/2021
ms.author: jricketts
ms.custom: "it-pro, seodec18"
ms.collection: M365-identity-device-management
---

# Azure Active Directory security operations for consumer accounts

Activities associated with consumer identities is another critical area for your organization to protect and monitor. This article is for Azure AD B2C tenants and provides guidance for monitoring consumer account activities. The activities are organized by:

* Consumer account activities
* Privileged account activities
* Application activities
* Infrastructure activities

If you have not yet read the [Azure Active Directory (Azure AD) security operations overview](security-operations-introduction.md), we recommend you do so before proceeding.

## Define a baseline

To discover anomalous behavior, you first must define what normal and expected behavior is. Defining what expected behavior for your organization is, helps you determine when unexpected behavior occurs. The definition also helps to reduce the noise level of false positives when monitoring and alerting.

Once you define what you expect, you perform baseline monitoring to validate your expectations. With that information, you can monitor the logs for anything that falls outside of tolerances you define.

Use the Azure AD Audit Logs, Azure AD Sign-in Logs, and directory attributes as your data sources for accounts created outside of normal processes. The following are suggestions to help you think about and define what normal is for your organization.

* **Consumer account creation** – evaluate the following:

  * Strategy and principles for tools and processes used for creating and managing consumer accounts. For example, are there standard attributes, formats that are applied to consumer account attributes.

  * Approved sources for account creation. For example, onboarding custom policies, customer provisioning or migration tool.

  * Alert strategy for accounts created outside of approved sources. Is there a controlled list of organizations your organization collaborates with?

  * Strategy and alert parameters for accounts created, modified, or disabled by an account that isn't an approved consumer account administrator.

  * Monitoring and alert strategy for consumer accounts missing standard attributes, such as customer number or not following organizational naming conventions.

  * Strategy, principles, and process for account deletion and retention.

## Where to look

The log files you use for investigation and monitoring are:

* [Azure AD Audit logs](../reports-monitoring/concept-audit-logs.md)

* [Sign-in logs](../reports-monitoring/concept-all-sign-ins.md)

* [Risky Users log](../identity-protection/howto-identity-protection-investigate-risk.md)

* [UserRiskEvents log](../identity-protection/howto-identity-protection-investigate-risk.md)

From the Azure portal, you can view the Azure AD Audit logs and download as comma separated value (CSV) or JavaScript Object Notation (JSON) files. The Azure portal has several ways to integrate Azure AD logs with other tools that allow for greater automation of monitoring and alerting:

* **[Microsoft Sentinel](../../sentinel/overview.md)** – enables intelligent security analytics at the enterprise level by providing security information and event management (SIEM) capabilities.

* **[Sigma rules](https://github.com/SigmaHQ/sigma/tree/master/rules/cloud/azure)** - Sigma is an evolving open standard for writing rules and templates that automated management tools can use to parse log files. Where Sigma templates exist for our recommended search criteria, we've added a link to the Sigma repo. The Sigma templates aren't written, tested, and managed by Microsoft. Rather, the repo and templates are created and collected by the worldwide IT security community.

* **[Azure Monitor](../../azure-monitor/overview.md)** – enables automated monitoring and alerting of various conditions. Can create or use workbooks to combine data from different sources.

* **[Azure Event Hubs](../../event-hubs/event-hubs-about.md) integrated with a SIEM**- [Azure AD logs can be integrated to other SIEMs](../reports-monitoring/tutorial-azure-monitor-stream-logs-to-event-hub.md) such as Splunk, ArcSight, QRadar and Sumo Logic via the Azure Event Hubs integration.

* **[Microsoft Defender for Cloud Apps](/cloud-app-security/what-is-cloud-app-security)** – enables you to discover and manage apps, govern across apps and resources, and check your cloud apps' compliance.

* **[Securing workload identities with Identity Protection Preview](..//identity-protection/concept-workload-identity-risk.md)** - Used to detect risk on workload identities across sign-in behavior and offline indicators of compromise.

 The remainder of this article describes what we recommend you monitor and alert on, and is organized by the type of threat. Where there are specific pre-built solutions we link to them or provide samples following the table. Otherwise, you can build alerts using the preceding tools.

## Consumer accounts

| What to monitor | Risk Level | Where | Filter / subfilter | Notes |
| - | - | - | - | - |
| Large number of account creations or deletions | High | Azure AD Audit logs | Activity: Add user<br>Status = success<br>Initiated by (actor) = CPIM Service<br>-and-<br>Activity: Delete user<br>Status = success<br>Initiated by (actor) = CPIM Service | Define a baseline threshold, and then monitor and adjust to suite your organizational behaviors and limit false alerts from being generated. |
| Accounts created and deleted by non-approved users or processes. | Medium | Azure AD Audit logs | Initiated by (actor) – USER PRINCIPAL NAME<br>-and-<br>Activity: Add user<br>Status = success<br>Initiated by (actor) != CPIM Service<br>and-or<br>Activity: Delete user<br>Status = success<br>Initiated by (actor) != CPIM Service | If the actors are non-approved users, configure to send an alert. |
| Accounts assigned to a privileged role. | High | Azure AD Audit logs | Activity: Add user<br>Status = success<br>Initiated by (actor) == CPIM Service<br>-and-<br>Activity: Add member to role<br>Status = success | If the account is assigned to an Azure AD role, Azure role, or privileged group membership, alert and prioritize the investigation. |
| Failed sign-in attempts. | Medium - if Isolated incident<br>High - if many accounts are experiencing the same pattern | Azure AD Sign-ins log | Status = failed<br>-and-<br>Sign-in error code 50126 - Error validating credentials due to invalid username or password.<br>-and-<br>Application == "CPIM PowerShell Client"<br>-or-<br>Application == "ProxyIdentityExperienceFramework" | Define a baseline threshold, and then monitor and adjust to suite your organizational behaviors and limit false alerts from being generated. |
| Smart lock-out events. | Medium - if Isolated incident<br>High - if many accounts are experiencing the same pattern or a VIP | Azure AD Sign-ins log | Status = failed<br>-and-<br>Sign-in error code = 50053 – IdsLocked<br>-and-<br>Application == "CPIM PowerShell Client"<br>-or-<br>Application =="ProxyIdentityExperienceFramework" | Define a baseline threshold, and then monitor and adjust to suite your organizational behaviors and limit false alerts from being generated. |
| Failed authentications from countries you don't operate out of. | Medium | Azure AD Sign-ins log | Status = failed<br>-and-<br>Location = \<unapproved location><br>-and-<br>Application == "CPIM PowerShell Client"<br>-or-<br>Application == "ProxyIdentityExperienceFramework" | Monitor entries not equal to the city names you provide. |
| Increased failed authentications of any type. | Medium | Azure AD Sign-ins log | Status = failed<br>-and-<br>Application == "CPIM PowerShell Client"<br>-or-<br>Application == "ProxyIdentityExperienceFramework" | If you don't have a set threshold, monitor and alert if failures increase by 10% or greater. |
| Account disabled/blocked for sign-ins | Low | Azure AD Sign-ins log | Status = Failure<br>-and-<br>error code = 50057, The user account is disabled. | This could indicate someone is trying to gain access to an account after they have left an organization. Although the account is blocked it's important to log and alert on this activity. |
| Measurable increase of successful sign-ins. | Low | Azure AD Sign-ins log | Status = Success<br>-and-<br>Application == "CPIM PowerShell Client"<br>-or-<br>Application == "ProxyIdentityExperienceFramework" | If you don't have a set threshold, monitor and alert if successful authentications increase by 10% or greater. |

## Privileged accounts

| What to monitor | Risk Level | Where | Filter/sub-filter | Notes |
| - | - | - | - | - |
| Sign-in failure, bad password threshold | High | Azure AD Sign-ins log | Status = Failure<br>-and-<br>error code = 50126 | Define a baseline threshold and then monitor and adjust to suit your organizational behaviors and limit false alerts from being generated. |
| Failure because of Conditional Access requirement | High | Azure AD Sign-ins log | Status = Failure<br>-and-<br>error code = 53003<br>-and-<br>Failure reason = Blocked by Conditional Access | This event can be an indication an attacker is trying to get into the account. |
| Interrupt | High, medium | Azure AD Sign-ins log | Status = Failure<br>-and-<br>error code = 53003<br>-and-<br>Failure reason = Blocked by Conditional Access | This event can be an indication an attacker has the password for the account but can't pass the MFA challenge. |
| Account lockout | High | Azure AD Sign-ins log | Status = Failure<br>-and-<br>error code = 50053 | Define a baseline threshold, and then monitor and adjust to suit your organizational behaviors and limit false alerts from being generated. |
| Account disabled or blocked for sign-ins | low | Azure AD Sign-ins log | Status = Failure<br>-and-<br>Target = User UPN<br>-and-<br>error code = 50057 | This event could indicate someone is trying to gain access to an account after they've left the organization. Although the account is blocked, it's still important to log and alert on this activity. |
| MFA fraud alert or block | High | Azure AD Sign-ins log/Azure Log Analytics | Sign-ins>Authentication details<br> Result details = MFA denied, fraud code entered | Privileged user has indicated they haven't instigated the MFA prompt, which could indicate an attacker has the password for the account. |
| MFA fraud alert or block | High | Azure AD Sign-ins log/Azure Log Analytics | Activity type = Fraud reported - User is blocked for MFA or fraud reported - No action taken (based on fraud report tenant-level settings) | Privileged user indicated no instigation of the MFA prompt. This can indicate an attacker has the account password. |
| Privileged account sign-ins outside of expected controls | High | Azure AD Sign-ins log | Status = Failure<br>UserPricipalName = \<Admin account> <br> Location = \<unapproved location> <br> IP address = \<unapproved IP><br>Device info = \<unapproved Browser, Operating System> | Monitor and alert on any entries that you've defined as unapproved. |
| Outside of normal sign-in times | High | Azure AD Sign-ins log | Status = Success<br>-and-<br>Location =<br>-and-<br>Time = Outside of working hours | Monitor and alert if sign-ins occur outside of expected times. It's important to find the normal working pattern for each privileged account and to alert if there are unplanned changes outside of normal working times. Sign-ins outside of normal working hours could indicate compromise or possible insider threats. |
| Password change | High | Azure AD Audit logs | Activity actor = Admin/self-service<br>-and-<br>Target = User<br>-and-<br>Status = Success or failure | Alert on any admin account password changes, especially for global admins, user admins, subscription admins, and emergency access accounts. Write a query targeted at all privileged accounts. |
| Changes to authentication methods | High | Azure AD Audit logs | Activity: Create identity provider<br>Category: ResourceManagement<br>Target: User Principal Name | This change could be an indication of an attacker adding an auth method to the account so they can have continued access. |
| Identity Provider updated by non-approved actors | High | Azure AD Audit logs | Activity: Update identity provider<br>Category: ResourceManagement<br>Target: User Principal Name | This change could be an indication of an attacker adding an auth method to the account so they can have continued access. |
Identity Provider deleted by non-approved actors | High | Azure AD Access Reviews | Activity: Delete identity provider<br>Category: ResourceManagement<br>Target: User Principal Name | This change could be an indication of an attacker adding an auth method to the account so they can have continued access. |

## Applications

| What to monitor | Risk Level | Where | Filter/sub-filter | Notes |
| - | - | - | - | - |
| Added credentials to existing applications | High | Azure AD Audit logs | Service-Core Directory, Category-ApplicationManagement<br>Activity: Update Application-Certificates and secrets management<br>-and-<br>Activity: Update Service principal/Update Application | Alert when credentials are: added outside of normal business hours or workflows, of types not used in your environment, or added to a non-SAML flow supporting service principal. |
| App assigned to an Azure role-based access control (RBAC) role, or Azure AD Role | High to medium | Azure AD Audit logs | Type: service principal<br>Activity: “Add member to role”<br>or<br>“Add eligible member to role”<br>-or-<br>“Add scoped member to role.” |
| App granted highly privileged permissions, such as permissions with “.All” (Directory.ReadWrite.All) or wide-ranging permissions (Mail.) | High | Azure AD Audit logs |N/A | Apps granted broad permissions such as “.All” (Directory.ReadWrite.All) or wide-ranging permissions (Mail.) |
| Administrator granting either application permissions (app roles) or highly privileged delegated permissions | High | Microsoft 365 portal | “Add app role assignment to service principal”<br>-where-<br>Target(s) identifies an API with sensitive data (such as Microsoft Graph) “Add delegated permission grant”<br>-where-<br>Target(s) identifies an API with sensitive data (such as Microsoft Graph)<br>-and-<br>DelegatedPermissionGrant.Scope includes high-privilege permissions. | Alert when a global administrator, application administrator, or cloud application administrator consents to an application. Especially look for consent outside of normal activity and change procedures. |
| Application is granted permissions for Microsoft Graph, Exchange, SharePoint, or Azure AD. | High | Azure AD Audit logs | “Add delegated permission grant”<br>-or-<br>“Add app role assignment to service principal”<br>-where-<br>Target(s) identifies an API with sensitive data (such as Microsoft Graph, Exchange Online, and so on) | Alert as in the preceding row. |
| Highly privileged delegated permissions are granted on behalf of all users | High | Azure AD Audit logs | “Add delegated permission grant”<br>where<br>Target(s) identifies an API with sensitive data (such as Microsoft Graph)<br>DelegatedPermissionGrant.Scope includes high-privilege permissions<br>-and-<br>DelegatedPermissionGrant.ConsentType is “AllPrincipals”. | Alert as in the preceding row. |
| Applications that are using the ROPC authentication flow | Medium | Azure AD Sign-ins log | Status=Success<br>Authentication Protocol-ROPC | High level of trust is being placed in this application as the credentials can be cached or stored. Move if possible to a more secure authentication flow. This should only be used in automated testing of applications, if at all. For more information |
| Dangling URI | High | Azure AD Logs and Application Registration | Service-Core Directory<br>Category-ApplicationManagement<br>Activity: Update Application<br>Success – Property Name AppAddress | For example look for dangling URIs that point to a domain name that no longer exists or one you don’t own. |
| Redirect URI configuration changes | High | Azure AD logs | Service-Core Directory<br>Category-ApplicationManagement<br>Activity: Update Application<br>Success – Property Name AppAddress | Look for URIs not using HTTPS*, URIs with wildcards at the end or the domain of the URL, URIs that are **not** unique to the application, URIs that point to a domain you don't control. |
| Changes to AppID URI | High | Azure AD logs | Service-Core Directory<br>Category-ApplicationManagement<br>Activity: Update Application<br>Activity: Update Service principal | Look for any AppID URI modifications, such as adding, modifying, or removing the URI. |
| Changes to application ownership | Medium | Azure AD logs | Service-Core Directory<br>Category-ApplicationManagement<br>Activity: Add owner to application | Look for any instance of a user being added as an application owner outside of normal change management activities. |
| Changes to log-out URL | Low | Azure AD logs | Service-Core Directory<br>Category-ApplicationManagement<br>Activity: Update Application<br>-and-<br>Activity: Update service principle | Look for any modifications to a sign-out URL. Blank entries or entries to non-existent locations would stop a user from terminating a session.

## Infrastructure

| What to monitor | Risk Level | Where | Filter/sub-filter | Notes |
| - | - | - | - | - |
| New Conditional Access Policy created by non-approved actors | High | Azure AD Audit logs | Activity: Add conditional access policy<br>Category: Policy<br>Initiated by (actor): User Principal Name | Monitor and alert on Conditional Access changes. Is Initiated by (actor): approved to make changes to Conditional Access? |
| Conditional Access Policy removed by non-approved actors | Medium | Azure AD Audit logs | Activity: Delete conditional access policy<br>Category: Policy<br>Initiated by (actor): User Principal Name | Monitor and alert on Conditional Access changes. Is Initiated by (actor): approved to make changes to Conditional Access? |
| Conditional Access Policy updated by non-approved actors | High | Azure AD Audit logs | Activity: Update conditional access policy<br>Category: Policy<br>Initiated by (actor): User Principal Name | Monitor and alert on Conditional Access changes. Is Initiated by (actor): approved to make changes to Conditional Access?<br>Review Modified Properties and compare “old” vs “new” value |
| B2C Custom policy created by non-approved actors | High | Azure AD Audit logs| Activity: Create custom policy<br>Category: ResourceManagement<br>Target: User Principal Name | Monitor and alert on Custom Policies changes. Is Initiated by (actor): approved to make changes to Custom Policies? |
| B2C Custom policy updated by non-approved actors | High | Azure AD Audit logs| Activity: Get custom policies<br>Category: ResourceManagement<br>Target: User Principal Name | Monitor and alert on Custom Policies changes. Is Initiated by (actor): approved to make changes to Custom Policies? |
| B2C Custom policy deleted by non-approved actors | Medium |Azure AD Audit logs | Activity: Delete custom policy<br>Category: ResourceManagement<br>Target: User Principal Name | Monitor and alert on Custom Policies changes. Is Initiated by (actor): approved to make changes to Custom Policies? |
| User Flow created by non-approved actors | High |Azure AD Audit logs | Activity: Create user flow<br>Category: ResourceManagement<br>Target: User Principal Name | Monitor and alert on User Flow changes. Is Initiated by (actor): approved to make changes to User Flows? |
| User Flow updated by non-approved actors | High | Azure AD Audit logs| Activity: Update user flow<br>Category: ResourceManagement<br>Target: User Principal Name | Monitor and alert on User Flow changes. Is Initiated by (actor): approved to make changes to User Flows? |
| User Flow deleted by non-approved actors | Medium | Azure AD Audit logs| Activity: Delete user flow<br>Category: ResourceManagement<br>Target: User Principal Name | Monitor and alert on User Flow changes. Is Initiated by (actor): approved to make changes to User Flows? |
| API Connectors created by non-approved actors | Medium | Azure AD Audit log| Activity: Create API connector<br>Category: ResourceManagement<br>Target: User Principal Name | Monitor and alert on API Connector changes. Is Initiated by (actor): approved to make changes to API Connectors? |
| API Connectors updated by non-approved actors | Medium | Azure AD Audit logs| Activity: Update API connector<br>Category: ResourceManagement<br>Target: User Principal Name: ResourceManagement | Monitor and alert on API Connector changes. Is Initiated by (actor): approved to make changes to API Connectors? |
| API Connectors deleted by non-approved actors | Medium | Azure AD Audit log|Activity: Update API connector<br>Category: ResourceManagment<br>Target: User Principal Name: ResourceManagment | Monitor and alert on API Connector changes. Is Initiated by (actor): approved to make changes to API Connectors? |
| Identity Provider created by non-approved actors | High |Azure AD Audit log | Activity: Create identity provider<br>Category: ResourceManagement<br>Target: User Principal Name | Monitor and alert on Identity Provider changes. Is Initiated by (actor): approved to make changes to Identity Provider configuration? |
| Identity Provider updated by non-approved actors | High | Azure AD Audit log| Activity: Update identity provider<br>Category: ResourceManagement<br>Target: User Principal Name | Monitor and alert on Identity Provider changes. Is Initiated by (actor): approved to make changes to Identity Provider configuration? |
Identity Provider deleted by non-approved actors | Medium | | Activity: Delete identity provider<br>Category: ResourceManagement<br>Target: User Principal Name | Monitor and alert on Identity Provider changes. Is Initiated by (actor): approved to make changes to Identity Provider configuration? |


## Next steps

See these security operations guide articles:

[Azure AD security operations overview](security-operations-introduction.md)

[Security operations for user accounts](security-operations-user-accounts.md)

[Security operations for privileged accounts](security-operations-privileged-accounts.md)

[Security operations for Privileged Identity Management](security-operations-privileged-identity-management.md)

[Security operations for applications](security-operations-applications.md)

[Security operations for devices](security-operations-devices.md)

[Security operations for infrastructure](security-operations-infrastructure.md)

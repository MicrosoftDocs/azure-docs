---
title: Azure Active Directory security operations for applications
description: Learn how to monitor and alert on applications to identify security threats.
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

# Azure Active Directory security operations guide for Applications

Applications provide an attack surface for security breaches and must be monitored. While not targeted as often as user accounts, breaches can occur. Since applications often run without human intervention, the attacks may be harder to detect.

This article provides guidance to monitor and alert on application events. It's regularly updated to help ensure that you:

* Prevent malicious applications from getting unwarranted access to data.

* Prevent existing applications from being compromised by bad actors.

* Gather insights that enable you to build and configure new applications more securely.

If you're unfamiliar with how applications work in Azure Active Directory (Azure AD), see [Apps and service principals in Azure AD](../develop/app-objects-and-service-principals.md).

> [!NOTE]
> If you have not yet reviewed the [Azure Active Directory security operations overview](security-operations-introduction.md), consider doing so now.

## What to look for

As you monitor your application logs for security incidents, review the following to help differentiate normal activity from malicious activity. The following events may indicate security concerns and each are covered in the rest of the article.

* Any changes occurring outside of normal business processes and schedules.

* Application credentials changes

* Application permissions

   * Service principal assigned to an Azure AD or Azure RBAC role.

   * Applications that are granted highly privileged permissions.

   * Azure Key Vault changes.

   * End user granting applications consent.

   * Stopped end user consent based on level of risk.

* Application configuration changes

   * Universal resource identifier (URI) changed or non-standard.

   * Changes to application owners.

   * Logout URLs modified.

## Where to look

The log files you use for investigation and monitoring are:

* [Azure AD Audit logs](../reports-monitoring/concept-audit-logs.md)

* [Sign-in logs](../reports-monitoring/concept-all-sign-ins.md)

* [Microsoft 365 Audit logs](/microsoft-365/compliance/auditing-solutions-overview?view=o365-worldwide)

* [Azure Key Vault logs](../../key-vault/general/logging.md)

From the Azure portal, you can view the Azure AD Audit logs and download as comma-separated value (CSV) or JavaScript Object Notation (JSON) files. The Azure portal has several ways to integrate Azure AD logs with other tools that allow for greater automation of monitoring and alerting:

* **[Azure Sentinel](../../sentinel/overview.md)** – enables intelligent security analytics at the enterprise level by providing security information and event management (SIEM) capabilities. 

* **[Azure Monitor](../../azure-monitor/overview.md)** – enables automated monitoring and alerting of various conditions. Can create or use workbooks to combine data from different sources.

* **[Azure Event Hubs](../../event-hubs/event-hubs-about.md) integrated with a SIEM**- [Azure AD logs can be integrated to other SIEMs](../reports-monitoring/tutorial-azure-monitor-stream-logs-to-event-hub.md) such as Splunk, ArcSight, QRadar, and Sumo Logic via the Azure Event Hub integration.

* **[Microsoft Cloud App Security](/cloud-app-security/what-is-cloud-app-security) (MCAS)** – enables you to discover and manage apps, govern across apps and resources, and check your cloud apps’ compliance.

Much of what you will monitor and alert on are the effects of your Conditional Access policies. You can use the [Conditional Access insights and reporting workbook](../conditional-access/howto-conditional-access-insights-reporting.md) to examine the effects of one or more Conditional Access policies on your sign-ins, as well as the results of policies, including device state. This workbook enables you to view an impact summary, and identify the impact over a specific time period. You can also use the workbook to investigate the sign-ins of a specific user. 

 The remainder of this article describes what we recommend you monitor and alert on, and is organized by the type of threat. Where there are specific pre-built solutions we link to them or provide samples following the table. Otherwise, you can build alerts using the preceding tools. 

## Application credentials

Many applications use credentials to authenticate in Azure AD. Any additional credentials added outside of expected processes could be a malicious actor using those credentials. We strongly recommend using X509 certificates issued by trusted authorities or Managed Identities instead of using client secrets. However, if you need to use client secrets, follow good hygiene practices to keep applications safe. Note, application and service principal updates are logged as two entries in the audit log. 

* Monitor applications to identify those with long credential expiration times.

* Replace long-lived credentials with credentials that have a short life span. Take steps to ensure that credentials don't get committed in code repositories and are stored securely.


| What to monitor| Risk Level| Where| Filter/sub-filter| Notes |
| -|-|-|-|-|
| Added credentials to existing applications| High| Azure AD Audit logs| Service-Core Directory, Category-ApplicationManagement <br>Activity: Update Application-Certificates and secrets management<br>-and-<br>Activity: Update Service principal/Update Application| Alert when credentials are:<li> added outside of normal business hours or workflows.<li> of types not used in your environment.<li> added to a non-SAML flow supporting service principal. |
| Credentials with a lifetime longer than your policies allow.| Medium| Microsoft Graph| State and end date of Application Key credentials<br>-and-<br>Application password credentials| You can use MS Graph API to find the start and end date of credentials, and evaluate those with a longer than allowed lifetime. See PowerShell script following this table. |

 The following pre-built monitoring and alerts are available.

* Azure Sentinel – [Alert when new app or service principle credentials added](https://github.com/Azure/Azure-Sentinel/blob/master/Detections/AuditLogs/NewAppOrServicePrincipalCredential.yaml) 

* Azure Monitor – [Azure AD workbook to help you assess Solorigate risk - Microsoft Tech Community](https://techcommunity.microsoft.com/t5/azure-active-directory-identity/azure-ad-workbook-to-help-you-assess-solorigate-risk/ba-p/2010718)

* MCAS – [Cloud App Security anomaly detection alerts investigation guide](/cloud-app-security/investigate-anomaly-alerts)

* PowerShell - [Sample PowerShell script to find credential lifetime](https://github.com/madansr7/appCredAge).

## Application permissions

Like an administrator account, applications can be assigned privileged roles. Apps can be assigned Azure AD roles, such as global administrator, or Azure RBAC roles such as subscription owner. Because they can run without a user present and as a background service, closely monitor anytime an application is granted a highly privileged role or permission. 

### Service principal assigned to a role


| What to monitor| Risk Level| Where| Filter/sub-filter| Notes |
|-|-|-|-|-|
| App assigned to Azure RBAC role, or Azure AD Role| High to Medium| Azure AD Audit logs| Type: service principal<br>Activity: “Add member to role” or “Add eligible member to role”<br>-or-<br>“Add scoped member to role.”| For highly privileged roles such as Global Administrator, risk is high. For lower privileged roles risk is medium. Alert anytime an application is assigned to an Azure role or Azure AD role outside of normal change management or configuration procedures. |

### Application granted highly privileged permissions

Applications should also follow the principal of least privilege. Investigate application permissions to ensure they're truly needed. You can create an [app consent grant report](https://aka.ms/getazureadpermissions) to help identify existing applications and highlight privileged permissions.

| What to monitor|Risk Level|Where| Filter/sub-filter| Notes|
|-|-|-|-|-|
| App granted highly privileged permissions, such as permissions with “*.All” (Directory.ReadWrite.All) or wide ranging permissions (Mail.*)| High |Azure AD Audit logs| “Add app role assignment to service principal”, <br>- where-<br> Target(s) identifies an API with sensitive data (such as Microsoft Graph) <br>-and-<br>AppRole.Value identifies a highly privileged application permission (app role).| Apps granted broad permissions such as “*.All” (Directory.ReadWrite.All) or wide ranging permissions (Mail.*) |
| Administrator granting either application permissions (app roles) or highly privileged delegated permissions |High| Microsoft 365 portal| “Add app role assignment to service principal”, <br>-where-<br>Target(s) identifies an API with sensitive data (such as Microsoft Graph)<br>“Add delegated permission grant”, <br>-where-<br>Target(s) identifies an API with sensitive data (such as Microsoft Graph) <br>-and-<br>DelegatedPermissionGrant.Scope includes high-privilege permissions.| Alert when a global administrator, application administrator, or cloud application administrator consents to an application. Especially look for consent outside of normal activity and change procedures. |
| Application is granted permissions for Microsoft Graph, Exchange, SharePoint, or Azure AD. |High| Azure AD Audit logs| “Add delegated permission grant” <br>-or-<br>“Add app role assignment to service principal”, <br>-where-<br>Target(s) identifies an API with sensitive data (such as Microsoft Graph, Exchange Online, and so on)| Alert as in the preceding row. |
| Application permissions (app roles) for other APIs are granted |Medium| Azure AD Audit logs| “Add app role assignment to service principal”, <br>-where-<br>Target(s) identifies any other API.| Alert as in the preceding row. |
| Highly privileged delegated permissions are granted on behalf of all users |High| Azure AD Audit logs| “Add delegated permission grant”, where Target(s) identifies an API with sensitive data (such as Microsoft Graph), <br> DelegatedPermissionGrant.Scope includes high-privilege permissions, <br>-and-<br>DelegatedPermissionGrant.ConsentType is “AllPrincipals”.| Alert as in the preceding row. |

For more information on monitoring app permissions, see this tutorial: [Investigate and remediate risky OAuth apps](/cloud-app-security/investigate-risky-oauth).

### Azure Key Vault

Azure Key Vault can be used to store your tenant’s secrets. We recommend you pay particular attention to any changes to Key Vault configuration and activities. 

| What to monitor| Risk Level| Where| Filter/sub-filter| Notes |
|-|-|-|-|-|
| How and when your Key Vaults are accessed and by whom| Medium| [Azure Key Vault logs](../../key-vault/general/logging.md?tabs=Vault)| Resource type: Key Vaults| Look for <li> any access to Key Vault outside of regular processes and hours. <li> any changes to Key Vault ACL. |

After setting up Azure Key Vault, be sure to [enable logging](../../key-vault/general/howto-logging.md?tabs=azure-cli), which shows [how and when your Key Vaults are accessed](../../key-vault/general/logging.md?tabs=Vault), and [configure alerts](../../key-vault/general/alert.md) on Key Vault to notify assigned users or distribution lists via email, phone call, text message, or [event grid](../../key-vault/general/event-grid-overview.md) notification if health is impacted. Additionally, setting up [monitoring](../../key-vault/general/alert.md) with Key Vault insights will give you a snapshot of Key Vault requests, performance, failures, and latency. [Log Analytics](../../azure-monitor/logs/log-analytics-overview.md) also has some [example queries](../../azure-monitor/logs/queries.md) for Azure Key Vault that can be accessed after selecting your Key Vault and then under “Monitoring” selecting “Logs”.

### End-user consent

| What to monitor| Risk Level| Where| Filter/sub-filter| Notes |
|-|-|-|-|-|
| End-user consent to application| Low| Azure AD Audit logs| Activity: Consent to application / ConsentContext.IsAdminConsent = false| Look for: <li>high profile or highly privileged accounts.<li> app requests high-risk permissions<li>apps with suspicious names, for example generic, misspelled, etc. |


The act of consenting to an application is not in itself malicious. However, investigate new end-user consent grants looking for suspicious applications. You can [restrict user consent operations](/azure/security/fundamentals/steps-secure-identity).

For more information on consent operations, see the following resources:

* [Managing consent to applications and evaluating consent requests in Azure Active Directory](../manage-apps/manage-consent-requests.md)

* [Detect and Remediate Illicit Consent Grants - Office 365](/microsoft-365/security/office-365-security/detect-and-remediate-illicit-consent-grants?view=o365-worldwide)

* [Incident response playbook - App consent grant investigation](/security/compass/incident-response-playbook-app-consent)

### End user stopped due to risk-based consent 

| What to monitor| Risk Level| Where| Filter/sub-filter| Notes |
|-|-|-|-|-|
| End-user consent stopped due to risk-based consent| Medium| Azure AD Audit logs| Core Directory / ApplicationManagement / Consent to application<br> Failure status reason = Microsoft.online.Security.userConsent<br>BlockedForRiskyAppsExceptions| Monitor and analyze any time consent is stopped due to risk. Look for:<li>high profile or highly privileged accounts.<li> app requests high-risk permissions<li>apps with suspicious names, for example generic, misspelled, etc. |

## Application configuration changes

Monitor changes to any application’s configuration. Specifically, configuration changes to the uniform resource identifier (URI), ownership, and logout URL.

### Dangling URI and Redirect URI changes 

| What to monitor| Risk Level| Where| Filter/sub-filter| Notes |
|-|-|-|-|-|
| Dangling URI| High| Azure AD Logs and Application Registration| Service-Core Directory, Category-ApplicationManagement<br>Activity: Update Application<br>Success – Property Name AppAddress| Look for dangling URIs, for example,  that point to a domain name that no longer exists or one that you don’t explicitly own. |
| Redirect URI configuration changes| High| Azure AD logs| Service-Core Directory, Category-ApplicationManagement<br>Activity: Update Application<br>Success – Property Name AppAddress| Look for URIs not using HTTPS*, URIS with wildcards at the end or the domain of the URL, URIs that are NOT unique to the application, URIs that point to a domain you do not control. |

Alert anytime these changes are detected.

### AppID URI added, modified, or removed


| What to monitor| Risk Level| Where| Filter/sub-filter| Notes |
|-|-|-|-|-|
| Changes to AppID URI| High| Azure AD logs| Service-Core Directory, Category-ApplicationManagement<br>Activity: Update<br>Application<br>Activity: Update Service principal| Look for any AppID URI modifications, such as adding, modifying, or removing the URI. |


Alert any time these changes are detected outside of approved change management procedures.

### New Owner


| What to monitor| Risk Level| Where| Filter/sub-filter| Notes |
|-|-|-|-|-|
| Changes to application ownership| Medium| Azure AD logs| Service-Core Directory, Category-ApplicationManagement<br>Activity: Add owner to application| Look for any instance of a user being added as an application owner outside of normal change management activities. |

### Logout URL modified or removed

| What to monitor| Risk Level| Where| Filter/sub-filter| Notes |
|-|-|-|-|-|
| Changes to logout URL| Low| Azure AD logs| Service-Core Directory, Category-ApplicationManagement<br>Activity: Update Application<br>-and-<br>Activity: Update service principle| Look for any modifications to a sign out URL. Blank entries or entries to non-existent locations would stop a user from terminating a session. |

## Additional Resources

The following are links to useful resources:

* Github Azure AD toolkit - [https://github.com/microsoft/AzureADToolkit](https://github.com/microsoft/AzureADToolkit)

* Azure Key Vault security overview and security guidance - [Azure Key Vault security overview](../../key-vault/general/security-features.md)

* Solorgate risk information and tools - [Azure AD workbook to help you access Solorigate risk](https://techcommunity.microsoft.com/t5/azure-active-directory-identity/azure-ad-workbook-to-help-you-assess-solorigate-risk/ba-p/2010718)

* OAuth attack detection guidance - [Unusual addition of credentials to an OAuth app](/cloud-app-security/investigate-anomaly-alerts)

Azure AD monitoring configuration information for SIEMs - [Partner tools with Azure Monitor integration](../..//azure-monitor/essentials/stream-monitoring-data-event-hubs.md)

 ## Next steps

See these security operations guide articles:

[Azure AD security operations overview](security-operations-introduction.md)

[Security operations for user accounts](security-operations-user-accounts.md)

[Security operations for privileged accounts](security-operations-privileged-accounts.md)

[Security operations for Privileged Identity Management](security-operations-privileged-identity-management.md)

[Security operations for applications](security-operations-applications.md)

[Security operations for devices](security-operations-devices.md)

 
[Security operations for infrastructure](security-operations-infrastructure.md)

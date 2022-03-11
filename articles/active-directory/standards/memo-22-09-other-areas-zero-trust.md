---
title: Memo 22-09 additional areas of Zero Trust
description: Guidance on understanding additional Zero Trust requirements outlined in US government OMB memorandum 22-09
services: active-directory 
ms.service: active-directory
ms.subservice: standards
ms.workload: identity
ms.topic: how-to
author: barbaraselden
ms.author: baselden
manager: martinco
ms.reviewer: martinco
ms.date: 3/10/2022
ms.custom: it-pro
ms.collection: M365-identity-device-management
---

# Other areas of zero trust addressed in Memo 22-09

While this guidance set is meant to address the identity specific actions of the memorandum, there are other areas of the zero trust maturity model that cover topics beyond the identity pillar. 

The scope of the following sections is to give guidance on the following cross-cutting themes:

* Visibility and analytics

* Automation and orchestration

* Governance 

## Visibility

Monitoring Azure AD is important. You must to adopt an "assume breach" mindset and meet compliance standards set forth in M-22-09 and M-21-31. There are three primary log types used for security analysis and ingestion:

* [Azure Audit Log.](../reports-monitoring/concept-audit-logs.md) Used to monitor operational activities of the directory itself such as creating, deleting, updating objects like users or groups, as well as making changes to configurations of Azure AD like modifications to a conditional access policy.

* [Azure AD Sign-In Logs.](../reports-monitoring/concept-all-sign-ins.md) Used to monitor all sign-in activities associated with users, applications, and service principals. The sign-in logs contain specific categories of sign-ins for easy distinctions between them:

   * Interactive sign-ins: Shows user sign-ins for failures, successes, as well as policies that may have been applied and other relevant metadata.

   *  Non-interactive user sign-ins: Shows sign-ins where a user did not perform an interaction during sign-in, typically clients signing in on behalf of the user such as mobile applications or email clients.

  *  Service principal sign-ins: Sign-ins by service principals or applications, typically these are headless and done by services or applications accessing other services, applications or Azure AD directory itself through REST API.

   *  Managed identities for azure resource sign-ins: These are sign-ins from resources where Azure Managed identities were created. Typically these are Azure resources or applications that are accessing other Azure resources such as a web application service authenticating to a Azure SQL backend. 

*  [Provisioning Logs.](../reports-monitoring/concept-provisioning-logs.md) These logs contain information about objects synchronized from Azure AD using SCIM to applications like Service Now. 

Log entries are stored for 7 days in Azure AD free tenants. Tenants that contain an Azure AD premium license retain these logs for 30 days. It’s important to ensure your logs are ingested by a SIEM tool. Using a SIEM allows sign-in and audit events to be correlated with application, infrastructure, data, device, and network logs for a holistic view of your systems. Microsoft recommends integrating your Azure AD logs with [Sentinel](../../sentinel/overview.md) by configuring a connector to ingest your Azure AD tenant Logs For more infomration, see [Connect Azure Active Directory to Sentinel](../../sentinel/connect-azure-active-directory.md). You can also configure the [diagnostic settings](../reports-monitoring/overview-monitoring.md) on your Azure AD tenant to send the data to either a Storage account, EventHub, or Log analytics workspace. These storage options allow you to integrate 3rd party SIEM tools to collect the data. For more information, see [Plan reports & monitoring deployment](../reports-monitoring/plan-monitoring-and-reporting.md).

## Analytics

Analytics can be used to aggregate information from Azure AD about trends in your security posture in comparison to your baseline. Analytics can also be used as the way to assess and look for patterns or threats across Azure AD.

* [Azure AD Identity Protection.](../identity-protection/overview-identity-protection.md) Identity protection actively analyses sign-ins and other telemetry sources for risky behavior. Identity protection assigns a risk score to a sign-in event. You can prevent sign-ins, or force a step-up authentication, to access a resource or application based on risk score.

* [Microsoft Sentinel.](../../sentinel/get-visibility.md) Sentinel has many ways in which information from Azure AD can be analyzed. 

   * Microsoft Sentinel has [User and Entity Behavioral Analytics (UEBA)](../../sentinel/identify-threats-with-entity-behavior-analytics.md). UEBA delivers high-fidelity, actionalble intelligence on potential threats involving user, hosts, IP addresses, and application entities. This enhances events across the enterprise to help detect anomalous behavior in users and systems. 

   * Specific analytics rule templates that hunt for threats and alerts on conditions found in information in your Azure AD logs. YOur security or operation analyst can then triage and remediate threats.

   * Microsoft Sentinel has [workbooks](../../sentinel/top-workbooks.md) available that help visualize multiple data sources from Azure AD. These include workbooks that show aggregate sign-ins by country, or applications you have with the most sign-ins. You can also create or modify existing workbooks to view information or threats from Azure AD in a dashboard to gain insights. 

* [Azure AD usage and insights report.](../reports-monitoring/concept-usage-insights-report.md) These reports show information similar to sentinel workbooks, including which applications have the highest usage or logon trends over a given time period. These are useful for understanding aggregate trends in your enterprise which may indicate an attack or other events. 

## Automation and orchestration

Automation is an important aspect of Zero Trust, particularly in remediation of alerts that may occur due to threats or security changes in your environment. This section will focus on automation integrations that are possible with Azure AD to remediate alerts or perform actions that may improve your overall security posture because of information received from monitoring and analytics. 
Azure AD uses the [Microsoft Graph API](../develop/microsoft-graph-intro.md) REST calls as the most common way to programmatically access Azure AD. This API-based access requires an Azure AD identity with the necessary authorizations and scope. Microsoft recommends an Azure function or Azure Logic App be set up to use a [System Assigned Managed Identity](../managed-identities-azure-resources/overview.md). Your logic app or function contains the steps or code necessary to carry out the action in an automated fashion. You assign permissions to the managed identity to grant the service principal the necessary directory permissions to perform the required actions. Ensure that you follow a least privileged model when granting managed identities access to Azure AD: Only grant the minimum rights necessary. With the Graph API, you can integrate third party tools. Follow the principles outlined in this article when performing your integration. 
Another automation integration point is [Azure AD PowerShell](/powershell/azure/active-directory/overview?view=azureadps-2.0) modules. PowerShell is a useful automation tool for administrators and IT integrators performing common tasks or configurations in Azure AD. PowerShell can also be incorporated into Azure functions or Azure automation runbooks. 

## Governance

Azure AD has several features that allow for governance-like functionality to be applied to scopes within Azure AD. It is important that you understand and document clear processes for how you intend to operate your Azure AD environment. Consider the following guidance to help with governance with Azure AD 
* [Azure Active Directory governance operations reference guide](../fundamentals/active-directory-ops-guide-govern.md). 
* Security operational guidance for Azure AD is also available to aid in understanding how governance and SecOps overlap [Azure Active Directory security operations guide](../fundamentals/security-operations-introduction.md). 
* Once you understand operational governance, you can use [governance features](../governance/identity-governance-overview.md) to implement portions of your governance controls. These include features mentioned in [Authorization for Memo 22-09](memo-22-09-authorization.md). 

 
## Next steps

The following articles are a part of this documentation set:

[Meet identity requirements of Memorandum 22-09](memo-22-09-meet-identity-requirements.md)

[Enterprise-wide identity management system](memo-22-09-enterprise-wide-identity-management-system.md)

[Multi-factor authentication](memo-22-09-multi-factor-authentication.md)

[Authorization](memo-22-09-authorization.md)

[Other areas of Zero Trust](memo-22-09-other-areas-zero-trust.md)

Additional Zero Trust Documentation

[Securing identity with Zero Trust](/security/zero-trust/deploy/identity)

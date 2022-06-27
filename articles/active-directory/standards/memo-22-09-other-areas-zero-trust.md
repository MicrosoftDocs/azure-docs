---
title: Memo 22-09 other areas of Zero Trust
description: Get guidance on understanding other Zero Trust requirements outlined in US government OMB memorandum 22-09.
services: active-directory 
ms.service: active-directory
ms.subservice: standards
ms.workload: identity
ms.topic: how-to
author: gargi-sinha
ms.author: gasinh
manager: martinco
ms.reviewer: martinco
ms.date: 3/10/2022
ms.custom: it-pro
ms.collection: M365-identity-device-management
---

# Other areas of Zero Trust addressed in memorandum 22-09

The other articles in this guidance set address the identity pillar of Zero Trust principles, as described in the US federal government's Office of Management and Budget (OMB) [memorandum 22-09](https://www.whitehouse.gov/wp-content/uploads/2022/01/M-22-09.pdf). This article covers areas of the Zero Trust maturity model that are beyond the identity pillar. 

This article addresses the following cross-cutting themes:

* Visibility and analytics

* Automation and orchestration

* Governance 

## Visibility

It's important to monitor your Azure Active Directory (Azure AD) tenant. You must adopt an "assume breach" mindset and meet compliance standards in memorandum 22-09 and [memorandum 21-31](https://www.whitehouse.gov/wp-content/uploads/2021/08/M-21-31-Improving-the-Federal-Governments-Investigative-and-Remediation-Capabilities-Related-to-Cybersecurity-Incidents.pdf). Three primary log types are used for security analysis and ingestion:

* [Azure audit logs](../reports-monitoring/concept-audit-logs.md). Used for monitoring operational activities of the directory itself, such as creating, deleting, updating objects like users or groups. Also used for making changes to configurations of Azure AD, like modifications to a conditional access policy.

* [Azure AD sign-in logs](../reports-monitoring/concept-all-sign-ins.md). Used for monitoring all sign-in activities associated with users, applications, and service principals. The sign-in logs contain specific categories of sign-ins for easy differentiation:

  * Interactive sign-ins: Shows user successful and failed sign-ins for failures, the policies that might have been applied, and other relevant metadata.

  * Non-interactive user sign-ins: Shows sign-ins where a user did not perform an interaction during sign-in. These sign-ins are typically clients signing in on behalf of the user, such as mobile applications or email clients.

  * Service principal sign-ins: Shows sign-ins by service principals or applications. Typically, these are headless and done by services or applications that are accessing other services, applications, or the Azure AD directory itself through the REST API.

  * Managed identities for Azure resource sign-ins: Shows sign-ins from resources with Azure managed identities. Typically, these are Azure resources or applications that are accessing other Azure resources, such as a web application service authenticating to an Azure SQL back end. 

* [Provisioning logs](../reports-monitoring/concept-provisioning-logs.md). Shows information about objects synchronized from Azure AD to applications like Service Now by using Microsoft Identity Manager. 

Log entries are stored for 7 days in Azure AD free tenants. Tenants with an Azure AD premium license retain log entries for 30 days. 

It's important to ensure that your logs are ingested by a security information and event management (SIEM) tool. Using a SIEM tool allows sign-in and audit events to be correlated with application, infrastructure, data, device, and network logs for a holistic view of your systems. 

We recommend that you integrate your Azure AD logs with [Microsoft Sentinel](../../sentinel/overview.md) by configuring a connector to ingest your Azure AD tenant logs. For more information, see [Connect Azure Active Directory to Microsoft Sentinel](../../sentinel/connect-azure-active-directory.md).

You can also configure the [diagnostic settings](../reports-monitoring/overview-monitoring.md) on your Azure AD tenant to send the data to an Azure Storage account, Azure Event Hubs, or a Log Analytics workspace. These storage options allow you to integrate other SIEM tools to collect the data. For more information, see [Plan an Azure Active Directory reporting and monitoring deployment](../reports-monitoring/plan-monitoring-and-reporting.md).

## Analytics

You can use analytics in the following tools to aggregate information from Azure AD and show trends in your security posture in comparison to your baseline. You can also use analytics to assess and look for patterns or threats across Azure AD. 

* [Azure AD Identity Protection](../identity-protection/overview-identity-protection.md) actively analyzes sign-ins and other telemetry sources for risky behavior. Identity Protection assigns a risk score to a sign-in event. You can prevent sign-ins, or force a step-up authentication, to access a resource or application based on risk score.

* [Microsoft Sentinel](../../sentinel/get-visibility.md) offers the following ways to analyze information from Azure AD: 

  * Microsoft Sentinel has [User and Entity Behavior Analytics (UEBA)](../../sentinel/identify-threats-with-entity-behavior-analytics.md). UEBA delivers high-fidelity, actionable intelligence on potential threats that involve user, host, IP address, and application entities. This intelligence enhances events across the enterprise to help detect anomalous behavior in users and systems. 

  * You can use specific analytics rule templates that hunt for threats and alerts found in your Azure AD logs. Your security or operation analyst can then triage and remediate threats.

  * Microsoft Sentinel has [workbooks](../../sentinel/top-workbooks.md) that help you visualize multiple Azure AD data sources. These workbooks can show aggregate sign-ins by country, or applications that have the most sign-ins. You can also create or modify existing workbooks to view information or threats in a dashboard to gain insights. 

* [Azure AD usage and insights reports](../reports-monitoring/concept-usage-insights-report.md) show information similar to Azure Sentinel workbooks, including which applications have the highest usage or sign-in trends over a time period. The reports are useful for understanding aggregate trends in your enterprise that might indicate an attack or other events. 

## Automation and orchestration

Automation is an important aspect of Zero Trust, particularly in remediation of alerts that occur because of threats or security changes in your environment. In Azure AD, automation integrations are possible to help remediate alerts or perform actions that can improve your security posture. Automations are based on information received from monitoring and analytics. 

[Microsoft Graph API](../develop/microsoft-graph-intro.md) REST calls are the most common way to programmatically access Azure AD. This API-based access requires an Azure AD identity with the necessary authorizations and scope. With the Graph API, you can integrate Microsoft's and other tools. Follow the principles outlined in this article when you're performing the integration. 

We recommend that you set up an Azure function or an Azure logic app to use a [system-assigned managed identity](../managed-identities-azure-resources/overview.md). Your logic app or function contains the steps or code necessary to automate the desired actions. You assign permissions to the managed identity to grant the service principal the necessary directory permissions to perform the required actions. Grant managed identities only the minimum rights necessary. 

Another automation integration point is [Azure AD PowerShell](/powershell/azure/active-directory/overview) modules. PowerShell is a useful automation tool for administrators and IT integrators who are performing common tasks or configurations in Azure AD. PowerShell can also be incorporated into Azure functions or Azure Automation runbooks. 

## Governance

It's important that you understand and document clear processes for how you intend to operate your Azure AD environment. Azure AD has features that allow for governance-like functionality to be applied to scopes within Azure AD. Consider the following guidance to help with governance via Azure AD:

* [Azure Active Directory governance operations reference guide](../fundamentals/active-directory-ops-guide-govern.md). 
* [Azure Active Directory security operations guide](../fundamentals/security-operations-introduction.md). It can help you secure your operations and understand how security and governance overlap.

After you understand operational governance, you can use [governance features](../governance/identity-governance-overview.md) to implement portions of your governance controls. These include features mentioned in [Meet authorization requirements of memorandum 22-09](memo-22-09-authorization.md). 

 
## Next steps

The following articles are part of this documentation set:

[Meet identity requirements of memorandum 22-09](memo-22-09-meet-identity-requirements.md)

[Enterprise-wide identity management system](memo-22-09-enterprise-wide-identity-management-system.md)

[Multifactor authentication](memo-22-09-multi-factor-authentication.md)

[Authorization](memo-22-09-authorization.md)

For more information about Zero Trust, see:

[Securing identity with Zero Trust](/security/zero-trust/deploy/identity)

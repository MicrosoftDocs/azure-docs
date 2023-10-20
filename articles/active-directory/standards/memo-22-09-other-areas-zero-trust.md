---
title: Memo 22-09 other areas of Zero Trust
description: Understand other Zero Trust requirements in Office of Management and Budget memorandum 22-09.
services: active-directory 
ms.service: active-directory
ms.subservice: standards
ms.workload: identity
ms.topic: how-to
author: gargi-sinha
ms.author: gasinh
manager: martinco
ms.reviewer: martinco
ms.date: 05/23/2023
ms.custom: it-pro
ms.collection: M365-identity-device-management
---

# Other areas of Zero Trust addressed in memorandum 22-09 

The other articles in this guidance address the identity pillar of Zero Trust principles, as described in the US Office of Management and Budget (OMB) [M 22-09 Memorandum for the Heads of Executive Departments and Agencies](https://www.whitehouse.gov/wp-content/uploads/2022/01/M-22-09.pdf). This article covers Zero Trust maturity model areas beyond the identity pillar, and it addresses the following themes:

* Visibility
* Analytics
* Automation and orchestration
* Governance 

## Visibility

It's important to monitor your Microsoft Entra tenant. Assume a breach mindset and meet compliance standards in memorandum 22-09 and [Memorandum 21-31](https://www.whitehouse.gov/wp-content/uploads/2021/08/M-21-31-Improving-the-Federal-Governments-Investigative-and-Remediation-Capabilities-Related-to-Cybersecurity-Incidents.pdf). Three primary log types are used for security analysis and ingestion:

* **Azure audit logs** to monitor operational activities of the directory, such as creating, deleting, updating objects like users or groups
  * Use also to make changes to Microsoft Entra configurations, like modifications to a Conditional Access policy
  * See, [Audit logs in Microsoft Entra ID](../reports-monitoring/concept-audit-logs.md)
* **Provisioning logs** have information about objects synchronized from Microsoft Entra ID to applications like Service Now with Microsoft Identity Manager
  * See, [Provisioning logs in Microsoft Entra ID](../reports-monitoring/concept-provisioning-logs.md)
* **Microsoft Entra sign-in logs** to monitor sign-in activities associated with users, applications, and service principals. 
  * Sign-in logs have categories for differentiation
  * Interactive sign-ins show successful and failed sign-ins, policies applied, and other metadata
  * Non-interactive user sign-ins show no interaction during sign-in: clients signing in on behalf of the user, such as mobile applications or email clients
  * Service principal sign-ins show service principal or application sign-in: services or applications accessing services, applications, or the Microsoft Entra directory through the REST API
  * Managed identities for Azure resource sign-in: Azure resources or applications accessing Azure resources, such as a web application service authenticating to an Azure SQL back end. 
  * See, [Sign-in logs in Microsoft Entra ID (preview)](../reports-monitoring/concept-sign-ins.md)

In Microsoft Entra ID Free tenants, log entries are stored for seven days. Tenants with a Microsoft Entra ID P1 or P2 license retain log entries for 30 days. 

Ensure a security information and event management (SIEM) tool ingests logs. Use sign-in and audit events to correlate with application, infrastructure, data, device, and network logs. 

We recommend you integrate Microsoft Entra logs with Microsoft Sentinel. Configure a connector to ingest Microsoft Entra tenant logs.

Learn more:

* [What is Microsoft Sentinel?](/azure/sentinel/overview) 
* [Connect Microsoft Entra ID to Microsoft Sentinel](/azure/sentinel/connect-azure-active-directory)

For the Microsoft Entra tenant, you can configure the diagnostic settings to send the data to an Azure Storage account, Azure Event Hubs, or a Log Analytics workspace. Use these storage options to integrate other SIEM tools to collect data. 

Learn more:

* [What is Microsoft Entra monitoring?](../reports-monitoring/overview-monitoring-health.md)
* [Microsoft Entra reporting and monitoring deployment dependencies](../reports-monitoring/plan-monitoring-and-reporting.md)

## Analytics

You can use analytics in the following tools to aggregate information from Microsoft Entra ID and show trends in your security posture in comparison to your baseline. You can also use analytics to assess and look for patterns or threats across Microsoft Entra ID. 

* **Microsoft Entra ID Protection** analyzes sign-ins and other telemetry sources for risky behavior
  * Identity Protection assigns a risk score to sign-in events
  * Prevent sign-ins, or force a step-up authentication, to access a resource or application based on risk score
  * See, [What is Identity Protection?](../identity-protection/overview-identity-protection.md)
* **Microsoft Entra usage and insights reports** have information similar to Azure Sentinel workbooks, including applications with highest usage or sign-in trends. 
  * Use reports to understand aggregate trends that might indicate an attack or other events
  * See, [Usage and insights in Microsoft Entra ID](../reports-monitoring/concept-usage-insights-report.md)
* **Microsoft Sentinel** analyze information from Microsoft Entra ID: 
  * Microsoft Sentinel User and Entity Behavior Analytics (UEBA) delivers intelligence on potential threats from user, host, IP address, and application entities. 
  * Use analytics rule templates to hunt for threats and alerts in your Microsoft Entra logs. Your security or operation analyst can triage and remediate threats.
  * Microsoft Sentinel workbooks help visualize Microsoft Entra data sources. See sign-ins by country/region or applications. 
  * See, [Commonly used Microsoft Sentinel workbooks](/azure/sentinel/top-workbooks)
  * See, [Visualize collected data](/azure/sentinel/get-visibility)
  * See, [Identify advanced threats with UEBA in Microsoft Sentinel](/azure/sentinel/identify-threats-with-entity-behavior-analytics)

## Automation and orchestration

Automation in Zero Trust helps remediate alerts due to threats or security changes. In Microsoft Entra ID, automation integrations help clarify actions to improve your security posture. Automation is based on information received from monitoring and analytics. 

Use Microsoft Graph API REST calls to access Microsoft Entra ID programmatically. This access requires a Microsoft Entra identity with authorizations and scope. With the Graph API, integrate other tools. 

We recommend you set up an Azure function or an Azure logic app to use a system-assigned managed identity. The logic app or function has steps or code to automate actions. Assign permissions to the managed identity to grant the service principal directory permissions to perform actions. Grant managed identities minimum rights. 

Learn more: [What are managed identities for Azure resources?](../managed-identities-azure-resources/overview.md)

Another automation integration point is Microsoft Graph PowerShell modules. Use Microsoft Graph PowerShell to perform common tasks or configurations in Microsoft Entra ID, or incorporate into Azure functions or Azure Automation runbooks. 

## Governance

Document your processes for operating the Microsoft Entra environment. Use Microsoft Entra features for governance functionality applied to scopes in Microsoft Entra ID. 

Learn more:

* [Microsoft Entra ID Governance operations reference guide](../architecture/ops-guide-govern.md)
* [Microsoft Entra security operations guide](../architecture/security-operations-introduction.md)
* [What is Microsoft Entra ID Governance?](../governance/identity-governance-overview.md) 
* [Meet authorization requirements of memorandum 22-09](memo-22-09-authorization.md). 

 
## Next steps

* [Meet identity requirements of memorandum 22-09 with Microsoft Entra ID](memo-22-09-meet-identity-requirements.md)
* [Enterprise-wide identity management system](memo-22-09-enterprise-wide-identity-management-system.md)
* [Meet multifactor authentication requirements of memorandum 22-09](memo-22-09-multi-factor-authentication.md)
* [Meet authorization requirements of memorandum 22-09](memo-22-09-authorization.md)
* [Securing identity with Zero Trust](/security/zero-trust/deploy/identity)

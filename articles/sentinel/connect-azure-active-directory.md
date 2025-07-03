---
title: Send Microsoft Entra ID data to Microsoft Sentinel
description: Learn how to collect data from Microsoft Entra ID, and stream Microsoft Entra sign-in, audit, and provisioning logs into Microsoft Sentinel.
author: guywi-ms
ms.topic: how-to
ms.date: 03/16/2025
ms.author: guywild


#Customer intent: As a security engineer, I want to stream Microsoft Entra logs into Microsoft Sentinel so that analysts can monitor and analyze sign-in activities, audit logs, and provisioning logs for enhanced security and threat detection.

---

# Send data to Microsoft Sentinel using the Microsoft Entra ID data connector

[Microsoft Entra ID](/entra/fundamentals/what-is-entra) logs provide comprehensive information about users, applications, and networks accessing your Entra tenant. This article explains the types of logs you can collect using the Microsoft Entra ID data connector, how to enable the connector to send data to Microsoft Sentinel, and how to find your data in Microsoft Sentinel.


## Prerequisites

A Microsoft Entra Workload ID Premium license is required to stream **AADRiskyServicePrincipals** and **AADServicePrincipalRiskEvents** logs to Microsoft Sentinel.

## Microsoft Entra ID data connector data types

This table lists the logs you can send from Microsoft Entra ID to Microsoft Sentinel using the Microsoft Entra ID data connector. Sentinel stores these logs in the Log Analytics workspace linked to your Microsoft Sentinel workspace.

| **Log type** | **Description** | **Log schema** |
|--------------|-----------------------------------|----------------|
| [**Audit logs**](../active-directory/reports-monitoring/concept-audit-logs.md) | System activity related to user and group management, managed applications, and directory activities. | [AuditLogs](/azure/azure-monitor/reference/tables/auditlogs) |
| [**Sign-in logs**](../active-directory/reports-monitoring/concept-all-sign-ins.md) | Interactive user sign-ins where a user provides an authentication factor. | [SigninLogs](/azure/azure-monitor/reference/tables/signinlogs) |
| [**Non-interactive user sign-in logs**](../active-directory/reports-monitoring/concept-all-sign-ins.md#non-interactive-user-sign-ins) (**Preview**)  | Sign-ins performed by a client on behalf of a user without any interaction or authentication factor from the user. | [AADNonInteractiveUserSignInLogs](/azure/azure-monitor/reference/tables/aadnoninteractiveusersigninlogs) |
| [**Service principal sign-in logs**](../active-directory/reports-monitoring/concept-all-sign-ins.md#service-principal-sign-ins) (**Preview**) | Sign-ins by apps and service principals that don't involve any user. In these sign-ins, the app or service provides a credential on its own behalf to authenticate or access resources. | [AADServicePrincipalSignInLogs](/azure/azure-monitor/reference/tables/aadserviceprincipalsigninlogs) |
| [**Managed Identity sign-in logs**](../active-directory/reports-monitoring/concept-all-sign-ins.md#managed-identity-for-azure-resources-sign-ins) (**Preview**) | Sign-ins by Azure resources that have secrets managed by Azure. For more information, see [What are managed identities for Azure resources?](../active-directory/managed-identities-azure-resources/overview.md). | [AADManagedIdentitySignInLogs](/azure/azure-monitor/reference/tables/aadmanagedidentitysigninlogs) |
| [**AD FS sign-in logs**](/entra/identity/monitoring-health/concept-usage-insights-report#ad-fs-application-activity) | Sign-ins performed through Active Directory Federation Services (AD FS). | [ADFSSignInLogs](/azure/azure-monitor/reference/tables/adfssigninlogs) |
| [**Enriched Office 365 audit logs**](/entra/global-secure-access/how-to-view-enriched-logs) | Security events related to Microsoft 365 apps. | [EnrichedOffice365AuditLogs](/azure/azure-monitor/reference/tables/enrichedmicrosoft365auditlogs) |
| [**Provisioning logs**](../active-directory/reports-monitoring/concept-provisioning-logs.md) (**Preview**)  | System activity information about users, groups, and roles provisioned by the Microsoft Entra provisioning service. | [AADProvisioningLogs](/azure/azure-monitor/reference/tables/aadprovisioninglogs) |
| [**Microsoft Graph activity logs**](/graph/microsoft-graph-activity-logs-overview)| HTTP requests accessing your tenant’s resources through the Microsoft Graph API. | [MicrosoftGraphActivityLogs](/azure/azure-monitor/reference/tables/microsoftgraphactivitylogs) |
| [**Network access traffic logs**](/entra/global-secure-access/how-to-view-traffic-logs) | Network access traffic and activities. | [NetworkAccessTraffic](/azure/azure-monitor/reference/tables/networkaccesstraffic) |
| [**Remote network health logs**](/entra/global-secure-access/how-to-remote-network-health-logs?tabs=microsoft-entra-admin-center) | Insights into the health of remote networks. | [RemoteNetworkHealthLogs](/azure/azure-monitor/reference/tables/remotenetworkhealthlogs) |
| [**User risk events**](/entra/id-protection/howto-identity-protection-investigate-risk?branch=main#risk-detections-report) | User risk events generated by Microsoft Entra ID Protection. | [AADUserRiskEvents](/azure/azure-monitor/reference/tables/aaduserriskevents) |
| [**Risky users**](/entra/id-protection/howto-identity-protection-investigate-risk#risky-users-rport) | Risky users logged by Microsoft Entra ID Protection. | [AADRiskyUsers](/azure/azure-monitor/reference/tables/aadriskyusers) |
| [**Risky service principals**](/entra/id-protection/howto-identity-protection-investigate-risk?branh=main#risk-detections-report) | Information about service principals flagged as risky by Microsoft Entra ID Protection. | [AADRiskyServicePrincipals](/azure/azure-monitor/reference/tables/aadriskyserviceprincipals) |
| [**Service principal risk events**](/entra/id-protection/howto-identity-protection-investigate-risk#risy-users-report) | Risk detections associated with service principals logged by Microsoft Entra ID Protection. | [AADServicePrincipalRiskEvents](/azure/azure-monitor/reference/tables/aadserviceprincipalriskevents) |

> [!IMPORTANT]
> Some of the available log types are currently in **PREVIEW**. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for other legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

[!INCLUDE [reference-to-feature-availability](includes/reference-to-feature-availability.md)]

## Prerequisites

- A Microsoft Entra ID P1 or P2 license is required to ingest sign-in logs into Microsoft Sentinel. Any Microsoft Entra ID license (Free/O365/P1 or P2) is sufficient to ingest the other log types. Other per-gigabyte charges might apply for Azure Monitor (Log Analytics) and Microsoft Sentinel.

- Your user must be assigned the [Microsoft Sentinel Contributor](../role-based-access-control/built-in-roles.md#microsoft-sentinel-contributor) role on the workspace.

- Your user must have the [Security Administrator](../active-directory/roles/permissions-reference.md#security-administrator) role on the tenant you want to stream the logs from, or the equivalent permissions.

- Your user must have read and write permissions to the Microsoft Entra diagnostic settings in order to be able to see the connection status.

<a name='connect-to-azure-active-directory'></a>

## Enable the Microsoft Entra ID data connector

Search for and enable the **Microsoft Entra ID** connector as described in [Enable a data connector](configure-data-connector.md#enable-a-data-connector).

## Install the Microsoft Entra ID solution (optional)

Install the solution for **Microsoft Entra ID** from the **Content Hub** in Microsoft Sentinel to get prebuilt workbooks, analytics rules, playbooks, and more. For more information, see [Discover and manage Microsoft Sentinel out-of-the-box content](sentinel-solutions-deploy.md).

## Next steps
In this document, you learned how to connect Microsoft Entra ID to Microsoft Sentinel. To learn more about Microsoft Sentinel, see the following articles:
- Learn how to [get visibility into your data and potential threats](get-visibility.md).
- Get started [detecting threats with Microsoft Sentinel](detect-threats-built-in.md).

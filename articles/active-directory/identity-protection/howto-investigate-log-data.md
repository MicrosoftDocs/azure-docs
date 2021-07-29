---
title: Investigate using data Azure Active Directory Identity Protection
description: Learn how to investigate using long term data in Azure Active Directory Identity Protection

services: active-directory
ms.service: active-directory
ms.subservice: identity-protection
ms.topic: how-to
ms.date: 07/29/2021

ms.author: joflore
author: MicrosoftGuyJFlo
manager: daveba
ms.reviewer: sahandle

ms.collection: M365-identity-device-management
---
# How To: Investigate longer term risk data

Azure AD stores reports and security signals for a defined period of time. When it comes to risk information 90 days may not be long enough.

| Report / Signal | Azure AD Free | Azure AD Premium P1 | Azure AD Premium P2 |
| --- | --- | --- | --- |
| Audit logs | 7 days | 30 days | 30 days |
| Sign-ins | 7 days | 30 days | 30 days |
| Azure AD MFA usage | 30 days | 30 days | 30 days |
| Users at risk | 7 days | 30 days | 90 days |
| Risky sign-ins | 7 days | 30 days | 90 days |

Organizations can choose to store data for longer periods by changing diagnostic settings in Azure AD to send **RiskyUsers** and **UserRiskEvents** data to a Log Analytics workspace, archive data to a storage account, stream data to an Event Hub, or send data to a partner solution. Find these options in the **Azure portal** > **Azure Active Directory**, **Diagnostic settings** > **Edit setting**. If you do not have a diagnostic setting follow the instructions in the article [Create diagnostic settings to send platform logs and metrics to different destinations](../../azure-monitor/essentials/diagnostic-settings.md) to create one.

:::image type="content" source="media/howto-investigate-log-data/change-diagnostic-setting-in-portal.png" alt-text="Diagnostic settings screen in Azure AD showing existing configuration.":::

## Log Analytics

Log Analytics allows organizations to query data using built in queries or custom created Kusto queries, for more information see [Get started with log queries in Azure Monitor](../../azure-monitor/logs/get-started-queries.md).

AADRiskyUsers

AADUserRiskEvents

## Azure Event Hubs

Azure Event Hubs can look at incoming data from sources like Azure AD Identity Protection and provide real-time analysis and correlation.

## Other options

Organizations can choose to [connect Azure AD data to Azure Sentinel](../../sentinel/connect-azure-ad-identity-protection.md) as well for further processing.

Organizations can use the [Microsoft Graph API to programatically interact with risk events](howto-identity-protection-graph-api.md).

## Next steps

[What is Azure Active Directory monitoring?](../reports-monitoring/overview-monitoring.md)
[Install and use the log analytics views for Azure Active Directory](../reports-monitoring/howto-install-use-log-analytics-views.md)
[Connect data from Azure Active Directory (Azure AD) Identity Protection](../../sentinel/connect-azure-ad-identity-protection.md)
[Azure Active Directory Identity Protection and the Microsoft Graph PowerShell SDK](howto-identity-protection-graph-api.md)
[Tutorial: Stream Azure Active Directory logs to an Azure event hub](../reports-monitoring/tutorial-azure-monitor-stream-logs-to-event-hub.md)
---
title: How to use enriched Microsoft 365 logs
description: Learn how to use enriched Microsoft 365 logs for Global Secure Access (preview).
author: shlipsey3
ms.author: sarahlipsey
manager: amycolannino
ms.topic: how-to
ms.date: 06/27/2023
ms.service: network-access
ms.custom: 
---

# How to use the Global Secure Access (preview) enriched Microsoft 365 logs

With your Microsoft 365 traffic flowing through the Microsoft Entra Private Access service, you want to gain insights into the performance, experience, and availability of the Microsoft 365 apps your organization uses. The enriched Microsoft 365 logs provide you with the information you need to gain these insights. You can integrate the logs with a third-party security information and event management (SIEM) tool for further analysis.

This article describes the information in the logs and how to export them.

## Prerequisites

To use the enriched logs, you need the following roles, subscriptions, and resources:

* A **Global Administrator** role is required to enable the enriched logs.
* Global Secure Access is dependent upon some features that require a Microsoft Entra ID P1 or P2 license.
* To integrate logs with Log Analytics, you need a **Log Analytics workspace**.
* To integrate with SIEM tools, you need an **Azure Event Hubs namespace**
* To archive logs, you need an **[Azure storage account](../storage/common/storage-account-create.md)** that you have `ListKeys` permissions for.

## What the logs provide

The enriched Microsoft 365 logs provide information about Microsoft 365 workloads, so you can review network diagnostic data, performance data, and security events relevant to Microsoft 365 apps. For example, if access to Microsoft 365 is blocked for a user in your organization, you need visibility into how the user's device is connecting to your network.

These logs provide:
- Improved latency and predictability
- Additional information added to original logs
- Accurate IP address

These logs are a subset of the logs available in the [Microsoft 365 audit logs](/microsoft-365/compliance/search-the-audit-log-in-security-and-compliance?view=0365-worldwide&preserve-view=true). The logs are enriched with additional information, such as the user's IP address, device name, and device type. The enriched logs also contain information about the Microsoft 365 app, such as the app name, app ID, and app version.

## How to view the logs

Viewing the enriched Microsoft 365 logs is a two-step process. First, you need to enable the log enrichment from Global Secure Access. Second, you need to configure Microsoft Entra ID Diagnostic settings to route the logs to an endpoint, such as a Log Analytics workspace.

> [!NOTE]
> At this time, only SharePoint Online logs are available for log enrichment. 
### Enable the log enrichment

To enable the Enriched Microsoft 365 logs:

1. Sign in to the **[Microsoft Entra admin center](https://entra.microsoft.com)** as a Global Administrator.
1. Go to **Global Secure Access** > **Global settings** > **Logging**.
1. Select the type of Microsoft 365 logs you want to enable.
1. Select **Save**.

    :::image type="content" source="media/how-to-view-enriched-logs/enriched-logs-sharepoint.png" alt-text="Screenshot of the Private access profile, with the view applications link highlighted." lightbox="media/how-to-view-enriched-logs/enriched-logs-sharepoint-expanded.png":::

The enriched logs may take up to 72 hours to fully integrate with the service. 

### Configure Diagnostic settings

To view the enriched Microsoft 365 logs, you must export or stream the log to an endpoint, such as a Log Analytics workspace or a SIEM tool. Before you can stream logs to a SIEM tool, you need to create an Azure event hub and event hub namespace. For more information, see [Set up an Event Hubs namespace and an event hub](../event-hubs/event-hubs-create.md).

Once the event hub is created, you configure Diagnostic settings to select the logs you want to route to the event hub. The logs are then routed through the event hub to your SIEM tool of choice. Learn how to [stream your activity logs to an event hub](../active-directory/reports-monitoring/tutorial-azure-monitor-stream-logs-to-event-hub.md).

If you need long-term storage for your logs and you don't plan on querying them often, you can archive the logs to an Azure storage account. Learn how to [archive your activity logs to a storage account](../active-directory/reports-monitoring/quickstart-azure-monitor-route-logs-to-storage-account.md).

> [!NOTE]
> At this time, streaming logs directly to a Log Analytics workspace is not available. You can stream the logs to an event hub and then ingest the logs into a Log Analytics workspace using Logic Apps.

1. Sign in to the **[Microsoft Entra admin center](https://entra.microsoft.com)** using one of the required roles.
1. Go to **Microsoft Entra ID** > **Monitoring and health** > **Diagnostic settings**.
1. Select **Add Diagnostic setting**.
1. Give your diagnostic setting a name.
1. Select `EnrichedOffice365AuditLogs`.
1. Select either **Stream to an event hub** or **Archive to a storage account** option, and complete the fields that appear.
    - To archive to a storage account, provide the number of days to retain the logs and select the appropriate subscription and storage account.
    - To stream to an event hub, select the subscription and event hub details. Your independent security vendor should provide you with instructions on how to ingest data from Azure Event Hubs into their tool.

For more information on how to stream logs to an event hub or archive logs to a storage account, see the following articles:

- [Set up an Event Hubs namespace and an event hub](../event-hubs/event-hubs-create.md)
- [Review the data retention policies](../active-directory/reports-monitoring/reference-reports-data-retention.md)  

[!INCLUDE [Public preview important note](./includes/public-preview-important-note.md)]

## Next steps

- [Explore the Global Secure Access logs and monitoring options](concept-global-secure-access-logs-monitoring.md)
- [Learn about Global Secure Access audit logs](how-to-access-audit-logs.md)

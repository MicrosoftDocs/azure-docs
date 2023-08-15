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

With your Microsoft 365 traffic flowing through the Microsoft Entra Private Internet service, you want to gain insights into the performance, experience, and availability of the Microsoft 365 apps your organization uses. The enriched Microsoft 365 logs provide you with the information you need to gain these insights. You can integrate the logs with a third-party security information and event management (SIEM) tool for further analysis.

This article describes the information in the logs and how to export them.

## Prerequisites

To use the enriched logs, you need the following roles and subscriptions:

* A **Global Administrator** role is required to enable the enriched Microsoft 365 logs.
* The preview requires a Microsoft Entra ID Premium P1 license. If needed, you can [purchase licenses or get trial licenses](https://aka.ms/azureadlicense).
* To use the Microsoft 365 traffic forwarding profile, a Microsoft 365 E3 license is recommended.

You must configure the endpoint for where you want to route the logs prior to configuring Diagnostic settings. The requirements for each endpoint vary and are described in the [Configure Diagnostic settings](#configure-diagnostic-settings) section.

## What the logs provide

The enriched Microsoft 365 logs provide information about Microsoft 365 workloads, so you can review network diagnostic data, performance data, and security events relevant to Microsoft 365 apps. For example, if access to Microsoft 365 is blocked for a user in your organization, you need visibility into how the user's device is connecting to your network.

These logs provide:
- Improved latency
- Additional information added to original logs
- Accurate IP address

These logs are a subset of the logs available in the [Microsoft 365 audit logs](/microsoft-365/compliance/search-the-audit-log-in-security-and-compliance?view=0365-worldwide&preserve-view=true). The logs are enriched with additional information, including the device ID, operating system, and original IP address. Enriched SharePoint logs provide information on files that were downloaded, uploaded, deleted, modified, or recycled. Deleted or recycled list items are also included in the enriched logs.

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

    :::image type="content" source="media/how-to-view-enriched-logs/enriched-logs-sharepoint.png" alt-text="Screenshot of the Logging area of Global Secure Access." lightbox="media/how-to-view-enriched-logs/enriched-logs-sharepoint-expanded.png":::

The enriched logs may take up to 72 hours to fully integrate with the service.

### Configure Diagnostic settings

To view the enriched Microsoft 365 logs, you must export or stream the logs to an endpoint, such as a Log Analytics workspace or a SIEM tool. The endpoint must be configured before you can configure Diagnostic settings.

* To integrate logs with Log Analytics, you need a **Log Analytics workspace**.
    - [Create a Log Analytics workspace](/azure/azure-monitor/logs/quick-create-workspace).
    - [Integrate logs with Log Analytics](/azure/active-directory/reports-monitoring/howto-integrate-activity-logs-with-log-analytics)
* To stream logs to a SIEM tool, you need to create an Azure event hub and an event hub namespace.
    - [Set up an Event Hubs namespace and an event hub](/azure/event-hubs/event-hubs-create).
    - [Stream logs to an event hub](/azure/active-directory/reports-monitoring/tutorial-azure-monitor-stream-logs-to-event-hub)
* To archive logs to a storage account, you need an Azure storage account that you have `ListKeys` permissions for.
    - [Create an Azure storage account](/azure/storage/common/storage-account-create).
    - [Archive logs to a storage account](/azure/active-directory/reports-monitoring/quickstart-azure-monitor-route-logs-to-storage-account)

With your endpoint created, you can configure Diagnostic settings.

1. Sign in to the **[Microsoft Entra admin center](https://entra.microsoft.com)** as a Global Administrator or Security Administrator.
1. Go to **Microsoft Entra ID** > **Monitoring and health** > **Diagnostic settings**.
1. Select **Add Diagnostic setting**.
1. Give your diagnostic setting a name.
1. Select `EnrichedOffice365AuditLogs`.
1. Select the **Destination details** for where you'd like to send the logs. Choose any or all of the following destinations. Additional fields appear, depending on your selection.

    * **Send to Log Analytics workspace:** Select the appropriate details from the menus that appear.
    * **Archive to a storage account:** Provide the number of days you'd like to retain the data in the **Retention days** boxes that appear next to the log categories. Select the appropriate details from the menus that appear.
    * **Stream to an event hub:** Select the appropriate details from the menus that appear.
    * **Send to partner solution:** Select the appropriate details from the menus that appear.

The following example is sending the enriched logs to a Log Analytics workspace, which requires selecting the Subscription and Log Analytics workspace from the menus that appear.

:::image type="content" source="media/how-to-view-enriched-logs/diagnostic-settings-enriched-logs.png" alt-text="Screenshot of the Microsoft Entra ID Diagnostic settings, with the enriched logs and Log Analytics options highlighted." lightbox="media/how-to-view-enriched-logs/diagnostic-settings-enriched-logs-expanded.png":::

[!INCLUDE [Public preview important note](./includes/public-preview-important-note.md)]

## Next steps

- [Explore the Global Secure Access logs and monitoring options](concept-global-secure-access-logs-monitoring.md)
- [Learn about Global Secure Access audit logs](how-to-access-audit-logs.md)

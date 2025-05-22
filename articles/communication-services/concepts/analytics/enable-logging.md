---
title: Enable logging with Azure Monitor
titleSuffix: An Azure Communication Services article
description: Configure Communications Services logs and metrics with diagnostic settings.
author: mkhribech
services: azure-communication-services

ms.author: mkhribech
ms.date: 10/25/2021
ms.topic: conceptual
ms.service: azure-communication-services
ms.subservice: data
---

# Enable logging with Azure Monitor

Communications Services provides monitoring and analytics features via [Azure Monitor Logs overview](/azure/azure-monitor/logs/data-platform-logs) and [Azure Monitor Metrics](/azure/azure-monitor/essentials/data-platform-metrics). Each Azure resource requires its own diagnostic setting, which defines the following criteria:

- Categories of logs and metric data sent to the destinations defined in the setting. The available categories vary for different resource types.
- One or more destinations to send the logs. Current destinations include Log Analytics workspace, Event Hubs, and Azure Storage.
- A single diagnostic setting can define no more than one of each of the destinations. If you want to send data to more than one of a particular destination type (for example, two different Log Analytics workspaces), then create multiple settings. Each resource can have up to five diagnostic settings.

The following instructions describe how to configure your Azure Monitor resource to start creating logs and metrics for your Communications Services. For more information about using Diagnostic Settings across all Azure resources, see: [Diagnostic Settings](/azure/azure-monitor/essentials/diagnostic-settings).

These instructions apply to the following Communications Services logs:

- [Call Summary and Call Diagnostic logs](logs/voice-and-video-logs.md)
- [SMS Diagnostic logs](logs/sms-logs.md) 

## Access Diagnostic Settings

To access Diagnostic Settings for your Communications Services, open your Communications Services home page within Azure portal:

:::image type="content" source="media\enable-logging\portal-home-go-to-acs-resource.png" alt-text="Communications Services resource":::

From there, click **Diagnostic settings** in the Monitoring section of the left-hand navigation pane:

:::image type="content" source="media\enable-logging\resource-diagnostic-settings-nav.png" alt-text="Diagnostic Settings in nav":::

Click **Add diagnostic setting**. There are various logs and metrics sources available for Communications Services:

:::image type="content" source="media\enable-logging\diagnostic-setting-add.png" alt-text="Diagnostic Settings Category Details":::

## Adding a Diagnostic Setting

The system prompts you to choose a name for your diagnostic setting, which is useful if you have many Azure resources to monitor. The system also prompts you to select the log and metric data sources you wish to monitor as either logs or metrics. See [Azure Monitor data platform](/azure/azure-monitor/data-platform) for more detail on the difference.

:::image type="content" source="media\enable-logging\diagnostic-setting-categories-details-acs.png" alt-text="Adding a Diagnostic Setting":::

## Choose Destinations

The system also prompts you to select a destination to store the logs. Platform logs and metrics can be sent to the destinations in the following table. For more information, see [Create diagnostic settings to send platform logs and metrics to different destinations.](/azure/azure-monitor/essentials/diagnostic-settings?tabs=CMD).

| Destination | Description |
|:------------|:------------|
| [Log Analytics workspace](/azure/azure-monitor/logs/log-analytics-workspace-overview) | Sending logs and metrics to a Log Analytics workspace allows you to analyze them with other monitoring data collected by Azure Monitor using powerful log queries and also to use other Azure Monitor features such as alerts and visualizations. <br><br> If you don't have a Log Analytics workspace to send your data to, you must [create one before you proceed.](/azure/azure-monitor/logs/quick-create-workspace) |
| [Event Hubs](../../../event-hubs/index.yml) | Sending logs and metrics to Event Hubs allows you to stream data to external systems such as third-party SIEMs and other log analytics solutions. |
| [Azure storage account](../../../storage/blobs/index.yml) | Archiving logs and metrics to an Azure storage account is useful for audit, static analysis, or backup. Compared to Azure Monitor Logs and a Log Analytics workspace, Azure storage is less expensive and logs can be kept there indefinitely. |

The following settings are an example of what you would see within your Communications Services resource:

:::image type="content" source="media\enable-logging\diagnostic-setting-destination-acs.png" alt-text="Diagnostic Settings Destination Details":::

All settings are viable and flexible options that you can adapt to your specific storage needs. We also provide other features and built in analytic insights if you select the Log Analytics Workspace option.

## Log Analytics Workspace for more analytics features

By choosing to send your logs to a [Log Analytics workspace](/azure/azure-monitor/logs/log-analytics-overview) destination, you enable more features within Azure Monitor generally and for your Communications Services. Log Analytics is a tool within Azure portal used to create, edit, and run [queries](/azure/azure-monitor/logs/queries) with data in your Azure Monitor logs and metrics and [Workbooks](/azure/azure-monitor/visualize/workbooks-overview), [alerts](/azure/azure-monitor/alerts/alerts-log), [notification actions](/azure/azure-monitor/alerts/action-groups), [REST API access](/rest/api/loganalytics/), and many others. If you don't have a Log Analytics workspace, you must [create one before you proceed.](/azure/azure-monitor/logs/quick-create-workspace)

For your Communications Services logs, we provided a useful [default query pack](/azure/azure-monitor/logs/query-packs#default-query-pack) to provide an initial set of insights to quickly analyze and understand your data. These query packs are described here: [Log Analytics for Communications Services](query-call-logs.md).

## Next steps

- If you don't have a Log Analytics workspace to send your data to, you must create one before you proceed. For more information, see [Create a Log Analytics workspace](/azure/azure-monitor/logs/quick-create-workspace).

- You may start a Diagnostic Setting to use certain capabilities by enabling collection for all logs. However, you should monitor costs associated with logs from Diagnostic Settings. For more information, see [Controlling costs](/azure/azure-monitor/essentials/diagnostic-settings#controlling-costs).

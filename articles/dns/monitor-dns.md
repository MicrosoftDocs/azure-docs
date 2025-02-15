---
title: Monitor Azure DNS
description: Learn how to monitor Azure DNS using Azure Monitor, including data collection, analysis, and alerting.
ms.date: 01/06/2025
ms.custom: horz-monitor
ms.topic: conceptual
author: greg-lindsay
ms.author: greglin
ms.service: azure-dns
---

# Monitor Azure DNS

[!INCLUDE [azmon-horz-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/azmon-horz-intro.md)]

## Collect data with Azure Monitor

This table describes how you can collect data to monitor your service, and what you can do with the data once collected:

|Data to collect|Description|How to collect and route the data|Where to view the data|Supported data|
|---------|---------|---------|---------|---------|
|Metric data|Metrics are numerical values that describe an aspect of a system at a particular point in time. Metrics can be aggregated using algorithms, compared to other metrics, and analyzed for trends over time.|- Collected automatically at regular intervals.</br> - You can route some platform metrics to a Log Analytics workspace to query with other data. Check the **DS export** setting for each metric to see if you can use a diagnostic setting to route the metric data.|[Metrics explorer](/azure/azure-monitor/essentials/metrics-getting-started)| [Azure DNS metrics supported by Azure Monitor](monitor-dns-reference.md#metrics)|
|Resource log data|Logs are recorded system events with a timestamp. Logs can contain different types of data, and be structured or free-form text. You can route resource log data to Log Analytics workspaces for querying and analysis.|[Create a diagnostic setting](/azure/azure-monitor/essentials/create-diagnostic-settings) to collect and route resource log data.| [Log Analytics](/azure/azure-monitor/learn/quick-create-workspace)|[Azure DNS resource log data supported by Azure Monitor](monitor-dns-reference.md#resource-logs)  |
|Activity log data|The Azure Monitor activity log provides insight into subscription-level events. The activity log includes information like when a resource is modified or a virtual machine is started.|- Collected automatically.</br> - [Create a diagnostic setting](/azure/azure-monitor/essentials/create-diagnostic-settings) to a Log Analytics workspace at no charge.|[Activity log](/azure/azure-monitor/essentials/activity-log)|  |

[!INCLUDE [azmon-horz-supported-data](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/azmon-horz-supported-data.md)]

[!INCLUDE [azmon-horz-tools](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/azmon-horz-tools.md)]

[!INCLUDE [azmon-horz-export-data](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/azmon-horz-export-data.md)]

[!INCLUDE [azmon-horz-kusto](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/azmon-horz-kusto.md)]

For Kusto queries in Azure Resource Graph Explorer, see [Private DNS information in Azure Resource Graph](private-dns-arg.md).

[!INCLUDE [azmon-horz-alerts-part-one](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/azmon-horz-alerts-part-one.md)]

To configure alerting for Azure DNS zones:

1. Select **Alerts** from *Monitor* page in the Azure portal. Then select **+ New alert rule**.

   :::image type="content" source="./media/dns-alerts-metrics/alert-metrics.png" alt-text="Screenshot of Alert button on Monitor page." lightbox="./media/dns-alerts-metrics/alert-metrics.png":::

1. Select the **Select resource** link in the Scope section to open the *Select a resource* page. Filter by **DNS zones** and then select the Azure DNS zone you want as the target resource. Select **Done** after you choose the zone.

   :::image type="content" source="./media/dns-alerts-metrics/select-resource.png" alt-text="Screenshot of select resource page in configuring alerts." lightbox="./media/dns-alerts-metrics/select-resource.png":::

1. Next, select the **Add condition** link in the Conditions section to open the *Select a signal* page. Select one of the three *Metric* signal types you want to configure the alert for.

   :::image type="content" source="./media/dns-alerts-metrics/select-signal.png" alt-text="Screenshot of available metrics on the select a signal page." lightbox="./media/dns-alerts-metrics/select-signal.png":::

1. On the *Configure signal logic* page, configure the threshold and frequency of evaluation for the metric selected.

   :::image type="content" source="./media/dns-alerts-metrics/configure-signal-logic.png" alt-text="Screenshot of configure signal logic page." lightbox="./media/dns-alerts-metrics/configure-signal-logic.png":::

1. To send a notification or invoke an action triggered by the alert, select the **Add action groups**. On the *Add action groups* page, select **+ Create action group**. For more information, see [Action Group](/azure/azure-monitor/alerts/action-groups).

1. Enter an *Alert rule name* then select **Create alert rule** to save your configuration.

   :::image type="content" source="./media/dns-alerts-metrics/create-alert-rule.png" alt-text="Screenshot of create alert rule page with the Alert rule name highlighted." lightbox="./media/dns-alerts-metrics/create-alert-rule.png":::

For more information on how to configure alerting for Azure Monitor metrics, see [Create, view, and manage alerts using Azure Monitor](/azure/azure-monitor/alerts/alerts-metric).

[!INCLUDE [azmon-horz-alerts-part-two](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/azmon-horz-alerts-part-two.md)]

## Related content

- [Azure DNS monitoring data reference](monitor-dns-reference.md)
- [Monitoring Azure resources with Azure Monitor](/azure/azure-monitor/essentials/monitor-azure-resource)

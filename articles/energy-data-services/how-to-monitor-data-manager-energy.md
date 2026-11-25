---
title: Monitor Azure Data Manager for Energy
description: Start here to learn how to monitor Azure Data Manager for Energy. This article describes the monitoring data available for this service.
author: priyabratpadhi
ms.author: ppadhi
ms.service: azure-data-manager-energy
ms.topic: how-to
ms.date: 07/27/2026
ms.custom: horz-monitor
---

# Monitor Azure Data Manager for Energy

This article describes the monitoring data available for Azure Data Manager for Energy and how to view and analyze it.

When you have critical applications and business processes that rely on Azure resources, you need to monitor your Azure Data Manager for Energy instance for usage and health. You can view these platform metrics in the Azure portal directly from your resource, or you can use Azure Monitor.

- For more information on Azure Monitor, see the [Azure Monitor overview](/azure/azure-monitor/overview).
- For more information on how to monitor Azure resources in general, see [Monitor Azure resources with Azure Monitor](/azure/azure-monitor/essentials/monitor-azure-resource).

## Resource types

Azure uses **resource types** and **resource IDs** to identify resources within a subscription. Each resource ID includes the resource type. For Azure Data Manager for Energy, the resource type is `Microsoft.OpenEnergyPlatform/energyServices`.

Azure Monitor organizes monitoring data, including **metrics** and **logs**, by resource type. In Azure Monitor, resource types also serve as **namespaces**. The available metrics and logs vary by resource type.

For more information about the resource types for Azure Data Manager for Energy, see [Azure Data Manager for Energy monitoring data reference](concepts-monitor-data-reference.md).

<!--## Data storage

For Azure Monitor:

- Metrics data is stored in the Azure Monitor metrics database.

For detailed information on how Azure Monitor stores data, see [Azure Monitor data platform](/azure/azure-monitor/platform/data-platform).

<!-## Azure Monitor platform metrics

Azure Monitor provides platform metrics for most services. These metrics are:

- Individually defined for each namespace.
- Stored in the Azure Monitor time-series metrics database.
- Lightweight and capable of supporting near real-time alerting.
- Used to track the performance of a resource over time.

**Collection:** Azure Monitor collects platform metrics automatically. No configuration is required.

For a list of available metrics for Azure Data Manager for Energy, including dimensions and aggregation types, see [Azure Data Manager for Energy monitoring data reference](concepts-monitor-data-reference.md).
-->

## View metrics from the Azure Data Manager for Energy resource

You can access metrics directly from your Azure Data Manager for Energy resource in the Azure portal.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Go to your Azure Data Manager for Energy resource.
1. In the left menu under **Monitoring**, select **Metrics**.

   :::image type="content" source="media/how-to-monitor/metrics-menu-option.png" alt-text="Screenshot of the Azure Data Manager for Energy resource left menu with the Metrics option highlighted under the Monitoring section.":::

1. Select **Add metric**.
1. Choose the metric you want to view from the **Metric** dropdown (for example, **Total Http Requests** or **Data Volume**).

   :::image type="content" source="media/how-to-monitor/metrics-dropdown.png" lightbox="media/how-to-monitor/metrics-dropdown.png" alt-text="Screenshot of the Metrics page showing the Metric dropdown with available metrics, including Data Volume (Preview) under Capacity and Total HTTP Requests (Preview) under Traffic.":::

1. Select the desired **Aggregation** (for example, Sum).
1. Optionally, use **Add filter** to filter by a specific dimension such as Service or Data Partition.

   :::image type="content" source="media/how-to-monitor/metrics-add-filter.png" lightbox="media/how-to-monitor/metrics-add-filter.png" alt-text="Screenshot of the Metrics page showing the Add filter option with the Service property selected and a list of available service values.":::

1. Optionally, use **Apply splitting** to split the chart by a dimension.

   :::image type="content" source="media/how-to-monitor/metrics-apply-splitting.png" lightbox="media/how-to-monitor/metrics-apply-splitting.png" alt-text="Screenshot of the Metrics page showing a chart split by the Response Code dimension, displaying separate lines for different HTTP response codes.":::

## View metrics from Azure Monitor

You can also access metrics through the centralized Azure Monitor experience, which you can use to view metrics across multiple resources.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. From the portal menu or search bar, go to **Azure Monitor**.
1. Select **Metrics** from the left menu.

   :::image type="content" source="media/how-to-monitor/azure-monitor-metrics-menu.png" alt-text="Screenshot of the Azure Monitor page with the Metrics option highlighted in the left navigation menu.":::

1. In the **Scope** picker, select your Azure Data Manager for Energy resource.

   :::image type="content" source="media/how-to-monitor/azure-monitor-scope-picker.png" lightbox="media/how-to-monitor/azure-monitor-scope-picker.png" alt-text="Screenshot of the Azure Monitor Metrics page showing the Select a scope pane with an Azure Data Manager for Energy resource selected.":::

1. Choose the **metric**, **aggregation**, and **filters** you want, as described in the previous section.

For more information about how to use Metrics Explorer, see [Analyze metrics with Azure Monitor metrics explorer](/azure/azure-monitor/essentials/metrics-getting-started).



## Metrics data availability and retention

Platform metrics for Azure Data Manager for Energy are available from the date you enable the feature on your instance. Metrics data is retained for 93 days. While you can only query up to 30 days of data on a single chart, you can pan the chart to view the full retention window.

For more information on metrics retention, see [Azure Monitor Metrics overview - Retention of metrics](/azure/azure-monitor/metrics/data-platform-metrics#retention-of-metrics).

<!--
## Alerts

Azure Monitor alerts proactively notify you when they find specific conditions in your monitoring data. Alerts help you identify and address issues in your system before your customers notice them.

You can create metric alerts for Azure Data Manager for Energy to get notified when metrics such as **Total HTTP Requests** or **Data Volume** cross a defined threshold. To learn how to create and manage alert rules, see [Create or edit a metric alert rule](/azure/azure-monitor/alerts/alerts-create-metric-alert-rule).

For more information on Azure Monitor alerts, see [Azure Monitor alerts overview](/azure/azure-monitor/alerts/alerts-overview).

### Recommended alert rules for Azure Data Manager for Energy

The following table lists some suggested alert rules for Azure Data Manager for Energy:

| Alert type | Condition | Description |
|------------|-----------|-------------|
| Metric alert | Total HTTP Requests is greater than *threshold* | Alerts when the number of HTTP requests exceeds a specified threshold, which might indicate unexpected traffic spikes. |
| Metric alert | Total HTTP Requests with Response Code 5xx is greater than *threshold* | Alerts when server error responses exceed a threshold, which might indicate service availability problems. |
-->

## Related content

- [Azure Data Manager for Energy overview](overview-microsoft-energy-data-services.md)
- [Azure Data Manager for Energy monitoring data reference](concepts-monitor-data-reference.md)
- [Azure Monitor overview](/azure/azure-monitor/overview)
- [Monitor Azure resources with Azure Monitor](/azure/azure-monitor/essentials/monitor-azure-resource)

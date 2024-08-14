---
title: Monitor Azure ExpressRoute
description: Start here to learn how to monitor Azure ExpressRoute by using Azure Monitor. This article includes links to other resources.
ms.date: 07/11/2024
ms.custom: horz-monitor, subject-monitoring, FY 23 content-maintenance
ms.topic: conceptual
author: duongau
ms.author: duau
ms.service: expressroute
---

# Monitor Azure ExpressRoute

[!INCLUDE [horz-monitor-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-intro.md)]

[!INCLUDE [horz-monitor-insights](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-insights.md)]

ExpressRoute uses Network insights to provide a detailed topology mapping of all ExpressRoute components (peerings, connections, gateways) in relation with one another. Network insights for ExpressRoute also have preloaded metrics dashboard for availability, throughput, packet drops, and gateway metrics. For more information, see [Azure ExpressRoute Insights using Networking Insights](expressroute-network-insights.md).

[!INCLUDE [horz-monitor-resource-types](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-resource-types.md)]
For more information about the resource types for ExpressRoute, see [Azure ExpressRoute monitoring data reference](monitor-expressroute-reference.md).

[!INCLUDE [horz-monitor-data-storage](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-data-storage.md)]

Resource Logs aren't collected and stored until you create a diagnostic setting and route them to one or more locations.

See [Create diagnostic setting to collect platform logs and metrics in Azure](../azure-monitor/essentials/diagnostic-settings.md) for the detailed process for creating a diagnostic setting using the Azure portal, CLI, or PowerShell. When you create a diagnostic setting, you specify which categories of logs to collect. The categories for *Azure ExpressRoute* are listed in [Azure ExpressRoute monitoring data reference](monitor-expressroute-reference.md#resource-logs).

> [!IMPORTANT]
> Enabling these settings requires additional Azure services (storage account, event hub, or Log Analytics), which may increase your cost. To calculate an estimated cost, visit the [Azure pricing calculator](https://azure.microsoft.com/pricing/calculator).

[!INCLUDE [horz-monitor-platform-metrics](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-platform-metrics.md)]

For a list of available metrics for ExpressRoute, see [Azure ExpressRoute monitoring data reference](monitor-expressroute-reference.md#metrics).

> [!NOTE]
> Using **Classic Metrics** is not recommended.
>

## Analyzing metrics

You can analyze metrics for *Azure ExpressRoute* with metrics from other Azure services using metrics explorer by opening **Metrics** from the **Azure Monitor** menu. See [Analyze metrics with Azure Monitor metrics explorer](../azure-monitor/essentials/analyze-metrics.md) for details on using this tool.

:::image type="content" source="./media/expressroute-monitoring-metrics-alerts/metrics-page.png" alt-text="Screenshot of the metrics dashboard for ExpressRoute.":::

For reference, you can see a list of [all resource metrics supported in Azure Monitor](../azure-monitor/essentials/metrics-supported.md).

- To view **ExpressRoute** metrics, filter by Resource Type *ExpressRoute circuits*. 
- To view **Global Reach** metrics, filter by Resource Type *ExpressRoute circuits* and select an ExpressRoute circuit resource that has Global Reach enabled. 
- To view **ExpressRoute Direct** metrics, filter Resource Type by *ExpressRoute Ports*. 

Once a metric is selected, the default aggregation is applied. Optionally, you can apply splitting, which shows the metric with different dimensions.

### ExpressRoute metrics

To view **Metrics**, go to the *Azure Monitor* page and select *Metrics*. To view **ExpressRoute** metrics, filter by Resource Type *ExpressRoute circuits*. To view **Global Reach** metrics, filter by Resource Type *ExpressRoute circuits* and select an ExpressRoute circuit resource that has Global Reach enabled. To view **ExpressRoute Direct** metrics, filter Resource Type by *ExpressRoute Ports*. 

After a metric is selected, the default aggregation is applied. Optionally, you can apply splitting, which shows the metric with different dimensions.

> [!IMPORTANT]
> When viewing ExpressRoute metrics in the Azure portal, select a time granularity of **5 minutes or greater** for best possible results.
>
> :::image type="content" source="./media/expressroute-monitoring-metrics-alerts/metric-granularity.png" alt-text="Screenshot of time granularity options.":::

For the ExpressRoute metrics, see [Azure ExpressRoute monitoring data reference](monitor-expressroute-reference.md).

### Aggregation Types

Metrics explorer supports sum, maximum, minimum, average and count as [aggregation types](../azure-monitor/essentials/metrics-charts.md#aggregation). You should use the recommended Aggregation type when reviewing the insights for each ExpressRoute metric.

- Sum: The sum of all values captured during the aggregation interval.
- Count: The number of measurements captured during the aggregation interval.
- Average: The average of the metric values captured during the aggregation interval.
- Min: The smallest value captured during the aggregation interval.
- Max: The largest value captured during the aggregation interval.

[!INCLUDE [horz-monitor-resource-logs](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-resource-logs.md)]

For the available resource log categories, their associated Log Analytics tables, and the log schemas for ExpressRoute, see [Azure ExpressRoute monitoring data reference](monitor-expressroute-reference.md#resource-logs).

[!INCLUDE [horz-monitor-activity-log](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-activity-log.md)]

### More metrics in Log Analytics

You can also view ExpressRoute metrics by going to your ExpressRoute circuit resource and selecting the *Logs* tab. For any metrics you query, the output contains the following columns.

| Column | Type | Description |
|:-------|:-----|:------------|
| TimeGrain | string | PT1M (metric values are pushed every minute) |
| Count     | real   | Usually is 2 (each MSEE pushes a single metric value every minute) |
| Minimum   | real   | The minimum of the two metric values pushed by the two MSEEs |
| Maximum   | real   | The maximum of the two metric values pushed by the two MSEEs | 
| Average   | real   | Equal to (Minimum + Maximum)/2 |
| Total     | real   | Sum of the two metric values from both MSEEs (the main value to focus on for the metric queried) |

<a name="collection-and-routing"></a>

## Analyzing logs

Data in Azure Monitor Logs is stored in tables where each table has its own set of unique properties.  

All resource logs in Azure Monitor have the same fields followed by service-specific fields. The common schema is outlined in [Azure Monitor resource log schema](../azure-monitor/essentials/resource-logs-schema.md#top-level-common-schema). The schema for ExpressRoute resource logs is found in the [Azure ExpressRoute Data Reference](monitor-expressroute-reference.md#schemas).

The [Activity log](../azure-monitor/essentials/activity-log.md) is a platform logging that provides insight into subscription-level events. You can view it independently or route it to Azure Monitor Logs, where you can do much more complex queries using Log Analytics.

ExpressRoute stores data in the following tables.

| Table | Description |
|:------|:------------|
| AzureDiagnostics | Common table used by multiple services to store Resource logs. Resource logs from ExpressRoute can be identified with `MICROSOFT.NETWORK`. |
| AzureMetrics | Metric data emitted by ExpressRoute that measure their health and performance. 

To view these tables, navigate to your ExpressRoute circuit resource and select **Logs** under *Monitoring*.

> [!NOTE]
> Azure diagnostic logs, such as BGP route table log are updated every 24 hours.

[!INCLUDE [horz-monitor-analyze-data](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-analyze-data.md)]

[!INCLUDE [horz-monitor-external-tools](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-external-tools.md)]

[!INCLUDE [horz-monitor-kusto-queries](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-kusto-queries.md)]

### Sample Kusto queries

These queries work with the [new language](../azure-monitor/logs/log-query-overview.md).

- Query for Border Gateway Protocol (BGP) route table learned over the last 12 hours.

  ```kusto
  AzureDiagnostics
  | where TimeGenerated > ago(12h)
  | where ResourceType == "EXPRESSROUTECIRCUITS"
  | project TimeGenerated, ResourceType , network_s, path_s, OperationName
  ```

- Query for BGP informational messages by level, resource type, and network.

  ```kusto
  AzureDiagnostics
  | where Level == "Informational"
  | where ResourceType == "EXPRESSROUTECIRCUITS"
  | project TimeGenerated, ResourceId , Level, ResourceType , network_s, path_s
  ```

- Query for Traffic graph BitInPerSeconds in the last one hour.

  ```kusto
  AzureMetrics
  | where MetricName == "BitsInPerSecond"
  | summarize by Average, bin(TimeGenerated, 1h), Resource
  | render timechart
  ```

- Query for Traffic graph BitOutPerSeconds in the last one hour.

  ```kusto
  AzureMetrics
  | where MetricName == "BitsOutPerSecond"
  | summarize by Average, bin(TimeGenerated, 1h), Resource
  | render timechart
  ```

- Query for graph of ArpAvailability in 5-minute intervals.

  ```kusto
  AzureMetrics
  | where MetricName == "ArpAvailability"
  | summarize by Average, bin(TimeGenerated, 5m), Resource
  | render timechart
  ```

- Query for graph of BGP availability in 5-minute intervals.

  ```kusto
  AzureMetrics
  | where MetricName == "BGPAvailability"
  | summarize by Average, bin(TimeGenerated, 5m), Resource
  | render timechart
  ```

[!INCLUDE [horz-monitor-alerts](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-alerts.md)]

> [!NOTE]
> During maintenance between the Microsoft edge and core network, BGP availability appears down even if the BGP session between the customer edge and Microsoft edge remains up. For information about maintenance between the Microsoft edge and core network, make sure to have your [maintenance alerts turned on and configured](./maintenance-alerts.md).

[!INCLUDE [horz-monitor-insights-alerts](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-insights-alerts.md)]

### ExpressRoute alert rules

The following table lists some suggested alert rules for ExpressRoute. These alerts are just examples. You can set alerts for any metric, log entry, or activity log entry listed in the [Azure ExpressRoute monitoring data reference](monitor-expressroute-reference.md).

| Alert type | Condition | Description  |
|:---|:---|:---|
| ARP availability down | Dimension name: Peering Type, Aggregation type: Avg, Operator: Less than, Threshold value: 100% | When ARP availability is down for a peering type. |
| BGP availability down | Dimension name: Peer, Aggregation type: Avg, Operator: Less than, Threshold value: 100% | When BGP availability is down for a peer. |

### Alerts for ExpressRoute gateway connections

1. To configure alerts, navigate to **Azure Monitor**, then select **Alerts**.

   :::image type="content" source="./media/expressroute-monitoring-metrics-alerts/monitor-overview.png" alt-text="Screenshot of the alerts option from the monitor overview page.":::

1. Select **+ Create** > **Alert rule** and select the ExpressRoute gateway connection resource. Select **Next: Condition >** to configure the signal.

   :::image type="content" source="./media/expressroute-monitoring-metrics-alerts/select-expressroute-gateway.png" alt-text="Screenshot of the selecting ExpressRoute virtual network gateway from the select a resource page.":::

1. On the *Select a signal* page, select a metric, resource health, or activity log that you want to be alerted. Depending on the signal you select, you might need to enter additional information such as a threshold value. You can also combine multiple signals into a single alert. Select **Next: Actions >** to define who and how they get notify.

   :::image type="content" source="./media/expressroute-monitoring-metrics-alerts/signal.png" alt-text="Screenshot of list of signals that can be alerted for ExpressRoute gateways.":::

1. Select **+ Select action groups** to choose an existing action group you previously created or select **+ Create action group** to define a new one. In the action group, you determine how notifications get sent and who receives them.

   :::image type="content" source="./media/expressroute-monitoring-metrics-alerts/action-group.png" alt-text="Screenshot of add action groups page.":::

1. Select **Review + create** and then **Create** to deploy the alert into your subscription.

[!INCLUDE [horz-monitor-advisor-recommendations](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-advisor-recommendations.md)]

### Alerts based on each peering

After you select a metric, certain metric allow you to set up dimensions based on peering or a specific peer (virtual networks).

:::image type="content" source="./media/expressroute-monitoring-metrics-alerts/alerts-peering-dimensions.png" alt-text="Screenshot of an alert rule based on ExpressRoute peering setup.":::

### Configure alerts for activity logs on circuits

When selecting signals to be alerted on, you can select **Activity Log** signal type.

:::image type="content" source="./media/expressroute-monitoring-metrics-alerts/activity-log.png" alt-text="Screenshot of activity log signals from the select a signal page.":::

## Related content

- See [Azure ExpressRoute monitoring data reference](monitor-expressroute-reference.md) for a reference of the metrics, logs, and other important values created for ExpressRoute.
- See [Monitoring Azure resources with Azure Monitor](/azure/azure-monitor/essentials/monitor-azure-resource) for general details on monitoring Azure resources.
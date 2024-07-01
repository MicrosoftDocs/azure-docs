---
title: 'Azure ExpressRoute: Monitoring, Metrics, and Alerts'
description: Learn about Azure ExpressRoute monitoring, metrics, and alerts using Azure Monitor, the one stop shop for all metrics, alerting, diagnostic logs across Azure.
author: duongau
ms.service: expressroute
ms.topic: how-to
ms.date: 06/24/2024
ms.author: duau
---

# ExpressRoute monitoring, metrics, and alerts

This article helps you understand ExpressRoute monitoring, metrics, and alerts using Azure Monitor. Azure Monitor is one stop shop for all metrics, alerting, diagnostic logs across all of Azure.
 
> [!NOTE]
> Using **Classic Metrics** is not recommended.
>

## ExpressRoute metrics

To view **Metrics**, go to the *Azure Monitor* page and select *Metrics*. To view **ExpressRoute** metrics, filter by Resource Type *ExpressRoute circuits*. To view **Global Reach** metrics, filter by Resource Type *ExpressRoute circuits* and select an ExpressRoute circuit resource that has Global Reach enabled. To view **ExpressRoute Direct** metrics, filter Resource Type by *ExpressRoute Ports*. 

Once a metric is selected, the default aggregation is applied. Optionally, you can apply splitting, which shows the metric with different dimensions.

> [!IMPORTANT]
> When viewing ExpressRoute metrics in the Azure portal, select a time granularity of **5 minutes or greater** for best possible results.
>
> :::image type="content" source="./media/expressroute-monitoring-metrics-alerts/metric-granularity.png" alt-text="Screenshot of time granularity options.":::

For the ExpressRoute metrics, see [Azure ExpressRoute monitoring data reference](monitor-expressroute-reference.md).

### Aggregation Types

Metrics explorer supports sum, maximum, minimum, average and count as [aggregation types](../azure-monitor/essentials/metrics-charts.md#aggregation). You should use the recommended Aggregation type when reviewing the insights for each ExpressRoute metric.

* Sum: The sum of all values captured during the aggregation interval. 
* Count: The number of measurements captured during the aggregation interval. 
* Average: The average of the metric values captured during the aggregation interval. 
* Min: The smallest value captured during the aggregation interval. 
* Max: The largest value captured during the aggregation interval. 


## Alerts for ExpressRoute gateway connections

1. To configure alerts, navigate to **Azure Monitor**, then select **Alerts**.

   :::image type="content" source="./media/expressroute-monitoring-metrics-alerts/monitor-overview.png" alt-text="Screenshot of the alerts option from the monitor overview page.":::

1. Select **+ Create > Alert rule** and select the ExpressRoute gateway connection resource. Select **Next: Condition >** to configure the signal.

   :::image type="content" source="./media/expressroute-monitoring-metrics-alerts/select-expressroute-gateway.png" alt-text="Screenshot of the selecting ExpressRoute virtual network gateway from the select a resource page.":::

1. On the *Select a signal* page, select a metric, resource health, or activity log that you want to be alerted. Depending on the signal you select, you might need to enter additional information such as a threshold value. You can also combine multiple signals into a single alert. Select **Next: Actions >** to define who and how they get notify.

   :::image type="content" source="./media/expressroute-monitoring-metrics-alerts/signal.png" alt-text="Screenshot of list of signals that can be alerted for ExpressRoute gateways.":::

1. Select **+ Select action groups** to choose an existing action group you previously created or select **+ Create action group** to define a new one. In the action group, you determine how notifications get sent and who receives them.

   :::image type="content" source="./media/expressroute-monitoring-metrics-alerts/action-group.png" alt-text="Screenshot of add action groups page.":::

1. Select **Review + create** and then **Create** to deploy the alert into your subscription.

### Alerts based on each peering

After you select a metric, certain metric allow you to set up dimensions based on peering or a specific peer (virtual networks).

:::image type="content" source="./media/expressroute-monitoring-metrics-alerts/alerts-peering-dimensions.png" alt-text="Screenshot of an alert rule based on ExpressRoute peering setup.":::

### Configure alerts for activity logs on circuits

When selecting signals to be alerted on, you can select **Activity Log** signal type.

:::image type="content" source="./media/expressroute-monitoring-metrics-alerts/activity-log.png" alt-text="Screenshot of activity log signals from the select a signal page.":::

## More metrics in Log Analytics

You can also view ExpressRoute metrics by going to your ExpressRoute circuit resource and selecting the *Logs* tab. For any metrics you query, the output contains the following columns.

| **Column** | **Type** | **Description** | 
|  ---  |  ---  |  ---  | 
| TimeGrain | string | PT1M (metric values are pushed every minute) | 
| Count | real | Usually is 2 (each MSEE pushes a single metric value every minute) | 
| Minimum | real | The minimum of the two metric values pushed by the two MSEEs | 
| Maximum | real | The maximum of the two metric values pushed by the two MSEEs | 
| Average | real | Equal to (Minimum + Maximum)/2 | 
| Total | real | Sum of the two metric values from both MSEEs (the main value to focus on for the metric queried) | 
  
## Next steps

Set up your ExpressRoute connection.
  
* [Create and modify a circuit](expressroute-howto-circuit-arm.md)
* [Create and modify peering configuration](expressroute-howto-routing-arm.md)
* [Link a virtual network to an ExpressRoute circuit](expressroute-howto-linkvnet-arm.md)

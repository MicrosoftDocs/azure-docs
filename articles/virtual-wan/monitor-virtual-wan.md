---
title: Monitor Azure Virtual WAN
description: Start here to learn how to monitor availability and performance for Azure Virtual WAN by using Azure Monitor.
ms.date: 07/23/2024
ms.custom: horz-monitor
ms.topic: conceptual
author: cherylmc
ms.author: cherylmc
ms.service: virtual-wan
---

# Monitor Azure Virtual WAN

[!INCLUDE [horz-monitor-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-intro.md)]

[!INCLUDE [horz-monitor-insights](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-insights.md)]

Virtual WAN uses Network Insights to provide users and operators with the ability to view the state and status of a virtual WAN, presented through an autodiscovered topological map. Resource state and status overlays on the map give you a snapshot view of the overall health of the virtual WAN. You can navigate resources on the map by using one-click access to the resource configuration pages of the Virtual WAN portal. For more information, see [Azure Monitor Network Insights for Virtual WAN](azure-monitor-insights.md).

[!INCLUDE [horz-monitor-resource-types](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-resource-types.md)]

For more information about the resource types for Virtual WAN, see [Azure Virtual WAN monitoring data reference](monitor-virtual-wan-reference.md).

[!INCLUDE [horz-monitor-data-storage](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-data-storage.md)]

[!INCLUDE [horz-monitor-platform-metrics](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-platform-metrics.md)]

For a list of available metrics for Virtual WAN, see [Azure Virtual WAN monitoring data reference](monitor-virtual-wan-reference.md#metrics).

<!-- ## OPTIONAL [TODO-replace-with-service-name] metrics
If your service uses any non-Azure Monitor based metrics, add the following include and more information.
[!INCLUDE [horz-monitor-custom-metrics](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-non-monitor-metrics.md)] -->

<a name="metrics-steps"></a>

You can view metrics for Virtual WAN by using the Azure portal.

The following steps help you locate and view metrics:

Select **Monitor Gateway** and then **Metrics**. You can also select **Metrics** at the bottom to view a dashboard of the most important metrics for site-to-site and point-to-site VPN.

:::image type="content" source="./media/monitor-virtual-wan-reference/site-to-site-vpn-metrics-dashboard.png" alt-text="Screenshot shows the sie-to-site VPN metrics dashboard." lightbox="./media/monitor-virtual-wan-reference/site-to-site-vpn-metrics-dashboard.png":::

On the **Metrics** page, you can view the metrics.

:::image type="content" source="./media/monitor-virtual-wan-reference/metrics-page.png" alt-text="Screenshot that shows the 'Metrics' page with the categories highlighted." lightbox="./media/monitor-virtual-wan-reference/metrics-page.png":::

To see metrics for the virtual hub router, you can select **Metrics** from the virtual hub **Overview** page.

:::image type="content" source="./media/monitor-virtual-wan-reference/hub-metrics.png" alt-text="Screenshot that shows the virtual hub page with the metrics button." lightbox="./media/monitor-virtual-wan-reference/hub-metrics.png":::

For more information, see [Analyze metrics for an Azure resource](../azure-monitor/essentials/tutorial-metrics.md).

#### PowerShell steps

You can view metrics for Virtual WAN by using PowerShell. To query, use the following example PowerShell commands.

```azurepowershell-interactive
$MetricInformation = Get-AzMetric -ResourceId "/subscriptions/<SubscriptionID>/resourceGroups/<ResourceGroupName>/providers/Microsoft.Network/VirtualHubs/<VirtualHubName>" -MetricName "VirtualHubDataProcessed" -TimeGrain 00:05:00 -StartTime 2022-2-20T01:00:00Z -EndTime 2022-2-20T01:30:00Z -AggregationType Sum
```


```azurepowershell-interactive
$MetricInformation.Data
```

- **Resource ID**. Your virtual hub's Resource ID can be found on the Azure portal. Navigate to the virtual hub page within vWAN and select **JSON View** under Essentials.  
- **Metric Name**. Refers to the name of the metric you're querying, which in this case is called `VirtualHubDataProcessed`. This metric shows all the data that the virtual hub router processed in the selected time period of the hub.  
- **Time Grain**. Refers to the frequency at which you want to see the aggregation. In the current command, you see a selected aggregated unit per 5 mins. You can select – 5M/15M/30M/1H/6H/12H and 1D.
- **Start Time and End Time**. This time is based on UTC. Ensure that you're entering UTC values when inputting these parameters. If these parameters aren't used, the past one hour's worth of data is shown by default.  
- **Sum Aggregation Type**. The **sum** aggregation type shows you the total number of bytes that traversed the virtual hub router during a selected time period. For example, if you set the Time granularity to 5 minutes, each data point corresponds to the number of bytes sent in that five minute interval. To convert this value to Gbps, you can divide this number by 37500000000. Based on the virtual hub's [capacity](hub-settings.md#capacity), the hub router can support between 3 Gbps and 50 Gbps. The **Max** and **Min** aggregation types aren't meaningful at this time. 

[!INCLUDE [horz-monitor-resource-logs](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-resource-logs.md)]

For the available resource log categories, their associated Log Analytics tables, and the log schemas for Virtual WAN, see [Azure Virtual WAN monitoring data reference](monitor-virtual-wan-reference.md#resource-logs).

[!INCLUDE [horz-monitor-activity-log](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-activity-log.md)]

[!INCLUDE [horz-monitor-analyze-data](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-analyze-data.md)]

[!INCLUDE [horz-monitor-external-tools](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-external-tools.md)]

[!INCLUDE [horz-monitor-kusto-queries](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-kusto-queries.md)]

<!-- REQUIRED. Add sample Kusto queries for your service here. -->

[!INCLUDE [horz-monitor-alerts](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-alerts.md)]

[!INCLUDE [horz-monitor-insights-alerts](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-insights-alerts.md)]

### Virtual WAN alert rules

You can set alerts for any metric, log entry, or activity log entry listed in the [Azure Virtual WAN monitoring data reference](monitor-virtual-wan-reference.md).

[!INCLUDE [horz-monitor-advisor-recommendations](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-advisor-recommendations.md)]

## Related content

- See [Azure Virtual WAN monitoring data reference](monitor-virtual-wan-reference.md) for a reference of the metrics, logs, and other important values created for Virtual WAN.
- See [Monitoring Azure resources with Azure Monitor](/azure/azure-monitor/essentials/monitor-azure-resource) for general details on monitoring Azure resources.

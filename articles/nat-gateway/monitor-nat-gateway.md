---
title: Monitor Azure NAT Gateway
description: Start here to learn how to monitor Azure NAT Gateway by using the available Azure Monitor metrics and alerts.
ms.date: 08/06/2024
ms.custom: horz-monitor
ms.topic: conceptual
author: asudbring
ms.author: allensu
ms.service: nat-gateway
---

# Monitor Azure NAT Gateway

[!INCLUDE [horz-monitor-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-intro.md)]

You can use metrics and alerts to monitor, manage, and [troubleshoot](troubleshoot-nat.md) your NAT gateway resource. Azure NAT Gateway provides the following diagnostic capabilities:  

- Multi-dimensional metrics and alerts through Azure Monitor: You can use these metrics to monitor and manage your NAT gateway and to assist you in troubleshooting issues.
- Network Insights: Azure Monitor Insights provides you with visual tools to view, monitor, and assist you in diagnosing issues with your NAT gateway resource. Insights provide you with a topological map of your Azure setup and metrics dashboards.

This diagram shows Azure NAT Gateway for outbound to the internet.

:::image type="content" source="./media/nat-gateway-resource/nat-gateway-deployment.png" alt-text="Diagram of a NAT gateway resource with virtual machines.":::

[!INCLUDE [horz-monitor-insights](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-insights.md)]

[Azure Monitor Network Insights](../network-watcher/network-insights-overview.md) allows you to visualize your Azure infrastructure setup and to review all metrics for your NAT gateway resource from a preconfigured metrics dashboard. These visual tools help you diagnose and troubleshoot any issues with your NAT gateway resource.

### View the topology of your Azure architectural setup

To view a topological map of your setup in Azure:

1. From your NAT gateway’s resource page, select **Insights** from the **Monitoring** section.

1. On the landing page for **Insights**, there's a topology map of your NAT gateway setup. This map shows the relationship between the different components of your network (subnets, virtual machines, public IP addresses). 

1. To view configuration information, hover over any component in the topology map.

   :::image type="content" source="./media/nat-metrics/nat-insights.png" alt-text="Screenshot of the Insights section of NAT gateway.":::

### View all NAT gateway metrics in a dashboard

The metrics dashboard can be used to better understand the performance and health of your NAT gateway resource. The metrics dashboard shows a view of all metrics for NAT gateway on a single page.  

- All NAT gateway metrics can be viewed in a dashboard when selecting **Show Metrics Pane**.

  :::image type="content" source="./media/nat-metrics/nat-metrics-pane.png" alt-text="Screenshot of the show metrics pane where you can view metrics."::: 

- A full page view of all NAT gateway metrics can be viewed when selecting **View Detailed Metrics**.

  :::image type="content" source="./media/nat-metrics/detailed-metrics.png" alt-text="Screenshot of the view detailed metrics.":::

For more information on what each metric is showing you and how to analyze these metrics, see [How to use NAT gateway metrics](monitor-nat-gateway-reference.md#how-to-use-nat-gateway-metrics).

[!INCLUDE [horz-monitor-resource-types](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-resource-types.md)]
For more information about the resource types for Azure NAT Gateway, see [Azure NAT Gateway monitoring data reference](monitor-nat-gateway-reference.md).

[!INCLUDE [horz-monitor-data-storage](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-data-storage.md)]

[!INCLUDE [horz-monitor-platform-metrics](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-platform-metrics.md)]

For a list of available metrics for Azure NAT Gateway, see [Azure NAT Gateway monitoring data reference](monitor-nat-gateway-reference.md#metrics).

NAT gateway metrics can be found in the following locations in the Azure portal.

- **Metrics** page under **Monitoring** from a NAT gateway's resource page.

- **Insights** page under **Monitoring** from a NAT gateway's resource page.

  :::image type="content" source="./media/nat-metrics/nat-insights-metrics.png" alt-text="Screenshot of the insights and metrics options in NAT gateway overview.":::

- Azure Monitor page under **Metrics**.

  :::image type="content" source="./media/nat-metrics/azure-monitor.png" alt-text="Screenshot of the metrics section of Azure Monitor.":::

[!INCLUDE [horz-monitor-no-resource-logs](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-no-resource-logs.md)]

[!INCLUDE [horz-monitor-activity-log](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-activity-log.md)]

[!INCLUDE [horz-monitor-analyze-data](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-analyze-data.md)]

[!INCLUDE [horz-monitor-external-tools](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-external-tools.md)]

[!INCLUDE [horz-monitor-kusto-queries](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-kusto-queries.md)]

[!INCLUDE [horz-monitor-alerts](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-alerts.md)]

### Azure NAT Gateway alert rules

You can set alerts for any metric, log entry, or activity log entry listed in the [Azure NAT Gateway monitoring data reference](monitor-nat-gateway-reference.md).

### Alerts for datapath availability degradation

Set up an alert on datapath availability to help you detect issues with the health of NAT gateway.

The recommended guidance is to alert on NAT gateway's datapath availability when it drops below 90% over a 15-minute period. This configuration is indicative of a NAT gateway resource being in a degraded state.

> [!NOTE]
> Aggregation granularity is the period of time over which the datapath availability is measured to determine if it has dropped below the threshold value. Setting the aggregation granularity to less than 5 minutes may trigger false positive alerts that detect noise in the datapath.

### Alerts for SNAT port exhaustion

Set up an alert on the **SNAT connection count** metric to notify you of connection failures on your NAT gateway. A failed connection volume greater than zero can indicate that you reached the connection limit on your NAT gateway or that you hit SNAT port exhaustion. Investigate further to determine the root cause of these failures.

> [!NOTE]
> SNAT port exhaustion on your NAT gateway resource is uncommon. If you see SNAT port exhaustion, check if NAT gateway's idle timeout timer is set higher than the default amount of 4 minutes. A long idle timeout timer setting can cause SNAT ports too be in hold down for longer, which results in exhausting SNAT port inventory sooner. You can also scale your NAT gateway with additional public IPs to increase NAT gateway's overall SNAT port inventory. To troubleshoot these kinds of issues, refer to the [NAT gateway connectivity troubleshooting guide](/azure/nat-gateway/troubleshoot-nat-connectivity#snat-exhaustion-due-to-nat-gateway-configuration).

### Alerts for NAT gateway resource health

[Azure Resource Health](/azure/service-health/overview) provides information on the health state of your NAT gateway resource. The resource health of your NAT gateway is evaluated by measuring the datapath availability of your NAT gateway endpoint. You can set up alerts to notify you when the health state of your NAT gateway resource changes. To learn more about NAT gateway resource health and setting up alerts, see:

- [Azure NAT Gateway Resource Health](/azure/nat-gateway/resource-health)
- [NAT Gateway Resource Health Alerts](/azure/nat-gateway/resource-health#resource-health-alerts)
- [How to create Resource Health Alerts in the Azure portal](/azure/service-health/resource-health-alert-monitor-guide)

[!INCLUDE [horz-monitor-advisor-recommendations](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-advisor-recommendations.md)]

## Metrics FAQ

- What type of metrics are available for NAT gateway?

  The NAT gateway supports [multi-dimensional metrics](/azure/azure-monitor/essentials/data-platform-metrics#multi-dimensional-metrics). You can filter the multi-dimensional metrics by different dimensions to gain greater insight into the provided data. The [SNAT connection count](monitor-nat-gateway-reference.md#snat-connection-count) metric allows you to filter the connections by Attempted and Failed connections, enabling you to distinguish between different types of connections made by the NAT gateway.

  To see which dimensions are available for each NAT gateway metric, see the dimensions column in the [metrics overview table](monitor-nat-gateway-reference.md#metrics).

- How do I store NAT gateway metrics long-term?

  All [platform metrics are stored](/azure/azure-monitor/essentials/data-platform-metrics#retention-of-metrics) for 93 days. If you require long term access to your NAT gateway metrics data, NAT gateway metrics can be retrieved by using the [metrics REST API](/rest/api/monitor/metrics/list). For more information on how to use the API, see the [Azure monitoring REST API walkthrough](/azure/azure-monitor/essentials/rest-api-walkthrough).  

  > [!NOTE]
  > Diagnostic Settings [doesn’t support the export of multi-dimensional metrics](/azure/azure-monitor/reference/supported-metrics/metrics-index#exporting-platform-metrics-to-other-locations) to another location, such as Azure Storage and Log Analytics.
  >
  > To retrieve NAT gateway metrics, use the metrics REST API.

- How do I interpret metrics charts?

  Refer to [troubleshooting metrics charts](/azure/azure-monitor/essentials/metrics-troubleshoot) if you run into issues with creating, customizing, or interpreting charts in Azure metrics explorer.

## Related content

- See [Azure NAT Gateway monitoring data reference](monitor-nat-gateway-reference.md) for a reference of the metrics, logs, and other important values created for Azure NAT Gateway.
- See [Monitoring Azure resources with Azure Monitor](/azure/azure-monitor/essentials/monitor-azure-resource) for general details on monitoring Azure resources.

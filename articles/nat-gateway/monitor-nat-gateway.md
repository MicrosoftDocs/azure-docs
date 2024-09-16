---
title: Monitor Azure NAT Gateway
description: Start here to learn how to monitor Azure NAT Gateway by using the available Azure Monitor metrics and alerts.
ms.date: 09/16/2024
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

For more information on NAT Gateway Insights, see [Insights](nat-metrics.md#insights).

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

For guidance on how to configure some common and recommended types of alerts for your NAT gateway, see [Alerts](nat-metrics.md#alerts).

### Azure NAT Gateway alert rules

You can set alerts for any metric, log entry, or activity log entry listed in the [Azure NAT Gateway monitoring data reference](monitor-nat-gateway-reference.md).

[!INCLUDE [horz-monitor-advisor-recommendations](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-advisor-recommendations.md)]

## Related content

- See [Azure NAT Gateway monitoring data reference](monitor-nat-gateway-reference.md) for a reference of the metrics, logs, and other important values created for Azure NAT Gateway.
- See [Monitoring Azure resources with Azure Monitor](/azure/azure-monitor/essentials/monitor-azure-resource) for general details on monitoring Azure resources.

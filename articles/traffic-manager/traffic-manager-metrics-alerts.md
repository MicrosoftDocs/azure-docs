---
title: Metrics and Alerts in Azure Traffic Manager
description: In this article, learn the metrics and alerts available for Traffic Manager in Azure.
services: traffic-manager
author: greg-lindsay
ms.service: traffic-manager
ms.topic: conceptual
ms.workload: infrastructure-services
ms.date: 04/27/2023
ms.author: greglin
ms.custom: template-concept
---

# Traffic Manager metrics and alerts

Traffic Manager provides you with DNS-based load balancing that includes multiple routing methods and endpoint monitoring options. This article describes the metrics and associated alerts that are available to customers. 

## Metrics available in Traffic Manager 

Traffic Manager provides the following metrics on a per profile basis that customers can use to understand their usage of Traffic manager and the status of their endpoints under that profile.  

### Queries by endpoint returned
Use [this metric](../azure-monitor/essentials/metrics-supported.md) to view the number of queries that a Traffic Manager profile processes over a specified period. You can also view the same information at an endpoint level granularity that helps you understand how many times an endpoint was returned in the query responses from Traffic Manager.

In the following example, Figure 1 displays all the query responses that the Traffic Manager profile returns. 

  
![Aggregate view of all queries](./media/traffic-manager-metrics-alerts/traffic-manager-metrics-queries-aggregate-view.png)

*Figure 1: Aggregate view with all queries*
  
Figure 2 displays the same information, however, it is split by endpoints. As a result, you can see the volume of query responses in which a specific endpoint was returned.

![Traffic Manager metrics - split view of query volume per endpoint](./media/traffic-manager-metrics-alerts/traffic-manager-metrics-query-volume-per-endpoint.png)

*Figure 2: Split view with query volume shown per endpoint returned*

## Endpoint status by endpoint
Use [this metric](../azure-monitor/essentials/metrics-supported.md#microsoftnetworktrafficmanagerprofiles) to understand the health status of the endpoints in the profile. It takes two values:
 - use **1** if the endpoint is up.
 - use **0** if the endpoint is down.

This metric can be shown either as an aggregate value representing the status of all the metrics (Figure 3), or, it can be split (see Figure 4) to show the status of specific endpoints. If the former, if the aggregation level is selected as **Avg**, the value of this metric is the arithmetic average of the status of all endpoints. For example, if a profile has two endpoints and only one is healthy, then this metric has a value of **0.50** as shown in Figure 3. 


![Traffic Manager metrics - composite view of endpoint status](./media/traffic-manager-metrics-alerts/traffic-manager-metrics-endpoint-status-composite-view.png)

*Figure 3: Composite view of endpoint status metric – “Avg” aggregation selected*


![Traffic Manager metrics - split view of  endpoint status](./media/traffic-manager-metrics-alerts/traffic-manager-metrics-endpoint-status-split-view.png)

*Figure 4: Split view of endpoint status metrics*

You can consume these metrics through [Azure Monitor service](../azure-monitor/essentials/metrics-supported.md)’s portal, [REST API](/rest/api/monitor/), [Azure CLI](/cli/azure/monitor), and [Azure PowerShell](/powershell/module/az.applicationinsights), or through the metrics section of Traffic Manager’s portal experience.

## Alerts on Traffic Manager metrics
In addition to processing and displaying metrics from Traffic Manager, Azure Monitor enables customers to configure and receive alerts associated with these metrics. You can choose what conditions need to be met in these metrics for an alert to occur, how often those conditions need to be monitored, and how the alerts should be sent to you. For more information, see [Azure Monitor alerts documentation](../azure-monitor/alerts/alerts-metric.md).

Alert monitoring is important to ensure the system notifies when probes are down. Overly sensitive monitoring can be a distraction. Traffic Manager deploys multiple probes to increase resiliency. The threshold for probe statuses should be less than 0.5. If the average for **up** status falls below 0.5 (meaning less than 50% of probes are up) there should be an alert for an endpoint failure.

> [!NOTE]
> Multiple probes are deployed to increase resiliency. If one probe is down out of the many that are being sent, it doesn't necessarily reflect that the endpoint is down. The endpoint is only classified as down if the majority of probes returned are down.

The following configuration is an example of an alert setup.

:::image type="content" source="./media/traffic-manager-metrics-alerts/alert-example.png" alt-text="Screenshot of probe threshold alert example.":::

For more information about probes and monitoring, see [Traffic Manager endpoint monitoring](traffic-manager-monitoring.md).

## Next steps
- Learn more about [Azure Monitor service](../azure-monitor/essentials/metrics-supported.md)
- Learn how to [create a chart in Azure Monitor](../azure-monitor/essentials/analyze-metrics.md#create-a-metric-chart)
---
title: Metrics and Alerts in Azure Traffic Manager
description: This article describes metrics available for Traffic Manager in Azure.
services: traffic-manager
author: asudbring
ms.service: traffic-manager
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 06/11/2018
ms.author: allensu
---

# Traffic Manager metrics and alerts

Traffic Manager provides you with DNS-based load balancing that includes multiple routing methods and endpoint monitoring options. This article describes the metrics and associated alerts that are available to customers. 

## Metrics available in Traffic Manager 

Traffic Manager provides the following metrics on a per profile basis that customers can use to understand their usage of Traffic manager and the status of their endpoints under that profile.  

### Queries by endpoint returned
Use [this metric](../azure-monitor/platform/metrics-supported.md) to view the number of queries that a Traffic Manager profile processes over a specified period. You can also view the same information at an endpoint level granularity that helps you understand how many times an endpoint was returned in the query responses from Traffic Manager.

In the following example, Figure 1 displays all the query responses that the Traffic Manager profile returns. 

  
![Aggregate view of all queries](./media/traffic-manager-metrics-alerts/traffic-manager-metrics-queries-aggregate-view.png)

*Figure 1: Aggregate view with all queries*
  
Figure 2 displays the same information, however, it is split by endpoints. As a result, you can see the volume of query responses in which a specific endpoint was returned.

![Traffic Manager metrics - split view of query volume per endpoint](./media/traffic-manager-metrics-alerts/traffic-manager-metrics-query-volume-per-endpoint.png)

*Figure 2: Split view with query volume shown per endpoint returned*

## Endpoint status by endpoint
Use [this metric](../azure-monitor/platform/metrics-supported.md#microsoftnetworktrafficmanagerprofiles) to understand the health status of the endpoints in the profile. It takes two values:
 - use **1** if the endpoint is up.
 - use **0** if the endpoint is down.

This metric can be shown either as an aggregate value representing the status of all the metrics (Figure 3), or, it can be split (see Figure 4) to show the status of specific endpoints. If the former, if the aggregation level is selected as **Avg**, the value of this metric is the arithmetic average of the status of all endpoints. For example, if a profile has two endpoints and only one is healthy, then this metric has a value of **0.50** as shown in Figure 3. 


![Traffic Manager metrics - composite view of endpoint status](./media/traffic-manager-metrics-alerts/traffic-manager-metrics-endpoint-status-composite-view.png)

*Figure 3: Composite view of endpoint status metric – “Avg” aggregation selected*


![Traffic Manager metrics - split view of  endpoint status](./media/traffic-manager-metrics-alerts/traffic-manager-metrics-endpoint-status-split-view.png)

*Figure 4: Split view of endpoint status metrics*

You can consume these metrics through [Azure Monitor service](../azure-monitor/platform/metrics-supported.md)’s portal, [REST API](https://docs.microsoft.com/rest/api/monitor/), [Azure CLI](https://docs.microsoft.com/cli/azure/monitor), and [Azure PowerShell](https://docs.microsoft.com/powershell/module/az.applicationinsights), or through the metrics section of Traffic Manager’s portal experience.

## Alerts on Traffic Manager metrics
In addition to processing and displaying metrics from Traffic Manager, Azure Monitor enables customers to configure and receive alerts associated with these metrics. You can choose what conditions need to be met in these metrics for an alert to occur, how often those conditions need to be monitored, and how the alerts should be sent to you. For more information, see [Azure Monitor alerts documentation](../monitoring-and-diagnostics/monitor-alerts-unified-usage.md).

## Next steps
- Learn more about [Azure Monitor service](../azure-monitor/platform/metrics-supported.md)
- Learn how to [create a chart using Azure Monitor](../azure-monitor/platform/metrics-getting-started.md#create-your-first-metric-chart)

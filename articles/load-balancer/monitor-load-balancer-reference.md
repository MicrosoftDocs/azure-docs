---
title: Monitoring data reference for Azure Load Balancer
description: This article contains important reference material you need when you monitor Azure Load Balancer by using Azure Monitor.
ms.date: 07/28/2024
ms.custom: horz-monitor
ms.topic: reference
author: mbender-ms
ms.author: mbender
ms.service: azure-load-balancer
---

# Azure Load Balancer monitoring data reference

[!INCLUDE [horz-monitor-ref-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-intro.md)]

See [Monitor Azure Load Balancer](monitor-load-balancer.md) for details on the data you can collect for Load Balancer and how to use it.

[!INCLUDE [horz-monitor-ref-metrics-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-intro.md)]

### Supported metrics for Microsoft.Network/loadBalancers

The following table lists the metrics available for the Microsoft.Network/loadBalancers resource type.

[!INCLUDE [horz-monitor-ref-metrics-tableheader](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-tableheader.md)]

[!INCLUDE [Microsoft.Network/loadBalancers](~/reusable-content/ce-skilling/azure/includes/azure-monitor/reference/metrics/microsoft-network-loadbalancers-metrics-include.md)]

### Load balancer metrics

This table includes additional information about metrics from the Microsoft.Network/loadBalancers table:

| Metric | Resource type | Description | Recommended aggregation |
|:------ |:------------- |:----------- |:----------------------- |
| Allocated SNAT ports | Public load balancer | Standard Load Balancer reports the number of SNAT ports allocated per backend instance. | Average |
| Byte count | Public and internal load balancer | Standard Load Balancer reports the data processed per front end. You might notice that the bytes aren't distributed equally across the backend instances. This behavior is expected as Azure's Load Balancer algorithm is based on flows. | Sum |
| Health probe status | Public and internal load balancer | Standard Load Balancer uses a distributed health-probing service that monitors your application endpoint's health according to your configuration settings. This metric provides an aggregate or per-endpoint filtered view of each instance endpoint in the load balancer pool. You can see how Load Balancer views the health of your application, as indicated by your health probe configuration. | Average |
| SNAT connection count | Public load balancer | Standard Load Balancer reports the number of outbound flows that are masqueraded to the Public IP address front end. Source network address translation (SNAT) ports are an exhaustible resource. This metric can give an indication of how heavily your application is relying on SNAT for outbound originated flows. Counters for successful and failed outbound SNAT flows are reported and can be used to troubleshoot and understand the health of your outbound flows. | Sum |
| SYN count (synchronize) | Public and internal load balancer | Standard Load Balancer doesn’t terminate Transmission Control Protocol (TCP) connections or interact with TCP or User Data-gram Packet (UDP) flows. Flows and their handshakes are always between the source and the virtual machine instance. To better troubleshoot your TCP protocol scenarios, you can make use of SYN packets counters to understand how many TCP connection attempts are made. The metric reports the number of TCP SYN packets that were received. | Average |
| Used SNAT ports | Public load balancer | Standard Load Balancer reports the number of SNAT ports that are utilized per backend instance. | Average |
| Data path availability | Public and internal load balancer |  Standard Load Balancer continuously exercises the data path from within a region to the load balancer front end, all the way to the SDN stack that supports your virtual machine. As long as healthy instances remain, the measurement follows the same path as your application's load-balanced traffic. The data path that your customer's use is also validated. The measurement is invisible to your application and doesn't interfere with other operations. | Average |

### Global load balancer metrics

This table includes additional information about global metrics from the Microsoft.Network/loadBalancers table:

| Metric | Resource type | Description | Recommended aggregation |
|:------ |:------------- |:----------- |:----------------------- |
| Health probe status | Public global load balancer | Global load balancer uses a distributed health-probing service that monitors your application endpoint's health according to your configuration settings. This metric provides an aggregate or per-endpoint filtered view of each instance regional load balancer in the global load balancer's backend pool. You can see how global load balancer views the health of your application, as indicated by your health probe configuration. | Average |
| Data path availability | Public global load balancer|  Global load balancer continuously exercises the data path from within a region to the load balancer front end, all the way to the SDN stack that supports your virtual machine. As long as healthy instances remain, the measurement follows the same path as your application's load-balanced traffic. The data path that your customer's use is also validated. The measurement is invisible to your application and doesn't interfere with other operations. | Average |

> [!NOTE]
> Bandwidth-related metrics such as SYN packet, byte count, and packet count doesn't capture any traffic to an internal load balancer by using a UDR, such as from an NVA or firewall.
>
> Max and min aggregations are not available for the SYN count, packet count, SNAT connection count, and byte count metrics.
> Count aggregation is not recommended for Data path availability and health probe status. Use average instead for best represented health data.

[!INCLUDE [horz-monitor-ref-metrics-dimensions-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-dimensions-intro.md)]

[!INCLUDE [horz-monitor-ref-metrics-dimensions](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-dimensions.md)]

| Dimension | Name | Description |
|:----------|:-----|:------------|
| BackendIPAddress  | Backend IP       | The backend IP address of one or more relevant load balancing rules |
| BackendPort       | Backend Port     | The backend port of one or more relevant load balancing rules |
| BackendRegion     | | |
| ConnectionState   | Connection state | The state of SNAT connection. The state can be pending, successful, or failed |
| Direction         | Direction        | The direction traffic is flowing. This value can be inbound or outbound. |
| FrontendIPAddress | Frontend IP      | The frontend IP address of one or more relevant load balancing rules |
| FrontendPort      | Frontend Port    | The frontend port of one or more relevant load balancing rules |
| FrontendRegion    |                  | |
| IsAwaitingRemoval |                  | |
| ProtocolType      | Protocol Type    | The protocol of the relevant load balancing rule. The protocol can be TCP or UDP |

[!INCLUDE [horz-monitor-ref-resource-logs](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-resource-logs.md)]

### Supported resource logs for Microsoft.Network/loadBalancers

[!INCLUDE [<ResourceType/namespace>](~/reusable-content/ce-skilling/azure/includes/azure-monitor/reference/logs/microsoft-network-loadbalancers-logs-include.md)]

[!INCLUDE [horz-monitor-ref-logs-tables](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-logs-tables.md)]

### Load Balancer Microsoft.Network/LoadBalancers

- [ALBHealthEvent](/azure/azure-monitor/reference/tables/albhealthevent#columns)
- [AzureActivity](/azure/azure-monitor/reference/tables/azureactivity#columns)

[!INCLUDE [horz-monitor-ref-activity-log](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-activity-log.md)]

- [Microsoft.Network resource provider operations](/azure/role-based-access-control/resource-provider-operations#microsoftnetwork)

## Related content

- See [Monitor Azure Load Balancer](monitor-load-balancer.md) for a description of monitoring Load Balancer.
- See [Monitor Azure resources with Azure Monitor](/azure/azure-monitor/essentials/monitor-azure-resource) for details on monitoring Azure resources.

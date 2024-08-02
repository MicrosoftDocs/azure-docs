---
title: Monitoring data reference for Azure NAT Gateway
description: This article contains important reference material you need when you monitor Azure NAT Gateway by using Azure Monitor.
ms.date: 08/06/2024
ms.custom: horz-monitor
ms.topic: reference
author: asudbring
ms.author: allensu
ms.service: nat-gateway
---
# Azure NAT Gateway monitoring data reference

[!INCLUDE [horz-monitor-ref-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-intro.md)]

See [Monitor Azure NAT Gateway](monitor-monitor-nat-gateway.md) for details on the data you can collect for Azure NAT Gateway and how to use it.

[!INCLUDE [horz-monitor-ref-metrics-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-intro.md)]

### Supported metrics for Microsoft.Network/natgateways

The following table lists the metrics available for the Microsoft.Network/natgateways resource type.

[!INCLUDE [horz-monitor-ref-metrics-tableheader](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-tableheader.md)]

[!INCLUDE [Microsoft.Network/natgateways](~/reusable-content/ce-skilling/azure/includes/azure-monitor/reference/metrics/microsoft-network-natgateways-metrics-include.md)]

> [!NOTE]
> Count aggregation is not recommended for any of the NAT gateway metrics. Count aggregation adds up the number of metric values and not the metric values themselves. Use Total aggregation instead to get the best representation of data values for connection count, bytes, and packets metrics.
>
> Use Average for best represented health data for the datapath availability metric.
>
> For information about aggregation types, see [aggregation types](/azure/azure-monitor/essentials/metrics-aggregation-explained#aggregation-types).

## How to use NAT gateway metrics

The following sections detail how to use each NAT gateway metric to monitor, manage, and troubleshoot your NAT gateway resource.

### Bytes

The **Bytes** metric shows you the amount of data going outbound through NAT gateway and returning inbound in response to an outbound connection. 

Use this metric to:

- View the amount of data being processed through NAT gateway to connect outbound or return inbound.

### Datapath availability

The datapath availability metric measures the health of the NAT gateway resource over time. This metric indicates if NAT gateway is available for directing outbound traffic to the internet. This metric is a reflection of the health of the Azure infrastructure.

You can use this metric to:

- Monitor the availability of NAT gateway.
- Investigate the platform where your NAT gateway is deployed and determine if it’s healthy.
- Isolate whether an event is related to your NAT gateway or to the underlying data plane.

Possible reasons for a drop in data path availability include:

- An infrastructure outage.
- There aren't healthy VMs available in your NAT gateway configured subnet. For more information, see the [NAT gateway connectivity troubleshooting guide](/azure/nat-gateway/troubleshoot-nat-connectivity).

### Packets

The packets metric shows you the number of data packets passing through NAT gateway. 

Use this metric to:
  
- Verify that traffic is passing outbound or returning inbound through NAT gateway.
- View the amount of traffic going outbound through NAT gateway or returning inbound.

### Dropped packets

The dropped packets metric shows you the number of data packets dropped by NAT gateway when traffic goes outbound or returns inbound in response to an outbound connection.

Use this metric to:

- Check if periods of dropped packets coincide with periods of failed SNAT connections with the [SNAT Connection Count](#snat-connection-count) metric.
- Help determine if you're experiencing a pattern of failed outbound connections or SNAT port exhaustion.

Possible reasons for dropped packets:

- Outbound connectivity failure can cause packets to drop. Connectivity failure can happen for various reasons. See the [NAT gateway connectivity troubleshooting guide](/azure/nat-gateway/troubleshoot-nat-connectivity) to help you further diagnose. 

### SNAT connection count

The SNAT connection count metric shows you the number of new SNAT connections within a specified time frame. This metric can be filtered by **Attempted** and **Failed** connection states. A failed connection volume greater than zero can indicate SNAT port exhaustion.

Use this metric to:

- Evaluate the health of your outbound connections.
- Help diagnose if your NAT gateway is experiencing SNAT port exhaustion.
- Determine if you're experiencing a pattern of failed outbound connections.

### Total SNAT connection count

The **Total SNAT connection count** metric shows you the total number of active SNAT connections passing through NAT gateway.

You can use this metric to:

- Evaluate the volume of connections passing through NAT gateway.
- Determine if you're nearing the connection limit of NAT gateway.
- Help assess if you're experiencing a pattern of failed outbound connections. 

Possible reasons for failed connections:

- A pattern of failed connections can happen for various reasons. See the [NAT gateway connectivity troubleshooting guide](/azure/nat-gateway/troubleshoot-nat-connectivity) to help you further diagnose.

>[!NOTE]
> When NAT gateway is attached to a subnet and public IP address, the Azure platform verifies NAT gateway is healthy by conducting health checks. These health checks appear in NAT gateway's SNAT Connection Count metrics. The amount of health check related connections may vary as the health check service is optimized, but is negligible and doesn’t impact NAT gateway’s ability to connect outbound.

[!INCLUDE [horz-monitor-ref-metrics-dimensions-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-dimensions-intro.md)]

[!INCLUDE [horz-monitor-ref-metrics-dimensions](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-dimensions.md)]

- ConnectionState: Attempted, Failed
- Direction: In, Out
- Protocol: 6 TCP, 17 UDP

[!INCLUDE [horz-monitor-ref-activity-log](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-activity-log.md)]

- [Microsoft.Network resource provider operations](/azure/role-based-access-control/resource-provider-operations#microsoftnetwork)

## Related content

- See [Monitor Azure NAT Gateway](monitor-nat-gateway.md) for a description of monitoring Azure NAT Gateway.
- See [Monitor Azure resources with Azure Monitor](/azure/azure-monitor/essentials/monitor-azure-resource) for details on monitoring Azure resources.

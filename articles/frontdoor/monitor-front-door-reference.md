---
title: Monitoring data reference for Azure Front Door
description: This article contains important reference material you need when you monitor Azure Front Door by using Azure Monitor.
ms.date: 01/21/2025
ms.custom: horz-monitor
ms.topic: reference
author: duongau
ms.author: duau
ms.service: azure-frontdoor
zone_pivot_groups: front-door-tiers
#customer intent: As the engineer responsible for my team's Azure Front Door configuration, I want to find the elements of Azure Monitor for the service, including metrics and logs.
---

# Azure Front Door monitoring data reference

[!INCLUDE [horz-monitor-ref-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-intro.md)]

See [Monitor Azure Front Door](monitor-front-door.md) for details on the data you can collect for Azure Front Door and how to use it.

[!INCLUDE [horz-monitor-ref-metrics-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-intro.md)]

::: zone pivot="front-door-classic"

[!INCLUDE [Azure Front Door (classic) retirement notice](../../includes/front-door-classic-retirement.md)]

::: zone-end

::: zone pivot="front-door-classic"

### Supported metrics for Microsoft.Network/frontdoors

The following table lists the metrics available for the Microsoft.Network/frontdoors resource type.

[!INCLUDE [horz-monitor-ref-metrics-tableheader](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-tableheader.md)]

[!INCLUDE [Microsoft.Network/frontdoors](~/reusable-content/ce-skilling/azure/includes/azure-monitor/reference/metrics/microsoft-network-frontdoors-metrics-include.md)]

::: zone-end

::: zone pivot="front-door-standard-premium"

### Supported metrics for Microsoft.Cdn/profiles

The following table lists the metrics available for the Microsoft.Cdn/profiles resource type.

[!INCLUDE [horz-monitor-ref-metrics-tableheader](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-tableheader.md)]

[!INCLUDE [Microsoft.Cdn/profiles](~/reusable-content/ce-skilling/azure/includes/azure-monitor/reference/metrics/microsoft-cdn-profiles-metrics-include.md)]

> [!NOTE]
> The metrics are recorded and stored free of charge for a limited period of time. For an extra cost, you can store for a longer period of time.

The following table provides more detailed descriptions for the metrics. 

| Metrics | Description |
|:--|:--|
| Byte Hit Ratio | The percentage of traffic that was served from the Azure Front Door cache, computed against the total egress traffic. The byte hit ratio is  low if most of the traffic is forwarded to the origin rather than served from the cache. <br/><br/> **Byte Hit Ratio** = (egress from edge - egress from origin)/egress from edge. <br/><br/> Scenarios excluded from bytes hit ratio calculations:<ul><li>You explicitly disable caching, either through the Rules Engine or query string caching behavior.</li><li>You explicitly configure a `Cache-Control` directive with the `no-store` or `private` cache directives.</li></ul> |
| Origin Health Percentage | The percentage of successful health probes sent from Azure Front Door to origins. |
| Origin Latency | Azure Front Door calculates the time from sending the request to the origin to receiving the last response byte from the origin. WebSocket is excluded from the origin latency.|
| Origin Request Count | The number of requests sent from Azure Front Door to origins. |
| Percentage of 4XX | The percentage of all the client requests for which the response status code is 4XX. |
| Percentage of 5XX | The percentage of all the client requests for which the response status code is 5XX. |
| Request Count | The number of client requests served through Azure Front Door, including requests served entirely from the cache. |
| Request Size | The number of bytes sent in requests from clients to Azure Front Door. |
| Response Size | The number of bytes sent as responses from Front Door to clients. |
| Total Latency | Azure Front Door receives the client request and sends the last response byte to the client. This value is the total time taken. For WebSocket, this metric refers to the time it takes to establish the WebSocket connection. |
| Web Application Firewall Request Count | The number of requests processed by the Azure Front Door web application firewall. |

> [!NOTE]
> If a request to the origin times out, the value of the *Http Status* dimension is **0**.

::: zone-end

[!INCLUDE [horz-monitor-ref-metrics-dimensions-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-dimensions-intro.md)]

[!INCLUDE [horz-monitor-ref-metrics-dimensions](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-dimensions.md)]

::: zone pivot="front-door-classic"

- Action
- Backend
- BackendPool
- ClientCountry
- ClientRegion
- HttpStatus
- HttpStatusGroup
- PolicyName
- RuleName

::: zone-end

::: zone pivot="front-door-standard-premium"

- Action
- ClientCountry
- ClientRegion
- Endpoint
- HttpStatus
- HttpStatusGroup
- Origin
- OriginGroup
- PolicyName
- RuleName

::: zone-end

[!INCLUDE [horz-monitor-ref-resource-logs](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-resource-logs.md)]

::: zone pivot="front-door-classic"

### Supported resource logs for Microsoft.Network/frontdoors

[!INCLUDE [Microsoft.Network/frontdoors](~/reusable-content/ce-skilling/azure/includes/azure-monitor/reference/logs/microsoft-network-frontdoors-logs-include.md)]

::: zone-end

::: zone pivot="front-door-standard-premium"

### Supported resource logs for Microsoft.Cdn/profiles

[!INCLUDE [Microsoft.Cdn/profiles](~/reusable-content/ce-skilling/azure/includes/azure-monitor/reference/logs/microsoft-cdn-profiles-logs-include.md)]

### Supported resource logs for Microsoft.Cdn/profiles/endpoints

[!INCLUDE [Microsoft.Cdn/profiles/endpoints](~/reusable-content/ce-skilling/azure/includes/azure-monitor/reference/logs/microsoft-cdn-profiles-endpoints-logs-include.md)]

::: zone-end

[!INCLUDE [horz-monitor-ref-logs-tables](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-logs-tables.md)]

::: zone pivot="front-door-classic"

### Azure Front Door Microsoft.Network/frontdoors

- [AzureActivity](/azure/azure-monitor/reference/tables/azureactivity#columns)
- [AzureMetrics](/azure/azure-monitor/reference/tables/azuremetrics#columns)
- [AzureDiagnostics](/azure/azure-monitor/reference/tables/azurediagnostics#columns)

::: zone-end

::: zone pivot="front-door-standard-premium"

### Azure Front Door Microsoft.Cdn/profiles

- [AzureActivity](/azure/azure-monitor/reference/tables/azureactivity#columns)
- [AzureDiagnostics](/azure/azure-monitor/reference/tables/azurediagnostics#columns)

::: zone-end

[!INCLUDE [horz-monitor-ref-activity-log](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-activity-log.md)]

::: zone pivot="front-door-classic"

- [Microsoft.Network resource provider operations](/azure/role-based-access-control/resource-provider-operations#microsoftnetwork)

::: zone-end

::: zone pivot="front-door-standard-premium"

- [Microsoft.Cdn resource provider operations](/azure/role-based-access-control/resource-provider-operations#networking)

::: zone-end

## Related content

- See [Monitor Azure Front Door](monitor-front-door.md) for a description of monitoring Azure Front Door.
- See [Monitor Azure resources with Azure Monitor](/azure/azure-monitor/essentials/monitor-azure-resource) for details on monitoring Azure resources.

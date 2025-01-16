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
---

# Azure Front Door monitoring data reference

[!INCLUDE [horz-monitor-ref-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-intro.md)]

See [Monitor Azure Front Door](monitor-front-door.md) for details on the data you can collect for Azure Front Door and how to use it.

[!INCLUDE [horz-monitor-ref-metrics-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-intro.md)]

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

<!-- ## Log tables -->
[!INCLUDE [horz-monitor-ref-logs-tables](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-logs-tables.md)]

<!-- Repeat the following section for each resource type/namespace in your service. Find the table(s) for your service at https://learn.microsoft.com/azure/azure-monitor/reference/tables-index. 
Replace the <ResourceType/namespace> and tablename placeholders with the namespace name. -->

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

::: zone pivot="front-door-classic"

## Activity log

[!INCLUDE [horz-monitor-ref-activity-log](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-activity-log.md)]

- [Microsoft.Network resource provider operations](/azure/role-based-access-control/resource-provider-operations#microsoftnetwork)

::: zone-end

::: zone pivot="front-door-standard-premium"

- [Microsoft.Cdn resource provider operations](/azure/role-based-access-control/resource-provider-operations#networking)

::: zone-end

## Related content

- See [Monitor Azure Front Door](monitor-front-door.md) for a description of monitoring Azure Front Door.
- See [Monitor Azure resources with Azure Monitor](/azure/azure-monitor/essentials/monitor-azure-resource) for details on monitoring Azure resources.

---
title: Monitor Azure DDoS Protection monitoring data reference
description: This article contains important reference material you need when you monitor Azure DDoS Protection by using Azure Monitor.
ms.date: 03/17/2025
ms.custom: horz-monitor
ms.topic: reference
author: AbdullahBell
ms.author: abell
ms.service: azure-ddos-protection
# Customer intent: As a network administrator, I want to monitor Azure DDoS Protection metrics and logs, so that I can effectively manage traffic and identify potential threats to ensure the security and performance of my network.
---

# Azure DDoS Protection monitoring data reference

[!INCLUDE [horz-monitor-ref-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-intro.md)]

See [Monitor Azure DDoS Protection](monitor-ddos-protection.md) for details on the data you can collect for Azure DDoS Protection and how to use it.

[!INCLUDE [horz-monitor-ref-metrics-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-intro.md)]

### Supported metrics for Microsoft.Network/publicIPAddresses

The following table lists the metrics available for the Microsoft.Network/publicIPAddresses resource type.

[!INCLUDE [horz-monitor-ref-metrics-tableheader](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-tableheader.md)]

[!INCLUDE [Microsoft.Network/publicIPAddresses](~/reusable-content/ce-skilling/azure/includes/azure-monitor/reference/metrics/microsoft-network-publicipaddresses-metrics-include.md)]

The metric names present different packet types, and bytes vs. packets, with a basic construct of tag names on each metric as follows:

- **Dropped tag name** (for example, **Inbound Packets Dropped DDoS**): The number of packets dropped/scrubbed by the DDoS protection system.

- **Forwarded tag name** (for example **Inbound Packets Forwarded DDoS**): The number of packets forwarded by the DDoS system to the destination VIP – traffic that wasn't filtered.

- **No tag name** (for example **Inbound Packets DDoS**): The total number of packets that came into the scrubbing system – representing the sum of the packets dropped and forwarded.

> [!NOTE]
> While multiple options for **Aggregation** are displayed on Azure portal, only the aggregation types listed in the table are supported for each metric. We apologize for this confusion and we are working to resolve it.

[!INCLUDE [horz-monitor-ref-metrics-dimensions-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-dimensions-intro.md)]

[!INCLUDE [horz-monitor-ref-metrics-dimensions](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-dimensions.md)]

- Direction
- Port

[!INCLUDE [horz-monitor-ref-resource-logs](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-resource-logs.md)]

### Supported resource logs for Microsoft.Network/publicIPAddresses

[!INCLUDE [Microsoft.Network/publicIPAddresses](~/reusable-content/ce-skilling/azure/includes/azure-monitor/reference/logs/microsoft-network-publicipaddresses-logs-include.md)]

[!INCLUDE [horz-monitor-ref-logs-tables](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-logs-tables.md)]

### Azure DDoS Protection Microsoft.Network/publicIPAddresses

- [AzureActivity](/azure/azure-monitor/reference/tables/azureactivity#columns)
- [AzureMetrics](/azure/azure-monitor/reference/tables/azuremetrics#columns)
- [AzureDiagnostics](/azure/azure-monitor/reference/tables/azurediagnostics#columns)

[!INCLUDE [horz-monitor-ref-activity-log](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-activity-log.md)]

- [Microsoft.Network resource provider operations](/azure/role-based-access-control/resource-provider-operations#microsoftnetwork)

## Related content

- See [Monitor Azure DDoS Protection](monitor-ddos-protection.md) for a description of monitoring Azure DDoS Protection.
- See [Monitor Azure resources with Azure Monitor](/azure/azure-monitor/essentials/monitor-azure-resource) for details on monitoring Azure resources.

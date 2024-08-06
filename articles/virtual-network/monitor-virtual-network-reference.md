---
title: Monitoring data reference for Azure Virtual Network
description: This article contains important reference material you need when you monitor Azure Virtual Network by using Azure Monitor.
ms.date: 07/21/2024
ms.custom: horz-monitor
ms.topic: reference
author: asudbring
ms.author: allensu
ms.service: virtual-network
---

# Azure Virtual Network monitoring data reference

[!INCLUDE [horz-monitor-ref-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-intro.md)]

See [Monitor Azure Virtual Network](monitor-virtual-network.md) for details on the data you can collect for Virtual Network and how to use it.

[!INCLUDE [horz-monitor-ref-metrics-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-intro.md)]

### Supported metrics for Microsoft.Network/virtualNetworks

The following table lists the metrics available for the Microsoft.Network/virtualNetworks resource type.

[!INCLUDE [horz-monitor-ref-metrics-tableheader](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-tableheader.md)]

[!INCLUDE [Microsoft.Network/virtualNetworks](~/reusable-content/ce-skilling/azure/includes/azure-monitor/reference/metrics/microsoft-network-virtualnetworks-metrics-include.md)]

### Supported metrics for Microsoft.Network/networkInterfaces

The following table lists the metrics available for the Microsoft.Network/networkInterfaces resource type.

[!INCLUDE [horz-monitor-ref-metrics-tableheader](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-tableheader.md)]

[!INCLUDE [Microsoft.Network/networkInterfaces](~/reusable-content/ce-skilling/azure/includes/azure-monitor/reference/metrics/microsoft-network-networkinterfaces-metrics-include.md)]

### Supported metrics for Microsoft.Network/publicIPAddresses

The following table lists the metrics available for the Microsoft.Network/publicIPAddresses resource type.

[!INCLUDE [horz-monitor-ref-metrics-tableheader](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-tableheader.md)]

[!INCLUDE [Microsoft.Network/publicIPAddresses](~/reusable-content/ce-skilling/azure/includes/azure-monitor/reference/metrics/microsoft-network-publicipaddresses-metrics-include.md)]

### Supported metrics for Microsoft.Network/natGateways

The following table lists the metrics available for the Microsoft.Network/natGateways resource type.

[!INCLUDE [horz-monitor-ref-metrics-tableheader](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-tableheader.md)]

[!INCLUDE [Microsoft.Network/natGateways](~/reusable-content/ce-skilling/azure/includes/azure-monitor/reference/metrics/microsoft-network-natgateways-metrics-include.md)]

[!INCLUDE [horz-monitor-ref-metrics-dimensions-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-dimensions-intro.md)]

[!INCLUDE [horz-monitor-ref-metrics-dimensions](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-dimensions.md)]

Dimensions for Microsoft.Network/virtualNetworks:

| Dimension name | Description |
|:---------------|:------------|
| DestinationCustomerAddress | |
| ProtectedIPAddress         | |
| SourceCustomerAddress      | |

Dimensions for Microsoft.Network/networkInterfaces:

None.

Dimensions for Microsoft.Network/publicIPAddresses:

| Dimension name | Description |
|:---------------|:------------|
| Direction | |
| Port      | |

Dimensions for Microsoft.Network/natGateways:

| Dimension name | Description |
|:---------------|:------------|
| Direction | The direction of traffic flow. The supported values are `In` and `Out`. |
| Protocol  | The type of transport protocol. The supported values are `TCP` and `UDP`. |
| ConnectionState | |

[!INCLUDE [horz-monitor-ref-resource-logs](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-resource-logs.md)]

### Supported resource logs for Microsoft.Network/networksecuritygroups

[!INCLUDE [Microsoft.Network/networksecuritygroups](~/reusable-content/ce-skilling/azure/includes/azure-monitor/reference/logs/microsoft-network-networksecuritygroups-logs-include.md)]

### Supported resource logs for Microsoft.Network/publicIPAddresses

[!INCLUDE [Microsoft.Network/publicIPAddresses](~/reusable-content/ce-skilling/azure/includes/azure-monitor/reference/logs/microsoft-network-publicipaddresses-logs-include.md)]

### Supported resource logs for Microsoft.Network/virtualNetworks

[!INCLUDE [Microsoft.Network/virtualNetworks](~/reusable-content/ce-skilling/azure/includes/azure-monitor/reference/logs/microsoft-network-virtualnetworks-logs-include.md)]

[!INCLUDE [horz-monitor-ref-logs-tables](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-logs-tables.md)]

### Virtual Network Microsoft.Network/virtualNetworks

- [AzureActivity](/azure/azure-monitor/reference/tables/azureactivity#columns)
- [AzureMetrics](/azure/azure-monitor/reference/tables/azuremetrics#columns)
- [AzureDiagnostics](/azure/azure-monitor/reference/tables/azurediagnostics#columns)

### Virtual Network Microsoft.Network/networkinterfaces

- [AzureActivity](/azure/azure-monitor/reference/tables/azureactivity#columns)
- [AzureMetrics](/azure/azure-monitor/reference/tables/azuremetrics#columns)
- [AzureDiagnostics](/azure/azure-monitor/reference/tables/azurediagnostics#columns)

### Virtual Network Microsoft.Network/PublicIpAddresses

- [AzureActivity](/azure/azure-monitor/reference/tables/azureactivity#columns)
- [AzureMetrics](/azure/azure-monitor/reference/tables/azuremetrics#columns)
- [AzureDiagnostics](/azure/azure-monitor/reference/tables/azurediagnostics#columns)

[!INCLUDE [horz-monitor-ref-activity-log](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-activity-log.md)]

- [Microsoft.Network resource provider operations](/azure/role-based-access-control/resource-provider-operations#microsoftnetwork)

The following table lists the operations related to Azure virtual network that might be created in the Activity log.

| Operation | Description |
|:----------|:------------|
| All administrative operations    | All administrative operations including create, update, and delete of an Azure virtual network. |
| Create or update virtual network | A virtual network was created or updated. |
| Deletes virtual network          | A virtual network was deleted.|

## Related content

- See [Monitor Azure Virtual Network](monitor-virtual-network.md) for a description of monitoring Virtual Network.
- See [Monitor Azure resources with Azure Monitor](/azure/azure-monitor/essentials/monitor-azure-resource) for details on monitoring Azure resources.

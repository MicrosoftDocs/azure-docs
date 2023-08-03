---
title: Monitoring Azure virtual network data reference 
description: Important reference material needed when you monitor Azure virtual network 
author: asudbring
ms.topic: reference
ms.author: allensu
ms.service: expressroute
ms.custom: subject-monitoring
ms.date: 06/29/2021
---

# Monitoring Azure virtual network data reference

See [Monitoring Azure virtual network](monitor-virtual-network.md) for details on collecting and analyzing monitoring data for Azure virtual networks.

## Metrics

This section lists all the automatically collected platform metrics collected for Azure virtual network.  

| Metric Type | Resource Provider / Type Namespace<br/> and link to individual metrics |
|-------|-----|
| Virtual network | [Microsoft.Network/virtualNetworks](../azure-monitor/essentials/metrics-supported.md#microsoftnetworkvirtualnetworks) |
| Network interface | [Microsoft.Network/networkInterfaces](../azure-monitor/essentials/metrics-supported.md#microsoftnetworknetworkinterfaces) |
| Public IP address | [Microsoft.Network/publicIPAddresses](../azure-monitor/essentials/metrics-supported.md#microsoftnetworkpublicipaddresses) |
| NAT gateways | [Microsoft.Network/natGateways](../azure-monitor/essentials/metrics-supported.md#microsoftnetworkpublicipaddresses)

For more information, see a list of [all platform metrics supported in Azure Monitor](../azure-monitor/essentials/metrics-supported.md).

## Metric dimensions

For more information on what metric dimensions are, see [Multi-dimensional metrics](../azure-monitor/essentials/data-platform-metrics.md#multi-dimensional-metrics).

Azure virtual network has the following dimensions associated with its metrics.

### Dimensions for NAT gateway

| Dimension Name | Description |
| ------------------- | ----------------- |
| **Direction (Out - In)** | The direction of traffic flow. The supported values are In and Out. |
| **Protocol** | The type of transport protocol. The supported values are TCP and UDP. |

## Resource logs

This section lists the types of resource logs you can collect for resources used with Azure virtual network. 

For reference, see a list of [all resource logs category types supported in Azure Monitor](../azure-monitor/essentials/resource-logs-schema.md).

|Resource Log Type | Resource Provider / Type Namespace<br/> and link to individual metrics |
|-------|-----|
| Network security group | [Microsoft.Network/networksecuritygroups](../azure-monitor/essentials/resource-logs-categories.md#microsoftnetworknetworksecuritygroups) |
| Public IP address | [Microsoft.Network/publicIPAddresses](../azure-monitor/essentials/resource-logs-categories.md#microsoftnetworkpublicipaddresses) |

## Azure Monitor logs tables

This section refers to all of the Azure Monitor Logs Kusto tables relevant to Azure virtual network and available for query by Log Analytics. 

|Resource Type | Notes |
|-------|-----|
| Virtual network | [Microsoft.Network/virtualNetworks](/azure/azure-monitor/reference/tables/tables-resourcetype#virtual-networks) |
| Network interface | [Microsoft.Network/networkInterface](/azure/azure-monitor/reference/tables/tables-resourcetype#network-interfaces) |
| Public IP address | [Microsoft.Network/publicIP](/azure/azure-monitor/reference/tables/tables-resourcetype#public-ip-addresses) |

### Diagnostics tables

**Virtual network**

Azure virtual network doesn't have diagnostic logs.

## Activity log

The following table lists the operations related to Azure virtual network that may be created in the Activity log.

| Operation | Description |
|:---|:---|
| All administrative operations | All administrative operations including create, update and delete of an Azure virtual network. |
| Create or update virtual network | A virtual network was created or updated. |
| Deletes virtual network | A virtual network was deleted.|

For more information on the schema of Activity Log entries, see [Activity Log schema](../azure-monitor/essentials/activity-log-schema.md).

## See also

- See [Monitoring Azure virtual network](monitor-virtual-network.md) for a description of monitoring Azure virtual network.
- See [Monitoring Azure resources with Azure Monitor](../azure-monitor/essentials/monitor-azure-resource.md) for details on monitoring Azure resources.

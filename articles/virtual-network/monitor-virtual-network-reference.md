---
title: Monitoring Azure virtual networks data reference 
description: Important reference material needed when you monitor Azure virtual networks 
author: duongau
ms.topic: reference
ms.author: duau
ms.service: expressroute
ms.custom: subject-monitoring
ms.date: 06/30/2021
---

# Monitoring Azure virtual network data reference

See [Monitoring Azure virtual networks](monitor-virtual-network.md) for details on collecting and analyzing monitoring data for Azure virtual networks.

## Metrics

This section lists all the automatically collected platform metrics collected for Azure virtual network.  

| Metric Type | Resource Provider / Type Namespace<br/> and link to individual metrics |
|-------|-----|
| Virtual Networks | [Microsoft.Network/virtualNetworks](../azure-monitor/essentials/metrics-supported.md#microsoftnetworkvirtualnetworks) |
| Network Interfaces | [Microsoft.Network/networkInterfaces](../azure-monitor/essentials/metrics-supported.md#microsoftnetworknetworkinterfaces) |
| Public IP Address | [Microsoft.Network/publicIPAddresses](../azure-monitor/essentials/metrics-supported.md#microsoftnetworkpublicipaddresses) |
| NAT Gateways | [Microsoft.Network/natGateways](../azure-monitor/essentials/metrics-supported.md#microsoftnetworkpublicipaddresses)

For more information, see a list of [all platform metrics supported in Azure Monitor](../azure-monitor/essentials/metrics-supported.md).

## Metric Dimensions

For more information on what metric dimensions are, see [Multi-dimensional metrics](../azure-monitor/essentials/data-platform-metrics.md#multi-dimensional-metrics).


Azure virtual network has the following dimensions associated with its metrics.

### Dimensions for virtual network

| Dimension Name | Description |
| ------------------- | ----------------- |
| **DestinationAddress** |      |
| **SourceAddress** |     |
| **Protected IP Address** |        |

### Dimensions for NAT Gateway

| Dimension Name | Description |
| ------------------- | ----------------- |
| **Direction (Out - In)** |  |
| **Protocol** |  |

## Resource logs

Azure virtual network doesn't have any resource logs.

## Azure Monitor Logs tables

This section refers to all of the Azure Monitor Logs Kusto tables relevant to Azure virtual network and available for query by Log Analytics. 

|Resource Type | Notes |
|-------|-----|
| Virtual network | [Microsoft.Network/virtualNetworks](../azure-monitor/reference/tables/tables-resourcetype.md#virtual-networks) |
| Network interface | [Microsoft.Network/networkInterface](..//azure-monitor/reference/tables/tables-resourcetype.md#network-interfaces) |
| Public IP addresses | [Microsoft.Network/publicIP](../azure-monitor/reference/tables/tables-resourcetype.md#public-ip-addresses) |

### Diagnostics tables

Azure virtual network does not have diagnostic logs.

## Activity log

The following table lists the operations related to Azure virtual network that may be created in the Activity log.

| Operation | Description |
|:---|:---|
| All Administrative operations | All administrative operations including create, update and delete of an Azure virtual network. |
| Create or update virtual network | A virtual network was created or updated. |
| Deletes virtual network | A virtual network was deleted.|

For more information on the schema of Activity Log entries, see [Activity  Log schema](/azure/azure-monitor/essentials/activity-log-schema). 

## Schemas
<!-- REQUIRED. Please keep heading in this order -->

The following schemas are in use by Azure virtual network

<!-- List the schema and their usage. This can be for resource logs, alerts, event hub formats, etc depending on what you think is important. -->

## See Also

- See [Monitoring Azure Azure virtual network](monitor-virtual-network.md) for a description of monitoring Azure Azure virtual network.
- See [Monitoring Azure resources with Azure Monitor](../azure-monitor/essentials/monitor-azure-resource.md) for details on monitoring Azure resources.

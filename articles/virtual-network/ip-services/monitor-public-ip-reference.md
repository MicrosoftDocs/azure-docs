---
title: Monitoring Public IP addresses data reference
titleSuffix: Azure Virtual Network
description: Important reference material needed when you monitor Public IP addresses 
author: mbender-ms
ms.author: mbender
ms.date: 08/24/2023
ms.topic: reference
ms.service: virtual-network
ms.subservice: ip-services
ms.custom: subject-monitoring
---

# Monitoring Public IP addresses data reference

See [Monitoring Public IP address](monitor-public-ip.md) for details on collecting and analyzing monitoring data for Public IP addresses.

## Metrics

This section lists all the automatically collected platform metrics collected for Public IP addresses.  

|Metric Type | Resource Provider / Type Namespace<br/> and link to individual metrics |
|-------|-----|
| Public IP Addresses | [Microsoft.Network/publicIPAddresses](/azure/azure-monitor/platform/metrics-supported#microsoftnetworkpublicipaddresses) |

For more information, see a list of [all platform metrics supported in Azure Monitor](/azure/azure-monitor/platform/metrics-supported).

## Metric Dimensions

For more information on what metric dimensions are, see [Multi-dimensional metrics](/azure/azure-monitor/platform/data-platform-metrics#multi-dimensional-metrics).

Public IP Addresses have the following dimensions associated with its metrics.

| Dimension Name | Description |
| ------------------- | ----------------- |
| **Port** | The port of the traffic. |
| **Direction** | The direction of the traffic, inbound or outbound. |

## Resource logs

This section lists the types of resource logs you can collect for Public IP addresses. 

For reference, see a list of [all resource logs category types supported in Azure Monitor](/azure/azure-monitor/platform/resource-logs-schema).

This section lists all the resource log category types collected for Public IP addresses.  

|Resource Log Type | Resource Provider / Type Namespace<br/> and link to individual metrics |
|-------|-----|
| Public IP addresses | [Microsoft.Network/publicIPAddresses](/azure/azure-monitor/platform/resource-logs-categories#microsoftnetworkpublicipaddresses) |

## Azure Monitor Logs tables

This section refers to all of the Azure Monitor Logs Kusto tables relevant to Public IP addresses and available for query by Log Analytics. 

For more information, see [Azure Monitor Logs table reference organized by resource type](/azure/azure-monitor/reference/tables/tables-resourcetype#public-ip-addresses)

## Activity log

The following table lists the operations that Public IP addresses may record in the Activity log. This is a subset of the possible entries your might find in the activity log.

| Namespace | Description |
|:---|:---|
| Microsoft.Network/publicIPAddresses/read | Gets a public ip address definition. |
| Microsoft.Network/publicIPAddresses/write | Creates a public Ip address or updates an existing public Ip address.  |
| Microsoft.Network/publicIPAddresses/delete | Deletes a public Ip address. |
| Microsoft.Network/publicIPAddresses/join/action | Joins a public ip address. Not Alertable. |
| Microsoft.Network/publicIPAddresses/dnsAliases/read | Gets a Public Ip Address Dns Alias resource |
| Microsoft.Network/publicIPAddresses/dnsAliases/write | Creates a Public Ip Address Dns Alias resource |
| Microsoft.Network/publicIPAddresses/dnsAliases/delete | Deletes a Public Ip Address Dns Alias resource |
| Microsoft.Network/publicIPAddresses/providers/Microsoft.Insights/diagnosticSettings/read | Get the diagnostic settings of Public IP Address |
| Microsoft.Network/publicIPAddresses/providers/Microsoft.Insights/diagnosticSettings/write | Create or update the diagnostic settings of Public IP Address |
| Microsoft.Network/publicIPAddresses/providers/Microsoft.Insights/logDefinitions/read | Get the log definitions of Public IP Address |
| Microsoft.Network/publicIPAddresses/providers/Microsoft.Insights/metricDefinitions/read | Get the metrics definitions of Public IP Address |

See [all the possible resource provider operations in the activity log](../../role-based-access-control/resource-provider-operations.md).  

For more information on the schema of Activity Log entries, see [Activity Log schema](../../azure-monitor/essentials/activity-log-schema.md). 

## See Also

- See [Monitoring Azure Public IP Address](monitor-public-ip.md) for a description of monitoring Azure Public IP addresses.

- See [Monitoring Azure resources with Azure Monitor](../../azure-monitor/essentials/monitor-azure-resource.md) for details on monitoring Azure resources.
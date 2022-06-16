---
title: Monitoring Public IP addresses data reference
description: Important reference material needed when you monitor Public IP addresses 
author: asudbring
ms.topic: reference
ms.author: allensu
ms.service: virtual-network
ms.custom: subject-monitoring
ms.date: 09/01/2021
---

# Monitoring Public IP Addresses data reference

See [Monitoring Public IP Address](monitor-public-ip.md) for details on collecting and analyzing monitoring data for Public IP Addresses.

## Metrics

This section lists all the automatically collected platform metrics collected for Public IP Address.  

|Metric Type | Resource Provider / Type Namespace<br/> and link to individual metrics |
|-------|-----|
| Public IP Addresses | [Microsoft.Network/publicIPAddresses](/azure/azure-monitor/platform/metrics-supported#microsoftnetworkpublicipaddresses) |

For more information, see a list of [all platform metrics supported in Azure Monitor](https://docs.microsoft.com/azure/azure-monitor/platform/metrics-supported).

## Metric Dimensions

For more information on what metric dimensions are, see [Multi-dimensional metrics](/azure/azure-monitor/platform/data-platform-metrics#multi-dimensional-metrics).

Public IP Address has the following dimensions associated with its metrics.

<!-- See https://docs.microsoft.com/azure/storage/common/monitor-storage-reference#metrics-dimensions for an example. Part is copied below. -->

**--------------EXAMPLE format when you have dimensions------------------**

Azure Storage supports following dimensions for metrics in Azure Monitor.

| Dimension Name | Description |
| ------------------- | ----------------- |
| **BlobType** | The type of blob for Blob metrics only. The supported values are **BlockBlob**, **PageBlob**, and **Azure Data Lake Storage**. Append blobs are included in **BlockBlob**. |
| **BlobTier** | Azure storage offers different access tiers, which allow you to store blob object data in the most cost-effective manner. See more in [Azure Storage blob tier](/azure/storage/blobs/storage-blob-storage-tiers). The supported values include: <br/> <li>**Hot**: Hot tier</li> <li>**Cool**: Cool tier</li> <li>**Archive**: Archive tier</li> <li>**Premium**: Premium tier for block blob</li> <li>**P4/P6/P10/P15/P20/P30/P40/P50/P60**: Tier types for premium page blob</li> <li>**Standard**: Tier type for standard page Blob</li> <li>**Untiered**: Tier type for general purpose v1 storage account</li> |
| **GeoType** | Transaction from Primary or Secondary cluster. The available values include **Primary** and **Secondary**. It applies to Read Access Geo Redundant Storage(RA-GRS) when reading objects from secondary tenant. |

## Resource logs

This section lists the types of resource logs you can collect for Public IP Address. 

For reference, see a list of [all resource logs category types supported in Azure Monitor](/azure/azure-monitor/platform/resource-logs-schema).

This section lists all the resource log category types collected for Public IP Address.  

|Resource Log Type | Resource Provider / Type Namespace<br/> and link to individual metrics |
|-------|-----|
| Public IP addresses | [Microsoft.Network/publicIPAddresses](/azure/azure-monitor/platform/resource-logs-categories#microsoftnetworkpublicipaddresses) |

## Azure Monitor Logs tables

This section refers to all of the Azure Monitor Logs Kusto tables relevant to Public IP addresses and available for query by Log Analytics. 

For more information, see [Azure Monitor Logs table reference organized by resource type](/azure/azure-monitor/reference/tables/tables-resourcetype#public-ip-addresses)

### Diagnostics tables
<!-- REQUIRED. Please keep heading in this order -->
<!-- If your service uses the AzureDiagnostics table in Azure Monitor Logs / Log Analytics, list what fields you use and what they are for. Azure Diagnostics is over 500 columns wide with all services using the fields that are consistent across Azure Monitor and then adding extra ones just for themselves.  If it uses service specific diagnostic table, refers to that table. If it uses both, put both types of information in. Most services in the future will have their own specific table. If you have questions, contact azmondocs@microsoft.com -->

Public IP Address uses the [Azure Diagnostics](/azure/azure-monitor/reference/tables/azurediagnostics) table to store resource log information. The following columns are relevant.

**Azure Diagnostics**

| Property | Description |
|:--- |:---|
|  |  |
|  |  |

## Activity log

The following table lists the operations that Public IP Addresses may record in the Activity log. This is a subset of the possible entries your might find in the activity log.

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

See [all the possible resource provider operations in the activity log](/azure/role-based-access-control/resource-provider-operations).  

For more information on the schema of Activity Log entries, see [Activity Log schema](/azure/azure-monitor/essentials/activity-log-schema). 

## See Also

- See [Monitoring Azure Public IP Address](monitor-public-ip.md) for a description of monitoring Azure Public IP Address.
- See [Monitoring Azure resources with Azure Monitor](/azure/azure-monitor/insights/monitor-azure-resources) for details on monitoring Azure resources.
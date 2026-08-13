---
title: Monitoring data reference for Azure Data Manager for Energy
description: This article contains important reference material you need when you monitor Azure Data Manager for Energy by using Azure Monitor.
author: priyabratpadhi
ms.author: ppadhi
ms.service: azure-data-manager-energy
ms.topic: reference
ms.date: 07/27/2026
ms.custom: horz-monitor-ref
---

# Azure Data Manager for Energy monitoring data reference

This article contains all the monitoring reference information for Azure Data Manager for Energy. See [Monitor Azure Data Manager for Energy](how-to-monitor-data-manager-energy.md) for details on collecting and analyzing monitoring data for this service.

## Metrics

This section lists all the automatically collected platform metrics for Azure Data Manager for Energy.

- Resource provider and type: `Microsoft.OpenEnergyPlatform/energyServices`
- Namespace: `Azure Data Manager for Energy standard metrics`

### Supported metrics

The following table lists the metrics available for Azure Data Manager for Energy.

> [!NOTE]
> Metrics marked with **(Preview)** may have limited availability, may be subject to change, and might not be covered by the same SLA as generally available features.


| Display name | Unit | Aggregation type | Description | Dimensions |
|-------------|------|-----------------|-------------|------------|
| Total HTTP Requests (Preview) | Count | Sum | Total number of HTTP requests received by the Azure Data Manager for Energy instance. | `Data Partition`, `Method`, `Response Code`, `Service` |
| Data Volume (Preview) | Bytes | Average | Total data volume stored across all data partitions on the Azure Data Manager for Energy instance. | `Data Partition`, `Tier` |

### Metric dimensions

The following table lists the [metric dimensions](/azure/azure-monitor/essentials/data-platform-metrics#multi-dimensional-metrics) for Azure Data Manager for Energy.

| Dimension name | Description |
|----------------|-------------|
| `Data Partition` | Data Partition ID | 
| `Method` | HTTP Method used in the API call |
| `Response Code` | Response code returned by the API |
| `Service` | Destination service to which the API call was made. for example, `storage`, `search`, `legal`, `entitlements`, `partition`, `schema`, `indexer`, `file` |
| `Tier` | Storage tier in which data is stored. |


## Related content

- [Monitor Azure Data Manager for Energy](how-to-monitor-data-manager-energy.md)
- [Azure Monitor metrics overview](/azure/azure-monitor/essentials/data-platform-metrics)


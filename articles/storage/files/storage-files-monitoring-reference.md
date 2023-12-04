---
title: Azure Files monitoring data reference
description: Log and metrics reference for monitoring data from Azure Files.
author: khdownie
services: storage
ms.service: azure-file-storage
ms.topic: reference
ms.date: 07/31/2023
ms.author: kendownie
ms.custom: monitoring
---

# Azure Files monitoring data reference

See [Monitoring Azure Files](storage-files-monitoring.md) for details on collecting and analyzing monitoring data for Azure Files.

## Applies to
| File share type | SMB | NFS |
|-|:-:|:-:|
| Standard file shares (GPv2), LRS/ZRS | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Standard file shares (GPv2), GRS/GZRS | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Premium file shares (FileStorage), LRS/ZRS | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) |

## Metrics

The following tables list the platform metrics collected for Azure Files. 

### Capacity metrics

Capacity metrics values are refreshed daily (up to 24 hours). The time grain defines the time interval for which metrics values are presented. The supported time grain for all capacity metrics is one hour (PT1H).

Azure Files provides the following capacity metrics in Azure Monitor.

#### Account Level

[!INCLUDE [Account level capacity metrics](../../../includes/azure-storage-account-capacity-metrics.md)]

#### Azure Files

This table shows [supported metrics for Azure Files](/azure/azure-monitor/reference/supported-metrics/microsoft-storage-storageaccounts-fileservices-metrics).

| Metric | Description |
| ------------------- | ----------------- |
| FileCapacity | The amount of File storage used by the storage account. <br/><br/> Unit: Bytes <br/> Aggregation Type: Average <br/> Dimensions: FileShare, Tier <br/> Value example: 1024 |
| FileCount | The number of files in the storage account. <br/><br/> Unit: Count <br/> Aggregation Type: Average <br/> Dimensions: FileShare, Tier <br/> Value example: 1024 |
| FileShareCapacityQuota | The upper limit on the amount of storage that can be used by Azure Files Service in bytes. <br/><br/> Unit: Bytes <br/> Aggregation Type: Average <br/> Value example: 1024|
| FileShareCount | The number of file shares in the storage account. <br/><br/> Unit: Count <br/> Aggregation Type: Average <br/> Value example: 1024 |
| FileShareProvisionedIOPS | The number of provisioned IOPS on a file share. This metric is applicable to premium file storage only. <br/><br/> Unit: CountPerSecond <br/> Aggregation Type: Average |
| FileShareProvisionedBandwidthMiBps | The baseline number of provisioned bandwidth in MiB/s for the premium file share in the premium file storage account. This number is calculated based on the provisioned size (quota) of the share capacity. <br/><br/> Unit: BytesPerSecond <br/> Aggregation Type: Average |
| FileShareSnapshotCount | The number of snapshots present on the share in storage account's Azure Files service. <br/><br/> Unit: Count <br/> Aggregation Type: Average | 
| FileShareSnapshotSize | The amount of storage used by the snapshots in storage account's Azure Files service. <br/><br/> Unit: Bytes <br/> Aggregation Type: Average |
| FileShareMaxUsedIOPS | The maximum number of used IOPS at the lowest time granularity of 1-minute for the premium file share in the premium files storage account. <br/><br/> Unit: CountPerSecond  <br/> Aggregation Type: Max |
| FileShareMaxUsedBandwidthMiBps | The maximum number of used bandwidth in MiB/s at the lowest time granularity of 1-minute for the premium file share in the premium files storage account. <br/><br/> Unit: CountPerSecond <br/> Aggregation Type: Max |

### Transaction metrics

Transaction metrics are emitted on every request to a storage account from Azure Storage to Azure Monitor. In the case of no activity on your storage account, there will be no data on transaction metrics in the period. All transaction metrics are available at both account and Azure Files service level. The time grain defines the time interval that metric values are presented. The supported time grains for all transaction metrics are PT1H and PT1M.

[!INCLUDE [Transaction metrics](../../../includes/azure-storage-account-transaction-metrics.md)]

<a id="metrics-dimensions"></a>

## Metrics dimensions

Azure Files supports following dimensions for metrics in Azure Monitor.

> [!NOTE] 
> The File Share dimension is not available for standard file shares (only premium file shares). When using standard file shares, the metrics provided are for all files shares in the storage account. To get per-share metrics for standard file shares, create one file share per storage account.

[!INCLUDE [Metrics dimensions](../../../includes/azure-storage-account-metrics-dimensions.md)]

<a id="resource-logs-preview"></a>

## Resource logs

The following table lists the properties for Azure Storage resource logs when they're collected in Azure Monitor Logs or Azure Storage. The properties describe the operation, the service, and the type of authorization that was used to perform the operation.

### Fields that describe the operation


[!INCLUDE [Account level capacity metrics](../../../includes/azure-storage-logs-properties-operation.md)]

### Fields that describe how the operation was authenticated

[!INCLUDE [Account level capacity metrics](../../../includes/azure-storage-logs-properties-authentication.md)]

### Fields that describe the service

[!INCLUDE [Account level capacity metrics](../../../includes/azure-storage-logs-properties-service.md)]

## See also

- See [Monitoring Azure Files](storage-files-monitoring-reference.md) for a description of monitoring Azure Storage.
- See [Monitoring Azure resources with Azure Monitor](../../azure-monitor/essentials/monitor-azure-resource.md) for details on monitoring Azure resources.

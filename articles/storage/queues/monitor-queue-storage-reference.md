---
title: Azure Queue Storage monitoring data reference
description: Log and metrics reference for monitoring data from Azure Queue Storage.
author: normesta
services: storage
ms.author: normesta
ms.date: 04/20/2021
ms.topic: reference
ms.service: azure-queue-storage
ms.custom: subject-monitoring
---

# Azure Queue Storage monitoring data reference

See [Monitoring Azure Storage](monitor-queue-storage.md) for details on collecting and analyzing monitoring data for Azure Storage.

## Metrics

The following tables list the platform metrics collected for Azure Storage.

### Capacity metrics

Capacity metrics values are refreshed daily (up to 24 hours). The time grain defines the time interval for which metrics values are presented. The supported time grain for all capacity metrics is one hour (PT1H).

Azure Storage provides the following capacity metrics in Azure Monitor.

#### Account-level capacity metrics

[!INCLUDE [Account-level capacity metrics](../../../includes/azure-storage-account-capacity-metrics.md)]

#### Queue Storage metrics

This table shows [Queue Storage metrics](../../azure-monitor/essentials/metrics-supported.md#microsoftstoragestorageaccountsqueueservices).

| Metric | Description |
| ------------------- | ----------------- |
| **QueueCapacity** | The amount of Queue Storage used by the storage account. <br><br> Unit: `Bytes` <br> Aggregation type: `Average` <br> Value example: `1024` |
| **QueueCount** | The number of queues in the storage account. <br><br> Unit: `Count` <br> Aggregation type: `Average` <br> Value example: `1024` |
| **QueueMessageCount** | The number of unexpired queue messages in the storage account. <br><br> Unit: `Count` <br> Aggregation type: `Average` <br> Value example: `1024` |

### Transaction metrics

Transaction metrics are emitted on every request to a storage account from Azure Storage to Azure Monitor. In the case of no activity on your storage account, there will be no data on transaction metrics in the period. All transaction metrics are available at both account and Queue Storage service level. The time grain defines the time interval that metric values are presented. The supported time grains for all transaction metrics are PT1H and PT1M.

[!INCLUDE [Transaction metrics](../../../includes/azure-storage-account-transaction-metrics.md)]

<a id="metrics-dimensions"></a>

## Metrics dimensions

Azure Storage supports following dimensions for metrics in Azure Monitor.

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

- See [Monitoring Azure Queue Storage](monitor-queue-storage.md) for a description of monitoring Azure Queue Storage.
- See [Monitoring Azure resources with Azure Monitor](../../azure-monitor/essentials/monitor-azure-resource.md) for details on monitoring Azure resources.

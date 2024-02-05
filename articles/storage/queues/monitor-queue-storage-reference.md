---
title: Monitoring data reference for Azure Queue Storage
description: This article contains important reference material you need when you monitor Azure Queue Storage.
ms.date: 02/02/2024
ms.custom: horz-monitor
ms.topic: reference
ms.service: azure-queue-storage
author: normesta
ms.author: normesta
---

# Azure Queue Storage monitoring data reference

<!-- Intro -->
[!INCLUDE [horz-monitor-ref-intro](~/articles/reusable-content/azure-monitor/horizontals/horz-monitor-ref-intro.md)]

See [Monitor Azure Files](monitor-files.md) for details on the data you can collect for Azure Files and how to use it.

<!-- ## Metrics. Required section. -->
[!INCLUDE [horz-monitor-ref-metrics-intro](~/articles/reusable-content/azure-monitor/horizontals/horz-monitor-ref-metrics-intro.md)]

### Capacity metrics

Capacity metrics values are refreshed daily (up to 24 hours). The time grain defines the time interval for which metrics values are presented. The supported time grain for all capacity metrics is one hour (PT1H).

Azure Storage provides the following capacity metrics in Azure Monitor.

#### Account-level capacity metrics

[!INCLUDE [Account-level capacity metrics](../../../includes/azure-storage-account-capacity-metrics.md)]

#### Queue Storage metrics

This table shows [Queue Storage metrics](/azure/azure-monitor/essentials/metrics-supported#microsoftstoragestorageaccountsqueueservices).

| Metric | Description |
| ------------------- | ----------------- |
| **QueueCapacity** | The amount of Queue Storage used by the storage account. <br><br> Unit: `Bytes` <br> Aggregation type: `Average` <br> Value example: `1024` |
| **QueueCount** | The number of queues in the storage account. <br><br> Unit: `Count` <br> Aggregation type: `Average` <br> Value example: `1024` |
| **QueueMessageCount** | The number of unexpired queue messages in the storage account. <br><br> Unit: `Count` <br> Aggregation type: `Average` <br> Value example: `1024` |

### Transaction metrics

Transaction metrics are emitted on every request to a storage account from Azure Storage to Azure Monitor. In the case of no activity on your storage account, there will be no data on transaction metrics in the period. All transaction metrics are available at both account and Queue Storage service level. The time grain defines the time interval that metric values are presented. The supported time grains for all transaction metrics are PT1H and PT1M.

[!INCLUDE [Transaction metrics](../../../includes/azure-storage-account-transaction-metrics.md)]

### All metrics

- [Microsoft.Storage/storageAccounts](/azure/azure-monitor/reference/supported-metrics/microsoft-storage-storageaccounts-metrics)
- [Microsoft.Storage/storageAccounts/queueServices](/azure/azure-monitor/reference/supported-metrics/microsoft-storage-storageaccounts-queueservices-metrics)

<a id="metrics-dimensions"></a>
[!INCLUDE [horz-monitor-ref-metrics-dimensions-intro](~/articles/reusable-content/azure-monitor/horizontals/horz-monitor-ref-metrics-dimensions-intro.md)]
[!INCLUDE [horz-monitor-ref-metrics-dimensions](~/articles/reusable-content/azure-monitor/horizontals/horz-monitor-ref-metrics-dimensions.md)]
[!INCLUDE [Metrics dimensions](../../../includes/azure-storage-account-metrics-dimensions.md)]

<a id="resource-logs-preview"></a>
[!INCLUDE [horz-monitor-ref-resource-logs](~/articles/reusable-content/azure-monitor/horizontals/horz-monitor-ref-resource-logs.md)]

### Supported resource logs for Microsoft.Storage/storageAccounts/queueServices
[!INCLUDE [Microsoft.Storage/storageAccounts/queueServices](~/azure-reference-other-repo/azure-monitor-ref/supported-logs/includes/microsoft-storage-storageaccounts-queueservices-logs-include.md)]

<!-- ## Azure Monitor Logs tables. Required section. -->
[!INCLUDE [horz-monitor-ref-logs-tables](~/articles/reusable-content/azure-monitor/horizontals/horz-monitor-ref-logs-tables.md)]

- [AzureActivity](/azure/azure-monitor/reference/tables/azureactivity)
- [AzureMetrics](/azure/azure-monitor/reference/tables/azuremetrics)
- [Microsoft.Storage/storageAccounts/StorageQueueLogs](/azure/azure-monitor/reference/tables/storagequeuelogs)

<!-- ## Activity log. Required section. -->
[!INCLUDE [horz-monitor-ref-activity-log](~/articles/reusable-content/azure-monitor/horizontals/horz-monitor-ref-activity-log.md)]
- [Microsoft.Storage resource provider operations](/azure/role-based-access-control/resource-provider-operations#microsoftstorage)

## Related content

- See [Monitor Azure Queue Storage](monitor-queue-storage.md) for a description of monitoring Azure Queue Storage.
- See [Monitor Azure resources with Azure Monitor](/azure/azure-monitor/essentials/monitor-azure-resource) for details on monitoring Azure resources.


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

### Supported metrics for Microsoft.Storage/storageAccounts
The following table lists the metrics available for the Microsoft.Storage/storageAccounts resource type.
[!INCLUDE [horz-monitor-ref-metrics-tableheader](~/articles/reusable-content/azure-monitor/horizontals/horz-monitor-ref-metrics-tableheader.md)]
[!INCLUDE [Microsoft.Storage/storageAccounts](~/azure-reference-other-repo/azure-monitor-ref/supported-metrics/includes/microsoft-storage-storageaccounts-metrics-include.md)]

### Supported metrics for Microsoft.Storage/storageAccounts/queueServices
The following table lists the metrics available for the Microsoft.Storage/storageAccounts/queueServices resource type.
[!INCLUDE [horz-monitor-ref-metrics-tableheader](~/articles/reusable-content/azure-monitor/horizontals/horz-monitor-ref-metrics-tableheader.md)]
[!INCLUDE [Microsoft.Storage/storageAccounts/queueServices](~/azure-reference-other-repo/azure-monitor-ref/supported-metrics/includes/microsoft-storage-storageaccounts-queueservices-metrics-include.md)]

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
- [StorageQueueLogs](/azure/azure-monitor/reference/tables/storagequeuelogs)

<!-- ## Activity log. Required section. -->
[!INCLUDE [horz-monitor-ref-activity-log](~/articles/reusable-content/azure-monitor/horizontals/horz-monitor-ref-activity-log.md)]
- [Microsoft.Storage resource provider operations](/azure/role-based-access-control/resource-provider-operations#microsoftstorage)

## Related content

- See [Monitor Azure Queue Storage](monitor-queue-storage.md) for a description of monitoring Azure Queue Storage.
- See [Monitor Azure resources with Azure Monitor](/azure/azure-monitor/essentials/monitor-azure-resource) for details on monitoring Azure resources.


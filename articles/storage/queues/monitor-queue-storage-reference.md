---
title: Monitoring data reference for Azure Queue Storage
description: This article contains important reference material you need when you monitor Azure Queue Storage.
ms.date: 02/12/2024
ms.custom: horz-monitor
ms.topic: reference
ms.service: azure-queue-storage
author: normesta
ms.author: normesta
---

# Azure Queue Storage monitoring data reference

<!-- Intro -->
[!INCLUDE [horz-monitor-ref-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-intro.md)]

See [Monitor Azure Queue Storage](monitor-queue-storage.md) for details on the data you can collect for Azure Queue Storage and how to use it.

<!-- ## Metrics. Required section. -->
[!INCLUDE [horz-monitor-ref-metrics-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-intro.md)]

### Supported metrics for Microsoft.Storage/storageAccounts
The following table lists the metrics available for the Microsoft.Storage/storageAccounts resource type.
[!INCLUDE [horz-monitor-ref-metrics-tableheader](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-tableheader.md)]
[!INCLUDE [Microsoft.Storage/storageAccounts](~/azure-reference-other-repo/azure-monitor-ref/supported-metrics/includes/microsoft-storage-storageaccounts-metrics-include.md)]

### Supported metrics for Microsoft.Storage/storageAccounts/queueServices
The following table lists the metrics available for the Microsoft.Storage/storageAccounts/queueServices resource type.
[!INCLUDE [horz-monitor-ref-metrics-tableheader](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-tableheader.md)]
[!INCLUDE [Microsoft.Storage/storageAccounts/queueServices](~/azure-reference-other-repo/azure-monitor-ref/supported-metrics/includes/microsoft-storage-storageaccounts-queueservices-metrics-include.md)]

<a id="metrics-dimensions"></a>
[!INCLUDE [horz-monitor-ref-metrics-dimensions-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-dimensions-intro.md)]
[!INCLUDE [horz-monitor-ref-metrics-dimensions](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-dimensions.md)]
[!INCLUDE [Metrics dimensions](../../../includes/azure-storage-account-metrics-dimensions.md)]

<a id="resource-logs-preview"></a>
[!INCLUDE [horz-monitor-ref-resource-logs](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-resource-logs.md)]

### Supported resource logs for Microsoft.Storage/storageAccounts/queueServices
[!INCLUDE [Microsoft.Storage/storageAccounts/queueServices](~/azure-reference-other-repo/azure-monitor-ref/supported-logs/includes/microsoft-storage-storageaccounts-queueservices-logs-include.md)]

<!-- ## Azure Monitor Logs tables. Required section. -->
[!INCLUDE [horz-monitor-ref-logs-tables](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-logs-tables.md)]

- [AzureActivity](/azure/azure-monitor/reference/tables/azureactivity)
- [AzureMetrics](/azure/azure-monitor/reference/tables/azuremetrics)
- [StorageQueueLogs](/azure/azure-monitor/reference/tables/storagequeuelogs)

The following tables list the properties for Azure Storage resource logs when they're collected in Azure Monitor Logs or Azure Storage. The properties describe the operation, the service, and the type of authorization that was used to perform the operation.

### Fields that describe the operation

[!INCLUDE [Account level capacity metrics](../../../includes/azure-storage-logs-properties-operation.md)]

### Fields that describe how the operation was authenticated

[!INCLUDE [Account level capacity metrics](../../../includes/azure-storage-logs-properties-authentication.md)]

### Fields that describe the service

[!INCLUDE [Account level capacity metrics](../../../includes/azure-storage-logs-properties-service.md)]

<!-- ## Activity log. Required section. -->
[!INCLUDE [horz-monitor-ref-activity-log](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-activity-log.md)]
- [Microsoft.Storage resource provider operations](/azure/role-based-access-control/resource-provider-operations#microsoftstorage)

## Related content

- See [Monitor Azure Queue Storage](monitor-queue-storage.md) for a description of monitoring Azure Queue Storage.
- See [Monitor Azure resources with Azure Monitor](/azure/azure-monitor/essentials/monitor-azure-resource) for details on monitoring Azure resources.


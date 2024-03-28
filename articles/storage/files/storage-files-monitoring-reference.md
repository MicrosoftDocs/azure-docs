---
title: Monitoring data reference for Azure Files
description: This article contains important reference material you need when you monitor Azure Files.
ms.date: 02/13/2024
ms.custom: horz-monitor
ms.topic: reference
author: khdownie
ms.author: kendownie
ms.service: azure-file-storage
---

# Azure Files monitoring data reference

[!INCLUDE [horz-monitor-ref-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-intro.md)]

See [Monitor Azure Files](storage-files-monitoring.md) for details on the data you can collect for Azure Files and how to use it.

## Applies to
| File share type | SMB | NFS |
|-|:-:|:-:|
| Standard file shares (GPv2), LRS/ZRS | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Standard file shares (GPv2), GRS/GZRS | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Premium file shares (FileStorage), LRS/ZRS | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) |

[!INCLUDE [horz-monitor-ref-metrics-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-intro.md)]

### Supported metrics for Microsoft.Storage/storageAccounts
The following table lists the metrics available for the Microsoft.Storage/storageAccounts resource type.
[!INCLUDE [horz-monitor-ref-metrics-tableheader](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-tableheader.md)]
[!INCLUDE [Microsoft.Storage/storageAccounts](~/azure-reference-other-repo/azure-monitor-ref/supported-metrics/includes/microsoft-storage-storageaccounts-metrics-include.md)]

### Supported metrics for Microsoft.Storage/storageAccounts/fileServices
The following table lists the metrics available for the Microsoft.Storage/storageAccounts/fileServices resource type.
[!INCLUDE [horz-monitor-ref-metrics-tableheader](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-tableheader.md)]
[!INCLUDE [Microsoft.Storage/storageAccounts/blobServices](~/azure-reference-other-repo/azure-monitor-ref/supported-metrics/includes/microsoft-storage-storageaccounts-fileservices-metrics-include.md)]

<a name="metrics-dimensions"></a>
[!INCLUDE [horz-monitor-ref-metrics-dimensions-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-dimensions-intro.md)]

[!INCLUDE [horz-monitor-ref-metrics-dimensions](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-dimensions.md)]

> [!NOTE] 
> The File Share dimension is not available for standard file shares (only premium file shares). When using standard file shares, the metrics provided are for all files shares in the storage account. To get per-share metrics for standard file shares, create one file share per storage account.

[!INCLUDE [Metrics dimensions](../../../includes/azure-storage-account-metrics-dimensions.md)]

<a name="resource-logs-preview"></a>
[!INCLUDE [horz-monitor-ref-resource-logs](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-resource-logs.md)]

### Supported resource logs for Microsoft.Storage/storageAccounts/fileServices
[!INCLUDE [Microsoft.Storage/storageAccounts/blobServices](~/azure-reference-other-repo/azure-monitor-ref/supported-logs/includes/microsoft-storage-storageaccounts-fileservices-logs-include.md)]

[!INCLUDE [horz-monitor-ref-logs-tables](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-logs-tables.md)]

- [AzureActivity](/azure/azure-monitor/reference/tables/azureactivity)
- [AzureMetrics](/azure/azure-monitor/reference/tables/azuremetrics)
- [StorageFileLogs](/azure/azure-monitor/reference/tables/storagefilelogs)

The following tables list the properties for Azure Storage resource logs when they're collected in Azure Monitor Logs or Azure Storage. The properties describe the operation, the service, and the type of authorization that was used to perform the operation.

### Fields that describe the operation

[!INCLUDE [Account level capacity metrics](../../../includes/azure-storage-logs-properties-operation.md)]

### Fields that describe how the operation was authenticated

[!INCLUDE [Account level capacity metrics](../../../includes/azure-storage-logs-properties-authentication.md)]

### Fields that describe the service

[!INCLUDE [Account level capacity metrics](../../../includes/azure-storage-logs-properties-service.md)]

[!INCLUDE [horz-monitor-ref-activity-log](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-activity-log.md)]
- [Microsoft.Storage resource provider operations](/azure/role-based-access-control/resource-provider-operations#microsoftstorage)

## Related content

- See [Monitor Azure Files](storage-files-monitoring.md) for a description of monitoring Azure Files.
- See [Monitor Azure resources with Azure Monitor](/azure/azure-monitor/essentials/monitor-azure-resource) for details on monitoring Azure resources.

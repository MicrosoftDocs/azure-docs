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

<!-- 
IMPORTANT 
To make this template easier to use, first:
1. Search and replace Azure Files with the official name of your service.
2. Search and replace blob-storage with the service name to use in GitHub filenames.-->

<!-- VERSION 3.0 2024_01_01
For background about this template, see https://review.learn.microsoft.com/en-us/help/contribute/contribute-monitoring?branch=main -->

<!-- Most services can use the following sections unchanged. All headings are required unless otherwise noted.
The sections use #included text you don't have to maintain, which changes when Azure Monitor functionality changes. Add info into the designated service-specific places if necessary. Remove #includes or template content that aren't relevant to your service.
At a minimum your service should have the following two articles:
1. The primary monitoring article (based on the template monitor-service-template.md)
   - Title: "Monitor Azure Files"
   - TOC title: "Monitor"
   - Filename: "monitor-blob-storage.md"
2. A reference article that lists all the metrics and logs for your service (based on this template).
   - Title: "Azure Files monitoring data reference"
   - TOC title: "Monitoring data reference"
   - Filename: "monitor-blob-storage-reference.md".
-->

# Azure Files monitoring data reference

<!-- Intro -->
[!INCLUDE [horz-monitor-ref-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-intro.md)]

See [Monitor Azure Files](storage-files-monitoring.md) for details on the data you can collect for Azure Files and how to use it.

## Applies to
| File share type | SMB | NFS |
|-|:-:|:-:|
| Standard file shares (GPv2), LRS/ZRS | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Standard file shares (GPv2), GRS/GZRS | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Premium file shares (FileStorage), LRS/ZRS | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) |

<!-- ## Metrics. Required section. -->
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
<!-- ## Metric dimensions. Required section. -->
[!INCLUDE [horz-monitor-ref-metrics-dimensions-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-dimensions-intro.md)]
[!INCLUDE [horz-monitor-ref-metrics-dimensions](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-dimensions.md)]

> [!NOTE] 
> The File Share dimension is not available for standard file shares (only premium file shares). When using standard file shares, the metrics provided are for all files shares in the storage account. To get per-share metrics for standard file shares, create one file share per storage account.

[!INCLUDE [Metrics dimensions](../../../includes/azure-storage-account-metrics-dimensions.md)]

<!-- ## Resource logs. Required section. -->
<a name="resource-logs-preview"></a>
[!INCLUDE [horz-monitor-ref-resource-logs](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-resource-logs.md)]

### Supported resource logs for Microsoft.Storage/storageAccounts/fileServices
[!INCLUDE [Microsoft.Storage/storageAccounts/blobServices](~/azure-reference-other-repo/azure-monitor-ref/supported-logs/includes/microsoft-storage-storageaccounts-fileservices-logs-include.md)]

<!-- ## Azure Monitor Logs tables. Required section. -->
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

<!-- ## Activity log. Required section. -->
[!INCLUDE [horz-monitor-ref-activity-log](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-activity-log.md)]
- [Microsoft.Storage resource provider operations](/azure/role-based-access-control/resource-provider-operations#microsoftstorage)

<!-- ## Other schemas. Optional section. Please keep heading in this order. If your service uses other schemas, add the following include and information.
[!INCLUDE [horz-monitor-ref-other-schemas](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-other-schemas.md)]
<!-- List other schemas and their usage here. These can be resource logs, alerts, event hub formats, etc. depending on what you think is important. You can put JSON messages, API responses not listed in the REST API docs, and other similar types of info here.  -->

## Related content

- See [Monitor Azure Files](storage-files-monitoring.md) for a description of monitoring Azure Files.
- See [Monitor Azure resources with Azure Monitor](/azure/azure-monitor/essentials/monitor-azure-resource) for details on monitoring Azure resources.

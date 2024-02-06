---
title: Storage Actions monitoring data reference
titleSuffix: Azure Storage Actions Preview
description: Important reference material needed when you monitor Azure Storage Actions.
author: normesta

ms.service: azure-storage-actions
ms.custom: build-2023-metadata-update
ms.topic: reference
ms.date: 01/17/2024
ms.author: normesta
---

# Azure Storage Actions monitoring data reference

See [Monitoring Azure Storage Actions](monitor-storage-tasks.md) for details on collecting and analyzing monitoring data for Azure Storage Actions.

## Metrics

This section lists all the automatically collected platform metrics for Azure Storage Actions.  

|Metric Type | Resource Provider / Type Namespace<br/> and link to individual metrics |
|-------|-----|
| Storage tasks | [Microsoft.StorageActions/storageTasks](/azure/azure-monitor/reference/supported-metrics/microsoft-storage-storagetasks-metrics) |
| Storage tasks | [Microsoft.StorageActions/storageAccounts/storageTasks](/azure/azure-monitor/reference/supported-metrics/microsoft-storage-storageaccounts-storagetasks-metrics) |

## Metric dimensions

For more information on what metric dimensions are, see [Multi-dimensional metrics](/azure/azure-monitor/platform/data-platform-metrics#multi-dimensional-metrics).

Azure Storage Actions support the following dimensions for metrics in Azure Monitor.

| Dimension Name | Description |
| ------------------- | ----------------- |
| **AccountName** | The name of a storage account |
| **TaskAssignmentId** | The ID of the task assignment |

## Activity log

The following table lists the operations that Azure Storage Actions might record in the activity log. This list of entries is a subset of the possible entries that you might find in the activity log.

| Namespace | Description |
|:---|:---|
| Microsoft.StorageActions/storageTasks/read | Reads an existing storage task. |
| Microsoft.StorageActions/storageTasks/delete | Deletes a storage task. |
| Microsoft.StorageActions/storageTasks/promote/action | Promotes specific version of storage task to current version. |
| Microsoft.StorageActions/storageTasks/write | Edits a storage task. |
| Microsoft.StorageActions/storageAccounts/storageTasks/delete | Deletes a storage task. |
| Microsoft.StorageActions/storageAccounts/storageTasks/read | Reads an existing storage task. |
| Microsoft.StorageActions/storageAccounts/storageTasks/executionsummary/action | Opens task runs. |
| Microsoft.StorageActions/storageAccounts/storageTasks/assignmentexecutionsummary/action | Opens task runs from the Assignments pane. |
| Microsoft.StorageActions/storageAccounts/storageTasks/write | Edits a storage task. |

See [all the possible resource provider operations in the activity log](/azure/role-based-access-control/resource-provider-operations).  

For more information on the schema of Activity Log entries, see [Activity  Log schema](/azure/azure-monitor/essentials/activity-log-schema).

## See Also

- See [Monitoring Azure Storage Actions](monitor-storage-tasks.md) for a description of monitoring Azure Storage Actions.
- See [Monitoring Azure resources with Azure Monitor](../../azure-monitor/essentials/monitor-azure-resource.md) for details on monitoring Azure resources.
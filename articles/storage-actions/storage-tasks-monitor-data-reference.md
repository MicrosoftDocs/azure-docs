---
title: Storage Task monitoring data reference
titleSuffix: Azure Storage Tasks
description: Important reference material needed when you monitor Azure Storage Tasks 
author: normesta

ms.service: azure-storage-actions
ms.custom: build-2023-metadata-update
ms.topic: reference
ms.date: 05/16/2023
ms.author: normesta
---

# Azure Storage Task monitoring data reference

See [Monitoring Azure Storage Tasks](monitor-storage-tasks.md) for details on collecting and analyzing monitoring data for Azure Storage Tasks.

## Metrics

This section lists all the automatically collected platform metrics for Azure Storage Tasks.  

|Metric Type | Resource Provider / Type Namespace<br/> and link to individual metrics |
|-------|-----|
| Storage tasks | [Microsoft.Storage/storageTasks](/azure/azure-monitor/reference/supported-metrics/microsoft-storage-storagetasks-metrics) |
| Storage tasks | [Microsoft.Storage/storageAccounts/storageTasks](/azure/azure-monitor/reference/supported-metrics/microsoft-storage-storageaccounts-storagetasks-metrics) |

## Metric Dimensions

For more information on what metric dimensions are, see [Multi-dimensional metrics](/azure/azure-monitor/platform/data-platform-metrics#multi-dimensional-metrics).

Azure Storage Tasks support the following dimensions for metrics in Azure Monitor.

| Dimension Name | Description |
| ------------------- | ----------------- |
| **AccountName** | The name of a storage account |
| **TaskAssignmentId** | The ID of the task assignment |

## Activity log

The following table lists the operations that Azure Storage Tasks might record in the activity log. This list of entries is a subset of the possible entries that you might find in the activity log.

| Namespace | Description |
|:---|:---|
| Microsoft.Storage/storageTasks/read | Reads an existing storage task. |
| Microsoft.Storage/storageTasks/delete | Deletes a storage task. |
| Microsoft.Storage/storageTasks/promote/action | Description goes here |
| Microsoft.Storage/storageTasks/write | Edits a storage task. |
| Microsoft.Storage/storageAccounts/storageTasks/delete | Deletes a storage task. |
| Microsoft.Storage/storageAccounts/storageTasks/read | Reads an existing storage task. |
| Microsoft.Storage/storageAccounts/storageTasks/executionsummary/action | Description goes here|
| Microsoft.Storage/storageAccounts/storageTasks/assignmentexecutionsummary/action | Description goes here|
| Microsoft.Storage/storageAccounts/storageTasks/write | Edits a storage task. |

See [all the possible resource provider operations in the activity log](/azure/role-based-access-control/resource-provider-operations).  

For more information on the schema of Activity Log entries, see [Activity  Log schema](/azure/azure-monitor/essentials/activity-log-schema).

## See Also

- See [Monitoring Azure Azure Storage Tasks](monitor-storage-tasks.md) for a description of monitoring Azure Azure Storage Tasks.
- See [Monitoring Azure resources with Azure Monitor](../azure-monitor/essentials/monitor-azure-resource.md) for details on monitoring Azure resources.
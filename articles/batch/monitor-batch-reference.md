---
title: Monitoring data reference for Azure Batch
description: This article contains important reference material you need when you monitor Azure Batch.
ms.date: 09/30/2026
ms.custom: horz-monitor
ms.topic: reference
ms.service: azure-batch
# Customer intent: As a system administrator, I want to access monitoring data for Azure Batch resources, so that I can effectively track performance and troubleshoot issues in my batch processing environments.
---

# Azure Batch monitoring data reference

<!-- Intro. Required. -->
[!INCLUDE [horz-monitor-ref-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-intro.md)]

See [Monitor Azure Batch](monitor-batch.md) for details on the data you can collect for Azure Batch and how to use it.

[!INCLUDE [horz-monitor-ref-metrics-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-intro.md)]

### Supported metrics for Microsoft.Batch/batchaccounts
The following table lists the metrics available for the Microsoft.Batch/batchaccounts resource type.

> [!NOTE]
> This table lists Batch account platform metrics. To collect guest operating system performance metrics from pool compute nodes, see [Monitor Azure Batch pool compute nodes with Azure Monitor Agent](monitor-batch-pool-nodes.md).

[!INCLUDE [horz-monitor-ref-metrics-tableheader](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-tableheader.md)]
[!INCLUDE [Microsoft.Batch/batchaccounts](~/reusable-content/ce-skilling/azure/includes/azure-monitor/reference/metrics/microsoft-batch-batchaccounts-metrics-include.md)]  

### Node and core count metrics

The node and core count metrics in the **Resource Allocation** category are gauge metrics. Each sample represents a point-in-time total for the Batch account, rather than a count of events during the time interval.

The `PT1M` time grain indicates that these metrics support one-minute granularity. It doesn't guarantee that every one-minute interval contains exactly one sample. A missing sample means that no metric value was reported for that interval; it doesn't mean that the node or core count was zero. Processing and delivery timing can also cause more than one sample to appear in the same interval.

When you analyze node and core counts:

- Don't use the **Total** aggregation to determine the number of nodes or cores. **Total** adds all samples in the selected interval and can overstate the count if the interval contains multiple samples.
- Use **Maximum** to view the highest observed count in an interval.
- Use **Average** to view the average of the reported samples in an interval.
- Don't use these metrics as an authoritative record of the exact node count at every minute or as an audit record for pool autoscale evaluations.


[!INCLUDE [horz-monitor-ref-metrics-dimensions-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-dimensions-intro.md)]

[!INCLUDE [horz-monitor-ref-metrics-dimensions](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-dimensions.md)]

- poolId
- jobId
- operation
- result

[!INCLUDE [horz-monitor-ref-resource-logs](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-resource-logs.md)]

### Supported resource logs for Microsoft.Batch/batchaccounts
[!INCLUDE [Microsoft.Batch/batchaccounts](~/reusable-content/ce-skilling/azure/includes/azure-monitor/reference/logs/microsoft-batch-batchaccounts-logs-include.md)]

### Service log events

Batch service logs contain events emitted by the Batch service during the lifetime of an individual Batch resource, such as a pool or task. The Batch service emits the following log events:

- [Pool create](batch-pool-create-event.md)
- [Pool delete start](batch-pool-delete-start-event.md)
- [Pool delete complete](batch-pool-delete-complete-event.md)
- [Pool resize start](batch-pool-resize-start-event.md)
- [Pool resize complete](batch-pool-resize-complete-event.md)
- [Pool autoscale](batch-pool-autoscale-event.md)
- [Task start](batch-task-start-event.md)
- [Task complete](batch-task-complete-event.md)
- [Task fail](batch-task-fail-event.md)
- [Task requeue](batch-task-requeue-event.md)
- [Task schedule fail](batch-task-schedule-fail-event.md)
- [Special task](batch-special-task-event.md)

Each event emitted by Batch is logged in JSON format. The following example shows the body of a sample **pool create event**:

```json
{
    "id": "myPool1",
    "displayName": "Production Pool",
    "vmSize": "Standard_F1s",
    "imageType": "VirtualMachineConfiguration",
    "cloudServiceConfiguration": {
        "osFamily": "",
        "targetOsVersion": ""
    },
    "networkConfiguration": {
        "subnetId": " "
    },
    "virtualMachineConfiguration": {
        "imageReference": {
            "publisher": "Canonical",
            "offer": "UbuntuServer",
            "sku": "20.04-LTS",
            "version": "latest"
        },
        "nodeAgentId": "batch.node.ubuntu 22.04"
    },
    "resizeTimeout": "300000",
    "targetDedicatedNodes": 2,
    "targetLowPriorityNodes": 2,
    "maxTasksPerNode": 1,
    "taskSlotsPerNode": 1,
    "vmFillType": "Spread",
    "enableAutoScale": false,
    "enableInterNodeCommunication": false,
    "isAutoPool": false
}
```

[!INCLUDE [horz-monitor-ref-logs-tables](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-logs-tables.md)]
### Batch Accounts
microsoft.batch/batchaccounts

- [AzureActivity](/azure/azure-monitor/reference/tables/AzureActivity#columns)
- [AzureMetrics](/azure/azure-monitor/reference/tables/AzureMetrics#columns)
- [AzureDiagnostics](/azure/azure-monitor/reference/tables/AzureDiagnostics#columns)

[!INCLUDE [horz-monitor-ref-activity-log](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-activity-log.md)]
- [Microsoft.Batch resource provider operations](/azure/role-based-access-control/permissions/compute#microsoftbatch)

## Related content

- See [Monitor Batch](monitor-batch.md) for a description of monitoring Batch.
- See [Monitor Azure resources with Azure Monitor](/azure/azure-monitor/essentials/monitor-azure-resource) for details on monitoring Azure resources.
- Learn about the [Batch APIs and tools](batch-apis-tools.md) available for building Batch solutions.

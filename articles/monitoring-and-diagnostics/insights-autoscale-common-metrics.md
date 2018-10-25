---
title: Autoscale common metrics
description: Learn which metrics are commonly used for autoscaling your Cloud Services, Virtual Machines and Web Apps.
author: anirudhcavale
services: azure-monitor
ms.service: azure-monitor
ms.topic: conceptual
ms.date: 12/6/2016
ms.author: ancav
ms.component: autoscale
---
# Azure Monitor autoscaling common metrics
Azure Monitor autoscaling allows you to scale the number of running instances up or down, based on telemetry data (metrics). This document describes common metrics that you might want to use. In the Azure portal, you can choose the metric of the resource to scale by. However, you can also choose any metric from a different resource to scale by.

Azure Monitor autoscale applies only to [Virtual Machine Scale Sets](https://azure.microsoft.com/services/virtual-machine-scale-sets/), [Cloud Services](https://azure.microsoft.com/services/cloud-services/), [App Service - Web Apps](https://azure.microsoft.com/services/app-service/web/), and [API Management services](https://docs.microsoft.com/azure/api-management/api-management-key-concepts). Other Azure services use different scaling methods.

## Compute metrics for Resource Manager-based VMs
By default, Resource Manager-based Virtual Machines and Virtual Machine Scale Sets emit basic (host-level) metrics. In addition, when you configure diagnostics data collection for an Azure VM and VMSS,  the Azure diagnostic extension also emits guest-OS performance counters (commonly known as "guest-OS metrics").  You use all these metrics in autoscale rules.

You can use the `Get MetricDefinitions` API/PoSH/CLI to view the metrics available for your VMSS resource.

If you're using VM scale sets and you don't see a particular metric listed, then it is likely *disabled* in your diagnostics extension.

If a particular metric is not being sampled or transferred at the frequency you want, you can update the diagnostics configuration.

If either preceding case is true, then review [Use PowerShell to enable Azure Diagnostics in a virtual machine running Windows](../virtual-machines/windows/ps-extensions-diagnostics.md) about PowerShell to configure and update your Azure VM Diagnostics extension to enable the metric. That article also includes a sample diagnostics configuration file.

### Host metrics for Resource Manager-based Windows and Linux VMs
The following host-level metrics are emitted by default for Azure VM and VMSS in both Windows and Linux instances. These metrics describe your Azure VM, but are collected from the Azure VM host rather than via agent installed on the guest VM. You may use these metrics in autoscaling rules.

- [Host metrics for Resource Manager-based Windows and Linux VMs](monitoring-supported-metrics.md#microsoftcomputevirtualmachines)
- [Host metrics for Resource Manager-based Windows and Linux VM Scale Sets](monitoring-supported-metrics.md#microsoftcomputevirtualmachinescalesets)

### Guest OS metrics Resource Manager-based Windows VMs
When you create a VM in Azure, diagnostics is enabled by using the Diagnostics extension. The diagnostics extension emits a set of metrics taken from inside of the VM. This means you can autoscale off of metrics that are not emitted by default.

You can generate a list of the metrics by using the following command in PowerShell.

```
Get-AzureRmMetricDefinition -ResourceId <resource_id> | Format-Table -Property Name,Unit
```

You can create an alert for the following metrics:

| Metric Name | Unit |
| --- | --- |
| \Processor(_Total)\% Processor Time |Percent |
| \Processor(_Total)\% Privileged Time |Percent |
| \Processor(_Total)\% User Time |Percent |
| \Processor Information(_Total)\Processor Frequency |Count |
| \System\Processes |Count |
| \Process(_Total)\Thread Count |Count |
| \Process(_Total)\Handle Count |Count |
| \Memory\% Committed Bytes In Use |Percent |
| \Memory\Available Bytes |Bytes |
| \Memory\Committed Bytes |Bytes |
| \Memory\Commit Limit |Bytes |
| \Memory\Pool Paged Bytes |Bytes |
| \Memory\Pool Nonpaged Bytes |Bytes |
| \PhysicalDisk(_Total)\% Disk Time |Percent |
| \PhysicalDisk(_Total)\% Disk Read Time |Percent |
| \PhysicalDisk(_Total)\% Disk Write Time |Percent |
| \PhysicalDisk(_Total)\Disk Transfers/sec |CountPerSecond |
| \PhysicalDisk(_Total)\Disk Reads/sec |CountPerSecond |
| \PhysicalDisk(_Total)\Disk Writes/sec |CountPerSecond |
| \PhysicalDisk(_Total)\Disk Bytes/sec |BytesPerSecond |
| \PhysicalDisk(_Total)\Disk Read Bytes/sec |BytesPerSecond |
| \PhysicalDisk(_Total)\Disk Write Bytes/sec |BytesPerSecond |
| \PhysicalDisk(_Total)\Avg. Disk Queue Length |Count |
| \PhysicalDisk(_Total)\Avg. Disk Read Queue Length |Count |
| \PhysicalDisk(_Total)\Avg. Disk Write Queue Length |Count |
| \LogicalDisk(_Total)\% Free Space |Percent |
| \LogicalDisk(_Total)\Free Megabytes |Count |

### Guest OS metrics Linux VMs
When you create a VM in Azure, diagnostics is enabled by default by using Diagnostics extension.

You can generate a list of the metrics by using the following command in PowerShell.

```
Get-AzureRmMetricDefinition -ResourceId <resource_id> | Format-Table -Property Name,Unit
```

 You can create an alert for the following metrics:

| Metric Name | Unit |
| --- | --- |
| \Memory\AvailableMemory |Bytes |
| \Memory\PercentAvailableMemory |Percent |
| \Memory\UsedMemory |Bytes |
| \Memory\PercentUsedMemory |Percent |
| \Memory\PercentUsedByCache |Percent |
| \Memory\PagesPerSec |CountPerSecond |
| \Memory\PagesReadPerSec |CountPerSecond |
| \Memory\PagesWrittenPerSec |CountPerSecond |
| \Memory\AvailableSwap |Bytes |
| \Memory\PercentAvailableSwap |Percent |
| \Memory\UsedSwap |Bytes |
| \Memory\PercentUsedSwap |Percent |
| \Processor\PercentIdleTime |Percent |
| \Processor\PercentUserTime |Percent |
| \Processor\PercentNiceTime |Percent |
| \Processor\PercentPrivilegedTime |Percent |
| \Processor\PercentInterruptTime |Percent |
| \Processor\PercentDPCTime |Percent |
| \Processor\PercentProcessorTime |Percent |
| \Processor\PercentIOWaitTime |Percent |
| \PhysicalDisk\BytesPerSecond |BytesPerSecond |
| \PhysicalDisk\ReadBytesPerSecond |BytesPerSecond |
| \PhysicalDisk\WriteBytesPerSecond |BytesPerSecond |
| \PhysicalDisk\TransfersPerSecond |CountPerSecond |
| \PhysicalDisk\ReadsPerSecond |CountPerSecond |
| \PhysicalDisk\WritesPerSecond |CountPerSecond |
| \PhysicalDisk\AverageReadTime |Seconds |
| \PhysicalDisk\AverageWriteTime |Seconds |
| \PhysicalDisk\AverageTransferTime |Seconds |
| \PhysicalDisk\AverageDiskQueueLength |Count |
| \NetworkInterface\BytesTransmitted |Bytes |
| \NetworkInterface\BytesReceived |Bytes |
| \NetworkInterface\PacketsTransmitted |Count |
| \NetworkInterface\PacketsReceived |Count |
| \NetworkInterface\BytesTotal |Bytes |
| \NetworkInterface\TotalRxErrors |Count |
| \NetworkInterface\TotalTxErrors |Count |
| \NetworkInterface\TotalCollisions |Count |

## Commonly used Web (Server Farm) metrics
You can also perform autoscale based on common web server metrics such as the Http queue length. It's metric name is **HttpQueueLength**.  The following section lists available server farm (Web Apps) metrics.

### Web Apps metrics
You can generate a list of the Web Apps metrics by using the following command in PowerShell.

```
Get-AzureRmMetricDefinition -ResourceId <resource_id> | Format-Table -Property Name,Unit
```

You can alert on or scale by these metrics.

| Metric Name | Unit |
| --- | --- |
| CpuPercentage |Percent |
| MemoryPercentage |Percent |
| DiskQueueLength |Count |
| HttpQueueLength |Count |
| BytesReceived |Bytes |
| BytesSent |Bytes |

## Commonly used Storage metrics
You can scale by Storage queue length, which is the number of messages in the storage queue. Storage queue length is a special metric and the threshold is the number of messages per instance. For example, if there are two instances and if the threshold is set to 100, scaling occurs when the total number of messages in the queue is 200. That can be 100 messages per instance, 120 and 80, or any other combination that adds up to 200 or more.

Configure this setting in the Azure portal in the **Settings** blade. For VM scale sets, you can update the Autoscale setting in the Resource Manager template to use *metricName* as *ApproximateMessageCount* and pass the ID of the storage queue as *metricResourceUri*.

For example, with a Classic Storage Account the autoscale setting metricTrigger would include:

```
"metricName": "ApproximateMessageCount",
 "metricNamespace": "",
 "metricResourceUri": "/subscriptions/SUBSCRIPTION_ID/resourceGroups/RES_GROUP_NAME/providers/Microsoft.ClassicStorage/storageAccounts/STORAGE_ACCOUNT_NAME/services/queue/queues/QUEUE_NAME"
 ```

For a (non-classic) storage account, the metricTrigger would include:

```
"metricName": "ApproximateMessageCount",
"metricNamespace": "",
"metricResourceUri": "/subscriptions/SUBSCRIPTION_ID/resourceGroups/RES_GROUP_NAME/providers/Microsoft.Storage/storageAccounts/STORAGE_ACCOUNT_NAME/services/queue/queues/QUEUE_NAME"
```

## Commonly used Service Bus metrics
You can scale by Service Bus queue length, which is the number of messages in the Service Bus queue. Service Bus queue length is a special metric and the threshold is the number of messages per instance. For example, if there are two instances and if the threshold is set to 100, scaling occurs when the total number of messages in the queue is 200. That can be 100 messages per instance, 120 and 80, or any other combination that adds up to 200 or more.

For VM scale sets, you can update the Autoscale setting in the Resource Manager template to use *metricName* as *ApproximateMessageCount* and pass the ID of the storage queue as *metricResourceUri*.

```
"metricName": "MessageCount",
 "metricNamespace": "",
"metricResourceUri": "/subscriptions/SUBSCRIPTION_ID/resourceGroups/RES_GROUP_NAME/providers/Microsoft.ServiceBus/namespaces/SB_NAMESPACE/queues/QUEUE_NAME"
```

> [!NOTE]
> For Service Bus, the resource group concept does not exist but Azure Resource Manager creates a default resource group per region. The resource group is usually in the 'Default-ServiceBus-[region]' format. For example, 'Default-ServiceBus-EastUS', 'Default-ServiceBus-WestUS', 'Default-ServiceBus-AustraliaEast' etc.
>
>

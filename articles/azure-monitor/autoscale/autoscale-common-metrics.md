---
title: Autoscale common metrics
description: Learn which metrics are commonly used for autoscaling your cloud services, virtual machines, and web apps.
author: EdB-MSFT
ms.author: edbaynash
ms.topic: conceptual
ms.date: 04/17/2023
ms.subservice: autoscale 
ms.reviewer: akkumari
---

# Azure Monitor autoscaling common metrics

Azure Monitor autoscaling allows you to scale the number of running instances in or out, based on telemetry data or metrics. Scaling can be based on any metric, even metrics from a different resource. For example, scale a Virtual Machine Scale Set based on the amount of traffic on a firewall.

This article describes metrics that are commonly used to trigger scale events. 

Azure autoscale supports many resource types. For more information about supported resources, see [autoscale supported resources](./autoscale-overview.md#supported-services-for-autoscale).

For all resources, you can get a list of the available metrics using the PowerShell or Azure CLI

```azurepowershell
Get-AzMetricDefinition -ResourceId <resource_id> 
```

```azurecli
az monitor metrics list-definitions --resource <resource_id>
```

## Compute metrics for Resource Manager-based VMs

By default, Azure Resource Manager-based virtual machines and Virtual Machine Scale Sets emit basic (host-level) metrics. In addition, when you configure diagnostics data collection for an Azure VM and Virtual Machine Scale Sets, the Azure Diagnostics extension also emits guest-OS performance counters. These counters are commonly known as "guest-OS metrics." You use all these metrics in autoscale rules.

If you're using Virtual Machine Scale Sets and you don't see a particular metric listed, it's likely *disabled* in your Diagnostics extension.

If a particular metric isn't being sampled or transferred at the frequency you want, you can update the diagnostics configuration.

If either preceding case is true, see [Use PowerShell to enable Azure Diagnostics in a virtual machine running Windows](../../virtual-machines/extensions/diagnostics-windows.md) to configure and update your Azure VM Diagnostics extension to enable the metric. The article also includes a sample diagnostics configuration file.

### Host metrics for Resource Manager-based Windows and Linux VMs

The following host-level metrics are emitted by default for Azure VM and Virtual Machine Scale Sets in both Windows and Linux instances. These metrics describe your Azure VM but are collected from the Azure VM host rather than via agent installed on the guest VM. You can use these metrics in autoscaling rules.

- [Host metrics for Resource Manager-based Windows and Linux VMs](../essentials/metrics-supported.md#microsoftcomputevirtualmachines)
- [Host metrics for Resource Manager-based Windows and Linux Virtual Machine Scale Sets](../essentials/metrics-supported.md#microsoftcomputevirtualmachinescalesets)

### Guest OS metrics for Resource Manager-based Windows VMs

When you create a VM in Azure, diagnostics is enabled by using the Diagnostics extension. The Diagnostics extension emits a set of metrics taken from inside of the VM. This means you can autoscale using metrics that aren't emitted by default.

You can create an alert for the following metrics:

| Metric name | Unit |
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

When you create a VM in Azure, diagnostics is enabled by default by using the Diagnostics extension.

 You can create an alert for the following metrics:

| Metric name | Unit |
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

## Commonly used App Service (server farm) metrics

You can also perform autoscale based on common web server metrics such as the HTTP queue length. Its metric name is **HttpQueueLength**. The following section lists available server farm (App Service) metrics.

### Web Apps metrics

for Web Apps, you can alert on or scale by these metrics.

| Metric name | Unit |
| --- | --- |
| CpuPercentage |Percent |
| MemoryPercentage |Percent |
| DiskQueueLength |Count |
| HttpQueueLength |Count |
| BytesReceived |Bytes |
| BytesSent |Bytes |

## Commonly used Storage metrics

You can scale by Azure Storage queue length, which is the number of messages in the Storage queue. Storage queue length is a special metric, and the threshold is the number of messages per instance. For example, if there are two instances and if the threshold is set to 100, scaling occurs when the total number of messages in the queue is 200. That amount can be 100 messages per instance, 120 plus 80, or any other combination that adds up to 200 or more.

Configure this setting in the Azure portal in the **Settings** pane. For Virtual Machine Scale Sets, you can update the autoscale setting in the Resource Manager template to use `metricName` as `ApproximateMessageCount` and pass the ID of the storage queue as `metricResourceUri`.

For example, with a Classic Storage account, the autoscale setting `metricTrigger` would include:

```
"metricName": "ApproximateMessageCount",
"metricNamespace": "",
"metricResourceUri": "/subscriptions/SUBSCRIPTION_ID/resourceGroups/RES_GROUP_NAME/providers/Microsoft.ClassicStorage/storageAccounts/STORAGE_ACCOUNT_NAME/services/queue/queues/QUEUE_NAME"
```

For a (non-classic) Storage account, the `metricTrigger` setting would include:

```
"metricName": "ApproximateMessageCount",
"metricNamespace": "",
"metricResourceUri": "/subscriptions/SUBSCRIPTION_ID/resourceGroups/RES_GROUP_NAME/providers/Microsoft.Storage/storageAccounts/STORAGE_ACCOUNT_NAME/services/queue/queues/QUEUE_NAME"
```

## Commonly used Service Bus metrics

You can scale by Azure Service Bus queue length, which is the number of messages in the Service Bus queue. Service Bus queue length is a special metric, and the threshold is the number of messages per instance. For example, if there are two instances, and if the threshold is set to 100, scaling occurs when the total number of messages in the queue is 200. That amount can be 100 messages per instance, 120 plus 80, or any other combination that adds up to 200 or more.

For Virtual Machine Scale Sets, you can update the autoscale setting in the Resource Manager template to use `metricName` as `ApproximateMessageCount` and pass the ID of the storage queue as `metricResourceUri`.

```
"metricName": "ApproximateMessageCount",
 "metricNamespace": "",
"metricResourceUri": "/subscriptions/SUBSCRIPTION_ID/resourceGroups/RES_GROUP_NAME/providers/Microsoft.ServiceBus/namespaces/SB_NAMESPACE/queues/QUEUE_NAME"
```

> [!NOTE]
> For Service Bus, the resource group concept doesn't exist. Azure Resource Manager creates a default resource group per region. The resource group is usually in the Default-ServiceBus-[region] format. Examples are Default-ServiceBus-EastUS, Default-ServiceBus-WestUS, and Default-ServiceBus-AustraliaEast.

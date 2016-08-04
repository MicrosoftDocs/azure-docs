<properties
	pageTitle="Azure Insights: Azure Insights autoscaling common metrics. | Microsoft Azure"
	description="Learn which metrics are commonly used for autoscaling your Cloud Services, Virtual Machines and Web Apps."
	authors="kamathashwin"
	manager=""
	editor=""
	services="monitoring-and-diagnostics"
	documentationCenter="monitoring"/>

<tags
	ms.service="monitoring-and-diagnostics"
	ms.workload="na"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="08/02/2016"
	ms.author="ashwink"/>

# Azure Insights autoscaling common metrics

Azure Insights autoscaling allows you to scale the number of running instances up or down, based on telemetry data (metrics). This document describes common metrics that you might want to use. In the Azure Portal for Cloud Services and Server Farms, you can choose the metric of the resource to scale by. However, you can also choose any metric from a different resource to scale by.

Here are the details on how to find and list the metrics you want to scale by. The following applies for scaling Virtual Machine Scale Sets as well.

## Compute metrics
By default, Azure VM v2 comes with diagnostics extension configured and they have the following metrics turned on.

- [Guest metrics for Windows VM v2](#compute-metrics-for-windows-vm-v2-as-a-guest-os)
- [Guest metrics for Linux VM v2](#compute-metrics-for-linux-vm-v2-as-a-guest-os)

You can use the `Get MetricDefinitions` API/PoSH/CLI to view the metrics available for your VMSS resource. 

If you're using VM scale sets and you don't see a particular metric listed, then it is likely *disabled* in your diagnostics extension.

If a particular metric is not being sampled or transferred at the frequency you want, you can update the diagnostics configuration.

If either case above is true, then review [Use PowerShell to enable Azure Diagnostics in a virtual machine running Windows](../virtual-machines/virtual-machines-windows-ps-extensions-diagnostics.md) about PowerShell to configure and update your Azure VM Diagnostics extension to enable the metric. That article also includes a sample diagnostics configuration file.

### Compute metrics for Windows VM v2 as a guest OS

When you create a new VM (v2) in Azure, diagnostics is enabled by using the Diagnostics extension.

You can generate a list of the metrics by using the following command in PowerShell.


```
Get-AzureRmMetricDefinition -ResourceId <resource_id> | Format-Table -Property Name,Unit
```

You can create an alert for the following metrics.

|Metric Name|	Unit|
|---|---|
|\Processor(_Total)\% Processor Time	|Percent|
|\Processor(_Total)\% Privileged Time	|Percent|
|\Processor(_Total)\% User Time	|Percent|
|\Processor Information(_Total)\Processor Frequency	|Count|
|\System\Processes|	Count|
|\Process(_Total)\Thread Count|	Count|
|\Process(_Total)\Handle Count	|Count|
|\Memory\% Committed Bytes In Use	|Percent|
|\Memory\Available Bytes|	Bytes|
|\Memory\Committed Bytes	|Bytes|
|\Memory\Commit Limit|	Bytes|
|\Memory\Pool Paged Bytes|	Bytes|
|\Memory\Pool Nonpaged Bytes|	Bytes|
|\PhysicalDisk(_Total)\% Disk Time|	Percent|
|\PhysicalDisk(_Total)\% Disk Read Time|	Percent|
|\PhysicalDisk(_Total)\% Disk Write Time|	Percent|
|\PhysicalDisk(_Total)\Disk Transfers/sec	|CountPerSecond|
|\PhysicalDisk(_Total)\Disk Reads/sec	|CountPerSecond|
|\PhysicalDisk(_Total)\Disk Writes/sec	|CountPerSecond|
|\PhysicalDisk(_Total)\Disk Bytes/sec	|BytesPerSecond|
|\PhysicalDisk(_Total)\Disk Read Bytes/sec|	BytesPerSecond|
|\PhysicalDisk(_Total)\Disk Write Bytes/sec	|BytesPerSecond|
|\PhysicalDisk(_Total)\Avg. Disk Queue Length|	Count|
|\PhysicalDisk(_Total)\Avg. Disk Read Queue Length|	Count|
|\PhysicalDisk(_Total)\Avg. Disk Write Queue Length	|Count|
|\LogicalDisk(_Total)\% Free Space|	Percent|
|\LogicalDisk(_Total)\Free Megabytes|	Count|



### Compute metrics for Linux VM v2 as a guest OS

When you create a new VM (v2) in Azure, diagnostics is enabled by default by using Diagnostics extension.

You can generate a list of the metrics by using the following command in PowerShell.

```
Get-AzureRmMetricDefinition -ResourceId <resource_id> | Format-Table -Property Name,Unit
```

 You can create an alert for the following metrics.

|Metric Name|	Unit|
|---|---|
|\Memory\AvailableMemory	|Bytes|
|\Memory\PercentAvailableMemory|	Percent|
|\Memory\UsedMemory|	Bytes|
|\Memory\PercentUsedMemory|	Percent|
|\Memory\PercentUsedByCache	|Percent|
|\Memory\PagesPerSec|	CountPerSecond|
|\Memory\PagesReadPerSec|	CountPerSecond|
|\Memory\PagesWrittenPerSec	|CountPerSecond|
|\Memory\AvailableSwap	|Bytes|
|\Memory\PercentAvailableSwap|	Percent|
|\Memory\UsedSwap	|Bytes|
|\Memory\PercentUsedSwap|	Percent|
|\Processor\PercentIdleTime|	Percent|
|\Processor\PercentUserTime|	Percent|
|\Processor\PercentNiceTime	|Percent|
|\Processor\PercentPrivilegedTime	|Percent|
|\Processor\PercentInterruptTime|	Percent|
|\Processor\PercentDPCTime|	Percent|
|\Processor\PercentProcessorTime	|Percent|
|\Processor\PercentIOWaitTime	|Percent|
|\PhysicalDisk\BytesPerSecond|	BytesPerSecond|
|\PhysicalDisk\ReadBytesPerSecond|	BytesPerSecond|
|\PhysicalDisk\WriteBytesPerSecond|	BytesPerSecond|
|\PhysicalDisk\TransfersPerSecond	|CountPerSecond|
|\PhysicalDisk\ReadsPerSecond	|CountPerSecond|
|\PhysicalDisk\WritesPerSecond	|CountPerSecond|
|\PhysicalDisk\AverageReadTime|	Seconds|
|\PhysicalDisk\AverageWriteTime	|Seconds|
|\PhysicalDisk\AverageTransferTime|	Seconds|
|\PhysicalDisk\AverageDiskQueueLength|	Count|
|\NetworkInterface\BytesTransmitted	|Bytes|
|\NetworkInterface\BytesReceived	|Bytes|
|\NetworkInterface\PacketsTransmitted	|Count|
|\NetworkInterface\PacketsReceived	|Count|
|\NetworkInterface\BytesTotal	|Bytes|
|\NetworkInterface\TotalRxErrors|	Count|
|\NetworkInterface\TotalTxErrors|	Count|
|\NetworkInterface\TotalCollisions|	Count|




## Commonly used Web (Server Farm) metrics

You can also perform autoscale based on common web server metrics such as the Http queue length. It's metric name is **HttpQueueLength**.  The following section lists available server farm (Web Apps) metrics.

### Web Apps metrics

You can generate a list of the Web Apps metrics by using the following command in PowerShell.

```
Get-AzureRmMetricDefinition -ResourceId <resource_id> | Format-Table -Property Name,Unit
```

You can alert on or scale by these metrics.

|Metric Name|	Unit|
|---|---|
|CpuPercentage|	Percent|
|MemoryPercentage	|Percent|
|DiskQueueLength|	Count|
|HttpQueueLength|	Count|
|BytesReceived|	Bytes|
|BytesSent|	Bytes|


## Commonly used Storage metrics
You can scale by Storage queue length, which is the number of messages in the storage queue. Storage queue length is a special metric and the threshold applied will be the number of messages per instance. This means if there are two instances and if the threshold is set to 100, it will scale when the total number of messages in the queue are 200. For example, 100 messages per instance.

You can configure this is in the Azure Portal in the **Settings** blade. For VM scale sets, you can update the Autoscale setting in the ARM template to use *metricName* as *ApproximateMessageCount* and pass the ID of the storage queue as *metricResourceUri*.


```
"metricName": "ApproximateMessageCount",
 "metricNamespace": "",
 "metricResourceUri": "/subscriptions/s1/resourceGroups/rg1/providers/Microsoft.ClassicStorage/storageAccounts/mystorage/services/queue/queues/mystoragequeue"
 ```

## Commonly used Service Bus metrics

You can scale by Service Bus queue length, which is the number of messages in the Service Bus queue. Service Bus queue length is a special metric and the threshold specified applied will be the number of messages per instance. This means if there are two instances and if the threshold is set to 100, it will scale when the total number of messages in the queue are 200. For example, 100 messages per instance.

For VM scale sets, you can update the Autoscale setting in the ARM template to use *metricName* as *ApproximateMessageCount* and pass the ID of the storage queue as *metricResourceUri*.

```
"metricName": "MessageCount",
 "metricNamespace": "",
"metricResourceUri": "/subscriptions/s1/resourceGroups/rg1/providers/Microsoft.ServiceBus/namespaces/mySB/queues/myqueue"
```

>[AZURE.NOTE] For Service Bus, the resource group concept does not exist but Azure Resource Manager creates a default resource group per region. The resource group is usually in the 'Default-ServiceBus-[region]' format. For example, 'Default-ServiceBus-EastUS', 'Default-ServiceBus-WestUS', 'Default-ServiceBus-AustraliaEast' etc.

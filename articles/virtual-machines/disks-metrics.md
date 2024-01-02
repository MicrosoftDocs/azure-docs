---
title: Disk metrics
description: Examples of disk bursting metrics
author: roygara
ms.service: azure-disk-storage
ms.topic: conceptual
ms.date: 10/12/2022
ms.author: rogarana
ms.custom: ignite-2022
---
# Disk performance metrics

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Windows VMs :heavy_check_mark: Flexible scale sets :heavy_check_mark: Uniform scale sets

Azure offers metrics in the Azure portal that provide insight on how your virtual machines (VM) and disks perform. The metrics can also be retrieved through an API call. This article is broken into 3 subsections:

- **Disk IO, throughput, queue depth and latency metrics** - These metrics allow you to see the storage performance from the perspective of a disk and a virtual machine.
- **Disk bursting metrics** - These are the metrics provide observability into our [bursting](disk-bursting.md) feature on our premium disks.
- **Storage IO utilization metrics** - These metrics help diagnose bottlenecks in your storage performance with disks. 

All metrics are emitted every minute, except for the bursting credit percentage metric, which is emitted every 5 minutes.

## Disk IO, throughput, queue depth and latency metrics
The following metrics are available to get insight on VM and disk IO, throughput, and queue depth performance:

- **OS Disk Latency (Preview)**: The average time to complete IOs during the monitoring for the OS disk. Values are in miliseconds.
- **OS Disk Queue Depth**: The number of current outstanding IO requests that are waiting to be read from or written to the OS disk.
- **OS Disk Read Bytes/Sec**: The number of bytes that are read in a second from the OS disk. If Read-only or Read/write [disk caching](premium-storage-performance.md#disk-caching) is enabled, this metric is inclusive of bytes read from the cache.
- **OS Disk Read Operations/Sec**: The number of input operations that are read in a second from the OS disk. If Read-only or Read/write [disk caching](premium-storage-performance.md#disk-caching) is enabled, this metric is inclusive of IOPs read from the cache.
- **OS Disk Write Bytes/Sec**: The number of bytes that are written in a second from the OS disk.
- **OS Disk Write Operations/Sec**: The number of output operations that are written in a second from the OS disk.
- **Data Disk Latency (Preview)**: The average time to complete IOs during the monitoring for the data disk. Values are in miliseconds.
- **Data Disk Queue Depth**: The number of current outstanding IO requests that are waiting to be read from or written to the data disk(s).
- **Data Disk Read Bytes/Sec**: The number of bytes that are read in a second from the data disk(s). If Read-only or Read/write [disk caching](premium-storage-performance.md#disk-caching) is enabled, this metric is inclusive of bytes read from the cache.
- **Data Disk Read Operations/Sec**: The number of input operations that are read in a second from data disk(s). If Read-only or Read/write [disk caching](premium-storage-performance.md#disk-caching) is enabled, this metric is inclusive of IOPs read from the cache.
- **Data Disk Write Bytes/Sec**: The number of bytes that are written in a second from the data disk(s).
- **Data Disk Write Operations/Sec**: The number of output operations that are written in a second from data disk(s).
- **Disk Read Bytes**: The number of total bytes that are read in a minute from all disks attached to a VM. If Read-only or Read/write [disk caching](premium-storage-performance.md#disk-caching) is enabled, this metric is inclusive of bytes read from the cache.
- **Disk Read Operations/Sec**: The number of input operations that are read in a second from all disks attached to a VM. If Read-only or Read/write [disk caching](premium-storage-performance.md#disk-caching) is enabled, this metric is inclusive of IOPs read from the cache.
- **Disk Write Bytes**: The number of bytes that are written in a minute from all disks attached to a VM.
- **Disk Write Operations/Sec**: The number of output operations that are written in a second from all disks attached to a VM.
- **Temp Disk Latency (Preview)**: The average time to complete IOs during the monitoring for the temporary disk. Values are in miliseconds.
- **Temp Disk Queue Depth**: The number of current outstanding IO requests that are waiting to be read from or written to the temporary disk.
- **Temp Disk Read Bytes/Sec**: The number of bytes that are read in a second from the temporary disk.
- **Temp Disk Read Operations/Sec**: The number of input operations that are read in a second from the temporary disk.
- **Temp Disk Write Bytes/Sec**: The number of bytes that are written in a second from the temporary disk.
- **Temp Disk Write Operations/Sec**: The number of output operations that are written in a second from the temporary disk.

## Bursting metrics
The following metrics help with observability into our [bursting](disk-bursting.md) feature on our premium disks:

- **Data Disk Max Burst Bandwidth**: The throughput limit that the data disk(s) can burst up to.
- **OS Disk Max Burst Bandwidth**: The throughput limit that the OS disk can burst up to.
- **Data Disk Max Burst IOPS**: the IOPS limit that the data disk(s) can burst up to.
- **OS Disk Max Burst IOPS**: The IOPS limit that the OS disk can burst up to.
- **Data Disk Target Bandwidth**: The throughput limit that the data(s) disk can achieve without bursting.
- **OS Disk Target Bandwidth**: The throughput limit that the OS disk can achieve without bursting.
- **Data Disk Target IOPS**: The IOPS limit that the data disk(s) can achieve without bursting.
- **OS Disk Target IOPS**: The IOPS limit that the data disk(s) can achieve without bursting.
- **Data Disk Used Burst BPS Credits Percentage**: The accumulated percentage of the throughput burst used for the data disk(s). Emitted on a 5 minute interval.
- **OS Disk Used Burst BPS Credits Percentage**: The accumulated percentage of the throughput burst used for the OS disk. Emitted on a 5 minute interval.
- **Data Disk Used Burst IO Credits Percentage**: The accumulated percentage of the IOPS burst used for the data disk(s). Emitted on a 5 minute interval.
- **OS Disk Used Burst IO Credits Percentage**: The accumulated percentage of the IOPS burst used for the OS disk. Emitted on a 5 minute interval.
- **Disk On-demand Burst Operations**: The accumulated operations of burst transactions used for disks with on-demand bursting enabled. Emitted on an hour interval.

## VM Bursting metrics
The following metrics provide insight on VM-level bursting:

- **VM Uncached Used Burst IO Credits Percentage**: The accumulated percentage of the VM’s uncached IOPS burst used. Emitted on a 5 minute interval.
- **VM Uncached Used Burst BPS Credits Percentage**: The accumulated percentage of the VM’s uncached throughput burst used. Emitted on a 5 minute interval.
- **VM Cached Used Burst IO Credits Percentage**: The accumulated percentage of the VM’s cached IOPS burst used. Emitted on a 5 minute interval.
- **VM Cached Used Burst BPS Credits Percentage**: The accumulated percentage of the VM’s cached throughput burst used. Emitted on a 5 minute interval.

## Storage IO utilization metrics
The following metrics help diagnose bottleneck in your Virtual Machine and Disk combination. These metrics are only available on VM series that support premium storage.

Metrics that help diagnose disk IO capping:

- **Data Disk IOPS Consumed Percentage**: The percentage calculated by the data disk IOPS completed over the provisioned data disk IOPS. If this amount is at 100%, your application running is IO capped from your data disk's IOPS limit.
- **Data Disk Bandwidth Consumed Percentage**: The percentage calculated by the data disk throughput completed over the provisioned data disk throughput. If this amount is at 100%, your application running is IO capped from your data disk's bandwidth limit.
- **OS Disk IOPS Consumed Percentage**: The percentage calculated by the OS disk IOPS completed over the provisioned OS disk IOPS. If this amount is at 100%, your application running is IO capped from your OS disk's IOPS limit.
- **OS Disk Bandwidth Consumed Percentage**: The percentage calculated by the OS disk throughput completed over the provisioned OS disk throughput. If this amount is at 100%, your application running is IO capped from your OS disk's bandwidth limit.

Metrics that help diagnose VM IO capping:

- **VM Cached IOPS Consumed Percentage**: The percentage calculated by the total IOPS completed over the max cached virtual machine IOPS limit. If this amount is at 100%, your application running is IO capped from your VM's cached IOPS limit.
- **VM Cached Bandwidth Consumed Percentage**: The percentage calculated by the total disk throughput completed over the max cached virtual machine throughput. If this amount is at 100%, your application running is IO capped from your VM's cached bandwidth limit.
- **VM uncached IOPS Consumed Percentage**: The percentage calculated by the total IOPS on a virtual machine completed over the max uncached  virtual machine IOPS limit. If this amount is at 100%, your application running is IO capped from your VM's uncached IOPS limit.
- **VM Uncached Bandwidth Consumed Percentage**: The percentage calculated by the total disk throughput on a virtual machine completed over the max provisioned virtual machine throughput. If this amount is at 100%, your application running is IO capped from your VM's uncached bandwidth limit.

## Storage IO metrics example

Let's run through an example of how to use these new Storage IO utilization metrics to help us debug where a bottleneck is in our system. The system setup is the same as the previous example, except this time the attached OS disk is *not* cached.

**Setup:**

- Standard_D8s_v3
  - Cached IOPS: 16,000
  - Uncached IOPS: 12,800
- P30 OS disk
  - IOPS: 5,000
  - Host caching: **Disabled**
- Two P30 data disks × 2
  - IOPS: 5,000
  - Host caching: **Read/write**
- Two P30 data disks × 2
  - IOPS: 5,000
  - Host caching: **Disabled**

Let's run a benchmarking test on this virtual machine and disk combination that creates IO activity. To learn how to benchmark storage IO on Azure, see [Benchmark your application on Azure Disk Storage](disks-benchmarks.md). From the benchmarking tool, you can see that the VM and disk combination can achieve 22,800 IOPS:

![Screenshot of f i o output showing r=22.8k highlighted.](media/disks-metrics/utilization-metrics-example/fio-output.jpg)



The Standard_D8s_v3 can achieve a total of 28,600 IOPS. Using the metrics, let's investigate what's going on and identify our storage IO bottleneck. On the left pane, select **Metrics**:

![Screenshot showing Metrics highlighted on the left pane.](media/disks-metrics/utilization-metrics-example/metrics-menu.jpg)

Let's first take a look at our **VM Cached IOPS Consumed Percentage** metric:

![Screenshot showing V M Cached I O P S Consumed Percentage.](media/disks-metrics/utilization-metrics-example/vm-cached.jpg)

This metric tells us that 61% of the 16,000 IOPS allotted to the cached IOPS on the VM is being used. This percentage means that the storage IO bottleneck isn't with the disks that are cached because it isn't at 100%. Now let's look at our **VM Uncached IOPS Consumed Percentage** metric:

![Screenshot showing V M Uncached I O P S Consumed Percentage.](media/disks-metrics/utilization-metrics-example/vm-uncached.jpg)

This metric is at 100%. It tells us that all of the 12,800 IOPS allotted to the uncached IOPS on the VM are being used. One way we can remediate this issue is to change the size of our VM to a larger size that can handle the additional IO. But before we do that, let's look at the attached disk to find out how many IOPS they are seeing. Check the OS Disk by looking at the **OS Disk IOPS Consumed Percentage**:

![Screenshot showing O S Disk I O P S Consumed Percentage.](media/disks-metrics/utilization-metrics-example/os-disk.jpg)

This metric tells us that around 90% of the 5,000 IOPS provisioned for this P30 OS disk is being used. This percentage means there's no bottleneck at the OS disk. Now let's check the data disks that are attached to the VM by looking at the **Data Disk IOPS Consumed Percentage**:

![Screenshot showing Data Disk I O P S Consumed Percentage.](media/disks-metrics/utilization-metrics-example/data-disks-no-splitting.jpg)

This metric tells us that the average IOPS consumed percentage across all the disks attached is around 42%. This percentage is calculated based on the IOPS that are used by the disks, and aren't being served from the host cache. Let's drill deeper into this metric by applying *splitting* on these metrics and splitting by the LUN value:

![Screenshot showing Data Disk I O P S Consumed Percentage with splitting.](media/disks-metrics/utilization-metrics-example/data-disks-splitting.jpg)

This metric tells us the data disks attached on LUN 3 and 2 are using around 85% of their provisioned IOPS. Here is a diagram of what the IO looks like from the VM and disks architecture:

![Diagram of Storage I O metrics example.](media/disks-metrics/utilization-metrics-example/metrics-diagram.jpg)

## Next steps

- [Azure Monitor Metrics overview](../azure-monitor/essentials/data-platform-metrics.md)
- [Metrics aggregation explained](../azure-monitor/essentials/metrics-aggregation-explained.md)
- [Create, view, and manage metric alerts using Azure Monitor](../azure-monitor/alerts/alerts-metric.md)

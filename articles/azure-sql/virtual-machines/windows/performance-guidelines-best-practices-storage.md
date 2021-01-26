---
title: "Storage: Performance best practices & guidelines"
description: Provides storage best practices and guidelines to optimize the performance of your SQL Server on Azure Virtual Machine (VM).
services: virtual-machines-windows
documentationcenter: na
author: dplessMSFT
editor: ''
tags: azure-service-management
ms.assetid: a0c85092-2113-4982-b73a-4e80160bac36
ms.service: virtual-machines-sql
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: vm-windows-sql-server
ms.workload: iaas-sql-server
ms.date: 01/19/2021
ms.author: dplessMSFT
ms.reviewer: jroth
---
# Storage: Performance best practices for SQL Server on Azure VMs
[!INCLUDE[appliesto-sqlvm](../../includes/appliesto-sqlvm.md)]

This article provides storage best practices and guidelines to optimize performance for your SQL Server on Azure Virtual Machines (VMs).

To learn more, see the other performance best practices articles:
- [Quick checklist](performance-guidelines-best-practices-checklist.md), [VM size](performance-guidelines-best-practices-vm-size.md), [Disks](performance-guidelines-best-practices-disks.md), [Azure & SQL feature specific](performance-guidelines-best-practices-feature-specific.md), [Collect baseline](performance-guidelines-best-practices-collect-baseline.md)

## Check list

- For detailed testing of SQL Server performance on Azure VMs with TPC-E and TPC_C benchmarks, refer to the blog [Optimize OLTP performance](https://techcommunity.microsoft.com/t5/sql-server/optimize-oltp-performance-with-sql-server-on-azure-vm/ba-p/916794).
- Monitor the application and determine storage latency requirements for SQL Server data, log, and tempdb files before choosing the disk type. Choose UltraDisks for latencies less than 1 ms, otherwise use Premium SSD. Provision different types of drives for the data and log files if the latency requirements vary. 
- Buffer your IOPS/throughput capacity by at least 20% more than your workload requires. 
- Provision the storage account in the same region as the SQL Server VM. 
- Disable Azure geo-redundant storage (geo-replication) on the storage account.
- Configure read-only cache for data files and disable cache for the log file. Stop the SQL Server service when changing the cache settings your disk.
- For workloads requiring IO latencies < 1-ms, enable write accelerator for the M series and consider using Ultra SSD disks for the Es and DS series virtual machines.
- Stripe multiple Azure data disks using Storage Spaces to gain increased storage throughput up to the largest target virtual machine's IOPS and throughput limits.
- Place tempdb on the local SSD D:\ drive for most SQL Server workloads after choosing the correct VM size. SQL Server VMs created from the Azure marketplace are already configured with tempdb using the local ephemeral D:\ drive. 
   - If the capacity of the local drive is not enough for your tempdb size, then place tempdb on a storage pool striped on premium SSD disks with read-only caching.
   - If utilization of the local Azure cache is a concern, consider placing tempdb on a separate data drive with read-caching enabled to prevent overconsmuption of the local cache.  

## Overview

In contrast to on-premises, in Azure we have Azure Managed Disks such as standard HDD disks, standard SSD, premium SSD disks, and ultra-disks. Premium storage also supports a storage cache that helps improve read and read/write performance. Finally, there are Azure virtual machine features that influence storage performance such as bursting and write acceleration. These concepts are covered in this article. 

Choosing which Azure managed disks to use is an important consideration in storage design. The type disk dictates the type of storage volume you can create, where you place the files, how the disks are formatted, and which features are supported. 

It is also important to understand how a virtual machine addresses the presented storage

Virtual machine storage components such as uncached and cached managed disks and the performance levels of storage access from the virtual machine is summarized in the article below.


## Design considerations







**Disk Allocation and Performance**

https://docs.microsoft.com/en-us/azure/virtual-machines/managed-disks-overview?toc=/azure/virtual-machines/linux/toc.json&bc=/azure/virtual-machines/linux/breadcrumb/toc.json#disk-allocation-and-performance 

### Storage performance
When analyzing the performance needs of your target workload it is important to understand the performance indicators of your source environment. For SQL Server workloads we measure an applications performance by the number of requests that an application can process per unit of time. We may do this by capturing the user requests, batch requests, and transactions per second. Depending on the application we may also capture concurrent users along with memory, CPU, and disk related counters. 

In terms of storage, we need to recognize the differences we have in Azure versus on-prem. 

## Storage Performance Indicators

To assess storage needs, and determine how well storage is performing, you need to understand what to measure, and what those indicators mean. 

[IOPS (Input/Output per second)](../../../virtual-machines/premium-storage-performance.md#iops) is the number of requests the application is making to storage per second. Measure IOPS using Performance Monitor counters `Avg. Disk sec/read` and `Avg. Disk sec/writes`. Together these counters are the transfers that address the underlying storage. [OLTP (Online transaction processing)](/azure/architecture/data-guide/relational-data/online-transaction-processing) applications need to drive higher IOPS in order to achieve optimal performance. Applications such as payment processing systems, online shopping, and retail point-of-sale systems are all examples of OLTP applications.

[Throughput](../../../virtual-machines/premium-storage-performance.md#throughput) is the volume of data that is being sent to the underlying storage, often measured by megabytes per second. Measure throughput with the Performance Monitor counters `Disk read bytes/sec` and `Disk write bytes/sec`. [Data warehousing](/azure/architecture/data-guide/relational-data/data-warehousing) are optimized around maximizing throughput over IOPS. Applications such as data stores for analysis, reporting, ETL workstreams, and other business intelligence targets are all examples of Data warehousing applications.

IO unit sizes influence IOPS and throughput capabilities as smaller IO sizes yield higher IOPS and larger IO sizes yield higher throughput. SQL Server chooses the optimal IO size automatically. For more information about, see [Optimize IOPS, throughput, and latency for your applications](../../../virtual-machines/premium-storage-performance.md#optimize-iops-throughput-and-latency-at-a-glance). 


## Uncached vs. Cached throughput

Virtual machines combine premium disks to increase speed up to the virtual machine limits. Virtual machines that support premium disk caching can take advantage of an additional Azure blob cache store to extend the read IOPS and throughput capabilities of a virtual machine. Virtual machines that are enabled for both premium storage and premium storage caching have these two different storage bandwidth limits.

Find a virtual machine that can handle your application workload via the virtual machine's maximum uncached disk throughput limits. The maximum cached limits provide an additional buffer for reads that helps address growth and unexpected peaks.

Enable premium caching whenever the option is supported to significantly improve performance for reads against the data drive. . 

Reads and writes to the Azure BLOB cache (cached IOPS and throughput) does not count against the limits of the uncached IOPS of the virtual machine.

### Uncached IOPS

The max uncached disk IOPS and throughput is the default storage maximum limit that the virtual machine can handle. It is important to understand that this limit is defined at the virtual machine level and is not a limit of the underlying disk storage.

The amount of uncached IOPS and throughput that is available for a VM can be verified in the documentation for your virtual machine.

Again, we will consider the [Standard_M128ms](../../../virtual-machines/m-series) virtual machine where in the documentation you can identify the uncached IOPS available as shown below.

![M-series Uncached Disk Throughput](./media/performance-guidelines-best-practices/M-Series_table.png)

We can see that the [Standard_M128ms](../../../virtual-machines/m-series) supports 80000 uncached disk IOPS and 2000 MBps uncached disk throughput. This limit is governed at the virtual machine level despite the speed of the underlying premium disk storage.

**Reference:**
Uncached Iops – What is it - https://docs.microsoft.com/en-us/azure/virtual-machines/linux/disk-performance-linux#virtual-machine-uncached-vs-cached-limits

### Cached IOPS

The max cached storage throughput limit is a separate limit available only when you enable host caching. In order to take advantage of premium storage caching your virtual machine must support both premium storage and premium storage caching which can be verified in the virtual machine documentation. When caching is enabled on premium storage, virtual machines can scale beyond the limitations of the VM uncached IOPS and throughput and beyond the limits of the underlying disk performance.

The Azure Blob Cache consists of a combination of the host virtual machine's random-access memory and the VM's local SSD that is applied only for caching. This means that the cache is entirely local to the virtual machine so that the cache store can be read quickly. 

![M-Series Premium Storage Support](./media/performance-guidelines-best-practices/M-Series_table_premium_support.png
)

As we can see for the M-series, these virtual machines support both Premium Storage and Premium Storage caching. The limits of the cache will vary based on the virtual machine size.

![M-series Cached Disk Throughput](./media/performance-guidelines-best-practices/M-Series_table_cached_temp.png
)

The [Standard_M128ms](../../../virtual-machines/m-series) supports 160000 cached disk IOPS and 1600 MBps cached disk throughput with a total cache size of 12696 Gib. This limit is governed at the virtual machine level, but only becomes available to the virtual machine when host caching is enabled per disk.

You can manually enable host caching on an existing VM though we always recommend stopping all application workloads and the SQL Server services before any changes are made to your virtual machine's caching policy. Changing any of the virtual machine cache settings results in the target disk being detached and re-attached after the settings are applied.

Note: The [SQL Server IaaS Agent extension](https://docs.microsoft.com/en-us/azure/azure-sql/virtual-machines/windows/storage-configuration) experience helps guide you through the storage configuration process and implements storage best practices such as creating separate storage pools for your data and log files and targeting tempdb to the D:\ drive as well as enabling the optimal caching policy. 

You should leverage the storage optimization process from the [SQL Server IaaS Agent extension](https://docs.microsoft.com/en-us/azure/azure-sql/virtual-machines/windows/storage-configuration) whenever possible.

## Data files caching policies

### SQL Server data disks 

For SQL Server workloads, we recommend only enabling caching for the data disks and setting the caching level to be read-only. ReadOnly caching has improved read latency and higher IOPS and throughput since the reads will be coming directly from the optimized cache which is local in the virtual machines RAM and local SSD. 

Reads from cache will be much faster than the uncached reads that would otherwise come from the data disk.

Additionally, reads provided by the Azure Blob Cache do not count against the virtual machine's uncached IOPS and throughput limits providing the ability to scale beyond these limitations. 

### SQL Server transaction log files
For SQL Server workloads, we do not recommend enabling caching for the transaction log drive as there is no performance benefit and there is also a potential for corruption if 'Read/Write' is used. 
It is recommended to set the caching policy to 'None' for transaction log disks.

### Operating System OS disk
The operating system disk will have a caching level set to Read-only or Read/write. The Read/write caching level is meant for workloads that achieve a balance of read and write operations. 
The default caching policy is Read/write for the premium disk Virtual Machine OS drive. If the OS drive is Standard HDD then the default will be set to 'Read-only'. It is not recommended to change the caching level of the OS drive.

### tempdb
The local and temp disks will leverage the virtual machine cache. If tempdb cannot be placed on the ephemeral drive D:/ due to capacity reasons it is recommended to either resize the virtual machine to get a larger ephemeral drive or place tempdb on a separate data drive with Read-only caching configured.

**Reference**
Cached Iops – What is it

https://docs.microsoft.com/en-us/azure/virtual-machines/premium-storage-performance?toc=/azure/virtual-machines/linux/toc.json&bc=/azure/virtual-machines/linux/breadcrumb/toc.json#disk-caching

## Caching and Disk Size
Disk Caching is not supported for disks 4 TiB and larger (P60 and larger). If multiple disks are attached to your VM, each disk that is smaller than 4 TiB will support caching. For more information see the related topic in the disk configuration section.

**Reference:** 

Azure Premium Storage: Design for high performance 
https://docs.microsoft.com/en-us/azure/virtual-machines/premium-storage-performance.md#disk-caching

Enabling Caching in the Azure Portal
To verify or change caching for a virtual machine's existing disks in the Azure Portal you would first select Disks in the Virtual Machine settings. 

The screenshot below is the result of following the [SQL Server IaaS Agent extension](https://docs.microsoft.com/en-us/azure/azure-sql/virtual-machines/windows/storage-configuration) experience for the [Standard E16-8s_v3](../../../virtual-machines/ev3-esv3-series#esv3-series) with 8 data disks (P30 disks) and 2 log disks (P40 disk) with tempdb placed on the ephemeral D:/ drive. The configuration is guided by the [SQL Server IaaS Agent extension](https://docs.microsoft.com/en-us/azure/azure-sql/virtual-machines/windows/storage-configuration) where caching policy is applied for the administrator.

![VM Disk Configuration](./media/performance-guidelines-best-practices/azure_disk_config.png
)

If an administrator were making these changes without the [SQL Server IaaS Agent extension](https://docs.microsoft.com/en-us/azure/azure-sql/virtual-machines/windows/storage-configuration), the administrator would need to manually change the read caching policy from 'None' to 'Read-only' for each of the data files and make sure that the transaction log file(s) is always set to 'None'.

> [!NOTE] 
> It is important to make sure the SQL Server services are stopped before
> making any changes to the virtual machines caching policy to avoid the
> risk of corruption.
 
## Storage Configuration
It is critical to get the storage configuration implemented correctly to ensure consistent performance and reliability. You can always resize a virtual machine, but to change existing storage you often need to create a new storage architecture and migrate from the previous implementation which can lead to significant down time.

We will look at an example of how the [SQL Server IaaS Agent extension](https://docs.microsoft.com/en-us/azure/azure-sql/virtual-machines/windows/storage-configuration) can help make it easier to get a configured storage architecture.

For this example, we will configure a [Standard E16-8s_v3](../../../virtual-machines/ev3-esv3-series#esv3-series) that has 8 vCPUs, 128 GiB of memory, and a maximum disk count of 32 disks. 

Using the [SQL Server IaaS Agent extension](https://docs.microsoft.com/en-us/azure/azure-sql/virtual-machines/windows/storage-configuration) experience in the Azure portal makes storage configuration very straight forward as the defaults already guide us towards best practices. In the 'storage optimization' screen in the Azure portal, the data storage, log storage, and tempdb storage is separated pointing to three different drives. 

The default disk type is a P30 which has 5000 IOPS and 200 MBps. 

> [!NOTE] It is important to use 'Premium SSD' as the disk type to get 
> the guaranteed disk IOPS and throughput and to provide disk caching. 
> For 'Data storage', we will use the P30 and increase the number of 
> disks to 8 giving the performance potential of 40000 Max IOPS and 1600
> MBps Max Throughput. The capacity for 8 x P30 disks is 8192 GiB. 

> [!WARNING] Depending on the virtual machine size and limits, it may be necessary to use larger capacity disks due to the maximum number of disks the virtual machine supports.

> [!NOTE] The Azure Managed Disks P30, P40, and P50 all provide caching support.

When this configuration is applied, the data files selected for the F:/ drive will be placed in a disk stripe in Windows using 'Storage Spaces'. There will be 8 stripes matching the disk count applied to the disk stripe set that will help evenly balance the I/O across the disk set. The number of the stripes can be verified looking at the 'NumberofColumns' parameter in Storage Manager on Windows Server.

The number of columns specifies how many physical disks the data is striped across and therefore impacts performance. Basically, the more columns a storage space is assigned, the more disks can be striped across and therefore the higher the performance. 

This also impacts the number of disks that must be added to increase the size of the pool. If disks must be added they should be added in multiples of the column count to maintain performance. Often it is more efficient to increase the size of the disks in the pool rather than add more disks unless increasing the size of the existing disks would preclude the use of disk caching.

> [!NOTE] In the Azure portal you can create a stripe set with a number of columns up to 8. If you create a volume with more disks, 12 for example, you will still see 8 looking at the 'NumberofColumns' in Storage Manager on Windows Server. If you need to make the NumberofColumns greater than 8, you will need to use PowerShell to create the Storage Spaces stripe.

For 'Log storage', we will use a single P60 giving the potential of 16000 max IOPS and 500 MBps max throughput. It is recommended to focus on larger premium storage disks to support the capacity needs for your transaction log. The goal is to meet the storage and IOPS requirements with the minimum number of disks possible. This allows an administrator to reduce the number of disks when an organization needs to scale down the virtual machine as all VMs have a maximum number of disks it supports.

We do not recommend enabling caching support so we can use any premium storage disk all the way up to the P80.

Between the data and the log drive we have configured 9 data disks in total (8 data files for the data F:/ drive and a single file for the log G:/ drive). 

The tempdb database is targeted to the ephemeral D:/ drive by default according to best practices. You can use the drop down to place tempdb on its own separate storage drive, but we never recommend tempdb sharing a location with the data files and especially not the transaction log.

The architecture previously described matches the storage optimization screen from the [SQL Server IaaS Agent extension](https://docs.microsoft.com/en-us/azure/azure-sql/virtual-machines/windows/storage-configuration) experience in the screenshot below.

![Configure Data and Log Storage](./media/performance-guidelines-best-practices/configure_storage_data_log.png)

> [!NOTE] The warning at the bottom, that *'the desired performance might not be reached due to the maximum virtual machine disk performance cap. The selected VM size (Standard_E16-8s_v3) only supports up to 25600 disk max iops (currently 58000 iops), 384 disk max throughput in MBps (currently 2350 in MBps)'* means that we have added more disk IOPS and throughput than our virtual machine can handle. 

This can be verified by referring to the documentation for the [Standard E16-8s_v3](../../../virtual-machines/ev3-esv3-series#esv3-series) virtual machine.

### Disk striping
For more throughput, you can add additional data disks and use disk striping. To determine the number of data disks, you need to analyze the number of IOPS and bandwidth required for your log file(s), and for your data and tempdb file(s). Notice that different VM sizes have different limits on the number of IOPS and bandwidth supported, see the tables on IOPS per [VM size](../../../virtual-machines/sizes?toc=/azure/virtual-machines/windows/toc.json). Use the following guidelines:

* For Windows 8/Windows Server 2012 or later, use [Storage Spaces](https://docs.microsoft.com/en-us/previous-versions/windows/it-pro/windows-server-2012-R2-and-2012/hh831739(v=ws.11)) with the following guidelines:

  1. Set the interleave (stripe size) to 64 KB (65,536 bytes) for OLTP workloads and 256 KB (262,144 bytes) for data warehousing workloads to avoid performance impact due to partition misalignment. This must be set with PowerShell.

  2. Set column count = number of physical disks. Use PowerShell when configuring more than 8 disks (not Server Manager UI).

For example, the following PowerShell creates a new storage pool with the interleave size to 64 KB and the number of columns equal to the amount of physical disk in the storage pool:

  ```powershell
  $PhysicalDisks = Get-PhysicalDisk | Where-Object {$_.FriendlyName -like "*2" -or $_.FriendlyName -like "*3"}
  
  New-StoragePool -FriendlyName "DataFiles" -StorageSubsystemFriendlyName "Storage Spaces*" `
      -PhysicalDisks $PhysicalDisks | New- VirtualDisk -FriendlyName "DataFiles" `
      -Interleave 65536 -NumberOfColumns $PhysicalDisks .Count -ResiliencySettingName simple `
      –UseMaximumSize |Initialize-Disk -PartitionStyle GPT -PassThru |New-Partition -AssignDriveLetter `
      -UseMaximumSize |Format-Volume -FileSystem NTFS -NewFileSystemLabel "DataDisks" `
      -AllocationUnitSize 65536 -Confirm:$false 
  ```

  * For Windows 2008 R2 or earlier, you can use dynamic disks (OS striped volumes) and the stripe size is always 64 KB. This option is deprecated as of Windows 8/Windows Server 2012. For information, see the support statement at [Virtual Disk Service is transitioning to Windows Storage Management API](https://docs.microsoft.com/en-us/windows/win32/w8cookbook/vds-is-transitioning-to-wmiv2-based-windows-storage-management-api).
 
  * If you are using [Storage Spaces Direct (S2D)](https://docs.microsoft.com/en-us/windows-server/storage/storage-spaces/storage-spaces-direct-in-vm) with [SQL Server Failover Cluster Instances](https://docs.microsoft.com/en-us/azure/azure-sql/virtual-machines/windows/failover-cluster-instance-storage-spaces-direct-manually-configure), you must configure a single pool. Although different volumes can be created on that single pool, they will all share the same characteristics, such as the same caching policy.
 
  * Determine the number of disks associated with your storage pool based on your load expectations. Keep in mind that different VM sizes allow different numbers of attached data disks. For more information, see [Sizes for virtual machines](../../../virtual-machines/sizes?toc=/azure/virtual-machines/windows/toc.json).


## NTFS allocation unit size
When formatting the data disk, it is recommended that you use a 64-KB allocation unit size for data and log files as well as tempdb. If tempdb is placed on the temporary disk (D:\ drive) the performance gained by leveraging this drive outweighs the need for a 64-KB allocation unit size.

## Disk management best practices
When removing a data disk or changing its cache type, stop the SQL Server service during the change. When the caching settings are changed on the OS disk, Azure stops the VM, changes the cache type, and restarts the VM. When the cache settings of a data disk are changed, the VM is not stopped, but the data disk is detached from the VM during the change and then reattached.

> [!WARNING] Stop the SQL Server service when changing the cache setting of Azure Virtual Machines disks to avoid the possibility of any database corruption.

## Throttling
There are IOPS and throughput limits at both the disk level as well as the virtual machine. Additionally, the maximum IOPS limits per VM and per disk will differ and are independent of each other.

It is important to understand the needs of your source environment in terms of IOPS and throughput, but additionally you will need to select a storage configuration that fits within the limits of the virtual machine you select otherwise the application performance will be throttled.

For example, if you complete a performance baseline and discover that your application needs 12,000 IOPS and 180 MB/sec throughput, an administrator should look for a configuration that would meet these needs and give some space for growth. 

For storage, three P30 (5000 IOPS per disk and 200 MB/sec throughput per disk) disks in a disk stripe will deliver 15,000 IOPS and 600 MB/sec. This would certainly meet the requirements of the application.

However, if the administrator wants to leverage an M-series virtual machine they should either select the [Standard_M32ms](../../../virtual-machines/m-series) (max uncached disk throughput 20000 IOPS / 500 MBps) over the [Standard_M16ms](../../../virtual-machines/m-series) or rely on leveraging caching to address the performance limits. 

The [Standard_M16ms](../../../virtual-machines/m-series) has a max uncached disk throughput of 10000 IOPS and 250 MBps. Consequently, the [Standard_M16ms](../../../virtual-machines/m-series) can meet the throughput needs for the application, but not the uncached IOPS limits.

In this example, the throttling does not exceed the applications needs by much, it would be best to leverage the cached and temp storage capabilities (20000 IOPS / 200 MBps) to avoid the throttling impact.

The best practice is that administrators should select a virtual machine and disk size in a disk stripe that will meet application requirements and will not face throttling limitations. If throttling occurs it can be addressed by either increasing the size of the virtual machine, leveraging caching, or tuning the application so less IOPS and throughput are required.

If configuring a virtual machine to be scaled up during times of high usage and down at other times configure the storage to with enough IOPS and throughput to support the maximum size VM while keeping the overall number of disks less than or equal to the maximum number supported by the smallest VM SKU targeted to be used.

For more information on throttling limitations and leveraging caching to avoid throttling, see the reference below.

Virtual machine and disk performance
https://docs.microsoft.com/en-us/azure/virtual-machines/linux/disk-performance-linux 

## Monitoring Storage Performance for Azure VM
Azure provides several capabilities to monitor the health of your virtual machine including analyzing [Metrics](https://docs.microsoft.com/en-us/azure/azure-monitor/platform/data-platform-metrics), [Alerts](https://docs.microsoft.com/en-us/azure/azure-monitor/platform/alerts-metric-overview), [Insights](https://docs.microsoft.com/en-us/azure/azure-monitor/insights/vminsights-performance#view-performance-directly-from-an-azure-vm), and [Workbooks](https://docs.microsoft.com/en-us/azure/azure-monitor/platform/workbooks-overview). Many of these features have intersecting capabilities tracking resource performance over time and providing a means for administrators to analyze the data or, in the case of Insights and Workbooks, have some of the analysis provided by Azure analytics.

[Azure Monitor for VMs](https://docs.microsoft.com/en-us/azure/azure-monitor/overview) includes a set of performance charts that target several key performance indicators (KPIs) to help administrators determine how well a virtual machine is performing. The charts show resource utilization over an adjustable time range where administrators can identify bottlenecks and irregularities. The charts display the health of a single resource where an administrator can drill into the chart, add additional metrics, and make other adjustments to the visuals. 

[Azure Monitor for VMs](https://docs.microsoft.com/en-us/azure/azure-monitor/overview) monitors operating system and VM host performance related to processor, memory, network adapter, and disk capacity, and disk utilization. 

Note: In the diagnostic settings it is possible to add ASP.NET and SQL Server counters to gain access to these guest metrics.

The focus here will be on storage-based and virtual machine metrics that provides insight to the health of your environment. An administrator can discover the usage peaks of their environment, the general latency and health of their storage configuration, and if there is any throttling occurring at the disk or virtual machine level.

### Comparing to on-prem

Administrators may be used to leveraging performance monitor (perfmon) for Windows based platforms or IOstat for Linux based platforms. In order to obtain performance data from your source environment the counters below should be captured over peak windows and compared to typical business patterns. Administrators should size storage of the target environment by the IOPS and throughput while making certain that the source application fits into the memory and CPU limits of the virtual machine.

The table below outlines the performance monitor and IOstat counters that would be used to access the health of your source environment.

<style type="text/css">
.tg  {border-collapse:collapse;border-spacing:0;}
.tg td{border-color:black;border-style:solid;border-width:1px;font-family:Arial, sans-serif;font-size:14px;
  overflow:hidden;padding:10px 5px;word-break:normal;}
.tg th{border-color:black;border-style:solid;border-width:1px;font-family:Arial, sans-serif;font-size:14px;
  font-weight:normal;overflow:hidden;padding:10px 5px;word-break:normal;}
.tg .tg-0lax{text-align:left;vertical-align:top}
.tg .tg-0pky{border-color:inherit;text-align:left;vertical-align:top}
</style>
<table class="tg">
<thead>
  <tr>
    <th class="tg-0lax">Counter</th>
    <th class="tg-0lax">Description</th>
    <th class="tg-0lax">PerfMon</th>
    <th class="tg-0lax">Iostat</th>
  </tr>
</thead>
<tbody>
  <tr>
    <td class="tg-0pky" rowspan="3">IOPS or Transactions per second</td>
    <td class="tg-0pky" rowspan="3">Number of I/O requests issued to the storage disk per second.</td>
    <td class="tg-0pky">Disk Reads/sec</td>
    <td class="tg-0pky">tps</td>
  </tr>
  <tr>
    <td class="tg-0pky">Disk Writes/sec</td>
    <td class="tg-0pky">r/s</td>
  </tr>
  <tr>
    <td class="tg-0pky"></td>
    <td class="tg-0pky">w/s</td>
  </tr>
  <tr>
    <td class="tg-0pky" rowspan="2">Disk Reads and Writes</td>
    <td class="tg-0pky" rowspan="2">% of Reads and Write operations performed on the disk.</td>
    <td class="tg-0pky">% Disk Read Time</td>
    <td class="tg-0pky">r/s</td>
  </tr>
  <tr>
    <td class="tg-0pky">% Disk Write Time</td>
    <td class="tg-0pky">w/s</td>
  </tr>
  <tr>
    <td class="tg-0pky" rowspan="2">Throughput</td>
    <td class="tg-0pky" rowspan="2">Amount of data read from or written to the disk per second.</td>
    <td class="tg-0pky">Disk Read Bytes/sec</td>
    <td class="tg-0pky">kB_read/s</td>
  </tr>
  <tr>
    <td class="tg-0pky">Disk Write Bytes/sec</td>
    <td class="tg-0pky">kB_wrtn/s</td>
  </tr>
  <tr>
    <td class="tg-0pky">Max. Memory</td>
    <td class="tg-0pky">Amount of memory required to run application smoothly</td>
    <td class="tg-0pky">% Committed Bytes in Use</td>
    <td class="tg-0pky">Use vmstat</td>
  </tr>
  <tr>
    <td class="tg-0pky">Max. CPU</td>
    <td class="tg-0pky">Amount of memory required to run application smoothly</td>
    <td class="tg-0pky">% Processor time</td>
    <td class="tg-0pky">%util</td>
  </tr>
</tbody>
</table>

<br>

**Reference:**

Counters to measure application performance requirements

https://docs.microsoft.com/en-us/azure/virtual-machines/premium-storage-performance.md#counters-to-measure-application-performance-requirements

### Monitoring Azure Virtual Machines
Once the application has been migrated to an Azure SQL Virtual Machine it is still possible to leverage performance monitor (perfmon) or IOstat on the virtual machine. Additionally, we can leverage Azure Monitor and related capabilities in the Azure portal.

In the Azure Portal an administrator can get a quick view of the performance health of a virtual machine by opening the 'Virtual Machine' resource from the Azure dashboard, and clicking the Overview tab.
In the Overview tab you can see some quick Metrics already available from the host virtual machine.

The following counters are visible from the Overview tab.
*	CPU (average)
* Network (total)
* Disk bytes (total)
* Disk operations/sec (average)

![VM Disk Configuration](./media/performance-guidelines-best-practices/Azure_portal_overview_charts.png)

By clicking on any of the charts, an administrator can open the monitored resource in the metrics view. 

> [!NOTE] The thumb pin in the top right of each chart can be used to pin the chart to a default or custom dashboard to create a monitoring dashboard containing an organization's most critical metric, queries, and KPIs.

Here it is possible to add additional metrics, change the time range and granularity, change the line chart to other chart types, share the report to a link or download the metrics to Excel, and create alerts.

![Azure Portal Metrics CPU](./media/performance-guidelines-best-practices/Azure_portal_Metrics_CPU.png)

> [!NOTE] To enable additional performance counters, such as ASP.NET and SQL Server, and capture additional diagnostic data for Azure Monitor leverage the 'Diagnostic settings' capability in the Virtual Machine monitoring section.

### Storage IO utilization metrics

The metrics below help diagnose disk level capping for IOPS and throughput. The data disk metrics include all of the data disks configured for the virtual machine. If there are multiple drives configured the metrics will represent a combination of the data. 

### Disk Metrics

The OS disk metrics include only the local operating system disk. Currently the temporary ephemeral D:\ drive is not surfaced by these metrics.
* **Data Disk IOPS Consumed Percentage** - The percentage calculated by the data disk IOPS completed over the provisioned data disk IOPS. If this amount is at 100%, your application running is IO capped from your data disk's IOPS limit.
* **Data Disk Bandwidth Consumed Percentage** - The percentage calculated by the data disk throughput completed over the provisioned data disk throughput. If this amount is at 100%, your application running is IO capped from your data disk's bandwidth limit.
* **OS Disk IOPS Consumed Percentage** - The percentage calculated by the OS disk IOPS completed over the provisioned OS disk IOPS. If this amount is at 100%, your application running is IO capped from your OS disk's IOPS limit.
* **OS Disk Bandwidth Consumed Percentage** - The percentage calculated by the OS disk throughput completed over the provisioned OS disk throughput. If this amount is at 100%, your application running is IO capped from your OS disk's bandwidth limit.

Reference:
https://docs.microsoft.com/en-us/azure/virtual-machines/linux/disk-performance-linux#disk-performance-metrics

![Azure Portal Data Disk Bandwidth](./media/performance-guidelines-best-practices/Azure_Portal_Data_Disk_Bandwidth.png)


### Virtual Machine Metrics

The metrics listed below help diagnose VM level capping for IOPS and throughput. These metrics represent the limits of the virtual machine. For example, the [M-series](../../../virtual-machines/m-series) VMs uncached IOPS and bandwidth are represented in the column 'max uncached disk throughput: IOPS/MBps'. When these limitations are reached the metrics covered here can be used to identify an IO capping condition.

The metrics that monitor this data is represented as a percentage, if the limits are consumed at 100% for either IOPS or bandwidth it means that the throughput is capped at the virtual machine level due to the virtual machines documented limits. 

As described in the previous section, caching is a separate component local to the virtual machine that can improve read/write and read performance. For SQL Server workloads, caching will be important specifically for the data disks and 'read-only' caching.

*	**VM Cached IOPS Consumed Percentage** - The percentage calculated by the total IOPS completed over the max cached virtual machine IOPS limit. If this amount is at 100%, your application running is IO capped from your VM's cached IOPS limit.
*	**VM Cached Bandwidth Consumed Percentage** - The percentage calculated by the total disk throughput completed over the max cached virtual machine throughput. If this amount is at 100%, your application running is IO capped from your VM's cached bandwidth limit.
*	**VM Uncached IOPS Consumed Percentage** - The percentage calculated by the total IOPS on a virtual machine completed over the max uncached virtual machine IOPS limit. If this amount is at 100%, your application running is IO capped from your VM's uncached IOPS limit.
*	**VM Uncached Bandwidth Consumed Percentage** - The percentage calculated by the total disk throughput on a virtual machine completed over the max provisioned virtual machine throughput. If this amount is at 100%, your application running is IO capped from your VM's uncached bandwidth limit.

Reference:
https://docs.microsoft.com/en-us/azure/virtual-machines/linux/disk-performance-linux#disk-performance-metrics

![Azure Portal VM Bandwidth](./media/performance-guidelines-best-practices/Azure_Portal_Data_VM_Bandwidth.png)

The metrics below help diagnose cache level health for your OS local disks including temp D:\ as well as the cache for your data disks.

* Premium OS Disk Cache Read Hit (Preview)
* Premium Data Disk Cache Read Hit (Preview)
* Premium Data Disk Cache Read Miss (Preview)
* Premium OS Disk Cache Read Miss (Preview)

For additional information on how to chart performance with Azure Monitor for VMs refer to the following reference.

**How to chart performance with Azure Monitor for VMs**
https://docs.microsoft.com/en-us/azure/azure-monitor/insights/vminsights-performance 

For additional details on monitoring Azure Virtual Machines with Azure Monitor go to the article under same name to learn about the capabilities of Azure Monitor and what available in the Azure Portal.

For a list of the monitoring features that can be enabled and the configuration steps / actions that need to be taken in order to provide these features, see the reference below.

**Monitoring Azure virtual machines with Azure Monitor**

https://docs.microsoft.com/en-us/azure/azure-monitor/insights/monitor-vm-azure

### Write acceleration

Write Acceleration is a disk feature that is only available for the M-Series Virtual Machines (VMs). The purpose of write acceleration is to improve the I/O latency of writes against Azure Premium Storage when you need single digit I/O latency due to high volume mission critical OLTP workloads or data warehouse environments. 

It is not recommended to use Write Accelerator for the SQL Server data files. Write Acceleration is best suited to address latency involving SQL Server log file write activity. 

*Restrictions*

There are some restrictions regarding Write Acceleration. Premium disk caching should be set to 'None' for the transaction log drive and no other caching modes are supported. The only caching mode that should be used for the log drive is 'None' with or without enabling Write Acceleration.

There are limits to the number of write accelerator disks that are supported per virtual machine. Additionally, there are IOPS limits at the virtual machine level, this is not governed per disk, that can be supported by Write Acceleration. All Write Acceleration disks share the same IOPS limits per VM.

The chart below outlines the virtual machines and the number of disks that are supported along with the IOPS per VM.

| VM SKU  | # Write Accelerator disks  | Write Accelerator disk IOPS per VM  |
|---|---|---|
| M416ms_v2, M416s_v2  | 16  | 20000  |
| M128ms, M128s  | 16  | 20000  |
| M208ms_v2, M208s_v2  | 8  | 10000  |
| M64ms, M64ls, M64s  |  8 | 10000 |
| M32ms, M32ls, M32ts, M32s  | 4  | 5000  |
| M16ms, M16s  | 2 | 2500 |
| M8ms, M8s  | 1 | 1250 |

For other restrictions see the following article:
**Restrictions when using Write Accelerator**
https://docs.microsoft.com/en-us/azure/virtual-machines/how-to-enable-write-accelerator#restrictions-when-using-write-accelerator

### Enabling Write Acceleration ###

When you are enabling Write Acceleration, it is recommended to make sure SQL Server activity is stopped as you are adjusting the caching policy for the virtual machine. For this reason, all activity referencing the transaction log drive should be stopped including the SQL Server services. 

If you have leveraged multiple disks in a disk striping configuration, all disks in the volume must be enabled or disabled for Write Acceleration in separate steps. Before enabling or disabling Write Acceleration on individual disks in a disk stripe, you should first shut down the Azure VM before making the changes.

To enable Write Acceleration on a specific disk you can use the Azure Portal, PowerShell, Azure CLI, or Rest APIs.

*Azure Portal*

To enable Write Acceleration in the Azure Portal you would first select Disks in the Virtual Machine settings and then change the Host Caching policy for the transaction log disks to 'Note + Write Accelerator' as shown below.

![Write Acceleration](../../../virtual-machines/media/virtual-machines-common-how-to-enable-write-accelerator/wa_scrnsht.png)

*Best Practice*

It is recommended to use a single large capacity Premium disk for the transaction log with the host caching policy for the disk to be set to 'None'. 

It is recommended to use the minimum number of disks to achieve the required space and IOPS to enable a wider range of machines to scale to. Often a single large disk is sufficient for a log drive but this must be confirmed by collecting metrics for any existing workloads. 

It is recommended to enable write acceleration before you start migrating production databases to your virtual machine.

It is recommended to have the SQL Server services stopped before making any changes to the caching policy for your Azure Virtual Machine. This includes enabling Write Acceleration. 

### Comparing to Ultra Disk ###

The biggest difference between Write Acceleration and Azure Ultra Disks is that Write Acceleration is a virtual machine feature only available for the M-Series and Azure Ultra Disks is an actual storage option. Write Acceleration is essentially a write optimized cache with its own limitations based on the virtual machine size. Azure ultra-disks are a low latency disk storage option for Azure Virtual Machines. 

It is always recommended to leverage write acceleration over Ultra Disks when you are using M-Series virtual machines. For other virtual machine series that still need the low latency performance for the transaction log, it is recommended to leverage Azure Ultra Disks.

When you are on a virtual machine series that does not support write acceleration, the key points below should be considered to address low latency storage needs.

* Azure Ultra Disks are supported on the following VM series: ESv3, Easv4, Edsv4, Esv4, DSv3, Dasv4, Ddsv4, Dsv4, FSv2, LSv2, M, and Mv2 series.
* Ultra disks are designed to provide sub-millisecond latencies and target IOPS and throughput described in the preceding table 99.99% of the time.
* *Ultra disks come in several fixed sizes, ranging from 4 GiB up to 64 TiB, and feature a flexible performance configuration model that allows you to independently configure IOPS and throughput.
* Ultra disks are a strong option for database intensive workloads such as SQL Server, especially when there are transaction-heavy workloads. 
* Ultra disks can only be used for data and log data disks, though it is important to note that Azure Ultra Disks do not support read or write caching.
* Use the minimum number of disks possible to meet the required space and IOPS to enable a wider range of machines to scale to.

For a list of the potential restrictions for using Azure Ultra Disks, see the following reference:

**Using Azure Ultra Disks**

https://docs.microsoft.com/en-us/azure/virtual-machines/disks-enable-ultra-ssd?tabs=azure-portal 

## Storage Design Best Practices

### Configure "ReadOnly" cache on premium storage disks hosting data files.
*	The fast reads from cache lower the SQL Server query time since data pages are retrieved much faster from the cache compared to directly from the data disks.
* Serving reads from cache, means there is additional throughput available from premium data disks. SQL Server can use this additional throughput towards retrieving more data pages and other operations like backup/restore, batch loads, and index rebuilds.

### Configure "None" cache on premium storage disks hosting the log files.
*	Log files have primarily write-heavy operations. Therefore, they do not benefit from the ReadOnly cache. Additionally, 'Read/Write' can lead to data corruption. Only use 'None' for the log file caching policy.
*	In certain heavy write workloads, better performance might be achieved with no caching. This can only be determined through testing.
*	For test results on various disk and workload configurations, see the following blog post: [Storage Configuration Guidelines for SQL Server on Azure Virtual Machines](https://docs.microsoft.com/en-us/archive/blogs/sqlserverstorageengine/storage-configuration-guidelines-for-sql-server-on-azure-vm).
*	For instructions on configuring disk caching, see the following articles. For the classic (ASM) deployment model see: [Set-AzureOSDisk](https://docs.microsoft.com/en-us/previous-versions/azure/jj152847(v=azure.100)) and [Set-AzureDataDisk](https://docs.microsoft.com/en-us/previous-versions/azure/jj152851(v=azure.100)). For the Azure Resource Manager deployment model, see: [Set-AzOSDisk](https://docs.microsoft.com/en-us/powershell/module/az.compute/set-azvmosdisk) and [Set-AzVMDataDisk](https://docs.microsoft.com/en-us/powershell/module/az.compute/set-azvmdatadisk).

Use Disk Striping and Storage Pools to increase performance and capacity
*	If you are using disk striping in a single storage pool, most workloads will benefit from read caching. If you have separate storage pools for the log and data files, enable read caching only on the storage pool for the data files. 

*	When you provision a SQL Server VM in the portal, you have the option of editing your storage configuration. Depending on your configuration, Azure configures one or more disks. Multiple disks are combined into a single storage pool with striping. Both the data and log files reside together in this configuration. For more information, see [Storage configuration for SQL Server VMs](https://docs.microsoft.com/en-us/azure/azure-sql/virtual-machines/windows/storage-configuration).

### Move system SQL Server databases, error logs, and defaults off of the local OS drive

*	Move SQL Server error log and trace file directories to data disks. This can be done in SQL Server Configuration Manager by right clicking your SQL Server instance and selecting properties. The error log and trace file settings can be changed in the Startup Parameters tab. The Dump Directory is specified in the Advanced tab. The following screenshot shows where to look for the error log startup parameter.

![SQL Server Error Log Location](./media/performance-guidelines-best-practices/sql_server_error_log_location.png)


*	Set up default backup and database file locations. Use the recommendations in this article, and make the changes in the Server properties window. For instructions, see [View or Change the Default Locations for Data and Log Files (SQL Server Management Studio)](https://docs.microsoft.com/en-us/sql/database-engine/configure-windows/view-or-change-the-default-locations-for-data-and-log-files). The following screenshot demonstrates where to make these changes.


![SQL Server Error Log Location](./media/performance-guidelines-best-practices/sql_server_default_data_log_backup_locations.png)


## Next steps

To learn more, see the other articles in this series:
- [Quick checklist](performance-guidelines-best-practices-checklist.md)
- [VM size](performance-guidelines-best-practices-vm-size.md)
- [Azure & SQL feature specific](performance-guidelines-best-practices-feature-specific.md)
- [Collect baseline](performance-guidelines-best-practices-collect-baseline.md)

For security best practices, see [Security considerations for SQL Server on Azure Virtual Machines](security-considerations-best-practices.md).

Review other SQL Server Virtual Machine articles at [SQL Server on Azure Virtual Machines Overview](sql-server-on-azure-vm-iaas-what-is-overview.md). If you have questions about SQL Server virtual machines, see the [Frequently Asked Questions](frequently-asked-questions-faq.md).

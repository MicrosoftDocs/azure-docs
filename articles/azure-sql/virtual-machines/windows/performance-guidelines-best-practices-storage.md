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
- Buffer your throughput capacity by at least 20% more than your workload requires. 
- Provision the storage account in the same region as the SQL Server VM. 
- Disable Azure geo-redundant storage (geo-replication) on the storage account.
- Configure read-only cache for data files and disable cache for the log file. Stop the SQL Server service when changing the cache settings your disk.
- For workloads requiring IO latencies < 1-ms, enable write accelerator for the M series and consider using Ultra SSD disks for the Es and DS series virtual machines.
- Stripe multiple Azure data disks using Storage Spaces to gain increased storage throughput up to the largest target virtual machine's IOPS and throughput limits.
- Place tempdb on the local SSD D:\ drive for most SQL Server workloads after choosing the correct VM size. SQL Server VMs created from the Azure marketplace are already configured with tempdb using the local ephemeral D:\ drive. 
   - If the capacity of the local drive is not enough for your tempdb size, then place tempdb on a storage pool striped on premium SSD disks with read-only caching.
   - If utilization of the local Azure cache is a concern, consider placing tempdb on a separate data drive with read-caching enabled to prevent overconsmuption of the local cache.  


The local and temp disks leverage the virtual machine cache, which is where tempdb is typically placed.

## Overview

Azure virtual machines use Azure Managed Disks, such as standard HDD disks, standard SSD, premium SSD disks, and ultra-disks, as the underlying storage. Premium storage supports a storage cache that helps improve read and read/write performance. Finally, there are Azure virtual machine features that influence storage performance such as bursting and write acceleration. 

Choosing which Azure managed disks to use is an important consideration in storage design. The disk type dictates the type of storage volume you can create, where you place the files, how the disks are formatted, and which features are supported.

It is also important to understand how a virtual machine addresses the presented storage. Virtual machine storage components such as uncached and cached managed disks and the performance levels of storage access from the virtual machine can impact the performance of your SQL Server. 

For a detailed explanation of managed disk provisioning such as disk allocation and performance, see [Managed disks overview](../../../virtual-machines/managed-disks-overview.md).

Provisioning a SQL Server VM through the Azure portal helps guide you through the storage configuration process and implements storage best practices such as creating separate storage pools for your data and log files, targeting tempdb to the D:\ drive, and enabling the optimal caching policy. For more information about provisioning and configuring storage, see [SQL VM storage configuration](storage-configuration.md). 

## Portal configuration 
 
It is critical to get the storage configuration implemented correctly to ensure consistent performance and reliability. You can always resize a virtual machine, but to change existing storage you often need to create a new storage architecture and migrate from the previous implementation which can lead to significant down time.
 
Use the [storage configuration](../../../azure-sql/virtual-machines/windows/storage-configuration) experience in the Azure portal to automatically configure your storage according to best practices.


## Performance metrics 

For SQL Server workloads we measure application performance by the number of requests that an application can process per unit of time. We do this by capturing the user requests, batch requests, and transactions per second. Depending on the application we may also capture concurrent users along with memory, CPU, and disk related counters. 

It is important to understand the needs of your business application in terms of throughput and select a storage configuration that fits within the limits of the virtual machine, with a buffer, if possible.

To assess storage needs, and determine how well storage is performing, you need to understand what to measure, and what those indicators mean. 

[IOPS (Input/Output per second)](../../../virtual-machines/premium-storage-performance.md#iops) is the number of requests the application is making to storage per second. Measure IOPS using Performance Monitor counters `Avg. Disk sec/read` and `Avg. Disk sec/writes`. Together these counters are the transfers that address the underlying storage. [OLTP (Online transaction processing)](/azure/architecture/data-guide/relational-data/online-transaction-processing) applications need to drive higher IOPS in order to achieve optimal performance. Applications such as payment processing systems, online shopping, and retail point-of-sale systems are all examples of OLTP applications.

[Throughput](../../../virtual-machines/premium-storage-performance.md#throughput) is the volume of data that is being sent to the underlying storage, often measured by megabytes per second. Measure throughput with the Performance Monitor counters `Disk read bytes/sec` and `Disk write bytes/sec`. [Data warehousing](/azure/architecture/data-guide/relational-data/data-warehousing) is optimized around maximizing throughput over IOPS. Applications such as data stores for analysis, reporting, ETL workstreams, and other business intelligence targets are all examples of data warehousing applications.

IO unit sizes influence IOPS and throughput capabilities as smaller IO sizes yield higher IOPS and larger IO sizes yield higher throughput. SQL Server chooses the optimal IO size automatically. For more information about, see [Optimize IOPS, throughput, and latency for your applications](../../../virtual-machines/premium-storage-performance.md#optimize-iops-throughput-and-latency-at-a-glance). 


## Cache throughput

Virtual machines combine premium disks to increase IOPS and throughput up to the virtual machine limits. Virtual machines that support premium storage caching can take advantage of a feature called BlobCache or host caching to extend the IOPS and throughput capabilities of a virtual machine. Virtual machines that are enabled for both premium storage and premium storage caching have these two different storage bandwidth limits.

Find a virtual machine that can handle your application workload via the virtual machine's maximum uncached disk throughput limits. The maximum cached limits provide an additional buffer for reads that helps address growth and unexpected peaks.

Enable premium caching whenever the option is supported to significantly improve performance for reads against the data drive. 

Reads and writes to the Azure BlobCache (cached IOPS and throughput) do not count against the uncached IOPS and throughput limits of the virtual machine.

> [!NOTE]
> Disk Caching is not supported for disks 4 TiB and larger (P60 and larger). If multiple disks are attached to your VM, each disk that is smaller than 4 TiB will support caching. For more information, see [Disk caching](../../../virtual-machines/premium-storage-performance.md#disk-caching). 

### Uncached throughput

The max uncached disk IOPS and throughput is the maximum remote storage limit that the virtual machine can handle. This limit is defined at the virtual machine level and is not a limit of the underlying disk storage. This limit applies only to I/O against data drives attached to the VM, not local I/O against the temp drive (D drive) or the OS drive.

The amount of uncached IOPS and throughput that is available for a VM can be verified in the documentation for your virtual machine.

For example, the [M-series](../../../virtual-machines/m-series.md) documentation shows that the max uncached throughput for the Standard_M8ms VM is 5000 IOPS and 125 MBps of uncached disk throughput. 

![M-series Uncached Disk Throughput](./media/performance-guidelines-best-practices/M-Series_table.png)

Likewise, you can see that the Standard_M32ts supports 20000 uncached disk IOPS and 500 MBps uncached disk throughput. This limit is governed at the virtual machine level despite the configuration of the underlying premium disk storage.

For more information, see [uncached and cached limits](../../../virtual-machines/linux/disk-performance-linux.md#virtual-machine-uncached-vs-cached-limits).


### Cached and temp storage throughput

The max cached and temp storage throughput limit is a separate limit from the uncached throughput limit on the virtual machine. This limit governs the I/O against the local temp drive (D drive) and the Azure BlobCache if host caching - also known as Premium Storage caching - is enabled. The Azure BlobCache consists of a combination of the host virtual machine's random-access memory and the VM's local SSD. The local temp drive (D drive) is also hosted on this SSD.

When caching is enabled on premium storage, virtual machines can scale beyond the limitations of the uncached VM IOPS and throughput limits, or the underlying disk subsystem. Only certain virtual machines support both premium storage, and premium storage caching so if this is important to your business, choose your virtual machine carefully. 

For example, the [M-series](../../../virtual-machines/m-series.md) documentation indicates that both premium storage, and premium storage caching is supported: 

![M-Series Premium Storage Support](./media/performance-guidelines-best-practices/M-Series_table_premium_support.png)

The limits of the cache will vary based on the virtual machine size. For example, the Standard_M8ms VM supports 10000 cached disk IOPS and 1000 MBps cached disk throughput with a total cache size of 793 Gib. Likewise, the Standard_M32ts VM supports 40000 cached disk IOPS and 400 MBps cached disk throughput with a total cache size of 3174 GiB. 

![M-series Cached Disk Throughput](./media/performance-guidelines-best-practices/M-Series_table_cached_temp.png)

You can manually enable host caching on an existing VM though you should stop all application workloads and the SQL Server services before any changes are made to your virtual machine's caching policy. Changing any of the virtual machine cache settings results in the target disk being detached and re-attached after the settings are applied.


## Data file caching policies

Your storage caching policy varies depending on the type of SQL Server data file is hosted on the drive. 

here's a table to present the same information as the text below, which looks better? 

|SQL Server disk |Recommendation |
|---------|---------|
| Data disk |  Enable read-only caching for the disks hosting SQL Server data files. ReadOnly caching has improved read latency and higher IOPS and throughput since the reads will be coming directly from the optimized cache which is local in the virtual machines RAM and local SSD.  <br/><br/>Reads from cache will be much faster than the uncached reads from the data disk. Additionally, reads provided by the Azure BlobCache do not count against the virtual machine's uncached IOPS and throughput limits providing the ability to scale beyond these limitations.       |
|Transaction log disk|Set the caching policy to `None` for disks hosting the transaction log.  Not only is there no performance benefit to enabling caching, but there is a potential for corruption if the `Read/Write` caching policy is enabled.  |
|Operating OS disk | The default caching policy is Read/write for the premium disk Virtual Machine OS drive. It is not recommended to change the caching level of the OS drive.  <br/><br/>If the OS drive is Standard HDD then the default will be set to 'Read-only'. The Read/write caching level is meant for workloads that achieve a balance of read and write operations. |
| tempdb| The local and temp disks leverage the virtual machine cache, which is where tempdb is typically placed. If tempdb cannot be placed on the ephemeral drive D:/ due to capacity reasons, either resize the virtual machine to get a larger ephemeral drive or place tempdb on a separate data drive with Read-only caching configured.| 

To learn more, see [Disk caching](../../../virtual-machines/premium-storage-performance.md#disk-caching). 

For test results on various disk and workload configurations, see the following blog post: [Storage Configuration Guidelines for SQL Server on Azure Virtual Machines](https://docs.microsoft.com/en-us/archive/blogs/sqlserverstorageengine/storage-configuration-guidelines-for-sql-server-on-azure-vm)

### Data files 

Enable read-only caching for the disks hosting SQL Server data files. ReadOnly caching has improved read latency and higher IOPS and throughput since the reads will be coming directly from the optimized cache which is local in the virtual machines RAM and local SSD. 

Reads from cache will be much faster than the uncached reads from the data disk. Additionally, reads provided by the Azure BlobCache do not count against the virtual machine's uncached IOPS and throughput limits providing the ability to scale beyond these limitations. 

The fast reads from cache lower the SQL Server query time since data pages are retrieved much faster from the cache compared to directly from the data disks.

Serving reads from cache, means there is additional throughput available from premium data disks. SQL Server can use this additional throughput towards retrieving more data pages and other operations like backup/restore, batch loads, and index rebuilds.

### Transaction log files

Set the caching policy to `None` for disks hosting the transaction log.  Not only is there no performance benefit to enabling caching, but there is a potential for corruption if the `Read/Write` caching policy is enabled. 

Log files have primarily write-heavy operations. Therefore, they do not benefit from the ReadOnly cache. Additionally, 'Read/Write' can lead to data corruption. Only use 'None' for the log file caching policy.



### Operating System (OS) disk

The default caching policy is Read/write for the premium disk Virtual Machine OS drive. It is not recommended to change the caching level of the OS drive.

If the OS drive is Standard HDD then the default will be set to 'Read-only'. The Read/write caching level is meant for workloads that achieve a balance of read and write operations. 


### tempdb

The local and temp disks leverage the virtual machine cache, which is where tempdb is typically placed. If tempdb cannot be placed on the ephemeral drive D:/ due to capacity reasons, either resize the virtual machine to get a larger ephemeral drive or place tempdb on a separate data drive with Read-only caching configured.



## Disk striping

For more throughput, you can add additional data disks and use disk striping. To determine the number of data disks, analyze the throughput and bandwidth required for your SQL Server data files, including the log and tempdb. Throughput and bandwidth limits vary by VM size. To learn more, see [VM Size](../../../virtual-machines/sizes.md)

For example, an application that needs 12,0000 IOPS and 180 MBs/ throughput can leverage three striped P30 disks to deliver 15,000 IOPS and 600 MB/s throughput. 

If you are using disk striping in a single storage pool, most workloads will benefit from read caching. If you have separate storage pools for the log and data files, enable read caching only on the storage pool for the data files. 


To configure disk striping, see [disk striping](storage-configuration.md#disk-striping). 


## Allocation unit size

Format your data disk drive to use 64-KB allocation unit size for data and log files, as well as tempdb if placed on a drive other than the temporary local disk (D:\ drive). Although the temporary disk is not formatted to the 64-KB allocation unit size, the performance of the drive speed outweighs the need for the 64-KB allocation unit size. 

SQL Server VMs deployed through the Azure portal come with data disks formatted with 64-KB allocation unit size. 

## Throttling

There are throughput limits at both the disk and virtual machine level. The maximum IOPS limits per VM and per disk differ and are independent of each other.

Applications that consume resources beyond these limits might be throttled. Select a virtual machine and disk size in a disk stripe that meets application requirements and will not face throttling limitations. To address throttling, leverage caching, or tune the application so that less throughput is required. 

For example, an application that needs 12,000 IOPS and 180 MB/s can: 
- Use the [Standard_M32ms](../../../virtual-machines/m-series.md) which have a max uncached disk throughput of 20,0000 IOPS and 500 MBps.
- Stripe three P30 disks to deliver 15,000 IOPS and 600 MB/s throughput.
- Use a [Standard_M16ms](../../../virtual-machines/m-series.md) disk and leverage host caching to utilize local cache over consuming throughput. 


Virtual machines configured to scale up during times of high utilization should provision storage with enough IOPS and throughput to support the maximum size VM while keeping the overall number of disks less than or equal to the maximum number supported by the smallest VM SKU targeted to be used.

If configuring a virtual machine to be scaled up during times of high usage and down at other times configure the storage to with enough IOPS and throughput to support the maximum size VM while keeping the overall number of disks less than or equal to the maximum number supported by the smallest VM SKU targeted to be used.

For more information, see [Disk IO capping](../../../virtual-machines/disks-performance.md) on throttling limitations and leveraging caching to avoid throttling, see the reference below.


## Monitor storage performance

Azure provides several capabilities to monitor the health of your virtual machine including analyzing [Metrics](../../../azure-monitor/platform/data-platform-metrics.md), [Alerts](../../../azure-monitor/platform/alerts-metric-overview.md), [Insights](../../../azure-monitor/insights/vminsights-performance.md#view-performance-directly-from-an-azure-vm), and [Workbooks](../../../azure-monitor/platform/workbooks-overview.md). Many of these features have intersecting capabilities tracking resource performance over time and providing a means for administrators to analyze the data or, in the case of Insights and Workbooks, have some of the analysis provided by Azure analytics.

[Azure Monitor for VMs](../../../azure-monitor/overview.md) monitors operating system and VM host performance related to processor, memory, network adapter, and disk capacity, and disk utilization. Azure Monitor includes a set of performance charts that target several key performance indicators (KPIs) to help administrators determine how well a virtual machine is performing. The charts show resource utilization over an adjustable time range where administrators can identify bottlenecks and irregularities. The charts display the health of a single resource where an administrator can drill into the chart, add additional metrics, and make other adjustments to the visuals. 

Using Azure Monitor, administrator can discover the usage peaks of their environment, the general latency and health of their storage configuration, and if there is any throttling occurring at the disk or virtual machine level.

> [!NOTE]
> Azure Monitor does not currently monitor the consumption of the ephemeral drive, so reporting may not reflect tempdb utilization.

## Write Acceleration

Write Acceleration is a disk feature that is only available for the M-Series Virtual Machines (VMs). The purpose of write acceleration is to improve the I/O latency of writes against Azure Premium Storage when you need single digit I/O latency due to high volume mission critical OLTP workloads or data warehouse environments. 

Use Write Acceleration to improve write latency to the drive hosting the log files. Do not use Write Acceleration for SQL Server data files. 

Consider the following restrictions with Write Acceleration:
- Set premium disk caching to `None` for the transaction log drive. 
- There are limits to the number of Write Accelerator disks that are supported per virtual machine. 
- Write Acceleration disks share the same IOPS limits as the virtual machine. 


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

To learn more, see [Restrictions when using WRite Accelerator](../../../virtual-machines/how-to-enable-write-accelerator.md#restrictions-when-using-write-accelerator).


### Comparing to Ultra Disk

The biggest difference between Write Acceleration and Azure Ultra Disks is that Write Acceleration is a virtual machine feature only available for the M-Series and Azure Ultra Disks is a storage option. Write Acceleration is a write-optimized cache with its own limitations based on the virtual machine size. Azure ultra-disks are a low latency disk storage option for Azure Virtual Machines. 

If possible, use Write Acceleration over Ultra Disks for the transaction log disk. For virtual machines that do not support Write Acceleration but require low latency to the transaction log, use Azure Ultra Disks. 


## Move other files 

Move SQL Server error log and trace file directories to data disks. This can be done in SQL Server Configuration Manager by right-clicking your SQL Server instance and selecting properties. The error log and trace file settings can be changed in the Startup Parameters tab. The Dump Directory is specified in the Advanced tab. 

The following screenshot shows where to look for the error log startup parameter: 

![SQL Server Error Log Location](./media/performance-guidelines-best-practices/sql_server_error_log_location.png)


Set up default backup file locations. For instructions, see [Change default backup location](/sql/database-engine/configure-windows/view-or-change-the-default-locations-for-data-and-log-files).

The following screenshot demonstrates where to make these changes in the SQL Server options in SQL Server Management Studio: 

![SQL Server Error Log Location](./media/performance-guidelines-best-practices/sql_server_default_data_log_backup_locations.png)


## Next steps

To learn more about performance best practices, see the other articles in this series:
- [Quick checklist](performance-guidelines-best-practices-checklist.md)
- [VM size](performance-guidelines-best-practices-vm-size.md)
- [Azure & SQL feature specific](performance-guidelines-best-practices-feature-specific.md)
- [Collect baseline](performance-guidelines-best-practices-collect-baseline.md)

For security best practices, see [Security considerations for SQL Server on Azure Virtual Machines](security-considerations-best-practices.md).

Review other SQL Server Virtual Machine articles at [SQL Server on Azure Virtual Machines Overview](sql-server-on-azure-vm-iaas-what-is-overview.md). If you have questions about SQL Server virtual machines, see the [Frequently Asked Questions](frequently-asked-questions-faq.md).

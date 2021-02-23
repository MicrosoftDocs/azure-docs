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
ms.date: 01/27/2021
ms.author: dplessMSFT
ms.reviewer: jroth
---
# Storage: Performance best practices for SQL Server on Azure VMs
[!INCLUDE[appliesto-sqlvm](../../includes/appliesto-sqlvm.md)]

This article provides storage best practices and guidelines to optimize performance for your SQL Server on Azure Virtual Machines (VMs).

To learn more, see the other performance best practices articles: [Quick checklist](performance-guidelines-best-practices-checklist.md), [VM size](performance-guidelines-best-practices-vm-size.md), [Disks](performance-guidelines-best-practices-disks.md), [Azure & SQL feature specific](performance-guidelines-best-practices-feature-specific.md), [Collect baseline](performance-guidelines-best-practices-collect-baseline.md)

## Check list

- Monitor the application and determine storage latency requirements for SQL Server data, log, and tempdb files before choosing the disk type. Choose UltraDisks for latencies less than 1 ms, otherwise use Premium SSD. Provision different types of drives for the data and log files if the latency requirements vary. 
- Only use premium P30, P40, P50 disks for the data drive, and optimize for capacity on the log drive (P30 - P80).
- Place data, log, and tempdb files on separate drives.
    - Set host caching to read only for data files
    - Set host caching to none for log files. 
- Buffer your throughput capacity by at least 20% more than your workload requires. 
- Provision the storage account in the same region as the SQL Server VM. 
- Disable Azure geo-redundant storage (geo-replication) on the storage account.
Stop the SQL Server service when changing the cache settings your disk.
- For workloads requiring IO latencies < 1-ms, enable write accelerator for the M series and consider using Ultra SSD disks for the Es and DS series virtual machines.
- Stripe multiple Azure data disks using Storage Spaces to gain increased storage throughput up to the largest target virtual machine's IOPS and throughput limits.
- Place tempdb on the local SSD D:\ drive for most SQL Server workloads after choosing the correct VM size. If the capacity of the local drive is not enough for your tempdb size, see [tempdb caching](#tempdb) for more information.
- Optimize for highest uncached IOPS for best performance and leverage caching as a performance feature for data reads.
- Standard storage is only recommended for development and test purposes or for backup files and should not be used for production workloads.
- Bursting should be only considered for smaller departmental systems and dev/test workloads.
- Use Ultra Disks if less than 1-ms storage latencies are required for the transaction log and write acceleration is not an option. 



## Overview

To find the most effective storage configuration for SQL Server workloads on an Azure VM, start by measuring performance of your business application.  Once storage requirements are known, select a SKU that supports the necessary IOPs and throughput with the appropriate core-to-memory ratio. Choose the correct VM size with enough storage scale limits for your workload, and choose a mixture of disks to meet capacity and performance needs. 

The type of disk you use for your SQL Server depends on both the type of files that will be hosted on the disk, and also your application performance requirements. 

This article provides information about the different type of files SQL Server uses, the different types of data disks there are, and which disks to use based on your workload. 

Provisioning a SQL Server VM through Azure Marketplaces simplifies and streamlines the storage configuration process. To learn more, see [Storage configuration](storage-configuration.md).

Azure virtual machines use Azure Managed Disks, such as Standard HDD disks, Standard SSD, Premium SSD disks, and Ultra Disks, as the underlying storage. Premium storage supports a storage cache that helps improve read and read/write performance. Additionally, there are Azure virtual machine features that influence storage performance such as bursting, and write acceleration.  For a detailed explanation of managed disk provisioning such as disk allocation and performance, see [Managed disks overview](../../../virtual-machines/managed-disks-overview.md).

Provisioning a SQL Server VM through the Azure portal helps guide you through the storage configuration process and implements storage best practices such as creating separate storage pools for your data and log files, targeting tempdb to the D:\ drive, and enabling the optimal caching policy. For more information about provisioning and configuring storage, see [SQL VM storage configuration](storage-configuration.md). 



## Performance metrics 

For SQL Server workloads we measure application performance by the number of requests that an application can process per unit of time. We do this by capturing the user requests, batch requests, and transactions per second. Depending on the application we may also capture concurrent users along with memory, CPU, and disk related counters. 

It is important to understand the needs of your business application in terms of throughput and select a storage configuration that fits within the limits of the virtual machine, with a buffer, if possible.

To assess storage needs, and determine how well storage is performing, you need to understand what to measure, and what those indicators mean. 

[IOPS (Input/Output per second)](../../../virtual-machines/premium-storage-performance.md#iops) is the number of requests the application is making to storage per second. Measure IOPS using Performance Monitor counters `Avg. Disk sec/read` and `Avg. Disk sec/writes`. Together these counters are the transfers that address the underlying storage. [OLTP (Online transaction processing)](/azure/architecture/data-guide/relational-data/online-transaction-processing) applications need to drive higher IOPS in order to achieve optimal performance. Applications such as payment processing systems, online shopping, and retail point-of-sale systems are all examples of OLTP applications.

[Throughput](../../../virtual-machines/premium-storage-performance.md#throughput) is the volume of data that is being sent to the underlying storage, often measured by megabytes per second. Measure throughput with the Performance Monitor counters `Disk read bytes/sec` and `Disk write bytes/sec`. [Data warehousing](/azure/architecture/data-guide/relational-data/data-warehousing) is optimized around maximizing throughput over IOPS. Applications such as data stores for analysis, reporting, ETL workstreams, and other business intelligence targets are all examples of data warehousing applications.

IO unit sizes influence IOPS and throughput capabilities as smaller IO sizes yield higher IOPS and larger IO sizes yield higher throughput. SQL Server chooses the optimal IO size automatically. For more information about, see [Optimize IOPS, throughput, and latency for your applications](../../../virtual-machines/premium-storage-performance.md#optimize-iops-throughput-and-latency-at-a-glance). 

## VM disk types

Azure Managed Disks are block-level storage volumes designed for Azure Virtual Machines. Azure Managed Disks are similar to the virtual disks you leverage in an on-premises environment where you choose your disk type, capacity, and then provision the disk. The performance of the disk increases with the capacity, grouped by [premium disk labels](../../../virtual-machines/disks-types.md#premium-ssd) such as the P1 with 4GiB of space and 120 IOPs to the P80 with 32TiB of storage and 20,000 IOPs.

There are three main [disk types](../../../virtual-machines/managed-disks-overview.md#disk-roles) to consider for your SQL Server on Azure VM -  an OS disk, a temporary disk, and your data disks. The data disks host your SQL Server data files, log files, and other necessary files such as the error log, etc. 

The virtual machine you select comes with the operating system disk and, in many cases depending on your virtual machine, a temporary disk. For example, a [Standard_M128ms](../../../virtual-machines/m-series.md) includes a temporary storage (SSD) drive of 4096 GiB and 128 GBs for the operating system disk which can be [expanded if necessary](../../../virtual-machines/windows/expand-os-disk.md).

What is important about the operating system drive (C:\) and the temporary drive (D:\) is choosing what is stored on these local system disks.

Add data disks and customize the speed and capacity based on your business needs. 


### Operating system disk

An operating system disk is a VHD that can be booted and mounted as a running version of an operating system and is labeled as the C:\ drive. When you create an Azure virtual machine, the platform will attach at least one disk to the VM for the operating system disk. This will be the default location for application installs and file configuration. This disk is a VHD stored as a page blob in storage.

For production SQL Server environments, use data disks instead of the operating system disk for data files, log files, error logs, and other custom locations avoiding application defaults.

The default caching policy on the operating system disk is  **Read/Write**. Read/write caching is not supported with SQL Server files. For more information, see [Disk caching](performance-guidelines-best-practices-storage.md#cache-throughput). 

> [!NOTE] 
> It is recommended to move all system and user databases to data disks. For more information, see [Move System Databases](/sql/relational-databases/databases/move-system-databases).

### Temporary disk

Many Azure virtual machines contain another disk type called the temporary disk (labeled as the D:\ drive). Depending on the virtual machine series and size this disk could either be local or remote storage and the capacity will vary. The temporary disk is ephemeral meaning that the disk storage will be recreated, deallocated and allocated again, when the virtual machine is recycled. 

The temporary storage drive is not persisted to Azure Blob storage and therefore, you should not store user database files, transaction log files, or anything that cannot be easily recreated on the D:\ drive.

Place tempdb on the local temporary SSD D:\ drive for SQL Server workloads unless consumption of local cache is a concern. To learn more, see [tempdb](performance-guidelines-best-practices-storage.md#tempdb)


### Data disks

Attach data disks up to the virtual machine's maximum disk count and capacity. Data disks can be used for SQL Server data files and log files.

You have a choice in the performance level for your disks. The available types of disks listed in the order of increasing performance capabilities are standard hard disk drives (HDD), standard SSDs, premium solid-state drives (SSD), and Ultra Disks.

For data files, identify your capacity needs and then provision disks that suit your needs. 


## Premium disks

For all production SQL Server workloads, it is recommended to use premium SSD disks for data and log files. 

Each premium SSD provides a number of IOPS and bandwidth (MB/s) depending on its size, as described in [Selecting a Disk Type](../../../virtual-machines/disks-types.md). 

If using a disk striping technique, such as Storage Spaces, you can achieve optimal performance by having two pools, one for the log file(s) and the other for the data files. If you are not using disk striping, use two premium SSD disks mapped to separate drives where one drive contains the log file and the other contains the data.

You can match the provisioned IOPS per disk with performance monitor (avg. disk sec/read + avg. disk sec/writes) and the provisioned throughput per disk with performance monitor (disk read bytes/sec + disk write bytes/sec) at peak times.

### Premium Disk Bursting 

Premium SSD SKUs smaller than P30s offer [disk bursting](../../../virtual-machines/disk-bursting.md) and can burst up to 3,500 IOPS per disk and their bandwidth up to 170 MB/s per disk.  Bursting is best used for dev/test scenarios where usage is unpredictable and functionality tests are being accomplished on smaller premium disks before bringing an application into production. Because of the unpredictable nature of bursting use case scenarios, it is recommended to use bursting on non-production workloads or workloads that have a very small user base such as a non-mission critical departmental application workload of 25 or fewer users.

Bursting is automatic and operates similar to a credit system. Credits are automatically accumulated in a container when disk traffic is below the performance target and credits are automatically consumed when traffic bursts beyond the performance target - up to the max burst limit. 

The max burst limit defines the ceiling of disk IOPS and bandwidth even if there are burst credits to consume. Disk bursting provides better tolerance for unpredictable IO patterns. Bursting works well to improve OS disk boot performance and applications with short and unpredictable traffic patterns.

Disks bursting support will be enabled on new deployments of applicable disk sizes by default, with no user action required. 

All burst applicable disk sizes will start with a full burst credit bucket when the disk is attached to a Virtual Machine that supports a max duration at peak burst limit of 30 mins per day.


### Scaling premium disks

When an Azure Managed Disk is first deployed, the performance tier for that disk is based on the provisioned disk size. The performance tier can be changed at deployment or afterwards, without changing the size of the disk. If demand increases, you can increase the performance level to meet your business needs,. 

Use the higher performance for as long as needed where billing is designed to meet the storage performance tier. Upgrade the tier to match the performance of the storage performance without increasing the capacity. Return to the original tier when the additional performance is no longer required.

Changing the performance tier allows administrators to prepare for and meet higher demand without using the disk bursting capability. It can be cost-effective to change the performance tier rather than rely on bursting, depending on how long the additional performance is needed. 
This temporary expansion of performance is a strong use case for targeted events such as shopping, performance testing, training events and other brief windows where greater performance is only needed for a short term. 

For more information, see [Performance tiers for managed disks](../../../virtual-machines/disks-change-performance.md). 


## Ultra-Disk SSD

If a workload can process ~50,000 IOPS and there is a need for millisecond response times with reduced latency consider leveraging [Ultra-Disk SSD](../../../virtual-machines/disks-types.md#ultra-disk) for the SQL Server log drive. Ultra Disk SSDs are an alternative to disks that support write acceleration. 

Ultra-Disk SSD can be configured where capacity and IOPS can scale independently. With Ultra-Disk SSD administrators can provision a disk with the capacity, IOPS, and throughput requirements based on application needs and only pay for the provisioned capacity. Ultra-Disk SSD does not support cache configuration for reads or writes as it already offers sub-millisecond latency for all reads and writes.

Consider the following: 
- Azure Ultra Disks are supported on the following VM series: ESv3, Easv4, Edsv4, Esv4, DSv3, Dasv4, Ddsv4, Dsv4, FSv2, LSv2, M, and Mv2 series.
- Ultra disks come in several fixed sizes, ranging from 4 GiB up to 64 TiB, and feature a flexible performance configuration model that allows you to independently configure IOPS and throughput.
- Ultra disks can only be used for data and log data disks, though it is important to note that Azure Ultra Disks do not support read or write caching.
- Use the minimum number of disks possible to meet the required space and IOPS to enable a wider range of machines to scale to.

Ultra-Disk SSDs have the following limitations: 

- Limited virtual machine sizes and regions that support Ultra-disk SSD
- Only supported redundancy option is Availability Zones
- Ultra-disk SSD do not support  disk snapshots, Azure disk encryption, Azure Backup, or Azure Site Recovery.
- There is no caching support for reads or writes (not that you want write caching on the log file). 

To learn more, see [Using Ultra Disks](../../../virtual-machines/disks-enable-ultra-ssd.md).


## Standard HDDs and SSDs

[Standard HDDs](../../../virtual-machines/disks-types.md#standard-hdd) and SSDs have varying latencies and bandwidth and are only recommended for dev/test workloads. Production workloads should use premium SSDs. If you are using Standard SSD (dev/test scenarios), the recommendation is to add the maximum number of data disks supported by your [VM size](../../../virtual-machines/sizes.md?toc=/azure/virtual-machines/windows/toc.json) and leverage disk striping with Storage Spaces for the best performance.


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

You can manually enable host caching on an existing VM. Stop all application workloads and the SQL Server services before any changes are made to your virtual machine's caching policy. Changing any of the virtual machine cache settings results in the target disk being detached and re-attached after the settings are applied.


## Data file caching policies

Your storage caching policy varies depending on the type of SQL Server data file is hosted on the drive. 

The following table provides a summary of the recommended caching policies based on the type of SQL Server data: 

|SQL Server disk |Recommendation |
|---------|---------|
| Data disk | Enable read-only caching for the disks hosting SQL Server data files. <br/><br/>Reads from cache will be much faster than the uncached reads from the data disk.|
|Transaction log disk|Set the caching policy to `None` for disks hosting the transaction log.  Not only is there no performance benefit to enabling caching, but there is a potential for corruption if the `Read/Write` caching policy is enabled.  |
|Operating OS disk | The default caching policy is Read/write for the premium disk Virtual Machine OS drive. It is not recommended to change the caching level of the OS drive.  |
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

   - If the capacity of the local drive is not enough for your tempdb size, then place tempdb on a storage pool striped on premium SSD disks with read-only caching.
   - If utilization of the local Azure cache is a concern, consider placing tempdb on a separate data drive with read-caching enabled to prevent overconsmuption of the local cache.  

## Disk striping

For more throughput, you can add additional data disks and use disk striping. To determine the number of data disks, analyze the throughput and bandwidth required for your SQL Server data files, including the log and tempdb. Throughput and bandwidth limits vary by VM size. To learn more, see [VM Size](../../../virtual-machines/sizes.md)

For example, an application that needs 12,0000 IOPS and 180 MBs/ throughput can leverage three striped P30 disks to deliver 15,000 IOPS and 600 MB/s throughput. 

If you are using disk striping in a single storage pool, most workloads will benefit from read caching. If you have separate storage pools for the log and data files, enable read caching only on the storage pool for the data files. 


To configure disk striping, see [disk striping](storage-configuration.md#disk-striping). 


## Allocation unit size

Format your data disk drive to use 64-KB allocation unit size for data and log files, as well as tempdb if placed on a drive other than the temporary local disk (D:\ drive). Although the temporary disk is not formatted to the 64-KB allocation unit size, the performance of the drive speed outweighs the need for the 64-KB allocation unit size. 

SQL Server VMs deployed through Azure Marketplace come with data disks formatted with 64-KB allocation unit size. 

## Throttling

There are throughput limits at both the disk and virtual machine level. The maximum IOPS limits per VM and per disk differ and are independent of each other.

Applications that consume resources beyond these limits might be throttled. Select a virtual machine and disk size in a disk stripe that meets application requirements and will not face throttling limitations. To address throttling, leverage caching, or tune the application so that less throughput is required. 

For example, an application that needs 12,000 IOPS and 180 MB/s can: 
- Use the [Standard_M32ms](../../../virtual-machines/m-series.md) which have a max uncached disk throughput of 20,0000 IOPS and 500 MBps.
- Stripe three P30 disks to deliver 15,000 IOPS and 600 MB/s throughput.
- Use a [Standard_M16ms](../../../virtual-machines/m-series.md) disk and leverage host caching to utilize local cache over consuming throughput. 


Virtual machines configured to scale up during times of high utilization should provision storage with enough IOPS and throughput to support the maximum size VM while keeping the overall number of disks less than or equal to the maximum number supported by the smallest VM SKU targeted to be used.

For more information on throttling limitations and leveraging caching to avoid throttling, see [Disk IO capping](../../../virtual-machines/disks-performance.md).


## Write Acceleration

Write Acceleration is a disk feature that is only available for the M-Series Virtual Machines (VMs). The purpose of write acceleration is to improve the I/O latency of writes against Azure Premium Storage when you need single digit I/O latency due to high volume mission critical OLTP workloads or data warehouse environments. 

Use Write Acceleration to improve write latency to the drive hosting the log files. Do not use Write Acceleration for SQL Server data files. 

Consider the following restrictions with Write Acceleration:
- Set premium disk caching to `None` for the transaction log drive. 
- There are limits to the number of Write Accelerator disks that are supported per virtual machine. 
- Write Acceleration disks share the same IOPS limits as the virtual machine. 


The follow table outlines the number of data disks and IOPS supported per virtual machine: 

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

## Monitor storage performance

Azure provides several capabilities to monitor the health of your virtual machine including analyzing [Metrics](../../../azure-monitor/platform/data-platform-metrics.md), [Alerts](../../../azure-monitor/platform/alerts-metric-overview.md), [Insights](../../../azure-monitor/insights/vminsights-performance.md#view-performance-directly-from-an-azure-vm), and [Workbooks](../../../azure-monitor/platform/workbooks-overview.md). Many of these features have intersecting capabilities tracking resource performance over time and providing a means for administrators to analyze the data or, in the case of Insights and Workbooks, have some of the analysis provided by Azure analytics.

[Azure Monitor for VMs](../../../azure-monitor/overview.md) monitors operating system and VM host performance related to processor, memory, network adapter, and disk capacity, and disk utilization. Azure Monitor includes a set of performance charts that target several key performance indicators (KPIs) to help administrators determine how well a virtual machine is performing. The charts show resource utilization over an adjustable time range where administrators can identify bottlenecks and irregularities. The charts display the health of a single resource where an administrator can drill into the chart, add additional metrics, and make other adjustments to the visuals. 

Using Azure Monitor, administrator can discover the usage peaks of their environment, the general latency and health of their storage configuration, and if there is any throttling occurring at the disk or virtual machine level.

> [!NOTE]
> Azure Monitor does not currently monitor the consumption of the ephemeral drive (D:\), so reporting may not reflect tempdb utilization.


## Next steps

To learn more about performance best practices, see the other articles in this series:
- [Quick checklist](performance-guidelines-best-practices-checklist.md)
- [VM size](performance-guidelines-best-practices-vm-size.md)
- [Disks](performance-guidelines-best-practices-disks.md)
- [Azure & SQL feature specific](performance-guidelines-best-practices-feature-specific.md)
- [Collect baseline](performance-guidelines-best-practices-collect-baseline.md)

For security best practices, see [Security considerations for SQL Server on Azure Virtual Machines](security-considerations-best-practices.md).

For detailed testing of SQL Server performance on Azure VMs with TPC-E and TPC_C benchmarks, refer to the blog [Optimize OLTP performance](https://techcommunity.microsoft.com/t5/sql-server/optimize-oltp-performance-with-sql-server-on-azure-vm/ba-p/916794).

Review other SQL Server Virtual Machine articles at [SQL Server on Azure Virtual Machines Overview](sql-server-on-azure-vm-iaas-what-is-overview.md). If you have questions about SQL Server virtual machines, see the [Frequently Asked Questions](frequently-asked-questions-faq.md).

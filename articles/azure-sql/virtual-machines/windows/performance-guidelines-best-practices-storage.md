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
ms.date: 03/24/2021
ms.author: dplessMSFT
ms.reviewer: jroth
---
# Storage: Performance best practices for SQL Server on Azure VMs
[!INCLUDE[appliesto-sqlvm](../../includes/appliesto-sqlvm.md)]

This article provides storage best practices and guidelines to optimize performance for your SQL Server on Azure Virtual Machines (VMs).

To learn more, see the other performance best practices articles: [Quick checklist](performance-guidelines-best-practices-checklist.md), [VM size](performance-guidelines-best-practices-vm-size.md), [Azure & SQL feature specific](performance-guidelines-best-practices-feature-specific.md), [Collect baseline](performance-guidelines-best-practices-collect-baseline.md)

## Check list

- Monitor the application and [determine storage latency requirements](https://docs.microsoft.com/en-us/azure/virtual-machines/premium-storage-performance#counters-to-measure-application-performance-requirements) for SQL Server data, log, and tempdb files before choosing the disk type. 

- To optimize storage performance, plan for highest uncached IOPS available and leverage data caching as a performance feature for data reads while avoiding [virtual machine and disks throttling](https://docs.microsoft.com/en-us/azure/virtual-machines/premium-storage-performance#throttling).

- Place data, log, and tempdb files on separate drives.
    - For the data drive only use [premium P30 and P40 disks](https://docs.microsoft.com/en-us/azure/virtual-machines/disks-types#premium-ssd) to ensure the availability of cache support
    - For the log drive plan for capacity and test performance versus cost while evaluating the [premium P30 - P80 disks](https://docs.microsoft.com/en-us/azure/virtual-machines/disks-types#premium-ssd)
      - If 1-ms storage latencies are required, leverage [Ultra SSD Disks](https://docs.microsoft.com/en-us/azure/virtual-machines/disks-types#ultra-disk) for the transaction log. 
        - For M-series virtual machine deployments consider [write accelerator](https://docs.microsoft.com/en-us/azure/virtual-machines/how-to-enable-write-accelerator) over using Ultra SSD disks.
    - Place [tempdb](https://docs.microsoft.com/en-us/sql/relational-databases/databases/tempdb-database?view=sql-server-ver15) on the local ephemeral SSD D:\ drive for most SQL Server workloads after choosing the optimal VM size. 
      - If the capacity of the local drive is not enough for tempdb, see [tempdb caching](#tempdb) for more information.

- Stripe multiple Azure data disks using [Storage Spaces](https://docs.microsoft.com/en-us/windows-server/storage/storage-spaces/overview) to gain increased storage capacity up to the target virtual machine's IOPS and throughput limits.

- Set [host caching](https://docs.microsoft.com/en-us/azure/virtual-machines/disks-performance#virtual-machine-uncached-vs-cached-limits) to read-only for data file disks
- Set [host caching](https://docs.microsoft.com/en-us/azure/virtual-machines/disks-performance#virtual-machine-uncached-vs-cached-limits) to none for log file disks.
    - Note: Do not enable read/write caching on disks that contain SQL Server files	
    - Note: Always stop the SQL Server service before changing the cache settings your disk.

- For development and test workloads, and backup file locations consider leveraging standard storage. It is not recommended to use Standard HDD/SDD for production workloads.
- [Credit-based Disk Bursting](https://docs.microsoft.com/en-us/azure/virtual-machines/disk-bursting#credit-based-bursting) (P1-P20) should be only considered for smaller dev/test workloads and departmental systems.

- Provision the storage account in the same region as the SQL Server VM. 
- Disable Azure geo-redundant storage (geo-replication) and leverage LRS (local redundant storage) on the storage account.
> [!NOTE]
> Provisioning a SQL Server VM through the Azure portal helps guide you through the storage configuration process and implements most storage best practices such as creating separate storage pools for your data and log files, targeting tempdb to the D:\ drive, and enabling the optimal caching policy. For more information about provisioning and configuring storage, see [SQL VM storage configuration](storage-configuration.md). 

## Overview

To find the most effective configuration for SQL Server workloads on an Azure VM, start by measuring the storage performance of your business application. Once storage requirements are known, select a virtual machine that supports the necessary IOPs and throughput with the appropriate core-to-memory ratio. 

Choose a VM size with enough storage scalabilty for your workload and a mixture of disks, usually in a storage pool, that meet the capacity and performance requirements. 

The type of disk will depend on both the file type that will be hosted on the disk and your peak performance requirements.

This article provides information about the different types of data disks, which disks to use for SQL Server, and storage and monitoring considerations specific to SQL Server workloads. 

## VM disk types

You have a choice in the performance level for your disks. The available types of managed disks listed in the order of increasing performance capabilities are standard hard disk drives (HDD), standard SSDs, premium solid-state drives (SSD), and Ultra Disks as the underlying storage.

>[NOTE] For an explanation of managed disk provisioning such as
> disk allocation and performance, see [Managed disks overview](../../../virtual-machines/managed-disks-overview.md).

The performance of the disk increases with the capacity, grouped by [premium disk labels](../../../virtual-machines/disks-types.md#premium-ssd) such as the P1 with 4GiB of space and 120 IOPs to the P80 with 32TiB of storage and 20,000 IOPs. Premium storage supports a storage cache that helps improve read and read/write performance.

There are also three main [disk types](../../../virtual-machines/managed-disks-overview.md#disk-roles) to consider for your SQL Server on Azure VM -  an OS disk, a temporary disk, and your data disks.

An administrator should carefully choose what is stored on these local system disks; the operating system drive (C:\) and the ephemeral temporary drive (D:\). 

An administrator is responsilble to configure the optimal disk storage for the remote data disks where SQL Server will host your SQL Server data files, log files, and other files.

### Operating system disk

An operating system disk is a VHD that can be booted and mounted as a running version of an operating system and is labeled as the C:\ drive. When you create an Azure virtual machine, the platform will attach at least one disk to the VM for the operating system disk. This will be the default location for application installs and file configuration. 

For production SQL Server environments, use data disks instead of the operating system disk for data files, log files, error logs, and other custom locations avoiding application defaults.

### Temporary disk

Many Azure virtual machines contain another disk type called the temporary disk (labeled as the D:\ drive). Depending on the virtual machine series and size this disk could either be local or remote storage and the capacity will vary. The temporary disk is ephemeral meaning that the disk storage will be recreated, deallocated and allocated again, when the virtual machine is recycled. 

The temporary storage drive is not persisted to Azure Blob storage and therefore, you should not store user database files, transaction log files, or anything that cannot be easily recreated on the D:\ drive.

Place tempdb on the local temporary SSD D:\ drive for SQL Server workloads unless consumption of local cache is a concern. To learn more, see [tempdb](performance-guidelines-best-practices-storage.md#tempdb)

## Data disks

Data disks are remote storage disks that are often created in [storage pools](https://docs.microsoft.com/en-us/windows-server/storage/storage-spaces/overview) in order to exceed the capacity and performance that any single disk could offer to the virtual machine.

Administrators must attach these minimum number of disks that will satisfy the IOPs, throughput, and capacity requirements of your workload. 

When planning the storage pools administrators should be mindful not to exceed the maxiumum number of data disks of the smallest virtual machine you plan to resize to.

Data disks will primarily be used by SQL Server data files and log files where administrators will identify SQL Server capacity needs and then provision disks that best suits performance requirements. 

### Premium disks

For all production SQL Server workloads, it is recommended to use premium SSD disks for data and log files. 

Each premium SSD provides IOPS and bandwidth (MB/s) depending on its size, as described in [Selecting a Disk Type](../../../virtual-machines/disks-types.md). 

With Storage Spaces you can achieve optimal performance by having two pools, one for the log file(s) and the other for the data files. If you are not using disk striping, use two premium SSD disks mapped to separate drives where one drive contains the log file and the other contains the data.

To ensure the performance needs from your target OLTP application is satisfied an administrator should match the target IOPS per disk with performance monitor (avg. disk sec/read + avg. disk sec/writes) captures at peak times. 

For data warehouse and reporting environments, an administrator should match the target throughput with performance monitor (disk read bytes/sec + disk write bytes/sec). 

It is recommended to leverage the P30 and/or P40 disks for SQL Server data files to ensure caching support and leverage the P30 up to P80 for SQL Server transaction log files. 

It is important to note the [provisioned IOPS and throughput](https://docs.microsoft.com/en-us/azure/virtual-machines/disks-types#premium-ssd) per disk that is used as part of your storage pool. The combined IOPS and throughput capabilities of the disks is the maximum capability up to the throughput limits of the virtual machine.

For the best total cost of ownership, start with P30s (5000 IOPS/200 MBPS) for data and log files and only choose higher capacities when you need to control the virtual machine disk count.

The best practice is to use the least amount of disks possible while meeting the minimal requirements for IOPS (and throughput) and capacity.

### Scaling premium disks

When an Azure Managed Disk is first deployed, the performance tier for that disk is based on the provisioned disk size. The performance tier can be changed at deployment or afterwards, without changing the size of the disk. If demand increases, you can increase the performance level to meet your business needs. 

Use the higher performance for as long as needed where billing is designed to meet the storage performance tier. Upgrade the tier to match the performance of the storage performance without increasing the capacity. Return to the original tier when the additional performance is no longer required.

Changing the performance tier allows administrators to prepare for and meet higher demand without relying on [disk bursting](https://docs.microsoft.com/en-us/azure/virtual-machines/disk-bursting#credit-based-bursting). 

This cost-effective and temporary expansion of performance is a strong use case for targeted events such as shopping, performance testing, training events and other brief windows where greater performance is only needed for a short term. 

For more information, see [Performance tiers for managed disks](../../../virtual-machines/disks-change-performance.md). 

### Ultra-Disk SSD

If there is a need for sub-millisecond response times with reduced latency consider leveraging [Ultra-Disk SSD](../../../virtual-machines/disks-types.md#ultra-disk) for the SQL Server log drive. 

Ultra-Disk SSD can be configured where capacity and IOPS can scale independently. With Ultra-Disk SSD administrators can provision a disk with the capacity, IOPS, and throughput requirements based on application needs. 

Consider the following: 
- Azure Ultra Disks are supported on the following VM series: ESv3, Easv4, Edsv4, Esv4, DSv3, Dasv4, Ddsv4, Dsv4, FSv2, LSv2, M, and Mv2 series.
- Ultra disks come in several fixed sizes, ranging from 4 GiB up to 64 TiB, and feature a flexible performance configuration model that allows you to independently configure IOPS and throughput.
- Ultra disks can only be used for data and log data disks
- Ultra-Disk SSD does not support cache configuration for reads or writes as it already offers sub-millisecond latency for all reads and writes.

Ultra-Disk SSDs have the following limitations: 

- Limited virtual machine sizes and regions that support Ultra-disk SSD
- Only supported redundancy option is Availability Zones
- Ultra-disk SSD do not support disk snapshots, Azure disk encryption, Azure Backup, or Azure Site Recovery.

To learn more, see [Using Ultra Disks](../../../virtual-machines/disks-enable-ultra-ssd.md).

### Standard HDDs and SSDs

[Standard HDDs](../../../virtual-machines/disks-types.md#standard-hdd) and SSDs have varying latencies and bandwidth and are only recommended for dev/test workloads. Production workloads should use premium SSDs. If you are using Standard SSD (dev/test scenarios), the recommendation is to add the maximum number of data disks supported by your [VM size](../../../virtual-machines/sizes.md?toc=/azure/virtual-machines/windows/toc.json) and leverage disk striping with Storage Spaces for the best performance.

## Improving Storage Performance using Caching

Virtual machines that support premium storage caching can take advantage of an additional feature called the Azure BlobCache or host caching to extend the IOPS and throughput capabilities of a virtual machine. Virtual machines that are enabled for both premium storage and premium storage caching have these two different storage bandwidth limits that can be used together to improve storage performance.

The IOPs and MBps throughput without caching counts against a virtual machine's uncached disk throughput limits. The maximum cached limits provide an additional buffer for reads that helps address growth and unexpected peaks.

Enable premium caching whenever the option is supported to significantly improve performance for reads against the data drive. 

Reads and writes to the Azure BlobCache (cached IOPS and throughput) do not count against the uncached IOPS and throughput limits of the virtual machine.

> [!NOTE]
> Disk Caching is not supported for disks 4 TiB and larger (P50 and larger). If multiple disks are attached to your VM, each disk that is smaller than 4 TiB will support caching. For more information, see [Disk caching](../../../virtual-machines/premium-storage-performance.md#disk-caching). 

### Uncached throughput

The max uncached disk IOPS and throughput is the maximum remote storage limit that the virtual machine can handle. This limit is defined at the virtual machine and is not a limit of the underlying disk storage. This limit applies only to I/O against data drives remotely attached to the VM, not the local I/O against the temp drive (D drive) or the OS drive.

The amount of uncached IOPS and throughput that is available for a VM can be verified in the documentation for your virtual machine.

For example, the [M-series](../../../virtual-machines/m-series.md) documentation shows that the max uncached throughput for the Standard_M8ms VM is 5000 IOPS and 125 MBps of uncached disk throughput. 

![M-series Uncached Disk Throughput](./media/performance-guidelines-best-practices/M-Series_table.png)

Likewise, you can see that the Standard_M32ts supports 20000 uncached disk IOPS and 500 MBps uncached disk throughput. This limit is governed at the virtual machine level despite the configuration of the underlying premium disk storage.

For more information, see [uncached and cached limits](../../../virtual-machines/linux/disk-performance-linux.md#virtual-machine-uncached-vs-cached-limits).


### Cached and temp storage throughput

The max cached and temp storage throughput limit is a separate limit from the uncached throughput limit on the virtual machine. The Azure BlobCache consists of a combination of the host virtual machine's random-access memory and the VM's local SSD. The local temp drive (D drive) is also hosted on this SSD.

The max cached and temp storage throughput limit governs the I/O against the local temp drive (D drive) and the Azure BlobCache **only if** host caching is enabled. 

When caching is enabled on premium storage, virtual machines can scale beyond the limitations of the underlying disk subsystem's uncached VM IOPS and throughput limits.  

Only certain virtual machines support both premium storage and premium storage caching which can be verified in the virtual machine documentation. For example, the [M-series](../../../virtual-machines/m-series.md) documentation indicates that both premium storage, and premium storage caching is supported: 

![M-Series Premium Storage Support](./media/performance-guidelines-best-practices/M-Series_table_premium_support.png)

The limits of the cache will vary based on the virtual machine size. For example, the Standard_M8ms VM supports 10000 cached disk IOPS and 1000 MBps cached disk throughput with a total cache size of 793 Gib. Similarly, the Standard_M32ts VM supports 40000 cached disk IOPS and 400 MBps cached disk throughput with a total cache size of 3174 GiB. 

![M-series Cached Disk Throughput](./media/performance-guidelines-best-practices/M-Series_table_cached_temp.png)

You can manually enable host caching on an existing VM. Stop all application workloads and the SQL Server services before any changes are made to your virtual machine's caching policy. Changing any of the virtual machine cache settings results in the target disk being detached and re-attached after the settings are applied.

### Data file caching policies

Your storage caching policy varies depending on the type of SQL Server data file is hosted on the drive. 

The following table provides a summary of the recommended caching policies based on the type of SQL Server data: 

|SQL Server disk |Recommendation |
|---------|---------|
| **Data disk** | Enable `read-only` caching for the disks hosting SQL Server data files. <br/> Reads from cache will be faster than the uncached reads from the data disk. <br/> Uncached IOPS and throughput plus Cached IOPS and throughput will yield the total possible performance available from the virtual machine within the VMs limits. <br/>|
|**Transaction log disk**|Set the caching policy to `None` for disks hosting the transaction log.  There is no performance benefit to enabling caching for the Transaction log disk, additionally with the `Read/Write` caching policy enabled the cache could be further depleated.  |
|**Operating OS disk** | The default caching policy could be `read-only` or `Read/write` for the OS drive. <br/> It is not recommended to change the caching level of the OS drive.  |
| tempdb| If tempdb cannot be placed on the ephemeral drive D:/ due to capacity reasons, either resize the virtual machine to get a larger ephemeral drive or place tempdb on a separate data drive with `read-only` caching configured. <br/> The local and temp disks leverage the virtual machine cache, which is where tempdb is typically placed.| 

<br/>To learn more, see [Disk caching](../../../virtual-machines/premium-storage-performance.md#disk-caching). 

### Data files 

Enable `read-only` caching for the disks hosting SQL Server data files. Read-only caching has improved read latency and higher IOPS and throughput since the reads will be coming directly from the optimized cache which is local in the virtual machines RAM and local SSD. 

Reads from cache will be much faster than the uncached reads from the data disk. Additionally, reads provided by the Azure BlobCache do not count against the virtual machine's uncached IOPS and throughput limits providing the ability to scale beyond these limitations. 

The fast reads from cache lower the SQL Server query time especially for high volume read workloads since data pages are retrieved much faster from the cache compared to directly from the data disks.

Serving reads from cache, means there is additional throughput available from premium data disks. SQL Server can use this additional throughput towards retrieving more data pages and other operations like backup/restore, batch loads, and index rebuilds.

### Transaction log files

Set the caching policy to `None` for disks hosting the transaction log. Not only is there no performance benefit to enabling caching, but there is a potential depleating the cache for the data file if the `Read/Write` caching policy is enabled.

Log files have primarily write-heavy operations. Therefore, they do not benefit from the `read-only` cache. Only use 'None' for the log file caching policy.

### Operating System (OS) disk

The default caching policy is Read/write for the premium disk Virtual Machine OS drive. It is not recommended to change the caching level of the OS drive.

If the OS drive is Standard HDD then the default will be set to `read-only`. The `Read/write` caching level is meant for workloads that achieve a balance of read and write operations. 

### tempdb

The local and temp disks leverage the virtual machine cache, which is where tempdb is typically placed. If tempdb cannot be placed on the ephemeral drive D:/ due to capacity reasons, either resize the virtual machine to get a larger ephemeral drive or place tempdb on a separate data drive with `read-only` caching configured.

   - If the capacity of the local drive is not enough for your tempdb size, then place tempdb on a storage pool striped on premium SSD disks with read-only caching.
   - If utilization of the local Azure cache is a concern, consider placing tempdb on a separate data drive with read-caching enabled to prevent overconsmuption of the cache.  

## Disk striping

For more throughput, you can add additional data disks and use disk striping. To determine the number of data disks, analyze the throughput and bandwidth required for your SQL Server data files, including the log and tempdb. Throughput and bandwidth limits vary by VM size. To learn more, see [VM Size](../../../virtual-machines/sizes.md)

For example, an application that needs 12,0000 IOPS and 180 MBs/ throughput can leverage three striped P30 disks to deliver 15,000 IOPS and 600 MB/s throughput. 

If you are using disk striping in a single storage pool, most workloads will benefit from read caching. If you have separate storage pools for the log and data files, enable read caching only on the storage pool for the data files. 

To configure disk striping, see [disk striping](storage-configuration.md#disk-striping). 

## Allocation unit size and Interleave

Format your data disk drive to use 64-KB allocation unit size for data and log files, as well as tempdb if placed on a drive other than the temporary local disk (D:\ drive). Although the temporary disk is not formatted to the 64-KB allocation unit size, the default is 4-KB, the performance of the drive speed outweighs the need for the 64-KB allocation unit size. 

SQL Server VMs deployed through Azure Marketplace come with data disks formatted with 64-KB allocation unit size and the interleave for the storage pool will be set to 64-KB as well. 

## Throttling

There are throughput limits at both the disk and virtual machine level. The maximum IOPS limits per VM and per disk differ and are independent of each other.

Applications that consume resources beyond these limits will be throttled. Select a virtual machine and disk size in a disk stripe that meets application requirements and will not face throttling limitations. To address throttling, leverage caching, or tune the application so that less throughput is required.

For example, an application that needs 12,000 IOPS and 180 MB/s can: 
- Use the [Standard_M32ms](../../../virtual-machines/m-series.md) which have a max uncached disk throughput of 20,0000 IOPS and 500 MBps.
- Stripe three P30 disks to deliver 15,000 IOPS and 600 MB/s throughput.
- Use a [Standard_M16ms](../../../virtual-machines/m-series.md) disk and leverage host caching to utilize local cache over consuming throughput. 

Virtual machines configured to scale up during times of high utilization should provision storage with enough IOPS and throughput to support the maximum size VM while keeping the overall number of disks less than or equal to the maximum number supported by the smallest VM SKU targeted to be used.

For more information on throttling limitations and leveraging caching to avoid throttling, see [Disk IO capping](../../../virtual-machines/disks-performance.md).

>[NOTE:] While throttling at either the disk or virtual machine level means workloads are being
> limited, it is not necessarily a condition that should be avoided in every circumstance. If the users are satisfied with the performance of the environment and there is only a small degree of throttling occuring, administrators may choose to tune and maintain rather than resizing to a larger virtual machine / disk to balance managing costs and performance for the business.

## Write Acceleration

Write Acceleration is a disk feature that is only available for the M-Series Virtual Machines (VMs). The purpose of write acceleration is to improve the I/O latency of writes against Azure Premium Storage when you need single digit I/O latency due to high volume mission critical OLTP workloads or data warehouse environments. 

Use Write Acceleration to improve write latency to the drive hosting the log files. Do not use Write Acceleration for SQL Server data files. 

Consider the following restrictions with Write Acceleration:
- Set premium disk caching to `None` for the transaction log drive. 
- There are limits to the number of Write Accelerator disks that are supported per virtual machine. 
- Write Accelerator disks share the same IOPS limit as the virtual machine. Attached disks cannot exceed the write accelerator IOPS limit for a VM.  


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


To learn more, see [Restrictions when using Write Accelerator](../../../virtual-machines/how-to-enable-write-accelerator.md#restrictions-when-using-write-accelerator).


### Comparing to Ultra Disk

The biggest difference between Write Acceleration and Azure Ultra Disks is that Write Acceleration is a virtual machine feature only available for the M-Series and Azure Ultra Disks is a storage option. Write Acceleration is a write-optimized cache with its own limitations based on the virtual machine size. Azure ultra-disks are a low latency disk storage option for Azure Virtual Machines. 

If possible, use Write Acceleration over Ultra Disks for the transaction log disk. For virtual machines that do not support Write Acceleration but require low latency to the transaction log, use Azure Ultra Disks. 

## Monitoring storage performance

To assess storage needs, and determine how well storage is performing, you need to understand what to measure, and what those indicators mean. 

[IOPS (Input/Output per second)](../../../virtual-machines/premium-storage-performance.md#iops) is the number of requests the application is making to storage per second. Measure IOPS using Performance Monitor counters `Avg. Disk sec/read` and `Avg. Disk sec/writes`. [OLTP (Online transaction processing)](/azure/architecture/data-guide/relational-data/online-transaction-processing) applications need to drive higher IOPS in order to achieve optimal performance. Applications such as payment processing systems, online shopping, and retail point-of-sale systems are all examples of OLTP applications.

[Throughput](../../../virtual-machines/premium-storage-performance.md#throughput) is the volume of data that is being sent to the underlying storage, often measured by megabytes per second. Measure throughput with the Performance Monitor counters `Disk read bytes/sec` and `Disk write bytes/sec`. [Data warehousing](/azure/architecture/data-guide/relational-data/data-warehousing) is optimized around maximizing throughput over IOPS. Applications such as data stores for analysis, reporting, ETL workstreams, and other business intelligence targets are all examples of data warehousing applications.

IO unit sizes influence IOPS and throughput capabilities as smaller IO sizes yield higher IOPS and larger IO sizes yield higher throughput. SQL Server chooses the optimal IO size automatically. For more information about, see [Optimize IOPS, throughput, and latency for your applications](../../../virtual-machines/premium-storage-performance.md#optimize-iops-throughput-and-latency-at-a-glance). 

### Performance metrics 

Azure provides several capabilities to monitor the health of your virtual machine including analyzing [Metrics](../../../azure-monitor/platform/data-platform-metrics.md), [Alerts](../../../azure-monitor/platform/alerts-metric-overview.md), [Insights](../../../azure-monitor/insights/vminsights-performance.md#view-performance-directly-from-an-azure-vm), and [Workbooks](../../../azure-monitor/platform/workbooks-overview.md). Many of these features have intersecting capabilities tracking resource performance over time and providing a means for administrators to analyze the data or, in the case of Insights and Workbooks, have some of the analysis provided by Azure analytics.

[Azure Monitor for VMs](../../../azure-monitor/overview.md) monitors operating system and VM host performance related to processor, memory, network adapter, and disk capacity, and disk utilization. Azure Monitor includes a set of performance charts that target several key performance indicators (KPIs) to help administrators determine how well a virtual machine is performing. The charts show resource utilization over an adjustable time range where administrators can identify bottlenecks and irregularities. The charts display the health of a single resource where an administrator can drill into the chart, add additional metrics, and make other adjustments to the visuals. 

Using Azure Monitor, administrators can discover the usage peaks of their environment, the general latency and health of their storage configuration, and if there is any throttling occurring at the disk or virtual machine level.

### Storage and Virtual Machine performance metrics 

There are specific Azure Monitor metrics that are invaluable for discovering throttling at the virtual machine and disk level as well as the consumption and the health of the AzureBlob cache.

The reference below identifies the key counters that should be added to your monitoring solution and Azure Portal dashboard.

**Storage IO utilization metrics** <br/>
https://docs.microsoft.com/en-us/azure/virtual-machines/disks-metrics#storage-io-utilization-metrics

For example, in the image below we can see that the Average Data Disk IOPS Consumed Percentage for data disks attached on LUN 3 and 2 are using 85% of their provisioned IOPS.

:::image type="content" source="../../../virtual-machines/media/disks-metrics/utilization-metrics-example/data-disks-splitting.jpg" alt-text="Average Data Disk IOPS Consumed Percentage Metrics":::

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

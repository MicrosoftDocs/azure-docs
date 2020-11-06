---
title: Performance guidelines for SQL Server in Azure | Microsoft Docs
description: Provides guidelines for optimizing SQL Server performance in Microsoft Azure Virtual Machines.
services: virtual-machines-windows
documentationcenter: na
author: MashaMSFT
editor: ''
tags: azure-service-management
ms.assetid: a0c85092-2113-4982-b73a-4e80160bac36
ms.service: virtual-machines-sql
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: vm-windows-sql-server
ms.workload: iaas-sql-server
ms.date: 10/18/2019
ms.author: mathoma
ms.reviewer: jroth
---
# Performance guidelines for SQL Server on Azure Virtual Machines
[!INCLUDE[appliesto-sqlvm](../../includes/appliesto-sqlvm.md)]

This article provides guidance for optimizing SQL Server performance in Microsoft Azure Virtual Machines.

## Overview

 While running SQL Server on Azure Virtual Machines, we recommend that you continue using the same database performance tuning options that are applicable to SQL Server in on-premises server environments. However, the performance of a relational database in a public cloud depends on many factors such as the size of a virtual machine, and the configuration of the data disks.

[SQL Server images provisioned in the Azure portal](sql-vm-create-portal-quickstart.md) follow general storage configuration best practices (for more information on how storage is configured, see [Storage configuration for SQL Server virtual machines (VMs)](storage-configuration.md)). After provisioning, consider applying other optimizations discussed in this article. Base your choices on your workload and verify through testing.

> [!TIP]
> There is typically a trade-off between optimizing for costs and optimizing for performance. This article is focused on getting the *best* performance for SQL Server on Azure Virtual Machines. If your workload is less demanding, you might not require every optimization listed below. Consider your performance needs, costs, and workload patterns as you evaluate these recommendations.

## Quick checklist

The following is a quick checklist for optimal performance of SQL Server on Azure Virtual Machines:

| Area | Optimizations |
| --- | --- |
| [VM size](#vm-size-guidance) | - Use VM sizes with 4 or more vCPU like [E4ds_v4](../../../virtual-machines/edv4-edsv4-series#edv4-series) or higher, or [DS12_v2](../../../virtual-machines/dv2-dsv2-series-memory#dsv2-series-11-15) or higher. <br/><br/> - Use [memory optimized](../../../virtual-machines/sizes-memory) virtual machine sizes for the best performance experience for SQL Server workloads. <br/><br/> - The [DSv2 11-15](../../../virtual-machines/dv2-dsv2-series-memory) series, the [Edsv4](../../../virtual-machines/edv4-edsv4-series) series, the [M-series](../../../virtual-machines/m-series) and the [Mv2 series](../../../virtual-machines/mv2-series) offers an optimal memory to vCPU ratio required for OLTP workload performance. <br/><br/> - A higher memory to vCPU ratio may be required for mission critical and data warehouse workloads. <br/><br/> - The [M-series](../../../virtual-machines/m-series) and the [Mv2 series](../../../virtual-machines/mv2-series) offers the highest memory to vCPU ratio required for mission critical performance and is ideal for data warehouse workloads.<br/><br/> - Leverage the Azure Virtual Machine marketplace images as the SQL Server settings and storage options are configured for optimal performance. <br/><br/> -Collect the target workload's performance characteristics.|
| [Storage](#storage-guidance) | - For detailed testing of SQL Server performance on Azure Virtual Machines with TPC-E and TPC_C benchmarks, refer to the blog [Optimize OLTP performance](https://techcommunity.microsoft.com/t5/SQL-Server/Optimize-OLTP-Performance-with-SQL-Server-on-Azure-VM/ba-p/916794). <br/><br/> - Use [premium SSDs](https://techcommunity.microsoft.com/t5/SQL-Server/Optimize-OLTP-Performance-with-SQL-Server-on-Azure-VM/ba-p/916794) for the best price/performance advantages. Configure [ReadOnly cache](../../../virtual-machines/premium-storage-performance.md#disk-caching) for data files and no cache for the log file. <br/><br/> - Use [Ultra Disks](../../../virtual-machines/disks-types.md#ultra-disk) if less than 1 ms storage latencies are required by the workload. See [migrate to ultra disk](storage-migrate-to-ultradisk.md) to learn more. <br/><br/> - Collect the storage latency requirements for SQL Server data, log, and Temp DB files by [monitoring the application](../../../virtual-machines/premium-storage-performance.md#application-performance-requirements-checklist) before choosing the disk type. If <1ms storage latencies are required, then use Ultra Disks, otherwise use premium SSD. If low latencies are only required for the log file and not for data files, then [provision the Ultra Disk](../../../virtual-machines/disks-enable-ultra-ssd.md) at required IOPS and throughput levels only for the log File. <br/><br/> -  [Premium file shares](failover-cluster-instance-premium-file-share-manually-configure.md) are recommended as shared storage for a SQL Server failover cluster instance. Premium file shares do not support caching, and offer limited performance compared to premium SSD disks. Choose premium SSD-managed disks over premium file shares for standalone SQL instances; but leverage premium file shares for failover cluster instance shared storage for ease of maintenance and flexible scalability. <br/><br/> -  Standard storage is only recommended for development and test purposes or for backup files and should not be used for production workloads. <br/><br/> - Keep the [storage account](../../../storage/common/storage-account-create.md) and SQL Server VM in the same region.<br/><br/> - Disable Azure [geo-redundant storage](../../../storage/common/storage-redundancy.md) (geo-replication) on the storage account.  |
| [Disks](#disks-guidance) | - Use a minimum of 2 [premium SSD disks](../../../virtual-machines/disks-types.md#premium-ssd) (1 for log file and 1 for data files). <br/><br/> - For workloads requiring <1 ms IO latencies, enable write accelerator for M series and consider using Ultra SSD disks for Es and DS series. <br/><br/> - Enable [read only caching](../../../virtual-machines/premium-storage-performance.md#disk-caching) on the disk(s) hosting the data files.<br/><br/> - Add an additional 20% premium IOPS/throughput capacity than your workload requires when [configuring storage for SQL Server data, log, and TempDB files](storage-configuration.md) <br/><br/> - Avoid using operating system or temporary disks for database storage or logging.<br/><br/> - Do not enable caching on disk(s) hosting the log file.  **Important**: Stop the SQL Server service when changing the cache settings for an Azure Virtual Machines disk.<br/><br/> - Stripe multiple Azure data disks to get increased storage throughput.<br/><br/> - Format with documented allocation sizes. <br/><br/> - Place TempDB on the local SSD `D:\` drive for mission critical SQL Server workloads (after choosing correct VM size). If you create the VM from the Azure portal or Azure quickstart templates and [place Temp DB on the Local Disk](https://techcommunity.microsoft.com/t5/SQL-Server/Announcing-Performance-Optimized-Storage-Configuration-for-SQL/ba-p/891583) then you do not need any further action; for all other cases follow the steps in the blog for  [Using SSDs to store TempDB](https://cloudblogs.microsoft.com/sqlserver/2014/09/25/using-ssds-in-azure-vms-to-store-sql-server-tempdb-and-buffer-pool-extensions/) to prevent failures after restarts. If the capacity of the local drive is not enough for your Temp DB size, then place Temp DB on a storage pool [striped](../../../virtual-machines/premium-storage-performance.md) on premium SSD disks with [read-only caching](../../../virtual-machines/premium-storage-performance.md#disk-caching). |
| [I/O](#io-guidance) |- Enable database page compression.<br/><br/> - Enable instant file initialization for data files.<br/><br/> - Limit autogrowth of the database.<br/><br/> - Disable autoshrink of the database.<br/><br/> - Move all databases to data disks, including system databases.<br/><br/> - Move SQL Server error log and trace file directories to data disks.<br/><br/> - Configure default backup and database file locations.<br/><br/> - [Enable locked pages in memory](/sql/database-engine/configure-windows/enable-the-lock-pages-in-memory-option-windows?view=sql-server-2017).<br/><br/> - Apply SQL Server performance fixes. |
| [Feature-specific](#feature-specific-guidance) | - Back up directly to Azure Blob storage.<br/><br/>- Use [file snapshot backups](/sql/relational-databases/backup-restore/file-snapshot-backups-for-database-files-in-azure) for databases larger than 12 TB. <br/><br/>- Use multiple Temp DB files, 1 file per core, up to 8 files.<br/><br/>- Set max server memory at 90% or up to 50 GB left for the Operating System. <br/><br/>- Enable soft NUMA. |


<br/>
For more information on *how* and *why* to make these optimizations, please review the details and guidance provided in the following sections.
<br/><br/>

## VM size guidance

If you are migrating a current on-premises server to an Azure SQL VM, it is natural to start by using the CPU and memory configuration from your source machine. Customers are especially going to want to bring their core licensing to the Azure if they are able to take advantage of [Azure Hybrid Use Benefit](https://azure.microsoft.com/en-us/pricing/hybrid-benefit/).

The next step is choosing a VM size in one of the VM series that is most optimal for SQL Server performance based on your workload (OLTP or data warehouse). 

### Memory Optimized

We recommend the [memory optimized virtual machine sizes](../../../virtual-machines/sizes-memory) as a primary target for Azure SQL VMs. The memory optimized virtual machines offers stronger memory-to-CPU ratios and medium to large cache options.

### M-series and Mv2-series
The [M-series](../../../virtual-machines/m-series) offers vCPU counts and memory for some of the largest SQL Server workloads. These VMs are hosted on memory optimized hardware with the Skylake processor family. This VM series supports premium storage, which is recommended for the best performance along with host level read caching. 

The [Mv2-series](../../../virtual-machines/mv2-series) has the highest vCPU counts and memory and is recommended for mission critical and data warehouse workloads. Mv2-series instances are memory optimized VM sizes providing unparalleled computational performance to support large in-memory databases and workloads with a high memory-to-CPU ratio that is perfect for relational database servers, large caches, and in-memory analytics.

Some of the features of the M and Mv2-series attractive for SQL Server performance include [premium storage](../../../virtual-machines/premium-storage-performance) and [premium storage caching](../../../virtual-machines/premium-storage-performance#disk-caching) support, [ultra-disk](../../../virtual-machines/disks-enable-ultra-ssd) support, and [write acceleration](../../../virtual-machines/how-to-enable-write-accelerator).

### Edsv4-series 
Another memory optimized option is the [Edsv4-series](../../../virtual-machines/edv4-edsv4-series) which is designed for memory-intensive applications. These VMs have a large local storage SSD capacity, strong local disk IOPS, up to 504 GiB of RAM, and improved compute compared to the previous Ev3/Esv3 sizes with Gen2 VMs. There is a nearly consistent memory to core ratio of 8 across these virtual machines which is ideal for standard SQL Server workloads. 

These virtual machines are ideal for memory-intensive enterprise applications and applications that benefit from low latency, high-speed local storage.

These virtual machines support Premium Storage, Premium Storage caching, and VM Generation Support Generation 1 and 2.

### DSv2-series 11-15
Another memory optimized option is the [DSv2-series 11-15](../../../virtual-machines/dv2-dsv2-series-memory#dsv2-series-11-15). The DSv2-series has the same memory and disk configurations as the previous D-series. This series has a consistent memory-to-CPU ratio of 7 across all virtual machines. 

The [DSv2-series 11-15](../../../virtual-machines/dv2-dsv2-series-memory#dsv2-series-11-15) supports premium storage and premium storage caching which is strongly recommended for optimal performance.

### General Purpose
Another option is the [general purpose virtual machine sizes](../../../virtual-machines/sizes-general) which are designed to provide balanced CPU-to-memory ratios for small to medium SQL Server workloads. The memory to core ratio for these machines are nearly consistent at 4 vCore for a majority of the machines with the exception of the Av2-series where the A4m_v2 and A8m_v2 sizes have a memory to vCore ratio of 8. 

The 4 core virtual machine sizes are good for small departmental SQL Server machines and development servers. The 8 core virtual machines may be a good option for small application based database servers.

Microsoft recommends a memory to core ratio of 8 as a starting point for production SQL Server workloads.

For the general purpose virtual machine sizes we recommend a minimum of 4 vCPU and a minimum of 32 GB of memory. The general purpose machines support up to 96 vCores and up to 384 GBs of memory. 

Because of the smaller memory to core ratios, it is recommended to carefully monitor memory based performance counters to ensure SQL Server is able to get the buffer cache memory it needs.

The below counters can help validate the memory health of a SQL Server virtual machine.
* [\Memory\Available MBytes](https://docs.microsoft.com/en-us/azure/monitoring/infrastructure-health/vmhealth-windows/winserver-memory-availmbytes)
<br/>
* [\SQLServer:Memory Manager\Target Server Memory (KB)](https://docs.microsoft.com/en-us/sql/relational-databases/performance-monitor/sql-server-buffer-manager-object)
<br/>
* [\SQLServer:Memory Manager\Total Server Memory (KB)](https://docs.microsoft.com/en-us/sql/relational-databases/performance-monitor/sql-server-buffer-manager-object)
<br/>
* [\SQLServer:Buffer Manager\Lazy writes/sec](https://docs.microsoft.com/en-us/sql/relational-databases/performance-monitor/sql-server-buffer-manager-object)
<br/>
* [\SQLServer:Buffer Manager\Page life expectancy](https://docs.microsoft.com/en-us/sql/relational-databases/performance-monitor/sql-server-buffer-manager-object)

### Ddsv4-series
The Ddv4-series offers a fair combination of vCPU, memory and temporary disk for most production workloads. 

The Ddv4 VM sizes includes faster local SSD storage designed for applications that need low latency and high-speed local storage.

These machines are ideal for side-by-side SQL and app deployments that require fast access to temp storage and departmental relational databases. There is a standard memory to core ratio of 4 across all of the virtual machines in this series. For this reason, it is recommended to leverage the D8ds_v4 as the starter virtual machine in this series which has 8 vCores and 32 GBs of memory. The largest machine is the D64ds_v4 which has 64 vCores and 256 GBs of memory.

These virtual machines support premium storage, support premium storage caching, and support VM generations 1 and 2.

### B-series
The burstable virtual machine sizes are ideal for workloads that do not need consistent performance such as proof of concept and very small databases and development servers. This series is unique as the apps have the ability to burst during business hours with burstable credits varying based on machine size and when the credits are exhausted, the VM returns to the baseline performance.

The benefit of the B-series is the compute savings you could achieve compared to the other VM sizes in other series especially if you need the processing power sparingly throughput the day.

This series supports premium storage, premium storage caching, VM generation support 1 and 2.

### Av2-series
The Av2-series VMs are best suited for entry level workloads like development and test, low traffic web servers, small to medium app databases, and proof-of-concepts.

Only the A2m_v2 (2 cores and 16GBs of memory), A4m_v2 (4 cores and 32GBs of memory), and the A8m_v2 (8 cores and 64GBs of memory) have a fair memory to core ratio of 8 for these top three virtual machines. 

It is important to be aware that the Av2 series does not support premium storage.

### Storage optimized
The last recommended option to consider for SQL Server workloads is the storage optimized VM sizes that has a specific use case. These virtual machines are specifically designed with optimized disk throughput and IO. This virtual series is strong for big data scenarios, data warehousing, and large transactional databases. 

The Lsv2-series features high throughput and low latency features with local NVMe storage. 

These virtual machines size from 8 to 80 vCPU with 8 GiB of memory per vCPU and for every 8 vCPUs there is 1.92TB of NVMe SSD. This means for the largest VM of this series, the L80s_v2, there is 80 vCPU and 640 BiB of memory with 10x1.92TB of NVMe storage. 

The NVMe storage is ephemeral meaning that data will be lost on these disks if you restart your virtual machine.

### Lsv2-series
The Lsv2-series features high throughput, low latency, and local NVMe storage. The Lsv2-series VMs are optimized to use the local disk on the node attached directly to the VM rather than using durable data disks. These virtual machines are strong options for big data, data warehouse, reporting and ETL workloads.

The high throughput and IOPs of the local NVMe storage is a good use case for processing files that will be loaded into your database and other scenarios where the source data can be recreated from the source system or other repository such as Azure Blob storage or Azure Data Lake. 

SQL Server data, log, and tempdb files should be stored on the uncached data disks. It is not recommended to store data files on the ephemeral NVMe storage as there would be data loss in the deallocation of the VM or in the event of a VM failure. 

Note: The Lsv2 and Ls-series do not support the creation of a local cache to increase the IOPs achievable by durable data disks.

These virtual machine support premium storage, but does not support premium storage caching. There is VM generation support for generation 1 and 2. Additionally, bursting is supported in this series. Lsv2-series VMs can burst their disk performance for up to 30 minutes at a time.

There is a consistent memory to vCore ratio of 8 across all of these virtual machines.

### Performance Collection

For a more prescriptive approach you will want to gather the performance counters using perfmon/logman and may also want to capture the SQL Server wait statistics to gain a perspective of the general pressures and potential bottlenecks of the source environment.

Start by collecting the CPU, memory, [IOPS](../../../virtual-machines/premium-storage-performance.md#iops), [throughput](../../../virtual-machines/premium-storage-performance.md#throughput)  and [latency](../../../virtual-machines/premium-storage-performance.md#latency) of the source workload at peak times following the [application performance checklist](../../../virtual-machines/premium-storage-performance.md#application-performance-requirements-checklist). 

> [!NOTE] It is important to consider all of the peak times in your environment. For example, you may want to capture the 9:00am to 5:00pm workloads of a typical business day, but you may also need to consider end of day processing, ETL workloads that could be running after-hours, and weekend processing. 

For end of month and end of quarter processing, you may want to consider scaling up your environment for these specific workload windows and then scaling down when you are done with your reporting and other processing.

Once your performance characteristics are captured and analyzed, you would then select the [VM Size](../../../virtual-machines/sizes-memory) that can scale to your workload's performance requirements.

### IOPS and Throughput
SQL Server performance depends heavily on the I/O subsystem. Unless your database fits into physical memory, SQL Server constantly brings database pages in and out of the buffer pool. The data files for SQL Server should be treated differently. Access to log files is sequential except when a transaction needs to be rolled back where data files, including tempdb, are randomly accessed. If you have a slow I/O subsystem, your users may experience performance problems such as slow response times and tasks that do not complete due to time-outs. 

The Azure marketplace virtual machines have log files on a physical disk that is separate from the data files by default. The tempdb data files count and size meet best practices and are targeted to the ephemeral D:/ drive also by default. 

You can use the following performance counters to baseline your SQL Server workloads.
The perfmon counters \LogicalDisk\Disk Reads/Sec and \LogicalDisk\Disk Writes/Sec performance counters can be used to collect read and write IOPS requirements. The \LogicalDisk\Disk Bytes/Sec counter can be used to collect storage throughput requirements for the data, log, and tempdb files. 

After IOPS and throughput requirements at peak levels are defined the next step is to evaluate VM sizes that matches the capacity from your measurements. 

If your workload requires 20K read IOPS and 10K write IOPS, you can either choose E16s_v3 (with up to 32K cached and 25600 uncached IOPS) or M16_s (with up to 20K cached and 10K uncached IOPS) with 2 P30 disks striped using Storage Spaces. 

Make sure to understand both throughput and IOPS requirements of the workload as VMs has different scale limits for IOPS and throughput.

### Memory
When examining memory, it is important  to track external memory from the OS as well as the memory that is internal to be used by SQL Server. Identifying when the operating system and separately when SQL Server runs under memory pressure will help both size virtual machines as well as identify opportunities for tuning. 

These counters can help validate the memory health of a SQL Server virtual machine.
* [\Memory\Available MBytes](https://docs.microsoft.com/en-us/azure/monitoring/infrastructure-health/vmhealth-windows/winserver-memory-availmbytes)
<br/>
* [\SQLServer:Memory Manager\Target Server Memory (KB)](https://docs.microsoft.com/en-us/sql/relational-databases/performance-monitor/sql-server-buffer-manager-object)
<br/>
* [\SQLServer:Memory Manager\Total Server Memory (KB)](https://docs.microsoft.com/en-us/sql/relational-databases/performance-monitor/sql-server-buffer-manager-object)
<br/>
* [\SQLServer:Buffer Manager\Lazy writes/sec](https://docs.microsoft.com/en-us/sql/relational-databases/performance-monitor/sql-server-buffer-manager-object)
<br/>
* [\SQLServer:Buffer Manager\Page life expectancy](https://docs.microsoft.com/en-us/sql/relational-databases/performance-monitor/sql-server-buffer-manager-object)

### Compute / Processing
Compute in Azure is managed differently than on-prem. On-prem servers are built to last 3-5 years without an upgrade due to the cost and difficulty of acquiring new hardware. This is mitigated somewhat by virtualized environments but they are often optimized to take the most advantage of the underlying hardware, meaning any significant change to resource consumption by a VM requires rebalancing of the entire environment. This is not a problem on Azure where a completely different machine is a reboot away. Azure virtual machines should be configured to keep average CPU as high as possible without impacting the workload. An ideal configuration would be a machine running at 80%+ CPU with peaks above 90% but not reaching 100% for any sustained period of time.

Fundamentally, we only want to provision the compute that the application needs knowing we can scale upwards for end of month and end of quarter workloads. 

The below counters can help validate the compute health of a SQL Server virtual machine.
* \Processor Information(_Total)\% Processor Time
* \Process(sqlservr)\% Processor Time

### SQL Workloads
Tracking errors can help identify if there is something unexpectedly different between your workload tests. To track repeatable workloads for performance tuning and especially to compare the amount of user throughput compared to on-prem and other scenarios it is recommended to leverage the following counters. 

* [\SQLServer:SQL Statistics\Batch Requests/sec](https://docs.microsoft.com/en-us/sql/relational-databases/performance-monitor/sql-server-sql-statistics-object?view=sql-server-ver15)
<br/>
* [\SQLServer:Transactions](https://docs.microsoft.com/en-us/sql/relational-databases/performance-monitor/sql-server-transactions-object?view=sql-server-ver15)
<br/>
* [\SQLServer:SQL Errors(*)\Errors/sec](https://docs.microsoft.com/en-us/sql/relational-databases/performance-monitor/sql-server-sql-errors-object?view=sql-server-ver15)



### Creating a New Machine (Greenfield)

If you are creating a new SQL Server on an Azure SQL VM and you are not migrating a current source system; create your new Azure SQL VM based on your vendor requirements.  The vendor requirements for an Azure SQL VM would be the same as what you would deploy on-premises. 

If you are creating a new Azure SQL VM with a new application built for the cloud, you can easily size your Azure SQL VM as your data and usage requirements evolve.

You could start with the development environments as was previously recommended with the D-series, B-series or even the Av2-series and grow your environment over time.

A new SQL Server OLTP environment should have 4 vCore, a recommended minimum of 32 GBs of memory, with at least a memory to vCore ratio of 8 as you scale your virtual machines.

For new environments, start with 4 core machines and scale to 8, 16, 32, and above when your data and compute requirements change. For OLTP throughput, target Azure SQL VMs that have 5000 IOPS for every vCore. Using the Azure SQL VM marketplace images with the storage configuration in the portal, makes it easy to create the storage pools necessary to get the size, IOPS and throughput necessary for your workloads. 

It is important to choose Azure SQL VMs that support premium storage and premium storage caching which is covered in more details in the storage section.

SQL Server data warehouse environments will often need to scale beyond the 1:8 core to memory ratio. For medium environments you may want to choose 1:16 with larger data warehouse environments having 1:32 memory to core ratios.

SQL Server data warehouse environments often benefit from the parallel processing of larger machines. For this reason the M-series and the Mv2-series are strong options for larger data warehouse environments.


## Constrained Cores

High performing SQL Server workloads often need larger amounts of memory, IO, and throughput without the higher core counts. 

The reason is that most OLTP workloads are application databases driven by large numbers of smaller transactions. With OLTP workloads, only a small amount of the data is read or modified, but the volumes of transactions driven by user counts are much higher. It is important to have the memory to cache plans, cache recently accessed data for performance, and ensure physical reads can be read into memory quickly. These OLTP environments need memory, storage, and I/O bandwidth in order to perform optimally. 

In order to maintain performance with lower SQL Server licensing costs, Azure offers VM sizes with constrained vCPU counts, while maintaining the same memory, storage, and I/O bandwidth of the parent virtual machine.

The vCPU count can be constrained to one half or one quarter of the original VM size. These new VM sizes have a suffix that specifies the number of active vCPUs to make them easier to identify. 

For example, the M64-32ms requires licensing only 32 SQL Server cores with the memory, IO, and throughput of the M64ms and the M64-16ms requires licensing only 16 cores.  

  > [!IMPORTANT] The compute cost, which includes operating system licensing, will remain the same as the parent virtual machine. 

For the previous example, while the M64-16ms has a quarter of the SQL Server licensing cost of the M64ms, the compute cost of the virtual machine will be the same.

> [!NOTE] Medium to large data warehouse workloads may still benefit from constrained core VMs, but data warehouse workloads are commonly characterized by fewer users and processes addressing larger amounts of data through query plans that runs in parallel. 

## Storage guidance

For detailed testing of SQL Server performance on Azure Virtual Machines with TPC-E and TPC_C benchmarks, refer to the blog [Optimize OLTP performance](https://techcommunity.microsoft.com/t5/SQL-Server/Optimize-OLTP-Performance-with-SQL-Server-on-Azure-VM/ba-p/916794). 

Azure blob cache with premium SSDs is recommended for all production workloads. 

> [!WARNING]
> Standard HDDs and SSDs have varying latencies and bandwidth and are only recommended for dev/test workloads. Production workloads should use premium SSDs.

In addition, we recommend that you create your Azure storage account in the same data center as your SQL Server virtual machines to reduce transfer delays. When creating a storage account, disable geo-replication as consistent write order across multiple disks is not guaranteed. Instead, consider configuring a SQL Server disaster recovery technology between two Azure data centers. For more information, see [High Availability and Disaster Recovery for SQL Server on Azure Virtual Machines](business-continuity-high-availability-disaster-recovery-hadr-overview.md).

## Disks guidance

There are three main disk types on Azure virtual machines:

* **OS disk**: When you create an Azure virtual machine, the platform will attach at least one disk (labeled as the **C** drive) to the VM for your operating system disk. This disk is a VHD stored as a page blob in storage.
* **Temporary disk**: Azure virtual machines contain another disk called the temporary disk (labeled as the **D**: drive). This is a disk on the node that can be used for scratch space.
* **Data disks**: You can also attach additional disks to your virtual machine as data disks, and these will be stored in storage as page blobs.

The following sections describe recommendations for using these different disks.

### Operating system disk

An operating system disk is a VHD that you can boot and mount as a running version of an operating system and is labeled as the **C** drive.

Default caching policy on the operating system disk is **Read/Write**. For performance sensitive applications, we recommend that you use data disks instead of the operating system disk. See the section on Data Disks below.

### Temporary disk

The temporary storage drive, labeled as the **D** drive, is not persisted to Azure Blob storage. Do not store your user database files or user transaction log files on the **D**: drive.

Place TempDB on the local SSD `D:\` drive for mission critical SQL Server workloads (after choosing correct VM size). If you create the VM from the Azure portal or Azure quickstart templates and [place Temp DB on the Local Disk](https://techcommunity.microsoft.com/t5/SQL-Server/Announcing-Performance-Optimized-Storage-Configuration-for-SQL/ba-p/891583), then you do not need any further action; for all other cases follow the steps in the blog for  [Using SSDs to store TempDB](https://cloudblogs.microsoft.com/sqlserver/2014/09/25/using-ssds-in-azure-vms-to-store-sql-server-tempdb-and-buffer-pool-extensions/) to prevent failures after restarts. If the capacity of the local drive is not enough for your Temp DB size, then place Temp DB on a storage pool [striped](../../../virtual-machines/premium-storage-performance.md) on premium SSD disks with [read-only caching](../../../virtual-machines/premium-storage-performance.md#disk-caching).

For VMs that support premium SSDs, you can also store TempDB on a disk that supports premium SSDs with read caching enabled.


### Data disks

* **Use premium SSD disks for data and log files**: If you are not using disk striping, use two premium SSD disks where one disk contains the log file and the other contains the data. Each premium SSD provides a number of IOPS and bandwidth (MB/s) depending on its size, as depicted in the article, [Select a disk type](../../../virtual-machines/disks-types.md). If you are using a disk striping technique, such as Storage Spaces, you achieve optimal performance by having two pools, one for the log file(s) and the other for the data files. However, if you plan to use SQL Server failover cluster instances (FCI), you must configure one pool, or utilize [premium file shares](failover-cluster-instance-premium-file-share-manually-configure.md) instead.

   > [!TIP]
   > - For test results on various disk and workload configurations, see the following blog post: [Storage Configuration Guidelines for SQL Server on Azure Virtual Machines](/archive/blogs/sqlserverstorageengine/storage-configuration-guidelines-for-sql-server-on-azure-vm).
   > - For mission critical performance for SQL Servers that need ~ 50,000 IOPS, consider replacing 10 -P30 disks with an Ultra SSD. For more information, see the following blog post: [Mission critical performance with Ultra SSD](https://azure.microsoft.com/blog/mission-critical-performance-with-ultra-ssd-for-sql-server-on-azure-vm/).

   > [!NOTE]
   > When you provision a SQL Server VM in the portal, you have the option of editing your storage configuration. Depending on your configuration, Azure configures one or more disks. Multiple disks are combined into a single storage pool with striping. Both the data and log files reside together in this configuration. For more information, see [Storage configuration for SQL Server VMs](storage-configuration.md).

* **Disk striping**: For more throughput, you can add additional data disks and use disk striping. To determine the number of data disks, you need to analyze the number of IOPS and bandwidth required for your log file(s), and for your data and TempDB file(s). Notice that different VM sizes have different limits on the number of IOPs and bandwidth supported, see the tables on IOPS per [VM size](../../../virtual-machines/sizes.md?toc=%252fazure%252fvirtual-machines%252fwindows%252ftoc.json). Use the following guidelines:

  * For Windows 8/Windows Server 2012 or later, use [Storage Spaces](/previous-versions/windows/it-pro/windows-server-2012-R2-and-2012/hh831739(v=ws.11)) with the following guidelines:

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

  * For Windows 2008 R2 or earlier, you can use dynamic disks (OS striped volumes) and the stripe size is always 64 KB. This option is deprecated as of Windows 8/Windows Server 2012. For information, see the support statement at [Virtual Disk Service is transitioning to Windows Storage Management API](/windows/win32/w8cookbook/vds-is-transitioning-to-wmiv2-based-windows-storage-management-api).

  * If you are using [Storage Spaces Direct (S2D)](/windows-server/storage/storage-spaces/storage-spaces-direct-in-vm) with [SQL Server Failover Cluster Instances](failover-cluster-instance-storage-spaces-direct-manually-configure.md), you must configure a single pool. Although different volumes can be created on that single pool, they will all share the same characteristics, such as the same caching policy.

  * Determine the number of disks associated with your storage pool based on your load expectations. Keep in mind that different VM sizes allow different numbers of attached data disks. For more information, see [Sizes for virtual machines](../../../virtual-machines/sizes.md?toc=%252fazure%252fvirtual-machines%252fwindows%252ftoc.json).

  * If you are not using premium SSDs (dev/test scenarios), the recommendation is to add the maximum number of data disks supported by your [VM size](../../../virtual-machines/sizes.md?toc=%252fazure%252fvirtual-machines%252fwindows%252ftoc.json) and use disk striping.

* **Caching policy**: Note the following recommendations for caching policy depending on your storage configuration.

  * If you are using separate disks for data and log files, enable read caching on the data disks hosting your data files and TempDB data files. This can result in a significant performance benefit. Do not enable caching on the disk holding the log file as this causes a minor decrease in performance.

  * If you are using disk striping in a single storage pool, most workloads will benefit from read caching. If you have separate storage pools for the log and data files, enable read caching only on the storage pool for the data files. In certain heavy write workloads, better performance might be achieved with no caching. This can only be determined through testing.

  * The previous recommendations apply to premium SSDs. If you are not using premium SSDs, do not enable any caching on any data disks.

  * For instructions on configuring disk caching, see the following articles. For the classic (ASM) deployment model see: [Set-AzureOSDisk](/previous-versions/azure/jj152847(v=azure.100)) and [Set-AzureDataDisk](/previous-versions/azure/jj152851(v=azure.100)). For the Azure Resource Manager deployment model, see: [Set-AzOSDisk](/powershell/module/az.compute/set-azvmosdisk) and [Set-AzVMDataDisk](/powershell/module/az.compute/set-azvmdatadisk).

     > [!WARNING]
     > Stop the SQL Server service when changing the cache setting of Azure Virtual Machines disks to avoid the possibility of any database corruption.

* **NTFS allocation unit size**: When formatting the data disk, it is recommended that you use a 64-KB allocation unit size for data and log files as well as TempDB. If TempDB is placed on the temporary disk (D:\ drive) the performance gained by leveraging this drive outweighs the need for a 64K allocation unit size. 

* **Disk management best practices**: When removing a data disk or changing its cache type, stop the SQL Server service during the change. When the caching settings are changed on the OS disk, Azure stops the VM, changes the cache type, and restarts the VM. When the cache settings of a data disk are changed, the VM is not stopped, but the data disk is detached from the VM during the change and then reattached.

  > [!WARNING]
  > Failure to stop the SQL Server service during these operations can cause database corruption.


## I/O guidance

* The best results with premium SSDs are achieved when you parallelize your application and requests. Premium SSDs are designed for scenarios where the IO queue depth is greater than 1, so you will see little or no performance gains for single-threaded serial requests (even if they are storage intensive). For example, this could impact the single-threaded test results of performance analysis tools, such as SQLIO.

* Consider using [database page compression](/sql/relational-databases/data-compression/data-compression) as it can help improve performance of I/O intensive workloads. However, the data compression might increase the CPU consumption on the database server.

* Consider enabling instant file initialization to reduce the time that is required for initial file allocation. To take advantage of instant file initialization, you grant the SQL Server (MSSQLSERVER) service account with SE_MANAGE_VOLUME_NAME and add it to the **Perform Volume Maintenance Tasks** security policy. If you are using a SQL Server platform image for Azure, the default service account (NT Service\MSSQLSERVER) isn’t added to the **Perform Volume Maintenance Tasks** security policy. In other words, instant file initialization is not enabled in a SQL Server Azure platform image. After adding the SQL Server service account to the **Perform Volume Maintenance Tasks** security policy, restart the SQL Server service. There could be security considerations for using this feature. For more information, see [Database File Initialization](/sql/relational-databases/databases/database-instant-file-initialization).

* Be aware that **autogrow** is considered to be merely a contingency for unexpected growth. Do not manage your data and log growth on a day-to-day basis with autogrow. If autogrow is used, pre-grow the file using the Size switch.

* Make sure **autoshrink** is disabled to avoid unnecessary overhead that can negatively affect performance.

* Move all databases to data disks, including system databases. For more information, see [Move System Databases](/sql/relational-databases/databases/move-system-databases).

* Move SQL Server error log and trace file directories to data disks. This can be done in SQL Server Configuration Manager by right-clicking your SQL Server instance and selecting properties. The error log and trace file settings can be changed in the **Startup Parameters** tab. The Dump Directory is specified in the **Advanced** tab. The following screenshot shows where to look for the error log startup parameter.

    ![SQL ErrorLog Screenshot](./media/performance-guidelines-best-practices/sql_server_error_log_location.png)

* Set up default backup and database file locations. Use the recommendations in this article, and make the changes in the Server properties window. For instructions, see [View or Change the Default Locations for Data and Log Files (SQL Server Management Studio)](/sql/database-engine/configure-windows/view-or-change-the-default-locations-for-data-and-log-files). The following screenshot demonstrates where to make these changes.

    ![SQL Data Log and Backup files](./media/performance-guidelines-best-practices/sql_server_default_data_log_backup_locations.png)
* Enable locked pages to reduce IO and any paging activities. For more information, see [Enable the Lock Pages in Memory Option (Windows)](/sql/database-engine/configure-windows/enable-the-lock-pages-in-memory-option-windows).

* If you are running SQL Server 2012, install Service Pack 1 Cumulative Update 10. This update contains the fix for poor performance on I/O when you execute select into temporary table statement in SQL Server 2012. For information, see this [knowledge base article](https://support.microsoft.com/kb/2958012).

* Consider compressing any data files when transferring in/out of Azure.

## Feature-specific guidance

Some deployments may achieve additional performance benefits using more advanced configuration techniques. The following list highlights some SQL Server features that can help you to achieve better performance:

### Back up to Azure Storage
When performing backups for SQL Server running in Azure Virtual Machines, you can use [SQL Server Backup to URL](/sql/relational-databases/backup-restore/sql-server-backup-to-url). This feature is available starting with SQL Server 2012 SP1 CU2 and recommended for backing up to the attached data disks. When you backup/restore to/from Azure Storage, follow the recommendations provided at [SQL Server Backup to URL Best Practices and Troubleshooting and Restoring from Backups Stored in Azure Storage](/sql/relational-databases/backup-restore/sql-server-backup-to-url-best-practices-and-troubleshooting). You can also automate these backups using [Automated Backup for SQL Server on Azure Virtual Machines](../../../azure-sql/virtual-machines/windows/automated-backup-sql-2014.md).

Prior to SQL Server 2012, you can use [SQL Server Backup to Azure Tool](https://www.microsoft.com/download/details.aspx?id=40740). This tool can help to increase backup throughput using multiple backup stripe targets.

### SQL Server Data Files in Azure

This new feature, [SQL Server Data Files in Azure](/sql/relational-databases/databases/sql-server-data-files-in-microsoft-azure), is available starting with SQL Server 2014. Running SQL Server with data files in Azure demonstrates comparable performance characteristics as using Azure data disks.

### Failover cluster instance and Storage Spaces

If you are using Storage Spaces, when adding nodes to the cluster on the **Confirmation** page, clear the check box labeled **Add all eligible storage to the cluster**. 

![Uncheck eligible storage](./media/performance-guidelines-best-practices/uncheck-eligible-cluster-storage.png)

If you are using Storage Spaces and do not uncheck **Add all eligible storage to the cluster**, Windows detaches the virtual disks during the clustering process. As a result, they do not appear in Disk Manager or Explorer until the storage spaces are removed from the cluster and reattached using PowerShell. Storage Spaces groups multiple disks in to storage pools. For more information, see [Storage Spaces](/windows-server/storage/storage-spaces/overview).

## Multiple instances 

Consider the following best practices when deploying multiple SQL Server instances to a single virtual machine: 

- Set the max server memory for each SQL Server instance, ensuring there is memory left over for the operating system. Be sure to update the memory restrictions for the SQL Server instances if you change how much memory is allocated to the virtual machine. 
- Have separate LUNs for data, logs, and TempDB since they all have different workload patterns and you do not want them impacting each other. 
- Thoroughly test your environment under heavy production-like workloads to ensure it can handle peak workload capacity within your application SLAs. 

Signs of overloaded systems can include, but are not limited to, worker thread exhaustion, slow response times, and/or stalled dispatcher system memory. 




## Next steps

For more information about storage and performance, see [Storage configuration guidelines for SQL Server on Azure Virtual Machines](/archive/blogs/sqlserverstorageengine/storage-configuration-guidelines-for-sql-server-on-azure-vm)

For security best practices, see [Security considerations for SQL Server on Azure Virtual Machines](security-considerations-best-practices.md).

Review other SQL Server Virtual Machine articles at [SQL Server on Azure Virtual Machines Overview](sql-server-on-azure-vm-iaas-what-is-overview.md). If you have questions about SQL Server virtual machines, see the [Frequently Asked Questions](frequently-asked-questions-faq.md).
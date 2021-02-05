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
ms.subservice: performance
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: vm-windows-sql-server
ms.workload: iaas-sql-server
ms.date: 11/09/2020
ms.author: mathoma
ms.reviewer: jroth
---
# Performance guidelines for SQL Server on Azure Virtual Machines
[!INCLUDE[appliesto-sqlvm](../../includes/appliesto-sqlvm.md)]

This article provides guidance for optimizing SQL Server performance in Microsoft Azure Virtual Machines.

## Overview

While running SQL Server on Azure Virtual Machines, we recommend that you continue using the same database performance tuning options that are applicable to SQL Server in on-premises server environments. However, the performance of a relational database in a public cloud depends on many factors such as the size of a virtual machine, and the configuration of the data disks.

[SQL Server images provisioned in the Azure portal](sql-vm-create-portal-quickstart.md) follow general storage [configuration best practices](storage-configuration.md). After provisioning, consider applying other optimizations discussed in this article. Base your choices on your workload and verify through testing.

> [!TIP]
> There is typically a trade-off between optimizing for costs and optimizing for performance. This article is focused on getting the *best* performance for SQL Server on Azure Virtual Machines. If your workload is less demanding, you might not require every optimization listed below. Consider your performance needs, costs, and workload patterns as you evaluate these recommendations.

## Quick checklist

The following is a quick checklist for optimal performance of SQL Server on Azure Virtual Machines:

| Area | Optimizations |
| --- | --- |
| [VM size](#vm-size-guidance) | - Use VM sizes with 4 or more vCPU like the [Standard_M8-4ms](../../../virtual-machines/m-series.md), the [E4ds_v4](../../../virtual-machines/edv4-edsv4-series.md#edv4-series), or the [DS12_v2](../../../virtual-machines/dv2-dsv2-series-memory.md#dsv2-series-11-15) or higher. <br/><br/> - Use [memory optimized](../../../virtual-machines/sizes-memory.md) virtual machine sizes for the best performance of SQL Server workloads. <br/><br/> - The [DSv2 11-15](../../../virtual-machines/dv2-dsv2-series-memory.md), [Edsv4](../../../virtual-machines/edv4-edsv4-series.md) series, the [M-](../../../virtual-machines/m-series.md), and the [Mv2-](../../../virtual-machines/mv2-series.md) series offer the optimal memory-to-vCore ratio required for OLTP workloads. Both M series VMs offer the highest memory-to-vCore ratio required for mission critical workloads and is also ideal for data warehouse workloads. <br/><br/> - A higher memory-to-vCore ratio may be required for mission critical and data warehouse workloads. <br/><br/> - Leverage the Azure Virtual Machine marketplace images as the SQL Server settings and storage options are configured for optimal SQL Server performance. <br/><br/> - Collect the target workload's performance characteristics and use them to determine the appropriate VM size for your business.|
| [Storage](#storage-guidance) | - For detailed testing of SQL Server performance on Azure Virtual Machines with TPC-E and TPC_C benchmarks, refer to the blog [Optimize OLTP performance](https://techcommunity.microsoft.com/t5/SQL-Server/Optimize-OLTP-Performance-with-SQL-Server-on-Azure-VM/ba-p/916794). <br/><br/> - Use [premium SSDs](https://techcommunity.microsoft.com/t5/SQL-Server/Optimize-OLTP-Performance-with-SQL-Server-on-Azure-VM/ba-p/916794) for the best price/performance advantages. Configure [Read only cache](../../../virtual-machines/premium-storage-performance.md#disk-caching) for data files and no cache for the log file. <br/><br/> - Use [Ultra Disks](../../../virtual-machines/disks-types.md#ultra-disk) if less than 1-ms storage latencies are required by the workload. See [migrate to ultra disk](storage-migrate-to-ultradisk.md) to learn more. <br/><br/> - Collect the storage latency requirements for SQL Server data, log, and Temp DB files by [monitoring the application](../../../virtual-machines/premium-storage-performance.md#application-performance-requirements-checklist) before choosing the disk type. If < 1-ms storage latencies are required, then use Ultra Disks, otherwise use premium SSD. If low latencies are only required for the log file and not for data files, then [provision the Ultra Disk](../../../virtual-machines/disks-enable-ultra-ssd.md) at required IOPS and throughput levels only for the log File. <br/><br/>  -  Standard storage is only recommended for development and test purposes or for backup files and should not be used for production workloads. <br/><br/> - Keep the [storage account](../../../storage/common/storage-account-create.md) and SQL Server VM in the same region.<br/><br/> - Disable Azure [geo-redundant storage](../../../storage/common/storage-redundancy.md) (geo-replication) on the storage account.  |
| [Disks](#disks-guidance) | - Use a minimum of 2 [premium SSD disks](../../../virtual-machines/disks-types.md#premium-ssd) (1 for log file and 1 for data files). <br/><br/> - For workloads requiring < 1-ms IO latencies, enable write accelerator for M series and consider using Ultra SSD disks for Es and DS series. <br/><br/> - Enable [read only caching](../../../virtual-machines/premium-storage-performance.md#disk-caching) on the disk(s) hosting the data files.<br/><br/> - Add an additional 20% premium IOPS/throughput capacity than your workload requires when [configuring storage for SQL Server data, log, and TempDB files](storage-configuration.md) <br/><br/> - Avoid using operating system or temporary disks for database storage or logging.<br/><br/> - Do not enable caching on disk(s) hosting the log file.  **Important**: Stop the SQL Server service when changing the cache settings for an Azure Virtual Machines disk.<br/><br/> - Stripe multiple Azure data disks to get increased storage throughput.<br/><br/> - Format with documented allocation sizes. <br/><br/> - Place TempDB on the local SSD `D:\` drive for mission critical SQL Server workloads (after choosing correct VM size). If you create the VM from the Azure portal or Azure quickstart templates and [place Temp DB on the Local Disk](https://techcommunity.microsoft.com/t5/SQL-Server/Announcing-Performance-Optimized-Storage-Configuration-for-SQL/ba-p/891583), then you do not need any further action; for all other cases follow the steps in the blog for  [Using SSDs to store TempDB](https://cloudblogs.microsoft.com/sqlserver/2014/09/25/using-ssds-in-azure-vms-to-store-sql-server-TempDB-and-buffer-pool-extensions/) to prevent failures after restarts. If the capacity of the local drive is not enough for your Temp DB size, then place Temp DB on a storage pool [striped](../../../virtual-machines/premium-storage-performance.md) on premium SSD disks with [read-only caching](../../../virtual-machines/premium-storage-performance.md#disk-caching). |
| [I/O](#io-guidance) |- Enable database page compression.<br/><br/> - Enable instant file initialization for data files.<br/><br/> - Limit autogrowth of the database.<br/><br/> - Disable autoshrink of the database.<br/><br/> - Move all databases to data disks, including system databases.<br/><br/> - Move SQL Server error log and trace file directories to data disks.<br/><br/> - Configure default backup and database file locations.<br/><br/> - [Enable locked pages in memory](/sql/database-engine/configure-windows/enable-the-lock-pages-in-memory-option-windows).<br/><br/> - Evaluate and apply the [latest cumulative updates](/sql/database-engine/install-windows/latest-updates-for-microsoft-sql-server) for the installed version of SQL Server. |
| [Feature-specific](#feature-specific-guidance) | - Back up directly to Azure Blob storage.<br/><br/>- Use [file snapshot backups](/sql/relational-databases/backup-restore/file-snapshot-backups-for-database-files-in-azure) for databases larger than 12 TB. <br/><br/>- Use multiple Temp DB files, 1 file per core, up to 8 files.<br/><br/>- Set max server memory at 90% or up to 50 GB left for the Operating System. <br/><br/>- Enable soft NUMA. |


<br/>
For more information on *how* and *why* to make these optimizations, please review the details and guidance provided in the following sections.
<br/><br/>

## Getting started

If you are creating a new SQL Server on Azure VM and are not migrating a current source system, create your new SQL Server VM based on your vendor requirements.  The vendor requirements for a SQL Server VM are the same as what you would deploy on-premises. 

If you are creating a new SQL Server VM with a new application built for the cloud, you can easily size your SQL Server VM as your data and usage requirements evolve.
Start the development environments with the lower-tier D-Series, B-Series, or Av2-series and grow your environment over time. 

The recommended minimum for a production OLTP environment is 4 vCore, 32 GB of memory, and a memory-to-vCore ratio of 8. For new environments, start with 4 vCore machines and scale to 8, 16, 32 vCores or more when your data and compute requirements change. For OLTP throughput, target SQL Server VMs that have 5000 IOPS for every vCore. 

Use the SQL Server VM marketplace images with the storage configuration in the portal. This will make it easier to properly create the storage pools necessary to get the size, IOPS, and throughput necessary for your workloads. It is important to choose SQL Server VMs that support premium storage and premium storage caching. See the [storage](#storage-guidance) section to learn more. 

SQL Server data warehouse and mission critical environments will often need to scale beyond the 8 memory-to-vCore ratio. For medium environments, you may want to choose a 16 core-to-memory ratio, and a 32 core-to-memory ratio for larger data warehouse environments. 

SQL Server data warehouse environments often benefit from the parallel processing of larger machines. For this reason, the M-series and the Mv2-series are strong options for larger data warehouse environments.

## VM size guidance

Use the vCPU and memory configuration from your source machine as a baseline for migrating a current on-premises SQL Server database to SQL Server on Azure VMs. Bring your core license to Azure to take advantage of the [Azure Hybrid Benefit](https://azure.microsoft.com/pricing/hybrid-benefit/) and save on SQL Server licensing costs.

**Microsoft recommends a memory-to-vCore ratio of 8 as a starting point for production SQL Server workloads.** Smaller ratios are acceptable for non-production workloads. 

Choose a [memory optimized](../../../virtual-machines/sizes-memory.md), [general purpose](../../../virtual-machines/sizes-general.md), [storage optimized](../../../virtual-machines/sizes-storage.md), or [constrained vCore](../../../virtual-machines/constrained-vcpu.md) virtual machine size that is most optimal for SQL Server performance based on your workload (OLTP or data warehouse). 

### Memory optimized

The [memory optimized virtual machine sizes](../../../virtual-machines/sizes-memory.md) are a primary target for SQL Server VMs and the recommended choice by Microsoft. The memory optimized virtual machines offer stronger memory-to-CPU ratios and medium-to-large cache options. 

#### M and Mv2 series

The [M-series](../../../virtual-machines/m-series.md) offers vCore counts and memory for some of the largest SQL Server workloads.  

The [Mv2-series](../../../virtual-machines/mv2-series.md) has the highest vCore counts and memory and is recommended for mission critical and data warehouse workloads. Mv2-series instances are memory optimized VM sizes providing unparalleled computational performance to support large in-memory databases and workloads with a high memory-to-CPU ratio that is perfect for relational database servers, large caches, and in-memory analytics.

The [Standard_M64ms](../../../virtual-machines/m-series.md) has a 28 memory-to-vCore ratio for example.

Some of the features of the M and Mv2-series attractive for SQL Server performance include [premium storage](../../../virtual-machines/premium-storage-performance.md) and [premium storage caching](../../../virtual-machines/premium-storage-performance.md#disk-caching) support, [ultra-disk](../../../virtual-machines/disks-enable-ultra-ssd.md) support, and [write acceleration](../../../virtual-machines/how-to-enable-write-accelerator.md).

#### Edsv4-series

The [Edsv4-series](../../../virtual-machines/edv4-edsv4-series.md) is designed for memory-intensive applications. These VMs have a large local storage SSD capacity, strong local disk IOPS, up to 504 GiB of RAM, and improved compute compared to the previous Ev3/Esv3 sizes with Gen2 VMs. There is a nearly consistent memory-to-vCore ratio of 8 across these virtual machines, which is ideal for standard SQL Server workloads. 

This VM series is ideal for memory-intensive enterprise applications and applications that benefit from low latency, high-speed local storage.

The Edsv4-series virtual machines support [premium storage](../../../virtual-machines/premium-storage-performance.md), and [premium storage caching](../../../virtual-machines/premium-storage-performance.md#disk-caching).

#### DSv2-series 11-15

The [DSv2-series 11-15](../../../virtual-machines/dv2-dsv2-series-memory.md#dsv2-series-11-15) has the same memory and disk configurations as the previous D-series. This series has a consistent memory-to-CPU ratio of 7 across all virtual machines. 

The [DSv2-series 11-15](../../../virtual-machines/dv2-dsv2-series-memory.md#dsv2-series-11-15) supports [premium storage](../../../virtual-machines/premium-storage-performance.md) and [premium storage caching](../../../virtual-machines/premium-storage-performance.md#disk-caching), which is strongly recommended for optimal performance.

### General Purpose

The [general purpose virtual machine sizes](../../../virtual-machines/sizes-general.md) are designed to provide balanced memory-to-vCore ratios for smaller entry level workloads such as development and test, web servers, and smaller database servers. 

Because of the smaller memory-to-vCore ratios with the general purpose virtual machines, it is important to carefully monitor memory-based performance counters to ensure SQL Server is able to get the buffer cache memory it needs. See [memory performance baseline](#memory) for more information. 

Since the starting recommendation for production workloads is a memory-to-vCore ratio of 8, the minimum recommended configuration for a general purpose VM running SQL Server is 4 vCPU and 32 GB of memory. 

#### Ddsv4 series

The [Ddsv4-series](../../../virtual-machines/ddv4-ddsv4-series.md) offers a fair combination of vCPU, memory, and temporary disk but with smaller memory-to-vCore support. 

The Ddsv4 VMs include lower latency and higher-speed local storage.

These machines are ideal for side-by-side SQL and app deployments that require fast access to temp storage and departmental relational databases. There is a standard memory-to-vCore ratio of 4 across all of the virtual machines in this series. 

For this reason, it is recommended to leverage the D8ds_v4 as the starter virtual machine in this series, which has 8 vCores and 32 GBs of memory. The largest machine is the D64ds_v4, which has 64 vCores and 256 GBs of memory.

The [Ddsv4-series](../../../virtual-machines/ddv4-ddsv4-series.md) virtual machines support [premium storage](../../../virtual-machines/premium-storage-performance.md) and [premium storage caching](../../../virtual-machines/premium-storage-performance.md#disk-caching).

> [!NOTE]
> The [Ddsv4-series](../../../virtual-machines/ddv4-ddsv4-series.md) does not have the memory-to-vCore ratio of 8 that is recommended for SQL Server workloads. As such, considering using these virtual machines for smaller application and development workloads only.

#### B-series

The [burstable B-series](../../../virtual-machines/sizes-b-series-burstable.md) virtual machine sizes are ideal for workloads that do not need consistent performance such as proof of concept and very small application and development servers. 

Most of the [burstable B-series](../../../virtual-machines/sizes-b-series-burstable.md) virtual machine sizes have a memory-to-vCore ratio of 4. The largest of these machines is the [Standard_B20ms](../../../virtual-machines/sizes-b-series-burstable.md) with 20 vCores and 80 GB of memory.

This series is unique as the apps have the ability to **burst** during business hours with burstable credits varying based on machine size. 

When the credits are exhausted, the VM returns to the baseline machine performance.

The benefit of the B-series is the compute savings you could achieve compared to the other VM sizes in other series especially if you need the processing power sparingly throughout the day.

This series supports [premium storage](../../../virtual-machines/premium-storage-performance.md), but **does not support** [premium storage caching](../../../virtual-machines/premium-storage-performance.md#disk-caching).

> [!NOTE] 
> The [burstable B-series](../../../virtual-machines/sizes-b-series-burstable.md) does not have the memory-to-vCore ratio of 8 that is recommended for SQL Server workloads. As such, consider using these virtual machines for smaller applications, web servers, and development workloads only.

#### Av2-series

The [Av2-series](../../../virtual-machines/av2-series.md) VMs are best suited for entry-level workloads like development and test, low traffic web servers, small to medium app databases, and proof-of-concepts.

Only the [Standard_A2m_v2](../../../virtual-machines/av2-series.md) (2 vCores and 16GBs of memory), [Standard_A4m_v2](../../../virtual-machines/av2-series.md) (4 vCores and 32GBs of memory), and the [Standard_A8m_v2](../../../virtual-machines/av2-series.md) (8 vCores and 64GBs of memory) have a good memory-to-vCore ratio of 8 for these top three virtual machines. 

These virtual machines are both good options for smaller development and test SQL Server machines. 

The 8 vCore [Standard_A8m_v2](../../../virtual-machines/av2-series.md) may also be a good option for small application and web servers.

> [!NOTE] 
> The Av2 series does not support premium storage and as such, is not recommended for production SQL Server workloads even with the virtual machines that have a memory-to-vCore ratio of 8.

### Storage optimized

The [storage optimized VM sizes](../../../virtual-machines/sizes-storage.md) are for specific use cases. These virtual machines are specifically designed with optimized disk throughput and IO. This virtual machine series is intended for big data scenarios, data warehousing, and large transactional databases. 

#### Lsv2-series

The [Lsv2-series](../../../virtual-machines/lsv2-series.md) features high throughput, low latency, and local NVMe storage. The Lsv2-series VMs are optimized to use the local disk on the node attached directly to the VM rather than using durable data disks. 

These virtual machines are strong options for big data, data warehouse, reporting, and ETL workloads. The high throughput and IOPs of the local NVMe storage is a good use case for processing files that will be loaded into your database and other scenarios where the source data can be recreated from the source system or other repositories such as Azure Blob storage or Azure Data Lake. [Lsv2-series](../../../virtual-machines/lsv2-series.md) VMs can also burst their disk performance for up to 30 minutes at a time.

These virtual machines size from 8 to 80 vCPU with 8 GiB of memory per vCPU and for every 8 vCPUs there is 1.92 TB of NVMe SSD. This means for the largest VM of this series, the [L80s_v2](../../../virtual-machines/lsv2-series.md), there is 80 vCPU and 640 BiB of memory with 10x1.92TB of NVMe storage.  There is a consistent memory-to-vCore ratio of 8 across all of these virtual machines.

The NVMe storage is ephemeral meaning that data will be lost on these disks if you restart your virtual machine.

The Lsv2 and Ls series support [premium storage](../../../virtual-machines/premium-storage-performance.md), but not premium storage caching. The creation of a local cache to increase IOPs is not supported. 

> [!WARNING]
> Storing your data files on the ephemeral NVMe storage could result in data loss when the VM is deallocated. 

### Constrained vCores

High performing SQL Server workloads often need larger amounts of memory, IO, and throughput without the higher vCore counts. 

Most OLTP workloads are application databases driven by large numbers of smaller transactions. With OLTP workloads, only a small amount of the data is read or modified, but the volumes of transactions driven by user counts are much higher. It is important to have the SQL Server memory available to cache plans, store recently accessed data for performance, and ensure physical reads can be read into memory quickly. 

These OLTP environments need higher amounts of memory, fast storage, and the I/O bandwidth necessary to perform optimally. 

In order to maintain this level of performance without the higher SQL Server licensing costs, Azure offers VM sizes with [constrained vCPU counts](../../../virtual-machines/constrained-vcpu.md). 

This helps control licensing costs by reducing the available vCores while maintaining the same memory, storage, and I/O bandwidth of the parent virtual machine.

The vCPU count can be constrained to one-half to one-quarter of the original VM size. Reducing the vCores available to the virtual machine, will achieve higher memory-to-vCore ratios.

These new VM sizes have a suffix that specifies the number of active vCPUs to make them easier to identify. 

For example, the [M64-32ms](../../../virtual-machines/constrained-vcpu.md) requires licensing only 32 SQL Server vCores with the memory, IO, and throughput of the [M64ms](../../../virtual-machines/m-series.md) and the [M64-16ms](../../../virtual-machines/constrained-vcpu.md) requires licensing only 16 vCores.  Though while the [M64-16ms](../../../virtual-machines/constrained-vcpu.md) has a quarter of the SQL Server licensing cost of the M64ms, the compute cost of the virtual machine will be the same.

> [!NOTE] 
> - Medium to large data warehouse workloads may still benefit from [constrained vCore VMs](../../../virtual-machines/constrained-vcpu.md), but data warehouse workloads are commonly characterized by fewer users and processes addressing larger amounts of data through query plans that run in parallel. 
> - The compute cost, which includes operating system licensing, will remain the same as the parent virtual machine. 

## Storage guidance

For detailed testing of SQL Server performance on Azure Virtual Machines with TPC-E and TPC-C benchmarks, refer to the blog [Optimize OLTP performance](https://techcommunity.microsoft.com/t5/SQL-Server/Optimize-OLTP-Performance-with-SQL-Server-on-Azure-VM/ba-p/916794). 

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

Place TempDB on the local SSD `D:\` drive for mission critical SQL Server workloads (after choosing correct VM size). If you create the VM from the Azure portal or Azure quickstart templates and [place Temp DB on the Local Disk](https://techcommunity.microsoft.com/t5/SQL-Server/Announcing-Performance-Optimized-Storage-Configuration-for-SQL/ba-p/891583), then you do not need any further action; for all other cases follow the steps in the blog for  [Using SSDs to store TempDB](https://cloudblogs.microsoft.com/sqlserver/2014/09/25/using-ssds-in-azure-vms-to-store-sql-server-TempDB-and-buffer-pool-extensions/) to prevent failures after restarts. If the capacity of the local drive is not enough for your Temp DB size, then place Temp DB on a storage pool [striped](../../../virtual-machines/premium-storage-performance.md) on premium SSD disks with [read-only caching](../../../virtual-machines/premium-storage-performance.md#disk-caching).

For VMs that support premium SSDs, you can also store TempDB on a disk that supports premium SSDs with read caching enabled.


### Data disks

* **Use premium SSD disks for data and log files**: If you are not using disk striping, use two premium SSD disks where one disk contains the log file and the other contains the data. Each premium SSD provides a number of IOPS and bandwidth (MB/s) depending on its size, as depicted in the article, [Select a disk type](../../../virtual-machines/disks-types.md). If you are using a disk striping technique, such as Storage Spaces, you achieve optimal performance by having two pools, one for the log file(s) and the other for the data files. However, if you plan to use SQL Server failover cluster instances (FCI), you must configure one pool, or utilize [premium file shares](failover-cluster-instance-premium-file-share-manually-configure.md) instead.

   > [!TIP]
   > - For test results on various disk and workload configurations, see the following blog post: [Storage Configuration Guidelines for SQL Server on Azure Virtual Machines](/archive/blogs/sqlserverstorageengine/storage-configuration-guidelines-for-sql-server-on-azure-vm).
   > - For mission critical performance for SQL Servers that need ~ 50,000 IOPS, consider replacing 10 -P30 disks with an Ultra SSD. For more information, see the following blog post: [Mission critical performance with Ultra SSD](https://azure.microsoft.com/blog/mission-critical-performance-with-ultra-ssd-for-sql-server-on-azure-vm/).

   > [!NOTE]
   > When you provision a SQL Server VM in the portal, you have the option of editing your storage configuration. Depending on your configuration, Azure configures one or more disks. Multiple disks are combined into a single storage pool with striping. Both the data and log files reside together in this configuration. For more information, see [Storage configuration for SQL Server VMs](storage-configuration.md).

* **Disk striping**: For more throughput, you can add additional data disks and use disk striping. To determine the number of data disks, you need to analyze the number of IOPS and bandwidth required for your log file(s), and for your data and TempDB file(s). Notice that different VM sizes have different limits on the number of IOPs and bandwidth supported, see the tables on IOPS per [VM size](../../../virtual-machines/sizes.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json). Use the following guidelines:

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

  * Determine the number of disks associated with your storage pool based on your load expectations. Keep in mind that different VM sizes allow different numbers of attached data disks. For more information, see [Sizes for virtual machines](../../../virtual-machines/sizes.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json).

  * If you are not using premium SSDs (dev/test scenarios), the recommendation is to add the maximum number of data disks supported by your [VM size](../../../virtual-machines/sizes.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json) and use disk striping.

* **Caching policy**: Note the following recommendations for caching policy depending on your storage configuration.

  * If you are using separate disks for data and log files, enable read caching on the data disks hosting your data files and TempDB data files. This can result in a significant performance benefit. Do not enable caching on the disk holding the log file as this causes a minor decrease in performance.

  * If you are using disk striping in a single storage pool, most workloads will benefit from read caching. If you have separate storage pools for the log and data files, enable read caching only on the storage pool for the data files. In certain heavy write workloads, better performance might be achieved with no caching. This can only be determined through testing.

  * The previous recommendations apply to premium SSDs. If you are not using premium SSDs, do not enable any caching on any data disks.

  * For instructions on configuring disk caching, see the following articles. For the classic (ASM) deployment model see: [Set-AzureOSDisk](/previous-versions/azure/jj152847(v=azure.100)) and [Set-AzureDataDisk](/previous-versions/azure/jj152851(v=azure.100)). For the Azure Resource Manager deployment model, see: [Set-AzOSDisk](/powershell/module/az.compute/set-azvmosdisk) and [Set-AzVMDataDisk](/powershell/module/az.compute/set-azvmdatadisk).

     > [!WARNING]
     > Stop the SQL Server service when changing the cache setting of Azure Virtual Machines disks to avoid the possibility of any database corruption.

* **NTFS allocation unit size**: When formatting the data disk, it is recommended that you use a 64-KB allocation unit size for data and log files as well as TempDB. If TempDB is placed on the temporary disk (D:\ drive) the performance gained by leveraging this drive outweighs the need for a 64-KB allocation unit size. 

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



## Collect performance baseline

For a more prescriptive approach, gather performance counters using PerfMon/LogMan and capture SQL Server wait statistics to better understand general pressures and potential bottlenecks of the source environment. 

Start by collecting the CPU, memory, [IOPS](../../../virtual-machines/premium-storage-performance.md#iops), [throughput](../../../virtual-machines/premium-storage-performance.md#throughput), and [latency](../../../virtual-machines/premium-storage-performance.md#latency) of the source workload at peak times following the [application performance checklist](../../../virtual-machines/premium-storage-performance.md#application-performance-requirements-checklist). 

Gather data during peak hours such as workloads during your typical business day, but also other high load processes such as end-of-day processing, and weekend ETL workloads. Consider scaling up your resources for atypically heavily workloads, such as end-of-quarter processing, and then scale done once the workload completes. 

Use the performance analysis to select the [VM Size](../../../virtual-machines/sizes-memory.md) that can scale to your workload's performance requirements.


### IOPS and Throughput

SQL Server performance depends heavily on the I/O subsystem. Unless your database fits into physical memory, SQL Server constantly brings database pages in and out of the buffer pool. The data files for SQL Server should be treated differently. Access to log files is sequential except when a transaction needs to be rolled back where data files, including TempDB, are randomly accessed. If you have a slow I/O subsystem, your users may experience performance issues such as slow response times and tasks that do not complete due to time-outs. 

The Azure Marketplace virtual machines have log files on a physical disk that is separate from the data files by default. The TempDB data files count and size meet best practices and are targeted to the ephemeral D:/ drive.. 

The following PerfMon counters can help validate the IO throughput required by your SQL Server: 
* **\LogicalDisk\Disk Reads/Sec** (read and write IOPS)
* **\LogicalDisk\Disk Writes/Sec** (read and write IOPS) 
* **\LogicalDisk\Disk Bytes/Sec** (throughput requirements for the data, log, and TempDB files)

Using IOPS and throughput requirements at peak levels, evaluate VM sizes that match the capacity from your measurements. 

If your workload requires 20 K read IOPS and 10K write IOPS, you can either choose E16s_v3 (with up to 32 K cached and 25600 uncached IOPS) or M16_s (with up to 20 K cached and 10K uncached IOPS) with 2 P30 disks striped using Storage Spaces. 

Make sure to understand both throughput and IOPS requirements of the workload as VMs have different scale limits for IOPS and throughput.

### Memory

Track both external memory used by the OS as well as the memory used internally by SQL Server. Identifying pressure for either component will help size virtual machines and identify opportunities for tuning. 

The following PerfMon counters can help validate the memory health of a SQL Server virtual machine: 
* [\Memory\Available MBytes](/azure/monitoring/infrastructure-health/vmhealth-windows/winserver-memory-availmbytes)
* [\SQLServer:Memory Manager\Target Server Memory (KB)](/sql/relational-databases/performance-monitor/sql-server-buffer-manager-object)
* [\SQLServer:Memory Manager\Total Server Memory (KB)](/sql/relational-databases/performance-monitor/sql-server-buffer-manager-object)
* [\SQLServer:Buffer Manager\Lazy writes/sec](/sql/relational-databases/performance-monitor/sql-server-buffer-manager-object)
* [\SQLServer:Buffer Manager\Page life expectancy](/sql/relational-databases/performance-monitor/sql-server-buffer-manager-object)

### Compute / Processing

Compute in Azure is managed differently than on-premises. On-premises servers are built to last several years without an upgrade due to the management overhead and cost of acquiring new hardware. Virtualization mitigates some of these issues but applications are optimized to take the most advantage of the underlying hardware, meaning any significant change to resource consumption requires rebalancing the entire physical environment. 

This is not a challenge in Azure where a new virtual machine on a different series of hardware, and even in a different region, is easy to achieve. 

In Azure, you want to take advantage of as much of the virtual machines resources as possible, therefore, Azure virtual machines should be configured to keep the average CPU as high as possible without impacting the workload. 

The following PerfMon counters can help validate the compute health of a SQL Server virtual machine:
* **\Processor Information(_Total)\% Processor Time**
* **\Process(sqlservr)\% Processor Time**

> [!NOTE] 
> Ideally, try to aim for using 80% of your compute, with peaks above 90% but not reaching 100% for any sustained period of time. Fundamentally, you only want to provision the compute the application needs and then plan to scale up or down as the business requires. 

## Next steps

For security best practices, see [Security considerations for SQL Server on Azure Virtual Machines](security-considerations-best-practices.md).

Review other SQL Server Virtual Machine articles at [SQL Server on Azure Virtual Machines Overview](sql-server-on-azure-vm-iaas-what-is-overview.md). If you have questions about SQL Server virtual machines, see the [Frequently Asked Questions](frequently-asked-questions-faq.md).
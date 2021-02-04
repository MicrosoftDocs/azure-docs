---
title: "Disks: Performance best practices & guidelines"
description: Disk, and IO best practices and guidelines to optimize the performance of your SQL Server on Azure Virtual Machine (VM).
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
ms.date: 02/03/2021
ms.author: dpless
ms.reviewer: mathoma
---
# Disks: Performance best practices for SQL Server on Azure VMs
[!INCLUDE[appliesto-sqlvm](../../includes/appliesto-sqlvm.md)]

This article provides disk guidance as part of a  series of best practices and guidelines to optimize performance for your SQL Server on Azure Virtual Machines (VMs).

To learn more, see the other articles in this series:   
[Quick checklist](performance-guidelines-best-practices-checklist.md), [Storage](performance-guidelines-best-practices-storage.md), [VM size](performance-guidelines-best-practices-vm-size.md), [Azure & SQL feature specific](performance-guidelines-best-practices-feature-specific.md), [Collect baseline](performance-guidelines-best-practices-collect-baseline.md)


## Check list

- Monitor the application and determine storage latency requirements for SQL Server data, log, and tempdb files before choosing the disk type. Choose UltraDisks for latencies less than 1 ms, otherwise use Premium SSD. Provision different types of drives for the data and log files if the latency requirements vary. 
- Place data, log, and tempdb files on separate drives.
- Only use the ephemeral storage (D:\) for tempdb and other processing that can be recreated when the virtual machine reboots. 
- Only use premium P30, P40, P50 disks for the data drive, and optimize for capacity on the log drive (P30 - P80).
- Optimize for highest uncached IOPS for best performance and leverage caching as a performance feature for data reads.
- Standard storage is only recommended for development and test purposes or for backup files and should not be used for production workloads.
- Bursting should be only considered for smaller departmental systems and dev/test workloads.
- Use Ultra Disks if less than 1-ms storage latencies are required for the transaction log and write acceleration is not an option. 


## Overview
To find the most effective storage configuration for SQL Server workloads on an Azure VM, start by measuring performance of your business application.  Once storage requirements are known, select a SKU that supports the necessary IOPs and throughput with the appropriate core-to-memory ratio. Choose the correct VM size with enough storage scale limits for your workload, and choose a mixture of disks to meet capacity and performance needs. 

The type of disk you use for your SQL Server depends on both the type of files that will be hosted on the disk, and also your application performance requirements. 

This article provides information about the different type of files SQL Server uses, the different types of data disks there are, and which disks to use based on your workload. 

Provisioning a SQL Server VM through Azure Marketplaces simplifies and streamlines the storage configuration process. To learn more, see [Storage configuration](storage-configuration.md).

## SQL Server files 

Before choosing disks and storage architecture, consider the files and databases that you will be placing on these drives. Different business needs require different workloads and as such, have variable performance requirements. 

It is important to understand the difference between the SQL Server data files and why the best practices are as advised. SQL Server on Azure VMs and Azure storage have features that uniquely apply to these data types. 

SQL Server databases, both user and system, have at least one data file and at least one log file.  The data files are used for the primary data storage. The log files contain historical records of database activity used for recovery purposes. The data and log files are utilized very differently, and due to the differences, these files should be placed on isolated locations that can be optimized independently. 

Applications will leverage one or usually more than one user database. [System databases](/sql/relational-databases/databases/system-databases) leveraged by SQL Server consist of the master, model, msdb, and tempdb databases.

Every database has a primary filegroup which contains the primary data file and any secondary files that are not placed into other filegroups. The optional user-defined filegroups can be used to group data files together for administrative and placement purposes.

### Data files

SQL Server data files `.mdf` contain the actual data for the database, including not only the data in the databases objects but also the definitions for all of the objects in the database. The first data file is called the primary data file. The primary data file has an .mdf extension. You can also have additional data files called secondary data files. Secondary data files have an `.ndf` extension by default. All data files can be grouped together in filegroups.

Data files have random reads and writes where the write activity will occur during checkpoints, recovery operations, and lazy writes. Read activity occurs as users select new data into the buffer pool and during other operations such as during SQL Server backups. The frequency and volume of read activity varies depending on query activity, workload type, and the [buffer pool size](/sql/relational-databases/memory-management-architecture-guide).

For the best OLTP and data warehouse performance choose a combination of premium disks with either P30s, P40s, or P50s for SQL Server data files that matches the uncached and cached performance needs of your application. When premium storage is provisioned, unlike standard storage, the capacity, IOPS, and throughput of that disk is guaranteed. These premium Azure Managed Disks (P30s, P40s, and P50s) also supports read and write caching.


> [!NOTE] 
> Azure Managed Disks larger than 4096 GBs do not have caching support. For this reason, it is not recommended to use premium disks larger than P50 for data files. 


### Log Files

Log files are historical records that are separate from the data files containing data pages, and are necessary for recovery operations. There must be at least one log file for each database where log files have an `.ldf` extension by default. 

Log files contain sequenced log records that track modifications made to the database with an increasing log sequence number (LSN). The LSN is used to find the most recent log record and is used as a watermark for recovery operations.

Log files have sequential reads and writes where write activity occurs during log buffer flush processes. Read activity occurs during checkpoints, backups, and recovery operations. Technologies that rely on the transaction log, such as replication, Always On availability groups and database mirroring increase transaction log read and write activity. 

Many different types of operations are recorded in the transaction log such as the start and end of each transaction, all data modifications, extent and page allocation or deallocation, and creating and dropping objects. For more information, see [SQL Server Transaction Log Architecture and Management Guide](/sql/relational-databases/sql-server-transaction-log-architecture-and-management-guide).

Choose the larger capacity drives (P30(s) to P80(s)) to support the IOPs, throughput, and capacity of your transaction log requirements, while allowing an additional 20% for growth. If there is not enough throughput available, then it may be necessary to add multiple disks for the transaction log drive.

There is no performance benefit in having multiple transaction log files as the transaction log is leveraged sequentially by nature. Additionally, using caching for log files may impact performance, and could potentially cause data corruption. As such, set the caching policy to `none`. 

For applications that require extremely low latency for the transaction log, consider [Ultra-Disk SSD](../../../virtual-machines/disks-types.md#ultra-disk) or Write Acceleration on the M-Series virtual machines.


### Tempdb

The tempdb system database is a special purpose database used by all databases on an instance. The health of the tempdb database impacts the performance of the entire SQL Server instance. As such, performance is critical and therefore data access to tempdb needs to be as fast as possible. 

The tempdb database is used internally for temporary storage and SQL objects being created and destroyed. This would include temporary tables and indexes, table variables, table-valued functions, etc. The tempdb database is also affected by internal objects such as worktables to store results, work files for hash join or hash aggregate operations, intermediate sort results for operations such as creating or rebuilding indexes, and certain GROUP BY, ORDER BY, or UNION queries.

Structurally, tempdb is the same as any other user database. The salient point is that tempdb is used across the instance and the workload is different compared to other SQL Server user databases. The tempdb database is also frequently used to store intermediate query results which will directly impact query performance. 

Tempdb is ephemeral, meaning it is recreated every time SQL Server starts. The system always starts with a clean copy of the tempdb database.

Starting in 2016, by default SQL Server creates one data file per logical processor up to 8 tempdb data files where all data files are  equally sized in order to [reduce allocation contention](/troubleshoot/sql/performance/recommendations-reduce-allocation-contention#cause). This is a good practice for most systems although heavy OLTP workloads may benefit from a greater number of data files and heavy decision support system (DSS) workloads may be slowed by the overhead that comes from addressing more than one data file. 

The tempdb system database typically has a very high concurrency work rate which may be higher depending on the transaction rate, active user rate, the rate temporary objects are created or destroyed, and the amount of internal usage that is needed. 

As more databases are added to an instance, the impact to the tempdb database and the underlying storage should be monitored as well. To lean more, see [Optimizing tempdb performance in SQL Server](/sql/relational-databases/databases/tempdb-database#optimizing-tempdb-performance-in-sql-server). 


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

The following table compares performance of disks: 

|Premium SSD Sizes | P30 | P40	| P50	| P60 | P70	| P80 |
|---|---|---|---|---|---|---|
| Disk size in GiB | 1,024 | 2,048 | 4,096 | 8,192 | 16,384 | 32,767 |
| Provisioned IOPS per disk | 5,000 | 7,500 | 7,500 | 16,000 | 18,000 | 20,000 | 
| Provisioned Throughput per disk | 200 MB/sec | 250 MB/sec | 250 MB/sec | 500 MB/sec | 750 MB/sec | 900 MB/sec |
| Eligible for reservation | Yes, up to one year | Yes, up to one year | Yes, up to one year | Yes, up to one year | Yes, up to one year | Yes, up to one year |
| Disk Caching Support | Yes | Yes | Yes | No | No | No |
| Recommendation | Data or Log | Data or Log | Data or Log | Log Only | Log Only | Log Only |
|   |   |   |   |   |   |   |   |   |

### Premium Disk Bursting 

Premium SSD SKUs smaller than P30s offer [disk bursting](../../../virtual-machines/disk-bursting.md) and can burst up to 3,500 IOPS per disk and their bandwidth up to 170 MB/s per disk.  Bursting is best used for dev/test scenarios where usage is unpredictable and functionality tests are being accomplished on smaller premium disks before bringing an application into production. Because of the unpredictable nature of bursting use case scenarios, it is recommended to use bursting on non-production workloads or workloads that have a very small user base such as a non-mission critical departmental application workload of 25 or fewer users.

Bursting is automatic and operates similar to a credit system. Credits are automatically accumulated in a container when disk traffic is below the performance target and credits are automatically consumed when traffic bursts beyond the performance target - up to the max burst limit. 

The max burst limit defines the ceiling of disk IOPS and bandwidth even if there are burst credits to consume. Disk bursting provides better tolerance for unpredictable IO patterns. Bursting works well to improve OS disk boot performance and applications with short and unpredictable traffic patterns.

Disks bursting support will be enabled on new deployments of applicable disk sizes by default, with no user action required. 

All burst applicable disk sizes will start with a full burst credit bucket when the disk is attached to a Virtual Machine that supports a max duration at peak burst limit of 30 mins per day.


The following table details disk bursting supportability: 


| Premium SSD sizes   | P1 | P2 | P3 | P4  | P5  | P6   | P10  | P20   |
|---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
|  Disk size in GiB |  4 | 8  | 16   | 32   | 64  | 128  | 256  |  512  |
| Provisioned IOPS per disk  |  120 | 120   | 120  | 120  | 240  | 500   | 1,100   | 2,300  |
| Provisioned Throughput per disk  | 25 MB/sec  | 25 MB/sec  | 25 MB/sec  | 25 MB/sec  | 50 MB/sec  | 100 MB/sec  | 125 MB/sec  | 150 MB/sec  |
| Max burst IOPS per disk  | 3,500  | 3,500  | 3,500  | 3,500  | 3,500  | 3,500  | 3,500  | 3,500  |
| Max burst throughput per disk  | 170 MB/sec  | 170 MB/sec  | 170 MB/sec  | 170 MB/sec  | 170 MB/sec  | 170 MB/sec  | 170 MB/sec  | 170 MB/sec  |
| Max burst duration |  30 min | 30 min  | 30 min  | 30 min  | 30 min  | 30 min  | 30 min  | 30 min  |
| Eligible for reservation  | No  | No  | No  | No  | No  | No  | No  | No  |
|   |   |   |   |   |   |   |   |   |


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


## Next steps

To learn more, see the other articles in this series:
- [Quick checklist](performance-guidelines-best-practices-checklist.md)
- [VM size](performance-guidelines-best-practices-vm-size.md)
- [Storage](performance-guidelines-best-practices-storage.md)
- [Azure & SQL feature specific](performance-guidelines-best-practices-feature-specific.md)
- [Collect baseline](performance-guidelines-best-practices-collect-baseline.md)

For security best practices, see [Security considerations for SQL Server on Azure Virtual Machines](security-considerations-best-practices.md).

Review other SQL Server Virtual Machine articles at [SQL Server on Azure Virtual Machines Overview](sql-server-on-azure-vm-iaas-what-is-overview.md). If you have questions about SQL Server virtual machines, see the [Frequently Asked Questions](frequently-asked-questions-faq.md).

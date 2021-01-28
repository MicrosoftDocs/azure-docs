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
ms.date: 01/13/2021
ms.author: dplessMSFT
ms.reviewer: 
---
# Disks: Performance best practices for SQL Server on Azure VMs
[!INCLUDE[appliesto-sqlvm](../../includes/appliesto-sqlvm.md)]

This article provides storage, disks and IO guidance a series of best practices and guidelines to optimize performance for your SQL Server on Azure Virtual Machines (VMs).

To learn more, see the other articles in this series:
- [Quick checklist](performance-guidelines-best-practices-checklist.md), [Storage](performance-guidelines-best-practices-storage.md), [VM size](performance-guidelines-best-practices-vm-size.md), [Azure & SQL feature specific](performance-guidelines-best-practices-feature-specific.md), [Collect baseline](performance-guidelines-best-practices-collect-baseline.md)


## Check list

- Use a minimum of 2 premium SSD disks (1 for log file and 1 for data files).
- Place data, log, and tempdb fileson separate drives.
- Leverage the [SQL Server IaaS Agent extension](sql-server-iaas-agent-extension-automate-) experience in the Azure portal to assist with the storage configuration for your environment.
- Local ephemeral storage (D:\) should only be used for tempdb and other processing where the source data can be recreated in the event of a recycle of the virtual machine.
- Use premium SSDs for the best price/performance advantages.
- Use only premium P30, P40, P50 disks for the Data drive, and optimize focused on capacity for the Log drive (P30 - P80).
- Optimize for highest uncached IOPs for best performance and leverage caching as a performance feature for data reads.
- Standard storage is only recommended for development and test purposes or for backup files and should not be used for production workloads.
- Bursting should be only considered for smaller departmental systems and dev/test workloads
- Use Ultra Disks if less than 1-ms storage latencies are required for the transaction log and write acceleration is not an option. 

## Disk Overview

Many customers begin their migration process by choosing a virtual machine. The memory optimized (ex. [M-series](https://docs.microsoft.com/en-us/azure/virtual-machines/m-series), [Edsv4-series](https://docs.microsoft.com/en-us/azure/virtual-machines/edv4-edsv4-series?#edsv4-series), and the [Dsv2-series](https://docs.microsoft.com/en-us/azure/virtual-machines/dv2-dsv2-series-memory?#dsv2-series-11-15)) virtual machine sizes are recommended for OLTP workloads. Larger machines with higher core-to-memory ratios (ex. [Mv2-series](https://docs.microsoft.com/en-us/azure/virtual-machines/mv2-series)) are well-suited for data warehousing workloads.

Customers that initially selected a virtual machine by the memory and processing requirements, should ensure they have the right storage solution for their application environment.

In order to select a storage solution in Azure you must first know the storage needs of your application. It is important to document the performance characteristics of your application by monitoring your source environment during peak times, and other critical windows of operation to choose the right storage architecture.

In this section we will first cover Azure Managed Disks and in the following storage section the methods for choosing a storage architecture that follows best practices.

## Azure Managed Disks and Disk Types
Azure Managed Disks are block-level storage volumes designed for Azure Virtual Machines. Azure Managed Disks are similar to the virtual disks you leverage in an on-premises environment where you will choose your disk type, capacity, and then provision the disk. The performance of the disk increases with the capacity grouped by [premium disk labels](https://docs.microsoft.com/en-us/azure/virtual-machines/disks-types#premium-ssd) for example, the P1 with 4GiB of space and 120 IOPs to the P80 with 32TiB of storage and 20,000 IOPs.

The available types of disks are standard hard disk drives (HDD), standard solid-state drives (SSD), premium (SSD), and Ultra Disks.

For a feature comparison of these disk types see the following chart [Disk Comparison](https://docs.microsoft.com/en-us/azure/virtual-machines/disks-types#disk-comparison).

## SQL Server database files and filegroups

Before choosing disks and storage architecture, consider the files and databases that you will be placing on these drives. SQL Server data files and both user and system databases will differ in workload and performance needs and for this reason it is important to make certain the selected disks support these differing needs. 

It is also important to understand the difference between the SQL Server data files and why the best practices are as advised. Azure SQL virtual machines and Azure storage have features that uniquely apply to these data types. 

### SQL Server databases

SQL Server databases, both user and system databases, require at least two files, there is at least one data file and one log file. The data files are used for the primary data storage. The log files contain historical records of database activity used for recovery purposes. The data and log files are utilized very differently, and due to the differences, these files should be placed on isolated locations that can be optimized independently. 

Applications will leverage one or usually more than one user database. [System databases](https://docs.microsoft.com/en-us/sql/relational-databases/databases/system-databases) leveraged by SQL Server consist of the master, model, msdb, and tempdb databases.

Every database has a primary filegroup which contains the primary data file and any secondary files that are not placed into other filegroups. The optional user-defined filegroups can be used to group data files together for administrative and placement purposes.

### Data Files
Data files (.mdf) contain the actual data for the database, including not only the data in the databases objects but also the definitions for all of the objects in the database. The first data file is called the primary data file. The primary data file has an .mdf extension. You can also have additional data files called secondary data files. Secondary data files will have an .ndf extension by default. All data files can be grouped together in filegroups.

Data files will have random reads and writes where the write activity will occur during checkpoints, recovery operations, and lazy writes. Read activity will occur as users select new data into the buffer pool and during other operations such as during SQL Server backups. The frequency and volume of read activity will vary depending on query activity, workload type, and the [buffer pool size](https://docs.microsoft.com/en-us/sql/relational-databases/memory-management-architecture-guide).

### Log Files
Log files are historical records that are necessary for recovery operations, which are separate from data files that contain data pages. 

Log files contain sequenced log records that track modifications made to the database with an increasing log sequence number (LSN). The LSN is used to find the most recent log record and is used as a *watermark* for recovery operations.

Log files have sequential reads and writes where write activity occurs during log buffer flush processes. Read activity occurs during checkpoints, backups, and recovery operations. It is important to recognize that replication technologies and availability technologies such as Always On Availability Groups and Database Mirroring will increase transaction log read and write activity.

Many different types of operations are recorded in the transaction log such as the start and end of each transaction, all data modifications, extent and page allocation or deallocation, and creating and dropping objects.

There must be at least one log file for each database where log files have an .ldf extension by default.

> [!NOTE] It is possible to have more than one log file per database, but
> it is not recommended. Since transaction log files are accessed 
> sequentially for both read and write operations, multiple log files do
> not provide any performance benefit.

For more information on transaction log management see [SQL Server Transaction Log Architecture and Management Guide](https://docs.microsoft.com/en-us/sql/relational-databases/sql-server-transaction-log-architecture-and-management-guide).

### tempdb
The tempdb system database is a special purpose database used by all databases on an instance. The health of the tempdb database will therefore affect the performance of the entire SQL Server instance. Performance is critical and therefore data access to tempdb needs to be as fast as possible. 

The primary purpose of tempdb is in the name – it is designed for temporary storage. This database is used for many situations where its purpose can be thought of as 'scratch space' for SQL Server temporary objects or for internal scenarios, for example, where work sets do not fit into memory and consequently needs to spill to disk. 

Structurally, tempdb is the same as any other user database. What is important is that tempdb is used across the instance and the workload is different compared to other SQL Server user databases. 

The tempdb database is used internally for temporary storage and SQL objects being created and destroyed. This would include temporary tables and indexes, table variables, table-valued functions, etc. 

The tempdb database is also affected by internal objects such as worktables to store results, work files for hash join or hash aggregate operations, intermediate sort results for operations such as creating or rebuilding indexes, and certain GROUP BY, ORDER BY, or UNION queries.

The tempdb database is also frequently used to store intermediate query results which will directly impact query performance. 

In summary, any data that cannot fit in memory across the SQL Server instance is stored in the tempdb system database. 

It is important to be aware that tempdb is ephemeral, it is recreated every time SQL Server is started. The system always starts with a clean copy of the tempdb database.

SQL Server, starting with SQL Server 2016, by default creates one data file per logical processor up to 8 data files where all data files will be equally sized in order to [reduce allocation contention](https://docs.microsoft.com/en-us/troubleshoot/sql/performance/recommendations-reduce-allocation-contention#cause). This is a good practice for most systems although heavy OLTP workloads may benefit from a greater number of data files and heavy decision support system (DSS) workloads may be slowed by the overhead that comes from addressing more than one data file. 

> [!NOTE] The best practice in SQL Server 2014 and earlier versions was 
> to use eight data files for tempdb, and if contention continues, 
> increase the number of data files by multiples of four until the 
> contention is reduced to acceptable levels.

The tempdb system database typically has a very high concurrency work rate which may be higher depending on the transaction rate, active user rate, the rate temporary objects are created or destroyed, and the amount of internal usage that is needed. 

As more databases are added to an instance, the impact to the tempdb database and the underlying storage should be monitored as well. For more information on this topic refer to [Optimizing tempdb performance in SQL Server](https://docs.microsoft.com/en-us/sql/relational-databases/databases/tempdb-database?view=sql-server-ver15#optimizing-tempdb-performance-in-sql-server)


## Disk Guidance
There are three main [disk types](https://docs.microsoft.com/en-us/azure/virtual-machines/managed-disks-overview?toc=/azure/virtual-machines/linux/#disk-roles) to consider on Azure virtual machines, an OS disk, a temporary disk, and your data disks. The data disks will host your SQL Server data files, log files, and other necessary files such as the error log, etc. 

The virtual machine you select will come with the operating system disk and, in many cases depending on your virtual machine, a temporary disk. For example, a [Standard_M128ms](https://docs.microsoft.com/en-us/azure/virtual-machines/m-series) includes a temporary storage (SSD) drive of 4096 GiB and 128 GBs for the operating system disk which can be [expanded if necessary](https://docs.microsoft.com/en-us/azure/virtual-machines/windows/expand-os-disk).

What is important about the operating system drive (C:\) and the temporary drive (D:\) is choosing what is stored on these local system disks.

Additional disks called data disks can be added and there is a level of customization you can choose regarding speed and capacity and this will depend on your needs and the limits of the virtual machine you have selected. 

The focus of the data disks will be on the storage architecture for SQL Server data and log files.

## Operating system disk
An operating system disk is a VHD that can be booted and mounted as a running version of an operating system and is labeled as the C:\ drive. When you create an Azure virtual machine, the platform will attach at least one disk to the VM for the operating system disk. This will be the default location for application installs and file configuration. This disk is a VHD stored as a page blob in storage.

For production SQL Server environments, use data disks instead of the operating system disk for data files, log files, error logs, and other custom locations avoiding application defaults.

> [!NOTE] It is recommended to move all system and user databases to data
> disks. For more information, see [Move System Databases](https://docs.microsoft.com/en-us/sql/relational-databases/databases/move-system-databases).

> [!NOTE] The default caching policy on the operating system disk is 
> **Read/Write**. Read/write caching is not supported with SQL Server 
> files. For more information on disk caching see the storage 
> architecture section.

## Temporary disk
Many Azure virtual machines contain another disk type called the temporary disk (labeled as the D:\ drive). Depending on the virtual machine series and size this disk could either be local or remote storage and the capacity will vary. The temporary disk is ephemeral meaning that the disk storage will be recreated, deallocated and allocated again, when the virtual machine is recycled. 

The temporary storage drive is not persisted to Azure Blob storage and therefore, you should not store user database files, transaction log files, or anything that cannot be easily recreated on the D:\ drive.

### tempdb placement

It is recommended to place tempdb on the local SSD D:\ drive for SQL Server workloads. If the VM is created from the Azure portal or Azure QuickStart templates, and [tempdb is configured to use storage via the SQL IaaS Agent extension](https://techcommunity.microsoft.com/t5/SQL-Server/Announcing-Performance-Optimized-Storage-Configuration-for-SQL/ba-p/891583), all folders and permissions will automatically be handled at startup. For all other cases you should follow the steps in the blog for [Using SSDs to store tempdb](https://cloudblogs.microsoft.com/sqlserver/2014/09/25/using-ssds-in-azure-vms-to-store-sql-server-TempDB-and-buffer-pool-extensions/) to prevent failures after restarts. 

If the capacity of the local drive is not enough for to meet the tempdb capacity requirement, then place tempdb on a storage pool [striped](https://docs.microsoft.com/en-us/azure/virtual-machines/premium-storage-performance) on premium SSD disks with [read-only caching](https://docs.microsoft.com/en-us/azure/virtual-machines/premium-storage-performance#disk-caching).

## Data disks
You can attach additional disks up to the virtual machine’s maximum disk count and capacity as data disks, and these will be stored in storage as page blobs. Data disks can be used for SQL Server data files and log files.

You have a choice in the performance level for your disks. The available types of disks listed in the order of increasing performance capabilities are standard hard disk drives (HDD), standard SSDs, premium solid-state drives (SSD), and Ultra Disks.

### Standard HDDs and SSDs
[Standard HDDs](https://docs.microsoft.com/en-us/azure/virtual-machines/disks-types#standard-hdd) and SSDs have varying latencies and bandwidth and are only recommended for dev/test workloads. Production workloads should use premium SSDs. If you are using [Standard SSDs](https://docs.microsoft.com/en-us/azure/virtual-machines/disks-types#standard-ssd) (dev/test scenarios), the recommendation is to add the maximum number of data disks supported by your [VM size](https://docs.microsoft.com/en-us/azure/virtual-machines/sizes?toc=/azure/virtual-machines/windows/toc.json) and leverage disk striping with Storage Spaces for the best performance.

### Premium Disks
For all production SQL Server workloads, it is recommended to use premium SSD disks for data and log files. 

Each premium SSD provides a number of IOPS and bandwidth (MB/s) depending on its size, as described in [Selecting a Disk Type](https://docs.microsoft.com/en-us/azure/virtual-machines/disks-types). If using a disk striping technique, such as Storage Spaces, optimal performance can be achieved by having two pools, one for the log file(s) and the other for the data files. 

Note: If you are not using disk striping, use two premium SSD disks mapped to separate drives where one drive contains the log file and the other contains the data.

However, if you plan to use SQL Server failover cluster instances (FCI), you must configure one pool, or utilize [premium file shares](https://docs.microsoft.com/en-us/azure/azure-sql/virtual-machines/windows/failover-cluster-instance-premium-file-share-manually-configure) instead.

### Premium Disk Bursting 
Premium SSD SKUs smaller than P30s offer disk bursting and can burst up to 3,500 IOPS per disk and their bandwidth up to 170 MB/s per disk. 

Below are the Azure Managed Disks that supports bursting.


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

Bursting is automatic and operates similar to a credit system. Credits are automatically accumulated in a container when disk traffic is below the performance target and credits are automatically consumed when traffic bursts beyond the performance target - up to the max burst limit. 

The max burst limit defines the ceiling of disk IOPS and bandwidth even if there are burst credits to consume. Disk bursting provides better tolerance for unpredictable IO patterns. Bursting works well to improve OS disk boot performance and applications with short and unpredictable traffic patterns.

Disks bursting support will be enabled on new deployments of applicable disk sizes by default, with no user action required. 

All burst applicable disk sizes will start with a full burst credit bucket when the disk is attached to a Virtual Machine that supports a max duration at peak burst limit of 30 mins per day.

Bursting is best used for dev/test scenarios where usage is unpredictable and functionality tests are being accomplished on smaller premium disks before bringing an application into production. Because of the unpredictable nature of bursting use case scenarios, it is recommended to use bursting on non-production workloads or workloads that have a very small user base such as a non-mission critical departmental application workload of 25 or fewer users.

**Reference:**
https://docs.microsoft.com/en-us/azure/virtual-machines/disk-bursting/

### Upsizing Premium Disks
The performance of an Azure managed disk is based upon the initial disk choice. The performance tier determines the IOPS and throughput of the managed disk. When the size of the disk is selected, the performance tier is automatically applied. 

The performance tier can be changed at deployment or afterwards, without changing the size of the disk.

When an Azure Managed Disk is first deployed, the performance tier for that disk is based on the provisioned disk size. Use a performance tier higher than the original baseline to meet higher demand. When that performance level is no longer needed, an Administrator can return to the disk to the initial baseline performance tier.

Use the higher performance for as long as needed where billing is designed to meet the storage performance tier. Upgrade the tier to match the performance of the storage performance without increasing the capacity. Return to the original tier when the additional performance is no longer required.

Changing the performance tier allows administrators to prepare for and meet higher demand without using the disk bursting capability. It can be cost-effective to change the performance tier rather than rely on bursting, depending on how long the additional performance is needed. 
This temporary expansion of performance is a strong use case for targeted events such as shopping, performance testing, training events and other brief windows where performance is not needed long term.

**Performance tiers for managed disks:**
https://docs.microsoft.com/en-us/azure/virtual-machines/disks-change-performance 

### Ultra-Disk SSD

If a workload can process ~50,000 IOPS and there is a need for millisecond response times with reduced latency consider leveraging [Ultra-Disk SSD](https://docs.microsoft.com/en-us/azure/virtual-machines/disks-types#ultra-disk) for the SQL Server log drive.

[Ultra-Disk SSD](https://docs.microsoft.com/en-us/azure/virtual-machines/disks-types#ultra-disk) can be configured where capacity and IOPS can scale independently. With [Ultra-Disk SSD](https://docs.microsoft.com/en-us/azure/virtual-machines/disks-types#ultra-disk) administrators can provision a disk with the capacity, IOPS, and throughput requirements based on application needs and only pay for the provisioned capacity. [Ultra-Disk SSD](https://docs.microsoft.com/en-us/azure/virtual-machines/disks-types#ultra-disk) does not support cache configuration for reads or writes as it already offers sub-millisecond latency for all reads and writes.

> [!NOTE] It is important to be aware of the limitations of 
> [Ultra-Disk SSD](https://docs.microsoft.com/en-us/azure/virtual-machines/disks-types#ultra-disk). 
> There are limited virtual machine sizes and regions that support 
> [Ultra-Disk SSD](https://docs.microsoft.com/en-us/azure/virtual-machines/disks-types#ultra-disk). 
> The only redundancy options that are supported is Availability Zones. 
> Additionally, [Ultra-Disk SSD](https://docs.microsoft.com/en-us/azure/virtual-machines/disks-types#ultra-disk) 
> does not support disk snapshots, Azure disk encryption, Azure Backup, 
> or Azure Site Recovery. Finally, there is no caching support for reads
> or writes.


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

### Best Practices: Data Files
For the best OLTP and data warehouse performance choose a combination of premium disks with either P30s, P40s, or P50s for SQL Server data files that matches the uncached and cached performance of the source workload. The reason is that when premium storage is provisioned, unlike standard storage, the capacity, IOPS, and throughput of that disk is guaranteed. 
These premium Azure Managed Disks (P30s, P40s, and P50s) also supports read and write caching.

> [!NOTE] Azure Managed Disks larger than 4096 GBs do not have caching 
> support. For this reason, it is not recommended to use premium disks 
> for data files larger than P50.

### Best Practices: Log Files
The best practice is to initially choose Azure managed disks to support the transaction log capacity while allowing an additional 20% for growth.

Use premium disk storage between P30(s) to P80(s) for SQL Server transaction log needs. It is recommended to choose fewer disks while optimizing for capacity, IOps, and throughput for the transaction log. 

It is recommended to add an additional disk(s) to address the throughput requirements as needed.

There is no performance benefit in having multiple transaction log files as the transaction log is leveraged sequentially by nature. 

> [!NOTE] There is a potential performance penalty for using caching with
> log files and additionally, there is a potential for data corruption 
> when enabling caching for the log drive. Microsoft does not recommend 
> leveraging caching for the log files; therefore, you can use any data 
> disk P30 and greater up to the P80 for the log files. The best practice
> is to set the caching policy for the log files to ‘None’.

For customers that need extremely low latency for the transaction log customers should also consider [Ultra-Disk SSD](https://docs.microsoft.com/en-us/azure/virtual-machines/disks-types#ultra-disk) and Write Acceleration on the M-Series virtual machines.

### Summary
The chart below outlines the recommended Azure Managed Disks to consider for SQL Server data and log files.

For data files it is recommended to match the source environment’s capacity needs and the source environments performance needs with that of the Azure Premium Disks listed below. 

You can match the provisioned IOPS per disk with performance monitor (avg. disk sec/read + avg. disk sec/writes) and the provisioned throughput per disk with performance monitor (disk read bytes/sec + disk write bytes/sec) at peak times.

|Premium SSD Sizes | P30 | P40	| P50	| P60 | P70	| P80 |
|---|---|---|---|---|---|---|
| Disk size in GiB | 1,024 | 2,048 | 4,096 | 8,192 | 16,384 | 32,767 |
| Provisioned IOPS per disk | 5,000 | 7,500 | 7,500 | 16,000 | 18,000 | 20,000 | 
| Provisioned Throughput per disk | 200 MB/sec | 250 MB/sec | 250 MB/sec | 500 MB/sec | 750 MB/sec | 900 MB/sec |
| Eligible for reservation | Yes, up to one year | Yes, up to one year | Yes, up to one year | Yes, up to one year | Yes, up to one year | Yes, up to one year |
| Disk Caching Support | Yes | Yes | Yes | No | No | No |
| Recommendation | Data or Log | Data or Log | Data or Log | Log Only | Log Only | Log Only |

It is recommended to choose a mixture of disks to meet capacity and performance needs. Using the [SQL IaaS Agent extension](https://docs.microsoft.com/en-us/azure/azure-sql/virtual-machines/windows/storage-configuration) experience in the Azure portal makes the configuration very straight forward. In the SQL Server settings tab and in the ‘Storage optimization’ section administrators can change the configuration and choose the storage optimization of general, ‘transactional processing’, or ‘data warehousing’. 

![SQL VM Storage Config](https://docs.microsoft.com/en-us/azure/azure-sql/virtual-machines/windows/media/storage-configuration/sql-vm-storage-configuration.png)

In the ‘Configure storage’ screen, the data, log, and tempdb drives are isolated from each other by default to adhere with best practices.

The default disk type is a P30 (5000 Max IOPs and 200 Max throughput per disk) where an administrator can choose the number of disks that will support a SQL Server workload.

On Windows based virtual machines ‘Storage Spaces’ is used to stripe the disks together.

For Log storage it is recommended to choose the larger capacity drives (P60 for example) to support the IOPs, throughput, and capacity of your source environment. If there is not enough throughput available, then it may be necessary to add multiple disks for the transaction log drive.

For tempdb storage it is recommended to leverage the ephemeral D:\ if possible. If the tempdb size will not meet the capacity limits for the virtual machine it is recommended to choose a larger virtual machine rather than using data disks to support tempdb to maintain overall performance.

**Reference:**
Storage configuration for SQL Server VMs
https://docs.microsoft.com/en-us/azure/azure-sql/virtual-machines/windows/storage-configuration 

## Summary
To find the most effective storage configuration for SQL Server workloads on an Azure VM, start by measuring performance of the workload on the current hardware. Once storage requirements are known, selecting a SKU that supports the necessary IOPs and throughput with the appropriate core-to-memory ratio is a straightforward step. We recommend choosing the correct VM size with enough storage scale limits for your workload. 

Choose premium storage (P30, P40, and P50) with the Azure premium disk cache support for your data files. 

Placing tempdb on the local and ephemeral temporary disk (D:\) would bring the maximum performance with no additional cost for storage. 

Choose premium storage (P30 to P80) without Azure premium disk caching for your log files. For extremely low read and write latency needs use Ultra-disk SSD or write acceleration for M-series VMs. For SQL Server workloads, log write latencies are critical, especially when in-memory OLTP is used. Placing log file on Ultra SSD disk will enable high SQL Server performance with very low storage latencies. 

By combining Ultra SSD, Azure Premium Storage together with memory and storage optimized Virtual Machine Types - Azure Virtual Machines offers enterprise-grade performance for SQL Server workloads.

Using the [SQL IaaS Agent extension](https://docs.microsoft.com/en-us/azure/azure-sql/virtual-machines/windows/storage-configuration) experience in the Azure portal makes storage configuration easier to manage. You can choose your data, log, and tempdb configuration in the portal and underneath Windows will leverage ‘Storage Spaces’ to give your data files performance and resiliency, give your log files, and tempdb the configuration required for optimal performance. 

Finally, we recommend that creating Azure storage accounts in the same data center as your SQL Server virtual machines to reduce transfer delays. When creating a storage account, disable geo-replication as consistent write order across multiple disks is not guaranteed. Instead, consider configuring a SQL Server disaster recovery technology between two Azure data centers. For more information, see High Availability and Disaster Recovery for SQL Server on Azure Virtual Machines.

In the storage section we will cover configuring read-only caching for data files in a Premium Storage Pool where administrators can take advantage of both uncached and cached IOPS limits to drive workloads with low latency read requirements.

## Next steps

To learn more, see the other articles in this series:
- [Quick checklist](performance-guidelines-best-practices-checklist.md)
- [VM size](performance-guidelines-best-practices-vm-size.md)
- [Azure & SQL feature specific](performance-guidelines-best-practices-feature-specific.md)
- [Collect baseline](performance-guidelines-best-practices-collect-baseline.md)

For security best practices, see [Security considerations for SQL Server on Azure Virtual Machines](security-considerations-best-practices.md).

Review other SQL Server Virtual Machine articles at [SQL Server on Azure Virtual Machines Overview](sql-server-on-azure-vm-iaas-what-is-overview.md). If you have questions about SQL Server virtual machines, see the [Frequently Asked Questions](frequently-asked-questions-faq.md).

---
title: Resource limits
titleSuffix: Azure SQL Managed Instance 
description: This article provides an overview of the resource limits for Azure SQL Managed Instance. 
services: sql-database
ms.service: sql-managed-instance
ms.subservice: operations
ms.custom:
ms.devlang: 
ms.topic: conceptual
author: bonova
ms.author: bonova
ms.reviewer: carlrab, jovanpop, sachinp, sstein
ms.date: 02/25/2020
---
# Overview of Azure SQL Managed Instance resource limits
[!INCLUDE[appliesto-sqlmi](../includes/appliesto-sqlmi.md)]

This article provides an overview of the technical characteristics and resource limits for Azure SQL Managed Instance, and provides information about how to request an increase to these limits.

> [!NOTE]
> For differences in supported features and T-SQL statements see [Feature differences](../database/features-comparison.md) and [T-SQL statement support](transact-sql-tsql-differences-sql-server.md). For general differences between service tiers for Azure SQL Database and SQL Managed Instance see [Service tier comparison](../database/service-tiers-general-purpose-business-critical.md#service-tier-comparison).

## Hardware generation characteristics

SQL Managed Instance has characteristics and resource limits that depend on the underlying infrastructure and architecture. SQL Managed Instance can be deployed on two hardware generations: Gen4 and Gen5. Hardware generations have different characteristics, as described in the following table:

|   | **Gen4** | **Gen5** |
| --- | --- | --- |
| Hardware | Intel E5-2673 v3 (Haswell) 2.4-GHz processors, attached SSD vCore = 1 PP (physical core) | Intel E5-2673 v4 (Broadwell) 2.3-GHz and Intel SP-8160 (Skylake) processors, fast NVMe SSD, vCore=1 LP (hyper-thread) |
| Number of vCores | 8, 16, 24 vCores | 4, 8, 16, 24, 32, 40, 64, 80 vCores |
| Max memory (memory/core ratio) | 7 GB per vCore<br/>Add more vCores to get more memory. | 5.1 GB per vCore<br/>Add more vCores to get more memory. |
| Max In-Memory OLTP memory | Instance limit: 1-1.5 GB per vCore| Instance limit: 0.8 - 1.65 GB per vCore |
| Max instance reserved storage |  General Purpose: 8 TB<br/>Business Critical: 1 TB | General Purpose: 8 TB<br/> Business Critical 1 TB, 2 TB, or 4 TB depending on the number of cores |

> [!IMPORTANT]
> - Gen4 hardware is being phased out and is not available anymore for new deployments. All new instances of SQL Managed Instance must be deployed on Gen5 hardware.
> - Consider [moving your instance of SQL Managed Instance to Gen 5](../database/service-tiers-vcore.md) hardware to experience a wider range of vCore and storage scalability, accelerated networking, best IO performance, and minimal latency.

### In-memory OLTP available space 

The amount of In-memory OLTP space in [Business Critical](../database/service-tier-business-critical.md) service tier depends on the number of vCores and hardware generation. The following table lists limits of memory that can be used for In-memory OLTP objects.

| In-memory OLTP space	| **Gen5** | **Gen4** |
| --- | --- | --- |
| 4 vCores	| 3.14 GB | |	
| 8 vCores	| 6.28 GB | 8 GB |
| 16	vCores | 15.77	GB | 20 GB |
| 24	vCores | 25.25	GB | 36 GB |
| 32	vCores | 37.94	GB | |
| 40	vCores | 52.23	GB | |
| 64	vCores | 99.9 GB	| |
| 80	vCores | 131.68	GB| |

## Service tier characteristics

SQL Managed Instance has two service tiers: [General Purpose](../database/service-tier-general-purpose.md) and [Business Critical](../database/service-tier-business-critical.md). These tiers provide [different capabilities](../database/service-tiers-general-purpose-business-critical.md), as described in the table below.

> [!Important]
> Business Critical service-tier provides an additional built-in copy of the SQL Managed Instance (secondary replica) that can be used for read-only workload. If you can separate read-write queries and read-only/analytic/reporting queries, you are getting twice the vCores and memory for the same price. The secondary replica might lag a few seconds behind the primary instance, so it is designed to offload reporting/analytic workloads that don't need exact current state of data. In the table below, **read-only queries** are the queries that are executed on secondary replica.

| **Feature** | **General Purpose** | **Business Critical** |
| --- | --- | --- |
| Number of vCores\* | Gen4: 8, 16, 24<br/>Gen5: 4, 8, 16, 24, 32, 40, 64, 80 | Gen4: 8, 16, 24 <br/> Gen5: 4, 8, 16, 24, 32, 40, 64, 80 <br/>\*Same number of vCores is dedicated for read-only queries. |
| Max memory | Gen4: 56 GB - 168 GB (7GB/vCore)<br/>Gen5: 20.4 GB - 408 GB (5.1GB/vCore)<br/>Add more vCores to get more memory. | Gen4: 56 GB - 168 GB (7GB/vCore)<br/>Gen5: 20.4 GB - 408 GB (5.1GB/vCore) for read-write queries<br/>+ additional 20.4 GB - 408 GB (5.1GB/vCore) for read-only queries.<br/>Add more vCores to get more memory. |
| Max instance storage size (reserved) | - 2 TB for 4 vCores (Gen5 only)<br/>- 8 TB for other sizes | Gen4: 1 TB <br/> Gen5: <br/>- 1 TB for 4, 8, 16 vCores<br/>- 2 TB for 24 vCores<br/>- 4 TB for 32, 40, 64, 80 vCores |
| Max database size | Up to currently available instance size (max 2 TB - 8 TB depending on the number of vCores). | Up to currently available instance size (max 1 TB - 4 TB depending on the number of vCores). |
| Max tempDB size | Limited to 24 GB/vCore (96 - 1,920 GB) and currently available instance storage size.<br/>Add more vCores to get more TempDB space.<br/> Log file size is limited to 120 GB.| Up to currently available instance storage size. |
| Max number of databases per instance | 100, unless the instance storage size limit has been reached. | 100, unless the instance storage size limit has been reached. |
| Max number of database files per instance | Up to 280, unless the instance storage size or [Azure Premium Disk storage allocation space](../database/doc-changes-updates-release-notes.md#exceeding-storage-space-with-small-database-files) limit has been reached. | 32,767 files per database, unless the instance storage size limit has been reached. |
| Max data file size | Limited to currently available instance storage size (max 2 TB - 8 TB) and [Azure Premium Disk storage allocation space](../database/doc-changes-updates-release-notes.md#exceeding-storage-space-with-small-database-files). | Limited to currently available instance storage size (up to 1 TB - 4 TB). |
| Max log file size | Limited to 2 TB and currently available instance storage size. | Limited to 2 TB and currently available instance storage size. |
| Data/Log IOPS (approximate) | Up to 30-40 K IOPS per instance*, 500 - 7500 per file<br/>\*[Increase file size to get more IOPS](#file-io-characteristics-in-general-purpose-tier)| 10 K - 200 K (2500 IOPS/vCore)<br/>Add more vCores to get better IO performance. |
| Log write throughput limit (per instance) | 3 MB/s per vCore<br/>Max 22 MB/s | 4 MB/s per vCore<br/>Max 48 MB/s |
| Data throughput (approximate) | 100 - 250 MB/s per file<br/>\*[Increase the file size to get better IO performance](#file-io-characteristics-in-general-purpose-tier) | Not limited. |
| Storage IO latency (approximate) | 5-10 ms | 1-2 ms |
| In-memory OLTP | Not supported | Available, [size depends on number of vCore](#in-memory-oltp-available-space) |
| Max sessions | 30000 | 30000 |
| Max concurrent workers (requests) | Gen4: 210 * number of vCores + 800<br>Gen5: 105 * number of vCores + 800 | Gen4: 210 * vCore count + 800<br>Gen5: 105 * vCore count + 800 |
| [Read-only replicas](../database/read-scale-out.md) | 0 | 1 (included in price) |
| Compute isolation | Gen5:<br/>-supported for 80 vCores<br/>-not supported for other sizes<br/><br/>Gen4 is not supported due to deprecation|Gen5:<br/>-supported for 60, 64, 80 vCores<br/>-not supported for other sizes<br/><br/>Gen4 is not supported due to deprecation|


A few additional considerations: 

- **Currently available instance storage size** is the difference between reserved instance size and the used storage space.
- Both data and log file size in the user and system databases are included in the instance storage size that is compared with the max storage size limit. Use the [sys.master_files](/sql/relational-databases/system-catalog-views/sys-master-files-transact-sql) system view to determine the total used space by databases. Error logs are not persisted and not included in the size. Backups are not included in storage size.
- Throughput and IOPS in the General Purpose tier also depend on the [file size](#file-io-characteristics-in-general-purpose-tier) that is not explicitly limited by the SQL Managed Instance.
  You can create another readable replica in a different Azure region using [auto-failover groups](../database/auto-failover-group-configure.md)
- Max instance IOPS depend on the file layout and distribution of workload. As an example, if you create 7 x 1TB files with max 5K IOPS each and 7 small files (smaller than 128 GB) with 500 IOPS each, you can get 38500 IOPS per instance (7x5000+7x500) if your workload can use all files. Note that some IOPS is also used for auto-backups.

Find more information about the [resource limits in SQL Managed Instance pools in this article](instance-pools-overview.md#resource-limitations).

### File IO characteristics in General Purpose tier

In the General Purpose service tier every database file gets dedicated IOPS and throughput that depend on the file size. Bigger data files get more IOPS and throughput. IO characteristics of the database files are shown in the following table:

| File size | >=0 and <=128 GiB | >128 and <=256 GiB | >256 and <= 512 GiB | >0.5 and <=1 TiB    | >1 and <=2 TiB    | >2 and <=4 TiB | >4 and <=8 TiB |
|---------------------|-------|-------|-------|-------|-------|-------|-------|
| IOPS per file       | 500   | 1100 | 2300              | 5000              | 7500              | 7500              | 12,500   |
| Throughput per file | 100 MiB/s | 125 MiB/s | 150 MiB/s | 200 MiB/s | 250 MiB/s | 250 MiB/s | 480 MiB/s | 

If you notice high IO latency on some database file or you see that IOPS/throughput is reaching the limit, you might improve performance by [increasing the file size](https://techcommunity.microsoft.com/t5/Azure-SQL-Database/Increase-data-file-size-to-improve-HammerDB-workload-performance/ba-p/823337).

There is also an instance-level limit on the max log write throughput (which is 22 MB/s), so you may not be able to reach the max file throughout on the log file because you are hitting the instance throughput limit.

## Supported regions

SQL Managed Instance can be created only in [supported regions](https://azure.microsoft.com/global-infrastructure/services/?products=sql-database&regions=all). To create a SQL Managed Instance in a region that is currently not supported, you can [send a support request via the Azure portal](../database/quota-increase-request.md).

## Supported subscription types

SQL Managed Instance currently supports deployment only on the following types of subscriptions:

- [Enterprise Agreement (EA)](https://azure.microsoft.com/pricing/enterprise-agreement/)
- [Pay-as-you-go](https://azure.microsoft.com/offers/ms-azr-0003p/)
- [Cloud Service Provider (CSP)](https://docs.microsoft.com/partner-center/csp-documents-and-learning-resources)
- [Enterprise Dev/Test](https://azure.microsoft.com/offers/ms-azr-0148p/)
- [Pay-As-You-Go Dev/Test](https://azure.microsoft.com/offers/ms-azr-0023p/)
- [Subscriptions with monthly Azure credit for Visual Studio subscribers](https://azure.microsoft.com/pricing/member-offers/credit-for-visual-studio-subscribers/)

## Regional resource limitations

> [!Note]
> For the latest information on region availability for subscriptions, first check [official COVID-19 blog post](https://aka.ms/sqlcapacity).

Supported subscription types can contain a limited number of resources per region. SQL Managed Instance has two default limits per Azure region (that can be increased on-demand by creating a special [support request in the Azure portal](../database/quota-increase-request.md) depending on a type of subscription type:

- **Subnet limit**: The maximum number of subnets where instances of SQL Managed Instance are deployed in a single region.
- **vCore unit limit**: The maximum number of vCore units that can be deployed across all instances in a single region. One GP vCore uses one vCore unit and one BC vCore takes 4 vCore units. The total number of instances is not limited as long as it is within the vCore unit limit.

> [!Note]
> These limits are default settings and not technical limitations. The limits can be increased on-demand by creating a special [support request in the Azure portal](../database/quota-increase-request.md) if you need more instances in the current region. As an alternative, you can create new instances of SQL Managed Instance in another Azure region without sending support requests.

The following table shows the **default regional limits** for supported subscription types (default limits can be extended using support request described below):

|Subscription type| Max number of SQL Managed Instance subnets | Max number of vCore units* |
| :---| :--- | :--- |
|Pay-as-you-go|3|320|
|CSP |8 (15 in some regions**)|960 (1440 in some regions**)|
|Pay-as-you-go Dev/Test|3|320|
|Enterprise Dev/Test|3|320|
|EA|8 (15 in some regions**)|960 (1440 in some regions**)|
|Visual Studio Enterprise|2 |64|
|Visual Studio Professional and MSDN Platforms|2|32|

\* In planning deployments, please take into consideration that Business Critical (BC) service tier requires four (4) times more vCore capacity than General Purpose (GP) service tier. For example: 1 GP vCore = 1 vCore unit and 1 BC vCore = 4 vCore units. To simplify your consumption analysis against the default limits, summarize the vCore units across all subnets in the region where SQL Managed Instance is deployed and compare the results with the instance unit limits for your subscription type. **Max number of vCore units** limit applies to each subscription in a region. There is no limit per individual subnets except that the sum of all vCores deployed across multiple subnets must be lower or equal to **max number of vCore units**.

\*\* Larger subnet and vCore limits are available in the following regions: Australia East, East US, East US 2, North Europe, South Central US, Southeast Asia, UK South, West Europe, West US 2.

> [!IMPORTANT]
> In case your vCore and subnet limit is 0, it means that default regional limit for your subscription type is not set. You can also use quota increase request for getting subscription access in specific region following the same procedure - providing required vCore and subnet values.

## Request a quota increase

If you need more instances in your current regions, send a support request to extend the quota using the Azure portal. For more information, see [Request quota increases for Azure SQL Database](../database/quota-increase-request.md).

## Next steps

- For more information about SQL Managed Instance, see [What is a SQL Managed Instance?](sql-managed-instance-paas-overview.md).
- For pricing information, see [SQL Managed Instance pricing](https://azure.microsoft.com/pricing/details/sql-database/managed/).
- To learn how to create your first SQL Managed Instance, see [the quickstart guide](instance-create-quickstart.md).

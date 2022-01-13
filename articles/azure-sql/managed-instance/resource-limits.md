---
title: Resource limits
titleSuffix: Azure SQL Managed Instance
description: This article provides an overview of the resource limits for Azure SQL Managed Instance.
services: sql-database
ms.service: sql-managed-instance
ms.subservice: service-overview
ms.custom: references_regions, ignite-fall-2021
ms.devlang: 
ms.topic: reference
author: vladai78
ms.author: vladiv
ms.reviewer: mathoma, vladiv, sachinp, wiassaf
ms.date: 10/18/2021
---
# Overview of Azure SQL Managed Instance resource limits
[!INCLUDE[appliesto-sqlmi](../includes/appliesto-sqlmi.md)]

This article provides an overview of the technical characteristics and resource limits for Azure SQL Managed Instance, and provides information about how to request an increase to these limits.

> [!NOTE]
> For differences in supported features and T-SQL statements see [Feature differences](../database/features-comparison.md) and [T-SQL statement support](transact-sql-tsql-differences-sql-server.md). For general differences between service tiers for Azure SQL Database and SQL Managed Instance see [Service tier comparison](../database/service-tiers-general-purpose-business-critical.md#service-tier-comparison).

## Hardware generation characteristics

SQL Managed Instance has characteristics and resource limits that depend on the underlying infrastructure and architecture. SQL Managed Instance can be deployed on multiple hardware generations. 

> [!NOTE]
> The Gen5 hardware generation has been renamed to the **standard-series (Gen5)**, and we are introducing two new hardware generations in limited preview: **premium-series** and **memory optimized premium-series**.

For information on previous generation hardware generations, see [Previous generation hardware generation details](#previous-generation-hardware) later in this article. 

Hardware generations have different characteristics, as described in the following table:

|    | **Standard-series (Gen5)** | **Premium-series (preview)** | **Memory optimized premium-series (preview)** | 
|:-- |:-- |:-- |:-- |
| **CPU** |  Intel&reg; E5-2673 v4 (Broadwell) 2.3 GHz, Intel&reg; SP-8160 (Skylake), and  Intel&reg; 8272CL (Cascade Lake) 2.5 GHz processors | Intel&reg; 8370C (Ice Lake) 2.8 GHz processors | Intel&reg; 8370C (Ice Lake) 2.8 GHz processors |
| **Number of vCores** <BR>vCore=1 LP (hyper-thread) | 4-80 vCores | 4-80 vCores | 4-64 vCores |
| **Max memory (memory/vCore ratio)** | 5.1 GB per vCore<br/>Add more vCores to get more memory. | 7 GB per vCore | 13.6 GB per vCore |
| **Max In-Memory OLTP memory** |  Instance limit: 0.8 - 1.65 GB per vCore | Instance limit: 1.1 - 2.3 GB per vCore | Instance limit: 2.2 - 4.5 GB per vCore |
| **Max instance reserved storage**\* | **General Purpose:** up to 16 TB<br/> **Business Critical:** up to 4 TB | **General Purpose:** up to 16 TB<br/> **Business Critical:** up to 5.5 TB | **General Purpose:** up to 16 TB <br/> **Business Critical:** up to 16 TB |

\* Dependent on [the number of vCores](#service-tier-characteristics).

### Regional support for premium-series hardware generations (preview)

Support for the premium-series hardware generations (public preview) is currently available only in these specific regions: <br>

| Region | **Premium-series** | **Memory optimized premium-series** | 
|:--- |:--- |:--- |
| Australia Central | Yes | | 
| Australia East | Yes | Yes | 
| Canada Central | Yes | | 
| Canada East | Yes | | 
| Central US | Yes | | 
| East US  | Yes | Yes | 
| East US 2 | Yes | Yes | 
| France Central |  | Yes | 
| Germany West Central |  | Yes | 
| Japan East | Yes | | 
| Korea Central | Yes | | 
| North Central US | Yes | Yes | 
| North Europe | Yes | | 
| South Central US | Yes | Yes | 
| Southeast Asia | Yes |  | 
| UK South | Yes |  | 
| West Europe | Yes | Yes | 
| West US | Yes | Yes |  
| West US 2 | Yes | Yes | 
| West US 3 | Yes | Yes | 

### In-memory OLTP available space 

The amount of in-memory OLTP space in [Business Critical](../database/service-tier-business-critical.md) service tier depends on the number of vCores and hardware generation. The following table lists the limits of memory that can be used for in-memory OLTP objects.

| **vCores** | **Standard-series (Gen5)** | **Premium-series** | **Memory optimized premium-series** | 
|:--- |:--- |:--- |:--- |
| 4 vCores    | 3.14 GB | 4.39 GB | 8.79 GB | 
| 8 vCores    | 6.28 GB | 8.79 GB | 22.06 GB |  
| 16    vCores | 15.77 GB | 22.06 GB | 57.58 GB |
| 24    vCores | 25.25 GB | 35.34 GB | 93.09 GB |
| 32    vCores | 37.94 GB | 53.09 GB | 128.61 GB |
| 40    vCores | 52.23 GB | 73.09 GB | 164.13 GB |
| 64    vCores | 99.9 GB | 139.82 GB | 288.61 GB |
| 80    vCores | 131.68 GB| 184.30 GB | N/A |

## Service tier characteristics

SQL Managed Instance has two service tiers: [General Purpose](../database/service-tier-general-purpose.md) and [Business Critical](../database/service-tier-business-critical.md). These tiers provide [different capabilities](../database/service-tiers-general-purpose-business-critical.md), as described in the table below.

> [!Important]
> Business Critical service-tier provides an additional built-in copy of the SQL Managed Instance (secondary replica) that can be used for read-only workload. If you can separate read-write queries and read-only/analytic/reporting queries, you are getting twice the vCores and memory for the same price. The secondary replica might lag a few seconds behind the primary instance, so it is designed to offload reporting/analytic workloads that don't need exact current state of data. In the table below, **read-only queries** are the queries that are executed on secondary replica.

| **Feature** | **General Purpose** | **Business Critical** |
| --- | --- | --- |
| Number of vCores\* | 4, 8, 16, 24, 32, 40, 64, 80 |  **Standard-series (Gen5)**: 4, 8, 16, 24, 32, 40, 64, 80 <BR> **Premium-series**: 4, 8, 16, 24, 32, 40, 64, 80 <BR> **Memory optimized premium-series**: 4, 8, 16, 24, 32, 40, 64<br/>\*Same number of vCores is dedicated for read-only queries. |
| Max memory | **Standard-series (Gen5)**: 20.4 GB - 408 GB (5.1 GB/vCore)<BR> **Premium-series**: 28 GB - 560 GB (7 GB/vCore)<BR> **Memory optimized premium-series**: 54.4 GB - 870.4 GB (13.6 GB/vCore) | **Standard-series (Gen5)**: 20.4 GB - 408 GB (5.1 GB/vCore) on each replica<BR> **Premium-series**: 28 GB - 560 GB (7 GB/vCore) on each replica<BR> **Memory optimized premium-series**: 54.4 GB - 870.4 GB (13.6 GB/vCore) on each replica |
| Max instance storage size (reserved) | - 2 TB for 4 vCores<br/>- 8 TB for 8 vCores<br/>- 16 TB for other sizes <BR> | **Standard-series (Gen5)**: <br/>- 1 TB for 4, 8, 16 vCores<br/>- 2 TB for 24 vCores<br/>- 4 TB for 32, 40, 64, 80 vCores <BR> **Premium-series**: <BR>- 1 TB for 4, 8 vCores<br/>- 2 TB for 16, 24 vCores<br/>- 4 TB for 32 vCores<br/>- 5.5 TB for 40, 64, 80 vCores<br/> **Memory optimized premium-series**: <BR>- 1 TB for 4, 8 vCores<br/>- 2 TB for 16, 24 vCores<br/>- 4 TB for 32 vCores<br/>- 5.5 TB for 40 vCores<br/>- 16 TB for 64 vCores<br/> |
| Max database size | Up to currently available instance size (depending on the number of vCores). | Up to currently available instance size (depending on the number of vCores). |
| Max tempDB size | Limited to 24 GB/vCore (96 - 1,920 GB) and currently available instance storage size.<br/>Add more vCores to get more TempDB space.<br/> Log file size is limited to 120 GB.| Up to currently available instance storage size. |
| Max number of databases per instance | 100 user databases, unless the instance storage size limit has been reached. | 100 user databases, unless the instance storage size limit has been reached. |
| Max number of database files per instance | Up to 280, unless the instance storage size or [Azure Premium Disk storage allocation space](doc-changes-updates-known-issues.md#exceeding-storage-space-with-small-database-files) limit has been reached. | 32,767 files per database, unless the instance storage size limit has been reached. |
| Max data file size | Maximum size of each data file is 8 TB. Use at least two data files for databases larger than 8 TB. | Up to currently available instance size (depending on the number of vCores). |
| Max log file size | Limited to 2 TB and currently available instance storage size. | Limited to 2 TB and currently available instance storage size. |
| Data/Log IOPS (approximate) | Up to 30-40 K IOPS per instance*, 500 - 7500 per file<br/>\*[Increase file size to get more IOPS](#file-io-characteristics-in-general-purpose-tier)| 16 K - 320 K (4000 IOPS/vCore)<br/>Add more vCores to get better IO performance. |
| Log write throughput limit (per instance) | 3 MB/s per vCore<br/>Max 120 MB/s per instance<br/>22 - 65 MB/s per DB (depending on log file size)<br/>\*[Increase the file size to get better IO performance](#file-io-characteristics-in-general-purpose-tier) | 4 MB/s per vCore<br/>Max 96 MB/s |
| Data throughput (approximate) | 100 - 250 MB/s per file<br/>\*[Increase the file size to get better IO performance](#file-io-characteristics-in-general-purpose-tier) | Not limited. |
| Storage IO latency (approximate) | 5-10 ms | 1-2 ms |
| In-memory OLTP | Not supported | Available, [size depends on number of vCore](#in-memory-oltp-available-space) |
| Max sessions | 30000 | 30000 |
| Max concurrent workers (requests) | 105 * number of vCores + 800 | 105 * vCore count + 800 |
| [Read-only replicas](../database/read-scale-out.md) | 0 | 1 (included in price) |
| Compute isolation | Not supported as General Purpose instances may share physical hardware with other instances| **Standard-series (Gen5)**:<br/> Supported for 40, 64, 80 vCores<BR> **Premium-series**: Supported for 64, 80 vCores <BR> **Memory optimized premium-series**: Supported for 64 vCores |


A few additional considerations: 

- **Currently available instance storage size** is the difference between reserved instance size and the used storage space.
- Both data and log file size in the user and system databases are included in the instance storage size that is compared with the max storage size limit. Use the [sys.master_files](/sql/relational-databases/system-catalog-views/sys-master-files-transact-sql) system view to determine the total used space by databases. Error logs are not persisted and not included in the size. Backups are not included in storage size.
- Throughput and IOPS in the General Purpose tier also depend on the [file size](#file-io-characteristics-in-general-purpose-tier) that is not explicitly limited by the SQL Managed Instance.
  You can create another readable replica in a different Azure region using [auto-failover groups](../database/auto-failover-group-configure.md)
- Max instance IOPS depend on the file layout and distribution of workload. As an example, if you create 7 x 1 TB files with max 5 K IOPS each and seven small files (smaller than 128 GB) with 500 IOPS each, you can get 38500 IOPS per instance (7x5000+7x500) if your workload can use all files. Note that some IOPS are also used for auto-backups.

Find more information about the [resource limits in SQL Managed Instance pools in this article](instance-pools-overview.md#resource-limitations).

### File IO characteristics in General Purpose tier

In the General Purpose service tier, every database file gets dedicated IOPS and throughput that depend on the file size. Larger files get more IOPS and throughput. IO characteristics of database files are shown in the following table:

| **File size** | **>=0 and <=128 GiB** | **>128 and <= 512 GiB** | **>0.5 and <=1 TiB**    | **>1 and <=2 TiB**    | **>2 and <=4 TiB** | **>4 and <=8 TiB** | **>8 and <=16 TiB** |
|:--|:--|:--|:--|:--|:--|:--|:--|
| IOPS per file       | 500   | 2300              | 5000  | 7500              | 7500              | 12,500   | |
| Throughput per file | 100 MiB/s | 150 MiB/s | 200 MiB/s | 250 MiB/s| 250 MiB/s | 480 MiB/s |  |

If you notice high IO latency on some database file or you see that IOPS/throughput is reaching the limit, you might improve performance by [increasing the file size](https://techcommunity.microsoft.com/t5/Azure-SQL-Database/Increase-data-file-size-to-improve-HammerDB-workload-performance/ba-p/823337).

There is also an instance-level limit on the max log write throughput (see above for values, e.g.,  22 MB/s), so you may not be able to reach the max file throughout on the log file because you are hitting the instance throughput limit.

## Supported regions

SQL Managed Instance can be created only in [supported regions](https://azure.microsoft.com/global-infrastructure/services/?products=sql-database&regions=all). To create a SQL Managed Instance in a region that is currently not supported, you can [send a support request via the Azure portal](../database/quota-increase-request.md).

## Supported subscription types

SQL Managed Instance currently supports deployment only on the following types of subscriptions:

- [Enterprise Agreement (EA)](https://azure.microsoft.com/pricing/enterprise-agreement/)
- [Pay-as-you-go](https://azure.microsoft.com/offers/ms-azr-0003p/)
- [Cloud Service Provider (CSP)](/partner-center/csp-documents-and-learning-resources)
- [Enterprise Dev/Test](https://azure.microsoft.com/offers/ms-azr-0148p/)
- [Pay-As-You-Go Dev/Test](https://azure.microsoft.com/offers/ms-azr-0023p/)
- [Subscriptions with monthly Azure credit for Visual Studio subscribers](https://azure.microsoft.com/pricing/member-offers/credit-for-visual-studio-subscribers/)

## Regional resource limitations

> [!Note]
> For the latest information on region availability for subscriptions, first check [select a region](../capacity-errors-troubleshoot.md).

Supported subscription types can contain a limited number of resources per region. SQL Managed Instance has two default limits per Azure region (that can be increased on-demand by creating a special [support request in the Azure portal](../database/quota-increase-request.md) depending on a type of subscription type:

- **Subnet limit**: The maximum number of subnets where instances of SQL Managed Instance are deployed in a single region.
- **vCore unit limit**: The maximum number of vCore units that can be deployed across all instances in a single region. One GP vCore uses one vCore unit and one BC vCore takes four vCore units. The total number of instances is not limited as long as it is within the vCore unit limit.

> [!Note]
> These limits are default settings and not technical limitations. The limits can be increased on-demand by creating a special [support request in the Azure portal](../database/quota-increase-request.md) if you need more instances in the current region. As an alternative, you can create new instances of SQL Managed Instance in another Azure region without sending support requests.

The following table shows the **default regional limits** for supported subscription types (default limits can be extended using support request described below):

|Subscription type| Max number of SQL Managed Instance subnets | Max number of vCore units* |
| :---| :--- | :--- |
|CSP |16 (30 in some regions**)|960 (1440 in some regions**)|
|EA|16 (30 in some regions**)|960 (1440 in some regions**)|
|Enterprise Dev/Test|6|320|
|Pay-as-you-go|6|320|
|Pay-as-you-go Dev/Test|6|320|
|Azure Pass|3|64|
|BizSpark|3|64|
|BizSpark Plus|3|64|
|Microsoft Azure Sponsorship|3|64|
|Microsoft Partner Network|3|64|
|Visual Studio Enterprise (MPN)|3|64|
|Visual Studio Enterprise|3|32|
|Visual Studio Enterprise (BizSpark)|3|32|
|Visual Studio Professional|3|32|
|MSDN Platforms|3|32|

\* In planning deployments, please take into consideration that Business Critical (BC) service tier requires four (4) times more vCore capacity than General Purpose (GP) service tier. For example: 1 GP vCore = 1 vCore unit and 1 BC vCore = 4 vCore. To simplify your consumption analysis against the default limits, summarize the vCore units across all subnets in the region where SQL Managed Instance is deployed and compare the results with the instance unit limits for your subscription type. **Max number of vCore units** limit applies to each subscription in a region. There is no limit per individual subnets except that the sum of all vCores deployed across multiple subnets must be lower or equal to **max number of vCore units**.

\*\* Larger subnet and vCore limits are available in the following regions: Australia East, East US, East US 2, North Europe, South Central US, Southeast Asia, UK South, West Europe, West US 2.

> [!IMPORTANT]
> In case your vCore and subnet limit is 0, it means that default regional limit for your subscription type is not set. You can also use quota increase request for getting subscription access in specific region following the same procedure - providing required vCore and subnet values.

## Request a quota increase

If you need more instances in your current regions, send a support request to extend the quota using the Azure portal. For more information, see [Request quota increases for Azure SQL Database](../database/quota-increase-request.md).

## Previous generation hardware

This section includes details on previous generation hardware generations. Consider [moving your instance of SQL Managed Instance to the standard-series (Gen5)](../database/service-tiers-vcore.md) hardware to experience a wider range of vCore and storage scalability, accelerated networking, best IO performance, and minimal latency.

- Gen4 is being phased out and is not available for new deployments. 

### Hardware generation characteristics

|   | **Gen4** | 
| --- | --- | 
| **Hardware** | Intel&reg; E5-2673 v3 (Haswell) 2.4 GHz processors, attached SSD vCore = 1 PP (physical core) |   
| **Number of vCores** | 8, 16, 24 vCores | 
| **Max memory (memory/core ratio)** | 7 GB per vCore<br/>Add more vCores to get more memory. |  
| **Max In-Memory OLTP memory** |  Instance limit: 1-1.5 GB per vCore |
| **Max instance reserved storage** |  General Purpose: 8 TB <br/>Business Critical: 1 TB | 

### In-memory OLTP available space 

The amount of In-memory OLTP space in [Business Critical](../database/service-tier-business-critical.md) service tier depends on the number of vCores and hardware generation. The following table lists limits of memory that can be used for In-memory OLTP objects.

| In-memory OLTP space    |  **Gen4** |
| --- |  --- |
| 8 vCores    | 8 GB |
| 16    vCores |  20 GB |
| 24    vCores |  36 GB |


### Service tier characteristics

| **Feature** | **General Purpose** | **Business Critical** |
| --- | --- | --- |
| Number of vCores\* | Gen4: 8, 16, 24 | Gen4: 8, 16, 24 <BR>\*Same number of vCores is dedicated for read-only queries. |
| Max memory | Gen4: 56 GB - 168 GB (7GB/vCore)<br/>Add more vCores to get more memory. | Gen4: 56 GB - 168 GB (7GB/vCore)<br/>+ additional 20.4 GB - 408 GB (5.1GB/vCore) for read-only queries.<br/>Add more vCores to get more memory. |
| Max instance storage size (reserved) | Gen4: 8 TB | Gen4: 1 TB  |
| Max database size | Gen4: Up to currently available instance size (max 2 TB - 8 TB depending on the number of vCores). | Gen4: Up to currently available instance size (max 1 TB - 4 TB depending on the number of vCores). |
| Max tempDB size | Gen4: Limited to 24 GB/vCore (96 - 1,920 GB) and currently available instance storage size.<br/>Add more vCores to get more TempDB space.<br/> Log file size is limited to 120 GB.| Gen4: Up to currently available instance storage size. |
| Max number of databases per instance | Gen4: 100 user databases, unless the instance storage size limit has been reached. | Gen4: 100 user databases, unless the instance storage size limit has been reached. |
| Max number of database files per instance | Gen4: Up to 280, unless the instance storage size or [Azure Premium Disk storage allocation space](../database/doc-changes-updates-release-notes.md#exceeding-storage-space-with-small-database-files) limit has been reached. | Gen4: 32,767 files per database, unless the instance storage size limit has been reached. |
| Max data file size | Gen4: Limited to currently available instance storage size (max 2 TB - 8 TB) and [Azure Premium Disk storage allocation space](../database/doc-changes-updates-release-notes.md#exceeding-storage-space-with-small-database-files). Use at least two data files for databases larger than 8 TB. | Gen4:  Limited to currently available instance storage size (up to 1 TB - 4 TB). |
| Max log file size | Gen4: Limited to 2 TB and currently available instance storage size. | Gen4: Limited to 2 TB and currently available instance storage size. |
| Data/Log IOPS (approximate) | Gen4: Up to 30-40 K IOPS per instance*, 500 - 7500 per file<br/>\*[Increase file size to get more IOPS](#file-io-characteristics-in-general-purpose-tier)| Gen4: 16 K - 320 K (4000 IOPS/vCore)<br/>Add more vCores to get better IO performance. | 
| Log write throughput limit (per instance) | Gen4: 3 MB/s per vCore<br/>Max 120 MB/s per instance<br/>22 - 65 MB/s per DB<br/>\*[Increase the file size to get better IO performance](#file-io-characteristics-in-general-purpose-tier) | Gen4:  4 MB/s per vCore<br/>Max 96 MB/s |
| Data throughput (approximate) | Gen4: 100 - 250 MB/s per file<br/>\*[Increase the file size to get better IO performance](#file-io-characteristics-in-general-purpose-tier) | Gen4: Not limited. |
| Storage IO latency (approximate) | Gen4: 5-10 ms | Gen4: 1-2 ms |
| In-memory OLTP | Gen4: Not supported | Gen4: Available, [size depends on number of vCore](#in-memory-oltp-available-space) |
| Max sessions | Gen4: 30000 | Gen4: 30000 |
| Max concurrent workers (requests) | Gen4: 210 * number of vCores + 800 | Gen4: 210 * vCore count + 800 |
| [Read-only replicas](../database/read-scale-out.md) | Gen4: 0 | Gen4: 1 (included in price) |
| Compute isolation | Gen4: not supported | Gen4: not supported |


## Next steps

- For more information about SQL Managed Instance, see [What is a SQL Managed Instance?](sql-managed-instance-paas-overview.md).
- For pricing information, see [SQL Managed Instance pricing](https://azure.microsoft.com/pricing/details/sql-database/managed/).
- To learn how to create your first SQL Managed Instance, see [the quickstart guide](instance-create-quickstart.md).

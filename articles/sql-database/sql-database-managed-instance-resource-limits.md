---
title: Resource limits - managed instance
description: This article provides an overview of the Azure SQL Database resource limits for managed instances. 
services: sql-database
ms.service: sql-database
ms.subservice: managed-instance
ms.custom:
ms.devlang: 
ms.topic: conceptual
author: bonova
ms.author: bonova
ms.reviewer: carlrab, jovanpop, sachinp, sstein
ms.date: 11/27/2019
---
# Overview Azure SQL Database managed instance resource limits

This article provides an overview of the technical characteristics and resource limits for Azure SQL Database managed instance, and provides information about how to request an increase to these limits.

> [!NOTE]
> For differences in supported features and T-SQL statements see [Feature differences](sql-database-features.md) and [T-SQL statement support](sql-database-managed-instance-transact-sql-information.md). For general differencess between service tiers in single database and managed instance see [Service tier comparison](sql-database-service-tiers-general-purpose-business-critical.md#service-tier-comparison).

## Hardware generation characteristics

Managed instance has characteristics and resource limits that depend on the underlying infrastructure and architecture. Azure SQL Database managed instance can be deployed on two hardware generations: Gen4 and Gen5. Hardware generations have different characteristics, as described in the following table:

|   | **Gen4** | **Gen5** |
| --- | --- | --- |
| Hardware | Intel E5-2673 v3 (Haswell) 2.4-GHz processors, attached SSD vCore = 1 PP (physical core) | Intel E5-2673 v4 (Broadwell) 2.3-GHz and Intel SP-8160 (Skylake) processors, fast NVMe SSD, vCore=1 LP (hyper-thread) |
| Number of vCores | 8, 16, 24 vCores | 4, 8, 16, 24, 32, 40, 64, 80 vCores |
| Max memory (memory/core ratio) | 7 GB per vCore<br/>Add more vCores to get more memory. | 5.1 GB per vCore<br/>Add more vCores to get more memory. |
| Max In-Memory OLTP memory | Instance limit: 1-1.5 GB per vCore| Instance limit: 0.8 - 1.65 GB per vCore |
| Max instance reserved storage |  General Purpose: 8 TB<br/>Business Critical: 1 TB | General Purpose: 8 TB<br/> Business Critical 1 TB, 2 TB, or 4 TB depending on the number of cores |

> [!IMPORTANT]
> - Gen4 hardware is being phased out. It is recommended to deploy new managed instances on Gen5 hardware.
> - Gen4 hardware at this time is still available only in the following regions: North Europe, West Europe, East US, South Central US, North Central US, West US 2, Central US, Canada Central, South India, Southeast Asia and Korea Central.

### In-memory OLTP available space 

The amount of In-memory OLTP space in [Business Critical](sql-database-service-tier-business-critical.md) service tier depends on the number of vCores and hardware generation. In the following table are listed limits of memory that can be used for In-memory OLTP objects.

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

Managed instance has two service tiers: [General Purpose](sql-database-service-tier-general-purpose.md) and [Business Critical](sql-database-service-tier-business-critical.md). These tiers provide [different capabilities](sql-database-service-tiers-general-purpose-business-critical.md), as described in the table below.

> [!Important]
> Business Critical service-tier provides additional built-in copy of instance (secondary replica) that can be used for read-only workload. If you can separate read-write queries and read-only/analytic/reporting queries, you are getting twice vCores and memory for the same price. Secondary replica might lag few seconds behind the primary instance, so it is designed to offload reporting/analytic workload that don't need exact current state of data. In the table below, **read-only queries** are the queries that are executed on secondary replica.

| **Feature** | **General Purpose** | **Business Critical** |
| --- | --- | --- |
| Number of vCores\* | Gen4: 8, 16, 24<br/>Gen5: 4, 8, 16, 24, 32, 40, 64, 80 | Gen4: 8, 16, 24 <br/> Gen5: 4, 8, 16, 24, 32, 40, 64, 80 <br/>\*Same number of vCores is dedicated for read-only queries. |
| Max memory | Gen4: 56 GB - 168 GB (7GB/vCore)<br/>Gen5: 20.4 GB - 408 GB (5.1GB/vCore)<br/>Add more vCores to get more memory. | Gen4: 56 GB - 168 GB (7GB/vCore)<br/>Gen5: 20.4 GB - 408 GB (5.1GB/vCore) for read-write queries<br/>+ additional 20.4 GB - 408 GB (5.1GB/vCore) for read-only queries.<br/>Add more vCores to get more memory. |
| Max instance storage size (reserved) | - 2 TB for 4 vCores (Gen5 only)<br/>- 8 TB for other sizes | Gen4: 1 TB <br/> Gen5: <br/>- 1 TB for 4, 8, 16 vCores<br/>- 2 TB for 24 vCores<br/>- 4 TB for 32, 40, 64, 80 vCores |
| Max database size | Up to currently available instance size (max 2 TB - 8 TB depending on the number of vCores). | Up to currently available instance size (max 1 TB - 4 TB depending on the number of vCores). |
| Max tempDB size | Limited to 24 GB/vCore (96 - 1,920 GB) and currently available instance storage size.<br/>Add more vCores to get more TempDB space.<br/> Log file size is limited to 120 GB.| Up to currently available instance storage size. |
| Max number of databases per instance | 100, unless the instance storage size limit has been reached. | 100, unless the instance storage size limit has been reached. |
| Max number of database files per instance | Up to 280, unless the instance storage size or [Azure Premium Disk storage allocation space](sql-database-managed-instance-transact-sql-information.md#exceeding-storage-space-with-small-database-files) limit has been reached. | 32,767 files per database, unless the instance storage size limit has been reached. |
| Max data file size | Limited to currently available instance storage size (max 2 TB - 8 TB) and [Azure Premium Disk storage allocation space](sql-database-managed-instance-transact-sql-information.md#exceeding-storage-space-with-small-database-files). | Limited to currently available instance storage size (up to 1 TB - 4 TB). |
| Max log file size | Limited to 2 TB and currently available instance storage size. | Limited to 2 TB and currently available instance storage size. |
| Data/Log IOPS (approximate) | Up to 30-40 K IOPS per instance*, 500 - 7500 per file<br/>\*[Increase file size to get more IOPS](#file-io-characteristics-in-general-purpose-tier)| 5.5 K - 110 K (1375 IOPS/vCore)<br/>Add more vCores to get better IO performance. |
| Log write throughput limit (per instance) | 3 MB/s per vCore<br/>Max 22 MB/s | 4 MB/s per vCore<br/>Max 48 MB/s |
| Data throughput (approximate) | 100 - 250 MB/s per file<br/>\*[Increase the file size to get better IO performance](#file-io-characteristics-in-general-purpose-tier) | Not limited. |
| Storage IO latency (approximate) | 5-10 ms | 1-2 ms |
| In-memory OLTP | Not supported | Available, [size depends on number of vCore](#in-memory-oltp-available-space) |
| Max sessions | 30000 | 30000 |
| [Read-only replicas](sql-database-read-scale-out.md) | 0 | 1 (included in price) |

> [!NOTE]
> - **Currently available instance storage size** is the difference between reserved instance size and the used storage space.
> - Both data and log file size in the user and system databases are included in the instance storage size that is compared with the Max storage size limit. Use <a href="https://docs.microsoft.com/sql/relational-databases/system-catalog-views/sys-master-files-transact-sql">sys.master_files</a> system view to determine the total used space by databases. Error logs are not persisted and not included in the size. Backups are not included in storage size.
> - Throughput and IOPS on General Purpose tier also depend on the [file size](#file-io-characteristics-in-general-purpose-tier) that is not explicitly limited by managed instance.
> - You can create another readable replica in different Azure region using Auto-failover groups.
> - Max instance IOPS depend on the file layout and distribution of workload. As an example, if you create 7 x 1TB files with max 5K IOPS each and 7 small files (smaller than 128 GB) with 500 IOPS each, you can get 38500 IOPS per instance (7x5000+7x500) if your workload can use all files. Note that some amount of IOPS is also used for auto-backups.

> [!NOTE]
> Find more information about the [resource limits in managed instance pools in this article](sql-database-instance-pools.md#instance-pools-resource-limitations).

### File IO characteristics in General Purpose tier

In General Purpose service tier every database file is getting dedicated IOPS and throughput that depends on the file size. Bigger files are getting more IOPS and throughput. IO characteristics of the database files are shown in the following table:

| File size           | 0 - 128 GiB | 128 - 256 GiB | 256 - 512 GiB | 0.5 - 1 TiB    | 1 - 2 TiB    | 2 - 4 TiB | 4 - 8 TiB |
|---------------------|-------|-------|-------|-------|-------|-------|-------|
| IOPS per file       | 500   | 1100 | 2300              | 5000              | 7500              | 7500              | 12,500   |
| Throughput per file | 100 MiB/s | 125 MiB/s | 150 MiB/s | 200 MiB/s | 250 MiB/s | 250 MiB/s | 480 MiB/s | 

If you notice high IO latency on some database file or you see that IOPS/throughput is reaching the limit, you might improve performance by [increasing the file size](https://techcommunity.microsoft.com/t5/Azure-SQL-Database/Increase-data-file-size-to-improve-HammerDB-workload-performance/ba-p/823337).

There are also instance-level limits like max log write throughput 22 MB/s, so you might not be able to reach file throughout on log file because you are reaching instance throughput limit.

## Supported regions

Managed instances can be created only in [supported regions](https://azure.microsoft.com/global-infrastructure/services/?products=sql-database&regions=all). To create a managed instance in a region that is currently not supported, you can [send a support request via the Azure portal](#obtaining-a-larger-quota-for-sql-managed-instance).

## Supported subscription types

Managed instance currently supports deployment only on the following types of subscriptions:

- [Enterprise Agreement (EA)](https://azure.microsoft.com/pricing/enterprise-agreement/)
- [Pay-as-you-go](https://azure.microsoft.com/offers/ms-azr-0003p/)
- [Cloud Service Provider (CSP)](https://docs.microsoft.com/partner-center/csp-documents-and-learning-resources)
- [Enterprise Dev/Test](https://azure.microsoft.com/offers/ms-azr-0148p/)
- [Pay-As-You-Go Dev/Test](https://azure.microsoft.com/offers/ms-azr-0023p/)
- [Subscriptions with monthly Azure credit for Visual Studio subscribers](https://azure.microsoft.com/pricing/member-offers/credit-for-visual-studio-subscribers/)

## Regional resource limitations

Supported subscription types can contain a limited number of resources per region. Managed instance has two default limits per Azure region (that can be increased on-demand by creating a special [support request in the Azure portal](#obtaining-a-larger-quota-for-sql-managed-instance)) depending on a type of subscription type:

- **Subnet limit**: The maximum number of subnets where managed instances are deployed in a single region.
- **vCore unit limit**: The maximum number of vCore units that can be deployed across all instances in a single region. One GP vCore uses one vCore unit and one BC vCore takes 4 vCore units. The total number of instances is not limited as long as it is within the vCore unit limit.

> [!Note]
> These limits are default settings and not technical limitations. The limits can be increased on-demand by creating a special [support request in the Azure portal](#obtaining-a-larger-quota-for-sql-managed-instance) if you need more managed instances in the current region. As an alternative, you can create new managed instances in another Azure region without sending support requests.

The following table shows the **default regional limits** for supported subscription types (default limits can be extended using support request described below):

|Subscription type| Max number of managed instance subnets | Max number of vCore units* |
| :---| :--- | :--- |
|Pay-as-you-go|3|320|
|CSP |8 (15 in some regions**)|960 (1440 in some regions**)|
|Pay-as-you-go Dev/Test|3|320|
|Enterprise Dev/Test|3|320|
|EA|8 (15 in some regions**)|960 (1440 in some regions**)|
|Visual Studio Enterprise|2 |64|
|Visual Studio Professional and MSDN Platforms|2|32|

\* In planning deployments, please take into consideration that Business Critical (BC) service tier requires four (4) times more vCore capacity than General Purpose (GP) service tier. For example: 1 GP vCore = 1 vCore unit and 1 BC vCore = 4 vCore units. To simplify your consumption analysis against the default limits, summarize the vCore units across all subnets in the region where managed instances are deployed and compare the results with the instance unit limits for your subscription type. **Max number of vCore units** limit applies to each subscription in a region. There is no limit per individual subnets except that the sum of all vCores deployed across multiple subnets must be lower or equal to **max number of vCore units**.

\*\* Larger subnet and vCore limits are available in the following regions: Australia East, East US, East US 2, North Europe, South Central US, Southeast Asia, UK South, West Europe, West US 2.

## Obtaining a larger quota for SQL managed instance

If you need more managed instances in your current regions, send a support request to extend the quota using the Azure portal.
To initiate the process of obtaining a larger quota:

1. Open **Help + support**, and click **New support request**.

   ![Help and Support](media/sql-database-managed-instance-resource-limits/help-and-support.png)
2. On the Basics tab for the new support request:
   - For **Issue type**, select **Service and subscription limits (quotas)**.
   - For **Subscription**, select your subscription.
   - For **Quota type**, select **SQL Database Managed Instance**.
   - For **Support plan**, select your support plan.

     ![Issue type quota](media/sql-database-managed-instance-resource-limits/issue-type-quota.png)

3. Click **Next**.
4. On the **Problem tab** for the new support request:
   - For **Severity**, select the severity level of the problem.
   - For **Details**, provide additional information about your issue, including error messages.
   - For **File upload**, attach a file with more information (up to 4 MB).

     ![Problem details](media/sql-database-managed-instance-resource-limits/problem-details.png)

     > [!IMPORTANT]
     > A valid request should include:
     > - Region in which subscription limit needs to be increased.
     > - Required number of vCores, per service tier in existing subnets after the quota increase (if any of the existing subnets needs to be expanded.
     > - Required number of new subnets and total number of vCores per service tier within the new subnets (if you need to deploy managed instances in new subnets).

5. Click **Next**.
6. On the Contact Information tab for the new support request, enter preferred contact method (email or phone) and the contact details.
7. Click **Create**.

## Next steps

- For more information about managed instance, see [What is a managed instance?](sql-database-managed-instance.md).
- For pricing information, see [SQL Database managed instance pricing](https://azure.microsoft.com/pricing/details/sql-database/managed/).
- To learn how to create your first managed instance, see [the quickstart guide](sql-database-managed-instance-get-started.md).

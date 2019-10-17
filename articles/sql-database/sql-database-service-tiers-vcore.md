---
title: 'Azure SQL Database service - vCore purchasing model | Microsoft Docs'
description: The vCore purchasing model lets you independently scale compute and storage resources, match on-premises performance, and optimize price.
services: sql-database
ms.service: sql-database
ms.subservice: service
ms.topic: conceptual
author: stevestein
ms.author: sstein
ms.reviewer: sashan, moslake, carlrab
ms.date: 10/15/2019
---
# vCore purchasing model

The virtual core (vCore) purchasing model provides several benefits:

- Higher compute, memory, and storage limits.
- Control over the hardware generation to better match compute and memory requirements of the workload.
- Pricing discounts for [Azure Hybrid Benefit (AHB)](sql-database-azure-hybrid-benefit.md) and [Reserved Instance (RI)](sql-database-reserved-capacity.md).
- Greater transparency in the hardware details that power the compute; facilitates planning for migrations from on-premises deployments.

## Service tiers

Service tier options in the vCore model include General Purpose, Business Critical, and Hyperscale. The service tier generally defines the storage architecture, space and IO limits, and business continuity options related to availability and disaster recovery.

||**General purpose**|**Business critical**|**Hyperscale**|
|---|---|---|---|
|Best for|Most business workloads. Offers budget-oriented, balanced, and scalable compute and storage options. |Offers business applications the highest resilience to failures by using several isolated replicas, and provides the highest I/O performance per database replica.|Most business workloads with highly scalable storage and read-scale requirements.  Offers higher resilience to failures by allowing configuration of more than one isolated database replica. |
|Storage|Uses remote storage.<br/>**Single database and elastic pool provisioned compute**:<br/>5 GB – 4 TB<br/>**Serverless compute**:<br/>5 GB - 3 TB<br/>**Managed instance**: 32 GB - 8 TB |Uses local SSD storage.<br/>**Single database and elastic pool provisioned compute**:<br/>5 GB – 8 TB<br/>**Managed instance**:<br/>32 GB - 4 TB |Flexible autogrow of storage as needed. Supports up to 100 TB of storage. Uses local SSD storage for local buffer-pool cache and local data storage. Uses Azure remote storage as final long-term data store. |
|I/O throughput (approximate)|**Single database and elastic pool**: 500 IOPS per vCore up to 40000 maximum IOPS.<br/>**Managed instance**: Depends on [size of file](../virtual-machines/windows/premium-storage-performance.md#premium-storage-disk-sizes).|5000 IOPS per vCore up to 320,000 maximum IOPS|Hyperscale is a multi-tiered architecture with caching at multiple levels. Effective IOPs will depend on the workload.|
|Availability|1 replica, no read-scale replicas|3 replicas, 1 [read-scale replica](sql-database-read-scale-out.md),<br/>zone-redundant high availability (HA)|1 read-write replica, plus 0-4 [read-scale replicas](sql-database-read-scale-out.md)|
|Backups|[Read-access geo-redundant storage (RA-GRS)](../storage/common/storage-designing-ha-apps-with-ragrs.md), 7-35 days (7 days by default)|[RA-GRS](../storage/common/storage-designing-ha-apps-with-ragrs.md), 7-35 days (7 days by default)|Snapshot-based backups in Azure remote storage. Restores use these snapshots for fast recovery. Backups are instantaneous and don't impact compute I/O performance. Restores are fast and aren't a size-of-data operation (taking minutes rather than hours or days).|
|In-memory|Not supported|Supported|Not supported|
|||


### Choosing a service tier

For information on selecting a service tier for your particular workload, see the following articles:

- [When to choose the General purpose service tier](sql-database-service-tier-general-purpose.md#when-to-choose-this-service-tier)
- [When to choose the Business Critical service tier](sql-database-service-tier-business-critical.md#when-to-choose-this-service-tier)
- [When to choose the Hyperscale service tier](sql-database-service-tier-hyperscale.md#who-should-consider-the-hyperscale-service-tier)


## Hardware generations

Hardware generation options in the vCore model include Gen 4/5, M-series, and Fsv2-series. The hardware generation generally defines the compute and memory limits and other characteristics that impact the performance of the workload.

### Gen5

- Gen5 hardware is suitable for most database workloads that do not have higher memory, higher vCore, or faster single vCore requirements as provided by M-series or Fsv2-series. 


### Fsv2-series (preview)

- Fsv2-series is a compute optimized hardware option delivering low CPU latency and high clock speed for the most CPU demanding workloads.
- Depending on the workload, Fsv2-series can deliver more CPU performance per vCore than Gen5, and the 72 vCore size can provide more CPU performance for less cost than 80 vCores on Gen5. 
- Fsv2 provides less memory and tempdb per vCore than other hardware so workloads sensitive to those limits may want to consider Gen5 or M-series instead.  

Fsv2-series is currently available in the following regions:
US West, US West 2, and US East.


### M-series (preview)

- M-series is a memory optimized hardware option for workloads demanding more memory and higher compute limits than provided by Gen5.
- M-series provides 29 GB per vCore and 128 vCores, which increases the memory limit relative to Gen5 by 8x to nearly 4 TB.

M-series is currently available in the following regions:
US West, US West 2, and US East.

To enable M-series availability in a subscription, access must be requested by filing a new support request. For details on creating a support request, see [Hardware availability](#hardware-availability).


### Compute and memory specifications

> [!IMPORTANT]
> New Gen4 databases are no longer supported in the Australia East or Brazil South regions.


|Hardware generation  |Compute  |Memory  |
|:---------|:---------|:---------|
|Gen4     |- Intel E5-2673 v3 (Haswell) 2.4 GHz processors<br>- Provision up to 24 vCores (1 vCore = 1 physical core)  |- 7 GB per vCore<br>- Provision up to 168 GB|
|Gen5     |**Provisioned compute**<br>- Intel E5-2673 v4 (Broadwell) 2.3 GHz processors<br>- Provision up to 80 vCores (1 vCore = 1 hyper-thread)<br><br>**Serverless compute**<br>- Intel E5-2673 v4 (Broadwell) 2.3 GHz processors<br>- Auto-scale up to 16 vCores (1 vCore = 1 hyper-thread)|**Provisioned compute**<br>- 5.1 GB per vCore<br>- Provision up to 408 GB<br><br>**Serverless compute**<br>- Auto-scale up to 24 GB per vCore<br>- Auto-scale up to 48 GB max|
|M-series     |- Intel Xeon E7-8890 v3 2.5 GHz processors<br>- Provision 128 vCores (1 vCore = 1 hyper-thread)|- 29 GB per vCore<br>- Provision 3.7 TB|
|Fsv2-series     |- Intel Xeon Platinum 8168 (SkyLake) processors<br>- Featuring a sustained all core turbo clock speed of 3.4 GHz and a maximum single core turbo clock speed of 3.7 GHz.<br>- Provision 72 vCores (1 vCore = 1 hyper-thread)|- 1.9 GB per vCore<br>- Provision 136 GB|


For more information on resource limits, see [Resource limits for single databases (vCore)](sql-database-vcore-resource-limits-single-databases.md), or [Resource limits for elastic pools (vCore)](sql-database-vcore-resource-limits-elastic-pools.md).

### Hardware availability
 
All hardware generations are available without requesting access, except M-series. For M-series, access must be requested by filing a new support request. 

Create a support request in the Azure portal by completing the following steps: 

1. Select **Help + support** in the portal.
2. Select **New support request**.

On the Basics page, provide the following:

1. For **Issue type**, select **Service and subscription limits (quotas)**.
2. For **Subscription** = select the subscription to enable M-series.
3. For **Quota type**, select **SQL database**.
4. Select **Next** to go to the **Details** page.
5. In the **PROBLEM DETAILS** section select the **Provide details** link. 
6. For **SQL Database quota type** select **M-series**.
7. For **Region**, select the region to enable M-series.
    M-series is currently available in the following regions: US West, US West 2, and US East.

Approved support requests are typically fulfilled within 5 business days.




## Next steps

- For the specific compute sizes and storage size choices available for single databases, see [SQL Database vCore-based resource limits for single databases](sql-database-vcore-resource-limits-single-databases.md).
- For the specific compute sizes and storage size choices available for elastic pools, see [SQL Database vCore-based resource limits for elastic pools](sql-database-vcore-resource-limits-elastic-pools.md#general-purpose-service-tier-storage-sizes-and-compute-sizes).

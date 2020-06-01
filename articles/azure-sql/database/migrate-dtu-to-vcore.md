---
title: Migrate from DTU to vCore
description: Migrate a database in Azure SQL Database from the DTU model to the vCore model. Migrating to vCore is similar to upgrading or downgrading between the standard and premium tiers.
services: sql-database
ms.service: sql-database
ms.subservice: service
ms.topic: conceptual
ms.custom: sqldbrb=1
author: stevestein
ms.author: sstein
ms.reviewer: sashan, moslake, carlrab
ms.date: 05/28/2020
---
# Migrate Azure SQL Database from the DTU-based model to the vCore-based model
[!INCLUDE[appliesto-sqldb](../includes/appliesto-sqldb.md)]

This article describes how to migrate your database in Azure SQL Database from the [DTU-based purchasing model](service-tiers-dtu.md) to the [vCore-based purchasing model](service-tiers-vcore.md). 

## Migrate a database

Migrating a database from the DTU-based purchasing model to the vCore-based purchasing model is similar to scaling between service objectives in the Basic, Standard, and Premium service tiers, with similar [duration](single-database-scale.md#latency) and a [minimal downtime](scale-resources.md) at the end of the migration process. A database migrated to the vCore-based purchasing model can be migrated back to the DTU-based purchasing model at any time in the same fashion, with the exception of databases migrated to the [Hyperscale](service-tier-hyperscale.md) service tier. 

## Choose the vCore service tier and service objective

For most DTU to vCore migration scenarios, databases and elastic pools in the Basic and Standard service tiers will map to the [General Purpose](service-tier-general-purpose.md) service tier. Databases and elastic pools in the Premium service tier will map to the [Business Critical](service-tier-business-critical.md) service tier. Depending on application scenario and requirements, the [Hyperscale](service-tier-hyperscale.md) service tier can often be used as the migration target for single databases in all DTU service tiers.

To choose the service objective, or compute size, for the migrated database in the vCore model, you can use a simple but approximate rule of thumb: every 100 DTUs in the Basic or Standard tiers require *at least* 1 vCore, and every 125 DTUs in the Premium tier require *at least* 1 vCore. 

> [!TIP]
> This rule is approximate because it does not consider the hardware generation used for the DTU database or elastic pool. 

In the DTU model, any available [hardware generation](purchasing-models.md#hardware-generations-in-the-dtu-based-purchasing-model) can be used for your database or elastic pool. Further, you have only indirect control over the number of vCores (logical CPUs), by choosing higher or lower DTU or eDTU values. 

With the vCore model, customers must make an explicit choice of both the hardware generation and the number of vCores (logical CPUs). The DTU model does not offer these choices, however the hardware generation and the number of logical CPUs used for every database and elastic pool are exposed via dynamic management views. This makes it possible to determine the matching vCore service objective more precisely. 

The following approach uses this information to determine a vCore service objective with a similar allocation of resources, to obtain a similar level of performance after migration to the vCore model.

### DTU to vCore mapping

A T-SQL query below, when executed in the context of a DTU database to be migrated, will return a matching (possibly fractional) number of vCores in each hardware generation in the vCore model. By rounding this number to the closest number of vCores available for [databases](resource-limits-vcore-single-databases.md) and [elastic pools](resource-limits-vcore-elastic-pools.md) in each hardware generation in the vCore model, customers can choose the vCore service objective that is the closest match for their DTU database or elastic pool. 

Sample migration scenarios using this approach are described in the [Examples](#dtu-to-vcore-migration-examples) section.

Execute this query in the context of the database to be migrated, rather than in the `master` database. When migrating an elastic pool, execute the query in the context of any database in the pool.

```SQL
WITH dtu_vcore_map AS
(
SELECT TOP (1) rg.slo_name,
               CASE WHEN rg.slo_name LIKE '%SQLG4%' THEN 'Gen4'
                    WHEN rg.slo_name LIKE '%SQLGZ%' THEN 'Gen4'
                    WHEN rg.slo_name LIKE '%SQLG5%' THEN 'Gen5'
                    WHEN rg.slo_name LIKE '%SQLG6%' THEN 'Gen5'
               END AS dtu_hardware_gen,
               s.scheduler_count * CAST(rg.instance_cap_cpu/100. AS decimal(3,2)) AS dtu_logical_cpus,
               CAST((jo.process_memory_limit_mb / s.scheduler_count) / 1024. AS decimal(4,2)) AS dtu_memory_per_core_gb
FROM sys.dm_user_db_resource_governance AS rg
CROSS JOIN (SELECT COUNT(1) AS scheduler_count FROM sys.dm_os_schedulers WHERE status = 'VISIBLE ONLINE') AS s
CROSS JOIN sys.dm_os_job_object AS jo
WHERE dtu_limit > 0
      AND
      DB_NAME() <> 'master'
)
SELECT dtu_logical_cpus,
       dtu_hardware_gen,
       dtu_memory_per_core_gb,
       CASE WHEN dtu_hardware_gen = 'Gen4' THEN dtu_logical_cpus
            WHEN dtu_hardware_gen = 'Gen5' THEN dtu_logical_cpus * 0.7
       END AS Gen4_vcores,
       7 AS Gen4_memory_per_core_gb,
       CASE WHEN dtu_hardware_gen = 'Gen4' THEN dtu_logical_cpus * 1.7
            WHEN dtu_hardware_gen = 'Gen5' THEN dtu_logical_cpus
       END AS Gen5_vcores,
       5.05 AS Gen5_memory_per_core_gb,
       CASE WHEN dtu_hardware_gen = 'Gen4' THEN dtu_logical_cpus
            WHEN dtu_hardware_gen = 'Gen5' THEN dtu_logical_cpus * 0.8
       END AS Fsv2_vcores,
       1.89 AS Fsv2_memory_per_core_gb,
       CASE WHEN dtu_hardware_gen = 'Gen4' THEN dtu_logical_cpus * 1.4
            WHEN dtu_hardware_gen = 'Gen5' THEN dtu_logical_cpus * 0.9
       END AS M_vcores,
       29.4 AS M_memory_per_core_gb
FROM dtu_vcore_map;
```

### Additional factors

Besides the number of vCores (logical CPUs) and the hardware generation, several other factors may influence the choice of vCore service objective:

- The mapping T-SQL query matches DTU and vCore service objectives in terms of their CPU capacity, therefore the results will be more accurate for CPU-bound workloads.
- For the same hardware generation and the same number of vCores, IOPS and transaction log throughput resource limits for vCore databases are often higher than for DTU databases. For IO-bound workloads, it may be possible to lower the number of vCores in the vCore model to achieve the same level of performance. Resource limits for DTU and vCore databases in absolute values are exposed in the [sys.dm_user_db_resource_governance](https://docs.microsoft.com/sql/relational-databases/system-dynamic-management-views/sys-dm-user-db-resource-governor-azure-sql-database) view. Comparing these values between the DTU database to be migrated and a vCore database using an approximately matching service objective will help you select the vCore service objective more precisely.
- The mapping query also returns the amount of memory per core for the DTU database or elastic pool to be migrated, and for each hardware generation in the vCore model. Ensuring similar or higher total memory after migration to vCore is important for workloads that require a large memory data cache to achieve sufficient performance, or workloads that require large memory grants for query processing. For such workloads, depending on actual performance, it may be necessary to increase the number of vCores to get sufficient total memory.
- The [historical resource utilization](https://docs.microsoft.com/sql/relational-databases/system-catalog-views/sys-resource-stats-azure-sql-database) of the DTU database should be considered when choosing the vCore service objective. DTU databases with consistently under-utilized CPU resources may need fewer vCores than the number returned by the mapping query. Conversely, DTU databases where consistently high CPU utilization causes inadequate workload performance may require more vCores than returned by the query.
- If migrating databases with intermittent or unpredictable usage patterns, consider the use of [Serverless](serverless-tier-overview.md) compute tier.
- In the vCore model, the supported maximum database size may differ depending on hardware generation. For large databases, check supported maximum sizes in the vCore model for [single databases](resource-limits-vcore-single-databases.md) and [elastic pools](resource-limits-vcore-elastic-pools.md).
- For elastic pools, the [DTU](resource-limits-dtu-elastic-pools.md) and [vCore](resource-limits-vcore-elastic-pools.md) models have differences in the maximum supported number of databases per pool. This should be considered when migrating elastic pools with many databases.
- Some hardware generations may not be available in every region. Check availability under [Hardware Generations](service-tiers-vcore.md#hardware-generations).

> [!IMPORTANT]
> The DTU to vCore sizing guidelines above are provided to help in the initial estimation of the target database service objective.
>
> The optimal configuration of the target database is workload-dependent. Thus, achieving the optimal price/performance ratio after migration may require leveraging the flexibility of the vCore model to adjust the number of vCores, the [hardware generation](service-tiers-vcore.md#hardware-generations), the [service](service-tiers-vcore.md#service-tiers) and [compute](service-tiers-vcore.md#compute-tiers) tiers, as well as tuning of other database configuration parameters, such as [maximum degree of parallelism](https://docs.microsoft.com/sql/relational-databases/query-processing-architecture-guide#parallel-query-processing).
> 

### DTU to vCore migration examples

> [!NOTE]
> The values in the examples below are for illustration purposes only. Actual values returned in described scenarios may be different.
> 

**Migrating a Standard S9 database**

The mapping query returns the following result (some columns not shown for brevity):

|dtu_logical_cpus|dtu_hardware_gen|dtu_memory_per_core_gb|Gen4_vcores|Gen4_memory_per_core_gb|Gen5_vcores|Gen5_memory_per_core_gb|
|----------------|----------------|----------------------|-----------|-----------------------|-----------|-----------------------|
|24.00|Gen5|5.40|16.800|7|24.000|5.05|

We see that the DTU database has 24 logical CPUs (vCores), with 5.4 GB of memory per vCore, and is using Gen5 hardware. The direct match to that is a General Purpose 24 vCore database on Gen5 hardware, i.e. the **GP_Gen5_24** vCore service objective.

**Migrating a Standard S0 database**

The mapping query returns the following result (some columns not shown for brevity):

|dtu_logical_cpus|dtu_hardware_gen|dtu_memory_per_core_gb|Gen4_vcores|Gen4_memory_per_core_gb|Gen5_vcores|Gen5_memory_per_core_gb|
|----------------|----------------|----------------------|-----------|-----------------------|-----------|-----------------------|
|0.25|Gen4|0.42|0.250|7|0.425|5.05|

We see that the DTU database has the equivalent of 0.25 logical CPUs (vCores), with 0.42 GB of memory per vCore, and is using Gen4 hardware. The smallest vCore service objectives in the Gen4 and Gen5 hardware generations, **GP_Gen4_1** and **GP_Gen5_2**, provide more compute resources than the Standard S0 database, so a direct match is not possible. Since Gen4 hardware is being [decommissioned](https://azure.microsoft.com/updates/gen-4-hardware-on-azure-sql-database-approaching-end-of-life-in-2020/), the **GP_Gen5_2** option is preferred. Additionally, if the workload is well-suited for the [Serverless](serverless-tier-overview.md) compute tier, then **GP_S_Gen5_1** would be a closer match.

**Migrating a Premium P15 database**

The mapping query returns the following result (some columns not shown for brevity):

|dtu_logical_cpus|dtu_hardware_gen|dtu_memory_per_core_gb|Gen4_vcores|Gen4_memory_per_core_gb|Gen5_vcores|Gen5_memory_per_core_gb|
|----------------|----------------|----------------------|-----------|-----------------------|-----------|-----------------------|
|42.00|Gen5|4.86|29.400|7|42.000|5.05|

We see that the DTU database has 42 logical CPUs (vCores), with 4.86 GB of memory per vCore, and is using Gen5 hardware. While there is not a vCore service objective with 42 cores, the **BC_Gen5_40** service objective is very close both in terms of CPU and memory capacity, and is a good match.

**Migrating a Basic 200 eDTU elastic pool**

The mapping query returns the following result (some columns not shown for brevity):

|dtu_logical_cpus|dtu_hardware_gen|dtu_memory_per_core_gb|Gen4_vcores|Gen4_memory_per_core_gb|Gen5_vcores|Gen5_memory_per_core_gb|
|----------------|----------------|----------------------|-----------|-----------------------|-----------|-----------------------|
|4.00|Gen5|5.40|2.800|7|4.000|5.05|

We see that the DTU elastic pool has 4 logical CPUs (vCores), with 5.4 GB of memory per vCore, and is using Gen5 hardware. The direct match in the vCore model is a **GP_Gen5_4** elastic pool. However, this service objective supports a maximum of 200 databases per pool, while the Basic 200 eDTU elastic pool supports up to 500 databases. If the elastic pool to be migrated has more than 200 databases, the matching vCore service objective would have to be **GP_Gen5_6**, which supports up to 500 databases.

## Migrate geo-replicated databases

Migrating from the DTU-based model to the vCore-based purchasing model is similar to upgrading or downgrading the geo-replication relationships between databases in the standard and premium service tiers. During migration, you don't have to stop geo-replication, but you must follow these sequencing rules:

- When upgrading, you must upgrade the secondary database first, and then upgrade the primary.
- When downgrading, reverse the order: you must downgrade the primary database first, and then downgrade the secondary.

When you're using geo-replication between two elastic pools, we recommend that you designate one pool as the primary and the other as the secondary. In that case, when you're migrating elastic pools you should use the same sequencing guidance. However, if you have elastic pools that contain both primary and secondary databases, treat the pool with the higher utilization as the primary and follow the sequencing rules accordingly.  

The following table provides guidance for specific migration scenarios:

|Current service tier|Target service tier|Migration type|User actions|
|---|---|---|---|
|Standard|General purpose|Lateral|Can migrate in any order, but need to ensure appropriate vCore sizing as described above|
|Premium|Business critical|Lateral|Can migrate in any order, but need to ensure appropriate vCore sizing as described above|
|Standard|Business critical|Upgrade|Must migrate secondary first|
|Business critical|Standard|Downgrade|Must migrate primary first|
|Premium|General purpose|Downgrade|Must migrate primary first|
|General purpose|Premium|Upgrade|Must migrate secondary first|
|Business critical|General purpose|Downgrade|Must migrate primary first|
|General purpose|Business critical|Upgrade|Must migrate secondary first|
||||

## Migrate failover groups

Migration of failover groups with multiple databases requires individual migration of the primary and secondary databases. During that process, the same considerations and sequencing rules apply. After the databases are converted to the vCore-based purchasing model, the failover group will remain in effect with the same policy settings.

### Create a geo-replication secondary database

You can create a geo-replication secondary database (a geo-secondary) only by using the same service tier as you used for the primary database. For databases with a high log-generation rate, we recommend creating the geo-secondary with the same compute size as the primary.

If you're creating a geo-secondary in the elastic pool for a single primary database, make sure the `maxVCore` setting for the pool matches the primary database's compute size. If you're creating a geo-secondary for a primary in another elastic pool, we recommend that the pools have the same `maxVCore` settings.

## Use database copy to migrate from DTU to vCore

You can copy any database with a DTU-based compute size to a database with a vCore-based compute size without restrictions or special sequencing as long as the target compute size supports the maximum database size of the source database. The database copy creates a snapshot of the data as of the starting time of the copy operation and doesn't synchronize data between the source and the target.

## Next steps

- For the specific compute sizes and storage size choices available for single databases, see [SQL Database vCore-based resource limits for single databases](resource-limits-vcore-single-databases.md).
- For the specific compute sizes and storage size choices available for elastic pools, see [SQL Database vCore-based resource limits for elastic pools](resource-limits-vcore-elastic-pools.md).

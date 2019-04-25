---
title: Azure SQL Database serverless (preview) | Microsoft Docs
description: This article describes the new serverless compute tier and compares it with the existing provisioned compute tier
services: sql-database
ms.service: sql-database
ms.subservice: service
ms.custom: 
ms.devlang: 
ms.topic: conceptual
author: oslake
ms.author: moslake
ms.reviewer: sstein, carlrab
manager: craigg
ms.date: 05/07/2019
---
# SQL Database serverless (preview)

## What is the serverless compute tier

SQL Database serverless (preview) is a compute tier that bills for the amount of compute used by a single database on a per second basis. Serverless is price-perf optimized for single databases with bursty usage patterns that can afford some delay in compute warm-up after idle usage periods.
In contrast, publicly available offers in SQL Database today bill for the amount of compute provisioned on an hourly basis. This provisioned compute tier is price-perf optimized for single databases or elastic pools with higher average usage that cannot afford any delay in compute warm-up.

A database in the serverless computer tier is parameterized by the compute range it can use and an autopause delay.

![serverless billing](./media/sql-database-serverless/serverless-billing.png)

### Performance

- `MinVcore` and `MaxVcore` are configurable parameters that define the range of compute capacity available for the database. Memory and IO limits are proportional to the vCore range specified.  
- The autopause delay is a configurable parameter that defines the period of time the database must be inactive before it is automatically paused. The database is automatically resumed when the next login occurs.

### Pricing

- The total bill for a serverless database is the summation of the compute bill and storage bill.
Billing for compute is based on the amount of vCores used and memory used per second.
- The minimum compute billed is based on min vCores and min memory.
- While the database is paused, only storage is billed.

## Scenarios

Serverless is price-performance optimized for single databases with bursty usage patterns that can afford some delay in compute warm-up after idle usage periods. The provisioned compute tier is price-performance optimized for single or pooled databases with higher average usage that cannot afford any delay in compute warm-up.

The following table compares serverless compute tier with the provisioned compute tier:

||Serverless compute|Provisioned compute|
|---|---|---|
|**Typical usage scenario**|Databases with bursty, unpredictable usage interspersed with inactive periods|Databases or elastic pools with more regular usage|
|**Performance management effort**|Lower|Higher|
|**Compute scaling**|Automatic|Manual|
|**Compute responsiveness**|Lower after inactive periods|Immediate|
|**Billing granularity**|Per second|Per hour|
|

### Scenarios well-suited for serverless compute

- Single databases with bursty usage patterns interspersed with periods of inactivity can benefit from price savings based on billing per second for the amount of compute used.
- Single databases with resource demand that is difficult to predict and customers who prefer to delegate compute sizing to the service.
- Single databases in the provisioned compute tier that frequently change performance levels.

### Scenarios well-suited for provisioned compute

- Single databases with more regular and more substantial compute utilization over time.
- Databases that cannot tolerate performance trade-offs resulting from more frequent memory trimming or delay in autoresuming from a paused state.
- Multiple databases with bursty usage patterns that can be consolidated into a single server and use elastic pools for better price optimization.


## Purchasing model and service tier

SQL Database serverless is currently only supported in the General Purpose tier on Generation 5 hardware in the vcore purchasing model.

## Autoscaling

### Scaling responsiveness

In general, databases are run on a machine with sufficient capacity to satisfy resource demand without interruption for any amount of compute requested within limits set by the `maxVcores` value. Occasionally, load balancing automatically occurs if the machine is unable to satisfy resource demand within a few minutes. The database remains online during load balancing except for a brief period at the end of the operation when connections are dropped.

### Memory management

Memory for serverless databases is reclaimed more frequently than for provisioned databases. This behavior is important to control costs in serverless.

#### Cache reclaiming

Unlike provisioned compute, memory from the SQL cache is reclaimed from a serverless database when CPU or cache utilization is low. In both serverless and provisioned compute, cache entries can be evicted if all available memory is used.

- Cache utilization is considered low when the total size of the most recently used cache entries falls below a threshold for a period of time.
- When cache reclamation is triggered, the target cache size is reduced incrementally to a fraction of its previous size and reclaiming only continues if usage remains low.
- When cache reclamation occurs, the policy for selecting cache entries to evict is the same selection policy as for provisioned compute databases when memory pressure is high.
- The cache size is never reduced below the minimum memory as defined by minimum vCores.

#### Cache hydration

The SQL cache grows as data is fetched from disk in the same way and with the same speed as for provisioned databases. The cache is allowed to grow unconstrained up to the max memory limit when the database is busy.

## Autopause and autoresume

### Autopause

Autopause is triggered if all of the following conditions are true for the duration of the autopause delay:

- Number sessions = 0
- CPU = 0 (for user workload running in the user pool)

An option is provided to disable autopause if desired.

### Autoresume

Autoresume is triggered if any of the following conditions are true at any time:

|Feature|Autoresume trigger|
|---|---|
|Authentication and authorization|Login|
|Threat detection|Enabling/disabling threat detection settings at the database or server level<br>Modifying threat detection settings at the database or server level|
|Data discovery and classification|Adding, modifying, deleting, or viewing sensitivity labels|
|Auditing|Viewing auditing records.<br>Updating or viewing auditing policy|
|Data masking|Adding, modifying, deleting, or viewing data masking rules|
|Transparent data encryption|View state or status of transparent data encryption|
|Query (performance) data store|Modifying or viewing query store settings; automatic tuning|
|Autotuning|Application and verification of autotuning recommendations such as auto-indexing|
|Database copying|Create database as copy<br>Export to a BACPAC file|
|SQL data sync|Synchronization between hub and member databases that run on a configurable schedule or are performed manually|
|Modifying certain database metadata|Adding new database tags<br>Changing max vcores, min vcores, autopause delay|

### Latency

The latency to autopause or autoresume a serverless database is generally on the order of 1 minute.

### Feature support

The following features do not support autopausing and autoresuming. That is, if any of the following features are used, then the database remains online regardless of duration of database inactivity:

- Geo-replication (active geo-replication and auto failover groups)
- Long-term backup retention (LTR)
- The sync database used in SQL data sync.


## On-boarding into the serverless compute tier

Creating a new database or moving an existing database into a serverless compute tier follows the same pattern as creating a new database in provisioned compute tier and involves the following two steps:

1. Specify the service objective name. The following table shows the available service tier and compute sizes currently available in the public preview.

   |Service tier|Compute size|
   |---|---|
   |General Purpose|GP_S_Gen5_1|
   |General Purpose|GP_S_Gen5_2|
   |General Purpose|GP_S_Gen5_4|

2. Optionally, specify the minimum vCores and autopause delay to change their default values. The following table shows the available values for these parameters.

   |Parameter|Value choices|Default value|
   |---|---|---|---|
   |Minimum vCores|Any of {0.5, 1, 2, 4} not exceeding max vCores|0.5 vCores|
   |Autopause delay|Min: 360 minutes (6 hours)<br>Max: 10080 minutes (7 days)<br>Increments: 60 minutes<br>Disable autopause: -1|360 minutes|

### Create new database using the Azure portal

See [Quickstart: Create a single database in Azure SQL Database using the Azure portal](sql-database-single-database-get-started.md).

### Create new database using PowerShell

The following example creates a new database in the serverless compute tier defined by service objective named GP_S_Gen5_4 with default values for the min vCores and autopause delay.

```powershell
New-AzSqlDatabase `
  -ResourceGroupName $resourceGroupName `
  -ServerName $serverName `
  -DatabaseName $databaseName `
  -ComputeModel Serverless `
  -Edition GeneralPurpose `
  -ComputeGeneration Gen5 `
  -MinVcore 0.5 `
  -MaxVcore 4 `
  -AutoPauseDelay 720
```

### Move existing database into the serverless compute tier

The following example moves an existing single database from the provisioned compute tier into the serverless compute tier. This example uses the default values for the min vCores, max vCores, and autopause delay.

```powershell
Set-AzSqlDatabase
  -ResourceGroupName $resourceGroupName `
  -ServerName $serverName `
  -DatabaseName $databaseName `
  -Edition GeneralPurpose `
  -ComputeModel Serverless `
  -ComputeGeneration Gen5 `
  -MinVcore 1 `
  -MaxVcore 4 `
  -AutoPauseDelay 1440
```

### Move a database out of the serverless compute tier

A serverless database can be moved into a provisioned compute tier in the same way as moving a provisioned compute database into a serverless compute tier.

## Modify serverless configuration parameters

### Maximum vCores

Modifying the maximum vCores is performed by using the [Set-AzSqlDatabase](https://docs.microsoft.com/powershell/module/az.sql/set-azsqldatabase) command in PowerShell using the `MaxVcore` argument.

### Minimum vCores

Modifying the maximum vCores is performed by using the [Set-AzSqlDatabase](https://docs.microsoft.com/powershell/module/az.sql/set-azsqldatabase) command in PowerShell using the `MinVcore` argument.

### Autopause delay

Modifying the maximum vCores is performed by using the [Set-AzSqlDatabase](https://docs.microsoft.com/powershell/module/az.sql/set-azsqldatabase) command in PowerShell using the `AutoPauseDelay` argument.

## Monitor serverless database

### Resources used and billed

The resources of a serverless database are encapsulated by the following entities:

#### App package

The app package is the outer most resource management boundary for a database, regardless of whether the database is in a serverless or provisioned compute tier. The app package contains the SQL instance and external services that together scope all user and system resources used by a database in SQL Database. Examples of external services include R and full-text search. The SQL instance generally dominates the overall resource utilization across the app package.

#### User resource pool

The user resource pool is the inner most resource management boundary for a database, regardless of whether the database is in a serverless or provisioned compute tier. The user resource pool scopes CPU and IO for user workload generated by DDL queries (for example, CREATE, ALTER, etc.) and DML queries (for example, SELECT, INSERT, UPDATE, DELETE, etc.). These queries generally represent the most substantial proportion of utilization within the app package.

### Metrics

|Entity|Metric|Description|Units|
|---|---|---|---|
|App package|app_cpu_percent|Percentage of vCores used by the app relative to max vCores allowed for the app.|Percentage|
|App package|app_cpu_billed|The amount of compute billed for the app during the reporting period. The amount paid during this period is the product of this metric and the vCore unit price.<br>Values of this metric are determined by aggregating over time the maximum of CPU used and memory used each second.<br>If the amount used is less than the minimum amount provisioned as set by the min vCores and min memory, then the minimum amount provisioned is billed.  In order to compare CPU with memory for billing purposes, memory is normalized into units of vCores by rescaling the amount of memory in GB by 3 GB per vCore.|vCore seconds|
|App package|app_memory_percent|Percentage of memory used by the app relative to max memory allowed for the app.|Percentage|
|User pool|cpu_percent|Percentage of vCores used by user workload relative to max vCores allowed for user workload.|Percentage|
|User pool|data_IO_percent|Percentage of data IOPS used by user workload relative to max data IOPS allowed for user workload.|Percentage|
|User pool|log_IO_percent|Percentage of log MB/s used by user workload relative to max log MB/s allowed for user workload.|Percentage|
|User pool|workers_percent|Percentage of workers used by user workload relative to max workers allowed for user workload.|Percentage|
|User pool|sessions_percent|Percentage of sessions used by user workload relative to max sessions allowed for user workload.|Percentage|
____

> [!NOTE]
> Metrics in the Azure portal are available in the database pane for a single database under **Monitoring**.

### Pause and resume status

In the Azure portal, the database status is displayed in the overview pane of the server that lists the databases it contains. The database status is also displayed in the overview pane for the database.

Using the following PowerShell command to query the pause and resume status of a database:

```powershell
Get-AzSqlDatabase `
  -ResourceGroupName $resourcegroupname `
  -ServerName $servername `
  -DatabaseName $databasename `
  | Select -ExpandProperty "Status"
```

## Resource limits

For resource limits, see [Serverless compute tier](sql-database-vCore-resource-limits-single-databases.md#serverless-compute-tier)

## Billing

The amount of compute billed each second is the maximum of CPU used and memory used each second. If the amount of CPU used and memory used is less than the minimum amount provisioned for each, then the provisioned amount is billed. In order to compare CPU with memory for billing purposes, memory is normalized into units of vCores by rescaling the amount of memory in GB by 3 GB per vCore.

- **Resource billed**: CPU and memory
- **Amount billed ($)**: vCore unit price * max (min vCores, vCores used, min memory GB * 1/3, memory GB used * 1/3) 
- **Billing frequency**: Per second

The amount of compute billed is exposed by the following metric:

- **Metric**: app_cpu_billed (vCore seconds)
- **Definition**: max (min vCores, vCores used, min memory GB * 1/3, memory GB used * 1/3)*
- **Reporting frequency**: Per minute

> [!NOTE]
> \* This quantity is calculated each second and aggregated over 1 minute.

**Example**: Consider a database using GP_S_Gen5_4 with the following usage over a one hour period:

|Time (hours:minutes)|app_cpu_billed (vCore seconds)|
|---|---|
|0:01|63|
|0:02|123|
|0:03|95|
|0:04|54|
|0:05|41|
|0:06 - 1:00|1255|
||Total: 1631|

Suppose the compute unit price is $0.2609/vCore/hour. Then the compute billed for this one hour period is determined using the following formula: **$0.2609/vCore/hour * 1631 vCore seconds * 1 hour/3600 seconds = $0.1232**

## Available regions

The serverless compute tier is available in all regions except the following regions: China East, China North, Germany Central, Germany Northeast, UK North, UK South, and West Central US

## Next steps

For resource limits, see [Serverless compute tier resource limits](sql-database-vCore-resource-limits-single-databases.md#serverless-compute-tier).
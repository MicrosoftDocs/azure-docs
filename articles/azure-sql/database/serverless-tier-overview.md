---
title: Serverless compute tier 
description: This article describes the new serverless compute tier and compares it with the existing provisioned compute tier for Azure SQL Database. 
services: sql-database
ms.service: sql-database
ms.subservice: service
ms.custom: test sqldbrb=1
ms.devlang: 
ms.topic: conceptual
author: oslake
ms.author: moslake
ms.reviewer: sstein, carlrab
ms.date: 6/26/2020
---
# Azure SQL Database serverless
[!INCLUDE[appliesto-sqldb](../includes/appliesto-sqldb.md)]

Serverless is a compute tier for single Azure SQL Databases that automatically scales compute based on workload demand and bills for the amount of compute used per second. The serverless compute tier also automatically pauses databases during inactive periods when only storage is billed and automatically resumes databases when activity returns.

## Serverless compute tier

The serverless compute tier for single databases in Azure SQL Database is parameterized by a compute autoscaling range and an autopause delay. The configuration of these parameters shapes the database performance experience and compute cost.

![serverless billing](./media/serverless-tier-overview/serverless-billing.png)

### Performance configuration

- The **minimum vCores** and **maximum vCores** are configurable parameters that define the range of compute capacity available for the database. Memory and IO limits are proportional to the vCore range specified.  
- The **autopause delay** is a configurable parameter that defines the period of time the database must be inactive before it is automatically paused. The database is automatically resumed when the next login or other activity occurs.  Alternatively, autopausing can be disabled.

### Cost

- The cost for a serverless database is the summation of the compute cost and storage cost.
- When compute usage is between the min and max limits configured, the compute cost is based on vCore and memory used.
- When compute usage is below the min limits configured, the compute cost is based on the min vCores and min memory configured.
- When the database is paused, the compute cost is zero and only storage costs are incurred.
- The storage cost is determined in the same way as in the provisioned compute tier.

For more cost details, see [Billing](serverless-tier-overview.md#billing).

## Scenarios

Serverless is price-performance optimized for single databases with intermittent, unpredictable usage patterns that can afford some delay in compute warm-up after idle usage periods. In contrast, the provisioned compute tier is price-performance optimized for single databases or multiple databases in elastic pools with higher average usage that cannot afford any delay in compute warm-up.

### Scenarios well-suited for serverless compute

- Single databases with intermittent, unpredictable usage patterns interspersed with periods of inactivity and lower average compute utilization over time.
- Single databases in the provisioned compute tier that are frequently rescaled and customers who prefer to delegate compute rescaling to the service.
- New single databases without usage history where compute sizing is difficult or not possible to estimate prior to deployment in SQL Database.

### Scenarios well-suited for provisioned compute

- Single databases with more regular, predictable usage patterns and higher average compute utilization over time.
- Databases that cannot tolerate performance trade-offs resulting from more frequent memory trimming or delay in autoresuming from a paused state.
- Multiple databases with intermittent, unpredictable usage patterns that can be consolidated into elastic pools for better price-performance optimization.

## Comparison with provisioned compute tier

The following table summarizes distinctions between the serverless compute tier and the provisioned compute tier:

| | **Serverless compute** | **Provisioned compute** |
|:---|:---|:---|
|**Database usage pattern**| Intermittent, unpredictable usage with lower average compute utilization over time. | More regular usage patterns with higher average compute utilization over time, or multiple databases using elastic pools.|
| **Performance management effort** |Lower|Higher|
|**Compute scaling**|Automatic|Manual|
|**Compute responsiveness**|Lower after inactive periods|Immediate|
|**Billing granularity**|Per second|Per hour|

## Purchasing model and service tier

SQL Database serverless is currently only supported in the General Purpose tier on Generation 5 hardware in the vCore purchasing model.

## Autoscaling

### Scaling responsiveness

In general, serverless databases are run on a machine with sufficient capacity to satisfy resource demand without interruption for any amount of compute requested within limits set by the max vCores value. Occasionally, load balancing automatically occurs if the machine is unable to satisfy resource demand within a few minutes. For example, if the resource demand is 4 vCores, but only 2 vCores are available, then it may take up to a few minutes to load balance before 4 vCores are provided. The database remains online during load balancing except for a brief period at the end of the operation when connections are dropped.

### Memory management

Memory for serverless databases is reclaimed more frequently than for provisioned compute databases. This behavior is important to control costs in serverless and can impact performance.

#### Cache reclamation

Unlike provisioned compute databases, memory from the SQL cache is reclaimed from a serverless database when CPU or cache utilization is low.

- Cache utilization is considered low when the total size of the most recently used cache entries falls below a threshold for a period of time.
- When cache reclamation is triggered, the target cache size is reduced incrementally to a fraction of its previous size and reclaiming only continues if usage remains low.
- When cache reclamation occurs, the policy for selecting cache entries to evict is the same selection policy as for provisioned compute databases when memory pressure is high.
- The cache size is never reduced below the min memory limit as defined by min vCores which can be configured.

In both serverless and provisioned compute databases, cache entries may be evicted if all available memory is used.

#### Cache hydration

The SQL cache grows as data is fetched from disk in the same way and with the same speed as for provisioned databases. When the database is busy, the cache is allowed to grow unconstrained up to the max memory limit.

## Autopausing and autoresuming

### Autopausing

Autopausing is triggered if all of the following conditions are true for the duration of the autopause delay:

- Number sessions = 0
- CPU = 0 for user workload running in the user pool

An option is provided to disable autopausing if desired.

The following features do not support autopausing.  That is, if any of the following features are used, then the database remains online regardless of the duration of database inactivity:

- Geo-replication (active geo-replication and auto-failover groups).
- Long-term backup retention (LTR).
- The sync database used in SQL data sync.  Unlike sync databases, hub and member databases support autopausing.
- The job database used in elastic jobs.

Autopausing is temporarily prevented during the deployment of some service updates which require the database be online.  In such cases, autopausing becomes allowed again once the service update completes.

### Autoresuming

Autoresuming is triggered if any of the following conditions are true at any time:

|Feature|Autoresume trigger|
|---|---|
|Authentication and authorization|Login|
|Threat detection|Enabling/disabling threat detection settings at the database or server level.<br>Modifying threat detection settings at the database or server level.|
|Data discovery and classification|Adding, modifying, deleting, or viewing sensitivity labels|
|Auditing|Viewing auditing records.<br>Updating or viewing auditing policy.|
|Data masking|Adding, modifying, deleting, or viewing data masking rules|
|Transparent data encryption|View state or status of transparent data encryption|
|Vulnerability assessment|Ad hoc scans and periodic scans if enabled|
|Query (performance) data store|Modifying or viewing query store settings|
|Autotuning|Application and verification of autotuning recommendations such as auto-indexing|
|Database copying|Create database as copy.<br>Export to a BACPAC file.|
|SQL data sync|Synchronization between hub and member databases that run on a configurable schedule or are performed manually|
|Modifying certain database metadata|Adding new database tags.<br>Changing max vCores, min vCores, or autopause delay.|
|SQL Server Management Studio (SSMS)|Using SSMS versions earlier than 18.1 and opening a new query window for any database in the server will resume any auto-paused database in the same server. This behavior does not occur if using SSMS version 18.1 or later.|

Monitoring, management, or other solutions performing any of the operations listed above will trigger auto-resuming.

Autoresuming is also triggered during the deployment of some service updates which require the database be online.

### Connectivity

If a serverless database is paused, then the first login will resume the database and return an error stating that the database is unavailable with error code 40613. Once the database is resumed, the login must be retried to establish connectivity. Database clients with connection retry logic should not need to be modified.

### Latency

The latency to autoresume and autopause a serverless database is generally order of 1 minute to autoresume and 1-10 minutes to autopause.

### Customer managed transparent data encryption (BYOK)

If using [customer managed transparent data encryption](transparent-data-encryption-byok-overview.md) (BYOK) and the serverless database is auto-paused when key deletion or revocation occurs, then the database remains in the auto-paused state.  In this case, after the database is next resumed, the database becomes inaccessible within approximately 10 minutes.  Once the database becomes inaccessible, the recovery process is the same as for provisioned compute databases.  If the serverless database is online when key deletion or revocation occurs, then the database also becomes inaccessible within approximately 10 minutes in the same way as with provisioned compute databases.

## Onboarding into serverless compute tier

Creating a new database or moving an existing database into a serverless compute tier follows the same pattern as creating a new database in provisioned compute tier and involves the following two steps.

1. Specify the service objective. The service objective prescribes the service tier, hardware generation, and max vCores. For service objective options, see [serverless resource limits](resource-limits-vcore-single-databases.md#general-purpose---serverless-compute---gen5)


2. Optionally, specify the min vCores and autopause delay to change their default values. The following table shows the available values for these parameters.

   |Parameter|Value choices|Default value|
   |---|---|---|---|
   |Min vCores|Depends on max vCores configured - see [resource limits](resource-limits-vcore-single-databases.md#general-purpose---serverless-compute---gen5).|0.5 vCores|
   |Autopause delay|Minimum: 60 minutes (1 hour)<br>Maximum: 10080 minutes (7 days)<br>Increments: 10 minutes<br>Disable autopause: -1|60 minutes|


### Create a new database in the serverless compute tier

The following examples create a new database in the serverless compute tier.

#### Use the Azure portal

See [Quickstart: Create a single database in Azure SQL Database using the Azure portal](single-database-create-quickstart.md).


#### Use PowerShell

```powershell
New-AzSqlDatabase -ResourceGroupName $resourceGroupName -ServerName $serverName -DatabaseName $databaseName `
  -ComputeModel Serverless -Edition GeneralPurpose -ComputeGeneration Gen5 `
  -MinVcore 0.5 -MaxVcore 2 -AutoPauseDelayInMinutes 720
```
#### Use the Azure CLI

```azurecli
az sql db create -g $resourceGroupName -s $serverName -n $databaseName `
  -e GeneralPurpose -f Gen5 -min-capacity 0.5 -c 2 --compute-model Serverless --auto-pause-delay 720
```


#### Use Transact-SQL (T-SQL)

When using T-SQL, default values are applied for the min vcores and autopause delay.

```sql
CREATE DATABASE testdb
( EDITION = 'GeneralPurpose', SERVICE_OBJECTIVE = 'GP_S_Gen5_1' ) ;
```

For details, see [CREATE DATABASE](/sql/t-sql/statements/create-database-transact-sql?view=azuresqldb-current).  

### Move a database from the provisioned compute tier into the serverless compute tier

The following examples move a database from the provisioned compute tier into the serverless compute tier.

#### Use PowerShell


```powershell
Set-AzSqlDatabase -ResourceGroupName $resourceGroupName -ServerName $serverName -DatabaseName $databaseName `
  -Edition GeneralPurpose -ComputeModel Serverless -ComputeGeneration Gen5 `
  -MinVcore 1 -MaxVcore 4 -AutoPauseDelayInMinutes 1440
```

#### Use the Azure CLI

```azurecli
az sql db update -g $resourceGroupName -s $serverName -n $databaseName `
  --edition GeneralPurpose --min-capacity 1 --capacity 4 --family Gen5 --compute-model Serverless --auto-pause-delay 1440
```


#### Use Transact-SQL (T-SQL)

When using T-SQL, default values are applied for the min vcores and autopause delay.

```sql
ALTER DATABASE testdb 
MODIFY ( SERVICE_OBJECTIVE = 'GP_S_Gen5_1') ;
```

For details, see [ALTER DATABASE](/sql/t-sql/statements/alter-database-transact-sql?view=azuresqldb-current).

### Move a database from the serverless compute tier into the provisioned compute tier

A serverless database can be moved into a provisioned compute tier in the same way as moving a provisioned compute database into a serverless compute tier.

## Modifying serverless configuration

### Use PowerShell

Modifying the maximum or minimum vCores, and autopause delay, is performed by using the [Set-AzSqlDatabase](/powershell/module/az.sql/set-azsqldatabase) command in PowerShell using the `MaxVcore`, `MinVcore`, and `AutoPauseDelayInMinutes` arguments.

### Use the Azure CLI

Modifying the maximum or minimum vCores, and autopause delay, is performed by using the [az sql db update](/cli/azure/sql/db#az-sql-db-update) command in Azure CLI using the `capacity`, `min-capacity`, and `auto-pause-delay` arguments.


## Monitoring

### Resources used and billed

The resources of a serverless database are encapsulated by app package, SQL instance, and user resource pool entities.

#### App package

The app package is the outer most resource management boundary for a database, regardless of whether the database is in a serverless or provisioned compute tier. The app package contains the SQL instance and external services that together scope all user and system resources used by a database in SQL Database. Examples of external services include R and full-text search. The SQL instance generally dominates the overall resource utilization across the app package.

#### User resource pool

The user resource pool is the inner most resource management boundary for a database, regardless of whether the database is in a serverless or provisioned compute tier. The user resource pool scopes CPU and IO for user workload generated by DDL queries such as CREATE and ALTER and DML queries such as SELECT, INSERT, UPDATE, and DELETE. These queries generally represent the most substantial proportion of utilization within the app package.

### Metrics

Metrics for monitoring the resource usage of the app package and user pool of a serverless database are listed in the following table:

|Entity|Metric|Description|Units|
|---|---|---|---|
|App package|app_cpu_percent|Percentage of vCores used by the app relative to max vCores allowed for the app.|Percentage|
|App package|app_cpu_billed|The amount of compute billed for the app during the reporting period. The amount paid during this period is the product of this metric and the vCore unit price. <br><br>Values of this metric are determined by aggregating over time the maximum of CPU used and memory used each second. If the amount used is less than the minimum amount provisioned as set by the min vCores and min memory, then the minimum amount provisioned is billed. In order to compare CPU with memory for billing purposes, memory is normalized into units of vCores by rescaling the amount of memory in GB by 3 GB per vCore.|vCore seconds|
|App package|app_memory_percent|Percentage of memory used by the app relative to max memory allowed for the app.|Percentage|
|User pool|cpu_percent|Percentage of vCores used by user workload relative to max vCores allowed for user workload.|Percentage|
|User pool|data_IO_percent|Percentage of data IOPS used by user workload relative to max data IOPS allowed for user workload.|Percentage|
|User pool|log_IO_percent|Percentage of log MB/s used by user workload relative to max log MB/s allowed for user workload.|Percentage|
|User pool|workers_percent|Percentage of workers used by user workload relative to max workers allowed for user workload.|Percentage|
|User pool|sessions_percent|Percentage of sessions used by user workload relative to max sessions allowed for user workload.|Percentage|

### Pause and resume status

In the Azure portal, the database status is displayed in the overview pane of the server that lists the databases it contains. The database status is also displayed in the overview pane for the database.

Using the following commands to query the pause and resume status of a database:

#### Use PowerShell

```powershell
Get-AzSqlDatabase -ResourceGroupName $resourcegroupname -ServerName $servername -DatabaseName $databasename `
  | Select -ExpandProperty "Status"
```

#### Use the Azure CLI

```azurecli
az sql db show --name $databasename --resource-group $resourcegroupname --server $servername --query 'status' -o json
```


## Resource limits

For resource limits, see [serverless compute tier](resource-limits-vcore-single-databases.md#general-purpose---serverless-compute---gen5).

## Billing

The amount of compute billed is the maximum of CPU used and memory used each second. If the amount of CPU used and memory used is less than the minimum amount provisioned for each, then the provisioned amount is billed. In order to compare CPU with memory for billing purposes, memory is normalized into units of vCores by rescaling the amount of memory in GB by 3 GB per vCore.

- **Resource billed**: CPU and memory
- **Amount billed**: vCore unit price * max (min vCores, vCores used, min memory GB * 1/3, memory GB used * 1/3) 
- **Billing frequency**: Per second

The vCore unit price is the cost per vCore per second. Refer to the [Azure SQL Database pricing page](https://azure.microsoft.com/pricing/details/sql-database/single/) for specific unit prices in a given region.

The amount of compute billed is exposed by the following metric:

- **Metric**: app_cpu_billed (vCore seconds)
- **Definition**: max (min vCores, vCores used, min memory GB * 1/3, memory GB used * 1/3)
- **Reporting frequency**: Per minute

This quantity is calculated each second and aggregated over 1 minute.

Consider a serverless database configured with 1 min vCore and 4 max vCores.  This corresponds to around 3 GB min memory and 12-GB max memory.  Suppose the auto-pause delay is set to 6 hours and the database workload is active during the first 2 hours of a 24-hour period and otherwise inactive.    

In this case, the database is billed for compute and storage during the first 8 hours.  Even though the database is inactive starting after the second hour, it is still billed for compute in the subsequent 6 hours based on the minimum compute provisioned while the database is online.  Only storage is billed during the remainder of the 24-hour period while the database is paused.

More precisely, the compute bill in this example is calculated as follows:

|Time Interval|vCores used each second|GB used each second|Compute dimension billed|vCore seconds billed over time interval|
|---|---|---|---|---|
|0:00-1:00|4|9|vCores used|4 vCores * 3600 seconds = 14400 vCore seconds|
|1:00-2:00|1|12|Memory used|12 GB * 1/3 * 3600 seconds = 14400 vCore seconds|
|2:00-8:00|0|0|Min memory provisioned|3 GB * 1/3 * 21600 seconds = 21600 vCore seconds|
|8:00-24:00|0|0|No compute billed while paused|0 vCore seconds|
|Total vCore seconds billed over 24 hours||||50400 vCore seconds|

Suppose the compute unit price is $0.000145/vCore/second.  Then the compute billed for this 24-hour period is the product of the compute unit price and vCore seconds billed: $0.000145/vCore/second * 50400 vCore seconds ~ $7.31

### Azure Hybrid Benefit and reserved capacity

Azure Hybrid Benefit (AHB) and reserved capacity discounts do not apply to the serverless compute tier.

## Available regions

The serverless compute tier is available worldwide except the following regions: China East, China North, Germany Central, Germany Northeast, and US Gov Central (Iowa).

## Next steps

- To get started, see [Quickstart: Create a single database in Azure SQL Database using the Azure portal](single-database-create-quickstart.md).
- For resource limits, see [Serverless compute tier resource limits](resource-limits-vcore-single-databases.md#general-purpose---serverless-compute---gen5).

---
title: Azure SQL Database vCore-based resource limits | Microsoft Docs
description: This page describes some common vCore-based resource limits for Azure SQL Database.
services: sql-database
author: CarlRabeler
manager: craigg
ms.service: sql-database
ms.custom: DBs & servers
ms.topic: article
ms.date: 04/04/2018
ms.author: carlrab

---
# Azure SQL Database vCore-based purchasing model limits (preview)

> [!IMPORTANT]
> For DTU-based purchasing model limits, see [SQL Database DTU-based resource limits](sql-database-dtu-resource-limits.md).

## Single database: Storage sizes and performance levels

For single databases, the following tables show the resources available for a single database at each service tier and performance level. You can set the service tier, performance level, and storage amount for a single database using the [Azure portal](sql-database-single-database-resources.md#manage-single-database-resources-using-the-azure-portal), [Transact-SQL](sql-database-single-database-resources.md#manage-single-database-resources-using-transact-sql), [PowerShell](sql-database-single-database-resources.md#manage-single-database-resources-using-powershell), the [Azure CLI](sql-database-single-database-resources.md#manage-single-database-resources-using-the-azure-cli), or the [REST API](sql-database-single-database-resources.md#manage-single-database-resources-using-the-rest-api).

### General Purpose service tier
|Performance level|GP_Gen4_1|GP_Gen4_2|GP_Gen4_4|GP_Gen4_8|GP_Gen4_16|
|:--- | --: |--: |--: |--: |--: |
|H/W generation|4|4|4|4|4|
|vCores|1|2|4|8|16|
|Memory (GB)|7|14|28|56|112|
|Columnstore support|Yes|Yes|Yes|Yes|Yes|
|In-memory OLTP storage (GB)|N/A|N/A|N/A|N/A|N/A|
|Storage type|Premium (Remote) Storage|Premium (Remote) Storage|Premium (Remote) Storage|Premium (Remote) Storage|Premium (Remote) Storage|
|IO latency (approximate)|5-7 ms (write)<br>5-10 ms (read)|5-7 ms (write)<br>5-10 ms (read)|5-7 ms (write)<br>5-10 ms (read)|5-7 ms (write)<br>5-10 ms (read)|5-7 ms (write)<br>5-10 ms (read)|
|Max data size (GB)|1024|1024|1536|3072|4096|
|Max log size|307|307|461|922|1229|
|TempDB size(DB)|32|64|128|256|384|
|Target IOPS|320|640|1280|2560|5120|
|IO latency (approximate)|5-7 ms (write)
|Max concurrent workers (requests)|200|400|800|1600|3200|
|Max concurrent logins|200|400|800|1600|3200|
|Max allowed sessions|3000|3000|3000|3000|3000|
|Number of replicas|1|1|1|1|1|
|Multi-AZ|N/A|N/A|N/A|N/A|N/A|
|Read Scale-out|N/A|N/A|N/A|N/A|N/A|
|Included backup storage|1X DB size|1X DB size|1X DB size|1X DB size|1X DB size|
|||

### Business Critical service tier
|Performance level|BC_Gen4_1|BC_Gen4_2|BC_Gen4_4|BC_Gen4_8|BC_Gen4_16|
|:--- | --: |--: |--: |--: |--: |
|H/W generation|4|4|4|4|4|
|vCores|1|2|4|8|16|
|Memory (GB)|7|14|28|56|112|
|Columnstore support|Yes|Yes|Yes|Yes|Yes|
|In-memory OLTP storage (GB)|1|2|4|8|20|
|Storage type|Attached SSD|Attached SSD|Attached SSD|Attached SSD|Attached SSD|
|Max data size (GB)|1024|1024|1024|1024|1024|
|Max log size|307|307|307|307|307|
|TempDB size(DB)|32|64|128|256|384|
|Target IOPS|5000|10000|20000|40000|80000|
|IO latency (approximate)|1-2 ms (write)<br>1-2 ms (read)|1-2 ms (write)<br>1-2 ms (read)|1-2 ms (write)<br>1-2 ms (read)|1-2 ms (write)<br>1-2 ms (read)|1-2 ms (write)<br>1-2 ms (read)|
|Max concurrent workers (requests)|200|400|800|1600|3200|
|Max concurrent logins|200|400|800|1600|3200|
|Max allowed sessions|3000|3000|3000|3000|3000|
|Number of replicas|3|3|3|3|3|
|Multi-AZ|Yes|Yes|Yes|Yes|Yes|
|Read Scale-out|Yes|Yes|Yes|Yes|Yes|
|Included backup storage|1X DB size|1X DB size|1X DB size|1X DB size|1X DB size|
|||

## Single database: Change storage size

- Storage can be provisioned up to the max size limit using 1GB increments. The minimum configurable data storage is 5GB 
- Storage for a single database can be provisioned by increasing or decreasing its max size using the 
 [Azure portal](sql-database-single-database-resources.md#manage-single-database-resources-using-the-azure-portal), [Transact-SQL](/sql/t-sql/statements/alter-database-azure-sql-database#examples), [PowerShell](/powershell/module/azurerm.sql/set-azurermsqldatabase), the [Azure CLI](/cli/azure/sql/db#az_sql_db_update), or the [REST API](/rest/api/sql/databases/update).
- SQL Database automatically allocates 30% of additional storage for the log files and 32GB per vCore for TempDB, but not to exceed 384GB. TempDB is located on an attached SSD in all service tiers.
- The price of storage for a single database is the sum of data storage and log storage amounts multiplied by the storage unit price of the service tier. The cost of TempDB is included in the vCore price. For details on the price of extra storage, see [SQL Database pricing](https://azure.microsoft.com/pricing/details/sql-database/).

## Single database: Change vCores

After initially picking the number of vCores, you can scale a single database up or down dynamically based on actual experience using the [Azure portal](sql-database-single-database-resources.md#manage-single-database-resources-using-the-azure-portal), [Transact-SQL](/sql/t-sql/statements/alter-database-azure-sql-database#examples), [PowerShell](/powershell/module/azurerm.sql/set-azurermsqldatabase), the [Azure CLI](/cli/azure/sql/db#az_sql_db_update), or the [REST API](/rest/api/sql/databases/update). 

Changing the service tier and/or performance level of a database creates a replica of the original database at the new performance level, and then switches connections over to the replica. No data is lost during this process but during the brief moment when we switch over to the replica, connections to the database are disabled, so some transactions in flight may be rolled back. The length of time for the switch-over varies, but is generally under 4 seconds is less than 30 seconds 99% of the time. If there are large numbers of transactions in flight at the moment connections are disabled, the length of time for the switch-over may be longer. 

The duration of the entire scale-up process depends on both the size and service tier of the database before and after the change. For example, a 250-GB database that is changing to, from, or within a General Purpose service tier, should complete within six hours. For a database the same size that is changing performance levels within the Business Critical service tier, the scale-up should complete within three hours.

> [!TIP]
> To monitor in-progess operations, see: [Manage operations using the SQL REST API](/rest/api/sql/Operations/List), [Manage operations using CLI](/cli/azure/sql/db/op), [Monitor operations using T-SQL](/sql/relational-databases/system-dynamic-management-views/sys-dm-operation-status-azure-sql-database) and these two PowerShell commands: [Get-AzureRmSqlDatabaseActivity](/powershell/module/azurerm.sql/get-azurermsqldatabaseactivity) and [Stop-AzureRmSqlDatabaseActivity](/powershell/module/azurerm.sql/stop-azurermsqldatabaseactivity).

* If you are upgrading to a higher service tier or performance level, the database max size does not increase unless you explicitly specify a larger size (maxsize).
* To downgrade a database, the database used space must be smaller than the maximum allowed size of the target service tier and performance level. 
* When upgrading a database with [geo-replication](sql-database-geo-replication-portal.md) enabled, upgrade its secondary databases to the desired performance tier before upgrading the primary database (general guidance for best performance). When upgrading to a different, upgrading the secondary database first is required.
* When downgrading a database with [geo-replication](sql-database-geo-replication-portal.md) enabled, downgrade its primary databases to the desired performance tier before downgrading the secondary database (general guidance for best performance). When downgrading to a different edition, downgrading the primary database first is required.
* The new properties for the database are not applied until the changes are complete.

## Elastic pool: Storage sizes and performance levels

For SQL Database elastic pools, the following tables show the resources available at each service tier and performance level. You can set the service tier, performance level, and storage amount using the [Azure portal](sql-database-elastic-pool.md#manage-elastic-pools-and-databases-using-the-azure-portal), [PowerShell](sql-database-elastic-pool.md#manage-elastic-pools-and-databases-using-powershell), the [Azure CLI](sql-database-elastic-pool.md#manage-elastic-pools-and-databases-using-the-azure-cli), or the [REST API](sql-database-elastic-pool.md#manage-elastic-pools-and-databases-using-the-rest-api).

> [!NOTE]
> The resource limits of individual databases in elastic pools are generally the same as for single databases outside of pools that has the same performance level. For example, the max concurrent workers for an GP_Gen4_1 database is 200 workers. So, the max concurrent workers for a database in a GP_Gen4_1 pool is also 200 workers. Note, the total number of concurrent workers in GP_Gen4_1 pool is 210.

### General Purpose service tier
|Performance level|GP_Gen4_1|GP_Gen4_2|GP_Gen4_4|GP_Gen4_8|GP_Gen4_16|
|:--- | --: |--: |--: |--: |--: |
|H/W generation|4|4|4|4|4|
|vCores|1|2|4|8|16|
|Memory (GB)|7|14|28|56|112|
|Columnstore support|Yes|Yes|Yes|Yes|Yes|
|In-memory OLTP storage (GB)|N/A|N/A|N/A|N/A|N/A|
|Storage type|Premium (Remote) Storage|Premium (Remote) Storage|Premium (Remote) Storage|Premium (Remote) Storage|Premium (Remote) Storage|
|Max data size (GB)|512|756|1536|2048|3584|
|Max log size|154|227|461|614|1075|
|TempDB size(DB)|32|64|128|256|384|
|Target IOPS|320|640|1280|2560|5120|
|IO latency (approximate)|5-7 ms (write)<br>5-10 ms (read)|5-7 ms (write)<br>5-10 ms (read)|5-7 ms (write)<br>5-10 ms (read)|5-7 ms (write)<br>5-10 ms (read)|5-7 ms (write)<br>5-10 ms (read)|
|Max concurrent workers (requests)|210|420|840|1680|3360|
|Max concurrent logins|210|420|840|1680|3360|
|Max allowed sessions|3000|3000|3000|3000|3000|
|Max pool density|100|200|500|500|500|
|Min/max elastic pool click-stops|0, 0.25, 0.5, 1|0, 0.25, 0.5, 1, 2|0, 0.25, 0.5, 1, 2, 4|0, 0.25, 0.5, 1, 2, 4, 8|0, 0.25, 0.5, 1, 2, 4, 8, 16|
|Number of replicas|1|1|1|1|1|
|Multi-AZ|N/A|N/A|N/A|N/A|N/A|
|Read Scale-out|N/A|N/A|N/A|N/A|N/A|
|Included backup storage|1X DB size|1X DB size|1X DB size|1X DB size|1X DB size|
|||

### Business Critical service tier
|Performance level|GP_Gen4_1|GP_Gen4_2|GP_Gen4_4|GP_Gen4_8|GP_Gen4_16|
|:--- | --: |--: |--: |--: |--: |
|H/W generation|4|4|4|4|4|
|vCores|1|2|4|8|16|
|Memory (GB)|7|14|28|56|112|
|Columnstore support|Yes|Yes|Yes|Yes|Yes|
|In-memory OLTP storage (GB)|1|2|4|8|20|
|Storage type|Attached SSD|Attached SSD|Attached SSD|Attached SSD|Attached SSD|
|Max data size (GB)|1024|1024|1024|1024|1024|
|Max log size|307|307|307|461|614|
|TempDB size(DB)|32|64|128|256|384|
|Target IOPS|320|640|1280|2560|5120|
|IO latency (approximate)|1-2 ms (write)<br>1-2 ms (read)|1-2 ms (write)<br>1-2 ms (read)|1-2 ms (write)<br>1-2 ms (read)|1-2 ms (write)<br>1-2 ms (read)|1-2 ms (write)<br>1-2 ms (read)|
|Max concurrent workers (requests)|210|420|840|1680|3360|
|Max concurrent logins|210|420|840|1680|3360|
|Max allowed sessions|3000|3000|3000|3000|3000|
|Max pool density|N/A|50|100|100|100|
|Min/max elastic pool click-stops|0, 0.25, 0.5, 1|0, 0.25, 0.5, 1, 2|0, 0.25, 0.5, 1, 2, 4|0, 0.25, 0.5, 1, 2, 4, 8|0, 0.25, 0.5, 1, 2, 4, 8, 16|
|Multi-AZ|Yes|Yes|Yes|Yes|Yes|
|Read Scale-out|Yes|Yes|Yes|Yes|Yes|
|Included backup storage|1X DB size|1X DB size|1X DB size|1X DB size|1X DB size|
|||
If all vCores of an elastic pool are busy, then each database in the pool receives an equal amount of compute resources to process queries. The SQL Database service provides resource sharing fairness between databases by ensuring equal slices of compute time. Elastic pool resource sharing fairness is in addition to any amount of resource otherwise guaranteed to each database when the vCore min per database is set to a non-zero value.

### Database properties for pooled databases

The following table describes the properties for pooled databases.

| Property | Description |
|:--- |:--- |
| Max vCores per database |The maximum number of vCores that any database in the pool may use, if available based on utilization by other databases in the pool. Max vCores per database is not a resource guarantee for a database. This setting is a global setting that applies to all databases in the pool. Set max vCores per database high enough to handle peaks in database utilization. Some degree of overcommitting is expected since the pool generally assumes hot and cold usage patterns for databases where all databases are not simultaneously peaking.|
| Min vCores per database |The minimum number of vCores that any database in the pool is guaranteed. This setting is a global setting that applies to all databases in the pool. The min vCores per database may be set to 0, and is also the default value. This property is set to anywhere between 0 and the average vCores utilization per database. The product of the number of databases in the pool and the min vCores per database cannot exceed the vCores per pool.|
| Max storage per database |The maximum database size set by the user for a database in a pool. Pooled databases share allocated pool storage, so the size a database can reach is limited to the smaller of remaining pool storage and database size. Max database size refers to the maximum size of the data files and does not include the space used by log files. |
|||
 
## Elastic pool: Change storage size

- Storage can be provisioned up to the max size limit: 
 - For Standard storage, increase or decrease size in 10 GB increments
 - For Premium storage, increase or decrease size in 250 GB increments
- Storage for an elastic pool can be provisioned by increasing or decreasing its max size using the [Azure portal](sql-database-elastic-pool.md#manage-elastic-pools-and-databases-using-the-azure-portal), [PowerShell](/powershell/module/azurerm.sql/set-azurermsqlelasticpool), the [Azure CLI](/cli/azure/sql/elastic-pool#az_sql_elastic_pool_update), or the [REST API](/rest/api/sql/elasticpools/update).
- The price of storage for an elastic pool is the storage amount multiplied by the storage unit price of the service tier. For details on the price of extra storage, see [SQL Database pricing](https://azure.microsoft.com/pricing/details/sql-database/).

## Elastic pool: Change vCores

You can increase or decrease the performance level to an elastic pool based on resource needs using the [Azure portal](sql-database-elastic-pool.md#manage-elastic-pools-and-databases-using-the-azure-portal), [PowerShell](/powershell/module/azurerm.sql/set-azurermsqlelasticpool), the [Azure CLI](/cli/azure/sql/elastic-pool#az_sql_elastic_pool_update), or the [REST API](/rest/api/sql/elasticpools/update).

- When rescaling pool vCores, database connections are briefly dropped. This is the same behavior as occurs when rescaling DTUs for a single database (not in a pool). For details on the duration and impact of dropped connections for a database during rescaling operations, see [Rescaling DTUs for a single database](#single-database-change-storage-size). 
- The duration to rescale pool vCores can depend on the total amount of storage space used by all databases in the pool. In general, the rescaling latency averages 90 minutes or less per 100 GB. For example, if the total space used by all databases in the pool is 200 GB, then the expected latency for rescaling the pool is 3 hours or less. In some cases within the Standard or Basic tier, the rescaling latency can be under five minutes regardless of the amount of space used.
- In general, the duration to change the min vCores per database or max vCores per database is five minutes or less.
- When downsizing pool vCores, the pool used space must be smaller than the maximum allowed size of the target service tier and pool vCores.

## What is the maximum number of servers and databases?

| Maximum | Value |
| :--- | :--- |
| Databases per server | 5000 |
| Number of servers per subscription per region | 20 |
|||

> [!IMPORTANT]
> As the number of databases approaches the limit per server, the following can occur:
> <br> •	Increasing latency in running queries against the master database.  This includes views of resource utilization statistics such as sys.resource_stats.
> <br> •	Increasing latency in management operations and rendering portal viewpoints that involve enumerating databases in the server.

## What happens when database and elastic pool resource limits are reached?

### Compute (vCores)

When database compute utilization (measured by vCore utilization) becomes high, query latency increases and can even time out. Under these conditions, queries may be queued by the service and are provided resources for execution as resource become free.
When encountering high compute utilization, mitigation options include:

- Increasing the performance level of the database or elastic pool to provide the database with more vCores. See [Single database: change cVcores](#single-database-change-vcores) and [Elastic pool: change vCores](#elastic-pool-change-vcores).
- Optimizing queries to reduce the resource utilization of each query. For more information, see [Query Tuning/Hinting](sql-database-performance-guidance.md#query-tuning-and-hinting).

### Storage

When database space used reaches the max size limit, database inserts and updates that increase the data size fail and clients receive an [error message](sql-database-develop-error-messages.md). Database SELECTS and DELETES continue to succeed.

When encountering high space utilization, mitigation options include:

- Increasing the max size of the database or elastic pool, or change the performance level to increase the maximum storage. See [SQL Database vCore-based resource limits](sql-database-vcore-resource-limits.md).
- If the database is in an elastic pool, then alternatively the database can be moved outside of the pool so that its storage space is not shared with other databases.

### Sessions and workers (requests) 

The maximum number of sessions and workers are determined by the service tier and performance level. New requests are rejected when session or worker limits are reached, and clients receive an error message. While the number of connections available can be controlled by the application, the number of concurrent workers is often harder to estimate and control. This is especially true during peak load periods when database resource limits are reached and workers pile up due to longer running queries. 

When encountering high session or worker utilization, mitigation options include:
- Increasing the service tier or performance level of the database or elastic pool. See [Single database: change storage size](#single-database-change-storage-size), [Single database: change vCores](#single-database-change-vcores), [Elastic pool: change storage size](#elastic-pool-change-storage-size), and [Elastic pool: change vCores](#elastic-pool-change-vcores).
- Optimizing queries to reduce the resource utilization of each query if the cause of increased worker utilization is due to contention for compute resources. For more information, see [Query Tuning/Hinting](sql-database-performance-guidance.md#query-tuning-and-hinting).

## Next steps

- See [SQL Database FAQ](sql-database-faq.md) for answers to frequently asked questions.
- For information about general Azure limits, see [Azure subscription and service limits, quotas, and constraints](../azure-subscription-service-limits.md).

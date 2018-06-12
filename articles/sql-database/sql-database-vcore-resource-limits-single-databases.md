---
title: Azure SQL Database vCore-based resource limits - single database | Microsoft Docs
description: This page describes some common vCore-based resource limits for a single database in Azure SQL Database.
services: sql-database
author: CarlRabeler
manager: craigg
ms.service: sql-database
ms.custom: DBs & servers
ms.topic: conceptual
ms.date: 05/31/2018
ms.author: carlrab

---
# Azure SQL Database vCore-based purchasing model limits for a single database (preview)

> [!IMPORTANT]
> For DTU-based purchasing model limits, see [SQL Database DTU-based resource limits](sql-database-dtu-resource-limits.md).

## Single database: Storage sizes and performance levels

For single databases, the following tables show the resources available for a single database at each service tier and performance level. You can set the service tier, performance level, and storage amount for a single database using the [Azure portal](sql-database-single-database-scaling.md#manage-single-database-resources-using-the-azure-portal), [Transact-SQL](sql-database-single-database-scaling.md#manage-single-database-resources-using-transact-sql), [PowerShell](sql-database-single-database-scaling.md#manage-single-database-resources-using-powershell), the [Azure CLI](sql-database-single-database-scaling.md#manage-single-database-resources-using-the-azure-cli), or the [REST API](sql-database-single-database-scaling.md#manage-single-database-resources-using-the-rest-api).

### General Purpose service tier

#### Generation 4 compute platform
|Performance level|GP_Gen4_1|GP_Gen4_2|GP_Gen4_4|GP_Gen4_8|GP_Gen4_16|GP_Gen4_24
|:--- | --: |--: |--: |--: |--: |--: |
|H/W generation|4|4|4|4|4|4|
|vCores|1|2|4|8|16|24|
|Memory (GB)|7|14|28|56|112|168|
|Columnstore support|Yes|Yes|Yes|Yes|Yes|Yes|
|In-memory OLTP storage (GB)|N/A|N/A|N/A|N/A|N/A|N/A|
|Storage type|Premium (Remote) Storage|Premium (Remote) Storage|Premium (Remote) Storage|Premium (Remote) Storage|Premium (Remote) Storage|Premium (Remote) Storage|
|IO latency (approximate)|5-7 ms (write)<br>5-10 ms (read)|5-7 ms (write)<br>5-10 ms (read)|5-7 ms (write)<br>5-10 ms (read)|5-7 ms (write)<br>5-10 ms (read)|5-7 ms (write)<br>5-10 ms (read)|5-7 ms (write)<br>5-10 ms (read)|
|Max data size (GB)|1024|1024|1536|3072|4096|4096|
|Max log size|307|307|461|922|1229|1229|
|TempDB size(DB)|32|64|128|256|384|384|
|Target IOPS (64 KB)|500|1000|2000|4000|7000|7000|
|Max concurrent workers (requests)|200|400|800|1600|3200|4800|
|Max allowed sessions|30000|30000|30000|30000|30000|30000|
|Number of replicas|1|1|1|1|1|1|
|Multi-AZ|N/A|N/A|N/A|N/A|N/A|N/A|000
|Read Scale-out|N/A|N/A|N/A|N/A|N/A|N/A|
|Included backup storage|1X DB size|1X DB size|1X DB size|1X DB size|1X DB size|1X DB size|
|||

#### Generation 5 compute platform
|Performance level|GP_Gen5_2|GP_Gen5_4|GP_Gen5_8|GP_Gen5_16|GP_Gen5_24|GP_Gen5_32|GP_Gen5_40| GP_Gen5_80|
|:--- | --: |--: |--: |--: |---: | --: |--: |--: |--: |
|H/W generation|5|5|5|5|5|5|5|
|vCores|2|4|8|16|24|32|40|80|
|Memory (GB)|11|22|44|88|132|176|220|440|
|Columnstore support|Yes|Yes|Yes|Yes|Yes|Yes|Yes|Yes|
|In-memory OLTP storage (GB)|N/A|N/A|N/A|N/A|N/A|N/A|N/A|N/A|
|Storage type|Premium (Remote) Storage|Premium (Remote) Storage|Premium (Remote) Storage|Premium (Remote) Storage|Premium (Remote) Storage|Premium (Remote) Storage|Premium (Remote) Storage|Premium (Remote) Storage|
|IO latency (approximate)|5-7 ms (write)<br>5-10 ms (read)|5-7 ms (write)<br>5-10 ms (read)|5-7 ms (write)<br>5-10 ms (read)|5-7 ms (write)<br>5-10 ms (read)|5-7 ms (write)<br>5-10 ms (read)|5-7 ms (write)<br>5-10 ms (read)|5-7 ms (write)<br>5-10 ms (read)|5-7 ms (write)<br>5-10 ms (read)|
|Max data size (GB)|1024|1024|1536|3072|4096|4096|4096|4096|
|Max log size|307|307|461|614|1229|1229|1229|1229|
|TempDB size(DB)|64|128|256|384|384|384|384|384|
|Target IOPS (64 KB)|500|1000|2000|4000|6000|7000|7000|7000|
|Max concurrent workers (requests)|200|400|800|1600|2400|3200|4000|8000|
|Max allowed sessions|30000|30000|30000|30000|30000|30000|30000|30000|
|Number of replicas|1|1|1|1|1|1|1|1|
|Multi-AZ|N/A|N/A|N/A|N/A|N/A|N/A|N/A|N/A|
|Read Scale-out|N/A|N/A|N/A|N/A|N/A|N/A|N/A|N/A|
|Included backup storage|1X DB size|1X DB size|1X DB size|1X DB size|1X DB size|1X DB size|1X DB size|1X DB size|
|||

### Business Critical service tier

#### Generation 4 compute platform
|Performance level|BC_Gen4_1|BC_Gen4_2|BC_Gen4_4|BC_Gen4_8|BC_Gen4_16|BC_Gen4_24|
|:--- | --: |--: |--: |--: |--: |--: |
|H/W generation|4|4|4|4|4|4|
|vCores|1|2|4|8|16|24|
|Memory (GB)|7|14|28|56|112|168|
|Columnstore support|Yes|Yes|Yes|Yes|Yes|Yes|
|In-memory OLTP storage (GB)|1|2|4|8|20|36|
|Storage type|Local SSD|Local SSD|Local SSD|Local SSD|Local SSD|Local SSD|
|Max data size (GB)|1024|1024|1024|1024|1024|1024|
|Max log size|307|307|307|307|307|307|
|TempDB size(DB)|32|64|128|256|384|384|
|Target IOPS (64 KB)|5000|10000|20000|40000|80000|120000|
|IO latency (approximate)|1-2 ms (write)<br>1-2 ms (read)|1-2 ms (write)<br>1-2 ms (read)|1-2 ms (write)<br>1-2 ms (read)|1-2 ms (write)<br>1-2 ms (read)|1-2 ms (write)<br>1-2 ms (read)|1-2 ms (write)<br>1-2 ms (read)|
|Max concurrent workers (requests)|200|400|800|1600|3200|4800|
|Max allowed sessions|30000|30000|30000|30000|30000|30000|
|Number of replicas|3|3|3|3|3|3|
|Multi-AZ|N/A|N/A|N/A|N/A|N/A|N/A|
|Read Scale-out|Yes|Yes|Yes|Yes|Yes|Yes|
|Included backup storage|1X DB size|1X DB size|1X DB size|1X DB size|1X DB size|1X DB size|
|||

#### Generation 5 compute platform
|Performance level|BC_Gen5_2|BC_Gen5_4|BC_Gen5_8|BC_Gen5_16|BC_Gen5_24|BC_Gen5_32|BC_Gen5_40|BC_Gen5_80|
|:--- | --: |--: |--: |--: |---: | --: |--: |--: |--: |--: |--: |--: |--: |
|H/W generation|5|5|5|5|5|5|5|5|
|vCores|2|4|8|16|24|32|40|80|
|Memory (GB)|11|22|44|88|132|176|220|440|
|Columnstore support|Yes|Yes|Yes|Yes|Yes|Yes|Yes|Yes|
|In-memory OLTP storage (GB)|1.571|3.142|6.284|15.768|25.252|37.936|52.22|131.64|
|Storage type|Local SSD|Local SSD|Local SSD|Local SSD|Local SSD|Local SSD|Local SSD|Local SSD|
|IO latency (approximate)|1-2 ms (write)<br>1-2 ms (read)|1-2 ms (write)<br>1-2 ms (read)|1-2 ms (write)<br>1-2 ms (read)|1-2 ms (write)<br>1-2 ms (read)|1-2 ms (write)<br>1-2 ms (read)|1-2 ms (write)<br>1-2 ms (read)|1-2 ms (write)<br>1-2 ms (read)|1-2 ms (write)<br>1-2 ms (read)|
|Max data size (GB)|1024|1024|1024|1024|2048|4096|4096|4096|
|Max log size|307|307|307|307|614|1229|1229|1229|
|TempDB size(DB)|64|128|256|384|384|384|384|384|
|Target IOPS (64 KB)|5000|10000|20000|40000|60000|80000|100000|200000
|Max concurrent workers (requests)|200|400|800|1600|2400|3200|4000|8000|
|Max allowed sessions|30000|30000|30000|30000|30000|30000|30000|30000|
|Number of replicas|3|3|3|3|3|3|3|3|
|Multi-AZ|N/A|N/A|N/A|N/A|N/A|N/A|N/A|N/A|
|Read Scale-out|N/A|N/A|N/A|N/A|N/A|N/A|N/A|N/A|
|Included backup storage|1X DB size|1X DB size|1X DB size|1X DB size|1X DB size|1X DB size|1X DB size|1X DB size|
|||

## Single database: Change storage size

- Storage can be provisioned up to the max size limit using 1GB increments. The minimum configurable data storage is 5GB 
- Storage for a single database can be provisioned by increasing or decreasing its max size using the 
 [Azure portal](sql-database-single-database-scaling.md#manage-single-database-resources-using-the-azure-portal), [Transact-SQL](/sql/t-sql/statements/alter-database-azure-sql-database#examples), [PowerShell](/powershell/module/azurerm.sql/set-azurermsqldatabase), the [Azure CLI](/cli/azure/sql/db#az_sql_db_update), or the [REST API](/rest/api/sql/databases/update).
- SQL Database automatically allocates 30% of additional storage for the log files and 32GB per vCore for TempDB, but not to exceed 384GB. TempDB is located on an attached SSD in all service tiers.
- The price of storage for a single database is the sum of data storage and log storage amounts multiplied by the storage unit price of the service tier. The cost of TempDB is included in the vCore price. For details on the price of extra storage, see [SQL Database pricing](https://azure.microsoft.com/pricing/details/sql-database/).

## Single database: Change vCores

After initially picking the number of vCores, you can scale a single database up or down dynamically based on actual experience using the [Azure portal](sql-database-single-database-scaling.md#manage-single-database-resources-using-the-azure-portal), [Transact-SQL](/sql/t-sql/statements/alter-database-azure-sql-database#examples), [PowerShell](/powershell/module/azurerm.sql/set-azurermsqldatabase), the [Azure CLI](/cli/azure/sql/db#az_sql_db_update), or the [REST API](/rest/api/sql/databases/update). 

Changing the service tier and/or performance level of a database creates a replica of the original database at the new performance level, and then switches connections over to the replica. No data is lost during this process but during the brief moment when we switch over to the replica, connections to the database are disabled, so some transactions in flight may be rolled back. The length of time for the switch-over varies, but is generally under 4 seconds is less than 30 seconds 99% of the time. If there are large numbers of transactions in flight at the moment connections are disabled, the length of time for the switch-over may be longer. 

The duration of the entire scale-up process depends on both the size and service tier of the database before and after the change. For example, a 250-GB database that is changing to, from, or within a General Purpose service tier, should complete within six hours. For a database the same size that is changing performance levels within the Business Critical service tier, the scale-up should complete within three hours.

> [!TIP]
> To monitor in-progess operations, see: [Manage operations using the SQL REST API](/rest/api/sql/Operations/List), [Manage operations using CLI](/cli/azure/sql/db/op), [Monitor operations using T-SQL](/sql/relational-databases/system-dynamic-management-views/sys-dm-operation-status-azure-sql-database) and these two PowerShell commands: [Get-AzureRmSqlDatabaseActivity](/powershell/module/azurerm.sql/get-azurermsqldatabaseactivity) and [Stop-AzureRmSqlDatabaseActivity](/powershell/module/azurerm.sql/stop-azurermsqldatabaseactivity).

* If you are upgrading to a higher service tier or performance level, the database max size does not increase unless you explicitly specify a larger size (maxsize).
* To downgrade a database, the database used space must be smaller than the maximum allowed size of the target service tier and performance level. 
* When upgrading a database with [geo-replication](sql-database-geo-replication-portal.md) enabled, upgrade its secondary databases to the desired performance tier before upgrading the primary database (general guidance for best performance). When upgrading to a different, upgrading the secondary database first is required.
* When downgrading a database with [geo-replication](sql-database-geo-replication-portal.md) enabled, downgrade its primary databases to the desired performance tier before downgrading the secondary database (general guidance for best performance). When downgrading to a different edition, downgrading the primary database first is required.
* The new properties for the database are not applied until the changes are complete.

## What happens when single database resource limits are reached?

### Compute (vCores)

When database compute utilization (measured by vCore utilization) becomes high, query latency increases and can even time out. Under these conditions, queries may be queued by the service and are provided resources for execution as resource become free.
When encountering high compute utilization, mitigation options include:

- Increasing the performance level of the database to provide the database with more vCores. See [Single database: change cVcores](#single-database-change-vcores).
- Optimizing queries to reduce the resource utilization of each query. For more information, see [Query Tuning/Hinting](sql-database-performance-guidance.md#query-tuning-and-hinting).

### Storage

When database space used reaches the max size limit, database inserts and updates that increase the data size fail and clients receive an [error message](sql-database-develop-error-messages.md). Database SELECTS and DELETES continue to succeed.

When encountering high space utilization, mitigation options include:

- Increasing the max size of the database, or change the performance level to increase the maximum storage. 
- If the database is in an elastic pool, then alternatively the database can be moved outside of the pool so that its storage space is not shared with other databases.

### Sessions and workers (requests) 

The maximum number of sessions and workers are determined by the service tier and performance level. New requests are rejected when session or worker limits are reached, and clients receive an error message. While the number of connections available can be controlled by the application, the number of concurrent workers is often harder to estimate and control. This is especially true during peak load periods when database resource limits are reached and workers pile up due to longer running queries. 

When encountering high session or worker utilization, mitigation options include:
- Increasing the service tier or performance level of the database. See [Single database: change storage size](#single-database-change-storage-size) and [Single database: change vCores](#single-database-change-vcores).
- Optimizing queries to reduce the resource utilization of each query if the cause of increased worker utilization is due to contention for compute resources. For more information, see [Query Tuning/Hinting](sql-database-performance-guidance.md#query-tuning-and-hinting).

## Next steps

- See [SQL Database FAQ](sql-database-faq.md) for answers to frequently asked questions.
- For information about general Azure limits, see [Azure subscription and service limits, quotas, and constraints](../azure-subscription-service-limits.md).

---
title: What are Data Warehouse Units (DWUs, cDWUs) in Azure SQL Data Warehouse? | Microsoft Docs
description: Performance scale out capabilities in Azure SQL Data Warehouse. Scale out by adjusting DWUs, cDWUs,or pause and resume compute resources to save costs.
services: sql-data-warehouse
documentationcenter: NA
author: barbkess
manager: jhubbard
editor: ''

ms.assetid: e13a82b0-abfe-429f-ac3c-f2b6789a70c6
ms.service: sql-data-warehouse
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: data-services
ms.custom: manage
ms.date: 10/23/2017
ms.author: jrj;barbkess

---
# Data Warehouse Units (DWUs) and compute Data Warehouse Units (cDWUs)
Explains Data Warehouse Units (DWUs) and compute Data Warehouse Units (cDWUS) for Azure SQL Data Warehouse. Include recommendations on choosing the ideal number of data warehouse units, and how to change the number of them. 

## What are Data Warehouse Units?
With SQL Data Warehouse CPU, memory, and IO are bundled into units of compute scale called Data Warehouse Units (DWUs). A DWU represents an abstract, normalized measure of compute resources and performance. By changing your service level you alter the number of DWUs that are allocated to the system, which in turn adjusts the performance, and the cost, of your system. 

To pay for higher performance, you can increase the number of data warehouse units. To pay for less performance, reduce data warehouse units. Storage and compute costs are billed separately, so changing data warehouse units does not affect storage costs.

Performance for data warehouse units is based on these data warehouse workload metrics:

- How fast can a standard data warehousing query scan a large number of rows and then perform a complex aggregation? This operation is I/O and CPU intensive.
- How fast can the data warehouse ingest data from Azure Storage Blobs or Azure Data Lake? This operation is network and CPU intensive. 
- How fast can the [CREATE TABLE AS SELECT](https://docs.microsoft.com/sql/t-sql/statements/create-table-as-select-azure-sql-data-warehouse) T-SQL command copy a table? This operation involves reading data from storage, distributing it across the nodes of the appliance and writing to storage again. This operation is CPU, IO, and network intensive.

Increasing DWUs:
- Linearly changes performance of the system for scans, aggregations, and CTAS statements
- Increases the number of readers and writers for PolyBase load operations
- Increases the maximum number of concurrent queries and concurrency slots.

## Performance Tiers and Data Warehouse Units

Each performance tier uses a slightly different unit of measure for their data warehouse units. This difference is reflected on the invoice as the unit of scale directly translates to billing.

- The optimized for elasticity performance tier is measured in Data Warehouse Units (DWUs).
- The optimized for compute performance tier is measured in compute Data Warehouse Units (cDWUs). 

Both DWUs and cDWUs support scaling compute up or down, and pausing compute when you don't need to use the data warehouse. These operations are all on-demand. The optimized for compute performance tier also uses a local disk-based cache on the compute nodes to improve performance. When you scale or pause the system, the cache is invalidated and so a period of cache warming is required before optimal performance is achieved.  

As you increase data warehouse units, you are linearly increasing computing resources. The optimized for compute performance tier provides the best query performance and highest scale but has a higher entry price. It is designed for businesses that have a constant demand for performance. These systems make the most use of the cache. 

### Capacity limits
By default, each Server (for example, myserver.database.windows.net) has a quota that limits the size and scale of the databases on that instance. A server can host SQL DW and SQL DB databases all of which must fit within the quota. This quota is measured in Database Transaction Units (DTU) and by default is set to 54,000 to allow up to 6000 cDWU. This quota is simply a safety limit. You can increase your quota by creating a support ticket and selecting "Quota" as the request type. 

To calculate your DTU requirement, apply the following multipliers to your DTU calculation:

| Performance Tier | Unit of Measure | DTU Multiplier | Example                   |
|:----------------:|----------------:|---------------:|--------------------------:|
| Elasticity       |  DWU            | 7.5            | DW6000 x 7.5 = 45,000 DTU |
| Compute          | cDWU            | 9              | DW6000 x 7.5 = 54,000 DTU |

You can view your current DTU consumption see SQL server properties in the portal.

## How many data warehouse units do I need?
The ideal number of data warehouse units depends very much on your workload and the amount of data you have loaded into the system.

Steps for finding the best DWU for your workload:

1. During development, begin by selecting a smaller DWU using the optimized for elasticity performance tier.  Since the concern at this stage is functional validation, the Optimized for Elasticity performance tier is a reasonable option. A good starting point is DW200. 
2. Monitor your application performance as you test data loads into the system, observing the number of DWUs selected compared to the performance you observe.
3. Identify any additional requirements for periodic periods of peak activity. If the workload shows significant peaks and troughs in activity and there is a good reason to scale frequently, then favor the optimized for elasticity performance tier.
4. If you need more than 1000 DWU, then favor the Optimized for Compute performance tier since this gives the best performance.

SQL Data Warehouse is a scale-out system that can provision vast amounts of compute and query sizeable quantities of data. To see its true capabilities for scaling, especially at larger DWUs, we recommend scaling the data set as you scale to ensure that you have enough data to feed the CPUs. For scale testing, we recommend using at least 1 TB.

> [!NOTE]
>
> Query performance only increases with more parallelization if the work can be split between compute nodes. If you find that scaling is not changing your performance, you may need to tune your table design and/or your queries. For query tuning guidance,refer to the following [performance](sql-data-warehouse-overview-manage-user-queries.md) articles. 

## Permissions

Changing the data warehouse units requires the permissions described in [ALTER DATABASE][ALTER DATABASE]. 

## View current DWU settings

To view the current DWU setting:

1. Open SQL Server Object Explorer in Visual Studio.
2. Connect to the master database associated with the logical SQL Database server.
3. Select from the sys.database_service_objectives dynamic management view. Here is an example: 

```sql
SELECT  db.name [Database]
,	    ds.edition [Edition]
,	    ds.service_objective [Service Objective]
FROM    sys.database_service_objectives   AS ds
JOIN    sys.databases                     AS db ON ds.database_id = db.database_id
;
```

## Change data warehouse units

### Azure portal
To change DWUs or cDWUs:

1. Open the [Azure portal](https://portal.azure.com), open your database, and click **Scale**.

2. Under **Scale**, move the slider left or right to change the DWU setting.

3. Click **Save**. A confirmation message appears. Click **yes** to confirm or **no** to cancel.

### PowerShell
To change the DWUs or cDWUs, use the [Set-AzureRmSqlDatabase][Set-AzureRmSqlDatabase] PowerShell cmdlet. The following example sets the service level objective to DW1000 for the database MySQLDW that is hosted on server MyServer.

```Powershell
Set-AzureRmSqlDatabase -DatabaseName "MySQLDW" -ServerName "MyServer" -RequestedServiceObjectiveName "DW1000"
```

### T-SQL
With T-SQL you can view the current DWU or cDWU settings, change the settings, and check the progress. 

To change the DWUs or cDWUs:

1. Connect to the master database associated with your logical SQL Database server.
2. Use the [ALTER DATABASE][ALTER DATABASE] TSQL statement. The following example sets the service level objective to DW1000 for the database MySQLDW. 

```Sql
ALTER DATABASE MySQLDW
MODIFY (SERVICE_OBJECTIVE = 'DW1000')
;
```

### REST APIs

To change the DWUs, use the [Create or Update Database][Create or Update Database] REST API. The following example sets the service level objective to DW1000 for the database MySQLDW which is hosted on server MyServer. The server is in an Azure resource group named ResourceGroup1.

```
PUT https://management.azure.com/subscriptions/{subscription-id}/resourceGroups/{resource-group-name}/providers/Microsoft.Sql/servers/{server-name}/databases/{database-name}?api-version=2014-04-01-preview HTTP/1.1
Content-Type: application/json; charset=UTF-8

{
    "properties": {
        "requestedServiceObjectiveName": DW1000
    }
}
```


## Check status of DWU changes

DWU changes may take several minutes to complete. If you are scaling automatically, consider implementing logic to ensure that certain operations have been completed before proceeding with another action. 

Checking the database state through various endpoints allows you to correctly implement automation. The portal provides notification upon completion of an operation and the databases current state but does not allow for programmatic checking of state. 

You cannot check the database state for scale-out operations with the Azure portal.

To check the status of DWU changes:

1. Connect to the master database associated with your logical SQL Database server.
2. Submit the following query to check database state.


```sql
SELECT    *
FROM      sys.databases
;
```

3. Submit the following query to check status of operation

```sql
SELECT    *
FROM      sys.dm_operation_status
WHERE     resource_type_desc = 'Database'
AND       major_resource_id = 'MySQLDW'
;
```

This DMV returns information about various management operations on your SQL Data Warehouse such as the operation and the state of the operation, which is either be IN_PROGRESS or COMPLETED.

## The scaling workflow

When you initiate a scale operation, the system first kills all open sessions, rolling back any open transactions to ensure a consistent state. For scale operations, scaling only occurs after this transactional rollback has completed.  

- For a scale-up operation, the system provisions the additional compute and then reattaches to the storage layer. 
- For a scale-down operation, the unneeded nodes detach from the storage and reattach to the remaining nodes.

## Next steps
Refer to the following articles to help you understand some additional key performance concepts:

* [Workload and concurrency management][Workload and concurrency management]
* [Table design overview][Table design overview]
* [Table distribution][Table distribution]
* [Table indexing][Table indexing]
* [Table partitioning][Table partitioning]
* [Table statistics][Table statistics]
* [Best practices][Best practices]

<!--Image reference-->

<!--Article references-->

[capacity limits]: ./sql-data-warehouse-service-capacity-limits.md


[Check database state with T-SQL]: ./sql-data-warehouse-manage-compute-tsql.md#check-database-state-and-operation-progress
[Check database state with PowerShell]: ./sql-data-warehouse-manage-compute-powershell.md#check-database-state
[Check database state with REST APIs]: ./sql-data-warehouse-manage-compute-rest-api.md#check-database-state

[Workload and concurrency management]: ./sql-data-warehouse-develop-concurrency.md
[Table design overview]: ./sql-data-warehouse-tables-overview.md
[Table distribution]: ./sql-data-warehouse-tables-distribute.md
[Table indexing]: ./sql-data-warehouse-tables-index.md
[Table partitioning]: ./sql-data-warehouse-tables-partition.md
[Table statistics]: ./sql-data-warehouse-tables-statistics.md
[Best practices]: ./sql-data-warehouse-best-practices.md
[development overview]: ./sql-data-warehouse-overview-develop.md

[SQL DB Contributor]: ../active-directory/role-based-access-built-in-roles.md#sql-db-contributor

<!--MSDN references-->
[ALTER DATABASE]: https://msdn.microsoft.com/library/mt204042.aspx

<!--Other Web references-->
[Azure portal]: http://portal.azure.com/

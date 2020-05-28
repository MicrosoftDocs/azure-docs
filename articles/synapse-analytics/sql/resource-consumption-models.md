---
title: Synapse Analytics SQL resource consumption
description: Learn about Synapse SQL consumption models in Azure Synapse Analytics.
services: synapse analytics
author: vvasic-msft
ms.service: synapse-analytics
ms.topic: overview
ms.date: 04/15/2020
ms.author: vvasic
ms.reviewer: jrasnick   
---

# Azure Synapse Analytics SQL resource consumption

This article describes resource consumption models of Synapse SQL (preview).

## SQL on-demand

SQL on-demand is a pay per query service that doesn't require you to pick the right size. The system automatically adjusts based on your requirements, freeing you up from managing your infrastructure and picking the right size for your solution.

## SQL pool - Data Warehouse Units (DWUs) and compute Data Warehouse Units (cDWUs)

Recommendations on choosing the ideal number of data warehouse units (DWUs) to optimize price and performance, and how to change the number of units.

### What are Data Warehouse Units

A Synapse SQL pool represents a collection of analytic resources that are being provisioned. Analytic resources are defined as a combination of CPU, memory and IO. These three resources are bundled into units of compute scale called Data Warehouse Units (DWUs). A DWU represents an abstract, normalized measure of compute resources and performance. A change to your service level alters the number of DWUs that are available to the system, which in turn adjusts the performance, and the cost, of your system.

For higher performance, you can increase the number of data warehouse units. For less performance, reduce data warehouse units. Storage and compute costs are billed separately, so changing data warehouse units does not affect storage costs.

Performance for data warehouse units is based on these data warehouse workload metrics:

- How fast a standard data warehousing query can scan a large number of rows and then perform a complex aggregation. This operation is I/O and CPU intensive.
- How fast the data warehouse can ingest data from Azure Storage Blobs or Azure Data Lake. This operation is network and CPU intensive.
- How fast the [`CREATE TABLE AS SELECT`](/sql/t-sql/statements/create-table-as-select-azure-sql-data-warehouse?toc=/azure/synapse-analytics/toc.json&bc=/azure/synapse-analytics/breadcrumb/toc.json&view=azure-sqldw-latest) T-SQL command can copy a table. This operation involves reading data from storage, distributing it across the nodes of the appliance and writing to storage again. This operation is CPU, IO, and network intensive.

Increasing DWUs:

- Linearly changes performance of the system for scans, aggregations, and CTAS statements
- Increases the number of readers and writers for PolyBase load operations
- Increases the maximum number of concurrent queries and concurrency slots.

### Service Level Objective

The Service Level Objective (SLO) is the scalability setting that determines the cost and performance level of your data warehouse. The service levels for Gen2 are measured in compute data warehouse units (cDWU), for example DW2000c. Gen1 service levels are measured in DWUs, for example DW2000.

The Service Level Objective (SLO) is the scalability setting that determines the cost and performance level of your data warehouse. The service levels for Gen2 SQL pool are measured in data warehouse units (DWU), for example DW2000c.

> [!NOTE]
> Azure SQL Data Warehouse Gen2 recently added additional scale capabilities to support compute tiers as low as 100 cDWU. Existing data warehouses currently on Gen1 that require the lower compute tiers can now upgrade to Gen2 in the regions that are currently available for no additional cost.  If your region is not yet supported, you can still upgrade to a supported region. For more information, see [Upgrade to Gen2](../sql-data-warehouse/upgrade-to-latest-generation.md?toc=/azure/synapse-analytics/toc.json&bc=/azure/synapse-analytics/breadcrumb/toc.json).

In T-SQL, the SERVICE_OBJECTIVE setting determines the service level and the performance tier for your SQL pool.

```sql
CREATE DATABASE mySQLDW
(Edition = 'Datawarehouse'
 ,SERVICE_OBJECTIVE = 'DW1000c'
)
;
```

### Performance Tiers and Data Warehouse Units

Each performance tier uses a slightly different unit of measure for their data warehouse units. This difference is reflected on the invoice as the unit of scale directly translates to billing.

- Gen1 data warehouses are measured in Data Warehouse Units (DWUs).
- Gen2 data warehouses are measured in compute Data Warehouse Units (cDWUs).

Both DWUs and cDWUs support scaling compute up or down, and pausing compute when you don't need to use the data warehouse. These operations are all on-demand. Gen2 uses a local disk-based cache on the compute nodes to improve performance. When you scale or pause the system, the cache is invalidated and so a period of cache warming is required before optimal performance is achieved.  

As you increase data warehouse units, you are linearly increasing computing resources. Gen2 provides the best query performance and highest scale. Gen2 systems also make the most use of the cache.

#### Capacity limits

Each SQL server (for example, myserver.database.windows.net) has a [Database Transaction Unit (DTU)](../../azure-sql/database/service-tiers-dtu.md?toc=/azure/synapse-analytics/toc.json&bc=/azure/synapse-analytics/breadcrumb/toc.json) quota that allows a specific number of data warehouse units. For more information, see the [workload management capacity limits](../sql-data-warehouse/sql-data-warehouse-service-capacity-limits.md?toc=/azure/synapse-analytics/toc.json&bc=/azure/synapse-analytics/breadcrumb/toc.json#workload-management).

### How many data warehouse units do I need

The ideal number of data warehouse units depends very much on your workload and the amount of data you have loaded into the system.

Steps for finding the best DWU for your workload:

1. Begin by selecting a smaller DWU.
2. Monitor your application performance as you test data loads into the system, observing the number of DWUs selected compared to the performance you observe.
3. Identify any additional requirements for periodic periods of peak activity. Workloads that show significant peaks and troughs in activity may need to be scaled frequently.

SQL pool is a scale-out system that can provision vast amounts of compute and query sizeable quantities of data. To see its true capabilities for scaling, especially at larger DWUs, we recommend scaling the data set as you scale to ensure that you have enough data to feed the CPUs. For scale testing, we recommend using at least 1 TB.

> [!NOTE]
>
> Query performance only increases with more parallelization if the work can be split between compute nodes. If you find that scaling is not changing your performance, you may need to tune your table design and/or your queries. For query tuning guidance, see [Manage user queries](../overview-cheat-sheet.md?toc=/azure/synapse-analytics/toc.json&bc=/azure/synapse-analytics/breadcrumb/toc.json).

### Permissions

Changing the data warehouse units requires the permissions described in [ALTER DATABASE](/sql/t-sql/statements/alter-database-transact-sql?toc=/azure/synapse-analytics/toc.json&bc=/azure/synapse-analytics/breadcrumb/toc.json&view=azure-sqldw-latest).

Built-in roles for Azure resources such as SQL DB Contributor and SQL Server Contributor can change DWU settings.

#### View current DWU settings

To view the current DWU setting:

1. Open SQL Server Object Explorer in Visual Studio.
2. Connect to the master database associated with the logical SQL server.
3. Select from the sys.database_service_objectives dynamic management view. Here is an example:

```sql
SELECT  db.name [Database]
,        ds.edition [Edition]
,        ds.service_objective [Service Objective]
FROM    sys.database_service_objectives   AS ds
JOIN    sys.databases                     AS db ON ds.database_id = db.database_id
;
```

### Change data warehouse units

#### Azure portal

To change DWUs:

1. Open the [Azure portal](https://portal.azure.com), open your database, and click **Scale**.

2. Under **Scale**, move the slider left or right to change the DWU setting.

3. Click **Save**. A confirmation message appears. Click **yes** to confirm or **no** to cancel.

#### PowerShell

[!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]

To change the DWUs, use the [Set-AzSqlDatabase](/powershell/module/az.sql/set-azsqldatabase?toc=/azure/synapse-analytics/toc.json&bc=/azure/synapse-analytics/breadcrumb/toc.json) PowerShell cmdlet. The following example sets the service level objective to DW1000 for the database MySQLDW that is hosted on server MyServer.

```Powershell
Set-AzSqlDatabase -DatabaseName "MySQLDW" -ServerName "MyServer" -RequestedServiceObjectiveName "DW1000c"
```

For more information, see [PowerShell cmdlets for SQL Data Warehouse](../sql-data-warehouse/sql-data-warehouse-reference-powershell-cmdlets.md?toc=/azure/synapse-analytics/toc.json&bc=/azure/synapse-analytics/breadcrumb/toc.json)

#### T-SQL

With T-SQL you can view the current DWUsettings, change the settings, and check the progress.

To change the DWUs:

1. Connect to the master database associated with your server.
2. Use the [ALTER DATABASE](/sql/t-sql/statements/alter-database-transact-sql?toc=/azure/synapse-analytics/toc.json&bc=/azure/synapse-analytics/breadcrumb/toc.json&view=azure-sqldw-latest) TSQL statement. The following example sets the service level objective to DW1000c for the database MySQLDW.

```Sql
ALTER DATABASE MySQLDW
MODIFY (SERVICE_OBJECTIVE = 'DW1000c')
;
```

#### REST APIs

To change the DWUs, use the [Create or Update Database](/sql/t-sql/statements/alter-database-transact-sql?toc=/azure/synapse-analytics/toc.json&bc=/azure/synapse-analytics/breadcrumb/toc.json&view=azure-sqldw-latest) REST API. The following example sets the service level objective to DW1000c for the database MySQLDW, which is hosted on server MyServer. The server is in an Azure resource group named ResourceGroup1.

```
PUT https://management.azure.com/subscriptions/{subscription-id}/resourceGroups/{resource-group-name}/providers/Microsoft.Sql/servers/{server-name}/databases/{database-name}?api-version=2014-04-01-preview HTTP/1.1
Content-Type: application/json; charset=UTF-8

{
    "properties": {
        "requestedServiceObjectiveName": DW1000
    }
}
```

For more REST API examples, see [REST APIs for SQL Data Warehouse](../sql-data-warehouse/sql-data-warehouse-manage-compute-rest-api.md?toc=/azure/synapse-analytics/toc.json&bc=/azure/synapse-analytics/breadcrumb/toc.json).

### Check status of DWU changes

DWU changes may take several minutes to complete. If you are scaling automatically, consider implementing logic to ensure that certain operations have been completed before proceeding with another action.

Checking the database state through various endpoints allows you to correctly implement automation. The portal provides notification upon completion of an operation and the databases current state but does not allow for programmatic checking of state.

You cannot check the database state for scale-out operations with the Azure portal.

To check the status of DWU changes:

1. Connect to the master database associated with your server.
2. Submit the following query to check database state.

```sql
SELECT    *
FROM      sys.databases
;
```

1. Submit the following query to check status of operation

```sql
SELECT    *
FROM      sys.dm_operation_status
WHERE     resource_type_desc = 'Database'
AND       major_resource_id = 'MySQLDW'
;
```

This DMV returns information about various management operations on your SQL pool such as the operation and the state of the operation, which is either IN_PROGRESS or COMPLETED.

### The scaling workflow

When you start a scale operation, the system first kills all open sessions, rolling back any open transactions to ensure a consistent state. For scale operations, scaling only occurs after this transactional rollback has completed.  

- For a scale-up operation, the system detaches all compute nodes, provisions the additional compute nodes, and then reattaches to the storage layer.
- For a scale-down operation, the system detaches all compute nodes and then reattaches only the needed nodes to the storage layer.

## Next steps

To learn more about managing performance, see [Resource classes for workload management](../sql-data-warehouse/resource-classes-for-workload-management.md?toc=/azure/synapse-analytics/toc.json&bc=/azure/synapse-analytics/breadcrumb/toc.json) and [Memory and concurrency limits](../sql-data-warehouse/memory-concurrency-limits.md?toc=/azure/synapse-analytics/toc.json&bc=/azure/synapse-analytics/breadcrumb/toc.json).

---
title: Manage compute resource in Azure SQL Data Warehouse | Microsoft Docs
description: Learn about performance scale out capabilities in Azure SQL Data Warehouse. Scale out by adjusting DWUs, or lower costs by pausing the data warehouse.
services: sql-data-warehouse
author: kevinvngo
manager: craigg
ms.service: sql-data-warehouse
ms.topic: conceptual
ms.subservice: manage
ms.date: 04/17/2018
ms.author: kevin
ms.reviewer: igorstan
---

# Manage compute in Azure SQL Data Warehouse
Learn about managing compute resources in Azure SQL Data Warehouse. Lower costs by pausing the data warehouse, or scale the data warehouse to meet performance demands. 

## What is compute management?
The architecture of SQL Data Warehouse separates storage and compute, allowing each to scale independently. As a result, you can scale compute to meet performance demands independent of data storage. You can also pause and resume compute resources. A natural consequence of this architecture is that [billing](https://azure.microsoft.com/pricing/details/sql-data-warehouse/) for compute and storage is separate. If you don't need to use your data warehouse for a while, you can save compute costs by pausing compute. 

## Scaling compute
You can scale out or scale back compute by adjusting the [data warehouse units](what-is-a-data-warehouse-unit-dwu-cdwu.md) setting for your data warehouse. Loading and query performance can increase linearly as you add more data warehouse units. 

For scale-out steps, see the [Azure portal](quickstart-scale-compute-portal.md), [PowerShell](quickstart-scale-compute-powershell.md), or [T-SQL](quickstart-scale-compute-tsql.md) quickstarts. You can also perform scale-out operations with a [REST API](sql-data-warehouse-manage-compute-rest-api.md#scale-compute).

To perform a scale operation, SQL Data Warehouse first kills all incoming queries and then rolls back transactions to ensure a consistent state. Scaling only occurs once the transaction rollback is complete. For a scale operation, the system detaches the storage layer from the Compute nodes, adds Compute nodes, and then reattaches the storage layer to the Compute layer. Each data warehouse is stored as 60 distributions, which are evenly distributed to the Compute nodes. Adding more Compute nodes adds more compute power. As the number of Compute nodes increases, the number of distributions per compute node decreases, providing more compute power for your queries. Likewise, decreasing data warehouse units reduces the number of Compute nodes, which reduces the compute resources for queries.

The following table shows how the number of distributions per Compute node changes as the data warehouse units change.  DWU6000 provides 60 Compute nodes and achieves much higher query performance than DWU100. 

| Data warehouse units  | \# of Compute nodes | \# of distributions per node |
| ---- | ------------------ | ---------------------------- |
| 100  | 1                  | 60                           |
| 200  | 2                  | 30                           |
| 300  | 3                  | 20                           |
| 400  | 4                  | 15                           |
| 500  | 5                  | 12                           |
| 600  | 6                  | 10                           |
| 1000 | 10                 | 6                            |
| 1200 | 12                 | 5                            |
| 1500 | 15                 | 4                            |
| 2000 | 20                 | 3                            |
| 3000 | 30                 | 2                            |
| 6000 | 60                 | 1                            |


## Finding the right size of data warehouse units

To see the performance benefits of scaling out, especially for larger data warehouse units, you want to use at least a 1-TB data set. To find the best number of data warehouse units for your data warehouse, try scaling up and down. Run a few queries with different numbers of data warehouse units after loading your data. Since scaling is quick, you can try various performance levels in an hour or less. 

Recommendations for finding the best number of data warehouse units:

- For a data warehouse in development, begin by selecting a smaller number of data warehouse units.  A good starting point is DW400 or DW200.
- Monitor your application performance, observing the number of data warehouse units selected compared to the performance you observe.
- Assume a linear scale, and determine how much you need to increase or decrease the data warehouse units. 
- Continue making adjustments until you reach an optimum performance level for your business requirements.

## When to scale out
Scaling out data warehouse units impacts these aspects of performance:

- Linearly improves performance of the system for scans, aggregations, and CTAS statements.
- Increases the number of readers and writers for loading data.
- Maximum number of concurrent queries and concurrency slots.

Recommendations for when to scale out data warehouse units:

- Before you perform a heavy data loading or transformation operation, scale out to make the data available more quickly.
- During peak business hours, scale out to accommodate larger numbers of concurrent queries. 

## What if scaling out does not improve performance?

Adding data warehouse units increasing the parallelism. If the work is evenly split between the Compute nodes, the additional parallelism improves query performance. If scaling out is not changing your performance, there are some reasons why this might happen. Your data might be skewed across the distributions, or queries might be introducing a large amount of data movement. To investigate query performance issues, see [Performance troubleshooting](sql-data-warehouse-troubleshoot.md#performance). 

## Pausing and resuming compute
Pausing compute causes the storage layer to detach from the Compute nodes. The Compute resources are released from your account. You are not charged for compute while compute is paused. Resuming compute reattaches storage to the Compute nodes, and resumes charges for Compute. 
When you pause a data warehouse:

* Compute and memory resources are returned to the pool of available resources in the data center
* Data warehouse unit costs are zero for the duration of the pause.
* Data storage is not affected and your data stays intact. 
* SQL Data Warehouse cancels all running or queued operations.

When you resume a data warehouse:

* SQL Data Warehouse acquires compute and memory resources for your data warehouse units setting.
* Compute charges for your data warehouse units resume.
* Your data becomes available.
* After the data warehouse is online, you need to restart your workload queries.

If you always want your data warehouse accessible, consider scaling it down to the smallest size rather than pausing. 

For pause and resume steps, see the [Azure portal](pause-and-resume-compute-portal.md), or [PowerShell](pause-and-resume-compute-powershell.md) quickstarts. You can also use the [pause REST API](sql-data-warehouse-manage-compute-rest-api.md#pause-compute) or the [resume REST API](sql-data-warehouse-manage-compute-rest-api.md#resume-compute).

## Drain transactions before pausing or scaling
We recommend allowing existing transactions to finish before you initiate a pause or scale operation.

When you pause or scale your SQL Data Warehouse, behind the scenes your queries are canceled when you initiate the pause or scale request.  Canceling a simple SELECT query is a quick operation and has almost no impact to the time it takes to pause or scale your instance.  However, transactional queries, which modify your data or the structure of the data, may not be able to stop quickly.  **Transactional queries, by definition, must either complete in their entirety or rollback their changes.**  Rolling back the work completed by a transactional query can take as long, or even longer, than the original change the query was applying.  For example, if you cancel a query which was deleting rows and has already been running for an hour, it could take the system an hour to insert back the rows which were deleted.  If you run pause or scaling while transactions are in flight, your pause or scaling may seem to take a long time because pausing and scaling has to wait for the rollback to complete before it can proceed.

See also [Understanding transactions](sql-data-warehouse-develop-transactions.md), and [Optimizing transactions](sql-data-warehouse-develop-best-practices-transactions.md).

## Automating compute management
To automate the compute management operations, see [Manage compute with Azure functions](manage-compute-with-azure-functions.md).

Each of the scale-out, pause, and resume operations can take several minutes to complete. If you are scaling, pausing, or resuming automatically, we recommend implementing logic to ensure that certain operations have completed before proceeding with another action. Checking the data warehouse state through various endpoints allows you to correctly implement automation of such operations. 

To check the data warehouse state, see the [PowerShell](quickstart-scale-compute-powershell.md#check-data-warehouse-state) or [T-SQL](quickstart-scale-compute-tsql.md#check-data-warehouse-state) quickstart. You can also check the data warehouse state with a [REST API](sql-data-warehouse-manage-compute-rest-api.md#check-database-state).


## Permissions

Scaling the data warehouse requires the permissions described in [ALTER DATABASE](/sql/t-sql/statements/alter-database-azure-sql-data-warehouse).  Pause and Resume require the [SQL DB Contributor](../role-based-access-control/built-in-roles.md#sql-db-contributor) permission, specifically Microsoft.Sql/servers/databases/action.


## Next steps
Another aspect of managing compute resources is allocating different compute resources for individual queries. For more information, see [Resource classes for workload management](resource-classes-for-workload-management.md).

---
title: Manage compute power in Azure SQL Data Warehouse (Overview) | Microsoft Docs
description: Performance scale out capabilities in Azure SQL Data Warehouse. Scale out by adjusting DWUs or pause and resume compute resources to save costs.
services: sql-data-warehouse
documentationcenter: NA
author: hirokib
manager: johnmac
editor: ''

ms.assetid: e13a82b0-abfe-429f-ac3c-f2b6789a70c6
ms.service: sql-data-warehouse
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: data-services
ms.custom: manage
ms.date: 02/16/2018
ms.author: elbutter

---
# Manage compute in Azure SQL Data Warehouse
Learn about managing compute resources in Azure SQL Data Warehouse. The compute management capabilities include scaling out, scaling back, pausing, and resuming compute. 

## What is compute management?
The architecture of SQL Data Warehouse separates storage and compute, allowing each to scale independently. As a result, you can scale compute to meet performance demands independent of data storage. You can also pause and resume compute resources. A natural consequence of this architecture is that [billing](https://azure.microsoft.com/pricing/details/sql-data-warehouse/) for compute and storage is separate. If you don't need to use your data warehouse for a while, you can save compute costs by pausing compute. 

## Scaling compute
You can scale out or scale back compute by adjusting the [data warehouse units](what-is-a-data-warehouse-unit-dwu-cdwu.md) setting for your data warehouse. Loading and query performance can increase linearly as you add more data warehouse units. SQL Data Warehouse offers [service levels](performance-tiers.md#service-levels) for data warehouse units that ensure a noticeable change in performance when you scale out or back. 

For scale-out steps, see the [Azure portal](quickstart-scale-compute-portal.md), [PowerShell](quickstart-scale-compute-powershell.md), or [T-SQL](quickstart-scale-compute-tsql.md) quickstarts. You can also perform scale-out operations with a [REST API](sql-data-warehouse-manage-compute-rest-api.md#scale-compute).

To perform a scale operation, SQL Data Warehouse first kills all incoming queries and then rolls back transactions to ensure a consistent state. Scaling only occurs once the transaction rollback is complete. For a scale operation, the system detaches the storage layer from the Compute nodes, adds Compute nodes, and then reattaches the storage layer to the Compute layer. Each data warehouse is stored as 60 distributions, which are evenly distributed to the Compute nodes. Adding more Compute nodes adds more compute power. As the number of Compute nodes increases, the number of distributions per compute node decreases, providing more compute power for your queries. Likewise, decreasing data warehouse units reduces the number of Compute nodes, which reduces the compute resources for queries.

The following table shows how the number of distributions per Compute node changes as the data warehouse units change.  DWU6000 provides 60 Compute nodes and achieves much higher query performance than DWU100. 

| Data warehouse units  | \#of Compute nodes | \# of distributions per node |
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

1. For a data warehouse in development, begin by selecting a smaller number of data warehouse units.  A good starting point is DW400 or DW200.
2. Monitor your application performance, observing the number of data warehouse units selected compared to the performance you observe.
3. Assume a linear scale, and determine how much you need to increase or decrease the data warehouse units. 
5. Continue making adjustments until you reach an optimum performance level for your business requirements.

## When to scale out
Scaling out data warehouse units impacts these aspects of performance:

1. Linearly improves performance of the system for scans, aggregations, and CTAS statements.
2. Increases the number of readers and writers for loading data.
3. Maximum number of concurrent queries and concurrency slots.

Recommendations for when to scale out data warehouse units:

1. Before you perform a heavy data loading or transformation operation, scale out to make the data available more quickly.
2. During peak business hours, scale out to accommodate larger numbers of concurrent queries. 

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

For pause and resume steps, see the [Azure portal](pause-and-resume-compute-portal.md), or [PowerShell](pause-and-resume-compute-powershell.md) quickstarts. You can also use the [pause REST API](sql-data-warehouse-manage-compute-rest-api.md#pause-compute) or the [resume REST API](sql-data-warehouse-manage-compute-rest-api.md#resume-compute).


## Automating compute management
To automate the compute management operations, see [Manage compute with Azure functions](manage-compute-with-azure-functions.md).

Each of the scale-out, pause, and resume operations can take several minutes to complete. If you are scaling, pausing, or resuming automatically, we recommend implementing logic to ensure that certain operations have completed before proceeding with another action. Checking the data warehouse state through various endpoints allows you to correctly implement automation of such operations. 

To check the data warehouse state, see the [PowerShell](quickstart-scale-compute-powershell.md#check-database-state) or [T-SQL](quickstart-scale-compute-tsql.md#check-database-state) quickstart. You can also check the data warehouse state with a [REST API](sql-data-warehouse-manage-compute-rest-api.md#check-database-state).


## Permissions

Scaling the data warehouse requires the permissions described in [ALTER DATABASE](/sql/t-sql/statements/alter-database-azure-sql-data-warehouse.md).  Pause and Resume require the [SQL DB Contributor](../active-directory/role-based-access-built-in-roles.md#sql-db-contributor) permission, specifically Microsoft.Sql/servers/databases/action.


## Next steps
Another aspect of managing compute resources is allocating different compute resources for individual queries. For more information, see [Resource classes for workload management](resource-classes-for-workload-management.md).

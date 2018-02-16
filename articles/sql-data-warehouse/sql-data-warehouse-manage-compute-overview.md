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
ms.date: 02/15/2018
ms.author: elbutter

---
# Manage compute in Azure SQL Data Warehouse
Learn how to manage compute resources with SQL Data Warehouse, which includes the ability to scale out, pause, and resume compute. 

## What is compute management?
The architecture of SQL Data Warehouse separates storage and compute, allowing each to scale independently. As a result, you can scale compute to meet performance demands independent of data storage. You can also pause and resume compute resources. A natural consequence of this architecture is that [billing](https://azure.microsoft.com/pricing/details/sql-data-warehouse/) for compute and storage is separate. If you don't need to use your data warehouse for a while, you can save compute costs by pausing compute. 


## Scaling compute
You can scale out or scale back compute by adjusting the data warehouse units setting for your data warehouse. Performance increases linearly as you add more DWU for certain operations. SQL Data Warehouse offers service levels for data warehouse units that ensure a noticeably change in performance when you scale out or back. 

For scale-out steps, see the [Azure portal](quickstart-scale-compute-portal.md), [PowerShell](quickstart-scale-compute-powershell.md), or [T-SQL](quickstart-scale-compute-tsql.md) quickstarts. You can also perform scale-out operations with a [REST API](sql-data-warehouse-manage-compute-rest-api.md#scale-compute).

To perform a scale operation, SQL Data Warehouse first kills all incoming queries and then rolls back transactions to ensure a consistent state. Scaling only occurs once the transactional rollback is complete. For a scale operation, the system detaches the storage layer from the Compute nodes, adds Compute nodes, and then reattaches the storage layer to the Compute layer. Each data warehouse is stored as 60 distributions, which are evenly distributed to the Compute nodes. Adding more Compute nodes adds more compute power. As the number of Compute nodes increases, the number of distributions per compute node decreases, providing more compute power for your queries. Likewise, decreasing data warehouse units reduces the number of Compute nodes, which reduces the compute resources for queries.

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

To find the best number of data warehouse units for your data warehouse, try scaling up and down. Run a few queries with different numbers of data warehouse units after loading your data. Since scaling is quick, you can try various performance levels in an hour or less. 

> [!Note] 
> SQL Data Warehouse is designed to process large amounts of data. To see its true capabilities for scaling, especially at larger data warehouse units, you want to use a large data set which approaches or exceeds 1 TB.

Recommendations for finding the best DWU size for your workload:

1. For a data warehouse in development, begin by selecting a smaller DWU performance level.  A good starting point is DW400 or DW200.
2. Monitor your application performance, observing the number of DWUs selected compared to the performance you observe.
3. Determine how much faster or slower performance should be for you to reach the optimum performance level for your requirements by assuming linear scale.
4. Increase or decrease the number of DWUs in proportion to how much faster or slower you want your workload to perform. 
5. Continue making adjustments until you reach an optimum performance level for your business requirements.

## When to scale out
Scaling out data warehouse units impacts these aspects of performance:

1. Linearly improves performance of the system for scans, aggregations, and CTAS statements
2. Increases the number of readers and writers when loading with PolyBase
3. Maximum number of concurrent queries and concurrency slots

Recommendations for when to scale DWUs:

1. Before you perform a heavy data loading or transformation operation, scale out data warehouse units to make the data available more quickly.
2. During peak business hours, scale to accommodate larger numbers of concurrent queries. 

## What if scaling out does not improve performance?

Adding data warehouse units increasing the parallelism, which only improves query performance if the work is evenly split between the Compute ndoes. If scaling out is not changing your performance, your data might be skewed across the distributions, or queries might be introducing a large amount of data movement. For investigate query performance issues, see [Performance troubleshooting](sql-data-warehouse-troubleshoot.md#performance). 

## Pausing and resuming compute
Pausing compute causes the storage layer to detach from the Compute nodes. The Compute resources are released from your account. You are not charged for compute while compute is paused. Resuming compute reattaches storage to the Compute nodes, and resumes charges for Compute.  For pause and resume steps, see the [Azure portal](pause-and-resume-compute-portal.md), or [PowerShell](pause-and-resume-compute-powershell.md) quickstarts. You can also use the [REST API for pause](sql-data-warehouse-manage-compute-rest-api.md#pause-compute) or the [REST API for resume](sql-data-warehouse-manage-compute-rest-api.md#resume-compute).
 

## Checking the database state
Each of the scale out, pause, and resume operations can take several minutes to complete. If you are scaling, pausing, or resuming automatically, we recommend implementing logic to ensure that certain operations have completed before proceeding with another action. Checking the database state through various endpoints will allow you to correctly implement automation of such operations. 

To programmatically check the database state, see the [PowerShell](quickstart-scale-compute-powershell.md#check-database-state) or [T-SQL](quickstart-scale-compute-tsql.md#check-database-state) quickstarts. You can also check the database state with this [REST API](sql-data-warehouse-manage-compute-rest-api.md#check-database-state).

The Azure portal provides notification upon completion of a scale out, pause, or resume operation, but does not provide a means for checking the database state.  and the databases current state but does not allow for programmatic checking of state. 

## Permissions

Scaling the database requires the permissions described in [ALTER DATABASE](/sql/t-sql/statements/alter-database-azure-sql-data-warehouse.md).  Pause and Resume require the [SQL DB Contributor](../active-directory/role-based-access-built-in-roles.md#sql-db-contributor) permission, specifically Microsoft.Sql/servers/databases/action.


## Next steps


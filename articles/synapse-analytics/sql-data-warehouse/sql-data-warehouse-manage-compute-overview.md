---
title: Manage compute resource for dedicated SQL pool (formerly SQL DW)
description: Learn about performance scale out capabilities for dedicated SQL pool (formerly SQL DW) in Azure Synapse Analytics. Scale out by adjusting DWUs, or lower costs by pausing the dedicated SQL pool (formerly SQL DW).
author: WilliamDAssafMSFT
ms.author: wiassaf
ms.date: 11/12/2019
ms.service: synapse-analytics
ms.subservice: sql-dw
ms.topic: conceptual
ms.custom:
  - seo-lt-2019
  - azure-synapse
---

# Manage compute for dedicated SQL pool (formerly SQL DW) in Azure Synapse Analytics

Learn about managing compute resources dedicated SQL pool (formerly SQL DW) in Azure Synapse Analytics. Lower costs by pausing the dedicated SQL pool, or scale the dedicated SQL pool to meet performance demands.

## What is compute management?

The architecture of dedicated SQL pool (formerly SQL DW) separates storage and compute, allowing each to scale independently. As a result, you can scale compute to meet performance demands independent of data storage. You can also pause and resume compute resources. A natural consequence of this architecture is that [billing](https://azure.microsoft.com/pricing/details/sql-data-warehouse/) for compute and storage is separate. If you don't need to use your dedicated SQL pool (formerly SQL DW) for a while, you can save compute costs by pausing compute.

## Scaling compute

You can scale out or scale back compute by adjusting the [data warehouse units](what-is-a-data-warehouse-unit-dwu-cdwu.md) setting for your dedicated SQL pool (formerly SQL DW). Loading and query performance can increase linearly as you add more data warehouse units.

For scale-out steps, see the [Azure portal](quickstart-scale-compute-portal.md), [PowerShell](quickstart-scale-compute-powershell.md), or [T-SQL](quickstart-scale-compute-tsql.md) quickstarts. You can also perform scale-out operations with a [REST API](sql-data-warehouse-manage-compute-rest-api.md#scale-compute).

To perform a scale operation, dedicated SQL pool (formerly SQL DW) first kills all incoming queries and then rolls back transactions to ensure a consistent state. Scaling only occurs once the transaction rollback is complete. For a scale operation, the system detaches the storage layer from the compute nodes, adds compute nodes, and then reattaches the storage layer to the Compute layer. Each dedicated SQL pool (formerly SQL DW) is stored as 60 distributions, which are evenly distributed to the compute nodes. Adding more compute nodes adds more compute power. As the number of compute nodes increases, the number of distributions per compute node decreases, providing more compute power for your queries. Likewise, decreasing data warehouse units reduces the number of compute nodes, which reduces the compute resources for queries.

The following table shows how the number of distributions per Compute node changes as the data warehouse units change.  DW30000c provides 60 Compute nodes and achieves much higher query performance than DW100c.

| Data warehouse units  | \# of compute nodes | \# of distributions per node |
| -------- | ---------------- | -------------------------- |
| DW100c   | 1                | 60                         |
| DW200c   | 1                | 60                         |
| DW300c   | 1                | 60                         |
| DW400c   | 1                | 60                         |
| DW500c   | 1                | 60                         |
| DW1000c  | 2                | 30                         |
| DW1500c  | 3                | 20                         |
| DW2000c  | 4                | 15                         |
| DW2500c  | 5                | 12                         |
| DW3000c  | 6                | 10                         |
| DW5000c  | 10               | 6                          |
| DW6000c  | 12               | 5                          |
| DW7500c  | 15               | 4                          |
| DW10000c | 20               | 3                          |
| DW15000c | 30               | 2                          |
| DW30000c | 60               | 1                          |

## Finding the right size of data warehouse units

To see the performance benefits of scaling out, especially for larger data warehouse units, you want to use at least a 1-TB data set. To find the best number of data warehouse units for your dedicated SQL pool (formerly SQL DW), try scaling up and down. Run a few queries with different numbers of data warehouse units after loading your data. Since scaling is quick, you can try various performance levels in an hour or less.

Recommendations for finding the best number of data warehouse units:

- For a dedicated SQL pool (formerly SQL DW) in development, begin by selecting a smaller number of data warehouse units.  A good starting point is DW400c or DW200c.
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

Pausing compute causes the storage layer to detach from the Compute nodes. The compute resources are released from your account. You are not charged for compute while compute is paused. Resuming compute reattaches storage to the Compute nodes, and resumes charges for Compute.
When you pause a dedicated SQL pool (formerly SQL DW):

- Compute and memory resources are returned to the pool of available resources in the data center
- Data warehouse unit costs are zero for the duration of the pause.
- Data storage is not affected and your data stays intact.
- All running or queued operations are cancelled.
- DMV counters are reset.

When you resume a dedicated SQL pool (formerly SQL DW):

- The dedicated SQL pool (formerly SQL DW) acquires compute and memory resources for your data warehouse units setting.
- Compute charges for your data warehouse units resume.
- Your data becomes available.
- After the dedicated SQL pool (formerly SQL DW) is online, you need to restart your workload queries.

If you always want your dedicated SQL pool (formerly SQL DW) accessible, consider scaling it down to the smallest size rather than pausing.

For pause and resume steps, see the [Azure portal](pause-and-resume-compute-portal.md), or [PowerShell](pause-and-resume-compute-powershell.md) quickstarts. You can also use the [pause REST API](sql-data-warehouse-manage-compute-rest-api.md#pause-compute) or the [resume REST API](sql-data-warehouse-manage-compute-rest-api.md#resume-compute).

## Drain transactions before pausing or scaling

We recommend allowing existing transactions to finish before you initiate a pause or scale operation.

When you pause or scale your dedicated SQL pool (formerly SQL DW), behind the scenes your queries are canceled when you initiate the pause or scale request. Canceling a simple SELECT query is a quick operation and has almost no impact to the time it takes to pause or scale your instance.  However, transactional queries, which modify your data or the structure of the data, may not be able to stop quickly. **Transactional queries, by definition, must either complete in their entirety or rollback their changes.** Rolling back the work completed by a transactional query can take as long, or even longer, than the original change the query was applying. For example, if you cancel a query which was deleting rows and has already been running for an hour, it could take the system an hour to insert back the rows which were deleted. If you run pause or scaling while transactions are in flight, your pause or scaling may seem to take a long time because pausing and scaling has to wait for the rollback to complete before it can proceed.

See also [Understanding transactions](sql-data-warehouse-develop-transactions.md), and [Optimizing transactions](sql-data-warehouse-develop-best-practices-transactions.md).

## Automating compute management

To automate the compute management operations, see [Manage compute with Azure functions](manage-compute-with-azure-functions.md).

Each of the scale-out, pause, and resume operations can take several minutes to complete. If you are scaling, pausing, or resuming automatically, we recommend implementing logic to ensure that certain operations have completed before proceeding with another action. Checking the dedicated SQL pool (formerly SQL DW) state through various endpoints allows you to correctly implement automation of such operations.

To check the dedicated SQL pool (formerly SQL DW) state, see the [PowerShell](quickstart-scale-compute-powershell.md#check-data-warehouse-state) or [T-SQL](quickstart-scale-compute-tsql.md#check-dedicated-sql-pool-formerly-sql-dw-state) quickstart. You can also check the dedicated SQL pool (formerly SQL DW) state with a [REST API](sql-data-warehouse-manage-compute-rest-api.md#check-database-state).

## Permissions

Scaling the dedicated SQL pool (formerly SQL DW) requires the permissions described in [ALTER DATABASE](/sql/t-sql/statements/alter-database-azure-sql-data-warehouse?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json&view=azure-sqldw-latest&preserve-view=true).  Pause and Resume require the [SQL DB Contributor](../../role-based-access-control/built-in-roles.md?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json#sql-db-contributor) permission, specifically Microsoft.Sql/servers/databases/action.

## Next steps

See the how to guide for [manage compute](manage-compute-with-azure-functions.md) Another aspect of managing compute resources is allocating different compute resources for individual queries. For more information, see [Resource classes for workload management](resource-classes-for-workload-management.md).

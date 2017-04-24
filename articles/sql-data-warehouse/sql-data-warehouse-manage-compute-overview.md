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
ms.date: 03/22/2017
ms.author: elbutter

---
# Manage compute power in Azure SQL Data Warehouse (Overview)
> [!div class="op_single_selector"]
> * [Overview](sql-data-warehouse-manage-compute-overview.md)
> * [Portal](sql-data-warehouse-manage-compute-portal.md)
> * [PowerShell](sql-data-warehouse-manage-compute-powershell.md)
> * [REST](sql-data-warehouse-manage-compute-rest-api.md)
> * [TSQL](sql-data-warehouse-manage-compute-tsql.md)
>
>

The architecture of SQL Data Warehouse separates storage and compute, allowing each to scale independently. As a result, compute can be scaled to meet performance demands independent of the amount of data. A natural consequence of this architecture is that [billing][billed] for compute and storage is separate. 

This overview describes how scale out works with SQL Data Warehouse and how to utilize the pause, resume, and scale capabilities of SQL Data Warehouse. Consult the [data warehouse units (DWUs)][data warehouse units (DWUs)] page to learn how DWUs and performance are related. 

## How compute management operations work in SQL Data Warehouse
The architecture for SQL Data Warehouse consists of a control node, compute nodes, and the storage layer spread across 60 distributions. 

During a normal active session in SQL Data Warehouse, your system's head node manages the metadata and contains the distributed query optimizer. Beneath this head node are your compute nodes and your storage layer. For a DWU 400, your system has one head node, four compute nodes, and the storage layer, consisting of 60 distributions. 

When you undergo a scale or pause operation, the system first kills all incoming queries and then rolls back transactions to ensure a consistent state. For scale operations, scaling will only occur once this transactional rollback has completed. For a scale-up operation, the system provisions the extra desired number of compute nodes, and then begins reattaching the compute nodes to the storage layer. For a scale-down operation, the unneeded nodes are released and the remaining compute nodes reattach themselves to the appropriate number of distributions. For a pause operation, all compute nodes are released and your system will undergo a variety of metadata operations to leave your final system in a stable state.

| DWU  | \#of compute nodes | \# of distributions per node |
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

The three primary functions for managing compute are:

1. Pause
2. Resume
3. Scale

Each of these operations may take several minutes to complete. If you are scaling/pausing/resuming automatically, you may want to implement logic to ensure that certain operations have been completed before proceeding with another action. 

Checking the database state through various endpoints will allow you to correctly implement automation of such operations. The portal will provide notification upon completion of an operation and the databases current state but does not allow for programmatic checking of state. 

>  [!NOTE]
>
>  Compute management functionality does not exist across all endpoints.
>
>  

|              | Pause/Resume | Scale | Check database state |
| ------------ | ------------ | ----- | -------------------- |
| Azure portal | Yes          | Yes   | **No**               |
| PowerShell   | Yes          | Yes   | Yes                  |
| REST API     | Yes          | Yes   | Yes                  |
| T-SQL        | **No**       | Yes   | Yes                  |



<a name="scale-compute-bk"></a>

## Scale compute

Performance in SQL Data Warehouse is measured in [data warehouse units (DWUs)][data warehouse units (DWUs)] which is an abstracted measure of compute resources such as CPU, memory, and I/O bandwidth. A user who wishes to scale their system's performance can do so through various means, such as through the portal, T-SQL, and REST APIs. 

### How do I scale compute?
Compute power is managed for you SQL Data Warehouse by changing the DWU setting. Performance increases [linearly][linearly] as you add more DWU for certain operations.  We offer DWU offerings that ensure that your performance will change noticeably when you scale your system up or down. 

To adjust DWUs, you can use any of these individual methods.

* [Scale compute power with Azure portal][Scale compute power with Azure portal]
* [Scale compute power with PowerShell][Scale compute power with PowerShell]
* [Scale compute power with REST APIs][Scale compute power with REST APIs]
* [Scale compute power with TSQL][Scale compute power with TSQL]

### How many DWUs should I use?

To understand what your ideal DWU value is, try scaling up and down, and running a few queries after loading your data. Since scaling is quick, you can try various performance levels in an hour or less. 

> [!Note] 
> SQL Data Warehouse is designed to process large amounts of data. To see its true capabilities for scaling, especially at larger DWUs, you want to use a large data set which approaches or exceeds 1 TB.

Recommendations for finding the best DWU for your workload:

1. For a data warehouse in development, begin by selecting a smaller DWU performance level.  A good starting point is DW400 or DW200.
2. Monitor your application performance, observing the number of DWUs selected compared to the performance you observe.
3. Determine how much faster or slower performance should be for you to reach the optimum performance level for your requirements by assuming linear scale.
4. Increase or decrease the number of DWUs in proportion to how much faster or slower you want your workload to perform. 
5. Continue making adjustments until you reach an optimum performance level for your business requirements.

> [!NOTE]
>
> Query performance only increases with more parallelization if the work can be split between compute nodes. If you find that scaling is not changing your performance, please check out our performance tuning articles to check whether your data is unevenly distributed or if you are introducing a large amount of data movement. 

### When should I scale DWUs?
Scaling DWUs alters the following important scenarios:

1. Linearly changing performance of the system for scans, aggregations, and CTAS statements
2. Increasing the number of readers and writers when loading with PolyBase
3. Maximum number of concurrent queries and concurrency slots

Recommendations for when to scale DWUs:

1. Before you perform a heavy data loading or transformation operation, scale up DWUs so that your data is available more quickly.
2. During peak business hours, scale to accommodate larger numbers of concurrent queries. 

<a name="pause-compute-bk"></a>

## Pause compute
[!INCLUDE [SQL Data Warehouse pause description](../../includes/sql-data-warehouse-pause-description.md)]

To pause a database, use any of these individual methods.

* [Pause compute with Azure portal][Pause compute with Azure portal]
* [Pause compute with PowerShell][Pause compute with PowerShell]
* [Pause compute with REST APIs][Pause compute with REST APIs]

<a name="resume-compute-bk"></a>

## Resume compute
[!INCLUDE [SQL Data Warehouse resume description](../../includes/sql-data-warehouse-resume-description.md)]

To resume a database, use any of these individual methods.

* [Resume compute with Azure portal][Resume compute with Azure portal]
* [Resume compute with PowerShell][Resume compute with PowerShell]
* [Resume compute with REST APIs][Resume compute with REST APIs]

<a name="check-compute-bk"></a>

## Check database state 

To resume a database, use any of these individual methods.

- [Check database state with T-SQL][Check database state with T-SQL]
- [Check database state with PowerShell][Check database state with PowerShell]
- [Check database state with REST APIs][Check database state with REST APIs]

## Permissions

Scaling the database requires the permissions described in [ALTER DATABASE][ALTER DATABASE].  Pause and Resume require the [SQL DB Contributor][SQL DB Contributor] permission, specifically Microsoft.Sql/servers/databases/action.

<a name="next-steps-bk"></a>

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
[data warehouse units (DWUs)]: ./sql-data-warehouse-overview-what-is.md#predictable-and-scalable-performance-with-data-warehouse-units
[billed]: https://azure.microsoft.com/en-us/pricing/details/sql-data-warehouse/
[linearly]: ./sql-data-warehouse-overview-what-is.md#predictable-and-scalable-performance-with-data-warehouse-units
[Scale compute power with Azure portal]: ./sql-data-warehouse-manage-compute-portal.md#scale-compute-power
[Scale compute power with PowerShell]: ./sql-data-warehouse-manage-compute-powershell.md#scale-compute-bk
[Scale compute power with REST APIs]: ./sql-data-warehouse-manage-compute-rest-api.md#scale-compute-bk
[Scale compute power with TSQL]: ./sql-data-warehouse-manage-compute-tsql.md#scale-compute-bk

[capacity limits]: ./sql-data-warehouse-service-capacity-limits.md

[Pause compute with Azure portal]:  ./sql-data-warehouse-manage-compute-portal.md#pause-compute-bk
[Pause compute with PowerShell]: ./sql-data-warehouse-manage-compute-powershell.md#pause-compute-bk
[Pause compute with REST APIs]: ./sql-data-warehouse-manage-compute-rest-api.md#pause-compute-bk

[Resume compute with Azure portal]:  ./sql-data-warehouse-manage-compute-portal.md#resume-compute-bk
[Resume compute with PowerShell]: ./sql-data-warehouse-manage-compute-powershell.md#resume-compute-bk
[Resume compute with REST APIs]: ./sql-data-warehouse-manage-compute-rest-api.md#resume-compute-bk

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

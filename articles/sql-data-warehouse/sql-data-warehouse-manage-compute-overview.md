<properties
   pageTitle="Manage compute power in Azure SQL Data Warehouse (Overview) | Microsoft Azure"
   description="Performance scale out capabilities in Azure SQL Data Warehouse. Scale out by adjusting DWUs or pause and resume compute resources to save costs."
   services="sql-data-warehouse"
   documentationCenter="NA"
   authors="barbkess"
   manager="barbkess"
   editor=""/>

<tags
   ms.service="sql-data-warehouse"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="data-services"
   ms.date="07/01/2016"
   ms.author="barbkess;sonyama"/>

# Manage compute power in Azure SQL Data Warehouse (Overview)

> [AZURE.SELECTOR]
- [Overview](sql-data-warehouse-manage-compute-overview.md)
- [Portal](sql-data-warehouse-manage-compute-portal.md)
- [PowerShell](sql-data-warehouse-manage-compute-powershell.md)
- [REST](sql-data-warehouse-manage-compute-rest-api.md)
- [TSQL](sql-data-warehouse-manage-compute-tsql.md)

The architecture of SQL Data Warehouse separates storage and compute, allowing each to scale independently. As a result, you can scale out performance while saving costs by only paying for performance when you need it. 

This overview describes the following performance scale-out capabilities of SQL Data Warehouse and gives recommendations on how and when to use them. 

- Scale compute power by adjusting [data warehouse units (DWUs)][]
- Pause or resume compute resources

<a name="scale-performance-bk"></a>

## Scale performance

In SQL Data Warehouse, you can quickly scale performance out or back by increasing or decreasing compute resources of CPU, memory, and I/O bandwidth. To scale performance, all you need to do is adjust the number of [data warehouse units (DWUs)][] that SQL Data Warehouse allocates to your database. SQL Data Warehouse quickly makes the change and handles all the underlying changes to hardware or software.

Gone are the days where you need to research what type of processors, how much memory or what type of storage you need to have great performance in your data warehouse. By putting your Data Warehouse in the cloud, you no longer have to deal with low-level hardware issues. Instead, SQL Data Warehouse asks you this question: how fast do you want to analyze your data? 

### How do I scale performance?

To elastically increase or decrease your compute power, simply change the [data warehouse units (DWUs)][] setting for your database. Performance will increase linearly as you add more DWU.  At higher DWU levels, you need to add more than 100 DWUs to notice a significant improvement in performance. To help you select meaningful jumps in DWUs, we offer the DWU levels that will give the best results.
 
To adjust DWUs, you can use any of these individual methods.

- [Scale compute power with Azure portal][]
- [Scale compute power with PowerShell][]
- [Scale compute power with REST APIs][]
- [Scale compute power with TSQL][]

### How many DWUs should I use?
 
Performance in SQL Data Warehouse scales linearly, and changing from one compute scale to another (say from 100 DWUs to 2000 DWUs) happens in seconds. This gives you the flexibility to experiment with different DWU settings until you determine your scenario's best fit.

To understand what your ideal DWU value is, try scaling up and down, and running a few queries after loading your data. Since scaling is quick, you can try a number of different levels of performance in an hour or less. Do keep in mind, that SQL Data Warehouse is designed to process large amounts of data and to see its true capabilities for scaling, especially at the larger scales we offer, you'll want to use a large data set which approaches or exceeds 1 TB.

Recommendations for finding the best DWU for your workload:

1. For a data warehouse in development, begin by selecting a small number of DWUs.  A good starting point is DW400 or DW200.
2. Monitor your application performance, observing the number of DWUs selected compared to the performance you observe.
3. Determine how much faster or slower performance should be for you to reach the optimum performance level for your requirements by assuming linear scale.
4. Increase or decrease the number of DWUs in proportion to how much faster or slower you want your workload to perform. The service will respond quickly and adjust the compute resources to meet the new DWU requirements.
5. Continue making adjustments until you reach an optimum performance level for your business requirements.

### When should I scale DWUs?

When you need faster results, increase your DWUs and pay for greater performance.  When you need less compute power, decrease your DWUs and pay only for what you need. 

Recommendations for when to scale DWUs:

1. If your application has a fluctuating workload, scale DWU levels up or down to accommodate peaks and low points. For example, if your workload typically peaks at the end of the month, plan to add more DWUs during those peak days, then scale down once the peak period is over.
2. Before you perform a heavy data loading or transformation operation, scale up DWUs so that your data is available more quickly.

<a name="pause-compute-bk"></a>

## Pause compute

[AZURE.INCLUDE [SQL Data Warehouse pause description](../../includes/sql-data-warehouse-pause-description.md)]

To pause a database, use any of these individual methods.

- [Pause compute with Azure portal][]
- [Pause compute with PowerShell][]
- [Pause compute with REST APIs][]

<a name="resume-compute-bk"></a>

## Resume compute

[AZURE.INCLUDE [SQL Data Warehouse resume description](../../includes/sql-data-warehouse-resume-description.md)]

To resume a database, use any of these individual methods.

- [Resume compute with Azure portal][]
- [Resume compute with PowerShell][]
- [Resume compute with REST APIs][]

<a name="next-steps-bk"></a>

## Next steps
Please refer to the following articles to help you understand some additional key performance concepts:

- [Workload and concurrency managment][]
- [Table design overview][]
- [Table distribution][]
- [Table indexing][]
- [Table partitioning][]
- [Table statistics][]
- [Best practices][]

<!--Image reference-->

<!--Article references-->
[data warehouse units (DWUs)]: ./sql-data-warehouse-overview-what-is.md#data-warehouse-units

[Scale compute power with Azure portal]: ./sql-data-warehouse-manage-compute-portal.md#scale-compute-bk
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

[Workload and concurrency managment]: ./sql-data-warehouse-develop-concurrency.md
[Table design overview]: ./sql-data-warehouse-tables-overview.md
[Table distribution]: ./sql-data-warehouse-tables-distribute.md
[Table indexing]: ./sql-data-warehouse-tables-index.md
[Table partitioning]: ./sql-data-warehouse-tables-partition.md
[Table statistics]: ./sql-data-warehouse-tables-statistics.md
[Best practices]: ./sql-data-warehouse-best-practices.md 
[development overview]: ./sql-data-warehouse-overview-develop.md

<!--MSDN references-->

<!--Other Web references-->
[Azure portal]: http://portal.azure.com/

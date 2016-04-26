<properties
   pageTitle="Overview of performance scalability for Azure SQL Data Warehouse | Microsoft Azure"
   description="Understand SQL Data Warehouse elasticity using Data Warehouse Units to scale compute resources up and down."
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
   ms.date="04/25/2016"
   ms.author="barbkess;sonyama"/>

# Performance scalability overview for Azure SQL Data Warehouse

The architecture of SQL Data Warehouse separates storage and compute, allowing each to scale independently. As a result, you can scale out performance while saving costs costs by only paying for performance when you need it. 

This overview describes the following performance scale-out capabilities of SQL Data Warehouse and gives recommendations on how and when to use them. 

- Scale performance with data warehouse units (DWUs)
- Pause or resume compute resources

## Scale performance with DWUs

In SQL Data Warehouse, you can quickly increase or decrease compute resources such as CPU, memory, and I/O bandwidth. To do this, all you need to do is adjust the number of data warehouse units (DWUs) that SQL Data Warehouse allocates to your database. When you scale out or scale back compute, SQL Data Warehouse handles all the underlying changes to hardware or software.

>[AZURE.NOTE] Gone are the days where you need to research what type of processors, how much memory or what type of storage you need to have great performance in your data warehouse. By putting your Data Warehouse in the cloud, you no longer have to deal with low-level hardware issues. Instead, SQL Data Warehouse asks you this question: how fast do you want to analyze your data? 

### What is a DWU?

A *data warehouse unit* (DWU) is a measure of the underlying compute capabilities for your database at any given time. As the number of DWUs increases, SQL Data Warehouse runs operations in parallel (e.g. data load or query) across more distributed CPU and memory resources. This reduces latency and improves performance.

DWUs are based on load and scan rates. As you increase DWUs, you increase load rate and scan rate. 

- **Load rate**. The number of records that SQL Data Warehouse can ingest per second. Specifically, this is the number of records that SQL Data Warehouse can import from Azure blob storage to a clustered columnstore index by using PolyBase. 

- **Scan rate**. The number of records that a query can retrieve from SQL Data Warehouse per second. Specifically, this is the number of records that SQL Data Warehouse can return by running a data warehousing query on a clustered columnstore index. To test the scan rate, we use a standard data warehousing query that scans a large number of rows and then performs a complex aggregation; This is a IO and CPU intensive operation.

>[AZURE.NOTE] We’re measuring and making important performance enhancements and will soon share the expected rates. During preview we will make continuous enhancements (e.g. increasing compression and caching) to increase these rates and to ensure they scale predictably.  

For a list of the DWUs, see the Service Level Objectives in the [capacity limits][] article.

### How do I scale compute?

To elastically increase or decrease your compute power, simply change the Data Warehouse Units (DWUs) setting for your database. Behind the scenes, SQL Data Warehouse changes CPU and memory allocations by using SQL Database's quick and simple deployment capabilities.

DWUs are allocated in blocks of 100, but not all blocks are available. As DWUs increase performance increases linearly. At higher DWU levels, you need to add more than 100 DWUs to notice a significant improvement in performance. To help you select meaningful jumps in DWUs, we offer the DWU levels that will give the best results.
 
To adjust DWUs, you can use any of these individual methods.

- [Scale DWUs with Azure portal][]
- [Scale DWUs with PowerShell][]
- [Scale DWUs with REST APIs][]


### How many DWUs should I use?
 
Performance in SQL Data Warehouse scales linearly, and changing from one compute scale to another (say from 100 DWUs to 2000 DWUs) happens in seconds. This gives you the flexibility to experiment with different DWU settings until you determine your scenario's best fit.    

> [AZURE.NOTE] You might not see expected performance scaling at lower data volumes. We recommend starting with data volumes at or above 1 TB in order to get accurate performance testing results.

Recommendations for finding the best DWU for your situation:

1. For a data warehouse in development, begin by selecting small number of DWUs.
2. Monitor your application performance, observing the number of DWUs selected compared to the performance you observe.
3. Determine how much faster or slower performance should be for you to reach the optimum performance level for your requirements by assuming linear scale.
4. Increase or decrease the number of DWUs in proportion to how much faster or slower you want your workload to perform. The service will respond quickly and adjust the compute resources to meet the new DWU requirements.
5. Continue making adjustments until you reach an optimum performance level for your business requirements.


### When should I scale DWUs?

Overall, we want DWUs to be simple. When you need faster results, increase your DWUs and pay for greater performance.  When you need less compute power, decrease your DWUs and pay only for what you need. 

Recommendations for when to scale DWUs:

1. If your application has a fluctuating workload, scale DWU levels up or down to accommodate peaks and low points. For example, if your workload typically peaks at the end of the month, plan to add more DWUs during those peak days, then scale down once the peak period is over.
1. Before you perform a heavy data loading or transformation operation, scale up DWUs so that your data is available more quickly.


## Pause a database

[AZURE.INCLUDE [SQL Data Warehouse pause description](../../includes/sql-data-warehouse-pause-description.md)]

To pause a database, use any of these individual methods.

- [Pause with Azure portal][]
- [Pause with PowerShell][]
- [Pause with REST APIs][]


## Resume a database

[AZURE.INCLUDE [SQL Data Warehouse resume description](../../includes/sql-data-warehouse-resume-description.md)]

To pause a database, use any of these individual methods.

- [Resume with Azure portal][]
- [Resume with PowerShell][]
- [Resume with REST APIs][]


## Next steps
Please refer to the following articles to help you understand some additional key performance and scale concepts:

- [performance and scale][]
- [concurrency model][]
- [designing tables][]
- [choose a hash distribution key for your table][]
- [statistics to improve performance][]

<!--Image references-->

<!--Article references-->
[Scale DWUs with Azure portal]: ./sql-data-warehouse-manage-scale-out-tasks.md
[Scale DWUs with PowerShell]: ./sql-data-warehouse-manage-scale-out-tasks-powershell.md
[Scale DWUs with REST APIs]: ./sql-data-warehouse-manage-scale-out-tasks-rest-api.md
[capacity limits]: ./sql-data-warehouse-service-capaticy-limits#service.md
[Pause with Azure portal]:  ./sql-data-warehouse-manage-scale-out-tasks#task-1-pause-compute.md
[Pause with PowerShell]: ./sql-data-warehouse-manage-scale-out-tasks-powershell#task-1-pause-compute.md
[Pause with REST APIs]: ./sql-data-warehouse-manage-scale-out-tasks-rest-api#task-1-pause-compute.md
[Resume with Azure portal]:  ./sql-data-warehouse-manage-scale-out-tasks#task-1-resume-compute.md
[Resume with PowerShell]: ./sql-data-warehouse-manage-scale-out-tasks-powershell#task-1-resume-compute.md
[Resume with REST APIs]: ./sql-data-warehouse-manage-scale-out-tasks-rest-api#task-1-resume-compute.md



[performance and scale]: sql-data-warehouse-performance-scale.md
[concurrency model]: sql-data-warehouse-develop-concurrency.md
[designing tables]: sql-data-warehouse-develop-table-design.md
[choose a hash distribution key for your table]: sql-data-warehouse-develop-hash-distribution-key.md
[statistics to improve performance]: sql-data-warehouse-develop-statistics.md
[development overview]: sql-data-warehouse-overview-develop.md



<!--MSDN references-->


<!--Other Web references-->

[Azure portal]: http://portal.azure.com/

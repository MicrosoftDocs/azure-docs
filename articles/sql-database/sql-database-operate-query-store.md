<properties
   pageTitle="Operating Query Store in Azure SQL Database"
   description="Learn how to operate the Query Store in Azure SQL Database"
   keywords=""
   services="sql-database"
   documentationCenter=""
   authors="CarlRabeler"
   manager="jhubbard"
   editor=""/>

<tags
   ms.service="sql-database"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="sqldb-performance"
   ms.workload="data-management"
   ms.date="05/25/2016"
   ms.author="carlrab"/>

# Operating the Query Store in Azure SQL Database 

Query Store in Azure is a fully managed database feature that continuously collects and presents detailed historic information about all queries. You can think about Query Store as similar to an airplane's flight data recorder that significantly simplifies query performance troubleshooting both for cloud and on-premises customers. This article explains specific aspects of operating Query Store in Azure. Using this pre-collected query data, users can quickly diagnose and resolve performance problems and thus spend more time focusing on their business. 

Query Store has been [globally available](https://azure.microsoft.com/updates/general-availability-azure-sql-database-query-store/) in Azure SQL Database since November, 2015. Query Store is the foundation for performance analysis and tuning features, such as [SQL Database Advisor and Performance Dashboard](https://azure.microsoft.com/updates/sqldatabaseadvisorga/). At the moment of publishing this article, Query Store is running in more than 200,000 user databases in Azure, collecting query related information for several months, without interruption.

> [AZURE.IMPORTANT] Microsoft is in the process of activating Query Store for all Azure SQL databases (existing and new). This activation process currently includes only singleton databases, but will expand to Elastic Pool databases in the near future.  When using Elastic Pools, enable Query Store for only the small subset of databases. Enabling Query Store for all databases in an Elastic Pool can lead to excessive resource usage and could make your system unresponsive. 

## Query Store as a managed feature in Azure SQL Database

Query Store operates in Azure SQL Database based on these two fundamental principles:

- Cause no visible impact on the customer workload
- Continuously monitor queries unless a customer workload is affected

Impact on the customer workload has two dimensions:

- ***Availability***: The [SLA for SQL Database](https://azure.microsoft.com/support/legal/sla/sql-database/v1_0/) is not reduced when Query Store is running.
- ***Performance***: The average overhead introduced by the Query Store is typically in range of 1-2%

Query Store in Azure operates using limited resources (CPU, memory, disk I/O, size on disk, etc). It respects various system limitations in order to minimally affect regular workload:

- ***Static limitations;*** Limitations imposed by the resource capacity of a given service tier (Basic, Standard, Premium, Elastic Pool).
- ***Dynamic limitations:*** Limitations imposed by the current workload consumption (i.e. available resources).

To ensure continuous and reliable operation, Azure SQL Database has built a permanent monitoring infrastructure around Query Store that collects key operational data from every database. As a result, several technical KPIs are being constantly monitored in order to ensure reliability:

- Number of exceptions and automatic mitigations
- Number of databases in READ_ONLY state and duration of READ_ONLY state
- Top databases with Query Store memory consumption above the limit.
- Top databases per automatic cleanup frequency and duration
- Top databases per duration of loading data to memory (Query Store initialization)
- Top databases per duration of flushing data to disk

Azure SQL Database uses collected data to:

- ***Learn usage patterns on a large number of databases and consequently improve feature reliability and quality:*** Query Store is improved with every update of Azure SQL Database. 
- ***Solve or mitigate issues caused by the Query Store:*** Azure SQL Database can detect and mitigate issues having substantial impact on the customer workload, with low latency (less than an hour). Most frequently, issues are handled by setting Query Store to ***OFF*** temporarily.

From time to time, Query Store updates introduce changes to the defaults applied to internal and rarely external (customer-facing) configurations. Consequently, the customer experience with Query Store on Azure SQL Database can differ from on–premise environments because of the automatic actions performed by the Azure platform:

- Query Store state can be changed to ***OFF*** to mitigate issues and back to ***ON*** when the problem is solved.
- Query Store configuration can be changed to ensure reliable work. This can be performed as:
    - Individual database changes that address instability or unreliability issues.
    - Global rollout of optimal configuration changes providing benefits to all databases using Query Store.

Turning Query Store ***OFF*** is an automatic action that scoped to individual databases. It occurs when there is a product behavior that negatively impacts user database(s) for which the detection mechanism fired an alert. For that particular database, Query Store remains ***OFF*** until a new version with the improved Query Store implementation becomes available. When a transition to the ***OFF*** state occurs, the customer is informed over e-mail and advised to refrain from re-enabling Query Store until a new version is rolled out. After a new rollout, Azure SQL Database infrastructure automatically activates Query Store for any database for which it was set to ***OFF***. 

Less frequently, Azure SQL Database may enforce new configuration defaults for all user databases, optimized for reliable work and continuous data collection. 

## Optimal Query Store Configuration

This section describes optimal configuration defaults which are designed to ensure reliable operation of the Query Store as well as dependent features, such as [SQL Database Advisor and Performance Dashboard](https://azure.microsoft.com/updates/sqldatabaseadvisorga/). Default configuration is optimized for continuous data collection, i.e. minimal time spent in OFF/READ_ONLY states.

| Configuration | Description | Default | Comment |
| ------------- | ----------- | ------- | ------- |
| MAX_STORAGE_SIZE_MB | Specifies the limit for the data space that Query Store will take inside customer database | 100 | Enforced for new databases |
| INTERVAL_LENGTH_MINUTES | Defines size of time window during which collected runtime statistics for query plans are aggregated and persisted. Every active query plan will have at most one row for a period of time defined with this configuration | 60	| Enforced for new databases |
| STALE_QUERY_THRESHOLD_DAYS | Time-based cleanup policy that controls the retention period of persisted runtime statistics and inactive queries | 30 | Enforced for new databases and databases with previous default (367) |
| SIZE_BASED_CLEANUP_MODE | Specifies whether automatic data cleanup will take place when Query Store data size approaches the limit | AUTO | Enforced for all databases |
| QUERY_CAPTURE_MODE | Specifies whether all queries or only a subset of queries will be tracked | AUTO | Enforced for all databases |
| FLUSH_INTERVAL_SECONDS | Specifies maximum period during which captured runtime statistics will be kept in memory, before flushing to disk | 900 | Enforced for new databases |
||||||

> [AZURE.IMPORTANT] These defaults will be automatically applied in the final stage of Query Store activation in all Azure SQL databases (see important note above). After this light up, Azure SQL Database won’t be changing configuration values set by customers, unless they negatively impact primary workload or reliable operations of the Query Store.

If you want to stay with your custom settings, use [ALTER DATABASE with Query Store options](https://msdn.microsoft.com/library/bb522682.aspx) to revert configuration to the previous state. Check out [Best Practices with the Query Store](https://msdn.microsoft.com/library/mt604821.aspx) to learn how top chose optimal configuration parameters.

## Next steps

[SQL Database Performance Insight](sql-database-performance.md)

## Additional resources

For more information check out the following articles:

- [A flight data recorder for your database](https://azure.microsoft.com/blog/query-store-a-flight-data-recorder-for-your-database) 

- [Monitoring Performance By Using the Query Store](https://msdn.microsoft.com/library/dn817826.aspx)

- [Query Store Usage Scenarios](https://msdn.microsoft.com/library/mt614796.aspx)

- [Monitoring Performance By Using the Query Store](https://msdn.microsoft.com/library/dn817826.aspx) 

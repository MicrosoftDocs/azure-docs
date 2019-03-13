---
title: Operating Query Store in Azure SQL Database
description: Learn how to operate the Query Store in Azure SQL Database
services: sql-database
ms.service: sql-database
ms.subservice: performance
ms.custom: 
ms.devlang: 
ms.topic: conceptual
author: bonova
ms.author: bonova
ms.reviewer: jrasnik, carlrab
manager: craigg
ms.date: 12/19/2018
---
# Operating the Query Store in Azure SQL Database

Query Store in Azure is a fully managed database feature that continuously collects and presents detailed historic information about all queries. You can think about Query Store as similar to an airplane's flight data recorder that significantly simplifies query performance troubleshooting both for cloud and on-premises customers. This article explains specific aspects of operating Query Store in Azure. Using this pre-collected query data, you can quickly diagnose and resolve performance problems and thus spend more time focusing on their business. 

Query Store has been [globally available](https://azure.microsoft.com/updates/general-availability-azure-sql-database-query-store/) in Azure SQL Database since November, 2015. Query Store is the foundation for performance analysis and tuning features, such as [SQL Database Advisor and Performance Dashboard](https://azure.microsoft.com/updates/sqldatabaseadvisorga/). At the moment of publishing this article, Query Store is running in more than 200,000 user databases in Azure, collecting query-related information for several months, without interruption.

> [!IMPORTANT]
> Microsoft is in the process of activating Query Store for all Azure SQL databases (existing and new). 

## Optimal Query Store Configuration

This section describes optimal configuration defaults that are designed to ensure reliable operation of the Query Store and dependent features, such as [SQL Database Advisor and Performance Dashboard](https://azure.microsoft.com/updates/sqldatabaseadvisorga/). Default configuration is optimized for continuous data collection, that is minimal time spent in OFF/READ_ONLY states.

| Configuration | Description | Default | Comment |
| --- | --- | --- | --- |
| MAX_STORAGE_SIZE_MB |Specifies the limit for the data space that Query Store can take inside the customer database |100 |Enforced for new databases |
| INTERVAL_LENGTH_MINUTES |Defines size of time window during which collected runtime statistics for query plans are aggregated and persisted. Every active query plan has at most one row for a period of time defined with this configuration |60 |Enforced for new databases |
| STALE_QUERY_THRESHOLD_DAYS |Time-based cleanup policy that controls the retention period of persisted runtime statistics and inactive queries |30 |Enforced for new databases and databases with previous default (367) |
| SIZE_BASED_CLEANUP_MODE |Specifies whether automatic data cleanup takes place when Query Store data size approaches the limit |AUTO |Enforced for all databases |
| QUERY_CAPTURE_MODE |Specifies whether all queries or only a subset of queries are tracked |AUTO |Enforced for all databases |
| FLUSH_INTERVAL_SECONDS |Specifies maximum period during which captured runtime statistics are kept in memory, before flushing to disk |900 |Enforced for new databases |
|  | | | |

> [!IMPORTANT]
> These defaults are automatically applied in the final stage of Query Store activation in all Azure SQL databases (see preceding important note). After this light up, Azure SQL Database won’t be changing configuration values set by customers, unless they negatively impact primary workload or reliable operations of the Query Store.

If you want to stay with your custom settings, use [ALTER DATABASE with Query Store options](https://msdn.microsoft.com/library/bb522682.aspx) to revert configuration to the previous state. Check out [Best Practices with the Query Store](https://msdn.microsoft.com/library/mt604821.aspx) in order to learn how top chose optimal configuration parameters.

## Next steps

[SQL Database Performance Insight](sql-database-performance.md)

## Additional resources

For more information check out the following articles:

- [A flight data recorder for your database](https://azure.microsoft.com/blog/query-store-a-flight-data-recorder-for-your-database)
- [Monitoring Performance By Using the Query Store](https://msdn.microsoft.com/library/dn817826.aspx)
- [Query Store Usage Scenarios](https://msdn.microsoft.com/library/mt614796.aspx)

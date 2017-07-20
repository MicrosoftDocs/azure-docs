---
title: SQL Database - automatic tuning | Microsoft Docs
description: SQL Database analyzes SQL query and automaticaly adapts to user workload.
services: sql-database
documentationcenter: ''
author: jovanpop-msft
manager: jhubbard
editor: ''

ms.assetid: 
ms.service: sql-database
ms.custom: monitor & tune
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 06/05/2017
ms.author: jovanpop

---
# Automatic tuning

Azure SQL Database is a fully managed data service that monitors the queries that are executed on the database and can automatically improve performance of the workload. Azure SQL Database has a built-in intelligence mechanism that can automatically tune and improve performance of your queries by dynamically adapting the database to your workload. Automatic tuning in Azure SQL Database might be one of the most important features that you can enable on Azure SQL Database to optimize performance of your queries.

See this article for the steps to [enable automatic tuning](sql-database-automatic-tuning-enable.md) using the Azure portal.

## Why automatic tuning?

One of the main tasks in classic database administration is monitoring the workload, identifying critical SQL queries, indexes that should be added to improve performance, and rarely used indexes. Azure SQL Database provides detailed insight into the queries and indexes that you need to monitor. However, constantly monitoring database is a hard and tedious task, especially when dealing with many databases. Managing a huge number of databases might be impossible to do efficiently even with all available tools and reports that Azure SQL Database and Azure portal provide. Instead of monitoring and tuning your database manually, you might consider delegating some of the monitoring and tuning actions to Azure SQL Database using automatic tuning feature. 


> [!VIDEO https://channel9.msdn.com/Blogs/Azure-in-the-Enterprise/Enabling-Azure-SQL-Database-Auto-Tuning-at-Scale-for-Microsoft-IT/player]
>

## How does automatic tuning work?

Azure SQL Database has a continuous performance monitoring and analysis process that constantly learns about the characteristic of your workload and identify potential issues and improvements.

![Automatic tuning process](./media/sql-database-automatic-tuning/tuning-process.png)

This process enables Azure SQL Database to dynamically adapt to your workload by finding what indexes and plans might improve performance of your workloads and what indexes affect your workloads. Based on these findings, automatic tuning applies tuning actions that improve performance of your workload. In addition, Azure SQL Database continuously monitors performance after any change made by automatic tuning to ensure that it improves performance of your workload. Any action that didn’t improve performance is automatically reverted. This verification process is a key feature that ensures that any change made by automatic tuning does not decrease the performance of your workload.

There are two automatic tuning aspects that are available in Azure SQL Database:

 -	**Automatic index management** that identifies indexes that should be added in your database, and indexes that should be removed.
 -	**Automatic plan correction** (coming soon, already available in SQL Server 2017) that identifies problematic plans and fixes SQL plan performance problems.

## Automatic index management

In Azure SQL Database, index management is easy because Azure SQL Database learns about your workload and ensures that your data is always optimally indexed. Proper index design is crucial for optimal performance of your workload, and automatic index management can help you optimize your indexes. Automatic index management can either fix performance issues in incorrectly indexed databases, or maintain and improve indexes on the existing database schema. 

### Why do you need index management?

Indexes speed up some of your queries that read data from the tables; however, they can slow down the queries that update data. You need to carefully analyze when to create an index and what columns you need to include in the index. Some indexes might not be needed after some time. Therefore, you would need to periodically identify and drop the indexes that do not bring any benefits. If you ignore the unused indexes, performance of the queries that update data would be decreased without any benefit on the queries that read data. Unused indexes also affect overall performance of the system because additional updates require unnecessary logging.

Finding the optimal set of indexes that improve performance of the queries that read data from your tables and have minimal impact on updates might require continuous and complex analysis.

Azure SQL Database uses built-in intelligence and advanced rules that analyze your queries, identify indexes that would be optimal for your current workloads, and the indexes might be removed. Azure SQL Database ensures that you have a minimal necessary set of indexes that optimize the queries that read data, with the minimized impact on the other queries.

### How to identify indexes that need to be changed in your database?

Azure SQL Database makes index management process easy. Instead of the tedious process of manual workload analysis and index monitoring, Azure SQL Database analyzes your workload, identifies the queries that could be executed faster with a new index, and identifies unused or duplicated indexes. Find more information about identification of indexes that should be changed at [Find index recommendations in Azure portal](sql-database-advisor-portal.md).

### Automatic index management considerations

If you find that the built-in rules improve the performance of your database, you might let Azure SQL database automatically manage your indexes.

Actions required to create necessary indexes in Azure SQL Databases might consume resources and temporally affect workload performance. To minimize the impact of index creation on workload performance, Azure SQL Database finds the appropriate time window for any index management operation. Tuning action is postponed if the database needs resources to execute your workload, and started when the database has enough unused resources that can be used for the maintenance task. One important feature in automatic index management is a verification of the actions. When Azure SQL Database creates or drops index, a monitoring process analyzes performance of your workload to verify that the action improved the performance. If it didn’t bring significant improvement – the action is immediately reverted. This way, Azure SQL Database ensures that automatic actions do not negatively impact performance of your workload. Indexes created by automatic tuning are transparent for the maintenance operation on the underlying schema. Schema changes such as dropping or renaming columns are not blocked by the presence of automatically created indexes. Indexes that are automatically created by Azure SQL Database are immediately dropped when related table or columns is dropped.

## Automatic plan choice correction

Automatic plan correction is a new automatic tuning feature added in SQL Server 2017 CTP2.0 that identifies SQL plans that misbehave. This automatic tuning option is coming soon on Azure SQL Database. Find more information at [Automatic tuning in SQL Server 2017](https://docs.microsoft.com/sql/relational-databases/automatic-tuning/automatic-tuning).

## Next steps

- To enable automatic tuning in Azure SQL Database and let automatic tuning feature fully manage your workload, see [Enable automatic tuning](sql-database-automatic-tuning-enable.md).
- To use manual tuning, you can review [Tuning recommendations in Azure portal](sql-database-advisor-portal.md) and manually apply the ones that improve performance of your queries.

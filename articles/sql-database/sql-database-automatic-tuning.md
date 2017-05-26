---
title: SQL Database backups - automatic tuning | Microsoft Docs
description: SQL Database analizes SQL query and automaticaly adapts to user workload.
services: sql-database
documentationcenter: ''
author: jovanpop-msft
manager: jhubbard
editor: ''

ms.assetid: 3ee3d49d-16fa-47cf-a3ab-7b22aa491a8d
ms.service: sql-database
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 26/05/2017
ms.author: jovanpop

---
# Automatic tuning

Azure SQL Database is **fully managed data service** that monitors the queries that are executed on the database and automatically improve
performance of the workload. Azure SQL Database has a built-in intelligence mechanism that can automatically tune and improve
performance of your queries by dynamically adapting the database to your workload. **Automatic tuning** in Azure SQL Database might be one
of the most important features that you can enable on Azure SQL Database to optimize performance of your queries.

## Why automatic tuning?

One of the main tasks in classic database administration is monitoring workload, identifying critical SQL queries and plans, indexes that
should be added to improve performance of the queries, rarely used indexes that should be removed, heavily fragmented indexes that should
be rebuild, etc.
Azure SQL Database provides detailed insight into the queries and indexes that you need to monitor. However, constantly monitoring
database is a hard and tedious task, especially when dealing with many databases. Managing a huge number of databases might be impossible
to do efficiently even with all available tools and reports that Azure SQL Database and Azure portal provides.
This is the reason why you might consider delegating some of the monitoring and tuning actions to Azure SQL Database using Automatic
tuning feature. 

## How automatic tuning works?

Azure SQL Database has a continuous performance monitoring and analysis process that constantly **learns** about the characteristic of your
workload and identify potential issues and improvements.

![Automatic tuning process](media/sq-database-automatic-tuning/tuning-process.png "Automatic tuning process")

This process enables Azure SQL Database to dynamically **adapt** to your workload by finding what indexes might be useful to improve
performance of your workloads, what indexes affect your workloads, how to find optimal plans, etc. Based on these findings, **Automatic
tuning will apply tuning action that will improve performance** of your workload.
In addition, Azure SQL Database will continuously monitor performance after any change made by automatic tuning to ensure that it will
improve performance of your workload. Any action that didn’t improve performance will be automatically reverted. This verification
process is a key feature that ensures that any change made by automatic tuning feature will not have a negative impact on the performance
of your workload.

There are two automatic tuning features that are available in Azure SQL Database:
 -	*Automatic index management* that identifies indexes that should be added in your database, and indexes that should be removed.
 -	*Automatic plan correction* (coming soon, already available in SQL Server 2017) that identifies problematic plans and fixes SQL plan performance problems.

These features will be described in the following sections.

# Automatic Index management

In Azure SQL Database, index management is easy because Azure SQL Database learns about your workload and ensures that your data is
always optimally indexed.
Proper index design is crucial for optimal performance of your workload, and automatic index management can help you optimize your
indexes. Automatic index management can either fix performance issues in incorrectly indexed databases, or maintain and improve indexes
on the existing database schema.

## Why do you need index management?

Indexes speed up some of your queries that read data from the tables; however, they might slowdown the queries that update data. You need
to carefully analyze when to create a new index and what columns you need to include in the index. Some indexes might not be needed after
some time; therefore, you would need to periodically identify and drop them if they bring no benefits. If you ignore the unused indexes,
performance of the queries that update data would be decreased without any benefit on the queries that read data. Unused indexes also
affect overall performance of the system because additional updates require unnecessary logging.

Finding the optimal set of indexes that will improve performance of the queries that read data from your tables that at the same time
minimally impact updates, might require continuous and very complex analysis.

Azure SQL Database uses built-in intelligence and advanced rules that analyze your queries, identify what kind of indexes would be
optimal for your current workloads, and what indexes might be removed. This way, Azure SQL Database ensures that you have a minimal
necessary set of indexes that optimize most of your queries that read data, with the minimized impact on the queries that updates.

### How to identify indexes that need to be changed in your database?

Azure SQL Database makes index management process easy. Instead of the tedious process of manual workload analysis and index monitoring,
Azure SQL Database analyzes your workload, identifies the queries that could be executed faster if you create an index, identifies
indexes that are not used in a longer period, and identifies duplicated indexes in the database.
Find more information about identificaiton of indexes that should be changed at
[HOW TO: Identify missing indexes in Azure portal](sql-database-advisor-portal.md).

### Automatic index management

If you find that the built-in rules improve the performance of your database or if you have many recommendations that you need to review
and execute – you might let Azure SQL database automatically manage your indexes, decide when to create necessary indexes and remove
unused indexes.

Find more information about Enabling automatic index management at HOW TO: enable Automatic tuning.
Actions required to create necessary indexes in Azure SQL Databases might consume resources and temporally affect workload performance.
To minimize the impact of index creation on workload performance, Azure SQL Database will find the appropriate time window for any index
management operation. **Tuning action will be postponed if Azure SQL Database consumes a lot of resources** to execute your standard
workload, and they will be started when the database has enough unused resources that can be used for the maintenance task. 
One important feature in Automatic index management is a verification of the actions. When Azure SQL Database executes create index or
drop index action, a monitoring process analyzes performance of your workload, and analyzes if the action improved the performance.
**If it didn’t bring significant improvement – the action will be immediately reverted**. This way, Azure SQL Database ensures that automatic
actions will not negatively affect performance of your workload.
**Indexes created by Automatic tuning are transparent** for the maintenance operation on the underlying schema. Schema changes such as
dropping or renaming columns will not be blocked by the presence of automatically created indexes. Indexes that are automatically
created by Azure SQL Database will be immediately dropped when related table or columns is dropped.

## Automatic plan choice correction

Automatic plan correction is a new automatic tuning feature added in SQL Server 2017 CTP2.0 that identifies SQL plans that misbehaves.
This automatic tuning option is coming soon on Azure SQL Database. 
Find more information at [Automatic Tuning in SQL Server 2017](https://docs.microsoft.com/en-us/sql/relational-databases/automatic-tuning/automatic-tuning).

## Next steps

Enable automatic tuning in Azure SQL Database and let Automatic tuning feature fully manage your workload. As an alternative, you can review
[Tuning recommendations in Azure portal](sql-database-advisor-portal.md) and manually apply the ones that will improve performance of your queries.
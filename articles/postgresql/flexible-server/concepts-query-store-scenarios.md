---
title: Query Store scenarios - Azure Database for PostgreSQL - Flex Server
description: This article describes some scenarios for Query Store in Azure Database for PostgreSQL - Flex Server.
author: ssen-msft
ms.author: ssen
ms.service: postgresql
ms.topic: conceptual
ms.date: 04/01/2021
---
# Usage scenarios for Query Store - Flexible Server

**Applies to:** Azure Database for PostgreSQL - Single Server versions 11, 12

You can use Query Store in a wide variety of scenarios in which tracking and maintaining predictable workload performance is critical. Consider the following examples: 
- Identifying and tuning top expensive queries 
- A/B testing 
- Keeping performance stable during upgrades 
- Identifying and improving ad hoc workloads 

## Identify and tune expensive queries 

### Identify longest running queries 
Use Query Store views on the azure_sys database of your server to quickly identify the longest running queries. These queries typically tend to consume the most resources. Optimizing your longest running queries can improve performance by freeing up resources used by other queries running on your system. 

### Target queries with performance deltas 
Query Store slices the performance data into time windows, so you can track a query's performance over time. This helps you identify exactly which queries are contributing to an increase in overall time spent. As a result you can do targeted troubleshooting of your workload.

### Tuning expensive queries 
When you identify a query with suboptimal performance, the action you take depends on the nature of the problem: 
- Make sure that the statistics are up-to-date for the underlying tables used by the query.
- Consider rewriting expensive queries. For example, take advantage of query parameterization and reduce the use of dynamic SQL. Implement optimal logic when reading data like applying data filtering on database side, not on application side. 


## A/B testing 
Use Query Store to compare workload performance before and after an application change you plan to introduce or before and after migration. Example scenarios for using Query Store to assess the impact of changes to workload performance: 
- Migration between PostgreSQL versions. 
- Rolling out a new version of an application. 
- Adding additional resources to the server. 
- Creating missing indexes on tables referenced by expensive queries. 
- Migration from Single Server to Flex Server. 
 
In any of these scenarios, apply the following workflow: 
1. Run your workload with Query Store before the planned change to generate a performance baseline. 
2. Apply application change(s) at the controlled moment in time. 
3. Continue running the workload long enough to generate performance image of the system after the change. 
4. Compare results from before and after the change. 
5. Decide whether to keep the change or rollback. 


## Identify and improve ad hoc workloads 
Some workloads do not have dominant queries that you can tune to improve overall application performance. Those workloads are typically characterized with a relatively large number of unique queries, each of them consuming a portion of system resources. Each unique query is executed infrequently, so individually their runtime consumption is not critical. On the other hand, given that the application is generating new queries all the time, a significant portion of system resources is spent on query compilation, which is not optimal. Usually, this situation happens if your application generates queries (instead of using stored procedures or parameterized queries) or if it relies on object-relational mapping frameworks that generate queries by default. 
 
If you are in control of the application code, you may consider rewriting the data access layer to use stored procedures or parameterized queries. However, this situation can be also be improved without application changes by forcing query parameterization for the entire database (all queries) or for the individual query templates with the same query hash. 

## Next steps
- Learn more about the [best practices for using Query Store](concepts-query-store-best-practices.md)

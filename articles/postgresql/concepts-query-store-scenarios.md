---
title: Query Store usage scenarios in Azure Database for PostgreSQL
description: This article describes some scenarios for the Query Store in Azure Database for PostgreSQL.
services: postgresql
author: rachel-msft
ms.author: raagyema
ms.service: postgresql
ms.topic: conceptual
ms.date: 09/24/2018
---
# usage scenarios for Query Store

> [!IMPORTANT]
> The Query Store feature is in Public Preview.

Applies to: Azure Database for PostgreSQL 9.6 and 10
 
You can use Query Store in a wide variety of scenarios in which tracking and maintaining predictable workload performance is critical. Consider the following examples: 
- Identifying and tuning top expensive queries 
- A/B testing 
- Keeping performance stable during upgrades 
- Identifying and improving ad hoc workloads 

## Identify and tune expensive queries 

### Identify longest running queries 
Use the [Query Performance Insight](concepts-query-performance-insight.md) view in the Azure portal to quickly identify the longest running queries. These queries typically tend to consume a significant amount resources, so optimizing your longest running questions can improve performance by freeing up resources for use by other queries running on your system. 
 
### Identify top resource-consuming queries 
Although your workload may generate thousands of queries, typically only a handful consumes the most system resources. Those are the ones that require your attention. Among top resource-consuming queries, you may find queries that have either regressed or can be improved with additional tuning. 
 
The easiest way to identify the top resource-consuming queries is to run a query on the **azure_sys** database on your server: 
```SQL
SELECT * FROM query_store.qs_view  
WHERE start_time > '2018-09-01 00:00:00+00' 
ORDER BY shared_blks_read DESC 
```

The above query searches for top shared_blks_read usage since 1 September 2018. 

### Tuning expensive queries 
When you identify a query with suboptimal performance, the action you take depends on the nature of the problem: 
- Use [Performance Recommendations](concepts-performance-recommendations.md) to determine if there are any suggested indexes. If yes, create the index, and then use Query Store to evaluate query performance after creating the index. 
- Make sure that the statistics are up-to-date for the underlying tables used by the query.
- Consider rewriting expensive queries. For example, take advantage of query parameterization and reduce use of dynamic SQL. Implement optimal logic when reading data like applying data filtering on database side, not on application side. 


## A/B testing 
Use Query Store to compare workload performance before and after an application change you plan to introduce. Examples of scenarios for using Query Store to assess the impact of the environment or application change to workload performance: 
- Rolling out a new version of an application. 
- Adding additional resources to the server. 
- Creating missing indexes on tables referenced by expensive queries. 
 
In any of these scenarios, apply the following workflow: 
1. Run your workload with Query Store before the planned change to generate a performance baseline. 
2. Apply application change(s) at the controlled moment in time. 
3. Continue running the workload long enough to generate performance image of the system after the change. 
4. Compare results from before and after the change. 
5. Decide whether to keep the change or rollback. 


## Identify and improve ad hoc workloads 
Some workloads do not have dominant queries that you can tune to improve overall application performance. Those workloads are typically characterized with a relatively large number of unique queries, each of them consuming a portion of system resources. Each unique query is executed infrequently, so their runtime consumption is not critical. On the other hand, given that the application is generating new queries all the time, a significant portion of system resources is spent on query compilation, which is not optimal.
 
Usually, this situation happens if your application generates queries (instead of using stored procedures or parameterized queries) or if it relies on object-relational mapping frameworks that generate queries by default. 
 
If you are in control of the application code, you may consider rewriting the data access layer to use stored procedures or parameterized queries. However, this situation can be also improved without application changes by forcing query parameterization for the entire database (all queries) or for the individual query templates with the same query hash. 

## Next Steps
- Learn more about the [best practices for using Query Store](concepts-query-store-best-practices.md)
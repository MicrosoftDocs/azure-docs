---
title: Query Store scenarios
description: This article describes some scenarios for Query Store in Azure Database for PostgreSQL - Flexible Server.
author: markingmyname
ms.author: maghan
ms.date: 04/27/2024
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: conceptual
---

# Usage scenarios for Query Store - Azure Database for PostgreSQL - Flexible Server

[!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]

You can use Query Store in a wide variety of scenarios in which tracking and maintaining predictable workload performance is critical. Consider the following examples:
- Identifying and tuning top expensive queries.
- A/B testing.
- Keeping performance stable during upgrades.
- Identifying and improving improvised workloads.

## Identify and tune expensive queries

### Identify longest running queries

Use Query Store views on the azure_sys database of your server to quickly identify the longest running queries. These queries typically tend to consume the most resources. Optimizing your longest running queries can improve performance by freeing up resources used by other queries running on your system.

### Target queries with performance deltas

Query Store slices the performance data into time windows, so you can track the performance of a query over time. This helps you identify exactly which queries are contributing to an increase in overall time spent. As a result you can do targeted troubleshooting of your workload.

### Tune expensive queries

When you identify a query with suboptimal performance, the action you take depends on the nature of the problem. Some of these actions might be:
- Make sure that the statistics are up-to-date for the underlying tables used by the query.
- Consider rewriting expensive queries. For example, take advantage of query parameterization and reduce the use of dynamic SQL. Implement optimal logic when reading data, like applying data filtering on database side, instead of doing it on application side.

## A/B testing

Use Query Store to compare workload performance before and after an application change you plan to introduce, or before and after migration. Example scenarios for using Query Store to assess the impact of changes to workload performance:
- Migrating between major versions of PostgreSQL.
- Rolling out a new version of an application.
- Modifying the amount of resources granted to the server.
- Changing any of the server parameters that affect the behavior of the server.
- Creating missing indexes on tables referenced by expensive queries.
- Migrating from Azure Database for PostgreSQL single server to Azure Database for PostgreSQL flexible server.

In any of these scenarios, apply the following workflow:
1. Run your workload with Query Store before the planned change, to generate a performance baseline.
1. Apply the desired changes at a controlled moment in time.
1. Continue running the workload, long enough to generate performance image of the system after the change.
1. Compare the results from before and after the change.
1. Decide whether to keep the change or roll it back.

## Identify and improve improvised workloads

Some workloads don't have dominant queries that you can tune to improve overall application performance. Those workloads are typically characterized with a relatively large number of unique queries, each of them consuming a portion of system resources. Each unique query is executed infrequently, so individually their runtime consumption isn't critical. On the other hand, given that the application is generating new queries all the time, a significant portion of system resources is spent on query compilation, which isn't optimal. Usually, this situation happens if your application generates queries (instead of using stored procedures or parameterized queries) or if it relies on object-relational mapping frameworks that generate queries by default.

If you are in control of the application code, you might consider rewriting the data access layer to use stored procedures or parameterized queries. However, this situation can also be improved without application changes by forcing query parameterization for the entire database (all queries) or for the individual query templates with the same query hash.

## Next step

> [!div class="nextstepaction"]
> [Best practices for using Query Store](concepts-query-store-best-practices.md)

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
# Query Store usage scenarios

This feature is in Public Preview. 

Applies to: Azure Database for PostgreSQL 9.6 and 10
 
This article outlines key usage scenarios around using Query Store. 
 
You can use Query Store in a wide variety of scenarios in which tracking and ensuring predictable workload performance is critical. Consider the following examples: 
- Identifying and tuning top resource-consuming queries 
- A/B testing 
- Keeping performance stable during upgrades 
- Identifying and improving ad hoc workloads 

## Identify and tune expensive queries 

### Identify longest running queries 
Use Performance Insight on Azure portal to identify the longest running queries. These queries typically tend to consume a lot of resources, so optimizing your longest running questions can improve performance by freeing up resources for use by other queries running on your system. 
 
### Identify top resource-consuming queries 
Although your workload may generate thousands of queries, typically only a handful consume the most system resources, and those few require your attention. Among top resource-consuming queries, you will often find queries that are either regressed or that can be improved with additional tuning. 
 
The easiest way to identify the top resource-consuming queries is to run a query similar to the following on the azure_sys database on your server: 
 
SELECT * FROM query_store.qs_view  
WHERE start_time > '2018-09-01 00:00:00+00'' 
ORDER BY shared_blks_read DESC 
 
Note that the above query searches for top shared_blks_read usage since 2018-09-01. 

### Tuning expensive queries 
When you identify a query with sub-optimal performance, the action you take depends on the nature of the problem: 
Use Performance Recommendations (PR) to determine if there are any suggested indexes. If yes, create the index, and then use Query Store to evaluate query performance after creating the index. 
Make sure that the statistics are up-to-date for the underlying tables used by the query. 
Make sure that indexes used by the query are defragmented. 
Consider rewriting expensive queries. For example, take advantage of query parameterization and reduce usage of dynamic SQL. Implement optimal logic when reading data (apply data filtering on database side, not on application side). 


## A/B testing 
Use Query Store to compare workload performance before and after an application change you plan to introduce. The following list contains several examples of scenarios for using Query Store to assess the impact of the environment or application change to workload performance: 
Rolling out a new version of an application. 
Adding new hardware to the server. 
Creating missing indexes on tables referenced by expensive queries. 
 
In any of these scenarios, apply the following workflow: 
1. Run your workload with Query Store before the planned change to generate a performance baseline. 
2. Apply application change(s) at the controlled moment in time. 
3. Continue running the workload long enough to generate performance image of the system after the change. 
4. Compare results from before and after the change. 
5. Decide whether to keep the change or perform a rollback. 


## Keep performance stable during the upgrade 
Query Optimizers tend to vary from version to version and can cause performance degradation of existing queries. 
 
Query Store gives you a great level of control over query performance in the upgrade process. The recommended upgrade workflow is shown in the following graphic: 
!!!todo picture!!!
<img needs update, says SQL> 


Keep Query Store running and capture performance profiles of your existing workload. Continue to capture data so that you have all plans and establish a stable baseline. The time required can be the duration of a usual business cycle for a production workload. 
Upgrade PostgreSQL. 
Re-enable Query Store. Capture the new workload profile. 
Use Query Store for analysis and regression fixes. Most new Query Optimizer changes should produce better plans. However, Query Store will provide an easy way to identify plan choice regressions and fix them using plan-forcing mechanisms. 

## Identify and improve ad hoc workloads 
Some workloads do not have dominant queries that you can tune to improve overall application performance. Those workloads are typically characterized with relatively large number of different queries, each of them consuming portion of system resources. Being unique, those queries are executed very rarely (usually only once), so their runtime consumption is not critical. On the other hand, given that application is generating new queries all the time, a significant portion of system resources is spent on query compilation, which is not optimal. This is not an ideal situation for Query Store either, given that large number of queries and plans will flood the space reserved for Query Store. 
 
The Top Resource-Consuming Queries view gives you first indication of the ad hoc nature of your workload - most queries will show an execution count = 1. 
 
Usually, this situation happens if your application generates queries (instead of invoking stored procedures or parameterized queries) or if it relies on object-relational mapping frameworks that generate queries by default. 
 
If you are in control of the application code, you may consider rewriting of the data access layer to utilize stored procedures or parameterized queries. However, this situation can be also significantly improved without application changes by forcing query parameterization for the entire database (all queries) or for the individual query templates with the same query_hash. 
 
After you apply any of these steps, Top Resource Consuming Queries should show you a different picture of your workload. 


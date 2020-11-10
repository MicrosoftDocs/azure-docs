---
title: Troubleshoot the MySQL database issues for your Azure Database for MySQL
description: Learn how to troubleshoot the MySQL database for your Azure Database for MySQL with built in capabilities of the platform.
author: mksuni
ms.author: sumuth
ms.service: mysql
ms.topic: troubleshooting
ms.date: 11/09/2020
---

# Troubleshoot for your Azure Database for MySQL for database issus

This article describes how you can troubleshoot your Azure database for MySQL and learn about the platform capabilities one can use to address some of these issues.

## Server Level Troubleshooting 

### Resource Utilization

It's important to start by making sure that you are not maxing out any of your resource limits, reaching high levels of resource utilization will cause a performance issue this can be avoided by monitoring server's resource utilization on the Azure portal.

In Azure Database for MySQL [resource limits](concepts-limits.md#maximum-connections) is determined by the service tier that you use and the number of [vCores](concepts-pricing-tiers.md) and [Storage size](concepts-pricing-tiers.md#storage) that you provision. You can navigate to your Azure Database for MySQL and use the Metrics blade to check if you are reaching these limits. 

### **Analyze** and **Optimize** all database tables frequently 

* **Analyze** - Performs a key distribution analysis and stores the distribution for the named table or tables, clears table statistics from the **INFORMATION_SCHEMA.INNODB_TABLESTATS** table and sets the **STATS_INITIALIZED** column to uninitialized. Statistics are collected again the next time the table is accessed; this will help pushing a better execution plan for your queries if the data in the table was modified recently. reference: ANALYZE TABLE  

* **Optimize** - Once your data reaches a stable size, or a growing table has increased by tens or some hundreds of megabytes, consider using the **OPTIMIZE TABLE** statement to reorganize the table and compact any wasted space. The reorganized tables require less disk I/O to perform full table scans. This technique can improve performance when other techniques such as improving index usage or tuning application code are not practical. In short this will reorganizes the physical storage of table data and associated index data, to reduce storage space and improve I/O efficiency when accessing the table. Reference: [Optimizing Storage Layout for InnoDB Tables](https://dev.mysql.com/doc/refman/5.7/optimizing-innodb-storage-layout.html). 

* Make sure you are applying application side best practices -

    * [Connection pooling](https://docs.azure.cn/mysql-database-on-azure/mysql-database-connection-pool): This significantly reduces connection latency by reusing existing connections and enables higher database throughput (transactions per second) on the server. 

    * [Accelerated Networking](../virtual-network/create-vm-accelerated-networking-cli.md): Enables single root I/O virtualization (SR-IOV) to a VM, greatly improving its networking performance. This high-performance path bypasses the host from the data path, reducing latency, jitter, and CPU utilization, for use with the most demanding network workloads on supported VM types.
    * Application and Database should be in the same region.

## Query Level Troubleshooting

Use Microsoft intelligent performance tools to explore queries that are considered top consumers, learn about missing indexes along with recommendation and full analysis for your workload. Intelligent Performance for Azure Database for MySQL includes (Query Performance index, Performance Recommendations, Slow query log): 

### Leverage Query Performance Insight (QPI)
Query Performance Insight helps you to quickly identify what your longest running queries are, how they change over time, and what waits are affecting them, this can help you determine problematic queries. Tutorial on how to use QPI can be found here.  

### Use Performance Recommendations
[Performance Recommendations](concepts-performance-recommendations.md) for your Azure Database for MySQL analyzes your databases to create customized suggestions for improved performance. To produce the recommendations, the analysis looks at various database characteristics including schema. Consider also to read [Azure brings intelligence and high performance to Azure Database for MySQL](https://techcommunity.microsoft.com/t5/azure-database-for-mysql/azure-brings-intelligence-and-high-performance-to-azure-database/ba-p/769110). 

### Enable **Slow Query Log**
[Slow query log](concepts-server-logs.md) can be used to identify performance bottlenecks for troubleshooting. It  helps explain the issue at the query level to show how long each query took to execute and this helps identify an action needed to resolve the issue. Follow [this documentation](concepts-server-logs.md#configure-slow-query-logging) to enable slow query log for your Azure Database for MySQL. 

### Query Store
The [Query Store](concepts-query-store.md) in Azure Database for MySQL provides a way to track query performance over time. Query Store simplifies performance troubleshooting by helping you quickly find the longest running and most resource-intensive queries. Query Store automatically captures a history of queries and runtime statistics, and it retains them for your review. Follow [this documentation](concepts-query-store.md#enabling-query-store) to enable query store for your Azure Database for MySQL. 

### Use the EXPLAIN command
EXPLAIN is used to obtain a query execution plan (that is explanation of how MySQL would execute a query). This can help understand the bottleneck in a specific query. Review the following [tutorial](howto-troubleshoot-query-performance.md) on EXPLAIN to profile query performance in Azure Database for MySQL. 

### Use the SHOW PROFILE command
[SHOW PROFILE](https://dev.mysql.com/doc/refman/5.7/show-profile.html) and [SHOW PROFILES](https://dev.mysql.com/doc/refman/5.7/show-profiles.html) statements display profile information that indicates resource utilization for statements executed during current session. Profiling is enabled per session and is lost at the end of session it.

## Next steps

[Best practice for performance of Azure Database for MySQL](concept-performance-best-practices.md)
[Best practice for server operations using Azure Database for MySQL](concept-server-operational-best-practice.md)
[Best practice for monitoring your Azure Database for MySQL](concept-monitoring-best-practices.md)
[Get started with Azure Database for MySQL](quickstart-create-mysql-server-database-using-azure-portal.md)

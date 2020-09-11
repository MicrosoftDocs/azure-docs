---
title: "SQL Server to SQL Managed Instance - Performance analysis"
description: Learn to create and compare a performance baseline when migrating your SQL Server databases to Azure SQL Managed Instance. 
ms.service: sql-database
ms.subservice: migration
ms.custom: 
ms.devlang: 
ms.topic: conceptual
author: MashaMSFT
ms.author: mathoma
ms.reviewer: mokabiru
ms.date: 08/25/2020
---
# Migration performance: SQL Server to SQL Managed Instance performance analysis
[!INCLUDE[appliesto-sqldb-sqlmi](../../includes/appliesto-sqlmi.md)]

Create a performance baseline to compare the performance of your workload on a SQL Managed Instance with your original workload running on SQL Server. 

## Create a baseline

Ideally, performance is similar or better after migration, so it is important to measure and record baseline performance values on the source and then compare them to the target environment. A performance baseline is a set of parameters that define your average workload on your source. 

Select a set of queries that are important to, and representative of your business workload. Measure and document the min/average/max duration and CPU usage for these queries, as well as performance metrics on the source server, such as average/max CPU usage, average/max disk IO latency, throughput, IOPS, average / max page life expectancy, and average max size of tempdb. 

The following resources can help define a performance baseline: 

   - [Monitor CPU usage ](https://techcommunity.microsoft.com/t5/azure-sql-database/monitor-cpu-usage-on-sql-server-and-azure-sql/ba-p/680777#M131)
   - [Monitor memory usage](/sql/relational-databases/performance-monitor/monitor-memory-usage) and determine the amount of memory used by different components such as buffer pool, plan cache, column-store pool, [In-Memory OLTP](/sql/relational-databases/in-memory-oltp/monitor-and-troubleshoot-memory-usage), etc. In addition, you should find average and peak values of the Page Life Expectancy memory performance counter. 
   - Monitor disk IO usage on the source SQL Server instance using the [sys.dm_io_virtual_file_stats](/sql/relational-databases/system-dynamic-management-views/sys-dm-io-virtual-file-stats-transact-sql) view or [performance counters](/sql/relational-databases/performance-monitor/monitor-disk-usage). 
   - Monitor workload and query performance by examining Dynamic Management Views (or Query Store if you are migrating from SQL Server 2016 and later). Identify average duration and CPU usage of the most important queries in your workload. 

Any performance issues on the source SQL Server should be addressed prior to migration. Migrating known issues to any new system might cause unexpected results and invalidate any performance comparison. 


## Compare performance 

After you have defined a baseline, compare similar workload performance on the target SQL Managed Instance. For accuracy, it is important that the SQL Managed Instance environment is comparable to the SQL Server environment as much as possible. 

There are SQL Managed Instance infrastructure differences that make matching performance exactly unlikely. Some queries may run faster than expected, while others may be slower. The goal of this comparison is to verify that workload performance in the managed instance matches the performance on SQL Server (on average) and to identify any critical queries with performance that don’t match your original performance. 

Performance comparison is likely to result in the following outcomes: 

- Workload performance on the managed instance is aligned or better than the workload performance on your source SQL Server. In this case, you have successfully confirmed that migration is successful. 

- The majority of performance parameters and queries in the workload perform as expected, with some exceptions resulting in degraded performance. In this case,  identify the differences and their importance. If there are some important queries with degraded performance, investigate whether the underlying SQL plans have changed or whether queries are hitting resource limits. You can mitigate this by applying some hints on critical queries (for example, change compatibility level, legacy cardinality estimator) either directly or using plan guides. Ensure statistics and indexes are up to date and equivalent in both environments. 

- Most queries are slower on a managed instance compared to your source SQL Server instance. In this case, try to identify the root causes of the difference such as [reaching some resource limit](../../managed-instance/resource-limits.md#service-tier-characteristics) such as IO, memory, or instance log rate limits. If there are no resource limits causing the difference, try changing the compatibility level of the database or change database settings like legacy cardinality estimation and re-run the test. Review the recommendations provided by the managed instance or Query Store views to identify the queries with regressed performance. 

SQL Managed Instance has a built-in automatic plan correction feature that is enabled by default. This feature ensures that queries that worked fine in the past do not degrade in the future. If this feature is not enabled, run the workload with the old settings so SQL Managed Instance can learn the performance baseline. Then, enable the feature and run the workload again with the new settings. 

Make changes in the parameters of your test or upgrade to higher service tiers to reach the optimal configuration for the workload performance that fits your needs. 

## Monitor performance 

SQL Managed Instance provides advanced tools for monitoring and troubleshooting, and you should use them to monitor performance on your instance. Some of the key metrics to monitor are: 

- CPU usage on the instance to determine if the number of vCores that you provisioned is the right match for your workload. 
- Page-life expectancy on your managed instance to determine if you need [additional memory](https://techcommunity.microsoft.com/t5/azure-sql-database/do-you-need-more-memory-on-azure-sql-managed-instance/ba-p/563444).
-  Statistics like INSTANCE_LOG_GOVERNOR or PAGEIOLATCH that identify storage IO issues, especially on the General Purpose tier, where you might need to pre-allocate files to get better IO performance. 


## Considerations  

When comparing performance, consider the following: 

- Settings match between source and target. Validate that various instance, database, and tempdb settings are equivalent between the two environments. Differences in configuration, compatibility levels, encryption settings, trace flags etc., can all skew performance. 

- Storage is configured according to [best practices](https://techcommunity.microsoft.com/t5/datacat/storage-performance-best-practices-and-considerations-for-azure/ba-p/305525). For example, for General Purpose, you may need to pre-allocate the size of the files to improve performance. 

- There are [key environment differences](https://azure.microsoft.com/blog/key-causes-of-performance-differences-between-sql-managed-instance-and-sql-server/) that might cause the performance differences between a managed instance and SQL Server. Identify risks relevant to your environment that might contribute to a performance issue. 

- Query store and automatic tuning should be enabled on your SQL Managed Instance as they help you measure workload performance and automatically mitigate potential performance issues. 



## Next steps

For more information to optimize your new Azure SQL Managed Instance environment, see the following resources: 

- [How to identify why workload performance on Azure SQL Managed Instance is different than SQL Server?](https://medium.com/azure-sqldb-managed-instance/what-to-do-when-azure-sql-managed-instance-is-slower-than-sql-server-dd39942aaadd)
- [Key causes of performance differences between SQL Managed Instance and SQL Server](https://azure.microsoft.com/en-us/blog/key-causes-of-performance-differences-between-sql-managed-instance-and-sql-server/)
- [Storage performance best practices and considerations for Azure SQL Managed Instance (General Purpose)](https://techcommunity.microsoft.com/t5/datacat/storage-performance-best-practices-and-considerations-for-azure/ba-p/305525)
- [Real-time performance monitoring for Azure SQL Managed Instance (this is archived, is this the intended target?)](https://docs.microsoft.com/archive/blogs/sqlcat/real-time-performance-monitoring-for-azure-sql-database-managed-instance)

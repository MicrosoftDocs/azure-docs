---
title: "SQL Server to SQL Managed Instance - Performance analysis"
description: Follow this guide to migrate your SQL Server databases to Azure SQL Managed Instance. 
ms.service: sql-database
ms.subservice: migration
ms.custom: 
ms.devlang: 
ms.topic: conceptual
author: MashaMSFT
ms.author: mathoma
ms.reviewer: carlrab
ms.date: 08/25/2020
---
# Migration performance: SQL Server to SQL Managed Instance performance analysis
[!INCLUDE[appliesto-sqldb-sqlmi](../../includes/appliesto-sqlmi.md)]

If you need to compare the performance of your workload on a SQL Managed Instance with your original workload running on SQL Server, you would need to create a performance baseline that will be used for comparison. 

## Prerequisites 

- Align your settings on the managed instance with the settings from the source SQL Server instance by investigating various instance, database, tempdb settings, and configurations. Make sure that you have not changed settings like compatibility levels or encryption before you run the first performance comparison, or accept the risk that some of the new features that you enabled might affect some queries. To reduce migration risks, change the database compatibility level only after performance monitoring. 

- Implement [storage best practice guidelines need link]() for General Purpose, such as pre-allocating the size of the files to get better performance. 

- Learn about the [key environment differences](https://azure.microsoft.com/en-us/blog/key-causes-of-performance-differences-between-sql-managed-instance-and-sql-server/) that might cause the performance differences between a managed instance and SQL Server, and identify the risks that might affect the performance. 

- Make sure that you keep Query Store and automatic tuning enabled on your Managed Instance. These features enable you to measure workload performance and automatically mitigate potential performance issues. Learn how to use Query Store as an optimal tool for getting information about workload performance before and after database compatibility level changes, as explained in [Keep performance stability during the upgrade to a newer SQL Server version](https://docs.microsoft.com/en-us/sql/relational-databases/performance/query-store-usage-scenarios?view=sql-server-ver15#CEUpgrade). Once you have prepared the environment that is comparable as much as possible with your source / on-premises environment, you can start running your workload and measure performance. Measurement process should include the same parameters that you measured [while you created baseline performance of your workload measures on the source SQL Server instance](https://review.docs.microsoft.com/en-us/azure/azure-sql/managed-instance/migrate-to-instance-from-sql-server?branch=pr-en-us-122187#create-a-performance-baseline). As a result, you should compare performance parameters with the baseline and identify critical differences. 




### Create a baseline

Performance baseline is a set of parameters such as average/max CPU usage, average/max disk IO latency, throughput, IOPS, average/max page life expectancy, and average max size of tempdb. You would like to have similar or even better parameters after migration, so it is important to measure and record the baseline values for these parameters. In addition to system parameters, you would need to select a set of the representative queries or the most important queries in your workload and measure min/average/max duration and CPU usage for the selected queries. These values would enable you to compare performance of workload running on SQL Managed Instance to the original values on your source SQL Server instance. 

Some of the parameters that you would need to measure on your SQL Server instance are: 

   - [Monitor CPU usage on your SQL Server instance](https://techcommunity.microsoft.com/t5/azure-sql-database/monitor-cpu-usage-on-sql-server-and-azure-sql/ba-p/680777#M131) and record the average and peak CPU usage. 
   - [Monitor memory usage on your SQL Server instance](https://docs.microsoft.com/en-us/sql/relational-databases/performance-monitor/monitor-memory-usage?view=sql-server-ver15) and determine the amount of memory used by different components such as buffer pool, plan cache, column-store pool, [In-Memory OLTP](https://docs.microsoft.com/en-us/sql/relational-databases/in-memory-oltp/monitor-and-troubleshoot-memory-usage?view=sql-server-2017), etc. In addition, you should find average and peak values of the Page Life Expectancy memory performance counter. 
   - Monitor disk IO usage on the source SQL Server instance using [sys.dm_io_virtual_file_stats](https://docs.microsoft.com/en-us/sql/relational-databases/system-dynamic-management-views/sys-dm-io-virtual-file-stats-transact-sql?view=sql-server-ver15) view or [performance counters](https://docs.microsoft.com/en-us/sql/relational-databases/performance-monitor/monitor-disk-usage?view=sql-server-ver15). 
   - Monitor workload and query performance or your SQL Server instance by examining Dynamic Management Views or Query Store if you are migrating from a SQL Server 2016+ version. Identify average duration and CPU usage of the most important queries in your workload to compare them with the queries that are running on the managed instance. 

If you notice any issue with your workload on SQL Server such as high CPU usage, constant memory pressure, or tempdb or parameterization issues, you should try to resolve them on your source SQL Server instance before taking the baseline and migration. Migrating known issues to any new system might cause unexpected results and invalidate any performance comparison. 

As an outcome of this activity, you should have documented average and peak values for CPU, memory, and IO usage on your source system, as well as average and max duration and CPU usage of the dominant and the most critical queries in your workload. You should use these values later to compare performance of your workload on a managed instance with the baseline performance of the workload on the source SQL Server instance. 

In many cases, you would not be able to get exactly matching performance on the managed instance and SQL Server. Azure SQL Managed Instance is a SQL Server database engine, but infrastructure and high-availability configuration on a managed instance may introduce some differences. You might expect that some queries would be faster while some others might be slower. The goal of this comparison is to verify that workload performance in the managed instance matches the performance on SQL Server (on average) and to identify any critical queries with performance that don’t match your original performance. 

## Compare performance 

The outcome of the performance comparison might be: 

- Workload performance on the managed instance is aligned or better than the workload performance on your source SQL Server. In this case, you have successfully confirmed that migration is successful. 

- A majority of the performance parameters and the queries in the workload work fine, with some exceptions resulting in degraded performance. In this case, you would need to identify the differences and their importance. If there are some important queries with degraded performance, you should investigate whether the underlying SQL plans have changed or whether the queries are hitting some resource limits. You can mitigate this by applying some hints on critical queries (for example, changed compatibility level, legacy cardinality estimator) either directly or using plan guides, rebuild or create statistics and indexes that might affect the plans. 

- Most of the queries are slower on a managed instance compared to your source SQL Server instance. In this case, try to identify the root causes of the difference such as [reaching some resource limit](https://review.docs.microsoft.com/en-us/azure/azure-sql/managed-instance/resource-limits?branch=pr-en-us-122187#service-tier-characteristics) like IO limits, memory limit, instance log rate limit, etc. If there are no resource limits that cause the difference, try to change the compatibility level of the database or change database settings like legacy cardinality estimation and re-run the test. Review the recommendations provided by the managed instance or Query Store views to identify the queries with regressed performance. 

Azure SQL Managed Instance has a built-in automatic plan correction feature that is enabled by default. This feature ensures that queries that worked fine in the past would not degrade in the future. Make sure that this feature is enabled and that you have executed the workload long enough with the old settings before you change to the new settings in order to enable the Managed Instance to learn about the baseline performance and plans. 

Make changes in the parameters of your test or upgrade to higher service tiers to reach an optimal configuration until you get the workload performance that fits your needs. 

## Monitor performance 

SQL Managed Instance provides a lot of advanced tools for monitoring and troubleshooting, and you should use them to monitor performance on your instance. Some of the key metrics that you would need to monitor are: 

- CPU usage on the instance to determine if the number of vCores that you provisioned is the right match for your workload. 
- Page-life expectancy on your managed instance to determine if you need [additional memory](https://techcommunity.microsoft.com/t5/azure-sql-database/do-you-need-more-memory-on-azure-sql-managed-instance/ba-p/563444).
-  Statistics like INSTANCE_LOG_GOVERNOR or PAGEIOLATCH that will tell if you have storage IO issues, especially on the General Purpose tier, where you might need to pre-allocate files to get better IO performance. 

## Optimize 

The post-migration phase is crucial for reconciling any data accuracy issues and verifying completeness, as well as addressing performance issues with the workload. Optimizing your Managed Instance also includes leveraging the best of Azure SQL PaaS features that you can now benefit from after the migration to enable your databases adapt to newer and modern applications. 

## Leverage advanced features 

Even if you performed a lift-and-shift type migration without fully leveraging the features of Managed Instance, there are high chances that you would turn on some of the new features while you are operating your instance to take advantage of the latest database engine improvements. Some changes are only enabled once the [database compatibility level has been changed](https://docs.microsoft.com/en-us/sql/relational-databases/databases/view-or-change-the-compatibility-level-of-a-database?view=sql-server-ver15). 

For instance, you don’t have to create backups on managed instance - the service performs backups for you automatically. You no longer must worry about scheduling, taking, and managing backups. SQL Managed Instance provides you the ability to restore to any point in time within this retention period using [Point in Time Recovery (PITR)](https://review.docs.microsoft.com/en-us/azure/azure-sql/database/recovery-using-backups?branch=pr-en-us-122187#point-in-time-restore). Additionally, you do not need to worry about setting up high availability, as [high availability is built in](https://review.docs.microsoft.com/en-us/azure/azure-sql/database/high-availability-sla?branch=pr-en-us-122187). 

To strengthen security, consider using [Azure Active Directory Authentication](https://review.docs.microsoft.com/en-us/azure/azure-sql/database/authentication-aad-overview?branch=pr-en-us-122187), [auditing](https://review.docs.microsoft.com/en-us/azure/azure-sql/managed-instance/auditing-configure?branch=pr-en-us-122187), [threat detection](https://review.docs.microsoft.com/en-us/azure/azure-sql/database/advanced-data-security?branch=pr-en-us-122187), [row-level security](https://docs.microsoft.com/en-us/sql/relational-databases/security/row-level-security?view=sql-server-ver15), and [dynamic data masking](https://docs.microsoft.com/en-us/sql/relational-databases/security/dynamic-data-masking?view=sql-server-ver15).

In addition to advanced management and security features, a managed instance provides a set of advanced tools that can help you to [monitor and tune your workload](https://review.docs.microsoft.com/en-us/azure/azure-sql/database/monitor-tune-overview?branch=pr-en-us-122187).[Azure SQL Analytics](https://docs.microsoft.com/en-us/azure/azure-monitor/insights/azure-sql) enables you to monitor a large set of managed instances in a centralized manner. [Automatic tuning](https://docs.microsoft.com/en-us/sql/relational-databases/automatic-tuning/automatic-tuning?view=sql-server-ver15#automatic-plan-correction) in managed instances continuously monitors performance of your SQL plan execution statistics and automatically fixes the identified performance issues. 

For additional detail about these issues and specific steps to mitigate them, see the [Post-migration Validation and Optimization Guide].



## Next steps

For more information about how to optimize your new Azure SQL Database managed instance environment, see the following resources: 

- [How to identify why workload performance on Azure SQL Managed Instance are different than SQL Server?](https://medium.com/azure-sqldb-managed-instance/what-to-do-when-azure-sql-managed-instance-is-slower-than-sql-server-dd39942aaadd)
- [Key causes of performance differences between SQL managed instance and SQL Server](https://azure.microsoft.com/en-us/blog/key-causes-of-performance-differences-between-sql-managed-instance-and-sql-server/)
- [Storage performance best practices and considerations for Azure SQL DB Managed Instance (General Purpose)](https://techcommunity.microsoft.com/t5/datacat/storage-performance-best-practices-and-considerations-for-azure/ba-p/305525)
- [Real-time performance monitoring for Azure SQL Database Managed Instance (this is archived, is this the intended target?)](https://docs.microsoft.com/en-us/archive/blogs/sqlcat/real-time-performance-monitoring-for-azure-sql-database-managed-instance)
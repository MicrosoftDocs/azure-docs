---
title: Historical Query Storage and Analysis in Azure Synapse Analytics
description: Historic query analysis is one of the crucial needs of data engineers. Azure Synapse Analytics provides four main ways to analyze query history and performance. These include DMVs, Azure Data Explorer, Azure Log Analytics and Query Store. 
This article will show you how to use each of these options for your needs.
 
author: mariyaali
ms.author: mariyaali
ms.service: synapse-analytics
ms.topic: conceptual
ms.date: 10/12/2021
ms.custom: template-concept
---

# Historical Query Storage and Analysis in Azure Synapse Analytics

Historic query analysis is one of the crucial needs of data engineers. Azure Synapse Analytics provides four main ways to analyze query history and performance. These include DMVs, Azure Data Explorer, Azure Log Analytics and Query Store. 
This article will show you how to use each of these options for your needs.

## Introduction
Historic query analysis is one of the crucial needs of data engineers. Azure Synapse Analytics provides four main ways to analyze query history and performance. These include DMVs, Azure Data Explorer, Azure Log Analytics and Query Store. 

This article will show you how to use each of these options for your needs.

## Customer needs
This section highlights some use cases when it comes to analyzing query history, and the best method for each.

Customer Need |	QDS |  DMV	| Log Analytics |	Data Explorer
------------- | --- | ----- | ------------- |-------------------
Out of the box solution | Needs enabling | :heavy_check_mark: | Addition service required |	Addition service required
Longer analysis periods | 30 days |	Up to 10000 rows of history	 | Customizable | Customizable
Crucial metrics availability |	Limited	| :heavy_check_mark: |	Limited	| Customizable
Use SQL for analysis | :heavy_check_mark: | :heavy_check_mark:| KQL needed | SQL support is limited

## Ways to store and analyze query data

### Query Store

Query Store feature provides insight on query plan choice and performance. It simplifies performance troubleshooting by helping you quickly find performance differences caused by query plan changes. Query Store can hold data for until 30 days in.

Query Store is not enabled by default for new Azure Synapse Analytics databases.

To enable Query Store to run the following T-SQL command:

```sql
ALTER DATABASE <database_name>
SET QUERY_STORE = ON;
```

You can run performance auditing and troubleshooting related tasks by finding last executed queries, execution counts, longest running queries, queries with maximum physical I/O leads. Please refer to [Monitoring Performance By Using the Query Store](/sql/relational-databases/performance/monitoring-performance-by-using-the-query-store.md) for sample queries.

Advantages:
* 30 days of threshold for storage query data.
* Data can be consumed in the same tool that you’d run the query in.

Disadvantages:
* Scenarios for analysis are limited in Query Store for Azure Synapse when compared to using DMVs.

### DMV
Dynamic Management Views (DMVs) are extremely useful when it comes to gathering information on query wait times, execution plans, memory, etc.
It is highly recommended to label your query of interest to track it down later. 

```sql
-- Query with Label
SELECT *
FROM sys.tables
OPTION (LABEL = 'My Query')
;
```
Find more about how to use DMVs here: Monitor your dedicated SQL pool workload using DMVs. 
Documentation on supported views is available here:
* [sys.dm_pdw_dms_cores](/sql/relational-databases/system-dynamic-management-views/sys-dm-pdw-dms-cores-transact-sql.md)
* [sys.dm_pdw_dms_external_work](/sql/relational-databases/system-dynamic-management-views/sys-dm-pdw-dms-external_work-transact-sql.md)
* [sys.dm_pdw_dms_workers](/sql/relational-databases/system-dynamic-management-views/sys-dm-pdw-dms-workers-transact-sql.md)
* [sys.dm_pdw_errors](/sql/relational-databases/system-dynamic-management-views/sys-dm-pdw-dms-errors-transact-sql.md)
* [sys.dm_pdw_exec_connections](/sql/relational-databases/system-dynamic-management-views/sys-dm-pdw-dms-exec-connections-transact-sql.md)
* [sys.dm_pdw_exec_requests](/sql/relational-databases/system-dynamic-management-views/sys-dm-pdw-dms-exec-requests-transact-sql.md)
* [sys.dm_pdw_exec_sessions](/sql/relational-databases/system-dynamic-management-views/sys-dm-pdw-dms-exec-sessions-transact-sql.md)
* [sys.dm_pdw_hadoop_operations](/sql/relational-databases/system-dynamic-management-views/sys-dm-pdw-dms-hadoop-operations-transact-sql.md)
* [sys.dm_pdw_lock_waits](/sql/relational-databases/system-dynamic-management-views/sys-dm-pdw-dms-lock-waits-transact-sql.md)
* [sys.dm_pdw_nodes](/sql/relational-databases/system-dynamic-management-views/sys-dm-pdw-dms-nodes-transact-sql.md)
* [sys.dm_pdw_nodes_database_encryption_keys](/sql/relational-databases/system-dynamic-management-views/sys-dm-pdw-dms-nodes-database-encryption-keys-transact-sql.md)
* [sys.dm_pdw_os_threads](/sql/relational-databases/system-dynamic-management-views/sys-dm-pdw-dms-os-threads-transact-sql.md)
* [sys.dm_pdw_request_steps](/sql/relational-databases/system-dynamic-management-views/sys-dm-pdw-dms-request-steps-transact-sql.md)
* [sys.dm_pdw_resource_waits](/sql/relational-databases/system-dynamic-management-views/sys-dm-pdw-dms-resource-waits-transact-sql.md)
* [sys.dm_pdw_sql_requests](/sql/relational-databases/system-dynamic-management-views/sys-dm-pdw-dms-sql-requests-transact-sql.md)
* [sys.dm_pdw_sys_info](/sql/relational-databases/system-dynamic-management-views/sys-dm-pdw-dms-sys-info-transact-sql.md)
* [sys.dm_pdw_wait_stats](/sql/relational-databases/system-dynamic-management-views/sys-dm-pdw-dms-wait-stats-transact-sql.md)
* [sys.dm_pdw_waits](/sql/relational-databases/system-dynamic-management-views/sys-dm-pdw-dms-waits-transact-sql.md)

Advantages:
* Data can be consumed in the same querying tool.
* DMVs provide extensive options for analysis.

Disadvantages:
* DMVs are limited to 10,000 rows of historic entries. 
* Views are reset when pool is paused/resumed.

To resolve the disadvantages mentioned above, you can save your diagnostic logs to a storage account for auditing or manual inspection. You create a script to periodically store query history to a table in Azure Synapse or to an Azure Storage account.

[This video](https://youtu.be/I9fx5bFMYjQ) explains how you can connect your storage account to Log Analytics to query your logs.

### Log Analytics
Log Analytics workspaces can be created easily in the Azure portal. For further instructions on how to connect Synapse with Log Analytics, see  [Monitor workload - Azure portal](sql-data-warehouse-monitor-workload-portal.md).

Like Azure Data Explorer, Log Analytics uses the Kusto Query Language (KQL). For more information about Kusto syntax, see Kusto query overview. 

Along with configurable retention period, you choose the workspace you are specifically targeting to query in Log Analytics. 
Log Analytics give you the flexibility to store data, run, and save queries.

Advantages:
* Azure Log Analytics has a customizable log retention policy

Disadvantages:
* Using KQL adds to the learning curve.
* Limited views can be logged out of the box.

### Data Explorer
Azure Data Explorer (ADX) is a leading data exploration service. This service can be used to analyze historic queries from Azure Synapse Analytics. To setup an Azure Data Factory (ADF) pipeline to copy and store logs to ADX, see [Copy data to or from Azure Data Explorer](/data-factory/connector-azure-data-explorer.md). In ADX, you can run performant Kusto query to analyze your logs.  You can combine other strategies here, for example to query and load DMV output to ADX via ADF.
  
Advantages:
* ADX provides a customizable log retention policy.
* Performant query execution against large amount of data, especially queries involving string search.

Disadvantage:
* Using KQL adds to the learning curve.
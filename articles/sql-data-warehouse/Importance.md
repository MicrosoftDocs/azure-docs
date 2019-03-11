---
title: SQL Data Warehouse Importance | Microsoft Docs
description: Guidance for setting importance for queries in Azure SQL Data Warehouse.
services: sql-data-warehouse
author: ronortloff
manager: craigg
ms.service: sql-data-warehouse
ms.topic: conceptual
ms.subservice: manage
ms.date: 03/01/2019
ms.author: rortloff
ms.reviewer: jrasnick
---

# SQL Data Warehouse Importance (Preview for Gen 2 only)

This article explains how workload importance can influence the order of execution for SQL Data Warehouse requests.

## Importance

Business needs can require data warehousing workloads to be more important than others.  Consider a scenario where mission critical sales data is loaded before the fiscal period close.  Data loads for other sources such as weather data do not have strict SLAs.   Setting high importance for requests to load sales data and low importance to load weather data ensures the sales data loads get first access to resources and completes quicker.

## Importance Levels

There are five levels of importance: low, below_normal, normal, above_normal and high.  Requests that do not set importance are assigned the default level of normal.  Requests that have the same importance level have the same scheduling behavior that exists today.

## Importance Scenarios

Beyond the basic importance scenario described above with sales and weather data, there are other scenarios where workload importance helps meet data processing and querying needs.
Access to locks for read and write activity is one area of natural contention.  Activities such as [partition switching](/azure/sql-data-warehouse/sql-data-warehouse-tables-partition)> or [RENAME OBJECT](/sql/t-sql/statements/rename-transact-sql) require elevated locks.  Without workload importance, SQL Data Warehouse optimizes for throughput.  This means that when running and queued requests have the same locking needs and resources are available, the queued requests can bypass requests with higher locking needs that arrived in the request queue earlier.  With workload importance applied to requests with higher locking needs, this behavior can be changed.

Consider the following example:

Q1 is actively running and selecting data from SalesFact.
Q2 is queued waiting for Q1 to complete.  It was submitted at 9am and is attempting to partition switch new data into SalesFact.
Q3 is submitted at 9:01am and wants to select data from SalesFact.

If Q2 and Q3 have the same importance and Q1 is still executing, Q3 will begin executing and Q2 will continue to wait for an exclusive lock on SalesFact.  If Q2 has higher importance than Q3, Q3 will wait until Q2 is finished before it can begin execution.

Another scenario where importance can help meet querying demands is when requests with different resource classes are submitted.  As was previously mentioned, under the same importance, SQL Data Warehouse optimizes for throughput.  When mixed size requests (such as smallrc or mediumrc) are queued, SQL Data Warehouse will choose the earliest arriving request that fits within the available resources.  If workload importance is applied, the highest importance request is scheduled next.
  
Consider the following example on DW500c:

Q1, Q2, Q3 and Q4 are running smallrc queries.
Q5 is submitted with the mediumrc resource class at 9am.
Q6 is submitted with smallrc resource class at 9:01am.

Because Q5 is mediumrc, it requires two concurrency slots.  Q5 needs to wait for two of the running queries to complete.  However, when one of the running queries (Q1-Q4) completes, Q6 is scheduled immediately because the resources exist to execute the query.  If Q5 has higher importance than Q6, Q6 waits until Q5 is running before it can begin executing.

>[!NOTE]
Classification is evaluated on a per request basis.  Multiple requests in a single session can be classified differently.
>

## Next steps

For more information about SQL Dta Warehouse workload classification see SQL Data Warehouse {Classification](classification.md) and [Create a workload classifier](quickstart-create-a-workload-classifier). See [sys.dm_pdw_exec_requests](/sql/relational-databases/system-dynamic-management-views/sys-dm-pdw-exec-requests-transact-sql) to view queries and the importance assigned.

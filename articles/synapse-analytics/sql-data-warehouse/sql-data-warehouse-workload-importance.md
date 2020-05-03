---
title: Workload importance 
description: Guidance for setting importance for Synapse SQL pool queries in Azure Synapse Analytics.
services: synapse-analytics
author: ronortloff
manager: craigg
ms.service: synapse-analytics
ms.topic: conceptual
ms.subservice: 
ms.date: 02/04/2020
ms.author: rortloff
ms.reviewer: jrasnick
ms.custom: azure-synapse
---

# Azure Synapse Analytics workload importance

This article explains how workload importance can influence the order of execution for Synapse SQL pool requests in Azure Synapse.

## Importance

> [!Video https://www.youtube.com/embed/_2rLMljOjw8]

Business needs can require data warehousing workloads to be more important than others.  Consider a scenario where mission critical sales data is loaded before the fiscal period close.  Data loads for other sources such as weather data don't have strict SLAs. Setting high importance for a request to load sales data and low importance to a request to load weather data ensures the sales data load gets first access to resources and completes quicker.

## Importance levels

There are five levels of importance: low, below_normal, normal, above_normal, and high.  Requests that don't set importance are assigned the default level of normal. Requests that have the same importance level have the same scheduling behavior that exists today.

## Importance scenarios

Beyond the basic importance scenario described above with sales and weather data, there are other scenarios where workload importance helps meet data processing and querying needs.

### Locking

Access to locks for read and write activity is one area of natural contention. Activities such as [partition switching](sql-data-warehouse-tables-partition.md) or [RENAME OBJECT](/sql/t-sql/statements/rename-transact-sql?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json&view=azure-sqldw-latest) require elevated locks.  Without workload importance, Synapse SQL pool in Azure Synapse optimizes for throughput. Optimizing for throughput means that when running and queued requests have the same locking needs and resources are available, the queued requests can bypass requests with higher locking needs that arrived in the request queue earlier. Once workload importance is applied to requests with higher locking needs. Request with higher importance will be run before request with lower importance.

Consider the following example:

- Q1 is actively running and selecting data from SalesFact.
- Q2 is queued waiting for Q1 to complete.  It was submitted at 9am and is attempting to partition switch new data into SalesFact.
- Q3 is submitted at 9:01am and wants to select data from SalesFact.

If Q2 and Q3 have the same importance and Q1 is still executing, Q3 will begin executing. Q2 will continue to wait for an exclusive lock on SalesFact.  If Q2 has higher importance than Q3, Q3 will wait until Q2 is finished before it can begin execution.

### Non-uniform requests

Another scenario where importance can help meet querying demands is when requests with different resource classes are submitted.  As was previously mentioned, under the same importance, Synapse SQL pool in Azure Synapse optimizes for throughput. When mixed size requests (such as smallrc or mediumrc) are queued, Synapse SQL pool will choose the earliest arriving request that fits within the available resources. If workload importance is applied, the highest importance request is scheduled next.
  
Consider the following example on DW500c:

- Q1, Q2, Q3, and Q4 are running smallrc queries.
- Q5 is submitted with the mediumrc resource class at 9am.
- Q6 is submitted with smallrc resource class at 9:01am.

Because Q5 is mediumrc, it requires two concurrency slots. Q5 needs to wait for two of the running queries to complete.  However, when one of the running queries (Q1-Q4) completes, Q6 is scheduled immediately because the resources exist to execute the query.  If Q5 has higher importance than Q6, Q6 waits until Q5 is running before it can begin executing.

## Next steps

- For more information on creating a classifier, see the [CREATE WORKLOAD CLASSIFIER (Transact-SQL)](/sql/t-sql/statements/create-workload-classifier-transact-sql?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json&view=azure-sqldw-latest).  
- For more information about workload classification, see [Workload Classification](sql-data-warehouse-workload-classification.md).  
- See the Quickstart [Create workload classifier](quickstart-create-a-workload-classifier-tsql.md) for how to create a workload classifier.
- See the how-to articles to [Configure Workload Importance](sql-data-warehouse-how-to-configure-workload-importance.md) and how to [Manage and monitor Workload Management](sql-data-warehouse-how-to-manage-and-monitor-workload-importance.md).
- See [sys.dm_pdw_exec_requests](/sql/relational-databases/system-dynamic-management-views/sys-dm-pdw-exec-requests-transact-sql?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json&view=azure-sqldw-latest) to view queries and the importance assigned.

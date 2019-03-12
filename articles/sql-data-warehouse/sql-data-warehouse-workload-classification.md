---
title: SQL Data Warehouse Classification | Microsoft Docs
description: Guidance for using classification to manage concurrency, importance, and compute resources for queries in Azure SQL Data Warehouse.
services: sql-data-warehouse
author: ronortloff
manager: craigg
ms.service: sql-data-warehouse
ms.topic: conceptual
ms.subservice: workload management
ms.date: 03/01/2019
ms.author: rortloff
ms.reviewer: jrasnick
---

# SQL Data Warehouse workload classification (Preview)

This article explains the SQL Data Warehouse workload classification process of assigning a resource class and importance to incoming requests.

> [!Note]
> Classification is available on SQL Data Warehouse Gen2.

## Classification

> [!Video https://www.youtube.com/embed/QcCRBAhoXpM]

Workload management classification allows workload policies to be applied to requests through assigning [resource classes](resource-classes-for-workload-management.md#what-are-resource-classes) and [importance](sql-data-warehouse-workload-importance.md).

While there are many ways to classify data warehousing workloads, the simplest and most common classification is load and query.  You load data with insert, update, and delete statements.  You query the data using selects.  A data warehousing solution will often have a workload policy for load activity, such as assigning a higher resource class with more resources. A different workload policy could apply to queries, such as lower importance compared to load activities.

You can also subclassify your query and load workloads.  Subclassification gives you finer grained control of your workloads.  For example, query workloads can consist of cube refreshes, dashboard queries or ad-hoc queries.  You can classify each of these query workloads with different resource classes or importance settings.  Load is no different when it comes to subclassification.  Large transformations can be assigned larger resource classes.  You can use higher importance to prioritize loading key sales data over weather data or a social data feed.

## Classification Process

Classification in SQL Data Warehouse is achieved today by assigning users to a resource class using [sp_addrolemember](/sql/relational-databases/system-stored-procedures/sp-addrolemember-transact-sql). The ability to characterize requests beyond a login to a resource class is limited with this capability.  A richer method for classification is now available with the [CREATE WORKLOAD CLASSIFIER](/sql/t-sql/statements/create-workload-classifier-transact-sql) syntax.  With this syntax, SQL Data Warehouse users can assign importance and a resource class to requests.  

> [!NOTE]
> Classification is evaluated on a per request basis.  Multiple requests in a single session can be classified differently.

## Next steps

For more information about SQL Data Warehouse workload classification, and importance, see [Create a workload classifier](quickstart-create-a-workload-classifier-tsql.md) and [SQL Data Warehouse Importance](sql-data-warehouse-workload-importance.md). See [sys.dm_pdw_exec_requests](/sql/relational-databases/system-dynamic-management-views/sys-dm-pdw-exec-requests-transact-sql) to view queries and the importance assigned.

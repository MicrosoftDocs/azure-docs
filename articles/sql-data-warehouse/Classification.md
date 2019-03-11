---
title: SQL Data Warehouse Classification | Microsoft Docs
description: Guidance for using classification to manage concurrency, importance, and compute resources for queries in Azure SQL Data Warehouse.
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

# SQL Data Warehouse Classification (Preview for Gen 2 only)

This article explains the SQL Data Warehouse workload classification process of assigning a resource class and importance to incoming requests.

## Classification

Workload management classification allows workload policies to be applied to requests through assigning [resource classes](resource-classes-for-workload-management.md) and [importance](xxxx).

While there are numerous ways to classify data warehousing workloads, the simplest and most common classification is load and query.  You load data with inserts, updates and deletes.  You query the data using selects.  A data warehousing solution will often have a workload policy for load activity, such as assigning a higher resource class with more resources. A different workload policy could apply to queries, such as lower importance compared to load activities.

Beyond the classification of load and query, you can also subclassify your workload.  Subclassification is used when workloads need finer grained control.  For example, query workloads can consist of cube refreshes, dashboard queries or ad-hoc queries.  You can classify each of these query workloads with different resource classes or importance settings.  Load is no different when it comes to subclassification.  Large transformations can be assigned larger resource classes.  You can use higher importance to prioritize loading key sales data over loading weather data or a social data feed.

## Classification Process

Classification in SQL Data Warehouse is achieved today by assigning users to a resource class using [sp_addrolemember](/sql/relational-databases/system-stored-procedures/sp-addrolemember-transact-sql). The ability to characterize requests beyond a login to a resource class is limited with this capability.  A richer method for classification is now available with the [CREATE WORKLOAD CLASSIFIER]</sql/t-sql/statements/create-workload-classifier-transact-sql> syntax.  With this syntax, SQL Data Warehouse users can assign importance and a resource class to requests.  

>[!NOTE]
Classification is evaluated on a per request basis.  Multiple requests in a single session can be classified differently.
>

## Next steps

For more information about SQL Dta Warehouse workload classification see [Create a workload classifier](quickstart-create-a-workload-classifier). For mor information about importance see [SQL Data Warehouse Importance](importance.md). See sys.dm_pdw_exec_requests (/sql/relational-databases/system-dynamic-management-views/sys-dm-pdw-exec-requests-transact-sql) to view queries and the importance assigned.

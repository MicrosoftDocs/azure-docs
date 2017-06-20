---
title: Migrate your schema to SQL Data Warehouse | Microsoft Docs
description: Tips for migrating your schema to Azure SQL Data Warehouse for developing solutions.
services: sql-data-warehouse
documentationcenter: NA
author: jrowlandjones
manager: jhubbard
editor: ''

ms.assetid: 538b60c9-a07f-49bf-9ea3-1082ed6699fb
ms.service: sql-data-warehouse
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: data-services
ms.custom: migrate
ms.date: 10/31/2016
ms.author: jrj;barbkess

---
# Migrate your schema to SQL Data Warehouse
The following summaries help you understand the differences between SQL Server and SQL Data Warehouse to help you migrate your database.

## Table Migration
When migrating your tables, you'll want to become familiar with the table features of SQL Data Warehouse tables.  The [table overview][table overview] is a great place to start.  This article introduces you to the most important considerations when creating a table such as table statistics, distribution, partitioning, and indexing.  It also covers some [unsupported table features][unsupported table features] and workarounds.

SQL Data Warehouse supports the common business data types.  See the [data types][data types] article for a list of supported and [unsupported data types][unsupported data types].  The [data types][data types] article also contains a query to identify [unsupported data types][unsupported data types].  When converting your data types, be sure to look at the [data type best practices][data type best practices].

## Next steps
Once you have successfully migrated your database schema to SQL Data Warehouse, proceed to one of the following articles:

* [Migrate your data][Migrate your data]
* [Migrate your code][Migrate your code]

For more about SQL Data Warehouse best practices, see the [best practices][best practices] article.

<!--Image references-->

<!--Article references-->
[Migrate your code]: ./sql-data-warehouse-migrate-code.md
[Migrate your data]: ./sql-data-warehouse-migrate-data.md
[best practices]: ./sql-data-warehouse-best-practices.md
[table overview]: ./sql-data-warehouse-tables-overview.md
[unsupported table features]: ./sql-data-warehouse-tables-overview.md#unsupported-table-features
[data types]: ./sql-data-warehouse-tables-data-types.md
[unsupported data types]: ./sql-data-warehouse-tables-data-types.md#unsupported-data-types
[data type best practices]: ./sql-data-warehouse-tables-data-types.md#data-type-best-practices

<!--MSDN references-->


<!--Other Web references-->

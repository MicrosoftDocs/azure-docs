---
title: Migrate your schema to SQL Data Warehouse | Microsoft Docs
description: Tips for migrating your schema to Azure SQL Data Warehouse for developing solutions.
services: sql-data-warehouse
documentationcenter: NA
author: sqlmojo
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
ms.author: joeyong;barbkess

---
# Migrate your schemas to SQL Data Warehouse
Guidance for migrating your SQL table schemas to SQL Data Warehouse. 

## Plan your schema migration

As you plan a migration, see the [table overview][table overview] to become familiar with table design considerations such as statistics, distribution, partitioning, and indexing.  It also lists some [unsupported table features][unsupported table features] and their workarounds.

## Consolidate databases by using user-defined schemas

Your existing workload probably has more than one database. For example, a traditional SQL Server data warehouse might include a staging database, a data warehouse database, and some data mart databases. In this topology each database operates as a separate workload with separate security boundaries.

By contrast, SQL Data Warehouse runs the entire data warehouse workload within one database. Cross database joins are not permitted. Therefore SQL Data Warehouse expects all tables used by the warehouse to be stored within the one database.

We recommend using user-defined schemas to consolidate your existing workload into one database. For examples, see [User-defined schemas](sql-data-warehouse-develop-user-defined-schemas.md)

## Modify data types
Modify data types to make them compatible with SQL Data Warehouse. The [data types][data types] article has a list of supported and [unsupported data types][unsupported data types]. That list also gives the workarounds for how to modify unsupported data types.

Use the smallest data types that work for your data to minimize the row length. Shorter row lengths lead to better query performance. 

For table row width, PolyBase has a 1 MB limit.  If you plan to load data into SQL Data Warehouse with PolyBase, update your tables to have row widths of less than 1 MB. This includes counting the full-length of variable-length data.

<!--
- For example, this table uses variable length data but the largest possible size of the row is still less than 1 MB. PolyBase will load data into this table.

- This table uses variable length data and the defined row width is less than one MB. When loading rows, PolyBase allocates the full length of the variable-length data. The full length of this row is greater than one MB.  PolyBase will not load data into this table.  

-->

## Specify the distribution option
When you create a table, you can specify how to distribute the table data across the Compute nodes. The choices are round-robin, replicated, or hash distributed. Each has pros and cons. If you don't specify the distribution option, SQL Data Warehouse will use round-robin as the default.

- Round-robin loads the data as fast as possible, but joins will require data movement which slows query performance.
- Replicated ensures each Compute node has a copy of the data. Replicated tables will not require data movement in joins. They do require extra storage so they only work well for small tables.
- Hash distributed assigns each row to a distribution via a hash function. This can provide the best query performance for joins.  When the table is distributed on the same column that is used in a join, data movement is not required. The hardest part, which isn't that hard, is you need to specify a distribution column. If you don't choose the best one the first time, you can re-create the table with a different column.  

To learn more about the distribution options and how to choose a distribution column, see [Distributed tables](sql-data-warehouse-tables-distribute.md)




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

<!--MSDN references-->


<!--Other Web references-->

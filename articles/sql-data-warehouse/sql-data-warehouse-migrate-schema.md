---
title: Migrate your schema to SQL Data Warehouse | Microsoft Docs
description: Tips for migrating your schema to Azure SQL Data Warehouse for developing solutions.
services: sql-data-warehouse
author: jrowlandjones
manager: craigg
ms.service: sql-data-warehouse
ms.topic: conceptual
ms.component: implement
ms.date: 04/17/2018
ms.author: jrj
ms.reviewer: igorstan
---

# Migrate your schemas to SQL Data Warehouse
Guidance for migrating your SQL schemas to SQL Data Warehouse. 

## Plan your schema migration

As you plan a migration, see the [table overview][table overview] to become familiar with table design considerations such as statistics, distribution, partitioning, and indexing.  It also lists some [unsupported table features][unsupported table features] and their workarounds.

## Use user-defined schemas to consolidate databases

Your existing workload probably has more than one database. For example, a SQL Server data warehouse might include a staging database, a data warehouse database, and some data mart databases. In this topology, each database runs as a separate workload with separate security policies.

By contrast, SQL Data Warehouse runs the entire data warehouse workload within one database. Cross database joins are not permitted. Therefore, SQL Data Warehouse expects all tables used by the data warehouse to be stored within the one database.

We recommend using user-defined schemas to consolidate your existing workload into one database. For examples, see [User-defined schemas](sql-data-warehouse-develop-user-defined-schemas.md)

## Use compatible data types
Modify your data types to be compatible with SQL Data Warehouse. For a list of supported and unsupported data types, see [data types][data types]. That topic gives workarounds for the unsupported types. It also provides a query to identify existing types that are not supported in SQL Data Warehouse.

## Minimize row size
For best performance, minimize the row length of your tables. Since shorter row lengths lead to better performance, use the smallest data types that work for your data. 

For table row width, PolyBase has a 1 MB limit.  If you plan to load data into SQL Data Warehouse with PolyBase, update your tables to have maximum row widths of less than 1 MB. 

<!--
- For example, this table uses variable length data but the largest possible size of the row is still less than 1 MB. PolyBase will load data into this table.

- This table uses variable length data and the defined row width is less than one MB. When loading rows, PolyBase allocates the full length of the variable-length data. The full length of this row is greater than one MB.  PolyBase will not load data into this table.  

-->

## Specify the distribution option
SQL Data Warehouse is a distributed database system. Each table is distributed or replicated across the Compute nodes. There's a table option that lets you specify how to distribute the data. The choices are  round-robin, replicated, or hash distributed. Each has pros and cons. If you don't specify the distribution option, SQL Data Warehouse will use round-robin as the default.

- Round-robin is the default. It is the simplest to use, and loads the data as fast as possible, but joins will require data movement which slows query performance.
- Replicated stores a copy of the table on each Compute node. Replicated tables are performant because they do not require data movement for joins and aggregations. They do require extra storage, and therefore work best for smaller tables.
- Hash distributed distributes the rows across all the nodes via a hash function. Hash distributed tables are the heart of SQL Data Warehouse since they are designed to provide high query performance on large tables. This option requires some planning to select the best column on which to distribute the data. However, if you don't choose the best column the first time, you can easily re-distribute the data on a different column. 

To choose the best distribution option for each table, see [Distributed tables](sql-data-warehouse-tables-distribute.md).


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

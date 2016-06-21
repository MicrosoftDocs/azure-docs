<properties
   pageTitle="Managing Statistics on Tables in SQL Data Warehouse | Microsoft Azure"
   description="Managing Statistics on Tables in SQL Data Warehouse in Azure SQL Data Warehouse."
   services="sql-data-warehouse"
   documentationCenter="NA"
   authors="jrowlandjones"
   manager="barbkess"
   editor=""/>

<tags
   ms.service="sql-data-warehouse"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="data-services"
   ms.date="06/21/2016"
   ms.author="jrj;barbkess;sonyama"/>

# Managing Statistics on Tables in SQL Data Warehouse

> [AZURE.SELECTOR]
- [Overview][]
- [Distribute][]
- [Index][]
- [Partition][]
- [Data Types][]
- [Statistics][]

This article will introduce you to managing statistics on tables in SQL Data Warehouse.

## Statistics

SQL Data Warehouse uses a distributed query optimizer to create the appropriate query plan when users query tables. Once created, the query plan provides the strategy and method used by the database to access the data and fulfill the user request. SQL Data Warehouse's query optimizer is based on cost. In other words it compares various options (plans) based on their relative cost and chooses the most efficient plan available to it. Consequently, SQL Data Warehouse needs a lot of information to make informed, cost based decisions. It holds statistics information about the table (for table size) and in database objects known as `STATISTICS`.

Statistics are held against single or multiple columns of indexes or tables. They provide the cost-based optimizer with important information concerning cardinality and selectivity of values. This is of particular interest when the optimizer needs to evaluate JOINs, GROUP BY, HAVING and WHERE clauses in a query. It is therefore very important that the information contained in these statistics objects *accurately* reflects the current state of the table. It is vital to understand that it is the accuracy of the cost that is important. If the statistics accurately reflect the state of the table then plans can be compared for lowest cost. If they aren't accurate then SQL Data Warehouse may choose the wrong plan.

Column-level statistics in SQL Data Warehouse are user-defined.

In other words we have to create them ourselves. As we have just learned, this is not something to overlook. This is an important difference between SQL Server and SQL Data Warehouse. SQL Server will automatically create statistics when columns are queried. By default, SQL Server will also automatically update those statistics. However, in SQL Data Warehouse statistics need to be created manually and managed manually.

### Recommendations

Apply the following recommendations for generating statistics:

1. Create Single column statistics on columns used in `WHERE`, `JOIN`, `GROUP BY`, `ORDER BY` and `DISTINCT` clauses
2. Generate multi-column statistics on composite clauses
3. Update statistics periodically. Remember that this is not done automatically!

>[AZURE.NOTE] It is common for SQL Server Data Warehouse to rely solely on `AUTOSTATS` to keep the column statistics up to date. This is not a best practice even for SQL Server data warehouses. `AUTOSTATS` are triggered by a 20% rate of change which for large fact tables containing millions or billions of rows may not be sufficient. It is therefore always a good idea to keep on top of statistics updates to ensure that the statistics accurately reflect the cardinality of the table.

## Next steps

To learn more about table design, see the [Distribute][], [Index][], [Partition][], [Data Types][], and [Statistics][] articles.  For an overview of best practices, see [SQL Data Warehouse Best Practices][].

<!--Article references-->
[Overview]: ./sql-data-warehouse-tables-overview.md
[Distribute][] ./sql-data-warehouse-tables-distribute.md
[Index][] ./sql-data-warehouse-tables-index.md
[Partition][] ./sql-data-warehouse-tables-partition.md
[Data Types][] ./sql-data-warehouse-tables-data-types.md
[Statistics][] ./sql-data-warehouse-tables-statistics.md
[SQL Data Warehouse Best Practices]: sql-data-warehouse-best-practices.md

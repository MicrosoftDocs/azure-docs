<properties
   pageTitle="Overview of Tables Design in SQL Data Warehouse | Microsoft Azure"
   description="Overview of Tables Design in Azure SQL Data Warehouse."
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

# Overview of Table design in SQL Data Warehouse

> [AZURE.SELECTOR]
- [Overview][]
- [Distribute][]
- [Index][]
- [Partition][]
- [Data Types][]
- [Statistics][]
- [Temporary][]

## Introduction

Getting started with creating table in SQL Data Warehouse is simple.  The basic syntax follows the common syntax know for most databases, you simply need to name your table, name your columns and define datatypes for each column.  But as you move from getting started to improving performance, this article will introduce you to the fundamental concepts you'll want to know when designing your tables in SQL Data Warehouse.

SQL Data Warehouse is a massively parallel processing (MPP) distributed database system.  It stores data across many different locations known as **distributions**. Each **distribution** is like a bucket; storing a unique subset of the data in the data warehouse. By dividing the data and processing capability across multiple nodes, SQL Data Warehouse can offer huge scalability - far beyond any single system.

When a table is created in SQL Data Warehouse, it is actually spread across all of the the distributions.

## Temporary tables


## Unsupported features
SQL Data Warehouse does not use or support these features:

| Feature | Workaround |
| --- | --- |
| identities | [Assigning Surrogate Keys]  |
| primary keys | N/A |
| foreign keys | N/A |
| check constraints | N/A |
| unique constraints | N/A |
| unique indexes | N/A |
| computed columns | N/A |
| sparse columns | N/A |
| user-defined types | N/A |
| indexed views | N/A |
| sequences | N/A |
| triggers | N/A |
| synonyms | N/A |

## Next steps

To learn more about table design, see the [Distribute][], [Index][], [Partition][], [Data Types][], [Statistics][] and [Temporary][] table articles.  For an overview of best practices, see [SQL Data Warehouse Best Practices][].

<!--Image references-->

<!--Article references-->
[Overview]: ./sql-data-warehouse-tables-overview.md
[Distribute]: ./sql-data-warehouse-tables-distribute.md
[Index]: ./sql-data-warehouse-tables-index.md
[Partition]: ./sql-data-warehouse-tables-partition.md
[Data Types]: ./sql-data-warehouse-tables-data-types.md
[Statistics]: ./sql-data-warehouse-tables-statistics.md
[Temporary]: ./sql-data-warehouse-tables-temporary.md
[SQL Data Warehouse Best Practices]: sql-data-warehouse-best-practices.md
[Assigning Surrogate Keys]: https://blogs.msdn.microsoft.com/sqlcat/2016/02/18/assigning-surrogate-key-to-dimension-tables-in-sql-dw-and-aps/

<!--MSDN references-->

<!--Other Web references-->

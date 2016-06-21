<properties
   pageTitle="Overview of Tables in SQL Data Warehouse | Microsoft Azure"
   description="Getting started with Tables in Azure SQL Data Warehouse."
   services="sql-data-warehouse"
   documentationCenter="NA"
   authors="sonyam"
   manager="barbkess"
   editor=""/>

<tags
   ms.service="sql-data-warehouse"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="data-services"
   ms.date="06/21/2016"
   ms.author="sonyama;barbkess;jrj"/>

# Overview of Table in SQL Data Warehouse

> [AZURE.SELECTOR]
- [Overview][]
- [Data Types][]
- [Distribute][]
- [Index][]
- [Partition][]
- [Statistics][]
- [Temporary][]

## Introduction to table design

Getting started with creating table in SQL Data Warehouse is simple.  The basic syntax follows the common syntax you are most likely already familiar with from working with other databases.  To create a table you simply need to name your table, name your columns and define datatypes for each column.  If you've create tables in other databases, this should look very familiar to you.

```sql  
CREATE TABLE Customers (FirstName VARCHAR(25), LastName VARCHAR(25))
 ``` 

The above example creates a table named Customers with two columns, FirstName and LastName.  Each column is definded with a data type of VARCHAR(25), which limits the data to 25 characters.  These fundamental attributes of a table, as well as some other, are mostly the same as other databases.  Data types are defined for each column and ensure the integrity of your data.  Indexes can be added to improve performance by reducing I/O.  You can also partition your data to improve performance of the processes that change your data.

A new fundamental attribute introduced by Massively Parallel Systems (MPP) which you might not be familiar with is the **distribution column**.  The distribution column is very much what it sounds like.  It is the column that determines how to distribute your data over then many smaller shards behind the scenes.  When you create a table without specifying the distribution column, the table is automatically distributed using **round robin**.  While round robin tables can be sufficient in some scenarios, defining distrubution columns can greatly reduce data movement during queries, thus optimizing performance.  See [Distributing a Table][Distribute] to learn more about how to select a distribution column.

As you become more advanced in using SQL Data Warehouse and want to optimize performance, you'll want to learn more about Table Design.  To learn more, see the articles on [Table Data Types][Data Types], [Distributing a Table][Distribute], [Indexing a Table][Index] and  [Partitioning a Table][Partition].

## Statistics

Statistics are a extremely important to getting the best performance out of your SQL Data Warehouse.  Since SQL Data Warehouse does not yet automatically create and update statistics for you, reading our article on [Statistics][] might be one of the most important articles you read to ensure that you get the best performance for your queries.

## Temporary tables

Temporary tables are tables which only exist for the duration of your logon and cannot be seen by other users.  Temporary tables can be a good way to prevent others from seeing temporary results and also reduce the need for cleanup.  Since temporary tables also utilize local storage, they can offer faster performance for some operations.  See the [Temporary Table][Temporary] articles for more details about temporary tables.

## External tables

External tables are tables which can be queried from SQL Data Warehouse, but point to data external from the system.  External tables are also known as Polybase tables.  For more details on how to create and query an external table, see [Load data with Polybase][].  

## Unsupported features

While SQL Data Warehouse contains many of the same features offered by other databases, there are some features which are not yet supported.  Below is a list of some of the table features which are not yet supported.

- identities (See [Assigning Surrogate Keys] for workaround)
- primary keys
- foreign keys
- check constraints
- unique constraints
- unique indexes
- computed columns
- sparse columns
- user-defined types
- indexed views
- sequences
- triggers
- synonyms

## Next steps

To learn more about table design, see the [Data Types][], [Distribute][], [Index][], [Partition][], [Statistics][] and [Temporary][Temporary Table] articles.  For an more about best practices, see [SQL Data Warehouse Best Practices][].

<!--Image references-->

<!--Article references-->
[Overview]: ./sql-data-warehouse-tables-overview.md
[Data Types]: ./sql-data-warehouse-tables-data-types.md
[Distribute]: ./sql-data-warehouse-tables-distribute.md
[Index]: ./sql-data-warehouse-tables-index.md
[Partition]: ./sql-data-warehouse-tables-partition.md
[Statistics]: ./sql-data-warehouse-tables-statistics.md
[Temporary]: ./sql-data-warehouse-tables-temporary.md
[SQL Data Warehouse Best Practices]: sql-data-warehouse-best-practices.md
[Load data with Polybase]: ./sql-data-warehouse-load-from-azure-blob-storage-with-polybase.md

<!--MSDN references-->

<!--Other Web references-->
[Assigning Surrogate Keys]: https://blogs.msdn.microsoft.com/sqlcat/2016/02/18/assigning-surrogate-key-to-dimension-tables-in-sql-dw-and-aps/

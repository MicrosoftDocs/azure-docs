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

## Introduction

Getting started with creating table in SQL Data Warehouse is simple.  The basic syntax follows the common syntax know for most databases, you simply need to name your table, name your columns and define datatypes for each column.  But as you move from getting started to improving performance, this article will introduce you to the fundamental concepts you'll want to know when designing your tables in SQL Data Warehouse.  

SQL Data Warehouse is a massively parallel processing (MPP) distributed database system.  It stores data across many different locations known as **distributions**. Each **distribution** is like a bucket; storing a unique subset of the data in the data warehouse. By dividing the data and processing capability across multiple nodes, SQL Data Warehouse can offer huge scalability - far beyond any single system.

When a table is created in SQL Data Warehouse, it is actually spread across all of the the distributions.

This article will cover the following topics:

- Supported data types
- Principles of data distribution
- Round Robin Distribution
- Hash Distribution
- Table Partitioning
- Statistics
- Unsupported features


## Principles of data distribution

There are two choices for distributing data in SQL Data Warehouse:

1. Distribute data evenly but randomly
2. Distribute data based on hashing values from a single column

Data distribution is decided at the table level. All tables are distributed. You will assign distribution for each table in your SQL Data Warehouse database.

The first option is known as **round-robin** distribution - sometimes known as the random hash. You can think of this as the default or fail safe option.

The second option is known as the **hash** distribution. You can consider it an optimized form of data distribution. It is preferred where clusters of tables share common joining and/or aggregation criteria.

## Round-robin distribution

Round-Robin distribution is a method of spreading data as evenly as possible across all distributions. Buffers containing rows of data are allocated in turn (hence the name round robin) to each distribution. The process is repeated until all data buffers have been allocated. At no stage is the data sorted or ordered in a round robin distributed table. A round robin distribution is sometimes called a random hash for this reason. The data is spread as evenly as possible across the distributions.

Below is an example of round robin distributed table:

```sql
CREATE TABLE [dbo].[FactInternetSales]
(   [ProductKey]            int          NOT NULL
,   [OrderDateKey]          int          NOT NULL
,   [CustomerKey]           int          NOT NULL
,   [PromotionKey]          int          NOT NULL
,   [SalesOrderNumber]      nvarchar(20) NOT NULL
,   [OrderQuantity]         smallint     NOT NULL
,   [UnitPrice]             money        NOT NULL
,   [SalesAmount]           money        NOT NULL
)
WITH
(   CLUSTERED COLUMNSTORE INDEX
,   DISTRIBUTION = ROUND_ROBIN
)
;
```

This is also an example of a round robin distributed table:

```sql
CREATE TABLE [dbo].[FactInternetSales]
(   [ProductKey]            int          NOT NULL
,   [OrderDateKey]          int          NOT NULL
,   [CustomerKey]           int          NOT NULL
,   [PromotionKey]          int          NOT NULL
,   [SalesOrderNumber]      nvarchar(20) NOT NULL
,   [OrderQuantity]         smallint     NOT NULL
,   [UnitPrice]             money        NOT NULL
,   [SalesAmount]           money        NOT NULL
)
WITH
(   CLUSTERED COLUMNSTORE INDEX
)
;
```

> [AZURE.NOTE] Notice that the second example above makes no mention of the distribution key. Round Robin is the default and so it is not absolutely required. Being explicit however, is considered to be a good practice as ensures that your peers are aware of your intentions when reviewing the table design.

This table type is commonly used when there is no obvious key column to hash the data by. It can also be used by smaller or less significant tables where the movement cost may not be so great.

Loading data into a round robin distributed table tends to be faster than loading into a hash distributed table. With a round-robin distributed table there is no need to understand the data or perform the hash prior to loading. For this reason Round-Robin tables often make good loading targets.

> [AZURE.NOTE] When data is round robin distributed the data is allocated to the distribution at the *buffer* level.

### Recommendations

Consider using Round Robin distribution for your table in the following scenarios:

- When there is no obvious joining key
- If a candidate hash distribution key is not known
- If the table does not share a common joining key with other tables
- If the join is less significant than other joins in the query
- When the table is an initial loading table

## Hash distribution

Hash distribution uses an internal function to spread a dataset across the distributions by hashing a single column. When data is hashed there is no explicit order to the data being allocated to a distribution. However, the hash itself is a deterministic process. This makes the results of the hash predictable. For example, hashing an integer column containing the value 10 will always yield the same hash value. This means that ***any*** hashed integer column  containing the value 10 would end up being allocated to the same distribution. This is true even across tables.

The predictability of the hash is extremely important. It means that hash distributing the data can lead to performance improvements when reading data and joining tables together.

As you will see below, hash distribution can be very effective for query optimization. This is why it is considered to be an optimized form of data distribution.

> [AZURE.NOTE] Remember! The hash is not only based on the value of the data.  The hash is a combination of both the value and the data type.

Below is a table that has been hash distributed by ProductKey.

```sql
CREATE TABLE [dbo].[FactInternetSales]
(   [ProductKey]            int          NOT NULL
,   [OrderDateKey]          int          NOT NULL
,   [CustomerKey]           int          NOT NULL
,   [PromotionKey]          int          NOT NULL
,   [SalesOrderNumber]      nvarchar(20) NOT NULL
,   [OrderQuantity]         smallint     NOT NULL
,   [UnitPrice]             money        NOT NULL
,   [SalesAmount]           money        NOT NULL
)
WITH
(   CLUSTERED COLUMNSTORE INDEX
,   DISTRIBUTION = HASH([ProductKey])
)
;
```

> [AZURE.NOTE] When data is hash distributed the data is allocated to the distribution at the row level.

## Table partitions
Table partitions are supported and easy to define.

Example of SQL Data Warehouse partitioned `CREATE TABLE` command:

```sql
CREATE TABLE [dbo].[FactInternetSales]
(
    [ProductKey]            int          NOT NULL
,   [OrderDateKey]          int          NOT NULL
,   [CustomerKey]           int          NOT NULL
,   [PromotionKey]          int          NOT NULL
,   [SalesOrderNumber]      nvarchar(20) NOT NULL
,   [OrderQuantity]         smallint     NOT NULL
,   [UnitPrice]             money        NOT NULL
,   [SalesAmount]           money        NOT NULL
)
WITH
(   CLUSTERED COLUMNSTORE INDEX
,   DISTRIBUTION = HASH([ProductKey])
,   PARTITION   (   [OrderDateKey] RANGE RIGHT FOR VALUES
                    (20000101,20010101,20020101
                    ,20030101,20040101,20050101
                    )
                )
)
;
```

Notice that there is no partitioning function or scheme in the definition. SQL Data Warehouse uses a simplified definition of partitions which is slightly different from SQL Server. All you have to do is identify the boundary points for the partitioned column.

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
To learn more about table design, see the [Distribute][], [Index][], [Partition][], [Data Types][], and [Statistics][] articles.  For more tips on best practices, see [SQL Data Warehouse Best Practices][].

<!--Image references-->

<!--Article references-->
[Overview]: ./sql-data-warehouse-tables-overview.md
[Distribute][] ./sql-data-warehouse-tables-distribute.md
[Index][] ./sql-data-warehouse-tables-index.md
[Partition][] ./sql-data-warehouse-tables-partition.md
[Data Types][] ./sql-data-warehouse-tables-data-types.md
[Statistics][] ./sql-data-warehouse-tables-statistics.md
[Assigning Surrogate Keys]: https://blogs.msdn.microsoft.com/sqlcat/2016/02/18/assigning-surrogate-key-to-dimension-tables-in-sql-dw-and-aps/
[SQL Data Warehouse Best Practices]: sql-data-warehouse-best-practices.md

<!--MSDN references-->

<!--Other Web references-->

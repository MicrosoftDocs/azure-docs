<properties
   pageTitle="Distributing Tables in SQL Data Warehouse | Microsoft Azure"
   description="Distributing Tables in SQL Data Warehouse in Azure SQL Data Warehouse."
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

# Distributing Tables in SQL Data Warehouse

> [AZURE.SELECTOR]
- [Overview][]
- [Distribute][]
- [Index][]
- [Partition][]
- [Data Types][]
- [Statistics][]

## Introduction to distributed tables

Making smart hash distribution decisions is one of the most important ways to improve query performance.  

There are in fact three major factors:

1. Minimize Data Movement
2. Avoid Data Skew
3. Provide Balanced Execution

## Minimize data movement
Data Movement most commonly arises when tables are joined together or aggregations on tables are performed. Hash distributing tables on a shared key is one of the most effective methods for minimizing this movement.

However, for the hash distribution to be effective in minimizing the movement the following criteria must all be true:

1. Both tables need to be hash distributed and be joined on the shared distribution key
2. The data types of both columns need to match
3. The joining columns need to be equi-join (i.e. the values in the left table's column need to equal the values in the right table's column)
4. The join is **not** a `CROSS JOIN`

> [AZURE.NOTE] Columns used in `JOIN`, `GROUP BY`, `DISTINCT` and `HAVING` clauses all make for good HASH column candidates. On the other hand columns in the `WHERE` clause do **not** make for good hash column candidates. See the section on balanced execution below.

Data movement may also arise from query syntax (`COUNT DISTINCT` and the `OVER` clause both being great examples) when used with columns that do not include the hash distribution key.

> [AZURE.NOTE] Round-Robin tables typically generate data movement. The data in the table has been allocated in a non-deterministic fashion and so the data must first be moved prior to most queries being completed.

## Avoid data skew
In order for hash distribution to be effective it is important that the column chosen exhibits the following properties:

1. The column contains a significant number of distinct values.
2. The column does not suffer from **data skew**.

Each distinct value will be allocated to a distribution. Consequently, the data will require a reasonable number of distinct values to ensure enough unique hash values are generated. Otherwise we might get a poor quality hash. If the number of distributions exceeds the number of distinct values for example then some distributions will be left empty. This would hurt performance.

Similarly, if all of the rows for the hashed column contained the same value then the data is said to be **skewed**. In this extreme case only one hash value would have been created resulting in all rows ending up inside a single distribution. Ideally, each distinct value in the hashed column would have the same number of rows.

> [AZURE.NOTE] Round-robin tables do not exhibit signs of skew. This is because the data is stored evenly across the distributions.

## Provide balanced execution
Balanced execution is achieved when each distribution has the same amount of work to perform. Massively Parallel Processing (MPP) is a team game; everyone has to cross the line before anyone can be declared the winner. If every distribution has the same amount of work (i.e. data to process) then all of the queries will finish at about the same time. This is known as balanced execution.

As has been seen, data skew can affect balanced execution. However, so can the choice of hash distribution key. If a column has been chosen that appears in the `WHERE` clause of a query then it is quite likely that the query will not be balanced.  

> [AZURE.NOTE] The `WHERE` clause typically helps identify columns that are best used for partitioning.

A good example of a column that appears in the `WHERE` clause would be a date field.  Date fields are a classic examples of great partitioning columns but often poor hash distribution columns. Typically, data warehouse queries are over a specified time period such as day, week or month. Hash distributing by date may have actually limited our scalablity and hurt our performance. If for example the date range specified was for a week i.e. 7 days then the maximum number of hashes would be 7 - one for each day. This means that only 7 of our distributions would contain data. The remaining distributions would not have any data. This would result in an unbalanced query execution as only 7 distributions are processing data.

> [AZURE.NOTE] Round-robin tables typically provide balanced execution. This is because the data is stored evenly across the distributions.

## Recommendations
To maximize your performance and overall query throughput try and ensure that your hash distributed tables follow this pattern as much as possible:

Hash distribution key:

1. Is a static value since you cannot update the hash column.
2. Is used in `JOIN`, `GROUP BY`, `DISTINCT`, or `HAVING` clauses in your queries.
2. Is not used in `WHERE` clauses
3. Has lots of different values, at least 1000.
4. Does not have a disproportionately large number of rows that will hash to a small number of distributions.
5. Is defined as NOT NULL. NULL rows will congregate in one distribution.

## Summary

Hash distribution can be summarized as follows:

- The hash function is deterministic. The same value is always assigned to the same distribution.
- One column is used as the distribution column. The hash function uses the nominated column to compute the row assignments to distributions.
- The hash function is based on the type of the column not on the values themselves
- Hash distributing a table can sometimes result in a skewed table
- Hash distributed tables generally require less data movement when resolving queries, and therefore improve query performance for large fact tables.
- Observe the recommendations for hash distributed column selection to enhance query throughput.

> [AZURE.NOTE] In SQL Data Warehouse data type consistency matters! Make sure that the existing schema is consistently using the same type for a column. This is especially important for the distribution key. If the distribution key data types are not synchronized and the tables are joined then needless data movement will occur. This could be costly if the tables are large and would result in reduced throughput  and performance.

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


<!--Article references-->
[Overview]: ./sql-data-warehouse-tables-overview.md
[Distribute][] ./sql-data-warehouse-tables-distribute.md
[Index][] ./sql-data-warehouse-tables-index.md
[Partition][] ./sql-data-warehouse-tables-partition.md
[Data Types][] ./sql-data-warehouse-tables-data-types.md
[Statistics][] ./sql-data-warehouse-tables-statistics.md

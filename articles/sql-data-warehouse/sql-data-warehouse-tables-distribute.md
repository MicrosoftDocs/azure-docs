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

This article will introduce you to distributing tables in SQL Data Warehouse.

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

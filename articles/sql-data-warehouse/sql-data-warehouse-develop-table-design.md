<properties
   pageTitle="Table design in SQL Data Warehouse | Microsoft Azure"
   description="Tips for designing tables in Azure SQL Data Warehouse for developing solutions."
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
   ms.date="06/26/2015"
   ms.author="JRJ@BigBangData.co.uk;barbkess"/>

# Table design in SQL Data Warehouse #
SQL Data Warehouse is a massively parallel processing (MPP) distributed database system. Consequently, it stores data across many different locations known as **distributions**. Each **distribution** is like a bucket; storing a unique subset of the data in the data warehouse. By spreading the data and processing capability across multiple nodes SQL Data Warehouse is able to offer huge scalability - far beyond any single system.

When a table is created in SQL Data Warehouse, it is actually spread across all of the the distributions.

This article will cover the following topics:

- Supported data types
- Principles of data distribution
- Round Robin Distribution
- Hash Distribution
- Table Partitioning
- Statistics
- Unsupported features

## Supported data types
SQL Data Warehouse supports the common business data types:

- **bigint**
- **binary**
- **bit**
- **char**
- **date**
- **datetime**
- **datetime2**
- **datetimeoffset**
- **decimal**
- **float**
- **int**
- **money**
- **nchar**
- **nvarchar**
- **real**
- **smalldatetime**
- **smallint**
- **smallmoney**
- **time**
- **tinyint**
- **varbinary**
- **varchar**

You can identify columns in your data warehouse that contain incompatible types using the following query:

```
SELECT  t.[name]
,       c.[name]
,       c.[system_type_id]
,       c.[user_type_id]
,       y.[is_user_defined]
,       y.[name]
FROM sys.tables  t
JOIN sys.columns c on t.[object_id]    = c.[object_id]
JOIN sys.types   y on c.[user_type_id] = y.[user_type_id]
WHERE y.[name] IN
                (   'geography'
                ,   'geometry'
                ,   'hierarchyid'
                ,   'image'
                ,   'ntext'
                ,   'numeric'
                ,   'sql_variant'
                ,   'sysname'
                ,   'text'
                ,   'timestamp'
                ,   'uniqueidentifier'
                ,   'xml'
                )

OR  (   y.[name] IN (  'nvarchar','varchar','varbinary')
    AND c.[max_length] = -1
    )
OR  y.[is_user_defined] = 1
;

```

The query includes any user defined data types which are also not supported.

If you have unsupported types in your database do not worry. Some alternatives you can use instead are proposed below.

Instead of:

- **geometry**, use a varbinary type
- **geography**, use a varbinary type
- **hierarchyid**, CLR type not native
- **image**, **text**, **ntext** when text based use varchar/nvarchar (smaller the better)
- **nvarchar(max)**, use varchar(4000) or smaller for better performance
- **numeric**, use decimal
- **sql_variant**, split column into several strongly typed columns
- **sysname**, use nvarchar(128)
- **table**, convert to temporary tables
- **timestamp**, re-work code to use datetime2 and `CURRENT_TIMESTAMP` function. Note you cannot have current_timestamp as a default constraint and the value will not automatically update. If you need to migrate rowversion values from a timestamp typed column then use BINARY(8) or VARBINARY(8) for NOT NULL or NULL row version values.
- **varchar(max)**, use varchar(8000) or smaller for better performance
- **uniqueidentifier**, use varbinary(8)
- **user defined types**, convert back to their native types where possible
- **xml**, use a varchar(8000) or smaller for better performance - split across columns if needed

Partial support:

- Default constraints support literals and constants only. Non-deterministic expressions or functions, such as `GETDATE()` or `CURRENT_TIMESTAMP`, are not supported.

> [AZURE.NOTE] Define your tables so that the maximum possible row size, including the full length of variable length columns, does not exceed 32,767 bytes. While you can define a row with variable length data that can exceed this figure, you will not be be able to insert data into the table. Also, try to limit the size of your variable length columns for even better throughput for running queries.

## Principles of data distribution

There are two choices for distributing data in SQL Data Warehouse:

1. Distribute data based on hashing values from a single column
2. Distribute data evenly but randomly  

Data distribution is decided at the table level. All tables are distributed so you will have the opportunity to make this decision for each table in your SQL Data Warehouse database.

The first option is known as **round-robin** distribution - sometimes known as the random hash. You can think of this as the default or fail safe option.

The second option is known as the **hash** distribution. You can consider it an optimized form of data distribution. It is preferred where clusters of tables share common joining and/or aggregation criteria.

## Round-robin distribution

Round-Robin distribution is a method of spreading data as evenly as possible across all distributions. Buffers containing rows of data are allocated in turn (hence the name round robin) to each distribution. The process is repeated until all data buffers have been allocated. At no stage is the data sorted or ordered in a round robin distributed table. A round robin distribution is sometimes called a random hash for this reason. The data is simply spread as evenly as possible across the distributions.

Below is an example of round robin distributed table:

```
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

```
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

Loading data into a round robin distributed table tends to be faster than loading into a hash distributed table. With a round-robin distributed table there is no need to understand the data or perform the hash prior to loading. For this reason Round-Robin tables often make good good loading targets.

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

> [AZURE.NOTE] Remember! The hash is not based on the value of the data but rather on the type of the data being hashed.

Below is a table that has been hash distributed by ProductKey.

```
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

Example SQL Data Warehouse partitioned `CREATE TABLE` command:

```
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

Notice that there is no partitioning function or scheme in the definition. All that is taken care of when the table is created. All you have to do is identify the boundary points for the column that is going to be the partitioning key.

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

- primary keys
- foreign keys
- check constraints
- unique constraints
- unique indexes
- computed columns
- sparse columns
- user-defined types
- indexed views
- identities
- sequences
- triggers
- synonyms


## Next steps
For more development tips, see [development overview][].

<!--Image references-->

<!--Article references-->
[development overview]: sql-data-warehouse-overview-develop.md

<!--MSDN references-->

<!--Other Web references-->

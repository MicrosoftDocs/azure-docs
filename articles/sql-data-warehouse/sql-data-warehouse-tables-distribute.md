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
- [Data Types][]
- [Distribute][]
- [Index][]
- [Partition][]
- [Statistics][]
- [Temporary][]

## Introduction to distributed tables

SQL Data Warehouse is a massively parallel processing (MPP) distributed database system.  Essentially this means that behind the scenes, your data is divided across several databases.  By dividing the data and processing capability across multiple nodes, SQL Data Warehouse can offer huge scalability - far beyond any single system.  Behind the scenes, SQL Data Warehouse divides your data into 60 distributed databases, as simply called **distributions**.

## Select distribution method

SQL Data Warehouse needs an algorithm to distribute your data.  By default, when you do not define a data distribution method, your table will be distributed using a **round robin** algorithm.  However, as you become more sophisticated in your implementation, you will want to consider using **hash distributed** tables to optimize performance.

### Round Robin Tables

Using the Round Robin method of distributing data is very much how it sounds.  As your data is loaded, each row is simply sent to the next distribution.  This method of distributing the data will always distribute the data very evenly across all of the distributions.  By default, if no distribution method is choosen, this method will be used.  However, while round robin tables are easy to use, because data is randomly distributed across the system it means that the system can't guarantee which distribution each row is on.  As a result, the system some times needs to invoke a data movement operation to better organize your data before it can resolve a query.  This extra step can slow down your queries.  

### Hash Distributed Tables

Using a **Hash distributed** algorithm to distribute your tables can improve performance for many scenarios.  Hash distributed tables are **hashed** on a column which determines which distribution the 

The distribution column is very much what it sounds like.  It is the column which is hashed in order to determine how the data in your tables is distributed across the compute node databases in your system.  Each **distribution** is like a bucket; storing a unique subset of the data in the data warehouse.  While round robin tables can be sufficient in some scenarios, defining distrubution columns can greatly reduce data movement during queries, thus optimizing performance.  Making smart hash distribution decisions is one of the most important ways you can improve query performance.

## Select distribution column

When you choose to **hash distributed** a table, you will need to select a distribution column.  When selecting a distribution column, there are three major factors to consider.  Select a column which will:

1. Distribute evenly aross distributions
2. Minimize data movement
3. Not be updated

### Minimize data movement
Data Movement most commonly arises when tables are joined together or aggregations on tables are performed. Hash distributing tables on a shared key is one of the most effective methods for minimizing this movement.

However, for the hash distribution to be effective in minimizing the movement the following criteria must all be true:

1. Both tables need to be hash distributed and be joined on the shared distribution key
2. The data types of both columns need to match
3. The joining columns need to be equi-join (i.e. the values in the left table's column need to equal the values in the right table's column)
4. The join is **not** a `CROSS JOIN`

> [AZURE.NOTE] Columns used in `JOIN`, `GROUP BY`, `DISTINCT` and `HAVING` clauses all make for good HASH column candidates. On the other hand columns in the `WHERE` clause do **not** make for good hash column candidates. See the section on balanced execution below.

Data movement may also arise from query syntax (`COUNT DISTINCT` and the `OVER` clause both being great examples) when used with columns that do not include the hash distribution key.

> [AZURE.NOTE] Round-Robin tables typically generate data movement. The data in the table has been allocated in a non-deterministic fashion and so the data must first be moved prior to most queries being completed.

### Avoid data skew
In order for hash distribution to be effective it is important that the column chosen exhibits the following properties:

1. The column contains a significant number of distinct values.
2. The column does not suffer from **data skew**.

Each distinct value will be allocated to a distribution. Consequently, the data will require a reasonable number of distinct values to ensure enough unique hash values are generated. Otherwise we might get a poor quality hash. If the number of distributions exceeds the number of distinct values for example then some distributions will be left empty. This would hurt performance.

Similarly, if all of the rows for the hashed column contained the same value then the data is said to be **skewed**. In this extreme case only one hash value would have been created resulting in all rows ending up inside a single distribution. Ideally, each distinct value in the hashed column would have the same number of rows.

> [AZURE.NOTE] Round-robin tables do not exhibit signs of skew. This is because the data is stored evenly across the distributions.

### Provide balanced execution
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

## Troubleshooting data skew

This tutorial identifies data skew in your hash distributed tables, and gives suggestions for fixing the problem. 

When table data is distributed using the hash distribution method there is a chance that some distributions will be skewed to have disproportionately more data than others. Excessive data skew can impact query performance because the final result of a distributed query will not be ready until the longest-running distribution finishes. Depending on the degree of the data skew you might need to address it.

In this tutorial you will:

- Use metadata to determine which tables have data skew
- Learn tips for knowing when to resolve data skew
- Re-create the table to resolve data skew

## DBCC PDW_SHOWSPACEUSED

One method of identifying data skew is to use [DBCC PDW_SHOWSPACEUSED()][]

```sql
-- Find data skew for a distributed table
DBCC PDW_SHOWSPACEUSED('dbo.FactInternetSales');
```

This is a very quick and simple way to see the number of table rows that are stored in each of the 60 distributions of your database. Remember that for the most balanced performance, the rows in your distributed table should be spread evenly across all the distributions.

However, if you query the Azure SQL Data Warehouse dynamic management views (DMV) you can perform a more detailed analysis. The rest of this article shows you how to do this.

## Step 1: Create a view that finds data skew

Create this view to identify which tables have data skew.

```sql
CREATE VIEW dbo.vDistributionSkew
AS
WITH base
AS
(
SELECT 
	SUBSTRING(@@version,34,4)															AS  [build_number]
,	GETDATE()																			AS  [execution_time]
,	DB_NAME()																			AS  [database_name]
,	s.name																				AS  [schema_name]
,	t.name																				AS  [table_name]
,	QUOTENAME(s.name)+'.'+QUOTENAME(t.name)												AS  [two_part_name]
,	nt.[name]																			AS  [node_table_name]
,	ROW_NUMBER() OVER(PARTITION BY nt.[name] ORDER BY (SELECT NULL))					AS  [node_table_name_seq]
,	tp.[distribution_policy_desc]														AS  [distribution_policy_name]
,	nt.[distribution_id]																AS  [distribution_id]
,	nt.[pdw_node_id]																	AS  [pdw_node_id]
,	pn.[type]																			AS	[pdw_node_type]
,	pn.[name]																			AS	[pdw_node_name]
,	nps.[partition_number]																AS	[partition_nmbr]
,	nps.[reserved_page_count]															AS	[reserved_space_page_count]
,	nps.[reserved_page_count] - nps.[used_page_count]									AS	[unused_space_page_count]
,	nps.[in_row_data_page_count] 
	+ nps.[row_overflow_used_page_count] + nps.[lob_used_page_count]					AS  [data_space_page_count]
,	nps.[reserved_page_count] 
	- (nps.[reserved_page_count] - nps.[used_page_count]) 
	- ([in_row_data_page_count]+[row_overflow_used_page_count]+[lob_used_page_count])	AS  [index_space_page_count]
,	nps.[row_count]																		AS  [row_count]
from sys.schemas s
join sys.tables t								ON	s.[schema_id]			= t.[schema_id]
join sys.pdw_table_distribution_properties	tp	ON	t.[object_id]			= tp.[object_id]
join sys.pdw_table_mappings tm					ON	t.[object_id]			= tm.[object_id]
join sys.pdw_nodes_tables nt					ON	tm.[physical_name]		= nt.[name]
join sys.dm_pdw_nodes pn 						ON  nt.[pdw_node_id]		= pn.[pdw_node_id]
join sys.dm_pdw_nodes_db_partition_stats nps	ON	nt.[object_id]			= nps.[object_id]
												AND nt.[pdw_node_id]		= nps.[pdw_node_id]
												AND nt.[distribution_id]	= nps.[distribution_id]
)
, size
AS
(
SELECT	[build_number]
,		[execution_time]
,		[database_name]
,		[schema_name]
,		[table_name]
,		[two_part_name]
,		[node_table_name]
,		[node_table_name_seq]
,		[distribution_policy_name]
,		[distribution_id]
,		[pdw_node_id]
,		[pdw_node_type]
,		[pdw_node_name]
,		[partition_nmbr]
,		[reserved_space_page_count]
,		[unused_space_page_count]
,		[data_space_page_count]
,		[index_space_page_count]
,		[row_count]
,		([reserved_space_page_count] * 8.0)				AS [reserved_space_KB]
,		([reserved_space_page_count] * 8.0)/1000		AS [reserved_space_MB]
,		([reserved_space_page_count] * 8.0)/1000000		AS [reserved_space_GB]
,		([reserved_space_page_count] * 8.0)/1000000000	AS [reserved_space_TB]
,		([unused_space_page_count]   * 8.0)				AS [unused_space_KB]
,		([unused_space_page_count]   * 8.0)/1000		AS [unused_space_MB]
,		([unused_space_page_count]   * 8.0)/1000000		AS [unused_space_GB]
,		([unused_space_page_count]   * 8.0)/1000000000	AS [unused_space_TB]
,		([data_space_page_count]     * 8.0)				AS [data_space_KB]
,		([data_space_page_count]     * 8.0)/1000		AS [data_space_MB]
,		([data_space_page_count]     * 8.0)/1000000		AS [data_space_GB]
,		([data_space_page_count]     * 8.0)/1000000000	AS [data_space_TB]
,		([index_space_page_count]	 * 8.0)				AS [index_space_KB]
,		([index_space_page_count]	 * 8.0)/1000		AS [index_space_MB]
,		([index_space_page_count]	 * 8.0)/1000000		AS [index_space_GB]
,		([index_space_page_count]	 * 8.0)/1000000000	AS [index_space_TB]
FROM	base
)
SELECT	* 
FROM	size
;
```

## Step 2: Query the view

Now that you have created the view, run this example query to identify which tables have data skew.

```sql
SELECT	[two_part_name]
,		[distribution_id]
,		[row_count]
,		[reserved_space_GB]
,		[unused_space_GB]
,		[data_space_GB]
,		[index_space_GB]
FROM	[dbo].[vDistributionSkew]
WHERE	[table_name] = 'FactInternetSales'
ORDER BY [row_count] DESC
```

>[AZURE.NOTE] ROUND_ROBIN distributed tables should not be skewed. Data is distributed evenly across the nodes by design.

## Step 3: Decide if you should resolve data skew

To decide if you should resolve data skew in a table, you should understand as much as possible about the data volumes and queries in your workload. 

Distributing data is a matter of finding the right balance between minimizing data skew and minimizing data movement. These can be opposing goals, and sometimes you will want to keep data skew in order to reduce data movement. For example, when the distribution column is frequently the shared column in joins and aggregations, you will be minimizing data movement. The benefit of having the minimal data movement might outweigh the impact of having data skew. 

## Step 4: Resolve data skew

Here are two possible ways to resolve data skew. Use one of these if you have decided that you should resolve the skew.

### Method 1: Re-create the table with a different distribution column

The typical way to resolve data skew is to re-create the table with a different distribution column. For guidance on selecting a hash distribution column, see [Distribute][]. This example uses [CTAS][] to re-create a table with a different distribution column. 

```sql
CREATE TABLE [dbo].[FactInternetSales_CustomerKey] 
WITH (  CLUSTERED COLUMNSTORE INDEX
     ,  DISTRIBUTION =  HASH([CustomerKey])
     ,  PARTITION       ( [OrderDateKey] RANGE RIGHT FOR VALUES (   20000101, 20010101, 20020101, 20030101
                                                                ,   20040101, 20050101, 20060101, 20070101
                                                                ,   20080101, 20090101, 20100101, 20110101
                                                                ,   20120101, 20130101, 20140101, 20150101
                                                                ,   20160101, 20170101, 20180101, 20190101
                                                                ,   20200101, 20210101, 20220101, 20230101
                                                                ,   20240101, 20250101, 20260101, 20270101
                                                                ,   20280101, 20290101
                                                                )
                        )
    )
AS
SELECT  *
FROM    [dbo].[FactInternetSales]
OPTION  (LABEL  = 'CTAS : FactInternetSales_CustomerKey')
;

--Rename the objects
RENAME OBJECT [dbo].[FactInternetSales] TO [FactInternetSales_ProductKey];
RENAME OBJECT [dbo].[FactInternetSales_CustomerKey] TO [FactInternetSales];
```

### Method 2: Re-create the table using ROUND-ROBIN distribution

This example re-creates the table by using ROUND-ROBIN instead of HASH distribution. This change will produce even data distribution. However, it will usually increase data movement for queries. 

```sql
CREATE TABLE [dbo].[FactInternetSales_ROUND_ROBIN] 
WITH (  CLUSTERED COLUMNSTORE INDEX
     ,  DISTRIBUTION =  ROUND_ROBIN
     ,  PARTITION       ( [OrderDateKey] RANGE RIGHT FOR VALUES (   20000101, 20010101, 20020101, 20030101
                                                                ,   20040101, 20050101, 20060101, 20070101
                                                                ,   20080101, 20090101, 20100101, 20110101
                                                                ,   20120101, 20130101, 20140101, 20150101
                                                                ,   20160101, 20170101, 20180101, 20190101
                                                                ,   20200101, 20210101, 20220101, 20230101
                                                                ,   20240101, 20250101, 20260101, 20270101
                                                                ,   20280101, 20290101
                                                                )
                        )
    )
AS
SELECT  *
FROM    [dbo].[FactInternetSales]
OPTION  (LABEL  = 'CTAS : FactInternetSales_ROUND_ROBIN')
;

--Rename the objects
RENAME OBJECT [dbo].[FactInternetSales] TO [FactInternetSales_HASH];
RENAME OBJECT [dbo].[FactInternetSales_ROUND_ROBIN] TO [FactInternetSales];
```

## Next steps

To learn more about table design, see the [Distribute][], [Index][], [Partition][], [Data Types][], [Statistics][] and [Temporary Tables][Temporary] articles.  For an overview of best practices, see [SQL Data Warehouse Best Practices][].


<!--Image references-->

<!--Article references-->
[Overview]: ./sql-data-warehouse-tables-overview.md
[Data Types]: ./sql-data-warehouse-tables-data-types.md
[Distribute]: ./sql-data-warehouse-tables-distribute.md
[Index]: ./sql-data-warehouse-tables-index.md
[Partition]: ./sql-data-warehouse-tables-partition.md
[Statistics]: ./sql-data-warehouse-tables-statistics.md
[Temporary]: ./sql-data-warehouse-tables-temporary.md
[SQL Data Warehouse Best Practices]: ./sql-data-warehouse-best-practices.md

<!--MSDN references-->
[DBCC PDW_SHOWSPACEUSED()]: https://msdn.microsoft.com/en-us/library/mt204028.aspx

<!--Other Web references-->

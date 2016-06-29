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
   ms.date="06/29/2016"
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

SQL Data Warehouse is a massively parallel processing (MPP) distributed database system.  By dividing data and processing capability across multiple nodes, SQL Data Warehouse can offer huge scalability - far beyond any single system.  Deciding how to distribute your data within your SQL Data Warehouse is one of the most important factors to achieving optimal performance.   The key to optimimal performance is minimizing data movement and in turn the key to minimizing data movement is selecting the right distribution strategy.

## Select distribution method

Behind the scenes, SQL Data Warehouse divides your data into 60 databases.  Each individual database is referered to as a **distribution**.  When data is loaded into each table, SQL Data Warehouse has to know how to divide your data across these 60 distributions.  The distribution method is defined at the table level.  By default, when you do not define a data distribution method, your table will be distributed using the **round robin** distribution method.  However, as you become more sophisticated in your implementation, you will want to consider using **hash distributed** tables to minimize data movement which will in turn optimize query performance.

### Round Robin Tables

Using the Round Robin method of distributing data is very much how it sounds.  As your data is loaded, each row is simply sent to the next distribution.  This method of distributing the data will always distribute the data very evenly across all of the distributions.  By default, if no distribution method is choosen, this method will be used.  However, while round robin tables are easy to use, because data is randomly distributed across the system it means that the system can't guarantee which distribution each row is on.  As a result, the system some times needs to invoke a data movement operation to better organize your data before it can resolve a query.  This extra step can slow down your queries.

Both of these examples will create a Round Robin Table:

```SQL
-- Round Robin by default
CREATE TABLE RoundRobinByDefault   
  (
    id int NOT NULL,  
    lastName varchar(20),  
    zipCode varchar(6)  
  )  
;

-- Explicitly Round Robin
CREATE TABLE RoundRobinExplicit   
  (
    id int NOT NULL,  
    lastName varchar(20),  
    zipCode varchar(6)  
  )  
WITH ( DISTRIBUTION = ROUND_ROBIN ); 
```

### Hash Distributed Tables

Using a **Hash distributed** algorithm to distribute your tables can improve performance for many scenarios.  Hash distributed tables are **hashed** on a column which determines which distribution the 

The distribution column is very much what it sounds like.  It is the column which is hashed in order to determine how the data in your tables is distributed across the compute node databases in your system.  Each **distribution** is like a bucket; storing a unique subset of the data in the data warehouse.  While round robin tables can be sufficient in some scenarios, defining distrubution columns can greatly reduce data movement during queries, thus optimizing performance.  Making smart hash distribution decisions is one of the most important ways you can improve query performance.

This example will create a table distributed on id:

```SQL
CREATE TABLE DistributedById   
  (
    id int NOT NULL,  
    lastName varchar(20),  
    zipCode varchar(6)  
  ) 
WITH ( DISTRIBUTION = HASH(ID) );
;
```

## Select distribution column

When you choose to **hash distribute** a table, you will need to select a distribution column.  When selecting a distribution column, there are three major factors to consider.  

Select a column which will:

1. Not be updated
2. Distribute data evenly, avoiding data skew
3. Minimize data movement

### Not be updated

Distribution columns are not updatable, therefore, select a column with static values.  If a column will need to be updated, it is generally not a good distribution candidate.  If there is a case where you must update a distribution column, this can be done by first deleting the row and then inserting a new row.

### Distribute evenly aross distributions, avoiding data skew

Since a distributed system performs only as fast as it's slowest distribution, it is important to divide the work evenly across the distributions in order to achieve balanced execution across the system.  The way the work is divided on a distributed system is based on where the data for each distibution lives.  This makes it very important to select the right distribution column for distributing the data so that each distribution has equal work and will take the same time to complete its portion of the work.  When work is well divided across the system, this is called balanced execution.  When data is not evenly divided on a system, and not well balanced, we call this **data skew**.  

To divide data evenly and avoid data skew, consider the following when selecting your distibution column:

1. Select a column which contains a significant number of distinct values.
2. Avoid distributing data on columns with a high frequency of a few values or a high frequency of nulls.
3. Avoid distributing data on date columns.
4. Avoid distributing on columns with less than 60 

Since each value is hashed to one of 60 distributions, to achieve even distribution you will want to select a column that is highly unique and provides well over 60 unique values.  To illustrate, consider the extreme case where a column only has 40 unique values.  If this column was selected as the distribution key, the data for that table would be spread across only part of the system, leaving 20 distributions with no data and no processing to do.  Conversely, the other 40 distributions would have more work to do that if the data was evenly spread over 60 distributions.

If you were to distribute a table on a highly nullable column, then all of the null values will land on the same distribution and that distribution will have to do more work than the other distributions, which will slow the entire system down.  Distributing on a date column can also cause processing skew in the cases where queries are highly selective on date and only a few dates are involved in a query.

When no good candidate columns exist, then consider using round robin as the distribution method.

### Minimize data movement

Minimizing data movement by selecting the right distribution column is one of the most important strategies for ptimizing performance of your SQL Data Warehouse.  Data Movement most commonly arises when tables are joined or aggregations are performed.  Hash distributing large fact tables on a commonly joined column is one of the most effective methods for minimizing data movement.  In addition to selecting a join column to avoid data movement, there are also some criteria which must be met to avoid data movement.  To avoid data movement:

1. The tables involved in the join must be hash distributed on one of the join columns.
2. The data types of the join columns must match.
3. The columns must be joined with an equals operator.
4. The join type may not be a `CROSS JOIN`.

Columns used in `JOIN`, `GROUP BY`, `DISTINCT`, `OVER`and `HAVING` clauses all make for good hash distribution candidates. On the other hand, columns in the `WHERE` clause do **not** make for good hash column candidates because they limit which distributions participate in the query.  Generally speaking, if you have two large fact tables frequenly involved in a join, you will most often distribution on one of the join columns.  If you have a table that is never joined to another large fact table, then look to columns that are frequently in the `GROUP BY` clause.  Unless you cannot find a good candidate column that will distribute your data evenly, it will usually benefit you queries to select a distribution column rather than use the default round robin distribution.


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

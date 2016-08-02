<properties
   pageTitle="Distributing tables in SQL Data Warehouse | Microsoft Azure"
   description="Getting started with distributing tables in Azure SQL Data Warehouse."
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
   ms.date="08/01/2016"
   ms.author="jrj;barbkess;sonyama"/>

# Distributing tables in SQL Data Warehouse

> [AZURE.SELECTOR]
- [Overview][]
- [Data Types][]
- [Distribute][]
- [Index][]
- [Partition][]
- [Statistics][]
- [Temporary][]

SQL Data Warehouse is a massively parallel processing (MPP) distributed database system.  By dividing data and processing capability across multiple nodes, SQL Data Warehouse can offer huge scalability - far beyond any single system.  Deciding how to distribute your data within your SQL Data Warehouse is one of the most important factors to achieving optimal performance.   The key to optimal performance is minimizing data movement and in turn the key to minimizing data movement is selecting the right distribution strategy.

## Understanding data movement

In an MPP system, the data from each table is divided across several underlying databases.  The most optimized queries on an MPP system can simply be passed through to execute on the individual distributed databases with no interaction between the other databases.  For example, let's say you have a database with sales data which contains two tables, sales and customers.  If you have a query that needs to join your sales table to your customer table and you divide both your sales and customer tables up by customer number, putting each customer in a separate database, any queries which join sales and customer can be solved within each database with no knowledge of the other databases.  In contrast, if you divided your sales data by order number and your customer data by customer number, then any given database will not have the corresponding data for each customer and thus if you wanted to join your sales data to your customer data, you would need to get the data for each customer from the other databases.  In this second example, data movement would need to occur to move the customer data to the sales data, so that the two tables can be joined.  

Data movement isn't always a bad thing, sometimes it's necessary to solve a query.  But when this extra step can be avoided, naturally your query will run faster.  Data Movement most commonly arises when tables are joined or aggregations are performed.  Often you need to do both, so while you may be able to optimize for one scenario, like a join, you still need data movement to help you solve for the other scenario, like an aggregation.  The trick is figuring out which is less work.  In most cases, distributing large fact tables on a commonly joined column is the most effective method for reducing the most data movement.  Distributing data on join columns is a much more common method to reduce data movement than distributing data on columns involved in an aggregation.

## Select distribution method

Behind the scenes, SQL Data Warehouse divides your data into 60 databases.  Each individual database is referred to as a **distribution**.  When data is loaded into each table, SQL Data Warehouse has to know how to divide your data across these 60 distributions.  

The distribution method is defined at the table level and currently there are two choices:

1. **Round robin** which distribute data evenly but randomly.
2. **Hash Distributed** which distributes data based on hashing values from a single column

By default, when you do not define a data distribution method, your table will be distributed using the **round robin** distribution method.  However, as you become more sophisticated in your implementation, you will want to consider using **hash distributed** tables to minimize data movement which will in turn optimize query performance.

### Round Robin Tables

Using the Round Robin method of distributing data is very much how it sounds.  As your data is loaded, each row is simply sent to the next distribution.  This method of distributing the data will always randomly distribute the data very evenly across all of the distributions.  That is, there is no sorting done during the round robin process which places your data.  A round robin distribution is sometimes called a random hash for this reason.  With a round-robin distributed table there is no need to understand the data.  For this reason, Round-Robin tables often make good loading targets.

By default, if no distribution method is chosen, the round robin distribution method will be used.  However, while round robin tables are easy to use, because data is randomly distributed across the system it means that the system can't guarantee which distribution each row is on.  As a result, the system sometimes needs to invoke a data movement operation to better organize your data before it can resolve a query.  This extra step can slow down your queries.

Consider using Round Robin distribution for your table in the following scenarios:

- When getting started as a simple starting point
- If there is no obvious joining key
- If there is not good candidate column for hash distributing the table
- If the table does not share a common join key with other tables
- If the join is less significant than other joins in the query
- When the table is a temporary staging table

Both of these examples will create a Round Robin Table:

```SQL
-- Round Robin created by default
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
;

-- Explicitly Created Round Robin Table
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

> [AZURE.NOTE] While round robin is the default table type being explicit in your DDL is considered a best practice so that the intentions of your table layout are clear to others.

### Hash Distributed Tables

Using a **Hash distributed** algorithm to distribute your tables can improve performance for many scenarios by reducing data movement at query time.  Hash distributed tables are tables which are divided between the distributed databases using a hashing algorithm on a single column which you select.  The distribution column is what determines how the data is divided across your distributed databases.  The hash function uses the distribution column to assign rows to distributions.  The hashing algorithm and resulting distribution is deterministic.  That is the same value with the same data type will always has to the same distribution.    

This example will create a table distributed on id:

```SQL
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
,  DISTRIBUTION = HASH([ProductKey])
)
;
```

## Select distribution column

When you choose to **hash distribute** a table, you will need to select a single distribution column.  When selecting a distribution column, there are three major factors to consider.  

Select a single column which will:

1. Not be updated
2. Distribute data evenly, avoiding data skew
3. Minimize data movement

### Select distribution column which will not be updated

Distribution columns are not updatable, therefore, select a column with static values.  If a column will need to be updated, it is generally not a good distribution candidate.  If there is a case where you must update a distribution column, this can be done by first deleting the row and then inserting a new row.

### Select distribution column which will distribute data evenly

Since a distributed system performs only as fast as its slowest distribution, it is important to divide the work evenly across the distributions in order to achieve balanced execution across the system.  The way the work is divided on a distributed system is based on where the data for each distribution lives.  This makes it very important to select the right distribution column for distributing the data so that each distribution has equal work and will take the same time to complete its portion of the work.  When work is well divided across the system, this is called balanced execution.  When data is not evenly divided on a system, and not well balanced, we call this **data skew**.  

To divide data evenly and avoid data skew, consider the following when selecting your distribution column:

1. Select a column which contains a significant number of distinct values.
2. Avoid distributing data on columns with a high frequency of a few values or a high frequency of nulls.
3. Avoid distributing data on date columns.
4. Avoid distributing on columns with less than 60 

Since each value is hashed to one of 60 distributions, to achieve even distribution you will want to select a column that is highly unique and provides well over 60 unique values.  To illustrate, consider the extreme case where a column only has 40 unique values.  If this column was selected as the distribution key, the data for that table would be spread across only part of the system, leaving 20 distributions with no data and no processing to do.  Conversely, the other 40 distributions would have more work to do that if the data was evenly spread over 60 distributions.

If you were to distribute a table on a highly nullable column, then all of the null values will land on the same distribution and that distribution will have to do more work than the other distributions, which will slow the entire system down.  Distributing on a date column can also cause processing skew in the cases where queries are highly selective on date and only a few dates are involved in a query.

When no good candidate columns exist, then consider using round robin as the distribution method.

### Select distribution column which will minimize data movement

Minimizing data movement by selecting the right distribution column is one of the most important strategies for optimizing performance of your SQL Data Warehouse.  Data Movement most commonly arises when tables are joined or aggregations are performed.  Columns used in `JOIN`, `GROUP BY`, `DISTINCT`, `OVER` and `HAVING` clauses all make for **good** hash distribution candidates. On the other hand, columns in the `WHERE` clause do **not** make for good hash column candidates because they limit which distributions participate in the query.

Generally speaking, if you have two large fact tables frequently involved in a join, you will gain the most performance by distributing both tables on one of the join columns.  If you have a table that is never joined to another large fact table, then look to columns that are frequently in the `GROUP BY` clause.

There are a few key criteria which must be met to avoid data movement during a join:

1. The tables involved in the join must be hash distributed on **one** of the columns participating in the join.
2. The data types of the join columns must match between both tables.
3. The columns must be joined with an equals operator.
4. The join type may not be a `CROSS JOIN`.


## Troubleshooting data skew

When table data is distributed using the hash distribution method there is a chance that some distributions will be skewed to have disproportionately more data than others. Excessive data skew can impact query performance because the final result of a distributed query must wait for the longest running distribution to finish. Depending on the degree of the data skew you might need to address it.

### Identifying skew

A simple way to identify a table as skewed is to use `DBCC PDW_SHOWSPACEUSED`.  This is a very quick and simple way to see the number of table rows that are stored in each of the 60 distributions of your database.  Remember that for the most balanced performance, the rows in your distributed table should be spread evenly across all the distributions.

```sql
-- Find data skew for a distributed table
DBCC PDW_SHOWSPACEUSED('dbo.FactInternetSales');
```

However, if you query the Azure SQL Data Warehouse dynamic management views (DMV) you can perform a more detailed analysis.  To start, create the view [dbo.vTableSizes][] view using the SQL from [Table Overview][Overview] article.  Once the view is created, run this query to identify which tables have more than 10% data skew.

```sql
select *
from dbo.vTableSizes 
where two_part_name in 
    (
    select two_part_name
    from dbo.vTableSizes
    where row_count > 0
    group by two_part_name
    having min(row_count * 1.000)/max(row_count * 1.000) > .10
	)
order by two_part_name, row_count
;
```

### Resolving data skew

Not all skew is enough to warrant a fix.  In some cases, the performance of a table in some queries can outweigh the harm of data skew.  To decide if you should resolve data skew in a table, you should understand as much as possible about the data volumes and queries in your workload.   One way to look at the impact of skew is to use the steps in the [Query Monitoring][] article to monitor the impact of skew on query performance and specifically the impact to how long queries take to complete on the individual distributions.

Distributing data is a matter of finding the right balance between minimizing data skew and minimizing data movement. These can be opposing goals, and sometimes you will want to keep data skew in order to reduce data movement. For example, when the distribution column is frequently the shared column in joins and aggregations, you will be minimizing data movement. The benefit of having the minimal data movement might outweigh the impact of having data skew. 

The typical way to resolve data skew is to re-create the table with a different distribution column. Since there is no way to change the distribution column on an existing table, the way to change the distribution of a table it to recreate it with a [CTAS][].  Here are two examples of how resolve data skew:

### Example 1: Re-create the table with a new distribution column

This example uses [CTAS][] to re-create a table with a different hash distribution column. 

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

--Create statistics on new table
CREATE STATISTICS [ProductKey] ON [FactInternetSales_CustomerKey] ([ProductKey]);
CREATE STATISTICS [OrderDateKey] ON [FactInternetSales_CustomerKey] ([OrderDateKey]);
CREATE STATISTICS [CustomerKey] ON [FactInternetSales_CustomerKey] ([CustomerKey]);
CREATE STATISTICS [PromotionKey] ON [FactInternetSales_CustomerKey] ([PromotionKey]);
CREATE STATISTICS [SalesOrderNumber] ON [FactInternetSales_CustomerKey] ([SalesOrderNumber]);
CREATE STATISTICS [OrderQuantity] ON [FactInternetSales_CustomerKey] ([OrderQuantity]);
CREATE STATISTICS [UnitPrice] ON [FactInternetSales_CustomerKey] ([UnitPrice]);
CREATE STATISTICS [SalesAmount] ON [FactInternetSales_CustomerKey] ([SalesAmount]);

--Rename the tables
RENAME OBJECT [dbo].[FactInternetSales] TO [FactInternetSales_ProductKey];
RENAME OBJECT [dbo].[FactInternetSales_CustomerKey] TO [FactInternetSales];
```

### Example 2: Re-create the table using round robin distribution

This example uses [CTAS][] to re-create a table with round robin instead of a hash distribution. This change will produce even data distribution at the cost of increased data movement. 

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

--Create statistics on new table
CREATE STATISTICS [ProductKey] ON [FactInternetSales_ROUND_ROBIN] ([ProductKey]);
CREATE STATISTICS [OrderDateKey] ON [FactInternetSales_ROUND_ROBIN] ([OrderDateKey]);
CREATE STATISTICS [CustomerKey] ON [FactInternetSales_ROUND_ROBIN] ([CustomerKey]);
CREATE STATISTICS [PromotionKey] ON [FactInternetSales_ROUND_ROBIN] ([PromotionKey]);
CREATE STATISTICS [SalesOrderNumber] ON [FactInternetSales_ROUND_ROBIN] ([SalesOrderNumber]);
CREATE STATISTICS [OrderQuantity] ON [FactInternetSales_ROUND_ROBIN] ([OrderQuantity]);
CREATE STATISTICS [UnitPrice] ON [FactInternetSales_ROUND_ROBIN] ([UnitPrice]);
CREATE STATISTICS [SalesAmount] ON [FactInternetSales_ROUND_ROBIN] ([SalesAmount]);

--Rename the tables
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
[Query Monitoring]: ./sql-data-warehouse-manage-monitor.md
[dbo.vTableSizes]: ./sql-data-warehouse-tables-overview.md#querying-table-sizes

<!--MSDN references-->
[DBCC PDW_SHOWSPACEUSED()]: https://msdn.microsoft.com/library/mt204028.aspx

<!--Other Web references-->

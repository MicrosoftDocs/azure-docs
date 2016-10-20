<properties
   pageTitle="Optimizing transactions for SQL Data Warehouse | Microsoft Azure"
   description="Best Practice guidance on writing efficient transaction updates in Azure SQL Data Warehouse"
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
   ms.date="07/31/2016"
   ms.author="jrj;barbkess"/>

# Optimizing transactions for SQL Data Warehouse

This article explains how to optimize the performance of your transactional code while minimizing risk for long rollbacks.

## Transactions and logging

Transactions are an important component of a relational database engine. SQL Data Warehouse uses transactions during data modification. These transactions can be explicit or implicit. Single `INSERT`, `UPDATE` and `DELETE` statements are all examples of implicit transactions. Explicit transactions are written explicitly by a developer using `BEGIN TRAN`, `COMMIT TRAN` or `ROLLBACK TRAN` and are typically used when multiple modification statements need to be tied together in a single atomic unit. 

Azure SQL Data Warehouse commits changes to the database using transaction logs. Each distribution has its own transaction log. Transaction log writes are automatic. There is no configuration required. However, whilst this process guarantees the write it does introduce an overhead in the system. You can minimize this impact by writing transactionally efficient code. Transactionally efficient code broadly falls into two categories.

- Leverage minimal logging constructs where possible
- Process data using scoped batches to avoid singular long running transactions
- Adopt a partition switching pattern for large modifications to a given partition

## Minimal vs. full logging

Unlike fully logged operations, which use the transaction log to keep track of every row change, minimally logged operations keep track of extent allocations and meta-data changes only. Therefore, minimal logging involves logging only the information that is required to rollback the transaction in the event of a failure or an explicit request (`ROLLBACK TRAN`). As much less information is tracked in the transaction log, a minimally logged operation performs better than a similarly sized fully logged operation. Furthermore, because fewer writes go the transaction log, a much smaller amount of log data is generated and so is more I/O efficient.

The transaction safety limits only apply to fully logged operations.

>[AZURE.NOTE] Minimally logged operations can participate in explicit transactions. As all changes in allocation structures are tracked, it is possible to roll back minimally logged operations. It is important to understand that the change is "minimally" logged it is not un-logged.

## Minimally logged operations

The following operations are capable of being minimally logged:

- CREATE TABLE AS SELECT ([CTAS][])
- INSERT..SELECT
- CREATE INDEX
- ALTER INDEX REBUILD
- DROP INDEX
- TRUNCATE TABLE
- DROP TABLE
- ALTER TABLE SWITCH PARTITION

<!--
- MERGE
- UPDATE on LOB Types .WRITE
- SELECT..INTO
-->

>[AZURE.NOTE] Internal data movement operations (such as `BROADCAST` and `SHUFFLE`) are not affected by the transaction safety limit.

## Minimal logging with bulk load

`CTAS` and `INSERT...SELECT` are both bulk load operations. However, both are influenced by the target table definition and depend on the load scenario. Below is a table that explains if your bulk operation will be fully or minimally logged:  

| Primary Index               | Load Scenario                                            | Logging Mode |
| --------------------------- | -------------------------------------------------------- | ------------ |
| Heap                        | Any                                                      | **Minimal**  |
| Clustered Index             | Empty target table                                       | **Minimal**  |
| Clustered Index             | Loaded rows do not overlap with existing pages in target | **Minimal**  |
| Clustered Index             | Loaded rows overlap with existing pages in target        | Full         |
| Clustered Columnstore Index | Batch size >= 102,400 per partition aligned distribution | **Minimal**  |
| Clustered Columnstore Index | Batch size < 102,400 per partition aligned distribution  | Full         |

It is worth noting that any writes to update secondary or non-clustered indexes will always be fully logged operations.

> [AZURE.IMPORTANT] SQL Data Warehouse has 60 distributions. Therefore, assuming all rows are evenly distributed and landing in a single partition, your batch will need to contain 6,144,000 rows or larger to be minimally logged when writing to a Clustered Columnstore Index. If the table is partitioned and the rows being inserted span partition boundaries, then you will need 6,144,000 rows per partition boundary assuming even data distribution. Each partition in each distribution must independently exceed the 102,400 row threshold for the insert to be minimally logged into the distribution.

Loading data into a non-empty table with a clustered index can often contain a mixture of fully logged and minimally logged rows. A clustered index is a balanced tree (b-tree) of pages. If the page being written to already contains rows from another transaction, then these writes will be fully logged. However, if the page is empty then the write to that page will be minimally logged.

## Optimizing deletes

`DELETE` is a fully logged operation.  If you need to delete a large amount of data in a table or a partition, it often makes more sense to `SELECT` the data you wish to keep, which can be run as a minimally logged operation.  To accomplish this, create a new table with [CTAS][].  Once created, use [RENAME][] to swap out your old table with the newly created table.

```sql
-- Delete all sales transactions for Promotions except PromotionKey 2.

--Step 01. Create a new table select only the records we want to kep (PromotionKey 2)
CREATE TABLE [dbo].[FactInternetSales_d]
WITH
(	CLUSTERED COLUMNSTORE INDEX
,	DISTRIBUTION = HASH([ProductKey])
, 	PARTITION 	(	[OrderDateKey] RANGE RIGHT 
									FOR VALUES	(	20000101, 20010101, 20020101, 20030101, 20040101, 20050101
												,	20060101, 20070101, 20080101, 20090101, 20100101, 20110101
												,	20120101, 20130101, 20140101, 20150101, 20160101, 20170101
												,	20180101, 20190101, 20200101, 20210101, 20220101, 20230101
												,	20240101, 20250101, 20260101, 20270101, 20280101, 20290101
												)
)
AS
SELECT 	*
FROM 	[dbo].[FactInternetSales]
WHERE	[PromotionKey] = 2
OPTION (LABEL = 'CTAS : Delete')
;

--Step 02. Rename the Tables to replace the 
RENAME OBJECT [dbo].[FactInternetSales]   TO [FactInternetSales_old];
RENAME OBJECT [dbo].[FactInternetSales_d] TO [FactInternetSales];
```

## Optimizing updates

`UPDATE` is a fully logged operation.  If you need to update a large number of rows in a table or a partition it can often be far more efficient to use a minimally logged operation such as [CTAS][] to do so.

In the example below a full table update has been converted to a `CTAS` so that minimal logging is possible.

In this case we are retrospectively adding a discount amount to the sales in the table:

```sql
--Step 01. Create a new table containing the "Update". 
CREATE TABLE [dbo].[FactInternetSales_u]
WITH
(	CLUSTERED INDEX
,	DISTRIBUTION = HASH([ProductKey])
, 	PARTITION 	(	[OrderDateKey] RANGE RIGHT 
									FOR VALUES	(	20000101, 20010101, 20020101, 20030101, 20040101, 20050101
												,	20060101, 20070101, 20080101, 20090101, 20100101, 20110101
												,	20120101, 20130101, 20140101, 20150101, 20160101, 20170101
												,	20180101, 20190101, 20200101, 20210101, 20220101, 20230101
												,	20240101, 20250101, 20260101, 20270101, 20280101, 20290101
												)
				)
)
AS 
SELECT
	[ProductKey]  
,	[OrderDateKey] 
,	[DueDateKey]  
,	[ShipDateKey] 
,	[CustomerKey] 
,	[PromotionKey] 
,	[CurrencyKey] 
,	[SalesTerritoryKey]
,	[SalesOrderNumber]
,	[SalesOrderLineNumber]
,	[RevisionNumber]
,	[OrderQuantity]
,	[UnitPrice]
,	[ExtendedAmount]
,	[UnitPriceDiscountPct]
,	ISNULL(CAST(5 as float),0) AS [DiscountAmount]
,	[ProductStandardCost]
,	[TotalProductCost]
,	ISNULL(CAST(CASE WHEN [SalesAmount] <=5 THEN 0
		 ELSE [SalesAmount] - 5
		 END AS MONEY),0) AS [SalesAmount]
,	[TaxAmt]
,	[Freight]
,	[CarrierTrackingNumber] 
,	[CustomerPONumber]
FROM	[dbo].[FactInternetSales]
OPTION (LABEL = 'CTAS : Update')
;

--Step 02. Rename the tables
RENAME OBJECT [dbo].[FactInternetSales]   TO [FactInternetSales_old];
RENAME OBJECT [dbo].[FactInternetSales_u] TO [FactInternetSales];

--Step 03. Drop the old table
DROP TABLE [dbo].[FactInternetSales_old]
```

> [AZURE.NOTE] Re-creating large tables can benefit from using SQL Data Warehouse workload management features. For more details please refer to the workload management section in the [concurrency][] article.

## Optimizing with partition switching

When faced with large scale modifications inside a [table partition][], then a partition switching pattern makes a lot of sense. If the data modification is significant and spans multiple partitions, then simply iterating over the partitions achieves the same result.

The steps to perform a partition switch are as follows:
1. Create an empty out partition
2. Perform the 'update' as a CTAS
3. Switch out the existing data to the out table
4. Switch in the new data
5. Clean up the data

However, to help identify the partitions to switch we will first need to build a helper procedure such as the one below. 

```sql
CREATE PROCEDURE dbo.partition_data_get
	@schema_name		   NVARCHAR(128)
,	@table_name			   NVARCHAR(128)
,	@boundary_value		   INT
AS
IF OBJECT_ID('tempdb..#ptn_data') IS NOT NULL
BEGIN
	DROP TABLE #ptn_data
END
CREATE TABLE #ptn_data
WITH	(	DISTRIBUTION = ROUND_ROBIN
		,	HEAP
		)
AS
WITH CTE
AS
(
SELECT 	s.name							AS [schema_name]
,		t.name							AS [table_name]
, 		p.partition_number				AS [ptn_nmbr]
,		p.[rows]						AS [ptn_rows]
,		CAST(r.[value] AS INT)			AS [boundary_value]
FROM		sys.schemas					AS s
JOIN		sys.tables					AS t	ON  s.[schema_id]		= t.[schema_id]
JOIN		sys.indexes					AS i	ON 	t.[object_id]		= i.[object_id]
JOIN		sys.partitions				AS p	ON 	i.[object_id]		= p.[object_id] 
												AND i.[index_id]		= p.[index_id] 
JOIN		sys.partition_schemes		AS h	ON 	i.[data_space_id]	= h.[data_space_id]
JOIN		sys.partition_functions		AS f	ON 	h.[function_id]		= f.[function_id]
LEFT JOIN	sys.partition_range_values	AS r 	ON 	f.[function_id]		= r.[function_id] 
												AND r.[boundary_id]		= p.[partition_number]
WHERE i.[index_id] <= 1
)
SELECT	*
FROM	CTE
WHERE	[schema_name]		= @schema_name
AND		[table_name]		= @table_name
AND		[boundary_value]	= @boundary_value
OPTION (LABEL = 'dbo.partition_data_get : CTAS : #ptn_data')
;
GO
```

This procedure maximizes code re-use and keeps the partition switching example more compact.

The code below demonstrates the five steps mentioned above to achieve a full partition switching routine.

```sql
--Create a partitioned aligned empty table to switch out the data 
IF OBJECT_ID('[dbo].[FactInternetSales_out]') IS NOT NULL
BEGIN
	DROP TABLE [dbo].[FactInternetSales_out]
END

CREATE TABLE [dbo].[FactInternetSales_out]
WITH
(	DISTRIBUTION = HASH([ProductKey])
,	CLUSTERED COLUMNSTORE INDEX
, 	PARTITION 	(	[OrderDateKey] RANGE RIGHT 
									FOR VALUES	(	20020101, 20030101
												)
				)
)
AS
SELECT *
FROM	[dbo].[FactInternetSales]
WHERE 1=2
OPTION (LABEL = 'CTAS : Partition Switch IN : UPDATE')
;

--Create a partitioned aligned table and update the data in the select portion of the CTAS
IF OBJECT_ID('[dbo].[FactInternetSales_in]') IS NOT NULL
BEGIN
	DROP TABLE [dbo].[FactInternetSales_in]
END

CREATE TABLE [dbo].[FactInternetSales_in]
WITH
(	DISTRIBUTION = HASH([ProductKey])
,	CLUSTERED COLUMNSTORE INDEX
, 	PARTITION 	(	[OrderDateKey] RANGE RIGHT 
									FOR VALUES	(	20020101, 20030101
												)
				)
)
AS 
SELECT
	[ProductKey]  
,	[OrderDateKey] 
,	[DueDateKey]  
,	[ShipDateKey] 
,	[CustomerKey] 
,	[PromotionKey] 
,	[CurrencyKey] 
,	[SalesTerritoryKey]
,	[SalesOrderNumber]
,	[SalesOrderLineNumber]
,	[RevisionNumber]
,	[OrderQuantity]
,	[UnitPrice]
,	[ExtendedAmount]
,	[UnitPriceDiscountPct]
,	ISNULL(CAST(5 as float),0) AS [DiscountAmount]
,	[ProductStandardCost]
,	[TotalProductCost]
,	ISNULL(CAST(CASE WHEN [SalesAmount] <=5 THEN 0
		 ELSE [SalesAmount] - 5
		 END AS MONEY),0) AS [SalesAmount]
,	[TaxAmt]
,	[Freight]
,	[CarrierTrackingNumber] 
,	[CustomerPONumber]
FROM	[dbo].[FactInternetSales]
WHERE	OrderDateKey BETWEEN 20020101 AND 20021231
OPTION (LABEL = 'CTAS : Partition Switch IN : UPDATE')
;

--Use the helper procedure to identify the partitions
--The source table
EXEC dbo.partition_data_get 'dbo','FactInternetSales',20030101
DECLARE @ptn_nmbr_src INT = (SELECT ptn_nmbr FROM #ptn_data)
SELECT @ptn_nmbr_src

--The "in" table
EXEC dbo.partition_data_get 'dbo','FactInternetSales_in',20030101
DECLARE @ptn_nmbr_in INT = (SELECT ptn_nmbr FROM #ptn_data)
SELECT @ptn_nmbr_in

--The "out" table
EXEC dbo.partition_data_get 'dbo','FactInternetSales_out',20030101
DECLARE @ptn_nmbr_out INT = (SELECT ptn_nmbr FROM #ptn_data)
SELECT @ptn_nmbr_out

--Switch the partitions over
DECLARE @SQL NVARCHAR(4000) = '
ALTER TABLE [dbo].[FactInternetSales]	SWITCH PARTITION '+CAST(@ptn_nmbr_src AS VARCHAR(20))	+' TO [dbo].[FactInternetSales_out] PARTITION '	+CAST(@ptn_nmbr_out AS VARCHAR(20))+';
ALTER TABLE [dbo].[FactInternetSales_in] SWITCH PARTITION '+CAST(@ptn_nmbr_in AS VARCHAR(20))	+' TO [dbo].[FactInternetSales] PARTITION '		+CAST(@ptn_nmbr_src AS VARCHAR(20))+';'
EXEC sp_executesql @SQL

--Perform the clean-up
TRUNCATE TABLE dbo.FactInternetSales_out;
TRUNCATE TABLE dbo.FactInternetSales_in;

DROP TABLE dbo.FactInternetSales_out
DROP TABLE dbo.FactInternetSales_in
DROP TABLE #ptn_data
```

## Minimize logging with small batches

For large data modification operations, it may make sense to divide the operation into chunks or batches to scope the unit of work.

A working example is provided below. The batch size has been set to a trivial number to highlight the technique. In reality the batch size would be significantly larger. 

```sql
SET NO_COUNT ON;
IF OBJECT_ID('tempdb..#t') IS NOT NULL
BEGIN
	DROP TABLE #t;
	PRINT '#t dropped';
END

CREATE TABLE #t
WITH	(	DISTRIBUTION = ROUND_ROBIN
		,	HEAP
		)
AS
SELECT	ROW_NUMBER() OVER(ORDER BY (SELECT NULL)) AS seq_nmbr
,		SalesOrderNumber
,		SalesOrderLineNumber
FROM	dbo.FactInternetSales
WHERE	[OrderDateKey] BETWEEN 20010101 and 20011231
;

DECLARE	@seq_start		INT = 1
,		@batch_iterator	INT = 1
,		@batch_size		INT = 50
,		@max_seq_nmbr	INT = (SELECT MAX(seq_nmbr) FROM dbo.#t)
;

DECLARE	@batch_count	INT = (SELECT CEILING((@max_seq_nmbr*1.0)/@batch_size))
,		@seq_end		INT = @batch_size
;

SELECT COUNT(*)
FROM	dbo.FactInternetSales f

PRINT 'MAX_seq_nmbr '+CAST(@max_seq_nmbr AS VARCHAR(20))
PRINT 'MAX_Batch_count '+CAST(@batch_count AS VARCHAR(20))

WHILE	@batch_iterator <= @batch_count
BEGIN
	DELETE
	FROM	dbo.FactInternetSales
	WHERE EXISTS
	(
			SELECT	1
			FROM	#t t
			WHERE	seq_nmbr BETWEEN  @seq_start AND @seq_end
			AND		FactInternetSales.SalesOrderNumber		= t.SalesOrderNumber
			AND		FactInternetSales.SalesOrderLineNumber	= t.SalesOrderLineNumber
	)
	;

	SET @seq_start = @seq_end
	SET @seq_end = (@seq_start+@batch_size);
	SET @batch_iterator +=1;
END
```

## Pause and scaling guidance

Azure SQL Data Warehouse lets you pause, resume and scale your data warehouse on demand. When you pause or scale your SQL Data Warehouse it is important to understand that any in-flight transactions are terminated immediately; causing any open transactions to be rolled back. If your workload had issued a long running and incomplete data modification prior to the pause or scale operation, then this work will need to be undone. This may impact the time it takes to pause or scale your Azure SQL Data Warehouse database. 

> [AZURE.IMPORTANT] Both `UPDATE` and `DELETE` are fully logged operations and so these undo/redo operations can take significantly longer than equivalent minimally logged operations. 

The best scenario is to let in flight data modification transactions complete prior to pausing or scaling SQL Data Warehouse. However, this may not always be practical. To mitigate the risk of a long rollback, consider one of the following options:

- Re-write long running operations using [CTAS][]
- Break the operation down into chunks; operating on a subset of the rows

## Next steps

See [Transactions in SQL Data Warehouse][] to learn more about isolation levels and transactional limits.  For an overview of other Best Practices, see [SQL Data Warehouse Best Practices][].

<!--Image references-->

<!--Article references-->
[Transactions in SQL Data Warehouse]: ./sql-data-warehouse-develop-transactions.md
[table partition]: ./sql-data-warehouse-tables-partition.md
[Concurrency]: ./sql-data-warehouse-develop-concurrency.md
[CTAS]: ./sql-data-warehouse-develop-ctas.md
[SQL Data Warehouse Best Practices]: ./sql-data-warehouse-best-practices.md

<!--MSDN references-->
[alter index]:https://msdn.microsoft.com/library/ms188388.aspx
[RENAME]: https://msdn.microsoft.com/library/mt631611.aspx

<!-- Other web references -->


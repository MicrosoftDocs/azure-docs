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
   ms.date="02/27/2016"
   ms.author="jrj;barbkess"/>

# Optimizing transactions for SQL Data Warehouse

This article explains how to ensure your transactional code is written to maximise the efficiency of your changes.

## Conceptual understanding of transactions and logging

Transactions are an important component of a relational database engine. SQL Data Warehouse uses transactions during data modification. These transactions can be explicit or implicit. `INSERT`, `UPDATE` and `DELETE` are all examples of implicit transactions. Explicit transactions are written explicitly by a developer using `BEGIN TRAN`, `COMMIT TRAN` or `ROLLBACK TRAN` and are typically used when multiple modification statements need to be bonded together in a single atomic unit. 

Azure SQL Data Warehouse writes changes using a transaction log. Transaction log writes are automatic. There is no configuration required. However, whilst this process guarantees the write it does introduce an overhead in the system. You can minimize this impact by writing transactionally efficient code. Transactionally efficient code broadly falls into two categories.

* Leverage minimal logging constructs where possible
* Processing data using scoped batches to avoid singular long running transactions

## Minimal logging vs. full logging
Unlike fully logged operations, which use the transaction log to keep track of every row change, minimally logged operations keep track of extent allocations and meta-data changes only. Therefore minimal logging involves logging only the information that is required to rollback the transaction in the event of a failure or an explicit request (`ROLLBACK TRAN`). As much less information is tracked in the transaction log, a minimally logged operation performs better than a similarly sized fully logged operation. Furthermore, because fewer writes go the transaction log, a much smaller amount of log data is generated and so is more I/O efficient.

>[AZURE.NOTE] Minimally logged operations can participate in explicit transactions. As all changes in allocation structures are tracked, it is possible to roll back minimally logged operations. It is important to understand that the change is "minimally" logged it is not un-logged.

## Minimally logged operations

The following operations are capable of being minimally logged:
* CREATE TABLE AS SELECT (CTAS)
* INSERT..SELECT (most of the time)
* CREATE INDEX
* ALTER INDEX REBUILD
* DROP INDEX
* TRUNCATE TABLE
* DROP TABLE
* ALTER TABLE SWITCH PARTITION
<!--
* MERGE
* UPDATE on LOB Types .WRITE
* SELECT..INTO
-->

## Minimal logging conditions for bulk loading operations.

`CTAS` and `INSERT...SELECT` are both bulk load operations. However, both are influenced by the target table definition and depend on the load scenario. Below is a table that explains if your bulk operation will be fully or minimally logged:  

| Primary Index               | Load Scenario                                            | Distribution Type | Concurrency? | Logging Type | 
| --------------------------- | -------------------------------------------------------- | ----------------- | ------------ | ------------ | 
| N/A (Heap)                  | None                                                     | Round Robin       | Yes          | **Minimal**  | 
| N/A (Heap)                  | None                                                     | Hash Distributed  | Yes          | Full         | 
| Clustered Index             | Empty target table                                       | N/A               | Yes          | **Minimal**  | 
| Clustered Index             | Loaded rows overlap with existing pages in target        | N/A               | Yes          | Full         |
| Clustered Index             | Loaded rows do not overlap with existing pages in target | N/A               | Yes          | **Minimal**  |
| Clustered Columnstore Index | Batch size < 102,400 per partition aligned distribution  | N/A               | Yes          | Full         |
| Clustered Columnstore Index | Batch size >= 102,400 per partition aligned distribution | N/A               | Yes          | **Minimal**  |

Loading data into a non-empty table with a clustered index can often contain a mixture of fully logged and minimally logged rows. A clustered index is a balanced tree (b-tree) of pages. If the page being written to already contains rows from another transaction then these writes will be fully logged. However, if the page is empty then the write to that page will be minimally logged.

> [AZURE.IMPORTANT] SQL Data Warehouse has 60 distributions. Therefore, assuming all rows are evenly distributed and landing in a single partition, your batch will need to contain 6,144,000 rows or larger to be minimally logged when writing to a Clustered Columnstore Index.

`UPDATE` and `DELETE` are **always** fully logged operations. However, these statements can be optimized so that they can be run more efficiently.

## Additional guidance for "Pause" and "Scale" operations
Azure SQL Data Warehouse lets you pause, resume and scale your data warehouse on demand. When you pause or scale your SQL Data Warehouse it is important to understand that any in-flight transactions are terminated immediately; causing any open transactions to be rolled back. If your workload had issued a long running and incomplete data modification prior to the pause or scale operation then this work will need to be undone; impacting the duration of the resume. Both UPDATE and DELETE are fully logged operations and so these undo/redo operations can take significantly longer than minimally logged operations. 

The best scenario is to let in flight data modification transactions complete prior to pausing or scaling SQL Data Warehouse. However, this may not always be practical. To mitigate the risk of a long rollback consider one of the following options:
* Re-write long running operations using CTAS
* Break the operation down into chunks; operating on a subset of the rows

## Optimizing large updates using CTAS
If you need to update a large number of rows in a table or a partition it can often be far more efficient to use a minimally logged operation such as `CREATE TABLE AS SELECT (CTAS)` to do so.

In the example below a full table update has been converted to a `CTAS` so that minimal logging is possible. 

In this case we are retrospectively adding a discount amount to the sales in the table:

```
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

> [AZURE.NOTE] Re-creating large tables can benefit from using SQL Data Warehouse workload management features. For more details please refer to the workload management section in the [concurrency] article.

## Optimizing large delete operations using CTAS
If you need to delete a large amount of data in a table or a partition it often makes more sense to `SELECT` the data you wish to keep instead; creating a new table with `CTAS`. Once created, use a pair of `RENAME OBJECT` commands to switch the names of the tables over.

```
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

## Batching operations into manageable chunks
When a table is partitioned one path is to process the operation by iterating over the partitions. However, on really large tables it may still make more sense to process to divide the operation into chunked batches.

```


 
```

## Next steps
For more development tips, see [development overview][].

<!--Image references-->

<!--ACOM references-->
CTAS
RENAME OBJECT
[concurrency]:https://azure.microsoft.com/en-us/documentation/articles/sql-data-warehouse-develop-concurrency/
[table partition]:https://azure.microsoft.com/en-us/documentation/articles/sql-data-warehouse-develop-table-partitions/

<!--MSDN references-->
[alter index]:https://msdn.microsoft.com/en-us/library/ms188388.aspx
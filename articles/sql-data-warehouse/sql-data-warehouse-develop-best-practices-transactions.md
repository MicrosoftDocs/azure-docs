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

SQL Data Warehouse uses transactions during data modification. This article explains how to ensure your transactional code is written to maximise the efficiency of your changes.

## Conceptual understanding of logging


## Minimal logging vs. full logging

Minimal logging involves logging only the information that is required to recover the transaction without supporting point-in-time recovery. Unlike fully logged operations, which use the transaction log to keep track of every row change, minimally logged operations keep track of extent allocations and metadata changes only. Because much less information is tracked in the transaction log, a minimally logged operation is often faster than a fully logged operation if logging is the bottleneck. Furthermore, because fewer writes go the transaction log, a much smaller log file with a lighter I/O requirement becomes viable.

Understand that an operation can be a bulk load operation without being minimally logged.

Contrary to the SQL Server myths, a minimally logged operation can participate in a transaction. Because all changes in allocation structures are tracked, it is possible to roll back minimally logged operations.

## Summary of minimal logging conditions

| Primary Index                | Secondary Indexes? | Rows in table? | Distribution Type    |  Concurrency? | Logging Type | 
| ---------------------------  | ------------------ | -------------- | -------------------- |  ------------ | ------------ | 
| N/A (Heap)                   |                    | Irrelevant     | Round Robin          |  Yes          | Minimal      | 
| N/A (Heap)                   |  Yes               | Irrelevant     | Hash Distributed     |  Yes          | Full         | 
| Clustered Index              |                    |                |
| Clustered Index              |  Yes               |                |
| Clustered Columnstore Index  |  


## Minimally logged operations
The following operations are minimally logged:
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
-->

## Optimizing inserts
In most cases inserts are minimally logged. However, throughput is greatly improved if inserts are batched and a bulk insert approach is taken rather than fired as singleton inserts. If you the number of writes/sec is low then this is not much of an issue. However, if your application issues a large number of small writes/sec, such as in an IoT scenario, consider writing them to an event hub which can in turn persist the records to an Azure Storage Blob. From here a PolyBase Import can occur using CTAS. PolyBase is both highly parallel and minimally logged; leveraging bulk apis behind the scenes.

## Optimizing updates
Update operations are fully logged actions in SQL Data Warehouse. If you need to update a large number of rows in a table or a partition it can often be far more efficient to use a minimally logged operation such as `CREATE TABLE AS SELECT (CTAS)` to do so.

### Minimal logging example using CTAS
In the example below a full table update has been converted to a `CTAS` to use minimal logging:
```
--Step 01. Create a new table containing the "Update". In this case we are retrospectively adding a discount amount to the sales.
CREATE TABLE [dbo].[FactInternetSales_u]
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

> [AZURE.NOTE] Sometimes re-creating large tables can benefit from using SQL Data Warehouse workload management features. For more details please refer to the workload management section in the [concurrency] article.

## Optimizing large delete operations
Delete operations are fully logged in SQL Data Warehouse. If you need to delete a large amount of data in a table or a partition it often makes more sense to `SELECT` the data you wish to keep instead; creating a new table with `CTAS`. Once created use a pair of `RENAME OBJECT` commands to switch the names of the tables over.

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

## Engineering guidance for Pause and Scale operations
When you pause your SQL Data Warehouse any in-flight transactions are terminated immediately causing the transaction to be rolled back. If your workload had issued a long running update or delete prior to the pause or scale operation then this could take a long time to complete as both UPDATE and DELETE are fully logged operations.

The best scenario is to let in flight data modification transactions complete prior to pausing or scaling SQL Data Warehouse. However, this may not always be practical. To mitigate the risk of a long rollback consider one of the following options:
* Re-write the operation using CTAS
* Break the operation down into chunks; operating on a subset of the rows

## Optimizing large index rebuilds

If you have a large table you can optimize your index rebuild in one of two ways:

1) Partition your table and execute partition level index rebuilds
2) Use CTAS to re-create the partition of data in a new table; and partition switch in the new table


## Next Steps

## Next steps
For more development tips, see [development overview][].

<!--Image references-->

<!--ACOM references-->
CTAS
RENAME OBJECT
[concurrency]:https://azure.microsoft.com/en-us/documentation/articles/sql-data-warehouse-develop-concurrency/

<!--MSDN references-->

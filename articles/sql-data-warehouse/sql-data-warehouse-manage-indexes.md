<properties
   pageTitle="Managing indexes | Microsoft Azure"
   description="Guidance to help users manage their indexes"
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
   ms.date="03/23/2016"
   ms.author="jrj;barbkess;sonyama"/>

# Managing Indexes
This article demonstrates some key techniques for managing your indexes.

## Optimizing index rebuilds
You can optimize your index rebuild in one of two ways:

1. Partition your table and execute partition level index rebuilds
2. Use [CTAS][] to re-create the partition of data in a new table; and partition switch in the new table

## Partitioned index rebuilds

Below is an example of how to rebuild a single partition:

```sql
ALTER INDEX ALL ON [dbo].[FactInternetSales] REBUILD Partition = 5
```

ALTER INDEX..REBUILD is best used for smaller data volumes - especially against columnstore indexes. Open, closed and compressed rowgroups are all included in the rebuild. However, if the partition is quite large then you will find that `CTAS` is the more efficient operation. An example of a full index rebuild is below

```sql
ALTER INDEX ALL ON [dbo].[DimProduct] REBUILD
```

Refer to the [ALTER INDEX][] article for more details on this syntax.

## Using CTAS to rebuild a partition

Below is an example of how to rebuild a partition using CTAS:

```sql
-- Step 01. Select the partition of data and write it out to a new table using CTAS
CREATE TABLE [dbo].[FactInternetSales_20000101_20010101]
    WITH    (   DISTRIBUTION = HASH([ProductKey])
            ,   CLUSTERED COLUMNSTORE INDEX
            ,   PARTITION   (   [OrderDateKey] RANGE RIGHT FOR VALUES
                                (20000101,20010101
                                )
                            )
            )
AS
SELECT  *
FROM    [dbo].[FactInternetSales]
WHERE   [OrderDateKey] >= 20000101
AND     [OrderDateKey] <  20010101
;

-- Step 02. Create a SWITCH out table
 
CREATE TABLE dbo.FactInternetSales_20000101
    WITH    (   DISTRIBUTION = HASH(ProductKey)
            ,   CLUSTERED COLUMNSTORE INDEX
            ,   PARTITION   (   [OrderDateKey] RANGE RIGHT FOR VALUES
                                (20000101
                                )
                            )
            )
AS
SELECT *
FROM    [dbo].[FactInternetSales]
WHERE   1=2 -- Note this table will be empty

-- Step 03. Switch OUT the data 
ALTER TABLE [dbo].[FactInternetSales] SWITCH PARTITION 2 TO  [dbo].[FactInternetSales_20000101] PARTITION 2;

-- Step 04. Switch IN the rebuilt data
ALTER TABLE [dbo].[FactInternetSales_20000101_20010101] SWITCH PARTITION 2 TO  [dbo].[FactInternetSales] PARTITION 2;
```

## Next steps
Please refer to the article on [table partitioning][] for more guidance on how to create and size partitions. The article also contains an example to help identify partition boundaries.

For more management tips head over to the [management][] overview

<!--Image references-->

<!--Article references-->
[CTAS]: sql-data-warehouse-develop-ctas.md
[Table partitioning]: sql-data-warehouse-develop-table-partitions.md
[Management]: sql-data-warehouse-manage-monitor.md

<!--MSDN references-->
[ALTER INDEX]:https://msdn.microsoft.com/en-us/library/ms188388.aspx

<!--Other Web references-->
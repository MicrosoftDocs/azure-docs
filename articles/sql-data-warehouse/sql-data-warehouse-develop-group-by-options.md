---
title: Using group by options in Azure SQL Data Warehouse | Microsoft Docs
description: Tips for implementing group by options in Azure SQL Data Warehouse for developing solutions.
services: sql-data-warehouse
author: ronortloff
manager: craigg
ms.service: sql-data-warehouse
ms.topic: conceptual
ms.component: implement
ms.date: 04/17/2018
ms.author: rortloff
ms.reviewer: igorstan
---

# Group by options in SQL Data Warehouse
Tips for implementing group by options in Azure SQL Data Warehouse for developing solutions.

## What does GROUP BY do?

The [GROUP BY](/sql/t-sql/queries/select-group-by-transact-sql) T-SQL clause aggregates data to a summary set of rows. GROUP BY has some options that SQL Data Warehouse does not support. These options have workarounds.

These options are

* GROUP BY with ROLLUP
* GROUPING SETS
* GROUP BY with CUBE

## Rollup and grouping sets options
The simplest option here is to use UNION ALL instead to perform the rollup rather than relying on the explicit syntax. The result is exactly the same

The following example using the GROUP BY statement with the ROLLUP option:
```sql
SELECT [SalesTerritoryCountry]
,      [SalesTerritoryRegion]
,      SUM(SalesAmount)             AS TotalSalesAmount
FROM  dbo.factInternetSales s
JOIN  dbo.DimSalesTerritory t       ON s.SalesTerritoryKey       = t.SalesTerritoryKey
GROUP BY ROLLUP (
                        [SalesTerritoryCountry]
                ,       [SalesTerritoryRegion]
                )
;
```

By using ROLLUP, the preceding example requests the following aggregations:

* Country and Region
* Country
* Grand Total

To replace ROLLUP and return the same results, you can use UNION ALL and explicitly specify the required aggregations:

```sql
SELECT [SalesTerritoryCountry]
,      [SalesTerritoryRegion]
,      SUM(SalesAmount) AS TotalSalesAmount
FROM  dbo.factInternetSales s
JOIN  dbo.DimSalesTerritory t     ON s.SalesTerritoryKey       = t.SalesTerritoryKey
GROUP BY
       [SalesTerritoryCountry]
,      [SalesTerritoryRegion]
UNION ALL
SELECT [SalesTerritoryCountry]
,      NULL
,      SUM(SalesAmount) AS TotalSalesAmount
FROM  dbo.factInternetSales s
JOIN  dbo.DimSalesTerritory t     ON s.SalesTerritoryKey       = t.SalesTerritoryKey
GROUP BY
       [SalesTerritoryCountry]
UNION ALL
SELECT NULL
,      NULL
,      SUM(SalesAmount) AS TotalSalesAmount
FROM  dbo.factInternetSales s
JOIN  dbo.DimSalesTerritory t     ON s.SalesTerritoryKey       = t.SalesTerritoryKey;
```

To replace GROUPING SETS, the sample principle applies. You only need to create UNION ALL sections for the aggregation levels you want to see.

## Cube options
It is possible to create a GROUP BY WITH CUBE using the UNION ALL approach. The problem is that the code can quickly become cumbersome and unwieldy. To mitigate this, you can use this more advanced approach.

Let's use the example above.

The first step is to define the 'cube' that defines all the levels of aggregation that we want to create. It is important to take note of the CROSS JOIN of the two derived tables. This generates all the levels for us. The rest of the code is really there for formatting.

```sql
CREATE TABLE #Cube
WITH
(   DISTRIBUTION = ROUND_ROBIN
,   LOCATION = USER_DB
)
AS
WITH GrpCube AS
(SELECT    CAST(ISNULL(Country,'NULL')+','+ISNULL(Region,'NULL') AS NVARCHAR(50)) as 'Cols'
,          CAST(ISNULL(Country+',','')+ISNULL(Region,'') AS NVARCHAR(50))  as 'GroupBy'
,          ROW_NUMBER() OVER (ORDER BY Country) as 'Seq'
FROM       ( SELECT 'SalesTerritoryCountry' as Country
             UNION ALL
             SELECT NULL
           ) c
CROSS JOIN ( SELECT 'SalesTerritoryRegion' as Region
             UNION ALL
             SELECT NULL
           ) r
)
SELECT Cols
,      CASE WHEN SUBSTRING(GroupBy,LEN(GroupBy),1) = ','
            THEN SUBSTRING(GroupBy,1,LEN(GroupBy)-1)
            ELSE GroupBy
       END AS GroupBy  --Remove Trailing Comma
,Seq
FROM GrpCube;
```

The following shows the results of the CTAS:

![Group by cube](media/sql-data-warehouse-develop-group-by-options/sql-data-warehouse-develop-group-by-cube.png)

The second step is to specify a target table to store interim results:

```sql
DECLARE
 @SQL NVARCHAR(4000)
,@Columns NVARCHAR(4000)
,@GroupBy NVARCHAR(4000)
,@i INT = 1
,@nbr INT = 0
;
CREATE TABLE #Results
(
 [SalesTerritoryCountry] NVARCHAR(50)
,[SalesTerritoryRegion]  NVARCHAR(50)
,[TotalSalesAmount]      MONEY
)
WITH
(   DISTRIBUTION = ROUND_ROBIN
,   LOCATION = USER_DB
)
;
```

The third step is to loop over our cube of columns performing the aggregation. The query will run once for every row in the #Cube temporary table and store the results in the #Results temp table

```sql
SET @nbr =(SELECT MAX(Seq) FROM #Cube);

WHILE @i<=@nbr
BEGIN
    SET @Columns = (SELECT Cols    FROM #Cube where seq = @i);
    SET @GroupBy = (SELECT GroupBy FROM #Cube where seq = @i);

    SET @SQL ='INSERT INTO #Results
              SELECT '+@Columns+'
              ,      SUM(SalesAmount) AS TotalSalesAmount
              FROM  dbo.factInternetSales s
              JOIN  dbo.DimSalesTerritory t  
              ON s.SalesTerritoryKey = t.SalesTerritoryKey
              '+CASE WHEN @GroupBy <>''
                     THEN 'GROUP BY '+@GroupBy ELSE '' END

    EXEC sp_executesql @SQL;
    SET @i +=1;
END
```

Lastly, you can return the results by simply reading from the #Results temporary table

```sql
SELECT *
FROM #Results
ORDER BY 1,2,3
;
```

By breaking the code up into sections and generating a looping construct, the code becomes more manageable and maintainable.

## Next steps
For more development tips, see [development overview](sql-data-warehouse-overview-develop.md).


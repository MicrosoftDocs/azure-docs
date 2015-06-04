## Label your code
SQL Data Warehouse supports a concept called query labels. Before going into any depth let's look at an example of one:

### Example: Select a query by label

```
SELECT *
FROM sys.tables
OPTION (LABEL = 'My Query Label')
;
```
This last line tags the string 'My Query Label' to the query. This is particularly helpful as the label is query-able through the DMVs. This provides us with a mechanism to troubleshoot problems and to track the progress of an Extract, Transform, and Load (ETL) run. A good naming convention really helps here. For example something like ' PROJECT : PROCEDURE : STATEMENT : COMMENT' would help to uniquely identify the query amongst all the code in source control.

### Example: Query the dynamic management views by lable

This uses a lable comparison to find information about a particular query in a dynamic management view.
```
SELECT  *
FROM    sys.dm_pdw_exec_requests r
WHERE   r.[label] = 'My Query Label'
;
```

> [AZURE.NOTE] Since label is a reserved word, it must be enclosed with square brackets or double quotes in queries.

## Group by with Rollup / Cube / Grouping Sets
The `GROUP BY` clause has a few options that do need to be worked around as they are not supported by Azure SQL Data Warehouse.

The simplest option here is to use `UNION ALL` to change the behavior.

Below is an example of a group by statement using the `ROLLUP` option:
```
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
By using ROLLUP we have requested the following aggregations:
- Country and Region
- Country
- Grand Total

To replace this you will need to use `UNION ALL`; specifying the aggregations required explicitly to return the same results:

```
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

Please refer to MSDN for more information concerning [GROUP BY ROLLUP].


## Cursors
Fortunately, almost all cursors that are written in SQL code are of the fast forward, read only variety.

The first question you should ask yourself when faced with a cursor is simply "could this cursor be re-written to use set based operations?". In many cases the answer will be yes. More often than not the best approach is to do just that. Relational databases are optimized to work over sets of data rather than row by row.

Fast forward read only cursors can be easily replaced with a looping construct such as the one below:

```
-- Create a temporary table containing a unique row number used to identify the individual statements  
CREATE TABLE #tbl WITH (location=USER_DB,DISTRIBUTION = ROUND_ROBIN)
AS
SELECT  ROW_NUMBER() OVER(ORDER BY (SELECT NULL)) ) AS Sequence
,       [name]
,       'UPDATE STATISTICS '+QUOTENAME([name]) AS sql_code
FROM    sys.tables
;

-- Initialize variables
DECLARE @nbr_statements INT = (SELECT COUNT(*) FROM #tbl)
,       @i INT = 1
;

-- Loop over statements executing them one at a time
WHILE   @i <= @nbr_statements
BEGIN
    DECLARE @sql_code NVARCHAR(4000) = (SELECT sql_code FROM #tbl WHERE Sequence = @i);
    EXEC    sp_executesql @sql_code;
    SET     @i +=1;
END
```

The code example above updates the statistics for every table in the database. By iterating over the tables in the loop we are able to execute each command in sequence.

## Pivot and Unpivot
You can pivot data in Azure SQL Data Warehouse by using a CASE statement. Below is an example of how to do this:
```
CREATE TABLE AnnualSales_pvt
WITH    (   DISTRIBUTION = ROUND_ROBIN
        )
AS
WITH SalesPVT
AS
(   SELECT  [EnglishProductCategoryName]
    ,       CASE WHEN [CalendarYear] = 2001 THEN SUM([SalesAmount]) ELSE 0 END AS 'CY_2001'
    ,       CASE WHEN [CalendarYear] = 2002 THEN SUM([SalesAmount]) ELSE 0 END AS 'CY_2002'
    ,       CASE WHEN [CalendarYear] = 2003 THEN SUM([SalesAmount]) ELSE 0 END AS 'CY_2003'
    ,       CASE WHEN [CalendarYear] = 2004 THEN SUM([SalesAmount]) ELSE 0 END AS 'CY_2004'
    FROM    [dbo].[FactInternetSales] s
    JOIN    [dbo].[DimDate] d               ON s.[OrderDateKey]          = d.[DateKey]
    JOIN    [dbo].[DimProduct] p            ON s.[ProductKey]            = p.[ProductKey]
    JOIN    [dbo].[DimProductSubCategory] u ON p.[ProductSubcategoryKey] = u.[ProductSubcategoryKey]
    JOIN    [dbo].[DimProductCategory] c    ON u.[ProductCategoryKey]    = c.[ProductCategoryKey]
    GROUP BY
            [EnglishProductCategoryName]
    ,       [CalendarYear]
)
SELECT  [EnglishProductCategoryName]
,       SUM([CY_2001])  AS 'CY_2001'
,       SUM([CY_2002])  AS 'CY_2002'
,       SUM([CY_2003])  AS 'CY_2003'
,       SUM([CY_2004])  AS 'CY_2004'
FROM    SalesPVT
GROUP BY
        [EnglishProductCategoryName]
;
```
Unpivoting is a little bit more complex. However, it is still very achievable using `CASE`. For this you will also need to fix how many columns you are going to unpivot. In the previous example we pivoted four columns. Let's stick with that. To perform the Unpivot we will need to explode the dataset temporarily by a factor of 4. This results in a two step process:
```
CREATE TABLE #Nmbr
WITH (DISTRIBUTION = ROUND_ROBIN)
AS
SELECT 1 AS 'Number'
UNION ALL
SELECT 2
UNION ALL
SELECT 3
UNION ALL
SELECT 4
OPTION (LABEL = 'CTAS : #Nmbr : CREATE')
;

SELECT  [EnglishProductCategoryName]
,       CASE    c.[Number]
                WHEN 1 THEN [CY_2001]
                WHEN 2 THEN [CY_2002]
                WHEN 3 THEN [CY_2003]
                WHEN 4 THEN [CY_2004]
        END as Sales
FROM AnnualSales_pvt
JOIN #Nmbr c ON 1=1
WHERE   CASE    c.[Number]
                WHEN 1 THEN CY_2001
                WHEN 2 THEN CY_2002
                WHEN 3 THEN CY_2003
                WHEN 4 THEN CY_2004
        END IS NOT NULL
OPTION (LABEL = 'Unpivot :  : SELECT')
;

DROP TABLE #Nmbr
;
```

## Cross Database Joins
As discussed in the [migrate your schema] article the best approach here is to use one single database and to implement boundaries by schema rather than by database.

We reference it here to remind you about changing your code to be compliant with this requirement.

> [AZURE.NOTE] Cross database joins are not a specific limitation of Azure SQL Data Warehouse. This is a restriction imposed by the Azure PaaS platform.

## Dynamic SQL
SQLDW does not support blob data types. This includes varchar(max) and nvarchar(max) types. You may find that you have used these types in your application code if you have a large amount of dynamic SQL code you need to execute. In these situations you will need to break the code into chunks and use the EXEC statement instead. A simplified example is available below:

```
DECLARE @sql_fragment1 VARCHAR(8000)=' SELECT name '
,       @sql_fragment2 VARCHAR(8000)=' FROM sys.system_views '
,       @sql_fragment3 VARCHAR(8000)=' WHERE name like ''%table%''';

EXEC( @sql_fragment1 + @sql_fragment2 + @sql_fragment3);
```
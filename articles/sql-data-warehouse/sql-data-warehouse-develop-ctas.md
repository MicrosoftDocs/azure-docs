<properties
   pageTitle="Create table as select (CTAS) in SQL Data Warehouse | Microsoft Azure"
   description="Tips for coding with the create table as select (CTAS) statement in Azure SQL Data Warehouse for developing solutions."
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

# Create Table As Select (CTAS) in SQL Data Warehouse
Create table as select or CTAS is one of the most important T-SQL features available. It is a fully parallelized operation that creates a new table based on the output of a Select statement. You can consider it to be a supercharged version of SELECT..INTO if you would like.

CTAS can also be used to work around a number of the unsupported features listed above. This can often prove to be a win/win situation as not only will your code be compliant but it will often execute faster on SQL Data Warehouse. This is as a result of its fully parallelized design.

> [AZURE.NOTE] Try to think "CTAS first". If you think you can solve a problem using CTAS then that is generally the best way to approach it - even if you are writing more data as a result.

Scenarios that can be worked around with CTAS include:

- SELECT..INTO
- ANSI JOINS on UPDATEs 
- ANSI JOINs on DELETEs
- MERGE statement

This document also includes some best practices for when coding with CTAS.

## SELECT..INTO
You may find SELECT..INTO appears in a number of places in your solution. 

An SELECT..INTO example is below:

```
SELECT *
INTO    #tmp_fct
FROM    [dbo].[FactInternetSales]
```

To convert this to CTAS is quite straight-forward:

```
CREATE TABLE #tmp_fct
WITH
(
    DISTRIBUTION = ROUND_ROBIN
,   LOCATION = USER_DB
)
AS
SELECT  *
FROM    [dbo].[FactInternetSales]
;
```

Using CTAS means you can also specify a data distribution preference and optional index the table as well.

## ANSI join replacement for update statements

You may find you have a complex update that joins more than two tables together using ANSI joining syntax to perform the UPDATE or DELETE.

Imagine you had to update this table:

```
CREATE TABLE [dbo].[AnnualCategorySales]
(	[EnglishProductCategoryName]	NVARCHAR(50)	NOT NULL
,	[CalendarYear]					SMALLINT		NOT NULL
,	[TotalSalesAmount]				MONEY			NOT NULL
)
WITH
(
	DISTRIBUTION = ROUND_ROBIN
)
;
```

The original query might have looked something like this:

```
UPDATE	acs
SET		[TotalSalesAmount] = [fis].[TotalSalesAmount]
FROM	[dbo].[AnnualCategorySales] 	AS acs
JOIN	(
		SELECT	[EnglishProductCategoryName]
		,		[CalendarYear]
		,		SUM([SalesAmount])				AS [TotalSalesAmount]
		FROM	[dbo].[FactInternetSales]		AS s
		JOIN	[dbo].[DimDate]					AS d	ON s.[OrderDateKey]				= d.[DateKey]
		JOIN	[dbo].[DimProduct]				AS p	ON s.[ProductKey]				= p.[ProductKey]
		JOIN	[dbo].[DimProductSubCategory]	AS u	ON p.[ProductSubcategoryKey]	= u.[ProductSubcategoryKey]
		JOIN	[dbo].[DimProductCategory]		AS c	ON u.[ProductCategoryKey]		= c.[ProductCategoryKey]
		WHERE 	[CalendarYear] = 2004
		GROUP BY
				[EnglishProductCategoryName]
		,		[CalendarYear]
		) AS fis
ON	[acs].[EnglishProductCategoryName]	= [fis].[EnglishProductCategoryName]
AND	[acs].[CalendarYear]				= [fis].[CalendarYear]
;
```

As SQL Data Warehouse does not support ANSI joins you cannot copy this code over without changing it slightly.

You can use a combination of a CTAS and an implicit join to replace this code:

```
-- Create an interim table
CREATE TABLE CTAS_acs
WITH (DISTRIBUTION = ROUND_ROBIN)
AS
SELECT	ISNULL(CAST([EnglishProductCategoryName] AS NVARCHAR(50)),0)	AS [EnglishProductCategoryName]
,		ISNULL(CAST([CalendarYear] AS SMALLINT),0) 						AS [CalendarYear]
,		ISNULL(CAST(SUM([SalesAmount]) AS MONEY),0)						AS [TotalSalesAmount]
FROM	[dbo].[FactInternetSales]		AS s
JOIN	[dbo].[DimDate]					AS d	ON s.[OrderDateKey]				= d.[DateKey]
JOIN	[dbo].[DimProduct]				AS p	ON s.[ProductKey]				= p.[ProductKey]
JOIN	[dbo].[DimProductSubCategory]	AS u	ON p.[ProductSubcategoryKey]	= u.[ProductSubcategoryKey]
JOIN	[dbo].[DimProductCategory]		AS c	ON u.[ProductCategoryKey]		= c.[ProductCategoryKey]
WHERE 	[CalendarYear] = 2004
GROUP BY
		[EnglishProductCategoryName]
,		[CalendarYear]
;

-- Use an implicit join to perform the update 
UPDATE  AnnualCategorySales
SET     AnnualCategorySales.TotalSalesAmount = CTAS_ACS.TotalSalesAmount
FROM    CTAS_acs
WHERE   CTAS_acs.[EnglishProductCategoryName] = AnnualCategorySales.[EnglishProductCategoryName]
AND     CTAS_acs.[CalendarYear]               = AnnualCategorySales.[CalendarYear]
;

--Drop the interim table
DROP TABLE CTAS_acs
;
```

## ANSI join replacement for delete statements
Sometimes the best approach for deleting data is to use CTAS. Rather than deleting the data simply select the data you want to keep. This especially true for DELETE statements that use ansi joining syntax as this is not supported on SQL Data Warehouse.

An example of a converted DELETE statement is available below:

```
CREATE TABLE dbo.DimProduct_upsert
WITH 
(   Distribution=HASH(ProductKey)
,   CLUSTERED INDEX (ProductKey)
)
AS -- Select Data you wish to keep
SELECT     p.ProductKey
,          p.EnglishProductName
,          p.Color
FROM       dbo.DimProduct p 
RIGHT JOIN dbo.stg_DimProduct s 
ON         p.ProductKey = s.ProductKey
;

RENAME OBJECT dbo.DimProduct        TO DimProduct_old;
RENAME OBJECT dbo.DimProduct_upsert TO DimProduct;
```

## Replace merge statements
Merge statements can be replaced, at least in part, by using CTAS. You can consolidate the `INSERT` and the `UPDATE` into a single statement. Any deleted records would need to be closed off in a second statement.

An example of an `UPSERT` is available below:

```
CREATE TABLE dbo.[DimProduct_upsert]
WITH 
(   DISTRIBUTION = HASH([ProductKey])
,   CLUSTERED INDEX ([ProductKey])
)
AS 
-- New rows and new versions of rows
SELECT      s.[ProductKey]
,           s.[EnglishProductName]
,           s.[Color]
FROM      dbo.[stg_DimProduct] AS s
UNION ALL  
-- Keep rows that are not being touched
SELECT      p.[ProductKey]
,           p.[EnglishProductName]
,           p.[Color]
FROM      dbo.[DimProduct] AS p
WHERE NOT EXISTS
(   SELECT  *
    FROM    [dbo].[stg_DimProduct] s
    WHERE   s.[ProductKey] = p.[ProductKey]
)
;

RENAME OBJECT dbo.[DimProduct]          TO [DimProduct_old];
RENAME OBJECT dbo.[DimpProduct_upsert]  TO [DimProduct];

```

## CTAS recommendation: Explicitly state data type and nullability of output

When migrating code you might find you run across this type of coding pattern:

```
DECLARE @d decimal(7,2) = 85.455
,       @f float(24)    = 85.455

CREATE TABLE result
(result DECIMAL(7,2) NOT NULL
)
WITH (DISTRIBUTION = ROUND_ROBIN)

INSERT INTO result
SELECT @d*@f 
;
```

Instinctively you might think you should migrate this code to a CTAS and you would be correct. However, their is a hidden issue here. 

The following code does NOT yield the same result:

```
DECLARE @d decimal(7,2) = 85.455
,       @f float(24)    = 85.455
;

CREATE TABLE ctas_r
WITH (DISTRIBUTION = ROUND_ROBIN)
AS
SELECT @d*@f as result
;
```

Notice that the column "result" carries forward the data type and nullability values of the expression. This can lead to subtle variances in values if you aren't careful.

Try the following as an example:

```
SELECT result,result*@d
from result
;

SELECT result,result*@d
from ctas_r
;
```

The value stored for result is different. As the persisted value in the result column is used in other expressions the error becomes even more significant.

![][1]

This is particularly important for data migrations. Even though the second query is arguably more accurate there is a problem. The data would be different compared to the source system and that leads to questions of integrity in the migration. This is one of those rare cases where the "wrong" answer is actually the right one!

The reason we see this disparity between the two results is down to implicit type casting. In the first example the table defines the column definition. When the row is inserted an implicit type conversion occurs. In the second example there is no implicit type conversion as the expression defines data type of the column. Notice also that the column in the second example has been defined as a NULLable column whereas in the first example it has not. When the table was created in the first example column nullability was explicitly defined. In the second example it was just left to the expression and by default this would result in a NULL definition.  

To resolve these issues you must explicitly set the type conversion and nullability in the SELECT portion of the CTAS statement. You cannot set these properties in the create table part.

The example below demonstrates how to fix the code:

```
DECLARE @d decimal(7,2) = 85.455
,       @f float(24)    = 85.455

CREATE TABLE ctas_r
WITH (DISTRIBUTION = ROUND_ROBIN)
AS
SELECT ISNULL(CAST(@d*@f AS DECIMAL(7,2)),0) as result
```

Note the following:
- CAST or CONVERT could have been used
- ISNULL is used to force NULLability not COALESCE
- ISNULL is the outermost function
- The second part of the ISNULL is a constant i.e. 0

> [AZURE.NOTE] For the nullability to be correctly set it is vital to use ISNULL and not COALESCE. COALESCE is not a deterministic function and so the result of the expression will always be NULLable. ISNULL is different. It is deterministic. Therefore when the second part of the ISNULL function is a constant or a literal then the resulting value will be NOT NULL. 

This tip is not just useful for ensuring the integrity of your calculations. It is also important for table partition switching. Imagine you have this table defined as your fact:

```
CREATE TABLE [dbo].[Sales]
(
    [date]      INT     NOT NULL
,   [product]   INT     NOT NULL
,   [store]     INT     NOT NULL
,   [quantity]  INT     NOT NULL
,   [price]     MONEY   NOT NULL
,   [amount]    MONEY   NOT NULL
)
WITH 
(   DISTRIBUTION = HASH([product])
,   PARTITION   (   [date] RANGE RIGHT FOR VALUES
                    (20000101,20010101,20020101
                    ,20030101,20040101,20050101
                    )
                )
) 
;
```

However, the value field is a calculated expression it is not part of the source data.

To create your partitioned dataset you might want to do this:

```
CREATE TABLE [dbo].[Sales_in]
WITH    
(   DISTRIBUTION = HASH([product])
,   PARTITION   (   [date] RANGE RIGHT FOR VALUES
                    (20000101,20010101
                    )
                )
)
AS
SELECT
    [date]    
,   [product] 
,   [store] 
,   [quantity]
,   [price]   
,   [quantity]*[price]  AS [amount]
FROM [stg].[source]
OPTION (LABEL = 'CTAS : Partition IN table : Create')
;
```

The query would run perfectly fine. The problem comes when you try to perform the partition switch. The table definitions do not match. To make the table definitions match the CTAS needs to be modified.

```
CREATE TABLE [dbo].[Sales_in]
WITH    
(   DISTRIBUTION = HASH([product])
,   PARTITION   (   [date] RANGE RIGHT FOR VALUES
                    (20000101,20010101
                    )
                )
)
AS
SELECT
    [date]    
,   [product] 
,   [store] 
,   [quantity]
,   [price]   
,   ISNULL(CAST([quantity]*[price] AS MONEY),0) AS [amount]
FROM [stg].[source]
OPTION (LABEL = 'CTAS : Partition IN table : Create');
```

You can see therefore that type consistency and maintaining nullability properties on a CTAS is a good engineering best practice. It helps to maintain integrity in your calculations and also ensures that partition switching is possible.

Please refer to MSDN for more information on using [CTAS][]. It is one of the most important statements in Azure SQL Data Warehouse. Make sure you thoroughly understand it.

## Next steps
For more development tips, see [development overview][].

<!--Image references-->
[1]: media/sql-data-warehouse-develop-ctas/ctas-results.png

<!--Article references-->
[development overview]: sql-data-warehouse-overview-develop.md

<!--MSDN references-->
[CTAS]: https://msdnstage.redmond.corp.microsoft.com/en-us/library/mt204041.aspx

<!--Other Web references-->

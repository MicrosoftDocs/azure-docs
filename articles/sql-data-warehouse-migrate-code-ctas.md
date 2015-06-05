<properties
   pageTitle="Improve performance with CREATE TABLE AS SELECT (CTAS) | Microsoft Azure"
   description="Examples and recommendations for using the create table as select (CTAS) statement to improve performance and to create modular code."
   services="SQL Data Warehouse"
   documentationCenter="NA"
   authors="barbkess"
   manager="jhubbard"
   editor=""/>

<tags
   ms.service="sql-data-warehouse"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="data-services"
   ms.date="06/03/2015"
   ms.author="JRJ@BigBangData.co.uk;barbkess"/>

# Improve performance with CREATE TABLE AS SELECT (CTAS) 
The CREATE TABLE AS SELECT (CTAS) statement is a fully parallelized operation that creates a new table based on the output of a select statement. This vital feature improves performance on SQL Data Warehouse, and it provides an alternative to using some SQL Server statements. 

Think of it as a super-charged version of the SELECT...INTO QL Server statement. 

> [AZURE.NOTE] Think "CTAS first". If you think you can solve a problem using CTAS then that is generally the best way to approach it. 


## Migrate SQL Server code
For code migration scenarios, you can use CTAS to work around these SQL Server features that are not supported in SQL Data Warehouse.

- SELECT..INTO
- ANSI JOINS on UPDATEs
- ANSI JOINs on DELETEs
- MERGE statement

### Example A: Use CTAS instead of SELECT..INTO
One of the code migration steps is to change existing SELECT...INTO statements to use CTAS. This example shows how to perform the conversion.

Statement with SELECT...INTO:

```
SELECT *
INTO    #tmp_fct
FROM    [dbo].[FactInternetSales]
```

Statement with CTAS:

```
CREATE TABLE #tmp_fct
WITH
(
    DISTRIBUTION = ROUND_ROBIN
)
AS
SELECT  *
FROM    [dbo].[FactInternetSales]
;
```

### Example B: Use CTAS instead of an ANSI JOIN for UPDATE and DELETE

This example shows first shows a complex update that joins more than two tables together using ANSI joining syntax to perform the UPDATE or DELETE. Then it shows how to write the same query by using CTAS.

Table to update:

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

SQL Server query that uses an ANSI JOIN for UPDATE:


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

This example modifies the SQL Server code by using a combination of a CTAS statement and an implicit join:

```
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

UPDATE  AnnualCategorySales
SET     AnnualCategorySales.TotalSalesAmount = CTAS_ACS.TotalSalesAmount
FROM    CTAS_acs
WHERE   CTAS_acs.[EnglishProductCategoryName] = AnnualCategorySales.[EnglishProductCategoryName]
AND     CTAS_acs.[CalendarYear]               = AnnualCategorySales.[CalendarYear]
;
```

### Example C: Use CTAS instead of MERGE 
The CTAS statement can replace merge statements, at least in part. You can consolidate the `INSERT` and `UPDATE` into a single statement. **up**date + in**sert** is called an upsert operation. Any deleted records still need to be closed off in a second statement.

This example uses CTAS to performs an upsert.

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
```

## Recommendations for data type and nullability consistency when using CTAS

It is important to maintain the consistency of data types and nullability definitions when you use CTAS to create a new table. This helps to maintain integrity in your calculations and also ensures that partition switching is possible.

### Example A: Use explicit data types and nullability definitions with CTAS to keep data integrity for computed columns

Statement A uses INSERT...SELECT and explicitly declares the result column of type DECIMAL(7,2), and explicitly declares the nullability of the result column.

Statement A, explicit column data type and nullability:

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

Statement B shows one way to change Statement A to use CTAS. The result column is of the data type that implicitly occurs when a decimal is multipled by a float. This does not result in a column of type DECIMAL(7,2).  The nullability is not explicitly defined, and by default the result column will be defined with NULL. 

Statement B, implicit column data type and nullability:

```
DECLARE @d decimal(7,2) = 85.455
,       @f float(24)    = 85.455

CREATE TABLE ctas_r
WITH (DISTRIBUTION = REPLICATE)
AS
SELECT @d*@f as result
;
```

To show that statement A and statement B do not give the same results, try running these statements.

```
SELECT result,result*@d
from result
;
SELECT result,result*@d
from ctas_r
;
```

Statement C resolves the type issues by explicitly setting the type conversion and nullability in the SELECT portion of the CTAS statement.

>[AZURE.NOTE] The table that CTAS creates inherits the data type of the columns the SELECT statement returns. You can declare the column types by using implicit type casting within the SELECT statement.

Statement C, the solution, type casting provides explicit data type and nullability.

```
DECLARE @d decimal(7,2) = 85.455
,       @f float(24)    = 85.455

CREATE TABLE ctas_r
WITH (DISTRIBUTION = ROUND_ROBIN)
AS
SELECT ISNULL(CAST(@d*@f AS DECIMAL(7,2)),0) as result

```

> [AZURE.NOTE] For the nullability to be correct, use ISNULL and not COALESCE. COALESCE is not a deterministic function and so the result of the expression will always be NULLable. ISNULL is different. It is deterministic. Therefore when the second part of the ISNULL function is a constant or a literal then the resulting value will be NOT NULL.

### Example B: Use explicit data types and nullability definitions with CTAS to keep data integrity for partition switching

The previous example is not just useful for ensuring the integrity of your calculations. It is also important for table partition switching. 

Let's start with this fact table definition:

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
However, the value field is a calculated expression that is not part of the source data.

To create your partitioned dataset you could do this:

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
The query would run perfectly fine. But, when you try to perform the partition switch, the table definitions do not match. To make the table definitions match the CTAS needs to be modified as follows:

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
OPTION (LABEL = 'CTAS : Partition IN table : Create')
;
```






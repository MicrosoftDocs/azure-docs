# Improve performance with Create Table As Select (CTAS) 
The CREATE TABLE AS SELECT (CTAS) statement is a fully parallelized operation that creates a new table based on the output of a select statement. Think of it as a super-charged version of SELECT...INTO. This vital feature that improves performance on SQL Data Warehouse. Updating your code to use CTAS will also help your code be compliant with SQL Data Warehouse.

> [AZURE.NOTE] Think "CTAS first". If you think you can solve a problem using CTAS then that is generally the best way to approach it. 

Scenarios that can be worked around with CTAS include:

- ANSI JOINS on UPDATEs
- ANSI JOINs on DELETEs
- MERGE statement
- SELECT..INTO

## EXAMPLE: Convert SELECT..INTO to CTAS
You may find SELECT..INTO appears in a number of places in your solution. This example converts a SELECT...INTO statement to CTAS.

Statement with SELECT...INTO.

```
SELECT *
INTO    #tmp_fct
FROM    [dbo].[FactInternetSales]
```

Convert this to CTAS.

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

## ANSI JOIN replacement for UPDATE and DELETE

This example shows how to write a complex update that joins more than two tables together using ANSI joining syntax to perform the UPDATE or DELETE.

Imagine you need to update this table:

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

In SQL Server, the query could look like this:


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

## Replace MERGE Statements
The CTAS statement can replace merge statements, at least in part. You can consolidate the `INSERT` and the `UPDATE` into a single statement. Any deleted records still need to be closed off in a second statement.

This example performs an `UPSERT` operation.

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

## Recommendation: Explicitly state data type and nullability of output.

When migrating code you might have this type of coding pattern:

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

Instinctively you might think you should migrate this code to a CTAS and you would be correct. However, there is a hidden issue here.

The following code does NOT yield the same result:

```
DECLARE @d decimal(7,2) = 85.455
,       @f float(24)    = 85.455

CREATE TABLE ctas_r
WITH (DISTRIBUTION = REPLICATE)
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
The value stored for result is different. Since the persisted value in the result column is used in other expressions the error becomes even more significant.
![][1]

This is particularly important for data migrations. Even though the second query is arguably more accurate there is a problem. The data would be different compared to the source system and that leads to questions of integrity in the migration. 

We see this disparity because of implicit type casting. In the first example the table defines the column definition. When the row is inserted an implicit type conversion occurs. In the second example there is no implicit type conversion as the expression defines data type of the column. Notice also that the column in the second example has been defined as a NULLable column whereas in the first example it has not. When the table was created in the first example column nullability was explicitly defined. In the second example it was just left to the expression and by default this would result in a NULL definition.  

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

> [AZURE.NOTE] For the nullability to be correct, use ISNULL and not COALESCE. COALESCE is not a deterministic function and so the result of the expression will always be NULLable. ISNULL is different. It is deterministic. Therefore when the second part of the ISNULL function is a constant or a literal then the resulting value will be NOT NULL.

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
However, the value field is a calculated expression that is not part of the source data.

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

You can see therefore that type consistency and maintaining nullability properties on a CTAS is a good engineering best practice. It helps to maintain integrity in your calculations and also ensures that partition switching is possible.

Please refer to MSDN for more information on using [CTAS]. It is one of the most important statements in Azure SQL Data Warehouse. Make sure you thoroughly understand it.


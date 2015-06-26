<properties
   pageTitle="Loops in SQL Data Warehouse | Microsoft Azure"
   description="Tips for Transact-SQL loops and replacing cursors in Azure SQL Data Warehouse for developing solutions."
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

# Loops in SQL Data Warehouse
SQL Data Warehouse supports the [WHILE][] loop for repeatedly executing statement blocks. This will continue for as long as the specified conditions are true or until the code specifically terminates the loop using the `BREAK` keyword. Loops are particularly useful for replacing cursors defined in SQL code. Fortunately, almost all cursors that are written in SQL code are of the fast forward, read only variety. Therefore [WHILE] loops are a great alternative if you find yourself having to replace one.

## Leveraging loops and replacing cursors in SQL Data Warehouse
However, before diving in head first you should ask yourself the following question: "Could this cursor be re-written to use set based operations?". In many cases the answer will be yes. More often than not the best approach is to do just that. A set based operation will often perform significantly faster than an iterative row by row approach.

Fast forward read only cursors can be easily replaced with a looping construct. Below is a simple example to convey the approach. The code example updates the statistics for every table in the database. By iterating over the tables in the loop we are able to execute each command in sequence.

Firstly, create a temporary table containing a unique row number used to identify the individual statements:
  
```
CREATE TABLE #tbl 
WITH 
(   LOCATION     = USER_DB
,   DISTRIBUTION = ROUND_ROBIN
)
AS
SELECT  ROW_NUMBER() OVER(ORDER BY (SELECT NULL)) ) AS Sequence
,       [name]
,       'UPDATE STATISTICS '+QUOTENAME([name]) AS sql_code
FROM    sys.tables
;
```

Secondly, initialize the variables required to perform the loop:

```
DECLARE @nbr_statements INT = (SELECT COUNT(*) FROM #tbl)
,       @i INT = 1
;
```

Now loop over statements executing them one at a time:

```
WHILE   @i <= @nbr_statements
BEGIN
    DECLARE @sql_code NVARCHAR(4000) = (SELECT sql_code FROM #tbl WHERE Sequence = @i);
    EXEC    sp_executesql @sql_code;
    SET     @i +=1;
END
```

Finally drop the temporary table created in the first step

```
DROP TABLE #tbl;
```


<!--Every topic should have next steps and links to the next logical set of content to keep the customer engaged-->

## Next steps
For more development tips, see [development overview][].

<!--Image references-->

<!--Article references-->
[development overview]: sql-data-warehouse-overview-develop.md

<!--MSDN references-->
[WHILE]: https://msdn.microsoft.com/library/ms178642.aspx


<!--Other Web references-->



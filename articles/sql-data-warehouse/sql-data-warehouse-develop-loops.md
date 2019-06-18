---
title: Using T-SQL loops in Azure SQL Data Warehouse | Microsoft Docs
description: Tips for using T-SQL loops and replacing cursors in Azure SQL Data Warehouse for developing solutions.
services: sql-data-warehouse
author: XiaoyuL-Preview
manager: craigg
ms.service: sql-data-warehouse
ms.topic: conceptual
ms.subservice: development
ms.date: 04/17/2018
ms.author: xiaoyul
ms.reviewer: igorstan
---

# Using T-SQL loops in SQL Data Warehouse
Tips for using T-SQL loops and replacing cursors in Azure SQL Data Warehouse for developing solutions.

## Purpose of WHILE loops

SQL Data Warehouse supports the [WHILE](/sql/t-sql/language-elements/while-transact-sql) loop for repeatedly executing statement blocks. This WHILE loop continues for as long as the specified conditions are true or until the code specifically terminates the loop using the BREAK keyword. Loops are useful for replacing cursors defined in SQL code. Fortunately, almost all cursors that are written in SQL code are of the fast forward, read-only variety. Therefore, [WHILE] loops are a great alternative for replacing cursors.

## Replacing cursors in SQL Data Warehouse
However, before diving in head first you should ask yourself the following question: "Could this cursor be rewritten to use set-based operations?." In many cases, the answer is yes and is often the best approach. A set-based operation often performs faster than an iterative, row by row approach.

Fast forward read-only cursors can be easily replaced with a looping construct. The following is a simple example. This code example updates the statistics for every table in the database. By iterating over the tables in the loop, each command executes in sequence.

First, create a temporary table containing a unique row number used to identify the individual statements:

```
CREATE TABLE #tbl
WITH
( DISTRIBUTION = ROUND_ROBIN
)
AS
SELECT  ROW_NUMBER() OVER(ORDER BY (SELECT NULL)) AS Sequence
,       [name]
,       'UPDATE STATISTICS '+QUOTENAME([name]) AS sql_code
FROM    sys.tables
;
```

Second, initialize the variables required to perform the loop:

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

## Next steps
For more development tips, see [development overview](sql-data-warehouse-overview-develop.md).


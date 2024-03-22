---
title: Use T-SQL loops
description: Tips for using T-SQL loops, replacing cursors, and developing related solutions with Synapse SQL in Azure Synapse Analytics.
author: filippopovic
ms.author: fipopovi
ms.reviewer: sngun
ms.date: 04/15/2020
ms.service: synapse-analytics
ms.subservice: sql
ms.topic: conceptual
---

# Use T-SQL loops with Synapse SQL in Azure Synapse Analytics

This article provides you with essential tips for using T-SQL loops, replacing cursors, and developing related solutions with Synapse SQL.

## Purpose of WHILE loops

Synapse SQL supports the [WHILE](/sql/t-sql/language-elements/while-transact-sql?preserve-view=true&view=sql-server-ver15) loop for repeatedly executing statement blocks. This WHILE loop continues for as long as the specified conditions are true or until the code specifically terminates the loop using the BREAK keyword. 

Loops in Synapse SQL are useful for replacing cursors defined in SQL code. Fortunately, almost all cursors that are written in SQL code are of the fast forward, read-only variety. So, WHILE loops are a great alternative for replacing cursors.

## Replace cursors in Synapse SQL

Before diving in, the following question should be considered: "Could this cursor be rewritten to use set-based operations?" In many cases, the answer is yes and is frequently the best approach. A set-based operation often executes faster than an iterative, row by row approach.

Fast forward read-only cursors are easily replaced with a looping construct. The following code is a simple example. This code example updates the statistics for every table in the database. By iterating over the tables in the loop, each command executes in sequence.

First, create a temporary table containing a unique row number used to identify the individual statements:

```sql
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

Second, initialize the variables required to execute the loop:

```sql
DECLARE @nbr_statements INT = (SELECT COUNT(*) FROM #tbl)
,       @i INT = 1
;
```

Now loop over statements executing them one at a time:

```sql
WHILE   @i <= @nbr_statements
BEGIN
    DECLARE @sql_code NVARCHAR(4000) = (SELECT sql_code FROM #tbl WHERE Sequence = @i);
    EXEC    sp_executesql @sql_code;
    SET     @i +=1;
END
```

Finally drop the temporary table created in the first step

```sql
DROP TABLE #tbl;
```

## Next steps

For more development tips, see [development overview](develop-overview.md).

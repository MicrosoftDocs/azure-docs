---
title: Using T-SQL loops
description: Tips for solution development using T-SQL loops and replacing cursors for dedicated SQL pools in Azure Synapse Analytics.
author: MSTehrani
ms.author: emtehran
ms.reviewer: wiassaf
ms.date: 04/17/2018
ms.service: synapse-analytics
ms.subservice: sql-dw
ms.topic: conceptual
ms.custom:
  - seo-lt-2019
  - azure-synapse
---

# Using T-SQL loops for dedicated SQL pools in Azure Synapse Analytics

Included in this article are tips for dedicated SQL pool solution development using T-SQL loops and replacing cursors.

## Purpose of WHILE loops

Dedicated SQL pools in Azure Synapse support the [WHILE](/sql/t-sql/language-elements/while-transact-sql?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json&view=azure-sqldw-latest&preserve-view=true) loop for repeatedly executing statement blocks. This WHILE loop continues for as long as the specified conditions are true or until the code specifically terminates the loop using the BREAK keyword.

Loops are useful for replacing cursors defined in SQL code. Fortunately, almost all cursors that are written in SQL code are of the fast forward, read-only variety. So, WHILE loops are a great alternative for replacing cursors.

## Replacing cursors in dedicated SQL pool

However, before diving in head first you should ask yourself the following question: "Could this cursor be rewritten to use set-based operations?"

In many cases, the answer is yes and is frequently the best approach. A set-based operation often performs faster than an iterative, row by row approach.

Fast forward read-only cursors can be easily replaced with a looping construct. The following example is a simple one. This code example updates the statistics for every table in the database. By iterating over the tables in the loop, each command executes in sequence.

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

Second, initialize the variables required to perform the loop:

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

For more development tips, see [development overview](sql-data-warehouse-overview-develop.md).

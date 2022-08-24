---
title: Spark Advisor
description: Spark Advisor is a system that automatically analyzes commands and queries, and advises you when you execute code or a query.
services: synapse-analytics 
author: jejiang
ms.author: jejiang
ms.reviewer: sngun 
ms.service: synapse-analytics
ms.topic: tutorial
ms.subservice: spark
ms.date: 06/23/2022
---

# Spark Advisor

Spark Advisor is a system that automatically analyzes commands and queries, and advises you when you execute code or a query. After you apply the advice, you have the chance to improve your execution performance, decrease cost, and fix execution failures.


## Advice provided

### Might return inconsistent results when you use 'randomSplit'
Spark Advisor might return inconsistent or inaccurate results when you work with the results of the 'randomSplit' method. Use Apache Spark resilient distributed dataset caching before you use the 'randomSplit' method.

The randomSplit method is equivalent to performing a sample on your dataframe multiple times, with each sample refetching, partitioning, and sorting your dataframe within partitions. The data distribution across partitions and sorting order is important for both randomSplit and sample methods. If either changes upon data refetch, there might be duplicates, or missing values across splits, and the same sample that uses the same seed might produce different results.

These inconsistencies might not happen on every run. To eliminate them completely, cache your dataframe, repartition on a column(s), or apply aggregate functions such as groupBy.

### The table/view name is already in use
A view already exists with the same name as the created table, or a table already exists with the same name as the created view. When you use this name in queries or applications, Spark Advisor returns only the view, regardless of which one was created first. To avoid conflicts, rename either the table or the view.

## Hints related to advice

### Unable to recognize a hint
The selected query contains a hint that isn't recognized. Verify that the hint is spelled correctly.

```scala
spark.sql("SELECT /*+ unknownHint */ * FROM t1")
```

### Unable to find a specified relation name(s)
Unable to find the relation(s) specified in the hint. Verify that the relation(s) are spelled correctly and are accessible within the scope of the hint.

```scala
spark.sql("SELECT /*+ BROADCAST(unknownTable) */ * FROM t1 INNER JOIN t2 ON t1.str = t2.str")
```

### A hint in the query prevents another hint from being applied
The selected query contains a hint that prevents another hint from being applied.

```scala
spark.sql("SELECT /*+ BROADCAST(t1), MERGE(t1, t2) */ * FROM t1 INNER JOIN t2 ON t1.str = t2.str")
```

## Enable 'spark.advise.divisionExprConvertRule.enable' to reduce rounding error propagation
This query contains the expression with double type. We recommend that you enable the configuration 'spark.advise.divisionExprConvertRule.enable', which can help reduce the division expressions and the rounding error propagation.

```text
"t.a/t.b/t.c" convert into "t.a/(t.b * t.c)"
```

## Enable 'spark.advise.nonEqJoinConvertRule.enable' to improve query performance
This query contains a time-consuming join due to an "Or" condition within the query. We recommend that you enable the configuration 'spark.advise.nonEqJoinConvertRule.enable', which can help to convert the join triggered by the "Or" condition to SMJ or BHJ to accelerate this query.

## Next steps
For more information on monitoring pipeline runs, see the [Monitor pipeline runs using Synapse Studio](how-to-monitor-pipeline-runs.md) article.
---
title: Troubleshoot Spark Advisor
description: Spark Advisor automatically analyzes your commands and queries, and advises you about them. Learn to troubleshoot common problems. 
services: synapse-analytics 
author: jejiang
ms.author: jejiang
ms.reviewer: sngun 
ms.service: synapse-analytics
ms.topic: tutorial
ms.subservice: spark
ms.date: 06/23/2022
---

# Troubleshoot Spark Advisor

Spark Advisor is a system that automatically analyzes your code and query commands and advises you about them. By following this advice, you can improve your execution performance, fix execution failures, and decrease costs. This article helps you solve common problems with  Spark Advisor.


## Issues related to hints

### The system doesn't recognize a hint
The selected query contains a hint that the system doesn't recognize. Verify that the hint is spelled correctly.

```scala
spark.sql("SELECT /*+ unknownHint */ * FROM t1")
```

### The system can't find specified relation names
The system is unable to find the relations specified in a hint. Verify that the relations are spelled correctly and are accessible within the scope of the hint.

```scala
spark.sql("SELECT /*+ BROADCAST(unknownTable) */ * FROM t1 INNER JOIN t2 ON t1.str = t2.str")
```

### You can't apply another hint because a hint in the query prevents it
The selected query contains a hint that prevents another hint from being applied.

```scala
spark.sql("SELECT /*+ BROADCAST(t1), MERGE(t1, t2) */ * FROM t1 INNER JOIN t2 ON t1.str = t2.str")
```

## Issues related to queries

### To reduce rounding error propagation, enable spark.advise.divisionExprConvertRule.enable
This query contains the expression with double type. We recommend that you enable the configuration `spark.advise.divisionExprConvertRule.enable`, which can help reduce the division expressions and the rounding error propagation.

```text
"t.a/t.b/t.c" convert into "t.a/(t.b * t.c)"
```

### To improve query performance, enable spark.advise.nonEqJoinConvertRule.enable
This query contains a time-consuming join due to an "Or" condition within the query. We recommend that you enable the configuration `spark.advise.nonEqJoinConvertRule.enable`, which can help to convert the join triggered by the "Or" condition to shuffle sort merge join (SMJ) or broadcast hash join (BHJ) to accelerate this query.


## Other troubleshooting

### The use of the randomSplit method might return inconsistent results
Spark Advisor might return inconsistent or inaccurate results when you work with the results of the `randomSplit` method. Use Apache Spark resilient distributed dataset caching (RDD) before you use the `randomSplit` method.

The `randomSplit()` method is equivalent to performing a `sample()` on your DataFrame multiple times, with each sample refetching, partitioning, and sorting your DataFrame within partitions. The data distribution across partitions and sorting order is important for both `randomSplit()` and `sample()` methods. If either changes upon data refetch, there might be duplicates, or missing values across splits, and the same sample that uses the same seed might produce different results.

These inconsistencies might not happen on every run. To eliminate them completely, cache your DataFrame, repartition on columns, or apply aggregate functions such as groupBy.

### A table or view name might already be in use
A view already exists with the same name as the created table, or a table already exists with the same name as the created view. When you use this name in queries or applications, Spark Advisor returns only the view, regardless of which one was created first. To avoid conflicts, rename either the table or the view.

## Next steps
For more information on monitoring pipeline runs, see the [Monitor pipeline runs using Synapse Studio](how-to-monitor-pipeline-runs.md) article.
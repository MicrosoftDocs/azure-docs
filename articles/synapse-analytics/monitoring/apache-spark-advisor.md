---
title: Troubleshoot Spark application issues with Spark Advisor
description: Learn how to troubleshoot Spark application issues with Spark Advisor. The advisor automatically analyzes queries and commands, and offers advice.
services: synapse-analytics 
author: jejiang
ms.author: jejiang
ms.reviewer: sngun 
ms.service: synapse-analytics
ms.topic: tutorial
ms.subservice: spark
ms.date: 06/23/2022
---

# Troubleshoot Spark application issues with Spark Advisor

Spark Advisor is a system that automatically analyzes your code, queries, and commands, and advises you about them. By following this advice, you can improve your execution performance, fix execution failures, and decrease costs. This article helps you solve common problems with Spark Advisor.

## Advice on query hints

### May return inconsistent results when using 'randomsplit'
Verify that the hint is spelled correctly.

```scala
spark.sql("SELECT /*+ unknownHint */ * FROM t1")
```

### Unable to find specified relation names
Verify that the relations are spelled correctly and are accessible within the scope of the hint.

```scala
spark.sql("SELECT /*+ BROADCAST(unknownTable) */ * FROM t1 INNER JOIN t2 ON t1.str = t2.str")
```

### A hint in the query prevents another hint from being applied

```scala
spark.sql("SELECT /*+ BROADCAST(t1), MERGE(t1, t2) */ * FROM t1 INNER JOIN t2 ON t1.str = t2.str")
```

### Reduce rounding error propagation caused by division
This query contains the expression with the `double` type. We recommend that you enable the configuration `spark.advise.divisionExprConvertRule.enable`, which can help reduce the division expressions and the rounding error propagation.

```text
"t.a/t.b/t.c" convert into "t.a/(t.b * t.c)"
```

### Improve query performance for non-equal join 
This query contains a time-consuming join because of an `Or` condition within the query. We recommend that you enable the configuration `spark.advise.nonEqJoinConvertRule.enable`. It can help convert the join triggered by the `Or` condition to shuffle sort merge join (SMJ) or broadcast hash join (BHJ) to accelerate this query.

### The use of the randomSplit method might return inconsistent results
Spark Advisor might return inconsistent or inaccurate results when you work with the results of the `randomSplit` method. Use Apache Spark resilient distributed dataset caching (RDD) before you use the `randomSplit` method.

The `randomSplit()` method is equivalent to performing a `sample()` action on your DataFrame multiple times, with each sample refetching, partitioning, and sorting your DataFrame within partitions. The data distribution across partitions and sort order is important for both `randomSplit()` and `sample()` methods. If either changes upon data refetch, there might be duplicates or missing values across splits, and the same sample that uses the same seed might produce different results.

These inconsistencies might not happen on every run. To eliminate them completely, cache your DataFrame, repartition on columns, or apply aggregate functions such as `groupBy`.

### A table or view name might already be in use
A view already exists with the same name as the created table, or a table already exists with the same name as the created view. When you use this name in queries or applications, Spark Advisor returns only the view, regardless of which one was created first. To avoid conflicts, rename either the table or the view.

## Next steps
For more information on monitoring pipeline runs, see [Monitor pipeline runs using Synapse Studio](how-to-monitor-pipeline-runs.md).

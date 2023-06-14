---
title: Poor performance in Apache Hive LLAP queries in Azure HDInsight
description: Queries in Apache Hive LLAP are executing slower than expected in Azure HDInsight.
ms.service: hdinsight
ms.topic: troubleshooting
ms.date: 12/28/2022
---

# Scenario: Poor performance in Apache Hive LLAP queries in Azure HDInsight

This article describes troubleshooting steps and possible resolutions for issues when using Interactive Query components in Azure HDInsight clusters.

## Issue

The default cluster configurations are not sufficiently tuned for your workload. Queries in Hive LLAP are executing slower than expected.

## Cause

This can happen due to a variety of reasons.

## Resolution

LLAP is optimized for queries that involve joins and aggregates. Queries like the following don’t perform well in an Interactive Hive cluster:

```
select * from table where column = "columnvalue"
```

To improve point query performance in Hive LLAP, set the following configurations:

```
hive.llap.io.enabled=false; (disable LLAP IO)
hive.optimize.index.filter=false; (disable ORC row index)
hive.exec.orc.split.strategy=BI; (to avoid recombining splits)
```

You can also increase usage the LLAP cache to improve performance with the following configuration change:

```
hive.fetch.task.conversion=none
```

## Next steps

[!INCLUDE [troubleshooting next steps](../includes/hdinsight-troubleshooting-next-steps.md)]

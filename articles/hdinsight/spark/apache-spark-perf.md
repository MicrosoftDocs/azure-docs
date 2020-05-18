---
title: Optimize Spark jobs for performance - Azure HDInsight 
description: Show common strategies for the best performance of Apache Spark clusters in Azure HDInsight.
author: hrasheed-msft
ms.author: hrasheed
ms.reviewer: jasonh
ms.service: hdinsight
ms.topic: conceptual
ms.custom: hdinsightactive,seomay2020
ms.date: 05/18/2020
---
# Optimize Apache Spark jobs in HDInsight

The performance of your Apache Spark jobs depends on multiple factors. This includes how the data is stored, how the cluster is configured, and the operations that are used when processing the data.

Common challenges you might face include memory constraints due to improperly-sized executors, long-running operations, and tasks that result in Cartesian operations.

There are also various strategies that can help you to overcome these challenges, such as caching, and allowing for [data skew](#optimize-joins-and-shuffles).

In each of the following articles, you can find common challenges and solutions for a different aspect of spark optimization.

* [Optimize data storage](optimize-data-storage.md)
* [Optimize data processing](optimize-data-processing.md)
* [Optimize memory usage](optimize-memory-usage.md)
* [Optimize cluster configuration](optimize-cluster-configuration.md)

## Next steps

* [Debug Apache Spark jobs running on Azure HDInsight](apache-spark-job-debugging.md)
* [Manage resources for an Apache Spark cluster on HDInsight](apache-spark-resource-manager.md)
* [Configure Apache Spark settings](apache-spark-settings.md)

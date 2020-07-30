---
title: Optimize Spark jobs for performance - Azure HDInsight 
description: Show common strategies for the best performance of Apache Spark clusters in Azure HDInsight.
author: hrasheed-msft
ms.author: hrasheed
ms.reviewer: jasonh
ms.service: hdinsight
ms.topic: conceptual
ms.date: 05/21/2020
---
# Optimize Apache Spark jobs in HDInsight

This article provides an overview of strategies to optimize Apache Spark jobs on Azure HDInsight.

## Overview

The performance of your Apache Spark jobs depends on multiple factors. These performance factors include: how your data is stored, how the cluster is configured, and the operations that are used when processing the data.

Common challenges you might face include: memory constraints due to improperly sized executors, long-running operations, and tasks that result in cartesian operations.

There are also many optimizations that can help you overcome these challenges, such as caching, and allowing for data skew.

In each of the following articles, you can find information on different aspects of Spark optimization.

* [Optimize data storage for Apache Spark](optimize-data-storage.md)
* [Optimize data processing for Apache Spark](optimize-data-processing.md)
* [Optimize memory usage for Apache Spark](optimize-memory-usage.md)
* [Optimize HDInsight cluster configuration for Apache Spark](optimize-cluster-configuration.md)

## Next steps

* [Debug Apache Spark jobs running on Azure HDInsight](apache-spark-job-debugging.md)
* [Manage resources for an Apache Spark cluster on HDInsight](apache-spark-resource-manager.md)
* [Configure Apache Spark settings](apache-spark-settings.md)

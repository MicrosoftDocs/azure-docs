---
title: Optimize Apache Spark cluster configuration - Azure HDInsight 
description: Learn how to configure your Apache Spark cluster to maximize throughput on Azure HDInsight.
ms.service: hdinsight
ms.topic: conceptual
ms.date: 12/26/2022
ms.custom: contperf-fy21q1
---
# Cluster configuration optimization for Apache Spark

This article discusses how to optimize the configuration of your Apache Spark cluster for best performance on Azure HDInsight.

## Overview

Depending on your Spark cluster workload, you may determine that a non-default Spark configuration would result in more optimized Spark job execution.  Do benchmark testing with sample workloads to validate any non-default cluster configurations.

Here are some common parameters you can adjust:

|Parameter |Description |
|---|---|
|--num-executors|Sets the appropriate number of executors.|
|--executor-cores|Sets the number of cores for each executor. Typically you should have middle-sized executors, as other processes consume some of the available memory.|
|--executor-memory|Sets the memory size for each executor, which controls the heap size on YARN. Leave some memory for execution overhead.|

## Select the correct executor size

When deciding your executor configuration, consider the Java garbage collection (GC) overhead.

* Factors to reduce executor size:
    1. Reduce heap size below 32 GB to keep GC overhead < 10%.
    2. Reduce the number of cores to keep GC overhead < 10%.

* Factors to increase executor size:
    1. Reduce communication overhead between executors.
    2. Reduce the number of open connections between executors (N2) on larger clusters (>100 executors).
    3. Increase heap size to accommodate for memory-intensive tasks.
    4. Optional: Reduce per-executor memory overhead.
    5. Optional: Increase usage and concurrency by oversubscribing CPU.

As a general rule, when selecting the executor size:

1. Start with 30 GB per executor and distribute available machine cores.
2. Increase the number of executor cores for larger clusters (> 100 executors).
3. Modify size based both on trial runs and on the preceding factors such as GC overhead.

When running concurrent queries, consider:

1. Start with 30 GB per executor and all machine cores.
2. Create multiple parallel Spark applications by oversubscribing CPU (around 30% latency improvement).
3. Distribute queries across parallel applications.
4. Modify size based both on trial runs and on the preceding factors such as GC overhead.

For more information on using Ambari to configure executors, see [Apache Spark settings - Spark executors](apache-spark-settings.md#configuring-spark-executors).

Monitor query performance for outliers or other performance issues, by looking at the timeline view. Also SQL graph, job statistics, and so forth. For information on debugging Spark jobs using YARN and the Spark History server, see [Debug Apache Spark jobs running on Azure HDInsight](apache-spark-job-debugging.md). For tips on using YARN Timeline Server, see [Access Apache Hadoop YARN application logs](../hdinsight-hadoop-access-yarn-app-logs-linux.md).

## Tasks slower on some executors or nodes

Sometimes one or a few of the executors are slower than the others, and tasks take much longer to execute. This slowness frequently happens on larger clusters (> 30 nodes). In this case, divide the work into a larger number of tasks so the scheduler can compensate for slow tasks. For example, have at least twice as many tasks as the number of executor cores in the application. You can also enable speculative execution of tasks with `conf: spark.speculation = true`.

## Next steps

* [Optimize data processing for Apache Spark](optimize-cluster-configuration.md)
* [Optimize data storage for Apache Spark](optimize-data-storage.md)
* [Optimize memory usage for Apache Spark](optimize-memory-usage.md)

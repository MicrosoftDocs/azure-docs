---
title: Optimize Spark jobs for performance - Azure HDInsight 
description: Show common strategies for the best performance of Apache Spark clusters in Azure HDInsight.
ms.service: hdinsight
ms.topic: conceptual
ms.date: 08/21/2020
ms.custom: contperf-fy21q1
---
# Optimize Apache Spark jobs in HDInsight

This article provides an overview of strategies to optimize Apache Spark jobs on Azure HDInsight.

## Overview

You might face below common Scenarios

- The same spark job is slower than before in the same HDInsight cluster
- The spark job is slower in HDInsight cluster than on-premise or other third party service provider
- The spark job is slower in one HDI cluster than another HDI cluster

The performance of your Apache Spark jobs depends on multiple factors. These performance factors include: 

- How your data is stored
- How the cluster is configured
- The operations that are used when processing the data.
- Unhealthy yarn service
- Memory constraints due to improperly sized executors and OutOfMemoryError
- Too many tasks or too less tasks
- Data skew casued a few heavy tasks or slow tasks
- Tasks slower in bad nodes



## Step 1: Check if your yarn service is healthy

1. Go to Ambari UI:
- Check if ResourceManager or NodeManager alerts
- Check ResourceManager and NodeManager status in YARN > SUMMARY: All NodeManager should be in Started and only Active ResourceManager should be in Started

2. Check if Yarn UI is accessible through `https://YOURCLUSTERNAME.azurehdinsight.net/yarnui/hn/cluster`

3. Check if any exceptions or errors in ResourceManager log in `/var/log/hadoop-yarn/yarn/hadoop-yarn-resourcemanager-*.log`


## Step 2: Compare your new application resources with yarn available resources

1. Go to **Ambari UI > YARN > SUMMARY**, check **CLUSTER MEMORY** in ServiceMetrics

2. Check yarn queue metrics in details:
- Go to Yarn UI, check Yarn scheduler metrics through `https://YOURCLUSTERNAME.azurehdinsight.net/yarnui/hn/cluster/scheduler`
- Alternatively, you can check yarn scheduler metrics through Yarn Rest API. For example, `curl -u "xxxx" -sS -G "https://YOURCLUSTERNAME.azurehdinsight.net/ws/v1/cluster/scheduler"`. For ESP, you should use domain admin user.

3. Calculate total resources for your new application
- All executors resources: `spark.executor.instances * (spark.executor.memory + spark.yarn.executor.memoryOverhead) and spark.executor.instances * spark.executor.cores`
- ApplicationMaster
  - In cluster mode, use `spark.driver.memory` and `spark.driver.cores`
  - In client mode, use `spark.yarn.am.memory+spark.yarn.am.memoryOverhead` and `spark.yarn.am.cores`

> [!NOTE]
> `yarn.scheduler.minimum-allocation-mb <= spark.executor.memory+spark.yarn.executor.memoryOverhead <= yarn.scheduler.maximum-allocation-mb`

4. Compare your new application total resources with yarn available resources in your specified queue

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

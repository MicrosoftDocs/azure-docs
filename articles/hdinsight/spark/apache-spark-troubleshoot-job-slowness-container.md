---
title: Apache Spark slow when Azure HDInsight storage has many files
description: Apache Spark job runs slowly when the Azure storage container contains many files in Azure HDInsight
ms.service: hdinsight
ms.topic: troubleshooting
ms.date: 06/14/2023
---

# Apache Spark job run slowly when the Azure storage container contains many files in Azure HDInsight

This article describes troubleshooting steps and possible resolutions for issues when using Apache Spark components in Azure HDInsight clusters.

## Issue

When you run an HDInsight cluster, the Apache Spark job that writes to Azure storage container becomes slow when there are many files/sub-folders. For example, it takes 20 seconds when writing to a new container, but about 2 minutes when writing to a container that has 200k files.

## Cause

This issue is a known Spark related issue. The slowness comes from the `ListBlob` and `GetBlobProperties` operations during Spark job execution.

To track partitions, Spark has to maintain a `FileStatusCache` that, contains info about directory structure. If you use this cache, Spark can parse the paths and be aware of available partitions. The benefit of tracking partitions is that Spark only touches the necessary files when you read data. To keep this information up-to-date, when you write new data, Spark has to list all files under the directory and update this cache.

In Spark 2.1, while we don't need to update the cache after every write, Spark will check whether an existing partition column matches with the proposed one in the current write request. So it will also lead to listing operations at the beginning of every write.

In Spark 2.2, when writing data with append mode, this performance problem should be fixed.

In Spark 2.3, the same behavior as Spark 2.2 is expected.

## Resolution

When you create a partitioned data set, it's important to use a partitioning scheme that limits the number of files that Spark has to list to update the `FileStatusCache`.

For every Nth micro batch where N % 100 == 0 (100 is just an example), move existing data to another directory, which is loaded by Spark.

## Next steps

[!INCLUDE [troubleshooting next steps](../includes/hdinsight-troubleshooting-next-steps.md)]

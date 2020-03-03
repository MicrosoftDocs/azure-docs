---
title: Apache Spark slow when Azure HDInsight storage has many files
description: Apache Spark job runs slowly when the Azure storage container contains many files in Azure HDInsight
ms.service: hdinsight
ms.topic: troubleshooting
author: hrasheed-msft
ms.author: hrasheed
ms.reviewer: jasonh
ms.date: 08/21/2019
---

# Apache Spark job run slowly when the Azure storage container contains many files in Azure HDInsight

This article describes troubleshooting steps and possible resolutions for issues when using Apache Spark components in Azure HDInsight clusters.

## Issue

When running an HDInsight cluster, the Apache Spark job that writes to Azure storage container becomes slow when there are many files/sub-folders. For example, it takes 20 seconds when writing to a new container, but about 2 minutes when writing to a container that has 200k files.

## Cause

This is a known Spark issue. The slowness comes from the `ListBlob` and `GetBlobProperties` operations during Spark job execution.

To track partitions, Spark has to maintain a `FileStatusCache` which contains info about directory structure. Using this cache, Spark can parse the paths and be aware of available partitions. The benefit of tracking partitions is that Spark only touches the necessary files when you read data. To keep this information up-to-date, when you write new data, Spark has to list all files under the directory and update this cache.

In Spark 2.1, while we do not need to update the cache after every write, Spark will check whether an existing partition column matches with the proposed one in the current write request, so it will also lead to listing operations at the beginning of every write.

In Spark 2.2, when writing data with append mode, this performance problem should be fixed.

## Resolution

When you create a partitioned data set, it is important to use a partitioning scheme that will limit the number of files that Spark has to list to update the `FileStatusCache`.

For every Nth micro batch where N % 100 == 0 (100 is just an example), move existing data to another directory, which can be loaded by Spark.

## Next steps

If you didn't see your problem or are unable to solve your issue, visit one of the following channels for more support:

* Get answers from Azure experts through [Azure Community Support](https://azure.microsoft.com/support/community/).

* Connect with [@AzureSupport](https://twitter.com/azuresupport) - the official Microsoft Azure account for improving customer experience by connecting the Azure community to the right resources: answers, support, and experts.

* If you need more help, you can submit a support request from the [Azure portal](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade/). Select **Support** from the menu bar or open the **Help + support** hub. For more detailed information, please review [How to create an Azure support request](https://docs.microsoft.com/azure/azure-portal/supportability/how-to-create-azure-support-request). Access to Subscription Management and billing support is included with your Microsoft Azure subscription, and Technical Support is provided through one of the [Azure Support Plans](https://azure.microsoft.com/support/plans/).

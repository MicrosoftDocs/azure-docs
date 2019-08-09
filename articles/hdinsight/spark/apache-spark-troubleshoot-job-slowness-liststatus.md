---
title: Apache Spark Streaming jobs take longer than usual to process in Azure HDInsight
description: Apache Spark Streaming jobs take longer than usual to process in Azure HDInsight
ms.service: hdinsight
ms.topic: troubleshooting
author: hrasheed-msft
ms.author: hrasheed
ms.date: 07/29/2019
---

# Scenario: Apache Spark Streaming jobs take longer than usual to process in Azure HDInsight

This article describes troubleshooting steps and possible resolutions for issues when using Apache Spark components in Azure HDInsight clusters.

## Issue

You observe that some of the Apache Spark Streaming jobs are slow, or taking longer than usual to process. For Spark Streaming applications, each batch of messages corresponds to one job submitted to Spark. If a job normally takes X seconds to process, it may occasionally take 2-3 minutes more than usual.

## Cause

One possible cause is that the Apache Kafka producer takes more than 2 minutes to finish writing out to the Kafka cluster. To further debug the Kafka issue, you can add some logging to the code that uses a Kafka producer to send out messages, and correlate that with the logs from Kafka cluster.

Another possible cause is that frequent reads and writes to WASB can cause subsequent micro-batches to lag. The WASB implementation of `Filesystem.listStatus` is very slow due to an `O(n!)` algorithm to remove duplicates. It uses too much memory due to the extra conversion from `BlobListItem` to `FileMetadata` to `FileStatus`. For example, the algorithm takes over 30 minutes to list 700,000 files. So if `ListBlobs` is being called aggressively by SparkSQL every micro-batch, it will cause subsequent micro-batches to lag behind resulting in what you experience as high scheduling delays. [This patch](https://issues.apache.org/jira/browse/HADOOP-15547) fixes the issue, but if it is missing in your environment, `ListBlobs` will experience high latency. Also, even if you delete files every hour, the listing in the back-end has to iterate over all rows (including deleted) because garbage collection process hasn’t completed yet. While the patch might solve some of the problem, the garbage collection issue might still cause delay in stream processing of batches.

## Resolution

Apply the [HADOOP-15547](https://issues.apache.org/jira/browse/HADOOP-15547) fix. If that is not possible, you can use HDFS as the check point location. Set `checkpointDirectory` to something like: `hdfs://mycluster/checkpoint`.

## Next steps

If you didn't see your problem or are unable to solve your issue, visit one of the following channels for more support:

* Get answers from Azure experts through [Azure Community Support](https://azure.microsoft.com/support/community/).

* Connect with [@AzureSupport](https://twitter.com/azuresupport) - the official Microsoft Azure account for improving customer experience by connecting the Azure community to the right resources: answers, support, and experts.

* If you need more help, you can submit a support request from the [Azure portal](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade/). Select **Support** from the menu bar or open the **Help + support** hub. For more detailed information, please review [How to create an Azure support request](https://docs.microsoft.com/azure/azure-supportability/how-to-create-azure-support-request). Access to Subscription Management and billing support is included with your Microsoft Azure subscription, and Technical Support is provided through one of the [Azure Support Plans](https://azure.microsoft.com/support/plans/).

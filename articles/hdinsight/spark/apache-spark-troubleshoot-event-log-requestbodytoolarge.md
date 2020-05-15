---
title: RequestBodyTooLarge error from Apache Spark app - Azure HDInsight
description: NativeAzureFileSystem ... RequestBodyTooLarge appears in log for Apache Spark streaming app in Azure HDInsight
ms.service: hdinsight
ms.topic: troubleshooting
author: hrasheed-msft
ms.author: hrasheed
ms.reviewer: jasonh
ms.date: 07/29/2019
---

# "NativeAzureFileSystem...RequestBodyTooLarge" appear in Apache Spark streaming app log in HDInsight

This article describes troubleshooting steps and possible resolutions for issues when using Apache Spark components in Azure HDInsight clusters.

## Issue

The error: `NativeAzureFileSystem ... RequestBodyTooLarge` appears in the driver log for an Apache Spark streaming app.

## Cause

Your Spark event log file is probably hitting the file length limit for WASB.

In Spark 2.3, each Spark app generates one Spark event log file. The Spark event log file for a Spark streaming app continues to grow while the app is running. Today a file on WASB has a 50000 block limit, and the default block size is 4 MB. So in default configuration the max file size is 195 GB. However, Azure Storage has increased the max block size to 100 MB, which effectively brought the single file limit to 4.75 TB. For more information, see [Scalability and performance targets for Blob storage](../../storage/blobs/scalability-targets.md).

## Resolution

There are three solutions available for this error:

* Increase the block size to up to 100 MB. In Ambari UI, modify HDFS configuration property `fs.azure.write.request.size` (or create it in `Custom core-site` section). Set the property to a larger value, for example: 33554432. Save the updated configuration and restart affected components.

* Periodically stop and resubmit the spark-streaming job.

* Use HDFS to store Spark event logs. Using HDFS for storage may result in loss of Spark event data during cluster scaling or Azure upgrades.

    1. Make changes to `spark.eventlog.dir` and `spark.history.fs.logDirectory` via Ambari UI:

        ```
        spark.eventlog.dir = hdfs://mycluster/hdp/spark2-events
        spark.history.fs.logDirectory = "hdfs://mycluster/hdp/spark2-events"
        ```

    1. Create directories on HDFS:

        ```
        hadoop fs -mkdir -p hdfs://mycluster/hdp/spark2-events
        hadoop fs -chown -R spark:hadoop hdfs://mycluster/hdp
        hadoop fs -chmod -R 777 hdfs://mycluster/hdp/spark2-events
        hadoop fs -chmod -R o+t hdfs://mycluster/hdp/spark2-events
        ```

    1. Restart all affected services via Ambari UI.

## Next steps

If you didn't see your problem or are unable to solve your issue, visit one of the following channels for more support:

* Get answers from Azure experts through [Azure Community Support](https://azure.microsoft.com/support/community/).

* Connect with [@AzureSupport](https://twitter.com/azuresupport) - the official Microsoft Azure account for improving customer experience by connecting the Azure community to the right resources: answers, support, and experts.

* If you need more help, you can submit a support request from the [Azure portal](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade/). Select **Support** from the menu bar or open the **Help + support** hub. For more detailed information, please review [How to create an Azure support request](https://docs.microsoft.com/azure/azure-portal/supportability/how-to-create-azure-support-request). Access to Subscription Management and billing support is included with your Microsoft Azure subscription, and Technical Support is provided through one of the [Azure Support Plans](https://azure.microsoft.com/support/plans/).

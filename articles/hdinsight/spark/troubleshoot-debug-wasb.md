---
title: Debug WASB file operations in Azure HDInsight
description: Describes troubleshooting steps and possible resolutions for issues when interacting with Azure HDInsight clusters.
author: hrasheed-msft
ms.author: hrasheed
ms.reviewer: jasonh
ms.service: hdinsight
ms.topic: troubleshooting
ms.date: 02/18/2020
---

# Debug WASB file operations in Azure HDInsight

There are times when you may want to understand what operations the WASB driver started with Azure Storage. For the client side, the WASB driver produces logs for each file system operation at **DEBUG** level. WASB driver uses log4j to control logging level and the default is **INFO** level. For Azure Storage server-side analytics logs, see [Azure Storage analytics logging](../../storage/common/storage-analytics-logging.md).

A produced log will look similar to:

```log
18/05/13 04:15:55 DEBUG NativeAzureFileSystem: Moving wasb://xxx@yyy.blob.core.windows.net/user/livy/ulysses.txt/_temporary/0/_temporary/attempt_20180513041552_0000_m_000000_0/part-00000 to wasb://xxx@yyy.blob.core.windows.net/user/livy/ulysses.txt/part-00000
```

## Turn on WASB debug log for file operations

1. From a web browser, navigate to `https://CLUSTERNAME.azurehdinsight.net/#/main/services/SPARK2/configs`, where `CLUSTERNAME` is the name of your Spark cluster.

1. Navigate to **advanced spark2-log4j-properties**.

    1. Modify `log4j.appender.console.Threshold=INFO` to `log4j.appender.console.Threshold=DEBUG`.

    1. Add `log4j.logger.org.apache.hadoop.fs.azure.NativeAzureFileSystem=DEBUG`.

1. Navigate to **Advanced livy2-log4j-properties**.

    Add `log4j.logger.org.apache.hadoop.fs.azure.NativeAzureFileSystem=DEBUG`.

1. Save changes.

## Additional logging

The above logs should provide high-level understanding of the file system operations. If the above logs are still not providing useful information, or if you want to investigate blob storage api calls, add `fs.azure.storage.client.logging=true` to the `core-site`. This setting will enable the java sdk logs for wasb storage driver and will print each call to blob storage server. Remove the setting after investigations because it could fill up the disk quickly and could slow down the process.

If the backend is Azure Data Lake based, then use the following log4j setting for the component(for example, spark/tez/hdfs):

```
log4j.logger.com.microsoft.azure.datalake.store=ALL,adlsFile
log4j.additivity.com.microsoft.azure.datalake.store=true
log4j.appender.adlsFile=org.apache.log4j.FileAppender
log4j.appender.adlsFile.File=/var/log/adl/adl.log
log4j.appender.adlsFile.layout=org.apache.log4j.PatternLayout
log4j.appender.adlsFile.layout.ConversionPattern=%p\t%d{ISO8601}\t%r\t%c\t[%t]\t%m%n
```

Look for the logs in `/var/log/adl/adl.log` for the logs.

## Next steps

If you didn't see your problem or are unable to solve your issue, visit one of the following channels for more support:

* Get answers from Azure experts through [Azure Community Support](https://azure.microsoft.com/support/community/).

* Connect with [@AzureSupport](https://twitter.com/azuresupport) - the official Microsoft Azure account for improving customer experience. Connecting the Azure community to the right resources: answers, support, and experts.

* If you need more help, you can submit a support request from the [Azure portal](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade/). Select **Support** from the menu bar or open the **Help + support** hub. For more detailed information, review [How to create an Azure support request](https://docs.microsoft.com/azure/azure-supportability/how-to-create-azure-support-request). Access to Subscription Management and billing support is included with your Microsoft Azure subscription, and Technical Support is provided through one of the [Azure Support Plans](https://azure.microsoft.com/support/plans/).

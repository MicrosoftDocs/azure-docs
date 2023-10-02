---
title: RequestBodyTooLarge error from Apache Spark app - Azure HDInsight
description: NativeAzureFileSystem ... RequestBodyTooLarge appears in log for Apache Spark streaming app in Azure HDInsight
ms.service: hdinsight
ms.topic: troubleshooting
ms.date: 05/25/2023
---

# RequestBodyTooLarge appear in Apache Spark Streaming application log in HDInsight

This article describes troubleshooting steps and possible resolutions for issues when using Apache Spark components in Azure HDInsight clusters.

## Issue

You would recieve below errors in an Apache Spark Streaming application log

`NativeAzureFileSystem ... RequestBodyTooLarge`

Or 

```
java.io.IOException: Operation failed: "The request body is too large and exceeds the maximum permissible limit.", 413, PUT, https://<storage account>.dfs.core.windows.net/<container>/hdp/spark2-events/application_1620341592106_0004_1.inprogress?action=flush&retainUncommittedData=false&position=9238349177&close=false&timeout=90, RequestBodyTooLarge, "The request body is too large and exceeds the maximum permissible limit. RequestId:0259adb6-101f-0041-0660-43f672000000 Time:2021-05-07T16:48:00.2660760Z"
        at org.apache.hadoop.fs.azurebfs.services.AbfsOutputStream.flushWrittenBytesToServiceInternal(AbfsOutputStream.java:362)
        at org.apache.hadoop.fs.azurebfs.services.AbfsOutputStream.flushWrittenBytesToService(AbfsOutputStream.java:337)
        at org.apache.hadoop.fs.azurebfs.services.AbfsOutputStream.flushInternal(AbfsOutputStream.java:272)
        at org.apache.hadoop.fs.azurebfs.services.AbfsOutputStream.hflush(AbfsOutputStream.java:230)
        at org.apache.hadoop.fs.FSDataOutputStream.hflush(FSDataOutputStream.java:134)
        at org.apache.spark.scheduler.EventLoggingListener$$anonfun$logEvent$3.apply(EventLoggingListener.scala:144)
        at org.apache.spark.scheduler.EventLoggingListener$$anonfun$logEvent$3.apply(EventLoggingListener.scala:144)
        at scala.Option.foreach(Option.scala:257)
        at org.apache.spark.scheduler.EventLoggingListener.logEvent(EventLoggingListener.scala:144)
```



## Cause

Files created over ABFS driver create Block blobs in Azure storage. Your Spark event log file is probably hitting the file length limit for WASB. See [50,000 blocks that a block blob can hold at max](/rest/api/storageservices/understanding-block-blobs--append-blobs--and-page-blobs#about-block-blobs).

In Spark 2.3, each Spark app generates one Spark event log file. The Spark event log file for a Spark streaming app continues to grow while the app is running. Today a file on WASB has a 50000 block limit, and the default block size is 4 MB. So in default configuration the max file size is 195 GB. However, Azure Storage has increased the max block size to 100 MB, which effectively brought the single file limit to 4.75 TB. For more information, see [Scalability and performance targets for Blob storage](../../storage/blobs/scalability-targets.md).

## Resolution

There are four solutions available for this error:

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
* Add `--conf spark.hadoop.fs.azure.enable.flush=false` in spark-submit to disable auto flush
## Next steps

[!INCLUDE [troubleshooting next steps](../includes/hdinsight-troubleshooting-next-steps.md)]

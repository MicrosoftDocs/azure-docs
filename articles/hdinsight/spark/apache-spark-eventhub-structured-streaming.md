---
title: Use Apache Spark structured streaming with Event Hubs in Azure HDInsight | Microsoft Docs
description: Build an Apache Spark streaming sample on how to send a data stream to Azure Event Hub and then receive those events in HDInsight Spark cluster using a scala application.
keywords: apache spark streaming,spark streaming,spark sample,apache spark streaming example,event hub azure sample,spark sample
services: hdinsight
documentationcenter: ''
author: mumian
manager: jhubbard
editor: cgronlun
tags: azure-portal

ms.service: hdinsight
ms.custom: hdinsightactive
ms.workload: big-data
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 11/28/2017
ms.author: jgao

---

# Apache Spark Structured Streaming on HDInsight to process events from Event Hubs

In this article, you learn to process real-time telemetry using Spark Structured Streaming. To accomplish this you perform the following high-level steps:

1. Compile and run on your local workstation a sample Event Producer application that generates events to send to Event Hubs.
2. Use the [Spark Shell](apache-spark-shell.md) to define and run a simple Spark Structured Streaming application.

## Prerequisites

* An Azure subscription. See [Get Azure free trial](https://azure.microsoft.com/documentation/videos/get-azure-free-trial-for-testing-hadoop-in-hdinsight/).

* An Apache Spark cluster on HDInsight. For instructions, see [Create Apache Spark clusters in Azure HDInsight](apache-spark-jupyter-spark-sql.md).

* Oracle Java Development kit. You can install it from [here](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html).

* Apache Maven. You can download it from [here](https://maven.apache.org/download.cgi). Instructions to install Maven are available [here](https://maven.apache.org/install.html).

## Build, configure, and run the Event Producer
In this task, you clone a sample application that creates random events and sends them to a configured Event Hub. This sample application is available in GitHub at [https://github.com/hdinsight/eventhubs-sample-event-producer](https://github.com/hdinsight/eventhubs-sample-event-producer).

1. Make sure you have the git tools installed. You can download from [GIT Downloads](http://www.git-scm.com/downloads). 
2. Open a command prompt or terminal shell and run the following command from the directory of your choice to clone the project.
        
        git clone https://github.com/hdinsight/eventhubs-sample-event-producer.git eventhubs-client-sample

3. This creates a new folder called eventhubs-client-sample. Within the shell or command prompt, navigate into this folder.
4. Run Maven to build the application by using the following command:

          mvn package

5. Within the shell or command prompt, navigate into the target directory that is created and contains the file ``com-microsoft-azure-eventhubs-client-example-0.2.0.jar``.
6. Next, you need to build up the command line to run the Event Producer against your Event Hub. Do this by replacing the values in the command as follows:

        java -cp com-microsoft-azure-eventhubs-client-example-0.2.0.jar com.microsoft.azure.eventhubs.client.example.EventhubsClientDriver --eventhubs-namespace "<namespace>" --eventhubs-name "hub1" --policy-name "RootManageSharedAccessKey" --policy-key "<policyKey>" --message-length 32 --thread-count 1 --message-count -1

7. For example, a complete command would look similar to the following:

        java -cp com-microsoft-azure-eventhubs-client-example-0.2.0.jar com.microsoft.azure.eventhubs.client.example.EventhubsClientDriver --eventhubs-namespace "sparkstreaming" --eventhubs-name "hub1" --policy-name "RootManageSharedAccessKey" --policy-key "2P1Q17Wd1rdLP1OZQYn6dD2S13Bb3nF3h2XZD9hvyyU=" --message-length 32 --thread-count 1 --message-count -1

8. The command starts up and if your configuration is correct in a few moments you see output related to the events it is sending to your Event Hub, similar to the following:

        Map('policyKey -> 2P1Q17Wd1rdLP1OZQYn6dD2S13Bb3nF3h2XZD9hvyyU, 'eventhubsName -> hub1, 'policyName -> RootManageSharedAccessKey, 'eventhubsNamespace -> sparkstreaming, 'messageCount -> -1, 'messageLength -> 32, 'threadCount -> 1)
        Events per thread: -1 (-1 for unlimited)
        10 > Sun Jun 18 11:32:58 PDT 2017 > 1024 > 1024 > Sending event: ZZ93958saG5BUKbvUI9wHVmpuA2TrebS
        10 > Sun Jun 18 11:33:46 PDT 2017 > 2048 > 2048 > Sending event: RQorGRbTPp6U2wYzRSnZUlWEltRvTZ7R
        10 > Sun Jun 18 11:34:33 PDT 2017 > 3072 > 3072 > Sending event: 36Eoy2r8ptqibdlfCYSGgXe6ct4AyOX3
        10 > Sun Jun 18 11:35:19 PDT 2017 > 4096 > 4096 > Sending event: bPZma9V0CqOn6Hj9bhrrJT0bX2rbPSn3
        10 > Sun Jun 18 11:36:06 PDT 2017 > 5120 > 5120 > Sending event: H2TVD77HNTVyGsVcj76g0daVnYxN4Sqs

9. Leave the Event Producer running while you continue on to the steps.

## Run Spark Shell on your HDInsight cluster
In this task, you will SSH into the head node of your HDInsight cluster, launch the Spark Shell, and run a Spark Streaming application that retrieves and processes the events from Event Hubs. 

By this point your HDInsight cluster should be ready. If not, you need to wait until it finishes provisioning. Once it is ready, proceed with the following steps:

1. Connect to the HDInsight cluster using SSH. For instructions, see [Connect to HDInsight using SSH](../hdinsight-hadoop-linux-use-ssh-unix.md).

5. The application you build requires the Spark Streaming Event Hubs package. To run the Spark Shell so that it automatically retrieves this dependency from [Maven Central](https://search.maven.org), be sure the supply the packages switch with the Maven coordinates as follows:

        spark-shell --packages "com.microsoft.azure:spark-streaming-eventhubs_2.11:2.1.5"

6. Once the Spark Shell is finished loading, you should see:

        Welcome to
            ____              __
            / __/__  ___ _____/ /__
            _\ \/ _ \/ _ `/ __/  '_/
        /___/ .__/\_,_/_/ /_/\_\   version 2.1.1.2.6.2.3-1
            /_/
                
        Using Scala version 2.11.8 (OpenJDK 64-Bit Server VM, Java 1.8.0_151)
        Type in expressions to have them evaluated.
        Type :help for more information.

        scala> 

7. Copy the following code snippet into a text editor and modify it so it has the Policy Key and Namespace set as appropriate for your Event Hub.

        val eventhubParameters = Map[String, String] (
            "eventhubs.policyname" -> "RootManageSharedAccessKey",
            "eventhubs.policykey" -> "<policyKey>",
            "eventhubs.namespace" -> "<namespace>",
            "eventhubs.name" -> "hub1",
            "eventhubs.partition.count" -> "2",
            "eventhubs.consumergroup" -> "$Default",
            "eventhubs.progressTrackingDir" -> "/eventhubs/progress",
            "eventhubs.sql.containsProperties" -> "true"
            )
            
8. If you look at your EventHub-compatible endpoint in the following form, the part that reads `iothub-xxxxxxxxxx` is your EventHub-compatible Namespace name, and can be used for `eventhubs.namespace`. The field `SharedAccessKeyName` can be used for `eventhubs.policyname`, and `SharedAccessKey` for `eventhubs.policykey`: 

        Endpoint=sb://iothub-xxxxxxxxxx.servicebus.windows.net/;SharedAccessKeyName=xxxxx;SharedAccessKey=xxxxxxxxxx 

9. Paste the modified snippet into the waiting scala> prompt and press return. You should see output similar to:

        scala> val eventhubParameters = Map[String, String] (
            |       "eventhubs.policyname" -> "RootManageSharedAccessKey",
            |       "eventhubs.policykey" -> "2P1Q17Wd1rdLP1OZQYn6dD2S13Bb3nF3h2XZD9hvyyU",
            |       "eventhubs.namespace" -> "sparkstreaming",
            |       "eventhubs.name" -> "hub1",
            |       "eventhubs.partition.count" -> "2",
            |       "eventhubs.consumergroup" -> "$Default",
            |       "eventhubs.progressTrackingDir" -> "/eventhubs/progress",
            |       "eventhubs.sql.containsProperties" -> "true"
            |     )
        eventhubParameters: scala.collection.immutable.Map[String,String] = Map(eventhubs.sql.containsProperties -> true, eventhubs.name -> hub1, eventhubs.consumergroup -> $Default, eventhubs.partition.count -> 2, eventhubs.progressTrackingDir -> /eventhubs/progress, eventhubs.policykey -> 2P1Q17Wd1rdLP1OZQYn6dD2S13Bb3nF3h2XZD9hvyyU, eventhubs.namespace -> hdiz-docs-eventhubs, eventhubs.policyname -> RootManageSharedAccessKey)

10. Next, you begin to author a Spark Structured Streaming query be specifying the source. Paste the following into Spark Shell and press return.

        val inputStream = spark.readStream.
        format("eventhubs").
        options(eventhubParameters).
        load()

11. You should see output similar to:

        inputStream: org.apache.spark.sql.DataFrame = [body: binary, offset: bigint ... 5 more fields]

12. Next, author the query so that it writes its output to the Console. Do this by pasting the following into Spark Shell and pressing return.

        val streamingQuery1 = inputStream.writeStream.
        outputMode("append").
        format("console").start().awaitTermination()

13. You should see some batches start with output similar to the following

        -------------------------------------------
        Batch: 0
        -------------------------------------------
        [Stage 0:>                                                          (0 + 2) / 2]

14. This is followed by the output results of the processing of each microbatch of events. 

        -------------------------------------------
        Batch: 0
        -------------------------------------------
        17/06/18 18:57:39 WARN TaskSetManager: Stage 1 contains a task of very large size (419 KB). The maximum recommended task size is 100 KB.
        +--------------------+------+---------+------------+---------+------------+----------+
        |                body|offset|seqNumber|enqueuedTime|publisher|partitionKey|properties|
        +--------------------+------+---------+------------+---------+------------+----------+
        |[7B 22 74 65 6D 7...|     0|        0|  1497734887|     null|        null|     Map()|
        |[7B 22 74 65 6D 7...|   112|        1|  1497734887|     null|        null|     Map()|
        |[7B 22 74 65 6D 7...|   224|        2|  1497734887|     null|        null|     Map()|
        |[7B 22 74 65 6D 7...|   336|        3|  1497734887|     null|        null|     Map()|
        |[7B 22 74 65 6D 7...|   448|        4|  1497734887|     null|        null|     Map()|
        |[7B 22 74 65 6D 7...|   560|        5|  1497734887|     null|        null|     Map()|
        |[7B 22 74 65 6D 7...|   672|        6|  1497734887|     null|        null|     Map()|
        |[7B 22 74 65 6D 7...|   784|        7|  1497734888|     null|        null|     Map()|
        |[7B 22 74 65 6D 7...|   896|        8|  1497734888|     null|        null|     Map()|
        |[7B 22 74 65 6D 7...|  1008|        9|  1497734888|     null|        null|     Map()|
        |[7B 22 74 65 6D 7...|  1120|       10|  1497734888|     null|        null|     Map()|
        |[7B 22 74 65 6D 7...|  1232|       11|  1497734888|     null|        null|     Map()|
        |[7B 22 74 65 6D 7...|  1344|       12|  1497734888|     null|        null|     Map()|
        |[7B 22 74 65 6D 7...|  1456|       13|  1497734888|     null|        null|     Map()|
        |[7B 22 74 65 6D 7...|  1568|       14|  1497734888|     null|        null|     Map()|
        |[7B 22 74 65 6D 7...|  1680|       15|  1497734888|     null|        null|     Map()|
        |[7B 22 74 65 6D 7...|  1792|       16|  1497734888|     null|        null|     Map()|
        |[7B 22 74 65 6D 7...|  1904|       17|  1497734888|     null|        null|     Map()|
        |[7B 22 74 65 6D 7...|  2016|       18|  1497734889|     null|        null|     Map()|
        |[7B 22 74 65 6D 7...|  2128|       19|  1497734889|     null|        null|     Map()|
        +--------------------+------+---------+------------+---------+------------+----------+
        only showing top 20 rows

15. As new events arrive from the Event Producer, they are processed by this Structured Streaming query.
16. Be sure to delete your HDInsight cluster when you are finished running this sample.



## See also

* [Overview of Spark streaming](apache-spark-streaming-overview.md)














---
title: Use the Apache Kafka Streams API - Azure HDInsight | Microsoft Docs
description: Learn how to use the Apache Kafka Streams API with Kafka on HDInsight. This API enables you to perform stream processing between topics in Kafka.
services: hdinsight
documentationcenter: ''
author: Blackmist
manager: jhubbard
editor: cgronlun
tags: azure-portal

ms.assetid: 9fcac906-8f06-4002-9fe8-473e42f8fd0f
ms.service: hdinsight
ms.custom: hdinsightactive
ms.workload: big-data
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 01/18/2018
ms.author: larryfr

---

# Apache Kafka streams API

Learn how to create an application that uses the Kafka Streams API and run it with Kafka on HDInsight.

When working with Apache Kafka, stream processing is often done using Apache Spark or Storm. Kafka version 0.10.0 (in HDInsight 3.5 and 3.6) introduced the Kafka Streams API. This API allows you to transform data streams between input and output topics, using an application that runs on Kafka. In some cases, this may be an alternative to creating a Spark or Storm streaming solution. For more information on Kafka Streams, see the [Intro to Streams](https://kafka.apache.org/10/documentation/streams/) documentation on Apache.org.

## Download and build the example

1. Download the examples from [https://github.com/Azure-Samples/hdinsight-kafka-java-get-started](https://github.com/Azure-Samples/hdinsight-kafka-java-get-started) to your development environment. For the streaming example, use the project in the `streaming` directory.
   
    This project contains only one class, `Stream`, which reads records from the `test` topic created previously. It counts the words read, and emits each word and count to a topic named `wordcounts`. The `wordcounts` topic is created in a later step in this section.

2. From the command line in your development environment, change directories to the location of the `Streaming` directory, and then use the following command to create a jar package:

    ```bash
    mvn clean package
    ```

    This command creates a directory named `target`, which contains a file named `kafka-streaming-1.0-SNAPSHOT.jar`.

3. Use the following commands to copy the `kafka-streaming-1.0-SNAPSHOT.jar` file to your HDInsight cluster:
   
    ```bash
    scp ./target/kafka-streaming-1.0-SNAPSHOT.jar SSHUSER@CLUSTERNAME-ssh.azurehdinsight.net:kafka-streaming.jar
    ```
   
    Replace **SSHUSER** with the SSH user for your cluster, and replace **CLUSTERNAME** with the name of your cluster. When prompted enter the password for the SSH user.

4. Once the `scp` command finishes copying the file, connect to the cluster using SSH, and then use the following command to create the `wordcounts` topic:

    ```bash
    /usr/hdp/current/kafka-broker/bin/kafka-topics.sh --create --replication-factor 3 --partitions 8 --topic wordcounts --zookeeper $KAFKAZKHOSTS
    ```

5. Next, start the streaming process by using the following command:
   
    ```bash
    java -jar kafka-streaming.jar $KAFKABROKERS $KAFKAZKHOSTS 2>/dev/null &
    ```
   
    This command starts the streaming process in the background.

6. Use the following command to send messages to the `test` topic. These messages are processed by the streaming example:
   
    ```bash
    java -jar kafka-producer-consumer.jar producer $KAFKABROKERS &>/dev/null &
    ```

7. Use the following command to view the output that is written to the `wordcounts` topic by the streaming process:
   
    ```bash
    /usr/hdp/current/kafka-broker/bin/kafka-console-consumer.sh --bootstrap-server $KAFKABROKERS --topic wordcounts --from-beginning --formatter kafka.tools.DefaultMessageFormatter --property print.key=true --property key.deserializer=org.apache.kafka.common.serialization.StringDeserializer --property value.deserializer=org.apache.kafka.common.serialization.LongDeserializer
    ```
   
    > [!NOTE]
    > To view the data, you must tell the consumer to print the key and the deserializer to use for the key and value. The key name is the word, and the key value contains the count.
   
    The output is similar to the following text:
   
        dwarfs  13635
        ago     13664
        snow    13636
        dwarfs  13636
        ago     13665
        a       13803
        ago     13666
        a       13804
        ago     13667
        ago     13668
        jumped  13640
        jumped  13641
        a       13805
        snow    13637
   
    > [!NOTE]
    > The count increments each time a word is encountered.

7. Use the __Ctrl + C__ to exit the consumer, then use the `fg` command to bring the streaming background task back to the foreground. Use __Ctrl + C__ to exit it also.
---
title: Use the Apache Kafka Streams API - Azure HDInsight | Microsoft Docs
description: Learn how to use the Apache Kafka Streams API with Kafka on HDInsight. This API enables you to perform stream processing between topics in Kafka.
services: hdinsight
documentationcenter: ''
author: Blackmist
manager: cgronlun
editor: cgronlun
tags: azure-portal

ms.service: hdinsight
ms.custom: hdinsightactive
ms.workload: big-data
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 04/10/2018
ms.author: larryfr

---

# Apache Kafka streams API

Learn how to create an application that uses the Kafka Streams API and run it with Kafka on HDInsight.

When working with Apache Kafka, stream processing is often done using Apache Spark or Storm. Kafka version 0.10.0 (in HDInsight 3.5 and 3.6) introduced the Kafka Streams API. This API allows you to transform data streams between input and output topics, using an application that runs on Kafka. In some cases, this may be an alternative to creating a Spark or Storm streaming solution. For more information on Kafka Streams, see the [Intro to Streams](https://kafka.apache.org/10/documentation/streams/) documentation on Apache.org.

## Set up your development environment

You must have the following components installed in your development environment:

* [Java JDK 8](http://www.oracle.com/technetwork/java/javase/downloads/index.html) or an equivalent, such as OpenJDK.

* [Apache Maven](http://maven.apache.org/)

* An SSH client and the `scp` command. For more information, see the [Use SSH with HDInsight](../hdinsight-hadoop-linux-use-ssh-unix.md) document.

## Set up your deployment environment

This example requires Kafka on HDInsight 3.6. To learn how to create a Kafka on HDInsight cluster, see the [Start with Kafka on HDInsight](apache-kafka-get-started.md) document.

## Build and deploy the example

Use the following steps to build and deploy the project to your Kafka on HDInsight cluster.

1. Download the examples from [https://github.com/Azure-Samples/hdinsight-kafka-java-get-started](https://github.com/Azure-Samples/hdinsight-kafka-java-get-started).

2. Change directories to the `Streaming` directory, and then use the following command to create a jar package:

    ```bash
    mvn clean package
    ```

    This command creates a directory named `target`, which contains a file named `kafka-streaming-1.0-SNAPSHOT.jar`.

3. Use the following command to copy the `kafka-streaming-1.0-SNAPSHOT.jar` file to your HDInsight cluster:
   
    ```bash
    scp ./target/kafka-streaming-1.0-SNAPSHOT.jar SSHUSER@CLUSTERNAME-ssh.azurehdinsight.net:kafka-streaming.jar
    ```
   
    Replace **SSHUSER** with the SSH user for your cluster, and replace **CLUSTERNAME** with the name of your cluster. If prompted, enter the password for the SSH user account. For more information on using `scp` with HDInsight, see [Use SSH with HDInsight](../hdinsight-hadoop-linux-use-ssh-unix.md).

## Run the example

1. To open an SSH connection to the cluster, use the following command:

    ```bash
    ssh SSHUSER@CLUSTERNAME-ssh.azurehdinsight.net
    ```

    Replace **SSHUSER** with the SSH user for your cluster, and replace **CLUSTERNAME** with the name of your cluster. If prompted, enter the password for the SSH user account. For more information on using `scp` with HDInsight, see [Use SSH with HDInsight](../hdinsight-hadoop-linux-use-ssh-unix.md).

4. To create the Kafka topics that are used by this example, use the following commands:

    ```bash
    sudo apt -y install jq

    CLUSTERNAME='your cluster name'

    export KAFKAZKHOSTS=`curl -sS -u admin -G https://$CLUSTERNAME.azurehdinsight.net/api/v1/clusters/$CLUSTERNAME/services/ZOOKEEPER/components/ZOOKEEPER_SERVER | jq -r '["\(.host_components[].HostRoles.host_name):2181"] | join(",")' | cut -d',' -f1,2`

    export KAFKABROKERS=`curl -sS -u admin -G https://$CLUSTERNAME.azurehdinsight.net/api/v1/clusters/$CLUSTERNAME/services/KAFKA/components/KAFKA_BROKER | jq -r '["\(.host_components[].HostRoles.host_name):9092"] | join(",")' | cut -d',' -f1,2`

    /usr/hdp/current/kafka-broker/bin/kafka-topics.sh --create --replication-factor 3 --partitions 8 --topic test --zookeeper $KAFKAZKHOSTS

    /usr/hdp/current/kafka-broker/bin/kafka-topics.sh --create --replication-factor 3 --partitions 8 --topic wordcounts --zookeeper $KAFKAZKHOSTS
    ```

    Replace __your cluster name__ with the name of your HDInsight cluster. When prompted, enter the password for the HDInsight cluster login account.

    > [!NOTE]
    > If your cluster login is different than the default value of `admin`, replace the `admin` value in the previous commands with your cluster login name.

5. To run this example, you must do three things:

    * Start the Streams solution contained in `kafka-streaming.jar`.
    * Start a producer that writes to the `test` topic.
    * Start a consumer so that you can see the output written to the `wordcounts` topic

    > [!NOTE]
    > You need to verify that the `auto.create.topics.enable` property is set to `true` in the Kafka Broker config file. This property can be viewed and modified in the Advanced Kafka Broker Configuration file by using the Ambari Web UI. Otherwise, you need to create the intermediate topic `RekeyedIntermediateTopic` manually before running this example using the following command:
    ```bash
    /usr/hdp/current/kafka-broker/bin/kafka-topics.sh --create --replication-factor 3 --partitions 8 --topic RekeyedIntermediateTopic  --zookeeper $KAFKAZKHOSTS
    ```
    
    You could accomplish these operations by opening three SSH sessions. But you then have to set `$KAFKABROKERS` and `$KAFKAZKHOSTS` for each by running step 4 from this section in each SSH session. An easier solution is to use the `tmux` utility, which can split the current SSH display into multiple sections. To start the stream, producer, and consumer using `tmux`, use the following command:

    ```bash
    tmux new-session '/usr/hdp/current/kafka-broker/bin/kafka-console-consumer.sh --bootstrap-server $KAFKABROKERS --topic wordcounts --formatter kafka.tools.DefaultMessageFormatter --property print.key=true --property key.deserializer=org.apache.kafka.common.serialization.StringDeserializer --property value.deserializer=org.apache.kafka.common.serialization.LongDeserializer' \; split-window -h 'java -jar kafka-streaming.jar $KAFKABROKERS $KAFKAZKHOSTS' \; split-window -v '/usr/hdp/current/kafka-broker/bin/kafka-console-producer.sh --broker-list $KAFKABROKERS --topic test' \; attach
    ```

    This command splits the SSH display into three sections:

    * The left section runs a console consumer, which reads messages from the `wordcounts` topic: `/usr/hdp/current/kafka-broker/bin/kafka-console-consumer.sh --bootstrap-server $KAFKABROKERS --topic wordcounts --formatter kafka.tools.DefaultMessageFormatter --property print.key=true --property key.deserializer=org.apache.kafka.common.serialization.StringDeserializer --property value.deserializer=org.apache.kafka.common.serialization.LongDeserializer`

        > [!NOTE]
        > The `--property` parameters tell the console consumer to print the key (word) along with the count (value). This parameter also configures the deserializer to use when reading these values from Kafka.

    * The top right section runs the Streams API solution: `java -jar kafka-streaming.jar $KAFKABROKERS $KAFKAZKHOSTS`

    * The lower right section runs the console producer, and waits on you to enter messages to send to the `test` topic: `/usr/hdp/current/kafka-broker/bin/kafka-console-producer.sh --broker-list $KAFKABROKERS --topic test`
 
6. After the `tmux` command splits the display, your cursor is in the lower right section. Start entering sentences. After each sentence, the left pane is updated to show a count of unique words. The output is similar to the following text:
   
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
   
    > [!NOTE]
    > The count increments each time a word is encountered.

7. Use the __Ctrl + C__ to exit the producer. Continue using __Ctrl + C__ to exit the application and the consumer.

## Next steps

In this document, you learned how to use the Kafka Streams API with Kafka on HDInsight. Use the following to learn more about working with Kafka:

* [Analyze Kafka logs](apache-kafka-log-analytics-operations-management.md)
* [Replicate data between Kafka clusters](apache-kafka-mirroring.md)
* [Kafka Producer and Consumer API with HDInsight](apache-kafka-producer-consumer-api.md)
* [Use Apache Spark streaming (DStream) with Kafka on HDInsight](../hdinsight-apache-spark-with-kafka.md)
* [Use Apache Spark Structured Streaming with Kafka on HDInsight](../hdinsight-apache-kafka-spark-structured-streaming.md)
* [Use Apache Spark Structured Streaming to move data from Kafka on HDInsight to Cosmos DB](../apache-kafka-spark-structured-streaming-cosmosdb.md)
* [Use Apache Storm with Kafka on HDInsight](../hdinsight-apache-storm-with-kafka.md)
* [Connect to Kafka through an Azure Virtual Network](apache-kafka-connect-vpn-gateway.md)

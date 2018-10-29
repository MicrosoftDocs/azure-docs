---
title: 'Tutorial: Use the Apache Kafka Streams API - Azure HDInsight '
description: Learn how to use the Apache Kafka Streams API with Kafka on HDInsight. This API enables you to perform stream processing between topics in Kafka.
services: hdinsight
ms.service: hdinsight
author: jasonwhowell
ms.author: jasonh
ms.reviewer: jasonh
ms.custom: hdinsightactive
ms.topic: tutorial
ms.date: 04/17/2018
#Customer intent: As a developer, I need to create an application that uses the Kafka streams API with Kafka on HDInsight
---

# Tutorial: Apache Kafka streams API

Learn how to create an application that uses the Kafka Streams API and run it with Kafka on HDInsight. 

The application used in this tutorial is a streaming word count. It reads text data from a Kafka topic, extracts individual words, and then stores the word and count into another Kafka topic.

> [!NOTE]
> Kafka stream processing is often done using Apache Spark or Storm. Kafka version 0.10.0 (in HDInsight 3.5 and 3.6) introduced the Kafka Streams API. This API allows you to transform data streams between input and output topics. In some cases, this may be an alternative to creating a Spark or Storm streaming solution. 
>
> For more information on Kafka Streams, see the [Intro to Streams](https://kafka.apache.org/10/documentation/streams/) documentation on Apache.org.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Set up your development environment
> * Understand the code
> * Build and deploy the application
> * Configure Kafka topics
> * Run the code

## Prerequisites

* A Kafka on HDInsight 3.6 cluster. To learn how to create a Kafka on HDInsight cluster, see the [Start with Kafka on HDInsight](apache-kafka-get-started.md) document.

* Complete the steps in the [Kafka Consumer and Producer API](apache-kafka-producer-consumer-api.md) document. The steps in this document use the example application and topics created in this tutorial.

## Set up your development environment

You must have the following components installed in your development environment:

* [Java JDK 8](http://www.oracle.com/technetwork/java/javase/downloads/index.html) or an equivalent, such as OpenJDK.

* [Apache Maven](http://maven.apache.org/)

* An SSH client and the `scp` command. For more information, see the [Use SSH with HDInsight](../hdinsight-hadoop-linux-use-ssh-unix.md) document.

## Understand the code

The example application is located at [https://github.com/Azure-Samples/hdinsight-kafka-java-get-started](https://github.com/Azure-Samples/hdinsight-kafka-java-get-started), in the `Streaming` subdirectory. The application consists of two files:

* `pom.xml`: This file defines the project dependencies, Java version, and packaging methods.
* `Stream.java`: This file implements the streaming logic.

### Pom.xml

The important things to understand in the `pom.xml` file are:

* Dependencies: This project relies on the Kafka Streams API, which is provided by the `kafka-clients` package. The following XML code defines this dependency:

    ```xml
    <!-- Kafka client for producer/consumer operations -->
    <dependency>
      <groupId>org.apache.kafka</groupId>
      <artifactId>kafka-clients</artifactId>
      <version>${kafka.version}</version>
    </dependency>
    ```

    > [!NOTE]
    > The `${kafka.version}` entry is declared in the `<properties>..</properties>` section of `pom.xml`, and is configured to the Kafka version of the HDInsight cluster.

* Plugins: Maven plugins provide various capabilities. In this project, the following plugins are used:

    * `maven-compiler-plugin`: Used to set the Java version used by the project to 8. Java 8 is required by HDInsight 3.6.
    * `maven-shade-plugin`: Used to generate an uber jar that contains this application as well as any dependencies. It is also used to set the entry point of the application, so that you can directly run the Jar file without having to specify the main class.

### Stream.java

The `Stream.java` file uses the Streams API to implement a word count application. It reads data from a Kafka topic named `test` and writes the word counts into a topic named `wordcounts`.

The following code defines the word count application:

```java
package com.microsoft.example;

import org.apache.kafka.common.serialization.Serde;
import org.apache.kafka.common.serialization.Serdes;
import org.apache.kafka.streams.KafkaStreams;
import org.apache.kafka.streams.KeyValue;
import org.apache.kafka.streams.StreamsConfig;
import org.apache.kafka.streams.kstream.KStream;
import org.apache.kafka.streams.kstream.KStreamBuilder;

import java.util.Arrays;
import java.util.Properties;

public class Stream
{
    public static void main( String[] args ) {
        Properties streamsConfig = new Properties();
        // The name must be unique on the Kafka cluster
        streamsConfig.put(StreamsConfig.APPLICATION_ID_CONFIG, "wordcount-example");
        // Brokers
        streamsConfig.put(StreamsConfig.BOOTSTRAP_SERVERS_CONFIG, args[0]);
        // SerDes for key and values
        streamsConfig.put(StreamsConfig.KEY_SERDE_CLASS_CONFIG, Serdes.String().getClass().getName());
        streamsConfig.put(StreamsConfig.VALUE_SERDE_CLASS_CONFIG, Serdes.String().getClass().getName());

        // Serdes for the word and count
        Serde<String> stringSerde = Serdes.String();
        Serde<Long> longSerde = Serdes.Long();

        KStreamBuilder builder = new KStreamBuilder();
        KStream<String, String> sentences = builder.stream(stringSerde, stringSerde, "test");
        KStream<String, Long> wordCounts = sentences
                .flatMapValues(value -> Arrays.asList(value.toLowerCase().split("\\W+")))
                .map((key, word) -> new KeyValue<>(word, word))
                .countByKey("Counts")
                .toStream();
        wordCounts.to(stringSerde, longSerde, "wordcounts");

        KafkaStreams streams = new KafkaStreams(builder, streamsConfig);
        streams.start();

        Runtime.getRuntime().addShutdownHook(new Thread(streams::close));
    }
}
```


## Build and deploy the example

To build and deploy the project to your Kafka on HDInsight cluster, use the following steps:

1. Download the examples from [https://github.com/Azure-Samples/hdinsight-kafka-java-get-started](https://github.com/Azure-Samples/hdinsight-kafka-java-get-started).

2. Change directories to the `Streaming` directory, and then use the following command to create a jar package:

    ```bash
    mvn clean package
    ```

    This command creates the package at `target/kafka-streaming-1.0-SNAPSHOT.jar`.

3. Use the following command to copy the `kafka-streaming-1.0-SNAPSHOT.jar` file to your HDInsight cluster:
   
    ```bash
    scp ./target/kafka-streaming-1.0-SNAPSHOT.jar sshuser@clustername-ssh.azurehdinsight.net:kafka-streaming.jar
    ```
   
    Replace `sshuser` with the SSH user for your cluster, and replace `clustername` with the name of your cluster. If prompted, enter the password for the SSH user account. For more information on using `scp` with HDInsight, see [Use SSH with HDInsight](../hdinsight-hadoop-linux-use-ssh-unix.md).

## Create Kafka topics

1. To open an SSH connection to the cluster, use the following command:

    ```bash
    ssh sshuser@clustername-ssh.azurehdinsight.net
    ```

    Replace `sshuser` with the SSH user for your cluster, and replace `clustername` with the name of your cluster. If prompted, enter the password for the SSH user account. For more information on using `scp` with HDInsight, see [Use SSH with HDInsight](../hdinsight-hadoop-linux-use-ssh-unix.md).

2. To save the cluster name to a variable and install a JSON parsing utility (`jq`), use the following commands. When prompted, enter the Kafka cluster name:

    ```bash
    sudo apt -y install jq
    read -p 'Enter your Kafka cluster name:' CLUSTERNAME
    ```

3. To get the Kafka broker hosts and the Zookeeper hosts, use the following commands. When prompted, enter the password for the cluster login (admin) account. You are prompted for the password twice.

    ```bash
    export KAFKAZKHOSTS=`curl -sS -u admin -G https://$CLUSTERNAME.azurehdinsight.net/api/v1/clusters/$CLUSTERNAME/services/ZOOKEEPER/components/ZOOKEEPER_SERVER | jq -r '["\(.host_components[].HostRoles.host_name):2181"] | join(",")' | cut -d',' -f1,2`; \
    export KAFKABROKERS=`curl -sS -u admin -G https://$CLUSTERNAME.azurehdinsight.net/api/v1/clusters/$CLUSTERNAME/services/KAFKA/components/KAFKA_BROKER | jq -r '["\(.host_components[].HostRoles.host_name):9092"] | join(",")' | cut -d',' -f1,2`; \
    ```

4. To create the topics used by the streaming operation, use the following commands:

    > [!NOTE]
    > You may receive an error that the `test` topic already exists. This is OK, as it may have been created in the Producer and Consumer API tutorial.

    ```bash
    /usr/hdp/current/kafka-broker/bin/kafka-topics.sh --create --replication-factor 3 --partitions 8 --topic test --zookeeper $KAFKAZKHOSTS

    /usr/hdp/current/kafka-broker/bin/kafka-topics.sh --create --replication-factor 3 --partitions 8 --topic wordcounts --zookeeper $KAFKAZKHOSTS

    /usr/hdp/current/kafka-broker/bin/kafka-topics.sh --create --replication-factor 3 --partitions 8 --topic RekeyedIntermediateTopic --zookeeper $KAFKAZKHOSTS

    /usr/hdp/current/kafka-broker/bin/kafka-topics.sh --create --replication-factor 3 --partitions 8 --topic wordcount-example-Counts-changelog --zookeeper $KAFKAZKHOSTS
    ```

    The topics are used for the following purposes:

    * `test`: This topic is where records are received. The streaming application reads from here.
    * `wordcounts`: This topic is where the streaming application stores its output.
    * `RekeyedIntermediateTopic`: This topic is used to repartition data as the count is updated by the `countByKey` operator.
    * `wordcount-example-Counts-changelog`: This topic is a state store used by the `countByKey` operation

    > [!IMPORTANT]
    > Kafka on HDInsight can also be configured to automatically create topics. For more information, see the [Configure automatic topic creation](apache-kafka-auto-create-topics.md) document.

## Run the code

1. To start the streaming application as a background process, use the following command:

    ```bash
    java -jar kafka-streaming.jar $KAFKABROKERS $KAFKAZKHOSTS &
    ```

    > [!NOTE]
    > You may get a warning about log4j. You can ignore this.

2. To send records to the `test` topic, use the following command to start the producer application:

    ```bash
    java -jar kafka-producer-consumer.jar producer test $KAFKABROKERS
    ```

3. Once the producer completes, use the following command to view the information stored in the `wordcounts` topic:

    ```bash
    /usr/hdp/current/kafka-broker/bin/kafka-console-consumer.sh --bootstrap-server $KAFKABROKERS --topic wordcounts --formatter kafka.tools.DefaultMessageFormatter --property print.key=true --property key.deserializer=org.apache.kafka.common.serialization.StringDeserializer --property value.deserializer=org.apache.kafka.common.serialization.LongDeserializer --from-beginning
    ```

    > [!NOTE]
    > The `--property` parameters tell the console consumer to print the key (word) along with the count (value). This parameter also configures the deserializer to use when reading these values from Kafka.

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
   
    > [!NOTE]
    > The parameter `--from-beginning` configures the consumer to start at the beginning of the records stored in the topic. The count increments each time a word is encountered, so the topic contains multiple entries for each word, with an increasing count.

7. Use the __Ctrl + C__ to exit the producer. Continue using __Ctrl + C__ to exit the application and the consumer.

## Next steps

In this document, you learned how to use the Kafka Streams API with Kafka on HDInsight. Use the following to learn more about working with Kafka:

* [Analyze Kafka logs](apache-kafka-log-analytics-operations-management.md)
* [Replicate data between Kafka clusters](apache-kafka-mirroring.md)

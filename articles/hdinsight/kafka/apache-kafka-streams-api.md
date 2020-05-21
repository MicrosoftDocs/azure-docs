---
title: 'Tutorial: Use the Apache Kafka Streams API - Azure HDInsight '
description: Tutorial - Learn how to use the Apache Kafka Streams API with Kafka on HDInsight. This API enables you to perform stream processing between topics in Kafka.
author: hrasheed-msft
ms.author: hrasheed
ms.reviewer: jasonh
ms.service: hdinsight
ms.topic: tutorial
ms.custom: hdinsightactive
ms.date: 03/20/2020
#Customer intent: As a developer, I need to create an application that uses the Kafka streams API with Kafka on HDInsight
---

# Tutorial: Use Apache Kafka streams API in Azure HDInsight

Learn how to create an application that uses the Apache Kafka Streams API and run it with Kafka on HDInsight.

The application used in this tutorial is a streaming word count. It reads text data from a Kafka topic, extracts individual words, and then stores the word and count into another Kafka topic.

Kafka stream processing is often done using Apache Spark or Apache Storm. Kafka version 1.1.0 (in HDInsight 3.5 and 3.6) introduced the Kafka Streams API. This API allows you to transform data streams between input and output topics. In some cases, this may be an alternative to creating a Spark or Storm streaming solution.

For more information on Kafka Streams, see the [Intro to Streams](https://kafka.apache.org/10/documentation/streams/) documentation on Apache.org.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Understand the code
> * Build and deploy the application
> * Configure Kafka topics
> * Run the code

## Prerequisites

* A Kafka on HDInsight 3.6 cluster. To learn how to create a Kafka on HDInsight cluster, see the [Start with Apache Kafka on HDInsight](apache-kafka-get-started.md) document.

* Complete the steps in the [Apache Kafka Consumer and Producer API](apache-kafka-producer-consumer-api.md) document. The steps in this document use the example application and topics created in this tutorial.

* [Java Developer Kit (JDK) version 8](https://aka.ms/azure-jdks) or an equivalent, such as OpenJDK.

* [Apache Maven](https://maven.apache.org/download.cgi) properly [installed](https://maven.apache.org/install.html) according to Apache.  Maven is a project build system for Java projects.

* An SSH client. For more information, see [Connect to HDInsight (Apache Hadoop) using SSH](../hdinsight-hadoop-linux-use-ssh-unix.md).

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

    The `${kafka.version}` entry is declared in the `<properties>..</properties>` section of `pom.xml`, and is configured to the Kafka version of the HDInsight cluster.

* Plugins: Maven plugins provide various capabilities. In this project, the following plugins are used:

    * `maven-compiler-plugin`: Used to set the Java version used by the project to 8. Java 8 is required by HDInsight 3.6.
    * `maven-shade-plugin`: Used to generate an uber jar that contains this application, and any dependencies. It's also used to set the entry point of the application, so that you can directly run the Jar file without having to specify the main class.

### Stream.java

The [Stream.java](https://github.com/Azure-Samples/hdinsight-kafka-java-get-started/blob/master/Streaming/src/main/java/com/microsoft/example/Stream.java) file uses the Streams API to implement a word count application. It reads data from a Kafka topic named `test` and writes the word counts into a topic named `wordcounts`.

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

1. Set your current directory to the location of the `hdinsight-kafka-java-get-started-master\Streaming` directory, and then use the following command to create a jar package:

    ```cmd
    mvn clean package
    ```

    This command creates the package at `target/kafka-streaming-1.0-SNAPSHOT.jar`.

2. Replace `sshuser` with the SSH user for your cluster, and replace `clustername` with the name of your cluster. Use the following command to copy the `kafka-streaming-1.0-SNAPSHOT.jar` file to your HDInsight cluster. If prompted, enter the password for the SSH user account.

    ```cmd
    scp ./target/kafka-streaming-1.0-SNAPSHOT.jar sshuser@clustername-ssh.azurehdinsight.net:kafka-streaming.jar
    ```

## Create Apache Kafka topics

1. Replace `sshuser` with the SSH user for your cluster, and replace `CLUSTERNAME` with the name of your cluster. Open an SSH connection to the cluster, by entering the following command. If prompted, enter the password for the SSH user account.

    ```bash
    ssh sshuser@CLUSTERNAME-ssh.azurehdinsight.net
    ```

2. Install [jq](https://stedolan.github.io/jq/), a command-line JSON processor. From the open SSH connection, enter following command to install `jq`:

    ```bash
    sudo apt -y install jq
    ```

3. Set up password variable. Replace `PASSWORD` with the cluster login password, then enter the command:

    ```bash
    export password='PASSWORD'
    ```

4. Extract correctly cased cluster name. The actual casing of the cluster name may be different than you expect, depending on how the cluster was created. This command will obtain the actual casing, and then store it in a variable. Enter the following command:

    ```bash
    export clusterName=$(curl -u admin:$password -sS -G "http://headnodehost:8080/api/v1/clusters" | jq -r '.items[].Clusters.cluster_name')
    ```

    > [!Note]  
    > If you're doing this process from outside the cluster, there is a different procedure for storing the cluster name. Get the cluster name in lower case from the Azure portal. Then, substitute the cluster name for `<clustername>` in the following command and execute it: `export clusterName='<clustername>'`.  

5. To get the Kafka broker hosts and the Apache Zookeeper hosts, use the following commands. When prompted, enter the password for the cluster login (admin) account.

    ```bash
    export KAFKAZKHOSTS=$(curl -sS -u admin:$password -G https://$clusterName.azurehdinsight.net/api/v1/clusters/$clusterName/services/ZOOKEEPER/components/ZOOKEEPER_SERVER | jq -r '["\(.host_components[].HostRoles.host_name):2181"] | join(",")' | cut -d',' -f1,2);

    export KAFKABROKERS=$(curl -sS -u admin:$password -G https://$clusterName.azurehdinsight.net/api/v1/clusters/$clusterName/services/KAFKA/components/KAFKA_BROKER | jq -r '["\(.host_components[].HostRoles.host_name):9092"] | join(",")' | cut -d',' -f1,2);
    ```

    > [!Note]  
    > These commands require Ambari access. If your cluster is behind an NSG, run these commands from a machine that can access Ambari.

6. To create the topics used by the streaming operation, use the following commands:

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

    Kafka on HDInsight can also be configured to automatically create topics. For more information, see the [Configure automatic topic creation](apache-kafka-auto-create-topics.md) document.

## Run the code

1. To start the streaming application as a background process, use the following command:

    ```bash
    java -jar kafka-streaming.jar $KAFKABROKERS $KAFKAZKHOSTS &
    ```

    You may get a warning about Apache log4j. You can ignore this.

2. To send records to the `test` topic, use the following command to start the producer application:

    ```bash
    java -jar kafka-producer-consumer.jar producer test $KAFKABROKERS
    ```

3. Once the producer completes, use the following command to view the information stored in the `wordcounts` topic:

    ```bash
    /usr/hdp/current/kafka-broker/bin/kafka-console-consumer.sh --bootstrap-server $KAFKABROKERS --topic wordcounts --formatter kafka.tools.DefaultMessageFormatter --property print.key=true --property key.deserializer=org.apache.kafka.common.serialization.StringDeserializer --property value.deserializer=org.apache.kafka.common.serialization.LongDeserializer --from-beginning
    ```

    The `--property` parameters tell the console consumer to print the key (word) along with the count (value). This parameter also configures the deserializer to use when reading these values from Kafka.

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
   
    The parameter `--from-beginning` configures the consumer to start at the beginning of the records stored in the topic. The count increments each time a word is encountered, so the topic contains multiple entries for each word, with an increasing count.

4. Use the __Ctrl + C__ to exit the producer. Continue using __Ctrl + C__ to exit the application and the consumer.

5. To delete the topics used by the streaming operation, use the following commands:

    ```bash
    /usr/hdp/current/kafka-broker/bin/kafka-topics.sh --delete --topic test --zookeeper $KAFKAZKHOSTS
    /usr/hdp/current/kafka-broker/bin/kafka-topics.sh --delete --topic wordcounts --zookeeper $KAFKAZKHOSTS
    /usr/hdp/current/kafka-broker/bin/kafka-topics.sh --delete --topic RekeyedIntermediateTopic --zookeeper $KAFKAZKHOSTS
    /usr/hdp/current/kafka-broker/bin/kafka-topics.sh --delete --topic wordcount-example-Counts-changelog --zookeeper $KAFKAZKHOSTS
    ```

## Clean up resources

To clean up the resources created by this tutorial, you can delete the resource group. Deleting the resource group also deletes the associated HDInsight cluster, and any other resources associated with the resource group.

To remove the resource group using the Azure portal:

1. In the Azure portal, expand the menu on the left side to open the menu of services, and then choose __Resource Groups__ to display the list of your resource groups.
2. Locate the resource group to delete, and then right-click the __More__ button (...) on the right side of the listing.
3. Select __Delete resource group__, and then confirm.

## Next steps

In this document, you learned how to use the Apache Kafka Streams API with Kafka on HDInsight. Use the following to learn more about working with Kafka.

> [!div class="nextstepaction"]
> [Analyze Apache Kafka logs](apache-kafka-log-analytics-operations-management.md)

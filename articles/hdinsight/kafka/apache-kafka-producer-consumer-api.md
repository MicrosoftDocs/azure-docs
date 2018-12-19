---
title: 'Tutorial: Use the Apache Kafka Producer and Consumer APIs - Azure HDInsight '
description: Learn how to use the Apache Kafka Producer and Consumer APIs with Kafka on HDInsight. In this tutorial, you learn how to use these APIs with Kafka on HDInsight from a Java application.
services: hdinsight
author: dhgoelmsft
ms.author: dhgoel
ms.reviewer: jasonh
ms.service: hdinsight
ms.custom: hdinsightactive
ms.topic: tutorial
ms.date: 11/06/2018
#Customer intent: As a developer, I need to create an application that uses the Kafka consumer/producer API with Kafka on HDInsight
---

# Tutorial: Use the Apache Kafka Producer and Consumer APIs

Learn how to use the Apache Kafka Producer and Consumer APIs with Kafka on HDInsight.

The Kafka Producer API allows applications to send streams of data to the Kafka cluster. The Kafka Consumer API allows applications to read streams of data from the cluster.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Set up your development environment
> * Set up your deployment environment
> * Understand the code
> * Build and deploy the application
> * Run the application on the cluster

For more information on the APIs, see Apache documentation on the [Producer API](https://kafka.apache.org/documentation/#producerapi) and [Consumer API](https://kafka.apache.org/documentation/#consumerapi).

## Set up your development environment

You must have the following components installed in your development environment:

* [Java JDK 8](https://aka.ms/azure-jdks) or an equivalent, such as OpenJDK.

* [Apache Maven](http://maven.apache.org/)

* An SSH client and the `scp` command. For more information, see the [Use SSH with HDInsight](../hdinsight-hadoop-linux-use-ssh-unix.md) document.

* A text editor or Java IDE.

The following environment variables may be set when you install Java and the JDK on your development workstation. However, you should check that they exist and that they contain the correct values for your system.

* `JAVA_HOME` - should point to the directory where the JDK is installed.
* `PATH` - should contain the following paths:
  
    * `JAVA_HOME` (or the equivalent path).
    * `JAVA_HOME\bin` (or the equivalent path).
    * The directory where Maven is installed.

## Set up your deployment environment

This tutorial requires Apache Kafka on HDInsight 3.6. To learn how to create a Kafka on HDInsight cluster, see the [Start with Apache Kafka on HDInsight](apache-kafka-get-started.md) document.

## Understand the code

The example application is located at [https://github.com/Azure-Samples/hdinsight-kafka-java-get-started](https://github.com/Azure-Samples/hdinsight-kafka-java-get-started), in the `Producer-Consumer` subdirectory. The application consists primarily of four files:

* `pom.xml`: This file defines the project dependencies, Java version, and packaging methods.
* `Producer.java`: This file sends random sentences to Kafka using the producer API.
* `Consumer.java`: This file uses the consumer API to read data from Kafka and emit it to STDOUT.
* `Run.java`: The command-line interface used to run the producer and consumer code.

### Pom.xml

The important things to understand in the `pom.xml` file are:

* Dependencies: This project relies on the Kafka producer and consumer APIs, which are provided by the `kafka-clients` package. The following XML code defines this dependency:

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

    * `maven-compiler-plugin`: Used to set the Java version used by the project to 8. This is the version of Java used by HDInsight 3.6.
    * `maven-shade-plugin`: Used to generate an uber jar that contains this application as well as any dependencies. It is also used to set the entry point of the application, so that you can directly run the Jar file without having to specify the main class.

### Producer.java

The producer communicates with the Kafka broker hosts (worker nodes) and sends data to a Kafka topic. The following code snippet from is from the [Producer.java](https://github.com/Azure-Samples/hdinsight-kafka-java-get-started/blob/master/Producer-Consumer/src/main/java/com/microsoft/example/Producer.java) file from the [github repository](https://github.com/Azure-Samples/hdinsight-kafka-java-get-started) and shows how to set the producer properties:

```java
Properties properties = new Properties();
// Set the brokers (bootstrap servers)
properties.setProperty("bootstrap.servers", brokers);
// Set how to serialize key/value pairs
properties.setProperty("key.serializer","org.apache.kafka.common.serialization.StringSerializer");
properties.setProperty("value.serializer","org.apache.kafka.common.serialization.StringSerializer");
KafkaProducer<String, String> producer = new KafkaProducer<>(properties);
```

### Consumer.java

The consumer communicates with the Kafka broker hosts (worker nodes), and reads records in a loop. The following code snippet from the [Consumer.java](https://github.com/Azure-Samples/hdinsight-kafka-java-get-started/blob/master/Producer-Consumer/src/main/java/com/microsoft/example/Consumer.java) file sets the consumer properties:

```java
KafkaConsumer<String, String> consumer;
// Configure the consumer
Properties properties = new Properties();
// Point it to the brokers
properties.setProperty("bootstrap.servers", brokers);
// Set the consumer group (all consumers must belong to a group).
properties.setProperty("group.id", groupId);
// Set how to serialize key/value pairs
properties.setProperty("key.deserializer","org.apache.kafka.common.serialization.StringDeserializer");
properties.setProperty("value.deserializer","org.apache.kafka.common.serialization.StringDeserializer");
// When a group is first created, it has no offset stored to start reading from. This tells it to start
// with the earliest record in the stream.
properties.setProperty("auto.offset.reset","earliest");

consumer = new KafkaConsumer<>(properties);
```

In this code, the consumer is configured to read from the start of the topic (`auto.offset.reset` is set to `earliest`.)

### Run.java

The [Run.java](https://github.com/Azure-Samples/hdinsight-kafka-java-get-started/blob/master/Producer-Consumer/src/main/java/com/microsoft/example/Run.java) file provides a command line interface that runs either the producer or consumer code. You must provide the Kafka broker host information as a parameter. You can optionally include a group id value, which is used by the consumer process. If you create multiple consumer instances using the same group id, they will load balance reading from the topic.

## Build and deploy the example

1. Download the examples from [https://github.com/Azure-Samples/hdinsight-kafka-java-get-started](https://github.com/Azure-Samples/hdinsight-kafka-java-get-started).

2. Change directories to the location of the `Producer-Consumer` directory and use the following command:

    ```
    mvn clean package
    ```

    This command creates a directory named `target`, that contains a file named `kafka-producer-consumer-1.0-SNAPSHOT.jar`.

3. Use the following commands to copy the `kafka-producer-consumer-1.0-SNAPSHOT.jar` file to your HDInsight cluster:
   
    ```bash
    scp ./target/kafka-producer-consumer-1.0-SNAPSHOT.jar SSHUSER@CLUSTERNAME-ssh.azurehdinsight.net:kafka-producer-consumer.jar
    ```
   
    Replace **SSHUSER** with the SSH user for your cluster, and replace **CLUSTERNAME** with the name of your cluster. When prompted enter the password for the SSH user.

## <a id="run"></a> Run the example

1. To open an SSH connection to the cluster, use the following command:

    ```bash
    ssh SSHUSER@CLUSTERNAME-ssh.azurehdinsight.net
    ```

    Replace **SSHUSER** with the SSH user for your cluster, and replace **CLUSTERNAME** with the name of your cluster. If prompted, enter the password for the SSH user account. For more information on using `scp` with HDInsight, see [Use SSH with HDInsight](../hdinsight-hadoop-linux-use-ssh-unix.md).

2. To create the Kafka topics that are used by this example, use the following steps:

    1. To save the cluster name to a variable and install a JSON parsing utility (`jq`), use the following commands. When prompted, enter the Kafka cluster name:
    
        ```bash
        sudo apt -y install jq
        read -p 'Enter your Kafka cluster name:' CLUSTERNAME
        ```
    
    2. To get the Kafka broker hosts and the Apache Zookeeper hosts, use the following commands. When prompted, enter the password for the cluster login (admin) account.
    
        ```bash
        export KAFKABROKERS=`curl -sS -u admin -G https://$CLUSTERNAME.azurehdinsight.net/api/v1/clusters/$CLUSTERNAME/services/KAFKA/components/KAFKA_BROKER | jq -r '["\(.host_components[].HostRoles.host_name):9092"] | join(",")' | cut -d',' -f1,2`; \
        ```

    3. To create the `test` topic, use the following command:

        ```bash
        java -jar kafka-producer-consumer.jar create test $KAFKABROKERS
        ```

3. To run the producer and write data to the topic, use the following command:

    ```bash
    java -jar kafka-producer-consumer.jar producer test $KAFKABROKERS
    ```

4. Once the producer has finished, use the following command to read from the topic:
   
    ```bash
    java -jar kafka-producer-consumer.jar consumer test $KAFKABROKERS
    ```
   
    The records read, along with a count of records, is displayed.

5. Use __Ctrl + C__ to exit the consumer.

### Multiple consumers

Kafka consumers use a consumer group when reading records. Using the same group with multiple consumers results in load balanced reads from a topic. Each consumer in the group receives a portion of the records.

The consumer application accepts a parameter that is used as the group ID. For example, the following command starts a consumer using a group ID of `mygroup`:
   
```bash
java -jar kafka-producer-consumer.jar consumer test $KAFKABROKERS mygroup
```

To see this process in action, use the following command:

```bash
tmux new-session 'java -jar kafka-producer-consumer.jar consumer test $KAFKABROKERS mygroup' \; split-w
indow -h 'java -jar kafka-producer-consumer.jar consumer test $KAFKABROKERS mygroup' \; attach
```

This command uses `tmux` to split the terminal into two columns. A consumer is started in each column, with the same group ID value. Once the consumers finish reading, notice that each read only a portion of the records. Use __Ctrl + C __ twice to exit `tmux`.

Consumption by clients within the same group is handled through the partitions for the topic. In this code sample, the `test` topic created earlier has eight partitions. If you start eight consumers, each consumer reads records from a single partition for the topic.

> [!IMPORTANT]
> There cannot be more consumer instances in a consumer group than partitions. In this example, one consumer group can contain up to eight consumers since that is the number of partitions in the topic. Or you can have multiple consumer groups, each with no more than eight consumers.

Records stored in Kafka are stored in the order they are received within a partition. To achieve in-ordered delivery for records *within a partition*, create a consumer group where the number of consumer instances matches the number of partitions. To achieve in-ordered delivery for records *within the topic*, create a consumer group with only one consumer instance.

## Next steps

In this document, you learned how to use the Apache Kafka Producer and Consumer API with Kafka on HDInsight. Use the following to learn more about working with Kafka:

* [Analyze Apache Kafka logs](apache-kafka-log-analytics-operations-management.md)
* [Replicate data between Apache Kafka clusters](apache-kafka-mirroring.md)
* [Apache Kafka Streams API with HDInsight](apache-kafka-streams-api.md)

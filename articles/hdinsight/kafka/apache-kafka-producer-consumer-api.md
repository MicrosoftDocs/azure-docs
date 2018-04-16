---
title: Use the Apache Kafka Producer and Consumer APIs - Azure HDInsight | Microsoft Docs
description: Learn how to use the Apache Kafka Producer and Consumer APIs with Kafka on HDInsight. These APIs enable you to develop applications that write to and read from Apache Kafka.
services: hdinsight
documentationcenter: ''
author: Blackmist
manager: cgronlun
editor: cgronlun
tags: azure-portal

ms.service: hdinsight
ms.custom: hdinsightactive
ms.devlang: na
ms.topic: tutorial
ms.date: 04/10/2018
ms.author: larryfr
#Customer intent: As a developer, I need to create an application that uses the Kafka consumer/producer API with Kafka on HDInsight
---

# Apache Kafka Producer and Consumer APIs

Learn how to use the Kafka Producer and Consumer APIs with Kafka on HDInsight.

The Kafka Producer API allows applications to send streams of data to the Kafka cluster. The Kafka Consumer API allows applications to read streams of data from the cluster.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Set up your development environment
> * Understand the code
> * Build and deploy the application
> * Run the application on the cluster

For more information on the APIs, see Apache documentation on the [Producer API](https://kafka.apache.org/documentation/#producerapi) and [Consumer API](https://kafka.apache.org/documentation/#consumerapi).

## Set up your development environment

You must have the following components installed in your development environment:

* [Java JDK 8](http://www.oracle.com/technetwork/java/javase/downloads/index.html) or an equivalent, such as OpenJDK.

* [Apache Maven](http://maven.apache.org/)

* An SSH client and the `scp` command. For more information, see the [Use SSH with HDInsight](../hdinsight-hadoop-linux-use-ssh-unix.md) document.

* A text editor or Java IDE.

The following environment variables may be set when you install Java and the JDK on your development workstation. However, you should check that they exist and that they contain the correct values for your system.

* `JAVA_HOME` - should point to the directory where the JDK is installed.
* `PATH` - should contain the following paths:
  
    * `JAVA_HOME` (or the equivalent path).
    * `JAVA_HOME\bin` (or the equivalent path).
    * The directory where Maven is installed.

## Understand the code

The example application is located at [https://github.com/Azure-Samples/hdinsight-kafka-java-get-started](https://github.com/Azure-Samples/hdinsight-kafka-java-get-started), in the `Producer-Consumer` subdirectory. The application consists primarily of four files:

* `pom.xml`: This file defines the project dependencies, Java version, and packaging methods.
* `Producer.java`: This file sends 1 million (1,000,000) random sentences to Kafka using the producer API.
* `Consumer.java`: This file uses the consumer API to read data from Kafka and emit it to STDOUT.
* `Run.java`: The command-line interface used to run the producer and consumer code.

### Pom.xml

The important things to understand in the `pom.xml` file are:

* Dependencies: This project relies on the Kafka producer and consumer APIs, which are provided by the `kafka-clients` project. The following XML code defines this dependency:

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

2. To create the Kafka topics that are used by this example, use the following commands:

    ```bash
    sudo apt -y install jq

    CLUSTERNAME='your cluster name'

    export KAFKAZKHOSTS=`curl -sS -u admin -G https://$CLUSTERNAME.azurehdinsight.net/api/v1/clusters/$CLUSTERNAME/services/ZOOKEEPER/components/ZOOKEEPER_SERVER | jq -r '["\(.host_components[].HostRoles.host_name):2181"] | join(",")' | cut -d',' -f1,2`

    export KAFKABROKERS=`curl -sS -u admin -G https://$CLUSTERNAME.azurehdinsight.net/api/v1/clusters/$CLUSTERNAME/services/KAFKA/components/KAFKA_BROKER | jq -r '["\(.host_components[].HostRoles.host_name):9092"] | join(",")' | cut -d',' -f1,2`

    /usr/hdp/current/kafka-broker/bin/kafka-topics.sh --create --replication-factor 3 --partitions 8 --topic test --zookeeper $KAFKAZKHOSTS
    ```

    Replace __your cluster name__ with the name of your HDInsight cluster. When prompted, enter the password for the HDInsight cluster login account.

    > [!NOTE]
    > If your cluster login is different than the default value of `admin`, replace the `admin` value in the previous commands with your cluster login name.

3. To run the producer and write data to the topic, use the following command:

    ```bash
    java -jar kafka-producer-consumer.jar producer $KAFKABROKERS
    ```

4. Once the producer has finished, use the following command to read from the topic:
   
    ```bash
    java -jar kafka-producer-consumer.jar consumer $KAFKABROKERS
    ```
   
    The records read, along with a count of records, is displayed.

5. Use __Ctrl + C__ to exit the consumer.

### Multiple consumers

Kafka consumers use a consumer group when reading records. Using the same group with multiple consumers results in load balanced reads from a topic. Each consumer in the group receives a portion of the records.

The consumer application accepts a parameter that is used as the group ID. For example, the following command starts a consumer using a group ID of `mygroup`:
   
```bash
java -jar kafka-producer-consumer.jar consumer $KAFKABROKERS mygroup
```

To see this process in action, use the following steps

1. Repeat steps 1 and 2 in the [Run the example](#run) section to open a new SSH session.

2. In both SSH sessions, enter the following command:

    ```bash
    java -jar kafka-producer-consumer.jar consumer $KAFKABROKERS mygroup
    ```
    
    > [!IMPORTANT]
    > Enter both commands simultaneously, so that they are both running at the same time.

    Notice that the count of messages read is not the same as the previous section, where you had only one consumer. Instead, the messages read is split between the instances.

Consumption by clients within the same group is handled through the partitions for the topic. For the `test` topic created earlier, it has eight partitions. If you open eight SSH sessions and launch a consumer in all sessions, each consumer reads records from a single partition for the topic.

> [!IMPORTANT]
> There cannot be more consumer instances in a consumer group than partitions. In this example, one consumer group can contain up to eight consumers since that is the number of partitions in the topic. Or you can have multiple consumer groups, each with no more than eight consumers.

Records stored in Kafka are stored in the order they are received within a partition. To achieve in-ordered delivery for records *within a partition*, create a consumer group where the number of consumer instances matches the number of partitions. To achieve in-ordered delivery for records *within the topic*, create a consumer group with only one consumer instance.

## Next steps

In this document, you learned how to use the Kafka Producer and Consumer API with Kafka on HDInsight. Use the following to learn more about working with Kafka:

* [Analyze Kafka logs](apache-kafka-log-analytics-operations-management.md)
* [Replicate data between Kafka clusters](apache-kafka-mirroring.md)
* [Kafka Streams API with HDInsight](apache-kafka-streams-api.md)
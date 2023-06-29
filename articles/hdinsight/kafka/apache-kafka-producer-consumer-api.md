---
title: 'Tutorial: Apache Kafka Producer & Consumer APIs - Azure HDInsight'
description: Learn how to use the Apache Kafka Producer and Consumer APIs with Kafka on HDInsight. In this tutorial, you learn how to use these APIs with Kafka on HDInsight from a Java application.
ms.service: hdinsight
ms.custom: hdinsightactive, devx-track-extended-java
ms.topic: tutorial
ms.date: 04/24/2023
#Customer intent: As a developer, I need to create an application that uses the Kafka consumer/producer API with Kafka on HDInsight
---

# Tutorial: Use the Apache Kafka Producer and Consumer APIs

Learn how to use the Apache Kafka Producer and Consumer APIs with Kafka on HDInsight.

The Kafka Producer API allows applications to send streams of data to the Kafka cluster. The Kafka Consumer API allows applications to read streams of data from the cluster.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Prerequisites
> * Understand the code
> * Build and deploy the application
> * Run the application on the cluster

For more information on the APIs, see Apache documentation on the [Producer API](https://kafka.apache.org/documentation/#producerapi) and [Consumer API](https://kafka.apache.org/documentation/#consumerapi).

## Prerequisites

* Apache Kafka on HDInsight cluster. To learn how to create the cluster, see [Start with Apache Kafka on HDInsight](apache-kafka-get-started.md).
* [Java Developer Kit (JDK) version 8](/azure/developer/java/fundamentals/java-support-on-azure) or an equivalent, such as OpenJDK.
* [Apache Maven](https://maven.apache.org/download.cgi) properly [installed](https://maven.apache.org/install.html) according to Apache.  Maven is a project build system for Java projects.
* An SSH client like Putty. For more information, see [Connect to HDInsight (Apache Hadoop) using SSH](../hdinsight-hadoop-linux-use-ssh-unix.md).

## Understand the code

The example application is located at [https://github.com/Azure-Samples/hdinsight-kafka-java-get-started](https://github.com/Azure-Samples/hdinsight-kafka-java-get-started), in the `Producer-Consumer` subdirectory. If you're using **Enterprise Security Package (ESP)** enabled Kafka cluster, you should use the application version located in the `DomainJoined-Producer-Consumer` subdirectory.

The application consists primarily of four files:
* `pom.xml`: This file defines the project dependencies, Java version, and packaging methods.
* `Producer.java`: This file sends random sentences to Kafka using the producer API.
* `Consumer.java`: This file uses the consumer API to read data from Kafka and emit it to STDOUT.
* `AdminClientWrapper.java`: This file uses the admin API to create, describe, and delete Kafka topics.
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

    The `${kafka.version}` entry is declared in the `<properties>..</properties>` section of `pom.xml`, and is configured to the Kafka version of the HDInsight cluster.

* Plugins: Maven plugins provide various capabilities. In this project, the following plugins are used:

    * `maven-compiler-plugin`: Used to set the Java version used by the project to 8. This is the version of Java used by HDInsight 3.6.
    * `maven-shade-plugin`: Used to generate an uber jar that contains this application as well as any dependencies. It is also used to set the entry point of the application, so that you can directly run the Jar file without having to specify the main class.

### Producer.java

The producer communicates with the Kafka broker hosts (worker nodes) and sends data to a Kafka topic. The following code snippet is from the [Producer.java](https://github.com/Azure-Samples/hdinsight-kafka-java-get-started/blob/master/Producer-Consumer/src/main/java/com/microsoft/example/Producer.java) file from the [GitHub repository](https://github.com/Azure-Samples/hdinsight-kafka-java-get-started) and shows how to set the producer properties. For Enterprise Security Enabled clusters an additional property must be added "properties.setProperty(CommonClientConfigs.SECURITY_PROTOCOL_CONFIG, "SASL_PLAINTEXT");"

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

The consumer communicates with the Kafka broker hosts (worker nodes), and reads records in a loop. The following code snippet from the [Consumer.java](https://github.com/Azure-Samples/hdinsight-kafka-java-get-started/blob/master/Producer-Consumer/src/main/java/com/microsoft/example/Consumer.java) file sets the consumer properties. For Enterprise Security Enabled clusters an additional property must be added "properties.setProperty(CommonClientConfigs.SECURITY_PROTOCOL_CONFIG, "SASL_PLAINTEXT");"

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

The [Run.java](https://github.com/Azure-Samples/hdinsight-kafka-java-get-started/blob/master/Producer-Consumer/src/main/java/com/microsoft/example/Run.java) file provides a command-line interface that runs either the producer or consumer code. You must provide the Kafka broker host information as a parameter. You can optionally include a group ID value, which is used by the consumer process. If you create multiple consumer instances using the same group ID, they'll load balance reading from the topic.

## Build and deploy the example

### Use pre-built JAR files

Download the jars from the [Kafka Get Started Azure sample](https://github.com/Azure-Samples/hdinsight-kafka-java-get-started/tree/master/Prebuilt-Jars). If your cluster is **Enterprise Security Package (ESP)** enabled, use kafka-producer-consumer-esp.jar. Use the command below to copy the jars to your cluster.

```cmd
scp kafka-producer-consumer*.jar sshuser@CLUSTERNAME-ssh.azurehdinsight.net:kafka-producer-consumer.jar
```

### Build the JAR files from code

If you would like to skip this step, prebuilt jars can be downloaded from the `Prebuilt-Jars` subdirectory. Download the kafka-producer-consumer.jar. If your cluster is **Enterprise Security Package (ESP)** enabled, use kafka-producer-consumer-esp.jar. Execute step 3 to copy the jar to your HDInsight cluster.

1. Download and extract the examples from [https://github.com/Azure-Samples/hdinsight-kafka-java-get-started](https://github.com/Azure-Samples/hdinsight-kafka-java-get-started).

2. Set your current directory to the location of the `hdinsight-kafka-java-get-started\Producer-Consumer` directory. If you are using **Enterprise Security Package (ESP)** enabled Kafka cluster, you should set the location to `DomainJoined-Producer-Consumer`subdirectory. Use the following command to build the application:

    ```cmd
    mvn clean package
    ```

    This command creates a directory named `target`, that contains a file named `kafka-producer-consumer-1.0-SNAPSHOT.jar`. For ESP clusters the file will be `kafka-producer-consumer-esp-1.0-SNAPSHOT.jar`

3. Replace `sshuser` with the SSH user for your cluster, and replace `CLUSTERNAME` with the name of your cluster. Enter the following command to copy the `kafka-producer-consumer-1.0-SNAPSHOT.jar` file to your HDInsight cluster. When prompted enter the password for the SSH user.

    ```cmd
    scp ./target/kafka-producer-consumer*.jar sshuser@CLUSTERNAME-ssh.azurehdinsight.net:kafka-producer-consumer.jar
    ```

## <a id="run"></a> Run the example

1. Replace `sshuser` with the SSH user for your cluster, and replace `CLUSTERNAME` with the name of your cluster. Open an SSH connection to the cluster, by entering the following command. If prompted, enter the password for the SSH user account.

    ```cmd
    ssh sshuser@CLUSTERNAME-ssh.azurehdinsight.net
    ```

1. To get the Kafka broker hosts, substitute the values for `<clustername>` and `<password>` in the following command and execute it. Use the same casing for `<clustername>` as shown in the Azure portal. Replace `<password>` with the cluster login password, then execute:

    ```bash
    sudo apt -y install jq
    export CLUSTER_NAME='<clustername>'
    export PASSWORD='<password>'
    export KAFKABROKERS=$(curl -sS -u admin:$PASSWORD -G https://$CLUSTER_NAME.azurehdinsight.net/api/v1/clusters/$CLUSTER_NAME/services/KAFKA/components/KAFKA_BROKER | jq -r '["\(.host_components[].HostRoles.host_name):9092"] | join(",")' | cut -d',' -f1,2);
    ```

    > [!Note]  
    > This command requires Ambari access. If your cluster is behind an NSG, run this command from a machine that can access Ambari.

1. Create Kafka topic, `myTest`, by entering the following command:

    ```bash
    java -jar kafka-producer-consumer.jar create myTest $KAFKABROKERS
    ```

1. To run the producer and write data to the topic, use the following command:

    ```bash
    java -jar kafka-producer-consumer.jar producer myTest $KAFKABROKERS
    ```

1. Once the producer has finished, use the following command to read from the topic:

    ```bash
    java -jar kafka-producer-consumer.jar consumer myTest $KAFKABROKERS
    scp ./target/kafka-producer-consumer*.jar sshuser@CLUSTERNAME-ssh.azurehdinsight.net:kafka-producer-consumer.jar
    ```

    The records read, along with a count of records, is displayed.

1. Use __Ctrl + C__ to exit the consumer.

### Multiple consumers

Kafka consumers use a consumer group when reading records. Using the same group with multiple consumers results in load balanced reads from a topic. Each consumer in the group receives a portion of the records.

The consumer application accepts a parameter that is used as the group ID. For example, the following command starts a consumer using a group ID of `myGroup`:

```bash
java -jar kafka-producer-consumer.jar consumer myTest $KAFKABROKERS myGroup
```

Use __Ctrl + C__ to exit the consumer.

To see this process in action, use the following command:

```bash
tmux new-session 'java -jar kafka-producer-consumer.jar consumer myTest $KAFKABROKERS myGroup' \
\; split-window -h 'java -jar kafka-producer-consumer.jar consumer myTest $KAFKABROKERS myGroup' \
\; attach
```

This command uses `tmux` to split the terminal into two columns. A consumer is started in each column, with the same group ID value. Once the consumers finish reading, notice that each read only a portion of the records. Use __Ctrl + C__ twice to exit `tmux`.

Consumption by clients within the same group is handled through the partitions for the topic. In this code sample, the `test` topic created earlier has eight partitions. If you start eight consumers, each consumer reads records from a single partition for the topic.

> [!IMPORTANT]  
> There cannot be more consumer instances in a consumer group than partitions. In this example, one consumer group can contain up to eight consumers since that is the number of partitions in the topic. Or you can have multiple consumer groups, each with no more than eight consumers.

Records stored in Kafka are stored in the order they're received within a partition. To achieve in-ordered delivery for records *within a partition*, create a consumer group where the number of consumer instances matches the number of partitions. To achieve in-ordered delivery for records *within the topic*, create a consumer group with only one consumer instance.

## Common Issues faced

1. **Topic creation fails** If your cluster is Enterprise Security Pack enabled, use the [pre-built JAR files for producer and consumer](https://github.com/Azure-Samples/hdinsight-kafka-java-get-started/blob/master/Prebuilt-Jars/kafka-producer-consumer-esp.jar). The ESP jar can be built from the code in the [`DomainJoined-Producer-Consumer` subdirectory](https://github.com/Azure-Samples/hdinsight-kafka-java-get-started/tree/master/DomainJoined-Producer-Consumer). The producer and consumer properties have an additional property `CommonClientConfigs.SECURITY_PROTOCOL_CONFIG` for ESP enabled clusters.

2. **Failure in ESP enabled clusters**: If produce and consume operations fail and you are using an ESP enabled cluster, check that the user `kafka` is present in all Ranger policies. If it is not present, add it to all Ranger policies.

## Clean up resources

To clean up the resources created by this tutorial, you can delete the resource group. Deleting the resource group also deletes the associated HDInsight cluster, and any other resources associated with the resource group.

To remove the resource group using the Azure portal:

1. In the Azure portal, expand the menu on the left side to open the menu of services, and then choose __Resource Groups__ to display the list of your resource groups.
2. Locate the resource group to delete, and then right-click the __More__ button (...) on the right side of the listing.
3. Select __Delete resource group__, and then confirm.

## Next steps

In this document, you learned how to use the Apache Kafka Producer and Consumer API with Kafka on HDInsight. Use the following to learn more about working with Kafka:

* [Use Kafka REST Proxy](rest-proxy.md)
* [Analyze Apache Kafka logs](apache-kafka-log-analytics-operations-management.md)

---
title: Using Akka Streams with Azure Event Hubs for Apache Kafka | Microsoft Docs
description: Connecting Akka Streams to a Kafka enabled Event Hub
services: event-hubs
documentationcenter: ''
author: basilhariri
manager: timlt
editor: ''

ms.assetid: ''
ms.service: event-hubs
ms.devlang: na
ms.topic: article
ms.custom: mvc
ms.date: 08/06/2018
ms.author: bahariri

---

# Using Akka Streams with Event Hubs for Apache Kafka
This tutorial shows you how to connect Akka Streams to Kafka-enabled event hubs without changing your protocol clients or running your own clusters. Azure Event Hubs for the Kafka supports [Apache Kafka version 1.0.](https://kafka.apache.org/10/documentation.html)

In this tutorial, you learn how to:
> [!div class="checklist"]
> * Create an Event Hubs namespace
> * Clone the example project
> * Run Akka Streams producer 
> * Run Akka Streams consumer

> [!NOTE]
> This sample is available on [GitHub](https://github.com/Azure/azure-event-hubs-for-kafka/tree/master/tutorials/akka/java)

## Prerequisites

To complete this tutorial, make sure you have the following prerequisites:

* Read through the [Event Hubs for Apache Kafka](event-hubs-for-kafka-ecosystem-overview.md) article. 
* An Azure subscription. If you do not have one, create a [free account](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio) before you begin.
* [Java Development Kit (JDK) 1.8+](http://www.oracle.com/technetwork/java/javase/downloads/index.html)
    * On Ubuntu, run `apt-get install default-jdk` to install the JDK.
    * Be sure to set the JAVA_HOME environment variable to point to the folder where the JDK is installed.
* [Download](http://maven.apache.org/download.cgi) and [install](http://maven.apache.org/install.html) a Maven binary archive
    * On Ubuntu, you can run `apt-get install maven` to install Maven.
* [Git](https://www.git-scm.com/downloads)
    * On Ubuntu, you can run `sudo apt-get install git` to install Git.

## Create an Event Hubs namespace

An Event Hubs namespace is required to send or receive from any Event Hubs service. See [Create Kafka Enabled Event Hubs](event-hubs-create-kafka-enabled.md) for information about getting an Event Hubs Kafka endpoint. Make sure to copy the Event Hubs connection string for later use.

## Clone the example project

Now that you have a Kafka-enabled Event Hubs connection string, clone the Azure Event Hubs for Kafka repository and navigate to the `akka` subfolder:

```shell
git clone https://github.com/Azure/azure-event-hubs-for-kafka.git
cd azure-event-hubs-for-kafka/tutorials/akka/java
```

## Run Akka Streams producer

Using the provided Akka Streams producer example, send messages to the Event Hubs service.

### Provide an Event Hubs Kafka endpoint

#### Producer application.conf

Update the `bootstrap.servers` and `sasl.jaas.config` values in `producer/src/main/resources/application.conf` to direct the producer to the Event Hubs Kafka endpoint with the correct authentication.

```xml
akka.kafka.producer {
    #Akka Kafka producer properties can be defined here


    # Properties defined by org.apache.kafka.clients.producer.ProducerConfig
    # can be defined in this configuration section.
    kafka-clients {
        bootstrap.servers="{YOUR.EVENTHUBS.FQDN}:9093"
        sasl.mechanism=PLAIN
        security.protocol=SASL_SSL
        sasl.jaas.config="org.apache.kafka.common.security.plain.PlainLoginModule required username=\"$ConnectionString\" password=\"{YOUR.EVENTHUBS.CONNECTION.STRING}\";"
    }
}
```

### Run producer from the command line

To run the producer from the command line, generate the JAR and then run from within Maven (or generate the JAR using Maven, then run in Java by adding the necessary Kafka JAR(s) to the classpath):

```shell
mvn clean package
mvn exec:java -Dexec.mainClass="AkkaTestProducer"
```

The producer begins sending events to the Kafka-enabled event hub at topic `test`, and prints the events to stdout.

## Run Akka Streams consumer

Using the provided consumer example, receive messages from the Kafka-enabled event hubs.

### Provide an Event Hubs Kafka endpoint

#### Consumer application.conf

Update the `bootstrap.servers` and `sasl.jaas.config` values in `consumer/src/main/resources/application.conf` to direct the consumer to the Event Hubs Kafka endpoint with the correct authentication.

```xml
akka.kafka.consumer {
    #Akka Kafka consumer properties defined here
    wakeup-timeout=60s

    # Properties defined by org.apache.kafka.clients.consumer.ConsumerConfig
    # defined in this configuration section.
    kafka-clients {
       request.timeout.ms=60000
       group.id=akka-example-consumer

       bootstrap.servers="{YOUR.EVENTHUBS.FQDN}:9093"
       sasl.mechanism=PLAIN
       security.protocol=SASL_SSL
       sasl.jaas.config="org.apache.kafka.common.security.plain.PlainLoginModule required username=\"$ConnectionString\" password=\"{YOUR.EVENTHUBS.CONNECTION.STRING}\";"
    }
}
```

### Run consumer from the command line

To run the consumer from the command line, generate the JAR and then run from within Maven (or generate the JAR using Maven, then run in Java by adding the necessary Kafka JAR(s) to the classpath):

```shell
mvn clean package
mvn exec:java -Dexec.mainClass="AkkaTestConsumer"
```

If the Kafka-enabled event hub has events (for instance, if your producer is also running), then the consumer begins receiving events from topic `test`. 

Check out the [Akka Streams Kafka Guide](https://doc.akka.io/docs/akka-stream-kafka/current/home.html) for more detailed information about Akka Streams.

## Next steps
In this tutorial, you learned how to connect Akka Streams to Kafka-enabled event hubs without changing your protocol clients or running your own clusters. Azure Event Hubs for the Kafka supports [Apache Kafka version 1.0.](https://kafka.apache.org/10/documentation.html). You did the following actions as part of this tutorial: 

> [!div class="checklist"]
> * Create an Event Hubs namespace
> * Clone the example project
> * Run Akka Streams producer 
> * Run Akka Streams consumer

To learn more about Event Hubs and Event Hubs for Kafka, see the following topic:  

* [Learn about Event Hubs](event-hubs-what-is-event-hubs.md)
* [Learn about Event Hubs for Kafka](event-hubs-for-kafka-ecosystem-overview.md)
* [Explore more samples on the Event Hubs for Kafka GitHub](https://github.com/Azure/azure-event-hubs-for-kafka)
* Use [MirrorMaker](https://cwiki.apache.org/confluence/pages/viewpage.action?pageId=27846330) to [stream events from Kafka on-prem to Kafka enabled Event Hubs on cloud.](event-hubs-kafka-mirror-maker-tutorial.md)
* Learn how to stream into Kafka enabled Event Hubs using [native Kafka applications](event-hubs-quickstart-kafka-enabled-event-hubs.md) or [Apache Flink](event-hubs-kafka-flink-tutorial.md)

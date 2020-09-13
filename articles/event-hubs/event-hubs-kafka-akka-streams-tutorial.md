---
title: Using Akka Streams for Apache Kafka - Azure Event Hubs| Microsoft Docs
description: This article provides information on how to connect Akka Streams to an Azure event hub. 
ms.topic: how-to
ms.date: 06/23/2020
---

# Using Akka Streams with Event Hubs for Apache Kafka
This tutorial shows you how to connect Akka Streams to an event hub without changing your protocol clients or running your own clusters. Azure Event Hubs for the Kafka supports [Apache Kafka version 1.0.](https://kafka.apache.org/10/documentation.html)

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
* [Java Development Kit (JDK) 1.8+](https://aka.ms/azure-jdks)
    * On Ubuntu, run `apt-get install default-jdk` to install the JDK.
    * Be sure to set the JAVA_HOME environment variable to point to the folder where the JDK is installed.
* [Download](https://maven.apache.org/download.cgi) and [install](https://maven.apache.org/install.html) a Maven binary archive
    * On Ubuntu, you can run `apt-get install maven` to install Maven.
* [Git](https://www.git-scm.com/downloads)
    * On Ubuntu, you can run `sudo apt-get install git` to install Git.

## Create an Event Hubs namespace

An Event Hubs namespace is required to send or receive from any Event Hubs service. See [Create an event hub](event-hubs-create.md) for detailed information. Make sure to copy the Event Hubs connection string for later use.

## Clone the example project

Now that you have a Event Hubs connection string, clone the Azure Event Hubs for Kafka repository and navigate to the `akka` subfolder:

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

The producer begins sending events to the event hub at topic `test`, and prints the events to stdout.

## Run Akka Streams consumer

Using the provided consumer example, receive messages from the event hub.

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

If the event hub has events (for instance, if your producer is also running), then the consumer begins receiving events from topic `test`. 

Check out the [Akka Streams Kafka Guide](https://doc.akka.io/docs/akka-stream-kafka/current/home.html) for more detailed information about Akka Streams.

## Next steps
To learn more about Event Hubs for Kafka, see the following articles:  

- [Mirror a Kafka broker in an event hub](event-hubs-kafka-mirror-maker-tutorial.md)
- [Connect Apache Spark to an event hub](event-hubs-kafka-spark-tutorial.md)
- [Connect Apache Flink to an event hub](event-hubs-kafka-flink-tutorial.md)
- [Integrate Kafka Connect with an event hub](event-hubs-kafka-connect-tutorial.md)
- [Explore samples on our GitHub](https://github.com/Azure/azure-event-hubs-for-kafka)
- [Apache Kafka developer guide for Azure Event Hubs](apache-kafka-developer-guide.md)

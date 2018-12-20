---
title: Connect with your Apache Spark app - Azure Event Hubs | Microsoft Docs
description: This article provides information on how to use Apache Spark with Azure Event Hubs for Kafka.
services: event-hubs
documentationcenter: .net
author: basilhariri
manager: timlt
ms.service: event-hubs
ms.topic: tutorial
ms.custom: seodec18
ms.date: 12/06/2018
ms.author: bahariri

---

# Connect your Apache Spark application with Kafka-enabled Azure Event Hubs
This tutorial walks you through connecting your Spark application to Kafka-enabled Event Hubs for real-time streaming. This integration enables streaming without having to change your protocol clients or run your own Kafka or Zookeeper clusters. This tutorial, requires Apache Spark v2.4+ and Apache Kafka v2.0+.

> [!NOTE]
> This sample is available on [GitHub](https://github.com/Azure/azure-event-hubs-for-kafka/tree/master/tutorials/spark/)

In this tutorial, you learn how to:
> [!div class="checklist"]
> * Create an Event Hubs namespace
> * Clone the example project
> * Run Spark
> * Read from Event Hubs for Kafka
> * Write to Event Hubs for Kafka

## Prerequisites

Before you start this tutorial, make sure that you have:
-	Azure subscription. If you don't have one, [create a free account](https://azure.microsoft.com/free/).
-	[Apache Spark v2.4](https://spark.apache.org/downloads.html)
-	[Apache Kafka v2.0]( https://kafka.apache.org/20/documentation.html)
-	[Git](https://www.git-scm.com/downloads)

> [!NOTE]
> The Spark-Kafka adapter was updated to support Kafka v2.0 as of Spark v2.4. In previous releases of Spark, the adapter supported Kafka v0.10 and later but relied specifically on Kafka v0.10 APIs. As Event Hubs for Kafka does not support Kafka v0.10, the Spark-Kafka adapters from versions of Spark prior to v2.4 are not supported by Event Hubs for Kafka Ecosystems.


## Create an Event Hubs namespace
An Event Hubs namespace is required to send and receive from any Event Hubs service. See [Creating a Kafka enabled Event Hub](event-hubs-create.md) for instructions on getting an Event Hubs Kafka endpoint. Get the Event Hubs connection string and fully qualified domain name (FQDN) for later use. For instructions, see [Get an Event Hubs connection string](event-hubs-get-connection-string.md). 

## Clone the example project
Clone the Azure Event Hubs repository and navigate to the `tutorials/spark` subfolder:

```bash
git clone https://github.com/Azure/azure-event-hubs-for-kafka.git
cd azure-event-hubs-for-kafka/tutorials/spark
```

## Read from Event Hubs for Kafka
With a few configuration changes, you can start reading from Event Hubs for Kafka. Update **BOOTSTRAP_SERVERS** and **EH_SASL** with details from your namespace and you can start streaming with Event Hubs as you would with Kafka. For the full sample code, see sparkConsumer.scala file on the GitHub. 

```scala
//Read from your Event Hub!
val df = spark.readStream
    .format("kafka")
    .option("subscribe", TOPIC)
    .option("kafka.bootstrap.servers", BOOTSTRAP_SERVERS)
    .option("kafka.sasl.mechanism", "PLAIN")
    .option("kafka.security.protocol", "SASL_SSL")
    .option("kafka.sasl.jaas.config", EH_SASL)
    .option("kafka.request.timeout.ms", "60000")
    .option("kafka.session.timeout.ms", "30000")
    .option("kafka.group.id", GROUP_ID)
    .option("failOnDataLoss", "false")
    .load()

//Use dataframe like normal (in this example, write to console)
val df_write = df.writeStream
    .outputMode("append")
    .format("console")
    .start()
```

## Write to Event Hubs for Kafka
You can also write to Event Hubs the same way you write to Kafka. Don't forget to update your configuration to change **BOOTSTRAP_SERVERS** and **EH_SASL** with information from your Event Hubs namespace.  For the full sample code, see sparkProducer.scala file on the GitHub. 

```scala
df = /**Dataframe**/

//Write to your Event Hub!
df.writeStream
    .format("kafka")
    .option("topic", TOPIC)
    .option("kafka.bootstrap.servers", BOOTSTRAP_SERVERS)
    .option("kafka.sasl.mechanism", "PLAIN")
    .option("kafka.security.protocol", "SASL_SSL")
    .option("kafka.sasl.jaas.config", EH_SASL)
    .option("checkpointLocation", "./checkpoint")
    .start()
```



## Next steps

In this tutorial, you learned how to stream using the Spark-Kafka connector and Event Hubs for Kafka. You took the following steps: 

> [!div class="checklist"]
> * Create an Event Hubs namespace
> * Clone the example project
> * Run Spark
> * Read from Event Hubs for Kafka
> * Write to Event Hubs for Kafka

To learn more about Event Hubs and Event Hubs for Kafka, see the following topic:  

- [Learn about Event Hubs](event-hubs-what-is-event-hubs.md)
- [Event Hubs for Apache Kafka](event-hubs-for-kafka-ecosystem-overview.md)
- [How to create Kafka enabled Event Hubs](event-hubs-create-kafka-enabled.md)
- [Stream into Event Hubs from your Kafka applications](event-hubs-quickstart-kafka-enabled-event-hubs.md)
- [Mirror a Kafka broker in a Kafka-enabled event hub](event-hubs-kafka-mirror-maker-tutorial.md)
- [Connect Apache Flink to a Kafka-enabled event hub](event-hubs-kafka-flink-tutorial.md)
- [Integrate Kafka Connect with a Kafka-enabled event hub](event-hubs-kafka-connect-tutorial.md)
- [Connect Akka Streams to a Kafka-enabled event hub](event-hubs-kafka-akka-streams-tutorial.md)
- [Explore samples on our GitHub](https://github.com/Azure/azure-event-hubs-for-kafka)

Shubha---
title: Integrating Acpache Spark with Azure Event Hubs | Microsoft Docs
description: Enable Auto-inflate on a namespace to automatically scale up throughput units
services: event-hubs
documentationcenter: na
author: ShubhaVijayasarathy
manager: timlt
editor: ''

ms.assetid: 
ms.service: event-hubs
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 03/05/2018
ms.author: shvija

---

# Integrating Acpache Spark with Azure Event Hubs

To enable building _end-to-end_ distributed streaming applications easy for users, Azure Event Hubs seamlessly integrates with [Apache Spark](https://spark.apache.org/). Our integration supports [Spark Core](https://wikipedia.org/wiki/Apache_Spark#Spark_Core), [Spark Streaming](https://spark.apache.org/streaming/), [Structured Streaming](https://spark.apache.org/docs/latest/structured-streaming-programming-guide.html). The Event Hubs Connector for Apache Spark which enables this integration is available on [GitHub](https://github.com/Azure/azure-event-hubs-spark). This library is also available for use in Maven projects from the [Maven Central Repository](http://search.maven.org/#artifactdetails%7Ccom.microsoft.azure%7Cazure-eventhubs-spark_2.11%7C2.1.6%7C)

In this article, we’ll show you how make a simple continuous application in Azure Databricks. While we use Azure Databricks, Spark Clusters are also available using [HDInsight](https://docs.microsoft.com/azure/hdinsight/spark/apache-spark-overview)

In the example below we will setup two Scala notebooks, one notebook for streaming events from an Event Hub and one notebook for sending messages to the same Event Hub.

## Prerequisites

1. An Azure subscription. If you do not have one, [create a free account](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio)
2. An Event Hubs instance. If you do not have one, [create one](https://docs.microsoft.com/azure/event-hubs/event-hubs-create)
3. An Azure Databricks instance. If you do not have one, [create one](https://docs.microsoft.com/azure/azure-databricks/quickstart-create-databricks-workspace-portal)
4. [Create a library using maven coordinate:'com.microsoft.azure:azure‐eventhubs‐spark_2.11:2.3.0'](https://databricks.com/blog/2015/07/28/using-3rd-party-libraries-in-databricks-apache-spark-packages-and-maven-libraries.html)

Use the below in your notebook to stream event from the Event Hub

```java
import org.apache.spark.eventhubs._

// To connect to an Event Hub, EntityPath is required as part of the connection string.
// Here, we assume that the connection string from the Azure portal does not have the EntityPath part.
val connectionString = ConnectionStringBuilder("{EVENT HUB CONNECTION STRING FROM AZURE PORTAL}")
  .setEventHubName("{EVENT HUB NAME}")
  .build 
val ehConf = EventHubsConf(connectionString)
  .setStartingPosition(EventPosition.fromEndOfStream)

// Create a stream that reads data from the specified Event Hub.
val reader = spark.readStream
  .format("eventhubs")
  .options(ehConf.toMap)
  .load()

// Select the body column and cast it to a string.
val eventhubs = reader.load()
  .select("body")
  .as[String]

```
Use the below in your application to send events your Event Hub using the Spark's batch API. You can also write streaming query to send messages to the Event Hub.

```java
import org.apache.spark.eventhubs._
import org.apache.spark.sql.functions._

// To connect to an Event Hub, EntityPath is required as part of the connection string.
// Here, we assume that the connection string from the Azure portal does not have the EntityPath part.
val connectionString = ConnectionStringBuilder("{EVENT HUB CONNECTION STRING FROM AZURE PORTAL}")
  .setEventHubName("{EVENT HUB NAME}")
  .build

val eventHubsConf = EventHubsConf(connectionString)

// Create a column representing the partitionKey.
val partitionKeyColumn = (col("id") % 5).cast("string").as("partitionKey")
// Create random strings as the body of the message.
val bodyColumn = concat(lit("random nunmber: "), rand()).as("body")

// Write 200 rows to the specified Event Hub.
val df = spark.range(200).select(partitionKeyColumn, bodyColumn)
df.write
  .format("eventhubs")
  .options(eventHubsConf.toMap)
  .save() 

```

This artice gives you a glimpse of how the Event Hubs Connector works for building real-time fault tolerant streaming solutions. Follow the next steps to learn more.

## Next steps

* [Structured Streaming + Azure Event Hubs Integration Guide](https://github.com/Azure/azure-event-hubs-spark/blob/master/docs/structured-streaming-eventhubs-integration.md)
* [Spark Streaming + Event Hubs Integration Guide](https://github.com/Azure/azure-event-hubs-spark/blob/master/docs/spark-streaming-eventhubs-integration.md)



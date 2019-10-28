---
title: Integrate with Apache Spark - Azure Event Hubs | Microsoft Docs
description: Integrate with Apache Spark to enable Structured Streaming with Event Hubs
services: event-hubs
documentationcenter: na
author: ShubhaVijayasarathy
manager: timlt
editor: ''

ms.service: event-hubs
ms.devlang: java
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.custom: seodec18
ms.date: 12/06/2018
ms.author: shvija

---

# Integrating Apache Spark with Azure Event Hubs

Azure Event Hubs seamlessly integrates with [Apache Spark](https://spark.apache.org/) to enable building distributed streaming applications. This integration supports [Spark Core](https://spark.apache.org/docs/latest/rdd-programming-guide.html), [Spark Streaming](https://spark.apache.org/docs/latest/streaming-programming-guide.html), and [Structured Streaming](https://spark.apache.org/docs/latest/structured-streaming-programming-guide.html). The Event Hubs connector for Apache Spark is available on [GitHub](https://github.com/Azure/azure-event-hubs-spark). This library is also available for use in Maven projects from the [Maven Central Repository](https://search.maven.org/#artifactdetails%7Ccom.microsoft.azure%7Cazure-eventhubs-spark_2.11%7C2.1.6%7C).

This article describes how to create a continuous application in [Azure Databricks](https://azure.microsoft.com/services/databricks/). While this article uses Azure Databricks, Spark clusters are also available with [HDInsight](../hdinsight/spark/apache-spark-overview.md).

The example in this article uses two Scala notebooks: one for streaming events from an event hub and another for sending events back to it.

## Prerequisites

* An Azure subscription. If you do not have one, [create a free account](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio).
* An Event Hubs instance. If you do not have one, [create one](event-hubs-create.md).
* An [Azure Databricks](https://azure.microsoft.com/services/databricks/) instance. If you do not have one, [create one](../azure-databricks/quickstart-create-databricks-workspace-portal.md).
* [Create a library using maven coordinates](https://docs.databricks.com/user-guide/libraries.html#upload-a-maven-package-or-spark-package): `com.microsoft.azure:azure‐eventhubs‐spark_2.11:2.3.1`.

Stream events from your event hub using the following code:

```scala
import org.apache.spark.eventhubs._

// To connect to an event hub, EntityPath is required as part of the connection string.
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
val eventhubs = reader.select($"body" cast "string")

eventhubs.writeStream
  .format("console")
  .outputMode("append")
  .start()
  .awaitTermination()
```
The following code sends events to your event hub with the Spark batch APIs. You can also write a streaming query to send events to the event hub:

```scala
import org.apache.spark.eventhubs._
import org.apache.spark.sql.functions._

// To connect to an event hub, EntityPath is required as part of the connection string.
// Here, we assume that the connection string from the Azure portal does not have the EntityPath part.
val connectionString = ConnectionStringBuilder("{EVENT HUB CONNECTION STRING FROM AZURE PORTAL}")
  .setEventHubName("{EVENT HUB NAME}")
  .build
val ehConf = EventHubsConf(connectionString)

// Create random strings as the body of the message.
val bodyColumn = concat(lit("random nunmber: "), rand()).as("body")

// Write 200 rows to the specified event hub.
val df = spark.range(200).select(bodyColumn)
df.write
  .format("eventhubs")
  .options(ehConf.toMap)
  .save() 
```

## Next steps

Now you know how to set up a scalable, fault-tolerant stream using the Event Hubs Connector for Apache Spark. Learn more about using Event Hubs with Structured Streaming and Spark Streaming by following these links:

* [Structured Streaming + Azure Event Hubs Integration Guide](https://github.com/Azure/azure-event-hubs-spark/blob/master/docs/structured-streaming-eventhubs-integration.md)
* [Spark Streaming + Event Hubs Integration Guide](https://github.com/Azure/azure-event-hubs-spark/blob/master/docs/spark-streaming-eventhubs-integration.md)

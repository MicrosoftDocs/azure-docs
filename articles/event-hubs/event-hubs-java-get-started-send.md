---
title: Send events to Azure Event Hubs using Java | Microsoft Docs
description: Get started sending to Event Hubs using Java
services: event-hubs
author: ShubhaVijayasarathy
manager: timlt

ms.service: event-hubs
ms.workload: core
ms.topic: article
ms.date: 08/27/2018
ms.author: shvija

---

# Send events to Azure Event Hubs using Java

Event Hubs is a highly scalable ingestion system that can ingest millions of events per second, enabling an application to process and analyze the massive amounts of data produced by your connected devices and applications. Once collected into an event hub, you can transform and store data using any real-time analytics provider or storage cluster.

For more information, see the [Event Hubs overview][Event Hubs overview].

This tutorial shows how to send events to an event hub by using a console application in Java. To receive events using the Java Event Processor Host library, see [this article](event-hubs-java-get-started-receive-eph.md), or click the appropriate receiving language in the left-hand table of contents.

## Prerequisites

In order to complete this tutorial, you need the following prerequisites:

* A Java development environment. This tutorial uses [Eclipse](https://www.eclipse.org/).
* An active Azure account. If you do not have an Azure subscription, create a [free account][] before you begin.

The code in this tutorial is based on the [SimpleSend GitHub sample](https://github.com/Azure/azure-event-hubs/tree/master/samples/Java/Basic/SimpleSend), which you can examine to see the full working application.

## Send events to Event Hubs

The Java client library for Event Hubs is available for use in Maven projects from the [Maven Central Repository](https://search.maven.org/#search%7Cga%7C1%7Ca%3A%22azure-eventhubs%22). You can reference this library using the following dependency declaration inside your Maven project file. The current version is 1.0.2:    

```xml
<dependency>
    <groupId>com.microsoft.azure</groupId>
    <artifactId>azure-eventhubs</artifactId>
    <version>1.0.2</version>
</dependency>
```

For different types of build environments, you can explicitly obtain the latest released JAR files from the [Maven Central Repository](https://search.maven.org/#search%7Cga%7C1%7Ca%3A%22azure-eventhubs%22).  

For a simple event publisher, import the *com.microsoft.azure.eventhubs* package for the Event Hubs client classes and the *com.microsoft.azure.servicebus* package for utility classes such as common exceptions that are shared with the Azure Service Bus messaging client. 

### Declare the Send class

For the following sample, first create a new Maven project for a console/shell application in your favorite Java development environment. Name the class `SimpleSend`:     

```java
package com.microsoft.azure.eventhubs.samples.send;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.microsoft.azure.eventhubs.ConnectionStringBuilder;
import com.microsoft.azure.eventhubs.EventData;
import com.microsoft.azure.eventhubs.EventHubClient;
import com.microsoft.azure.eventhubs.EventHubException;

import java.io.IOException;
import java.nio.charset.Charset;
import java.time.Instant;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.Executors;
import java.util.concurrent.ExecutorService;

public class SimpleSend {

    public static void main(String[] args)
            throws EventHubException, ExecutionException, InterruptedException, IOException {
            
            
    }
 }
```

### Construct connection string

Use the ConnectionStringBuilder class to construct a connection string value to pass to the Event Hubs client instance. Replace the placeholders with the values you obtained when you created the namespace and event hub:

```java
final ConnectionStringBuilder connStr = new ConnectionStringBuilder()
        .setNamespaceName("Your Event Hubs namespace name")
        .setEventHubName("Your event hub")
        .setSasKeyName("Your policy name")
        .setSasKey("Your primary SAS key");
```

### Send events

Create a singular event by transforming a string into its UTF-8 byte encoding. Then, create a new Event Hubs client instance from the connection string and send the message:   

```java 
String payload = "Message " + Integer.toString(i);
byte[] payloadBytes = gson.toJson(payload).getBytes(Charset.defaultCharset());
EventData sendEvent = EventData.create(payloadBytes);

final EventHubClient ehClient = EventHubClient.createSync(connStr.toString(), executorService);
ehClient.sendSync(sendEvent);
    
// close the client at the end of your program
ehClient.closeSync();

``` 

### How messages are routed to EventHub partitions

Before messages are retrieved by consumers, they have to be published to the partitions first by the publishers. When messages are published to event hub synchronously using the sendSync() method on the com.microsoft.azure.eventhubs.EventHubClient object, the message could be sent to a specific partition or distributed to all available partitions in a round-robin manner depending on whether the partition key is specified or not.

When a string representing the partition key is specified, the key will be hashed to determine which partition to send the event to.

When the partition key is not set, then messages will round-robined to all available partitions

```java
// Serialize the event into bytes
byte[] payloadBytes = gson.toJson(messagePayload).getBytes(Charset.defaultCharset());

// Use the bytes to construct an {@link EventData} object
EventData sendEvent = EventData.create(payloadBytes);

// Transmits the event to event hub without a partition key
// If a partition key is not set, then we will round-robin to all topic partitions
eventHubClient.sendSync(sendEvent);

//  the partitionKey will be hash'ed to determine the partitionId to send the eventData to.
eventHubClient.sendSync(sendEvent, partitionKey);

// close the client at the end of your program
eventHubClient.closeSync();

```

## Next steps

You can learn more about Event Hubs by visiting the following links:

* [Receive events using the EventProcessorHost](event-hubs-java-get-started-receive-eph.md)
* [Event Hubs overview][Event Hubs overview]
* [Create an event hub](event-hubs-create.md)
* [Event Hubs FAQ](event-hubs-faq.md)

<!-- Links -->
[Event Hubs overview]: event-hubs-overview.md
[free account]: https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio


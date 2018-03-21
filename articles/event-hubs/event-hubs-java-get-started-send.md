---
title: Send events to Azure Event Hubs using Java | Microsoft Docs
description: Get started sending to Event Hubs using Java
services: event-hubs
documentationcenter: ''
author: sethmanheim
manager: timlt
editor: ''

ms.assetid: 
ms.service: event-hubs
ms.workload: core
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 03/21/2018
ms.author: sethm

---

# Send events to Azure Event Hubs using Java

Event Hubs is a highly scalable ingestion system that can ingest millions of events per second, enabling an application to process and analyze the massive amounts of data produced by your connected devices and applications. Once collected into an event hub, you can transform and store data using any real-time analytics provider or storage cluster.

For more information, see the [Event Hubs overview][Event Hubs overview].

This tutorial shows how to send events to an event hub by using a console application in Java. To receive events using the Java Event Processor Host library, see [this article](event-hubs-java-get-started-receive-eph.md), or click the appropriate receiving language in the left-hand table of contents.

In order to complete this tutorial, you will need the following:

* A Java development environment. For this tutorial, we assume [Eclipse](https://www.eclipse.org/).
* An active Azure account. If you do not have an Azure subscription, create a [free account][] before you begin.

The code in this tutorial is based on the [Send GitHub sample](https://github.com/Azure/azure-event-hubs/tree/master/samples/Java/Basic/Send), which you can examine to see the full working application.

## Send events to Event Hubs

The Java client library for Event Hubs is available for use in Maven projects from the [Maven Central Repository](https://search.maven.org/#search%7Cga%7C1%7Ca%3A%22azure-eventhubs%22). You can reference this library using the following dependency declaration inside your Maven project file. The current version is 1.0.0:    

```xml
<dependency>
    <groupId>com.microsoft.azure</groupId>
    <artifactId>azure-eventhubs</artifactId>
    <version>1.0.0</version>
</dependency>
```

For different types of build environments, you can explicitly obtain the latest released JAR files from the [Maven Central Repository](https://search.maven.org/#search%7Cga%7C1%7Ca%3A%22azure-eventhubs%22).  

For a simple event publisher, import the *com.microsoft.azure.eventhubs* package for the Event Hubs client classes and the *com.microsoft.azure.servicebus* package for utility classes such as common exceptions that are shared with the Azure Service Bus messaging client. 

### Declare the Send class

For the following sample, first create a new Maven project for a console/shell application in your favorite Java development environment. Name the class `Send`:     

```java
package com.microsoft.azure.eventhubs.samples.send;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.microsoft.azure.eventhubs.ConnectionStringBuilder;
import com.microsoft.azure.eventhubs.EventData;
import com.microsoft.azure.eventhubs.EventHubClient;
import com.microsoft.azure.eventhubs.PartitionSender;
import com.microsoft.azure.eventhubs.EventHubException;

import java.io.IOException;
import java.nio.charset.Charset;
import java.time.Instant;
import java.util.Random;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.Executors;
import java.util.concurrent.ExecutorService;

public class Send {

    public static void main(String[] args)
            throws EventHubException, ExecutionException, InterruptedException, IOException {
```

### Construct connection string

Use the ConnectionStringBuilder class to construct a connection string value to pass to the Event Hubs client instance. Replace the placeholders with the values you obtained when you created the namespace and event hub:

```java
   final ConnectionStringBuilder connStr = new ConnectionStringBuilder()
      .setNamespaceName("----NamespaceName-----")
      .setEventHubName("----EventHubName-----")
      .setSasKeyName("-----SharedAccessSignatureKeyName-----")
      .setSasKey("---SharedAccessSignatureKey----");
```

### Send events

Then, create a singular event by transforming a string into its UTF-8 byte encoding. Then, create a new Event Hubs client instance from the connection string and send the message.   

```java 
byte[] payloadBytes = "Test AMQP message from JMS".getBytes("UTF-8");
EventData sendEvent = new EventData(payloadBytes);

final EventHubClient ehClient = EventHubClient.createSync(connStr.toString(), executorService);
ehClient.sendSync(sendEvent);
    
// close the client at the end of your program
ehClient.closeSync();

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


---
title: Send events with Azure Event Hubs in Java | Microsoft Docs
description: Follow this tutorial to get started using Azure Event Hubs; sending events with Java and receiving them in using the EventProcessorHost.
services: event-hubs
documentationcenter: ''
author: jtaubensee
manager: timlt
editor: ''

ms.assetid: 38e3be53-251c-488f-a856-9a500f41b6ca
ms.service: event-hubs
ms.workload: core
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 01/04/2017
ms.author: jotaub;sethm

---
# Get started with Event Hubs

## Introduction
Event Hubs is a highly scalable ingestion system that can intake millions of events per second, enabling an application to process and analyze the massive amounts of data produced by your connected devices and applications. Once collected into Event Hubs, you can transform and store data using any real-time analytics provider or storage cluster.

For more information, see the [Event Hubs overview][Event Hubs overview].

This tutorial shows how to ingest messages into an Event Hub using a console application in Java, and to retrieve them in parallel using the Java Event Processor Host library.

In order to complete this tutorial, you will need the following:

* A Java development environment. For this tutorial, we will assume [Eclipse](https://www.eclipse.org/).
* An active Azure account. <br/>If you don't have an account, you can create a free account in just a couple of minutes. For details, see <a href="http://azure.microsoft.com/pricing/free-trial/?WT.mc_id=A0E0E5C02&amp;returnurl=http%3A%2F%2Fazure.microsoft.com%2Fen-us%2Fdevelop%2Fmobile%2Ftutorials%2Fget-started%2F" target="_blank">Azure Free Trial</a>.

## Send messages to Event Hubs
The Java client library for Event Hubs is available for use in Maven projects from the [Maven Central Repository](https://search.maven.org/#search%7Cga%7C1%7Ca%3A%22azure-eventhubs%22), and can be referenced using the following dependency declaration inside your Maven project file:    

``` XML
<dependency>
    <groupId>com.microsoft.azure</groupId>
    <artifactId>azure-eventhubs</artifactId>
    <version>{VERSION}</version>
</dependency>
```

For different types of build environments, you can explicitly obtain the latest released JAR files from the [Maven Central Repository](https://search.maven.org/#search%7Cga%7C1%7Ca%3A%22azure-eventhubs%22) or from [the release distribution point on GitHub](https://github.com/Azure/azure-event-hubs/releases).  

For a simple event publisher, import the *com.microsoft.azure.eventhubs* package for the Event Hubs client classes and the *com.microsoft.azure.servicebus* package for utility classes such as common exceptions that are shared with the Azure Service Bus messaging client. 

For the following sample, first create a new Maven project for a console/shell application in your favorite Java development environment. The class will be called ```Send```.     

``` Java

import java.io.IOException;
import java.nio.charset.*;
import java.util.*;
import java.util.concurrent.ExecutionException;

import com.microsoft.azure.eventhubs.*;
import com.microsoft.azure.servicebus.*;

public class Send
{
    public static void main(String[] args) 
            throws ServiceBusException, ExecutionException, InterruptedException, IOException
    {
```

Replace the namespace and Event Hub names with the values used when you created the Event Hub.

``` Java
    final String namespaceName = "----ServiceBusNamespaceName-----";
    final String eventHubName = "----EventHubName-----";
    final String sasKeyName = "-----SharedAccessSignatureKeyName-----";
    final String sasKey = "---SharedAccessSignatureKey----";
    ConnectionStringBuilder connStr = new ConnectionStringBuilder(namespaceName, eventHubName, sasKeyName, sasKey);
```

Then, create a singular event by turning a string into its UTF-8 byte encoding. We then create a new Event Hubs client instance from the connection string and send the message.   

``` Java 

    byte[] payloadBytes = "Test AMQP message from JMS".getBytes("UTF-8");
    EventData sendEvent = new EventData(payloadBytes);

    EventHubClient ehClient = EventHubClient.createFromConnectionStringSync(connStr.toString());
    ehClient.sendSync(sendEvent);
    }
}

``` 

[!INCLUDE [service-bus-event-hubs-get-started-receive-ephjava](../../includes/service-bus-event-hubs-get-started-receive-ephjava.md)]

## Run the applications
Now you are ready to run the applications.

1. Run the **Receiver** project.
   
   ![][21]
2. Run the **Sender** project.
   
   ![][22]

## Next steps
Now that you've built a working application that creates an Event Hub and sends and receives data, you can move on to the following scenarios:

* A complete [sample application that uses Event Hubs][sample application that uses Event Hubs].
* The [Scale out Event Processing with Event Hubs][Scale out Event Processing with Event Hubs] sample.

For more information, see the [Java Developer Center](/develop/java/).

<!-- Images. -->
[21]: ./media/event-hubs-java-get-started-receive-eph/ephjava.png
[22]: ./media/event-hubs-java-get-started-receive-eph/java-send.png

<!-- Links -->
[Event Hubs overview]: event-hubs-overview.md

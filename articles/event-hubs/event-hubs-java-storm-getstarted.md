<properties
	pageTitle="Get Started with Event Hubs in Java with Apache Storm | Microsoft Azure"
	description="Follow this tutorial to get started using Azure Event Hubs; sending events with Java and receiving them in an Apache Storm cluster."
	services="event-hubs"
	documentationCenter=""
	authors="fsautomata"
	manager="timlt"
	editor=""/>

<tags
	ms.service="event-hubs"
	ms.workload="na"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="03/08/2016"
	ms.author="sethm"/>

# Get started with Event Hubs

[AZURE.INCLUDE [service-bus-selector-get-started](../../includes/service-bus-selector-get-started.md)]

## Introduction

Event Hubs is a highly scalable ingestion system that can intake millions of events per second, enabling an application to process and analyze the massive amounts of data produced by your connected devices and applications. Once collected into Event Hubs, you can transform and store data using any real-time analytics provider or storage cluster.

For more information, see the [Event Hubs Overview][].

This tutorial describes how to collect messages into an Event Hub using a console application in Java, and to retrieve them in parallel using Apache Storm.

In order to complete this tutorial you will need the following:

+ A Java development environment configured to run [Maven](http://maven.apache.org/). For this tutorial, we assume [Eclipse](https://www.eclipse.org/).

+ An active Azure account. <br/>If you don't have an account, you can create a free trial account in just a couple of minutes. For details, see <a href="http://azure.microsoft.com/pricing/free-trial/?WT.mc_id=A0E0E5C02&amp;returnurl=http%3A%2F%2Fazure.microsoft.com%2Fen-us%2Fdevelop%2Fmobile%2Ftutorials%2Fget-started%2F" target="_blank">Azure Free Trial</a>.

## Create an Event Hub

1. Log on to the [Azure classic portal][], and click **NEW** at the bottom of the screen.

2. Click **App Services**, then **Service Bus**, then **Event Hub**, and then **Quick Create**.

   	![][1]

3. Type a name for your Event Hub, select your desired region, and then click **Create a new Event Hub**.

   	![][2]

4. Click the namespace you just created (usually ***event hub name*-ns**).

   	![][3]

5. Click the **Event Hubs** tab at the top of the page, and then click the Event Hub you just created.

   	![][4]

6. Click the **Configure** tab at the top of the page, add a rule called **SendRule** with *Send* rights, add another rule called **ReceiveRule** with *Listen* rights, and then click **Save**.

   	![][5]

7. On the same page, take note of the generated keys for **SendRule** and **ReceiveRule**.

   	![][6c]

Your Event Hub is now created, and you have the connection strings you need to send and receive events.

[AZURE.INCLUDE [service-bus-event-hubs-get-started-send-java](../../includes/service-bus-event-hubs-get-started-send-java.md)]


[AZURE.INCLUDE [service-bus-event-hubs-get-started-receive-storm](../../includes/service-bus-event-hubs-get-started-receive-storm.md)]

## Run the applications

Now you are ready to run the applications.

1.	Run the **LogTopology** class from Eclipse, then wait for it to start the receivers for all the partitions.

2.	Run the **Sender** project, press **Enter** in the console window, and see the events appear in the receiver window.

   	![][22]

> [AZURE.NOTE] In this tutorial only, use Storm in local mode for development purposes. See the [HDInsight Storm Overview][] and the official [Apache Storm][] documentation for more information of Storm deployments and patterns.

## Next Steps

The following resources are available for developing applications integrating Event Hubs and Storm.

- [Analyzing sensor data with Storm and HDInsight] is a full scenario tutorial using Event Hubs, Storm, and HBase to ingest sensor data in an Hadoop cluster.
- [Develop streaming data processing applications with SCP.NET and C# on Storm and HDInsight][] is a tutorial on how to write Storm pipelines using C#.

<!-- Images. -->
[1]: ./media/event-hubs-java-storm-getstarted/create-event-hub1.png
[2]: ./media/event-hubs-java-storm-getstarted/create-event-hub2.png
[3]: ./media/event-hubs-java-storm-getstarted/create-event-hub3.png
[4]: ./media/event-hubs-java-storm-getstarted/create-event-hub4.png
[5]: ./media/event-hubs-java-storm-getstarted/create-event-hub5.png
[6]: ./media/event-hubs-getstarted/create-event-hub6.png
[6c]: ./media/event-hubs-java-storm-getstarted/create-event-hub6c.png

[22]: ./media/event-hubs-java-storm-getstarted/receive-storm2.png

<!-- Links -->
[Azure classic portal]: https://manage.windowsazure.com/
[Event Processor Host]: https://www.nuget.org/packages/Microsoft.Azure.ServiceBus.EventProcessorHost
[Event Hubs Overview]: event-hubs-overview.md

[Apache Storm]: https://storm.incubator.apache.org
[HDInsight Storm Overview]: ../hdinsight/hdinsight-storm-overview.md
[Analyzing sensor data with Storm and HDInsight]: ../hdinsight/hdinsight-storm-sensor-data-analysis.md
[Develop streaming data processing applications with SCP.NET and C# on Storm and HDInsight]: ../hdinsight/hdinsight-storm-develop-csharp-visual-studio-topology.md
 
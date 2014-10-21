<properties pageTitle="Get Started with Event Hubs" metaKeywords="Azure Service Bus, Event Hub, getting started Event Hubs" description="Follow this tutorial to get started using Azure Event Hubs sending events with C# and receiving them in an Apache Storm cluster" metaCanonical="" services="" documentationCenter="" title="Get Started with Event Hubs" authors="elioda" solutions="" manager="timlt" editor="" />

<tags ms.service="service-bus" ms.workload="core" ms.tgt_pltfrm="csharp" ms.devlang="csharp" ms.topic="hero-article" ms.date="10/27/2014" ms.author="elioda" />

# <a name="getting-started"> </a>Get started with Event Hubs

[WACOM.INCLUDE [service-bus-selector-get-started](../includes/service-bus-selector-get-started.md)]

Event Hubs is a highly scalable ingestion system that can intake millions of events per second enabling your application to process and analyze the massive amounts of data produced by your connected devices and applications. Once collected into Event Hubs you can transform and store data using any real-time analytics provider or storage cluster.
Please refer to [Event Hubs developer guide] for more information.

In this tutorial, you will learn how to ingest messages into an Event Hub using a console application in C#, and to retrieve them in parallel using Apache Storm.

In order to complete this tutorial you will need:

+ Microsoft Visual Studio Express 2013 for Windows

+ A Java development environment configured to run [Maven](http://maven.apache.org/), we will assume [Eclipse](https://www.eclipse.org/)

+ An active Azure account. <br/>If you don't have an account, you can create a free trial account in just a couple of minutes. For details, see <a href="http://www.windowsazure.com/en-us/pricing/free-trial/?WT.mc_id=A0E0E5C02&amp;returnurl=http%3A%2F%2Fwww.windowsazure.com%2Fen-us%2Fdevelop%2Fmobile%2Ftutorials%2Fget-started%2F" target="_blank">Azure Free Trial</a>.

## Create an event hub

1. Log on to the [Azure Management Portal], and click **NEW** at the bottom of the screen.

2. Click on **App Services**, then **Service Bus**, then **Event Hub**, then **Quick Create**.

   	![][1]

3. Type a name for your notification hub, select your desired Region, and then click **Create a new Event Hub**.

   	![][2]

4. Click the namespace you just created (usually ***event hub name*-ns**).

   	![][3]

5. Select the tab **Event Hubs** at the top, and then click the event hub you just created.

   	![][4]

6. Select the tab **Configure** at the top, add a rule called **SendRule** with *Send* rights, add another rule called **ReceiveRule** with *Listen* rights, then click **Save**.

   	![][5]

7. In the same page, take note of the generated keys for **ReceiveRule**.

   	![][6c]

8. Select the tab **Dashboard** at the top, and then click **Connection Information**. Take note of the two connection strings.

   	![][6]

Your event hub is now created, and you have the connection strings to send and receive events.

[WACOM.INCLUDE [service-bus-event-hubs-get-started-send-csharp](../includes/service-bus-event-hubs-get-started-send-csharp.md)]


[WACOM.INCLUDE [service-bus-event-hubs-get-started-receive-storm](../includes/service-bus-event-hubs-get-started-receive-storm.md)]

## Run the applications

Now you are ready to run your applications.

1.	Run the **LogTopology** class from Eclipse, then wait for it to start the receivers for all the partitions.

2.	Run the **Sender** project, press **Enter** in the console window, and see the events appear in the receiver window.

   	![][22]

<!-- Images. -->
[1]: ./media/service-bus-event-hubs-getstarted/create-event-hub1.png
[2]: ./media/service-bus-event-hubs-getstarted/create-event-hub2.png
[3]: ./media/service-bus-event-hubs-getstarted/create-event-hub3.png
[4]: ./media/service-bus-event-hubs-getstarted/create-event-hub4.png
[5]: ./media/service-bus-event-hubs-getstarted/create-event-hub5.png
[6]: ./media/service-bus-event-hubs-getstarted/create-event-hub6.png
[6c]: ./media/service-bus-event-hubs-getstarted/create-event-hub6c.png

[22]: ./media/service-bus-event-hubs-getstarted/receive-storm1.png

<!-- Links -->
[Azure Management Portal]: https://manage.windowsazure.com/
[Event Processor Host]: https://www.nuget.org/packages/Microsoft.Azure.ServiceBus.EventProcessorHost
[Event Hubs developer guide]: http://msdn.microsoft.com/en-us/library/azure/dn789972.aspx

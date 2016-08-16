<properties
	pageTitle="Get Started with Event Hubs in C# | Microsoft Azure"
	description="Follow this tutorial to get started using Azure Event Hubs; sending events in C# and receiving them in Java using the EventProcessorHost."
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
	ms.topic="hero-article"
	ms.date="06/16/2016"
	ms.author="jtaubensee"/>

# Get started with Event Hubs

[AZURE.INCLUDE [service-bus-selector-get-started](../../includes/service-bus-selector-get-started.md)]

## Introduction

Event Hubs is a service that processes large amounts of event data (telemetry) from connected devices and applications. After you collect data into Event Hubs, you can store the data using a storage cluster or transform it using a real-time analytics provider. This large scale event collection and processing capability is a key component of modern application architectures including the Internet of Things (IoT).

This tutorial shows how to use the Azure classic portal to create an Event Hub. It also shows you how to collect messages into an Event Hub using a console application written in C#, and how to retrieve them in parallel using the Java Event Processor Host library.

In order to complete this tutorial you'll need the following:

+ [Microsoft Visual Studio](http://visualstudio.com)

+ An active Azure account. <br/>If you don't have one, you can create a free account in just a couple of minutes. For details, see [Azure Free Trial](https://azure.microsoft.com/pricing/free-trial/?WT.mc_id=A0E0E5C02&amp;returnurl=http%3A%2F%2Fazure.microsoft.com%2Fen-us%2Fdevelop%2Fmobile%2Ftutorials%2Fget-started%2F target="_blank").

[AZURE.INCLUDE [event-hubs-create-event-hub](../../includes/event-hubs-create-event-hub.md)]

[AZURE.INCLUDE [service-bus-event-hubs-get-started-send-csharp](../../includes/service-bus-event-hubs-get-started-send-csharp.md)]

[AZURE.INCLUDE [service-bus-event-hubs-get-started-receive-ephjava](../../includes/service-bus-event-hubs-get-started-receive-ephjava.md)]

## Run the applications

Now you are ready to run the applications.

1.	Run the **Receiver** project.

	![][21]

2.	Run the **Sender** project.

	![][22]

## Next steps

Now that you've built a working application that creates an Event Hub and sends and receives data, you can move on to the following scenarios:

- A complete [sample application that uses Event Hubs][].
- The [Scale out Event Processing with Event Hubs][] sample.
- A [queued messaging solution][] using Service Bus queues.
- [Event Hubs overview][]

<!-- Images. -->
[21]: ./media/event-hubs-csharp-ephjava-getstarted/ephjava.png
[22]: ./media/event-hubs-csharp-ephjava-getstarted/cs-send.png

<!-- Links -->
[Azure classic portal]: https://manage.windowsazure.com/
[Event Hubs overview]: event-hubs-overview.md
[sample application that uses Event Hubs]: https://code.msdn.microsoft.com/Service-Bus-Event-Hub-286fd097
[Scale out Event Processing with Event Hubs]: https://code.msdn.microsoft.com/Service-Bus-Event-Hub-45f43fc3
[queued messaging solution]: ../service-bus/service-bus-dotnet-multi-tier-app-using-service-bus-queues.md
 

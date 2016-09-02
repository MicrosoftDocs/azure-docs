<properties
	pageTitle="What is Azure Event Hubs? | Microsoft Azure"
	description="Overview and description of Azure Event Hubs"
	services="event-hubs"
	documentationCenter=".net"
	authors="sethmanheim"
	manager="timlt"
	editor=""/>

<tags
	ms.service="event-hubs"
	ms.workload="na"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="get-started-article"
	ms.date="08/17/2016"
	ms.author="sethm"/>

# What is Azure Event Hubs?

Azure Event Hubs is a highly scalable data ingress service that can ingest millions of events per second so that you can process and analyze the massive amounts of data produced by your connected devices and applications. Event Hubs acts as the "front door" for an event pipeline, and once data is collected into an Event Hub, it can be transformed and stored using any real-time analytics provider or batching/storage adapters. Event Hubs decouples the production of a stream of events from the consumption of those events, so that event consumers can access the events on their own schedule. For more information and technical details, see the [Event Hubs overview](event-hubs-overview.md).

## Event Hubs capabilities

Event Hubs is an event processing service that provides event and telemetry processing at massive scale, with low latency and high reliability. This service is especially useful for:

- Application instrumentation
- User experience or workflow processing
- Internet of Things (IoT) scenarios

Some other key Event Hubs capabilities include behavior tracking in mobile apps, traffic information from web farms, in-game event capture in console games, or telemetry collected from industrial machines or connected vehicles.

## Next steps

For detailed information about Event Hubs, see the following topics.

- [Event Hubs overview](event-hubs-overview.md)
- [Event Hubs programming guide](event-hubs-programming-guide.md)
- [Event Hubs availability and support FAQ](event-hubs-availability-and-support-faq.md)
- Get started with an [Event Hubs tutorial][]
- A complete [sample application that uses Event Hubs][]

[Event Hubs tutorial]: event-hubs-csharp-ephcs-getstarted.md
[sample application that uses Event Hubs]: https://code.msdn.microsoft.com/Service-Bus-Event-Hub-286fd097

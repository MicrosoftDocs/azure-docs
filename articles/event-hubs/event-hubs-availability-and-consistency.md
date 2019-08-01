---
title: Availability and consistency - Azure Event Hubs | Microsoft Docs
description: How to provide the maximum amount of availability and consistency with Azure Event Hubs using partitions.
services: event-hubs
documentationcenter: na
author: ShubhaVijayasarathy
manager: timlt
editor: ''

ms.assetid: 8f3637a1-bbd7-481e-be49-b3adf9510ba1
ms.service: event-hubs
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.custom: seodec18
ms.date: 12/06/2018
ms.author: shvija

---

# Availability and consistency in Event Hubs

## Overview
Azure Event Hubs uses a [partitioning model](event-hubs-scalability.md#partitions) to improve availability and parallelization within a single event hub. For example, if an event hub has four partitions, and one of those partitions is moved from one server to another in a load balancing operation, you can still send and receive from three other partitions. Additionally, having more partitions enables you to have more concurrent readers processing your data, improving your aggregate throughput. Understanding the implications of partitioning and ordering in a distributed system is a critical aspect of solution design.

To help explain the trade-off between ordering and availability, see the [CAP theorem](https://en.wikipedia.org/wiki/CAP_theorem), also known as Brewer's theorem. This theorem discusses the choice between consistency, availability, and partition tolerance. It states that for the systems partitioned by network there is always tradeoff between consistency and availability.

Brewer's theorem defines consistency and availability as follows:
* Partition tolerance: the ability of a data processing system to continue processing data even if a partition failure occurs.
* Availability: a non-failing node returns a reasonable response within a reasonable amount of time (with no errors or timeouts).
* Consistency: a read is guaranteed to return the most recent write for a given client.

## Partition tolerance
Event Hubs is built on top of a partitioned data model. You can configure the number of partitions in your event hub during setup, but you cannot change this value later. Since you must use partitions with Event Hubs, you have to make a decision about availability and consistency for your application.

## Availability
The simplest way to get started with Event Hubs is to use the default behavior. If you create a new **[EventHubClient](/dotnet/api/microsoft.azure.eventhubs.eventhubclient)** object and use the **[Send](/dotnet/api/microsoft.azure.eventhubs.eventhubclient.sendasync?view=azure-dotnet#Microsoft_Azure_EventHubs_EventHubClient_SendAsync_Microsoft_Azure_EventHubs_EventData_)** method, your events are automatically distributed between partitions in your event hub. This behavior allows for the greatest amount of up time.

For use cases that require the maximum up time, this model is preferred.

## Consistency
In some scenarios, the ordering of events can be important. For example, you may want your back-end system to process an update command before a delete command. In this instance, you can either set the partition key on an event, or use a `PartitionSender` object to only send events to a certain partition. Doing so ensures that when these events are read from the partition, they are read in order.

With this configuration, keep in mind that if the particular partition to which you are sending is unavailable, you will receive an error response. As a point of comparison, if you do not have an affinity to a single partition, the Event Hubs service sends your event to the next available partition.

One possible solution to ensure ordering, while also maximizing up time, would be to aggregate events as part of your event processing application. The easiest way to accomplish this is to stamp your event with a custom sequence number property. The following code shows an example:

```csharp
// Get the latest sequence number from your application
var sequenceNumber = GetNextSequenceNumber();
// Create a new EventData object by encoding a string as a byte array
var data = new EventData(Encoding.UTF8.GetBytes("This is my message..."));
// Set a custom sequence number property
data.Properties.Add("SequenceNumber", sequenceNumber);
// Send single message async
await eventHubClient.SendAsync(data);
```

This example sends your event to one of the available partitions in your event hub, and sets the corresponding sequence number from your application. This solution requires state to be kept by your processing application, but gives your senders an endpoint that is more likely to be available.

## Next steps
You can learn more about Event Hubs by visiting the following links:

* [Event Hubs service overview](event-hubs-what-is-event-hubs.md)
* [Create an event hub](event-hubs-create.md)

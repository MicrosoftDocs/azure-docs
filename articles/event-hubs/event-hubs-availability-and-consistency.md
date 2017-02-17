---
title: Availability and consistency in Azure Event Hubs | Microsoft Docs
description: Availability and consistency in Azure Event Hubs.
services: event-hubs
documentationcenter: na
author: sethmanheim;jtaubensee
manager: timlt
editor: ''

ms.assetid: 8f3637a1-bbd7-481e-be49-b3adf9510ba1
ms.service: event-hubs
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 02/16/2017
ms.author: sethm;jotaub
---

# Availability and consistency in Event Hubs
## Overview
Azure Event Hubs uses a [partitioning model](event-hubs-what-is-event-hubs.md#partitions) that allows for greater uptime within a single Event Hub. For example, if an Event Hub has four partitions, and one of those partitions has failed, or been taken offline for updates, you can still send and receive from three other partitions. However, Event Hubs can only guarantee the ordering of messages on a single partition. For this reason, it can be benefical to send and receive events from a specific partition.

In order to help explain the tradeoff between ordering and availability, we can look to the [CAP theorem](https://en.wikipedia.org/wiki/CAP_theorem), also known as Brewer’s theorem. The theorem states that, in the presence of a network partition, one must choose between consistency and availability. Since Event Hubs is built on top of a partitioned model, users must make a choice between availability and consistency (or ordering).

The theorem defines consistency and availability as the following:
* Consistency – a read is guaranteed to return the most recent write for a given client.
* Availability – a non-failing node returns a reasonable response within a reasonable amount of time (with no errors or timeouts).

## Availability
The simplest way to get started with Event Hubs is the default behavior. If you create an new `EventHubClient` and use the send function, your events will automatically be distributed between partitions in your Event Hub. This behavior allows for the greatest amount of uptime. 

For use cases that require maximum uptime, this is the preferred model.

## Event ordering
In particular scenarios the ordering of events can be important. For example, you may want your back end system to process an update command before a delete command. In this instance, you can either set the partition key on an event, or use a `PartitionSender` to only send events to a certain partition. This will ensure that when these events are read from the partition, they will be read in order.

With this type of configuration, users must keep in mind that if the particular partition that you are sending to is unavailable, you will receive an error response. As a point of comparison, if you did not have an affinity to a single partition, the Event Hubs service would send your event to the next available partition.

One possible solution to ensure ordering, while also maximizing uptime would be to aggregate events as a part of your event processing applicaton. The easiest way to accomplish this would be to stamp your event with a custom sequence number property. The following is an example of such:

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

The above example would send your event to one of the available partitions in your Event Hub, and set the corresponding sequence number from your application. This solution will require some sort of state to be kept by your processing application, but would give your senders an endpoint that is more likely to be available.

## Next steps
You can learn more about Event Hubs by visiting the following links:

* [Event Hubs overview](event-hubs-what-is-event-hubs.md)
* [Create an Event Hub](event-hubs-create.md)

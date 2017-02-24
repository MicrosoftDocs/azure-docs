---
title: Availability and consistency in Azure Event Hubs | Microsoft Docs
description: How to provide the maximum amount of availability and consistency with Azure Event Hubs using partitions.
services: event-hubs
documentationcenter: na
author: sethmanheim
manager: timlt
editor: ''

ms.assetid: 8f3637a1-bbd7-481e-be49-b3adf9510ba1
ms.service: event-hubs
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 02/21/2017
ms.author: sethm;jotaub
---

# Availability and consistency in Event Hubs

## Overview
Azure Event Hubs uses a [partitioning model](event-hubs-what-is-event-hubs.md#partitions) to improve availability and parallelization within a single Event Hub. For example, if an Event Hub has four partitions, and one of those partitions is moved from one server to another in a load balancing operation, you can still send and receive from three other partitions. Additionally, more partitions enables you to have more concurrent readers processing your data, improving your aggregate throughput. Understanding the implications of partitioning and ordering in a distributed system is a critical aspect of solution design.

To help explain the tradeoff between ordering and availability, see the [CAP theorem](https://en.wikipedia.org/wiki/CAP_theorem), also known as Brewer's theorem. This theorem states that one must choose between consistency, availability, and partition tolerance.

Brewer's theorem defines consistency and availability as follows:
* Partition tolerance - the ability of a data processing system to continue processing data even if a partition failure occurs.
* Availability - a non-failing node returns a reasonable response within a reasonable amount of time (with no errors or timeouts).
* Consistency - a read is guaranteed to return the most recent write for a given client.

## Partition tolerance
Event Hubs is built on top of a partitioned model. You may configure the number of partitions in your Event Hub during setup, but you cannot change this value later. Since you must use partitions with Event Hubs, you only need to make a decision regarding availability and consistency for your application.

## Availability
The simplest way to get started with Event Hubs is the default behavior. If you create an new `EventHubClient` and use the send function, your events are automatically distributed between partitions in your Event Hub. This behavior allows for the greatest amount of uptime.

For use cases that require maximum uptime, this model is preferred.

## Consistency
In particular scenarios, the ordering of events can be important. For example, you may want your back-end system to process an update command before a delete command. In this instance, you can either set the partition key on an event, or use a `PartitionSender` to only send events to a certain partition. Doing so ensures that when these events are read from the partition, they are read in order.

With this type of configuration, you must keep in mind that if the particular partition that you are sending to is unavailable, you will receive an error response. As a point of comparison, if you did not have an affinity to a single partition, the Event Hubs service would send your event to the next available partition.

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

The preceeding example would send your event to one of the available partitions in your Event Hub, and set the corresponding sequence number from your application. This solution requires state to be kept by your processing application, but would give your senders an endpoint that is more likely to be available.

## Next steps
You can learn more about Event Hubs by visiting the following links:

* [Event Hubs overview](event-hubs-what-is-event-hubs.md)
* [Create an Event Hub](event-hubs-create.md)

---
title: Availability vs. Consistency in Azure Event Hubs | Microsoft Docs
description: Availability vs. Consistency in Azure Event Hubs.
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
ms.date: 02/16/2017
ms.author: sethm
---

# Availability and consistency in Event Hubs
This article discusses the tradeoff between availability and consistency as it pertains to managing Event Hubs events and messages. A common usage pattern in Event Hubs is to have event publishers take a strong dependency on specific [partitions](event-hubs-what-is-event-hubs.md#partitions). While this is possible and in some cases desirable, it’s important to understand the trade-offs inherent in a tightly coupled partition dependency, and to discuss alternatives.

## Overview
Azure Event Hubs uses a partitioning model that allows for greater uptime within a single Event Hub. For example, if an Event Hub has four partitions, and one of those partitions has failed, or been taken offline for updates, you can still send and receive from three other partitions. However, Event Hubs can only guarantee the ordering of messages on a single partition. For this reason, it can be benefical to use either partition keys, or partition senders to ensure the proper ordering of events.

In order to help explain the tradeoff between ordering and availability, we can look to the [CAP theorem](https://en.wikipedia.org/wiki/CAP_theorem), also known as Brewer’s theorem. The theorem states that, in the presence of a network partition, one must choose between consistency and availability. Since Event Hubs is built on top of a partitioned model, users must make a choice between availability and consistency (or ordering).

The theorem defines consistency and availability as the following:
* Consistency – a read is guaranteed to return the most recent write for a given client.
* Availability – a non-failing node returns a reasonable response within a reasonable amount of time (with no errors or timeouts).

## Consistency
Waiting for a response from a partitioned node can result in a timeout error. For example, in the Event Hubs scenario, you can use a sender pattern that takes a dependency on a partition by specifying the partition key or partition ID. The reason for this is the need for tightly coupled ordering, with no other workaround for ordering the events other than taking this dependency on partitions. Again, partition dependency requires a single node to be present all the time. However, network failures and updates are inevitable, requiring reboots and node patching. You can always maintain such order on events or messages in an Event Hub by assigning an ID to the message.

As such, it’s important to choose consistency over availability when your business requires atomic reads and/or writes.

```
  // Code sample here
```

## Availability
Availability implies always returning the most recently available version of your event, message, or data. For example, if you send messages to Event Hubs in a particular sequence, you might not always read the messages in the same order in which they were sent. Note that Event Hubs will never send an acknowledgement without persisting the data to disk.

Availability ensures that an always-on (always available) system continues to function even in the presence of external errors. If your business allows flexibility around the timeframe in which the data synchronizes in the system, and you can manage consistency without dependency on partitions, availability will be the choice over consistency.

## Summary
Knowing that the tradeoff between availability and consistency is inherent in a distributed system, and that 100% network reliability is not achievable in today’s world, you should make that choice based on your business requirements. 

Distributed systems can take advantage of the many benefits it offers, but also adds complexity. Accepting the trade-offs that the networking world offers, it’s important to choose the right path to build more robust and successful applications. 

## Next steps
You can learn more about Event Hubs by visiting the following links:

* [Event Hubs overview](event-hubs-what-is-event-hubs.md)
* [Create an Event Hub](event-hubs-create.md)

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

# Availability vs. Consistency in Event Hubs
This article discusses the tradeoff between availability and consistency as it pertains to managing Event Hubs events and messages. A common usage pattern in Event Hubs is to have event publishers take a strong dependency on partitions. While this is possible and in some cases desirable, it’s important to understand the trade-offs inherent in a tightly coupled partition dependency, and to discuss alternatives.

## Overview
In today’s computing world, to scale out and achieve completion in a given time frame, systems might need infinite resources, such as compute, storage, etc. In a distributed computing world, scale comes along with complexity, and Brewer’s theorem explains this.

[Brewer’s theorem](https://en.wikipedia.org/wiki/CAP_theorem), also known as the CAP theorem, states that, in the presence of a network partition, one must choose between consistency and availability. In describing this theory, network partitioning refers to a collection of interconnected nodes that share data.

In discussing the choice between availability and consistency, consider these in the context of a network partition.
* Consistency –a read is guaranteed to return the most recent write for a given client.
* Availability – a non-failing node returns a reasonable response within a reasonable amount of time (with no errors or timeouts).
* Partition tolerance –the ability of a data processing system to continue processing data even if a network partition failure occurs.

In reality, networks are not always reliable. Networks, or parts of networks, can go down unexpectedly and frequently, and you cannot control these failures or predict when they happen.

To help mitigate this unreliability, you can use Event Hubs partitions. Partitions are under your control, which implies the CAP theorem – choosing consistency over availability.

## Consistency
Waiting for a response from a partitioned node can result in a timeout error. For example, in the Event Hubs scenario, you can use a sender pattern that takes a dependency on a partition by specifying the partition key or partition ID. The reason for this is the need for tightly coupled ordering, with no other workaround for ordering the events other than taking this dependency on partitions. Again, partition dependency requires a single node to be present all the time. However, network failures and updates are inevitable, requiring reboots and node patching. You can always maintain such order on events or messages in an Event Hub by assigning an ID to the message.

As such, it’s important to choose consistency over availability when your business requires atomic reads and/or writes.

```
  // Code sample here
```

## Availability
Availability implies always returning the most recently available version of your event, message, or data. If you identify your events with sequence numbers, rather than use partitions, you may not receive events in the order in which they were sent. In other words, you need to have some sort of aggregation process on the backend. Note that Event Hubs will never send an acknowledgement without persisting the data to disk.

If your business allows flexibility around the timeframe in which the data synchronizes within the system, and you can manage the synchronization without compromising on availability, you might be able to rely on consistency along with partition tolerance. Or, you might need an always-on (always available) system to continue functioning even with external errors.

## Summary
Knowing that the tradeoff between availability and consistency is inherent in a distributed system, and that 100% network reliability is not achievable in today’s world, you should make that choice based on your business requirements. 

Distributed systems can take advantage of the many benefits it offers, but also adds complexity. Accepting the trade-offs that the networking world offers, it’s important to choose the right path to build more robust and successful applications. 

## Next steps
You can learn more about Event Hubs by visiting the following links:

* [Event Hubs overview](event-hubs-what-is-event-hubs.md)
* [Create an Event Hub](event-hubs-create.md)

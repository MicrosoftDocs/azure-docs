---
title: Service Bus asynchronous messaging | Microsoft Docs
description: Learn how Azure Service Bus supports asynchronism via a store and forward mechanism with queues, topics, and subscriptions. 
ms.topic: article
ms.custom: ignite-2022
ms.date: 04/23/2021
---

# Asynchronous messaging patterns and high availability

Asynchronous messaging can be implemented in a variety of different ways. With queues, topics, and subscriptions, Azure Service Bus supports asynchronism via a store and forward mechanism. In normal (synchronous) operation, you send messages to queues and topics, and receive messages from queues and subscriptions. Applications you write depend on these entities always being available. When the entity health changes, due to a variety of circumstances, you need a way to provide a reduced capability entity that can satisfy most needs.

Applications typically use asynchronous messaging patterns to enable a number of communication scenarios. You can build applications in which clients can send messages to services, even when the service is not running. For applications that experience bursts of communications, a queue can help [level the load](/azure/architecture/patterns/queue-based-load-leveling) by providing a place to buffer communications. Finally, you can get a simple but effective load balancer to distribute messages across multiple machines.

In order to maintain availability of any of these entities, consider a number of different ways in which these entities can appear unavailable for a durable messaging system. Generally speaking, we see the entity becomes unavailable to applications we write in the following different ways:

* Unable to send messages.
* Unable to receive messages.
* Unable to manage entities (create, retrieve, update, or delete entities).
* Unable to contact the service.

For each of these failures, different failure modes exist that enable an application to continue to perform work at some level of reduced capability. For example, a system that can send messages but not receive them can still receive orders from customers but cannot process those orders. This topic discusses potential issues that can occur, and how those issues are mitigated. Service Bus has introduced a number of mitigations which you must opt into, and this topic also discusses the rules governing the use of those opt-in mitigations.

## Reliability in Service Bus
There are several ways to handle message and entity issues, and there are guidelines governing the appropriate use of those mitigations. To understand the guidelines, you must first understand what can fail in Service Bus. Due to the design of Azure systems, all of these issues tend to be short-lived. At a high level, the different causes of unavailability appear as follows:

* Throttling from an external system on which Service Bus depends. Throttling occurs from interactions with storage and compute resources.
* Issue for a system on which Service Bus depends. For example, a given part of storage can encounter issues.
* Failure of Service Bus on single subsystem. In this situation, a compute node can get into an inconsistent state and must restart itself, causing all entities it serves to load balance to other nodes. This in turn can cause a short period of slow message processing.
* Failure of Service Bus within an Azure data-center. This is a "catastrophic failure" during which the system is unreachable for many minutes or a few hours.

> [!NOTE]
> The term **storage** can mean both Azure Storage and SQL Azure.
> 
> 

Service Bus contains a number of mitigations for these issues. The following sections discuss each issue and their respective mitigations.

### Throttling
With Service Bus, throttling enables cooperative message rate management. Each individual Service Bus node houses many entities. Each of those entities makes demands on the system in terms of CPU, memory, storage, and other facets. When any of these facets detects usage that exceeds defined thresholds, Service Bus can deny a given request. The caller receives a server busy exception and retries after 10 seconds.

As a mitigation, the code must read the error and halt any retries of the message for at least 10 seconds. Since the error can happen across pieces of the customer application, it is expected that each piece independently executes the [retry logic](/azure/architecture/best-practices/retry-service-specific#service-bus). The code can reduce the probability of being throttled by enabling partitioning on a namespace, queue or topic.

For more information on how application code should handle throttling concerns, see the [documentation on the Throttling Pattern](/azure/architecture/patterns/throttling).

### Issue for an Azure dependency
Other components within Azure can occasionally have service issues. For example, when a system that Service Bus uses is being upgraded, that system can temporarily experience reduced capabilities. To work around these types of issues, Service Bus regularly investigates and implements mitigations. Side effects of these mitigations do appear. For example, to handle transient issues with storage, Service Bus implements a system that allows message send operations to work consistently. Due to the nature of the mitigation, a sent message can take up to 15 minutes to appear in the affected queue or subscription and be ready for a receive operation. Generally speaking, most entities will not experience this issue. However, given the number of entities in Service Bus within Azure, this mitigation is sometimes needed for a small subset of Service Bus customers.

### Service Bus failure on a single subsystem
With any application, circumstances can cause an internal component of Service Bus to become inconsistent. When Service Bus detects this, it collects data from the application to aid in diagnosing what happened. Once the data is collected, the application is restarted in an attempt to return it to a consistent state. This process happens fairly quickly, and results in an entity appearing to be unavailable for up to a few minutes, though typical down times are much shorter.

In these cases, the client application generates a timeout exception or a messaging exception. Service Bus contains a mitigation for this issue in the form of automated client retry logic. Once the retry period is exhausted and the message is not delivered, you can explore using other mentioned in the article on [handling outages and disasters][handling outages and disasters].

## Next steps
Now that you've learned the basics of asynchronous messaging in Service Bus, read more details about [handling outages and disasters][handling outages and disasters].

[Best practices for insulating applications against Service Bus outages and disasters]: service-bus-outages-disasters.md
[handling outages and disasters]: service-bus-outages-disasters.md

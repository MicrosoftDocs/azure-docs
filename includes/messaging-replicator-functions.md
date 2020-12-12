---
 title: include file
 description: include file
 services: service-bus-messaging, event-hubs
 author: spelluru
 ms.service: service-bus-messaging, event-hubs
 ms.topic: include
 ms.date: 12/12/2020
 ms.author: spelluru
 ms.custom: include file
---


## What is a replication task?

A replication task receives events from a source and forwards them to a target. Most replication tasks will forward events unchanged and at most perform mapping between metadata structures if the source and target protocols differ. 

Replication tasks are generally stateless, meaning that they do not share state or other side-effects across sequential or parallel executions of a task. That is also true for batching and chaining, which can both be implemented on top of the existing state of a stream. 

This makes replication tasks different from aggregation tasks, which are generally stateful, and are the domain of analytics frameworks and services like [Azure Stream Analytics](../stream-analytics/stream-analytics-introduction.md).

[!INCLUDE [messaging-replicator-functions](../../includes/messaging-replicator-functions.md)]
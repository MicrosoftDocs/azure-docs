---
title: Frequently asked questions - Azure Event Hubs for Apache Kafka 
description: This article shows how consumers and producers that use different protocols (AMQP, Apache Kafka, and HTTPS) can exchange events when using Azure Event Hubs. 
ms.topic: article
ms.date: 06/23/2020
---

# Frequently asked questions - Event Hubs for Apache Kafka 
This article provides answers to some of the frequently asked questions on migrating to Event Hubs for Apache Kafka.

## Do you run Apache Kafka?

No.  We execute Kafka API operations against Event Hubs infrastructure.  Because there's a tight correlation between Apache Kafka and Event Hubs AMQP functionality (that is, produce, receive, management, so on.), we're able to bring the known reliability of Event Hubs to the Kafka PaaS space.

## Event Hubs consumer group vs. Kafka consumer group
What's the difference between an Event Hub consumer group and a Kafka consumer group on Event Hubs? Kafka consumer groups on Event Hubs are fully distinct from standard Event Hubs consumer groups.

**Event Hubs consumer groups**

- They are Managed with create, retrieve, update, and delete (CRUD) operations via portal, SDK, or Azure Resource Manager templates. Event Hubs consumer groups can't be autocreated.
- They are children entities of an event hub. It means that the same consumer group name can be reused between event hubs in the same namespace because they're separate entities.
- They aren't used for storing offsets. Orchestrated AMQP consumption is done using external offset storage, for example, Azure Storage.

**Kafka consumer groups**

- They are autocreated.  Kafka groups can be managed via the Kafka consumer group APIs.
- They can store offsets in the Event Hubs service.
- They are used as keys in what is effectively an offset key-value store. For a unique pair of `group.id` and `topic-partition`, we store an offset in Azure Storage (3x replication). Event Hubs users don't incur extra storage costs from storing Kafka offsets. Offsets are manipulable via the Kafka consumer group APIs, but the offset storage *accounts* aren't directly visible or manipulable for Event Hub users.  
- They span a namespace. Using the same Kafka group name for multiple applications on multiple topics means that all applications and their Kafka clients will be rebalanced whenever only a single application needs rebalancing.  Choose your group names wisely.
- They fully distinct from Event Hubs consumer groups. You **don't** need to use '$Default', nor do you need to worry about Kafka clients interfering with AMQP workloads.
- They aren't viewable in the Azure portal. Consumer group info is accessible via Kafka APIs.

## Next steps
To learn more about Event Hubs and Event Hubs for Kafka, see the following articles:  

- [Apache Kafka developer guide for Event Hubs](apache-kafka-developer-guide.md)
- [Apache Kafka migration guide for Event Hubs](apache-kafka-migration-guide.md)
- [Apache Kafka troubleshooting guide for Event Hubs](apache-kafka-troubleshooting-guide.md)
- [Recommended configurations](https://github.com/Azure/azure-event-hubs-for-kafka/blob/master/CONFIGURATION.md)


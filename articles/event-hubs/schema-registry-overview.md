---
title: Use Azure Schema Registry from Apache Kafka and other apps
description: This article provides an overview of Schema Registry support by Azure Event Hubs and how it can be used from your Apache Kafka and other apps. 
ms.topic: overview
ms.date: 07/28/2023
ms.custom: references_regions, ignite-fall-2021
---

# Use Azure Schema Registry in Event Hubs from Apache Kafka and other apps
In many event streaming and messaging scenarios, the event or message payload contains structured data. Schema-driven formats such as [Apache Avro](https://avro.apache.org/) are often used to serialize or deserialize such structured data. 

An event producer uses a schema to serialize event payload and publish it to an event broker such as Event Hubs. Event consumers read event payload from the broker and deserialize it using the same schema. So, both producers and consumers can validate the integrity of the data with the same schema. 

:::image type="content" source="./media/schema-registry-overview/schema-driven-ser-de.svg" alt-text="Image showing producers and consumers serializing and deserializing event payload using schemas from the Schema Registry. ":::

## What is Azure Schema Registry?
**Azure Schema Registry** is a feature of Event Hubs, which provides a central repository for schemas for event-driven and messaging-centric applications. It provides the flexibility for your producer and consumer applications to **exchange data without having to manage and share the schema**. It also provides a simple governance framework for reusable schemas and defines relationship between schemas through a grouping construct (schema groups).

:::image type="content" source="./media/schema-registry-overview/schema-registry.svg" alt-text="Image showing a producer and a consumer serializing and deserializing event payload using a schema from the Schema Registry." border="false":::

With schema-driven serialization frameworks like Apache Avro, moving serialization metadata into shared schemas can also help with **reducing the per-message overhead**. It's because each message doesn't need to have the metadata (type information and field names) as it's the case with tagged formats such as JSON. 

> [!NOTE]
> The feature isn't available in the **basic** tier.

Having schemas stored alongside the events and inside the eventing infrastructure ensures that the metadata that's required for serialization or deserialization is always in reach and schemas can't be misplaced. 

## Next steps

- To learn more about Azure Schema registry, see [Azure Schema Registry Concepts](schema-registry-concepts.md).
- To learn how to create a schema registry using the Azure portal, see [Create an Event Hubs schema registry using the Azure portal](create-schema-registry.md).
- See the following **Schema Registry Avro client library** samples.
    - [.NET](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/schemaregistry/Microsoft.Azure.Data.SchemaRegistry.ApacheAvro/tests/Samples)
    - [Java](https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/schemaregistry/azure-data-schemaregistry-apacheavro/src/samples)
    - [JavaScript](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/schemaregistry/schema-registry-avro/samples)
    - [Python](https://github.com/Azure/azure-sdk-for-python/tree/main/sdk/schemaregistry/azure-schemaregistry-avroencoder/samples)
    - [Kafka Avro Integration for Azure Schema Registry](https://github.com/Azure/azure-schema-registry-for-kafka/tree/master/csharp/avro/samples)

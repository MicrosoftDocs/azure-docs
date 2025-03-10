---
title: Azure Schema Registry in Azure Event Hubs
description: This article provides an overview of Schema Registry support by Azure Event Hubs and how it can be used from your Apache Kafka and other apps.
ms.topic: concept-article
ms.date: 12/02/2024
ms.custom: references_regions
# Customer intent: As an Azure Event Hubs user, I want to know how Azure Event Hubs supports registering schemas and using them in sending and receiving events. 
---

# Azure Schema Registry in Event Hubs

Event streaming and messaging scenarios often deal with structured data in the event or message payload. However, the structured data is of little value to the event broker, which only deals with bytes. Schema-driven formats such as [Apache Avro](https://avro.apache.org/), [JSONSchema](https://json-schema.org/), or [Protobuf](https://protobuf.dev/) are often used to serialize or deserialize such structured data to/from binary.

An event producer uses a schema definition to serialize event payload and publish it to an event broker such as Event Hubs. Event consumers read event payload from the broker and deserialize it using the same schema definition. 

So, both producers and consumers can validate the integrity of the data with the same schema. 

:::image type="content" source="./media/schema-registry-overview/schema-driven-ser-de.svg" alt-text="Image showing producers and consumers serializing and deserializing event payload using schemas from the Schema Registry. ":::

## What is Azure Schema Registry?
**Azure Schema Registry** is a feature of Event Hubs, which provides a central repository for schemas for event-driven and messaging-centric applications. It provides the flexibility for your producer and consumer applications to **exchange data without having to manage and share the schema**. It also provides a simple governance framework for reusable schemas and defines relationship between schemas through a logical grouping construct (schema groups).

:::image type="content" source="./media/schema-registry-overview/schema-registry.svg" alt-text="Image showing a producer and a consumer serializing and deserializing event payload using a schema from the Schema Registry." border="false":::

With schema-driven serialization frameworks like Apache Avro, JSONSchema and Protobuf, moving serialization metadata into shared schemas can also help with **reducing the per-message overhead**. It's because each message doesn't need to have the metadata (type information and field names) as it's the case with tagged formats such as JSON. 

> [!NOTE]
> The feature is available in the **Standard**, **Premium**, and **Dedicated** tier.
>

Having schemas stored alongside the events and inside the eventing infrastructure ensures that the metadata required for serialization or deserialization is always in reach and schemas can't be misplaced. 

## Related content

- To learn more about Azure Schema registry, see [Azure Schema Registry Concepts](schema-registry-concepts.md).
- To learn how to create a schema registry using the Azure portal, see [Create an Event Hubs schema registry using the Azure portal](create-schema-registry.md).
- See the following **Schema Registry Avro client library** samples.
    - [.NET](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/schemaregistry/Microsoft.Azure.Data.SchemaRegistry.ApacheAvro/tests/Samples)
    - [Java](https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/schemaregistry/azure-data-schemaregistry-apacheavro/src/samples)
    - [JavaScript](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/schemaregistry/schema-registry-avro/samples)
    - [Python](https://github.com/Azure/azure-sdk-for-python/tree/main/sdk/schemaregistry/azure-schemaregistry-avroencoder/samples)
    - [Kafka Avro Integration for Azure Schema Registry](https://github.com/Azure/azure-schema-registry-for-kafka/tree/master/csharp/avro/samples)

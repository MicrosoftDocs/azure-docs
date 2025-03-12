---
title: Client-Side Schema Enforcement - Schema Registry
description: This article provides information on using schemas in a schema registry when publishing or consuming events from Azure Event Hubs. 
ms.topic: conceptual
ms.date: 04/26/2023
author: spelluru
ms.author: spelluru
---

# Client-side schema enforcement

Client-side schema enforcement ensures that data is validated against schemas defined in the schema registry on the client side rather than the broker/server side. The producer application can use schemas to validate and serialize data before sending the data to an event hub. Similarly, a consumer application can deserialize and validate data after it receives events from an event hub.

Client-side schema enforcement ensures that data is validated on the client side. The producer application sends the data, and the consumer application receives it. That data is validated against schemas defined in the schema registry on the client side rather than the broker/server side.

This diagram illustrates the flow:

:::image type="content" source="./media/schema-registry-overview/information-flow.svg" alt-text="Diagram that shows the schema registry information flow." border="false":::

> [!NOTE]
> The diagram showcases the information flow when event producers and consumers use a schema registry with the Kafka protocol and Avro schema. Other protocols and schema formats work in a similar way.
>

### Producer

1. The Kafka producer application uses `KafkaAvroSerializer` to serialize event data by using the specified schema. The producer application provides details of the schema registry endpoint and other optional parameters that are required for schema validation.

1. The serializer looks for the schema in the schema registry to serialize event data. If it finds the schema, then the corresponding schema ID is returned. You can configure the producer application to automatically register the schema with the schema registry if it doesn't exist.

1. The serializer prepends the schema ID to the serialized data that's published to the event hub.

### Consumer

1. The Kafka consumer application uses `KafkaAvroDeserializer` to deserialize data that it receives from the event hub.

1. The deserializer uses the schema ID (prepended by the producer) to retrieve the schema from the schema registry.

1. The deserializer uses the schema to deserialize event data that it receives from the event hub.

1. The schema registry client uses caching to prevent redundant schema registry lookups in the future.  

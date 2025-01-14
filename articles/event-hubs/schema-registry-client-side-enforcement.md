---
title: Client-side schema enforcement - Schema Registry
description: This article provides information on using schemas in a schema registry when publishing or consuming events from Azure Event Hubs. 
ms.topic: conceptual
ms.date: 04/26/2023
author: spelluru
ms.author: spelluru
---

# Client-side schema enforcement

Client-side schema enforcement ensures that the data sent by the producer application and received by the consumer application is validated against the schemas defined in the Schema Registry on the client side itself (that is, rather than on the broker/server side).

This flow is illustrated as shown - 

:::image type="content" source="./media/schema-registry-overview/information-flow.svg" alt-text="Image showing the Schema Registry information flow." border="false":::

> [!NOTE]
> While the diagram showcases the information flow when event producers and consumers use Schema Registry with the **Kafka** protocol and **Avro** schema, it doesn't really change for other protocols and schema formats.
>

### Producer  

1. Kafka producer application uses `KafkaAvroSerializer` to serialize event data using the specified schema. Producer application provides details of the schema registry endpoint and other optional parameters that are required for schema validation. 

2. The serializer looks for the schema in the schema registry to serialize event data. If it finds the schema, then the corresponding schema ID is returned. You can configure the producer application to auto register the schema with the schema registry if it doesn't exist.

3. Then the serializer prepends the schema ID to the serialized data that is published to the Event Hubs. 

### Consumer 

1. Kafka consumer application uses `KafkaAvroDeserializer` to deserialize data that it receives from the event hub.

2. The deserializer uses the schema ID (prepended by the producer) to retrieve schema from the schema registry.

3. The deserializer uses the schema to deserialize event data that it receives from the event hub. 

4. The schema registry client uses caching to prevent redundant schema registry lookups in the future.  

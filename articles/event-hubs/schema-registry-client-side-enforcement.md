---
title: Client-side schema enforcement - Schema Registry
description: This article provides information on using schemas in a schema registry when publishing or consuming events from Azure Event Hubs. 
ms.topic: conceptual
ms.date: 04/26/2023
author: kasun04
ms.author: kindrasiri
---

# Client-side schema enforcement 
The information flow when you use schema registry is the same for all protocols that you use to publish or consume events from Azure Event Hubs. 

The following diagram shows how the information flows when event producers and consumers use Schema Registry with the **Kafka** protocol using **Avro** serialization.  

:::image type="content" source="./media/schema-registry-overview/information-flow.svg" alt-text="Image showing the Schema Registry information flow." border="false":::

### Producer  

1. Kafka producer application uses `KafkaAvroSerializer` to serialize event data using the specified schema. Producer application provides details of the schema registry endpoint and other optional parameters that are required for schema validation. 
1. The serializer looks for the schema in the schema registry to serialize event data. If it finds the schema, then the corresponding schema ID is returned. You can configure the producer application to auto register the schema with the schema registry if it doesn't exist. 
1. Then the serializer prepends the schema ID to the serialized data that is published to the Event Hubs. 

### Consumer 

1. Kafka consumer application uses `KafkaAvroDeserializer` to deserialize data that it receives from the event hub.
1. The deserializer uses the schema ID (prepended by the producer) to retrieve schema from the schema registry.
1. The deserializer uses the schema to deserialize event data that it receives from the event hub. 
1. The schema registry client uses caching to prevent redundant schema registry lookups in the future.  

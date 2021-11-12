---
title: Azure Schema Registry in Azure Event Hubs
description: This article provides an overview of Schema Registry support by Azure Event Hubs.
ms.topic: overview
ms.date: 11/02/2021
ms.custom: references_regions, ignite-fall-2021
---

# Azure Schema Registry in Azure Event Hubs
In many event streaming and messaging scenarios, the event or message payload contains structured data. Schema-driven format such as [Apache Avro](https://avro.apache.org/) are often used to serialized or deserialize such structured data. 

:::image type="content" source="./media/schema-registry-overview/schema-driven-ser-de.svg" alt-text="Schema driven serialization/de-serialization":::

The producer applications use schema document to serialize the event payload and publish it to an  event broker such as Event Hubs. Similarly the consumer applications read event payload from the broker and de-serialize it using the same schema document. So, both the producers and the consumers can validate the integrity of the data with a schema document. 


## Why we need a Schema Registry? 
When you use schema driven formats, the producer applications want the schemas of the events published make available to the consumers. It's possible to share the corresponding schema with each and every event data but that inefficient. When the new consumers want to consume event data, they should have a way to understand the format of data that is being published. We also need to make sure that we support schema evolution so that both producers and consumers can evolve at different rates. 


## Azure Schema Registry
The **Azure Schema Registry** is a feature of Event Hubs, which provides a central repository for schema documents for event-driven and messaging-centric applications. It provides the flexibility for your producer and consumer applications to exchange data without having to manage and share the schema. The Schema Registry also provides a simple governance framework for reusable schemas and defines the relationship between schemas through a grouping construct (schema groups).

:::image type="content" source="./media/schema-registry-overview/schema-registry.svg" alt-text="Schema Registry":::

With schema-driven serialization frameworks like Apache Avro, externalizing serialization metadata into shared schemas can also help with dramatically reducing the per-message overhead of type information and field names included with every data set as it's the case with tagged formats such as JSON. Having schemas stored alongside the events and inside the eventing infrastructure ensures that the metadata required for serialization/de-serialization is always in reach and schemas can't be misplaced. 

> [!NOTE]
> The feature isn't available in the **basic** tier.

## Schema Registry information flow 
The information flow when you use schema registry is the same for all the protocol that you use to publish or consume events from Azure Event Hubs. 
The following diagram shows the information flow of a Kafka event producer and consumer scenario that users Schema Registry. 

:::image type="content" source="./media/schema-registry-overview/information-flow.svg" lightbox="./media/schema-registry-overview/information-flow.svg" alt-text="Image showing the Schema Registry information flow.":::


The information flow starts from the producer side where Kafka producers serialize the data using the schema document. 
- The Kafka producer application uses ``KafkaAvroSerializer`` to serialize event data using the schema specified at the client side. 
- Producer application must provide the details of the schema registry endpoint and other optional parameters that are required for schema validation. 
- The serializer does a lookup in the schema registry using the schema content that producer uses to serialize event data. 
- If it finds such a schema, then the corresponding schema ID is returned. You can configure the producer application to If the schema does not exist, the producer application can configure schema registry client to auto register the schema. 
- Then the serializer uses that schema ID and prepends that to the serialized data that is published to the Event Hubs. 
- At the consumer side, ``KafkaAvroDeserializer`` uses the schema ID to retrieve the schema content from Schema Registry. 
- The de-serializer then uses the schema content to deserialize event data that it read from the Event Hub. 
- Schema registry clients use caching to prevent redundant schema registry lookups.  


## Schema Registry elements

An Event Hubs namespace now can host schema groups alongside event hubs (or Kafka topics). It hosts a schema registry and can have multiple schema groups. In spite of being hosted in Azure Event Hubs, the schema registry can be used universally with all Azure messaging services and any other message or events broker. Each of these schema groups is a separately securable repository for a set of schemas. Groups can be aligned with a particular application or an organizational unit. 

:::image type="content" source="./media/schema-registry-overview/elements.png" alt-text="Image showing the Schema Registry elements.":::


### Schema groups
Schema group is a logical group of similar schemas based on your business criteria. A schema group can hold multiple versions of a schema. The compatibility enforcement setting on a schema group can help ensure that newer schema versions are backwards compatible.

The security boundary imposed by the grouping mechanism help ensures that trade secrets don't inadvertently leak through metadata in situations where the namespace is shared among multiple partners. It also allows for application owners to manage schemas independent of other applications that share the same namespace.

### Schemas
Schemas define the contract between the producers and the consumers. A schema defined in an Event Hubs schema registry helps manage the contract outside of event data, thus removing the payload overhead. A schema has a name, type (example: record, array, and so on.), compatibility mode (none, forward, backward, full), and serialization type (only Avro for now). You can create multiple versions of a schema and retrieve and use a specific version of a schema. 

## Schema evolution 

Schemas need to evolve with the business requirement of producers and consumers. Azure Schema Registry supports schema evolution by introducing compatibility modes at the schema group level. When you create a schema group, you can specify the compatibility mode of the schemas that you include in that schema group. When you update a schema, the change should  comply with the assigned compatibility mode and then only it creates a new version of the schema. 

Azure Schema Registry for Event Hubs support following compatibility modes. 

### Backward compatibility
Backward compatibility mode allows the consumer code to use a new version of schema but it can process messages with old version of the schema. When you use backward compatibility mode in a schema group, it allows following changes to be made on a schema. 

- Delete fields. 
- Add optional fields. 


### Forward compatibility
Forward compatibility allows the consumer code to use an old version of the schema but it can read messages with the new schema. Forward compatibility mode allows following changes to be made on a schema. 
- Add fields 
- Delete optional fields 


### No compatibility
When the ``None`` compatibility mode is used, the schema registry doesn't to any compatibility checks when you update schemas. 

## Client SDKs

You can use one of the following libraries to that include an Avro serializer, which you can use to serialize and deserialize payloads containing Schema Registry schema identifiers and Avro-encoded data.

- [.NET - Microsoft.Azure.Data.SchemaRegistry.ApacheAvro](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/schemaregistry/Microsoft.Azure.Data.SchemaRegistry.ApacheAvro)
- [Java - azure-data-schemaregistry-avro](https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/schemaregistry/azure-data-schemaregistry-apacheavro)
- [Python - azure-schemaregistry-avroserializer](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/schemaregistry/azure-schemaregistry-avroserializer)
- [JavaScript - @azure/schema-registry-avro](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/schemaregistry/schema-registry-avro)
- [Apache Kafka](https://github.com/Azure/azure-schema-registry-for-kafka/) - Run Kafka-integrated Apache Avro serializers and deserializers backed by Azure Schema Registry. The Java client's Apache Kafka client serializer for the Azure Schema Registry can be used in any Apache Kafka scenario and with any Apache Kafka® based deployment or cloud service. 

## Limits
For limits (for example: number of schema groups in a namespace) of Event Hubs, see [Event Hubs quotas and limits](event-hubs-quotas.md)

## Azure role-based access control
When accessing the schema registry programmatically, you need to register an application in Azure Active Directory (Azure AD) and add the security principal of the application to one of the Azure role-based access control (Azure RBAC) roles:

| Role | Description | 
| ---- | ----------- | 
| Owner | Read, write, and delete Schema Registry groups and schemas. |
| Contributor | Read, write, and delete Schema Registry groups and schemas. |
| [Schema Registry Reader](../role-based-access-control/built-in-roles.md#schema-registry-reader-preview) | Read and list Schema Registry groups and schemas. |
| [Schema Registry Contributor](../role-based-access-control/built-in-roles.md#schema-registry-reader-preview) | Read, write, and delete Schema Registry groups and schemas. |

For instructions on creating registering an application using the Azure portal, see [Register an app with Azure AD](../active-directory/develop/quickstart-register-app.md). Note down the client ID (application ID), tenant ID, and the secret to use in the code. 

## Next steps

- To learn how to create a schema registry using the Azure portal, see [Create an Event Hubs schema registry using the Azure portal](create-schema-registry.md).
- See the following **Schema Registry Avro client library** samples.
    - [.NET](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/schemaregistry/Microsoft.Azure.Data.SchemaRegistry.ApacheAvro/tests/Samples)
    - [Java](https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/schemaregistry/azure-data-schemaregistry-apacheavro/src/samples)
    - [JavaScript](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/schemaregistry/schema-registry-avro/samples )
    - [Python](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/schemaregistry/azure-schemaregistry-avroserializer/samples )
    - [Kafka Avro Integration for Azure Schema Registry](https://github.com/Azure/azure-schema-registry-for-kafka/tree/master/csharp/avro/samples)

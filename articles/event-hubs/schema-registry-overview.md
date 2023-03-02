---
title: Azure Schema Registry in Azure Event Hubs
description: This article provides an overview of Schema Registry support by Azure Event Hubs.
ms.topic: overview
ms.date: 05/04/2022
ms.custom: references_regions, ignite-fall-2021
---

# Azure Schema Registry in Azure Event Hubs
In many event streaming and messaging scenarios, the event or message payload contains structured data. Schema-driven formats such as [Apache Avro](https://avro.apache.org/) are often used to serialize or deserialize such structured data. 

An event producer uses a schema to serialize event payload and publish it to an event broker such as Event Hubs. Event consumers read event payload from the broker and de-serialize it using the same schema. So, both producers and consumers can validate the integrity of the data with the same schema. 

:::image type="content" source="./media/schema-registry-overview/schema-driven-ser-de.svg" alt-text="Schema driven serialization/de-serialization" border="false":::

## What is Azure Schema Registry?
**Azure Schema Registry** is a feature of Event Hubs, which provides a central repository for schemas for event-driven and messaging-centric applications. It provides the flexibility for your producer and consumer applications to **exchange data without having to manage and share the schema**. It also provides a simple governance framework for reusable schemas and defines relationship between schemas through a grouping construct (schema groups).

:::image type="content" source="./media/schema-registry-overview/schema-registry.svg" alt-text="Schema Registry" border="false":::

With schema-driven serialization frameworks like Apache Avro, moving serialization metadata into shared schemas can also help with **reducing the per-message overhead**. That's because each message won't need to have the metadata (type information and field names) as it's the case with tagged formats such as JSON. 

Having schemas stored alongside the events and inside the eventing infrastructure ensures that the metadata that's required for serialization or de-serialization is always in reach and schemas can't be misplaced. 

> [!NOTE]
> The feature isn't available in the **basic** tier.

## Schema Registry information flow 

The information flow when you use schema registry is the same for all protocols that you use to publish or consume events from Azure Event Hubs. 

The following diagram shows how the information flows when event producers and consumers use Schema Registry with the **Kafka** protocol. 

:::image type="content" source="./media/schema-registry-overview/information-flow.svg" alt-text="Image showing the Schema Registry information flow." border="false":::

### Producer  

1. Kafka producer application uses `KafkaAvroSerializer` to serialize event data using the specified schema. Producer application provides details of the schema registry endpoint and other optional parameters that are required for schema validation. 
1. The serializer looks for the schema in the schema registry to serialize event data. If it finds the schema, then the corresponding schema ID is returned. You can configure the producer application to auto register the schema with the schema registry if it doesn't exist. 
1. Then the serializer prepends the schema ID to the serialized data that is published to the Event Hubs. 

### Consumer 

1. Kafka consumer application uses `KafkaAvroDeserializer` to deserialize data that it receives from the event hub.
1. The deserializer uses the schema ID (prepended by the producer) to retrieve schema from the schema registry.
1. The de-serializer uses the schema to deserialize event data that it receives from the event hub. 
1. The schema registry client uses caching to prevent redundant schema registry lookups in the future.  

## Schema Registry elements

An Event Hubs namespace now can host schema groups alongside event hubs (or Kafka topics). It hosts a schema registry and can have multiple schema groups. In spite of being hosted in Azure Event Hubs, the schema registry can be used universally with all Azure messaging services and any other message or events broker. Each of these schema groups is a separately securable repository for a set of schemas. Groups can be aligned with a particular application or an organizational unit. 

:::image type="content" source="./media/schema-registry-overview/elements.png" alt-text="Image showing the Schema Registry elements." border="false":::


### Schema groups
Schema group is a logical group of similar schemas based on your business criteria. A schema group can hold multiple versions of a schema. The compatibility enforcement setting on a schema group can help ensure that newer schema versions are backwards compatible.

The security boundary imposed by the grouping mechanism help ensures that trade secrets don't inadvertently leak through metadata in situations where the namespace is shared among multiple partners. It also allows for application owners to manage schemas independent of other applications that share the same namespace.

### Schemas
Schemas define the contract between producers and consumers. A schema defined in an Event Hubs schema registry helps manage the contract outside of event data, thus removing the payload overhead. A schema has a name, type (example: record, array, and so on.), compatibility mode (none, forward, backward, full), and serialization type (only Avro for now). You can create multiple versions of a schema and retrieve and use a specific version of a schema. 

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
When the ``None`` compatibility mode is used, the schema registry doesn't do any compatibility checks when you update schemas. 

## Client SDKs

You can use one of the following libraries to include an Avro serializer, which you can use to serialize and deserialize payloads containing Schema Registry schema identifiers and Avro-encoded data.

- [.NET - Microsoft.Azure.Data.SchemaRegistry.ApacheAvro](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/schemaregistry/Microsoft.Azure.Data.SchemaRegistry.ApacheAvro)
- [Java - azure-data-schemaregistry-avro](https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/schemaregistry/azure-data-schemaregistry-apacheavro)
- [Python - azure-schemaregistry-avroserializer](https://github.com/Azure/azure-sdk-for-python/tree/main/sdk/schemaregistry/azure-schemaregistry-avroencoder/)
- [JavaScript - @azure/schema-registry-avro](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/schemaregistry/schema-registry-avro)
- [Apache Kafka](https://github.com/Azure/azure-schema-registry-for-kafka/) - Run Kafka-integrated Apache Avro serializers and deserializers backed by Azure Schema Registry. The Java client's Apache Kafka client serializer for the Azure Schema Registry can be used in any Apache Kafka scenario and with any Apache Kafka® based deployment or cloud service. 
- **Azure CLI** - For an example of adding a schema to a schema group using CLI, see [Adding a schema to a schema group using CLI](https://github.com/Azure/azure-event-hubs/tree/master/samples/Management/CLI/AddschematoSchemaGroups).
- **PowerShell** - For an example of adding a schema to a schema group using PowerShell, see [Adding a schema to a schema group using PowerShell](https://github.com/Azure/azure-event-hubs/tree/master/samples/Management/PowerShell/AddingSchematoSchemagroups).


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
    - [Python](https://github.com/Azure/azure-sdk-for-python/tree/main/sdk/schemaregistry/azure-schemaregistry-avroencoder/samples)
    - [Kafka Avro Integration for Azure Schema Registry](https://github.com/Azure/azure-schema-registry-for-kafka/tree/master/csharp/avro/samples)

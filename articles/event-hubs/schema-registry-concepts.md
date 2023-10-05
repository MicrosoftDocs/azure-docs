---
title: Azure Schema Registry Concepts
description: This article explains concepts for Azure Schema Registry in Azure Event Hubs. 
ms.topic: conceptual
ms.date: 04/26/2023
author: kasun04
ms.author: kindrasiri
---

#  Schema Registry in Azure Event Hubs
Schema Registry in Azure Event Hubs provides you with a repository to use and manage schemas in schema-driven event streaming scenarios. 

## Schema Registry components 

An Event Hubs namespace can host schema groups alongside event hubs (or Kafka topics). It hosts a schema registry and can have multiple schema groups. In spite of being hosted in Azure Event Hubs, the schema registry can be used universally with all Azure messaging services and any other message or events broker. Each of these schema groups is a separately securable repository for a set of schemas. Groups can be aligned with a particular application or an organizational unit. 

:::image type="content" source="./media/schema-registry-overview/elements.png" alt-text="Diagram that shows the components of Schema Registry in Azure Event Hubs." border="false":::

### Schema groups
Schema group is a logical group of similar schemas based on your business criteria. A schema group can hold multiple versions of a schema. The compatibility enforcement setting on a schema group can help ensure that newer schema versions are backwards compatible.

The security boundary imposed by the grouping mechanism help ensures that trade secrets don't inadvertently leak through metadata in situations where the namespace is shared among multiple partners. It also allows for application owners to manage schemas independent of other applications that share the same namespace.

### Schemas
Schemas define the contract between producers and consumers. A schema defined in an Event Hubs schema registry helps manage the contract outside of event data, thus removing the payload overhead. A schema has a name, type (example: record, array, and so on.), compatibility mode (none, forward, backward, full), and serialization type (only Avro for now). You can create multiple versions of a schema and retrieve and use a specific version of a schema. 

### Schema formats 
Schema formats are used to determine the manner in which a schema is structured and defined, with each format outlining specific guidelines and syntax for defining the structure of the events that will be used for event streaming.

#### Avro schema 
[Avro](https://avro.apache.org/) is a popular data serialization system that uses a compact binary format and provides schema evolution capabilities. 

To learn more about using Avro schema format with Event Hubs Schema Registry, see:  
- [How to use schema registry with Kafka and Avro](schema-registry-kafka-java-send-receive-quickstart.md)
- [ How to use Schema registry with Event Hubs .NET SDK (AMQP) and Avro.](schema-registry-dotnet-send-receive-quickstart.md)

#### JSON Schema (Preview)
[JSON Schema](https://json-schema.org/) is a standardized way of defining the structure and data types of the events. JSON Schema enables the confident and reliable use of the JSON data format in event streaming. 

To learn more about using JSON schema format with Event Hubs Schema Registry, see:  
- [How to use schema registry with Kafka and JSON Schema](schema-registry-json-schema-kafka.md)

## Schema evolution 
Schemas need to evolve with the business requirement of producers and consumers. Azure Schema Registry supports schema evolution by introducing compatibility modes at the schema group level. When you create a schema group, you can specify the compatibility mode of the schemas that you include in that schema group. When you update a schema, the change should  comply with the assigned compatibility mode and then only it creates a new version of the schema. 

 > [!NOTE]
> Schema evolution is only supported for Avro schema format only.

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
- [Apache Kafka](https://github.com/Azure/azure-schema-registry-for-kafka/) - Run Kafka-integrated Apache Avro serializers and deserializers backed by Azure Schema Registry. The Java client's Apache Kafka client serializer for the Azure Schema Registry can be used in any Apache Kafka scenario and with any Apache Kafka&reg; based deployment or cloud service. 
- **Azure CLI** - For an example of adding a schema to a schema group using CLI, see [Adding a schema to a schema group using CLI](https://github.com/Azure/azure-event-hubs/tree/master/samples/Management/CLI/AddschematoSchemaGroups).
- **PowerShell** - For an example of adding a schema to a schema group using PowerShell, see [Adding a schema to a schema group using PowerShell](https://github.com/Azure/azure-event-hubs/tree/master/samples/Management/PowerShell/AddingSchematoSchemagroups).


## Limits
For limits (for example: number of schema groups in a namespace) of Event Hubs, see [Event Hubs quotas and limits](event-hubs-quotas.md).

## Azure role-based access control
To access a schema registry programmatically, follow these steps:

1. [Register your application in Azure Active Directory (Azure AD)](../active-directory/develop/quickstart-register-app.md)
1. Add the security principal of the application to one of the following Azure role-based access control (Azure RBAC) roles at the **namespace** level. 

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
    - [JavaScript](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/schemaregistry/schema-registry-avro/samples)
    - [Python](https://github.com/Azure/azure-sdk-for-python/tree/main/sdk/schemaregistry/azure-schemaregistry-avroencoder/samples)
    - [Kafka Avro Integration for Azure Schema Registry](https://github.com/Azure/azure-schema-registry-for-kafka/tree/master/csharp/avro/samples)

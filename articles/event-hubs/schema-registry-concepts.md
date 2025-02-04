---
title: Azure Schema Registry Concepts
description: This article explains concepts for Azure Schema Registry in Azure Event Hubs. 
ms.topic: conceptual
ms.date: 04/26/2023
author: spelluru
ms.author: spelluru
---

#  Schema Registry in Azure Event Hubs

Schema Registry is crucial in loosely coupled and event streaming workflows for maintaining data consistency, simplifying schema evolution, enhancing interoperability, and reducing development effort. It ensures highly reliable data processing and governance with little operational overhead in large distributed organizations with a centralized repository for schemas.

Schema Registry in Azure Event Hubs fulfills multiple roles in schema-driven event streaming scenarios -
   * Provides a repository where multiple schemas can be registered, managed, and evolved.
   * Managed schema evolution with multiple compatibility rules.
   * Performs data validation for all schematized data.
   * Provides client-side libraries (serializers and deserializers) for producers and consumers.
   * Improves network throughput efficiency by passing schema ID instead of the schema definition for every payload.

> [!NOTE]
> Schema Registry is supported on Standard, Premium, and Dedicated tiers.
>

## Schema Registry components

The Schema Registry lives in the context of the Event Hubs namespace, but it can be used with all Azure messaging service or other message or events broker. It comprises multiple schema groups which act as a logical grouping of schemas and can be managed independent of other schema groups. 

:::image type="content" source="./media/schema-registry-overview/elements.png" alt-text="Diagram that shows the components of Schema Registry in Azure Event Hubs." border="false":::

### Schemas

In any loosely coupled system, there are multiple applications communicating with each other, primarily through data. Schemas act as a declarative way to define the structure of the data so that the contract between these producer and consumer applications is well defined, ensuring reliable processing at scale.

A schema definition includes -
   * Fields - name of the individual data elements (that is, first/last name, book title, address).
   * Data types - the kind of data that can be stored in each field (for example, string, date-time, array).
   * Structure - the organization of the different fields (that is, nested structures or arrays).

Schemas define the contract between producers and consumers. A schema defined in an Event Hubs schema registry helps manage the contract outside of event data, thus removing the payload overhead.

#### Schema formats 
Schema formats are used to determine the manner in which a schema is structured and defined, with each format outlining specific guidelines and syntax for defining the structure of the events that will be used for event streaming.

##### Avro schema 
[Avro](https://avro.apache.org/) is a popular data serialization system that uses a compact binary format and provides schema evolution capabilities. 

To learn more about using Avro schema format with Event Hubs Schema Registry, see:  
- [How to use schema registry with Kafka and Avro](schema-registry-kafka-java-send-receive-quickstart.md)
- [How to use Schema registry with Event Hubs .NET SDK (AMQP) and Avro.](schema-registry-dotnet-send-receive-quickstart.md)

##### JSON Schema
[JSON Schema](https://json-schema.org/) is a standardized way of defining the structure and data types of the events. JSON Schema enables the confident and reliable use of the JSON data format in event streaming. 

To learn more about using JSON schema format with Event Hubs Schema Registry, see:  
- [How to use schema registry with Kafka and JSON Schema](schema-registry-json-schema-kafka.md)

##### Protobuf

[Protocol Buffers](https://protobuf.dev/) is a language-neutral, platform-neutral, extensible mechanism for serializing structured data. It's used for efficiently defining data structures and serializing them into a compact binary format.

### Schema groups

Schema groups are logical groups of similar schemas based on your business criteria. A schema group holds 
   * multiple schema definition, 
   * multiple versions of a specific schema, and 
   * metadata regarding the schema type and compatibility for all schemas in the group.

A schema groups can be thought of as a subset of the schema registry, aligned with a particular application or organizational unit, with a separate authorization model. This extra security boundary ensures that in the shared services model, metadata, and trade secrets aren't leaked. It also allows for application owners to manage schemas independent of other applications that share the same namespace.

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

1. [Register your application in Microsoft Entra ID](../active-directory/develop/quickstart-register-app.md)
1. Add the security principal of the application to one of the following Azure RBAC(role-based access control) roles at the **namespace** level. 

| Role | Description | 
| ---- | ----------- | 
| Owner | Read, write, and delete Schema Registry groups and schemas. |
| Contributor | Read, write, and delete Schema Registry groups and schemas. |
| [Schema Registry Reader](../role-based-access-control/built-in-roles.md#schema-registry-reader-preview) | Read and list Schema Registry groups and schemas. |
| [Schema Registry Contributor](../role-based-access-control/built-in-roles.md#schema-registry-reader-preview) | Read, write, and delete Schema Registry groups and schemas. |

For instructions on creating registering an application using the Azure portal, see [Register an app with Microsoft Entra ID](../active-directory/develop/quickstart-register-app.md). Note down the client ID (application ID), tenant ID, and the secret to use in the code. 

## Next steps

- To learn how to create a schema registry using the Azure portal, see [Create an Event Hubs schema registry using the Azure portal](create-schema-registry.md).
- See the following **Schema Registry Avro client library** samples.
    - [.NET](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/schemaregistry/Microsoft.Azure.Data.SchemaRegistry.ApacheAvro/tests/Samples)
    - [Java](https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/schemaregistry/azure-data-schemaregistry-apacheavro/src/samples)
    - [JavaScript](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/schemaregistry/schema-registry-avro/samples)
    - [Python](https://github.com/Azure/azure-sdk-for-python/tree/main/sdk/schemaregistry/azure-schemaregistry-avroencoder/samples)
    - [Kafka Avro Integration for Azure Schema Registry](https://github.com/Azure/azure-schema-registry-for-kafka/tree/master/csharp/avro/samples)

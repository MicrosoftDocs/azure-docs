---
title: Azure Schema Registry in Event Hubs (Preview)
description: This article provides an overview of Schema Registry support by Azure Event Hubs (Preview).
ms.topic: overview
ms.date: 09/22/2020
ms.custom: references_regions
---

# Azure Schema Registry in Event Hubs (Preview)
In many event streaming and messaging scenarios, the event or message payload contains structured data that's either being serialized or deserialized using a schema-driven format like Apache Avro. Both senders and receivers may want to validate the integrity of the data with a schema document as with JSON schema. For schema-driven formats, making the schema available to the message consumer is a prerequisite for the consumer to be able to deserialize the data. 

The **Azure Schema Registry** is a feature of Event Hubs, which provides a central repository for schema documents for event-driven and messaging-centric applications. It provides the flexibility for your producer and consumer applications to exchange data without having to manage and share the schema between them and also to evolve at different rates. The Schema Registry also provides a simple governance framework for reusable schemas and defines the relationship between schemas through a grouping construct (schema groups).

> [!NOTE]
> - The **Schema Registry** feature is currently in **preview**, and is not recommended for production workloads.
> - The feature is available only in **standard** and **dedicated** tiers, not in the **basic** tier.

With schema-driven serialization frameworks like Apache Avro, externalizing serialization metadata into shared schemas can also help with dramatically reducing the per-message overhead of type information and field names included with every data set as it's the case with tagged formats such as JSON. Having schemas stored alongside the events and inside the eventing infrastructure ensures that the metadata required for serialization/de-serialization is always in reach and schemas can't be misplaced. 

## Event Hubs namespace
An Event Hubs namespace now can host schema groups alongside event hubs (or Kafka topics). It hosts a schema registry and can have multiple schema groups. In spite of being hosted in Azure Event Hubs, the schema registry can be used universally with all Azure messaging services and any other message or events broker. Each of these schema groups is a separately securable repository for a set of schemas. Groups can be aligned with a particular application or an organizational unit. 

## Schema groups
Schema group is a logical group of similar schemas based on your business criteria. A schema group can hold multiple versions of a schema. The compatibility enforcement setting on a schema group can help ensure that newer schema versions are backwards compatible.

The security boundary imposed by the grouping mechanism help ensures that trade secrets don't inadvertently leak through metadata in situations where the namespace is shared among multiple partners. It also allows for application owners to manage schemas independent of other applications that share the same namespace.


## Schemas
Schemas define the contract between the producers and the consumers. A schema defined in an Event Hubs schema registry helps manage the contract outside of event data, thus removing the payload overhead. A schema has a name, type (example: record, array, and so on.), compatibility mode (none, forward, backward, full), and serialization type (only Avro for now). You can create multiple versions of a schema and retrieve and use a specific version of a schema. 

## Client SDKs
You can use one of the following libraries that include an Avro serializer, which you can use to serialize and deserialize payloads containing Schema Registry schema identifiers and Avro-encoded data.

- [.NET - Microsoft.Azure.Data.SchemaRegistry.ApacheAvro](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/schemaregistry/Microsoft.Azure.Data.SchemaRegistry.ApacheAvro)
- [Java - azure-data-schemaregistry-avro](https://github.com/Azure/azure-sdk-for-java/tree/master/sdk/schemaregistry/azure-data-schemaregistry-avro/)
- [Python - azure-schemaregistry-avroserializer](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/schemaregistry/azure-schemaregistry-avroserializer)
- [JavaScript - @azure/schema-registry-avro](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/schemaregistry/schema-registry-avro)
- [Apache Kafka](https://github.com/Azure/azure-schema-registry-for-kafka/) - Run Kafka-integrated Apache Avro serializers and deserializers backed by Azure Schema Registry. The Java client's Apache Kafka client serializer for the Azure Schema Registry can be used in any Apache Kafka scenario and with any Apache Kafka® based deployment or cloud service. 

The following image shows the information flow of the schema registry with Event Hubs: 

:::image type="content" source="./media/schema-registry-overview/flow-diagram.png" alt-text="Flow diagram":::

## Standard vs. dedicated limits
For limits (for example: number of schema groups in a namespace) that are the same and different for standard and dedicated tiers of Event Hubs, see [Schema Registry limits](../azure-resource-manager/management/azure-subscription-service-limits.md#schema-registry-limitations)

## Azure role-based access control
When accessing the schema registry programmatically, you need to register an application in Azure Active Directory (Azure AD) and add the security principal of the application to one of the Azure role-based access control (Azure RBAC) roles:

| Role | Description | 
| ---- | ----------- | 
| Owner | Read, write, and delete Schema Registry groups and schemas. |
| Contributor | Read, write, and delete Schema Registry groups and schemas. |
| [Schema Registry Reader (Preview)](../role-based-access-control/built-in-roles.md#schema-registry-reader-preview) | Read and list Schema Registry groups and schemas. |
| [Schema Registry Contributor (Preview)](../role-based-access-control/built-in-roles.md#schema-registry-reader-preview) | Read, write, and delete Schema Registry groups and schemas. |

For instructions on creating registering an application using the Azure portal, see [Register an app with Azure AD](../active-directory/develop/quickstart-register-app.md). Note down the client ID (application ID), tenant ID, and the secret to use in the code. 

## Next steps

- To learn how to create a schema registry using the Azure portal, see [Create an Event Hubs schema registry using the Azure portal](create-schema-registry.md).
- See the following **Schema Registry Avro client library** samples.
    - [.NET](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/schemaregistry/Microsoft.Azure.Data.SchemaRegistry.ApacheAvro/tests/Samples)
    - [Java](https://github.com/Azure/azure-sdk-for-java/tree/master/sdk/schemaregistry/azure-data-schemaregistry-avro/src/samples)
    - [JavaScript](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/schemaregistry/schema-registry-avro/samples )
    - [Python](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/schemaregistry/azure-schemaregistry-avroserializer/samples )
    - [Kafka Avro Integration for Azure Schema Registry](https://github.com/Azure/azure-schema-registry-for-kafka/tree/master/csharp/avro/samples)

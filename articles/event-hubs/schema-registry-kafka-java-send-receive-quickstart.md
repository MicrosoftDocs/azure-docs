---
title: 'Validate events from Apache Kafka apps using Avro (Java)'
description: In this quickstart, you create Kafka application,  which is based on Java that sends/receives events to/from Azure Event Hubs with schema validation using Schema Registry.
ms.topic: how-to
ms.date: 04/26/2023
ms.devlang: java
ms.custom: devx-track-extended-java
author: kasun04
ms.author: kindrasiri
---

# Validate schemas for Apache Kafka applications using Avro (Java)
In this quickstart guide, we explore how to validate event from Apache Kafka applications using Azure Schema Registry for Event Hubs.

In this use case a Kafka producer application uses Avro schema stored in Azure Schema Registry to, serialize the event and publish them to a Kafka topic/event hub in Azure Event Hubs. The Kafka consumer deserializes the events that it consumes from Event Hubs. For that it uses schema ID of the event and the Avro schema, which is stored in Azure Schema Registry. 

:::image type="content" source="./media/schema-registry-overview/kafka-avro.png" alt-text="Diagram showing schema serialization/de-serialization for Kafka applications using Avro schema." border="false":::



## Prerequisites
If you're new to Azure Event Hubs, see [Event Hubs overview](event-hubs-about.md) before you do this quickstart. 

To complete this quickstart, you need the following prerequisites:
- If you don't have an **Azure subscription**, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
- In your development environment, install the following components: 
    * [Java Development Kit (JDK) 1.7+](/azure/developer/java/fundamentals/java-support-on-azure).
    * [Download](https://maven.apache.org/download.cgi) and [install](https://maven.apache.org/install.html) a Maven binary archive.
    * [Git](https://www.git-scm.com/)
- Clone the [Azure Schema Registry for Kafka](https://github.com/Azure/azure-schema-registry-for-kafka.git) repository. 

## Create an event hub
Follow instructions from the quickstart: [Create an Event Hubs namespace and an event hub](event-hubs-create.md) to create an Event Hubs namespace and an event hub. Then, follow instructions from [Get the connection string](event-hubs-get-connection-string.md) to get a connection string to your Event Hubs namespace. 

Note down the following settings that you use in the current quickstart:
- Connection string for the Event Hubs namespace
- Name of the event hub

## Create a schema 
Follow instructions from [Create schemas using Schema Registry](create-schema-registry.md) to create a schema group and a schema. 

1. Create a schema group named **contoso-sg** using the Schema Registry portal. Use Avro as the serialization type and **None** for the compatibility mode. 
1. In that schema group, create a new Avro schema with schema name: ``Microsoft.Azure.Data.SchemaRegistry.example.Order`` using the following schema content. 

    ```json 
    {
      "namespace": "Microsoft.Azure.Data.SchemaRegistry.example",
      "type": "record",
      "name": "Order",
      "fields": [
        {
          "name": "id",
          "type": "string"
        },
        {
          "name": "amount",
          "type": "double"
        },
        {
          "name": "description",
          "type": "string"
        }
      ]
    } 
    ```

## Register an application to access schema registry 
You can use Azure Active Directory to authorize your Kafka producer and consumer application to access Azure Schema Registry resources by registering your client application with an Azure AD tenant from the Azure portal. 

To register an Azure Active Directory application named  `example-app` see [Register your application with an Azure AD tenant](authenticate-application.md).

- tenant.id - sets the tenant ID of the application
- client.id - sets the client ID of the application
- client.secret - sets the client secret for authentication

And if you're using managed identity, you would need: 
- use.managed.identity.credential - indicates that MSI credentials should be used, should be used for MSI-enabled VM
- managed.identity.clientId - if specified, it builds MSI credential with given client ID 
- managed.identity.resourceId - if specified, it builds MSI credential with given resource ID



## Add user to Schema Registry Reader role
Add your user account to the **Schema Registry Reader** role at the namespace level. You can also use the **Schema Registry Contributor** role, but that's not necessary for this quickstart.  

1. On the **Event Hubs Namespace** page, select **Access control (IAM)** on the left menu.
2. On the **Access control (IAM)** page, select **+ Add** -> **Add role assignment** on the menu. 
3. On the **Assignment type** page, select **Next**.
4. On the **Roles** page, select **Schema Registry Reader (Preview)**, and then select **Next** at the bottom of the page.
5. Use the **+ Select members** link to add the `example-app` application that you created in the previous step to the role, and then select **Next**. 
6. On the **Review + assign** page, select **Review + assign**.


## Update client application configuration of Kafka applications
You need to update the client configuration of the Kafka producer and consumer applications with the configuration related to Azure Active directory application that we created and the schema registry information. 

To update the Kafka Producer configuration, navigate to *azure-schema-registry-for-kafka/tree/master/java/avro/samples/kafka-producer*.

1. Update the configuration of the Kafka application in *src/main/resources/app.properties* by following [Kafka Quickstart guide for Event Hubs](event-hubs-quickstart-kafka-enabled-event-hubs.md). 

1. Update the configuration details for the producer in *src/main/resources/app.properties* using schema registry related configuration and Azure Active directory application that you created above as follows:

   ```xml
   schema.group=contoso-sg
   schema.registry.url=https://<NAMESPACENAME>.servicebus.windows.net

    tenant.id=<>
    client.id=<>
    client.secret=<>
1. Follow the same instructions and update the *azure-schema-registry-for-kafka/tree/master/java/avro/samples/kafka-consumer* configuration as well. 
1. For both Kafka producer and consumer applications, following Avro schema is used: 
   ```avro
   {
     "namespace": "com.azure.schemaregistry.samples",
     "type": "record",
     "name": "Order",
     "fields": [
       {
         "name": "id",
         "type": "string"
       },
       {
         "name": "amount",
         "type": "double"
       },
       {
         "name": "description",
         "type": "string"
       }
     ]
   }
   ```


## Using Kafka producer with Avro schema validation 
To run the Kafka producer application, navigate to *azure-schema-registry-for-kafka/tree/master/java/avro/samples/kafka-producer*.

1. You can run the producer application so that it can produce Avro specific records or generic records. For specific records mode you need to first generate the classes against either the producer schema using the following maven command: 
   ```shell
   mvn generate-sources
   ```

1. Then you can run the producer application using the following commands. 

   ```shell
   mvn clean package
   mvn -e clean compile exec:java -Dexec.mainClass="com.azure.schemaregistry.samples.producer.App"
   ```

1. Upon successful execution of the producer application, it prompts you to choose the producer scenario. For this quickstart, you can choose option *1 - produce Avro SpecificRecords*. 

   ```shell
   Enter case number:
   1 - produce Avro SpecificRecords
   2 - produce Avro GenericRecords
   ```

1. Upon successful data serialization and publishing, you should see the following console logs in your producer application: 

   ```shell 
   INFO com.azure.schemaregistry.samples.producer.KafkaAvroSpecificRecord - Sent Order {"id": "ID-0", "amount": 10.0, "description": "Sample order 0"}
   INFO com.azure.schemaregistry.samples.producer.KafkaAvroSpecificRecord - Sent Order {"id": "ID-1", "amount": 11.0, "description": "Sample order 1"}
   INFO com.azure.schemaregistry.samples.producer.KafkaAvroSpecificRecord - Sent Order {"id": "ID-2", "amount": 12.0, "description": "Sample order 2"}
   ```

## Using Kafka consumer with Avro schema validation 
To run the Kafka consumer application, navigate to *azure-schema-registry-for-kafka/tree/master/java/avro/samples/kafka-consumer*.

1. You can run the consumer application so that it can consume Avro specific records or generic records. For specific records mode you need to first generate the classes against either the producer schema using the following maven command: 
   ```shell
   mvn generate-sources
   ```

1. Then you can run the consumer application using the following command. 
   ```shell
   mvn clean package
   mvn -e clean compile exec:java -Dexec.mainClass="com.azure.schemaregistry.samples.consumer.App"
   ```
1. Upon successful execution of the consumer application, it prompts you to choose the producer scenario. For this quickstart, you can choose option *1 - consume Avro SpecificRecords*. 

   ```shell
   Enter case number:
   1 - consume Avro SpecificRecords
   2 - consume Avro GenericRecords
     ```

1. Upon successful data consumption and deserialization, you should see the following console logs in your producer application: 

   ```shell
   INFO com.azure.schemaregistry.samples.consumer.KafkaAvroSpecificRecord - Order received: {"id": "ID-0", "amount": 10.0, "description": "Sample order 0"}
   INFO com.azure.schemaregistry.samples.consumer.KafkaAvroSpecificRecord - Order received: {"id": "ID-1", "amount": 11.0, "description": "Sample order 1"}
   INFO com.azure.schemaregistry.samples.consumer.KafkaAvroSpecificRecord - Order received: {"id": "ID-2", "amount": 12.0, "description": "Sample order 2"}
   ```

## Clean up resources
Delete the Event Hubs namespace or delete the resource group that contains the namespace. 

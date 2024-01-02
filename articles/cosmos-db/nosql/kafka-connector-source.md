---
title: Kafka Connect for Azure Cosmos DB - Source connector
description: Azure Cosmos DB source connector provides the capability to read data from the Azure Cosmos DB change feed and publish this data to a Kafka topic. Kafka Connect for Azure Cosmos DB is a connector to read from and write data to Azure Cosmos DB. 
author: kushagrathapar
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: conceptual
ms.date: 05/13/2022
ms.author: kuthapar
---

# Kafka Connect for Azure Cosmos DB - source connector
[!INCLUDE[NoSQL](../includes/appliesto-nosql.md)]

Kafka Connect for Azure Cosmos DB is a connector to read from and write data to Azure Cosmos DB. The Azure Cosmos DB source connector provides the capability to read data from the Azure Cosmos DB change feed and publish this data to a Kafka topic.

## Prerequisites

* Start with the [Confluent platform setup](https://github.com/microsoft/kafka-connect-cosmosdb/blob/dev/doc/Confluent_Platform_Setup.md) because it gives you a complete environment to work with. If you don't wish to use Confluent Platform, then you need to install and configure Zookeeper, Apache Kafka, Kafka Connect, yourself. You'll also need to install and configure the Azure Cosmos DB connectors manually.
* Create an Azure Cosmos DB account, container [setup guide](https://github.com/microsoft/kafka-connect-cosmosdb/blob/dev/doc/CosmosDB_Setup.md)
* Bash shell, which is tested on GitHub Codespaces, Mac, Ubuntu, Windows with WSL2. This shell doesn’t work in Cloud Shell or WSL1.
* Download [Java 11+](https://www.oracle.com/java/technologies/javase-jdk11-downloads.html)
* Download [Maven](https://maven.apache.org/download.cgi)

## Install the source connector

If you're using the recommended [Confluent platform setup](https://github.com/microsoft/kafka-connect-cosmosdb/blob/dev/doc/Confluent_Platform_Setup.md), the Azure Cosmos DB source connector is included in the installation, and you can skip this step.

Otherwise, you can use JAR file from latest [Release](https://github.com/microsoft/kafka-connect-cosmosdb/releases) and install the connector manually. To learn more, see these [instructions](https://docs.confluent.io/current/connect/managing/install.html#install-connector-manually). You can also package a new JAR file from the source code:

```bash
# clone the kafka-connect-cosmosdb repo if you haven't done so already
git clone https://github.com/microsoft/kafka-connect-cosmosdb.git
cd kafka-connect-cosmosdb

# package the source code into a JAR file
mvn clean package

# include the following JAR file in Confluent Platform installation
ls target/*dependencies.jar
```

## Create a Kafka topic

Create a Kafka topic using Confluent Control Center. For this scenario, we'll create a Kafka topic named "apparels" and write non-schema embedded JSON data to the topic. To create a topic inside the Control Center, see [create Kafka topic doc](https://docs.confluent.io/platform/current/quickstart/ce-docker-quickstart.html#step-2-create-ak-topics).

## Create the source connector

### Create the source connector in Kafka Connect

To create the Azure Cosmos DB source connector in Kafka Connect, use the following JSON config. Make sure to replace the placeholder values for `connect.cosmos.connection.endpoint`, `connect.cosmos.master.key` properties that you should have saved from the Azure Cosmos DB setup guide in the prerequisites.

```json
{
  "name": "cosmosdb-source-connector",
  "config": {
    "connector.class": "com.azure.cosmos.kafka.connect.source.CosmosDBSourceConnector",
    "tasks.max": "1",
    "key.converter": "org.apache.kafka.connect.json.JsonConverter",
    "value.converter": "org.apache.kafka.connect.json.JsonConverter",
    "connect.cosmos.task.poll.interval": "100",
    "connect.cosmos.connection.endpoint": "https://<cosmosinstance-name>.documents.azure.com:443/",
    "connect.cosmos.master.key": "<cosmosdbprimarykey>",
    "connect.cosmos.databasename": "kafkaconnect",
    "connect.cosmos.containers.topicmap": "apparels#kafka",
    "connect.cosmos.offset.useLatest": false,
    "value.converter.schemas.enable": "false",
    "key.converter.schemas.enable": "false"
  }
}
```

For more information on each of the above configuration properties, see the [source properties](#source-configuration-properties) section. Once you have all the values filled out, save the JSON file somewhere locally. You can use this file to create the connector using the REST API.

#### Create connector using Control Center

An easy option to create the connector is from the Confluent Control Center portal. Follow the [Confluent setup guide](https://docs.confluent.io/platform/current/quickstart/ce-docker-quickstart.html#step-3-install-a-ak-connector-and-generate-sample-data) to create a connector from Control Center. When setting up, instead of using the `DatagenConnector` option, use the `CosmosDBSourceConnector` tile instead. When configuring the source connector, fill out the values as you've filled in the JSON file.

Alternatively, in the connectors page, you can upload the JSON file built from the previous section by using the **Upload connector config file** option.

:::image type="content" source="./media/kafka-connector-source/upload-source-connector-config.png" lightbox="./media/kafka-connector-source/upload-source-connector-config.png" alt-text="Screenshot of 'Upload connector config file' option in the Browse connectors dialog.":::

#### Create connector using REST API

Create the source connector using the Connect REST API

```bash
# Curl to Kafka connect service
curl -H "Content-Type: application/json" -X POST -d @<path-to-JSON-config-file> http://localhost:8083/connectors
```

## Insert document into Azure Cosmos DB

1. Sign in to the [Azure portal](https://portal.azure.com/learn.docs.microsoft.com) and navigate to your Azure Cosmos DB account.
1. Open the **Data Explore** tab and select **Databases**
1. Open the "kafkaconnect" database and "kafka" container you created earlier.
1. To create a new JSON document, in the API for NoSQL pane, expand "kafka" container, select **Items**, then select **New Item** in the toolbar.
1. Now, add a document to the container with the following structure. Paste the following sample JSON block into the Items tab, overwriting the current content:

   ``` json
 
   {
     "id": "2",
     "productId": "33218897",
     "category": "Women's Outerwear",
     "manufacturer": "Contoso",
     "description": "Black wool pea-coat",
     "price": "49.99",
     "shipping": {
       "weight": 2,
       "dimensions": {
         "width": 8,
         "height": 11,
         "depth": 3
       }
     }
   }
 
   ```

1. Select **Save**.
1. Confirm the document has been saved by viewing the Items on the left-hand menu.

### Confirm data written to Kafka topic

1. Open Kafka Topic UI on `http://localhost:9000`.
1. Select the Kafka "apparels" topic you created.
1. Verify that the document you inserted into Azure Cosmos DB earlier appears in the Kafka topic.

### Cleanup

To delete the connector from the Confluent Control Center, navigate to the source connector you created and select the **Delete** icon.

:::image type="content" source="./media/kafka-connector-source/delete-source-connector.png" lightbox="./media/kafka-connector-source/delete-source-connector.png" alt-text="Screenshot of delete option in the source connector dialog.":::

Alternatively, use the connector’s REST API:

```bash
# Curl to Kafka connect service
curl -X DELETE http://localhost:8083/connectors/cosmosdb-source-connector
```

To delete the created Azure Cosmos DB service and its resource group using Azure CLI, refer to these [steps](https://github.com/microsoft/kafka-connect-cosmosdb/blob/dev/doc/CosmosDB_Setup.md#cleanup).

## Source configuration properties

The following settings are used to configure the Kafka source connector. These configuration values determine which Azure Cosmos DB container is consumed, data from which Kafka topics is written, and formats to serialize the data. For an example with default values, see this [configuration file](https://github.com/microsoft/kafka-connect-cosmosdb/blob/dev/src/docker/resources/source.example.json).

| Name | Type | Description | Required/optional |
| :--- | :--- | :--- | :--- |
| connector.class | String | Class name of the Azure Cosmos DB source. It should be set to `com.azure.cosmos.kafka.connect.source.CosmosDBSourceConnector` | Required |
| connect.cosmos.databasename | String | Name of the database to read from. | Required |
| connect.cosmos.master.key | String | The Azure Cosmos DB primary key. | Required |
| connect.cosmos.connection.endpoint | URI | The account endpoint. | Required |
| connect.cosmos.containers.topicmap | String | Comma-separated topic to container mapping. For example,  topic1#coll1, topic2#coll2 | Required |
| connect.cosmos.connection.gateway.enabled | boolean | Flag to indicate whether to use gateway mode. By default it is false. | Optional  |
| connect.cosmos.messagekey.enabled | Boolean | This value represents if the Kafka message key should be set. Default value is `true` | Required |
| connect.cosmos.messagekey.field | String | Use the field's value from the document as the message key. Default is `id`. | Required |
| connect.cosmos.offset.useLatest | Boolean |  Set to `true` to use the most recent source offset. Set to `false` to use the earliest recorded offset. Default value is `false`. | Required |
| connect.cosmos.task.poll.interval | Int | Interval to poll the change feed container for changes. | Required |
| key.converter | String | Serialization format for the key data written into Kafka topic. | Required |
| value.converter | String | Serialization format for the value data written into the Kafka topic. | Required |
| key.converter.schemas.enable | String | Set to `true` if the key data has embedded schema. | Optional |
| value.converter.schemas.enable | String | Set to `true` if the key data has embedded schema. | Optional |
| tasks.max | Int | Maximum number of connectors source tasks. Default value is `1`. | Optional |

## Supported data types

The Azure Cosmos DB source connector converts JSON document to schema and supports the following JSON data types:

| JSON data type | Schema type |
| :--- | :--- |
| Array | Array |
| Boolean | Boolean | 
| Number | Float32<br>Float64<br>Int8<br>Int16<br>Int32<br>Int64|
| Null | String |
| Object (JSON)| Struct|
| String | String |

## Next steps

* Kafka Connect for Azure Cosmos DB [sink connector](kafka-connector-sink.md)

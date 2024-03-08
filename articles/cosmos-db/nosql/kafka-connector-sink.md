---
title: Kafka Connect for Azure Cosmos DB - Sink connector
description: The Azure Cosmos DB sink connector allows you to export data from Apache Kafka topics to an Azure Cosmos DB database. The connector polls data from Kafka to write to containers in the database based on the topics subscription. 
author: kushagrathapar
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: conceptual
ms.date: 05/13/2022
ms.author: kuthapar
---

# Kafka Connect for Azure Cosmos DB - sink connector
[!INCLUDE[NoSQL](../includes/appliesto-nosql.md)]

Kafka Connect for Azure Cosmos DB is a connector to read from and write data to Azure Cosmos DB. The Azure Cosmos DB sink connector allows you to export data from Apache Kafka topics to an Azure Cosmos DB database. The connector polls data from Kafka to write to containers in the database based on the topics subscription.

## Prerequisites

* Start with the [Confluent platform setup](https://github.com/microsoft/kafka-connect-cosmosdb/blob/dev/doc/Confluent_Platform_Setup.md) because it gives you a complete environment to work with. If you don't wish to use Confluent Platform, then you need to install and configure Zookeeper, Apache Kafka, Kafka Connect, yourself. You'll also need to install and configure the Azure Cosmos DB connectors manually.
* Create an Azure Cosmos DB account, container [setup guide](https://github.com/microsoft/kafka-connect-cosmosdb/blob/dev/doc/CosmosDB_Setup.md)
* Bash shell, which is tested on GitHub Codespaces, Mac, Ubuntu, Windows with WSL2. This shell doesn’t work in Cloud Shell or WSL1.
* Download [Java 11+](https://www.oracle.com/java/technologies/javase-jdk11-downloads.html)
* Download [Maven](https://maven.apache.org/download.cgi)

## Install sink connector

If you're using the recommended [Confluent platform setup](https://github.com/microsoft/kafka-connect-cosmosdb/blob/dev/doc/Confluent_Platform_Setup.md), the Azure Cosmos DB sink connector is included in the installation, and you can skip this step.  

Otherwise, you can download the JAR file from the latest [Release](https://github.com/microsoft/kafka-connect-cosmosdb/releases) or package this repo to create a new JAR file. To install the connector manually using the JAR file, refer to these [instructions](https://docs.confluent.io/current/connect/managing/install.html#install-connector-manually). You can also package a new JAR file from the source code.

```bash
# clone the kafka-connect-cosmosdb repo if you haven't done so already
git clone https://github.com/microsoft/kafka-connect-cosmosdb.git
cd kafka-connect-cosmosdb

# package the source code into a JAR file
mvn clean package

# include the following JAR file in Kafka Connect installation
ls target/*dependencies.jar
```

## Create a Kafka topic and write data

If you're using the Confluent Platform, the easiest way to create a Kafka topic is by using the supplied Control Center UX. Otherwise, you can create a Kafka topic manually using the following syntax:

```bash
./kafka-topics.sh --create --zookeeper <ZOOKEEPER_URL:PORT> --replication-factor <NO_OF_REPLICATIONS> --partitions <NO_OF_PARTITIONS> --topic <TOPIC_NAME>
```

For this scenario, we'll create a Kafka topic named “hotels” and will write non-schema embedded JSON data to the topic. To create a topic inside Control Center, see the [Confluent guide](https://docs.confluent.io/platform/current/quickstart/ce-docker-quickstart.html#step-2-create-ak-topics).

Next, start the Kafka console producer to write a few records to the “hotels” topic.

```powershell
# Option 1: If using Codespaces, use the built-in CLI utility
kafka-console-producer --broker-list localhost:9092 --topic hotels

# Option 2: Using this repo's Confluent Platform setup, first exec into the broker container
docker exec -it broker /bin/bash
kafka-console-producer --broker-list localhost:9092 --topic hotels

# Option 3: Using your Confluent Platform setup and CLI install
<path-to-confluent>/bin/kafka-console-producer --broker-list <kafka broker hostname> --topic hotels
```

In the console producer, enter:

```json
{"id": "h1", "HotelName": "Marriott", "Description": "Marriott description"}
{"id": "h2", "HotelName": "HolidayInn", "Description": "HolidayInn description"}
{"id": "h3", "HotelName": "Motel8", "Description": "Motel8 description"}
```

The three records entered are published to the “hotels” Kafka topic in JSON format.

## Create the sink connector

Create an Azure Cosmos DB sink connector in Kafka Connect. The following JSON body defines config for the sink connector. Make sure to replace the values for `connect.cosmos.connection.endpoint` and `connect.cosmos.master.key`, properties that you should have saved from the Azure Cosmos DB setup guide in the prerequisites.

For more information on each of these configuration properties, see [sink properties](#sink-configuration-properties).

```json
{
  "name": "cosmosdb-sink-connector",
  "config": {
    "connector.class": "com.azure.cosmos.kafka.connect.sink.CosmosDBSinkConnector",
    "tasks.max": "1",
    "topics": [
      "hotels"
    ],
    "value.converter": "org.apache.kafka.connect.json.JsonConverter",
    "value.converter.schemas.enable": "false",
    "key.converter": "org.apache.kafka.connect.json.JsonConverter",
    "key.converter.schemas.enable": "false",
    "connect.cosmos.connection.endpoint": "https://<cosmosinstance-name>.documents.azure.com:443/",
    "connect.cosmos.master.key": "<cosmosdbprimarykey>",
    "connect.cosmos.databasename": "kafkaconnect",
    "connect.cosmos.containers.topicmap": "hotels#kafka"
  }
}
```

Once you have all the values filled out, save the JSON file somewhere locally. You can use this file to create the connector using the REST API.

### Create connector using Control Center

An easy option to create the connector is by going through the Control Center webpage. Follow this [installation guide](https://docs.confluent.io/platform/current/quickstart/ce-docker-quickstart.html#step-3-install-a-ak-connector-and-generate-sample-data) to create a connector from Control Center. Instead of using the `DatagenConnector` option, use the `CosmosDBSinkConnector` tile instead. When configuring the sink connector, fill out the values as you've filled in the JSON file.

Alternatively, in the connectors page, you can upload the JSON file created earlier by using the **Upload connector config file** option.

:::image type="content" source="./media/kafka-connector-sink/upload-sink-connector-config.png" lightbox="./media/kafka-connector-sink/upload-sink-connector-config.png" alt-text="Screenshot of 'Upload connector config file' option in the Browse connectors dialog.":::

### Create connector using REST API

Create the sink connector using the Connect REST API:

```bash
# Curl to Kafka connect service
curl -H "Content-Type: application/json" -X POST -d @<path-to-JSON-config-file> http://localhost:8083/connectors

```

## Confirm data written to Azure Cosmos DB

Sign in to the [Azure portal](https://portal.azure.com) and navigate to your Azure Cosmos DB account. Check that the three records from the “hotels” topic are created in your account.

## Cleanup

To delete the connector from the Control Center, navigate to the sink connector you created and select the **Delete** icon.

:::image type="content" source="./media/kafka-connector-sink/delete-sink-connector.png" lightbox="./media/kafka-connector-sink/delete-sink-connector.png" alt-text="Screenshot of delete option in the sink connector dialog.":::

Alternatively, use the Connect REST API to delete:

```bash
# Curl to Kafka connect service
curl -X DELETE http://localhost:8083/connectors/cosmosdb-sink-connector
```

To delete the created Azure Cosmos DB service and its resource group using Azure CLI, refer to these [steps](https://github.com/microsoft/kafka-connect-cosmosdb/blob/dev/doc/CosmosDB_Setup.md#cleanup).

## <a id="sink-configuration-properties"></a>Sink configuration properties

The following settings are used to configure an Azure Cosmos DB Kafka sink connector. These configuration values determine which Kafka topics data is consumed, which Azure Cosmos DB container’s data is written into, and formats to serialize the data. For an example configuration file with the default values, refer to [this config](https://github.com/microsoft/kafka-connect-cosmosdb/blob/dev/src/docker/resources/sink.example.json).

| Name | Type | Description | Required/Optional |
| :--- | :--- | :--- | :--- |
| Topics | list | A list of Kafka topics to watch. | Required |
| connector.class | string | Class name of the Azure Cosmos DB sink. It should be set to `com.azure.cosmos.kafka.connect.sink.CosmosDBSinkConnector`. | Required |
| connect.cosmos.connection.endpoint | uri | Azure Cosmos DB endpoint URI string. | Required |
| connect.cosmos.master.key | string | The Azure Cosmos DB primary key that the sink connects with. | Required |
| connect.cosmos.databasename | string | The name of the Azure Cosmos DB database the sink writes to. | Required |
| connect.cosmos.containers.topicmap | string | Mapping between Kafka topics and Azure Cosmos DB containers, formatted using CSV as shown: `topic#container,topic2#container2`. | Required |
| connect.cosmos.connection.gateway.enabled | boolean | Flag to indicate whether to use gateway mode. By default it is false. | Optional  |
| connect.cosmos.sink.bulk.enabled | boolean | Flag to indicate whether bulk mode is enabled. By default it is true. | Optional |
| connect.cosmos.sink.maxRetryCount | int  | Max retry attempts on transient write failures. By default it is 10 times. | Optional |
| key.converter | string | Serialization format for the key data written into Kafka topic. | Required |
| value.converter | string | Serialization format for the value data written into the Kafka topic. | Required |
| key.converter.schemas.enable | string | Set to "true" if the key data has embedded schema. | Optional |
| value.converter.schemas.enable | string | Set to "true" if the key data has embedded schema. | Optional |
| tasks.max | int | Maximum number of connector sink tasks. Default is `1` | Optional |

Data will always be written to the Azure Cosmos DB as JSON without any schema.

## Supported data types

The Azure Cosmos DB sink connector converts sink record into JSON document supporting the following schema types:

| Schema type | JSON data type |
| :--- | :--- |
| Array | Array |
| Boolean | Boolean |
| Float32 | Number |
| Float64 | Number |
| Int8 | Number |
| Int16 | Number |
| Int32 | Number |
| Int64 | Number|
| Map | Object (JSON)|
| String | String<br> Null |
| Struct | Object (JSON) |

The sink Connector also supports the following AVRO logical types:

| Schema Type | JSON Data Type |
| :--- | :--- |
| Date | Number |
| Time | Number |
| Timestamp | Number |

> [!NOTE]
> Byte deserialization is currently not supported by the Azure Cosmos DB sink connector.

## Single Message Transforms(SMT)

Along with the sink connector settings, you can specify the use of Single Message Transformations (SMTs) to modify messages flowing through the Kafka Connect platform. For more information, see [Confluent SMT Documentation](https://docs.confluent.io/platform/current/connect/transforms/overview.html).

### Using the InsertUUID SMT

You can use InsertUUID SMT to automatically add item IDs. With the custom `InsertUUID` SMT, you can insert the `id` field with a random UUID value for each message, before it's written to Azure Cosmos DB.

> [!WARNING]
> Use this SMT only if the messages don’t contain the `id` field. Otherwise, the `id` values will be overwritten and you may end up with duplicate items in your database. Using UUIDs as the message ID can be quick and easy but are [not an ideal partition key](https://stackoverflow.com/questions/49031461/would-using-a-substring-of-a-guid-in-cosmosdb-as-partitionkey-be-a-bad-idea) to use in Azure Cosmos DB.

### Install the SMT

Before you can use the `InsertUUID` SMT, you'll need to install this transform in your Confluent Platform setup. If you're using the Confluent Platform setup from this repo, the transform is already included in the installation, and you can skip this step.

Alternatively, you can package the [InsertUUID source](https://github.com/confluentinc/kafka-connect-insert-uuid) to create a new JAR file. To install the connector manually using the JAR file, refer to these [instructions](https://docs.confluent.io/current/connect/managing/install.html#install-connector-manually).

```bash
# clone the kafka-connect-insert-uuid repo
https://github.com/confluentinc/kafka-connect-insert-uuid.git
cd kafka-connect-insert-uuid

# package the source code into a JAR file
mvn clean package

# include the following JAR file in Confluent Platform installation
ls target/*.jar
```

### Configure the SMT

Inside your sink connector config, add the following properties to set the `id`.

```json
"transforms": "insertID",
"transforms.insertID.type": "com.github.cjmatta.kafka.connect.smt.InsertUuid$Value",
"transforms.insertID.uuid.field.name": "id"
```

For more information on using this SMT, see the [InsertUUID repository](https://github.com/confluentinc/kafka-connect-insert-uuid).

### Using SMTs to configure Time to live (TTL)

Using both the `InsertField` and `Cast` SMTs, you can configure TTL on each item created in Azure Cosmos DB. Enable TTL on the container before enabling TTL at an item level. For more information, see the [time-to-live](how-to-time-to-live.md#enable-time-to-live-on-a-container-using-the-azure-portal) doc.

Inside your Sink connector config, add the following properties to set the TTL in seconds. In this following example, the TTL is set to 100 seconds. If the message already contains the `TTL` field, the `TTL` value will be overwritten by these SMTs.

```json
"transforms": "insertTTL,castTTLInt",
"transforms.insertTTL.type": "org.apache.kafka.connect.transforms.InsertField$Value",
"transforms.insertTTL.static.field": "ttl",
"transforms.insertTTL.static.value": "100",
"transforms.castTTLInt.type": "org.apache.kafka.connect.transforms.Cast$Value",
"transforms.castTTLInt.spec": "ttl:int32"
```

For more information on using these SMTs, see the [InsertField](https://docs.confluent.io/platform/current/connect/transforms/insertfield.html) and [Cast](https://docs.confluent.io/platform/current/connect/transforms/cast.html) documentation.

## Troubleshooting common issues

Here are solutions to some common problems that you may encounter when working with the Kafka sink connector.

### Read non-JSON data with JsonConverter

If you have non-JSON data on your source topic in Kafka and attempt to read it using the `JsonConverter`, you'll see the following exception:

```console
org.apache.kafka.connect.errors.DataException: Converting byte[] to Kafka Connect data failed due to serialization error:
…
org.apache.kafka.common.errors.SerializationException: java.io.CharConversionException: Invalid UTF-32 character 0x1cfa7e2 (above 0x0010ffff) at char #1, byte #7)

```

This error is likely caused by data in the source topic being serialized in either Avro or another format such as CSV string.

**Solution**: If the topic data is in AVRO format, then change your Kafka Connect sink connector to use the `AvroConverter` as shown below.

```json
"value.converter": "io.confluent.connect.avro.AvroConverter",
"value.converter.schema.registry.url": "http://schema-registry:8081",
```

### Gateway mode support
```connect.cosmos.connection.gateway.enabled``` is a configuration option for the Cosmos DB Kafka Sink Connector that enhances data ingestion by utilizing the Cosmos DB gateway service. This service acts as a front-end for Cosmos DB, offering benefits such as load balancing, request routing, and protocol translation. By leveraging the gateway service, the connector achieves improved throughput and scalability when writing data to Cosmos DB. For more information, see [connectivity modes](/azure/cosmos-db/nosql/sdk-connection-modes).

```json
"connect.cosmos.connection.gateway.enabled": true
```

### Bulk mode support
```connect.cosmos.sink.bulk.enabled``` property determines whether the bulk write feature is enabled for writing data from Kafka topics to Azure Cosmos DB. 

When this property is set to `true` (by default), it enables the bulk write mode, allowing Kafka Connect to use the bulk import API of Azure Cosmos DB for performing efficient batch writes utilizing ```CosmosContainer.executeBulkOperations()``` method. Bulk write mode significantly improves the write performance and reduces the overall latency when ingesting data into Cosmos DB in comparison with non-bulk mode when ```CosmosContainer.upsertItem()``` method is used.

Bulk mode is enabled by default. To disable the `connect.cosmos.sink.bulk.enabled` property, you need to set it to `false` in the configuration for the Cosmos DB sink connector. Here's an example configuration property file:

```json
"name": "my-cosmosdb-connector",
"connector.class": "io.confluent.connect.azure.cosmosdb.CosmosDBSinkConnector",
"tasks.max": 1,
"topics": "my-topic"
"connect.cosmos.endpoint": "https://<cosmosdb-account>.documents.azure.com:443/"
"connect.cosmos.master.key": "<cosmosdb-master-key>"
"connect.cosmos.database": "my-database"
"connect.cosmos.collection": "my-collection"
"connect.cosmos.sink.bulk.enabled": false
```

By enabling the `connect.cosmos.sink.bulk.enabled` property, you can leverage the bulk write functionality in Kafka Connect for Azure Cosmos DB to achieve improved write performance when replicating data from Kafka topics to Azure Cosmos DB.

```json
"connect.cosmos.sink.bulk.enabled": true
```

### Read non-Avro data with AvroConverter

This scenario is applicable when you try to use the Avro converter to read data from a topic that isn't in Avro format. Which, includes data written by an Avro serializer other than the Confluent Schema Registry’s Avro serializer, which has its own wire format.

```console
org.apache.kafka.connect.errors.DataException: my-topic-name
at io.confluent.connect.avro.AvroConverter.toConnectData(AvroConverter.java:97)
…
org.apache.kafka.common.errors.SerializationException: Error deserializing Avro message for id -1
org.apache.kafka.common.errors.SerializationException: Unknown magic byte!

```

**Solution**: Check the source topic’s serialization format. Then, either switch Kafka Connect’s sink connector to use the right converter or switch the upstream format to Avro.

### Read a JSON message without the expected schema/payload structure

Kafka Connect supports a special structure of JSON messages containing both payload and schema as follows.

```json
{
  "schema": {
    "type": "struct",
    "fields": [
      {
        "type": "int32",
        "optional": false,
        "field": "userid"
      },
      {
        "type": "string",
        "optional": false,
        "field": "name"
      }
    ]
  },
  "payload": {
    "userid": 123,
    "name": "Sam"
  }
}
```

If you try to read JSON data that doesn't contain the data in this structure, you'll get the following error:

```none
org.apache.kafka.connect.errors.DataException: JsonConverter with schemas.enable requires "schema" and "payload" fields and may not contain additional fields. If you are trying to deserialize plain JSON data, set schemas.enable=false in your converter configuration.
```

To be clear, the only JSON structure that is valid for `schemas.enable=true` has schema and payload fields as the top-level elements as shown above. As the error message  states, if you just have plain JSON data, you should change your connector’s configuration to:

```json
"value.converter": "org.apache.kafka.connect.json.JsonConverter",
"value.converter.schemas.enable": "false",
```

## Limitations

* Autocreation of databases and containers in Azure Cosmos DB aren't supported. The database and containers must already exist, and they must be configured correctly.

## Next steps

You can learn more about change feed in Azure Cosmo DB with the following docs:

* [Introduction to the change feed](https://azurecosmosdb.github.io/labs/dotnet/labs/08-change_feed_with_azure_functions.html)
* [Reading from change feed](read-change-feed.md)

You can learn more about bulk operations in V4 Java SDK with the following docs:
* [Perform bulk operations on Azure Cosmos DB data](./bulk-executor-java.md)

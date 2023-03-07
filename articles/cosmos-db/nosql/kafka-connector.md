---
title: Use Kafka Connect for Azure Cosmos DB to read and write data
description: Kafka Connect for Azure Cosmos DB is a connector to read from and write data to Azure Cosmos DB. Kafka Connect is a tool for scalable and reliably streaming data between Apache Kafka and other systems
author: kushagrathapar
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: conceptual
ms.date: 06/28/2021
ms.author: kuthapar
---

# Kafka Connect for Azure Cosmos DB
[!INCLUDE[NoSQL](../includes/appliesto-nosql.md)]

[Kafka Connect](http://kafka.apache.org/documentation.html#connect) is a tool for scalable and reliably streaming data between Apache Kafka and other systems. Using Kafka Connect you can define connectors that move large data sets into and out of Kafka. Kafka Connect for Azure Cosmos DB is a connector to read from and write data to Azure Cosmos DB.

## Source & sink connectors semantics

* **Source connector** - Currently this connector supports at-least once with multiple tasks and exactly once for single tasks.

* **Sink connector** -  This connector fully supports exactly once semantics.

## Supported data formats

The source and sink connectors can be configured to support the following data formats:

| Format | Description |
| :----------- | :---------- |
| Plain JSON  | JSON record structure without any attached schema. |
| JSON with schema | JSON record structure with explicit schema information to ensure the data matches the expected format. |
| AVRO | A row-oriented remote procedure call and data serialization framework developed within Apache's Hadoop project. It uses JSON for defining data types, protocols, and serializes data in a compact binary format.

The key and value settings, including the format and serialization can be independently configured in Kafka. So, it is possible to work with different data formats for keys and values, respectively. To cater for different data formats, there is converter configuration for both `key.converter` and `value.converter`.

## Converter configuration examples

### <a id="json-plain"></a>Plain JSON

If you need to use JSON without schema registry for connect data, use the `JsonConverter` supported with Kafka. The following example shows the `JsonConverter` key and value properties that are added to the configuration:

  ```java
  key.converter=org.apache.kafka.connect.json.JsonConverter
  key.converter.schemas.enable=false
  value.converter=org.apache.kafka.connect.json.JsonConverter
  value.converter.schemas.enable=false
  ```

### <a id="json-with-schema"></a>JSON with schema

Set the properties `key.converter.schemas.enable` and `value.converter.schemas.enable` to true so that the key or value is treated as a composite JSON object that contains both an internal schema and the data. Without these properties, the key or value is treated as plain JSON. 

  ```java
  key.converter=org.apache.kafka.connect.json.JsonConverter
  key.converter.schemas.enable=true
  value.converter=org.apache.kafka.connect.json.JsonConverter
  value.converter.schemas.enable=true
  ```

The resulting message to Kafka would look like the example below, with schema and payload as top-level elements in the JSON:

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
      ],
      "optional": false,
      "name": "ksql.users"
    },
    "payload": {
      "userid": 123,
      "name": "user's name"
    }
  }
  ```

> [!NOTE]
> The message written to Azure Cosmos DB is made up of the schema and payload. Notice the size of the message, as well as the proportion of it that is made up of the payload vs. the schema. The schema is repeated in every message you write to Kafka. In scenarios like this, you may want to use a serialization format like JSON Schema or AVRO, where the schema is stored separately, and the message holds just the payload.

### <a id="avro"></a>AVRO

The Kafka Connector supports AVRO data format. To use AVRO format, configure a `AvroConverter` so that Kafka Connect knows how to work with AVRO data. Azure Cosmos DB Kafka Connect has been tested with the [AvroConverter](https://www.confluent.io/hub/confluentinc/kafka-connect-avro-converter) supplied by Confluent, under Apache 2.0 license. You can also use a different custom converter if you prefer.

Kafka deals with keys and values independently. Specify the `key.converter` and `value.converter` properties as required in the worker configuration. When using `AvroConverter`, add an extra converter property that provides the URL for the schema registry. The following example shows the AvroConverter key and value properties that are added to the configuration:

  ```java
  key.converter=io.confluent.connect.avro.AvroConverter
  key.converter.schema.registry.url=http://schema-registry:8081
  value.converter=io.confluent.connect.avro.AvroConverter
  value.converter.schema.registry.url=http://schema-registry:8081
  ```

## Choose a conversion format

The following are some considerations on how to choose a conversion format:

* When configuring a **Source connector**:

  * If you want Kafka Connect to include plain JSON in the message it writes to Kafka, set [Plain JSON](#json-plain) configuration.

  * If you want Kafka Connect to include the schema in the message it writes to Kafka, set [JSON with Schema](#json-with-schema) configuration.

  * If you want Kafka Connect to include AVRO format in the message it writes to Kafka, set [AVRO](#avro) configuration.

* If you’re consuming JSON data from a Kafka topic into a **Sink connector**, understand how the JSON was serialized when it was written to the Kafka topic:

  * If it was written with JSON serializer, set Kafka Connect to use the JSON converter `(org.apache.kafka.connect.json.JsonConverter)`.

    * If the JSON data was written as a plain string, determine if the data includes a nested schema or  payload. If it does, set [JSON with schema](#json-with-schema) configuration.
    * However, if you’re consuming JSON data and it doesn’t have the schema or payload construct, then you must tell Kafka Connect **not** to look for a schema by setting `schemas.enable=false` as per [Plain JSON](#json-plain) configuration.

  * If it was written with AVRO serializer, set Kafka Connect to use the AVRO converter `(io.confluent.connect.avro.AvroConverter)` as per [AVRO](#avro) configuration.

## Configuration

### Common configuration properties

The source and sink connectors share the following common configuration properties:

| Name | Type | Description | Required/Optional |
| :--- | :--- | :--- | :--- |
| connect.cosmos.connection.endpoint | uri | Azure Cosmos DB endpoint URI string | Required |
| connect.cosmos.master.key | string | The Azure Cosmos DB primary key that the sink connects with. | Required |
| connect.cosmos.databasename | string | The name of the Azure Cosmos DB database the sink writes to. | Required |
| connect.cosmos.containers.topicmap | string | Mapping between Kafka topics and Azure Cosmos DB containers. It is formatted using CSV as `topic#container,topic2#container2` | Required |
| connect.cosmos.connection.gateway.enabled | boolean | Flag to indicate whether to use gateway mode. By default it is false. | Optional  |

For sink connector-specific configuration, see the [Sink Connector Documentation](kafka-connector-sink.md)

For source connector-specific configuration, see the [Source Connector Documentation](kafka-connector-source.md)

## Common configuration errors

If you misconfigure the converters in Kafka Connect, it can result in errors. These errors will show up at the Kafka Connector sink because you’ll try to deserialize the messages already stored in Kafka. Converter problems don’t usually occur in source because serialization is set at the source.

For more information, see [common configuration errors](https://www.confluent.io/blog/kafka-connect-deep-dive-converters-serialization-explained/#common-errors) doc.

## Project setup

Refer to the [Developer walkthrough and project setup](https://github.com/microsoft/kafka-connect-cosmosdb/blob/dev/doc/Developer_Walkthrough.md) for initial setup instructions.

## Performance testing

For more information on the performance tests run for the sink and source connectors, see the [Performance testing document](https://github.com/microsoft/kafka-connect-cosmosdb/blob/dev/doc/Performance_Testing.md).

Refer to the [Performance environment setup](https://github.com/microsoft/kafka-connect-cosmosdb/blob/dev/src/perf/README.md) for exact steps on deploying the performance test environment for the connectors.

## Resources

* [Kafka Connect](http://kafka.apache.org/documentation.html#connect)
* [Kafka Connect Deep Dive – Converters and Serialization Explained](https://www.confluent.io/blog/kafka-connect-deep-dive-converters-serialization-explained/)

## Next steps

* Kafka Connect for Azure Cosmos DB [source connector](kafka-connector-source.md)
* Kafka Connect for Azure Cosmos DB [sink connector](kafka-connector-sink.md)
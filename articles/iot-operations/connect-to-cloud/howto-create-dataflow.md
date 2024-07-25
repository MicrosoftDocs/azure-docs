---
title: Create a dataflow using Azure IoT Operations
description: Create a dataflow to connect data sources and destinations using Azure IoT Operations.
author: PatAltimore
ms.author: patricka
ms.subservice: azure-mqtt-broker
ms.topic: conceptual
ms.date: 07/26/2024

#CustomerIntent: As an operator, I want to understand how to create a dataflow to connect data sources.
---

# Create a dataflow

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

A dataflow is the path that data takes from the source to the destination with optional transformations. You can configure the dataflow using the Azure IoT Operations portal or by creating a *Dataflow* custom resource. Before creating a dataflow, you must [configure dataflow endpoints for the data sources and destinations](howto-configure-dataflow-endpoint.md).

The following is an example of a dataflow configuration with an MQTT source endpoint, transformations, and a Kafka destination endpoint:

```yaml
apiVersion: connectivity.iotoperations.azure.com/v1beta1
kind: Dataflow
metadata:
  name: my-dataflow
spec:
  profileRef: my-dataflow-profile
  mode: enabled
  operations:
    - operationType: source
      name: my-source
      sourceSettings:
        endpointRef: mq
        dataSources:
          - thermostats/+/telemetry/temperature/#
          - humidifiers/+/telemetry/humidity/#
        serializationFormat: avroBinary
        schemaRef: aio-sr://exampleNamespace/exampleAvroSchema:1.0.0
    - operationType: builtInTransformation
      name: my-transformation
      builtInTransformationSettings:
        enrich:
          - dataset: erp
            condition: $source.DataSetWriterName == $context(erp).asset
        filter:
          - inputs:
              - payload.temperature.Value ? $last
              - payload.Tag 10.Value
            condition: "$1 * $2 < 100000"
        map:
          - inputs:
              - Timestamp
            output: Timestamp
          - inputs:
              - payload.temperature.Value
            output: TemperatureF
            conversion: 32 - ($1 * 9/5)
          - inputs:
              - payload.Tag 10.Value
            output: Tag 10
          - inputs:
              - DataSetWriterName
            output: Asset
          - inputs:
              - $context(erp).location
            output: Location
          - inputs:
              - $context(erp).status
            output: Status
        serializationFormat: json
        schemaRef: aio-sr://exampleNamespace/exmapleJsonSchema:1.0.0
    - operationType: destination
      name: my-destination
      destinationSettings:
        endpointRef: kafka
        dataDestination: factory/$topic.2
```

| Name                        | Description                                                                |
|-----------------------------|----------------------------------------------------------------------------|
| profileRef                  | Reference to the [dataflow profile](howto-configure-dataflow-profile.md)           |
| mode                        | Mode of the dataflow. *enabled* or *disabled*                              |
| operations[]                | Operations performed by the dataflow                                       |
| operationType               | Type of operation. *source*, *destination*, or *builtInTransformation*     |

Review the following sections to learn how to configure the operation types of the dataflow.

## Configure source

To configure a source for the dataflow, specify the endpoint reference and data source. You can specify a list of data sources for the endpoint. For example, MQTT or Kafka topics. The following is an example of a dataflow configuration with a source endpoint and data source.

```yaml
apiVersion: connectivity.iotoperations.azure.com/v1beta1
kind: Dataflow
metadata:
  name: mq-to-kafka
  namespace: azure-iot-operations
spec:
  profileRef: example-dataflow
  operations:
    - operationType: source
      sourceSettings:
        endpointRef: mq-source
        dataSources:
        - $share/group/azure-iot-operations/data/thermostat
```

| Name                        | Description                                                                        |
|-----------------------------|------------------------------------------------------------------------------------|
| operationType               | *source*                                                                           |
| sourceSettings              | Settings for the *source* operation                                                |
| sourceSettings.endpointRef  | Reference to the *source* endpoint                                                 |
| sourceSettings.dataSources  | Data sources for the *source* operation. Wildcards ( `#` and `+` ) are supported.  |

### Use Asset as source

You can use an [asset](../discover-manage-assets/overview-manage-assets.md) as the source for the dataflow. Using an asset as a source is only available in the portal.

### Specify schema to deserialize data

If the data coming from the source is in a binary format like Avro, you must use `schemaRef` and `serializationFormat`. This is required for deserializing the data.

```yaml
spec:
  operations:
  - operationType: source
    sourceSettings:
      serializationFormat: avroBinary
      schemaRef: aio-sr://exampleNamespace/exampleAvroSchema:1.0.0
```

| Name                               | Description                                                                        |
|------------------------------------|------------------------------------------------------------------------------------|
| sourceSettings.serializationFormat | Format of the serialization. For example, *avroBinary*                             |
| sourceSettings.schemaRef           | Reference to the schema used for the source data                                   |

> [!TIP]
> If the source serialization format is JSON, `schemaRef` and `serializationFormat` aren't required. However, if the data has optional fields or fields with different types, you may want to specify the schema to ensure consistency. For example, the data might have fields that are not present in all messages. Without the schema, the transformation can't process fields with empty values. With the schema, you can specify default values or ignore the fields.

To specify the schema, create the file and store it in the schema registry.

```yaml
{
  "type": "record",
  "name": "Temperature",
  "fields": [
    {"name": "deviceId", "type": "string"},
    {"name": "temperature", "type": "float"}
  ]
}
```

## Configure transformation

The transformation operation is where you can transform the data from the source before sending it to the destination. Transformations are optional. If you don't need to make changes to the data, don't include the transformation operation in the dataflow configuration. Multiple transformations are chained together in stages regardless of the order they are specified in the configuration. 

```yaml
spec:
  operations:
  - operationType: builtInTransformation
    name: transform1
    builtInTransformationSettings:
      enrich:
        # ...
      filter:
        # ...
      map:
        # ...
```

| Name                                 | Description                                                                     |
|--------------------------------------|---------------------------------------------------------------------------------|
| operationType                        | *builtInTransformation*                                                         |
| name                                 | Name of the transformation                                                      |
| builtInTransformationSettings        | Settings for the *builtInTransformation* operation                              |
| builtInTransformationSettings.enrich | Add other data to the source data given a dataset and condition to match   |
| builtInTransformationSettings.filter | Filter the data based on a condition                                            |
| builtInTransformationSettings.map    | Move data from one field to another with an optional conversion                 |

### Enrich stage: Add extra data

To enrich the data, you can use a contextualization dataset stored in Azure IoT Operations's distributed state store (DSS). The dataset is used to add extra data to the source data based on a condition. The condition is specified as a field in the source data that matches a field in the dataset.

| Name                                           | Description                               |
|------------------------------------------------|-------------------------------------------|
| builtInTransformationSettings.enrich.dataset   | Dataset used for enrichment               |
| builtInTransformationSettings.enrich.condition | Condition for the enrichment operation    |

For example, you could use the `deviceId` field in the source data to match the `asset` field in the dataset:

```yaml
spec:
  operations:
  - operationType: builtInTransformation
    name: transform1
    builtInTransformationSettings:
      enrich:
        dataset: assetDataset
        condition: $source.deviceId == $context(assetDataset).asset
```

If the dataset has a record with the `asset` field, similar to:

```json
{
  "asset": "thermostat1",
  "location": "room1",
  "manufacturer": "Contoso"
}
```

The data from the source with the `deviceId` field matching `thermostat1` has the `location` and `manufacturer` fields available `filter` and `map` stages.

### Filter stage: Filter data based on a condition

To filter the data on a condition, you can use the `filter` stage. The condition is specified as a field in the source data that matches a value.

| Name                                           | Description                               |
|------------------------------------------------|-------------------------------------------|
| builtInTransformationSettings.enrich.dataset   | Dataset used for enrichment               |
| builtInTransformationSettings.enrich.condition | Condition for the enrichment operation    |

For example, you could use the `temperature` field in the source data to filter the data:

```yaml
spec:
  operations:
  - operationType: builtInTransformation
    name: transform1
    builtInTransformationSettings:
      filter:
        - inputs:
          - temperature ? $last # - $1
          condition: "$1 > 20"
```

If the `temperature` field is greater than 20, the data is passed to the next stage. If the `temperature` field is less than or equal to 20, the data is filtered.

### Map stage: Move data from one field to another

To map the data to another field with optional conversion, you can use the `map` stage. The conversion is specified as a formula that uses the fields in the source data.

| Name                                           | Description                               |
|------------------------------------------------|-------------------------------------------|
| builtInTransformationSettings.map[].inputs[]   | Inputs for the map operation              |
| builtInTransformationSettings.map[].output     | Output field for the map operation        |
| builtInTransformationSettings.map[].conversion | Conversion formula for the map operation  |

For example, you could use the `temperature` field in the source data to convert the temperature to Celsius and store it in the `temperatureCelsius` field. You could also enrich the source data with the `location` field from the contextualization dataset:

```yaml
spec:
  operations:
  - operationType: builtInTransformation
    name: transform1
    builtInTransformationSettings:
      map:
        - inputs:
          - temperature # - $1
          output: temperatureCelsius
          conversion: "($1 - 32) * 5/9"
        - inputs:
          - $context(assetDataset).location  
          output: location
```

To learn more, see the [Dataflow language syntax](concept-dataflow-language.md).

### Serialize data according to a schema

If you want to serialize the data before sending it to the destination, you need to specify a schema and serialization format. Otherwise, the data is serialized in JSON. Storage endpoints like Microsoft Fabric or Azure Data Lake require a schema to ensure data consistency.

| Name                                              | Description                                          |
|---------------------------------------------------|------------------------------------------------------|
| builtInTransformationSettings.serializationFormat | Format of the serialization                          |
| builtInTransformationSettings.schemaRef           | Reference to the schema used for the transformation  |

For example, you could serialize the data in Parquet format using the schema:

```yaml
spec:
  operations:
  - operationType: builtInTransformation
    builtInTransformationSettings:
      serializationFormat: parquet
      schemaRef: aio-sr://exampleNamespace/exmapleParquetSchema:1.0.0
```

To specify the schema, you can create a *Schema* custom resource with the schema definition.

```json
{
  "type": "record",
  "name": "Temperature",
  "fields": [
    {"name": "deviceId", "type": "string"},
    {"name": "temperatureCelsius", "type": "float"}
    {"name": "location", "type": "string"}
  ]
}
```

## Configure destination

To configure a destination for the dataflow, you need to specify the endpoint and a path (topic or table) for the destination.

| Name                        | Description                                                                |
|-----------------------------|----------------------------------------------------------------------------|
| destinationSettings.endpointRef | Reference to the *destination* endpoint                                |
| destinationSettings.dataDestination | Destination for the data                                           |

### Use Asset as destination

You can use an [asset](../discover-manage-assets/overview-manage-assets.md) as the destination for the dataflow. Managing assets is only available in the Azure portal.

### Configure destination endpoint reference

To configure the endpoint for the destination, you need to specify the ID and endpoint reference.

```yaml
spec:
  operations:
  - operationType: destination
    name: destination1
    destinationSettings:
      endpointRef: eventgrid
```

### Configure destination path

Once you have the endpoint, you can configure the path for the destination. If the destination is an MQTT or Kafka endpoint, use the path to specify the topic.

```yaml
- operationType: destination
  destinationSettings:
    endpointRef: eventgrid
    dataDestination: factory/$topic.2
```

For storage endpoints like Microsoft Fabric, use the path to specify the table name.

```yaml
- operationType: destination
  destinationSettings:
    endpointRef: adls
    dataDestination: telemetryTable
```

#### Dynamic output path

You can use dynamic path segments to reference properties or metadata from the source message. For example, you can use `$topic` to reference the topic from the source data.

```yaml
- operationType: destination
  destinationSettings:
    dataDestination: factory/$topic.2
```

If the source is an MQTT broker, with messages coming from topic `thermostats/+/temperature/` , the output path is dynamically resolved. For example, if the source topic is `thermostats/1/temperature/` , the output path is `factory/1` . To use the full source topic, you can use `$topic` without the index.

To use data from the MQTT or Kafka payload in the output path, you can use JSON path expressions.

```yaml
- operationType: destination
  destinationSettings:
    dataDestination: factory/$payload.temperature.value
```

If the payload is a JSON object like `{"temperature": {"value": 25}}` , the output path is `factory/25` .

You can also use system properties like `timestamp` , `clientId` , and `messageId` .

```yaml
- operationType: destination
  destinationSettings:
    dataDestination: factory/$systemProperties.timestamp
```

You can also use user properties.

```yaml
- operationType: destination
  destinationSettings:
    dataDestination: factory/$userProperties.customer
```

If the user property isn't present in the source data, the part of the path referencing the user property is empty. For example, if the user property `customer` isn't present in the source data, the output path is `factory/` .

If you specified an *enrich* stage during transformation, you can use the enriched data in the output path.

```yaml
spec:
  operations:
  - operationType: destination
    destinationSettings:
      endpointRef: eventgrid
      dataDestination: factory/$context(assetDataset).location
```

Lastly, you can use `$subscription(example/topic)` to subscribe to a topic from the source endpoint and use the result in the path. This is useful when you want to use the value from a specific topic in the output path, like for meta Unified Namespace (UNS) topics.

```yaml
spec:
  operations:
  - operationType: destination
    destinationSettings:
      endpointRef: eventgrid
      dataDestination: factory/$subscription(meta/thermostat/uns)
```

Here, if the message from the `meta/thermostat/uns` topic is `thermostats/1/temperature/` , the output path is `factory/thermostats/1/temperature/` .

The full list of parameters that can be used in the path includes:

| Parameter | Description |
| --- | --- |
| `$topic` | The full input topic. |
| `$topic.<index>` | A segment of the input topic. The index starts at 1. |
| `$systemProperties.<property>` | A system property of the message. |
| `$userProperties.<property>` | A user property of the message. |
| `$payload.<value>` | A value from the message payload. Use JSON path expression nested values. |
| `$context(<dataset>).<property>` | A property from the contextualization dataset specified in *enrich* stage. |
| `$subscription(<topic>)` | The value of a single message from the specified topic. |


## Test dataflow

After configuring the dataflow, you can test it by sending test data and viewing the outcome.

### Send test data

To send test data to the dataflow, you can use the Azure IoT Operations portal, Azure CLI, or call the REST API.

```bash
az iotops dataflow send-test-data --dataflow-name my-dataflow --data '{
  "assetName": "thermostat",
  "temperature": 25
}'
```

### View outcome

And the outcome can be viewed as a response:

```output
{
  "status": "success",
  "message": "Data sent successfully",
  "data": {
    "deviceId": "thermostat",
    "customer": "Contoso",
    "temperatureCelsius": 25,
    "temperatureKelvin": 298
  }
}
```

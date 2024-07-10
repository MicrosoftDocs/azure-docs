---
title: Create dataflow
description: Create a dataflow.
author: PatAltimore
ms.author: patricka
ms.subservice: azure-mqtt-broker
ms.topic: conceptual
ms.date: 07/10/2024

#CustomerIntent: As an operator, I want to understand how to I can use Dataflows to .
---

# Create dataflow

A dataflow is the path that data takes from the source to the destination with optional transformations. You can configure the dataflow using the Azure IoT Operations portal or by creating a Dataflow custom resource. Before creating a dataflow, you must create endpoints for the data sources and destinations. For more information, see [Configure dataflow endpoints](howto-configure-dataflow-endpoint.md).

## Configure source

To configure a source for the dataflow, you need to specify the endpoint and topic for the source.

Use the `id` field to specify the source ID. The source ID is used to identify the source in the dataflow. To configure the endpoint for the source, you need to specify the endpoint reference. 

Once you have the endpoint, you can configure the list of `paths`. Despite the name, `paths` is used for MQTT or Kafka topics (or potentially other things like table names in the future). Wildcards ( `#` and `+` ) are supported.

```yaml
spec:
  operations:
  - source:
      id: source1
      endpointRef: mq
      paths:
        - thermostats/+/telemetry/temperature/#
        - humidifiers/+/telemetry/humidity/#
```

### Use Asset as source

You can use an [asset](../discover-manage-assets/overview-manage-assets.md) as the source for the dataflow. Using an asset as a source is only available in the portal.

#### Specify schema to deserialize data

If the data coming from the source is in a binary format like Avro, you must use `schemaRef` and `serializationFormat`. This is required for deserializing the data.

```yaml
spec:
  operations:
  - source:
      serializationFormat: avroBinary
      schemaRef: aio-sr://exampleNamespace/exmapleAvroSchema:1.0.0
```

> [!TIP]
> If the source serialization format is JSON, `schemaRef` and `serializationFormat` aren't required. However, if the data has optional fields or fields with different types, you may want to specify the schema to ensure consistency. For example, the data might have fields that are not present in all messages. Without the schema, the transformation can't handle these fields as they would have empty values. With the schema, you can specify default values or ignore the fields.

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

The transformation operation is where you can transform the data from the source before sending it to the destination. The transformation operation include:

* **Enrich**: Add additional data to the source data given a dataset and condition to match.
* **Filter**: Filter the data based on a condition.
* **Map**: Move data from one field to another with an optional conversion.

These actions are each optional, and are chained together in order regardless of the order they are specified in the configuration.

```yaml
spec:
  operations:
  - builtInTransformation:
      id: transform1
      enrich:
        ...
      filter:
        ...
      map:
        ...
```

Using transformation in a dataflow is optional. If you don't need to make changes to the data, you can skip this operation.

### Configure contextualization dataset with the `enrich` stage

To enrich the data, you can use a contextualization dataset stored in AIO's Distributed State Store (DSS). The dataset is used to add additional data to the source data based on a condition. The condition is specified as a field in the source data that matches a field in the dataset.

```yaml
spec:
  operations:
  - builtInTransformation:
      id: transform1
      enrich:
        dataset: assetDataset
        condition: $source.deviceId == $context(assetDataset).asset
```

In this example, the `deviceId` field in the source data is used to match the `asset` field in the dataset. If the dataset has a record with the `asset` field, like this:

```json
{
  "asset": "thermostat1",
  "location": "room1",
  "manufacturer": "Contoso"
}
```

The data from the source with the `deviceId` field matching `thermostat1` can have the `location` and `manufacturer` fields available `filter` and `map` stages.

### Filter data with the `filter` stage

To filter the data, you can use the `filter` stage. The filter stage is used to filter the data based on a condition. The condition is specified as a field in the source data that matches a value.

```yaml
spec:
  operations:
  - builtInTransformation:
      id: transform1
      filter:
        - inputs:
          - temperature ? $last # - $1
          condition: "$1 > 20"
```

In this example, the `temperature` field in the source data is used to filter the data. If the `temperature` field is greater than 20, the data is passed to the next stage. If the `temperature` field is less than or equal to 20, the data is dropped.

### Map data with the `map` stage

To map the data, you can use the `map` stage. The map stage is used to move data from one field to another with an optional conversion. The conversion is specified as a formula that uses the fields in the source data.

```yaml
spec:
  operations:
  - builtInTransformation:
      id: transform1
      map:
        - inputs:
          - temperature # - $1
          output: temperatureCelsius
          conversion: "($1 - 32) * 5/9"
        - inputs:
          - $context(assetDataset).location  
          output: location
```

In this example, the `temperature` field in the source data is converted to Celsius and stored in the `temperatureCelsius` field. The `location` field is enriched to the source data from the contextualization dataset.

To learn more, see the [Dataflow Language Design](#language-design) section.

<!-- #### (Preview) Use WASM modules for custom transformations

To perform custom transformations, you can use WebAssembly (WASM) modules. The WASM modules are used to perform custom transformations on the data. The WASM modules are specified as a URL to the module.

```yaml
apiVersion: iotoperations.azure.com/v1beta1 # Note the beta version
kind: Dataflow
metadata:
  name: my-dataflow-with-wasm
spec:
  operations:
  - source:
    ...
  - map:
      id: 2
      function:
        - url: https://example.com/transform.wasm
  - edges:
    ...
  - destination:
    ...
``` -->

### Serialize data according to a schema

If you want to serialize the data before sending it to the destination, you need to specify a schema and serialization format. Otherwise, the data will be serialized in JSON. Remember that storage endpoints like Microsoft Fabric or Azure Data Lake require a schema to ensure data consistency.

```yaml
spec:
  operations:
  - builtInTransformation:
      serializationFormat: parquet
      schemaRef: aio-sr://exampleNamespace/exmapleParquetSchema:1.0.0
```

To specify the schema, you can create a Schema CR with the schema definition.

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

### Use Asset as destination (portal only)

You can use an [asset](https://learn.microsoft.com/en-us/azure/iot-operations/manage-devices-assets/overview-manage-assets) as the destination for the dataflow. This is only available in the portal.

### Configure destination endpoint reference

To configure the endpoint for the destination, you need to specify the ID and endpoint reference.

```yaml
spec:
  operations:
  - destination:
      id: destination1
      endpointRef: eventgrid
```

### Configure destination path

Once you have the endpoint, you can configure the path for the destination. If the destination is an MQTT or Kafka endpoint, use the path to specify the topic.

```yaml
- destination:
    endpointRef: eventgrid
    path: factory/$topic.2
```

For storage endpoints like Microsoft Fabric, use the path to specify the table name.

```yaml
- destination:
    endpointRef: adls
    path: telemetryTable
```

#### Dynamic output path

You can use dynamic path segments to reference properties or metadata from the source message. For example, you can use `$topic` to reference the topic from the source data.

```yaml
- destination:
    path: factory/$topic.2
```

If the source is an MQTT broker, with messages coming from topic `thermostats/+/temperature/` , the output path is dynamically resolved. For example, if the source topic is `thermostats/1/temperature/` , the output path will be `factory/1` . To use the full source topic, you can use `$topic` without the index.

To use data from the MQTT or Kafka payload in the output path, you can use JSON path expressions.

```yaml
- destination:
    path: factory/$payload.temperature.value
```

If the payload is a JSON object like `{"temperature": {"value": 25}}` , the output path will be `factory/25` .

You can also use system properties like `timestamp` , `clientId` , and `messageId` .

```yaml
- destination:
    path: factory/$systemProperties.timestamp
```

As well as user properties.

```yaml
- destination:
    path: factory/$userProperties.customer
```

If the user property is not present in the source data, the part of the path referencing the user property will be empty. For example, if the user property `customer` is not present in the source data, the output path will be `factory/` .

If you specified a `enrich` stage during transformation, you can use the enriched data in the output path.

```yaml
spec:
  operations:
  - destination:
      endpointRef: eventgrid
      path: factory/$context(assetDataset).location
```

Lastly, you can use `$subscription(example/topic)` to subscribe to a topic from the source endpoint and use the result in the path. This is useful when you want to use the value from a specific topic in the output path, like for meta Unified Namespace (UNS) topics.

```yaml
spec:
  operations:
  - destination:
      endpointRef: eventgrid
      path: factory/$subscription(meta/thermostat/uns)
```

Here, if the message from the `meta/thermostat/uns` topic is `thermostats/1/temperature/` , the output path will be `factory/thermostats/1/temperature/` .

The full list of parameters that can be used in the path includes:

| Parameter | Description |
| --- | --- |
| `$topic` | The full input topic. |
| `$topic.<index>` | A segment of the input topic. The index starts at 1. |
| `$systemProperties.<property>` | A system property of the message. |
| `$userProperties.<property>` | An user property of the message. |
| `$payload.<value>` | A value from the message payload. Use JSON path expression nested values. |
| `$context(<dataset>).<property>` | A property from the contextualization dataset specified in `enrich` stage. |
| `$subscription(<topic>)` | The value of a single message from the specified topic. |

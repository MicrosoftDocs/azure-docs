---
title: Create a dataflow using Azure IoT Operations
description: Create a dataflow to connect data sources and destinations using Azure IoT Operations.
author: PatAltimore
ms.author: patricka
ms.subservice: azure-data-flows
ms.topic: how-to
ms.date: 08/12/2024

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
        serializationFormat: json
    - operationType: builtInTransformation
      name: my-transformation
      builtInTransformationSettings:
        filter:
          - inputs:
              - 'temperature.Value'
              - '"Tag 10".Value'
            expression: "$1*$2<100000"
        map:
          - inputs:
              - '*'
            output: '*'
          - inputs:
              - temperature.Value
            output: TemperatureF
            expression: cToF($1)
          - inputs:
              - '"Tag 10".Value'
            output: 'Tag 10'
        serializationFormat: json
    - operationType: destination
      name: my-destination
      destinationSettings:
        endpointRef: kafka
        dataDestination: factory
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
        - azure-iot-operations/data/thermostat
```

| Name                        | Description                                                                        |
|-----------------------------|------------------------------------------------------------------------------------|
| operationType               | *source*                                                                           |
| sourceSettings              | Settings for the *source* operation                                                |
| sourceSettings.endpointRef  | Reference to the *source* endpoint                                                 |
| sourceSettings.dataSources  | Data sources for the *source* operation. Wildcards ( `#` and `+` ) are supported.  |


## Configure transformation

The transformation operation is where you can transform the data from the source before sending it to the destination. Transformations are optional. If you don't need to make changes to the data, don't include the transformation operation in the dataflow configuration. Multiple transformations are chained together in stages regardless of the order they're specified in the configuration. 

```yaml
spec:
  operations:
  - operationType: builtInTransformation
    name: transform1
    builtInTransformationSettings:
      datasets:
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
| builtInTransformationSettings.datasets | Add other data to the source data given a dataset and condition to match   |
| builtInTransformationSettings.filter | Filter the data based on a condition                                            |
| builtInTransformationSettings.map    | Move data from one field to another with an optional conversion                 |

### Enrich: Add reference data

To enrich the data, you can use a reference dataset in Azure IoT Operations's [distributed state store (DSS)](concept-about-state-store-protocol.md). The dataset is used to add extra data to the source data based on a condition. The condition is specified as a field in the source data that matches a field in the dataset.

| Name                                           | Description                               |
|------------------------------------------------|-------------------------------------------|
| builtInTransformationSettings.datasets.key   | Dataset used for enrichment (key in DSS)              |
| builtInTransformationSettings.datasets.expression | Condition for the enrichment operation    |

Key names in the distributed state store correspond to a dataset in the dataflow configuration. 

For example, you could use the `deviceId` field in the source data to match the `asset` field in the dataset:

```yaml
spec:
  operations:
  - operationType: builtInTransformation
    name: transform1
    builtInTransformationSettings:
      datasets:
      - key: assetDataset
        inputs:
          - $source.deviceId # ------------- $1
          - $context(assetDataset).asset # - $2
        expression: $1 == $2
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

You can load sample data into the distributed state store (DSS) using the [DSS set tool sample](https://github.com/Azure-Samples/explore-iot-operations/tree/main/samples/dss_set).

For more information about condition syntax, see [Enrich data using dataflows](concept-dataflow-enrich.md) and [Convert data using dataflows](concept-dataflow-conversions.md).

### Filter: Filter data based on a condition

To filter the data on a condition, you can use the `filter` stage. The condition is specified as a field in the source data that matches a value.

| Name                                           | Description                               |
|------------------------------------------------|-------------------------------------------|
| builtInTransformationSettings.filter.inputs[]   | Inputs to evaluate a filter condition               |
| builtInTransformationSettings.filter.expression | Condition for the filter evaluation   |

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
          expression: "$1 > 20"
```

If the `temperature` field is greater than 20, the data is passed to the next stage. If the `temperature` field is less than or equal to 20, the data is filtered.

### Map: Move data from one field to another

To map the data to another field with optional conversion, you can use the `map` operation. The conversion is specified as a formula that uses the fields in the source data.

| Name                                           | Description                               |
|------------------------------------------------|-------------------------------------------|
| builtInTransformationSettings.map[].inputs[]   | Inputs for the map operation              |
| builtInTransformationSettings.map[].output     | Output field for the map operation        |
| builtInTransformationSettings.map[].expression | Conversion formula for the map operation  |

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
          expression: "($1 - 32) * 5/9"
        - inputs:
          - $context(assetDataset).location  
          output: location
```

To learn more, see the [Map data using dataflows](concept-dataflow-mapping.md) and [Convert data using dataflows](concept-dataflow-conversions.md).

## Configure destination

To configure a destination for the dataflow, you need to specify the endpoint and a path (topic or table) for the destination.

| Name                        | Description                                                                |
|-----------------------------|----------------------------------------------------------------------------|
| destinationSettings.endpointRef | Reference to the *destination* endpoint                                |
| destinationSettings.dataDestination | Destination for the data                                           |


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
    dataDestination: factory
```

For storage endpoints like Microsoft Fabric, use the path to specify the table name.

```yaml
- operationType: destination
  destinationSettings:
    endpointRef: adls
    dataDestination: telemetryTable
```


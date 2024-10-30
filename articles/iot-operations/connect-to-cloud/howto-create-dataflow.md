---
title: Create a dataflow using Azure IoT Operations
description: Create a dataflow to connect data sources and destinations using Azure IoT Operations.
author: PatAltimore
ms.author: patricka
ms.service: azure-iot-operations
ms.subservice: azure-data-flows
ms.topic: how-to
ms.date: 10/08/2024
ai-usage: ai-assisted

#CustomerIntent: As an operator, I want to understand how to create a dataflow to connect data sources.
---

# Configure dataflows in Azure IoT Operations

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

A dataflow is the path that data takes from the source to the destination with optional transformations. You can configure the dataflow by creating a *Dataflow* custom resource or using the Azure IoT Operations Studio portal. A dataflow is made up of three parts: the **source**, the **transformation**, and the **destination**. 

<!--
```mermaid
flowchart LR
  subgraph Source
  A[DataflowEndpoint]
  end
  subgraph BuiltInTransformation
  direction LR
  Datasets - -> Filter
  Filter - -> Map
  end
  subgraph Destination
  B[DataflowEndpoint]
  end
  Source - -> BuiltInTransformation
  BuiltInTransformation - -> Destination
```
-->

:::image type="content" source="media/howto-create-dataflow/dataflow.svg" alt-text="Diagram of a dataflow showing flow from source to transform then destination.":::

To define the source and destination, you need to configure the dataflow endpoints. The transformation is optional and can include operations like enriching the data, filtering the data, and mapping the data to another field. 

You can use the operations experience in Azure IoT Operations to create a dataflow. The operations experience provides a visual interface to configure the dataflow. You can also use Bicep to create a dataflow using a Bicep template file, or use Kubernetes to create a dataflow using a YAML file.

Continue reading to learn how to configure the source, transformation, and destination.

## Prerequisites

You can deploy dataflows as soon as you have an instance of [Azure IoT Operations Preview](../deploy-iot-ops/howto-deploy-iot-operations.md) using the default dataflow profile and endpoint. However, you might want to configure dataflow profiles and endpoints to customize the dataflow.

### Dataflow profile

The dataflow profile specifies the number of instances for the dataflows under it to use. If you don't need multiple groups of dataflows with different scaling settings, you can use the default dataflow profile. To learn how to configure a dataflow profile, see [Configure dataflow profiles](howto-configure-dataflow-profile.md).

### Dataflow endpoints

Dataflow endpoints are required to configure the source and destination for the dataflow. To get started quickly, you can use the [default dataflow endpoint for the local MQTT broker](./howto-configure-mqtt-endpoint.md#default-endpoint). You can also create other types of dataflow endpoints like Kafka, Event Hubs, or Azure Data Lake Storage. To learn how to configure each type of dataflow endpoint, see [Configure dataflow endpoints](howto-configure-dataflow-endpoint.md).

## Get started

Once you have the prerequisites, you can start to create a dataflow.

# [Portal](#tab/portal)

To create a dataflow in [operations experience](https://iotoperations.azure.com/), select **Dataflow** > **Create dataflow**. Then, you see the page where you can configure the source, transformation, and destination for the dataflow.

:::image type="content" source="media/howto-create-dataflow/create-dataflow.png" alt-text="Screenshot using operations experience to create a dataflow.":::

# [Bicep](#tab/bicep)

Create a Bicep `.bicep` file to start creating a dataflow. This example shows the structure of the dataflow containing the source, transformation, and destination configurations.

```bicep
param aioInstanceName string = '<AIO_INSTANCE_NAME>'
param customLocationName string = '<CUSTOM_LOCATION_NAME>'
param dataflowName string = '<DATAFLOW_NAME>'

resource aioInstance 'Microsoft.IoTOperations/instances@2024-08-15-preview' existing = {
  name: aioInstanceName
}

resource customLocation 'Microsoft.ExtendedLocation/customLocations@2021-08-31-preview' existing = {
  name: customLocationName
}

resource defaultDataflowEndpoint 'Microsoft.IoTOperations/instances/dataflowEndpoints@2024-08-15-preview' existing = {
  parent: aioInstance
  name: 'default'
}

// Pointer to the default dataflow profile
resource defaultDataflowProfile 'Microsoft.IoTOperations/instances/dataflowProfiles@2024-08-15-preview' existing = {
  parent: aioInstance
  name: 'default'
}

resource dataflow 'Microsoft.IoTOperations/instances/dataflowProfiles/dataflows@2024-08-15-preview' = {
  // Reference to the parent dataflow profile, the default profile in this case
  // Same usage as profileRef in Kubernetes YAML
  parent: defaultDataflowProfile
  name: dataflowName
  extendedLocation: {
    name: customLocation.id
    type: 'CustomLocation'
  }
  properties: {
    mode: 'Enabled'
    operations: [
      {
        operationType: 'Source'
        sourceSettings: {
          // See source configuration section
        }
      }
      {
        operationType: 'BuiltInTransformation'
        builtInTransformationSettings: {
          // See transformation configuration section
        }
      }
      {
        operationType: 'Destination'
        destinationSettings: {
          // See destination configuration section
        }
      }
    ]
  }
}
```

# [Kubernetes](#tab/kubernetes)

Create a Kubernetes manifest `.yaml` file to start creating a dataflow. This example shows the structure of the dataflow containing the source, transformation, and destination configurations.

```yaml
apiVersion: connectivity.iotoperations.azure.com/v1beta1
kind: Dataflow
metadata:
  name: <DATAFLOW_NAME>
  namespace: azure-iot-operations
spec:
  # Reference to the default dataflow profile
  # This field is required when configuring via Kubernetes YAML
  # The syntax is different when using Bicep
  profileRef: default 
  mode: Enabled
  operations:
    - operationType: Source
      sourceSettings:
        # See source configuration section
    - operationType: BuiltInTransformation
      builtInTransformationSettings:
        # See transformation configuration section
    - operationType: Destination
      destinationSettings:
        # See destination configuration section
```

---

Review the following sections to learn how to configure the operation types of the dataflow.

## Source

To configure a source for the dataflow, specify the endpoint reference and a list of data sources for the endpoint.

### Use Asset as source

# [Portal](#tab/portal)

You can use an [asset](../discover-manage-assets/overview-manage-assets.md) as the source for the dataflow. Using an asset as a source is only available in the operations experience.

1. Under **Source details**, select **Asset**.
1. Select the asset you want to use as the source endpoint.
1. Select **Proceed**.

    A list of datapoints for the selected asset is displayed.

    :::image type="content" source="media/howto-create-dataflow/dataflow-source-asset.png" alt-text="Screenshot using operations experience to select an asset as the source endpoint.":::

1. Select **Apply** to use the asset as the source endpoint.

# [Bicep](#tab/bicep)

Configuring an asset as a source is only available in the operations experience.

# [Kubernetes](#tab/kubernetes)

Configuring an asset as a source is only available in the operations experience.

---

### Use default MQTT endpoint as source

# [Portal](#tab/portal)

1. Under **Source details**, select **MQTT**.

    :::image type="content" source="media/howto-create-dataflow/dataflow-source-mqtt.png" alt-text="Screenshot using operations experience to select MQTT as the source endpoint.":::

1. Enter the following settings for the MQTT source:

    | Setting              | Description                                                                                       |
    | -------------------- | ------------------------------------------------------------------------------------------------- |
    | MQTT topic           | The MQTT topic filter to subscribe to for incoming messages. See [Configure MQTT or Kafka topics](#configure-data-sources-mqtt-or-kafka-topics). |
    | Message schema       | The schema to use to deserialize the incoming messages. See [Specify schema to deserialize data](#specify-schema-to-deserialize-data). |

1. Select **Apply**.

# [Bicep](#tab/bicep)

The MQTT endpoint is configured in the Bicep template file. For example, the following endpoint is a source for the dataflow.

```bicep
sourceSettings: {
  endpointRef: defaultDataflowEndpoint
  dataSources: [
    'thermostats/+/telemetry/temperature/#',
    'humidifiers/+/telemetry/humidity/#'
  ]
}
```

Here, `dataSources` allow you to specify multiple MQTT or Kafka topics without needing to modify the endpoint configuration. This means the same endpoint can be reused across multiple dataflows, even if the topics vary. To learn more, see [Configure data sources](#configure-data-sources-mqtt-or-kafka-topics).

# [Kubernetes](#tab/kubernetes)

For example, to configure a source using an MQTT endpoint and two MQTT topic filters, use the following configuration:

```yaml
sourceSettings:
  endpointRef: default
  dataSources:
    - thermostats/+/telemetry/temperature/#
    - humidifiers/+/telemetry/humidity/#
```

Because `dataSources` allows you to specify MQTT or Kafka topics without modifying the endpoint configuration, you can reuse the endpoint for multiple dataflows even if the topics are different. To learn more, see [Configure data sources](#configure-data-sources-mqtt-or-kafka-topics).

---

For more information about the default MQTT endpoint and creating an MQTT endpoint as a dataflow source, see [MQTT Endpoint](howto-configure-mqtt-endpoint.md).

### Use custom MQTT or Kafka dataflow endpoint as source

If you created a custom MQTT or Kafka dataflow endpoint (for example, to use with Event Grid or Event Hubs), you can use it as the source for the dataflow. Remember that storage type endpoints, like Data Lake or Fabric OneLake, cannot be used as source.

To configure, use Kubernetes YAML or Bicep. Replace placeholder values with your custom endpoint name and topics.

# [Portal](#tab/portal)

Using a custom MQTT or Kafka endpoint as a source is currently not supported in the operations experience.

# [Bicep](#tab/bicep)

```bicep
sourceSettings: {
  endpointRef: <CUSTOM_ENDPOINT_NAME>
  dataSources: [
    '<TOPIC_1>',
    '<TOPIC_2>'
    // See section on configuring MQTT or Kafka topics for more information
  ]
}
```

# [Kubernetes](#tab/kubernetes)

```yaml
sourceSettings:
  endpointRef: <CUSTOM_ENDPOINT_NAME>
  dataSources:
  - <TOPIC_1>
  - <TOPIC_2>
  # See section on configuring MQTT or Kafka topics for more information
```

---

### Configure data sources (MQTT or Kafka topics)

You can specify multiple MQTT or Kafka topics in a source without needing to modify the dataflow endpoint configuration. This means the same endpoint can be reused across multiple dataflows, even if the topics vary. For more information, see [Reuse dataflow endpoints](./howto-configure-dataflow-endpoint.md#reuse-endpoints).

#### MQTT topics

When the source is an MQTT (Event Grid included) endpoint, you can use the MQTT topic filter to subscribe to incoming messages. The topic filter can include wildcards to subscribe to multiple topics. For example, `thermostats/+/telemetry/temperature/#` subscribes to all temperature telemetry messages from thermostats. To configure the MQTT topic filters:

# [Portal](#tab/portal)

In the operations experience dataflow **Source details**, select **MQTT**, then use the **MQTT topic** field to specify the MQTT topic filter to subscribe to for incoming messages.

> [!NOTE]
> Only one MQTT topic filter can be specified in the operations experience. To use multiple MQTT topic filters, use Bicep or Kubernetes.

# [Bicep](#tab/bicep)

```bicep
sourceSettings: {
  endpointRef: <MQTT_ENDPOINT_NAME>
  dataSources: [
    '<MQTT_TOPIC_FILTER_1>',
    '<MQTT_TOPIC_FILTER_2>'
    // Add more MQTT topic filters as needed
  ]
}
```

Example with multiple MQTT topic filters with wildcards:

```bicep
sourceSettings: {
  endpointRef: default
  dataSources: [
    'thermostats/+/telemetry/temperature/#',
    'humidifiers/+/telemetry/humidity/#'
  ]
}
```

Here, the wildcard `+` is used to select all devices under the `thermostats` and `humidifiers` topics. The `#` wildcard is used to select all telemetry messages under all subtopics of the `temperature` and `humidity` topics.

# [Kubernetes](#tab/kubernetes)
  
```yaml
sourceSettings:
  endpointRef: <MQTT_ENDPOINT_NAME>
  dataSources:
    - <MQTT_TOPIC_FILTER_1>
    - <MQTT_TOPIC_FILTER_2>
    # Add more MQTT topic filters as needed
```

Example with multiple MQTT topic filters with wildcards:

```yaml
sourceSettings:
  endpointRef: default
  dataSources:
    - thermostats/+/telemetry/temperature/#
    - humidifiers/+/telemetry/humidity/#
```

Here, the wildcard `+` is used to select all devices under the `thermostats` and `humidifiers` topics. The `#` wildcard is used to select all telemetry messages under all subtopics of the `temperature` and `humidity` topics.

---

##### Shared subscriptions

To use shared subscriptions with MQTT sources, you can specify the shared subscription topic in the form of `$shared/<GROUP_NAME>/<TOPIC_FILTER>`.

# [Portal](#tab/portal)

In operations experience dataflow **Source details**, select **MQTT** and use the **MQTT topic** field to specify the shared subscription group and topic.

# [Bicep](#tab/bicep)

```bicep
sourceSettings: {
  dataSources: [
    '$shared/<GROUP_NAME>/<TOPIC_FILTER>'
  ]
}
```

# [Kubernetes](#tab/kubernetes)

```yaml
sourceSettings:
  dataSources:
    - $shared/<GROUP_NAME>/<TOPIC_FILTER>
```

---

> [!NOTE]
> If the instance count in the [dataflow profile](howto-configure-dataflow-profile.md) is greater than 1, shared subscription must be enabled for all MQTT topic filters by adding topic prefix `$shared/<GROUP_NAME>` to each topic filter.

<!-- TODO: Details -->

#### Kafka topics

When the source is a Kafka (Event Hubs included) endpoint, specify the individual kafka topics to subscribe to for incoming messages. Wildcards are not supported, so you must specify each topic statically.

> [!NOTE]
> When using Event Hubs via the Kafka endpoint, each individual event hub within the namespace is the Kafka topic. For example, if you have an Event Hubs namespace with two event hubs, `thermostats` and `humidifiers`, you can specify each event hub as a Kafka topic.

To configure the Kafka topics:

# [Portal](#tab/portal)

Using a Kafka endpoint as a source is currently not supported in the operations experience.

# [Bicep](#tab/bicep)

```bicep
sourceSettings: {
  endpointRef: <KAFKA_ENDPOINT_NAME>
  dataSources: [
    '<KAFKA_TOPIC_1>',
    '<KAFKA_TOPIC_2>'
    // Add more Kafka topics as needed
  ]
}
```

# [Kubernetes](#tab/kubernetes)

```yaml
sourceSettings:
  endpointRef: <KAFKA_ENDPOINT_NAME>
  dataSources:
    - <KAFKA_TOPIC_1>
    - <KAFKA_TOPIC_2>
    # Add more Kafka topics as needed
```

---

### Specify schema to deserialize data

If the source data has optional fields or fields with different types, specify a deserialization schema to ensure consistency. For example, the data might have fields that aren't present in all messages. Without the schema, the transformation can't handle these fields as they would have empty values. With the schema, you can specify default values or ignore the fields.

Specifying the schema is only relevant when using the MQTT or Kafka source. If the source is an asset, the schema is automatically inferred from the asset definition.

To configure the schema used to deserialize the incoming messages from a source:

# [Portal](#tab/portal)

In operations experience dataflow **Source details**, select **MQTT** and use the **Message schema** field to specify the schema. You can use the **Upload** button to upload a schema file first. To learn more, see [Understand message schemas](concept-schema-registry.md).

# [Bicep](#tab/bicep)

Once you have used the [schema registry to store the schema](concept-schema-registry.md), you can reference it in the dataflow configuration.

```bicep
sourceSettings: {
  serializationFormat: 'Json'
  schemaRef: 'aio-sr://<SCHEMA_NAMESPACE>/<SCHEMA_NAME>:<VERSION>'
}
```

# [Kubernetes](#tab/kubernetes)

Once you have used the [schema registry to store the schema](concept-schema-registry.md), you can reference it in the dataflow configuration.

```yaml
sourceSettings:
  serializationFormat: Json
  schemaRef: 'aio-sr://<SCHEMA_NAMESPACE>/<SCHEMA_NAME>:<VERSION>'
```

---

## Transformation

The transformation operation is where you can transform the data from the source before you send it to the destination. Transformations are optional. If you don't need to make changes to the data, don't include the transformation operation in the dataflow configuration. Multiple transformations are chained together in stages regardless of the order in which they're specified in the configuration. The order of the stages is always:

1. **Enrich**: Add additional data to the source data given a dataset and condition to match.
1. **Filter**: Filter the data based on a condition.
1. **Map**: Move data from one field to another with an optional conversion.

# [Portal](#tab/portal)

In the operations experience, select **Dataflow** > **Add transform (optional)**.

:::image type="content" source="media/howto-create-dataflow/dataflow-transform.png" alt-text="Screenshot using operations experience to add a transform to a dataflow.":::

# [Bicep](#tab/bicep)

```bicep
builtInTransformationSettings: {
  datasets: [
    // See section on enriching data
  ]
  filter: [
    // See section on filtering data
  ]
  map: [
    // See section on mapping data
  ]
}
```

# [Kubernetes](#tab/kubernetes)

```yaml
builtInTransformationSettings:
  datasets:
    # See section on enriching data
  filter:
    # See section on filtering data
  map:
    # See section on mapping data
```

---

### Enrich: Add reference data

To enrich the data, you can use the reference dataset in the Azure IoT Operations [distributed state store (DSS)](../create-edge-apps/concept-about-state-store-protocol.md). The dataset is used to add extra data to the source data based on a condition. The condition is specified as a field in the source data that matches a field in the dataset.

You can load sample data into the DSS by using the [DSS set tool sample](https://github.com/Azure-Samples/explore-iot-operations/tree/main/samples/dss_set). Key names in the distributed state store correspond to a dataset in the dataflow configuration.

# [Portal](#tab/portal)

Currently, the enrich operation isn't available in the operations experience.

# [Bicep](#tab/bicep)

This example shows how you could use the `deviceId` field in the source data to match the `asset` field in the dataset:

```bicep
builtInTransformationSettings: {
  datasets: [
    {
      key: 'assetDataset'
      inputs: [
        '$source.deviceId', // --------------- $1
        '$context(assetDataset).asset' // ---- $2
      ]
      expression: '$1 == $2'
    }
  ]
}
```

If the dataset has a record with the `asset` field, similar to:

```json
{
  "asset": "thermostat1",
  "location": "room1",
  "manufacturer": "Contoso"
}
```

The data from the source with the `deviceId` field matching `thermostat1` has the `location` and `manufacturer` fields available in filter and map stages.

# [Kubernetes](#tab/kubernetes)

For example, you could use the `deviceId` field in the source data to match the `asset` field in the dataset:

```yaml
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

The data from the source with the `deviceId` field matching `thermostat1` has the `location` and `manufacturer` fields available in filter and map stages.

---

<!-- Why would a passthrough operation be needed? Just omit the transform section? -->

<!-- ### Passthrough operation

For example, you could apply a passthrough operation that takes all the input fields and maps them to the output field, essentially passing through all fields. 

```bicep
builtInTransformationSettings: {
  map: [
    {
      inputs: array('*')
      output: '*'
    }
  ]
}
``` -->


For more information about condition syntax, see [Enrich data by using dataflows](concept-dataflow-enrich.md) and [Convert data using dataflows](concept-dataflow-conversions.md).

### Filter: Filter data based on a condition

To filter the data on a condition, you can use the `filter` stage. The condition is specified as a field in the source data that matches a value.

# [Portal](#tab/portal)

1. Under **Transform (optional)**, select **Filter** > **Add**.
1. Choose the datapoints to include in the dataset.
1. Add a filter condition and description.

    :::image type="content" source="media/howto-create-dataflow/dataflow-filter.png" alt-text="Screenshot using operations experience to add a filter transform.":::

1. Select **Apply**.

For example, you could use a filter condition like `temperature > 20` to filter data less than or equal to 20 based on the temperature field.

# [Bicep](#tab/bicep)

For example, you could use the `temperature` field in the source data to filter the data:

```bicep
builtInTransformationSettings: {
  filter: [
    {
      inputs: [
        'temperature ? $last'
      ]
      expression: '$1 > 20'
    }
  ]
}
```

If the `temperature` field is greater than 20, the data is passed to the next stage. If the `temperature` field is less than or equal to 20, the data is filtered.

# [Kubernetes](#tab/kubernetes)

For example, you could use the `temperature` field in the source data to filter the data:

```yaml
builtInTransformationSettings:
  filter:
    - inputs:
      - temperature ? $last # - $1
      expression: "$1 > 20"
```

If the `temperature` field is greater than 20, the data is passed to the next stage. If the `temperature` field is less than or equal to 20, the data is filtered.

---

### Map: Move data from one field to another

To map the data to another field with optional conversion, you can use the `map` operation. The conversion is specified as a formula that uses the fields in the source data.

# [Portal](#tab/portal)

In the operations experience, mapping is currently supported using **Compute** transforms.

1. Under **Transform (optional)**, select **Compute** > **Add**.
1. Enter the required fields and expressions.

    :::image type="content" source="media/howto-create-dataflow/dataflow-compute.png" alt-text="Screenshot using operations experience to add a compute transform.":::

1. Select **Apply**.

# [Bicep](#tab/bicep)

For example, you could use the `temperature` field in the source data to convert the temperature to Celsius and store it in the `temperatureCelsius` field. You could also enrich the source data with the `location` field from the contextualization dataset:

```bicep
builtInTransformationSettings: {
  map: [
    {
      inputs: [
        'temperature'
      ]
      output: 'temperatureCelsius'
      expression: '($1 - 32) * 5/9'
    }
    {
      inputs: [
        '$context(assetDataset).location'
      ]
      output: 'location'
    }
  ]
}
```

# [Kubernetes](#tab/kubernetes)

For example, you could use the `temperature` field in the source data to convert the temperature to Celsius and store it in the `temperatureCelsius` field. You could also enrich the source data with the `location` field from the contextualization dataset:

```yaml
builtInTransformationSettings:
  map:
    - inputs:
      - temperature # - $1
      expression: "($1 - 32) * 5/9"
      output: temperatureCelsius
    - inputs:
      - $context(assetDataset).location  
      output: location
```

---

To learn more, see [Map data by using dataflows](concept-dataflow-mapping.md) and [Convert data by using dataflows](concept-dataflow-conversions.md).

### Serialize data according to a schema

If you want to serialize the data before sending it to the destination, you need to specify a schema and serialization format. Otherwise, the data is serialized in JSON with the types inferred. Storage endpoints like Microsoft Fabric or Azure Data Lake require a schema to ensure data consistency. Supported serialization formats are Parquet and Delta.

# [Portal](#tab/portal)

Currently, specifying the output schema and serialization isn't supported in the operations experience.

# [Bicep](#tab/bicep)

Once you [upload a schema to the schema registry](concept-schema-registry.md#upload-schema), you can reference it in the dataflow configuration.

```bicep
builtInTransformationSettings: {
  serializationFormat: 'Delta'
  schemaRef: 'aio-sr://<SCHEMA_NAMESPACE>/<SCHEMA>:<VERSION>'
}
```

# [Kubernetes](#tab/kubernetes)

Once you [upload a schema to the schema registry](concept-schema-registry.md#upload-schema), you can reference it in the dataflow configuration.

```yaml
builtInTransformationSettings:
  serializationFormat: Delta
  schemaRef: 'aio-sr://<SCHEMA_NAMESPACE>/<SCHEMA>:<VERSION>'
```

---

For more information about schema registry, see [Understand message schemas](concept-schema-registry.md).

## Destination

To configure a destination for the dataflow, specify the endpoint reference and data destination. You can specify a list of data destinations for the endpoint.

To send data to a destination other than the local MQTT broker, create a dataflow endpoint. To learn how, see [Configure dataflow endpoints](howto-configure-dataflow-endpoint.md).

> [!IMPORTANT]
> Storage endpoints require a schema reference. If you've created storage destination endpoints for Microsoft Fabric OneLake, ADLS Gen 2, Azure Data Explorer and Local Storage, you must specify schema reference.

# [Portal](#tab/portal)

1. Select the dataflow endpoint to use as the destination.

    :::image type="content" source="media/howto-create-dataflow/dataflow-destination.png" alt-text="Screenshot using operations experience to select Event Hubs destination endpoint.":::

1. Select **Proceed** to configure the destination.
1. Enter the required settings for the destination, including the topic or table to send the data to. See [Configure data destination (topic, container, or table)](#configure-data-destination-topic-container-or-table) for more information.

# [Bicep](#tab/bicep)

```bicep
destinationSettings: {
  endpointRef: <CUSTOM_ENDPOINT_NAME>
  dataDestination: <TOPIC_OR_TABLE> // See section on configuring data destination
}
```

# [Kubernetes](#tab/kubernetes)

```yaml
destinationSettings:
  endpointRef: <CUSTOM_ENDPOINT_NAME>
  dataDestination: <TOPIC_OR_TABLE> # See section on configuring data destination
```

---

### Configure data destination (topic, container, or table)

Similar to data sources, data destination is a concept that is used to keep the dataflow endpoints reusable across multiple dataflows. Essentially, it represents the sub-directory in the dataflow endpoint configuration. For example, if the dataflow endpoint is a storage endpoint, the data destination is the table in the storage account. If the dataflow endpoint is a Kafka endpoint, the data destination is the Kafka topic.

| Endpoint type | Data destination meaning | Description |
| - | - | - |
| MQTT (or Event Grid) | Topic | The MQTT topic where the data is sent. Only static topics are supported, no wildcards. |
| Kafka (or Event Hubs) | Topic | The Kafka topic where the data is sent. Only static topics are supported, no wildcards. If the endpoint is an Event Hubs namespace, the data destination is the individual event hub within the namespace. |
| Azure Data Lake Storage | Container | The container in the storage account. Not the table. |
| Microsoft Fabric OneLake | Table or Folder | Corresponds to the configured [path type for the endpoint](howto-configure-fabric-endpoint.md#onelake-path-type). |
| Azure Data Explorer | Table | The table in the Azure Data Explorer database. |
| Local Storage | Folder | The folder or directory name in the local storage persistent volume mount. When using [Azure Container Storage enabled by Azure Arc Cloud Ingest Edge Volumes](/azure/azure-arc/container-storage/cloud-ingest-edge-volume-configuration), this must match the must match the `spec.path` parameter for the subvolume you created. |

To configure the data destination:

# [Portal](#tab/portal)

When using the operations experience, the data destination field is automatically interpreted based on the endpoint type. For example, if the dataflow endpoint is a storage endpoint, the destination details page prompts you to enter the container name. If the dataflow endpoint is a MQTT endpoint, the destination details page prompts you to enter the topic, and so on.

:::image type="content" source="media/howto-create-dataflow/data-destination.png" alt-text="Screenshot showing the operations experience prompting the user to enter an MQTT topic given the endpoint type.":::

# [Bicep](#tab/bicep)

The syntax is the same for all dataflow endpoints:

```bicep
destinationSettings: {
  endpointRef: <CUSTOM_ENDPOINT_NAME>
  dataDestination: <TOPIC_OR_TABLE>
}
```

For example, to send data back to the local MQTT broker a static MQTT topic, use the following configuration:

```bicep
destinationSettings: {
  endpointRef: default
  dataDestination: example-topic
}
```

Or, if you have custom event hub endpoint, the configuration would look like:

```bicep
destinationSettings: {
  endpointRef: my-eh-endpoint
  dataDestination: individual-event-hub
}
```

Another example using a storage endpoint as the destination:

```bicep
destinationSettings: {
  endpointRef: my-adls-endpoint
  dataDestination: my-container
}
```

# [Kubernetes](#tab/kubernetes)

The syntax is the same for all dataflow endpoints:

```yaml
destinationSettings:
  endpointRef: <CUSTOM_ENDPOINT_NAME>
  dataDestination: <TOPIC_OR_TABLE>
```

For example, to send data back to the local MQTT broker a static MQTT topic, use the following configuration:

```yaml
destinationSettings:
  endpointRef: default
  dataDestination: example-topic
```

Or, if you have custom event hub endpoint, the configuration would look like:

```yaml
destinationSettings:
  endpointRef: my-eh-endpoint
  dataDestination: individual-event-hub
```

Another example using a storage endpoint as the destination:

```yaml
destinationSettings:
  endpointRef: my-adls-endpoint
  dataDestination: my-container
```

---

## Example

The following example is a dataflow configuration that uses the MQTT endpoint for the source and destination. The source filters the data from the MQTT topics `thermostats/+/telemetry/temperature/#` and `humidifiers/+/telemetry/humidity/#`. The transformation converts the temperature to Fahrenheit and filters the data where the temperature is less than 100000. The destination sends the data to the MQTT topic `factory`.

```yaml
apiVersion: connectivity.iotoperations.azure.com/v1beta1
kind: Dataflow
metadata:
  name: my-dataflow
  namespace: azure-iot-operations
spec:
  profileRef: default
  mode: Enabled
  operations:
    - operationType: Source
      sourceSettings:
        endpointRef: default
        dataSources:
          - thermostats/+/telemetry/temperature/#
          - humidifiers/+/telemetry/humidity/#
    - operationType: builtInTransformation
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
    - operationType: Destination
      destinationSettings:
        endpointRef: default
        dataDestination: factory
```

<!-- TODO: add links to examples in the reference docs -->

---

## Verify a dataflow is working

Follow [Tutorial: Bi-directional MQTT bridge to Azure Event Grid](tutorial-mqtt-bridge.md) to verify the dataflow is working.

### Export dataflow configuration

To export the dataflow configuration, you can use the operations experience or by exporting the Dataflow custom resource.

# [Portal](#tab/portal)

Select the dataflow you want to export and select **Export** from the toolbar.

:::image type="content" source="media/howto-create-dataflow/dataflow-export.png" alt-text="Screenshot using operations experience to export a dataflow.":::

# [Bicep](#tab/bicep)

Bicep is infrastructure as code and no export is required. Use the [Bicep template file to create a dataflow](https://github.com/Azure-Samples/explore-iot-operations/blob/main/samples/quickstarts/dataflow.bicep) to quickly set up and configure dataflows.

# [Kubernetes](#tab/kubernetes)

```bash
kubectl get dataflow my-dataflow -o yaml > my-dataflow.yaml
```

---

## Next steps

- [Map data by using dataflows](concept-dataflow-mapping.md)
- [Convert data by using dataflows](concept-dataflow-conversions.md)
- [Enrich data by using dataflows](concept-dataflow-enrich.md)
- [Understand message schemas](concept-schema-registry.md)
- [Manage dataflow profiles](howto-configure-dataflow-profile.md)

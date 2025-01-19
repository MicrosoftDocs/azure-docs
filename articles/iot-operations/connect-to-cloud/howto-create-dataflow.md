---
title: Create a dataflow using Azure IoT Operations
description: Create a dataflow to connect data sources and destinations using Azure IoT Operations.
author: PatAltimore
ms.author: patricka
ms.service: azure-iot-operations
ms.subservice: azure-data-flows
ms.topic: how-to
ms.date: 12/12/2024
ai-usage: ai-assisted

#CustomerIntent: As an operator, I want to understand how to create a dataflow to connect data sources.
---

# Configure dataflows in Azure IoT Operations

[!INCLUDE [kubernetes-management-preview-note](../includes/kubernetes-management-preview-note.md)]

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

> [!IMPORTANT]
> Each dataflow must have the Azure IoT Operations local MQTT broker default endpoint [as *either* the source or destination](#proper-dataflow-configuration).

You can use the operations experience in Azure IoT Operations to create a dataflow. The operations experience provides a visual interface to configure the dataflow. You can also use Bicep to create a dataflow using a Bicep template file, or use Kubernetes to create a dataflow using a YAML file.

Continue reading to learn how to configure the source, transformation, and destination.

## Prerequisites

You can deploy dataflows as soon as you have an instance of [Azure IoT Operations](../deploy-iot-ops/howto-deploy-iot-operations.md) using the default dataflow profile and endpoint. However, you might want to configure dataflow profiles and endpoints to customize the dataflow.

### Dataflow profile

If you don't need different scaling settings for your dataflows, use the [default dataflow profile](./howto-configure-dataflow-profile.md#default-dataflow-profile) provided by Azure IoT Operations. To learn how to configure a dataflow profile, see [Configure dataflow profiles](howto-configure-dataflow-profile.md).

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

resource aioInstance 'Microsoft.IoTOperations/instances@2024-11-01' existing = {
  name: aioInstanceName
}

resource customLocation 'Microsoft.ExtendedLocation/customLocations@2021-08-31-preview' existing = {
  name: customLocationName
}

resource defaultDataflowEndpoint 'Microsoft.IoTOperations/instances/dataflowEndpoints@2024-11-01' existing = {
  parent: aioInstance
  name: 'default'
}

// Pointer to the default dataflow profile
resource defaultDataflowProfile 'Microsoft.IoTOperations/instances/dataflowProfiles@2024-11-01' existing = {
  parent: aioInstance
  name: 'default'
}

resource dataflow 'Microsoft.IoTOperations/instances/dataflowProfiles/dataflows@2024-11-01' = {
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
      // Transformation optional
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

# [Kubernetes (preview)](#tab/kubernetes)

Create a Kubernetes manifest `.yaml` file to start creating a dataflow. This example shows the structure of the dataflow containing the source, transformation, and destination configurations.

```yaml
apiVersion: connectivity.iotoperations.azure.com/v1
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
      # Transformation optional
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

To configure a source for the dataflow, specify the endpoint reference and a list of data sources for the endpoint. Choose one of the following options as the source for the dataflow.

If the default endpoint isn't used as the source, it must be used as the [destination](#destination). To learn more about, see [Dataflows must use local MQTT broker endpoint](./howto-configure-dataflow-endpoint.md#dataflows-must-use-local-mqtt-broker-endpoint).

### Option 1: Use default MQTT endpoint as source

# [Portal](#tab/portal)

1. Under **Source details**, select **MQTT**.

    :::image type="content" source="media/howto-create-dataflow/dataflow-source-mqtt.png" alt-text="Screenshot using operations experience to select MQTT as the source endpoint.":::

1. Enter the following settings for the MQTT source:

    | Setting              | Description                                                                                       |
    | -------------------- | ------------------------------------------------------------------------------------------------- |
    | MQTT topic           | The MQTT topic filter to subscribe to for incoming messages. See [Configure MQTT or Kafka topics](#configure-data-sources-mqtt-or-kafka-topics). |
    | Message schema       | The schema to use to deserialize the incoming messages. See [Specify schema to deserialize data](#specify-source-schema). |

1. Select **Apply**.

# [Bicep](#tab/bicep)

The MQTT endpoint is configured in the Bicep template file. For example, the following endpoint is a source for the dataflow.

```bicep
sourceSettings: {
  endpointRef: 'default'
  dataSources: [
    'thermostats/+/telemetry/temperature/#'
    'humidifiers/+/telemetry/humidity/#'
  ]
}
```

Here, `dataSources` allow you to specify multiple MQTT or Kafka topics without needing to modify the endpoint configuration. This flexibility means the same endpoint can be reused across multiple dataflows, even if the topics vary. To learn more, see [Configure data sources](#configure-data-sources-mqtt-or-kafka-topics).

# [Kubernetes (preview)](#tab/kubernetes)

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

### Option 2: Use asset as source

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

# [Kubernetes (preview)](#tab/kubernetes)

Configuring an asset as a source is only available in the operations experience.

---

When using an asset as the source, the asset definition is used to infer the schema for the dataflow. The asset definition includes the schema for the asset's datapoints. To learn more, see [Manage asset configurations remotely](../discover-manage-assets/howto-manage-assets-remotely.md).

Once configured, the data from the asset reached the dataflow via the local MQTT broker. So, when using an asset as the source, the dataflow uses the local MQTT broker default endpoint as the source in actuality.

### Option 3: Use custom MQTT or Kafka dataflow endpoint as source

If you created a custom MQTT or Kafka dataflow endpoint (for example, to use with Event Grid or Event Hubs), you can use it as the source for the dataflow. Remember that storage type endpoints, like Data Lake or Fabric OneLake, can't be used as source.

To configure, use Kubernetes YAML or Bicep. Replace placeholder values with your custom endpoint name and topics.

# [Portal](#tab/portal)

Using a custom MQTT or Kafka endpoint as a source is currently not supported in the operations experience.

# [Bicep](#tab/bicep)

```bicep
sourceSettings: {
  endpointRef: '<CUSTOM_ENDPOINT_NAME>'
  dataSources: [
    '<TOPIC_1>'
    '<TOPIC_2>'
    // See section on configuring MQTT or Kafka topics for more information
  ]
}
```

# [Kubernetes (preview)](#tab/kubernetes)

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

You can specify multiple MQTT or Kafka topics in a source without needing to modify the dataflow endpoint configuration. This flexibility means the same endpoint can be reused across multiple dataflows, even if the topics vary. For more information, see [Reuse dataflow endpoints](./howto-configure-dataflow-endpoint.md#reuse-endpoints).

#### MQTT topics

When the source is an MQTT (Event Grid included) endpoint, you can use the MQTT topic filter to subscribe to incoming messages. The topic filter can include wildcards to subscribe to multiple topics. For example, `thermostats/+/telemetry/temperature/#` subscribes to all temperature telemetry messages from thermostats. To configure the MQTT topic filters:

# [Portal](#tab/portal)

In the operations experience dataflow **Source details**, select **MQTT**, then use the **MQTT topic** field to specify the MQTT topic filter to subscribe to for incoming messages.

> [!NOTE]
> Only one MQTT topic filter can be specified in the operations experience. To use multiple MQTT topic filters, use Bicep or Kubernetes.

# [Bicep](#tab/bicep)

```bicep
sourceSettings: {
  endpointRef: '<MQTT_ENDPOINT_NAME>'
  dataSources: [
    '<MQTT_TOPIC_FILTER_1>'
    '<MQTT_TOPIC_FILTER_2>'
    // Add more MQTT topic filters as needed
  ]
}
```

Example with multiple MQTT topic filters with wildcards:

```bicep
sourceSettings: {
  endpointRef: 'default'
  dataSources: [
    'thermostats/+/telemetry/temperature/#'
    'humidifiers/+/telemetry/humidity/#'
  ]
}
```

Here, the wildcard `+` is used to select all devices under the `thermostats` and `humidifiers` topics. The `#` wildcard is used to select all telemetry messages under all subtopics of the `temperature` and `humidity` topics.

# [Kubernetes (preview)](#tab/kubernetes)
  
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

# [Kubernetes (preview)](#tab/kubernetes)

```yaml
sourceSettings:
  dataSources:
    - $shared/<GROUP_NAME>/<TOPIC_FILTER>
```

---


If the instance count in the [dataflow profile](howto-configure-dataflow-profile.md) is greater than one, shared subscription is automatically enabled for all dataflows that use MQTT source. In this case, the `$shared` prefix is added and the shared subscription group name automatically generated. For example, if you have a dataflow profile with an instance count of 3, and your dataflow uses an MQTT endpoint as source configured with topics `topic1` and `topic2`, they are automatically converted to shared subscriptions as `$shared/<GENERATED_GROUP_NAME>/topic1` and `$shared/<GENERATED_GROUP_NAME>/topic2`. 

You can explicitly create a topic named `$shared/mygroup/topic` in your configuration. However, adding the `$shared` topic explicitly isn't recommended since the `$shared` prefix is automatically added when needed. Dataflows can make optimizations with the group name if it isn't set. For example, `$share` isn't set and dataflows only has to operate over the topic name.

> [!IMPORTANT]
> Dataflows requiring shared subscription when instance count is greater than one is important when using Event Grid MQTT broker as a source since it [doesn't support shared subscriptions](../../event-grid/mqtt-support.md#mqttv5-current-limitations). To avoid missing messages, set the dataflow profile instance count to one when using Event Grid MQTT broker as the source. That is when the dataflow is the subscriber and receiving messages from the cloud.

#### Kafka topics

When the source is a Kafka (Event Hubs included) endpoint, specify the individual Kafka topics to subscribe to for incoming messages. Wildcards are not supported, so you must specify each topic statically.

> [!NOTE]
> When using Event Hubs via the Kafka endpoint, each individual event hub within the namespace is the Kafka topic. For example, if you have an Event Hubs namespace with two event hubs, `thermostats` and `humidifiers`, you can specify each event hub as a Kafka topic.

To configure the Kafka topics:

# [Portal](#tab/portal)

Using a Kafka endpoint as a source is currently not supported in the operations experience.

# [Bicep](#tab/bicep)

```bicep
sourceSettings: {
  endpointRef: '<KAFKA_ENDPOINT_NAME>'
  dataSources: [
    '<KAFKA_TOPIC_1>'
    '<KAFKA_TOPIC_2>'
    // Add more Kafka topics as needed
  ]
}
```

# [Kubernetes (preview)](#tab/kubernetes)

```yaml
sourceSettings:
  endpointRef: <KAFKA_ENDPOINT_NAME>
  dataSources:
    - <KAFKA_TOPIC_1>
    - <KAFKA_TOPIC_2>
    # Add more Kafka topics as needed
```

---

### Specify source schema

When using MQTT or Kafka as the source, you can specify a [schema](concept-schema-registry.md) to display the list of data points in the operations experience portal. Note that using a schema to deserialize and validate incoming messages [isn't currently supported](../troubleshoot/known-issues.md#dataflows).

If the source is an asset, the schema is automatically inferred from the asset definition.

> [!TIP]
> To generate the schema from a sample data file, use the [Schema Gen Helper](https://azure-samples.github.io/explore-iot-operations/schema-gen-helper/).

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

# [Kubernetes (preview)](#tab/kubernetes)

Once you have used the [schema registry to store the schema](concept-schema-registry.md), you can reference it in the dataflow configuration.

```yaml
sourceSettings:
  serializationFormat: Json
  schemaRef: 'aio-sr://<SCHEMA_NAMESPACE>/<SCHEMA_NAME>:<VERSION>'
```

---

To learn more, see [Understand message schemas](concept-schema-registry.md).

## Transformation

The transformation operation is where you can transform the data from the source before you send it to the destination. Transformations are optional. If you don't need to make changes to the data, don't include the transformation operation in the dataflow configuration. Multiple transformations are chained together in stages regardless of the order in which they're specified in the configuration. The order of the stages is always:

1. **Enrich**: Add additional data to the source data given a dataset and condition to match.
1. **Filter**: Filter the data based on a condition.
1. **Map**, **Compute**, **Rename**, or add a **New property**: Move data from one field to another with an optional conversion.

This section is an introduction to dataflow transforms. For more detailed information, see [Map data by using dataflows](concept-dataflow-mapping.md), [Convert data by using dataflow conversions](concept-dataflow-conversions.md), and [Enrich data by using dataflows](concept-dataflow-enrich.md).

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

# [Kubernetes (preview)](#tab/kubernetes)

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

To enrich the data, first add reference dataset in the Azure IoT Operations [state store](../create-edge-apps/overview-state-store.md). The dataset is used to add extra data to the source data based on a condition. The condition is specified as a field in the source data that matches a field in the dataset.

You can load sample data into the state store by using the [state store CLI](https://github.com/Azure-Samples/explore-iot-operations/tree/main/tools/statestore-cli). Key names in the state store correspond to a dataset in the dataflow configuration.

# [Portal](#tab/portal)

Currently, the *Enrich* stage isn't supported in the operations experience.

# [Bicep](#tab/bicep)

This example shows how you could use the `deviceId` field in the source data to match the `asset` field in the dataset:

```bicep
builtInTransformationSettings: {
  datasets: [
    {
      key: 'assetDataset'
      inputs: [
        '$source.deviceId' // ---------------- $1
        '$context(assetDataset).asset' // ---- $2
      ]
      expression: '$1 == $2'
    }
  ]
}
```

# [Kubernetes (preview)](#tab/kubernetes)

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

---

If the dataset has a record with the `asset` field, similar to:

```json
{
  "asset": "thermostat1",
  "location": "room1",
  "manufacturer": "Contoso"
}
```

The data from the source with the `deviceId` field matching `thermostat1` has the `location` and `manufacturer` fields available in filter and map stages.

For more information about condition syntax, see [Enrich data by using dataflows](concept-dataflow-enrich.md) and [Convert data using dataflows](concept-dataflow-conversions.md).

### Filter: Filter data based on a condition

To filter the data on a condition, you can use the `filter` stage. The condition is specified as a field in the source data that matches a value.

# [Portal](#tab/portal)

1. Under **Transform (optional)**, select **Filter** > **Add**.

    :::image type="content" source="media/howto-create-dataflow/dataflow-filter.png" alt-text="Screenshot using operations experience to add a filter transform.":::

1.  Enter the required settings.

    | Setting            | Description                                                                                       |
    |--------------------|---------------------------------------------------------------------------------------------------|
    | Filter condition   | The condition to filter the data based on a field in the source data.                               |
    | Description        | Provide a description for the filter condition.                                                     |

    In the filter condition field, enter `@` or select **Ctrl + Space** to choose datapoints from a dropdown.

    You can enter MQTT metadata properties using the format `@$metadata.user_properties.<property>` or `@$metadata.topic`. You can also enter $metadata headers using the format `@$metadata.<header>`. The `$metadata` syntax is only needed for MQTT properties that are part of the message header. For more information, see [field references](concept-dataflow-mapping.md#field-references).

    The condition can use the fields in the source data. For example, you could use a filter condition like `@temperature > 20` to filter data less than or equal to 20 based on the temperature field.

1. Select **Apply**.

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

# [Kubernetes (preview)](#tab/kubernetes)

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

In the operations experience, mapping is currently supported using **Compute**, **Rename**, and **New property** transforms.

#### Compute

You can use the **Compute** transform to apply a formula to the source data. This operation is used to apply a formula to the source data and store the result field.

1. Under **Transform (optional)**, select **Compute** > **Add**.

    :::image type="content" source="media/howto-create-dataflow/dataflow-compute.png" alt-text="Screenshot using operations experience to add a compute transform.":::

1.  Enter the required settings.

    | Setting            | Description                                                                                       |
    |--------------------|---------------------------------------------------------------------------------------------------|
    | Select formula     | Choose an existing formula from the dropdown or select **Custom** to enter a formula manually.     |
    | Output             | Specify the output display name for the result.                          |
    | Formula            | Enter the formula to be applied to the source data.                                               |
    | Description        | Provide a description for the transformation.                                                     |
    | Last known value   | Optionally, use the last known value if the current value isn't available.                       |


    You can enter or edit a formula in the **Formula** field. The formula can use the fields in the source data. Enter `@` or select **Ctrl + Space** to choose datapoints from a dropdown.

    You can enter MQTT metadata properties using the format `@$metadata.user_properties.<property>` or `@$metadata.topic`. You can also enter $metadata headers using the format `@$metadata.<header>`. The `$metadata` syntax is only needed for MQTT properties that are part of the message header. For more information, see [field references](concept-dataflow-mapping.md#field-references).

    The formula can use the fields in the source data. For example, you could use the `temperature` field in the source data to convert the temperature to Celsius and store it in the `temperatureCelsius` output field. 
    
1. Select **Apply**.

#### Rename

You can rename a datapoint using the **Rename** transform. This operation is used to rename a datapoint in the source data to a new name. The new name can be used in the subsequent stages of the dataflow.

1. Under **Transform (optional)**, select **Rename** > **Add**. 

    :::image type="content" source="media/howto-create-dataflow/dataflow-rename.png" alt-text="Screenshot using operations experience to rename a datapoint.":::

1.  Enter the required settings.

    | Setting            | Description                                                                                             |
    |--------------------|---------------------------------------------------------------------------------------------------------|
    | Datapoint          | Select a datapoint from the dropdown or enter a $metadata header.                                       |
    | New datapoint name | Enter the new name for the datapoint.                                                                   |
    | Description        | Provide a description for the transformation.                                                           |

    Enter `@` or select **Ctrl + Space** to choose datapoints from a dropdown.

    You can enter MQTT metadata properties using the format `@$metadata.user_properties.<property>` or `@$metadata.topic`. You can also enter $metadata headers using the format `@$metadata.<header>`. The `$metadata` syntax is only needed for MQTT properties that are part of the message header. For more information, see [field references](concept-dataflow-mapping.md#field-references).


1. Select **Apply**.

#### New property

You can add a new property to the source data using the **New property** transform. This operation is used to add a new property to the source data. The new property can be used in the subsequent stages of the dataflow.

1. Under **Transform (optional)**, select **New property** > **Add**. 

    :::image type="content" source="media/howto-create-dataflow/dataflow-new-property.png" alt-text="Screenshot using operations experience to add a new property.":::

1.  Enter the required settings.

    | Setting            | Description                                                                                         |
    |--------------------|-----------------------------------------------------------------------------------------------------|
    | Property key       | Enter the key for the new property.                                                                 |
    | Property value     | Enter the value for the new property.                                                               |
    | Description        | Provide a description for the new property.                                                         |

1. Select **Apply**.

# [Bicep](#tab/bicep)

You can access MQTT metadata properties using the format `$metadata.user_properties.<property>` or `$metadata.topic`. You can also enter $metadata headers using the format `$metadata.<header>`. For more information, see [field references](concept-dataflow-mapping.md#field-references).

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

# [Kubernetes (preview)](#tab/kubernetes)

You can access MQTT metadata properties using the format `$metadata.user_properties.<property>` or `$metadata.topic`. You can also enter $metadata headers using the format `$metadata.<header>`. For more information, see [field references](concept-dataflow-mapping.md#field-references).

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

<!-- TODO: DOE content for this -->

<!-- #### Passthrough operation

Using map, you can apply a passthrough operation that takes all the input fields and maps them to the output field, essentially passing through all fields. 

# [Portal](#tab/portal)

TBD

# [Bicep](#tab/bicep)

```bicep
builtInTransformationSettings: {
  map: [
    {
      inputs: [ '*' ]
      output: '*'
    }
  ]
}
```

# [Kubernetes (preview)](#tab/kubernetes)

```yaml
builtInTransformationSettings:
  map:
    - inputs:
      - '*'
      output: '*'
```

---

 -->

### Serialize data according to a schema

If you want to serialize the data before sending it to the destination, you need to specify a schema and serialization format. Otherwise, the data is serialized in JSON with the types inferred. Storage endpoints like Microsoft Fabric or Azure Data Lake require a schema to ensure data consistency. Supported serialization formats are Parquet and Delta.

> [!TIP]
> To generate the schema from a sample data file, use the [Schema Gen Helper](https://azure-samples.github.io/explore-iot-operations/schema-gen-helper/).

# [Portal](#tab/portal)

For operations experience, you specify the schema and serialization format in the dataflow endpoint details. The endpoints that support serialization formats are Microsoft Fabric OneLake, Azure Data Lake Storage Gen 2, and Azure Data Explorer. For example, to serialize the data in Delta format, you need to upload a schema to the schema registry and reference it in the dataflow destination endpoint configuration.

:::image type="content" source="media/howto-create-dataflow/destination-serialization.png" alt-text="Screenshot using the operations experience to set the dataflow destination endpoint serialization.":::

# [Bicep](#tab/bicep)

Once you [upload a schema to the schema registry](concept-schema-registry.md#upload-schema), you can reference it in the dataflow configuration.

```bicep
builtInTransformationSettings: {
  serializationFormat: 'Delta'
  schemaRef: 'aio-sr://<SCHEMA_NAMESPACE>/<SCHEMA>:<VERSION>'
}
```

# [Kubernetes (preview)](#tab/kubernetes)

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

To send data to a destination other than the local MQTT broker, create a dataflow endpoint. To learn how, see [Configure dataflow endpoints](howto-configure-dataflow-endpoint.md). If the destination isn't the local MQTT broker, it must be used as a source. To learn more about, see [Dataflows must use local MQTT broker endpoint](./howto-configure-dataflow-endpoint.md#dataflows-must-use-local-mqtt-broker-endpoint).

> [!IMPORTANT]
> Storage endpoints require a [schema for serialization](./concept-schema-registry.md). To use dataflow with Microsoft Fabric OneLake, Azure Data Lake Storage, Azure Data Explorer, or Local Storage, you must [specify a schema reference](#serialize-data-according-to-a-schema).

# [Portal](#tab/portal)

1. Select the dataflow endpoint to use as the destination.

    :::image type="content" source="media/howto-create-dataflow/dataflow-destination.png" alt-text="Screenshot using operations experience to select Event Hubs destination endpoint.":::

    Storage endpoints require a [schema for serialization](./concept-schema-registry.md). If you choose a Microsoft Fabric OneLake, Azure Data Lake Storage, Azure Data Explorer, or Local Storage destination endpoint, you must [specify a schema reference](#serialize-data-according-to-a-schema). For example, to serialize the data to a Microsoft Fabric endpoint in Delta format, you need to upload a schema to the schema registry and reference it in the dataflow destination endpoint configuration.

    :::image type="content" source="media/howto-create-dataflow/serialization-schema.png" alt-text="Screenshot using operations experience to choose output schema and serialization format.":::

1. Select **Proceed** to configure the destination.
1. Enter the required settings for the destination, including the topic or table to send the data to. See [Configure data destination (topic, container, or table)](#configure-data-destination-topic-container-or-table) for more information.

# [Bicep](#tab/bicep)

```bicep
destinationSettings: {
  endpointRef: '<CUSTOM_ENDPOINT_NAME>'
  dataDestination: '<TOPIC_OR_TABLE>' // See section on configuring data destination
}
```

# [Kubernetes (preview)](#tab/kubernetes)

```yaml
destinationSettings:
  endpointRef: <CUSTOM_ENDPOINT_NAME>
  dataDestination: <TOPIC_OR_TABLE> # See section on configuring data destination
```

---

### Configure data destination (topic, container, or table)

Similar to data sources, data destination is a concept that is used to keep the dataflow endpoints reusable across multiple dataflows. Essentially, it represents the subdirectory in the dataflow endpoint configuration. For example, if the dataflow endpoint is a storage endpoint, the data destination is the table in the storage account. If the dataflow endpoint is a Kafka endpoint, the data destination is the Kafka topic.

| Endpoint type | Data destination meaning | Description |
| - | - | - |
| MQTT (or Event Grid) | Topic | The MQTT topic where the data is sent. Only static topics are supported, no wildcards. |
| Kafka (or Event Hubs) | Topic | The Kafka topic where the data is sent. Only static topics are supported, no wildcards. If the endpoint is an Event Hubs namespace, the data destination is the individual event hub within the namespace. |
| Azure Data Lake Storage | Container | The container in the storage account. Not the table. |
| Microsoft Fabric OneLake | Table or Folder | Corresponds to the configured [path type for the endpoint](howto-configure-fabric-endpoint.md#onelake-path-type). |
| Azure Data Explorer | Table | The table in the Azure Data Explorer database. |
| Local Storage | Folder | The folder or directory name in the local storage persistent volume mount. When using [Azure Container Storage enabled by Azure Arc Cloud Ingest Edge Volumes](/azure/azure-arc/container-storage/cloud-ingest-edge-volume-configuration), this must match the `spec.path` parameter for the subvolume you created. |

To configure the data destination:

# [Portal](#tab/portal)

When using the operations experience, the data destination field is automatically interpreted based on the endpoint type. For example, if the dataflow endpoint is a storage endpoint, the destination details page prompts you to enter the container name. If the dataflow endpoint is an MQTT endpoint, the destination details page prompts you to enter the topic, and so on.

:::image type="content" source="media/howto-create-dataflow/data-destination.png" alt-text="Screenshot showing the operations experience prompting the user to enter an MQTT topic given the endpoint type.":::

# [Bicep](#tab/bicep)

The syntax is the same for all dataflow endpoints:

```bicep
destinationSettings: {
  endpointRef: "<CUSTOM_ENDPOINT_NAME>"
  dataDestination: '<TOPIC_OR_TABLE>'
}
```

For example, to send data back to the local MQTT broker a static MQTT topic, use the following configuration:

```bicep
destinationSettings: {
  endpointRef: 'default'
  dataDestination: 'example-topic'
}
```

Or, if you have custom event hub endpoint, the configuration would look like:

```bicep
destinationSettings: {
  endpointRef: 'my-eh-endpoint'
  dataDestination: 'individual-event-hub'
}
```

Another example using a storage endpoint as the destination:

```bicep
destinationSettings: {
  endpointRef: 'my-adls-endpoint'
  dataDestination: 'my-container'
}
```

# [Kubernetes (preview)](#tab/kubernetes)

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

The following example is a dataflow configuration that uses the MQTT endpoint for the source and destination. The source filters the data from the MQTT topic `azure-iot-operations/data/thermostat`. The transformation converts the temperature to Fahrenheit and filters the data where the temperature multiplied by the humidity is less than 100000. The destination sends the data to the MQTT topic `factory`.

# [Portal](#tab/portal)

See Bicep or Kubernetes tabs for the configuration example.

# [Bicep](#tab/bicep)

```bicep
param aioInstanceName string = '<AIO_INSTANCE_NAME>'
param customLocationName string = '<CUSTOM_LOCATION_NAME>'
param dataflowName string = '<DATAFLOW_NAME>'

resource aioInstance 'Microsoft.IoTOperations/instances@2024-11-01' existing = {
  name: aioInstanceName
}

resource customLocation 'Microsoft.ExtendedLocation/customLocations@2021-08-31-preview' existing = {
  name: customLocationName
}

// Pointer to the default dataflow endpoint
resource defaultDataflowEndpoint 'Microsoft.IoTOperations/instances/dataflowEndpoints@2024-11-01' existing = {
  parent: aioInstance
  name: 'default'
}

// Pointer to the default dataflow profile
resource defaultDataflowProfile 'Microsoft.IoTOperations/instances/dataflowProfiles@2024-11-01' existing = {
  parent: aioInstance
  name: 'default'
}

resource dataflow 'Microsoft.IoTOperations/instances/dataflowProfiles/dataflows@2024-11-01' = {
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
          // Use the default MQTT endpoint as the source
          endpointRef: defaultDataflowEndpoint.name
          // Filter the data from the MQTT topic azure-iot-operations/data/thermostat
          dataSources: [
            'azure-iot-operations/data/thermostat'
          ]
        }
      }
      // Transformation optional
      {
        operationType: 'BuiltInTransformation'
        builtInTransformationSettings: {
          // Filter the data where temperature * "Tag 10" < 100000
          filter: [
            {
              inputs: [
                'temperature.Value'
                '"Tag 10".Value'
              ]
              expression: '$1 * $2 < 100000'
            }
          ]
          map: [
            // Passthrough all values by default
            {
              inputs: [
                '*'
              ]
              output: '*'
            }
            // Convert temperature to Fahrenheit and output it to TemperatureF
            {
              inputs: [
                'temperature.Value'
              ]
              output: 'TemperatureF'
              expression: 'cToF($1)'
            }
          // Extract the "Tag 10" value and output it to Humidity
            {
              inputs: [
                '"Tag 10".Value'
              ]
              output: 'Humidity'
            }
          ]
        }
      }
      {
        operationType: 'Destination'
        destinationSettings: {
          // Use the default MQTT endpoint as the destination
          endpointRef: defaultDataflowEndpoint.name
          // Send the data to the MQTT topic factory
          dataDestination: 'factory'
        }
      }
    ]
  }
}
```

# [Kubernetes (preview)](#tab/kubernetes)

```yaml
apiVersion: connectivity.iotoperations.azure.com/v1
kind: Dataflow
metadata:
  name: my-dataflow
  namespace: azure-iot-operations
spec:
  # Reference to the default dataflow profile
  profileRef: default
  mode: Enabled
  operations:
    - operationType: Source
      sourceSettings:
        # Use the default MQTT endpoint as the source
        endpointRef: default
        # Filter the data from the MQTT topic azure-iot-operations/data/thermostat
        dataSources:
          - azure-iot-operations/data/thermostat
    # Transformation optional
    - operationType: builtInTransformation
      builtInTransformationSettings:
        # Filter the data where temperature * "Tag 10" < 100000
        filter:
          - inputs:
              - 'temperature.Value'
              - '"Tag 10".Value'
            expression: '$1 * $2 < 100000'
        map:
          # Passthrough all values by default
          - inputs:
              - '*'
            output: '*'
          # Convert temperature to Fahrenheit and output it to TemperatureF
          - inputs:
              - temperature.Value
            output: TemperatureF
            expression: cToF($1)
          # Extract the "Tag 10" value and output it to Humidity
          - inputs:
              - '"Tag 10".Value'
            output: 'Humidity'
    - operationType: Destination
      destinationSettings:
        # Use the default MQTT endpoint as the destination
        endpointRef: default
        # Send the data to the MQTT topic factory
        dataDestination: factory
```

---

To see more examples of dataflow configurations, see [Azure REST API - Dataflow](/rest/api/iotoperations/dataflow/create-or-update#examples) and the [quickstart Bicep](https://github.com/Azure-Samples/explore-iot-operations/blob/main/samples/quickstarts/quickstart.bicep).

## Verify a dataflow is working

Follow [Tutorial: Bi-directional MQTT bridge to Azure Event Grid](tutorial-mqtt-bridge.md) to verify the dataflow is working.

### Export dataflow configuration

To export the dataflow configuration, you can use the operations experience or by exporting the Dataflow custom resource.

# [Portal](#tab/portal)

Select the dataflow you want to export and select **Export** from the toolbar.

:::image type="content" source="media/howto-create-dataflow/dataflow-export.png" alt-text="Screenshot using operations experience to export a dataflow.":::

# [Bicep](#tab/bicep)

Bicep is infrastructure as code and no export is required. Use the [Bicep template file to create a dataflow](https://github.com/Azure-Samples/explore-iot-operations/blob/main/samples/quickstarts/dataflow.bicep) to quickly set up and configure dataflows.

# [Kubernetes (preview)](#tab/kubernetes)

```bash
kubectl get dataflow my-dataflow -o yaml > my-dataflow.yaml
```

---

## Proper dataflow configuration

To ensure the dataflow is working as expected, verify the following:

- The default MQTT dataflow endpoint [must be used as either the source or destination](./howto-configure-dataflow-endpoint.md#dataflows-must-use-local-mqtt-broker-endpoint).
- The [dataflow profile](./howto-configure-dataflow-profile.md) exists and is referenced in the dataflow configuration.
- Source is either an MQTT endpoint, Kafka endpoint, or an asset. [Storage type endpoints can't be used as a source](./howto-configure-dataflow-endpoint.md).
- When using Event Grid as the source, the [dataflow profile instance count](./howto-configure-dataflow-profile.md#scaling) is set to 1 because Event Grid MQTT broker doesn't support shared subscriptions.
- When using Event Hubs as the source, each event hub in the namespace is a separate Kafka topic and must be specified as the data source.
- Transformation, if used, is configured with proper syntax, including proper [escaping of special characters](./concept-dataflow-mapping.md#escaping).
- When using storage type endpoints as destination, a [schema is specified](#serialize-data-according-to-a-schema).

## Next steps

- [Map data by using dataflows](concept-dataflow-mapping.md)
- [Convert data by using dataflows](concept-dataflow-conversions.md)
- [Enrich data by using dataflows](concept-dataflow-enrich.md)
- [Understand message schemas](concept-schema-registry.md)
- [Manage dataflow profiles](howto-configure-dataflow-profile.md)
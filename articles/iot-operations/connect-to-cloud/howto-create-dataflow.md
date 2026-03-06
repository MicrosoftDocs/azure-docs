---
title: Create a data flow using Azure IoT Operations
description: Create a data flow to connect data sources and destinations using Azure IoT Operations.
author: sethmanheim
ms.author: sethm
ms.service: azure-iot-operations
ms.subservice: azure-data-flows
ms.topic: how-to
ms.date: 02/26/2026
ai-usage: ai-assisted

#CustomerIntent: As an operator, I want to understand how to create a data flow to connect data sources.
ms.custom:
  - build-2025
---

# Create data flows in Azure IoT Operations

[!INCLUDE [kubernetes-management-preview-note](../includes/kubernetes-management-preview-note.md)]

A data flow is the path that data takes from the source to the destination with optional transformations. You can configure the data flow by creating a *Data flow* custom resource or using the operations experience web UI. A data flow is made up of three parts: the **source**, the **transformation**, and the **destination**. 

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

:::image type="content" source="media/howto-create-dataflow/dataflow.svg" alt-text="Diagram of a data flow showing flow from source to transform then destination.":::

To define the source and destination, you need to configure the data flow endpoints. The transformation is optional and can include operations like enriching the data, filtering the data, and mapping the data to another field.

> [!IMPORTANT]
> Each data flow must have the Azure IoT Operations local MQTT broker default endpoint [as *either* the source or destination](#proper-data-flow-configuration).

You can use the operations experience in Azure IoT Operations to create a data flow. The operations experience provides a visual interface to configure the data flow. You can also use Bicep to create a data flow using a Bicep file, or use Kubernetes to create a data flow using a YAML file.

Continue reading to learn how to configure the source, transformation, and destination.

## Prerequisites

You can deploy data flows as soon as you have an instance of [Azure IoT Operations](../deploy-iot-ops/howto-deploy-iot-operations.md) using the default data flow profile and endpoint. However, you might want to configure data flow profiles and endpoints to customize the data flow.

### Data flow profile

If you don't need different scaling settings for your data flows, use the [default data flow profile](./howto-configure-dataflow-profile.md#default-data-flow-profile) provided by Azure IoT Operations. Avoid associating too many data flows with a single data flow profile. If you have a large number of data flows, distribute them across multiple data flow profiles to reduce the risk of exceeding the data flow profile configuration size limit of 70.

To learn how to configure a new data flow profile, see [Configure data flow profiles](howto-configure-dataflow-profile.md).

### Data flow endpoints

You need data flow endpoints to configure the source and destination for the data flow. To get started quickly, use the [default data flow endpoint for the local MQTT broker](./howto-configure-mqtt-endpoint.md#default-endpoint). You can also create other types of data flow endpoints like Kafka, Event Hubs, OpenTelemetry, or Azure Data Lake Storage. For more information, see [Configure data flow endpoints](howto-configure-dataflow-endpoint.md).

## Get started

When you have the prerequisites, you can start creating a data flow.

# [Operations experience](#tab/portal)

1. To create a data flow in [operations experience](https://iotoperations.azure.com/), select **Data flow** > **Create data flow**. 

1. Select the placeholder name **new-data-flow** to set the data flow properties. Enter the name of the data flow and choose the data flow profile to use. The default data flow profile is selected by default. For more information on data flow profiles, see [Configure data flow profile](howto-configure-dataflow-profile.md).

    :::image type="content" source="media/howto-create-dataflow/dataflow-profile.png" alt-text="Screenshot of the operations experience interface where a user names the data flow and selects a profile for it.":::

    > [!IMPORTANT] 
    > You can only choose the data flow profile when creating a data flow. You can't change the data flow profile after the data flow is created.
    > If you want to change the data flow profile of an existing data flow, delete the original data flow and create a new one with the new data flow profile.

1. Configure the source, transformation, and destination endpoint for the data flow by selecting the items in the data flow diagram.

    :::image type="content" source="media/howto-create-dataflow/create-dataflow.png" alt-text="Screenshot of the operations experience interface displaying a data flow diagram with a source endpoint, transformation stage, and destination endpoint.":::

# [Azure CLI](#tab/cli)

Use the [az iot ops dataflow apply](/cli/azure/iot/ops/dataflow#az-iot-ops-dataflow-apply) command to create or change a data flow.

```azurecli
az iot ops dataflow apply --resource-group <ResourceGroupName> --instance <AioInstanceName> --profile <DataflowProfileName> --name <DataflowName> --config-file <ConfigFilePathAndName>
```

The `--config-file` parameter is the path and file name of a JSON configuration file containing the resource properties.

In this example, assume a configuration file named `data-flow.json` with the following content is stored in the user's home directory:

```json
{
    "mode": "Enabled",
    "operations": [
        {
            "operationType": "Source",
            "sourceSettings": {
                // See source configuration section
            }
        },
        {
            "operationType": "BuiltInTransformation",
            "builtInTransformationSettings": {
                // See transformation configuration section
            }
        },
        {
            "operationType": "Destination",
            "destinationSettings": {
                // See destination configuration section
            }
        }
    ]
}
```

Here's an example command to create or update a data flow using the default dataflow profile:

```azurecli
az iot ops dataflow apply --resource-group myResourceGroup --instance myAioInstance --profile default --name data-flow --config-file ~/data-flow.json
```

# [Bicep](#tab/bicep)

Create a Bicep `.bicep` file to start creating a data flow. This example shows the structure of the data flow containing the source, transformation, and destination configurations.

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

// Pointer to the default data flow profile
resource defaultDataflowProfile 'Microsoft.IoTOperations/instances/dataflowProfiles@2024-11-01' existing = {
  parent: aioInstance
  name: 'default'
}

resource dataflow 'Microsoft.IoTOperations/instances/dataflowProfiles/dataflows@2024-11-01' = {
  // Reference to the parent data flow profile, the default profile in this case
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

Create a Kubernetes manifest `.yaml` file to start creating a data flow. This example shows the structure of the data flow containing the source, transformation, and destination configurations.

```yaml
apiVersion: connectivity.iotoperations.azure.com/v1
kind: Dataflow
metadata:
  name: <DATAFLOW_NAME>
  namespace: azure-iot-operations
spec:
  # Reference to the default data flow profile
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

Review the following sections to learn how to configure the operation types of the data flow.

## Source

To configure a source for the data flow, specify the endpoint reference and a list of data sources for the endpoint. Choose one of the following options as the source for the data flow.

If you don't use the default endpoint as the source, you must use it as the [destination](#destination). For more information about using the local MQTT broker endpoint, see [Data flows must use local MQTT broker endpoint](./howto-configure-dataflow-endpoint.md#data-flows-must-use-local-mqtt-broker-endpoint).

### Option 1: Use default message broker endpoint as source

# [Operations experience](#tab/portal)

1. Under **Source details**, select **Message broker**.

    :::image type="content" source="media/howto-create-dataflow/dataflow-source-mqtt.png" alt-text="Screenshot of the operations experience interface showing the selection of the message broker as the source endpoint for a data flow.":::

1. Enter the following settings for the message broker source:

    | Setting              | Description                                                                                       |
    | -------------------- | ------------------------------------------------------------------------------------------------- |
    | Data flow endpoint    | Select *default* to use the default MQTT message broker endpoint. |
    | Topic                | The topic filter to subscribe to for incoming messages. Use **Topic(s)** > **Add row** to add multiple topics. For more information on topics, see [Configure MQTT or Kafka topics](#configure-data-sources-mqtt-or-kafka-topics). |
    | Message schema       | The schema to use to deserialize the incoming messages. See [Specify schema to deserialize data](#specify-source-schema). |

1. Select **Apply**.

# [Azure CLI](#tab/cli)

Here's an example source endpoint configuration for the default MQTT broker endpoint:

```json
{
  "operationType": "Source",
  "sourceSettings": {
    "endpointRef": "default",
    "dataSources": [
      "thermostats/+/sensor/temperature/#",
      "humidifiers/+/sensor/humidity/#"
    ],
    "endpointRef": "default"
  }
}
```

# [Bicep](#tab/bicep)

You configure the message broker endpoint in the Bicep file. For example, the following endpoint is a source for the data flow:

```bicep
sourceSettings: {
  endpointRef: 'default'
  dataSources: [
    'thermostats/+/sensor/temperature/#'
    'humidifiers/+/sensor/humidity/#'
  ]
}
```

# [Kubernetes (preview)](#tab/kubernetes)

To configure a source that uses a message broker endpoint and two topic filters, use the following configuration:

```yaml
sourceSettings:
  endpointRef: default
  dataSources:
    - thermostats/+/sensor/temperature/#
    - humidifiers/+/sensor/humidity/#
```


---

Because `dataSources` accepts MQTT or Kafka topics without modifying the endpoint configuration, you can reuse the endpoint for multiple data flows even if the topics are different. For more information, see [Configure data sources](#configure-data-sources-mqtt-or-kafka-topics).

### Option 2: Use asset as source

# [Operations experience](#tab/portal)

You can use an [asset](../discover-manage-assets/overview-manage-assets.md) as the source for the data flow. You can use an asset as a source only in the operations experience.

1. Under **Source details**, select **Asset**.
1. Select the asset you want to use as the source endpoint.
1. Select **Proceed**.

    A list of datapoints for the selected asset is displayed.

    :::image type="content" source="media/howto-create-dataflow/dataflow-source-asset.png" alt-text="Screenshot using operations experience to select an asset as the source endpoint.":::

1. Select **Apply** to use the asset as the source endpoint.

# [Azure CLI](#tab/cli)

You can configure an asset as a source only in the operations experience.

# [Bicep](#tab/bicep)

You can configure an asset as a source only in the operations experience.

# [Kubernetes (preview)](#tab/kubernetes)

You can configure an asset as a source only in the operations experience.

---

When you use an asset as the source, the asset definition provides the schema for the data flow. The asset definition includes the schema for the asset's datapoints. For more information, see [Manage asset configurations remotely](../discover-manage-assets/howto-configure-opc-ua.md).

After you configure the source, the data from the asset reaches the data flow through the local MQTT broker. So, when you use an asset as the source, the data flow uses the local MQTT broker default endpoint as the source.

### Option 3: Use custom MQTT or Kafka data flow endpoint as source

If you created a custom MQTT or Kafka data flow endpoint (for example, to use with Event Grid or Event Hubs), you can use it as the source for the data flow. Remember that storage type endpoints, like Data Lake or Fabric OneLake, can't be used as source.

# [Operations experience](#tab/portal)

1. Under **Source details**, select **Message broker**.

    :::image type="content" source="media/howto-create-dataflow/dataflow-source-custom.png" alt-text="Screenshot using operations experience to select a custom message broker as the source endpoint.":::

1. Enter the following settings for the message broker source:

    | Setting              | Description                                                                                       |
    | -------------------- | ------------------------------------------------------------------------------------------------- |
    | Data flow endpoint    | Use the **Reselect** button to select a custom MQTT or Kafka data flow endpoint. For more information, see [Configure MQTT data flow endpoints](howto-configure-mqtt-endpoint.md) or [Configure Azure Event Hubs and Kafka data flow endpoints](howto-configure-kafka-endpoint.md).|
    | Topic                | The topic filter to subscribe to for incoming messages. Use **Topic(s)** > **Add row** to add multiple topics. For more information on topics, see [Configure MQTT or Kafka topics](#configure-data-sources-mqtt-or-kafka-topics). |
    | Message schema       | The schema to use to deserialize the incoming messages. See [Specify schema to deserialize data](#specify-source-schema). |

1. Select **Apply**.

# [Azure CLI](#tab/cli)

Replace placeholder values with your custom endpoint name and topics.

```json
{
    "operationType": "Source",
    "sourceSettings": {
        "endpointRef": "<CUSTOM_ENDPOINT_NAME>",
        "dataSources": [
            "<TOPIC_1>",
            "<TOPIC_2>"
        ]
    }
}
```

# [Bicep](#tab/bicep)

Replace placeholder values with your custom endpoint name and topics.

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

Replace placeholder values with your custom endpoint name and topics.

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

You can specify multiple MQTT or Kafka topics in a source without needing to modify the data flow endpoint configuration. This flexibility means you can reuse the same endpoint across multiple data flows, even if the topics vary. For more information, see [Reuse data flow endpoints](./howto-configure-dataflow-endpoint.md#reuse-endpoints).

#### MQTT topics

When the source is an MQTT (Event Grid included) endpoint, use the MQTT topic filter to subscribe to incoming messages. The topic filter can include wildcards to subscribe to multiple topics. For example, `thermostats/+/sensor/temperature/#` subscribes to all temperature sensor messages from thermostats. To configure the MQTT topic filters:

# [Operations experience](#tab/portal)

In the operations experience data flow **Source details**, select **Message broker**, then use the **Topic(s)** field to specify the MQTT topic filters to subscribe to for incoming messages. To add multiple MQTT topics, select **Add row** and enter a new topic.

# [Azure CLI](#tab/cli)

```json
{
    "operationType": "Source",
    "sourceSettings": {
        "endpointRef": "<MESSAGE_BROKER_ENDPOINT_NAME>",
        "dataSources": [
            "<TOPIC_FILTER_1>",
            "<TOPIC_FILTER_2>"
            // Add more topic filters as needed
        ]
    }
}
```

Example with multiple MQTT topic filters with wildcards:

```json
{
    "operationType": "Source",
    "sourceSettings": {
        "endpointRef": "default",
        "dataSources": [
            "thermostats/+/sensor/temperature/#",
            "humidifiers/+/sensor/humidity/#"
        ]
    }
}
```

Here, the wildcard `+` selects all devices under the `thermostats` and `humidifiers` topics. The `#` wildcard selects all sensor messages under all subtopics of the `temperature` and `humidity` topics.

# [Bicep](#tab/bicep)

```bicep
sourceSettings: {
  endpointRef: '<MESSAGE_BROKER_ENDPOINT_NAME>'
  dataSources: [
    '<TOPIC_FILTER_1>'
    '<TOPIC_FILTER_2>'
    // Add more topic filters as needed
  ]
}
```

Example with multiple MQTT topic filters with wildcards:

```bicep
sourceSettings: {
  endpointRef: 'default'
  dataSources: [
    'thermostats/+/sensor/temperature/#'
    'humidifiers/+/sensor/humidity/#'
  ]
}
```

Here, the wildcard `+` selects all devices under the `thermostats` and `humidifiers` topics. The `#` wildcard selects all sensor messages under all subtopics of the `temperature` and `humidity` topics.

# [Kubernetes (preview)](#tab/kubernetes)
  
```yaml
sourceSettings:
  endpointRef: <ENDPOINT_NAME>
  dataSources:
    - <TOPIC_FILTER_1>
    - <TOPIC_FILTER_2>
    # Add more topic filters as needed
```

Example with multiple topic filters with wildcards:

```yaml
sourceSettings:
  endpointRef: default
  dataSources:
    - thermostats/+/sensor/temperature/#
    - humidifiers/+/sensor/humidity/#
```

Here, the wildcard `+` selects all devices under the `thermostats` and `humidifiers` topics. The `#` wildcard selects all messages under all subtopics of the `temperature` and `humidity` topics.

---

##### Shared subscriptions

To use shared subscriptions with message broker sources, specify the shared subscription topic in the form of `$shared/<GROUP_NAME>/<TOPIC_FILTER>`.

# [Operations experience](#tab/portal)

In operations experience data flow **Source details**, select **Message broker** and use the **Topic** field to specify the shared subscription group and topic.

# [Azure CLI](#tab/cli)
```json
{
  "operationType": "Source",
  "sourceSettings": {
    "dataSources": [
      "$shared/<GROUP_NAME>/<TOPIC_FILTER>"
    ]
  }
}
```

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

If the instance count in the [data flow profile](howto-configure-dataflow-profile.md) is greater than one, shared subscription is automatically enabled for all data flows that use a message broker source. In this case, the `$shared` prefix is added and the shared subscription group name automatically generated. For example, if you have a data flow profile with an instance count of 3, and your data flow uses a message broker endpoint as source configured with topics `topic1` and `topic2`, they're automatically converted to shared subscriptions as `$shared/<GENERATED_GROUP_NAME>/topic1` and `$shared/<GENERATED_GROUP_NAME>/topic2`. 

You can explicitly create a topic named `$shared/mygroup/topic` in your configuration. However, adding the `$shared` topic explicitly isn't recommended since the `$shared` prefix is automatically added when needed. Data flows can make optimizations with the group name if it isn't set. For example, `$share` isn't set and data flows only has to operate over the topic name.

> [!IMPORTANT]
> Shared subscriptions are important for data flows when the instance count is greater than one and you're using Event Grid MQTT broker as a source, since it [doesn't support shared subscriptions](../../event-grid/mqtt-support.md#mqtt-v5-current-limitations). To avoid missing messages, set the data flow profile instance count to one when using Event Grid MQTT broker as the source. That is when the data flow is the subscriber and receiving messages from the cloud.

#### Kafka topics

When the source is a Kafka (Event Hubs included) endpoint, specify the individual Kafka topics to subscribe to for incoming messages. Wildcards aren't supported, so you must specify each topic statically.

> [!NOTE]
> When using Event Hubs via the Kafka endpoint, each individual event hub within the namespace is the Kafka topic. For example, if you have an Event Hubs namespace with two event hubs, `thermostats` and `humidifiers`, you can specify each event hub as a Kafka topic.

To configure the Kafka topics:

# [Operations experience](#tab/portal)

In the operations experience data flow **Source details**, select **Message broker**, then use the **Topic** field to specify the Kafka topic filter to subscribe to for incoming messages.

> [!NOTE]
> You can specify only one topic filter in the operations experience. To use multiple topic filters, use Bicep or Kubernetes.

# [Azure CLI](#tab/cli)

```json
{
  "operationType": "Source",
  "sourceSettings": {
    "endpointRef": "<KAFKA_ENDPOINT_NAME>",
    "dataSources": [
      "<KAFKA_TOPIC_1>",
      "<KAFKA_TOPIC_2>"
      // Add more Kafka topics as needed
    ]
  }
}
```

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

When you use MQTT or Kafka as the source, you can specify a [schema](concept-schema-registry.md) to display the list of data points in the operations experience web UI. Using a schema to deserialize and validate incoming messages [isn't currently supported](../troubleshoot/known-issues.md#data-flows-issues).

If the source is an asset, the portal automatically infers the schema from the asset definition.

> [!TIP]
> To generate the schema from a sample data file, use the [Schema Gen Helper](https://azure-samples.github.io/explore-iot-operations/schema-gen-helper/).

To configure the schema used to deserialize the incoming messages from a source:

# [Operations experience](#tab/portal)

In the Operations experience data flow **Source details**, select **Message broker** and use the **Message schema** field to specify the schema. Select **Upload** to upload a schema file. For more information, see [Understand message schemas](concept-schema-registry.md).

# [Azure CLI](#tab/cli)

```json
{
  "operationType": "Source",
  "sourceSettings": {
    "endpointRef": "<ENDPOINT_NAME>",
    "serializationFormat": "Json",
    "schemaRef": "aio-sr://<SCHEMA_NAMESPACE>/<SCHEMA_NAME>:<VERSION>"
  }
}
```

# [Bicep](#tab/bicep)

After you use the [schema registry to store the schema](concept-schema-registry.md), reference it in the data flow configuration.

```bicep
sourceSettings: {
  serializationFormat: 'Json'
  schemaRef: 'aio-sr://<SCHEMA_NAMESPACE>/<SCHEMA_NAME>:<VERSION>'
}
```

# [Kubernetes (preview)](#tab/kubernetes)

After you use the [schema registry to store the schema](concept-schema-registry.md), reference it in the data flow configuration.

```yaml
sourceSettings:
  serializationFormat: Json
  schemaRef: 'aio-sr://<SCHEMA_NAMESPACE>/<SCHEMA_NAME>:<VERSION>'
```

---

For more information, see [Understand message schemas](concept-schema-registry.md).

## Request disk persistence

Request disk persistence lets data flows keep state across restarts. When you enable this feature, the graph recovers processing state if the connected broker restarts. This feature is useful for stateful processing scenarios where losing intermediate data is a problem. When you enable request disk persistence, the broker persists the MQTT data, like messages in the subscriber queue, to disk. This approach makes sure your data flow's data source doesn't lose data during power outages or broker restarts. The broker maintains optimal performance because persistence is configured per data flow, so only the data flows that need persistence use this feature.

The data flow graph requests this persistence during subscription by using an MQTTv5 user property. This feature works only when:

- The data flow uses the MQTT broker or asset as the source
- The MQTT broker has persistence enabled with dynamic persistence mode set to `Enabled` for the data type, like subscriber queues

This configuration lets MQTT clients like data flows request disk persistence for their subscriptions by using MQTTv5 user properties. For details about MQTT broker persistence configuration, see [Configure MQTT broker persistence](../manage-mqtt-broker/howto-broker-persistence.md).

The setting accepts `Enabled` or `Disabled`. `Disabled` is the default.

# [Operations experience](#tab/portal)

When you create or edit a data flow, select **Edit**, and then select **Yes** next to **Request data persistence**.

# [Azure CLI](#tab/cli)

Add the `requestDiskPersistence` property to your data flow configuration file:

```json
{
    "mode": "Enabled",
    "requestDiskPersistence": "Enabled",
    "operations": [
        // ... your data flow operations
    ]
}
```

# [Bicep](#tab/bicep)

Add the `requestDiskPersistence` property to your data flow resource. The API version is `2025-10-01` or later:

```bicep
resource dataflow 'Microsoft.IoTOperations/instances/dataflowProfiles/dataflows@2025-10-01' = {
  parent: defaultDataflowProfile
  name: dataflowName
  extendedLocation: {
    name: customLocation.id
    type: 'CustomLocation'
  }
  properties: {
    mode: 'Enabled'
    requestDiskPersistence: 'Enabled'
    operations: [
      // ... your data flow operations
    ]
  }
}
```

# [Kubernetes (preview)](#tab/kubernetes)

Add the `requestDiskPersistence` property to your data flow spec. Use API version `connectivity.iotoperations.azure.com/v1beta1` or later:

```yaml
apiVersion: connectivity.iotoperations.azure.com/v1beta1
kind: Dataflow
metadata:
  name: <DATAFLOW_NAME>
  namespace: azure-iot-operations
spec:
  profileRef: default 
  mode: Enabled
  requestDiskPersistence: Enabled
  operations:
    # ... your data flow operations
```

---

## Transformation

The transformation operation is where you transform the data from the source before you send it to the destination. Transformations are optional. If you don't need to make changes to the data, don't include the transformation operation in the data flow configuration. Multiple transformations chain together in stages regardless of the order in which you specify them in the configuration. The order of the stages is always:

1. **Enrich**: Add more data to the source data given a dataset and condition to match.
1. **Filter**: Filter the data based on a condition.
1. **Map**, **Compute**, **Rename**, or add a **New property**: Move data from one field to another with an optional conversion.

This section is an introduction to data flow transforms. For more detailed information, see [Map data by using data flows](concept-dataflow-mapping.md), [Convert data by using data flow conversions](concept-dataflow-conversions.md), and [Enrich data by using data flows](concept-dataflow-enrich.md).

# [Operations experience](#tab/portal)

In the operations experience, select **Data flow** > **Add transform (optional)**.

:::image type="content" source="media/howto-create-dataflow/dataflow-transform.png" alt-text="Screenshot of the operations experience interface showing the addition of a transformation stage to a data flow.":::

# [Azure CLI](#tab/cli)

```json
{
  "operationType": "BuiltInTransformation",
  "builtInTransformationSettings": {
    "datasets": [
      // See section on enriching data
    ],
    "filter": [
      // See section on filtering data
    ],
    "map": [
      // See section on mapping data
    ]
  }
}
```


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

To enrich the data, first add a reference dataset in the Azure IoT Operations [state store](../develop-edge-apps/overview-state-store.md). The dataset adds extra data to the source data based on a condition. The condition is specified as a field in the source data that matches a field in the dataset.

You can load sample data into the state store by using the [state store CLI](https://github.com/Azure/iot-operations-sdks/tree/main/tools/statestore-cli). Key names in the state store correspond to a dataset in the data flow configuration.

# [Operations experience](#tab/portal)

Currently, the *Enrich* stage isn't supported in the operations experience.

# [Azure CLI](#tab/cli)

To enrich the data, use the `builtInTransformationSettings` property in the data flow configuration. Use the `datasets` property to specify the datasets for enrichment.

```json
{
  "operationType": "BuiltInTransformation",
  "builtInTransformationSettings": {
    "datasets": [
      {
        "key": "<DATASET_KEY>",
        "inputs": [
          "$source.<SOURCE_FIELD>" // ---------------- $1
          "$context(<DATASET_KEY>).<DATASET_FIELD>" // - $2
        ],
        "expression": "$1 == $2"
      }
    ]
  }
}
```

# [Bicep](#tab/bicep)

This example shows how you can use the `deviceId` field in the source data to match the `asset` field in the dataset:

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

For more information about condition syntax, see [Enrich data by using data flows](concept-dataflow-enrich.md) and [Convert data using data flows](concept-dataflow-conversions.md).

### Filter: Filter data based on a condition

To filter the data on a condition, use the `filter` stage. Specify the condition as a field in the source data that matches a value.

# [Operations experience](#tab/portal)

1. Under **Transform (optional)**, select **Filter** > **Add**.

    :::image type="content" source="media/howto-create-dataflow/dataflow-filter.png" alt-text="Screenshot using operations experience to add a filter transform.":::

1.  Enter the required settings.

    | Setting            | Description                                                                                       |
    |--------------------|---------------------------------------------------------------------------------------------------|
    | Filter condition   | The condition to filter the data based on a field in the source data.                               |
    | Description        | Provide a description for the filter condition.                                                     |

    In the filter condition field, enter `@` or select **Ctrl + Space** to choose datapoints from a dropdown.

    Enter MQTT metadata properties by using the format `@$metadata.user_properties.<property>` or `@$metadata.topic`. Enter $metadata headers by using the format `@$metadata.<header>`. The `$metadata` syntax is only needed for MQTT properties that are part of the message header. For more information, see [field references](concept-dataflow-mapping.md#field-references).

    The condition can use the fields in the source data. For example, use a filter condition like `@temperature > 20` to filter data less than or equal to 20 based on the temperature field.

1. Select **Apply**.

# [Azure CLI](#tab/cli)

For example, use the `temperature` field in the source data to filter the data:

```json
{
  "operationType": "BuiltInTransformation",
  "builtInTransformationSettings": {
    "filter": [
      {
        "inputs": [
          "$source.temperature ? $last" // ---------------- $1
        ],
        "expression": "$1 > 20"
      }
    ]
  }
}
```

# [Bicep](#tab/bicep)

For example, use the `temperature` field in the source data to filter the data:

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

For example, use the `temperature` field in the source data to filter the data:

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

To map the data to another field with optional conversion, use the `map` operation. Specify the conversion as a formula that uses the fields in the source data.

In the operations experience, you can currently map data by using **Compute**, **Rename**, and **New property** transforms.

#### Compute

Use the **Compute** transform to apply a formula to the source data. This operation applies a formula to the source data and stores the result in a field.

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


    Enter or edit a formula in the **Formula** field. The formula can use the fields in the source data. Enter `@` or select **Ctrl + Space** to choose datapoints from a dropdown. For built-in formulas, select the `<dataflow>` placeholder to see the list of available datapoints.

    Enter MQTT metadata properties by using the format `@$metadata.user_properties.<property>` or `@$metadata.topic`. Enter $metadata headers by using the format `@$metadata.<header>`. The `$metadata` syntax is only needed for MQTT properties that are part of the message header. For more information, see [field references](concept-dataflow-mapping.md#field-references).

    The formula can use the fields in the source data. For example, you could use the `temperature` field in the source data to convert the temperature to Celsius and store it in the `temperatureCelsius` output field. 
    
1. Select **Apply**.

#### Rename

Use the **Rename** transform to rename a datapoint. This operation renames a datapoint in the source data to a new name. Use the new name in the subsequent stages of the data flow.

1. Under **Transform (optional)**, select **Rename** > **Add**. 

    :::image type="content" source="media/howto-create-dataflow/dataflow-rename.png" alt-text="Screenshot using operations experience to rename a datapoint.":::

1.  Enter the required settings.

    | Setting            | Description                                                                                             |
    |--------------------|---------------------------------------------------------------------------------------------------------|
    | Datapoint          | Select a datapoint from the dropdown or enter a $metadata header.                                       |
    | New datapoint name | Enter the new name for the datapoint.                                                                   |
    | Description        | Provide a description for the transformation.                                                           |

    Enter MQTT metadata properties by using the format `@$metadata.user_properties.<property>` or `@$metadata.topic`. Enter $metadata headers by using the format `@$metadata.<header>`. The `$metadata` syntax is only needed for MQTT properties that are part of the message header. For more information, see [field references](concept-dataflow-mapping.md#field-references).

1. Select **Apply**.

#### New property

Use the **New property** transform to add a new property to the source data. This operation adds a new property to the source data. Use the new property in the subsequent stages of the data flow.

# [Operations experience](#tab/portal)

1. Under **Transform (optional)**, select **New property** > **Add**. 

    :::image type="content" source="media/howto-create-dataflow/dataflow-new-property.png" alt-text="Screenshot using operations experience to add a new property.":::

1.  Enter the required settings.

    | Setting            | Description                                                                                         |
    |--------------------|-----------------------------------------------------------------------------------------------------|
    | Property key       | Enter the key for the new property.                                                                 |
    | Property value     | Enter the value for the new property.                                                               |
    | Description        | Provide a description for the new property.                                                         |

1. Select **Apply**.

# [Azure CLI](#tab/cli)

For example, you can use the `temperature` field in the source data to convert the temperature to Celsius and store it in the `temperatureCelsius` field. Enrich the source data with the `location` field from the contextualization dataset:

```json
{
  "operationType": "BuiltInTransformation",
  "builtInTransformationSettings": {
    "map": [
      {
        "inputs": [
          "$source.temperature ? $last" // ---------------- $1
        ],
        "output": "temperatureCelsius",
        "expression": "($1 - 32) * 5/9"
      },
      {
        "inputs": [
          "$context(assetDataset).location" // - $2
        ],
        "output": "location"
      }
    ]
  }
}
```

# [Bicep](#tab/bicep)

You can access MQTT metadata properties by using the format `$metadata.user_properties.<property>` or `$metadata.topic`. You can also enter $metadata headers by using the format `$metadata.<header>`. For more information, see [field references](concept-dataflow-mapping.md#field-references).

For example, you can use the `temperature` field in the source data to convert the temperature to Celsius and store it in the `temperatureCelsius` field. Enrich the source data with the `location` field from the contextualization dataset:

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

You can access MQTT metadata properties by using the format `$metadata.user_properties.<property>` or `$metadata.topic`. You can also enter $metadata headers by using the format `$metadata.<header>`. For more information, see [field references](concept-dataflow-mapping.md#field-references).

For example, you can use the `temperature` field in the source data to convert the temperature to Celsius and store it in the `temperatureCelsius` field. Enrich the source data with the `location` field from the contextualization dataset:

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

To learn more, see [Map data by using data flows](concept-dataflow-mapping.md) and [Convert data by using data flows](concept-dataflow-conversions.md).

#### Remove

By default, the output schema includes all datapoints. Remove any datapoint from the destination by using the **Remove** transform.

# [Operations experience](#tab/portal)

1. Under **Transform (optional)**, select **Remove**. 
1. Select the datapoint to remove from the output schema.

    :::image type="content" source="media/howto-create-dataflow/dataflow-remove.png" alt-text="Screenshot using operations experience to remove the weight datapoint the output schema.":::

1. Select **Apply**.

# [Azure CLI](#tab/cli)

To remove a datapoint from the output schema, use the `builtInTransformationSettings` property in the data flow configuration. Use the `map` property to specify the datapoints to remove.

```json
{
  "operationType": "BuiltInTransformation",
  "builtInTransformationSettings": {
    "map": [
      {
        "inputs": [
          "*"
        ],
        "output": "*"
      },
      {
        "inputs": [
          "weight"
        ],
        "output": ""
      }
      {
          "inputs": [
          "weight.SourceTimestamp"
          ],
          "output": ""
      },
      {
          "inputs": [
          "weight.Value"
          ],
          "output": ""
      },
      {
          "inputs": [
          "weight.StatusCode"
          ],
          "output": ""
      },
      {
          "inputs": [
          "weight.StatusCode.Code"
          ],
          "output": ""
      },
      {
          "inputs": [
          "weight.StatusCode.Symbol"
          ],
          "output": ""
      }
    ]
  }
}
```

# [Bicep](#tab/bicep)

```bicep
builtInTransformationSettings: {
  map: [
    {
      inputs: [
        '*'
      ]
      output: '*'
    }
    {
      inputs: [
        'weight'
      ]
      output: ''
    }
    {
      inputs: [
        'weight.SourceTimestamp'
      ]
      output: ''
    }
    {
      inputs: [
        'weight.Value'
      ]
      output: ''
    }
    {
      inputs: [
        'weight.StatusCode'
      ]
      output: ''
    }
    {
      inputs: [
        'weight.StatusCode.Code'
      ]
      output: ''
    }
    {
      inputs: [
        'weight.StatusCode.Symbol'
      ]
      output: ''
    }
  ]
}
```

# [Kubernetes (preview)](#tab/kubernetes)

```yaml
builtInTransformationSettings:
  map:
    - type: PassThrough
      inputs:
        - "*"
      output: "*"
    - inputs:
        - weight
      output: ""
    - inputs:
        - weight.SourceTimestamp
      output: ""
    - inputs:
        - weight.Value
      output: ""
    - inputs:
        - weight.StatusCode
      output: ""
    - inputs:
        - weight.StatusCode.Code
      output: ""
    - inputs:
        - weight.StatusCode.Symbol
      output: ""
```

---

To learn more, see [Map data by using data flows](concept-dataflow-mapping.md) and [Convert data by using data flows](concept-dataflow-conversions.md).

### Serialize data according to a schema

If you want to serialize the data before sending it to the destination, specify a schema and serialization format. Otherwise, the system serializes the data in JSON with the types inferred. Storage endpoints like Microsoft Fabric or Azure Data Lake require a schema to ensure data consistency. Supported serialization formats are Parquet and Delta.

> [!TIP]
> To generate the schema from a sample data file, use the [Schema Gen Helper](https://azure-samples.github.io/explore-iot-operations/schema-gen-helper/).

# [Operations experience](#tab/portal)

For the Operations experience, specify the schema and serialization format in the data flow endpoint details. The endpoints that support serialization formats are Microsoft Fabric OneLake, Azure Data Lake Storage Gen 2, Azure Data Explorer, and local storage. For example, to serialize the data in Delta format, upload a schema to the schema registry and reference it in the data flow destination endpoint configuration.

:::image type="content" source="media/howto-create-dataflow/destination-serialization.png" alt-text="Screenshot using the operations experience to set the data flow destination endpoint serialization.":::

# [Azure CLI](#tab/cli)

After you [upload a schema to the schema registry](concept-schema-registry.md#upload-schema), reference it in the data flow configuration.

```json
{
  "builtInTransformationSettings": {
    "serializationFormat": "Delta",
    "schemaRef": "aio-sr://<SCHEMA_NAMESPACE>/<SCHEMA>:<VERSION>"
  }
}
```

# [Bicep](#tab/bicep)

After you [upload a schema to the schema registry](concept-schema-registry.md#upload-schema), reference it in the data flow configuration.

```bicep
builtInTransformationSettings: {
  serializationFormat: 'Delta'
  schemaRef: 'aio-sr://<SCHEMA_NAMESPACE>/<SCHEMA>:<VERSION>'
}
```

# [Kubernetes (preview)](#tab/kubernetes)

After you [upload a schema to the schema registry](concept-schema-registry.md#upload-schema), reference it in the data flow configuration.

```yaml
builtInTransformationSettings:
  serializationFormat: Delta
  schemaRef: 'aio-sr://<SCHEMA_NAMESPACE>/<SCHEMA>:<VERSION>'
```

---

For more information about schema registry, see [Understand message schemas](concept-schema-registry.md).

## Destination

To configure a destination for the data flow, specify the endpoint reference and data destination. You can specify a list of data destinations for the endpoint.

To send data to a destination other than the local MQTT broker, create a data flow endpoint. To learn how, see [Configure data flow endpoints](howto-configure-dataflow-endpoint.md). If the destination isn't the local MQTT broker, it must be the source. To learn more about using the local MQTT broker endpoint, see [Data flows must use local MQTT broker endpoint](./howto-configure-dataflow-endpoint.md#data-flows-must-use-local-mqtt-broker-endpoint).

> [!IMPORTANT]
> Storage endpoints require a [schema for serialization](./concept-schema-registry.md). To use data flow with Microsoft Fabric OneLake, Azure Data Lake Storage, Azure Data Explorer, or Local Storage, you must [specify a schema reference](#serialize-data-according-to-a-schema).

# [Operations experience](#tab/portal)

1. Select the data flow endpoint to use as the destination.

    :::image type="content" source="media/howto-create-dataflow/dataflow-destination.png" alt-text="Screenshot using operations experience to select Event Hubs destination endpoint.":::

    Storage endpoints require a [schema for serialization](./concept-schema-registry.md). If you choose a Microsoft Fabric OneLake, Azure Data Lake Storage, Azure Data Explorer, or Local Storage destination endpoint, you must [specify a schema reference](#serialize-data-according-to-a-schema). For example, to serialize the data to a Microsoft Fabric endpoint in Delta format, you need to upload a schema to the schema registry and reference it in the data flow destination endpoint configuration.

    :::image type="content" source="media/howto-create-dataflow/serialization-schema.png" alt-text="Screenshot using operations experience to choose output schema and serialization format.":::

1. Select **Proceed** to configure the destination.
1. Enter the required settings for the destination, including the topic or table to send the data to. See [Configure data destination (topic, container, or table)](#configure-data-destination-topic-container-or-table) for more information.

# [Azure CLI](#tab/cli)

```json
{
  "destinationSettings": {
    "endpointRef": "<CUSTOM_ENDPOINT_NAME>",
    "dataDestination": "<TOPIC_OR_TABLE>" // See section on configuring data destination
  }
}
```

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

Like data sources, use data destinations to make data flow endpoints reusable across multiple data flows. A data destination represents the subdirectory in the data flow endpoint configuration. For example, if the data flow endpoint is a storage endpoint, the data destination is the table in the storage account. If the data flow endpoint is a Kafka endpoint, the data destination is the Kafka topic.

| Endpoint type | Data destination meaning | Description |
| - | - | - |
| MQTT (or Event Grid) | Topic | The MQTT topic where the data is sent. Supports both static topics and dynamic topic translation using variables like `${inputTopic}` and `${inputTopic.index}`. For more information, see [Dynamic destination topics](#dynamic-destination-topics). |
| Kafka (or Event Hubs) | Topic | The Kafka topic where the data is sent. Only static topics are supported, no wildcards. If the endpoint is an Event Hubs namespace, the data destination is the individual event hub within the namespace. |
| Azure Data Lake Storage | Container | The container in the storage account. Not the table. |
| Microsoft Fabric OneLake | Table or Folder | Corresponds to the configured [path type for the endpoint](howto-configure-fabric-endpoint.md#onelake-path-type). |
| Azure Data Explorer | Table | The table in the Azure Data Explorer database. |
| Local Storage | Folder | The folder or directory name in the local storage persistent volume mount. When using [Azure Container Storage enabled by Azure Arc Cloud Ingest Edge Volumes](/azure/azure-arc/container-storage/overview), this value must match the `spec.path` parameter for the subvolume you created. |
| OpenTelemetry | Topic | The OpenTelemetry topic where the data is sent. Only static topics are supported. |

To configure the data destination:

# [Operations experience](#tab/portal)

When you use the operations experience, it automatically interprets the data destination field based on the endpoint type. For example, if the data flow endpoint is a storage endpoint, the destination details page prompts you to enter the container name. If the data flow endpoint is an MQTT endpoint, the destination details page prompts you to enter the topic, and so on.

:::image type="content" source="media/howto-create-dataflow/data-destination.png" alt-text="Screenshot showing the operations experience prompting the user to enter an MQTT topic given the endpoint type.":::

# [Azure CLI](#tab/cli)

```json
{
  "destinationSettings": {
    "endpointRef": "<CUSTOM_ENDPOINT_NAME>",
    "dataDestination": "<TOPIC_OR_TABLE>" // See section on configuring data destination
  }
}
```

To send data back to the local MQTT broker, use a static MQTT topic in the following configuration:

```json
{
  "destinationSettings": {
    "endpointRef": "default",
    "dataDestination": "example-topic"
  }
}
```
If you have a custom event hub endpoint, the configuration looks like:

```json
{
  "destinationSettings": {
    "endpointRef": "my-eh-endpoint",
    "dataDestination": "individual-event-hub"
  }
}
```

For MQTT endpoints, you can also use dynamic topic variables. To route messages from `factory/1/data` to `processed/factory/1`, use the following example:

```json
{
  "destinationSettings": {
    "endpointRef": "default",
    "dataDestination": "processed/factory/${inputTopic.2}"
  }
}
```

# [Bicep](#tab/bicep)

The syntax is the same for all data flow endpoints:

```bicep
destinationSettings: {
  endpointRef: "<CUSTOM_ENDPOINT_NAME>"
  dataDestination: '<TOPIC_OR_TABLE>'
}
```

To send data back to the local MQTT broker, use a static MQTT topic in the following configuration:

```bicep
destinationSettings: {
  endpointRef: 'default'
  dataDestination: 'example-topic'
}
```

If you have a custom event hub endpoint, the configuration looks like:

```bicep
destinationSettings: {
  endpointRef: 'my-eh-endpoint'
  dataDestination: 'individual-event-hub'
}
```

This example uses a storage endpoint as the destination:

```bicep
destinationSettings: {
  endpointRef: 'my-adls-endpoint'
  dataDestination: 'my-container'
}
```

For MQTT endpoints, you can also use dynamic topic variables:

```bicep
destinationSettings: {
  endpointRef: 'default'
  dataDestination: 'processed/factory/${inputTopic.2}'
}
```

# [Kubernetes (preview)](#tab/kubernetes)

The syntax is the same for all data flow endpoints:

```yaml
destinationSettings:
  endpointRef: <CUSTOM_ENDPOINT_NAME>
  dataDestination: <TOPIC_OR_TABLE>
```

To send data back to the local MQTT broker, use a static MQTT topic in the following configuration:

```yaml
destinationSettings:
  endpointRef: default
  dataDestination: example-topic
```

If you have a custom event hub endpoint, the configuration looks like:

```yaml
destinationSettings:
  endpointRef: my-eh-endpoint
  dataDestination: individual-event-hub
```

This example uses a storage endpoint as the destination:

```yaml
destinationSettings:
  endpointRef: my-adls-endpoint
  dataDestination: my-container
```

For MQTT endpoints, you can also use dynamic topic variables:

```yaml
destinationSettings:
  endpointRef: default
  dataDestination: processed/factory/${inputTopic.2}
```

---

### Dynamic destination topics

For MQTT endpoints, use dynamic topic variables in the `dataDestination` field to route messages based on the source topic structure. The following variables are available:

- `${inputTopic}` - The full original input topic
- `${inputTopic.index}` - A segment of the input topic (index starts at 1)

For example, `processed/factory/${inputTopic.2}` routes messages from `factory/1/data` to `processed/factory/1`. Topic segments are 1-indexed, and leading or trailing slashes are ignored.

If a topic variable can't be resolved (for example, `${inputTopic.5}` when the input topic only has three segments), the message is dropped and a warning is logged. Wildcard characters (`#` and `+`) aren't allowed in destination topics.

> [!NOTE]
> The characters `$`, `{`, and `}` are valid in MQTT topic names, so a topic like `factory/$inputTopic.2` is acceptable but incorrect if you intended to use the dynamic topic variable.

## Example

The following example is a data flow configuration that uses the MQTT endpoint for the source and destination. The source filters the data from the MQTT topic `azure-iot-operations/data/thermostat`. The transformation converts the temperature to Fahrenheit and filters the data where the temperature multiplied by the humidity is less than 100000. The destination sends the data to the MQTT topic `factory`.

# [Operations experience](#tab/portal)

:::image type="content" source="media/howto-create-dataflow/dataflow-example.png" alt-text="Screenshot showing the operations experience data flow example with a source endpoint, transforms, and a destination endpoint." lightbox="media/howto-create-dataflow/dataflow-example.png":::

# [Azure CLI](#tab/cli)

Use the [az iot ops dataflow apply](/cli/azure/iot/ops/dataflow#az-iot-ops-dataflow-apply) command to create or change a data flow.

```azurecli
az iot ops dataflow apply --resource-group <ResourceGroupName> --instance <AioInstanceName> --profile <DataflowProfileName> --name <DataflowName> --config-file <ConfigFilePathAndName>
```

The `--config-file` parameter is the path and file name of a JSON configuration file containing the resource properties.

In this example, assume a configuration file named `data-flow.json` with the following content is stored in the user's home directory:

```json
{
    "mode": "Enabled",
    "operations": [
      {
        "operationType": "Source",
        "sourceSettings": {
          "dataSources": [
            "thermostats/+/sensor/temperature/#",
            "humidifiers/+/sensor/humidity/#"
          ],
          "endpointRef": "default",
          "serializationFormat": "Json"
        }
      },
      {
        "builtInTransformationSettings": {
          "datasets": [],
          "filter": [
            {
              "expression": "$1 * $2 < 100000",
              "inputs": [
                "temperature.Value",
                "\"Tag 10\".Value"
              ],
              "type": "Filter"
            }
          ],
          "map": [
            {
              "inputs": [
                "*"
              ],
              "output": "*",
              "type": "PassThrough"
            },
            {
              "expression": "fToC($1)",
              "inputs": [
                "Temperature.Value"
              ],
              "output": "TemperatureF",
              "type": "Compute"
            },
            {
              "inputs": [
                "@\"Tag 10\".Value"
              ],
              "output": "Humidity",
              "type": "Rename"
            }
          ],
          "serializationFormat": "Json"
        },
        "operationType": "BuiltInTransformation"
      },
      {
        "destinationSettings": {
          "dataDestination": "factory",
          "endpointRef": "default"
        },
        "operationType": "Destination"
      }
    ]
}
```

Here's an example command to create or update a data flow using the default dataflow profile:

```azurecli
az iot ops dataflow apply --resource-group myResourceGroup --instance myAioInstance --profile default --name data-flow --config-file ~/data-flow.json
```

Here's another example using dynamic topic translation to route messages from different thermostats to device-specific topics:

```json
{
    "mode": "Enabled",
    "operations": [
      {
        "operationType": "Source",
        "sourceSettings": {
          "dataSources": [
            "thermostats/+/sensor/temperature"
          ],
          "endpointRef": "default",
          "serializationFormat": "Json"
        }
      },
      {
        "destinationSettings": {
          "dataDestination": "processed/device/${inputTopic.2}/temperature",
          "endpointRef": "default"
        },
        "operationType": "Destination"
      }
    ]
}
```

This configuration processes messages from `thermostats/device1/sensor/temperature` and sends them to `processed/device/device1/temperature`.

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

// Pointer to the default data flow endpoint
resource defaultDataflowEndpoint 'Microsoft.IoTOperations/instances/dataflowEndpoints@2024-11-01' existing = {
  parent: aioInstance
  name: 'default'
}

// Pointer to the default data flow profile
resource defaultDataflowProfile 'Microsoft.IoTOperations/instances/dataflowProfiles@2024-11-01' existing = {
  parent: aioInstance
  name: 'default'
}

resource dataflow 'Microsoft.IoTOperations/instances/dataflowProfiles/dataflows@2024-11-01' = {
  // Reference to the parent data flow profile, the default profile in this case
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
  # Reference to the default data flow profile
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

To see more examples of data flow configurations, see [Azure REST API - Data flow](/rest/api/iotoperations/dataflow/create-or-update#examples) and the [quickstart Bicep](https://github.com/Azure-Samples/explore-iot-operations/blob/main/samples/quickstarts/quickstart.bicep).

## Verify a data flow is working

To verify the data flow is working, follow [Tutorial: Bi-directional MQTT bridge to Azure Event Grid](tutorial-mqtt-bridge.md).

### Export data flow configuration

To export the data flow configuration, use the operations experience or export the data flow custom resource.

# [Operations experience](#tab/portal)

Select the data flow you want to export, then select **Export** from the toolbar.

:::image type="content" source="media/howto-create-dataflow/dataflow-export.png" alt-text="Screenshot of the operations experience interface showing the export option for a configured data flow.":::

# [Azure CLI](#tab/cli)

Use the [az iot ops dataflow show](/cli/azure/iot/ops/dataflow/#az-iot-ops-dataflow-show) command to export a data flow.

```azurecli
az iot ops dataflow show --resource-group <ResourceGroupName> --instance <AioInstanceName> --name <DataflowName> --profile <DataflowProfileName> --output json > my-dataflow.json
```

Here's an example command to export a data flow named `data-flow` to a JSON file named `data-flow.json`:

```azurecli
az iot ops dataflow show --resource-group myResourceGroup --instance myAioInstance --profile default --name data-flow --output json > data-flow.json
```

# [Bicep](#tab/bicep)

Bicep is infrastructure as code and no export is required. Use the [Bicep file to create a data flow](https://github.com/Azure-Samples/explore-iot-operations/blob/main/samples/quickstarts/dataflow.bicep) to quickly set up and configure data flows.

# [Kubernetes (preview)](#tab/kubernetes)

```bash
kubectl get dataflow my-dataflow -o yaml > my-dataflow.yaml
```

---

## Proper data flow configuration

To ensure the data flow works as expected, verify the following conditions:

- The default MQTT data flow endpoint [must be used as either the source or destination](./howto-configure-dataflow-endpoint.md#data-flows-must-use-local-mqtt-broker-endpoint).
- The [data flow profile](./howto-configure-dataflow-profile.md) exists and is referenced in the data flow configuration.
- The source is either an MQTT endpoint, Kafka endpoint, or an asset. You can't use storage type endpoints as a source.
- When you use Event Grid as the source, you set the [dataflow profile instance count](./howto-configure-dataflow-profile.md#scaling) to 1 because Event Grid MQTT broker doesn't support shared subscriptions.
- When you use Event Hubs as the source, each event hub in the namespace is a separate Kafka topic and you must specify each as the data source.
- Transformation, if used, is configured with proper syntax, including proper [escaping of special characters](./concept-dataflow-mapping.md#escaping).
- When you use storage type endpoints as destination, a [schema is specified](#serialize-data-according-to-a-schema).
- When you use dynamic destination topics for MQTT endpoints, ensure that topic variables reference valid segments.

## Next steps

- [Map data by using data flows](concept-dataflow-mapping.md)
- [Convert data by using data flows](concept-dataflow-conversions.md)
- [Enrich data by using data flows](concept-dataflow-enrich.md)
- [Understand message schemas](concept-schema-registry.md)
- [Manage data flow profiles](howto-configure-dataflow-profile.md)

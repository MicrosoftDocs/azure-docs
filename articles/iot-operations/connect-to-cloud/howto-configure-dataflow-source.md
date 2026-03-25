---
title: Configure a data flow source
description: Configure source endpoints and data sources for data flows and data flow graphs in Azure IoT Operations.
author: sethmanheim
ms.author: sethm
ms.service: azure-iot-operations
ms.subservice: azure-data-flows
ms.topic: how-to
ms.date: 03/19/2026
ai-usage: ai-assisted

#CustomerIntent: As an operator, I want to configure the source for a data flow or data flow graph.
---

# Configure a data flow source in Azure IoT Operations

[!INCLUDE [kubernetes-management-preview-note](../includes/kubernetes-management-preview-note.md)]

The source is where data enters a data flow or data flow graph. You configure the source by specifying an endpoint reference and a list of data sources (topics) for that endpoint.

This page applies to both [data flows](overview-dataflow.md) and [data flow graphs](concept-dataflow-graphs.md). For data flows, the source is an operation in the `Dataflow` resource. For data flow graphs, the source is a `Source` node in the `DataflowGraph` resource.

> [!IMPORTANT]
> Data flows support MQTT and Kafka source endpoints. Data flow graphs support MQTT, Kafka, and OpenTelemetry source endpoints. Each data flow must have the Azure IoT Operations local MQTT broker default endpoint as either the source or destination. For more information, see [Data flows must use local MQTT broker endpoint](./howto-configure-dataflow-endpoint.md#data-flows-must-use-local-mqtt-broker-endpoint).

## Choose a source endpoint

You can use one of the following options as the source.

### Option 1: Use the default message broker endpoint

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

# [Bicep](#tab/bicep)

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

```yaml
sourceSettings:
  endpointRef: default
  dataSources:
    - thermostats/+/sensor/temperature/#
    - humidifiers/+/sensor/humidity/#
```

---

Because `dataSources` accepts MQTT or Kafka topics without modifying the endpoint configuration, you can reuse the endpoint for multiple data flows even if the topics are different. For more information, see [Configure data sources](#configure-data-sources-mqtt-or-kafka-topics).

### Option 2: Use an asset as a source

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

### Option 3: Use a custom MQTT or Kafka endpoint

If you created a custom MQTT or Kafka data flow endpoint (for example, to use with Event Grid or Event Hubs), you can use it as the source for the data flow. Remember that storage type endpoints, like Data Lake or Fabric OneLake, can't be used as a source.

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
```

---

## Configure data sources (MQTT or Kafka topics)

You can specify multiple MQTT or Kafka topics in a source without needing to modify the data flow endpoint configuration. This flexibility means you can reuse the same endpoint across multiple data flows, even if the topics vary. For more information, see [Reuse data flow endpoints](./howto-configure-dataflow-endpoint.md#reuse-endpoints).

### MQTT topics

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

### Shared subscriptions

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

You can explicitly create a topic named `$shared/mygroup/topic` in your configuration. However, adding the `$shared` topic explicitly isn't recommended because the `$shared` prefix is automatically added when needed. Data flows can make optimizations with the group name if it isn't set. For example, if `$shared` isn't set, data flows only have to operate over the topic name.

> [!IMPORTANT]
> Shared subscriptions are important for data flows when the instance count is greater than one and you're using Event Grid MQTT broker as a source, since it [doesn't support shared subscriptions](../../event-grid/mqtt-support.md#mqtt-v5-current-limitations). To avoid missing messages, set the data flow profile instance count to one when using Event Grid MQTT broker as the source. That is when the data flow is the subscriber and receiving messages from the cloud.

### Kafka topics

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
```

---

## Specify source schema

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

## Next steps

- [Configure a data flow destination](howto-configure-dataflow-destination.md)
- [Create a data flow](howto-create-dataflow.md)
- [Data flow graphs overview](concept-dataflow-graphs.md)

---
title: Connect to a Kafka source
description: Use a data flow and the connector for MQTT (preview) to ingest data from a Kafka-compatible source such as Azure Event Hubs, discover topics as assets, and route data through the MQTT broker in Azure IoT Operations.
author: dominicbetts
ms.author: dobett
ms.service: azure-iot-operations
ms.topic: how-to
ms.date: 02/23/2026

#CustomerIntent: As an industrial edge IT or operations user, I want to ingest data from an Azure Event Hubs namespace into Azure IoT Operations using the Kafka protocol so that I can manage event hubs as assets and route the data through the MQTT broker for processing.
---

# Connect to a Kafka source

Many messaging services expose a Kafka-compatible endpoint, including Azure Event Hubs, Confluent Cloud, and self-hosted Apache Kafka clusters. Azure IoT Operations doesn't include a dedicated southbound Kafka connector, but you can ingest data from any Kafka-compatible source by using a data flow and the connector for MQTT (preview). For simplicity, this article uses an Azure Event Hubs namespace as the Kafka source.

To connect to a Kafka source, you combine:

- A **data flow** with a Kafka inbound endpoint that connects to the Event Hubs namespace and routes messages to the internal MQTT broker. You can configure the data flow to use the Event Hubs topic name as the destination topic in the MQTT broker. This mapping lets you route messages from multiple event hubs to corresponding MQTT broker topics without a separate configuration for each one.

- The **connector for MQTT (preview)** configured with a device that uses discovery to find the MQTT broker topics that correspond to your event hubs. The connector creates assets for each discovered topic. You can then configure each asset to route data to your own named topics in the MQTT broker, and apply any individual data processing you need as the data flows out of the system.

The following diagram illustrates this architecture:

:::image type="content" source="media/howto-connect-kafka/kafka.svg" alt-text="Diagram that shows the architecture of the solution." lightbox="media/howto-connect-kafka/kafka.png":::

Messages enter from the Kafka source, such as an Azure Event Hubs namespace, and are ingested into Azure IoT Operations through a data flow with a Kafka source endpoint. The data flow routes messages to topics in the internal MQTT broker. The connector for MQTT (preview) detects the topics in the MQTT broker and lets you create assets based on the topic names. Each asset can be configured to route data to specific topics in the MQTT broker. You can then perform any routing and custom processing to the messages.


> [!TIP]
> To verify that data is flowing correctly at each stage, you can expose the MQTT broker outside the Kubernetes cluster and subscribe to topics using a standard MQTT client. This is useful for monitoring the messages that arrive from the Kafka source and confirming that assets are routing data to the expected topics. For more information, see [Test connectivity to MQTT broker with MQTT clients](../manage-mqtt-broker/howto-test-connection.md).

## Prerequisites

- A running instance of Azure IoT Operations with the MQTT broker enabled.
- An Azure Event Hubs namespace with one or more event hubs that contain the data you want to ingest. Event Hubs exposes a Kafka-compatible endpoint at `<namespace>.servicebus.windows.net:9093`. For more information, see [Use Azure Event Hubs from Apache Kafka applications](/azure/event-hubs/event-hubs-for-kafka-ecosystem-overview). This article uses a set of four event hubs called `factory-f1-robot-r1`, `warehouse-w1-machine-m1`, `warehouse-w1-machine-m2`, and `warehouse-w1-machine-m3` for the examples, but you can use any number of event hubs with your own naming convention.
- The user-assigned managed identity for your Azure IoT Operations instance must be assigned the **Azure Event Hubs Data Receiver** role on the Event Hubs namespace. For more information, see [Assign Azure roles using the Azure portal](/azure/role-based-access-control/role-assignments-portal).
- The [MQTT connector template](howto-use-mqtt-connector.md#deploy-the-connector-for-mqtt) configured for your Azure IoT Operations instance in the Azure portal. Contact your IT administrator to complete this step.

[!INCLUDE [iot-operations-entra-id-setup](../includes/iot-operations-entra-id-setup.md)]

## Step 1: Create the data flow endpoint

Before you create a data flow, you must create a **data flow endpoint** that holds the connection details for your Event Hubs namespace. The individual event hub names (Kafka topics) are specified later when you configure the data flow itself.

1. In the operations experience web UI, select **Data flow endpoints** in the left navigation pane. Under **Create new data flow endpoint**, select **Azure Event Hubs** > **New**.

1. Enter the following settings for the endpoint:

    | Setting | Example value | Description |
    |---------|---------------|-------------|
    | Name | `my-kafka-ep` | A name for the data flow endpoint. |
    | Host | `mykafkasource.servicebus.windows.net` | The hostname of the Event Hubs namespace. |
    | Port | `9093` | The port for the Kafka-compatible Event Hubs endpoint. |
    | Authentication method | User assigned managed identity | Use the user-assigned managed identity configured for Azure IoT Operations cloud connections. |

    :::image type="content" source="media/howto-connect-kafka/endpoint-settings.png" alt-text="Screenshot that shows the settings for an Azure Event Hubs data flow endpoint." lightbox="media/howto-connect-kafka/endpoint-settings.png":::

1. Select **Apply** to provision the endpoint.

## Step 2: Configure the Kafka data flow

Create a data flow that reads from your Event Hubs namespace using the Kafka protocol and routes the messages into the internal MQTT broker. By mirroring the event hub name to the MQTT destination topic, you avoid having to create a separate data flow for each event hub.

1. In the operations experience web UI, select **Data flows** in the left navigation pane. Then select **Create new**.

1. Enter a name for the data flow, such as `eventhubs-ingest`. Then select **Next**.

1. On the **Source** page, select **Kafka** as the source type. Select the data flow endpoint you created in the previous step, and use a regex wildcard topic that matches all four event hubs. For example:

    | Setting | Example value |
    |---------|---------------|
    | Endpoint | `my-kafka-ep` |
    | Topic | `^(warehouse-w1-.*\|factory-f1-.*)$` |
    | Consumer group | `aio-eventhubs-ingest` |

    The regex pattern `^(warehouse-w1-.*|factory-f1-.*)$` matches all event hubs whose names start with `warehouse-w1-` or `factory-f1-`, such as `factory-f1-robot-r1`, `warehouse-w1-machine-m1`, `warehouse-w1-machine-m2`, and `warehouse-w1-machine-m3`.

    :::image type="content" source="media/howto-connect-kafka/dataflow-source-kafka.png" alt-text="Screenshot that shows the Event Hubs Kafka source configuration for a dataflow." lightbox="media/howto-connect-kafka/dataflow-source-kafka.png":::

    Select **Next** to continue.

1. On the **Destination** page, select **MQTT broker** as the destination. Set the destination topic to `factory/${inputTopic}`. This expression uses the name of the source Kafka topic as the final segment of the MQTT topic path, so messages from each event hub land under the `factory/` prefix — for example, messages from `factory-f1-robot-r1` are routed to the `factory/factory-f1-robot-r1` topic.

    :::image type="content" source="media/howto-connect-kafka/dataflow-destination-mqtt.png" alt-text="Screenshot that shows the MQTT broker destination configuration with the source topic name option enabled." lightbox="media/howto-connect-kafka/dataflow-destination-mqtt.png":::

    Select **Next** to continue.

1. Optionally, configure any transformations or filters on the data.

1. On the **Summary** page, review the data flow configuration and select **Create** to create the data flow.

Once the data flow is running, messages from your Event Hubs topics appear in the MQTT broker under the `factory/` topic prefix.

## Step 3: Configure the connector for MQTT (preview) device

Set up a device in the connector for MQTT (preview) that subscribes to the MQTT broker topics where the Kafka data lands. Configure the device to use topic discovery so that each Kafka topic appears as an asset.

1. In the operations experience web UI, select **Devices** in the left navigation pane. Then select **Create new**.

1. Enter a name for the device, such as `kafka-incoming`. To add the inbound endpoint, select **New** on the **Microsoft.Mqtt** tile.

1. On the **Basic** page, set the URL to the internal MQTT broker address. The data flow routes incoming messages to topics under the `factory/` prefix, such as `factory/factory-f1-robot-r1` and `factory/warehouse-w1-machine-m1`. Enter `mqtt://aio-broker:1883` as the URL.

1. On the **Advanced** page, configure the topic settings to enable discovery:

    | Setting | Example value | Description |
    |---------|---------------|-------------|
    | Topic filter | `factory/+` | The single-level wildcard matches all topics under the `factory/` prefix, such as `factory/factory-f1-robot-r1` or `factory/warehouse-w1-machine-m1`. Each matching topic becomes a detected asset. |
    | Asset level | `2` | The level in the topic tree used as the asset name. For a topic such as `factory/factory-f1-robot-r1`, level `2` uses `factory-f1-robot-r1` as the asset name. |
    | Topic mapping prefix | `processed` | An optional prefix added to the topic path when forwarding data from the asset. |

    :::image type="content" source="media/howto-connect-kafka/device-endpoint-advanced.png" alt-text="Screenshot that shows the advanced settings for the MQTT connector device endpoint including topic filter and asset level." lightbox="media/howto-connect-kafka/device-endpoint-advanced.png":::

    Select **Apply** to save the endpoint.

1. On the **Device details** page, select **Next** to continue. Add any custom properties you want to associate with the device, then select **Next** again.

1. On the **Summary** page, review the device details and select **Create**.

## Step 4: Send test messages using Data Explorer

Before you can discover assets, messages must arrive at the MQTT broker so the connector for MQTT (preview) can detect the topics. You can use the **Data Explorer** feature built into each event hub in the Azure portal to send test messages.

1. In the [Azure portal](https://portal.azure.com), navigate to your Event Hubs namespace, then select the event hub you want to test, such as `warehouse-w1-machine-m1`.

1. In the left navigation pane for the event hub, select **Data Explorer (preview)**.

1. Select the **Send events** tab. Enter a test message payload in the **Message body** field. For example:

    ```json
    { "temperature": 22.5, "status": "running" }
    ```

    :::image type="content" source="media/howto-connect-kafka/data-explorer-send.png" alt-text="Screenshot that shows the Send events tab in Data Explorer with a sample message payload." lightbox="media/howto-connect-kafka/data-explorer-send.png":::

1. Select **Send** to publish the message to the event hub. Repeat this for each event hub you want to appear as a discovered asset.

## Step 5: Discover and create assets

When the data flow forwards Event Hubs messages to the MQTT broker, the connector for MQTT (preview) detects the topic paths and creates a _discovered_ asset_ for each one. You can then import each discovered asset to manage it individually.

1. In the operations experience web UI, select **Discovery** in the left navigation pane. Discovered assets from the Event Hubs topics appear in the list with the asset name derived from the topic path:

    :::image type="content" source="media/howto-connect-kafka/detected-assets.png" alt-text="Screenshot that shows the list of discovered assets from the Kafka topics." lightbox="media/howto-connect-kafka/detected-assets.png":::

    > [!TIP]
    > The name of the discovered asset is determined by the topic path and the asset level you set in the device endpoint configuration. The connector adds a random suffix to the asset name to ensure uniqueness.

1. Make a note of the full discovered asset name including the suffix. Select the discovered asset and then select **Import and create asset**.

1. On the **Asset details** page, the inbound endpoint is already selected from the device. Currently, you must use the name of the discovered asset as the asset name. Add a description, and any custom properties you want. Then select **Next**.

    > [!IMPORTANT]
    > Currently, the name of the asset you create must match the name of the discovered asset.

1. On the **Datasets** page, a dataset is automatically created from the discovered asset using the topic filter and asset name:

    :::image type="content" source="media/howto-connect-kafka/asset-dataset.png" alt-text="Screenshot that shows the dataset created automatically from the detected Kafka asset." lightbox="media/howto-connect-kafka/asset-dataset.png":::

    You can also add more datasets to capture messages from other related topics. Select **Next** to continue.

1. On the review page, select **Create** to create the asset. After a few minutes, the asset appears in the **Assets** list.

Repeat this process for each discovered asset that corresponds to a Kafka topic you want to manage.

## Step 6: Verify message routing

To verify that the asset is routing messages correctly, you can use an MQTT client to subscribe to the MQTT broker topic that corresponds to the asset. The topic path is determined by the topic mapping prefix you set in the device endpoint configuration, followed by the incoming topic name. For example, if your topic mapping prefix is `processed` and the incoming topic name is `factory/factory-f1-robot-r1`, the MQTT topic path would be `processed/factory/factory-f1-robot-r1`.

## Related content

- [Configure Azure Event Hubs and Kafka data flow endpoints](../connect-to-cloud/howto-configure-kafka-endpoint.md)
- [Use Azure Event Hubs from Apache Kafka applications](/azure/event-hubs/event-hubs-for-kafka-ecosystem-overview)
- [Configure the connector for MQTT (preview)](howto-use-mqtt-connector.md)

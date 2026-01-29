---
title: How to use the connector for MQTT (preview)
description: Use the operations experience web UI or the Azure CLI to configure assets and devices for connections to MQTT topics.
author: dominicbetts
ms.author: dobett
ms.service: azure-iot-operations
ms.topic: how-to
ms.date: 10/21/2025

#CustomerIntent: As an industrial edge IT or operations user, I want configure my Azure IoT Operations environment so that I can access data from MQTT topics.
---

# Configure the connector for MQTT (preview)

This preview version of the connector for MQTT connector lets you model external MQTT endpoints as assets in Azure IoT Operations. The MQTT connector can detect new topic paths as they appear, you can view the custom resources that represent the detected topics.

[!INCLUDE [iot-operations-asset-definition](../includes/iot-operations-asset-definition.md)]

[!INCLUDE [iot-operations-device-definition](../includes/iot-operations-device-definition.md)]

The following table summarizes the features the connector for MQTT (preview) supports:

| Feature | Supported | Notes |
|---------|:---------:|-------|
| Username/password authentication | Yes | Basic HTTP authentication |
| X.509 client certificates | No | |
| Anonymous access | Yes | For testing purposes |
| Certificate trust list | Yes | MQTTS for secure communications with the inbound endpoint |
| OpenTelemetry integration | Yes | |
| WASM data transformation | No | |
| Schema generation | Yes | Registers inferred schema with the schema registry |

The connector for MQTT:

1. Detects new topics that appear under a given topic path or MQTT wildcard path and communicates with Akri.
1. Akri creates the *detected asset* custom resource ready for OT approval and import into Azure Device Registry.
1. For approved or imported assets, the connector for MQTT subscribes to the topics and forwards the data to the unified namespace topics you specify.

This article explains how to use the connector for MQTT to perform tasks such as:

- Define the devices that connect MQTT sources to your Azure IoT Operations instance.
- Add assets, and define the data points to enable the data flow from the MQTT source to the MQTT broker.

## Prerequisites

[!INCLUDE [enable-resource-sync-rules](../includes/enable-resource-sync-rules.md)]

[!INCLUDE [iot-operations-entra-id-setup](../includes/iot-operations-entra-id-setup.md)]

Your IT administrator must configure the connector for MQTT template for your Azure IoT Operations instance in the Azure portal.

You need any credentials required to access the MQTT source. If the MQTT source requires authentication, you need to create a Kubernetes secret that contains the username and password for the MQTT source.

## Deploy the connector for MQTT

[!INCLUDE [deploy-connectors-simple](../includes/deploy-connectors-simple.md)]

### Configure a certificate trust list for the connector

[!INCLUDE [connector-certificate-application](../includes/connector-certificate-application.md)]

## Create a device

To configure the connector for MQTT, first create a device that defines the connection to the MQTT topic to subscribe from. The device includes the address of the MQTT topic and any credentials you need to access it:

1. In the operations experience web UI, select **Devices** in the left navigation pane. Then select **Create new**.

1. Enter a name for your device, such as `mqtt-connector`. To add the inbound endpoint for the connector for MQTT, select **New** on the **Microsoft.Mqtt** tile.

1. Add the URL of the inbound endpoint for the connector for MQTT and any authentication credentials on the **Basic** page:

    :::image type="content" source="media/howto-use-mqtt-connector/add-mqtt-connector-endpoint.png" alt-text="Screenshot that shows how to add a connector for MQTT endpoint." lightbox="media/howto-use-mqtt-connector/add-mqtt-connector-endpoint.png":::

    Add the topic details on the **Advanced** page:

    :::image type="content" source="media/howto-use-mqtt-connector/add-mqtt-connector-endpoint-subscription.png" alt-text="Screenshot that shows how to add a subscription to the connector for MQTT endpoint." lightbox="media/howto-use-mqtt-connector/add-mqtt-connector-endpoint-subscription.png":::

    The **Asset level** specifies the level in topic tree where the connector looks for the asset name.

    The **Topic filter** specifies how to filter for topics to subscribe to. The setting supports a single level wild card.

    The **Topic mapping prefix** maps the incoming topic to a unified namespace path.

    Select **Apply** to save the endpoint.

1. On the **Device details** page, select **Next** to continue.

1. On the **Add custom property** page, you can add any other properties you want to associate with the device. For example, you might add a property to indicate the manufacturer of the device. Then select **Next** to continue

1. On the **Summary** page, review the details of the device and select **Create** to create the asset.

1. After the device is created, you can view it in the **Devices** list:

    :::image type="content" source="media/howto-use-mqtt-connector/mqtt-connector-device-created.png" alt-text="Screenshot that shows the list of devices." lightbox="media/howto-use-mqtt-connector/mqtt-connector-device-created.png":::

### Configure a device to use a username and password

The previous example uses the `Anonymous` authentication mode. This mode doesn't require a username or password.

To use the `Username password` authentication mode:

[!INCLUDE [connector-username-password-portal](../includes/connector-username-password-portal.md)]

## Discover and create assets

When you send a message to a topic that matches the topic filter you specified when creating the device, the connector for MQTT detects the new topic and creates a _detected asset_ custom resource. For example, if you specified the topic filter as `A/B/+`, and you send a message to the topic `A/B/asset1`, the connector for MQTT detects the new topic and creates a _detected asset_ that you can view in the operations experience web UI:

:::image type="content" source="media/howto-use-mqtt-connector/detected-asset.png" alt-text="Screenshot that shows the list of detected assets." lightbox="media/howto-use-mqtt-connector/detected-asset.png":::

To create an asset from the detected asset, follow these steps:

1. In the operations experience, select the detected asset from the list and then select **Import and create asset**.

1. On the **Asset details** page, the inbound endpoint is already selected from the device. Use the name of the discovered asset as the name of the asset, add a description, and any custom properties you want to associate with the asset. Then select **Next** to continue.

    > [!IMPORTANT]
    > The name of the asset you create must match the name of the discovered asset.

1. On the **Datasets** page, there's a dataset that was created automatically from the detected asset using the topic filter and asset name:

    :::image type="content" source="media/howto-use-mqtt-connector/detected-asset-dataset.png" alt-text="Screenshot that shows the dataset created from the detected asset." lightbox="media/howto-use-mqtt-connector/detected-asset-dataset.png":::

    > [!TIP]
    > You can add more datasets if necessary to capture messages from other topics.

    Select **Next** to continue.

1. On the review page, review the details of the asset and select **Create** to create the asset. After a few minutes, the asset is listed on the **Assets** page:

    :::image type="content" source="media/howto-use-mqtt-connector/mqtt-asset-created.png" alt-text="Screenshot that shows the list of assets." lightbox="media/howto-use-mqtt-connector/mqtt-asset-created.png":::

In this example, the imported asset has a dataset definition with the following settings:

| Setting | Value |
|---------|-------|
| Dataset name | `A/B/asset1` |
| Data source | `A/B/asset1` |
| Destination topic | `X/Y/A/B/asset1` |

Now, any messages published to the topic `A/B/asset1` are copied to the unified namespace topic `X/Y/A/B/asset1` by the connector.



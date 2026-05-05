---
title: How to use the connector for MQTT
description: Use the operations experience web UI or the Azure CLI to configure assets and devices for connections to MQTT topics.
author: dominicbetts
ms.author: dobett
ms.service: azure-iot-operations
ms.topic: how-to
ms.date: 03/09/2026
ai-usage: ai-assisted

#CustomerIntent: As an industrial edge IT or operations user, I want configure my Azure IoT Operations environment so that I can access data from MQTT topics.
---

# Configure the connector for MQTT

By using the connector for MQTT, you can model MQTT endpoints as assets in Azure IoT Operations. These MQTT endpoints can be on external MQTT brokers or on the built-in MQTT broker in Azure IoT Operations. The MQTT connector detects new topic paths as they appear, and you can view the custom resources that represent the detected topics.

[!INCLUDE [iot-operations-asset-definition](../includes/iot-operations-asset-definition.md)]

[!INCLUDE [iot-operations-device-definition](../includes/iot-operations-device-definition.md)]

The following table summarizes the features that the connector for MQTT supports:

| Feature | Supported | Notes |
|---------|:---------:|-------|
| Username/password authentication | Yes | Basic HTTP authentication |
| X.509 user certificates | Yes | Certificates for client authentication and authorization |
| Anonymous access | Yes | For testing purposes |
| Southbound certificate trust list | Yes | MQTTS for secure communications with the inbound endpoint |
| OpenTelemetry integration | Yes | |
| WASM data transformation | Yes | Optionally transform incoming data using WebAssembly modules |
| Schema generation | Yes | Registers inferred schema with the schema registry |

The connector for MQTT:

1. Detects new topics that appear under a given topic path or MQTT wildcard path and communicates with Akri.
1. Akri creates the *discovered asset* custom resource ready for OT approval and import into Azure Device Registry.
1. For approved assets, the connector for MQTT subscribes to the topics and forwards the data to the unified namespace topics you specify.

> [!IMPORTANT]
> The connector for MQTT doesn't support adding new datasets to an imported asset, manually creating an asset, or changing the `dataSource` field value of a dataset.

This article explains how to use the connector for MQTT to perform tasks such as:

- Define the devices that connect MQTT endpoints to your Azure IoT Operations instance.
- Import discovered assets, and define the data points to enable the data flow from the MQTT source to the MQTT broker.
- Configure management actions that let you send commands to the MQTT source by publishing messages to MQTT topics.
- Configure data transformations by using WebAssembly (WASM) modules.

## Prerequisites

[!INCLUDE [enable-resource-sync-rules](../includes/enable-resource-sync-rules.md)]

[!INCLUDE [iot-operations-entra-id-setup](../includes/iot-operations-entra-id-setup.md)]

Your IT administrator must configure the connector for MQTT template for your Azure IoT Operations instance in the Azure portal.

You need credentials to access the MQTT source. If the MQTT source requires authentication, you need to create a Kubernetes secret that contains the username and password for the MQTT source.

## Deploy the connector for MQTT

[!INCLUDE [deploy-connectors-simple](../includes/deploy-connectors-simple.md)]

### Configure a certificate trust list for the connector

[!INCLUDE [connector-certificate-application](../includes/connector-certificate-application.md)]

## Create a device

To configure the connector for MQTT, first create a device that defines the connection to the MQTT topic to subscribe from. The device includes the address of the MQTT topic and any credentials you need to access it. You can configure the inbound endpoint to connect to an external MQTT broker or the built-in MQTT broker in Azure IoT Operations:

1. In the operations experience web UI, select **Devices** in the left navigation pane. Then select **Create new**.

1. Enter a name for your device, such as `mqtt-connector`. To add the inbound endpoint for the connector for MQTT, select **New** on the **Microsoft.Mqtt** tile.

    Choose the broker type based on your scenario:

    - **External MQTT broker**: Use this option when connecting to an MQTT broker other than the built-in MQTT broker on your Azure IoT Operations instance. You must supply the server URL in the specified format and any required authentication credentials.
    - **Built-in MQTT broker**: Use this option when you want to subscribe to topics on the built-in MQTT broker that's part of your Azure IoT Operations instance. This option is useful for bridging data between the built-in broker and other parts of the system by routing it through the asset model.

# [External MQTT broker](#tab/external)

To connect to an external MQTT broker:

1. Add an endpoint name, server URL, and any authentication credentials on the **Basic** page:

    :::image type="content" source="media/howto-use-mqtt-connector/add-mqtt-connector-endpoint.png" alt-text="Screenshot that shows how to add a connector for MQTT endpoint." lightbox="media/howto-use-mqtt-connector/add-mqtt-connector-endpoint.png":::

1. Optionally, configure the following settings for the external broker connection on the **Advanced** page:

    | Setting | Type | Default | Description |
    |---------|------|---------|-------------|
    | `keepAlive` | integer | 60 | The keep alive interval in seconds for the MQTT connection. |
    | `receiveMax` | integer | 65535 | The maximum number of in-flight QoS 1 and QoS 2 publishes that the client is willing to process concurrently. |
    | `receivePacketSizeMax` | integer | None | The maximum packet size in bytes that the client accepts. |
    | `sessionExpiry` | integer | 3600 | The expiry of the session in seconds. |
    | `connectionTimeout` | integer | 30 | The connection timeout in seconds for the MQTT connection. |

# [Built-in MQTT broker](#tab/built-in)

To connect to the built-in MQTT broker:

1. On the **Basic** page, add a name for the endpoint, `mqtt://aio-broker:18883` as the server URL, and **Anonymous** for the authentication credentials.

    > [!TIP]
    > The built-in MQTT broker configuration doesn't require authentication values and has a known URL. The values you enter are ignored.

1. On the **Advanced** page, enable the **Use built-in MQTT broker** setting. Ignore the advanced connection settings if you're using the built-in MQTT broker.
1. On the **Advanced** page, enable the **Use built in mqtt broker** setting. Ignore the external broker configuration settings if you're using the built-in MQTT broker.
---

To configure how the connector discovers assets from topics, add the topic details on the **Advanced** page:

:::image type="content" source="media/howto-use-mqtt-connector/add-mqtt-connector-endpoint-subscription.png" alt-text="Screenshot that shows how to add a subscription to the connector for MQTT endpoint." lightbox="media/howto-use-mqtt-connector/add-mqtt-connector-endpoint-subscription.png":::

- The **Topic filter** specifies which topics the connector subscribes to. The filter supports the single-level wildcard (`+`). The connector detects a new asset each time a message arrives on a topic that matches the filter at the wildcard position. For example, the filter `A/B/+` detects `A/B/asset1` and `A/B/asset2` as separate assets.

- The **Asset level** specifies the level in the topic tree where the connector looks for the asset name. If your topic filter uses a single-level wildcard (`+`), set **Asset level** to the position of the `+` in the topic path. For example, for the filter `A/B/+`, the wildcard is at level 3, so set **Asset level** to `3`.

  > [!IMPORTANT]
  > Configure the topic filter carefully before saving. After the device is created, you can't change the asset discovery configuration unless you delete and recreate the device. If the filter is misconfigured, no assets are discovered and no error is reported. Messages that don't match the filter are silently ignored.

- The **Topic mapping prefix** maps the incoming topic to a unified namespace path. For example, if the prefix is `X/Y` and the incoming topic is `A/B/asset1`, the connector forwards data to `X/Y/A/B/asset1`.

Select **Apply** to save the endpoint.

To finish creating the device, select **Next** on the **Device details** page to complete the remaining steps in the device creation workflow:

1. On the **Add custom property** page, add any other properties you want to associate with the device. For example, you might add a property to indicate the manufacturer of the device. Then select **Next** to continue.

1. On the **Summary** page, review the details of the device and select **Create** to create the asset.

1. After the device is created, you can view it in the **Devices** list:

    :::image type="content" source="media/howto-use-mqtt-connector/mqtt-connector-device-created.png" alt-text="Screenshot that shows the list of devices." lightbox="media/howto-use-mqtt-connector/mqtt-connector-device-created.png":::

### Configure a device to use a username and password

The previous example uses the `Anonymous` authentication mode. This mode doesn't require a username or password.

To use the `Username password` authentication mode, complete the following steps:

# [Operations experience](#tab/portal)

[!INCLUDE [connector-username-password-portal](../includes/connector-username-password-portal.md)]

# [Azure CLI](#tab/cli)

[!INCLUDE [connector-username-password-cli](../includes/connector-username-password-cli.md)]

# [Bicep](#tab/bicep)

[!INCLUDE [connector-username-password-bicep](../includes/connector-username-password-bicep.md)]

---

### Configure a device to use an X.509 certificate

[!INCLUDE [connector-certificate-user](../includes/connector-certificate-user.md)]

> [!NOTE]
> Currently, the connector doesn't support intermediate certificates when it connects to external MQTT brokers. 

## Discover and create assets

When you send a message to a topic that matches the topic filter on the asset discovery configuration for a device, the connector for MQTT detects the new topic and creates a _detected asset_ custom resource. For example, if you specify the topic filter as `A/B/+`, and you send a message to the topic `A/B/asset1`, the connector for MQTT detects the new topic and creates a _discovered asset_ that you can view in the operations experience web UI:

:::image type="content" source="media/howto-use-mqtt-connector/detected-asset.png" alt-text="Screenshot that shows the list of detected assets." lightbox="media/howto-use-mqtt-connector/detected-asset.png":::

To create an asset from the detected asset, follow these steps:

1. In the operations experience, select the detected asset from the list and then select **Import and create asset**.

1. On the **Asset details** page, the inbound endpoint is already selected from the device. Use the name of the discovered asset as the name of the asset, add a description, and any custom properties you want to associate with the asset. Then select **Next** to continue.

    > [!IMPORTANT]
    > The name of the asset you create must match the name of the discovered asset.

1. On the **Datasets** page, you see a dataset that the connector created automatically from the detected asset using the topic filter and asset name:

    :::image type="content" source="media/howto-use-mqtt-connector/detected-asset-dataset.png" alt-text="Screenshot that shows the dataset created from the detected asset." lightbox="media/howto-use-mqtt-connector/detected-asset-dataset.png":::

    Select **Next** to continue.

1. On the review page, review the details of the asset and select **Create** to create the asset. After a few minutes, the asset appears on the **Assets** page:

    :::image type="content" source="media/howto-use-mqtt-connector/mqtt-asset-created.png" alt-text="Screenshot that shows the list of assets." lightbox="media/howto-use-mqtt-connector/mqtt-asset-created.png":::

In this example, the imported asset has a dataset definition with the following settings:

| Setting | Value |
|---------|-------|
| Dataset name | `A/B/asset1` |
| Data source | `A/B/asset1` |
| Destination topic | `X/Y/A/B/asset1` |

Now, the connector copies any messages published to the topic `A/B/asset1` to the unified namespace topic `X/Y/A/B/asset1`.

## Add management groups and actions

A management group is a logical grouping of actions that you can invoke against an MQTT asset. An action lets you publish a message to a topic that a subscriber can act on. Actions must belong to a management group.

> [!NOTE]
> The operations experience doesn't automatically discover management groups and actions for the connector for MQTT. You must create them manually while or after you import the asset.

To add a management group and define actions for it:

1. In the operations experience, select the asset from the **Assets** list and select the **Management groups** tab.
1. Select **Add management group** and give it a name.
1. Within the management group, select **Add action** and configure the action:  
   - **Name**: A friendly name for the action.  
   - **Target URI**: The MQTT topic on your device endpoint to publish the action payload to. For example, `A/B/asset1/commands`.  
   - **Topic**: The MQTT topic to publish action execution request to.  
   - **Action type**: `Write` is the only supported action type for the connector for MQTT.  
   - **Time out**: The time-out value before the action execution request times out.

When you invoke the action, the connector publishes the action payload to the **Target URI** topic on the device's inbound endpoint. A downstream subscriber on that topic receives the message and can act on it.

For background on how management groups and actions work across connectors, see:
- [Enable and run management actions](howto-use-management-actions.md)
- [Control OPC UA servers](howto-control-opc-ua.md) — explains the action invocation pattern and the MQTT RPC protocol used to trigger actions.
- [Manage and control the camera](howto-use-onvif-connector.md#manage-and-control-the-camera) — shows how a similar pattern is used for the connector for ONVIF.

## Transform incoming data

[!INCLUDE [connector-transform-incoming-data](../includes/connector-transform-incoming-data.md)]

## Known issues

The following known issues apply to the connector for MQTT:

### Health status might not reflect actual connector state

To verify the connector is working, check whether discovered assets appear after publishing messages to the configured topic filter, rather than relying solely on the reported health status.

### Misconfigured asset discovery settings produce no diagnostic output

If the asset discovery configuration - topic filter, asset level, or topic mapping prefix - is invalid or inconsistent, the connector doesn't report an error. No discovered assets appear and no warning is surfaced in the UI or logs.

To diagnose a misconfiguration, verify that:
- The **Asset level** matches the position of the `+` wildcard in the **Topic filter**.
- Messages are being published to a topic that matches the topic filter.
- The connector pod logs don't show connection errors to the broker endpoint.

If you need to correct the configuration, delete and recreate the device.

### Asset name must exactly match the discovered asset name

When you create an asset from a discovered asset, the name you give the asset must exactly match the name of the discovered asset.

The discovered asset name prefix comes from the topic segment at the **Asset level** position. For example, if the topic filter is `A/B/+` and the **Asset level** is `3` on device `mqtt-device` with inbound endpoint `mqtt-endpoint`, a message published to `A/B/asset1` produces a discovered asset with name `asset1-mqtt-device-mqtt-endpoint`. You must use `asset1-mqtt-device-mqtt-endpoint` as the asset name when you import it. 
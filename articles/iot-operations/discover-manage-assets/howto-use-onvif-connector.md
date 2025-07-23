---
title: How to use the connector for ONVIF (preview)
description: Use the operations experience web UI to discover and configure assets and devices to use media streams from ONVIF compliant cameras.
author: dominicbetts
ms.author: dobett
ms.service: azure-iot-operations
ms.topic: how-to
ms.date: 07/23/2025

#CustomerIntent: As an industrial edge IT or operations user, I want configure my Azure IoT Operations environment so that I can disover and use media streams from an ONVIF compliant camera.
---

# Configure the connector for ONVIF (preview)

In Azure IoT Operations, the connector for ONVIF (preview) enables you to discover and use an ONVIF compliant camera that's connected to your Azure IoT Operations cluster.

[!INCLUDE [iot-operations-asset-definition](../includes/iot-operations-asset-definition.md)]

[!INCLUDE [iot-operations-device-definition](../includes/iot-operations-device-definition.md)]

This article describes how to use the operations experience web UI to:

- Add a device that has an ONVIF endpoint for a compliant camera.
- View the namespace assets and devices discovered at the ONVIF endpoint.
- Create a device that represents the media endpoints exposed by the ONVIF camera.
- Create an asset that captures snapshots from the media endpoint and publishes them to the MQTT broker.

## Prerequisites

To configure devices and assets, you need a running instance of Azure IoT Operations.

[!INCLUDE [iot-operations-entra-id-setup](../includes/iot-operations-entra-id-setup.md)]

An ONVIF compliant camera that you can reach from your Azure IoT Operations cluster.

## Deploy the connector for ONVIF

[!INCLUDE [deploy-preview-media-connectors](../includes/deploy-preview-media-connectors.md)]

> [!IMPORTANT]
> If you don't enable preview features, you see the following error message in the `aio-supervisor-...` pod logs when you try to use the media or ONVIF connectors: `No connector configuration present for AssetEndpointProfile: <AssetEndpointProfileName>`.

## Create a device with an ONVIF endpoint

To add a device that defines an ONVIF endpoint for a compliant camera, follow these steps:

1. In the operations experience web UI, select **Devices** from the left navigation pane:

    :::image type="content" source="media/howto-use-onvif-connector/list-devices.png" alt-text="Screenshot that shows the list of devices in the operations experience." lightbox="media/howto-use-onvif-connector/list-devices.png":::

1. Select **Create new**. On the **Device details** page, enter a name for the device such as `my-onvif-camera`. Then select **New** on the **Microsoft.Onvif** tile. Enter the details for you your ONVIF camera, such as:

    :::image type="content" source="media/howto-use-onvif-connector/add-onvif-endpoint.png" alt-text="Screenshot that shows how to add an ONVIF endpoint to a device." lightbox="media/howto-use-onvif-connector/add-onvif-endpoint.png":::

    Select **Apply** to add the endpoint to the device. The **Device details** page now shows the ONVIF endpoint.

1. On the **Device details** page, select **Next**.

1. On the **Add custom property** page, you can optionally update or add custom properties to the device. Select **Next** when you're done.

1. The **Summary** page shows the details of the device. Review the details, and then select **Create** to create the device. After a few minutes, the **Devices** page shows the new device.

    :::image type="content" source="media/howto-use-onvif-connector/device-created.png" alt-text="Screenshot that shows the device created in the operations experience." lightbox="media/howto-use-onvif-connector/device-created.png":::

## View the discovered assets and devices

After you create a device with an ONVIF endpoint, the connector for ONVIF automatically discovers the assets and devices that are available at the endpoint. To view the discovered assets and devices in the operations experience web UI, select **Discovery** from the left navigation pane:

:::image type="content" source="media/howto-use-onvif-connector/discovered-assets.png" alt-text="Screenshot that shows the list of discovered devices and assets in the operations experience." lightbox="media/howto-use-onvif-connector/discovered-assets.png":::

If you choose to **Import and create asset** from the discovered ONVIF asset, you can create an asset that represents the capabilities of the ONVIF compliant camera. For example, you can create an asset that captures events from the ONVIF camera or enables you to control the ONVIF camera.

## Create a device with media endpoints

To create a media device with media endpoints from the discovered device, follow these steps:

1. In the operations experience web UI, select **Discovery** from the left navigation pane. Then select **Discovered devices**.

1. Select the device that you created in the previous section, such as `my-onvif-camera`. Then select **Import and create device**.

1. The **Device details** page shows the discovered media endpoints. Enter a name for the device, such as `my-onvif-camera-media`, and select an **Authentication method** for each endpoint:

    :::image type="content" source="media/howto-use-onvif-connector/create-media-device.png" alt-text="Screenshot that shows how to create a media device from the discovered ONVIF device." lightbox="media/howto-use-onvif-connector/create-media-device.png":::

    > [!TIP]
    > You can remove an inbound endpoint that you don't want to use by selecting it and then selecting **Remove inbound endpoint**.

    Then select **Next**.

1. On the **Add custom property** page, you can optionally update, remove, or add custom properties to the device. Select **Next** when you're done.

1. On the **Summary** page, review the details of the device. Select **Create** to create the device. After a few minutes, the **Devices** page shows the new device.

    :::image type="content" source="media/howto-use-onvif-connector/media-device-created.png" alt-text="Screenshot that shows the media device created in the operations experience." lightbox="media/howto-use-onvif-connector/media-device-created.png":::

## Create a media asset to capture snapshots

You can now use the discovered media device to create an asset that captures snapshots from the camera and publishes them to the MQTT broker. To create the media asset, follow these steps:

1. In the operations experience web UI, select **Assets** from the left navigation pane. Then select **Create namespace asset**.

1. On the **Asset details page**, enter a name for the asset, such as `my-onvif-camera-media-asset`. Then select the discovered endpoint you want to use to capture snapshots.

    :::image type="content" source="media/howto-use-onvif-connector/create-media-asset.png" alt-text="Screenshot that shows how to create a media asset from the media device." lightbox="media/howto-use-onvif-connector/create-media-asset.png":::

    Update any custom properties for the media asset and then select **Next**.

1. On the **Streams** page, select **Add stream**. Use the following settings to configure the stream:

    - **Stream name**: `myassetvideo`
    - **Destination**: `MQTT`
    - **Topic**: `myassetvideo`
    - **Task type**
    - **Stream type**: `snapshot-to-mqtt`

    Leave the other settings as default. Then select **Add**. The stream is added to the asset configuration:

    :::image type="content" source="media/howto-use-onvif-connector/add-stream-to-asset.png" alt-text="Screenshot that shows how to add a stream to the media asset." lightbox="media/howto-use-onvif-connector/add-stream-to-asset.png":::

1. Select **Next** to go to the **Summary** page. Review the details of the asset, and then select **Create** to create the asset. After a few minutes, the **Assets** page shows the new asset.

    :::image type="content" source="media/howto-use-onvif-connector/media-asset-created.png" alt-text="Screenshot that shows the media asset created in the operations experience." lightbox="media/howto-use-onvif-connector/media-asset-created.png":::

The media asset is now configured to capture snapshots from the ONVIF compliant camera and publish them to the MQTT broker.

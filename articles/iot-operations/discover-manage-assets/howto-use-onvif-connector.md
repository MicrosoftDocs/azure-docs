---
title: How to use the connector for ONVIF (preview)
description: Use the operations experience web UI to discover and configure assets and devices to use media streams from ONVIF compliant cameras.
author: dominicbetts
ms.author: dobett
ms.service: azure-iot-operations
ms.topic: how-to
ms.date: 07/23/2025

#CustomerIntent: As an industrial edge IT or operations user, I want configure my Azure IoT Operations environment so that I can discover and use media streams from an ONVIF compliant camera.
---

# Configure the connector for ONVIF (preview)

In Azure IoT Operations, the connector for ONVIF (preview) enables you to discover and use an ONVIF compliant camera that's connected to your Azure IoT Operations cluster.

[!INCLUDE [iot-operations-asset-definition](../includes/iot-operations-asset-definition.md)]

[!INCLUDE [iot-operations-device-definition](../includes/iot-operations-device-definition.md)]

The connector for ONVIF (preview) for Azure IoT Operations discovers [ONVIF conformant](https://www.onvif.org/profiles-add-ons-specifications/) cameras connected to your Azure IoT Operations instance and registers them in the Azure Device Registry. After the camera is registered, examples of management operations include:

- Retrieving and updating the configuration of the camera to adjust the output image configuration.
- Controlling the camera pan, tilt, and zoom (PTZ).

The [media connector](howto-use-media-connector.md) can access the media sources exposed by these cameras.

Together, the media connector, connector for ONVIF, Azure IoT Operations, and companion services enable you to use Azure IoT Operations to implement use cases such as:

- Wait and dwell time tracking to track the time spent in line by customers.
- Order accuracy to track that the correct orders are packed by comparing items to POS receipt.
- Defect detection and quality assurance by cameras to detect any defects in products on the assembly line.
- Safety monitoring such as collision detection, safety zone detection, and personal safety equipment detection.

This article describes how to use the operations experience web UI to:

- Add a device that has an ONVIF endpoint for a compliant camera.
- View the namespace assets and devices discovered at the ONVIF endpoint.
- Create a device that represents the media endpoints exposed by the ONVIF camera.
- Create an asset that captures snapshots from the media endpoint and publishes them to the MQTT broker.

## Prerequisites

To configure devices and assets, you need a running instance of Azure IoT Operations.

[!INCLUDE [iot-operations-entra-id-setup](../includes/iot-operations-entra-id-setup.md)]

An ONVIF compliant camera that you can reach from your Azure IoT Operations cluster.

## Manage and control cameras

The connector for ONVIF enables you to:

- Read camera information and capabilities.
- Discover the media URIs exposed by the ONVIF camera.
- Configure ONVIF devices, for example by updating setting or selecting presets.
- Control the camera hardware by using PTZ commands.

## ONVIF compliance

ONVIF has several categories for compliance, such as discovery, device, media, imaging, analytics, events, and pan-tilt-zoom (PTZ) services. To learn more, see [ONVIF - Profiles, Add-ons, and Specifications](https://www.onvif.org/profiles-add-ons-specifications/).

The connector for ONVIF in Azure IoT Operations focuses on support for camera devices that implement the following profiles:

- [Profile S for basic video streaming](https://www.onvif.org/profiles/profile-s/)
- [Profile T for advanced video streaming](https://www.onvif.org/profiles/profile-t/)

The connector enables support for the following capabilities:

- Discovery of device information and capabilities.
- Monitoring events from devices.
- Discovery of the media URIs exposed by a device. The connector for ONVIF makes these URIs available to the media connector.
- Imaging control such as filters and receiving  motion and tampering events.
- Controlling device PTZ.

## Deploy the connector for ONVIF

[!INCLUDE [deploy-preview-media-connectors-simple](../includes/deploy-preview-media-connectors-simple.md)]

## Create a device with an ONVIF endpoint

To add a device that includes an ONVIF endpoint for a compliant camera:

# [Operations experience](#tab/portal)

1. In the operations experience web UI, select **Devices** from the left navigation pane:

    :::image type="content" source="media/howto-use-onvif-connector/list-devices.png" alt-text="Screenshot that shows the list of devices in the operations experience." lightbox="media/howto-use-onvif-connector/list-devices.png":::

1. Select **Create new**. On the **Device details** page, enter a name for the device such as `my-onvif-camera`. Then select **New** on the **Microsoft.Onvif** tile. Enter the details for your ONVIF camera, such as:

    :::image type="content" source="media/howto-use-onvif-connector/add-onvif-endpoint.png" alt-text="Screenshot that shows how to add an ONVIF endpoint to a device." lightbox="media/howto-use-onvif-connector/add-onvif-endpoint.png":::

    Select **Apply** to add the endpoint to the device. The **Device details** page now shows the ONVIF endpoint.

1. On the **Device details** page, select **Next**.

1. On the **Add custom property** page, you can optionally update or add custom properties to the device. Select **Next** when you're done.

1. The **Summary** page shows the details of the device. Review the details, and then select **Create** to create the device. After a few minutes, the **Devices** page shows the new device.

    :::image type="content" source="media/howto-use-onvif-connector/device-created.png" alt-text="Screenshot that shows the device created in the operations experience." lightbox="media/howto-use-onvif-connector/device-created.png":::

# [Azure CLI](#tab/cli)

Run the following commands:

```azurecli
az iot ops ns device create -n onvif-connector-cli -g {your resource group name} --instance {your instance name}

az iot ops ns device endpoint inbound add onvif --device onvif-connector-cli -g {your resource group name} -i {your instance name}  --name onvif-connector-cli-0 --endpoint-address http://myonvifcam:2020/onvif/device_service
```

To learn more, see [az iot ops ns device](/cli/azure/iot/ops/ns/device).

---

## View the discovered assets and devices

After you create a device with an ONVIF endpoint, the connector for ONVIF automatically discovers the assets and devices that are available at the endpoint. To view the discovered assets and devices in the operations experience web UI, select **Discovery** from the left navigation pane:

:::image type="content" source="media/howto-use-onvif-connector/discovered-assets.png" alt-text="Screenshot that shows the list of discovered devices and assets in the operations experience." lightbox="media/howto-use-onvif-connector/discovered-assets.png":::

If you choose to **Import and create asset** from the discovered ONVIF asset, you can create an asset that represents the capabilities of the ONVIF compliant camera. For example, you can create an asset that captures events from the ONVIF camera or enables you to control the ONVIF camera.

## Create a device with media endpoints

To create a device with media endpoints from the discovered device, follow these steps:

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

## Create an ONVIF asset for event management and control

ONVIF compliant cameras can generate events such as motion detection and respond to control commands such as pan, tilt, and zoom. You can create an ONVIF asset from the discovered ONVIF device that captures these events and enables you to control the camera.

After you add an ONVIF device in the operations experience, a discovered ONVIF asset is created automatically:

:::image type="content" source="media/howto-use-onvif-connector/discovered-onvif-asset.png" alt-text="Screenshot that shows the ONVIF asset discovered from the ONVIF device." lightbox="media/howto-use-onvif-connector/discovered-onvif-asset.png":::

To create an ONVIF asset for event management and control:

1. Select the discovered asset and then select **Import and create asset**.

1. On the **Asset details** page, enter a name and description for the asset. The device inbound endpoint is already selected for you.

    :::image type="content" source="media/howto-use-onvif-connector/discovered-onvif-asset-detail.png" alt-text="Screenshot that shows the detailed ONVIF asset discovered from the ONVIF device." lightbox="media/howto-use-onvif-connector/discovered-onvif-asset-detail.png":::

1. On the **Events** page, select **Manage event groups** to choose the types of event to capture from the camera. You can choose from event groups such as motion detection and camera tampering:

    :::image type="content" source="media/howto-use-onvif-connector/manage-event-groups.png" alt-text="Screenshot that shows the manage event groups page for the ONVIF asset." lightbox="media/howto-use-onvif-connector/manage-event-groups.png":::

1. For each event group you keep, configure the MQTT topic it publishes to:

    :::image type="content" source="media/howto-use-onvif-connector/event-group-detail.png" alt-text="Screenshot that shows how to configure an event group." lightbox="media/howto-use-onvif-connector/event-group-detail.png":::

1. On the **Actions** page, select **Manage management groups** to choose the actions, such as pan, tilt, and zoom, that you want to use to control the ONVIF camera.

    :::image type="content" source="media/howto-use-onvif-connector/manage-management-groups.png" alt-text="Screenshot that shows the manage management groups page for the ONVIF asset." lightbox="media/howto-use-onvif-connector/manage-management-groups.png":::

1. For each management group you keep, configure the MQTT topic it subscribes to:

     :::image type="content" source="media/howto-use-onvif-connector/management-group-detail.png" alt-text="Screenshot that shows how to configure a management group." lightbox="media/howto-use-onvif-connector/management-group-detail.png":::

1. Review the summary of the ONVIF asset configuration and then select **Create** to create the asset. After a few minutes, the **Assets** page shows the new asset.

## Manage and control the camera

To interact with the ONVIF camera, you can publish MQTT messages that the connector for ONVIF subscribes to. The message format is based on the [ONVIF network interface specifications](https://www.onvif.org/profiles/specifications/).

The [Azure IoT Operations connector for ONVIF PTZ Demo](https://github.com/Azure-Samples/explore-iot-operations/tree/main/samples/aio-onvif-connector-ptz-demo) sample application shows how to use the connector for ONVIF to:

- Use the media asset definition to retrieve a profile token from the camera's media service.
- Use the profile token when you use the camera's PTZ capabilities control its position and orientation.

The sample application uses the Azure IoT Operations MQTT broker to send commands to interact with the connector for ONVIF. To learn more, see [Publish and subscribe MQTT messages using MQTT broker](../manage-mqtt-broker/overview-broker.md).

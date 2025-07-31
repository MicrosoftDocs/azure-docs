---
title: How to use the media connector (preview)
description: Use the operations experience web UI to configure assets and devices for connections to media sources.
author: dominicbetts
ms.author: dobett
ms.service: azure-iot-operations
ms.topic: how-to
ms.date: 07/23/2025

#CustomerIntent: As an industrial edge IT or operations user, I want configure my Azure IoT Operations environment so that I can access snapshots and videos from a media source such as a IP video camera.
---

# Configure the media connector (preview)

In Azure IoT Operations, the media connector (preview) enables access to media from media sources such as edge-attached cameras.

[!INCLUDE [iot-operations-asset-definition](../includes/iot-operations-asset-definition.md)]

[!INCLUDE [iot-operations-device-definition](../includes/iot-operations-device-definition.md)]

This article explains how to use the media connector to perform tasks such as:

- Define the devices that connect media sources to your Azure IoT Operations instance.
- Add assets, and define their streams for capturing media from the media source.
- Send an image snapshot to the MQTT broker.
- Save a video stream to a local file system.

## Prerequisites

To configure devices and assets, you need a running instance of Azure IoT Operations.

[!INCLUDE [iot-operations-entra-id-setup](../includes/iot-operations-entra-id-setup.md)]

A camera connected to your network and accessible from your Azure IoT Operations cluster. The camera must support the Real Time Streaming Protocol for video streaming. You also need the camera's username and password to authenticate with it.

## Deploy the media connector

[!INCLUDE [deploy-preview-media-connectors](../includes/deploy-preview-media-connectors.md)]

> [!IMPORTANT]
> If you don't enable preview features, you see the following error message in the `aio-supervisor-...` pod logs when you try to use the media or ONVIF connectors: `No connector configuration present for AssetEndpointProfile: <AssetEndpointProfileName>`.

## Create a device

To configure the media connector, first create a device that defines the connection to the media source. The device includes the URL of the media source and any credentials you need to access the media source:

1. In the operations experience web UI, select **Devices** in the left navigation pane. Then select **Create new**.

1. Enter a name for your device, such as `media-connector`. To add the endpoint for the media connector, select **New** on the **Microsoft.Media** tile.

1. Add the details of the endpoint for the media connector including any authentication credentials:

    :::image type="content" source="media/howto-use-media-connector/add-media-connector-endpoint.png" alt-text="Screenshot that shows how to add a media connector endpoint." lightbox="media/howto-use-media-connector/add-media-connector-endpoint.png":::

    Select **Apply** to save the endpoint.

1. On the **Device details** page, select **Next** to continue.

1. On the **Add custom property** page, you can add any other properties you want to associate with the device. For example, you might add a property to indicate the manufacturer of the camera. Then select **Next** to continue

1. On the **Summary** page, review the details of the device and select **Create** to create the asset.

1. After the device is created, you can view it in the **Devices** list:

    :::image type="content" source="media/howto-use-media-connector/media-connector-device-created.png" alt-text="Screenshot that shows the list of devices." lightbox="media/howto-use-media-connector/media-connector-device-created.png":::

## Create an asset to publish an image snapshot

To define a namespace asset that publishes an image snapshot from the media source, follow these steps:

1. In the operations experience web UI, select **Assets** in the left navigation pane. Then select **Create namespace asset**.

1. Select the inbound endpoint for the media connector that you created in the previous section.

1. Enter a name for your asset, such as `my-media-source`.

1. Add any custom properties you want to associate with the asset. For example, you might add a property to indicate the manufacturer of the camera. Select **Next** to continue.

1. On the **Streams** page, select **Add stream** to add a stream for the asset.

1. Add a name for the stream, such as `mysnapshots`. Set MQTT as the destination and add a name for the MQTT topic to publish to such as `mysnapshots`. Select `mqtt-to-snapshot` as the task type.

    :::image type="content" source="media/howto-use-media-connector/add-snapshot-stream.png" alt-text="Screenshot that shows how to add a snapshot stream." lightbox="media/howto-use-media-connector/add-snapshot-stream.png":::

    Select **Add** to save the stream.

1. On the **Streams** page, select **Next** to continue.

1. On the **Review** page, review the details of the asset and select **Create** to create the asset.

## Add a stream to save a video clip

In this section, you add a stream to the asset that saves video clips from the media source to the file system.

1. In the operations experience web UI, select **Assets** in the left navigation pane. Then select the `my-media-source` asset you created in the previous section.

1. Select **Streams** and then select **Add stream** to add a stream to the asset.

1. Add a name for the stream, such as `myclips`. Set **Storage**** as the destination and add a path such as `myclips` to use to save the clips. Select `clip-to-fs` as the task type.

    :::image type="content" source="media/howto-use-media-connector/add-clip-stream.png" alt-text="Screenshot that shows how to add a clip stream." lightbox="media/howto-use-media-connector/add-clip-stream.png":::

    Select **Add** to save the stream.

1. The new stream is listed in the asset's **Streams** page:

    :::image type="content" source="media/howto-use-media-connector/media-connector-streams.png" alt-text="Screenshot that shows the list of streams for the media connector asset." lightbox="media/howto-use-media-connector/media-connector-streams.png":::

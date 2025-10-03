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
- Save a video clip to Azure storage.

## Prerequisites

To configure devices and assets, you need a running preview instance of Azure IoT Operations.

[!INCLUDE [iot-operations-entra-id-setup](../includes/iot-operations-entra-id-setup.md)]

A camera connected to your network and accessible from your Azure IoT Operations cluster. The camera must support the Real Time Streaming Protocol for video streaming. You also need the camera's username and password to authenticate with it.

## Media source types

The media connector can connect to various sources, including:

| Media source | Example URLs | Notes |
|--------------| ---------------|-------|
| Edge attached camera | `file://host/dev/video0`<br/>`file://host/dev/usb0` | No authentication required. The URL refers to the device file. Connects to a node using USB, FireWire, MIPI, or proprietary interface. |
| IP camera | `rtsp://192.168.178.45:554/stream1` | JPEG over HTTP for snapshots, RTSP/RTCP/RTP/MJPEG-TS for video streams. An IP camera might also expose a standard ONVIF control interface. |
| Media server | `rtsp://192.168.178.45:554/stream1` | JPEG over HTTP for snapshots, RTSP/RTCP/RTP/MJPEG-TS for video streams. A media server can also serve images and videos using URLs such as `ftp://host/path` or `smb://host/path` |
| Media file | `http://camera1/snapshot/profile1`<br/>`nfs://server/path/file.extension`<br/>` file://localhost/media/path/file.mkv`  | Any media file with a URL accessible from the cluster. |
| Media folder | `file://host/path/to/folder/`<br/>`ftp://server/path/to/folder/` | A folder, accessible from the cluster, that contains media files such as snapshots or clips. |

## Task types

The media connector supports the following task types:

| Task type | Description |
|-----------|-------------|
| snapshot-to-mqtt | Captures a snapshot from a media source and publishes it to an MQTT topic. |
| clip-to-fs | Saves a video clip from a media source to the file system. |
| snapshot-to-fs | Saves a snapshot from a media source to the file system. |
| stream-to-rtsp | Proxies a live video stream from a media source to an RTSP endpoint. |
| stream-to-rtsps | Proxies a live video stream from a media source to an RTSPs endpoint. |

## Example uses

Example uses of the media connector include:

- Capture snapshots from a video stream or from an image URL and publish them to an MQTT topic. A subscriber to the MQTT topic can use the captured images for further processing or analysis.

- Save video streams to a local file system on your cluster. Use [Azure Container Storage enabled by Azure Arc](/azure/azure-arc/container-storage/overview) to provide a reliable and fault-tolerant solution for uploading the captured video to the cloud for storage or processing.

- Proxy a live video stream from a camera to an endpoint that an operator can access. For security and performance reasons, only the media connector should have direct access to an edge camera. The media connector uses a separate media server component to stream video to an operator's endpoint. This media server can transcode to various protocols such as RTSP, RTCP, SRT, and HLS. You need to deploy your own media server to provide these capabilities.

## Deploy the media connector

[!INCLUDE [deploy-preview-media-connectors](../includes/deploy-preview-media-connectors.md)]

## Create a device with a media endpoint

To configure the media connector, first create a device that defines the connection to the media source. The device includes the URL of the media source and any credentials you need to access the media source:

# [Operations experience](#tab/portal)

1. In the operations experience web UI, select **Devices** in the left navigation pane. Then select **Create new**.

1. Enter a name for your device, such as `media-connector`. To add the endpoint for the media connector, select **New** on the **Microsoft.Media** tile.

1. Add the details of the endpoint for the media connector including any authentication credentials:

    :::image type="content" source="media/howto-use-media-connector/add-media-connector-endpoint.png" alt-text="Screenshot that shows how to add a media connector endpoint." lightbox="media/howto-use-media-connector/add-media-connector-endpoint.png":::

    To learn how to configure **Username password** authentication, see [Manage secrets for your Azure IoT Operations deployment](../secure-iot-ops/howto-manage-secrets.md).

    Select **Apply** to save the endpoint.

1. On the **Device details** page, select **Next** to continue.

1. On the **Add custom property** page, you can add any other properties you want to associate with the device. For example, you might add a property to indicate the manufacturer of the camera. Then select **Next** to continue

1. On the **Summary** page, review the details of the device and select **Create** to create the asset.

1. After the device is created, you can view it in the **Devices** list:

    :::image type="content" source="media/howto-use-media-connector/media-connector-device-created.png" alt-text="Screenshot that shows the list of devices." lightbox="media/howto-use-media-connector/media-connector-device-created.png":::

# [Azure CLI](#tab/cli)

Run the following commands:

```azurecli
az iot ops ns device create -n media-connector-cli -g {your resource group name} --instance {your instance name} 

az iot ops ns device endpoint inbound add media --device media-connector-cli -g {your resource group name} -i {your instance name}  --name media-connector-cli-0 --endpoint-address rtsp://samplecamera:554/stream1
```

To learn more, see [az iot ops ns device](/cli/azure/iot/ops/ns/device).

---

## Create an asset to publish an image snapshot

To define a namespace asset that publishes an image snapshot from the media source to the MQTT broker:

# [Operations experience](#tab/portal)

1. In the operations experience web UI, select **Assets** in the left navigation pane. Then select **Create namespace asset**.

1. Select the inbound endpoint for the media connector that you created in the previous section.

1. Enter a name for your asset, such as `my-media-source`.

1. Add any custom properties you want to associate with the asset. For example, you might add a property to indicate the manufacturer of the camera. Select **Next** to continue.

1. On the **Streams** page, select **Add stream** to add a stream for the asset.

1. Add a name for the stream, such as `mysnapshots`. Set MQTT as the destination and add a name for the MQTT topic to publish to such as `azure-iot-operations/data/snapshots`. Select `snapshot-to-mqtt` as the task type.

    > [!IMPORTANT]
    > Currently, the media connector always publishes to a topic called `azure-iot-operations/data/<asset name>/<stream name>`.

    :::image type="content" source="media/howto-use-media-connector/add-snapshot-stream.png" alt-text="Screenshot that shows how to add a snapshot stream that publishes to an MQTT topic." lightbox="media/howto-use-media-connector/add-snapshot-stream.png":::

    Select **Add** to save the stream.

1. On the **Streams** page, select **Next** to continue.

1. On the **Review** page, review the details of the asset and select **Create** to create the asset.

# [Azure CLI](#tab/cli)

Run the following command:

```azurecli
az iot ops ns asset media create --name mymediaasset --instance {your instance name}  -g {your resource group name} --device media-connector-cli --endpoint media-connector-cli-0 --task-type snapshot-to-mqtt --task-format jpeg --snapshots-per-sec 0.25 --stream-dest topic="azure-iot-operations/data/snapshots" qos=Qos1 retain=Never ttl=60
```

To learn more, see [az iot ops ns asset rest](/cli/azure/iot/ops/ns/asset/rest).

---

### Verify the published messages

To verify that the connector is publishing messages, you can use an MQTT client to subscribe to the topic `azure-iot-operations/data/{asset name}/{stream name}`. If the device and namespace asset are configured correctly, you receive messages containing JPEG image snapshots when you subscribe to this topic.

The following steps show you how to run the **mosquitto_sub** tool in the cluster. To learn more about this tool and alternative approaches, see [MQTT tools](../troubleshoot/tips-tools.md#mqtt-tools):

[!INCLUDE [deploy-mqttui](../includes/deploy-mqttui.md)]

To save the payload of a single message, use a command like the following:

```bash
mosquitto_sub --host aio-broker --port 18883 --topic "azure-iot-operations/data/my-camera/#" -C 1 -F %p --cafile /var/run/certs/
ca.crt -D CONNECT authentication-method 'K8S-SAT' -D CONNECT authentication-data $(cat /var/run/secrets/tokens/broker-sat) > image1.
jpeg
```

The following screenshot shows the topic name that uses the asset name and stream name:

:::image type="content" source="media/howto-use-media-connector/snapshot-topic.png" alt-text="A screenshot that shows the published data in a topic called `azure-iot-operations/data/{asset name}/{stream name}`.":::

## Add a stream to save a video clip

In this section, you add a stream to the asset that saves video clips from the media source to the file system.

# [Operations experience](#tab/portal)

1. In the operations experience web UI, select **Assets** in the left navigation pane. Then select the `my-media-source` asset you created in the previous section.

1. Select **Streams** and then select **Add stream** to add a stream to the asset.

1. Add a name for the stream, such as `myclips`. Set **Storage**** as the destination and add a path such as `myclips` to use to save the clips. Select `clip-to-fs` as the task type.

    :::image type="content" source="media/howto-use-media-connector/add-clip-stream.png" alt-text="Screenshot that shows how to add a clip stream." lightbox="media/howto-use-media-connector/add-clip-stream.png":::

    Select **Add** to save the stream.

1. The new stream is listed in the asset's **Streams** page:

    :::image type="content" source="media/howto-use-media-connector/media-connector-streams.png" alt-text="Screenshot that shows the list of streams for the media connector asset." lightbox="media/howto-use-media-connector/media-connector-streams.png":::

# [Azure CLI](#tab/cli)

Run the following command:

```azurecli
az iot ops ns asset media stream add --asset mymediaasset --instance {your instance name}  -g {your resource group name} --name clipStream --task-type clip-to-fs --format mp4 --duration 30 --path /data/clips
```

---

### Verify the saved messages

The following steps assume that you configured a persistent volume claim (PVC) to save the clips to your Azure Blob storage account with these settings:

| Setting | Value |
| ------- | ----- |
| Storage container | `pvc` |
| Edge sub volume path | `exampleSubDir` |
| Connector template mount path | `/data` |
| Stream path in operations experience | `/data/exampleSubDir/clips` |

After the connector captures the clips, it uploads them to the `/pvc/clips` folder in your container:

:::image type="content" source="media/howto-use-media-connector/captured-streams.png" alt-text="Screenshot that shows the captured streams in Blob storage.":::

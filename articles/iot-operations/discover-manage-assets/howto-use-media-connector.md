---
title: How to use the media connector
description: Use the operations experience web UI to configure assets and devices for connections to media sources.
author: dominicbetts
ms.author: dobett
ms.service: azure-iot-operations
ms.topic: how-to
ms.date: 12/10/2025

#CustomerIntent: As an industrial edge IT or operations user, I want configure my Azure IoT Operations environment so that I can access snapshots and videos from a media source such as a IP video camera.
---

# Configure the media connector

In Azure IoT Operations, the media connector enables access to media from media sources such as cameras.

[!INCLUDE [iot-operations-asset-definition](../includes/iot-operations-asset-definition.md)]

[!INCLUDE [iot-operations-device-definition](../includes/iot-operations-device-definition.md)]

The following table summarizes the features the media connector supports:

| Feature | Supported | Notes |
|---------|:---------:|-------|
| Username/password authentication | Yes | Basic HTTP authentication |
| X.509 client certificates | No | |
| Anonymous access | Yes | For testing purposes |
| Certificate trust list | Yes | For secure TLS connections to to media sources |
| OpenTelemetry integration | Yes | |
| Northbound username/password authentication | Yes | For RTSP and RTSPS endpoints |
| Northbound anonymous access | Yes | For RTSP and RTSPS endpoints |
| Northbound certificate trust list | Yes | For secure connections to RTSPS endpoints only |
| Snapshot to MQTT | Yes | Publish image snapshots to MQTT topics |
| Clip to file system | Yes | Save video clips to local storage |
| Snapshot to file system | Yes | Save image snapshots to local storage |
| Stream to RTSP/RTSPS | Yes | Proxy live video streams to an RTSP or RTSPS endpoint |

For each configured stream, the connector for media:

1. Opens a connection to the stream from the media source.
1. Generates clips, captures snapshots, or proxies the stream as specified in the stream configuration.
1. Sends the media to the specified destination.

This article explains how to use the media connector to perform tasks such as:

- Define the devices that connect media sources to your Azure IoT Operations instance.
- Add assets, and define their streams for capturing media from the media source.
- Send an image snapshot to the MQTT broker.
- Save a video clip to Azure storage.

## Prerequisites

To configure devices and assets, you need a running instance of Azure IoT Operations.

[!INCLUDE [iot-operations-entra-id-setup](../includes/iot-operations-entra-id-setup.md)]

A camera connected to your network and accessible from your Azure IoT Operations cluster. The camera must support the Real Time Streaming Protocol for video streaming. You also need the camera's username and password to authenticate with it.

## Media source types

The media connector can connect to various sources, including:

| Media source | Example URLs | Notes |
|--------------| ---------------|-------|
| IP camera | `rtsp://192.168.178.45:554/stream1` | JPEG over HTTP for snapshots, RTSP/RTCP/RTP/MJPEG-TS for video streams. An IP camera might also expose a standard ONVIF control interface. |
| Media server | `rtsp://192.168.178.45:554/stream1` | JPEG over HTTP for snapshots, RTSP/RTCP/RTP/MJPEG-TS for video streams. A media server can also serve images and videos using URLs such as `ftp://host/path` or `smb://host/path` |

## Task types

The media connector supports the following task types:

| Task type | Description |
|-----------|-------------|
| snapshot-to-mqtt | Captures a snapshot from a media source and publishes it to an MQTT topic. |
| clip-to-fs | Saves a video clip from a media source to the file system. |
| snapshot-to-fs | Saves a snapshot from a media source to the file system. |
| stream-to-rtsp | Proxies a live video stream from a media source to RTSP endpoints. |
| stream-to-rtsps | Proxies a live video stream from a media source to RTSPS endpoints. |

### RTSP endpoint authentication

The connector supports username and password authentication when it proxies live video streams to RTSP or RTSPS endpoints. The connector also supports TLS when it proxies live video streams to RTSPS endpoints.

Follow the steps in [Manage secrets for your Azure IoT Operations deployment](../secure-iot-ops/howto-manage-secrets.md) to add secrets for username and password in Azure Key Vault, project them into Kubernetes cluster, and reference them from your `stream-to-rtsp` and `stream-to-rtsps` asset configurations.

Follow the steps in [Manage certificates for external communications](../secure-iot-ops/howto-manage-certificates.md#manage-certificates-for-external-communications) to add secrets for TLS certificates in Azure Key Vault, project them into Kubernetes cluster, and reference them from your `stream-to-rtsps` asset configurations.

## Example uses

Example uses of the media connector include:

- Capture snapshots from a video stream or from an image URL and publish them to an MQTT topic. A subscriber to the MQTT topic can use the captured images for further processing or analysis.

- Save snapshots or video clips to a local file system on your cluster. Use [Azure Container Storage enabled by Azure Arc](/azure/azure-arc/container-storage/overview) to provide a reliable and fault-tolerant solution for uploading the captured video to the cloud for storage or processing. To learn how to create a suitable persistent volume claim, see [Cloud Ingest Edge Volumes configuration](/azure/azure-arc/container-storage/howto-configure-cloud-ingest-subvolumes).

    > [!IMPORTANT]
    > You must install [Azure Container Storage enabled by Azure Arc](/azure/azure-arc/container-storage/howto-install-edge-volumes) before you use it with the media connector template.

- Proxy a live video stream from a camera to an endpoint that an operator can access. For security and performance reasons, only the media connector should have direct access to an edge camera. The media connector uses a separate media server component to stream video to an operator's endpoint. This media server can transcode to various protocols such as RTSP, RTCP, SRT, and HLS. You need to deploy your own media server to provide these capabilities.

## Deploy the media connector

[!INCLUDE [deploy-connectors](../includes/deploy-connectors.md)]

### Configure a certificate trust list for the connector

[!INCLUDE [connector-certificate-application](../includes/connector-certificate-application.md)]

## Create a device with a media endpoint

To configure the media connector, first create a device that defines the connection to the media source. The device includes the URL of the media source and any credentials you need to access the media source:

# [Operations experience](#tab/portal)

1. In the operations experience web UI, select **Devices** in the left navigation pane. Then select **Create new**.

1. Enter a name for your device, such as `media-connector`. To add the endpoint for the media connector, select **New** on the **Microsoft.Media** tile.

1. Add the details of the endpoint for the media connector, including any authentication credentials:

    :::image type="content" source="media/howto-use-media-connector/add-media-connector-endpoint.png" alt-text="Screenshot that shows how to add a media connector endpoint." lightbox="media/howto-use-media-connector/add-media-connector-endpoint.png":::

    Select **Apply** to save the endpoint.

1. On the **Device details** page, select **Next** to continue.

1. On the **Add custom property** page, you can add any other properties you want to associate with the device. For example, you might add a property to indicate the manufacturer of the camera. Then select **Next** to continue.

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

# [Bicep](#tab/bicep)

Deploy the following Bicep template to create a device with an inbound endpoint for the media connector. Replace the placeholders `<AIO_NAMESPACE_NAME>` and `<CUSTOM_LOCATION_NAME>` with your Azure IoT Operations namespace name and custom location name respectively:

```bicep
param aioNamespaceName string = '<AIO_NAMESPACE_NAME>'
param customLocationName string = '<CUSTOM_LOCATION_NAME>'

resource namespace 'Microsoft.DeviceRegistry/namespaces@2025-10-01' existing = {
  name: aioNamespaceName
}

resource customLocation 'Microsoft.ExtendedLocation/customLocations@2021-08-31-preview' existing = {
  name: customLocationName
}

resource device 'Microsoft.DeviceRegistry/namespaces/devices@2025-10-01' = {
  name: 'media-connector'
  parent: namespace
  location: resourceGroup().location
  extendedLocation: {
    type: 'CustomLocation'
    name: customLocation.id
  }
  properties: {
    endpoints: {
      outbound: {
        assigned: {}
      }
      inbound: {
        'media-connector-0': {
          endpointType: 'Microsoft.Media'
          address: 'rtsp://samplecamera:554/stream1'
        }
      }
    }
  }
}
```

---

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

## Create an asset to publish an image snapshot

To define an asset that publishes an image snapshot from the media source to the MQTT broker:

# [Operations experience](#tab/portal)

1. In the operations experience web UI, select **Assets** in the left navigation pane. Then select **Create asset**.

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

To learn more, see [az iot ops ns asset media](/cli/azure/iot/ops/ns/asset/media).


# [Bicep](#tab/bicep)

Deploy the following Bicep template to create an asset that publishes snapshots from the device shown previously to an MQTT topic. Replace the placeholders `<AIO_NAMESPACE_NAME>` and `<CUSTOM_LOCATION_NAME>` with your Azure IoT Operations namespace name and custom location name respectively:

```bicep
param aioNamespaceName string = '<AIO_NAMESPACE_NAME>'
param customLocationName string = '<CUSTOM_LOCATION_NAME>'

resource namespace 'Microsoft.DeviceRegistry/namespaces@2025-10-01' existing = {
  name: aioNamespaceName
}

resource customLocation 'Microsoft.ExtendedLocation/customLocations@2021-08-31-preview' existing = {
  name: customLocationName
}

resource asset 'Microsoft.DeviceRegistry/namespaces/assets@2025-10-01' = {
  name: 'mymediaasset'
  parent: namespace
  location: resourceGroup().location
  extendedLocation: {
    type: 'CustomLocation'
    name: customLocation.id
  }
  properties: {
    displayName: 'mymediaasset'
    description: 'An example media asset'
    enabled: true

    deviceRef: {
      deviceName: 'media-connector'
      endpointName: 'media-connector-0'
    }
    streams: [

      {
        name: 'snapshotstream'
        streamConfiguration: '{"taskType": "snapshot-to-mqtt","autostart":true, "format": "jpeg","snapshotsPerSecond": 0.25}'
        destinations: [
          {
            target: 'Mqtt'
            configuration: {
                topic: 'azure-iot-operations/data/snapshots'
                qos: 'Qos1'
                retain: 'Never'
                ttl: 60
              }
          }
        ]
      }
    ]

  }
}
```

---

### Verify the published messages

To verify that the connector is publishing messages, you can use an MQTT client to subscribe to the topic `azure-iot-operations/data/{asset name}/{stream name}`. If the device and asset are configured correctly, you receive messages containing JPEG image snapshots when you subscribe to this topic.

The following steps show you how to run the **mosquitto_sub** tool in the cluster. To learn more about this tool and alternative approaches, see [MQTT tools](../troubleshoot/tips-tools.md#mqtt-tools):

[!INCLUDE [deploy-mqttui](../includes/deploy-mqttui.md)]

To save the payload of a single message, use a command like the following example:

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

1. Add a name for the stream, such as `myclips`. Set **Storage** as the destination and add a path such as `myclips` to use to save the clips. Select `clip-to-fs` as the task type.

    :::image type="content" source="media/howto-use-media-connector/add-clip-stream.png" alt-text="Screenshot that shows how to add a clip stream." lightbox="media/howto-use-media-connector/add-clip-stream.png":::

    Select **Add** to save the stream.

1. The new stream is listed in the asset's **Streams** page:

    :::image type="content" source="media/howto-use-media-connector/media-connector-streams.png" alt-text="Screenshot that shows the list of streams for the media connector asset." lightbox="media/howto-use-media-connector/media-connector-streams.png":::

# [Azure CLI](#tab/cli)

Run the following command:

```azurecli
az iot ops ns asset media stream add --asset mymediaasset --instance {your instance name}  -g {your resource group name} --name clipStream --task-type clip-to-fs --format mp4 --duration 30 --path /data/clips
```

# [Bicep](#tab/bicep)

Deploy the following Bicep template to create an asset that saves video clips from the device shown previously to local storage. Replace the placeholders `<AIO_NAMESPACE_NAME>` and `<CUSTOM_LOCATION_NAME>` with your Azure IoT Operations namespace name and custom location name respectively:

```bicep
param aioNamespaceName string = '<AIO_NAMESPACE_NAME>'
param customLocationName string = '<CUSTOM_LOCATION_NAME>'

resource namespace 'Microsoft.DeviceRegistry/namespaces@2025-10-01' existing = {
  name: aioNamespaceName
}

resource customLocation 'Microsoft.ExtendedLocation/customLocations@2021-08-31-preview' existing = {
  name: customLocationName
}

resource asset 'Microsoft.DeviceRegistry/namespaces/assets@2025-10-01' = {
  name: 'mymediaasset2'
  parent: namespace
  location: resourceGroup().location
  extendedLocation: {
    type: 'CustomLocation'
    name: customLocation.id
  }
  properties: {
    displayName: 'mymediaasset2'
    description: 'An example media asset'
    enabled: true

    deviceRef: {
      deviceName: 'media-connector'
      endpointName: 'media-connector-0'
    }
    streams: [

      {
        name: 'clipstream'
        streamConfiguration: '{"taskType": "clip-to-fs","autostart":true, "format": "mp4","duration": 30}'
        destinations: [
          {
            target: 'Storage'
            configuration: {
                path: 'data/clips'
              }
          }
        ]
      }
    ]

  }
}
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

> [!IMPORTANT]
> The mount path must start with the '/' character.

After the connector captures the clips, it uploads them to the `/pvc/clips` folder in your container:

:::image type="content" source="media/howto-use-media-connector/captured-streams.png" alt-text="Screenshot that shows the captured streams in Blob storage.":::

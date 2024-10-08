---
title: How to use the media connector (preview)
description: How to use the media connector (preview) to perform tasks such as sending an image snapshot to the MQTT broker or saving a video stream to a local file system.
author: dominicbetts
ms.author: dobett
ms.service: azure-iot-operations
ms.topic: how-to
ms.date: 10/07/2024

#CustomerIntent: As an industrial edge IT or operations user, I want to configure the media connector so that I can access snapshots and videos from a media source such as a IP video camera.
---

# Configure the media connector (preview)

In Azure IoT Operations, the media connector (preview) enables access to media from media sources such as edge-attached cameras. This article explains how to use the media connector to perform tasks such as sending an image snapshot to the MQTT broker or saving a video stream to a local file system.

The media connector:

- Uses _asset endpoints_ to access media sources. An asset endpoint defines a connection to a media source such as a camera. The asset endpoint configuration includes the URL of the media source, the type of media source, and any credentials needed to access the media source.

- Uses _assets_ to represent media sources such as cameras. An asset defines the capabilities and properties of a media source such as a camera.

## Prerequisites

A deployed instance of Azure IoT Operations. If you don't already have an instance, see [Quickstart: Run Azure IoT Operations Preview in GitHub Codespaces with K3s](../get-started-end-to-end-sample/quickstart-deploy.md).

## Deploy the media server

If you're using the media connector to stream live video, you need to install your own media server. To deploy a sample media server to use with the media connector, run the following command:

```console
kubectl create namespace media-server --dry-run=client -o yaml | kubectl apply -f - & kubectl apply -f https://raw.githubusercontent.com/Azure-Samples/explore-iot-operations/refs/heads/main/samples/media-connector-invoke-test/media-server/media-server-deployment.yaml --validate=false & kubectl apply -f https://raw.githubusercontent.com/Azure-Samples/explore-iot-operations/refs/heads/main/samples/media-connector-invoke-test/media-server/media-server-service.yaml --validate=false & kubectl apply -f https://raw.githubusercontent.com/Azure-Samples/explore-iot-operations/refs/heads/main/samples/media-connector-invoke-test/media-server/media-server-service-public.yaml --validate=false
```

## Use Bicep to configure the media connector (preview)

You can use Bicep to define the asset endpoint and asset for a media source such as a camera. The following Bicep code shows how to define an asset endpoint and asset for a media source. The asset endpoint uses the anonymous authentication method to connect to the video stream:

```bicep
metadata description = 'Asset endpoint profile and asset for a media source'
param resourceName  string
param targetAddress string
param customLocationName string
param assetName     string
param strDescription string
param bolEnabled    bool
param datasetsName string
param datasetsDataPoints array

/*****************************************************************************/
/*                          Existing AIO cluster                             */
/*****************************************************************************/
resource customLocation 'Microsoft.ExtendedLocation/customLocations@2021-08-31-preview' existing = {
  name: customLocationName
}
/*****************************************************************************/
/*                          Asset endpoint profile                           */
/*****************************************************************************/
resource assetEndpoint 'Microsoft.DeviceRegistry/assetEndpointProfiles@2024-11-01' = {
  name: resourceName
  location: resourceGroup().location
  extendedLocation: {
    type: 'CustomLocation'
    name: customLocation.id
  }
  properties: {
    targetAddress: targetAddress
    endpointProfileType: 'Media'
    authentication: {
      method: 'Anonymous'
    }
  }
}
/*****************************************************************************/
/*                                    Asset                                  */
/*****************************************************************************/
resource asset 'Microsoft.DeviceRegistry/assets@2024-11-01' = {
  name: assetName
  location: resourceGroup().location
  extendedLocation: {
    type: 'CustomLocation'
    name: customLocation.id
  }
  properties: {
    displayName: assetName
    assetEndpointProfileRef: assetEndpoint.name
    description: strDescription
    enabled: bolEnabled
    datasets: [
      {
        name: datasetsName
        dataPoints: datasetsDataPoints
      }
    ]
  }
}
```

The following JSON snippet shows a set of parameter values to use:

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentParameters.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "resourceName": {
            "value": "aep-public-http-anonymous-1"
        },
        "assetName": {
            "value": "asset-public-http-anonymous-1-snapshot-to-mqtt-autostart"
        },
        "strDescription": {
            "value": "snapshot to mqtt (autostart)"
        },
        "bolEnabled": {
            "value": true
        },
        "targetAddress": {
            "value": "https://raw.githubusercontent.com/Azure-Samples/explore-iot-operations/refs/heads/main/samples/shared-multimedia/IntroducingAzureIoTOperations.mp4"
        },
        "datasetsName": {
            "value": "snapshot-to-mqtt-autostart"
        },
        "datasetsDataPoints": {
            "value": [
                {
                    "name": "snapshot-to-mqtt",
                    "dataSource": "snapshot-to-mqtt",
                    "dataPointConfiguration": "{\"taskType\":\"snapshot-to-mqtt\",\"autostart\":true,\"realtime\":true,\"loop\":true,\"format\":\"jpeg\",\"fps\":1}"
                }
            ]
        }
    }
}
```

These parameters configure:

- The asset endpoint to connect to a video stream at `https://raw.githubusercontent.com/Azure-Samples/explore-iot-operations/refs/heads/main/samples/shared-multimedia/IntroducingAzureIoTOperations.mp4`.
- The asset to capture snapshots from the video stream and publish them to an MQTT topic.

The default MQTT topic name that the connector publishes to is `<connector namespace>/data/<asset name>`.

To apply the previous configuration, save the examples above as files, and run the following command:

```azurecli
az deployment group create --resource-group <your resource group> --template-file aep-camera-anonymous.bicep --parameters snapshot-to-mqtt-autostart.json --parameters customLocationName=<your custom location>
```

[!INCLUDE [discover-custom-location](../includes/discover-custom-location.md)]

This asset configuration publishes snapshots from the video stream to an MQTT topic. To view the snapshots, you can subscribe to the MQTT topic. To learn more about how to subscribe to an MQTT topic in a non-production environment, see [Test connectivity to MQTT broker with MQTT clients](../manage-mqtt-broker/howto-test-connection.md).

## Dataset configuration

The `datasetsDataPoints` parameter specifies the action the the media connector takes on the asset. The previous example configures the camera to capture snapshots to publish to an MQTT broker topic. A camera asset supports the following five task types:

| Task type | Description |
|-----------|-------------|
| `snapshot-to-mqtt` | Capture snapshots from a camera and publishes them to an MQTT topic. |
| `snapshot-to-fs` | Capture snapshots from a camera and saves them to the local file system. |
| `clip-to-mqtt` | Capture video clips from a camera and publishes them to an MQTT topic. |
| `clip-to-fs` | Capture video clips from a camera and saves them to the local file system. |
| `stream-to-rtsp` | Sends a live video stream from a camera to a media server. |

You can use the following settings to configure individual tasks:

- `autostart`: Whether the task starts automatically when the asset starts.
- `realtime`: Whether the task runs in real time.
- `loop`: Whether the task runs continuously.
- `format`: The format of the media file.
- `fps`: The frames per second for the media file.
- `audioEnabled`: Whether audio is enabled for the media file.
- `duration`: The duration of the media file.

The following YAML snippets show example dataset configurations for each task type. The `taskType` value determines the task type to configure:

```yaml
datasets:
  - name: dataset1
    dataPoints:
      - name: snapshot-to-mqtt
        dataSource: snapshot-to-mqtt
        dataPointConfiguration: |-
          {
            "taskType": "snapshot-to-mqtt",
            "autostart": true,
            "realtime": true,
            "loop": true,
            "format": "jpeg",
            "fps": 1
          }
```

```yaml
datasets:
  - name: dataset1
    dataPoints:
      - name: snapshot-to-fs
        dataSource: snapshot-to-fs
        dataPointConfiguration: |-
          {
            "taskType": "snapshot-to-fs",
            "autostart": false,
            "realtime": true,
            "loop": true,
            "format": "jpeg",
            "fps": 1
          }
```


```yaml
 datasets:
  - name: dataset1
    dataPoints:
      - name: clip-to-mqtt
        dataSource: clip-to-mqtt
        dataPointConfiguration: |-
          {
            "taskType": "clip-to-mqtt",
            "format": "avi",
            "autostart": true,
            "realtime": true,
            "loop": true,
            "fps": 3,
            "audioEnabled": false,
            "duration": 3
          }
```

```yaml
datasets:
  - name: dataset1
    dataPoints:
      - name: clip-to-fs
        dataSource: clip-to-fs
        dataPointConfiguration: |-
          {
            "taskType": "clip-to-fs",
            "format": "avi",
            "autostart": true,
            "realtime": true,
            "loop": true,
            "duration": 3
          }
```

```yaml
datasets:
  - name: dataset1
    dataPoints:
      - name: stream-to-rtsp
        dataSource: stream-to-rtsp
        dataPointConfiguration: |-
          {
            "taskType": "stream-to-rtsp",
            "autostart": true,
            "realtime": true,
            "loop": true
          }
```

## Samples

For more examples that show how to configure and use the media connector, see the [Azure IoT Operations samples repository](https://github.com/Azure-Samples/explore-iot-operations/blob/main/samples/media-connector-invoke-test/README.md).

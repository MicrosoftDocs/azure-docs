---
title: Connect camera to cloud using a remote device adapter
description: This article explains how to connect a camera to Azure Video Analyzer service using a remote device adapter
ms.topic: how-to
ms.date: 11/04/2021
ms.custom: ignite-fall-2021
---

# Connect cameras to the cloud using a remote device adapter

[!INCLUDE [header](includes/cloud-env.md)]

Azure Video Analyzer service allows users to capture and record video from RTSP cameras that are connected to the cloud. This requires that such cameras be accessible over the internet, which may not be permissible in many cases. Instead, you can deploy the Video Analyzer edge module to a lightweight edge device on the same (private) network as the RTSP cameras, and connect the edge device to the internet. The edge module can now be set up as an *adapter* that enables Video Analyzer service to connect to the *remote devices* (cameras). The edge module acts as a [transparent gateway](../../../iot-edge/iot-edge-as-gateway.md) for video traffic between the RTSP cameras and the Video Analyzer service.

> [!div class="mx-imgBorder"]
> :::image type="content" source="./media/use-remote-device-adapter/use-remote-device-adapter.svg" alt-text="Connect cameras to the cloud with a remote device adapter":::

## Pre-reading

* [Connect camera to the cloud](connect-cameras-to-cloud.md)
* [Quickstart: Get started with Video Analyzer live pipelines in the Azure portal](get-started-livepipelines-portal.md)

## Prerequisites

* An Azure account that has an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) if you don't already have one.
* [Deploy Azure Video Analyzer to an IoT Edge device](../edge/deploy-iot-edge-device.md)
* [IoT Hub must be attached to Video Analyzer account](../create-video-analyzer-account.md#post-deployment-steps)
* [RTSP cameras](../quotas-limitations.md#supported-cameras)
  * Ensure that camera(s) are on the same network as the edge device
  * Ensure that you can configure the camera to send video at or below a maximum bandwidth (measured in kBps or kilobits/second)

## Overview
In order to connect a camera to the Video Analyzer service using a remote device adapter, you need to:

1. Create an IoT device in the IoT Hub to represent the RTSP camera
1. Create a device adapter on the Video Analyzer edge module to act as the transparent gateway for the above device
1. Use the IoT device and the device adapter when creating a live pipeline in the Video Analyzer service to capture and record video from the camera



## Create an IoT device

Create an IoT device to represent each RTSP camera that needs to be connected to the Video Analyzer service. In the Azure portal:

1. Navigate to the IoT Hub
1. Select the **Devices** pane under **Device management**
1. Select **+Add device** 
1. Enter a **Device ID** using a unique string (Ex: building404-camera1)
1. **Authentication type** must be **Symmetric key**
1. All other properties can be left as default
1. Select **Save** to create the IoT device
1. Select the IoT device, and record the **Primary key** or **Secondary key**, as it will be needed below

## Create a remote device adapter

To enable the Video Analyzer edge module to act as a transparent gateway for video between the camera and the Video Analyzer service, you must create a remote device adapter for each camera. Invoke the [**remoteDeviceAdapterSet** direct method](../edge/direct-methods.md) that requires the following values: 

* Device ID for the IoT device
* Primary key for the IoT device
* Camera's IP address

In the Azure portal:

1. Navigate to the IoT Hub
1. Select the **IoT Edge** pane under **Device management**
1. Select the IoT Edge device (such as **ava-sample-device**) to which Video Analyzer edge module has been deployed
1. Under modules, select the Video Analyzer edge module (such as **avaedge**)
1. Select **</> Direct Method** 
1. Enter **remoteDeviceAdapterSet** for the Method Name
1. Enter the following for **Payload** :

```
 {
   "@apiVersion" : "1.1",
   "name": "<name of remote device adapter such as remoteDeviceAdapterCamera1>",
   "properties": {
     "target": {
       "host": "<Camera's IP address>"
      },
     "iotHubDeviceConnection": {
      "deviceId": "<IoT Hub Device ID>",
      "credentials": {
        "@type": "#Microsoft.VideoAnalyzer.SymmetricKeyCredentials",
        "key": "<Primary or Secondary Key>"
       }
     }
   }
 }
 
```

If successful, you will receive a response with a status code 201.

To list all of the remote device adapters that are set, invoke the **remoteDeviceAdapterList** direct method with the following payload:
```
 {
   "@apiVersion" : "1.1"
 }
```


## Create pipeline topology in the Video Analyzer service

When creating a cloud pipeline topology to ingest from a camera behind a firewall, tunneling must be enabled on the RTSP source node of the pipeline topology. See an example of such a [pipeline topology](https://github.com/Azure/video-analyzer/tree/main/pipelines/live/topologies/cloud-record-camera-behind-firewall).  


The following values, based on the IoT device created in the previous instructions, are required to enable tunneling on the RTSP source node:

* IoT Hub Name
* IoT Hub Device ID

```
            {
                "@type": "#Microsoft.VideoAnalyzer.RtspSource",
                "name": "rtspSource",
                "transport": "tcp",
                "endpoint": {
                    "@type": "#Microsoft.VideoAnalyzer.UnsecuredEndpoint",
                    "url": "${rtspUrlParameter}",
                    "credentials": {
                        "@type": "#Microsoft.VideoAnalyzer.UsernamePasswordCredentials",
                        "username": "${rtspUsernameParameter}",
                        "password": "${rtspPasswordParameter}"
                    },
                    "tunnel": { 
                        "@type": "#Microsoft.VideoAnalyzer.SecureIotDeviceRemoteTunnel",
                        "iotHubName" : "<IoT Hub Name>",
                        "deviceId": "${ioTHubDeviceIdParameter}"
                    }
                }
            }
``` 

Ensure that:
* `Transport` is set to `tcp`
* `Endpoint` is set to `UnsecuredEndpoint`
* `Tunnel` is set to `SecureIotDeviceRemoteTunnel`

[This quickstart](get-started-livepipelines-portal.md#deploy-a-live-pipeline) can be used a reference as it outlines the steps for creating a pipeline topology and live pipeline in Azure portal. Use the sample topology `Live capture, record, and stream from RTSP camera behind firewall`. 

## Create and activate a live pipeline

When creating the live pipeline, the RTSP URL, RTSP username, RTSP password, and IoT Hub Device ID must be defined. A sample payload is below.

```
   {
    "name": "record-from-building404-camera1",
    "properties": {
        "topologyName": "record-camera-behind-firewall",
        "description": "Capture, record and stream video from building404-camera1 via a remote device adapter",
        "bitrateKbps": 1500,
        "parameters": [
            {
                "name": "rtspUrlParameter",
                "value": "<RTSP URL for building404-camera1 such as rtsp://localhost:554/media/video>"
            },
            {
                "name": "rtspUsernameParameter",
                "value": "<User name for building404-camera1>"
            },
            {
                "name": "rtspPasswordParameter",
                "value": "<Password for building404-camera1>"
            },
            {
                "name": "ioTHubDeviceIdParameter",
                "value": "<IoT Hub Device ID such as building404-camera1>"
            },
            {
                "name": "videoName",
                "value": "video-from-building404-camera1"
            }
          ]
       }
   }
```
The RTSP URL IP address must be **localhost**. Ensure that the`bitrateKbps` value matches the maximum bitrate setting for the video from the RTSP camera.

After creating the live pipeline, the pipeline can be activated to start recording to the Video Analyzer video resource. [The quickstart](get-started-livepipelines-portal.md#deploy-a-live-pipeline) mentioned in the previous step also outlines how to activate a live pipeline in Azure portal.


### Playback recorded video in the Azure portal

1. After activating the live pipeline, the video resource will be available under the Video Analyzer account **Videos** pane in Azure portal. The status will indicate **Is in use** as pipeline is active and recording.
1. Select the video resource that was defined in the live pipeline to view the video.

> [!div class="mx-imgBorder"]
> :::image type="content" source="./media/camera-1800s-mkv.png" alt-text="Screenshot of the live video captured by live pipeline in the cloud.":::

If you encounter errors while attempting to playback the video, follow the steps in [this troubleshooting guide](troubleshoot.md#unable-to-play-video-after-activating-live-pipeline).

[!INCLUDE [activate-deactivate-pipeline](../edge/includes/common-includes/activate-deactivate-pipeline.md)]

## Next steps

Now that a video exists in your Video Analyzer account, you can export a clip of this recorded video to MP4 format using [this tutorial](export-portion-of-video-as-mp4.md).

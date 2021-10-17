---
title: Connect camera to cloud using a remote device adapter
description: This article explains how to connect a camera to Azure Video Analyzer using a remote device adapter
ms.topic: reference
ms.date: 11/01/2021

---

# Connect cameras to the cloud using a remote device adapter

[!INCLUDE [header](includes/cloud-env.md)]

Azure Video Analyzer allows users to connect cameras directly to the cloud in order to capture and record video, using cloud pipelines.
Connecting cameras to the cloud using a remote device adapter allows cameras to connect to Video Analyzer's service via the Video Analyzer edge module acting as a transparent gateway for video packets via RTSP protocol. This approach is useful in the following scenarios:

* When cameras connected to the gateway need to be shielded from exposure to the internet
* When cameras do not have the functionality to connect to IoT Hub independently
* When power, space, or other considerations permit only a lightweight edge device to be deployed on-premise

> [!NOTE]
> The Video Analyzer edge module is not acting as a transparent gateway for messaging and telemetry from the camera to IoT Hub, but only as a transparent gateway for video packets and RTSP protocol from the camera to Video Analyzer's cloud service.

> [!div class="mx-imgBorder"]
> :::image type="content" source="./media/use-transparent-gateway/use-transparent-gateway.svg" alt-text="Connect cameras to the cloud with a transparent gateway":::

## Pre-reading

* [Get started with Azure Video Analyzer in the Portal](../get-started-detect-motion-emit-events-portal.md)  
* [Connect camera to the cloud](connect-cameras-to-cloud.md#connect-via-a-remote-device-adapter)

## Prerequisites

The following are required for this how-to guide:

* An Azure account that has an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) if you don't already have one.
* [Azure Video Analyzer account](../create-video-analyzer-account.md) with associated:
  * Storage account
  * User-assigned managed identity (UAMI)
* IoT Hub
  * User-assigned managed identity with **Contributor** role access
* Video Analyzer account must be paired with IoT Hub
* [IoT Edge with Video Analyzer edge module installed and configured](../edge/deploy-iot-edge-device.md)
* [Azure Directory application with Owner access, service principal, and client secret](../../../active-directory/develop/howto-create-service-principal-portal.md)
  * Be sure to keep record of the values for the Tenant ID, App (Client) ID, and client secret.
* IP camera(s) with RTSP Stream
  * Ensure that camera(s) are on the same network as edge device


## Create IoT device for camera via portal

An IoT device has to be created for each camera to connect to the cloud.

In the Azure portal:

1. Navigate to the IoT Hub
1. Select the **IoT devices** pane under **Explorers**
1. Select **+Add device** 
1. Enter a **Device ID** with a unique string (Ex: building404-camera1)
1. All other properties can be left as default
1. Select **Save** to create the IoT device
1. Select the IoT device, and record the **Primary key**, as it will be needed

## Create remote device adapter to enable transparent gateway

To enable the edge module to act as a transparent gateway for video between the camera and Video Analyzer, you must create a remote device adapter for each camera by invoking the **RemoteDeviceAdapterSet** direct method that requires the following values: 

* Device ID for the IoT device
* Primary key for the IoT device
* Camera's IP address

In the Azure portal:

1. Navigate to the IoT Hub
1. Select the **IoT Edge** pane under **Automatic Device Management**
1. Select the corresponding edge device (Ex: ava-sample-device)
1. Under modules, select **avaedge**
1. Select **</> Direct Method** 
1. Enter **RemoteDeviceAdapterSet** for Method Name
1. Enter the following for **Payload** :

```
 {
   "@apiVersion" : "1.1",
   "name": "remoteDeviceAdapterCamera1",
   "properties": {
     "target": {
       "host": "<Camera's IP address>"
      },
     "iotHubDeviceConnection": {
      "deviceId": "<Device ID>",
      "credentials": {
        "@type": "#Microsoft.VideoAnalyzer.SymmetricKeyCredentials",
        "key": "<Primary Key>"
       }
     }
   }
 }
 
```

If successful, you will receive a response with a status code 201.

> [!NOTE]
> IoT Hub ARM ID and IoT Hub User-Assiged Managed Identity ARM ID will be needed for the next steps. To acquire the IoT Hub ARM ID, navigate to the **Overview** pane of the IoT Hub and select **JSON View**. Record the **Resource ID** value for the IoT Hub ARM ID. To acquire the IoT Hub User-Assiged Managed Identity ARM ID, navigate to the **Overview** pane of the user-assigned managed identity that has been assigned **Owner** role on the IoT Hub and select **JSON View**. Record the **Resource ID** value for the IoT Hub User-Assiged Managed Identity ARM ID.

## Create pipeline topology in the cloud

When creating a cloud pipeline topology to ingest from a camera behind a firewall, tunneling must be enabled on the RTSP source node of the pipeline topology.

See an example of a [pipeline topology]()<!-- TODO: add link to sample topology with tunneling enabled on RTSP source node -->.

The following values are required to enable tunneling on the RTSP source node:

* IoT Hub Name
* IoT Device ID

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

## Create and activate live pipeline in the cloud

When creating the live pipeline, the RTSP URL, RTSP username, RTSP password, and IoT Device ID must be defined.

```
   {
    "name": "Sample-Pipeline-1",
    "properties": {
        "topologyName": "CVRwithRemoteDeviceAdapter", <!-- TODO: change to match name in GitHub -->
        "description": "Continuous video recording with ingestion via a remote device adapter",
        "bitrateKbps": 500,
        "parameters": [
            {
                "name": "rtspUrlParameter",
                "value": "rtsp://localhost:554/media/camera-300s.mkv"
            },
            {
                "name": "rtspUsernameParameter",
                "value": "test"
            },
            {
                "name": "rtspPasswordParameter",
                "value": "password"
            },
            {
                "name": "ioTHubDeviceIdParameter",
                "value": "building1-camera1"
            }
          ]
       }
   }
```

After creating the live pipeline, the pipeline can be activated to start recording to the Video Analyzer video resource.

<!-- TODO: add link to Mayank's Cloud pipeline quickstart -->

The [AVA C# cloud sample repository]() <!-- TODO: add link to cloud sample repo --> can be used to automate this process.

## Playback recorded video in the Azure portal

You can examine the Video Analyzer video resource that was created by the live pipeline by logging in to the Azure portal and viewing the video.

1. Open your web browser, and go to the [Azure portal](https://portal.azure.com/). Enter your credentials to sign in to the portal. The default view is your service dashboard.
1. Locate your Video Analyzers account among the resources you have in your subscription, and open the account pane.
1. Select **Videos** in the **Video Analyzer** section.
1. You'll find a video listed with the name specified in the video sink node of the pipeline topology used.
1. Select the video.
1. The video details page will open and the playback should start automatically.

[!INCLUDE [activate-deactivate-pipeline](../edge/includes/common-includes/activate-deactivate-pipeline.md)]

## Next steps

Now that a video exists in your Video Analyzer account, you can export a clip of this recorded video to MP4 format using [this tutorial]().<!-- TODO: add link to Keith's export to MP4 tutorial -->


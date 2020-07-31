---
title: 'Tutorial - Monitor video using the Azure IoT Central video analytics - object and motion detection application template'
description: This tutorial shows how to use the dashboards in the video analytics - object and motion detection application template to manage your cameras and monitor the video.
services: iot-central
ms.service: iot-central
ms.subservice: iot-central-retail
ms.topic: tutorial
ms.author: nandab
author: KishorIoT
ms.date: 07/31/2020
---
# Tutorial: Monitor and manage a video analytics - object and motion detection application

In this tutorial, you learn how to:
> [!div class="checklist"]
> * Add object and motion detection cameras to your IoT Central application.
> * Manage your video streams and play them when interesting events are detected.

## Prerequisites

Before you start, you should complete:

* The [Create a live video analytics application in Azure IoT Central](./tutorial-video-analytics-create-app.md) tutorial.
* One of the previous [Create an IoT Edge instance for live video analytics (Linux VM)](tutorial-video-analytics-iot-edge-vm.md) or [Create an IoT Edge instance for live video analytics (Linux VM)](tutorial-video-analytics-iot-edge-nuc.md) tutorials.

You should have [Docker](https://www.docker.com/products/docker-desktop) installed on your local machine to run the video viewer application.

## Add an object detection camera

In your IoT Central application, navigate to the **LVA Gateway 001** device you created previously. Then select the **Commands** tab.

Use the values in the following table as the parameter values for the **Add Camera Request** command. The values shown in the table assume you're using the simulated camera in the Azure VM, adjust the values appropriately if you're using a real camera:

| Field| Description| Sample value|
|---------|---------|---------|
| Camera ID      | Device ID for provisioning | camera-001 |
| Camera Name    | Friendly name           | Object detection camera |
| RTSP Url       | Address of the stream   | RTSP://10.0.0.4:554/media/camera-300s.mkv|
| RTSP Username  |                         | user    |
| RTSP Password  |                         | password    |
| Detection Type | Dropdown                | Object Detection       |

Select **Run** to add the camera device:

:::image type="content" source="media/tutorial-video-analytics-manage/add_camera.png" alt-text="Add Camera":::

> [!NOTE]
> The **LVA Edge Object Detector** device template already exists in the application.

## Add a motion detection camera (optional)

If you have two cameras connected to your IoT Edge gateway device, repeat the previous steps to add a motion detection camera to the application. Use different values for the **Camera ID**, **Camera Name**, and **RTSP Url** parameters.

## View the downstream devices

Select the **Downstream Devices** tab for the **LVA Gateway 001** device to see the camera devices you just added:

:::image type="content" source="media/tutorial-video-analytics-manage/inspect_downstream.png" alt-text="Inspect":::

The camera devices also appear in the list on the **Devices** page in the application.

## Configure and manage the camera

Navigate to the **camera-001** device and select the **Manage** tab.

Use the default values, or modify if you need to customize the device properties:

**Camera Settings**

| Property | Description | Suggested Value |
|-|-|-|
| Video Playback Host | Host for the Azure Media Player viewer | http://localhost:8094 |

**AI Object Detection**

| Property | Description | Suggested Value |
|-|-|-|
| Confidence Threshold | Qualification percentage to determine if the object detection is valid | 70 |
| Detection Classes | Strings, delimited by commas, with the detection tags. For more information, see the [list of supported tags](https://github.com/Azure/live-video-analytics/blob/master/utilities/video-analysis/yolov3-onnx/tags.txt) | truck, bus |
| Inference Frame Sample Rate (fps) | [Description Here] | [Default Here] |

**LVA Operations and Diagnostics**

| Property | Description | Suggested Value |
|-|-|-|
| Auto Start | Start the Object detection when the LVA Gateway restarts | Checked |
| Debug Telemetry | Event Traces | Optional |
|Inference Timeout (sec)| The amount of time used to determine that inferences have stopped | 20 |

Select **Save**.

After a few seconds you see the **synced** confirmation message for each setting:

:::image type="content" source="media/tutorial-video-analytics-manage/object_detect.png" alt-text="Object Detect":::

## Start LVA processing

Navigate to the **camera-001** device and select the **Commands** tab.

Run the **Start LVA Processing** command.

Make sure the command worked

[Screenshot here]

## Monitor the cameras

Navigate to the **camera-100** device and select the **Dashboard** tab.

The **Detection Count** tile shows the average detection count for each of the selected detection classes objects during a one-second detection interval.

The **Inference** pie chart shows the percentage of detections class type.

The **Inference Event Video** is a list of links to the assets in Azure Media Services that contain the detections. The link uses the host player described in the following section.

## Start the streaming endpoint

Start the Media Services endpoint to enable your client Media Player application to stream the recorded video:

* In the Azure portal, navigate to the **lva-rg** resource group.
* Open the **Streaming Endpoint** resource.
* On the **Streaming endpoint details** page, select **Start**. You see a warning that billing starts when the endpoint starts.

## View stored video

The days of watching cameras and reacting to suspicious images are over. With automatic event tagging and direct links to the stored video with the inferred detection, security operators can find events of interest in a list and then follow the link to view the video.

<!-- TODO: fix the link to the video player repo -->
You can use the [AMP video player](https://github.com/sseiber/amp-player) to view the video stored in your Azure Media Services account.

The IoT Central application stores the video in Azure Media Services from where you can stream it. You need a video player to play the video stored in Azure Media Services.

<!-- Can't it just run at a command prompt? Otherwise we need to add VS Code as a prereq -->

Open a command prompt and use the following command to run the video player in a Docker container on your local machine. Replace the placeholders in the command with the values you made a note of previously in the *scratchpad.txt* file. You made a note of the `amsAadClientId`, `amsAadSecret`, `amsAadTenantId`, `amsSubscriptionId`, and `amsAccountName` when you created the service principal for your Media Services account:

<!--You have to log into docker if this is not a public repo-->

<!-- Do we need instructions to start the streaming endpoint? It was stopped in my environment... -->

```bash
docker run -it --rm -e amsAadClientId="<FROM_AZURE_PORTAL>" -e amsAadSecret="<FROM_AZURE_PORTAL>" -e amsAadTenantId="<FROM_AZURE_PORTAL>" -e amsArmAadAudience="https://management.core.windows.net" -e amsArmEndpoint="https://management.azure.com" -e amsAadEndpoint="https://login.microsoftonline.com" -e amsSubscriptionId="<FROM_AZURE_PORTAL>" -e amsResourceGroup="<FROM_AZURE_PORTAL>" -e amsAccountName="<FROM_AZURE_PORTAL>" -p 8094:8094 meshams.azurecr.io/scotts/amp-viewer:1.0.8-amd64
```

|Docker parameter | AMS API access (JSON)|
|-|-|
|amsAadClientId| AadClientId|
|amsAadSecret| AadSecret |
|amsAadTenantId| AadTenantId |
|amsSubscriptionId| SubscriptionId|
|amsResourceGroup| ResourceGroup |
|amsAccountName| AccountName|

Navigate to the **Monitor** dashboard in your application. Then click one of the captured object detection hyperlinks on the **Inference Event Video** tile. The video appears on a page displayed by the local video player.

## Change the simulated devices in Application Dashboard

The application dashboards are originally populated with telemetry and properties generated from the IoT Central simulated devices. To configure the tiles to telemetry from real cameras or the Live555 simulator, follow these steps:

1. Navigate to the **Real Camera Monitor** dashboard.
1. Select **Edit**.
1. On the **Detection Count** tile, select the configure icon.
1. In the **Configure Chart** section, select one or more real cameras in the **LVA Edge Object Detector** device group.
1. Check the **Inference Count** telemetry field.
1. Select **Update**.

   :::image type="content" source="media/tutorial-video-analytics-manage/update_real_cameras.png" alt-text="Ream Cameras":::

1. Repeat the steps for the following tiles:
    1. **Detection** uses `AI Inference Interface/Inference/entity/tag/value` pie chart.
    1. **Object Detected** uses `AI Inference Interface/Inference/entity/tag/value` last known value.
    1. **Confidence %** uses `AI Inference Interface/Inference/entity/tag/confidence` last known value.
    1. **Snapshot** uses `AI Inference Interface/Inference Image` shown as an image.
    1. **Inference Event Video** uses `AI Inference Interface/Inference Event Video` shown as a link.
1. Select **Save**.

## Pause processing

You can pause live video analytics processing in the application:

1. In your application, navigate to the **Commands** page for object detection camera. Then run the **Stop LVA Processing** command.

1. Stop the streaming endpoint for your media services account:
    * In the Azure portal, navigate to the **lva-rg** resource group.
    * Click on the **Streaming Endpoint** resource.
    * On the **Streaming endpoint details** page, select **Stop**.

## Tidy up

If you've finished with the application, you can remove all the resources you created as follows:

1. In the IoT Central application, navigate to the **Your application** page in the **Administration** section. Then select **Delete**.
1. In the Azure portal, delete the **lva-rg** resource group.
1. On your local machine, stop the **amp-viewer** Docker container.

## Next steps

You've now learned how to add cameras to the IoT Central application and configure them for object and motion detection.

To learn how to customize the source code for the IoT Edge modules:

> [!div class="nextstepaction"]
> [Modify and build the live video analytics gateway modules](./tutorial-video-analytics-build-module.md)

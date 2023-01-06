---
title: Analyze live video with your own HTTP model
description: Analyze a live video feed from a (simulated) IP camera; apply a computer vision model to detect objects. Some frames in the feed are sent to an inference service; results are sent to IoT Edge Hub.
ms.service: azure-video-analyzer
ms.topic: quickstart
ms.date: 11/04/2021
zone_pivot_groups: video-analyzer-programming-languages
ms.custom: ignite-fall-2021, mode-other, contperf-fy22q2 
---

# Quickstart: Analyze a live video feed from a (simulated) IP camera using your own HTTP model

[!INCLUDE [header](includes/edge-env.md)]

[!INCLUDE [deprecation notice](../includes/deprecation-notice.md)]

This quickstart shows you how to use Azure Video Analyzer to analyze a live video feed from a (simulated) IP camera. You'll see how to apply a computer vision model to detect objects. A subset of the frames in the live video feed is sent to an inference service. The results are sent to IoT Edge Hub.

The quickstart uses an Azure VM as an IoT Edge device, and it uses a simulated live video stream. It builds on the [Detect motion and emit events](detect-motion-emit-events-quickstart.md) quickstart.

## Prerequisites

::: zone pivot="programming-language-csharp"
[!INCLUDE [prerequisites](includes/analyze-live-video-use-your-model-http/csharp/prerequisites.md)]
::: zone-end

::: zone pivot="programming-language-python"
[!INCLUDE [prerequisites](includes/analyze-live-video-use-your-model-http/python/prerequisites.md)]
::: zone-end

## Review the sample video

When you set up the Azure resources, a short video of highway traffic is copied to the Linux VM in Azure that you're using as the IoT Edge device. This quickstart uses the video file to simulate a live stream.

Open an application such as [VLC media player](https://www.videolan.org/vlc/). Select Ctrl+N and then paste a link to [the highway intersection sample video](https://avamedia.blob.core.windows.net/public/camera-300s.mkv) to start playback. You see the footage of many vehicles moving in highway traffic.

> [!VIDEO https://www.microsoft.com/videoplayer/embed/RE4LTY4]

## Create and deploy the livePipeline

### Examine and edit the sample files

::: zone pivot="programming-language-csharp"
[!INCLUDE [prerequisites](includes/analyze-live-video-use-your-model-http/csharp/sample-files.md)]
::: zone-end

::: zone pivot="programming-language-python"
[!INCLUDE [prerequisites](includes/analyze-live-video-use-your-model-http/python/sample-files.md)]
::: zone-end

## Generate and deploy the IoT Edge deployment manifest

1. Right-click the _src/edge/deployment.yolov3.template.json_ file and then select **Generate IoT Edge Deployment Manifest**.

   > [!div class="mx-imgBorder"]
   > :::image type="content" source="./media/analyze-live-video-use-your-model-http/generate-deployment-manifest.png" alt-text="Screenshot of Generate IoT Edge Deployment Manifest":::

1. The _deployment.yolov3.amd64.json_ manifest file is created in the _src/edge/config_ folder.
1. Right-click _src/edge/config/deployment.yolov3.amd64.json_ and select **Create Deployment for Single Device**.

   > [!div class="mx-imgBorder"]
   > :::image type="content" source="./media/analyze-live-video-use-your-model-http/deployment-single-device.png" alt-text= "Screenshot of Create Deployment for Single Device":::

1. When you're prompted to select an IoT Hub device, select **ava-sample-iot-edge-device**.
1. After about 30 seconds, in the lower-left corner of the window, refresh Azure IoT Hub. The edge device now shows the following deployed modules:

   - The Video Analyzer module, named **avaedge**.
   - The **rtspsim** module, which simulates an RTSP server and acts as the source of a live video feed.
   - The **avaextension** module, which is the YoloV3 object detection model that applies computer vision to the images and returns multiple classes of object types

     > [!div class="mx-imgBorder"]
     > :::image type="content" source="./media/vscode-common-screenshots/avaextension.png" alt-text= "Screenshot of YoloV3 object detection model":::

## Run the sample program

1. ::: zone pivot="programming-language-csharp"
    [!INCLUDE [header](includes/common-includes/csharp-run-program.md)]
    ::: zone-end

    ::: zone pivot="programming-language-python"
    [!INCLUDE [header](includes/common-includes/python-run-program.md)]
    ::: zone-end
1. The operations.json code starts off with calls to the direct methods `pipelineTopologyList` and `livePipelineList`. If you cleaned up resources after you completed previous quickstarts, then this process will return empty lists and then pause. To continue, select the Enter key.

   ```
   --------------------------------------------------------------------------
   Executing operation pipelineTopologyList
   -----------------------  Request: pipelineTopologyList  --------------------------------------------------
   {
   "@apiVersion": "1.1"
   }
   ---------------  Response: pipelineTopologyList - Status: 200  ---------------
   {
   "value": []
   }
   --------------------------------------------------------------------------
   Executing operation WaitForInput

   Press Enter to continue
   ```

1. The **TERMINAL** window shows the next set of direct method calls:

   - A call to `pipelineTopologySet` that uses the preceding pipelineTopologyUrl.
   - A call to `livePipelineSet` that uses the following body:

     ```
     {
       "@apiVersion": "1.1",
       "name": "Sample-Pipeline-1",
       "properties": {
         "topologyName": "InferencingWithHttpExtension",
         "description": "Sample pipeline description",
         "parameters": [
           {
             "name": "rtspUrl",
             "value": "rtsp://rtspsim:554/media/camera-300s.mkv"
           },
           {
             "name": "rtspUserName",
             "value": "testuser"
           },
           {
             "name": "rtspPassword",
             "value": "testpassword"
           }
         ]
       }
     }
     ```

   - A call to livePipelineActivate that starts the live pipeline and the flow of video.
   - A second call to `livePipelineList` that shows that the live pipeline is in the running state.

1. The output in the **TERMINAL** window pauses at a **Press Enter to continue** prompt. Don't select Enter yet. Scroll up to see the JSON response payloads for the direct methods you invoked.
1. Switch to the **OUTPUT** window in Visual Studio Code. You see messages that the Video Analyzer module is sending to the IoT hub. The following section of this quickstart discusses these messages.
1. The pipeline continues to run and print results. The RTSP simulator keeps looping the source video. To stop the pipeline, return to the **TERMINAL** window and select Enter.

   The next series of calls cleans up resources:

   - A call to `livePipelineDeactivate` deactivates the live pipeline.
   - A call to `livePipelineDelete` deletes the live pipeline.
   - A call to `pipelineTopologyDelete` deletes the topology.
   - A final call to `pipelineTopologyList` shows that the list is empty.

## Interpret results

When you run the live pipeline, the results from the HTTP extension processor node pass through the IoT Hub message sink node to the IoT hub. The messages you see in the **OUTPUT** window contain a body section and an applicationProperties section. For more information, see [Create and read IoT Hub messages](../../../iot-hub/iot-hub-devguide-messages-construct.md).

In the following messages, the Video Analyzer module defines the application properties and the content of the body.

**MediaSessionEstablished event**

When a pipeline is instantiated, the RTSP source node attempts to connect to the RTSP server that runs on the rtspsim-live555 container. If the connection succeeds, then the following event is printed. The event type is **Microsoft.VideoAnalyzer.Diagnostics.MediaSessionEstablished**.

```
[IoTHubMonitor] [9:42:18 AM] Message received from [avasampleiot-edge-device/avaedge]:
{
  "body": {
    "sdp": "SDP:\nv=0\r\no=- 1586450538111534 1 IN IP4 XXX.XX.XX.XX\r\ns=Matroska video+audio+(optional)subtitles, streamed by the LIVE555 Media Server\r\ni=media/camera-300s.mkv\r\nt=0 0\r\na=tool:LIVE555 Streaming Media v2020.03.06\r\na=type:broadcast\r\na=control:*\r\na=range:npt=0-300.000\r\na=x-qt-text-nam:Matroska video+audio+(optional)subtitles, streamed by the LIVE555 Media Server\r\na=x-qt-text-inf:media/camera-300s.mkv\r\nm=video 0 RTP/AVP 96\r\nc=IN IP4 0.0.0.0\r\nb=AS:500\r\na=rtpmap:96 H264/90000\r\na=fmtp:96 packetization-mode=1;profile-level-id=4D0029;sprop-parameter-sets=XXXXXXXXXXXXXXXXXXXXXX\r\na=control:track1\r\n"
  },
  "applicationProperties": {
    "dataVersion": "1.0",
    "topic": "/subscriptions/{subscriptionID}/resourceGroups/{name}/providers/microsoft.media/videoanalyzers/{ava-account-name}",
    "subject": "/edgeModules/avaedge/livePipelines/Sample-Pipeline-1/sources/rtspSource",
    "eventType": "Microsoft.VideoAnalyzers.Diagnostics.MediaSessionEstablished",
    "eventTime": "2021-04-09T09:42:18.1280000Z"
  }
}
```

In this message, notice these details:

- The message is a diagnostics event. MediaSessionEstablished indicates that the RTSP source node (the subject) connected with the RTSP simulator and has begun to receive a (simulated) live feed.
- In applicationProperties, subject indicates that the message was generated from the RTSP source node in the pipeline.
- In applicationProperties, eventType indicates that this event is a diagnostics event.
- The eventTime indicates the time when the event occurred.
- The body contains data about the diagnostics event. In this case, the data comprises the [Session Description Protocol (SDP)](https://en.wikipedia.org/wiki/Session_Description_Protocol) details.

### Inference event

The HTTP extension processor node receives inference results from the yolov3 module. It then emits the results through the IoT Hub message sink node as inference events.

In these events, the type is set to entity to indicate it's an entity, such as a car or truck. The eventTime value is the UTC time when the object was detected.

In the following example, two cars were detected in the same video frame, with varying levels of confidence.

```
[IoTHubMonitor] [1:48:04 PM] Message received from [avasample-iot-edge-device/avaedge]:
{
  "timestamp": 145589011404622,
  "inferences": [
    {
      "type": "entity",
      "entity": {
        "tag": {
          "value": "car",
          "confidence": 0.97052866
        },
        "box": {
          "l": 0.40896654,
          "t": 0.60390747,
          "w": 0.045092657,
          "h": 0.029998193
        }
      }
    },
    {
      "type": "entity",
      "entity": {
        "tag": {
          "value": "car",
          "confidence": 0.9547283
        },
        "box": {
          "l": 0.20050547,
          "t": 0.6094412,
          "w": 0.043425046,
          "h": 0.037724357
        }
      }
    },
    {
      "type": "entity",
      "entity": {
        "tag": {
          "value": "car",
          "confidence": 0.94567955
        },
        "box": {
          "l": 0.55363107,
          "t": 0.5320657,
          "w": 0.037418623,
          "h": 0.027014252
        }
      }
    },
    {
      "type": "entity",
      "entity": {
        "tag": {
          "value": "car",
          "confidence": 0.8916893
        },
        "box": {
          "l": 0.6642384,
          "t": 0.581689,
          "w": 0.034349587,
          "h": 0.027812533
        }
      }
    },
    {
      "type": "entity",
      "entity": {
        "tag": {
          "value": "car",
          "confidence": 0.8547814
        },
        "box": {
          "l": 0.584758,
          "t": 0.60079926,
          "w": 0.07082855,
          "h": 0.034121
        }
      }
    }
  ]
}
```

In the messages, notice the following details:

- The body section contains data about the analytics event. In this case, the event is an inference event, so the body contains inferences data.
- The inferences section indicates that the type is entity. This section includes additional data about the entity.
- The timestamp value indicates the time when the when the event was received.

## Clean up resources

[!INCLUDE [prerequisites](./includes/common-includes/clean-up-resources.md)]

## Next steps

Review additional challenges for advanced users:

- Use an [IP camera](https://en.wikipedia.org/wiki/IP_camera) that has support for RTSP instead of using the RTSP simulator. You can search for IP cameras that support RTSP on the [ONVIF conformant](https://www.onvif.org/conformant-products/) products page. Look for devices that conform with profiles G, S, or T.
- Use an AMD64 or x64 Linux device instead of an Azure Linux VM. This device must be in the same network as the IP camera. You can follow the instructions in [Install Azure IoT Edge runtime on Linux](../../../iot-edge/how-to-install-iot-edge.md?view=iotedge-2018-06&preserve-view=true). Then register the device with Azure IoT Hub by following instructions in [Deploy your first IoT Edge module to a virtual Linux device](../../../iot-edge/quickstart-linux.md?view=iotedge-2018-06&preserve-view=true).

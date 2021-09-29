---
title: Track objects in a live video with Azure Video Analyzer
description: This quickstart shows you how to use Azure Video Analyzer edge module to track objects in a live video feed from a (simulated) IP camera. You will see how to apply a computer vision model to detect objects in a subset of the frames in the live video feed. You can then use an object tracker node to track those objects in the other frames.
ms.topic: quickstart
ms.date: 06/01/2021
---

# Quickstart: Track objects in a live video

This quickstart shows you how to use Azure Video Analyzer edge module to track objects in a live video feed from a (simulated) IP camera. You will see how to apply a computer vision model to detect objects in a subset of the frames in the live video feed. You can then use an object tracker node to track those objects in the other frames.

The object tracker comes in handy when you need to detect objects in every frame, but the edge device does not have the necessary compute power to be able to apply the vision model on every frame. If the live video feed is at, say 30 frames per second, and you can only run your computer vision model on every 15th frame, the object tracker takes the results from one such frame, and then uses [optical flow](https://en.wikipedia.org/wiki/Optical_flow) techniques to generate results for the 2nd, 3rd,…, 14th frame, until the model is applied again on the next frame.

This quickstart uses an Azure VM as an IoT Edge device, and it uses a simulated live video stream.

## Prerequisites

[!INCLUDE [prerequisites](./includes/common-includes/csharp-prerequisites.md)]

## Set up Azure resources

[![Deploy to Azure](https://aka.ms/deploytoazurebutton)](https://aka.ms/ava-click-to-deploy)

[!INCLUDE [resources](./includes/common-includes/azure-resources.md)]

## Overview

> [!div class="mx-imgBorder"]
> :::image type="content" source="./media/track-objects-live-video/object-tracker-topology.svg" alt-text="Track objects in live video":::

This diagram shows how the signals flow in this quickstart. An [edge module](https://github.com/Azure/video-analyzer/tree/main/edge-modules/sources/rtspsim-live555) simulates an IP camera hosting a Real-Time Streaming Protocol (RTSP) server. An [RTSP source](pipeline.md#rtsp-source) node pulls the video feed from this server and sends video frames to the [HTTP extension processor](pipeline.md#http-extension-processor) node.

The HTTP extension node plays the role of a proxy. It converts every 15th video frame to the specified image type. Then it relays the image over HTTP to another edge module that runs an AI model behind a HTTP endpoint. In this example, that edge module uses the [YOLOv3](https://github.com/Azure/video-analyzer/tree/main/edge-modules/extensions/yolo/yolov3) model which can detect many types of objects. The HTTP extension processor node receives the detection results and sends these results and all the video frames (not just the 15th frame) to the [object tracker](pipeline.md#object-tracker-processor) node. The object tracker node uses optical flow techniques to track the object in the 14 frames that did not have the AI model applied to them. The tracker node publishes its results to the IoT Hub message sink node. This [IoT Hub message sink](pipeline.md#iot-hub-message-sink) node then sends those events to [IoT Edge Hub](../../iot-fundamentals/iot-glossary.md?view=iotedge-2020-11&preserve-view=true#iot-edge-hub).

> [!NOTE]
> You should review the discussion of the about the trade-off between accuracy and processing power with the [object tracker](pipeline.md#object-tracker-processor) node.

In this quickstart, you will:

1. Setup your development environment.
1. Deploy the required edge modules.
1. Create and deploy the live pipeline.
1. Interpret the results.
1. Clean up resources.

## Set up your development environment
[!INCLUDE [setup development environment](./includes/set-up-dev-environment/csharp/csharp-set-up-dev-env.md)]

## Deploy the required modules

1. In Visual Studio Code, right-click the *src/edge/deployment.yolov3.template.json* file and then select **Generate IoT Edge Deployment Manifest**.

    > [!div class="mx-imgBorder"]
    > :::image type="content" source="./media/analyze-live-video-use-your-model-http/generate-deployment-manifest.png" alt-text="Generate IoT Edge Deployment Manifest":::
1. The *deployment.yolov3.amd64.json* manifest file is created in the *src/edge/config* folder.
1. Right-click *src/edge/config/deployment.yolov3.amd64.json* and select **Create Deployment for Single Device**.

    > [!div class="mx-imgBorder"]
    > :::image type="content" source="./media/analyze-live-video-use-your-model-http/deployment-single-device.png" alt-text= "Create Deployment for Single Device":::
1. When you're prompted to select an IoT Hub device, select **avasample-iot-edge-device**.
1. After about 30 seconds, in the lower-left corner of the window, refresh Azure IoT Hub. The edge device now shows the following deployed modules:

    * The Video Analyzer edge module, named **avaedge**.
    * The **rtspsim** module, which simulates an RTSP server and acts as the source of a live video feed. 
    * The **yolov3** module, which uses the YOLOV3 model to detect a variety of objects

        > [!div class="mx-imgBorder"]
        > :::image type="content" source="./media/track-objects-live-video/object-tracker-modules.png" alt-text= "List of deployed IoT Edge modules":::


## Create and deploy the live pipeline

### Examine and edit the sample files

In Visual Studio Code, browse to the src/cloud-to-device-console-app folder. Here you'll see the appsettings.json file that you created along with a few other files:

* **c2d-console-app.csproj**: The project file for Visual Studio Code.
* **operations.json**: This file lists the different operations that you would run.
* **Program.cs**: The sample program code, which:
    * Loads the app settings.
    * Invokes direct methods exposed by Video Analyzer module. You can use the module to analyze live video streams by invoking its [direct methods](direct-methods.md).
    * Pauses for you to examine the output from the program in the **TERMINAL** window and the events generated by the module in the **OUTPUT** window.
    * Invokes direct methods to clean up resources.

1. Edit the operations.json file:
    
    * Change the link to the pipeline topology:
    * "pipelineTopologyUrl" : "https://raw.githubusercontent.com/Azure/video-analyzer/main/pipelines/live/topologies/object-tracking/topology.json"
    * Under livePipelineSet, edit the name of the pipeline topology to match the value in the preceding link:
    * "topologyName" : "ObjectTrackingWithHttpExtension"
    * Under pipelineTopologyDelete, edit the name:
    * "name" : "ObjectTrackingWithHttpExtension"
    
Open the URL for the pipeline topology in a browser, and examine the settings for the HTTP extension node.

```
   "samplingOptions":{
       "skipSamplesWithoutAnnotation":"false",
       "maximumSamplesPerSecond":"2"
   }
```

Here, `skipSamplesWithoutAnnotation` is set to `false` because the extension node needs to pass through all frames, whether or not they have inference results, to the downstream object tracker node. The object tracker is capable of tracking objects over 15 frames, approximately. Your AI model has a maximum FPS for processing, which is the highest value that `maximumSamplesPerSecond` should be set to.
    
## Run the sample program

1. To start a debugging session, select the F5 key. You see messages printed in the **TERMINAL** window.
1. The operations.json code starts off with calls to the direct methods `pipelineTopologyList` and `livePipelineList`. If you cleaned up resources after you completed previous quickstarts, then this process will return empty lists and then pause. To continue, select the Enter key.
    
    ```
    -------------------------------Executing operation pipelineTopologyList-----------------------  
    Request: pipelineTopologyList  --------------------------------------------------
    {
    "@apiVersion": "1.0"
    }
    ---------------  
    Response: pipelineTopologyList - Status: 200  ---------------
    {
    "value": []
    }
    --------------------------------------------------------------------------
    Executing operation WaitForInput
    
    Press Enter to continue
    ```
    
    The **TERMINAL** window shows the next set of direct method calls:
    
    * A call to `pipelineTopologySet` that uses the contents of `pipelineTopologyUrl`
    * A call to `livePipelineSet` that uses the following body:
        
    ```json
    {
      "@apiVersion": "1.0",
      "name": "Sample-Pipeline-1",
      "properties": {
        "topologyName": "ObjectTrackingWithHttpExtension",
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
    * A call to `livePipelineActivate` that activates the live pipeline and the flow of video.
    * A second call to `livePipelineList` that shows that the live pipeline is in the running state.
1. The output in the TERMINAL window pauses at a Press Enter to continue prompt. Do not press Enter yet. Scroll up to see the JSON response payloads for the direct methods you invoked.
1. Switch to the OUTPUT window in Visual Studio Code. You see messages that the Video Analyzer edge module is sending to the IoT hub. The following section of this quickstart discusses these messages.
1. The live pipeline continues to run and print results. The RTSP simulator keeps looping the source video. To stop the live pipeline, return to the **TERMINAL** window and select Enter.
1. The next series of calls cleans up resources:

    * A call to `livePipelineDeactivate` deactivates the live pipeline.
    * A call to `livePipelineDelete` deletes the live pipeline.
    * A call to `pipelineTopologyDelete` deletes the pipeline topology.
    * A final call to `pipelineTopologyList` shows that the list is empty.
    
## Interpret results

When you run the live pipeline, the results from the HTTP extension processor node pass through the IoT Hub message sink node to the IoT hub. The messages you see in the **OUTPUT** window contain a `body` section and an `applicationProperties` section. For more information, see [Create and read IoT Hub messages](../../iot-hub/iot-hub-devguide-messages-construct.md).

In the following messages, the Video Analyzer module defines the application properties and the content of the body.

### MediaSessionEstablished event

When a live pipeline is activated, the RTSP source node attempts to connect to the RTSP server that runs on the rtspsim-live555 container. If the connection succeeds, then the following event is printed. The event type is **MediaSessionEstablished**.

```
[IoTHubMonitor] [9:42:18 AM] Message received from [avasample-iot-edge-device/avaedge]:
{  "body": {
    "sdp": "SDP:\nv=0\r\no=- 1586450538111534 1 IN IP4 nnn.nn.0.6\r\ns=Matroska video+audio+(optional)subtitles, streamed by the LIVE555 Media Server\r\ni=media/camera-300s.mkv\r\nt=0 0\r\na=tool:LIVE555 Streaming Media v2020.03.06\r\na=type:broadcast\r\na=control:*\r\na=range:npt=0-300.000\r\na=x-qt-text-nam:Matroska video+audio+(optional)subtitles, streamed by the LIVE555 Media Server\r\na=x-qt-text-inf:media/camera-300s.mkv\r\nm=video 0 RTP/AVP 96\r\nc=IN IP4 0.0.0.0\r\nb=AS:500\r\na=rtpmap:96 H264/90000\r\na=fmtp:96 packetization-mode=1;profile-level-id=4D0029;sprop-parameter-sets=Z00AKeKQCgC3YC3AQEBpB4kRUA==,aO48gA==\r\na=control:track1\r\n"
  },
  "applicationProperties": {
    "dataVersion": "1.0",
    "topic": "/subscriptions/{subscriptionID}/resourceGroups/{name}/providers/microsoft.media/videoAnalyzers/{ava-account-name}",
    "subject": "/edgeModules/avaedge/livePipelines/Sample-Pipeline-1/sources/rtspSource",
    "eventType": "Microsoft.VideoAnalyzer.Diagnostics.MediaSessionEstablished",
    "eventTime": "2020-04-09T16:42:18.1280000Z"
  }
}
```

In this message, notice these details:

* The message is a diagnostics event. **MediaSessionEstablished** indicates that the RTSP source node (the subject) connected with the RTSP simulator and has begun to receive a (simulated) live feed.
* In applicationProperties, subject indicates that the message was generated from the RTSP source node in the live pipeline.
* In applicationProperties, eventType indicates that this event is a diagnostics event.
* The eventTime indicates the time when the event occurred.
* The body contains data about the diagnostics event. In this case, the data comprises the [Session Description Protocol (SDP)](https://en.wikipedia.org/wiki/Session_Description_Protocol) details.

## Object tracking events

The HTTP extension processor node sends the 0th, 15th, 30th, … etc. frames to the yolov3 module, and receives the inference results. It then sends these results and all video frames to the object tracker node. Suppose an object was detected on frame 0 – then the object tracker will assign a unique `sequenceId` to that object. Then, in frames 1, 2,…,14, if it can track that object, it will output a result with the same `sequenceId`. In the following snippets from the results, note how the `sequenceId` is repeated, but the location of the bounding box has changed, as the object is moving.

From frame M:

```json
  {
    "type": "entity",
    "subtype": "objectDetection",
    "inferenceId": "4d325fc4dc7a43b2a781bf7d6bdb3ff0",
    "sequenceId": "0999a1dde5b241c3a0b2db025f87ab32",
    "entity": {
      "tag": {
        "value": "car",
        "confidence": 0.95237225
      },
      "box": {
        "l": 0.0025893003,
        "t": 0.550063,
        "w": 0.1086607,
        "h": 0.12116724
      }
    }
  },
```

From frame N:

```json
{
  "type": "entity",
  "subtype": "objectDetection",
  "inferenceId": "317aafdab7e940388be1e4c4cc58c366",
  "sequenceId": "0999a1dde5b241c3a0b2db025f87ab32",
  "entity": {
    "tag": {
      "value": "car",
      "confidence": 0.95237225
    },
    "box": {
      "l": 0.0027777778,
      "t": 0.54901963,
      "w": 0.108333334,
      "h": 0.12009804
    }
  }
},
```

## Clean up resources

[!INCLUDE [prerequisites](./includes/common-includes/clean-up-resources.md)]

## Next steps

* Try [detecting when objects cross a virtual line in a live video](use-line-crossing.md).




---
title: Record and stream inference metadata with video - Azure Video Analyzer
description: In this tutorial, you'll learn how to use Azure Video Analyzer to record video and inference metadata to the cloud and play back the recording with the visual inference metadata.
ms.service: azure-video-analyzer
ms.topic: how-to
ms.date: 06/01/2021

---
# Tutorial: Record and stream inference metadata with video
  
In this tutorial, you will learn how to use Azure Video Analyzer to record live video and inference metadata to the cloud and play back that recording with visual inference metadata. In this use case, you will be continuously recording video, while using a custom model to detect objects **(yoloV3)** and a Video Analyzer processor **(object tracker)** to track objects. As video is being continuously recorded, so will the inference metadata from the objects being detected and tracked. 

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

## Suggested pre-reading  

Read these articles before you begin:

* [Azure Video Analyzer on IoT Edge overview](overview.md)
* [Azure Video Analyzer on IoT Edge terminology](terminology.md)
* [Video Analyzer Pipeline concepts](pipeline.md) 
* [Continuous video recording](continuous-video-recording.md)
* [Quickstart: Analyze live video with your own model - HTTP](analyze-live-video-use-your-model-http.md)
* [Quickstart: Track objects in a live video](track-objects-live-video.md)

## Prerequisites

Prerequisites for this tutorial are:
[!INCLUDE [prerequisites](./includes/common-includes/csharp-prerequisites.md)]

## Set up Azure resources

[![Deploy to Azure](https://aka.ms/deploytoazurebutton)](https://aka.ms/ava-click-to-deploy)
[!INCLUDE [resources](./includes/common-includes/azure-resources.md)]

## Overview
> [!div class="mx-imgBorder"]
> :::image type="content" source="./media/record-stream-inference-data-with-video/overview.svg" alt-text="Pipeline":::

The diagram is a pictorial representation of a [pipeline](pipeline.md) and additional modules that accomplish the desired scenario. Three IoT Edge modules are involved:
* Video Analyzer module.
* An edge module running an AI model behind an HTTP endpoint. This AI module uses the [YOLOv3](https://github.com/Azure/video-analyzer/tree/main/edge-modules/extensions/yolo/yolov3) model, which can detect many types of objects.
* An [RTSP simulator module](https://github.com/Azure/video-analyzer/tree/main/edge-modules/sources/rtspsim-live555) to simulate an RTSP camera.

As the diagram shows, you'll use an [RTSP source](pipeline.md#rtsp-source) node in the pipeline to capture the simulated live video of traffic on a highway and send that video to two paths:

* The first path is to a HTTP extension node. The HTTP extension node plays the role of a proxy. It converts every 10th video frame to the specified image type. Then it relays the image over HTTP to another edge module that runs an AI model behind a HTTP endpoint. In this example, that edge module is built by using the YOLOv3 model, which can detect many types of objects. The HTTP extension processor node gathers the detection results and sends these results and all the video frames (not just the 10th frame) to the object tracker node. The object tracker node uses optical flow techniques to track the object in the 9 frames that did not have the AI model applied to them. The tracker node publishes its results to the video sink node and the IoT Hub sink node. The [video sink](pipeline.md#video-sink) node will use the inference metadata from the object tracker node to be played back with the recorded video. The [IoT Hub message sink](pipeline.md#iot-hub-message-sink) node then sends those events to [IoT Edge Hub](../../iot-fundamentals/iot-glossary.md#iot-edge-hub).

* The second path is directly from the RTSP source to the video sink node to accomplish continuous video recording. The video that will be used in this tutorial is [a highway intersection sample video](https://lvamedia.blob.core.windows.net/public/camera-300s.mkv).

> [!VIDEO https://www.microsoft.com/en-us/videoplayer/embed/RE4LTY4]

In this tutorial, you will:

1. Setup your development environment.
1. Deploy the required edge modules.
1. Create and deploy the live pipeline.
1. Interpret the results.
1. Clean up resources.

## Set up your development environment
[!INCLUDE [setup development environment](./includes/set-up-dev-environment/csharp/csharp-set-up-dev-env.md)]

## Examine the sample files

In Visual Studio Code, browse to src/edge. You'll see the .env file that you created and a few deployment template files. This template defines which edge modules you'll deploy to the edge device (the Azure Linux VM). The .env file contains values for the variables used in these templates, such as Video Analyzer credentials.

Open src/edge/deployment.yolov3.template.json. There are three entries under the **modules** section that correspond to the items listed in the previous "Overview" section

* **avaedge**: This is the Video Analyzer on IoT Edge module.
* **yolov3**: This is the AI module built by using the YOLO v3 model.
* **rtspsim**: This is the RTSP simulator.


Next, browse to the src/cloud-to-device-console-app folder. Here you'll see the appsettings.json file that you created along with a few other files:

* **c2d-console-app.csproj**: The project file for Visual Studio Code.
* **operations.json**: This file lists the different operations that you would run.
* **Program.cs**: The sample program code, which:
    * Loads the app settings.

    * Invokes direct methods exposed by the Video Analyzer on IoT Edge module. You can use the module to analyze live video streams by invoking its [direct methods](direct-methods.md).

    * Pauses for you to examine the output from the program in the **TERMINAL** window and the events generated by the module in the **OUTPUT** window.
    * Invokes direct methods to clean up resources.

## Generate and deploy the IoT Edge deployment manifest 

1. Right-click the _src/edge/deployment.yolov3.template.json_ file and then select **Generate IoT Edge Deployment Manifest**.

   > [!div class="mx-imgBorder"]
   > :::image type="content" source="./media/analyze-live-video-use-your-model-http/generate-deployment-manifest.png" alt-text="Screenshot of Generate IoT Edge Deployment Manifest":::

    * The _deployment.yolov3.amd64.json_ manifest file is created in the _src/edge/config_ folder.
1. Right-click _src/edge/config/deployment.yolov3.amd64.json_ and select **Create Deployment for Single Device**.

   > [!div class="mx-imgBorder"]
   > :::image type="content" source="./media/analyze-live-video-use-your-model-http/deployment-single-device.png" alt-text= "Screenshot of Create Deployment for Single Device":::

1. When you're prompted to select an IoT Hub device, select **ava-sample-iot-edge-device**.
1. After about 30 seconds, in the lower-left corner of the window, refresh Azure IoT Hub. The edge device now shows the following deployed modules:

   - The **avaedge** module, which is the Video Analyzer module.
   - The **rtspsim** module, which simulates an RTSP server and acts as the source of a live video feed.
   - The **yolov3** module, which is the YoloV3 object detection model that applies computer vision to the images and returns multiple classes of object types

     > [!div class="mx-imgBorder"]
     > :::image type="content" source="./media/vscode-common-screenshots/avaextension.png" alt-text= "Screenshot of YoloV3 object detection model":::
     
## Create and deploy the live pipeline

### Edit the sample files

1. In Visual Studio Code, open the **Extensions** tab (or press Ctrl+Shift+X) and search for Azure IoT Hub.
1. Right click and select **Extension Settings**.

    > [!div class="mx-imgBorder"]
    > :::image type="content" source="./media/run-program/extensions-tab.png" alt-text="Extension Settings":::
1. Search and enable “Show Verbose Message”.

    > [!div class="mx-imgBorder"]
    > :::image type="content" source="./media/run-program/show-verbose-message.png" alt-text="Show Verbose Message":::
1. Go to src/cloud-to-device-console-app/operations.json.
1. Under the **pipelineTopologySet** node, edit the following
 
    `"pipelineTopologyUrl" : "https://raw.githubusercontent.com/Azure/video-analyzer/main/pipelines/live/topologies/cvr-with-httpExtension-and-objectTracking/topology.json" `
    
1. Next, under the **livePipelineSet** and **pipelineTopologyDelete** nodes, ensure that the value of **topologyName** matches the value of the **name** property in the above pipeline topology:

    `"pipelineTopologyName" : "CVRHttpExtensionObjectTracking"`
1. Open the [pipeline topology](https://raw.githubusercontent.com/Azure/video-analyzer/main/pipelines/live/topologies/cvr-with-httpExtension-and-objectTracking/topology.json) in a browser, and look at videoName - it is hard-coded to `sample-cvr-with-inference-metadata`. This is acceptable for a tutorial. In production, you would take care to ensure that each unique RTSP camera is recorded to a video resource with a unique name.  

1. Examine the settings for the HTTP extension node.

  ```=
     "samplingOptions":{
         "skipSamplesWithoutAnnotation":"false",
         "maximumSamplesPerSecond":"2"
    }
  ```

Here, `skipSamplesWithoutAnnotation` is set to `false` because the extension node needs to pass through all frames, whether or not they have inference results, to the downstream object tracker node. The object tracker is capable of tracking objects over 15 frames, approximately. Your AI model has a maximum FPS for processing, which is the highest value that `maximumSamplesPerSecond` should be set to.


## Run the sample program

1. Start a debugging session by selecting F5. You'll see some messages printed in the **TERMINAL** window.
1. The operations.json file starts off with calls to pipelineTopologyList and livePipelineList. If you've cleaned up resources after previous quickstarts or tutorials, this action returns empty lists and then pauses for you to select **Enter**, as shown:
    ```
    --------------------------------------------------------------------------
    Executing operation pipelineTopologyList
    -----------------------  Request: pipelineTopologyList  --------------------------------------------------
    {
      "@apiVersion": "1.0"
    }
    ---------------  Response: pipelineTopologyList - Status: 200  ---------------
    {
      "value": []
    }
    --------------------------------------------------------------------------
    Executing operation WaitForInput
    
    Press Enter to continue
    ```
1. After you select **Enter** in the **TERMINAL** window, the next set of direct method calls is made:
   * A call to pipelineTopologySet by using the previous pipelinetopologyUrl
   * A call to livePipelineSet by using the following body
     
        ```
        {
          "@apiVersion": "1.0",
          "name": "Sample-Pipeline-1",
          "properties": {
            "topologyName": "CVRHttpExtensionObjectTracking",
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
   * A call to livePipelineActivate that starts the live pipeline and the flow of video.
   * A second call to livePipelineList that shows that the live pipeline is in the running state.
1. The output in the TERMINAL window pauses at a Press Enter to continue prompt. Don't select Enter yet. Scroll up to see the JSON response payloads for the direct methods you invoked.
1. Switch to the OUTPUT window in Visual Studio Code. You see messages that the Video Analyzer on IoT Edge module is sending to the IoT hub.
1. The pipeline continues to run and print results. The RTSP simulator keeps looping the source video. To stop the live pipeline, return to the **TERMINAL** window and select Enter.
1. The next series of calls cleans up resources:

    * A call to livePipelineDeactivate deactivates the live pipeline.
    * A call to livePipelineDelete deletes the live pipeline.
    * A call to pipelineTopologyDelete deletes the pipeline topology.
    * A final call to pipelineTopologyList shows that the list is empty.       

## Interpret results

When you run the live pipeline, the results from the HTTP extension processor node pass through the object tracker node to the IoT Hub sink node to the IoT hub. The messages you see in the **OUTPUT** window contain a body section and an applicationProperties section. For more information, see [Create and read IoT Hub messages](../../iot-hub/iot-hub-devguide-messages-construct.md).

In the following messages, the Video Analyzer module defines the application properties and the content of the body.

## Diagnostics events
### MediaSessionEstablished event

When a live pipeline is activated, the RTSP source node attempts to connect to the RTSP server that runs on the rtspsim-live555 container. If the connection succeeds, then the following event is printed. The event type is Microsoft.VideoAnalyzer.Diagnostics.MediaSessionEstablished.

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

* The message is a diagnostics event. MediaSessionEstablished indicates that the RTSP source node (the subject) connected with the RTSP simulator and has begun to receive a (simulated) live feed.
* In applicationProperties, subject indicates that the message was generated from the RTSP source node in the live pipeline.
* In applicationProperties, eventType indicates that this event is a diagnostics event.
* The eventTime indicates the time when the event occurred.
* The body contains data about the diagnostics event. In this case, the data comprises the [Session Description Protocol (SDP)](https://en.wikipedia.org/wiki/Session_Description_Protocol) details.

## Operational events

### Object tracking events

The HTTP extension processor node sends the 0th, 15th, 30th, … etc. frames to the yolov3 module, and receives the inference results. It then sends these results and all video frames to the object tracker node. Suppose an object was detected on frame 0 – then the object tracker will assign a unique sequenceId to that object. Then, in frames 1, 2,…,14, if it can track that object, it will output a result with the same sequenceId. In the following snippets from the results, note how the `sequenceId` is repeated, but the location of the bounding box has changed, as the object is moving.

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

### RecordingStarted event
When the video sink node starts to record media, it emits this event of type **Microsoft.VideoAnalyzers.Pipeline.Operational.RecordingStarted**:

```
[IoTHubMonitor] [9:42:38 AM] Message received from [avasample-iot-edge-device/avaedge]:
{
  "body": {
    "outputType": "videoName",
    "outputLocation": "sample-cvr-with-inference-metadata"
  },
  "applicationProperties": {
    "topic": "/subscriptions/{subscriptionID}/resourceGroups/{resource-group-name}/providers/microsoft.media/videoAnalyzers/{ava-account-name}",
    "subject": "/edgeModules/avaedge/livePipelines/Sample-Pipeline-1/sinks/videoSink",
    "eventType": "Microsoft.VideoAnalyzers.Pipeline.Operational.RecordingStarted",
    "eventTime": "2021-04-09T09:42:38.1280000Z",
    "dataVersion": "1.0"
  }
}
```

The subject section in applicationProperties references the video sink node in the live pipeline, which generated this message.

The body section contains information about the output location. In this case, it's the name of the Video Analyzer resource into which video is recorded.

### RecordingAvailable event

As the name suggests, the RecordingStarted event is sent when recording has started, but media data might not have been uploaded to the video resource yet. When the video sink node has uploaded media, it emits an event of type **Microsoft.VideoAnalyzers.Pipeline.Operational.RecordingAvailable**:

```
[IoTHubMonitor] [[9:43:38 AM] Message received from [ava-sample-device/avaedge]:
{
  "body": {
    "outputType": "videoName",
    "outputLocation": "sample-cvr-with-inference-metadata"
  },
  "applicationProperties": {
    "topic": "/subscriptions/{subscriptionID}/resourceGroups/{resource-group-name}/providers/microsoft.media/videoAnalyzers/{ava-account-name}",
    "subject": "/edgeModules/avaedge/livePipelines/Sample-Pipeline-1/sinks/videoSink",
    "eventType": "Microsoft.VideoAnalyzers.Pipeline.Operational.RecordingAvailable",
    "eventTime": "2021-04-09T09:43:38.1280000Z",
    "dataVersion": "1.0"
  }
}
```

This event indicates that enough data was written to the video resource for players or clients to start playback of the video.

The subject section in applicationProperties references the video sink node in the live pipeline, which generated this message.

The body section contains information about the output location. In this case, it's the name of the Video Analyzer resource into which video is recorded.

### RecordingStopped event

When you deactivate the live pipeline, the video sink node stops recording media. It emits this event of type **Microsoft.VideoAnalyzers.Pipeline.Operational.RecordingStopped**:

```
[IoTHubMonitor] [11:33:31 PM] Message received from [ava-sample-device/avaedge]:
{
  "body": {
    "outputType": "videoName",
    "outputLocation": "sample-cvr-with-inference-metadata"
  },
  "applicationProperties": {
    "topic": "/subscriptions/{subscriptionID}/resourceGroups/{resource-group-name}/providers/microsoft.media/videoAnalyzers/{ava-account-name}",
    "subject": "/edgeModules/avaedge/livePipelines/Sample-Pipeline-1/sinks/videoSink",
    "eventType": "Microsoft.VideoAnalyzers.Pipeline.Operational.RecordingStopped",
    "eventTime": "2021-04-10T11:33:31.051Z",
    "dataVersion": "1.0"
  }
}
```

This event indicates that recording has stopped.

The subject section in applicationProperties references the video sink node in the live pipeline, which generated this message.

The body section contains information about the output location, which in this case is the name of the Video Analyzer resource into which video is recorded.

## Streaming the recording with visual inference metadata

You can examine the Video Analyzer video resource that was created by the live pipeline by logging in to the Azure portal and viewing the video.

1. Open your web browser, and go to the [Azure portal](https://portal.azure.com/). Enter your credentials to sign in to the portal. The default view is your service dashboard.
1. Locate your Video Analyzers account among the resources you have in your subscription, and open the account pane.
1. Select **Videos** in the **Video Analyzers** list.
1. You'll find a video listed with the name `sample-cvr-with-inference-metadata`. This is the name chosen in your pipeline topology file.
1. Select the video.
1. On the video details page, click the **Play** icon
1. To view the inference metadata as bounding boxes on the video, click the **bounding box** icon (circled in red)
   > [!div class="mx-imgBorder"]
   > :::image type="content" source="./media/record-stream-inference-data-with-video/video-playback.png" alt-text="Screenshot of video playback":::

[!INCLUDE [activate-deactivate-pipeline](./includes/common-includes/activate-deactivate-pipeline.md)]

## Clean up resources

[!INCLUDE [prerequisites](./includes/common-includes/clean-up-resources.md)]

## Next steps

* Use an [IP camera](https://en.wikipedia.org/wiki/IP_camera) with support for RTSP instead of using the RTSP simulator. You can search for IP cameras with RTSP support on the [ONVIF conformant products page](https://www.onvif.org/conformant-products/) by looking for devices that conform with profiles G, S, or T.
* Use an AMD64 or X64 Linux device (vs. using an Azure Linux VM). This device must be in the same network as the IP camera. Follow the instructions in [Install Azure IoT Edge runtime on Linux](../../iot-edge/how-to-install-iot-edge.md). Then follow the instructions in the [Deploy your first IoT Edge module to a virtual Linux device](../../iot-edge/quickstart-linux.md) quickstart to register the device with Azure IoT Hub.
 

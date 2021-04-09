---
title: Track objects in a live video with Azure Video Analyzer
description: This quickstart shows you how to use Azure Video Analyzer on IoT Edge to track objects in a live video feed from a (simulated) IP camera. You will see how to apply a computer vision model to detect objects in a subset of the frames in the live video feed. You can then use an object tracker node to track those objects in the other frames.
ms.topic: quickstart
ms.date: 04/01/2021
---

# Quickstart: Track objects in a live video

This quickstart shows you how to use Azure Video Analyzer on IoT Edge to track objects in a live video feed from a (simulated) IP camera. You will see how to apply a computer vision model to detect objects in a subset of the frames in the live video feed. You can then use an object tracker node to track those objects in the other frames.

The object tracker comes in handy when you need to detect objects in every frame, but the edge device does not have the necessary compute power to be able to apply the vision model on every frame. If the live video feed is at, say 30 frames per second, and you can only run your computer vision model on every 10th frame, the object tracker takes the results from one such frame, and then uses optical flow techniques to generate results for the 2nd, 3rd,…, 9th frame, until the model is applied again on the next frame.

This quickstart uses an Azure VM as an IoT Edge device, and it uses a simulated live video stream. It's based on sample code written in C#, and it builds on the Detect motion and emit events quickstart.

## Prerequisites

[!INCLUDE [prerequisites](./includes/common-includes/csharp-prerequisites.md)]

## Review the sample video

When you set up the Azure resources, a short video of a cafeteria is copied to the Linux VM in Azure that you're using as the IoT Edge device. This quickstart uses the video file to simulate a live stream.

Open an application such as VLC media player. Select Ctrl+N and then paste a link to the cafeteria sample video to start playback. You see the footage from a cafeteria, where a person walks in about 15 seconds into it.

In this quickstart, you'll use Azure Video Analyzer on IoT Edge along with another edge module that can detect objects such as persons. You will run the detection on a subset of frames, and use object tracker to get results in all frames. You will publish associated inference events to IoT Edge Hub.

## Overview

> [!div class="mx-imgBorder"]
> :::image type="content" source="./media/track-objects-live-video/overview.png" alt-text="Publish events":::

<!-- TODO: Replace the picture above -->

This diagram shows how the signals flow in this quickstart. An edge module simulates an IP camera hosting a Real-Time Streaming Protocol (RTSP) server. An RTSP source node pulls the video feed from this server and sends video frames to the gRPC extension processor node.

The gRPC extension node plays the role of a proxy. It converts every 10th video frame to the specified image type. Then it relays the image over gRPC to another edge module that runs an AI model behind a gRPC endpoint over a shared memory. In this example, that edge module is built by using the YOLOv3 model, which can detect many types of objects. The gRPC extension processor node gathers the detection results and sends these results and all the video frames (not just the 10th frame) to the object tracker node. The object tracker node uses optical flow techniques to track the object in the 9 frames that did not have the AI model applied to them. The tracker node publishes its results to the IoT Hub sink node. This IoT Hub sink node then sends those events to IoT Edge Hub.

In this quickstart, you will:

1. Create and deploy the media graph.
1. Interpret the results.
1. Clean up resources.

## Create and deploy the media graph

### Examine and edit the sample files

TODO: update text below with ARM templates/scripts

As part of the prerequisites, you downloaded the sample code to a folder. Follow these steps to examine and edit the sample files.

1. In Visual Studio Code, go to src/edge. You see your .env file and a few deployment template files.
The deployment.grpcyolov3icpu.template.json refers to the deployment manifest for the edge device. It includes some placeholder values. The .env file includes the values for those variables.
1. Go to the src/cloud-to-device-console-app folder. Here you see your appsettings.json file and a few other files:
    
    * c2d-console-app.csproj - The project file for Visual Studio Code.
    * operations.json - A list of the operations that you want the program to run.
    * Program.cs - The sample program code. This code:
            
        * Loads the app settings.
        * Invokes direct methods that the Azure Video Analyzer on IoT Edge module exposes. You can use the module to analyze live video streams by invoking its direct methods.
        * Pauses so that you can examine the program's output in the TERMINAL window and examine the events that were generated by the module in the OUTPUT window.
        * Invokes direct methods to clean up resources.
1. Edit the operations.json file:
    
    * Change the link to the graph topology:
    * "topologyUrl" : "https://raw.githubusercontent.com/Azure/live-video-analytics/master/MediaGraph/topologies/object-tracking-with-grpcExtension/2.0/topology.json"
    * Under livePipelineSet, edit the name of the graph topology to match the value in the preceding link:
    * "topologyName" : "ObjectTrackingWithGrpcExtension"
    * Under pipelineTopologyDelete, edit the name:
    * "name" : "ObjectTrackingWithGrpcExtension"
    
> [!NOTE]  
> Expand this and check out how the GrpcExtension node is implemented in the pipeline topology

### Generate and deploy the IoT Edge deployment manifest

1. Right-click the src/edge/deployment.grpcyolov3icpu.template.json file and then select Generate IoT Edge Deployment Manifest.

    > [!div class="mx-imgBorder"]
    > :::image type="content" source="./media/common-includes/generate-deployment-manifest.png" alt-text="Generate IoT Edge Deployment Manifest":::

    The `deployment.grpcyolov3icpu.amd64.json` manifest file is created in the `src/edge/config` folder.
1. If you completed the Detect motion and emit events quickstart, then skip this step.

    Otherwise, near the AZURE IOT HUB pane in the lower-left corner, select the More actions icon and then select Set IoT Hub Connection String. You can copy the string from the appsettings.json file. Or, to ensure you've configured the proper IoT hub within Visual Studio Code, use the Select IoT hub command.
     
    > [!div class="mx-imgBorder"]
    > :::image type="content" source="./media/common-includes/set-connection-string.png" alt-text="Set IoT Hub Connection String":::

    > [!NOTE]  
    > You might be asked to provide Built-in endpoint information for the IoT Hub. To get that information, in Azure portal, navigate to your IoT Hub and look for Built-in endpoints option in the left navigation pane. Click there and look for the Event Hub-compatible endpoint under Event Hub compatible endpoint section. Copy and use the text in the box. The endpoint will look something like this:
    
    `Endpoint=sb://iothub-ns-xxx.servicebus.windows.net/;SharedAccessKeyName=iothubowner;SharedAccessKey=XXX;EntityPath=<IoT Hub name>`  
1. Right-click `src/edge/config/deployment.grpcyolov3icpu.amd64.json` and select **Create Deployment for Single Device**.

    > [!div class="mx-imgBorder"]
    > :::image type="content" source="./media/common-includes/deployment-single-device.png" alt-text= "Create Deployment for Single Device":::
1. When you're prompted to select an IoT Hub device, select ava-sample-device.
1. After about 30 seconds, in the lower-left corner of the window, refresh Azure IoT Hub. The edge device now shows the following deployed modules:

    * The Live Video Analytics module, named avaEdge.
    * The rtspsim module, which simulates an RTSP server and acts as the source of a live video feed.
        
    > [!NOTE]  
    > The above steps are assuming you are using the virtual machine created by the setup script. If you are using your own edge device instead, go to your edge device and run the following commands with admin rights, to pull and store the sample video file used for this quickstart:
    
    ```
    mkdir /home/lvaedgeuser/samples
    mkdir /home/lvaedgeuser/samples/input    
    curl https://lvamedia.blob.core.windows.net/public/XXXXX.mkv > /home/lvaedgeuser/samples/input/XXXX.mkv  
    chown -R lvalvaedgeuser:localusergroup /home/lvaedgeuser/samples/  
    ```
    * The avaExtension module, which is the YOLOv3 object detection model that uses gRPC as the communication method and applies computer vision to the images and returns multiple classes of object types.
  
        > [!div class="mx-imgBorder"]
        > :::image type="content" source="./media/common-includes/object-detection-model.png" alt-text= "YoloV3 object detection model":::

<!-- TODO: Need a new image with avaEdge, avaExtension-->

## Prepare to monitor events

1. In Visual Studio Code, open the Extensions tab (or press Ctrl+Shift+X) and search for Azure IoT Hub.
1. Right-click and select Extension Settings.

    > [!div class="mx-imgBorder"]
    > :::image type="content" source="./media/common-includes/extension-settings.png" alt-text= "VS Extension Settings":::
1. Search and enable “Show Verbose Message”.

    > [!div class="mx-imgBorder"]
    > :::image type="content" source="./media/common-includes/verbose-message.png" alt-text= "Show Verbose Message"::: 
1. Right-click the Live Video Analytics device and select Start Monitoring Built-in Event Endpoint. You need this step to monitor the IoT Hub events in the OUTPUT window of Visual Studio Code.

    > [!div class="mx-imgBorder"]
    > :::image type="content" source="./media/common-includes/monitor-event-endpoint.png" alt-text= "Start Monitoring Built-in Event Endpoint":::
 
    > [!NOTE]  
    > You might be asked to provide Built-in endpoint information for the IoT Hub. To get that information, in Azure portal, navigate to your IoT Hub and look for Built-in endpoints option in the left navigation pane. Click there and look for the Event Hub-compatible endpoint under Event Hub compatible endpoint section. Copy and use the text in the box. The endpoint will look something like this:
    
    `Endpoint=sb://iothub-ns-xxx.servicebus.windows.net/;SharedAccessKeyName=iothubowner;SharedAccessKey=XXX;EntityPath=<IoT Hub name>`

## Run the sample program

1. To start a debugging session, select the F5 key. You see messages printed in the TERMINAL window.
1. The operations.json code starts off with calls to the direct methods pipelineTopologyList and livePipelineList. If you cleaned up resources after you completed previous quickstarts, then this process will return empty lists and then pause. To continue, select the Enter key.

```
-------------------------------Executing operation pipelineTopologyList-----------------------  
Request: pipelineTopologyList  --------------------------------------------------
{
"@apiVersion": "2.0"
}
---------------  
Response: pipelineTopologyList - Status: 200  ---------------
{
"value": []
}
--------------------------------------------------------------------------
Executing operation WaitForInput
```

Press Enter to continue

The TERMINAL window shows the next set of direct method calls:

* A call to pipelineTopologySet that uses the preceding topologyUrl
* A call to livePipelineSet that uses the following body:
    
    ```json
    {
      "@apiVersion": "1.0",
      "name": "Sample-Graph-1",
      "properties": {
        "topologyName": "ObjectTrackingWithGrpcExtension",
        "description": "Sample graph description",
        "parameters": [
          {
            "name": "rtspUrl",
            "value": "rtsp://rtspsim:554/media/XXXXXXXX.mkv"
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
    * A call to livePipelineActivate that starts the graph instance and the flow of video.
    * A second call to livePipelineList that shows that the graph instance is in the running state.
1. The output in the TERMINAL window pauses at a Press Enter to continue prompt. Don't select Enter yet. Scroll up to see the JSON response payloads for the direct methods you invoked.
1. Switch to the OUTPUT window in Visual Studio Code. You see messages that the Azure Video Analyzer on IoT Edge module is sending to the IoT hub. The following section of this quickstart discusses these messages.
1. The media graph continues to run and print results. The RTSP simulator keeps looping the source video. To stop the media graph, return to the TERMINAL window and select Enter.
1. The next series of calls cleans up resources:

    * A call to livePipelineDeactivate deactivates the graph instance.
    * A call to livePipelineDelete deletes the instance.
    * A call to pipelineTopologyDelete deletes the topology.
    * A final call to pipelineTopologyList shows that the list is empty.
    
## Interpret results

When you run the media graph, the results from the HTTP extension processor node pass through the IoT Hub sink node to the IoT hub. The messages you see in the OUTPUT window contain a body section and an applicationProperties section. For more information, see Create and read IoT Hub messages.

In the following messages, the Live Video Analytics module defines the application properties and the content of the body.

### MediaSessionEstablished event

When a media graph is instantiated, the RTSP source node attempts to connect to the RTSP server that runs on the rtspsim-live555 container. If the connection succeeds, then the following event is printed. The event type is Microsoft.VideoAnalyzer.Diagnostics.MediaSessionEstablished.

```
[IoTHubMonitor] [9:42:18 AM] Message received from [lvaedgesample/lvaEdge]:
{  "body": {
    "sdp": "SDP:\nv=0\r\no=- 1586450538111534 1 IN IP4 nnn.nn.0.6\r\ns=Matroska video+audio+(optional)subtitles, streamed by the LIVE555 Media Server\r\ni=media/camera-300s.mkv\r\nt=0 0\r\na=tool:LIVE555 Streaming Media v2020.03.06\r\na=type:broadcast\r\na=control:*\r\na=range:npt=0-300.000\r\na=x-qt-text-nam:Matroska video+audio+(optional)subtitles, streamed by the LIVE555 Media Server\r\na=x-qt-text-inf:media/camera-300s.mkv\r\nm=video 0 RTP/AVP 96\r\nc=IN IP4 0.0.0.0\r\nb=AS:500\r\na=rtpmap:96 H264/90000\r\na=fmtp:96 packetization-mode=1;profile-level-id=4D0029;sprop-parameter-sets=Z00AKeKQCgC3YC3AQEBpB4kRUA==,aO48gA==\r\na=control:track1\r\n"
  },
  "applicationProperties": {
    "dataVersion": "1.0",
    "topic": "/subscriptions/{subscriptionID}/resourceGroups/{name}/providers/ Microsoft.Media/videoAnalyzers/{name}/edgeModules/lva-sample-device",
    "subject": "/livePipelines/{name}/sources/rtspSource ",
    "eventType": "Microsoft.VideoAnalyzer.Diagnostics.MediaSessionEstablished",
    "eventTime": "2020-04-09T16:42:18.1280000Z"
  }
}
```

In this message, notice these details:

* The message is a diagnostics event. MediaSessionEstablished indicates that the RTSP source node (the subject) connected with the RTSP simulator and has begun to receive a (simulated) live feed.
* In applicationProperties, subject indicates that the message was generated from the RTSP source node in the media graph.
* In applicationProperties, eventType indicates that this event is a diagnostics event.
* The eventTime indicates the time when the event occurred.
* The body contains data about the diagnostics event. In this case, the data comprises the Session Description Protocol (SDP) details.

## Object Tracking events

The gRPC extension processor node sends the 0th, 10th, 20th, … etc. frames to the avaExtension module, and receives the inference results. It then sends these results and all video frames to the object tracker node. Suppose an object was detected on frame 0 – then the object tracker will assign a unique sequenceId to that object. Then, in frames 1, 2,…,9, if it can track that object, it will output a result with the same sequenceId. In the following snippets from the results, note how the sequenceId is repeated, but the location of the bounding box has changed, as the object is moving.

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

[!INCLUDE [prerequisites](./includes/common-includes/clean-up-resources..md)]

## Next steps

* Try running different pipeline topologies using gRPC protocol.
* Build and run sample Azure Video Analyzer (AVA) extensions

Try our Jupyter sample notebooks that enable you to build and run ONNX-based YOLO models as Azure Video Analyzer (AVA) extension.

* Sample YOLOv3 model
* Sample YOLOv4 model



---
title: Detect when objects cross a virtual line in a live video 
description: This quickstart shows you how to use Azure Video Analyzer to detect when objects cross a line in a live video feed from a (simulated) IP camera.
ms.topic: tutorial
ms.date: 11/04/2021
ms.custom: ignite-fall-2021
---

# Tutorial: Detect when objects cross a virtual line in a live video

[!INCLUDE [header](includes/edge-env.md)]

[!INCLUDE [deprecation notice](../includes/deprecation-notice.md)]

This tutorial shows you how to use Azure Video Analyzer detect when objects cross a virtual line in a live video feed from a (simulated) IP camera. You will see how to apply a computer vision model to detect objects in a subset of the frames in the live video feed. You can then use an object tracker node to track those objects in the other frames and send the results to a line crossing node.

The line crossing node enables you to detect when objects cross the virtual line. The events contain the direction (clockwise, counterclockwise) and a total counter per direction.  

This tutorial uses an Azure VM as an IoT Edge device, and it uses a simulated live video stream.

## Prerequisites

[!INCLUDE [prerequisites](./includes/common-includes/csharp-prerequisites.md)]

## Set up Azure resources

[![Deploy to Azure](https://aka.ms/deploytoazurebutton)](https://aka.ms/ava-click-to-deploy)

[!INCLUDE [resources](./includes/common-includes/azure-resources.md)]

## Overview

> [!div class="mx-imgBorder"]
> :::image type="content" source="./media/track-objects-live-video/line-crossing-tracker-topology.png" alt-text="Detect when objects cross a virtual line in live video.":::

This diagram shows how the signals flow in this tutorial. An [edge module](https://github.com/Azure/video-analyzer/tree/main/edge-modules/sources/rtspsim-live555) simulates an IP camera hosting a Real-Time Streaming Protocol (RTSP) server. An [RTSP source](../pipeline.md#rtsp-source) node pulls the video feed from this server and sends video frames to the [HTTP extension processor](../pipeline.md#http-extension-processor) node.

The HTTP extension node plays the role of a proxy. It converts every 10th video frame to the specified image type. Then it relays the image over HTTP to another edge module that runs an AI model behind an HTTP endpoint. In this example, that edge module is built by using the [YOLOv3](https://github.com/Azure/video-analyzer/tree/main/edge-modules/extensions/yolo/yolov3) model, which can detect many types of objects. The HTTP extension processor node gathers the detection results and sends these results and all the video frames (not just the 10th frame) to the object tracker node. The object tracker node uses optical flow techniques to track the object in the 9 frames that did not have the AI model applied to them. The tracker node publishes its results to the IoT Hub message sink node. This [IoT Hub message sink](../pipeline.md#iot-hub-message-sink) node then sends those events to [IoT Edge Hub](../../../iot-fundamentals/iot-glossary.md?view=iotedge-2020-11&preserve-view=true#iot-edge-hub).

The line crossing node will receive the results from the upstream object tracker node. The output of the object tracker node contains the coordinates of the detected objects. These coordinates are evaluated by the line crossing node against the line coordinates. When objects cross the line, the line crossing node will emit an event. The events are sent to the IoT Edge Hub message sink. 

In this tutorial, you will:

1. Setup your development environment.
1. Deploy the required edge modules.
1. Create and deploy the live pipeline.
1. Interpret the results.
1. Understand how to calculate coordinates.
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
    * The **avaextension** module, which is the YOLOv3 object detection model that applies computer vision to images and returns multiple classes of object types

        > [!div class="mx-imgBorder"]
        > :::image type="content" source="./media/vscode-common-screenshots/avaextension.png" alt-text= "YoloV3 object detection model":::


## Create and deploy the live pipeline

### Review sample video

When you set up the Azure resources, a short video of highway traffic is copied to the Linux VM in Azure that you're using as the IoT Edge device. This tutorial uses the video file to simulate a live stream.

Open an application such as [VLC media player](https://www.videolan.org/vlc/). Select Ctrl+N and then paste a link to [the highway intersection sample video](https://avamedia.blob.core.windows.net/public/camera-300s.mkv) to start playback. You see the footage of many vehicles moving in highway traffic.

> [!VIDEO https://www.microsoft.com/videoplayer/embed/RE4LTY4]

### Examine and edit the sample files

In Visual Studio Code, browse to the src/cloud-to-device-console-app folder. Here you'll see the appsettings.json file that you created along with a few other files:

* **c2d-console-app.csproj**: The project file for Visual Studio Code.
* **operations.json**: This file lists the different operations that you would run.
* **Program.cs**: The sample program code, which:
    * Loads the app settings.
    * Invokes direct methods exposed by Video Analyzer edge module. You can use the module to analyze live video streams by invoking its [direct methods](direct-methods.md).
    * Pauses for you to examine the output from the program in the **TERMINAL** window and the events generated by the module in the **OUTPUT** window.
    * Invokes direct methods to clean up resources.

1. Edit the operations.json file:
    
    * Change the link to the pipeline topology:
    * `"pipelineTopologyUrl" : "https://raw.githubusercontent.com/Azure/video-analyzer/main/pipelines/live/topologies/line-crossing/topology.json"`
    * Under `livePipelineSet`, edit the name of the topology to match the value in the preceding link:
    * `"topologyName" : "LineCrossingWithHttpExtension"`
    * Under `pipelineTopologyDelete`, edit the name:
    * `"name" : "LineCrossingWithHttpExtension"`
    
Open the URL for the pipeline topology in a browser, and examine the settings for the HTTP extension node.

```
   "samplingOptions":{
       "skipSamplesWithoutAnnotation":"false",
       "maximumSamplesPerSecond":"2"
   }
```

Here, `skipSamplesWithoutAnnotation` is set to `false` because the extension node needs to pass through all frames, whether or not they have inference results, to the downstream object tracker node. The object tracker is capable of tracking objects over 15 frames, approximately. Your AI model has a maximum FPS for processing, which is the highest value that `maximumSamplesPerSecond` should be set to.

Also look at the line crossing node parameter placeholders `linecrossingName` and `lineCoordinates`. We have provided default values for these parameters but you overwrite them using the operations.json file. Look at how we pass other parameters from the operations.json file to a topology (i.e. rtsp url).  

 
## Run the sample program

1. To start a debugging session, select the F5 key. You see messages printed in the **TERMINAL** window.
1. The operations.json code starts off with calls to the direct methods `pipelineTopologyList` and `livePipelineList`. If you cleaned up resources after you completed previous quickstarts/tutorials, then this process will return empty lists and then pause. To continue, select the Enter key.
    
    ```
    -------------------------------Executing operation pipelineTopologyList-----------------------  
    Request: pipelineTopologyList  --------------------------------------------------
    {
    "@apiVersion": "1.1"
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
    "@apiVersion": "1.1",
    "name": "Sample-Pipeline-1",
    "properties": {
      "topologyName": "LineCrossingWithHttpExtension",
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
    * A call to `livePipelineActivate` that starts the live pipeline and the flow of video.
    * A second call to `livePipelineList` that shows that the live pipeline is in the running state.
1. The output in the TERMINAL window pauses at a Press Enter to continue prompt. Don't select Enter yet. Scroll up to see the JSON response payloads for the direct methods you invoked.
1. Switch to the OUTPUT window in Visual Studio Code. You see messages that the Video Analyzer module is sending to the IoT hub. The following section of this tutorial discusses these messages.
1. The live pipeline continues to run and print results. The RTSP simulator keeps looping the source video. To stop the live pipeline, return to the **TERMINAL** window and select Enter.
1. The next series of calls cleans up resources:

    * A call to `livePipelineDeactivate` deactivates the live pipeline.
    * A call to `livePipelineDelete` deletes the live pipeline.
    * A call to `pipelineTopologyDelete` deletes the pipeline topology.
    * A final call to `pipelineTopologyList` shows that the list is empty.
    
## Interpret results

When you run the live pipeline, the results from the HTTP extension processor node pass through the IoT Hub message sink node to the IoT hub. The messages you see in the **OUTPUT** window contain a `body` section and an `applicationProperties` section. For more information, see [Create and read IoT Hub messages](../../../iot-hub/iot-hub-devguide-messages-construct.md).

In the following messages, the Video Analyzer module defines the application properties and the content of the body.

### MediaSessionEstablished event

When a live pipeline is activated, the RTSP source node attempts to connect to the RTSP server that runs on the rtspsim-live555 container. If the connection succeeds, then the following event is printed. The event type is **MediaSessionEstablished**.

```
[IoTHubMonitor] [9:42:18 AM] Message received from [avasample-iot-edge-device/avaedge]:
{  "body": {
    "sdp": "SDP:\nv=0\r\no=- 1586450538111534 1 IN IP4 nnn.nn.0.6\r\ns=Matroska video+audio+(optional)subtitles, streamed by the LIVE555 Media Server\r\ni=media/cafetaria-01.mkv\r\nt=0 0\r\na=tool:LIVE555 Streaming Media v2020.03.06\r\na=type:broadcast\r\na=control:*\r\na=range:npt=0-300.000\r\na=x-qt-text-nam:Matroska video+audio+(optional)subtitles, streamed by the LIVE555 Media Server\r\na=x-qt-text-inf:media/camera-300s.mkv\r\nm=video 0 RTP/AVP 96\r\nc=IN IP4 0.0.0.0\r\nb=AS:500\r\na=rtpmap:96 H264/90000\r\na=fmtp:96 packetization-mode=1;profile-level-id=4D0029;sprop-parameter-sets=Z00AKeKQCgC3YC3AQEBpB4kRUA==,aO48gA==\r\na=control:track1\r\n"
  },
  "applicationProperties": {
    "dataVersion": "1.0",
    "topic": "/subscriptions/{subscriptionID}/resourceGroups/{name}/providers/microsoft.media/videoAnalyzers/{ava-account-name}",
    "subject": "/edgeModules/avaedge/livePipelines/Sample-Pipeline-1/sources/rtspSource",
    "eventType": "Microsoft.VideoAnalyzer.Diagnostics.MediaSessionEstablished",
    "eventTime": "2021-05-06T17:33:09.554Z",
    "dataVersion": "1.0"
  },
  }
}
```

In this message, notice these details:

* The message is a diagnostics event. **MediaSessionEstablished** indicates that the RTSP source node (the subject) connected with the RTSP simulator and has begun to receive a (simulated) live feed.
* In `applicationProperties`, "subject" indicates that the message was generated from the RTSP source node in the live pipeline.
* In `applicationProperties`, "eventType" indicates that this event is a diagnostics event.
* The "eventTime" indicates the time when the event occurred.
* The body contains data about the diagnostics event. In this case, the data comprises the [Session Description Protocol (SDP)](https://en.wikipedia.org/wiki/Session_Description_Protocol) details.

## Line crossing events

The HTTP extension processor node sends the 0th, 15th, 30th, … etc. frames to the avaextension module, and receives the inference results. It then sends these results and all video frames to the object tracker node. The object tracker generates inference results for all frames (0, 1, 2,...) which are then examined by the line crossing node against the line coordinates as specified in the topology. When objects cross these coordinates an events is triggered. The event looks like this:
```
{
  "body": {
    "timestamp": 145865319410261,
    "inferences": [
      {
        "type": "event",
        "subtype": "lineCrossing",
        "inferenceId": "8f4f7b25d6654536908bcfe34374a15e",
        "relatedInferences": [
          "c9ea5decdd6a487089ded249c748cf5b"
        ],
        "event": {
          "name": "LineCrossing1",
          "properties": {
            "counterclockwiseTotal": "35",
            "direction": "counterclockwise",
            "total": "38",
            "clockwiseTotal": "3"
          }
        }
      }
    ]
  },
```
In this message, notice these details:
* the type is `event` with a subtype of `lineCrossing`.
* The event contains the `name` as specified in the topology of the line that was crossed.
* The `total` number of line crossings in any direction.
* The number of `clockwiseTotal` crossings.
* The number of `counterclockwiseTotal` crossings.
* The `direction` contains the direction for this event.

> [!NOTE] 
> If you deployed Azure resources using the one-click deployment for this tutorial, a Standard DS1 Virtual Machine is created. However, to get accurate results from resource-intensive AI models like YOLO, you may have to increase the VM size. [Resize the VM](../../../virtual-machines/windows/resize-vm.md) to increase number of vcpus and memory based on your requirement. Then, reactivate the live pipeline to view inferences.

## Customize for your own environment

This tutorial will work with the provided sample video for which we have calculated the correct line coordinates of the line. When you examine the topology file you will see that the `lineCoordinates` parameter contains the following value:
`[[0.5,0.1], [0.5,0.9]]`

What does this value mean? When you want to draw a line on a 2D image you need two points, A and B, and between those points you will have an imaginary line. Each point will have its own x and y coordinates to determine where it is with respect to the full image resolution. In this case point A is `[0.5,0.1]` and point B is `[0.5,0.9]`. A visual representation of the that line looks like this:
> [!div class="mx-imgBorder"]
> :::image type="content" source="./media/track-objects-live-video/line-crossing-visual-example.png" alt-text="A visual example showing a line crossing on a picture.":::

In this image you see the line between point A and point B. Any object that moves across the line will create an event with its properties like direction as discussed earlier in this tutorial. Also notice the x and y axis in the bottom left corner. This is just for illustration to explain how we normalize the coordinates to the values we expect for the line crossing node. 

Here is an example calculation:
Lets say that the video resolution is 1920 x 1080. 1920 and 1080 being the number of pixels along the x and y axis respectively.
Create an image from a frame of the video you plan to use. 
Now open that image in an image editor program (i.e. MSPaint). Move you cursor to the location where you want to specify point A. In the bottom left corner you will see the x and y coordinates for that cursor position.
> [!div class="mx-imgBorder"]
> :::image type="content" source="./media/track-objects-live-video/line-crossing-mspaint-coordinates.png" alt-text="A visual example for line crossing using MSPaint.":::

Note down these values and repeat the same for point B and note down the same values. By now you should have the x and y values for point A and the x and y values for point B.
For example:
point A: x=1024, y=96
Point B: x=1024, y=960
These values do not look like values that would go into the line crossing node since we need numbers between 0 and 1. To calculate this you apply the following formula:

`x coordinate / image resolution along x axis`, which, in our example is `1024/1920 = 0.5`. Now do the same for y:`96/1080=0.1`. These are the normalized coordinates for point A. Repeat this for point B. You will end up with an array of values between 0 and 1 `[[0.5,0.1], [0.5,0.9]]` as shown earlier in this tutorial.

## Clean up resources

[!INCLUDE [prerequisites](./includes/common-includes/clean-up-resources.md)]

## Next steps

* Try running different videos through the live pipeline.

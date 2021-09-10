---
title: Event-based video recording to the cloud and playback from the cloud tutorial - Azure
description: In this tutorial, you'll learn how to use Azure Video Analyzer to record an event-based video recording to the cloud and play it back from the cloud.
ms.topic: tutorial
ms.date: 06/01/2021

---
# Tutorial: Event-based video recording and playback

In this tutorial, you'll learn how to use Azure Video Analyzer to selectively record portions of a live video source to Video Analyzer in the cloud. This use case is referred to as [event-based video recording](event-based-video-recording-concept.md) (EVR) in this tutorial. To record portions of a live video, you'll use an object detection AI model to look for objects in the video and record video clips only when a certain type of object is detected. You'll also learn about how to play back the recorded video clips by using Video Analyzer. This capability is useful for a variety of scenarios where there's a need to keep an archive of video clips of interest. 



[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

## Suggested pre-reading  

Read these articles before you begin:

* [Azure Video Analyzer overview](overview.md)
* [Azure Video Analyzer terminology](terminology.md)
* [Video Analyzer Pipeline concepts](pipeline.md) 
* [Event-based video recording](event-based-video-recording-concept.md)
* [Tutorial: Developing an IoT Edge module](../../iot-edge/tutorial-develop-for-linux.md)
* [How to edit deployment.*.template.json](https://github.com/microsoft/vscode-azure-iot-edge/wiki/How-to-edit-deployment.*.template.json)
* Section on [how to declare routes in IoT Edge deployment manifest](../../iot-edge/module-composition.md#declare-routes)

## Prerequisites

Prerequisites for this tutorial are:
* An Azure account that includes an active subscription. [Create an account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) for free if you don't already have one.

    [!INCLUDE [azure-subscription-permissions](./includes/common-includes/azure-subscription-permissions.md)]
* [Install Docker](https://docs.docker.com/desktop/#download-and-install) on your machine.
* [Visual Studio Code](https://code.visualstudio.com/), with the following extensions:
    * [Azure IoT Tools](https://marketplace.visualstudio.com/items?itemName=vsciot-vscode.azure-iot-tools)
    * [C#](https://marketplace.visualstudio.com/items?itemName=ms-dotnettools.csharp)
* [.NET Core 3.1 SDK](https://dotnet.microsoft.com/download/dotnet-core/3.1).

## Set up Azure resources

[![Deploy to Azure](https://aka.ms/deploytoazurebutton)](https://aka.ms/ava-click-to-deploy)
[!INCLUDE [resources](./includes/common-includes/azure-resources.md)]

## Overview

Event-based video recording refers to the process of recording video triggered by an event. That event could be generated from:
- Processing of the video signal itself, for example, upon detecting a moving object in the video.
- An independent source, for example, the opening of a door. 

Alternatively, you can trigger recording only when an inferencing service detects that a specific event has occurred. In this tutorial, you'll use a video of vehicles moving on a freeway and record video clips whenever a truck is detected.

> [!div class="mx-imgBorder"]
> :::image type="content" source="./media/event-based-video-recording/overview.svg" alt-text="Pipeline":::

The diagram is a pictorial representation of a [pipeline](pipeline.md) and additional modules that accomplish the desired scenario. Four IoT Edge modules are involved:

* Video Analyzer on an IoT Edge module.
* An edge module running an AI model behind an HTTP endpoint. This AI module uses the [YOLOv3](https://github.com/Azure/video-analyzer/tree/main/edge-modules/extensions/yolo/yolov3) model, which can detect many types of objects.
* A custom module to count and filter objects, which is referred to as an Object Counter in the diagram. You'll build an Object Counter and deploy it in this tutorial.
* An [RTSP simulator module](https://github.com/Azure/video-analyzer/tree/main/edge-modules/sources/rtspsim-live555) to simulate an RTSP camera.
    
As the diagram shows, you'll use an [RTSP source](pipeline.md#rtsp-source) node in the pipeline to capture the simulated live video of traffic on a highway and send that video to two paths:

* The first path is to a HTTP extension node. The node samples the video frames to a value set by you using the `samplingOptions` field and then relays the frames, as images, to the AI module YOLOv3, which is an object detector. The node receives the results, which are the objects (vehicles in traffic) detected by the model. The HTTP extension node then publishes the results via the IoT Hub message sink node to the IoT Edge hub.

* The objectCounter module is set up to receive messages from the IoT Edge hub, which include the object detection results (vehicles in traffic). The module checks these messages and looks for objects of a certain type, which were configured via a setting. When such an object is found, this module sends a message to the IoT Edge hub. Those "object found" messages are then routed to the IoT Hub source node of the pipeline. Upon receiving such a message, the IoT Hub source node in the pipeline triggers the [signal gate processor](pipeline.md#signal-gate-processor) node. The signal gate processor node then opens for a configured amount of time. Video flows through the gate to the video sink node for that duration. That portion of the live stream is then recorded via the [video sink](pipeline.md#video-sink) node to an [video](terminology.md#video) in your  Video Analyzer account. The video that will be used in this tutorial is [a highway intersection sample video](https://lvamedia.blob.core.windows.net/public/camera-300s.mkv).

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

Open src/edge/deployment.objectCounter.template.json. There are four entries under the **modules** section that correspond to the items listed in the previous "Overview" section

* **avaedge**: This is the Video Analyzer module.
* **yolov3**: This is the AI module built by using the YOLO v3 model.
* **rtspsim**: This is the RTSP simulator.
* **objectCounter**: This is the module that looks for specific objects in the results from yolov3.

For the objectCounter module, see the string (${MODULES.objectCounter}) used for the "image" value. This is based on the [tutorial](../../iot-edge/tutorial-develop-for-linux.md) on developing an IoT Edge module. Visual Studio Code automatically recognizes that the code for the objectCounter module is under src/edge/modules/objectCounter. 

Read [this section](../../iot-edge/module-composition.md#declare-routes) on how to declare routes in the IoT Edge deployment manifest. Then examine the routes in the template JSON file. Note how:

> [!NOTE]
> Check the desired properties for the objectCounter module, which are set up to look for objects that are tagged as "truck" with a confidence level of at least 50%.

Next, browse to the src/cloud-to-device-console-app folder. Here you'll see the appsettings.json file that you created along with a few other files:

* **c2d-console-app.csproj**: The project file for Visual Studio Code.
* **operations.json**: This file lists the different operations that you would run.
* **Program.cs**: The sample program code, which:
    * Loads the app settings.

    * Invokes direct methods exposed by the Video Analyzer module. You can use the module to analyze live video streams by invoking its [direct methods](direct-methods.md).

    * Pauses for you to examine the output from the program in the **TERMINAL** window and the events generated by the module in the **OUTPUT** window.
    * Invokes direct methods to clean up resources.

## Generate and deploy the IoT Edge deployment manifest 

The deployment manifest defines what modules are deployed to an edge device and the configuration settings for those modules. Follow these steps to generate a manifest from the template file, and then deploy it to the edge device.

Using Visual Studio Code, follow [these instructions](../../iot-edge/tutorial-develop-for-linux.md#build-and-push-your-solution) to sign in to Docker. Then select **Build and Push IoT Edge Solution**. Use src/edge/deployment.objectCounter.template.json for this step.

> [!div class="mx-imgBorder"]
> :::image type="content" source="./media/event-based-video-recording/build-push.png" alt-text="Build and push IoT Edge solution":::

This action builds the objectCounter module for object counting and pushes the image to your Azure Container Registry.

* Check that you have the environment variables CONTAINER_REGISTRY_USERNAME_myacr and CONTAINER_REGISTRY_PASSWORD_myacr defined in the .env file.

This step creates the IoT Edge deployment manifest at src/edge/config/deployment.objectCounter.amd64.json. Right-click that file, and select **Create Deployment for Single Device**.

> [!div class="mx-imgBorder"]
> :::image type="content" source="./media/event-based-video-recording/create-deployment-single-device.png" alt-text="Create deployment for single device":::

If this is your first tutorial with Video Analyzer, Visual Studio Code prompts you to input the IoT Hub connection string. You can copy it from the appsettings.json file.

[!INCLUDE [provide-builtin-endpoint](./includes/common-includes/provide-builtin-endpoint.md)]

Next, Visual Studio Code asks you to select an IoT Hub device. Select your IoT Edge device, which should be avasample-iot-edge-device.

At this stage, the deployment of edge modules to your IoT Edge device has started.
In about 30 seconds, refresh Azure IoT Hub in the lower-left section in Visual Studio Code. You should see that there are six modules deployed named $edgeAgent, $edgeHub avaedge, rtspsim, yolov3, and objectCounter.

> [!div class="mx-imgBorder"]
> :::image type="content" source="./media/event-based-video-recording/modules.png" alt-text="Four modules deployed":::

## Run the program

1. In Visual Studio Code, open the **Extensions** tab (or press Ctrl+Shift+X) and search for Azure IoT Hub.
1. Right click and select **Extension Settings**.

    > [!div class="mx-imgBorder"]
    > :::image type="content" source="./media/run-program/extensions-tab.png" alt-text="Extension Settings":::
1. Search and enable “Show Verbose Message”.

    > [!div class="mx-imgBorder"]
    > :::image type="content" source="./media/run-program/show-verbose-message.png" alt-text="Show Verbose Message":::
1. Go to src/cloud-to-device-console-app/operations.json.
1. Under the **pipelineTopologySet** node, edit the following:


    `"pipelineTopologyUrl" : "https://raw.githubusercontent.com/Azure/video-analyzer/main/pipelines/live/topologies/evr-hubMessage-video-sink/topology.json" `
    
1. Next, under the **livePipelineSet** and **pipelineTopologyDelete** nodes, ensure that the value of **topologyName** matches the value of the **name** property in the above pipeline topology:

    `"pipelineTopologyName" : "EVRtoVideoSinkOnObjDetect"`
1. Open the [pipeline topology](https://raw.githubusercontent.com/Azure/video-analyzer/main/pipelines/live/topologies/evr-hubMessage-video-sink/topology.json) in a browser, and look at videoName - it is hard-coded to `sample-evr-video`. This is acceptable for a tutorial. In production, you would take care to ensure that each unique RTSP camera is recorded to a video resource with a unique name.
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
            "topologyName": "EVRtoVideoSinkOnObjDetect",
            "description": "Sample topology description",
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
    
   * A call to livePipelineActivate to start the live pipeline and to start the flow of video
   * A second call to livePipelineList to show that the live pipeline is in the running state 
     
1. The output in the **TERMINAL** window pauses now at a **Press Enter to continue** prompt. Don't select **Enter** at this time. Scroll up to see the JSON response payloads for the direct methods you invoked.
1. If you now switch over to the **OUTPUT** window in Visual Studio Code, you'll see messages being sent to IoT Hub by the Video Analyzer module.

   These messages are discussed in the following section.
1. The live pipeline continues to run and record the video. The RTSP simulator keeps looping the source video. To stop recording, go back to the **TERMINAL** window and select **Enter**. The next series of calls are made to clean up resources by using:

   * A call to livePipelineDeactivate to deactivate the live pipeline.
   * A call to livePipelineDelete to delete the live pipeline.
   * A call to pipelineTopologyDelete to delete the topology.
   * A final call to pipelineTopologyList to show that the list is now empty.

## Interpret the results 

When you run the live pipeline, the Video Analyzer module sends certain diagnostic and operational events to the IoT Edge hub. These events are the messages you see in the **OUTPUT** window of Visual Studio Code. They contain a body section and an applicationProperties section. To understand what these sections represent, see [Create and read IoT Hub messages](../../iot-hub/iot-hub-devguide-messages-construct.md).

In the following messages, the application properties and the content of the body are defined by the Video Analyzer module.

## Diagnostics events

### MediaSessionEstablished event 

When the live pipeline is activated, the RTSP source node attempts to connect to the RTSP server running on the RTSP simulator container. If successful, it prints this event:

```
[IoTHubMonitor] [9:42:18 AM] Message received from [avasample-iot-edge-device/avaadge]:
{
  "body": {
    "sdp": "SDP:\nv=0\r\no=- 1586450538111534 1 IN IP4 XXX.XX.XX.XX\r\ns=Matroska video+audio+(optional)subtitles, streamed by the LIVE555 Media Server\r\ni=media/camera-300s.mkv\r\nt=0 0\r\na=tool:LIVE555 Streaming Media v2020.03.06\r\na=type:broadcast\r\na=control:*\r\na=range:npt=0-300.000\r\na=x-qt-text-nam:Matroska video+audio+(optional)subtitles, streamed by the LIVE555 Media Server\r\na=x-qt-text-inf:media/camera-300s.mkv\r\nm=video 0 RTP/AVP 96\r\nc=IN IP4 0.0.0.0\r\nb=AS:500\r\na=rtpmap:96 H264/90000\r\na=fmtp:96 packetization-mode=1;profile-level-id=4D0029;sprop-parameter-sets=XXXXXXXXXXXXXXXXXXXXXX\r\na=control:track1\r\n"
  },
  "applicationProperties": {
    "dataVersion": "1.0",
    "topic": "/subscriptions/{subscriptionID}/resourceGroups/{resource-group-name}/providers/microsoft.media/videoanalyzers/{ava-account-name}",
    "subject": "/edgeModules/avaedge/livePipelines/Sample-Pipeline-1/sources/rtspSource",
    "eventType": "Microsoft.VideoAnalyzers.Diagnostics.MediaSessionEstablished",
    "eventTime": "2021-04-09T09:42:18.1280000Z"
  }
}
```


* The message is a Diagnostics event (MediaSessionEstablished). It indicates that the RTSP source node (the subject) established a connection with the RTSP simulator and began to receive a (simulated) live feed.
* The subject section in applicationProperties references the node in the pipeline topology from which the message was generated. In this case, the message originates from the RTSP source node.
* The eventType section in applicationProperties indicates that this is a Diagnostics event.
* The eventTime section indicates the time when the event occurred.
* The body section contains data about the Diagnostics event, which in this case is the [SDP](https://en.wikipedia.org/wiki/Session_Description_Protocol) details.

## Operational events

After the pipeline runs for a while, eventually you'll get an event from the objectCounter module. 

```
[IoTHubMonitor] [5:53:44 PM] Message received from [avasample-iot-edge-device/objectCounter]:
{
  "body": {
    "count": 2
  },
  "applicationProperties": {
    "eventTime": "2020-05-17T17:53:44.062Z"
  }
}
```

The applicationProperties section contains the event time. This is the time when the objectCounter module observed that the results from the yolov3 module contained objects of interest (trucks).

You might see more of these events show up as other trucks are detected in the video.

### RecordingStarted event

Almost immediately after the Object Counter sends the event, you'll see an event of type **Microsoft.VideoAnalyzers.Pipeline.Operational.RecordingStarted**:

```
[IoTHubMonitor] [5:53:46 PM] Message received from [avasample-iot-edge-device/avaedge]:
{
  "body": {
    "outputType": "videoName",
    "outputLocation": "sample-evr-video"
  },
  "applicationProperties": {
    "topic": "/subscriptions/{subscriptionID}/resourceGroups/{resource-group-name}/providers/microsoft.media/videoanalyzers/{ava-account-name}",
    "subject": "/edgeModules/avaedge/livePipelines/Sample-Pipeline-1/sinks/videoSink",
    "eventType": "Microsoft.VideoAnalyzers.Pipeline.Operational.RecordingStarted",
    "eventTime": "2021-04-09T09:42:38.1280000Z",
    "dataVersion": "1.0"
  }
}
```

The subject section in applicationProperties references the video sink node in the live pipeline, which generated this message. The body section contains information about the output location. In this case, it's the name of the Video Analyzer video resource into which video is recorded.

### RecordingAvailable event

As the name suggests, the RecordingStarted event is sent when recording has started, but media data might not have been uploaded to the video resource yet. When the video sink node has uploaded media, it emits an event of type **Microsoft.VideoAnalyzers.Pipeline.Operational.RecordingAvailable**:

```
[IoTHubMonitor] [[9:43:38 AM] Message received from [avasample-iot-edge-device/avaedge]:
{
  "body": {
    "outputType": "videoName",
    "outputLocation": "sample-evr-video"
  },
  "applicationProperties": {
    "topic": "/subscriptions/{subscriptionID}/resourceGroups/{resource-group-name}/providers/microsoft.media/videoanalyzers/{ava-account-name}",
    "subject": "/edgeModules/avaedge/livePipelines/Sample-Pipeline-1/sinks/videoSink",
    "eventType": "Microsoft.VideoAnalyzers.Pipeline.Operational.RecordingAvailable",
    "eventTime": "2021-04-09T09:43:38.1280000Z",
    "dataVersion": "1.0"
  }
}
```

This event indicates that enough data was written to the video resource for players or clients to start playback of the video. The subject section in applicationProperties references the video sink node in the live pipeline, which generated this message. The body section contains information about the output location. In this case, it's the name of the Video Analyzer resource into which video is recorded.

### RecordingStopped event

When you deactivate the live pipeline, the video sink node stops recording media. It emits this event of type **Microsoft.VideoAnalyzers.Pipeline.Operational.RecordingStopped**:

```
[IoTHubMonitor] [11:33:31 PM] Message received from [avasample-iot-edge-device/avaedge]:
{
  "body": {
    "outputType": "videoName",
    "outputLocation": "sample-evr-video"
  },
  "applicationProperties": {
    "topic": "/subscriptions/{subscriptionID}/resourceGroups/{resource-group-name}/providers/microsoft.media/videoanalyzers/{ava-account-name}",
    "subject": "/livePipelines/Sample-Pipeline-1/sinks/videoSink",
    "eventType": "Microsoft.VideoAnalyzers.Pipeline.Operational.RecordingStopped",
    "eventTime": "2021-04-10T11:33:31.051Z",
    "dataVersion": "1.0"
  }
}
```

This event indicates that recording has stopped. The subject section in applicationProperties references the video sink node in the live pipeline, which generated this message. The body section contains information about the output location. In this case, it's the name of the Video Analyzer resource into which video is recorded.

## Playing back the recording

You can examine the Video Analyzer video resource that was created by the live pipeline by logging in to the Azure portal and viewing the video.
1. Open your web browser, and go to the [Azure portal](https://portal.azure.com/). Enter your credentials to sign in to the portal. The default view is your service dashboard.
1. Locate your Video Analyzer account among the resources you have in your subscription, and open the account pane.
1. Select **Videos** in the **Video Analyzers** list.
1. You'll find a video listed with the name `sample-evr-video`. This is the name chosen in your pipeline topology file.
1. Select the video.
1. The video details page will open and the playback should start automatically.

    <!--TODO: add image -- ![Video playback]() TODO: new screenshot is needed here -->

[!INCLUDE [activate-deactivate-pipeline](./includes/common-includes/activate-deactivate-pipeline.md)]

## Clean up resources

[!INCLUDE [clean-up-resources](./includes/common-includes/clean-up-resources.md)]

## Next steps

* Use an [IP camera](https://en.wikipedia.org/wiki/IP_camera) with support for RTSP instead of using the RTSP simulator. You can search for IP cameras with RTSP support on the [ONVIF conformant products page](https://www.onvif.org/conformant-products/) by looking for devices that conform with profiles G, S, or T.
* Use an AMD64 or X64 Linux device (vs. using an Azure Linux VM). This device must be in the same network as the IP camera. Follow the instructions in [Install Azure IoT Edge runtime on Linux](../../iot-edge/how-to-install-iot-edge.md). Then follow the instructions in the [Deploy your first IoT Edge module to a virtual Linux device](../../iot-edge/quickstart-linux.md) quickstart to register the device with Azure IoT Hub.

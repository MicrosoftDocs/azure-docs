---
title: Event-based video recording to cloud and playback from cloud tutorial - Azure
description: In this tutorial, you will learn how to use Live Video Analytics on IoT Edge to perform an event-based video recording to cloud and playback from cloud.
ms.topic: tutorial
ms.date: 05/27/2020

---
# Tutorial: Event-based video recording to cloud and playback from cloud

In this tutorial, you will learn how to use Live Video Analytics on IoT Edge to selectively record portions of a live video source to Media Services in the cloud. This use case is referred as [event based video recording](event-based-video-recording-concept.md) (EVR) in this tutorial. To accomplish this, you will use an object detection AI model to look for objects in the video, and record video clips only when a certain type of object is detected. You will also learn about how to playback the recorded video clips using Media Services. This is useful for a variety of scenarios where there is a need to keep an archive of video clips of interest.

> [!div class="checklist"]
> * Setup the relevant resources
> *	Examine the code that performs EVR
> *	Run the sample code
> *	Examine the results and view the video

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

## Suggested pre-reading  

It is recommended that you read through the following documentation pages

* [Live Video Analytics on IoT Edge overview](overview.md)
* [Live Video Analytics on IoT Edge terminology](terminology.md)
* [Media graph concepts](media-graph-concept.md) 
* [Event-based video recording](event-based-video-recording-concept.md)
* [Tutorial: developing an IoT Edge module](https://docs.microsoft.com/azure/iot-edge/tutorial-develop-for-linux)
* [How to edit deployment.*.template.json](https://github.com/microsoft/vscode-azure-iot-edge/wiki/How-to-edit-deployment.*.template.json)
* Section on [how to declare routes in IoT Edge deployment manifest](https://docs.microsoft.com/azure/iot-edge/module-composition#declare-routes)

## Prerequisites

Prerequisites for this tutorial are as follows

* [Visual Studio Code](https://code.visualstudio.com/) on your development machine with [Azure IoT Tools](https://marketplace.visualstudio.com/items?itemName=vsciot-vscode.azure-iot-tools) extension, and the [C#](https://marketplace.visualstudio.com/items?itemName=ms-dotnettools.csharp) extension.

    > [!TIP]
    > You might be prompted to install docker. You may ignore this prompt.
* [.NET Core 3.1 SDK](https://dotnet.microsoft.com/download/dotnet-core/thank-you/sdk-3.1.201-windows-x64-installer) on your development machine.
* Complete [Live Video Analytics resources setup script](https://github.com/Azure/live-video-analytics/tree/master/edge/setup) and [Set up the environment](https://review.docs.microsoft.com/en-us/azure/media-services/live-video-analytics-edge/detect-motion-emit-events-quickstart?branch=release-preview-media-services-lva#set-up-the-environment)

At the end of the above steps, you will have certain Azure resources deployed in the Azure subscription, including:

* IoT Hub
* Storage account
* Azure Media Services account
* Linux VM in Azure, with [IoT Edge runtime](https://docs.microsoft.com/azure/iot-edge/how-to-install-iot-edge-linux) installed

## Concepts

Event-based video recording (EVR) refers to the process of recording video triggered by an event. That event could be generated from processing of the video signal itself (for example, upon detecting a moving object in the video) or from an independent source (for example, opening of a door). Alternatively, you can trigger recording only when an inferencing service detects that a specific event has occurred.  In this tutorial you will use a video of vehicles moving on a freeway, and record video clips whenever a truck is detected.

![Media graph](./media/event-based-video-recording-tutorial/overview.png)

The diagram above is a pictorial representation of a [media graph](media-graph-concept.md) and additional modules that accomplish the desired scenario. There are four IoT Edge modules involved:

* Live Video Analytics on IoT Edge module.
* An Edge module running an AI model behind an HTTP endpoint. This AI module uses the [YOLOv3](https://github.com/Azure/live-video-analytics/tree/master/utilities/video-analysis/yolov3-onnx) model, which is capable of detecting many types of objects.
* A custom module to count and filter objects (referred to as Object Counter in the diagram above) that you will build and deploy in this tutorial.
* An [RTSP simulator module](https://github.com/Azure/live-video-analytics/tree/master/utilities/rtspsim-live555) to simulate an RTSP camera.
    
    As the diagram shows, you will use an [RTSP source](media-graph-concept.md#rtsp-source) node in the media graph to capture the simulated live video (of traffic on a highway), and send that video to two paths.

* First path is to a [frame rate filter processor](media-graph-concept.md#frame-rate-filter-processor) node that outputs video frames at the specified (reduced) frame rate. Those video frames are sent to an HTTP extension node, which then relays the frames (as images) to the AI module (YOLO v3 – which is an object detector) and receives results – which will be the objects (vehicles in traffic) detected by the model. The HTTP extension node then publishes the results via the IoT Hub message sink node to the IoT Edge Hub.
* The object counter module is set up to receive messages from the IoT Edge Hub – which include the object detection results (vehicles in traffic). It checks these messages looking for objects of a certain type (configured via a setting). When such an object is found, this module sends a message to IoT Edge Hub. Those "object found" messages are then routed to the IoT Hub source node of the media graph. Upon receiving such a message, the IoT Hub source node in the media graph triggers the [signal gate processor](media-graph-concept.md#signal-gate-processor) node, causing the latter to open for a configured amount of time. Video flows through the gate to the asset sink node for that duration. That portion of the live stream is then recorded via the [asset sink](media-graph-concept.md#asset-sink) node to an [asset](terminology.md#asset) in your Azure Media Service account.

## Set up your development environment

Before you begin, check that you have completed the 3rd bullet in [Prerequisites](#prerequisites). Once the resource setup script finishes, click on the curly brackets to expose the folder structure. You will see a few files created under the ~/clouddrive/lva-sample directory.

![App settings](./media/quickstarts/clouddrive.png)

Of interest in this tutorial are:

* ~/clouddrive/lva-sample/edge-deployment/.env  - contains properties that Visual Studio Code uses to deploy modules to an edge device.
* ~/clouddrive/lva-sample/appsetting.json - used by Visual Studio Code for running the sample code.

You will need these files for the steps below.

1. Clone the repo from here https://github.com/Azure-Samples/live-video-analytics-iot-edge-csharp.
1. Launch Visual Studio Code and open the folder where you downloaded the repo.
1. In Visual Studio Code, browse to "src/cloud-to-device-console-app" folder and create a file named "appsettings.json". This file will contain the settings needed to run the program.
1. Copy the contents from ~/clouddrive/lva-sample/appsettings.json file. The text should look like:

    ```
    {  
        "IoThubConnectionString" : "HostName=xxx.azure-devices.net;SharedAccessKeyName=iothubowner;SharedAccessKey=XXX",  
        "deviceId" : "lva-sample-device",  
        "moduleId" : "lvaEdge"  
    }
    ```

    The IoT Hub connection string lets you use Visual Studio Code to send commands to the Edge modules via Azure IoT Hub.
    
1. Next, browse to "src/edge" folder and create a file named ".env".
1. Copy the contents from ~/clouddrive/lva-sample/.env file. The text should look like:

    ```
    SUBSCRIPTION_ID="<Subscription ID>"  
    RESOURCE_GROUP="<Resource Group>"  
    AMS_ACCOUNT="<AMS Account ID>"  
    IOTHUB_CONNECTION_STRING="HostName=xxx.azure-devices.net;SharedAccessKeyName=iothubowner;SharedAccessKey=xxx"  
    AAD_TENANT_ID="<AAD Tenant ID>"  
    AAD_SERVICE_PRINCIPAL_ID="<AAD SERVICE_PRINCIPAL ID>"  
    AAD_SERVICE_PRINCIPAL_SECRET="<AAD SERVICE_PRINCIPAL ID>"  
    INPUT_VIDEO_FOLDER_ON_DEVICE="/home/lvaadmin/samples/input"  
    OUTPUT_VIDEO_FOLDER_ON_DEVICE="/home/lvaadmin/samples/output"  
    APPDATA_FOLDER_ON_DEVICE="/var/local/mediaservices"
    CONTAINER_REGISTRY_USERNAME_myacr="<your container registry username>"  
    CONTAINER_REGISTRY_PASSWORD_myacr="<your container registry username>"      
    ```

## Examine the template file 

In the previous step, you will have launched Visual Studio Code and opened the folder containing the sample code.

In Visual Studio Code, browse to "src/edge". You will see the .env file that you created, as well as a few deployment template files. This template defines which edge modules you will be deploying to the edge device (the Azure Linux VM). The .env file contains values for the variables used in these templates, such as the Media Service credentials.

Open “src/edge/deployment.objectCounter.template.json”. Note that there are four entries under the “modules” section – corresponding to the items listed above (in Concepts section):

* lvaEdge – this is the Live Video Analytics on IoT Edge module
* yolov3 – this is the AI module built using YOLO v3 model
* rtspsim – this is the RTSP simulator
* objectCounter – this is the module that looks for specific objects in the results from yolov3

For the objectCounter module, see the string (${MODULES.objectCounter}) used for the “image” value – this is based on the [tutorial](https://docs.microsoft.com/azure/iot-edge/tutorial-develop-for-linux) on developing an IoT Edge module. Visual Studio Code will automatically recognize that the code for the Object Counter module is under “src/edge/modules/objectCounter”. 

Read [this](https://docs.microsoft.com/azure/iot-edge/module-composition#declare-routes) section on how to declare routes in the IoT Edge deployment manifest and then examine the routes in the template JSON file. Note how:

* LVAToObjectCounter is used to send specific events to a specific endpoint in the objectCounter module.
* ObjectCounterToLVA is used to send a trigger event to a specific endpoint (which should be the IoT Hub Source node) in the lvaEdge module.
* objectCounterToIoTHub is used as a debug tool, to help you see the output from objectCounter when you run this tutorial.

> [!NOTE]
> Check the desired properties for the objectCounter module, which are set up to look for objects that are tagged as “truck”, with a confidence level of at least 50%.

## Generate and deploy the IoT Edge deployment manifest 

The deployment manifest defines what modules are deployed to an edge device, and configuration settings for those modules. Follow these steps to generate such a manifest from the template file, and then deploy it to the edge device.

Using Visual Studio Code, follow [these](https://docs.microsoft.com/azure/iot-edge/tutorial-develop-for-linux#build-and-push-your-solution) instructions to login into docker and "Build and Push IoT Edge solution" but use src/edge/deployment.objectCounter.template.json for this step.

![Build and Push IoT Edge solution](./media/event-based-video-recording-tutorial/build-push.png)

This will build the objectCounter module for object counting and push the image to your Azure Container Registry (ACR).

* Check that you have the environment variables CONTAINER_REGISTRY_USERNAME_myacr and CONTAINER_REGISTRY_PASSWORD_myacr defined in the .env file.

The above step will create the IoT Edge deployment manifest at src/edge/config/deployment.objectCounter.amd64.json. Right click on that file and click on "Create Deployment for Single Device".

![Create deployment for single device](./media/quickstarts/create-deployment-single-device.png)

If this is your first tutorial with Live Video Analytics on IoT Edge, Visual Studio Code will prompt you to input the IoTHub connection string. You can copy it from the appsettings.json file.

Next, Visual Studio Code will ask you select an IoT hub device. Select your IoT Edge device (should be “lva-sample-device”).

At this stage, the deployment of edge modules to your IoT Edge device has started.
In about 30 seconds, refresh the Azure IoT Hub on the bottom left section in Visual Studio Code, and you should see that there are 4 modules deployed (note again the names: lvaEdge, rtspsim, yolov3, and objectCounter).

![4 modules deployed](./media/event-based-video-recording-tutorial/iot-hub.png)

## Prepare for monitoring events

In order to see the events from the object counter module and from Live Video Analytics on IoT Edge module, follow these steps:

1. Open the Explorer pane in Visual Studio Code and look for Azure IoT Hub at the bottom-left corner.
1. Expand the Devices node.
1. Right-clink on lva-sample-device and chose the option **Start Monitoring Built-in Event Monitoring**.

![Start monitoring Built-In event endpoint](./media/quickstarts/start-monitoring-iothub-events.png)

## Run the program

1. Visual Studio Code, navigate to "src/cloud-to-device-console-app/operations.json"

1. Under the node GraphTopologySet, edit the following:

    `"topologyUrl" : "https://raw.githubusercontent.com/Azure/live-video-analytics/master/MediaGraph/topologies/evr-hubMessage-assets/topology.json"`
    
1. Next, under the nodes GraphInstanceSet and GraphTopologyDelete, edit,

    `"topologyName" : "EVRtoAssetsOnObjDetect"`
1. Start a debugging session (hit F5). You will start seeing some messages printed in the TERMINAL window.

1. The operations.json starts off with calls to GraphTopologyList and GraphInstanceList. If you have cleaned up resources after previous quickstarts or tutorials, this will return empty lists, and then pause for you to hit Enter, such as below:

    ```
    --------------------------------------------------------------------------
    Executing operation GraphTopologyList
    -----------------------  Request: GraphTopologyList  --------------------------------------------------
    {
      "@apiVersion": "1.0"
    }
    ---------------  Response: GraphTopologyList - Status: 200  ---------------
    {
      "value": []
    }
    --------------------------------------------------------------------------
    Executing operation WaitForInput
    Press Enter to continue
    ```
    1. When you press the "Enter" key in the TERMINAL window, the next set of direct method calls are made.
     * A call to GraphTopologySet using the topologyUrl above.
     * A call to GraphInstanceSet using the following body.
     
        ```
        {
          "@apiVersion": "1.0",
          "name": "Sample-Graph-1",
          "properties": {
            "topologyName": "EVRtoAssetsOnObjDetect",
            "description": "Sample graph description",
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
    
     * A call to GraphInstanceActivate to start the graph instance, and start the flow of video
     * A second call to GraphInstanceList to show that the graph instance is indeed in the running state
     
1. The output in the TERMINAL window will pause now at a 'Press Enter to continue' prompt. Do not hit "Enter" at this time. You can scroll up to see the JSON response payloads for the direct methods you invoked.

1. If you now switch over to the OUTPUT window in Visual Studio Code, you will see messages that are being sent to the IoT Hub, by the  Live Video Analytics on IoT Edge module.

     * These messages are discussed in the following section.
     
1. The graph instance will continue to run, and record the video—the RTSP simulator will keep looping the source video. Review the messages as discussed in the section below, and then, to stop the instance, go back to the TERMINAL window and hit "Enter". The next series of calls are made to clean up resources:

     * A call to GraphInstanceDeactivate to deactivate the graph instance
     * A call to GraphInstanceDelete to delete the instance
     * A call to GraphTopologyDelete to delete the topology
     * A final call to GraphTopologyList to show that the list is now empty

## Interpret the results 

When you run the media graph, the Live Video Analytics on IoT Edge module sends certain diagnostic and operational events to the IoT Edge Hub. These events are the messages you see in the OUTPUT window of Visual Studio Code, which contain a "body" section and an "applicationProperties" section. To understand what these sections represent, see [Create and read IoT Hub messages](https://docs.microsoft.com/azure/iot-hub/iot-hub-devguide-messages-construct).

In the messages below, the application properties and the content of the body are defined by the Live Video Analytics module.

## Diagnostic events

### MediaSessionEstablished event 

When a media graph is instantiated, the RTSP source node attempts to connect to the RTSP server running on the RTSP simulator container. If successful, it will print this event. Note that the event type is Microsoft.Media.MediaGraph.Diagnostics.MediaSessionEstablished.

```
[IoTHubMonitor] [5:53:17 PM] Message received from [lva-sample-device/lvaEdge]:
{
  "body": {
    "sdp": "SDP:\nv=0\r\no=- 1586450538111534 1 IN IP4 XXX.XX.XX.XX\r\ns=Matroska video+audio+(optional)subtitles, streamed by the LIVE555 Media Server\r\ni=media/camera-300s.mkv\r\nt=0 0\r\na=tool:LIVE555 Streaming Media v2020.03.06\r\na=type:broadcast\r\na=control:*\r\na=range:npt=0-300.000\r\na=x-qt-text-nam:Matroska video+audio+(optional)subtitles, streamed by the LIVE555 Media Server\r\na=x-qt-text-inf:media/camera-300s.mkv\r\nm=video 0 RTP/AVP 96\r\nc=IN IP4 0.0.0.0\r\nb=AS:500\r\na=rtpmap:96 H264/90000\r\na=fmtp:96 packetization-mode=1;profile-level-id=4D0029;sprop-parameter-sets=XXXXXXXXXXXXXXXXXXXXXX\r\na=control:track1\r\n"
  },
  "applicationProperties": {
    "topic": "/subscriptions/{subscriptionID}/resourceGroups/{resource-group-name}/providers/microsoft.media/mediaservices/{ams-account-name}",
    "subject": "/graphInstances/Sample-Graph-1/sources/rtspSource",
    "eventType": "Microsoft.Media.Graph.Diagnostics.MediaSessionEstablished",
    "eventTime": "2020-05-17T17:53:16.981Z",
    "dataVersion": "1.0"
  }
}
```


* The message is a Diagnostics event, MediaSessionEstablished, indicates that the RTSP source node (the subject) was able to establish connection with the RTSP simulator, and begin to receive a (simulated) live feed.

* The "subject" in applicationProperties references the node in the graph topology from which the message was generated. In this case, the message is originating from the RTSP source node.

* "eventType" in applicationProperties indicates that this is a Diagnostics event.

* "eventTime" indicates the time when the event occurred, which is the time that the traffic video (MKV file) started to arrive into the module as a live stream.

* "body" contains data about the diagnostic event, which, in this case, is the [SDP](https://en.wikipedia.org/wiki/Session_Description_Protocol) details.


## Operational events

After the media graph runs for a while, eventually you will get an event from the Object Counter module. 

```
[IoTHubMonitor] [5:53:44 PM] Message received from [lva-sample-device/objectCounter]:
{
  "body": {
    "count": 2
  },
  "applicationProperties": {
    "eventTime": "2020-05-17T17:53:44.062Z"
  }
}
```

The applicationProperties contains the eventTime, which is the time at which the Object Counter module observed that the results from YOLO v3 module contained objects of interest (trucks).

You may see more of these events show up as other trucks are detected in the video.

### RecordingStarted event

Almost immediately after the Object Counter sends the event, you will see an event of type Microsoft.Media.Graph.Operational.RecordingStarted

```
[IoTHubMonitor] [5:53:46 PM] Message received from [lva-sample-device/lvaEdge]:
{
  "body": {
    "outputType": "assetName",
    "outputLocation": "sampleAssetFromEVR-LVAEdge-20200517T175346Z"
  },
  "applicationProperties": {
    "topic": "/subscriptions/{subscriptionID}/resourceGroups/{resource-group-name}/providers/microsoft.media/mediaservices/{ams-account-name}",
    "subject": "/graphInstances/Sample-Graph-1/sinks/assetSink",
    "eventType": "Microsoft.Media.Graph.Operational.RecordingStarted",
    "eventTime": " 2020-05-17T17:53:46.132Z",
    "dataVersion": "1.0"
  }
}
```

The "subject" in applicationProperties references the asset sink node in the graph, which generated this message. The body contains information about the output location, which in this case is the name of the Azure Media Service asset into which video is recorded. You should note down this value.

### RecordingAvailable event

When the asset sink node has uploaded video to the asset, it emits this event of type Microsoft.Media.Graph.Operational.RecordingAvailable

```
[IoTHubMonitor] [5:54:15 PM] Message received from [lva-sample-device/lvaEdge]:
{
  "body": {
    "outputType": "assetName",
    "outputLocation": "sampleAssetFromEVR-LVAEdge-20200517T175346Z"
  },
  "applicationProperties": {
    "topic": "/subscriptions/{subscriptionID}/resourceGroups/{resource-group-name}/providers/microsoft.media/mediaservices/{ams-account-name}",
    "subject": "/graphInstances/Sample-Graph-1/sinks/assetSink",
    "eventType": "Microsoft.Media.Graph.Operational.RecordingAvailable",
    "eventTime": "2020-05-17T17:54:15.808Z",
    "dataVersion": "1.0"
  }
}
```

This event indicates that enough data has been written to the Asset in order for players/clients to initiate playback of the video. The "subject" in applicationProperties references the AssetSink node in the graph, which generated this message. The body contains information about the output location, which in this case is the name of the Azure Media Service Asset into which video is recorded.

### RecordingStopped event

If you examine the activation settings (maximumActivationTime) for the signal gate processor node in the [topology](https://github.com/Azure/live-video-analytics/tree/master/MediaGraph/topologies/evr-hubMessage-assets/topology.json), you will see that the gate is setup to close after 30 seconds of video has been sent through. So roughly 30 seconds after the RecordingStarted event, you should see an event of type Microsoft.Media.Graph.Operational.RecordingStopped, indicating that the asset sink node has stopped recording video to the asset.

```
[IoTHubMonitor] [5:54:15 PM] Message received from [lva-sample-device/lvaEdge]:
{
  "body": {
    "outputType": "assetName",
    "outputLocation": "sampleAssetFromEVR-LVAEdge-20200517T175346Z"
  },
  "applicationProperties": {
    "topic": "/subscriptions/{subscriptionID}/resourceGroups/{resource-group-name}/providers/microsoft.media/mediaservices/{ams-account-name}",
    "subject": "/graphInstances/Sample-Graph-1/sinks/assetSink",
    "eventType": "Microsoft.Media.Graph.Operational.RecordingStopped",
    "eventTime": "2020-05-17T17:54:15.040Z",
    "dataVersion": "1.0"
  }
}
```

This event indicates that recording has stopped. The "subject" in applicationProperties references the AssetSink node in the graph, which generated this message. The body contains information about the output location, which in this case is the name of the Azure Media Service asset into which video is recorded.

## Media Services asset  

You can examine the Media Services asset that was created by the graph by logging in to the Azure portal, and viewing the video.

1. Open your web browser, and go to the [Azure portal](https://portal.azure.com/). Enter your credentials to sign in to the portal. The default view is your service dashboard.
1. Locate your Media Services account among the resources you have in your subscription, and open the account blade
1. Click on Assets in the Media Services listing.

    ![Assets](./media/continuous-video-recording-tutorial/assets.png)
1. You will find an asset listed with the name sampleAssetFromEVR-LVAEdge-{DateTime} – this is the name provided in the outputLocation property of the RecordingStarted event. The assetNamePattern in the topology determines how this name was generated.
1. Click on the Asset.
1. In the asset details page, click on the **Create new** below the Streaming URL text box.

    ![New asset](./media/continuous-video-recording-tutorial/new-asset.png)

1. In the wizard that opens, accept the default options and hit “Add”. For more information, see, [video playback](video-playback-concept.md).

    > [!TIP]
    > Make sure your [streaming endpoint is running](../latest/streaming-endpoint-concept.md).
1. The player should load the video, and you should be able to hit **Play** to view it.

> [!NOTE]
> Since the source of the video was a container simulating a camera feed, the timestamps in the video are related to when you activated the graph instance, and when you deactivated it. If you use the playback controls built into the [Playback multi-day recordings](playback-multi-day-recordings-tutorial.md) tutorial, you can see the timestamps in the video displayed on screen.

## Clean up resources

If you intend to try the other tutorials, you should hold on to the resources created. Otherwise, go to the Azure portal, browse to your resource groups, select the resource group under which you ran this tutorial, and delete the resource group.

## Next steps

* Use an [IP camera](https://en.wikipedia.org/wiki/IP_camera) with support for RTSP instead of using the RTSP simulator. You can search for IP cameras with RTSP support on the [ONVIF conformant products page](https://www.onvif.org/conformant-products/) by looking for devices that conform with profiles G, S, or T.
* Use an AMD64 or X64 Linux device (vs. using an Azure Linux VM). This device must be in the same network as the IP camera. You can follow instructions in [Install Azure IoT Edge runtime on Linux](https://docs.microsoft.com/azure/iot-edge/how-to-install-iot-edge-linux) and then follow instructions in the [Deploy your first IoT Edge module to a virtual Linux device](https://docs.microsoft.com/azure/iot-edge/quickstart-linux) quickstart to register the device with Azure IoT Hub.

---
title: Continuous video recording to cloud and playback from cloud tutorial - Azure
description: In this tutorial, you will learn how to use Live Video Analytics on IoT Edge to continuously record video to the cloud, and stream any portion of that video using Azure Media Services.
ms.topic: tutorial
ms.date: 04/27/2020

---
# Tutorial: Continuous video recording to cloud and playback from cloud  

In this tutorial, you will learn how to use Live Video Analytics on IoT Edge to perform [continuous video recording](continuous-video-recording-concept.md) (CVR) to the cloud, and stream any portion of that video using Media Services. This is useful for safety scenarios, where there is a need to maintain an archive of the footage from a camera for multiple days (or weeks).

> [!div class="checklist"]
> * Setup the relevant resources
> * Examine the code that performs CVR
> * Run the sample code
> * Examine the results, and view the video

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

## Suggested pre-reading  

It is recommended that you read through the following documentation pages

* [Live Video Analytics on IoT Edge overview](overview.md)
* [Live Video Analytics on IoT Edge terminology](terminology.md)
* [Media graph concepts](media-graph-concept.md) 
* [Continuous video recording scenarios](continuous-video-recording-concept.md)

## Prerequisites

Prerequisites for this tutorial are as follows

* [Visual Studio Code](https://code.visualstudio.com/) on your development machine with [Azure IoT Tools](https://marketplace.visualstudio.com/items?itemName=vsciot-vscode.azure-iot-tools) extension, and the [C#](https://marketplace.visualstudio.com/items?itemName=ms-dotnettools.csharp) extension.

    > [!TIP]
    > You might be prompted to install docker. You may ignore this prompt.

* [.NET Core 3.1 SDK](https://dotnet.microsoft.com/download/dotnet-core/thank-you/sdk-3.1.201-windows-x64-installer)  on your development machine.
<!--* Complete [Set up Azure resources](), and [Set up the environment]()

At the end of the above steps, you will have certain Azure resources deployed in the Azure subscription, including:

* IoT Hub
* Storage account
* Media Services account
* A Linux Virtual Machine
-->

## Concepts

As explained in the [media graph](media-graph-concept.md) article, a media graph lets you define where media should be captured from, how it should be processed, and where the results should be delivered. To accomplish CVR, you need to capture the video from an RTSP-capable camera, and continuously record it to an [Azure Media Services asset](terminology.md#asset). The media graph can be represented pictorially as follows.

![Media graph](./media/continuous-video-recording-tutorial/continuous-video-recording-overview.png)

In this tutorial, we will use one Edge module built using the [Live555 Media Server](https://github.com/Azure/live-video-analytics/tree/master/utilities/rtspsim-live555) to simulate an RTSP camera. Inside the Media Graph, you will use an [RTSP source](media-graph-concept.md#rtsp-source) node to get the live feed, and send that video to the [asset sink node](media-graph-concept.md#asset-sink) which will record the video to an asset.

## Examine the sample 

During Setup the environment, you will have launched Visual Studio Code and opened the folder containing the sample code.

In Visual Studio Code, browse to "src/edge". You will see the .env file that you created, as well as a few deployment template files. These templates define which Edge modules you will be deploying to the Linux VM. The .env file has the values for the variables used in these templates, such as the IoT Hub connection string that lets you send commands to the Edge modules via Azure IoT Hub.

Open “src/edge/deployment.template.json”. Note that there are two entries under the “modules” section – one for Live Video Analytics on IoT Edge, and one for the RTSP simulator. Also note the names for the modules:

* lvaEdge – this is the Live Video Analytics on IoT Edge module
* rtspsim – this is the RTSP simulator

Next, browse to "src/cloud-to-device-console-app" folder. Here you will see the appsettings.json file that you created along with a few other files:

* c2d-console-app.csproj - the project file for Visual Studio Code.
* operations.json - this file will list the different operations that you would like the program to run.
* Program.cs - the sample program code which does the following:

    * Loads the app settings.
    * Invokes the Live Video Analytics on IoT Edge Direct Methods <!--<TODO Link>--> to create a topology, instantiate a Media Graph and activate the Media Graph.
    * Pauses for you to examine the output in the terminal window and the events sent to IoT Hub in the “output” window.
    * Deactivate the graph instance, delete the graph instance, and delete the graph topology.

## Deploy the edge modules 

1. In Visual Studio Code, right-click on src/quick-start/edge/deployment.template.json and select “Generate IoT Edge Deployment Manifest”. This will create the IoT Edge deployment manifest at src/edge/config/deployment.amd64.json.
1. Right-click on scr/edge/config/deployment.amd64.json and select “Create Deployment for Single Device”. 
1. Visual Studio Code will prompt you to input the IoTHub connection string. You can copy it from the appsettings.json file.
1. Next, Visual Studio Code will ask you select an IoT hub device. Select your IoT Edge device (should be “lva-sample-device”).
1. At this stage, the deployment of edge modules to your IoT Edge device has started.
1. In about 30 seconds, refresh the Azure IOT Hub on the bottom left section and you should have the modules deployed (note again the names, lvaEdge and rtspsim)
 
![IoT hub](./media/continuous-video-recording-tutorial/iot-hub.png)

## Prepare to monitor the modules 

Right click on the Edge device (“lva-sample-device”) and click on “Start Monitoring Built-in Event Endpoint”. The Live Video Analytics on IoT Edge module will emit operational and diagnostic events (described below)  to the IoT Edge Hub, and you can see those events in the “OUTPUT” window in Visual Studio Code.

## Run the program 

1. Visual Studio Code, navigate to "src/cloud-to-device-console-app/operations.json"
1. Under the node GraphTopologySet, set the following:

    `"topologyUrl" : "https://github.com/Azure/live-video-analytics/tree/master/MediaGraph/topologies/cvr-asset/topology.json" `
1. Next, under the node GraphInstanceSet, edit

    `"topologyName" : "CVRToAMSAsset"`
1. Press “F5”. This will start the debug session.
1. In the TERMINAL window, you will see the responses to the Direct Method <!--<TODO Link to AMS docs>--> calls made by the program to the Live Video Analytics on IoT Edge module, which are:

    1. GraphTopologyList – retrieves a list of Graph Topologies that have been added to the module, if any

        Hit Enter to continue
    1. GraphInstanceList – retrieves a list of Graph Instances that have been created, if any

        Hit Enter to continue
1. GraphTopologySet – adds the above topology, named “CVRToAMSAsset” to the module
1. GraphInstanceSet – creates an instance of the above topology, substituting parameters

    Of interest is the rtspUrl parameter. It points to an MKV file which has been downloaded to the Linux VM, to a location from which the RTSP simulator reads it
1. GraphInstanceActivate – starts the Media Graph, causing video to flow through
1. GraphInstanceList – to show that you now have an instance in the module that is running

    > [!NOTE]
    > At this point, you should pause, and *not* hit Enter.
1. In the OUTPUT window, you will see operational and diagnostic messages that are being sent to the IoT Hub, by the Live Video Analytics on IoT Edge module
1. The Media Graph will continue to run, and print events – the RTSP simulator will keep looping the source video. In order to stop the Media Graph, you can hit Enter again in the TERMINAL window. The program will send:

    1. GraphInstanceDeactivate - to stop the Graph Instance, and stop the video recording
    1. GraphInstanceDelete – to delete the instance from the module
    1. GraphInstanceList – to show that there are now no instances on the module

    > [!NOTE]
    > The Graph Topology has not been deleted. If you need to do so, run this step with the following JSON body code:
    
    ```
    {
        "@apiVersion" : "1.0",
        "name" : "CVRToAMSAsset"
    }
    ```

## Examine the output 

The Live Video Analytics on IoT Edge module emits operational and diagnostic events (described below) to the IoT Edge Hub, which is the text you see in the OUTPUT window of Visual Studio Code follow [the streaming messaging format](https://docs.microsoft.com/azure/iot-hub/iot-hub-devguide-messages-construct) established for device-to-cloud communications by IoT Hub:

* A set of application properties. A dictionary of string properties that an application can define and access, without needing to deserialize the message body. IoT Hub never modifies these properties.
* An opaque binary body.

In the messages below, the application properties and the content of the body are defined by the Live Video Analytics module. For more information, see [telemetry](telemetry-schema.md) 

## Diagnostic events 

### MediaSessionEstablished event

When the Media Graph is instantiated, the RTSP Source node attempts to connect to the RTSP server running on the RTSP simulator container. If successful, it will print this event. Note that the event type is Microsoft.Media.MediaGraph.Diagnostics.MediaSessionEstablished.

```
[IoTHubMonitor] [9:42:18 AM] Message received from [lvaedgesample/lvaEdge]:
{
  "body": {
    "sdp": "SDP:\nv=0\r\no=- 1586450538111534 1 IN IP4 XXX.XX.XX.XX\r\ns=Matroska video+audio+(optional)subtitles, streamed by the LIVE555 Media Server\r\ni=media/camera-300s.mkv\r\nt=0 0\r\na=tool:LIVE555 Streaming Media v2020.03.06\r\na=type:broadcast\r\na=control:*\r\na=range:npt=0-300.000\r\na=x-qt-text-nam:Matroska video+audio+(optional)subtitles, streamed by the LIVE555 Media Server\r\na=x-qt-text-inf:media/camera-300s.mkv\r\nm=video 0 RTP/AVP 96\r\nc=IN IP4 0.0.0.0\r\nb=AS:500\r\na=rtpmap:96 H264/90000\r\na=fmtp:96 packetization-mode=1;profile-level-id=4D0029;sprop-parameter-sets=XXXXXXXXXXXXXXXXXXXXXX\r\na=control:track1\r\n"
  },
  "applicationProperties": {
    "dataVersion": "1.0",
    "topic": "/subscriptions/{subscriptionID}/resourceGroups/{name}/providers/microsoft.media/mediaservices/hubname",
    "subject": "/graphInstances/Sample-Graph-1/sources/rtspSource",
    "eventType": "Microsoft.Media.MediaGraph.Diagnostics.MediaSessionEstablished",
    "eventTime": "2020-04-09T16:42:18.1280000Z"
  }
}
```

Note the following:

* The "subject" in applicationProperties references the node in the MediaGraph from which the message was generated. In this case, the message is originating from the RTSP Source node.
* "eventType" in applicationProperties indicates that this is a Diagnostics event.
* "eventTime" indicates the time when the event occurred.
* "body" contains data about the diagnostic event - it's the SDP message.

## Operational events 

### RecordingStarted event

When the Asset Sink node starts to record video, it emits this event of type Microsoft.Media.Graph.Operational.RecordingStarted

```
[IoTHubMonitor] [4:33:10 PM] Message received from [lva-sample-device/lvaEdge]:
{
  "body": {
    "outputType": "assetName",
    "outputLocation": "sampleAssetFromCVR-LVAEdge-20200512T233309Z"
  },
  "applicationProperties": {
    "topic": "/subscriptions/{subscriptionID}/resourceGroups/{resource-group-name}/providers/microsoft.media/mediaservices/{ams-account-name}",
    "subject": "/graphInstances/Sample-Graph-2/sinks/assetSink",
    "eventType": "Microsoft.Media.Graph.Operational.RecordingStarted",
    "eventTime": "2020-05-12T23:33:10.392Z",
    "dataVersion": "1.0"
  }
}
```

The "subject" in applicationProperties references the asset sink node in the graph, which generated this message.

The body contains information about the output location, which in this case is the name of the Azure Media Service asset into which video is recorded. You should note down this value.

### RecordingAvailable event

When the asset sink node has uploaded video to the asset, it emits this event of type Microsoft.Media.Graph.Operational.RecordingAvailable

```
[IoTHubMonitor] [4:33:31 PM] Message received from [lva-sample-device/lvaEdge]:
{
  "body": {
    "outputType": "assetName",
    "outputLocation": "sampleAssetFromCVR-LVAEdge-20200512T233309Z"
  },
  "applicationProperties": {
    "topic": "/subscriptions/{subscriptionID}/resourceGroups/{resource-group-name}/providers/microsoft.media/mediaservices/{ams-account-name}",
    "subject": "/graphInstances/Sample-Graph-2/sinks/assetSink",
    "eventType": "Microsoft.Media.Graph.Operational.RecordingAvailable",
    "eventTime": "2020-05-12T23:33:31.051Z",
    "dataVersion": "1.0"
  }
}
```

This event indicates that enough data has been written to the Asset in order for players/clients to initiate playback of the video.

The "subject" in applicationProperties references the AssetSink node in the graph, which generated this message.

The body contains information about the output location, which in this case is the name of the Azure Media Service asset into which video is recorded.

### RecordingStopped event

When you deactivate the Graph Instance, the Asset Sink node stops recording video to the Asset, it emits this event of type Microsoft.Media.Graph.Operational.RecordingStopped.

```
[IoTHubMonitor] [11:33:31 PM] Message received from [lva-sample-device/lvaEdge]:
{
  "body": {
    "outputType": "assetName",
    "outputLocation": "sampleAssetFromCVR-LVAEdge-20200512T233309Z"
  },
  "applicationProperties": {
    "topic": "/subscriptions/{subscriptionID}/resourceGroups/{resource-group-name}/providers/microsoft.media/mediaservices/{ams-account-name}",
    "subject": "/graphInstances/Sample-Graph-2/sinks/assetSink",
    "eventType": "Microsoft.Media.Graph.Operational.RecordingStopped",
    "eventTime": "2020-05-13T06:33:31.051Z",
    "dataVersion": "1.0"
  }
}
```

This event indicates that recording has stopped.

The "subject" in applicationProperties references the AssetSink node in the graph, which generated this message.

The body contains information about the output location, which in this case is the name of the Azure Media Service Asset into which video is recorded.

## Media Services asset  

You can examine the Media Services Asset that was created by the graph by logging in to the Azure portal, and viewing the video.

1. Open your web browser, and go to the [Azure portal](https://portal.azure.com/). Enter your credentials to sign in to the portal. The default view is your service dashboard.
1. Locate your Media Services account among the resources you have in your subscription, and open the account blade
1. Click on Assets in the Media Services listing

    ![Assets](./media/continuous-video-recording-tutorial/assets.png)
1. You will find an Asset listed with the name sampleAssetFromCVR-LVAEdge-{DateTime} – this is the naming pattern chosen in your media graph topology file.
1. Click on the Asset.
1. In the asset details page, click on the **Create new** below the Streaming URL text box.

    ![New asset](./media/continuous-video-recording-tutorial/new-asset.png)

1. In the wizard that opens, accept the default options and hit “Add”. For more information see, [video playback](video-playback-concept.md).

    > [!TIP]
    > Make sure your [streaming endpoint is running](../latest/streaming-endpoint-concept.md).
1. The player should load the video, and you should be able to hit **Play**>** to view it.

> [!NOTE]
> Since the source of the video was a container simulating a camera feed, the timestamps in the video are related to when you activated the Graph Instance, and when you deactivated it. <!--You can see this <TODO Link> Tutorial on how to browse a multi-day recording, and view portions of that archive. In that tutorial, you are also able to see the timestamps in the video displayed on screen.-->

## Clean up resources

If you intend to try the other tutorials, you should hold on to the resources created. Otherwise, go to the Azure portal, browse to your resource groups, select the resource group under which you ran this tutorial, and delete the resource group.

## Next steps

* Use an [IP camera](https://en.wikipedia.org/wiki/IP_camera) with support for RTSP instead of using the RTSP simulator. You can search for IP cameras with RTSP support on the [ONVIF conformant products page](https://www.onvif.org/conformant-products/) by looking for devices that conform with profiles G, S, or T.
* Use an AMD64 or X64 Linux device (vs. using an Azure Linux VM). This device must be in the same network as the IP camera. You can follow instructions in [Install Azure IoT Edge runtime on Linux](https://docs.microsoft.com/azure/iot-edge/how-to-install-iot-edge-linux) and then follow instructions in the [Deploy your first IoT Edge module to a virtual Linux device](https://docs.microsoft.com/azure/iot-edge/quickstart-linux) quickstart to register the device with Azure IoT Hub.

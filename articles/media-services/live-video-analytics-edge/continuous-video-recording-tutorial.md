---
title: Continuous video recording to cloud and playback from cloud tutorial - Azure
description: In this tutorial, you will learn how to use Live Video Analytics on IoT Edge to continuously record video to the cloud, and stream any portion of that video using Azure Media Services.
ms.topic: tutorial
ms.date: 05/27/2020

---
# Tutorial: Continuous video recording to cloud and playback from cloud  

In this tutorial, you will learn how to use Live Video Analytics on IoT Edge to perform [continuous video recording](continuous-video-recording-concept.md) (CVR) to the cloud, and stream any portion of that video using Media Services. This is useful for scenarios such as safety, compliance, and others, where there is a need to maintain an archive of the footage from a camera for multiple days (or weeks).

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
* Complete [Live Video Analytics resources setup script](https://github.com/Azure/live-video-analytics/tree/master/edge/setup)

At the end of the above steps, you will have certain Azure resources deployed in the Azure subscription, including:

* IoT Hub
* Storage account
* Azure Media Services account
* Linux VM in Azure, with [IoT Edge runtime](https://docs.microsoft.com/azure/iot-edge/how-to-install-iot-edge-linux) installed

## Concepts

As explained [here](media-graph-concept.md), a media graph lets you define where media should be captured from, how it should be processed, and where the results should be delivered. To accomplish CVR, you need to capture the video from an RTSP-capable camera, and continuously record it to an [Azure Media Services asset](terminology.md#asset). The diagram below shows a graphical representation of that media graph.

![Media graph](./media/continuous-video-recording-tutorial/continuous-video-recording-overview.png)

In this tutorial, you will use one Edge module built using the [Live555 Media Server](https://github.com/Azure/live-video-analytics/tree/master/utilities/rtspsim-live555) to simulate an RTSP camera. Inside the media graph, you will use an [RTSP source](media-graph-concept.md#rtsp-source) node to get the live feed, and send that video to the [asset sink node](media-graph-concept.md#asset-sink) which will record the video to an asset.

## Set up your development environment

Before you begin, check that you have completed the 3rd bullet in [Prerequisites](#prerequisites). Once the resource setup script finishes, click on the curly brackets to expose the folder structure. You will see a few files created under the ~/clouddrive/lva-sample directory.

![App settings](./media/quickstarts/clouddrive.png)

Of interest in this tutorial are:

     * ~/clouddrive/lva-sample/edge-deployment/.env  - contains properties that Visual Studio Code uses to deploy modules to an edge device
     * ~/clouddrive/lva-sample/appsettings.json - used by Visual Studio Code for running the sample code

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

## Examine the sample files

In Visual Studio Code open “src/edge/deployment.template.json”. This template defines which edge modules you will be deploying to the edge device (the Azure Linux VM). Note that there are two entries under the “modules” section, with the following names:

* lvaEdge – this is the Live Video Analytics on IoT Edge module
* rtspsim – this is the RTSP simulator

Next, browse to "src/cloud-to-device-console-app" folder. Here you will see the appsettings.json file that you created along with a few other files:

* c2d-console-app.csproj - the project file for Visual Studio Code.
* operations.json - this file lists the different operations that you would run
* Program.cs - the sample program code which does the following:
    * Loads the app settings
    * Invokes direct methods exposed by the Live Video Analytics on IoT Edge module. You can use the module to analyze live video streams by invoking its [direct methods](direct-methods.md)
    * Pauses for you to examine the output from the program in the TERMINAL window and the events generated by the module in the OUTPUT window
    * Invokes direct methods to clean up resources

## Generate and deploy the IoT Edge deployment manifest 

The deployment manifest defines what modules are deployed to an edge device, and configuration settings for those modules. Follow these steps to generate such a manifest from the template file, and then deploy it to the edge device.

1. Launch Visual Studio Code
1. Set the IoTHub connection string by clicking on the "More actions" icon next to AZURE IOT HUB pane in the bottom-left corner. You can copy the string from the src/cloud-to-device-console-app/appsettings.json file. 

    ![Set IOT Connection String](./media/quickstarts/set-iotconnection-string.png)
1. Next, right click on "src/edge/deployment.template.json" file and click on "Generate IoT Edge Deployment Manifest". Visual Studio Code uses the values from the .env file in order to replace the variables found in the deployment template file. This should create a manifest file in src/edge/config folder named "deployment.amd64.json".

   ![Generate IoT Edge deployment manifest](./media/quickstarts/generate-iot-edge-deployment-manifest.png)
1. Right click on "src/edge/config/deployment.amd64.json" and click on "Create Deployment for Single Device".

   ![Create deployment for single device](./media/quickstarts/create-deployment-single-device.png)
1. You will then be asked to "Select an IoT Hub device". Select lva-sample-device from the drop down.
1. In about 30 seconds, refresh the Azure IoT Hub on the bottom left section and you should see the edge device has the following modules deployed:
    * Live Video Analytics on IoT Edge (module name "lvaEdge")
    * RTSP simulator (module name "rtspsim")
 
    ![IoT hub](./media/continuous-video-recording-tutorial/iot-hub.png)

## Prepare to monitor the modules 

When you use Live Video Analytics on IoT Edge module to record the live video stream, it will send events to the IoT Hub. In order to see these events, follow these steps:

1. Open the Explorer pane in Visual Studio Code and look for Azure IoT Hub at the bottom-left corner.
1. Expand the Devices node.
1. Right click on lva-sample-device and chose the option "Start Monitoring Built-in Event Monitoring".

    ![Start monitoring Built-In event endpoint](./media/quickstarts/start-monitoring-iothub-events.png)

## Run the program 

1. Visual Studio Code, navigate to "src/cloud-to-device-console-app/operations.json"
1. Under the node GraphTopologySet, edit the following:

    `"topologyUrl" : "https://github.com/Azure/live-video-analytics/tree/master/MediaGraph/topologies/cvr-asset/topology.json" `
1. Next, under the nodes GraphInstanceSet and GraphTopologyDelete, ensure that the value of topologyName matches the value of "name" property in the above graph topology:

    `"topologyName" : "CVRToAMSAsset"`  
1. Open the [topology](https://raw.githubusercontent.com/Azure/live-video-analytics/master/MediaGraph/topologies/cvr-asset/topology.json) in a browser, and look at assetNamePattern. To make sure you have an asset with a unique name, you may want to change the graph instance name in the operations.json file (from the default value of "Sample-Graph-1").

    `"assetNamePattern": "sampleAsset-${System.GraphTopologyName}-${System.GraphInstanceName}"`    
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
1. When you press the "Enter" key in the TERMINAL window, the next set of direct method calls are made
     * A call to GraphTopologySet using the topologyUrl above.
     * A call to GraphInstanceSet using the following body.
     
     ```
     {
       "@apiVersion": "1.0",
       "name": "Sample-Graph-1",
       "properties": {
         "topologyName": "CVRToAMSAsset",
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
1. The output in the TERMINAL window will pause now at a 'Press Enter to continue' prompt. Do not hit "Enter" at this time. You can scroll up to see the JSON response payloads for the direct methods you invoked
1. If you now switch over to the OUTPUT window in Visual Studio Code, you will see messages that are being sent to the IoT Hub, by the  Live Video Analytics on IoT Edge module.

     * These messages are discussed in the section below
1. The graph instance will continue to run, and record the video – the RTSP simulator will keep looping the source video. In order to stop recording, go back to the TERMINAL window and hit "Enter". The next series of calls are made to clean up resources:

     * A call to GraphInstanceDeactivate to deactivate the graph instance
     * A call to GraphInstanceDelete to delete the instance
     * A call to GraphTopologyDelete to delete the topology
     * A final call to GraphTopologyList to show that the list is now empty

## Interpret the results 

When you run the media graph, the Live Video Analytics on IoT Edge module sends certain diagnostic and operational events to the IoT Edge Hub. These events are the messages you see in the OUTPUT window of Visual Studio Code, which contain a "body" section and an "applicationProperties" section. To understand what these sections represent, read [this](https://docs.microsoft.com/azure/iot-hub/iot-hub-devguide-messages-construct) article.

In the messages below, the application properties and the content of the body are defined by the Live Video Analytics module.

## Diagnostic events 

### MediaSession Established event

When the graph instance is activated, the RTSP source node attempts to connect to the RTSP server running in the rtspsim module. If successful, it will print this event:

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
    "eventTime": "2020-04-09T09:42:18.1280000Z"
  }
}
```

* The message is a Diagnostics event, MediaSessionEstablished, indicates that the RTSP source node (the subject) was able to establish connection with the RTSP simulator, and begin to receive a (simulated) live feed.
* The "subject" in applicationProperties references the node in the graph topology from which the message was generated. In this case, the message is originating from the RTSP source node.
* "eventType" in applicationProperties indicates that this is a Diagnostics event.
* "eventTime" indicates the time when the event occurred.
* "body" contains data about the diagnostic event, which, in this case, is the [SDP](https://en.wikipedia.org/wiki/Session_Description_Protocol) details.

## Operational events 

### RecordingStarted event

When the asset sink node starts to record video, it emits this event of type Microsoft.Media.Graph.Operational.RecordingStarted

```
[IoTHubMonitor] [9:42:38 AM] Message received from [lva-sample-device/lvaEdge]:
{
  "body": {
    "outputType": "assetName",
    "outputLocation": "sampleAsset-CVRToAMSAsset-Sample-Graph-1"
  },
  "applicationProperties": {
    "topic": "/subscriptions/{subscriptionID}/resourceGroups/{resource-group-name}/providers/microsoft.media/mediaservices/{ams-account-name}",
    "subject": "/graphInstances/Sample-Graph-1/sinks/assetSink",
    "eventType": "Microsoft.Media.Graph.Operational.RecordingStarted",
    "eventTime": "2020-04-09T09:42:38.1280000Z",
    "dataVersion": "1.0"
  }
}
```

The "subject" in applicationProperties references the asset sink node in the graph, which generated this message.

The body contains information about the output location, which in this case is the name of the Azure Media Service asset into which video is recorded. You should note down this value.

### RecordingAvailable event

As the name suggests, the RecordingStarted event is sent when recording has started - but video data may not have been uploaded to the Asset yet. When the asset sink node has uploaded video data to the asset, it emits this event of type Microsoft.Media.Graph.Operational.RecordingAvailable

```
[IoTHubMonitor] [[9:43:38 AM] Message received from [lva-sample-device/lvaEdge]:
{
  "body": {
    "outputType": "assetName",
    "outputLocation": "sampleAsset-CVRToAMSAsset-Sample-Graph-1"
  },
  "applicationProperties": {
    "topic": "/subscriptions/{subscriptionID}/resourceGroups/{resource-group-name}/providers/microsoft.media/mediaservices/{ams-account-name}",
    "subject": "/graphInstances/Sample-Graph-1/sinks/assetSink",
    "eventType": "Microsoft.Media.Graph.Operational.RecordingAvailable",
    "eventTime": "2020-04-09T09:43:38.1280000Z",
    "dataVersion": "1.0"
  }
}
```

This event indicates that enough data has been written to the Asset in order for players/clients to initiate playback of the video.

The "subject" in applicationProperties references the AssetSink node in the graph, which generated this message.

The body contains information about the output location, which in this case is the name of the Azure Media Service asset into which video is recorded.

### RecordingStopped event

When you deactivate the Graph Instance, the asset sink node stops recording video to the asset, it emits this event of type Microsoft.Media.Graph.Operational.RecordingStopped.

```
[IoTHubMonitor] [11:33:31 PM] Message received from [lva-sample-device/lvaEdge]:
{
  "body": {
    "outputType": "assetName",
    "outputLocation": "sampleAsset-CVRToAMSAsset-Sample-Graph-1"
  },
  "applicationProperties": {
    "topic": "/subscriptions/{subscriptionID}/resourceGroups/{resource-group-name}/providers/microsoft.media/mediaservices/{ams-account-name}",
    "subject": "/graphInstances/Sample-Graph-1/sinks/assetSink",
    "eventType": "Microsoft.Media.Graph.Operational.RecordingStopped",
    "eventTime": "2020-04-10T11:33:31.051Z",
    "dataVersion": "1.0"
  }
}
```

This event indicates that recording has stopped.

The "subject" in applicationProperties references the AssetSink node in the graph, which generated this message.

The body contains information about the output location, which in this case is the name of the Azure Media Service asset into which video is recorded.

## Media Services asset  

You can examine the Media Services asset that was created by the media graph by logging in to the Azure portal, and viewing the video.

1. Open your web browser, and go to the [Azure portal](https://portal.azure.com/). Enter your credentials to sign in to the portal. The default view is your service dashboard.
1. Locate your Media Services account among the resources you have in your subscription, and open the account blade
1. Click on Assets in the Media Services listing

    ![Assets](./media/continuous-video-recording-tutorial/assets.png)
1. You will find an Asset listed with the name sampleAsset-CVRToAMSAsset-Sample-Graph-1 – this is the naming pattern chosen in your graph topology file.
1. Click on the Asset.
1. In the asset details page, click on the **Create new** below the Streaming URL text box.

    ![New asset](./media/continuous-video-recording-tutorial/new-asset.png)

1. In the wizard that opens, accept the default options and hit “Add”. For more information see, [video playback](video-playback-concept.md).

    > [!TIP]
    > Make sure your [streaming endpoint is running](../latest/streaming-endpoint-concept.md).
1. The player should load the video, and you should be able to hit **Play**>** to view it.

> [!NOTE]
> Since the source of the video was a container simulating a camera feed, the timestamps in the video are related to when you activated the graph instance, and when you deactivated it. You can see [this](playback-multi-day-recordings-tutorial.md) tutorial to see how to browse a multi-day recording, and view portions of that archive. In that tutorial, you will also able to see the timestamps in the video displayed on screen.

## Clean up resources

If you intend to try the other tutorials, you should hold on to the resources created. Otherwise, go to the Azure portal, browse to your resource groups, select the resource group under which you ran this tutorial, and delete the resource group.

## Next steps

* Use an [IP camera](https://en.wikipedia.org/wiki/IP_camera) with support for RTSP instead of using the RTSP simulator. You can search for IP cameras with RTSP support on the [ONVIF conformant products page](https://www.onvif.org/conformant-products/) by looking for devices that conform with profiles G, S, or T.
* Use an AMD64 or X64 Linux device (vs. using an Azure Linux VM). This device must be in the same network as the IP camera. You can follow instructions in [Install Azure IoT Edge runtime on Linux](https://docs.microsoft.com/azure/iot-edge/how-to-install-iot-edge-linux) and then follow instructions in the [Deploy your first IoT Edge module to a virtual Linux device](https://docs.microsoft.com/azure/iot-edge/quickstart-linux) quickstart to register the device with Azure IoT Hub.

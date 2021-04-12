---
title: Continuous video recording and playback tutorial - Azure Video Analyzer
description: In this tutorial, you'll learn how to use Azure Video Analyzer to continuously record video to the cloud and stream any portion of that video.
ms.topic: tutorial
ms.date: 04/01/2021

---
# Tutorial: Continuous video recording and playback

In this tutorial, you'll learn how to use Azure Video Analyzer to perform [continuous video recording](continuous-video-recording-concept.md) (CVR) to the cloud and stream any portion of that video. This capability is useful for scenarios such as safety and compliance where there's a need to maintain an archive of the footage from a camera for days or weeks. 

In this tutorial you will:

> [!div class="checklist"]
> * Set up the relevant resources.
> * Examine the code that performs CVR.
> * Run the sample code.
> * Examine the results, and view the video.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

## Suggested pre-reading  

Read these articles before you begin:

* [Azure Video Analyzer on IoT Edge overview](overview.md)
* [Azure Video Analyzer on IoT Edge terminology](terminology.md)
* [Video Analyzer Pipeline concepts](pipeline.md) 
* [Continuous video recording scenarios](continuous-video-recording.md)

## Prerequisites

Prerequisites for this tutorial are:

* [Visual Studio Code](https://code.visualstudio.com/) on your development machine with the [Azure IoT Tools](https://marketplace.visualstudio.com/items?itemName=vsciot-vscode.azure-iot-tools) and the [C#](https://marketplace.visualstudio.com/items?itemName=ms-dotnettools.csharp) extensions.

    > [!TIP]
    > You might be prompted to install Docker. Ignore this prompt.
* [.NET Core 3.1 SDK](https://dotnet.microsoft.com/download/dotnet-core/thank-you/sdk-3.1.201-windows-x64-installer) on your development machine.
* Run the [Azure Video Analyzer deployment template]()<!--https://github.com/Azure/azure-video-analyzer/tree/master/setup/deploy.json-->.

At the end of these steps, you'll have relevant Azure resources deployed in your Azure subscription:

* Azure IoT Hub
* Azure Storage account
* Azure Video Analyzer account
* Linux VM in Azure, with the [IoT Edge runtime](../../iot-edge/how-to-install-iot-edge.md) installed

> [!TIP]
> If you run into issues with Azure resources that get created, please view our **[troubleshooting guide]()<!--troubleshoot-how-to.md#common-error-resolutions-->** to resolve some commonly encountered issues.

## Concepts

As explained in [this](pipeline.md) article, a video analyzer pipeline lets you define:

- Where media should be captured from.
- How it should be processed.
- Where the results should be delivered. 
 
 To accomplish CVR, you need to capture the video from an RTSP-capable camera and continuously record it to a [video resource](terminology.md#video). This diagram shows a graphical representation of that pipeline. 

> [!div class="mx-imgBorder"]
> :::image type="content" source="./media/continuous-video-recording-tutorial/continuous-video-recording-overview.svg" alt-text="Video Analyzer pipeline for CVR":::

In this tutorial, you'll use one edge module built using the [Live555 Media Server]()<!--https://github.com/Azure/azure-video-analyzer/tree/master/edge-modules/sources/rtspsim-live555--> to simulate an RTSP camera. Inside the pipeline, you'll use an [RTSP source](pipeline.md#rtsp-source) node to get the live feed and send that video to the [video sink node](pipeline.md#video-sink), which records the video to your Video Analyzer account. The video that will be used in this tutorial is [a highway intersection sample video](https://lvamedia.blob.core.windows.net/public/camera-300s.mkv).
<iframe src="https://www.microsoft.com/en-us/videoplayer/embed/RE4LTY4" width="640" height="320" allowFullScreen="true" frameBorder="0"></iframe>
> [!VIDEO https://www.microsoft.com/en-us/videoplayer/embed/RE4LTY4]

## Set up your development environment

Before you begin, check that you've completed the third bullet in [Prerequisites](#prerequisites). After the deployment template finishes, locate the following settings. <!-- TODO: need a way to get these properties out of the ARM template -->


Of interest in this tutorial are the files:

* **.env**: Contains properties that Visual Studio Code uses to deploy modules to an edge device.
* **appsettings.json**: Used by Visual Studio Code for running the sample code.

You'll need the files for these steps:

1. Clone the repo from the GitHub link https://github.com/Azure-Samples/azure-video-analyzer-iot-edge-csharp <!--TODO: replace this -->.
1. Start Visual Studio Code, and open the folder where you downloaded the repo.
1. In Visual Studio Code, browse to the src/cloud-to-device-console-app folder and create a file named **appsettings.json**. This file contains the settings needed to run the program.
1. Copy the contents from the arm-template/appsettings.json file. The text should look like: <!--TODO: replace this -->
    ```
    {  
        "IoThubConnectionString" : "HostName=xxx.azure-devices.net;SharedAccessKeyName=iothubowner;SharedAccessKey=XXX",  
        "deviceId" : "ava-sample-device",  
        "moduleId" : "avaedge"  
    }
    ```
    The IoT Hub connection string lets you use Visual Studio Code to send commands to the edge modules via Azure IoT Hub.
    
1. Next, browse to the src/edge folder and create a file named **.env**.
1. Copy the contents from the arm-template/.env file. The text should look like: <!--TODO: replace this -->

    ```
    IOTHUB_CONNECTION_STRING="HostName=xxx.azure-devices.net;SharedAccessKeyName=iothubowner;SharedAccessKey=xxx"  
    AVA_PROVISIONING_TOKEN="<device provisioning token>"  
    VIDEO_INPUT_FOLDER_ON_DEVICE="/home/lvaedgeuser/samples/input"  
    VIDEO_OUTPUT_FOLDER_ON_DEVICE="/var/media"  
    APPDATA_FOLDER_ON_DEVICE="/var/local/azurevideoanalyzer"
    CONTAINER_REGISTRY_USERNAME_myacr="<your container registry username>"  
    CONTAINER_REGISTRY_PASSWORD_myacr="<your container registry username>"      
    ```

## Examine the sample files

In Visual Studio Code, open src/edge/deployment.template.json. This template defines which edge modules you'll deploy to the edge device (the Azure Linux VM). There are two entries under the **modules** section with the following names:

* **avaedge**: This is the Azure Video Analyzer on IoT Edge module.
* **rtspsim**: This is the RTSP simulator.

Next, browse to the src/cloud-to-device-console-app folder. Here you'll see the appsettings.json file that you created along with a few other files:

* **c2d-console-app.csproj**: The project file for Visual Studio Code.
* **operations.json**: This file lists the different operations that you would run.
* **Program.cs**: The sample program code, which:
    * Loads the app settings.
    * Invokes direct methods exposed by the Azure Video Analyzer on IoT Edge module. You can use the module to analyze live video streams by invoking its [direct methods]()<!--direct-methods.md-->.
    * Pauses for you to examine the output from the program in the **TERMINAL** window and the events generated by the module in the **OUTPUT** window.
    * Invokes direct methods to clean up resources.

## Generate and deploy the IoT Edge deployment manifest 

The deployment manifest defines what modules are deployed to an edge device and the configuration settings for those modules. Follow these steps to generate a manifest from the template file, and then deploy it to the edge device.

1. Start Visual Studio Code.
1. Set the IoT Hub connection string by selecting the **More actions** icon next to the **AZURE IOT HUB** pane in the lower-left corner. Copy the string from the src/cloud-to-device-console-app/appsettings.json file. 

    ![Set IoT Hub connection string]()<!--./media/quickstarts/set-iotconnection-string.png-->
    > [!NOTE]
    > You might be asked to provide Built-in endpoint information for the IoT Hub. To get that information, in Azure portal, navigate to your IoT Hub and look for **Built-in endpoints** option in the left navigation pane. Click there and look for the **Event Hub-compatible endpoint** under **Event Hub compatible endpoint** section. Copy and use the text in the box. The endpoint will look something like this:  
        ```
        Endpoint=sb://iothub-ns-xxx.servicebus.windows.net/;SharedAccessKeyName=iothubowner;SharedAccessKey=XXX;EntityPath=<IoT Hub name>
        ```

1. Right-click the src/edge/deployment.template.json file, and select **Generate IoT Edge Deployment Manifest**. Visual Studio Code uses the values from the .env file to replace the variables found in the deployment template file. This action creates a manifest file in the src/edge/config folder named **deployment.amd64.json**.

   ![Generate IoT Edge deployment manifest]()<!--./media/quickstarts/generate-iot-edge-deployment-manifest.png-->
1. Right-click the src/edge/config/deployment.amd64.json file, and select **Create Deployment for Single Device**.

   ![Create Deployment for Single Device]()<!--./media/quickstarts/create-deployment-single-device.png-->
1. You're then asked to **Select an IoT Hub device**. Select ava-sample-device from the drop-down list.
1. In about 30 seconds, refresh Azure IoT Hub in the lower-left section. You should see the edge device has the following modules deployed:
    * Azure Video Analyzer on IoT Edge (module name **avaedge**)
    * RTSP simulator (module name **rtspsim**)
 
    ![IoT Hub]()<!--./media/continuous-video-recording-tutorial/iot-hub.png-->

## Prepare to monitor the modules 

When you use the Azure Video Analyzer on IoT Edge module to record the live video stream, it sends events to IoT Hub. To see these events, follow these steps:

1. Open the Explorer pane in Visual Studio Code, and look for **Azure IoT Hub** in the lower-left corner.
1. Expand the **Devices** node.
1. Right-click the lva-sample-device file, and select **Start Monitoring Built-in Event Endpoint**.

    ![Start Monitoring Built-in Event Endpoint]()<!--./media/quickstarts/start-monitoring-iothub-events.png-->

    > [!NOTE]
    > You might be asked to provide Built-in endpoint information for the IoT Hub. To get that information, in Azure portal, navigate to your IoT Hub and look for **Built-in endpoints** option in the left navigation pane. Click there and look for the **Event Hub-compatible endpoint** under **Event Hub compatible endpoint** section. Copy and use the text in the box. The endpoint will look something like this:  
        ```
        Endpoint=sb://iothub-ns-xxx.servicebus.windows.net/;SharedAccessKeyName=iothubowner;SharedAccessKey=XXX;EntityPath=<IoT Hub name>
        ```

## Run the program 

1. In Visual Studio Code, open the **Extensions** tab (or press Ctrl+Shift+X) and search for Azure IoT Hub.
1. Right click and select **Extension Settings**.

    > [!div class="mx-imgBorder"]
    > :::image type="content" source="./media/run-program/extensions-tab.png" alt-text="Extension Settings":::<!--TODO: replace this -->
1. Search and enable “Show Verbose Message”.

    > [!div class="mx-imgBorder"]
    > :::image type="content" source="./media/run-program/show-verbose-message.png" alt-text="Show Verbose Message":::<!--TODO: replace this -->
1. Go to src/cloud-to-device-console-app/operations.json.
1. Under the **pipelineTopologySet** node, edit the following:

    `"pipelineTopologyUrl" : "https://raw.githubusercontent.com/Azure/azure-video-analyzer/master/pipelines/live/topologies/cvr-video/topology.json" `
1. Next, under the **livePipelineSet** and **pipelineTopologyDelete** nodes, ensure that the value of **topologyName** matches the value of the **name** property in the above pipeline topology:

    `"topologyName" : "CVRToVideo"`  
1. Open the [pipeline topology](https://raw.githubusercontent.com/Azure/azure-video-analyzer/master/pipelines/live/topologies/cvr-video/topology.json) in a browser, and look at videoName - it is hard-coded to `sample-cvr-video`. This is acceptable for a tutorial. In production, you would take care to ensure that each unique RTSP camera is recorded to a video resource with a unique name.
1. 
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
   * A call to pipelineTopologySet by using the previous topologyUrl
   * A call to livePipelineSet by using the following body
     
     ```
     {
       "@apiVersion": "1.0",
       "name": "Sample-Pipeline-1",
       "properties": {
         "topologyName": "CVRToVideo",
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
1. If you now switch over to the **OUTPUT** window in Visual Studio Code, you'll see messages being sent to IoT Hub by the Azure Video Analyzer on IoT Edge module.

   These messages are discussed in the following section.
1. The live pipeline continues to run and record the video. The RTSP simulator keeps looping the source video. To stop recording, go back to the **TERMINAL** window and select **Enter**. The next series of calls are made to clean up resources by using:

   * A call to livePipelineDeactivate to deactivate the live pipeline.
   * A call to livePipelineDelete to delete the instance.
   * A call to pipelineTopologyDelete to delete the topology.
   * A final call to pipelineTopologyList to show that the list is now empty.

## Interpret the results 

When you run the live pipeline, the Azure Video Analyzer on IoT Edge module sends certain diagnostic and operational events to the IoT Edge hub. These events are the messages you see in the **OUTPUT** window of Visual Studio Code. They contain a body section and an applicationProperties section. To understand what these sections represent, see [Create and read IoT Hub messages](../../iot-hub/iot-hub-devguide-messages-construct.md).

In the following messages, the application properties and the content of the body are defined by the Azure Video Analyzer module.

## Diagnostics events 

### MediaSession Established event

When the live pipeline is activated, the RTSP source node attempts to connect to the RTSP server running in the rtspsim module. If successful, it prints this event:

```
[IoTHubMonitor] [9:42:18 AM] Message received from [ava-sample-device/avaadge]:
{
  "body": {
    "sdp": "SDP:\nv=0\r\no=- 1586450538111534 1 IN IP4 XXX.XX.XX.XX\r\ns=Matroska video+audio+(optional)subtitles, streamed by the LIVE555 Media Server\r\ni=media/camera-300s.mkv\r\nt=0 0\r\na=tool:LIVE555 Streaming Media v2020.03.06\r\na=type:broadcast\r\na=control:*\r\na=range:npt=0-300.000\r\na=x-qt-text-nam:Matroska video+audio+(optional)subtitles, streamed by the LIVE555 Media Server\r\na=x-qt-text-inf:media/camera-300s.mkv\r\nm=video 0 RTP/AVP 96\r\nc=IN IP4 0.0.0.0\r\nb=AS:500\r\na=rtpmap:96 H264/90000\r\na=fmtp:96 packetization-mode=1;profile-level-id=4D0029;sprop-parameter-sets=XXXXXXXXXXXXXXXXXXXXXX\r\na=control:track1\r\n"
  },
  "applicationProperties": {
    "dataVersion": "1.0",
    "topic": "/subscriptions/{subscriptionID}/resourceGroups/{name}/providers/microsoft.media/videoanalyzers/hubname",
    "subject": "/livePipelines/Sample-Pipeline-1/sources/rtspSource",
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

### RecordingStarted event

When the video sink node starts to record media, it emits this event of type **Microsoft.VideoAnalyzers.Pipeline.Operational.RecordingStarted**:

```
[IoTHubMonitor] [9:42:38 AM] Message received from [ava-sample-device/avaedge]:
{
  "body": {
    "outputType": "videoName",
    "outputLocation": "sample-cvr-video"
  },
  "applicationProperties": {
    "topic": "/subscriptions/{subscriptionID}/resourceGroups/{resource-group-name}/providers/microsoft.media/videoanalyzers/{ava-account-name}",
    "subject": "/livePipelines/Sample-Pipeline-1/sinks/videoSink",
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
    "outputLocation": "sample-cvr-video"
  },
  "applicationProperties": {
    "topic": "/subscriptions/{subscriptionID}/resourceGroups/{resource-group-name}/providers/microsoft.media/videoanalyzers/{ava-account-name}",
    "subject": "/livePipelines/Sample-Pipeline-1/sinks/videoSink",
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
    "outputLocation": "sample-cvr-video"
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

This event indicates that recording has stopped.

The subject section in applicationProperties references the video sink node in the live pipeline, which generated this message.

The body section contains information about the output location, which in this case is the name of the Video Analyzer resource into which video is recorded.

## Video Analyzer video resource 

You can examine the Video Analyzer video resource that was created by the live pipeline by logging in to the Azure portal and viewing the video.

1. Open your web browser, and go to the [Azure portal](https://portal.azure.com/). Enter your credentials to sign in to the portal. The default view is your service dashboard.
1. Locate your Video Analzyers account among the resources you have in your subscription, and open the account pane.
1. Select **Videos** in the **Video Analyzers** list.

    ![Video Analyzers videos]()<!--./media/continuous-video-recording-tutorial/assets.png-->
1. You'll find a video listed with the name `sample-cvr-video`. This is the name chosen in your pipeline topology file.
1. Select the video.
1. On the video details page, select playback option <!-- TODO: fix this-->

    ![VIdeo playback]()<!--TODO: new screenshot is needed here-->

1. For more information on scrubbing the video to see the entire recording, see [video playback]()<!--video-playback-concept.md-->.

> [!NOTE]
> Because the source of the video was a container simulating a camera feed, the time stamps in the video are related to when you activated the live pipeline and when you deactivated it. To see how to browse a multiday recording and view portions of that archive, see the [Playback of multi-day recordings]()<!--playback-multi-day-recordings-tutorial.md--> tutorial. In that tutorial, you also can see the time stamps in the video displayed onscreen.

## Clean up resources

If you intend to try the other tutorials, hold on to the resources you created. Otherwise, go to the Azure portal, browse to your resource groups, select the resource group under which you ran this tutorial, and delete the resource group.

## Next steps

* Use an [IP camera](https://en.wikipedia.org/wiki/IP_camera) with support for RTSP instead of using the RTSP simulator. You can search for IP cameras with RTSP support on the [ONVIF conformant products page](https://www.onvif.org/conformant-products/) by looking for devices that conform with profiles G, S, or T.
* Use an AMD64 or X64 Linux device (vs. using an Azure Linux VM). This device must be in the same network as the IP camera. Follow the instructions in [Install Azure IoT Edge runtime on Linux](../../iot-edge/how-to-install-iot-edge.md). Then follow the instructions in the [Deploy your first IoT Edge module to a virtual Linux device](../../iot-edge/quickstart-linux.md) quickstart to register the device with Azure IoT Hub.

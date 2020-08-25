---
title: Detect motion & record video on edge devices - Azure
description: This quickstart shows you how to use Live Video Analytics on IoT Edge to analyze the live video feed from a (simulated) IP camera, detect if any motion is present, and if so, record an MP4 video clip to the local file system on the edge device.
ms.topic: quickstart
ms.date: 04/27/2020

---

# Quickstart: Detect motion and record video on edge devices
 
This quickstart shows you how to use Live Video Analytics on IoT Edge to analyze the live video feed from a (simulated) IP camera. It shows how to detect if any motion is present, and if so, record an MP4 video clip to the local file system on the edge device. The quickstart uses an Azure VM as an IoT Edge device and also uses a simulated live video stream. 

This article is based on sample code written in C#. It builds on the [Detect motion and emit events](detect-motion-emit-events-quickstart.md) quickstart. 

## Prerequisites

* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) if you don't already have one.
* [Visual Studio Code](https://code.visualstudio.com/), with the following extensions:
    * [Azure IoT Tools](https://marketplace.visualstudio.com/items?itemName=vsciot-vscode.azure-iot-tools)
    * [C#](https://marketplace.visualstudio.com/items?itemName=ms-dotnettools.csharp)
* [.NET Core 3.1 SDK](https://dotnet.microsoft.com/download/dotnet-core/3.1).
* If you haven't completed the [Detect motion and emit events](detect-motion-emit-events-quickstart.md) quickstart, then follow these steps:
     1. [Set up Azure resources](detect-motion-emit-events-quickstart.md#set-up-azure-resources)
     1. [Set up your development environment](detect-motion-emit-events-quickstart.md#set-up-your-development-environment)
     1. [Generate and deploy the IoT Edge deployment manifest](detect-motion-emit-events-quickstart.md#generate-and-deploy-the-deployment-manifest)
     1. [Prepare to monitor events](detect-motion-emit-events-quickstart.md#prepare-to-monitor-events)

> [!TIP]
> When installing Azure IoT Tools, you might be prompted to install Docker. Feel free to ignore the prompt.

## Review the sample video
As you set up the Azure resources for this quickstart, a short video of a parking lot is copied to the Linux VM in Azure that's used as the IoT Edge device. This video file will be used to simulate a live stream for this tutorial.

Open an application like [VLC media player](https://www.videolan.org/vlc/), select Ctrl+N, and paste [this link](https://lvamedia.blob.core.windows.net/public/lots_015.mkv) to the parking lot video to start playback. At about the 5-second mark, a white car moves through the parking lot.

Complete the following steps to use Live Video Analytics on IoT Edge to detect the motion of the car and record a video clip starting around the 5-second mark.

## Overview

![overview](./media/quickstarts/overview-qs4.png)

The preceding diagram shows how the signals flow in this quickstart. [An edge module](https://github.com/Azure/live-video-analytics/tree/master/utilities/rtspsim-live555) simulates an IP camera that hosts a Real-Time Streaming Protocol (RTSP) server. An [RTSP source](media-graph-concept.md#rtsp-source) node pulls the video feed from this server and sends video frames to the [motion detection processor](media-graph-concept.md#motion-detection-processor) node. The RTSP source sends the same video frames to a [signal gate processor](media-graph-concept.md#signal-gate-processor) node, which remains closed until it's triggered by an event.

When the motion detection processor detects motion in the video, it sends an event to the signal gate processor node, triggering it. The gate opens for the configured duration of time, sending video frames to the [file sink](media-graph-concept.md#file-sink) node. This sink node records the video as an MP4 file on the local file system of your edge device. The file is saved in the configured location.

In this quickstart, you will:

1. Create and deploy the media graph.
1. Interpret the results.
1. Clean up resources.

## Examine and edit the sample files
As part of the prerequisites for this quickstart, you downloaded the sample code to a folder. Follow these steps to examine and edit the sample code.

1. In Visual Studio Code, go to *src/edge*. You see your *.env* file and a few deployment template files.

    The deployment template refers to the deployment manifest for the edge device, where variables are used for some properties. The *.env* file includes the values for those variables.
1. Go to the *src/cloud-to-device-console-app* folder. Here you see the *appsettings.json* file and a few other files:
    * ***c2d-console-app.csproj*** - The project file for Visual Studio Code.
    * ***operations.json*** - The list of operations that you want the program to run.
    * ***Program.cs*** - The sample program code. This code:

        * Loads the app settings.
        * Invokes direct methods that the Live Video Analytics on IoT Edge module exposes. You can use the module to analyze live video streams by invoking its [direct methods](direct-methods.md). 
        * Pauses so you can examine the output from the program in the **TERMINAL** window and examine the events generated by the module in the **OUTPUT** window.
        * Invokes direct methods to clean up resources.

1. Edit the *operations.json* file:
    * Change the link to the graph topology:

        `"topologyUrl" : "https://raw.githubusercontent.com/Azure/live-video-analytics/master/MediaGraph/topologies/evr-motion-files/topology.json"`
    * Under `GraphInstanceSet`, edit the name of the graph topology to match the value in the preceding link:
    
      `"topologyName" : "EVRToFilesOnMotionDetection"`

    * Edit the RTSP URL to point to the video file:

        `"value": "rtsp://rtspsim:554/media/lots_015.mkv"`

    * Under `GraphTopologyDelete`, edit the name:

        `"name": "EVRToFilesOnMotionDetection"`

## Review - Check the modules' status

In the [Generate and deploy the IoT Edge deployment manifest](detect-motion-emit-events-quickstart.md#generate-and-deploy-the-deployment-manifest) step, in Visual Studio Code, expand the **lva-sample-device** node under **AZURE IOT HUB** (in the lower-left section). You should see the following modules deployed:

* The Live Video Analytics module, named **lvaEdge**
* The **rtspsim** module, which simulates an RTSP server that acts as the source of a live video feed

  ![Modules](./media/quickstarts/lva-sample-device-node.png)


## Review - Prepare for monitoring events
Make sure you've completed the steps to [Prepare to monitor events](detect-motion-emit-events-quickstart.md#prepare-to-monitor-events).

![Start Monitoring Built-in Event Endpoint](./media/quickstarts/start-monitoring-iothub-events.png)

## Run the sample program

1. Start a debugging session by selecting the F5 key. The **TERMINAL** window prints some messages.
1. The *operations.json* code calls the direct methods `GraphTopologyList` and `GraphInstanceList`. If you cleaned up resources after previous quickstarts, then this process will return empty lists and then pause. Select the Enter key.

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

    The **TERMINAL** window shows the next set of direct method calls:

     * A call to `GraphTopologySet` that uses the `topologyUrl` 
     * A call to `GraphInstanceSet` that uses the following body:

         ```
         {
           "@apiVersion": "1.0",
           "name": "Sample-Graph",
           "properties": {
             "topologyName": "EVRToFilesOnMotionDetection",
             "description": "Sample graph description",
             "parameters": [
               {
                 "name": "rtspUrl",
                 "value": "rtsp://rtspsim:554/media/lots_015.mkv"
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
     * A call to `GraphInstanceActivate` that starts the graph instance and the flow of video
     * A second call to `GraphInstanceList` that shows that the graph instance is in the running state
1. The output in the **TERMINAL** window pauses at `Press Enter to continue`. Don't select Enter yet. Scroll up to see the JSON response payloads for the direct methods that you invoked.
1. Switch to the **OUTPUT** window in Visual Studio Code. You see the messages that the Live Video Analytics on IoT Edge module is sending to the IoT hub. The following section of this quickstart discusses these messages.

1. The media graph continues to run and print results. The RTSP simulator keeps looping the source video. To stop the media graph, return to the **TERMINAL** window and select Enter. 

    The next series of calls cleans up the resources:
     * A call to `GraphInstanceDeactivate` deactivates the graph instance.
     * A call to `GraphInstanceDelete` deletes the instance.
     * A call to `GraphTopologyDelete` deletes the topology.
     * A final call to `GraphTopologyList` shows that the list is now empty.

## Interpret results 
When you run the media graph, the results from the motion detector processor node pass through the IoT Hub sink node to the IoT hub. The messages you see in the **OUTPUT** window of Visual Studio Code contain a `body` section and an `applicationProperties` section. For more information, see [Create and read IoT Hub messages](../../iot-hub/iot-hub-devguide-messages-construct.md).

In the following messages, the Live Video Analytics module defines the application properties and the content of the body.

### MediaSessionEstablished event

When a media graph is instantiated, the RTSP source node attempts to connect to the RTSP server that runs on the rtspsim-live555 container. If the connection succeeds, the following event is printed.

```
[IoTHubMonitor] [05:37:21 AM] Message received from [lva-sample-device/lvaEdge]:
{  
"body": {
"sdp": "SDP:\nv=0\r\no=- 1586450538111534 1 IN IP4 xxx.xxx.xxx.xxx\r\ns=Matroska video+audio+(optional)subtitles, streamed by the LIVE555 Media Server\r\ni=media/camera-300s.mkv\r\nt=0 0\r\na=tool:LIVE555 Streaming Media v2020.03.06\r\na=type:broadcast\r\na=control:*\r\na=range:npt=0-300.000\r\na=x-qt-text-nam:Matroska video+audio+(optional)subtitles, streamed by the LIVE555 Media Server\r\na=x-qt-text-inf:media/camera-300s.mkv\r\nm=video 0 RTP/AVP 96\r\nc=IN IP4 0.0.0.0\r\nb=AS:500\r\na=rtpmap:96 H264/90000\r\na=fmtp:96 packetization-mode=1;profile-level-id=4D0029;sprop-parameter-sets={SPS}\r\na=control:track1\r\n"  
},  
"applicationProperties": {  
    "dataVersion": "1.0",  
    "topic": "/subscriptions/{subscriptionID}/resourceGroups/{name}/providers/microsoft.media/mediaservices/hubname",  
    "subject": "/graphInstances/Sample-Graph-1/sources/rtspSource",  
    "eventType": "Microsoft.Media.MediaGraph.Diagnostics.MediaSessionEstablished",  
    "eventTime": "2020-05-21T05:37:21.398Z",
    }  
}
```

In the preceding output: 

* The message is a diagnostics event, `MediaSessionEstablished`. It indicates that the RTSP source node (the subject) established a connection with the RTSP simulator and has begun to receive a (simulated) live feed.
* In `applicationProperties`, `subject` references the node in the graph topology from which the message was generated. In this case, the message originates from the RTSP source node.
* In `applicationProperties`, `eventType` indicates that this event is a diagnostics event.
* The `eventTime` value is the time when the event occurred.
* The `body` section contains data about the diagnostics event. In this case, the data comprises the [Session Description Protocol (SDP)](https://en.wikipedia.org/wiki/Session_Description_Protocol) details.

### RecordingStarted event

When motion is detected, the signal gate processor node is activated, and the file sink node in the media graph starts to the write an MP4 file. The file sink node sends an operational event. The `type` is set to `motion` to indicate that it's a result from the motion detection processor. The `eventTime` value is the UTC time at which the motion occurred. For more information about this process, see the [Overview](#overview) section in this quickstart.

Here's an example of this message:

```
[IoTHubMonitor] [05:37:27 AM] Message received from [lva-sample-device/lvaEdge]:
{
  "body": {
    "outputType": "filePath",
    "outputLocation": "/var/media/sampleFilesFromEVR-filesinkOutput-20200521T053726Z.mp4"
  },
  "applicationProperties": {
    "topic": "/subscriptions/{subscriptionID}/resourceGroups/{name}/providers/microsoft.media/mediaservices/hubname",  
    "subject": "/graphInstances/Sample-Graph-1/sinks/fileSink",
    "eventType": "Microsoft.Media.Graph.Operational.RecordingStarted",
    "eventTime": "2020-05-21T05:37:27.713Z",
    "dataVersion": "1.0"
  }
}
```

In the preceding message: 

* In `applicationProperties`, `subject` references the node in the media graph from which the message was generated. In this case, the message originates from the file sink node.
* In `applicationProperties`, `eventType` indicates that this event is operational.
* The `eventTime` value is the time when the event occurred. This time is 5 to 6 seconds after `MediaSessionEstablished` and after video starts to flow. This time corresponds to the 5-to-6-second mark when the [car started to move](#review-the-sample-video) into the parking lot.
* The `body` section contains data about the operational event. In this case, the data comprises `outputType` and `outputLocation`.
* The `outputType` variable indicates that this information is about the file path.
* The `outputLocation` value is the location of the MP4 file in the edge module.

### RecordingStopped and RecordingAvailable events

If you examine the properties of the signal gate processor node in the [graph topology](https://github.com/Azure/live-video-analytics/blob/master/MediaGraph/topologies/evr-motion-files/topology.json), you see that the activation times are set to 5 seconds. So about 5 seconds after the `RecordingStarted` event is received, you get:

* A `RecordingStopped` event, indicating that the recording has stopped.
* A `RecordingAvailable` event, indicating that the MP4 file can now be used for viewing.

The two events are typically emitted within seconds of each other.

## Play the MP4 clip

The MP4 files are written to a directory on the edge device that you configured in the *.env* file by using the OUTPUT_VIDEO_FOLDER_ON_DEVICE key. If you used the default value, then the results should be in the */home/lvaadmin/samples/output/* folder.

To play the MP4 clip:

1. Go to your resource group, find the VM, and then connect by using Azure Bastion.

    ![Resource group](./media/quickstarts/resource-group.png)
    
    ![VM](./media/quickstarts/virtual-machine.png)

1. Sign in by using the credentials that were generated when you [set up your Azure resources](detect-motion-emit-events-quickstart.md#set-up-azure-resources). 
1. At the command prompt, go to the relevant directory. The default location is */home/lvaadmin/samples/output*. You should see the MP4 files in the directory.

    ![Output](./media/quickstarts/samples-output.png) 

1. Use [Secure Copy (SCP)](../../virtual-machines/linux/copy-files-to-linux-vm-using-scp.md) to copy the files to your local machine. 
1. Play the files by using [VLC media player](https://www.videolan.org/vlc/) or any other MP4 player.

## Clean up resources

If you intend to try the other quickstarts, then keep the resources you created. Otherwise, in the Azure portal, go to your resource groups, select the resource group where you ran this quickstart, and then delete all of the resources.

## Next steps

* Follow the [Run Live Video Analytics with your own model](use-your-model-quickstart.md) quickstart to apply AI to live video feeds.
* Review additional challenges for advanced users:

    * Use an [IP camera](https://en.wikipedia.org/wiki/IP_camera) that supports RTSP instead of using the RTSP simulator. You can find IP cameras that support RTSP on the [ONVIF conformant products](https://www.onvif.org/conformant-products) page. Look for devices that conform with profiles G, S, or T.
    * Use an AMD64 or x64 Linux device rather than using a Linux VM in Azure. This device must be in the same network as the IP camera. Follow the instructions in [Install Azure IoT Edge runtime on Linux](../../iot-edge/how-to-install-iot-edge-linux.md). Then follow the instructions in [Deploy your first IoT Edge module to a virtual Linux device](../../iot-edge/quickstart-linux.md) to register the device with Azure IoT Hub.

---
title: Detect motion and record video on edge devices - Azure
description: Use Azure Video Analyzer on IoT Edge to analyze the live video feed from a (simulated) IP camera. It shows how to detect if any motion is present, and if so, record an MP4 video clip to the local file system on the edge device. The quickstart uses an Azure VM as an IoT Edge device and also uses a simulated live video stream.
ms.topic: quickstart
ms.date: 04/01/2021
zone_pivot_groups: video-analyzer-programming-languages

---

# Detect motion and record video on edge devices

This quickstart shows you how to use Azure Video Analyzer on IoT Edge to analyze the live video feed from a (simulated) IP camera. It shows how to detect if any motion is present, and if so, record an MP4 video clip to the local file system on the edge device. The quickstart uses an Azure VM as an IoT Edge device and also uses a simulated live video stream.

This article is based on sample code written in C#. It builds on the [Detect motion and emit events]()<!--add link--> quickstart.

## Prerequisites

::: zone pivot="programming-language-csharp"
[!INCLUDE [prerequisites](includes/analyze-live-video-use-your-model-http/csharp/prerequisites.md)]
::: zone-end

::: zone pivot="programming-language-python"
[!INCLUDE [prerequisites](includes/analyze-live-video-use-your-model-http/python/prerequisites.md)]
::: zone-end

## Review the sample video

When you set up the Azure resources, a short video of highway traffic is copied to the Linux VM in Azure that you're using as the IoT Edge device. This quickstart uses the video file to simulate a live stream.

Open an application such as [VLC media player](https://www.videolan.org/vlc/). Select Ctrl+N and then paste a link to [the highway intersection sample video](https://www.videolan.org/vlc/) to start playback. You see the footage of many vehicles moving in highway traffic.

> [!VIDEO https://www.microsoft.com/en-us/videoplayer/embed/RE4LTY4]

Complete the following steps to use Azure Video Analyzer on IoT Edge to detect the motion of the car and record a video clip starting around the 5-second mark.

## Overview

> [!div class="mx-imgBorder"]
> :::image type="content" source="./media/detect-motion-record-video-edge-devices/overview.png" alt-text="Publish associated inference events to IoT Edge Hub":::

The preceding diagram shows how the signals flow in this quickstart. An [edge module]()<!--add a link--> simulates an IP camera that hosts a Real-Time Streaming Protocol (RTSP) server. An [RTSP source]()<!--add a link--> node pulls the video feed from this server and sends video frames to the [motion detection]()<!--add a link--> processor node. The RTSP source sends the same video frames to a [signal gate processor]()<!--add a link--> node, which remains closed until it's triggered by an event.

When the motion detection processor detects motion in the video, it sends an event to the signal gate processor node, triggering it. The gate opens for the configured duration of time, sending video frames to the [file sink]()<!--add a link--> node. This sink node records the video as an MP4 file on the local file system of your edge device. The file is saved in the configured location.

In this quickstart, you will:

1. Create and deploy the pipeline.
1. Interpret the results.
1. Clean up resources.

## Examine and edit the sample files

::: zone pivot="programming-language-csharp"
[!INCLUDE [prerequisites](includes/analyze-live-video-use-your-model-http/csharp/sample-files.md)]
::: zone-end

::: zone pivot="programming-language-python"
[!INCLUDE [prerequisites](includes/analyze-live-video-use-your-model-http/python/sample-files.md)]
::: zone-end

## Review - Check the modules' status

In the [Generate and deploy the IoT Edge deployment manifest]()<!--add a link--> step, in Visual Studio Code, expand the **ava-sample-device** node under **AZURE IOT HUB** (in the lower-left section). You should see the following modules deployed:

* The Azure Video Analyzer module, named avaedge.
* The rtspsim module, which simulates an RTSP server that acts as the source of a live video feed.

  > [!div class="mx-imgBorder"]
  > :::image type="content" source="./media/detect-motion-record-video-edge-devices/object-detection-model.png" alt-text= "Object detection model":::

## Review - Prepare for monitoring events

Make sure you've completed the steps to Prepare to monitor events.

> [!div class="mx-imgBorder"]
> :::image type="content" source="./media/detect-motion-record-video-edge-devices/monitor-event-endpoint.png" alt-text= "Start Monitoring Built-in Event Endpoint":::

> [!NOTE]
> You might be asked to provide Built-in endpoint information for the IoT Hub. To get that information, in Azure portal, navigate to your IoT Hub and look for Built-in endpoints option in the left navigation pane. Click there and look for the Event Hub-compatible endpoint under Event Hub compatible endpoint section. Copy and use the text in the box. The endpoint will look something like this:
Endpoint=sb://iothub-ns-xxx.servicebus.windows.net/;SharedAccessKeyName=iothubowner;SharedAccessKey=XXX;EntityPath=<IoT Hub name>

## Run the sample program

1. In Visual Studio Code, open the Extensions tab (or press Ctrl+Shift+X) and search for Azure IoT Hub.
1. Right-click and select Extension Settings.

    > [!div class="mx-imgBorder"]
    > :::image type="content" source="./media/vscode-common-screenshots/extension-settings.png" alt-text= "Extension settings"::: <!--change path to common-->
1. Search and enable “Show Verbose Message”.

    > [!div class="mx-imgBorder"]
    > :::image type="content" source="./media/vscode-common-screenshots/verbose-message.png" alt-text= "Show Verbose Message"::: <!--change path to common-->
1. Start a debugging session by selecting the F5 key. The **TERMINAL** window prints some messages.
1. The *operations.json* code calls the direct methods `PipelineTopologyList` and `LivePipelineList`. If you cleaned up resources after previous quickstarts, then this process will return empty lists and then pause. Press the Enter key.
    
    ```
    --------------------------------------------------------------------------
    Executing operation PipelineTopologyList
    -----------------------  Request: PipelineTopologyList  --------------------------------------------------
    {
      "@apiVersion": "1.0"
    }
    ---------------  Response: PipelineTopologyList - Status: 200  ---------------
    {
      "value": []
    }
    --------------------------------------------------------------------------
    Executing operation WaitForInput
    
    Press Enter to continue
    ```
    
    The TERMINAL window shows the next set of direct method calls:
    
    * A call to PipelineTopologySet that uses the topologyUrl
    * A call to LivePipelineSet that uses the following body:
        
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
    * A call to LivePipelineActivate that starts the graph instance and the flow of video.
    * A second call to LivePipelineList that shows that the graph instance is in the running state.
1. The output in the TERMINAL window pauses at Press Enter to continue. Don't select Enter yet. Scroll up to see the JSON response payloads for the direct methods that you invoked.
1. Switch to the OUTPUT window in Visual Studio Code. You see the messages that the Azure Video Analyzer on IoT Edge module is sending to the IoT hub. The following section of this quickstart discusses these messages.
1. The media graph continues to run and print results. The RTSP simulator keeps looping the source video. To stop the media graph, return to the TERMINAL window and select Enter.

The next series of calls cleans up the resources:

* A call to LivePipelineDeactivate deactivates the graph instance.
* A call to LivePipelineDelete deletes the instance.
* A call to PipelineTopologyDelete deletes the topology.
* A final call to PipelineTopologyList shows that the list is now empty.

## Interpret results

When you run the media graph, the results from the motion detector processor node pass through the IoT Hub sink node to the IoT hub. The messages you see in the OUTPUT window of Visual Studio Code contain a body section and an applicationProperties section. For more information, see Create and read IoT Hub messages.

In the following messages, the Azure Video Analyzer module defines the application properties and the content of the body.

### MediaSessionEstablished event

When a media graph is instantiated, the RTSP source node attempts to connect to the RTSP server that runs on the rtspsim-live555 container. If the connection succeeds, the following event is printed.

```
[IoTHubMonitor] [05:37:21 AM] Message received from [ava-sample-device/avaedge]:
{  
"body": {
"sdp": "SDP:\nv=0\r\no=- 1586450538111534 1 IN IP4 xxx.xxx.xxx.xxx\r\ns=Matroska video+audio+(optional)subtitles, streamed by the LIVE555 Media Server\r\ni=media/camera-300s.mkv\r\nt=0 0\r\na=tool:LIVE555 Streaming Media v2020.03.06\r\na=type:broadcast\r\na=control:*\r\na=range:npt=0-300.000\r\na=x-qt-text-nam:Matroska video+audio+(optional)subtitles, streamed by the LIVE555 Media Server\r\na=x-qt-text-inf:media/camera-300s.mkv\r\nm=video 0 RTP/AVP 96\r\nc=IN IP4 0.0.0.0\r\nb=AS:500\r\na=rtpmap:96 H264/90000\r\na=fmtp:96 packetization-mode=1;profile-level-id=4D0029;sprop-parameter-sets={SPS}\r\na=control:track1\r\n"  
},  
"applicationProperties": {  
    "dataVersion": "1.0",  
    "topic": "/subscriptions/{subscriptionID}/resourceGroups/{name}/providers/microsoft.media/mediaservices/hubname",  
    "subject": "/livePipelines/Sample-Graph-1/sources/rtspSource",  
    "eventType": "Microsoft.Media.MediaGraph.Diagnostics.MediaSessionEstablished",  
    "eventTime": "2020-05-21T05:37:21.398Z",
    }  
}
```

In the preceding output:

* The message is a diagnostics event, MediaSessionEstablished. It indicates that the RTSP source node (the subject) established a connection with the RTSP simulator and has begun to receive a (simulated) live feed.
* In applicationProperties, subject references the node in the graph topology from which the message was generated. In this case, the message originates from the RTSP source node.
* In applicationProperties, eventType indicates that this event is a diagnostics event.
* The eventTime value is the time when the event occurred.
* The body section contains data about the diagnostics event. In this case, the data comprises the Session Description Protocol (SDP) details.

### RecordingStarted event

When motion is detected, the signal gate processor node is activated, and the file sink node in the media graph starts to the write an MP4 file. The file sink node sends an operational event. The type is set to motion to indicate that it's a result from the motion detection processor. The eventTime value is the UTC time at which the motion occurred. For more information about this process, see the [Overview]()<!--add a link--> section in this quickstart.

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
    "subject": "/livePipelines/Sample-Graph-1/sinks/fileSink",
    "eventType": "Microsoft.Media.Graph.Operational.RecordingStarted",
    "eventTime": "2020-05-21T05:37:27.713Z",
    "dataVersion": "1.0"
  }
}
```

In the preceding message:

* In applicationProperties, subject references the node in the media graph from which the message was generated. In this case, the message originates from the file sink node.
* In applicationProperties, eventType indicates that this event is operational.
* The eventTime value is the time when the event occurred. This time is 5 to 6 seconds after MediaSessionEstablished and after video starts to flow. This time corresponds to the 5-to-6-second mark when the [car started to move]()<!--add a link--> into the parking lot.
* The body section contains data about the operational event. In this case, the data comprises outputType and outputLocation.
* The outputType variable indicates that this information is about the file path.
* The outputLocation value is the location of the MP4 file in the edge module.

## RecordingStopped and RecordingAvailable events

If you examine the properties of the signal gate processor node in the [graph topology]()<!--add a link-->, you see that the activation times are set to 5 seconds. So about 5 seconds after the RecordingStarted event is received, you get:

* A RecordingStopped event, indicating that the recording has stopped.
* A RecordingAvailable event, indicating that the MP4 file can now be used for viewing.

The two events are typically emitted within seconds of each other.

Play the MP4 clip

The MP4 files are written to a directory on the edge device that you configured in the .env file by using the VIDEO_OUTPUT_FOLDER_ON_DEVICE key. If you used the default value, then the results should be in the /var/media/ folder.

To play the MP4 clip:

1. Go to your resource group, find the VM, and then connect by using Azure Bastion.

  > [!div class="mx-imgBorder"]
  > :::image type="content" source="./media/detect-motion-record-video-edge-devices/sample-iot-edge-device.png" alt-text= "Edge device":::
1. Sign in by using the credentials that were generated when you [set up your Azure resources]()<!-- add a link-->.
1. At the command prompt, go to the relevant directory. The default location is /var/media. You should see the MP4 files in the directory.

  > [!div class="mx-imgBorder"]
  > :::image type="content" source="./media/detect-motion-record-video-edge-devices/mp4-files.png" alt-text= "Go to the relevant directory to get mp4 files.":::
1. Use [Secure Copy (SCP)](https://docs.microsoft.com/azure/virtual-machines/linux/copy-files-to-linux-vm-using-scp) to copy the files to your local machine.
1. Play the files by using [VLC media player](https://www.videolan.org/vlc/) or any other MP4 player.

## Clean up resources

If you intend to try the other quickstarts, then keep the resources you created. Otherwise, in the Azure portal, go to your resource groups, select the resource group where you ran this quickstart, and then delete all of the resources.

## Next steps

* Follow the [Run Azure Video Analyzer with your own model]()<!--add a link--> quickstart to apply AI to live video feeds.
* Review additional challenges for advanced users:
    
    * Use an [IP camera](https://en.wikipedia.org/wiki/IP_camera) that supports RTSP instead of using the RTSP simulator. You can find IP cameras that support RTSP on the [ONVIF conformant products](https://www.onvif.org/conformant-products/) page. Look for devices that conform with profiles G, S, or T.
    * Use an AMD64 or x64 Linux device rather than using a Linux VM in Azure. This device must be in the same network as the IP camera. Follow the instructions in [Install Azure IoT Edge runtime on Linux](https://docs.microsoft.com/azure/iot-edge/how-to-install-iot-edge?view=iotedge-2020-11&preserve-view=true). Then follow the instructions in [Deploy your first IoT Edge module to a virtual Linux device](https://docs.microsoft.com/azure/iot-edge/quickstart-linux?view=iotedge-2020-11&preserve-view=true) register the device with Azure IoT Hub.
    

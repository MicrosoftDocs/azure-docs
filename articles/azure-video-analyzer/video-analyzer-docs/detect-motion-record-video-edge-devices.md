---
title: Detect motion and record video on edge devices - Azure
description: Use Azure Video Analyzer to analyze the live video feed from a (simulated) IP camera. It shows how to detect if any motion is present, and if so, record an MP4 video clip to the local file system on the edge device. The quickstart uses an Azure VM as an IoT Edge device and also uses a simulated live video stream.
ms.topic: quickstart
ms.date: 06/01/2021
zone_pivot_groups: video-analyzer-programming-languages
---

# Quickstart: Detect motion and record video on edge devices

This quickstart shows you how to use Azure Video Analyzer to analyze the live video feed from a (simulated) IP camera. It shows how to detect if any motion is present, and if so, record an MP4 video clip to the local file system on the edge device. The quickstart uses an Azure VM as an IoT Edge device and also uses a simulated live video stream.

## Prerequisites

::: zone pivot="programming-language-csharp"
[!INCLUDE [prerequisites](includes/detect-motion-record-video-edge-devices/csharp/prerequisites.md)]
::: zone-end

::: zone pivot="programming-language-python"
[!INCLUDE [prerequisites](includes/detect-motion-record-video-edge-devices/python/prerequisites.md)]
::: zone-end

## Review the sample video

As you set up the Azure resources for this quickstart, a short video of a parking lot is copied to the Linux VM in Azure that's used as the IoT Edge device. This video file will be used to simulate a live stream for this tutorial.

Open an application like [VLC media player](https://www.videolan.org/vlc/), select Ctrl+N, and paste [this link](https://lvamedia.blob.core.windows.net/public/lots_015.mkv) to the parking lot video to start playback. At about the 5-second mark, a white car moves through the parking lot.

> [!VIDEO https://www.microsoft.com/videoplayer/embed/RE4LUbN]

Complete the following steps to use Video Analyzer to detect the motion of the car and record a video clip starting around the 5-second mark.

## Examine and edit the sample files

::: zone pivot="programming-language-csharp"
[!INCLUDE [prerequisites](includes/detect-motion-record-video-edge-devices/csharp/sample-files.md)]
::: zone-end

::: zone pivot="programming-language-python"
[!INCLUDE [prerequisites](includes/detect-motion-record-video-edge-devices/python/sample-files.md)]
::: zone-end

## Generate and deploy the deployment manifest

::: zone pivot="programming-language-csharp"
[!INCLUDE [prerequisites](includes/detect-motion-record-video-edge-devices/csharp/generate-deploy-deployment-manifest.md)]
::: zone-end

::: zone pivot="programming-language-python"
[!INCLUDE [prerequisites](includes/detect-motion-record-video-edge-devices/python/generate-deploy-deployment-manifest.md)]
::: zone-end

## Run the sample program

1. In Visual Studio Code, open the Extensions tab (or press Ctrl+Shift+X) and search for Azure IoT Hub.
1. Right-click and select Extension Settings.

   > [!div class="mx-imgBorder"]
   > :::image type="content" source="./media/vscode-common-screenshots/extension-settings.png" alt-text= "Extension settings":::

1. Search and enable “Show Verbose Message”.

   > [!div class="mx-imgBorder"]
   > :::image type="content" source="./media/vscode-common-screenshots/verbose-message.png" alt-text= "Show Verbose Message":::

1.  ::: zone pivot="programming-language-csharp"
    [!INCLUDE [header](includes/common-includes/csharp-run-program.md)]
    ::: zone-end

    ::: zone pivot="programming-language-python"
    [!INCLUDE [header](includes/common-includes/python-run-program.md)]
    ::: zone-end
1. The _operations.json_ code calls the direct methods `pipelineTopologyList` and `livePipelineList`. If you cleaned up resources after previous quickstarts, then this process will return empty lists and then pause. Press the Enter key.

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

   The TERMINAL window shows the next set of direct method calls:

   - A call to `pipelineTopologySet` that uses the pipelineTopologyUrl
   - A call to `livePipelineSet` that uses the following body:

     ```
     {
       "@apiVersion": "1.0",
       "name": "Sample-Pipeline-1",
       "properties": {
         "topologyName": "EVRToFilesOnMotionDetection",
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

   - A call to `livePipelineActivate` that starts the live pipeline and the flow of video.
   - A second call to `livePipelineList` that shows that the live pipeline is in the running state.

1. The output in the TERMINAL window pauses at Press Enter to continue. Don't select Enter yet. Scroll up to see the JSON response payloads for the direct methods that you invoked.
1. Switch to the OUTPUT window in Visual Studio Code. You see the messages that the Video Analyzer edge module is sending to the IoT hub. The following section of this quickstart discusses these messages.
1. The pipeline topology continues to run and print results. The RTSP simulator keeps looping the source video. To stop the pipeline topology, return to the TERMINAL window and select Enter.

The next series of calls cleans up the resources:

- A call to `livePipelineDeactivate` deactivates the live pipeline.
- A call to `livePipelineDelete` deletes the live pipeline.
- A call to `pipelineTopologyDelete` deletes the topology.
- A final call to `pipelineTopologyList` shows that the list is now empty.

## Interpret results

When you run the pipeline topology, the results from the motion detector processor node pass through the IoT Hub sink node to the IoT hub. The messages you see in the OUTPUT window of Visual Studio Code contain a body section and an applicationProperties section. For more information, see [Create and read IoT Hub messages](../../iot-hub/iot-hub-devguide-messages-construct.md).

In the following messages, the Video Analyzer edge module defines the application properties and the content of the body.

### MediaSessionEstablished event

When a pipeline topology is instantiated, the RTSP source node attempts to connect to the RTSP server that runs on the rtspsim-live555 container. If the connection succeeds, the following event is printed.

```
[IoTHubMonitor] [9:42:18 AM] Message received from [ava-sample-device/avaadge]:
{
  "body": {
    "sdp": "SDP:\nv=0\r\no=- 1586450538111534 1 IN IP4 XXX.XX.XX.XX\r\ns=Matroska video+audio+(optional)subtitles, streamed by the LIVE555 Media Server\r\ni=media/camera-300s.mkv\r\nt=0 0\r\na=tool:LIVE555 Streaming Media v2020.03.06\r\na=type:broadcast\r\na=control:*\r\na=range:npt=0-300.000\r\na=x-qt-text-nam:Matroska video+audio+(optional)subtitles, streamed by the LIVE555 Media Server\r\na=x-qt-text-inf:media/camera-300s.mkv\r\nm=video 0 RTP/AVP 96\r\nc=IN IP4 0.0.0.0\r\nb=AS:500\r\na=rtpmap:96 H264/90000\r\na=fmtp:96 packetization-mode=1;profile-level-id=4D0029;sprop-parameter-sets=XXXXXXXXXXXXXXXXXXXXXX\r\na=control:track1\r\n"
  },
  "applicationProperties": {
    "dataVersion": "1.0",
    "topic": "/subscriptions/{subscriptionID}/resourceGroups/{name}/providers/microsoft.media/videoanalyzers/{ava-account-name}",
    "subject": "/edgeModules/avaedge/livePipelines/Sample-Pipeline-1/sources/rtspSource",
    "eventType": "Microsoft.VideoAnalyzers.Diagnostics.MediaSessionEstablished",
    "eventTime": "2021-04-09T09:42:18.1280000Z"
  }
}
```

In the preceding output:

- The message is a diagnostics event, MediaSessionEstablished. It indicates that the RTSP source node (the subject) established a connection with the RTSP simulator and has begun to receive a (simulated) live feed.
- In applicationProperties, subject references the node in the pipeline topology from which the message was generated. In this case, the message originates from the RTSP source node.
- In applicationProperties, eventType indicates that this event is a diagnostics event.
- The eventTime value is the time when the event occurred.
- The body section contains data about the diagnostics event. In this case, the data comprises the Session Description Protocol (SDP) details.

### RecordingStarted event

When motion is detected, the signal gate processor node is activated, and the file sink node in the pipeline topology starts to the write an MP4 file. The file sink node sends an operational event. The type is set to motion to indicate that it's a result from the motion detection processor. The eventTime value is the UTC time at which the motion occurred. For more information about this process, see the [overview](detect-motion-record-video-edge-devices.md#overview) section in this quickstart.

Here's an example of this message:

```
[IoTHubMonitor] [05:37:27 AM] Message received from [avasample-iot-edge-device/avaedge]:
{
  "body": {
    "outputType": "filePath",
    "outputLocation": "/var/media/sampleFilesFromEVR-filesinkOutput-20210511T053726Z.mp4"
  },
  "applicationProperties": {
    "topic": "/subscriptions/{subscriptionID}/resourceGroups/{resource-group-name}/providers/microsoft.media/videoAnalyzers/{ava-account-name}",
    "subject": "/edgeModules/avaedge/livePipelines/Sample-Pipeline-1/sinks/fileSink",
    "eventType": "Microsoft.VideoAnalyzer.Operational.RecordingStarted",
    "eventTime": "2021-05-11T05:37:27.713Z",
    "dataVersion": "1.0"
  }
}
```

In the preceding message:

- In applicationProperties, subject references the node in the pipeline from which the message was generated. In this case, the message originates from the file sink node.
- In applicationProperties, eventType indicates that this event is operational.
- The eventTime value is the time when the event occurred. This time is 5 to 6 seconds after MediaSessionEstablished and after video starts to flow. This time corresponds to the 5-to-6-second mark when the [car started to move](#review-the-sample-video) into the parking lot.
- The body section contains data about the operational event. In this case, the data comprises outputType and outputLocation.
- The outputType variable indicates that this information is about the file path.
- The outputLocation value is the location of the MP4 file in the edge module.

### RecordingStopped and RecordingAvailable events

If you examine the properties of the signal gate processor node in the [pipeline topology](pipeline.md), you see that the activation times are set to 5 seconds. So about 5 seconds after the **RecordingStarted** event is received, you get:

- A **RecordingStopped** event, indicating that the recording has stopped.
- A **RecordingAvailable** event, indicating that the MP4 file can now be used for viewing.

The two events are typically emitted within seconds of each other.

## Play the MP4 clip

The MP4 files are written to a directory on the edge device that you configured in the .env file by using the VIDEO_OUTPUT_FOLDER_ON_DEVICE key. If you used the default value, then the results should be in the /var/media/ folder.

To play the MP4 clip:

1. Go to your resource group, find the VM, and then connect to the VM.

   > [!div class="mx-imgBorder"]
   > :::image type="content" source="./media/detect-motion-record-video-edge-devices/sample-iot-edge-device.png" alt-text= "Edge device":::

1. Sign in by using the credentials that were generated when you set up your Azure resources.
1. At the command prompt, go to the relevant directory. The default location is /var/media. You should see the MP4 files in the directory.

1. Use [Secure Copy (SCP)](../../virtual-machines/linux/copy-files-to-linux-vm-using-scp.md) to copy the files to your local machine.
1. Play the files by using [VLC media player](https://www.videolan.org/vlc/) or any other MP4 player.

## Clean up resources

If you intend to try the other quickstarts, then keep the resources you created. Otherwise, in the Azure portal, go to your resource groups, select the resource group where you ran this quickstart, and then delete all of the resources.

## Next steps

- Follow the [Run Azure Video Analyzer with your own model](analyze-live-video-use-your-model-http.md) quickstart to apply AI to live video feeds.
- Review additional challenges for advanced users:

  - Use an [IP camera](https://en.wikipedia.org/wiki/IP_camera) that supports RTSP instead of using the RTSP simulator. You can find IP cameras that support RTSP on the [ONVIF conformant products](https://www.onvif.org/conformant-products/) page. Look for devices that conform with profiles G, S, or T.
  - Use an AMD64 or x64 Linux device rather than using a Linux VM in Azure. This device must be in the same network as the IP camera. Follow the instructions in [Install Azure IoT Edge runtime on Linux](../../iot-edge/how-to-install-iot-edge.md?view=iotedge-2020-11&preserve-view=true). Then follow the instructions in [Deploy your first IoT Edge module to a virtual Linux device](../../iot-edge/quickstart-linux.md?view=iotedge-2020-11&preserve-view=true) register the device with Azure IoT Hub.

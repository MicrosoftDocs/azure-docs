---
author: fvneerden
ms.service: azure-video-analyzer
ms.topic: include
ms.date: 05/05/2021
ms.author: faneerde
---

When you run the live pipeline, the results from the motion detector processor node pass through the IoT Hub message sink node to the IoT hub. The messages you see in the **OUTPUT** window of Visual Studio Code contain a **body** section and an **applicationProperties** section. For more information, see [Create and read IoT Hub messages](../../../../../iot-hub/iot-hub-devguide-messages-construct.md).

In the following messages, the Azure Video Analyzer module defines the application properties and the content of the body.

### MediaSessionEstablished event

When a live pipeline is activated, the RTSP source node attempts to connect to the RTSP server that runs on the rtspsim-live555 container. If the connection succeeds, then the following event is printed.

```
[IoTHubMonitor] [10:51:34 AM] Message received from [avasample-iot-edge-device/avaedge]:
{
  "body": {
  {
    "sdp": "SDP:\nv=0\r\no=- 1620204694595500 1 IN IP4 xxx.xxx.xxx.xxx\r\ns=Matroska video+audio+(optional)subtitles, streamed by the LIVE555 Media Server\r\ni=media/camera-300s.mkv\r\nt=0 0\r\na=tool:LIVE555 Streaming Media v2020.08.19\r\na=type:broadcast\r\na=control:*\r\na=range:npt=0-300.000\r\na=x-qt-text-nam:Matroska video+audio+(optional)subtitles, streamed by the LIVE555 Media Server\r\na=x-qt-text-inf:media/camera-300s.mkv\r\nm=video 0 RTP/AVP 96\r\nc=IN IP4 0.0.0.0\r\nb=AS:500\r\na=rtpmap:96 H264/90000\r\na=fmtp:96 packetization-mode=1;profile-level-id=4D0029;sprop-parameter-sets=Z00AKeKQCgC3YC3AQEBpB4kRUA==,aO48gA==\r\na=control:track1\r\n"
  },
  "properties": {
    "topic": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/ava-sample-deployment/providers/Microsoft.Media/videoAnalyzers/avasample",
    "subject": "/edgeModules/avaedge/livePipelines/Sample-Pipeline-1/sources/rtspSource",
    "eventType": "Microsoft.VideoAnalyzer.Diagnostics.MediaSessionEstablished",
    "eventTime": "2021-05-06T00:58:58.602Z",
    "dataVersion": "1.0"
  },
  "systemProperties": {
    "iothub-connection-device-id": "avasample-iot-edge-device",
    "iothub-connection-module-id": "avaedge",
    "iothub-message-source": "Telemetry",
    "messageId": "459c3255-7c86-4ff5-a1e5-7ce3fcb07627",
    "contentType": "application/json",
    "contentEncoding": "utf-8"
  }
}
```

In the preceding output:

- The message is a diagnostics event, **MediaSessionEstablished**. It indicates that the RTSP source node (the subject) connected with the RTSP simulator and has begun to receive a (simulated) live feed.
- The **sdp** section contains data about the diagnostics event. In this case, the data comprises the [Session Description Protocol (SDP)](https://en.wikipedia.org/wiki/Session_Description_Protocol) details.

### MotionDetection event

When motion is detected, the Video Analyzer module sends an inference event. The **type** is set to **motion** to indicate that it's a result from the motion detection processor.

Here's an example of this message:

```json
{
  "body": {
    "timestamp": 145818422564951,
    "inferences": [
      {
        "type": "motion",
        "motion": {
          "box": {
            "l": 0.322176,
            "t": 0.574627,
            "w": 0.525,
            "h": 0.088889
          }
        }
      }
    ]
  },
  "properties": { … },
  "systemProperties": { … }
}
```

In this example:

- The **body** value is data about the analytics event. In this case, the event is an inference event, so the body contains **timestamp** and **inferences** data.
- The **inferences** data indicates that the **type** is **motion**. It has additional data about that **motion** event.
- The **box** section contains the coordinates for a bounding box around the moving object. The values are normalized by the width and height of the video, in pixels. For example, to get the original pixel coordinates you would multiply the horizontal dimensions by 1920 and the vertical dimensions by 1080.

  ```
  l - distance from left of image
  t - distance from top of image
  w - width of bounding box
  h - height of bounding box
  ```

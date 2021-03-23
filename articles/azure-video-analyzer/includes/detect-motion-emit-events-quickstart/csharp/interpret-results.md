When you run the live pipeline, the results from the motion detector processor node pass through the IoT Hub sink node to the IoT hub. The messages you see in the **OUTPUT** window of Visual Studio Code contain a `body` section and an `applicationProperties` section. For more information, see [Create and read IoT Hub messages](../../../../../iot-hub/iot-hub-devguide-messages-construct.md).

In the following messages, the Azure Video Analyzer module defines the application properties and the content of the body.

### MediaSessionEstablished event

When a live pipeline is instantiated, the RTSP source node attempts to connect to the RTSP server that runs on the rtspsim-live555 container. If the connection succeeds, then the following event is printed.
<!-- Below sample output needs to be replaced by output from AVA -->

```
[IoTHubMonitor] [9:42:18 AM] Message received from [avaedgesample/avaEdge]:  
{  
"body": {
"sdp": "SDP:\nv=0\r\no=- 1586450538111534 1 IN IP4 xxx.xxx.xxx.xxx\r\ns=Matroska video+audio+(optional)subtitles, streamed by the LIVE555 Media Server\r\ni=media/camera-300s.mkv\r\nt=0 0\r\na=tool:LIVE555 Streaming Media v2020.03.06\r\na=type:broadcast\r\na=control:*\r\na=range:npt=0-300.000\r\na=x-qt-text-nam:Matroska video+audio+(optional)subtitles, streamed by the LIVE555 Media Server\r\na=x-qt-text-inf:media/camera-300s.mkv\r\nm=video 0 RTP/AVP 96\r\nc=IN IP4 0.0.0.0\r\nb=AS:500\r\na=rtpmap:96 H264/90000\r\na=fmtp:96 packetization-mode=1;profile-level-id=4D0029;sprop-parameter-sets={SPS}\r\na=control:track1\r\n"  
},  
"applicationProperties": {  
    "dataVersion": "1.0",  
    "topic": "/subscriptions/{subscriptionID}/resourceGroups/{name}/providers/microsoft.media/mediaservices/hubname",  
    "subject": "/graphInstances/GRAPHINSTANCENAMEHERE/sources/rtspSource",  
    "eventType": "Microsoft.Media.MediaGraph.Diagnostics.MediaSessionEstablished",  
    "eventTime": "2020-04-09T16:42:18.1280000Z"  
    }  
}
```

In the preceding output: 

* The message is a diagnostics event, `MediaSessionEstablished`. It indicates that the RTSP source node (the subject) connected with the RTSP simulator and has begun to receive a (simulated) live feed.
* In `applicationProperties`, `subject`, references the node in the pipeline topology from which the message was generated. In this case, the message originates from the RTSP source node.
* In `applicationProperties`, `eventType` indicates that this event is a diagnostics event.
* The `eventTime` value indicates the time when the event occurred.
* The `body` section contains data about the diagnostics event. In this case, the data comprises the [Session Description Protocol (SDP)](https://en.wikipedia.org/wiki/Session_Description_Protocol) details.

### MotionDetection event

When motion is detected, the Azure Video Analyzer on IoT Edge module sends an inference event. The `type` is set to `motion` to indicate that it's a result from the motion detection processor. The `eventTime` value tells you when (in UTC) the motion occurred. 

Here's an example of this message:

```
  {  
  "body": {  
    "timestamp": 142843967343090,
    "inferences": [  
      {  
        "type": "motion",  
        "motion": {  
          "box": {  
            "l": 0.573222,  
            "t": 0.492537,  
            "w": 0.141667,  
            "h": 0.074074  
          }  
        }  
      }  
    ]  
  } 
}  
```

In this example: 

* The `eventTime` value is the time when the event occurred.
* The `body` value is data about the analytics event. In this case, the event is an inference event, so the body contains `timestamp` and `inferences` data.
* The `inferences` data indicates that the `type` is `motion`. It has additional data about that `motion` event.
* The `box` section contains the coordinates for a bounding box around the moving object. The values are normalized by the width and height of the video, in pixels. For example, the width is 1920 and the height is 1080.

    ```
    l - distance from left of image
    t - distance from top of image
    w - width of bounding box
    h - height of bounding box
    ```

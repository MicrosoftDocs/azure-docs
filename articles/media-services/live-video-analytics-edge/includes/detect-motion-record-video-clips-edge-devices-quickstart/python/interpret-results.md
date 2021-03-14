When you run the media graph, the results from the motion detector processor node pass through the IoT Hub sink node to the IoT hub. The messages you see in the **OUTPUT** window of Visual Studio Code contain a `body` section and an `applicationProperties` section. For more information, see [Create and read IoT Hub messages](../../../../../iot-hub/iot-hub-devguide-messages-construct.md).

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

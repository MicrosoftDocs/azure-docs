---
title: Event-based video recording  - Azure
description: Event-based video recording (EVR) refers to the process of recording video triggered by an event. The event in question could originate due to processing of the video signal itself (for example, detection on motion) or could be from an independent source (for example, opening of a door).  A few use cases related to event-based video recording are described in this article.

ms.topic: conceptual
ms.date: 05/27/2020

---
# Event-based video recording  
 
## Suggested pre-reading  

* [Continuous video recording](continuous-video-recording-concept.md)
* [Playback of recorded content](video-playback-concept.md)
* [Media graph concept](media-graph-concept.md)

## Overview 

Event-based video recording (EVR) refers to the process of recording video triggered by an event. The event in question, could originate due to processing of the video signal itself (for example, detection on motion) or could be from an independent source (for example, opening of a door). 

You can record video (triggered by an event) from a CCTV camera to a Media Services asset using a media graph consisting of an [RTSP source](media-graph-concept.md#rtsp-source) node, an [asset sink](media-graph-concept.md#asset-sink) node, and other nodes as outlined in the use cases below. You can configure the [asset sink](media-graph-concept.md#asset-sink) node to generate new assets each time an event occurs, so that the video that corresponds to each event will be in its own asset. You can also choose to use one asset to hold the video for all events. 

As an alternative to the asset sink node, you can use a [file sink](media-graph-concept.md#file-sink) node to capture short snippets of video (related to an event of interest), to a specified location on the local file system on the Edge device. 

A few use cases related to event-based video recording are described in this article.

### Video recording based on motion detection  

In this use case, you can record video clips only when there is motion detected in the video and be alerted when such a video clip is generated. This could be relevant in commercial security scenarios involving protection of critical infrastructure. By generating alerts and recording video when unexpected motion is detected, you can improve the efficiency of the human operator, since action is only needed when the alert is generated.

The diagram below shows a graphical representation of a media graph that addresses this use case. The JSON representation of the graph topology of such a media graph can be found [here](https://github.com/Azure/live-video-analytics/blob/master/MediaGraph/topologies/evr-motion-assets/topology.json).

![Video recording based on motion detection](./media/event-based-video-recording/motion-detection.png)

In the diagram, the RTSP source node captures the live video feed from the camera and delivers it to a [motion detection processor](media-graph-concept.md#motion-detection-processor) node. Upon detecting motion in the live video, the motion detection processor node generates event which go to the [signal gate processor](media-graph-concept.md#signal-gate-processor) node, as well as to the IoT Hub message sink node. The latter node sends the events to the IoT Edge Hub, from where they can be routed to other destinations to trigger alerts. 

An event from the motion detector node will trigger the signal gate processor node, and it will let the live video feed from the RTSP source node flow through to the asset sink node. In the absence of subsequent such motion detection events the gate will close after a configured amount of time. This determines the duration of the recorded video.

### Video recording based on events from other sources  

In this use case, signals from another IoT sensor can be used to trigger recording of video. The diagram below shows a graphical representation of a media graph that addresses this use case. The JSON representation of the graph topology of such a media graph can be found [here](https://github.com/Azure/live-video-analytics/blob/master/MediaGraph/topologies/evr-hubMessage-files/topology.json).

![Video recording based on events from other sources](./media/event-based-video-recording/other-sources.png)

In the diagram, the external sensor sends events to the IoT Edge Hub. The events are then routed to the signal gate processor node via the [IoT Hub message source](media-graph-concept.md#iot-hub-message-source) node. The behavior of the signal gate processor node is the same as with the previous use case - it will open and let the live video feed flow through from the RTSP source node to the file sink node (or asset sink node) when it is triggered by the external event. 

If you use a file sink node the video will be recorded to the local file system on the edge device. Else if you use an asset sink node, the video will be recorded to an asset.

### Video recording based on an external inferencing module 

In this use case, you can record video clips based on a signal from an external logic system. An example of such a use case could be recording a video clip only when a truck is detected in the video feed of traffic on a highway. The diagram below shows a graphical representation of a media graph that addresses this use case. The JSON representation of the graph topology of such a media graph can be found [here](https://github.com/Azure/live-video-analytics/blob/master/MediaGraph/topologies/evr-hubMessage-assets/topology.json).

![Video recording based on an external inferencing module](./media/event-based-video-recording/external-inferencing-module.png)

In the diagram, the RTSP source node captures the live video feed from the camera and delivers it to two branches: one has a [signal gate processor](media-graph-concept.md#signal-gate-processor) node, and the other uses an [HTTP extension](media-graph-concept.md) node to send data to an external logic module. The HTTP extension node allows the media graph to send image frames (in JPEG, BMP, or PNG formats) to an external inference service over REST. This signal path can typically only support low frame rates (<5fps). You can use the [frame rate filter processor](media-graph-concept.md#frame-rate-filter-processor) node to lower the frame rate of the video going to the HTTP extension node.

The results from the external inference service are retrieved by the HTTP extension node, and relayed to the IoT Edge hub via IoT Hub message sink node, where they can be further processed by the external logic module. If the inference service is capable of detecting vehicles, for example, the logic module could look for a specific vehicle such as a bus or a truck. When the logic module detects the object of interest, it can trigger the signal gate processor node by sending an event via the IoT Edge Hub to the IoT Hub message source node in the graph. The output from the signal gate is shown to go to either a file sink node or an asset sink node. In the former case, the video will be recorded to the local file system on the edge device. In the latter case, the video will be recorded to an asset.

An enhancement to this example is to use a motion detector processor ahead of the frame rate filter processor node. This will reduce the load on the inference service, such as nighttime when there may be long periods of time when there are no vehicles on the highway. 

## Next steps

[Tutorial: event-based video recording](event-based-video-recording-tutorial.md)

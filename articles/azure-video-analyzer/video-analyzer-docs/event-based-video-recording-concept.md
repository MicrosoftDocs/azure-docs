---
title: Azure Video Analyzer event-based video recording - Azure
description: Azure Video Analyzer event-based video recording (EVR) refers to the process of recording video when triggered by an event. The event in question could originate due to processing of the video signal itself (for example, when motion is detected) or could be from an independent source (for example, a door sensor signals that the door has been opened). A few use cases related to EVR are described in this article.
ms.topic: conceptual
ms.date: 06/01/2021

---
# Event-based video recording  

Event-based video recording (EVR) refers to the process of recording video triggered by an event. The event in question could originate due to processing of the video signal itself (for example, when motion is detected) or could be from an independent source (for example, a door sensor signals that the door has been opened). A few use cases related to EVR are described in this article.

## Suggested pre-reading  

* [Continuous video recording](continuous-video-recording.md)
* [Playback of recorded content](playback-recordings-how-to.md)
* [Pipeline concept](pipeline.md)

## Overview 

You can use Video Analyzer to perform EVR in two ways:
* Record the input from a given RTSP-capable IP camera to a given video resource in the cloud, where each new event would append to the recording available in that video resource.
* Record to separate MP4 files to the local storage of the IoT Edge device - each event would result in a new MP4 file.

A few use cases related to event-based video recording are described in this article.

### Video recording triggered by motion detection  

In this use case, you can record video clips only when there is motion detected in the video and be alerted when such a video clip is generated. This could be relevant in commercial security scenarios involving protection of critical infrastructure. EVR would help you lower storage costs.

The diagram below shows a graphical representation of a pipeline that addresses this use case. The JSON representation of the pipeline topology of such a pipeline can be found [here](https://raw.githubusercontent.com/Azure/video-analyzer/main/pipelines/live/topologies/evr-motion-video-sink/topology.json).

> [!div class="mx-imgBorder"]
> :::image type="content" source="./media/event-based-video-recording/motion-detection.png" alt-text="Event-based recording of live video when motion is detected.":::

In the diagram, the RTSP source node captures the live video feed from the camera and delivers it to a [motion detection processor](pipeline.md#motion-detection-processor) node. Upon detecting motion in the live video, the motion detection processor node generates events, which goes to the [signal gate processor](pipeline.md#signal-gate-processor) node as well as to the IoT Hub message sink node. The latter node sends the events to the IoT Edge Hub, from where they can be routed to other destinations to trigger alerts. 

Events from the motion detector node also trigger the signal gate processor node, opening it, and letting the live video feed from the RTSP source node flow through to the [video sink node](pipeline.md#video-sink). In the absence of subsequent such motion detection events the gate will close after a configured amount of time. This determines the duration of the recorded video that is appended to the video resource.

### Video recording based on events from other sources  

In this use case, signals from another IoT sensor can be used to trigger recording of video. The diagram below shows a graphical representation of a pipeline that addresses this use case. The JSON representation of the pipeline topology of such a pipeline can be found [here](https://raw.githubusercontent.com/Azure/video-analyzer/main/pipelines/live/topologies/evr-hubMessage-file-sink/topology.json).

> [!div class="mx-imgBorder"]
> :::image type="content" source="./media/event-based-video-recording/other-sources.png" alt-text="Event-based recording of live video when signaled by an external source.":::

In the diagram, the external sensor sends events to the IoT Edge Hub. The events are then routed to the signal gate processor node via the [IoT Hub message source](pipeline.md#iot-hub-message-source) node. The behavior of the signal gate processor node is the same as with the previous use case - when triggered by an event, it will open and let the live video feed flow through from the RTSP source node to the file sink node. A new MP4 file is written to the local storage of the IoT Edge device each time the gate opens.

### Video recording based on an external inferencing module 

In this use case, you can record video based on a signal from an external logic system. An example of such a use case could be recording video to the cloud only when a truck is detected in the video feed of traffic on a highway. The diagram below shows a graphical representation of a pipeline that addresses this use case. The JSON representation of the pipeline topology of such a pipeline [can be found here](https://raw.githubusercontent.com/Azure/video-analyzer/main/pipelines/live/topologies/evr-hubMessage-video-sink/topology.json).

> [!div class="mx-imgBorder"]
> :::image type="content" source="./media/event-based-video-recording/external-inferencing-module.png" alt-text="Event-based recording of live video when signaled by an external inferencing module.":::

In the diagram, the RTSP source node captures the live video feed from the camera and delivers it to two branches: one has a [signal gate processor](pipeline.md#signal-gate-processor) node, and the other uses an [HTTP extension](pipeline.md#http-extension-processor) node to send data to an external logic module. The HTTP extension node allows the pipeline to send image frames (in JPEG, BMP, or PNG formats) to an external inference service over REST. This signal path can typically only support low frame rates (<5fps). You can use the HTTP extension processor node to lower the frame rate of the video going to the external inferencing module.

The results from the external inference service are retrieved by the HTTP extension node, and relayed to the IoT Edge hub via IoT Hub message sink node, where they can be further processed by the external logic module. If the inference service is capable of detecting vehicles, for example, the logic module could look for a specific vehicle such as a truck. When the logic module detects the object of interest, it can trigger the signal gate processor node by sending an event via the IoT Edge Hub to the IoT Hub message source node in the pipeline. The output from the signal gate is shown to go to a video sink node. Each time a truck is detected, video is recorded to the cloud (appended to the video resource).

An enhancement to this example is to use a motion detector processor ahead of the HTTP extension processor node. This will reduce the load on the inference service, such as during night time when there may be long periods of time when there are no vehicles on the highway. 

## Next steps

[Tutorial: event-based video recording](record-event-based-live-video.md)

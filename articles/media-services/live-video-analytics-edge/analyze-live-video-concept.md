---
title: Analyzing live video without any recording - Azure
description: A Media Graph can be used to just extract analytics from a live video stream, without having to record it on the edge or in the cloud. This article discusses this concept.
ms.topic: conceptual
ms.date: 04/27/2020

---
# Analyzing live video without any recording

## Suggested pre-reading 

* [Media Graph concept](media-graph-concept.md)
* [Event-based video recording](event-based-video-recording-concept.md)

## Overview  

A media graph can be used to analyze live video, without record any portion of the video to a file or an asset. The media graphs shown below are similar to the ones in [Event-Based Video Recording](event-based-video-recording-concept.md) scenarios, but without an asset or file sink node.

### Motion detection

The media graph shown below consists of a [RTSP source](media-graph-concept.md#rtsp-source), a [motion detection processor](media-graph-concept.md#motion-detection-processor) and an [IoT Hub message sink](media-graph-concept.md#iot-hub-message-sink). This graph enables you to detect motion in the incoming live video and relays the motion events to other apps and services via the IoT Hub message sink. The events can be used trigger an alert or a notification to appropriate personnel.

![Live Video Analytics based on motion detection](./media/analyze-live-video/motion-detection.png)

### Analyzing video using custom AI

The media graph shown below enables you to analyze the video capatured by the RTSP source using a custom AI packaged in a separte module. In this media graph, the frame rate filter processsor samples video frames at a configured value and passes them to the HTTP extension processsor, which in turn scales the video frame (per configured values) and encodes it before sending the frame to the AI module using HTTP. Inference results returned by the AI module are packaged in to IoT Hub messages by the IoT Hub message sink and relayed to IoT Edge Hub. This type of media graph can be used to build solutions for a variety of scenarios such as understanding the time-series distribution of vehicles at an intersection, understanding the consumer traffic pattern in a retail store, and so on.


![Live Video Analytics based on an external inferencing module](./media/analyze-live-video/external-inferencing-module.png)

### Optimizing video analysis

The media graph described in the previous section can be optimized by injecting a motion detection processor before the frame rate filter processor. This results in optimal resource utilization as the frame rate filter processor only receives video when motion is detected, thus the AI module is triggered only when there is activity in the video.

![Live Video Analytics based on motion detected frames via external inferencing module](./media/analyze-live-video/motion-detected-frames.png)

## Next steps

[Continuous video recording](continuous-video-recording-concept.md)

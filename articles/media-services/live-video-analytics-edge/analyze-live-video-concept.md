---
title: Live video analytics without video recording - Azure
description: A Media Graph can be used to just extract analytics from a live video stream, without having to record it on the edge or in the cloud. This article discusses this concept.
ms.topic: conceptual
ms.date: 04/27/2020

---
# Live video analytics without video recording

## Suggested pre-reading 

* [Media Graph concept](media-graph-concept.md)
* [Event-based video recording](event-based-video-recording-concept.md)

## Overview  

A Media Graph can be used to just extract analytics from a live video stream, without having to record it on the edge or in the cloud. The Media Graph topologies shown below are similar to the ones in [Event-Based Video Recording](event-based-video-recording-concept.md) scenarios, but without an asset or file sink node.

### Live video analytics based on motion detection 

This is the simplest form of a Media Graph, but powerful, as it allows you to understand motion in physical spaces by leveraging your existing deployment of cameras. It is up to you to take specific action based on the events that are published to the IoT Hub. Consider an example scenario where key infrastructure is locked down and the expectation is that no one will be near it during specific times; e.g. electricity control panel from 10 pm to 4 am. Such assets can be now automatically monitored by leveraging a camera pointed to such a panel and connected to a graph such as below. The graph pushes motion detection events onto the IoT Edge Hub and these can be used to alert the relevant operators.

In the topology below, [RTSP Source](media-graph-concept.md#rtsp-source) delivers the video feed to a [Motion Detection Processor](media-graph-concept.md#motion-detection-processor) that uses an AI model to detect motion. The output events from the Motion Detector are sent to the IoT Edge hub via [IoT Hub Message Sink](media-graph-concept.md#iot-hub-message-sink) for consumption purpose.  You can write your own business logic or use other Azure services either on the edge or in the cloud to consume these events and generate notification alerts for end users.

![Live video analytics based on motion detection](./media/analyze-live-video/motion-detection.png)

### Live video analytics based on an external inferencing module  

In this use case, the customer can analyze video feeds by leveraging an external AI inference service. An example of such a scenario can be understanding the time-series based distribution of vehicles at an intersection or for an entire city. Another customer scenario is customer journey analytics by understanding the distribution of customer counts across different times of the day within a physical retail store. Many such live video analytics scenarios that span different verticals in commercial security, retail intelligence, intrusion detection, traffic management, person detection, object identification, Airline Operational efficiency (for example, Turnaround management) etc. can now be enabled via the topology below.

As seen in the topology, RTSP Source delivers the video feed to a [Frame Rate Filter Processor](media-graph-concept.md#frame-rate-filter-processor) that lowers the rate at which frames are passed on to the [HTTP Extension Processor](media-graph-concept.md#http-graph-extension-processor). The HTTP Extension processor relays the video frames to the external service over REST and gathers the analytics events returned from the external service to publish onto the IoT Edge hub via the IoT Hub Message Hub sink.  Such events can be consumed by customer’s app or other Azure services such as Azure Stream Analytics etc. to generate business insights that fulfill the above discussed scenarios. 

![Live video analytics based on an external inferencing module](./media/analyze-live-video/external-inferencing-module.png)

### Live video analytics based on motion detected frames via external inferencing module 

While it is possible to run video analytics on the entire video feed, and it is the need in certain scenarios, especially the ones that are independent of motion within the feed, for scenarios where motion is the prominent trigger for video analytics, the above topology is wasteful of the limited processing power available on the edge. 

For such customer scenarios, a more optimum topology can be constructed where motion detection can be used to filter the video frames that are sent to an external inference service. This kind of topology ensures that analytics is performed only on frames that have motion in them. 

Consider an example scenario where the operational efficiency especially turnaround time of the aircraft and safety of personnel servicing the aircraft has a material impact on the business of an airline. Such an airline customer can now deploy AI-based video analytics on the edge by connecting tarmac cameras to the topology below, thereby  understanding and improving the turnaround time and safety. Both of these business outcomes are possible when analyzing frames that have motion (for example, airplane arrived, baggage arrived, person near active engine etc.) and the customer could leverage the below Media Graph topology along with their own custom model to capture events that help understand and influence those outcomes. Such events are pushed onto the IoT Edge Hub where they can be subjected to additional business logic to derive business insights.

![Live video analytics based on motion detected frames via external inferencing module](./media/analyze-live-video/motion-detected-frames.png)

## Next steps

[Continuous video recording](continuous-video-recording-concept.md)
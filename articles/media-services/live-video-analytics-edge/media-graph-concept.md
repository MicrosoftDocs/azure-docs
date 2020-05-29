---
title: Media graph concept - Azure
description: Media graph lets you define where media should be captured from, how it should be processed, and where the results should be delivered. This article gives a detailed description of the media graph concept.
ms.topic: conceptual
ms.date: 04/27/2020

---
# Media graph concept

## Suggested pre-reading

* [Live Video Analytics on IoT Edge overview](overview.md)
* [Live Video Analytics on IoT Edge terminology](terminology.md)

## Overview

Media graph lets you define where media should be captured from, how it should be processed, and where the results should be delivered. A media graph consists of source, processor, and sink nodes. The diagram below provides a graphical representation of a media graph.   

![A graphical representation of a media graph](./media/media-graph/overview.png)


* **Source nodes** enable capturing of media into the media graph. Media in this context, conceptually, could be an audio stream, a video stream, a data stream, or a stream that has audio, video, and/or data combined together in a single stream.
* **Processor nodes** enable processing of media within the media graph.
* **Sink nodes** enable delivering the processing results to services and apps outside the media graph.

## Media graph topologies and instances 

Live Video Analytics on IoT Edge enables you to manage media graphs via two concepts – "graph topology" and "graph instance". A graph topology enables you to define a blueprint of a graph, with parameters as placeholders for values. The topology defines what nodes are used in the media graph, and how they are connected within the media graph. Values for the parameters can be specified when creating graph instances referencing the topology. This enables you to create multiple instances referencing the same topology but with different values for the parameters specified in the topology. 

## Media graph states  

Media graph can be in one of the following states:

* Inactive –  represents the state where a media graph is configured but not active.
* Activating – the state when a media graph is being instantiated (that is, the transition state between inactive and active).
* Active – the state when a media graph is active. 

    > [!NOTE]
    >  Media graph can be active without data flowing through it (for example, the input video source goes offline).
* Deactivating – This is the state when a media graph is transitioning from active to inactive.

The diagram below illustrates the media graph state machine.

![Media graph state machine](./media/media-graph/media-graph-state-machine.png)

## Sources, processors, and sinks  

Live Video Analytics on IoT Edge supports the following types of nodes within a media graph:

### Sources 

#### RTSP source 

An RTSP source enables capturing media from a [RTSP](https://tools.ietf.org/html/rfc2326) server. RTSP is used for establishing and controlling the media sessions between a server and a client. The RTSP source node in the media graph acts as a client and can establish a session with the specified RTSP server. Many devices such as most [IP cameras](https://en.wikipedia.org/wiki/IP_camera) have a built-in RTSP server. [ONVIF](https://www.onvif.org/) mandates RTSP to be supported in its definition of [Profiles G, S & T](https://www.onvif.org/wp-content/uploads/2019/12/ONVIF_Profile_Feature_overview_v2-3.pdf) compliant devices. The RTSP source node in media graph requires you to specify an RTSP URL, along with credentials to enable an authenticated connection.

#### IoT Hub message source 

Like other [IoT Edge modules](../../iot-edge/iot-edge-glossary.md#iot-edge-module), Live Video Analytics on IoT Edge module can receive messages via the [IoT Edge hub](../../iot-edge/iot-edge-glossary.md#iot-edge-hub). These messages can be sent from other modules, or apps running on the Edge device, or from the cloud. Such messages can be delivered (routed) to a [named input](../../iot-edge/module-composition.md#sink) on the module. An IoT Hub Message source allows such messages to be routed to a media graph instance. These messages or signals can then be used internally in the media graph, typically to activate signal gates (see [signal gate processor](#signal-gate-processor) below). 

For example, you can have an IoT Edge module that generates a message when a door is opened. The message from that module can be routed to IoT Edge hub, from where it can be then routed to the IoT hub message source of a media graph. Within the media graph, the IoT hub message source can pass the event to a signal gate processor, which can then turn on recording of the video from an RTSP source into a file. 

### Processors  

#### Motion detection processor 

The motion detection processor enables you to detect motion in live video. It examines incoming video and determines if there is movement in the video. If motion is detected, it passes on the video to the downstream node, and emits an event. Motion detection processor (in conjunction with other media graph nodes) can be used to trigger recording of the incoming video when there is motion detected.

#### Frame rate filter processor  

The frame rate filter processor enables you to sample frames from the incoming video stream at a specified frame rate. This enables you to reduce the number of frames sent to down-stream nodes (such as HTTP extension processor) for further processing.

#### HTTP extension processor 

The HTTP extension processor enables you to plug your own AI to a media graph. The HTTP extension processor takes as input decoded video frames and relays such frames to an HTTP endpoint. The processor has the capability to authenticate with the HTTP endpoint if required. Additionally, the processor has in-built image formatter that allows scaling and encoding of video frames before they are relayed forward. Scaling has options for the image aspect ratio to be preserved, padded or stretched while encoding provides options for different image encoding such as jpeg, png, or bmp.

#### Signal gate processor  

The signal gate processor allows for media to be conditionally forwarded from one node to another. It also acts as a buffer, allowing for synchronization of media and events. An example use case is to insert a signal gate processor between an RTSP source and an asset sink and using the output of motion detector processor to trigger the gate. With such a media graph, you can trigger recording of media only when motion is detected in the incoming video. 

### Sinks  

#### Asset sink  

An asset sink enables a media graph to write media (video and/or audio) data to an Azure Media Services asset. See the [asset](terminology.md#asset) section for more information about assets, and their role in recording and playback of media.  

#### File sink  

The file sink enables a media graph to write media (video and/or audio) data to a location on the local file system of the IoT Edge device. The file sink must be downstream of a signal gate processor. This limits the duration of the output files to values specified in the signal gate processor properties.

#### IoT Hub message sink  

An IoT Hub message sink enables you to publish events to IoT Edge hub. The edge hub can then route the data to other modules or apps on the edge device, or to IoT Hub in the cloud (per routes specified in the deployment manifest). The IoT Hub message sink can  accept events from upstream processors such as a motion detection processor, or from an external inference service via HTTP extension processor.

## Scenarios

Using a combination of the source, processor, and sink nodes, defined above, you can build media graphs for a variety of scenarios. A few example scenarios are as follows

* [Continuous video recording](continuous-video-recording-concept.md)
* [Event-based video recording](event-based-video-recording-concept.md)
* [Live Video Analytics without video recording](analyze-live-video-concept.md)

## Next steps

Follow the [Quickstart: Run Live Video Analytics with your own model](use-your-model-quickstart.md) article to see how you can run motion detection on a live video feed.

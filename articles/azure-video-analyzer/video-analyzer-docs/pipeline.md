---
title: Azure Video Analyzer pipeline
description: An Azure Video Analyzer pipeline lets you define where input data should be captured from, how it should be processed, and where the results should be delivered. A pipeline consists of nodes that are connected to achieve the desired flow of data.
ms.topic: conceptual
ms.date: 03/27/2021

---
# Pipeline

An Azure Video Analyzer pipeline lets you define where input data should be captured from, how it should be processed, and where the results should be delivered. A pipeline consists of nodes that are connected to achieve the desired flow of data. The diagram below provides a graphical representation of a pipeline.

> [!div class="mx-imgBorder"]
> :::image type="content" source="./media/pipeline/pipeline-representation.svg" alt-text="Representation of a pipeline":::

A pipeline supports different types of nodes

* **Source nodes** enable capturing of data into the pipeline. Data refers to audio, video, and/or metadata.
* **Processor nodes** enable processing of media within the pipeline.
* **Sink nodes** enable delivering the results to services and apps outside the pipeline.

## Suggested pre-reading

* [Overview](overview.md)
* [Terminology](terminology.md)

## Pipeline topologies

A pipeline topology enables you to define what nodes are in the pipeline, how they are connected, with parameters as placeholders for values. As an example, if you want to record videos from multiple IP cameras, you can define a topology consisting of an RTSP source node and a video sink. The RTSP source node can have RTSP URL, username, and password as parameters. The video sink node can have the video name as a parameter. Values for these parameters can be provided when creating multiple pipelines from the same topology - one pipeline per camera.

## Pipeline states

The lifecycle of a pipeline is represented in the diagram below.

> [!div class="mx-imgBorder"]
> :::image type="content" source="./media/pipeline/pipeline-activation.svg" alt-text="Lifecycle of a pipeline":::

You start with creating the pipeline topology. Once the topology is defined, you can create pipelines by providing values for the parameters. Upon successful creation a pipeline is in the “Inactive” state. Upon activation, a pipeline enters the “Activating” state and then “Active” state. 

Data (live video) starts flowing through the pipeline when it reaches the “Active” state. Upon deactivation, an active pipeline enters the “Deactivating” state and then “Inactive” state. Only inactive pipelines can be deleted.

Multiple pipelines can be created from a single topology by supplying different values for the parameters in the topology. A topology can be deleted when all pipelines have been deleted.

> [!NOTE]
> A pipeline can be active without data flowing through it (for example, the input video source goes offline). Your Azure subscription will be billed when the pipeline is in the active state.

## Sources, processors, and sinks

Video Analyzer edge module supports the following types of nodes within a pipeline:

### Sources

#### RTSP source

An RTSP source node enables you to capture media from a RTSP server. The RTSP protocol defines establishing and controlling the media sessions between a server (for example, an IP camera) and a client. The [RTSP](https://tools.ietf.org/html/rfc2326) source node in a pipeline acts as a client and can establish a session with an RTSP server. Many devices such as most [IP cameras](https://en.wikipedia.org/wiki/IP_camera) have a built-in RTSP server. [ONVIF](https://www.onvif.org/) mandates RTSP to be supported in its definition of [Profiles G, S & T](https://www.onvif.org/wp-content/uploads/2019/12/ONVIF_Profile_Feature_overview_v2-3.pdf) compliant devices. The RTSP source node requires you to specify an RTSP URL, along with credentials to enable an authenticated connection.

#### IoT Hub message source

Like other [IoT Edge modules](../../iot-fundamentals/iot-glossary?view=iotedge-2020-11&preserve-view=true#iot-edge-module), Azure video analyzer on IoT Edge module can receive messages via the [IoT Edge hub](../../iot-fundamentals/iot-glossary?view=iotedge-2020-11&preserve-view=true#iot-edge-hub). Messages can be sent from other modules, or apps running on the Edge device, or from the cloud. Such messages can be delivered (routed) to a [named input](../../iot-edge/module-composition?view=iotedge-2020-11&preserve-view=true#sink) on the video analyzer module. An IoT Hub message source node enables the ingestion of such messages into a pipeline. Messages can then be used in a pipeline to activate a signal gate (see [signal gates](#signal-gate-processor) below).

For example, you could have an IoT Edge module that generates a message when a door is opened. The message from that module can be routed to IoT Edge hub, from where it can be then routed to the IoT hub message source of a pipeline. Within the pipeline, the message can be passed from the IoT hub message source to a signal gate processor, which can then turn on recording of the video from an RTSP source into a file.

### Processors

#### Motion detection processor

The motion detection processor node enables you to detect motion in live video. It examines incoming video frames and determines if there is movement in the video. If motion is detected, it passes on the video frame to the next node in the pipeline, and emits an event. The motion detection processor node (in conjunction with other nodes) can be used to trigger recording of the incoming video when there is motion detected.

#### HTTP extension processor

The HTTP extension processor node enables you to extend the pipeline to your own IoT Edge module. This node takes decoded video frames as input, and relays such frames to an HTTP REST endpoint exposed by your module, where you can analyze the frame with an AI model and return inference results back. Learn more about the [processor here](pipeline-extension.md#http-extension-processor).

#### gRPC extension processor

The gRPC extension processor node takes decoded video frames as the input, and relays such frames to a [gRPC](pipeline-extension.md#grpc-extension-processor) endpoint exposed by your module. The node supports transferring of data using [shared memory](https://en.wikipedia.org/wiki/Shared_memory) or directly embedding the frame into the body of gRPC messages. Additionally, the node has a built-in image formatter for scaling and encoding of video frames before they are relayed to the gRPC endpoint. The scaler has options for the image aspect ratio to be preserved, padded, or stretched. The image encoder supports jpeg, png, and bmp formats. Learn more about the [processor here](/pipeline-extension.md#grpc-extension-processor).

#### Cognitive Services extension processor

The Cognitive Services extension processor node enables you to extend the pipeline to [Spatial Analysis](https://azure.microsoft.com/services/cognitive-services/computer-vision/) IoT Edge module. This node takes decoded video frames as input, and relays such frames to an  [gRPC](pipeline-extension.md#grpc-extension-processor) endpoint exposed by, where you can analyze the frame with Spatial analysis skills and return inference results back. Learn more about the [processor here](pipeline-extension.md#cognitive-services-extension-processor).

#### Signal gate processor

The signal gate processor node enables you to conditionally forward media from one node to another. An example use case is to insert a signal gate processor node between the RTSP source node and the video sink node, and using the output of a motion detector processor node to trigger the gate. With such a pipeline, you would be recording video only when motion is detected. You can also use the output from HTTP or gRPC extension node to trigger the gate, instead of motion detection processor node, thus enabling recording of video when something interesting is detected.

#### Object tracker processor

The object tracker processor node enables you to track objects detected in an upstream HTTP or gRPC extension processor node. This means you can focus on building a custom object detection model that meets your business needs and combine it with the object tracker to generate insights such as dwell time, heatmap, etc.

#### Line crossing processor

The line crossing processor node enables you to trigger an event when an object crosses a line defined by you. In addition to that, it also maintains a count of the number of objects that cross the line (from the time a pipeline is activated). A line crossing processor node can be applied downstream from a HTTP or gRPC extension node that is configured to invoke an AI extension service for object detection.

### Sinks

#### Video sink

A video sink node enables you to save video and associated metadata to your Video Analyzer cloud resource. Video can be recorded continuously or dis-continuously (based on events). Video sink node can cache video on the edge device if connectivity to cloud is lost and resume uploading when connectivity is restored. You can see the [continuous video recording](continuous-video-recording.md) article for details on how the properties of this node can be configured.

#### File sink

The file sink node enables you to write video to a location on the local file system of the edge device. There can only be one file sink node in a pipeline, and it must be downstream from a signal gate processor node. This limits the duration of the output files to values specified in the signal gate processor node properties. To ensure that your edge device does not run out of disk space, you can also set the maximum size that the Video Analyzer edge module can use to cache data.

> [!NOTE]
> If the cache gets full, the Video Analyzer edge module will start deleting the oldest data and replace it with the new one.

#### IoT Hub message sink

An IoT Hub message sink node enables you to publish events to IoT Edge hub. The IoT Edge hub can be configured to route the data to other modules or apps on the edge device, or to IoT Hub in the cloud (per routes specified in the deployment manifest). The IoT Hub message sink node can accept events from upstream processor nodes such as a motion detection processor node, or from an external inference service via a HTTP extension processor node.

## Rules on the use of nodes

See [limitations on pipelines](quotas-limitations.md#limitations-on-pipeline-topologies-at-preview) for additional rules on how different nodes can be used within a pipeline.

## Scenarios

Using a combination of the sources, processors, and sinks defined above, you can build pipelines for a variety of scenarios involving analysis of live video. Example scenarios are:

* [Continuous video recording](continuous-video-recording.md) 
* [Event-based video recording](event-based-video-recording-concept.md) 
* [Video analysis without video recording](analyze-live-video-without-recording.md) 

## Next steps

To see how you can run motion detection on a live video feed, see [Quickstart: Get started – Azure Video Analyzer](get-started-detect-motion-emit-events.md).


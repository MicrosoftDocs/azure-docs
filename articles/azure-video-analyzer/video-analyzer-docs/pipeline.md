---
title: The pipeline concept
description: An Azure Video Analyzer pipeline you ingest, process, and publish video within Azure Video Analyzer edge and cloud. A pipeline consists of nodes that are connected to achieve the desired flow of data.
ms.topic: conceptual
ms.date: 11/04/2021
ms.custom: ignite-fall-2021
---
# Pipeline

[!INCLUDE [deprecation notice](./includes/deprecation-notice.md)]

Pipelines let you ingest, process, and publish video within Azure Video Analyzer edge and cloud. Pipeline topologies allow you to define how video should be ingested, processed, and published within through a set of configurable nodes. Once defined, topologies can then be instantiated as individual pipelines that target specific cameras or source content, which are processed independently. Pipelines can be defined and instantiated at the edge for on premises video processing, or in the cloud. The diagrams below provides graphical representations of such pipelines.

> [!div class="mx-imgBorder"]
> :::image type="content" source="./media/pipeline/pipeline-representation.svg" alt-text="Representation of a pipeline":::

> [!div class="mx-imgBorder"]
> :::image type="content" source="./media/pipeline/cloud-pipeline.svg" alt-text="Representation of a cloud pipeline":::

## Suggested pre-reading

* [Overview](overview.md)
* [Terminology](terminology.md)

## Pipeline topologies

A pipeline topology enables you to describe how live video or [recorded videos](terminology.md#recording) should be processed and analyzed for your custom needs through a set of interconnected nodes. It serves as a template or blueprint for your live video workflow. **Video analyzer supports two kinds of topologies: live and batch. Live topologies, as the name suggests, are used with live video from cameras. Batch topologies are used to process recorded videos.**

**Pipeline** supports different types of nodes:

* **Source nodes** enable capturing of data into the pipeline. Data refers to audio, video, and/or metadata.
* **Processor nodes** enable processing of media within the pipeline.
* **Sink nodes** enable delivering the results to services and apps outside the pipeline.

You can create different topologies for different scenarios by selecting which nodes are in the topology, how they are connected, with parameters as placeholders for values. A pipeline is an individual instance of a specific pipeline topology. A pipeline is where media is actually processed. Pipelines can be associated with individual cameras or recorded videos through user defined parameters declared in the pipeline topology. **Instances of a live topologies are called live pipelines, and instances of a batch topology are referred to as pipeline jobs.**

As an example, if you want to record videos from multiple IP cameras, you can define a pipeline topology consisting of an RTSP source node and a video sink node. The RTSP source node can have RTSP URL, username, and password as parameters. The video sink node can have the video name as a parameter. Values for these parameters can be provided when creating multiple pipelines from the same topology - one pipeline per camera.

Batch topologies are supported only in the Video Analyzer service (and not in the Video Analyzer edge module). Live pipelines are supported in both.

## Pipeline states

You start with creating the pipeline topology. Once the topology is defined, you can create pipelines by providing values for the parameters.

### Live pipeline

The lifecycle of a  pipeline is represented in the diagram below.

> [!div class="mx-imgBorder"]
> :::image type="content" source="./media/pipeline/pipeline-activation.svg" alt-text="Lifecycle of a live pipeline":::

Upon successful creation a pipeline is in the 'Inactive' state. Upon activation, a pipeline briefly enters the 'Activating' state before going to the 'Active' state.
Data (live video) starts flowing through the pipeline when it is in the 'Active' state. Upon deactivation, an active pipeline enters the 'Deactivating' state and then 'Inactive' state. Only inactive pipelines can be deleted.

Live pipelines are designed to remain active, once activated, and keep processing the live video from the source (camera). An explicit deactivate command is required in order to stop the processing.
A pipeline can be active without data flowing through it (for example, the input video source goes offline). Your Azure subscription will be billed when the pipeline is in the active state.

### Batch pipeline

The lifecycle of a pipeline job is represented in the diagram below.

> [!div class="mx-imgBorder"]
> :::image type="content" source="./media/pipeline/batch-pipeline-lifecycle.svg" alt-text="Diagram of a batch pipeline lifecycle.":::

Upon successful creation of a pipeline job, it goes into the 'Processing' state. If the job completes successfully it goes into a 'Completed' state, else if it fails it goes to the 'Failed' state. Alternatively, while the pipeline job is in the 'Processing' state, a cancel request can be issued. If that request is successful, the job will go to the 'Canceled' state. Your Azure subscription will only be billed if the pipeline job completes successfully.

Multiple pipelines can be created from a single topology by supplying different values for the parameters in the topology. For example you can submit pipeline jobs with the same topology for different video recordings. A topology can be deleted when all pipelines have been deleted.

## Sources, processors, and sinks

Video Analyzer allows you to define pipeline topologies with the following nodes.

> [!NOTE]
> Not all nodes are available in both Video Analyzer edge module and service. Please see [Rules on nodes usage](pipeline.md#rules-on-the-use-of-nodes).

### Sources

#### RTSP source

An RTSP source node enables you to capture media from a RTSP capable camera - see [here](quotas-limitations.md#supported-cameras) for details. The RTSP source node requires you to specify an RTSP URL, along with credentials to enable an authenticated connection.

#### IoT Hub message source

Like other [IoT Edge modules](../../iot-fundamentals/iot-glossary.md?view=iotedge-2020-11&preserve-view=true#iot-edge-device), Azure Video Analyzer module can receive messages via the [IoT Edge hub](../../iot-fundamentals/iot-glossary.md?view=iotedge-2020-11&preserve-view=true#iot-edge-hub). Messages can be sent from other modules, or apps running on the Edge device, or from the cloud. Such messages can be delivered (routed) to a [named input](../../iot-edge/module-composition.md?view=iotedge-2020-11&preserve-view=true#sink) on the video analyzer module. An IoT Hub message source node enables the ingestion of such messages into a pipeline. Messages can then be used in a pipeline to activate a signal gate (see [signal gates](#signal-gate-processor) below).

For example, you could have an IoT Edge module that generates a message when a door is opened. The message from that module can be routed to IoT Edge hub, from where it can be then routed to the IoT hub message source of a pipeline. Within the pipeline, the message can be passed from the IoT hub message source to a signal gate processor, which can then turn on recording of the video from an RTSP source into a file.

#### Video source

Allows a Video Analyzer recorded video content to be used as a source. The node requires you to specify the name of the [video resource](terminology.md#video), as well as the start and end time of the portion(s) of the recorded video to be processed.

### Processors

#### Motion detection processor

The motion detection processor node enables you to detect motion in live video. It examines incoming video frames and determines if there is movement in the video. If motion is detected, it passes on the video frame to the next node in the pipeline, and emits an event. The motion detection processor node (in conjunction with other nodes) can be used to trigger recording of the incoming video when there is motion detected.

#### HTTP extension processor

The HTTP extension processor node enables you to extend the pipeline to your own IoT Edge module. This node takes decoded video frames as input, and relays such frames to an HTTP REST endpoint exposed by your module, where you can analyze the frame with an AI model and return inference results back. Additionally, this node has a built-in image formatter for scaling and encoding of video frames before they are relayed to the HTTP endpoint. The scaler has options for the image aspect ratio to be preserved, padded, or stretched. The image encoder supports JPEG, PNG, BMP, and RAW formats. Learn more about the [processor here](pipeline-extension.md#http-extension-processor).

#### gRPC extension processor

The gRPC extension processor node takes decoded video frames as the input, and relays such frames to a [gRPC](terminology.md#grpc) endpoint exposed by your module. The node supports transferring of data using [shared memory](https://en.wikipedia.org/wiki/Shared_memory) or directly embedding the frame into the body of gRPC messages. Just like the HTTP extension process, this node also has a built-in image formatter for scaling and encoding of video frames before they are relayed to the gRPC endpoint. Learn more about the [processor here](pipeline-extension.md#grpc-extension-processor).

#### Cognitive Services extension processor

The Cognitive Services extension processor node enables you to extend the pipeline to [Spatial Analysis](https://azure.microsoft.com/services/cognitive-services/computer-vision/) IoT Edge module. This node takes decoded video frames as input, and relays such frames to an  [gRPC](pipeline-extension.md#grpc-extension-processor) endpoint exposed by, where you can analyze the frame with Spatial analysis skills and return inference results back. Learn more about the [processor here](pipeline-extension.md#cognitive-services-extension-processor).

#### Signal gate processor

The signal gate processor node enables you to conditionally forward media from one node to another. The signal gate processor node must be immediately followed by a video sink or file sink. An example use case is to insert a signal gate processor node between the RTSP source node and the video sink node, and using the output of a motion detector processor node to trigger the gate. With such a pipeline, you would be recording video only when motion is detected. You can also use the output from HTTP or gRPC extension node to trigger the gate, instead of motion detection processor node, thus enabling recording of video when something interesting is detected.

#### Object tracker processor

The object tracker processor node enables you to track objects detected in an upstream HTTP or gRPC extension processor node. This node comes in handy when you need to detect objects in every frame, but the edge device does not have the necessary compute power to be able to apply the AI model on every frame. If you can only run your computer vision model on every 10th frame, the object tracker can take the results from one such frame, and then use [optical flow](https://en.wikipedia.org/wiki/Optical_flow) techniques to generate results for the 2nd, 3rd,…, 9th frame, until the model is applied again on the next frame. There is a trade-off between compute power and accuracy when using this node. The closer the frames on which the AI model is applied, the better the accuracy. However this means applying the AI model more frequently, translating to higher compute power. One common use of the object tracker processor node is to detect when an object crosses a line.

#### Line crossing processor

The line crossing processor node enables you to detect when an object crosses a line defined by you. In addition to that, it also maintains a count of the number of objects that cross the line (from the time a pipeline is activated). This node must be used downstream of an object tracker processor node.

#### Encoder processor

The encoder processor node allows user to specify encoding properties when converting the recorded video into the desired format for downstream processing. For example video recorded from a camera configured for [4K resolution](https://en.wikipedia.org/wiki/4K_resolution) may need to be resized to [Full HD (1920x1080)](https://en.wikipedia.org/wiki/1080p) resolution before it is exported to a file.

### Sinks

#### Video sink

A video sink node enables you to save video and associated metadata to your Video Analyzer cloud resource. Video can be recorded continuously or sparsely (based on events). Video sink node can cache video on the edge device if connectivity to cloud is lost and resume uploading when connectivity is restored. You can see the [continuous video recording](continuous-video-recording.md) article for details on how the properties of this node can be configured.

Due to security reasons, a given Video Analyzer **edge module** instance can only record content to new video entries, or previously recorded video entries by the same module. Any attempt to record content to an existing video which has not been created by the same edge module instance will result in failure to record.

#### File sink

The file sink node enables you to write video to a location on the local file system of the edge device. There can only be one file sink node in a pipeline, and it must be downstream from a signal gate processor node. This limits the duration of the output files to values specified in the signal gate processor node properties. To ensure that your edge device does not run out of disk space, you can also set the maximum size that the Video Analyzer edge module can use to cache data.

If the cache gets full, the Video Analyzer edge module will start deleting the oldest data and replace it with the new one.

#### IoT Hub message sink

An IoT Hub message sink node enables you to publish events to IoT Edge hub. The IoT Edge hub can be configured to route the data to other modules or apps on the edge device, or to IoT Hub in the cloud (per routes specified in the deployment manifest). The IoT Hub message sink node can accept events from upstream processor nodes such as a motion detection processor node, or from an external inference service via an HTTP extension processor node.

## Rules on the use of nodes

Following table describes the current rules on which nodes are allowed in live and batch topologies, and in Video Analyzer edge module and service.

| Node name                              | Topology kind  |  Deployment       |
| -------------------------------------- | ---------------|-------------------|
| RTSP source                            | Live           |  Edge and cloud   |
| IoT hub message source                 | Live           |  Edge             |
| Video source                           | Batch          |  Cloud            |
| Motion detection processor             | Live           |  Edge             |
| HTTP extension processor               | Live           |  Edge             |
| gRPC extension processor               | Live           |  Edge             |
| Cognitive Services extension processor | Live           |  Edge             |
| Signal gate processor                  | Live           |  Edge             |
| Object tracker processor               | Live           |  Edge             |
| Line crossing processor                | Live           |  Edge             |
| Encoder processor                      | Batch          |  Cloud            |
| Video sink                             | Live and batch |  Edge and cloud   |
| File sink                              | Live           |  Edge             |
| IoT hub message sink                   | Live           |  Edge             |

See [limitations on pipelines](quotas-limitations.md#limitations-on-pipeline-topologies) for additional rules on how different nodes can be used within a topology.

## Scenarios

Using a combination of the sources, processors, and sinks defined above, you can build pipelines for a variety of scenarios involving analysis of live video. Example scenarios are:

* [Continuous video recording](continuous-video-recording.md) 
* [Event-based video recording](event-based-video-recording-concept.md) 
* [Video analysis without video recording](analyze-live-video-without-recording.md) 

## Next steps

To see how you can run motion detection on a live video feed, see [Quickstart: Get started – Azure Video Analyzer](get-started-detect-motion-emit-events.md).

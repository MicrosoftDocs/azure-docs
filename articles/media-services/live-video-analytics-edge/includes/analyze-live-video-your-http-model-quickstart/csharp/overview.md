> [!div class="mx-imgBorder"]
> :::image type="content" source="../../../media/quickstarts/overview-qs5.svg" alt-text="Signals flow":::

This diagram shows how the signals flow in this quickstart. An [edge module](https://github.com/Azure/live-video-analytics/tree/master/utilities/rtspsim-live555) simulates an IP camera hosting a Real-Time Streaming Protocol (RTSP) server. An [RTSP source](../../../media-graph-concept.md#rtsp-source) node pulls the video feed from this server and sends video frames to the [HTTP extension processor](../../../media-graph-concept.md#http-extension-processor) node. 

The HTTP extension node plays the role of a proxy. It samples the incoming video frames set by you `samplingOptions` field and also converts the video frames to the specified image type. Then it relays the image over REST to another edge module that runs an AI model behind an HTTP endpoint. In this example, that edge module is built by using the [YOLOv3](https://github.com/Azure/live-video-analytics/tree/master/utilities/video-analysis/yolov3-onnx) model, which can detect many types of objects. The HTTP extension processor node gathers the detection results and publishes events to the [IoT Hub sink](../../../media-graph-concept.md#iot-hub-message-sink) node. The node then sends those events to [IoT Edge Hub](../../../../../iot-edge/iot-edge-glossary.md#iot-edge-hub).

In this quickstart, you will:

1. Create and deploy the media graph.
1. Interpret the results.
1. Clean up resources.

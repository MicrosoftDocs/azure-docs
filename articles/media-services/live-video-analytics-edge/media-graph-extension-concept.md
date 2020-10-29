---
title: What is media graph extension - Azure
description: Live Video Analytics on IoT Edge allows you to extend the media graph processing capabilities through a graph extension node.
ms.topic: overview
ms.date: 09/14/2020

---
# Media graph extension

Live Video Analytics on IoT Edge allows you to extend the media graph processing capabilities through a graph extension node. Your analytics extension plugin can make use of traditional image-processing techniques or computer vision AI models. Graph extensions are enabled by including an extension processor node in a media graph. The extension processor node relays video frames to the configured  endpoint and acts as the interface to your extension. The connection can be made to a local or remote endpoint and it can be secured by authentication and TLS encryption, if required. Additionally, the graph extension processor node allows for optional scaling and encoding of the video frames before they are submitted to your custom extension.

Live Video Analytics supports two kinds of media graph extension processors:

* [HTTP extension processor](media-graph-concept.md#http-extension-processor)
* [gRPC extension processor](media-graph-concept.md#grpc-extension-processor)

## HTTP extension processor

HTTP extension processor enables extensibility scenarios using the HTTP protocol, where performance and/or optimal resource utilization is not the primary concern. You can expose your own AI to a media graph via an HTTP REST endpoint. 

Use HTTP extension processor node when:

* You want better interoperability with existing HTTP Inferencing systems.
* Low-performance data transfer is acceptable.
* You want to use a simple request-response interface to Live Video Analytics.

## gRPC extension processor

gRPC extension processor enables extensibility scenarios using gRPC based, highly performant structured protocol. It is ideal for scenarios where performance and/or optimal resource utilization is a priority. The gRPC extension processor enables you to get the full benefit of the structured data definitions. gRPC offers high content transfer performance using:

* [in-box shared memory](https://en.wikipedia.org/wiki/Shared_memory) or 
* directly embedding the content into the body of gRPC messages. 

The gRPC extension processor can be used for sending media properties along with exchanging inference messages.
So, use a gRPC extension processor node when you:

* Want to use a structured contract (for example, structured messages for requests and responses)
* Want to use Protocol Buffers ([protobuf](https://developers.google.com/protocol-buffers)) as its underlying message interchange format for communication.
* Want to communicate with a gRPC server in single stream session instead of the traditional request-response model needing a custom request handler to parse incoming requests and call the right implementation functions. 
* Want low latency and high throughput communication between Live Video Analytics and your module.

## Use your inferencing model with Live Video Analytics

Media Graph Extensions allow you to run inference models of your choice on any available inference runtime, such as ONNX, TensorFlow, PyTorch, or others in your own docker container. The inferencing custom extension should be deployed alongside Live Video Analytics edge module for best performance and will then be invoked via the HTTP extension processor or the gRPC extension processor included in your graph topology. Additionally, the frequency of the calls into your custom extension can be throttled by optionally adding a [motion detector processor](media-graph-concept.md#motion-detection-processor) and a [frame rate filter processor](media-graph-concept.md#frame-rate-filter-processor) upstream to the media extension processor.

The diagram below depicts the high-level data flow:

> [!div class="mx-imgBorder"]
> :::image type="content" source="./media/media-graph-extension/analyze-live-video-with-AI-inference-service.svg" alt-text="AI inference service":::

## Samples

Checkout some of our [Jupyter notebook](https://github.com/Azure/live-video-analytics/blob/master/utilities/video-analysis/notebooks/readme.md) samples for Live Video Analytics. These notebooks will provide you with step-by-step instructions for **the media graph extensions** on:

* How to create a Docker container image of an extension service
* How to deploy the extension service as a container along with the Live Video Analytics container
* How to use a Live Video Analytics media graph with an extension client and point it to the extension endpoint (HTTP/gRPC)
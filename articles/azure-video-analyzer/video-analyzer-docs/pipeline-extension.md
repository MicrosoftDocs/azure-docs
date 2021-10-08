---
title: Pipeline extension - Azure Video Analyzer
description: Azure Video Analyzer allows you to extend the pipeline processing capabilities through a pipeline extension node. This article describes the pipeline extension node.
ms.service: azure-video-analyzer
ms.topic: conceptual
ms.date: 06/01/2021

---

# Pipeline extension

Azure Video Analyzer allows you to extend the pipeline processing capabilities through a pipeline extension node. Your analytics extension plugin can make use of traditional image-processing techniques or computer vision AI models. Pipeline extensions are enabled by including an extension processor node in the pipeline flow. The extension processor node relays video frames to the configured endpoint and acts as the interface to your extension. The connection can be made to a local or remote endpoint and it can be secured by authentication and TLS encryption, if necessary. Additionally, the pipeline extension processor node allows for optional scaling and encoding of the video frames before they are submitted to your custom extension.

Video Analyzer supports the following pipeline extension processors:

* [HTTP extension processor](pipeline.md#http-extension-processor) 
* [gRPC extension processor](pipeline.md#grpc-extension-processor)
* [Cognitive Services extension processor](pipeline.md#cognitive-services-extension-processor) 
	
The pipeline extension node expects the analytics extension plugin to return the results in JSON format. Ideally the results should follow the [inference metadata schema object model](inference-metadata-schema.md)

## HTTP extension processor

HTTP extension processor enables extensibility scenarios using the [HTTP protocol](http-extension-protocol.md), where performance and/or optimal resource utilization is not the primary concern. You can expose your own AI to a pipeline via an HTTP REST endpoint.

Use HTTP extension processor node when:

* You want better interoperability with existing HTTP Inferencing systems.
* Low-performance data transfer is acceptable.
* You want to use a simple request-response interface to Video Analyzer.

## gRPC extension processor

gRPC extension processor enables extensibility scenarios using gRPC based, highly performant [structured protocol](grpc-extension-protocol.md). It is ideal for scenarios where performance and/or optimal resource utilization is a priority. The gRPC extension processor enables you to get the full benefit of the structured data definitions. gRPC offers high content transfer performance using:

* [in-box shared memory](https://en.wikipedia.org/wiki/Shared_memory) or
* directly embedding the content into the body of gRPC messages.

The gRPC extension processor can be used for sending properties along with exchanging inference messages. So, use a gRPC extension processor node when you:

* Want to use a structured contract (for example, structured messages for requests and responses)
* Want to use [Protocol Buffers (protobuf)](https://developers.google.com/protocol-buffers) as its underlying message interchange format for communication.
* Want to communicate with a gRPC server in single stream session instead of the traditional request-response model needing a custom request handler to parse incoming requests and call the right implementation functions.
* Want low latency and high throughput communication between Video Analyzer and your module.

## Cognitive Services extension processor

Cognitive Services extension processor is a custom-built extension processor that allows Video Analyzer to work well with the [Computer Vision Spatial Analysis]../../cognitive-services/computer-vision/) capabilities using gRPC based, highly performant [structured protocol](grpc-extension-protocol.md). 

Use Cognitive Services extension processor node when:

* You want better interoperability with existing [Spatial Analysis operations](../../cognitive-services/computer-vision/intro-to-spatial-analysis-public-preview.md).
* Want to use all the benefits of gRPC protocol, accuracy, and performance of Microsoft built and supported AI.
* Analyze multiple camera feeds at low latency and high throughput.

## Use your inferencing model

Pipeline extensions allow you to run inference models of your choice on any available inference runtime, such as ONNX, TensorFlow, PyTorch, or others in your own docker container. The inferencing custom extension should be deployed alongside Video Analyzer  edge module for best performance and will then be invoked via the HTTP extension processor, the gRPC extension processor, or the Cognitive Services extension processor included in your pipeline topology. Additionally, the frequency of the calls into your custom extension can be throttled by optionally adding a [motion detector processor](pipeline.md#motion-detection-processor) upstream to the pipeline extension processor.

The diagram below depicts the high-level data flow:

> [!div class="mx-imgBorder"]
> :::image type="content" source="./media/pipeline-extension/ai-inference-results.svg" alt-text="Inferencing model":::
 
## Samples

You can get started with one of our quickstarts that illustrate Video Analyzer with pre-built extension service at low frame rates with [HTTP extension processor](pipeline.md#http-extension-processor) or at high frame rates with [gRPC extension processor](pipeline.md#grpc-extension-processor).


## Next steps 

Concept: [Event-based video recording](event-based-video-recording-concept.md)


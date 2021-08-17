---
title: Analyzing live video without recording - Azure
description: A pipeline topology can be used to just extract analytics from a live video stream, without having to record it on the edge or in the cloud. This article discusses this concept.
ms.topic: conceptual
ms.date: 06/01/2021

---
# Analyzing live videos without recording

## Suggested pre-reading 

* [Pipeline concept](pipeline.md)
* [Pipeline extension concept](pipeline-extension.md)
* [Event-based video recording concept](event-based-video-recording-concept.md)

## Overview  

You can use a pipeline topology to analyze live video, without recording any portions of the video to a file or an asset. The pipeline topologies shown below are similar to the ones in the article on [Event-based video recording](event-based-video-recording-concept.md), but without a video sink node or file sink node.

### Motion detection

The pipeline topology shown below consists of an [RTSP source](pipeline.md#rtsp-source) node, a [motion detection processor](pipeline.md#motion-detection-processor) node, and an [IoT Hub message sink](pipeline.md#iot-hub-message-sink) node - you can see the settings used in its [JSON representation](https://github.com/Azure/video-analyzer/blob/main/pipelines/live/topologies/motion-detection/topology.json). This topology enables you to detect motion in the incoming live video stream and relay the motion events to other apps and services via the IoT Hub message sink node. The external apps or services can trigger an alert or send a notification to appropriate personnel.

> [!div class="mx-imgBorder"]
> :::image type="content" source="./media/analyze-live-video-without-recording/motion-detection.svg" alt-text="Detecting motion in live video":::

### Analyzing video using a custom vision model 

The pipeline topology shown below enables you to analyze a live video stream using a custom vision model packaged in a separate module. You can see the settings used in its [JSON representation](https://github.com/Azure/video-analyzer/blob/main/pipelines/live/topologies/httpExtension/topology.json). There are other [examples](https://github.com/Azure/video-analyzer/tree/main/edge-modules/extensions) available for wrapping models into IoT Edge modules that run as an inference service.

> [!div class="mx-imgBorder"]
> :::image type="content" source="./media/analyze-live-video-without-recording/motion-detected-frames.svg" alt-text="Analyzing live video using a custom vision module":::

In this pipeline topology, the video input from the RTSP source is sent to an [HTTP extension processor](pipeline.md#http-extension-processor) node, which sends image frames (in JPEG, BMP, or PNG formats) to an external inference service over REST. The results from the external inference service are retrieved by the HTTP extension node, and relayed to the IoT Edge hub via IoT Hub message sink node. This type of pipeline topology can be used to build solutions for a variety of scenarios, such as understanding the time-series distribution of vehicles at an intersection, understanding the consumer traffic pattern in a retail store, and so on.

>[!TIP]
> You can manage the frame rate within the HTTP extension processor node using the `samplingOptions` field before sending it downstream.

An enhancement to this example is to use a motion detector processor ahead of the HTTP extension processor node. This will reduce the load on the inference service, since it is used only when there is motion activity in the video.

> [!div class="mx-imgBorder"]
> :::image type="content" source="./media/analyze-live-video-without-recording/custom-model.svg" alt-text="Analyzing live video using a custom vision module on frames with motion":::

## Next steps

[Quickstart: Analyze live video with your own model - HTTP](analyze-live-video-use-your-model-http.md)

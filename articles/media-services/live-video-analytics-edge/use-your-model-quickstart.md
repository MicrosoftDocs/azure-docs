---
title:  Analyze live video by using your own HTTP model - Azure
description: In this quickstart, you'll apply computer vision to analyze the live video feed from a (simulated) IP camera by using your own HTTP model. 
ms.topic: quickstart
ms.date: 04/27/2020
zone_pivot_groups: ams-lva-edge-programming-languages

---
# Quickstart: Analyze live video by using your own HTTP model

This quickstart shows you how to use Live Video Analytics on IoT Edge to analyze a live video feed from a (simulated) IP camera. You'll see how to apply a computer vision model to detect objects. A subset of the frames in the live video feed is sent to an inference service. The results are sent to IoT Edge Hub. 

This quickstart uses an Azure VM as an IoT Edge device, and it uses a simulated live video stream. It's based on sample code written in C#, and it builds on the [Detect motion and emit events](detect-motion-emit-events-quickstart.md) quickstart. 

::: zone pivot="programming-language-csharp"
[!INCLUDE [header](includes/analyze-live-video-your-http-model-quickstart/csharp/header.md)]
::: zone-end

::: zone pivot="programming-language-python"
[!INCLUDE [header](includes/analyze-live-video-your-http-model-quickstart/python/header.md)]
::: zone-end

## Prerequisites

::: zone pivot="programming-language-csharp"
[!INCLUDE [prerequisites](includes/analyze-live-video-your-http-model-quickstart/csharp/prerequisites.md)]
::: zone-end

::: zone pivot="programming-language-python"
[!INCLUDE [prerequisites](includes/analyze-live-video-your-http-model-quickstart/python/prerequisites.md)]
::: zone-end

## Review the sample video

::: zone pivot="programming-language-csharp"
[!INCLUDE [review-sample-video](includes/analyze-live-video-your-http-model-quickstart/csharp/review-sample-video.md)]
::: zone-end

::: zone pivot="programming-language-python"
[!INCLUDE [review-sample-video](includes/analyze-live-video-your-http-model-quickstart/python/review-sample-video.md)]
::: zone-end

## Overview

::: zone pivot="programming-language-csharp"
[!INCLUDE [overview](includes/analyze-live-video-your-http-model-quickstart/csharp/overview.md)]
::: zone-end

::: zone pivot="programming-language-python"
[!INCLUDE [overview](includes/analyze-live-video-your-http-model-quickstart/python/overview.md)]
::: zone-end

## Create and deploy the media graph

::: zone pivot="programming-language-csharp"
[!INCLUDE [create-deploy-media-graph](includes/analyze-live-video-your-http-model-quickstart/csharp/create-deploy-media-graph.md)]
::: zone-end

::: zone pivot="programming-language-python"
[!INCLUDE [create-deploy-media-graph](includes/analyze-live-video-your-http-model-quickstart/python/create-deploy-media-graph.md)]
::: zone-end

## Interpret results

::: zone pivot="programming-language-csharp"
[!INCLUDE [interpret-results](includes/analyze-live-video-your-http-model-quickstart/csharp/interpret-results.md)]
::: zone-end

::: zone pivot="programming-language-python"
[!INCLUDE [interpret-results](includes/analyze-live-video-your-http-model-quickstart/python/interpret-results.md)]
::: zone-end

## Clean up resources

If you intend to try other quickstarts, keep the resources you created. Otherwise, go to the Azure portal, go to your resource groups, select the resource group where you ran this quickstart, and delete all the resources.

## Next steps

* Try a [secured version of the YoloV3 model](https://github.com/Azure/live-video-analytics/blob/master/utilities/video-analysis/tls-yolov3-onnx/readme.md) and deploy it to the IoT Edge device. 

Review additional challenges for advanced users:

* Use an [IP camera](https://en.wikipedia.org/wiki/IP_camera) that has support for RTSP instead of using the RTSP simulator. You can search for IP cameras that support RTSP on the [ONVIF conformant](https://www.onvif.org/conformant-products/) products page. Look for devices that conform with profiles G, S, or T.
* Use an AMD64 or x64 Linux device instead of an Azure Linux VM. This device must be in the same network as the IP camera. You can follow the instructions in [Install Azure IoT Edge runtime on Linux](../../iot-edge/how-to-install-iot-edge-linux.md). Then register the device with Azure IoT Hub by following instructions in [Deploy your first IoT Edge module to a virtual Linux device](../../iot-edge/quickstart-linux.md).

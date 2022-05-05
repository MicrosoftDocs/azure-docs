---
title: Detect motion and emit events from the edge - Azure
description: This quickstart shows you how to use Azure Video Analyzer to detect motion and emit events, by programmatically calling direct methods.
ms.topic: quickstart
ms.date: 11/04/2021
zone_pivot_groups: video-analyzer-programming-languages
ms.custom: ignite-fall-2021, mode-other
---

# Quickstart: Detect motion and emit events

[!INCLUDE [header](includes/edge-env.md)]

[!INCLUDE [deprecation notice](../includes/deprecation-notice.md)]

This quickstart walks you through the steps to get started with Azure Video Analyzer. It uses an Azure VM as an IoT Edge device and a simulated live video stream. After completing the setup steps, you'll be able to run a simulated live video stream through a video pipeline that detects and reports any motion in that stream. The following diagram shows a graphical representation of that pipeline.

> [!div class="mx-imgBorder"]
> :::image type="content" source="./media/get-started-detect-motion-emit-events/motion-detection.svg" alt-text="Detect motion":::

::: zone pivot="programming-language-csharp"
[!INCLUDE [header](includes/detect-motion-emit-events-quickstart/csharp/header.md)]
::: zone-end

::: zone pivot="programming-language-python"
[!INCLUDE [header](includes/detect-motion-emit-events-quickstart/python/header.md)]
::: zone-end

## Prerequisites

::: zone pivot="programming-language-csharp"
[!INCLUDE [prerequisites](./includes/common-includes/csharp-prerequisites.md)]
::: zone-end

::: zone pivot="programming-language-python"
[!INCLUDE [prerequisites](./includes/common-includes/python-prerequisites.md)]
::: zone-end

## Set up Azure resources

[![Deploy to Azure](https://aka.ms/deploytoazurebutton)](https://aka.ms/ava-click-to-deploy)
[!INCLUDE [resources](./includes/common-includes/azure-resources.md)]

## Overview

![Azure Video Analyzer based on motion detection](./media/analyze-live-video/detect-motion.png)

This diagram shows you how the signal flows in this quickstart. An [edge module](https://github.com/Azure/video-analyzer/tree/main/edge-modules/sources/rtspsim-live555) simulates an IP camera hosting a Real-Time Streaming Protocol (RTSP) server. An [RTSP source](../pipeline.md#rtsp-source) node pulls the video feed from this server and sends video frames to the [motion detection processor](../pipeline.md#motion-detection-processor) node. The motion detection processor node enables you to detect motion in live video. It examines incoming video frames and determines if there is movement in the video. If motion is detected, it passes on the video frame to the next node in the pipeline, and emits an event. Finally, any emitted events are sent to the IoT hub message sink where they are published to IoT Hub.

## Set up your development environment

::: zone pivot="programming-language-csharp"
[!INCLUDE [setup development environment](./includes/set-up-dev-environment/csharp/csharp-set-up-dev-env.md)]
::: zone-end

::: zone pivot="programming-language-python"
[!INCLUDE [setup development environment](./includes/set-up-dev-environment/python/python-set-up-dev-env.md)]
::: zone-end

## Review the sample video

::: zone pivot="programming-language-csharp"
[!INCLUDE [review-sample-video](./includes/detect-motion-emit-events-quickstart/csharp/review-sample-video.md)]
::: zone-end

::: zone pivot="programming-language-python"
[!INCLUDE [review-sample-video](./includes/detect-motion-emit-events-quickstart/python/review-sample-video.md)]
::: zone-end

## Examine the sample files

::: zone pivot="programming-language-csharp"
[!INCLUDE [examine-sample-files](./includes/detect-motion-emit-events-quickstart/csharp/examine-sample-files.md)]
::: zone-end

::: zone pivot="programming-language-python"
[!INCLUDE [examine-sample-files](./includes/detect-motion-emit-events-quickstart/python/examine-sample-files.md)]
::: zone-end

## Generate and deploy the deployment manifest

::: zone pivot="programming-language-csharp"
[!INCLUDE [generate-deploy-deployment-manifest](./includes/detect-motion-emit-events-quickstart/csharp/generate-deploy-deployment-manifest.md)]
::: zone-end

::: zone pivot="programming-language-python"
[!INCLUDE [generate-deploy-deployment-manifest](./includes/detect-motion-emit-events-quickstart/python/generate-deploy-deployment-manifest.md)]
::: zone-end

## Prepare to monitor events

::: zone pivot="programming-language-csharp"
[!INCLUDE [prepare-monitor-events](./includes/detect-motion-emit-events-quickstart/csharp/prepare-monitor-events.md)]
::: zone-end

::: zone pivot="programming-language-python"
[!INCLUDE [prepare-monitor-events](./includes/detect-motion-emit-events-quickstart/python/prepare-monitor-events.md)]
::: zone-end

## Run the sample program

::: zone pivot="programming-language-csharp"
[!INCLUDE [run-sample-program](./includes/detect-motion-emit-events-quickstart/csharp/run-sample-program.md)]
::: zone-end

::: zone pivot="programming-language-python"
[!INCLUDE [run-sample-program](./includes/detect-motion-emit-events-quickstart/python/run-sample-program.md)]
::: zone-end

## Interpret results

::: zone pivot="programming-language-csharp"
[!INCLUDE [interpret-results](includes/detect-motion-emit-events-quickstart/csharp/interpret-results.md)]
::: zone-end

::: zone pivot="programming-language-python"
[!INCLUDE [interpret-results](includes/detect-motion-emit-events-quickstart/python/interpret-results.md)]
::: zone-end

## Clean up resources

If you intend to try the other quickstarts, then you should keep the resources you created. Otherwise, in the Azure portal, go to your resource groups, select the resource group where you ran this quickstart, and then delete all of the resources.

## Next steps

- Follow [Quickstart: Analyze a live video feed from a (simulated) IP camera using your own HTTP model](analyze-live-video-use-your-model-http.md) to apply AI to live video feeds.
- Review additional challenges for advanced users:

  - Use an [IP camera](https://en.wikipedia.org/wiki/IP_camera) that supports RTSP instead of using the RTSP simulator. You can find IP cameras that support RTSP on the [ONVIF conformant products](https://www.onvif.org/conformant-products/) page. Look for devices that conform with profiles G, S, or T.
  - Use an AMD64 or x64 Linux device rather than using a Linux VM in Azure. This device must be in the same network as the IP camera. Follow the instructions in [Install Azure IoT Edge runtime on Linux](../../../iot-edge/how-to-install-iot-edge.md?preserve-view=true&view=iotedge-2020-11). Then follow the instructions in [Deploy your first IoT Edge module to a virtual Linux device](../../../iot-edge/quickstart-linux.md?preserve-view=true&view=iotedge-2020-11) register the device with Azure IoT Hub.

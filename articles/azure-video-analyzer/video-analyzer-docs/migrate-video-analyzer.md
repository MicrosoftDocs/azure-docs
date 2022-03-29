---
title: Migrate from Azure Video Analyzer
description: This article describes some options to migrate off of Video Analyzer
manager: femila
ms.topic: conceptual
ms.date: 03/25/2022
ms.author: anilmur
---

# Migrate from Video Analyzer

This article describes some options to migrate your video analysis application off of Video Analyzer. 

[!INCLUDE [v2 deprecation notice](./includes/v2-deprecation-notice.md)]

## When using Spatial Analysis

If you are using Video Analyzer on an edge server together with the [Spatial Analysis](../cognitive-services/computer-vision/intro-to-spatial-analysis-public-preview) container from Cognitive Services, then you have the following options.

* You can switch to [Dynamics 365 Connected Spaces](https://docs.microsoft.com/dynamics365/connected-spaces/), which is a SaaS (software as a service) solution currently targeting the retail industry
* You can connect your RTSP cameras directly to the Spatial Analyis container, and build [web applications](../cognitive-services/computer-vision/spatial-analysis-web-app)

## When using other AI models

If you are using Video Analyzer on an edge server to analyze live video with other AI models, your options are as follows.

* If you are using an AI model from the [Open Model Zoo](https://github.com/openvinotoolkit/open_model_zoo) provided by Intel(R), then you may be able to make use of their Deep Learning (DL) Streamer video analytics framework. See [here](https://github.com/openvinotoolkit/dlstreamer_gst) for more information.
* If you are using an AI model optimized for running on NVIDIA(R) GPU, then you should consider the different [reference implementations](https://developer.nvidia.com/deepstream-getting-started) provided for their [DeepStream SDK](https://developer.nvidia.com/deepstream-sdk). This [example](https://github.com/toolboc/Intelligent-Video-Analytics-with-NVIDIA-Jetson-and-Microsoft-Azure) demonstrating an end-to-end architecture for video analytics may also be of help.

## Video Management Systems

There are several commercial solutions for [Video Management Systems](./terminology.md#vms). There are reviews and ratings [available](https://www.gartner.com/reviews/market/video-surveillance-management-systems).

## Next steps

Migrate your applications from Video Analyzer using steps described above by 01 December 2022.





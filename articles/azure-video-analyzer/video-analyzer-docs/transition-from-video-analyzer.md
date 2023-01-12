---
title: Transition from Azure Video Analyzer
description: This article describes some options to transition off of Video Analyzer
manager: femila
ms.topic: conceptual
ms.date: 03/25/2022
ms.author: anilmur
---

# Transition from Video Analyzer

This article describes some options to transition your video analysis application off of Video Analyzer. 

[!INCLUDE [deprecation notice](./includes/deprecation-notice.md)]

## When using Spatial Analysis

If you're using Video Analyzer on an edge server together with the [Spatial Analysis](../../cognitive-services/computer-vision/intro-to-spatial-analysis-public-preview.md) container from Cognitive Services, you have the following options:

* You can switch to [Dynamics 365 Connected Spaces](/dynamics365/connected-spaces/), which is a SaaS (software as a service) solution currently targeting the retail industry.
* You can connect your RTSP cameras directly to the Spatial Analysis container, and build [web applications](../../cognitive-services/computer-vision/spatial-analysis-web-app.md).

## When using other AI models

If you're using Video Analyzer on an edge server to analyze live video with other AI models, your options are as follows.

* If you're using an AI model from the [Open Model Zoo](https://github.com/openvinotoolkit/open_model_zoo) provided by Intel(R), you may be able to make use of their Deep Learning (DL) Streamer video analytics framework. See [OpenVINO™ Toolkit - DL Streamer repository](https://github.com/openvinotoolkit/dlstreamer_gst) for more information.
* If you're using an AI model optimized for running on NVIDIA(R) GPU, then you should consider the different [reference implementations](https://developer.nvidia.com/deepstream-getting-started) provided for their [DeepStream SDK](https://developer.nvidia.com/deepstream-sdk). Also check out the [Intelligent Video Analytics with NVIDIA Jetson and Microsoft Azure](https://github.com/toolboc/Intelligent-Video-Analytics-with-NVIDIA-Jetson-and-Microsoft-Azure) example that demonstrates an end-to-end architecture for video analytics.

## Video Management Systems

There are several commercial solutions for [Video Management Systems](./terminology.md#vms), see the [available reviews and ratings](https://www.gartner.com/reviews/market/video-surveillance-management-systems).

## Next steps

Transition your applications from Video Analyzer using suggestions described above by 01 December 2022.





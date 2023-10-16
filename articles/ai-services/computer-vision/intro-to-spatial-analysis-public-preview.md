---
title: What is Spatial Analysis?
titleSuffix: Azure AI services
description: This document explains the basic concepts and features of the Azure Spatial Analysis container.
services: cognitive-services
author: PatrickFarley
manager: nitinme
ms.author: pafarley
ms.service: cognitive-services
ms.subservice: computer-vision
ms.topic: overview
ms.date: 12/27/2022
ms.custom: contperf-fy22q2, ignite-2022
---

# What is Spatial Analysis?

You can use Azure AI Vision Spatial Analysis to detect the presence and movements of people in video. Ingest video streams from cameras, extract insights, and generate events to be used by other systems. The service can do things like count the number of people entering a space or measure compliance with face mask and social distancing guidelines. By processing video streams from physical spaces, you're able to learn how people use them and maximize the space's value to your organization. 

Try out the capabilities of Spatial Analysis quickly and easily in your browser using Vision Studio.

> [!div class="nextstepaction"]
> [Try Vision Studio](https://portal.vision.cognitive.azure.com/)

<!--This documentation contains the following types of articles:
* The [quickstarts](./quickstarts-sdk/analyze-image-client-library.md) are step-by-step instructions that let you make calls to the service and get results in a short period of time. 
* The [how-to guides](./how-to/call-analyze-image.md) contain instructions for using the service in more specific or customized ways.
* The [conceptual articles]() provide in-depth explanations of the service's functionality and features.
* The [tutorials](./tutorials/storage-lab-tutorial.md) are longer guides that show you how to use this service as a component in broader business solutions.-->

## What it does
Spatial Analysis ingests video then detects people in the video. After people are detected, the system tracks the people as they move around over time then generates events as people interact with regions of interest. All operations give insights from a single camera's field of view. 

### People counting
This operation counts the number of people in a specific zone over time using the PersonCount operation. It generates an independent count for each frame processed without attempting to track people across frames. This operation can be used to estimate the number of people in a space or generate an alert when a person appears.

![Spatial Analysis counts the number of people in the cameras field of view](https://user-images.githubusercontent.com/11428131/139924111-58637f2e-f2f6-42d8-8812-ab42fece92b4.gif)

### Entrance Counting
This feature monitors how long people stay in an area or when they enter through a doorway. This monitoring can be done using the PersonCrossingPolygon or PersonCrossingLine operations. In retail scenarios, these operations can be used to measure wait times for a checkout line or engagement at a display. Also, these operations could measure foot traffic in a lobby or a specific floor in other commercial building scenarios.

![Video frames of people moving in and out of a bordered space, with rectangles drawn around them.](https://user-images.githubusercontent.com/11428131/137016574-0d180d9b-fb9a-42a9-94b7-fbc0dbc18560.gif)

### Social distancing and face mask detection 
This feature analyzes how well people follow social distancing requirements in a space. The system uses the PersonDistance operation to automatically calibrates itself as people walk around in the space. Then it identifies when people violate a specific distance threshold (6 ft. or 10 ft.).

![Spatial Analysis visualizes social distance violation events showing lines between people showing the distance](https://user-images.githubusercontent.com/11428131/139924062-b5e10c0f-3cf8-4ff1-bb58-478571c022d7.gif)

Spatial Analysis can also be configured to detect if a person is wearing a protective face covering such as a mask. A mask classifier can be enabled for the PersonCount, PersonCrossingLine, and PersonCrossingPolygon operations by configuring the `ENABLE_FACE_MASK_CLASSIFIER` parameter.

![Spatial Analysis classifies whether people have facemasks in an elevator](https://user-images.githubusercontent.com/11428131/137015842-ce524f52-3ac4-4e42-9067-25d19b395803.png)

## Video Retrieval

Spatial Analysis Video Retrieval is a service that lets you create a search index, add documents (videos and images) to it, and search with natural language. Developers can define metadata schemas for each index and ingest metadata to the service to help with retrieval. Developers can also specify what features to extract from the index (vision, speech) and filter their search based on features.

[Call the Video Retrieval APIs](./how-to/video-retrieval.md)

## Input requirements

Spatial Analysis works on videos that meet the following requirements:
* The video must be in RTSP, rawvideo, MP4, FLV, or MKV format.
* The video codec must be H.264, HEVC(H.265), rawvideo, VP9, or MPEG-4.

## Get started

Follow the [quickstart](spatial-analysis-container.md) to set up the Spatial Analysis container and begin analyzing video.

## Responsible use of Spatial Analysis technology

To learn how to use Spatial Analysis technology responsibly, see the [transparency note](/legal/cognitive-services/computer-vision/transparency-note-spatial-analysis?context=%2fazure%2fcognitive-services%2fComputer-vision%2fcontext%2fcontext). Microsoft's transparency notes help you understand how our AI technology works and the choices system owners can make that influence system performance and behavior. They focus on the importance of thinking about the whole system including the technology, people, and environment.

## Next steps

> [!div class="nextstepaction"]
> [Quickstart: Spatial Analysis container](spatial-analysis-container.md)

---
title: What is Spatial Analysis?
titleSuffix: Azure Cognitive Services
description: This document explains the basic concepts and features of the Azure Spatial Analysis container.
services: cognitive-services
author: nitinme
manager: nitinme
ms.author: nitinme
ms.service: cognitive-services
ms.subservice: computer-vision
ms.topic: overview
ms.date: 10/06/2021
ms.custom: contperf-fy22q2
---

# What is Spatial Analysis?

Spatial Analysis is an AI service that helps organizations maximize the value of their physical spaces by understanding people's movements and presence within a given area. It allows you to ingest video from CCTV or surveillance cameras, extract insights from the video streams, and generate events to be used by other systems. With input from a camera stream, the service can do things like count the number of people entering a space or measure compliance with face mask and social distancing guidelines.

<!--This documentation contains the following types of articles:
* The [quickstarts](./quickstarts-sdk/analyze-image-client-library.md) are step-by-step instructions that let you make calls to the service and get results in a short period of time. 
* The [how-to guides](./Vision-API-How-to-Topics/HowToCallVisionAPI.md) contain instructions for using the service in more specific or customized ways.
* The [conceptual articles](tbd) provide in-depth explanations of the service's functionality and features.
* The [tutorials](./tutorials/storage-lab-tutorial.md) are longer guides that show you how to use this service as a component in broader business solutions.-->

## What it does

The core operations of Spatial Analysis are built on a system that ingests video, detects people in the video, tracks the people as they move around over time, and generates events as people interact with regions of interest.

### People Counting
Count the number of people in a designated zone over time using the PersonCount operation. This operation works for a zone within a single cameras field of view. It generates an independent count for each frame processed without attempting to track people across frames.

![count](https://user-images.githubusercontent.com/11428131/136633993-0fa00c08-4ca7-436f-9b82-4a4f1ef5fb0e.gif)

### Enter/Exit Spaces
Monitor how long people stay in an area or when they enter and exit through a doorway using PersonCrossingPolygon or PersonCrossingLine operations. This can be used to measure wait times for a checkout line, engagement at a display, footfall in a lobby, and more. 

![space](https://user-images.githubusercontent.com/11428131/136633984-2fb7295c-cca8-4ab2-acff-25a85d833db0.gif)

### Social Distancing and Facemask Detection 
Understand how well people follow social distancing and facemask guidance using video.

![distance](https://user-images.githubusercontent.com/11428131/136633989-37e66623-58d8-43a4-8619-dffd1afb889f.gif)

## Get started

Follow the [quickstart](spatial-analysis-container.md) to set up the Spatial Analysis container and begin analyzing video.

## Responsible use of Spatial Analysis technology

To learn how to use Spatial Analysis technology responsibly, see the [transparency note](/legal/cognitive-services/computer-vision/transparency-note-spatial-analysis?context=%2fazure%2fcognitive-services%2fComputer-vision%2fcontext%2fcontext). Microsoft's transparency notes are intended to help you understand how our AI technology works, the choices system owners can make that influence system performance and behavior, and the importance of thinking about the whole system, including the technology, the people, and the environment.

## Next steps

> [!div class="nextstepaction"]
> [Quickstart: Spatial Analysis container](spatial-analysis-container.md)

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

## Spatial Analysis features

| Feature | Definition |
|------|------------|
| **People Detection** | This component answers the question, "Where are the people in this image?" It finds people in an image and passes bounding box coordinates indicating the location of each person to the **People Tracking** component. |
| **People Tracking** | This component connects the people detections over time as people move around in front of a camera. It uses temporal logic about how people typically move and basic information about the overall appearance of the people. It does not track people across multiple cameras. If a person exits the field of view for longer than approximately one minute and then reenters the view, the system will perceive them as a new person. People Tracking does not uniquely identify individuals across cameras. It does not use facial recognition or gait tracking. |
| **Face Mask Detection** | This component detects the location of a person's face in the camera's field of view and identifies the presence of a face mask. The AI operation scans images from video; where a face is detected the service provides a bounding box around the face. Using object detection capabilities, it identifies the presence of face masks within the bounding box. Face Mask detection does not involve distinguishing one face from another face, predicting or classifying facial attributes or doing face recognition. |
| **Region of Interest** | This component is a user-defined zone or line in the input video frame. When a person interacts with this region on the video, the system generates an event. For example, for the **PersonCrossingLine** operation, a line is defined in the video frame. When a person crosses that line, an event is generated. |
| **Event** | An event is the primary output of Spatial Analysis. Each operation raises a specific event either periodically (like once per minute) or whenever a specific trigger occurs. The event includes information about what occurred in the input video but does not include any images or video. For example, the **PeopleCount** operation can raise an event containing the updated count every time the count of people changes (trigger) or once every minute (periodically). |

## Get started

Follow the [quickstart](spatial-analysis-container.md) to set up the Spatial Analysis container and begin analyzing video.

## Responsible use of Spatial Analysis technology

To learn how to use Spatial Analysis technology responsibly, see the [transparency note](/legal/cognitive-services/computer-vision/transparency-note-spatial-analysis?context=%2fazure%2fcognitive-services%2fComputer-vision%2fcontext%2fcontext). Microsoft's transparency notes are intended to help you understand how our AI technology works, the choices system owners can make that influence system performance and behavior, and the importance of thinking about the whole system, including the technology, the people, and the environment.

## Next steps

> [!div class="nextstepaction"]
> [Quickstart: Spatial Analysis container](spatial-analysis-container.md)

---
title: What is Spatial Analysis?
titleSuffix: Azure Cognitive Services
description: This document explains the basic concepts and features of a Computer Vision spatial analysis container.
services: cognitive-services
author: nitinme
manager: nitinme
ms.author: nitinme
ms.service: cognitive-services
ms.subservice: computer-vision
ms.topic: overview
ms.date: 03/29/2021
---

# What is Spatial Analysis?

The Spatial Analysis service helps organizations maximize the value of their physical spaces by understanding people's movements and presence within a given area. It allows you to ingest video from CCTV or surveillance cameras, run AI operations to extract insights from the video streams, and generate events to be used by other systems. With input from a camera stream, an AI operation can do things like count the number of people entering a space or measure compliance with face mask and social distancing guidelines.

This documentation contains the following types of articles:
* The [quickstarts](./quickstarts-sdk/analyze-image-client-library.md) are step-by-step instructions that let you make calls to the service and get results in a short period of time. 
* The [how-to guides](./Vision-API-How-to-Topics/HowToCallVisionAPI.md) contain instructions for using the service in more specific or customized ways.
* The [conceptual articles](concept-recognizing-text.md) provide in-depth explanations of the service's functionality and features.
* The [tutorials](./tutorials/storage-lab-tutorial.md) are longer guides that show you how to use this service as a component in broader business solutions.

## The basics of Spatial Analysis

Today the core operations of spatial analysis are all built on a pipeline that ingests video, detects people in the video, tracks the people as they move around over time, and generates events as people interact with regions of interest.

## Spatial Analysis terms

| Term | Definition |
|------|------------|
| People Detection | This component answers the question "where are the people in this image"? It finds humans in an image and passes a bounding box indicating the location of each person to the people tracking component. |
| People Tracking | This component connects the people detections over time as the people move around in front of a camera. It uses temporal logic about how people typically move and basic information about the overall appearance of the people to do this. It does not track people across multiple cameras. If a person exists the field of view from a camera for longer than approximately a minute and then re-enters the camera view,  the system will perceive this as a new person. People Tracking does not uniquely identify individuals across cameras. It does not use facial recognition or gait tracking. |
| Face Mask Detection | This component detects the location of a person's face in the camera's field of view and identifies the presence of a face mask. To do so, the AI operation scans images from video; where a face is detected the service provides a bounding box around the face. Using object detection capabilities, it identifies the presence of face masks within the bounding box. Face Mask detection does not involve distinguishing one face from another face, predicting or classifying facial attributes or performing facial recognition. |
| Region of Interest | This is a zone or line defined in the input video as part of configuration. When a person interacts with the region of the video the system generates an event. For example, for the PersonCrossingLine operation, a line is defined in the video. When a person crosses that line an event is generated. |
| Event | An event is the primary output of spatial analysis. Each operation emits a specific event either periodically (ex. once per minute) or when a specific trigger occurs. The event includes information about what occurred in the input video but does not include any images or video. For example, the PeopleCount operation can emit an event containing the updated count every time the count of people changes (trigger) or once every minute (periodically). |

## Responsible use of Spatial Analysis technology

To learn how to use Spatial Analysis technology responsibly, see the [transparency note](/legal/cognitive-services/computer-vision/transparency-note-spatial-analysis?context=%2fazure%2fcognitive-services%2fComputer-vision%2fcontext%2fcontext). Microsoft's transparency notes are intended to help you understand how our AI technology works, the choices system owners can make that influence system performance and behavior, and the importance of thinking about the whole system, including the technology, the people, and the environment.

## Spatial Analysis gating for public preview

To ensure spatial analysis is used for scenarios it was designed for, we are making this technology available to customers through an application process. To get access to spatial analysis, you will need to start by filling out our online intake form. [Begin your application here](https://forms.office.com/Pages/ResponsePage.aspx?id=v4j5cvGGr0GRqy180BHbRyQZ7B8Cg2FEjpibPziwPcZUNlQ4SEVORFVLTjlBSzNLRlo0UzRRVVNPVy4u).

Access to the spatial analysis public preview is subject to Microsoft's sole discretion based on our eligibility criteria, vetting process, and availability to support a limited number of customers during this gated preview. In public preview, we are looking for customers who have a significant relationship with Microsoft, are interested in working with us on the recommended use cases, and additional scenarios that are in keeping with our responsible AI commitments.

## Next steps

> [!div class="nextstepaction"]
> [Get started with Spatial Analysis Container](spatial-analysis-container.md)
---
title: Introduction to Computer Vision spatial analysis
titleSuffix: Azure Cognitive Services
description: This document explains the basic concepts and features of a Computer Vision spatial analysis container.
services: cognitive-services
author: tchristiani
manager: nitinme
ms.author: terrychr
ms.service: cognitive-services
ms.subservice: computer-vision
ms.topic: conceptual
ms.date: 12/14/2020
---

# Introduction to Computer Vision spatial analysis

Computer Vision spatial analysis is a new feature of Azure Cognitive Services Computer Vision that helps organizations maximize the value of their physical spaces by understanding people's movements and presence within a given area. It allows you to ingest video from CCTV or surveillance cameras, run AI operations to extract insights from the video streams, and generate events to be used by other systems. With input from a camera stream, an AI operation can do things like count the number of people entering a space or measure compliance with face mask and social distancing guidelines.

## The basics of spatial analysis

Today the core operations of spatial analysis are all built on a pipeline that ingests video, detects people in the video, tracks the people as they move around over time, and generates events as people interact with regions of interest.

## Spatial analysis terms

| Term | Definition |
|------|------------|
| People Detection | This component answers the question "where are the people in this image"? It finds humans in an image and passes a bounding box indicating the location of each person to the people tracking component. |
| People Tracking | This component connects the people detections over time as the people move around in front of a camera. It uses temporal logic about how people typically move and basic information about the overall appearance of the people to do this. It does not track people across multiple cameras. If a person exists the field of view from a camera for longer than approximately a minute and then re-enters the camera view,  the system will perceive this as a new person. People Tracking does not uniquely identify individuals across cameras. It does not use facial recognition or gait tracking. |
| Face Mask Detection | This component detects the location of a person’s face in the camera’s field of view and identifies the presence of a face mask. To do so, the AI operation scans images from video; where a face is detected the service provides a bounding box around the face. Using object detection capabilities, it identifies the presence of face masks within the bounding box. Face Mask detection does not involve distinguishing one face from another face, predicting or classifying facial attributes or performing facial recognition. |
| Region of Interest | This is a zone or line defined in the input video as part of configuration. When a person interacts with the region of the video the system generates an event. For example, for the PersonCrossingLine operation, a line is defined in the video. When a person crosses that line an event is generated. |
| Event | An event is the primary output of spatial analysis. Each operation emits a specific event either periodically (ex. once per minute) or when a specific trigger occurs. The event includes information about what occurred in the input video but does not include any images or video. For example, the PeopleCount operation can emit an event containing the updated count every time the count of people changes (trigger) or once every minute (periodically). |

## Example use cases for spatial analysis

The following are example use cases that we had in mind as we designed and tested spatial analysis.

**Social Distancing Compliance** - An office space has several cameras that use spatial analysis to monitor social distancing compliance by measuring the distance between people. The facilities manager can use heatmaps showing aggregate statistics of social distancing compliance over time to adjust the workspace and make social distancing easier.

**Shopper Analysis** - A grocery store uses cameras pointed at product displays to measure the impact of merchandising changes on store traffic. The system allows the store manager to identify which new products drive the most change to engagement.

**Queue Management** - Cameras pointed at checkout queues provide alerts to managers when wait time gets too long, allowing them to open more lines. Historical data on queue abandonment gives insights into consumer behavior.

**Face Mask Compliance** – Retail stores can use cameras pointing at the store fronts to check if customers walking into the store are wearing face masks to maintain safety compliance and analyze aggregate statistics to gain insights on mask usage trends. 

**Building Occupancy & Analysis** - An office building uses cameras focused on entrances to key spaces to measure footfall and how people use the workplace. Insights allow the building manager to adjust service and layout to better serve occupants.

**Minimum Staff Detection** - In a data center, cameras monitor activity around servers. When employees are physically fixing sensitive equipment two people are always required to be present during the repair for security reasons. Cameras are used to verify that this guideline is followed.

**Workplace Optimization** - In a fast casual restaurant, cameras in the kitchen are used to generate aggregate information about employee workflow. This is used by managers to improve processes and training for the team.

## Considerations when choosing a use case

**Avoid critical safety alerting** - Spatial analysis was not designed for critical safety real-time alerting. It should not be relied on for scenarios when real-time alerts are needed to trigger intervention to prevent injury, like turning off a piece of heavy machinery when a person is present. It can be used for risk reduction using statistics and intervention to reduce risky behavior, like people entering a restricted/forbidden area.

**Avoid use for employment-related decisions** - Spatial analysis provides probabilistic metrics regarding the location and movement of people within a space. While this data may be useful for aggregate process improvement, the data is not a good indicator of individual worker performance and should not be used for making employment-related decisions.

**Avoid use for health care-related decisions** - Spatial analysis provides probabilistic and partial data related to people's movements. The data is not suitable for making health-related decisions.

**Avoid use in protected spaces** - Protect individuals' privacy by evaluating camera locations and positions, adjusting angles and region of interests so they do not overlook protected areas such as restrooms.

**Carefully consider use in schools or elderly care facilities** - Spatial analysis has not heavily tested with data containing minors
under the age of 18 or adults over age 65. We would recommend that customers thoroughly evaluate error rates for their scenario in environments where these ages predominate.

**Carefully consider use in public spaces** - Evaluate camera locations and positions, adjusting angles and region of interests to minimize collection from public spaces. Lighting and weather in public spaces such as streets and parks will significantly impact the performance of the spatial analysis system, and it is extremely difficult to provide effective disclosure in public spaces.

## Spatial analysis gating for public preview

To ensure spatial analysis is used for scenarios it was designed for, we are making this technology available to customers through an application process. To get access to spatial analysis, you will need to start by filling out our online intake form. [Begin your
application here](https://forms.office.com/Pages/ResponsePage.aspx?id=v4j5cvGGr0GRqy180BHbRyQZ7B8Cg2FEjpibPziwPcZUNlQ4SEVORFVLTjlBSzNLRlo0UzRRVVNPVy4u).

Access to the spatial analysis public preview is subject to Microsoft's sole discretion based on our eligibility criteria, vetting process, and availability to support a limited number of customers during this gated preview. In public preview, we are looking for customers who have a significant relationship with Microsoft, are interested in working with us on the recommended use cases, and additional scenarios that are in keeping with our responsible AI commitments.

## Next steps

> [!div class="nextstepaction"]
> [Characteristics and limitations for spatial analysis](/legal/cognitive-services/computer-vision/accuracy-and-limitations?context=%2fazure%2fcognitive-services%2fComputer-vision%2fcontext%2fcontext)
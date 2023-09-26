---
title: Azure AI Video Indexer object detection overview
description: An introduction to Azure AI Video Indexer object detection overview
ms.service: azure-video-indexer
ms.date: 09/26/2023
ms.topic: article
ms.author: inhenkel
author: IngridAtMicrosoft
---

# Azure Video Indexer object detection

Azure Video Indexer can detect objects in videos. The insight in part of all standard and advanced presets. This article discusses the object detection insight.

## Prerequisites

Review [transparency note overview](/legal/azure-video-indexer/transparency-note?context=/azure/azure-video-indexer/context/context)

## JSON keys and definitions

| **Key** | **Definition** |
| --- | --- |
| ID | Incremental number of IDs of the detected objects in the media file |
| Type | Type of objects e.g., Car 
| ThumbnailID | GUID representing a single detection of the object |
| displayName | Name to be displayed in the VI portal experience |
| WikiDataID | A unique identifier in the WikiData structure |
| Instances | List of all instances that were tracked  
| Confidence | A score between 0-1indecating the object detection confidence. |
| adjustedStart | adjustedEnd |
| start | | 
| end | |

Object detection is included in the insights that are the result of an [Upload](https://api-portal.videoindexer.ai/api-details#api=Operations&operation=Upload-Video) request.

## Supported objects

- airplane
- apple
- backpack
- baseball bat
- baseball glove
- bed
- bicycle
- boat
- bowl
- broccoli
- bus
- cake
- car
- carrot
- chair
- clock
- computer mouse
- couch
- cup
- dining table
- donut
- fire hydrant
- fork
- frisbee
- handbag
- hot dog
- kite
- knife
- laptop
- microwave
- monitor
- motorcycle
- orange
- oven
- parking meter
- pizza
- potted plant
- refrigerator
- remote
- sandwich
- scissors
- skateboard
- skis
- snowboard
- spoon
- sports ball
- suitcase
- surfboard
- tennis racket
- tie
- toilet
- toothbrush
- traffic light
- train
- umbrella
- vase
- wine glass

You can interact with the insight with the web portal or with the API.

## [Web Portal](#tab/webportal)

Once you have uploaded a video, you can view the insights. In the insights pane you can view the list of objects detected and their main instances.

### Insights
Select the **Insights** tab. The objects are in descending order of the number of appearances in the video.

:::image type="content" source="media/object-detection/insights-tab.png" alt-text="screenshot of the interface of the insights tab":::

### Timeline
Select the **Timeline** tab.

:::image type="content" source="media/object-detection/timeline-tab.png" alt-text="screenshot of the interface of the timeline tab":::

Under the timeline all the detection of the object will be displayed according to the time of appearance. When hovering on a specific detection the percentage of certainty of detection of the object will be presented. 

### Player

The player will automatically mark the detected object with a bounding box. The selected object from the insights pane will be highlighted in blue with the objects type and serial number also displayed.
 
Filter the bounding boxes around objects by selecting bounding box icon on the player.

:::image type="content" source="media/object-detection/object-filtering-icon.png" alt-text="screenshot of object filtering icon player interface":::

Then, select or deselect the detected objects checkboxes.

:::image type="content" source="media/object-detection/object-filtering.png" alt-text="screenshot of object filtering detected objects in the player interface":::

### [API](#tab/api)

Object detection is part of the [Upload](https://api-portal.videoindexer.ai/api-details#api=Operations&operation=Upload-Video) process.

Use [Get Artifacts by type](https://api-portal.videoindexer.ai/api-details#api=Operations&operation=Get-Video-Artifact-Download-Url) to download the artifacts.

---

## Limitations

- Up to 20 detections per frame for standard and advanced processing.
- The video area should not exceed 1920 x 1080 pixels.
- Object size should not be greater than 90 percent of the frame.
- A very high frame rate (> 30 FPS) may result in slower indexing, with little added value to the quality of the detection and tracking.
- Other factors that may affect the accuracy of the object detection include low light conditions, camera motion, and occlusion.

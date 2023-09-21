---
title: Azure AI Video Indexer object detection overview
description: An introduction to Azure AI Video Indexer object detection overview
ms.service: azure-video-indexer
ms.date: 09/20/2023
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

## View the insight

You can interact with the insight with the web portal or on the API page.

### [Web Portal](#tab/webportal)
something goes here

### [API](#tab/api)
something goes here
---



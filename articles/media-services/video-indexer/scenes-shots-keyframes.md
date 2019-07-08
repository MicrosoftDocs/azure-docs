---
title: Video Indexer scenes, shots, and keyframes - Azure
titlesuffix: Azure Media Services
description: This topic gives an overview of the Video Indexer scenes, shots, and keyframes.
services: media-services
author: Juliako
manager: femila

ms.service: media-services
ms.subservice: video-indexer
ms.topic: article
ms.date: 05/15/2019
ms.author: juliako
---

# Scenes, shots, and keyframes

Video Indexer supports segmenting videos into temporal units based on structural and semantic properties. This capability enables customers to easily browse, manage, and edit their video content based on varying granularities. For example, based on scenes, shots, and keyframes, described in this topic. The **scene detection** feature is currently in preview.   

![Scenes, shots, and keyframes](./media/scenes-shots-keyframes/scenes-shots-keyframes.png)

## Scene detection (preview)

Video Indexer determines when a scene changes in video based on visual cues. A scene depicts a single event and it is composed of a series of consecutive shots, which are semantically related. A scene thumbnail is the first keyframe of its underlying shot. Video indexer segments a video into scenes based on color coherence across consecutive shots and retrieves the beginning and end time of each scene. Scene detection is considered a challenging task as it involves quantifying semantic aspects of videos.

> [!NOTE]
> Applicable to videos that contain at least 3 scenes.

## Shot detection

Video Indexer determines when a shot changes in the video based on visual cues, by tracking both abrupt and gradual transitions in the color scheme of adjacent frames. The shot's metadata includes a start and end time, as well as the list of keyframes included in that shot. The shots are consecutive frames taken from the same camera at the same time.

## Keyframe detection

Selects the frame(s) that best represent the shot. Keyframes are the representative frames selected from the entire video based on aesthetic properties (for example, contrast and stableness). Video Indexer retrieves a list of keyframe IDs as part of the shot's metadata, based on which customers can extract the keyframe thumbnail. 

Keyframes are associated with shots in the output JSON. 

## Next steps

[Examine the Video Indexer output produced by the API](video-indexer-output-json-v2.md#scenes)
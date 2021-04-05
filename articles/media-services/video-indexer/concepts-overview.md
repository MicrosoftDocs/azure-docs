---
title:  Video Indexer concepts - Azure  
titleSuffix: Azure Media Services Video Indexer
description: This article gives a brief overview of Azure Media Services Video Indexer terminology and concepts.
services: media-services
author: Juliako
manager: femila
ms.service: media-services
ms.subservice: video-indexer
ms.topic: article
ms.date: 01/19/2021
ms.author: juliako
---


# Video Indexer concepts

This article gives a brief overview of Azure Media Services Video Indexer terminology and concepts.

## Audio/video/combined insights

When you upload your videos to Video Indexer, it analyses both visuals and audio by running different AI models. As Video Indexer analyzes your video, the insights that are extracted by the AI models. For more information, see [overview](video-indexer-overview.md).

## Confidence scores

The confidence score indicates the confidence in an insight. It is a number between 0.0 and 1.0. The higher the score- the greater the confidence in the answer. For example, 

```json
"transcript":[
{
  "id":1,
  "text":"Well, good morning everyone and welcome to",
  "confidence":0.8839,
  "speakerId":1,
  "language":"en-US",
  "instances":[
     {
	"adjustedStart":"0:00:10.21",
	"adjustedEnd":"0:00:12.81",
	"start":"0:00:10.21",
	"end":"0:00:12.81"
     }
  ]
},
```

## Content moderation

Use textual and visual content moderation models to keep your users safe from inappropriate content and validate that the content you publish matches your organization's values. You can automatically block certain videos or alert your users about the content. For more information, see [Insights: visual and textual content moderation](video-indexer-output-json-v2.md#visualcontentmoderation). 

## Blocks	

Blocks are meant to make it easier to go through the data. For example, block might be broken down based on when speakers change or there is a long pause.	

## Project and editor

The [Video Indexer](https://www.videoindexer.ai/) website enables you to use your video's deep insights to: find the right media content, locate the parts that you’re interested in, and use the results to create an entirely new project. Once created, the project can be rendered and downloaded from Video Indexer and be used in your own editing applications or downstream workflows.

Some scenarios where you may find this feature useful are: 

* Creating movie highlights for trailers.
* Using old clips of videos in news casts.
* Creating shorter content for social media.

For more information, see [Use editor to create projects](use-editor-create-project.md).

## Keyframes

Video Indexer selects the frame(s) that best represent each shot. Keyframes are the representative frames selected from the entire video based on aesthetic properties (for example, contrast and stableness). For more information, see [Scenes, shots, and keyframes](scenes-shots-keyframes.md).

## time range vs. adjusted time range	

TimeRange is the time range in the original video. AdjustedTimeRange is the time range relative to the current playlist. Since you can create a playlist from different lines of different videos, you can take a 1-hour video and use just 1 line from it, for example, 10:00-10:15. In that case, you will have a playlist with 1 line, where the time range is 10:00-10:15 but the adjustedTimeRange is 00:00-00:15.	

## Widgets

Video Indexer supports embedding widgets in your apps. For more information, see [Embed Video Indexer widgets in your apps](video-indexer-embed-widgets.md).

## Summarized insights	

Summarized insights contain an aggregated view of the data: faces, topics, emotions. For example, instead of going over each of the thousands of time ranges and checking which faces are in it, the summarized insights contains all the faces and for each one, the time ranges it appears in and the % of the time it is shown.	

## Next steps

- [overview](video-indexer-overview.md)
- [Insights](video-indexer-output-json-v2.md)

---
title:  Azure Video Indexer terminology & concepts overview
description: This article gives a brief overview of Azure Video Indexer terminology and concepts.
ms.topic: conceptual
ms.date: 01/19/2021
ms.author: juliako
---

# Azure Video Indexer terminology & concepts

This article gives a brief overview of Azure Video Indexer terminology and concepts.

## Artifact files

If you plan to download artifact files, beware of the following: 
	
[!INCLUDE [artifacts](./includes/artifacts.md)]

## Confidence scores

The confidence score indicates the confidence in an insight. It is a number between 0.0 and 1.0. The higher the score the greater the confidence in the answer. For example: 

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

## Insights	

Insights contain an aggregated view of the data: faces, topics, emotions. Azure Video Indexer analyzes the video and audio content by running 30+ AI models, generating rich insights. For more information about available models, see [overview](video-indexer-overview.md).

[!INCLUDE [insights](./includes/insights.md)]

The [Azure Video Indexer](https://www.videoindexer.ai/) website enables you to use your video's deep insights to: find the right media content, locate the parts that you’re interested in, and use the results to create an entirely new project. Once created, the project can be rendered and downloaded from Azure Video Indexer and be used in your own editing applications or downstream workflows. For more information, see [Use editor to create projects](use-editor-create-project.md).

## Keyframes

Azure Video Indexer selects the frame(s) that best represent each shot. Keyframes are the representative frames selected from the entire video based on aesthetic properties (for example, contrast and stableness). For more information, see [Scenes, shots, and keyframes](scenes-shots-keyframes.md).

## Time range vs. adjusted time range	

Time range is the time period in the original video. Adjusted time range is the time range relative to the current playlist. Since you can create a playlist from different lines of different videos, you can take a 1-hour video and use just 1 line from it, for example, 10:00-10:15. In that case, you will have a playlist with 1 line, where the time range is 10:00-10:15 but the adjusted time range is 00:00-00:15.	

## Widgets

Azure Video Indexer supports embedding widgets in your apps. For more information, see [Embed Azure Video Indexer widgets in your apps](video-indexer-embed-widgets.md).

## Next steps

- [overview](video-indexer-overview.md)
- [Insights](video-indexer-output-json-v2.md)

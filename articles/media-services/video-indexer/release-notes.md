---
title: Azure Media Services Video Indexer release notes | Microsoft Docs
description: To stay up-to-date with the most recent developments, this article provides you with the latest updates on Azure Media Services Video Indexer.
services: media-services
documentationcenter: ''
author: Juliako
manager: femila
editor: ''

ms.service: media-services
ms.subservice: video-indexer
ms.workload: na
ms.topic: article
ms.date: 10/27/2019
ms.author: juliako
---

# Azure Media Services Video Indexer release notes

To stay up-to-date with the most recent developments, this article provides you with information about:

* The latest releases
* Known issues
* Bug fixes
* Deprecated functionality

## October 2019
 
* Search for animated characters in the gallery

    When indexing animated characters, you can now search for them in the account’s video galley. For more information, see [Animated characters recognition](animated-characters-recognition.md).

## September 2019
 
Multiple advancements announced at IBC 2019:
 
* Animated character recognition  (public preview)

    Ability to detect group ad recognize characters in animated content, via integration with custom vision. For more information, see [Animated character detection](animated-characters-recognition.md).
* Multi-language identification (public preview)

    Detect segments in multiple languages in the audio track and create a multilingual transcript based on them. Initial support: English, Spanish, German and French. For more information, see [Automatically identify and transcribe multi-language content](multi-language-identification-transcription.md).
* Named entity extraction for People and Location

    Extracts brands, locations, and people from speech and visual text via natural language processing (NLP).
* Editorial shot type classification

    Tagging of shots with editorial types such as close up, medium shot, two shot, indoor, outdoor etc. For more information, see [Editorial shot type detection](scenes-shots-keyframes.md#editorial-shot-type-detection).
* Topic inferencing enhancement - now covering level 2
    
    The topic inferencing model now support deeper granularity of the IPTC taxonomy. Read full details at [Azure Media Services new AI-powered innovation](https://azure.microsoft.com/blog/azure-media-services-new-ai-powered-innovation/).

## August 2019
 
### Video Indexer deployed in UK South

You can now create a Video Indexer paid account in the UK south region.

### New Editorial Shot Type insights available

New tags added to video shots provides editorial “shot types” to identify them with common editorial phrases used in the content creation workflow such as: extreme closeup, closeup, wide, medium, two shot, outdoor, indoor, left face and right face (Available in the JSON).

### New People and Locations entities extraction available

Video Indexer identifies named locations and people via natural language processing (NLP) from the video’s OCR and transcription. Video Indexer uses machine learning algorithm to recognize when specific locations (for example, the Eiffel Tower) or people (for example, John Doe) are being called out in a video.

### Keyframes extraction in native resolution

Keyframes extracted by Video Indexer are available in the original resolution of the video.
 
### GA for training custom face models from images

Training faces from images moved from Preview mode to GA (available via API and in the portal).

> [!NOTE]
> There is no pricing impact related to the "Preview to GA" transition.

### Hide gallery toggle option

User can choose to hide the gallery tab from the portal (similar to hiding the samples tab).
 
### Maximum URL size increased

Support for URL query string of 4096 (instead of 2048) on indexing a video.
 
### Support for multi-lingual projects

Projects can now be created based on videos indexed in different languages (API only).

## July 2019

### Editor as a widget

The Video Indexer AI-editor is now available as a widget to be embedded in customer applications.

### Update custom language model from closed caption file from the portal

Customers can provide VTT, SRT, and TTML file formats as input for language models in the customization page of the portal.

## June 2019

### Video Indexer deployed to Japan East

You can now create a Video Indexer paid account in the Japan East region.

### Create and repair account API (Preview)

Added a new API that enables you to [update the Azure Media Service connection endpoint or key](https://api-portal.videoindexer.ai/docs/services/Operations/operations/Update-Paid-Account-Azure-Media-Services?&groupBy=tag).

### Improve error handling on upload 

A descriptive message is returned in case of misconfiguration of the underlying Azure Media Services account.

### Player timeline Keyframes preview 

You can now see an image preview for each time on the player's timeline.

### Editor semi-select

You can now see a preview of all the insights that are selected as a result of choosing a specific insight timeframe in the editor.

## May 2019

### Update custom language model from closed caption file

[Create custom language model](https://api-portal.videoindexer.ai/docs/services/Operations/operations/Create-Language-Model?&groupBy=tag) and [Update custom language models](https://api-portal.videoindexer.ai/docs/services/Operations/operations/Update-Language-Model?&groupBy=tag) APIs now support VTT, SRT, and TTML file formats as input for language models.

When calling the [Update Video transcript API](https://api-portal.videoindexer.ai/docs/services/Operations/operations/Update-Video-Transcript?&pattern=transcript), the transcript is added automatically. The training model associated with the video is updated automatically as well. For information on how to customize and train your language models, see [Customize a Language model with Video Indexer](customize-language-model-overview.md).

### New download transcript formats – TXT and CSV

In addition to the closed captioning format already supported (SRT, VTT, and TTML), Video Indexer now supports downloading the transcript in TXT and CSV formats.

## Next steps

[Overview](video-indexer-overview.md)

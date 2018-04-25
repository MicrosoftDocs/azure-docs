---
# Mandatory fields. See more on aka.ms/skyeye/meta.
title: Azure media intelligence | Microsoft Docs
description: When using Azure Media Services, you can analyze your audio and video contnet using AudioAnalyzerPreset and VideoAnalyzerPreset.  
services: media-services
documentationcenter: ''
author: Juliako
manager: cfowler
editor: ''

ms.service: media-services
ms.workload: 
ms.topic: article
ms.date: 04/24/2018
ms.author: juliako
---

# Media intelligence

Azure Media Services REST v3 API enables you to analyze audio and vidio content. To analyze your content you create a **Transform** and submit a **Job** that uses one of these presets: **AudioAnalyzerPreset** or **VideoAnalyzerPreset**. 

## AudioAnalyzerPreset

**AudioAnalyzerPreset** enables you to extract multiple audio insights from an audio or video file. The output includes a JSON file (with all the insights) and VTT file for the audio transcript. This preset accepts a property that specifies the language of the input file in the form of a [BCP47](https://tools.ietf.org/html/bcp47) string. The audio insights include:

* Audio transcription – a transcript of the spoken words with timestamps. Multiple languages are supported
* Speaker indexing – a mapping of the speakers and the corresponding spoken words
* Speech sentiment analysis – the output of sentiment analysis performed on the audio transcription
* Keywords – keywords that are extracted from the audio transcription.

## VideoAnalyzerPreset

**VideoAnalyzerPreset** enables you to extract multiple audio and video insights from a video file. The output includes a JSON file (with all the insights), a VTT file for the video transcript, and a collection of thumbnails. This preset also accepts a [BCP47](https://tools.ietf.org/html/bcp47) string (representing the language of the video) as a property. The video insights include all the audio insights mentioned above and the following additional items:

* Face tracking – the time during which faces are present in the video. Each face has a face id and a corresponding collection of thumbnails
* Visual text – the text that is detected via optical character recognition. The text is time stamped and also used to extract keywords (in addition to the audio transcript)
* Keyframes – a collection of keyframes that are extracted from the video
* Visual content moderation – the portion of the videos that have been flagged as adult or racy in nature
* Annotation – a result of annotating the videos based on a pre-defined object model

<Follow this up with the code sample to create a job with the above presets and a link to the JSON file schema that is an output of a job submitted to AMS (not VI)>

## Next steps

> [!div class="nextstepaction"]
> [Tutorial: Analyze videos with Azure Media Services](analyze-videos-tutorial-with-api.md)

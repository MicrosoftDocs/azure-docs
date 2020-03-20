---
title: Migrate from Indexer v1 and v2 to Azure Media Services Video Indexer | Microsoft Docs
description: This topic discusses how to migrate from Azure Media Indexer v1 and v2 to Azure Media Services Video Indexer.
services: media-services
documentationcenter: ''
author: juliako
manager: femila
editor: ''

ms.service: media-services
ms.workload: media
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 09/20/2019
ms.author: juliako

---
# Migrate from Media Indexer and Media Indexer 2 to Video Indexer

The [Azure Media Indexer](media-services-index-content.md) media processor and [Azure Media Indexer 2 Preview](media-services-process-content-with-indexer2.md) media processors are being retired. For the retirement dates, see this [legacy components](legacy-components.md) topic. [Azure Media Services Video Indexer](https://docs.microsoft.com/azure/media-services/video-indexer/) replaces these legacy media processors.

Azure Media Services Video Indexer is built on Azure Media Analytics, Azure Cognitive Search, Cognitive Services (such as the Face API, Microsoft Translator, the Computer Vision API, and Custom Speech Service). It enables you to extract the insights from your videos using Video Indexer video and audio models. To see what scenarios Video Indexer can be used in, what features it offers, and how to get started, see [Video Indexer video and audio models](../video-indexer/video-indexer-overview.md). 

You can extract insights from your video and audio files by using the [Azure Media Services v3 analyzer presets](../latest/analyzing-video-audio-files-concept.md) or directly by using the [Video Indexer APIs](https://api-portal.videoindexer.ai/). Currently, there is an overlap between features offered by the Video Indexer APIs and the Media Services v3 APIs.

> [!NOTE]
> To understand when you would want to use Video Indexer vs. Media Services analyzer presets, check out the [comparison document](../video-indexer/compare-video-indexer-with-media-services-presets.md). 

This article discusses the steps for migrating from the Azure Media Indexer and Azure Media Indexer 2 to Azure Media Services Video Indexer.  

## Migration options 

|If you require  |then |
|---|---|
|a solution that provides a speech-to-text transcription for any media file format in a closed caption file formats: VTT, SRT, or TTML<br/>as well as additional audio insights such as: keywords, topic inferencing, acoustic events, speaker diarization, entities extraction and translation| update your applications to use the Azure Video Indexer capabilities through the Video Indexer v2 REST API or the Azure Media Services v3 Audio Analyzer preset.|
|speech-to-text capabilities| use the Cognitive Services Speech API directly.|  

## Getting started with Video Indexer

The following section points you to relevant links: [How can I get started with Video Indexer?](https://docs.microsoft.com/azure/media-services/video-indexer/video-indexer-overview#how-can-i-get-started-with-video-indexer) 

## Getting started with Media Services v3 APIs

Azure Media Services v3 API enables you to extract insights from your video and audio files through the [Azure Media Services v3 analyzer presets](../latest/analyzing-video-audio-files-concept.md). 

**AudioAnalyzerPreset** enables you to extract multiple audio insights from an audio or video file. The output includes a VTT or TTML file for the audio transcript and a JSON file (with all the additional audio insights). The audio insights include keywords, speaker indexing, and speech sentiment analysis. AudioAnalyzerPreset also supports language detection for specific languages. For detailed information, see [Transforms](https://docs.microsoft.com/rest/api/media/transforms/createorupdate#audioanalyzerpreset).

### Get started

To get started see:

* [Tutorial](../latest/analyze-videos-tutorial-with-api.md)
* AudioAnalyzerPreset samples: [Java SDK](https://github.com/Azure-Samples/media-services-v3-java/tree/master/AudioAnalytics/AudioAnalyzer) or [.NET SDK](https://github.com/Azure-Samples/media-services-v3-dotnet/tree/master/AudioAnalytics/AudioAnalyzer)
* VideoAnalyzerPreset samples: [Java SDK](https://github.com/Azure-Samples/media-services-v3-java/tree/master/VideoAnalytics/VideoAnalyzer) or [.NET SDK](https://github.com/Azure-Samples/media-services-v3-dotnet/tree/master/VideoAnalytics/VideoAnalyzer)

## Getting started with Cognitive Services Speech Services

[Azure Cognitive Services](https://docs.microsoft.com/azure/cognitive-services/) provides a speech-to-text service that transcribes audio streams to text in real time that your applications, tools, or devices can consume or display. You can  use speech-to-text to [customize your own acoustic model, language model, or pronunciation model](../../cognitive-services/speech-service/how-to-custom-speech-train-model.md). For more information, see [Cognitive Services speech-to-text](../../cognitive-services/speech-service/speech-to-text.md). 

> [!NOTE] 
> The speech-to-text service does not take video file formats and only takes [certain audio formats](https://docs.microsoft.com/azure/cognitive-services/speech-service/rest-speech-to-text#audio-formats). 

For more information about the text-to-speech service and how to get started, see [What is speech-to-text?](https://docs.microsoft.com/azure/cognitive-services/speech-service/speech-to-text)

## Known differences from deprecated services 

You will find that Video Indexer, Azure Media Services v3 AudioAnalyzerPreset, and Cognitive Services Speech Services services are more reliable and produces better quality output than the retired Azure Media Indexer 1 and Azure Media Indexer 2 processors.  

Some known differences include: 

* Cognitive Services Speech Services does not support keyword extraction. However, Video Indexer and Media Services v3 AudioAnalyzerPreset both offer a more robust set of keywords in JSON file format. 

## Need help?

You can open a support ticket by navigating to [New support request](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest)

## Next steps

* [Legacy components](legacy-components.md)
* [Pricing page](https://azure.microsoft.com/pricing/details/media-services/#encoding)



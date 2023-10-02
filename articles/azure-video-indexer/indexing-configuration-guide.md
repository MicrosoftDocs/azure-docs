---
title: Indexing configuration guide
description: This article explains the configuration options of indexing process with Azure AI Video Indexer.
ms.topic: conceptual
ms.date: 04/27/2023
ms.author: inhenkel
author: DavidDyckman
---

# The indexing configuration guide

[!INCLUDE [AMS AVI retirement announcement](./includes/important-ams-retirement-avi-announcement.md)]

It's important to understand the configuration options to index efficiently while ensuring you meet your indexing objectives. When indexing videos, users can use the default settings or adjust many of the settings. Azure AI Video Indexer allows you to choose between a range of language, indexing, custom models, and streaming settings that have implications on the insights generated, cost, and performance.  

This article explains each of the options and the impact of each option to enable informed decisions when indexing. The article discusses the [Azure AI Video Indexer website](https://www.videoindexer.ai/) experience but the same options apply when submitting jobs through the API (see the [API guide](video-indexer-use-apis.md)). When indexing large volumes, follow the [at-scale guide](considerations-when-use-at-scale.md).  

The initial upload screen presents options to define the video name, source language, and privacy settings.  

:::image type="content" source="./media/indexing-configuration-guide/configuration.png" alt-text="Screenshot shows options to define the video name, source language, and privacy settings.":::  

All the other setting options appear if you select Advanced options. 

:::image type="content" source="./media/indexing-configuration-guide/advanced-configuration.png" alt-text="Screenshot shows advanced options to define the video name, source language, and privacy settings."::: 

## Default settings 

By default, Azure AI Video Indexer is configured to a **Video source language** of English, **Privacy** of private, **Standard** audio and video setting, and **Streaming quality** of single bitrate. 

> [!TIP]
> This topic describes each indexing option in detail.

Below are a few examples of when using the default setting might not be a good fit: 

- If you need insights observed people or matched person that is only available through Advanced Video. 
- If you're only using Azure AI Video Indexer for transcription and translation, indexing of both audio and video isn’t required, **Basic** for audio should suffice. 
- If you're consuming Azure AI Video Indexer insights but have no need to generate a new media file, streaming isn't necessary and **No streaming** should be selected to avoid the encoding job and its associated cost.  
- If a video is primarily in a language that isn't English.  

### Video source language 

If you're aware of the language spoken in the video, select the language from the video source language list. If you're unsure of the language of the video, choose **Auto-detect single language**. When uploading and indexing your video, Azure AI Video Indexer will use language identification (LID) to detect the videos language and generate transcription and insights with the detected language. 

If the video may contain multiple languages and you aren't sure which ones, select **Auto-detect multi-language**. In this case, multi-language (MLID) detection will be applied when uploading and indexing your video. 

While auto-detect is a great option when the language in your videos varies, there are two points to consider when using LID or MLID: 

- LID/MLID don't support all the languages supported by Azure AI Video Indexer.
- The transcription is of a higher quality when you pre-select the video’s appropriate language.

Learn more about [language support and supported languages](language-support.md). 

### Privacy 

This option allows you to determine if the insights should only be accessible to users in your Azure AI Video Indexer account or to anyone with a link. 

### Indexing options 

When indexing a video with the default settings, beware each of the audio and video indexing options may be priced differently. See [Azure AI Video Indexer pricing](https://azure.microsoft.com/pricing/details/video-indexer/) for details. 

Below are the indexing type options with details of their insights provided. To modify the indexing type, select **Advanced settings**. 

|Audio only|Video only |Audio & Video |
|---|---|---|
|Basic |||
|Standard| Standard |Standard |
|Advanced |Advanced|Advanced |

## Advanced settings

### Audio only  

- **Basic**: Indexes and extract insights by using audio only (ignoring video) and provides the following insights: transcription, translation, formatting of output captions and subtitles (closed captions).
- **Standard**: Indexes and extract insights by using audio only (ignoring video) and provides the following insights: transcription, translation, formatting of output captions and subtitles (closed captions), automatic language detection, emotions, keywords, named entities (brands, locations, people), sentiments, speakers, topic extraction, and textual content moderation.   
- **Advanced**: Indexes and extract insights by using audio only (ignoring video) and provides the following insights: transcription, translation, formatting of output captions and subtitles (closed captions), automatic language detection, audio event detection, emotions, keywords, named entities (brands, locations, people), sentiments, speakers, topic extraction, and textual content moderation.   

### Video only 

- **Standard**: Indexes and extract insights by using video only (ignoring audio) and provides the following insights: labels (OCR), named entities (OCR - brands, locations, people), OCR, people, scenes (keyframes and shots), black frames, visual content moderation, and topic extraction (OCR). 
- **Advanced**: Indexes and extract insights by using video only (ignoring audio) and provides the following insights: labels (OCR), matched person (preview), named entities (OCR - brands, locations, people), OCR, observed people (preview), people, scenes (keyframes and shots), clapperboard detection, digital pattern detection, featured clothing insight, textless slate detection, textual logo detection, black frames, visual content moderation, and topic extraction (OCR). 

### Audio and Video   

- **Standard**: Indexes and extract insights by using audio and video and provides the following insights: transcription, translation, formatting of output captions and subtitles (closed captions), automatic language detection, emotions, keywords, named entities (brands, locations, people), OCR, scenes (keyframes and shots), black frames, visual content moderation, people, sentiments, speakers, topic extraction, and textual content moderation.   
- **Advanced**: Indexes and extract insights by using audio and video and provides the following insights: transcription, translation, formatting of output captions and subtitles (closed captions), automatic language detection, textual content moderation, audio event detection, emotions, keywords, matched person, named entities (brands, locations, people), OCR, observed people (preview), people, clapperboard detection, digital pattern detection, featured clothing insight, textless slate detection, sentiments, speakers, scenes (keyframes and shots), textual logo detection, black frames, visual content moderation, and topic extraction.   

### Streaming quality options 

When indexing a video, you can decide if encoding of the file should occur which will enable streaming. The sequence is as follows: 

Upload > Encode (optional) > Index & Analysis > Publish for streaming (optional) 

Encoding and streaming operations are performed by and billed by Azure Media Services. There are two additional operations associated with the creation of a streaming video:

- The creation of a Streaming Endpoint. 
- Egress traffic – the volume depends on the number of video playbacks, video playback length, and the video quality (bitrate).
 
There are several aspects that influence the total costs of the encoding job. The first is if the encoding is with single or adaptive streaming. This will create either a single output or multiple encoding quality outputs. Each output is billed separately and depends on the source quality of the video you uploaded to Azure AI Video Indexer.  

For Media Services encoding pricing details, see [pricing](https://azure.microsoft.com/pricing/details/media-services/#pricing). 

When indexing a video, default streaming settings are applied. Below are the streaming type options that can be modified if you, select **Advanced** settings and go to **Streaming quality**. 

|Single bitrate|Adaptive bitrate| No streaming |
|---|---|---|

- **Single bitrate**: With Single Bitrate, the standard Media Services encoder cost will apply for the output. If the video height is greater than or equal to 720p HD, Azure AI Video Indexer encodes it with a resolution of 1280 x 720. Otherwise, it's encoded as 640 x 468. The default setting is content-aware encoding. 
- **Adaptive bitrate**: With Adaptive Bitrate, if you upload a video in 720p HD single bitrate to Azure AI Video Indexer and select Adaptive Bitrate, the encoder will use the [AdaptiveStreaming](/rest/api/media/transforms/create-or-update?tabs=HTTP#encodernamedpreset) preset. An output of 720p HD (no output exceeding 720p HD is created) and several lower quality outputs are created (for playback on smaller screens/low bandwidth environments). Each output will use the Media Encoder Standard base price and apply a multiplier for each output. The multiplier is 2x for HD, 1x for non-HD, and 0.25 for audio and billing is per minute of the input video. 

    **Example**: If you index a video in the US East region that is 40 minutes in length and is 720p HP and have selected the streaming option of Adaptive Bitrate, 3 outputs will be created - 1 HD (multiplied by 2), 1 SD (multiplied by 1) and 1 audio track (multiplied by 0.25). This will total to (2+1+0.25) * 40 = 130 billable output minutes.  

    Output minutes (standard encoder): 130 x $0.015/minute = $1.95. 
- **No streaming**: Insights are generated but no streaming operation is performed and the video isn't available on the Azure AI Video Indexer website.  When No streaming is selected, you aren't billed for encoding. 

### Customizing content models 

Azure AI Video Indexer allows you to customize some of its models to be adapted to your specific use case. These models include brands, language, and person. If you have customized models, this section enables you to configure if one of the created models should be used for the indexing. 

## Next steps

Learn more about [language support and supported languages](language-support.md). 

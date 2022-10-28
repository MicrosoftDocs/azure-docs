---
title: Indexing configuration guide
description: This article provides a guide on indexing configuration options.
ms.topic: conceptual
ms.date: 10/26/2022
ms.author: juliako
---

# Indexing configuration guide

When indexing videos, users can use the default settings but also have the option of adjusting many of the settings. It's important to understand the configuration options to index efficiently while ensuring you meet your indexing objectives. Video Indexer allows you to choose between a range of language, indexing, custom models, and streaming settings that have implications on the insights generated, cost, and performance.  

This article will explain each of the options and the impact of each option to enable informed decisions when indexing. It discusses the Video Indexer portal experience but the same options apply when submitting jobs through the API – see [API guide](video-indexer-use-apis.md) and the [at-scale guide](considerations-when-use-at-scale.md) for what to consider when indexing large volumes.  

The initial upload screen presents options to define the video name, source language, and privacy settings.  

:::image type="content" source="./media/indexing-configuration-guide/configuration.png" alt-text="The screen presents options to define the video name, source language, and privacy settings.  
":::  

All the other setting options appear if you select Advanced options. 

:::image type="content" source="./media/indexing-configuration-guide/advanced-configuration.png" alt-text="The screen presents advanced options to define the video name, source language, and privacy settings.  
"::: 

## Video source language 

If you're aware of the language spoken in the video, select the language from the Video source language list. If you're unsure of the language of the video, choose **Auto-detect single language** when uploading and indexing your video and Video Indexer will use language identification (LID) to detect the videos language and generate transcription and insights with the detected language. If the video may contain multiple languages and you aren't sure which ones, select **Auto-detect multi-language** and multi-language (MLID) detection will be applied when uploading and indexing your video. 

While auto-detect is a great option when the language in your videos varies, there are two points to consider when using LID or MLID: 

- LID/MLID don't support all the languages supported by Video Indexer 
- The transcription is of a higher quality when you pre-select the video’s appropriate language 

Learn more about [language support and supported languages](language-support.md). 

### Privacy 

This allows you to determine if the insights should only be accessible to users in your Video Indexer account or to anyone with a link. 

### Indexing options 

When indexing a video, default settings are applied (see end of the doc for information on default settings). Each of the audio and video indexing options may be priced differently. See the [Azure Video Indexer pricing](https://azure.microsoft.com/pricing/details/video-indexer/) page for details. 

Below are the indexing type options with details of their insights provided.  To modify the Indexing type, select Advanced settings and go to Video + audio indexing. 

|Audio only|Video only |Audio & Video 
|---|---|---|
|Basic |||
|Standard| Standard |Standard |
|Advanced |Advanced|Advanced |

### Audio only  

Basic - Indexes and extract insights by using audio only (ignoring video) and provides the following insights: transcription, translation, formatting of output captions and subtitles, named entities (brands, locations, people), and topics.  

Standard - Indexes and extract insights by using audio only (ignoring video) and provides the following insights: transcription, translation, formatting of output captions and subtitles, emotions, keywords, named entities (brands, locations, people), sentiments, speakers, and topics.   

Advanced - Indexes and extract insights by using audio only (ignoring video) and provides the following insights: transcription, translation, formatting of output captions and subtitles, audio effects (preview), emotions, keywords, named entities (brands, locations, people), sentiments, speakers, and articles.   

Video only 

Standard - Indexes and extract insights by using video only (ignoring audio) and provides the following insights: labels (OCR), named entities (OCR - brands, locations, people), OCR, people, scenes (keyframes and shots), and topics (OCR). 

Advanced - Indexes and extract insights by using video only (ignoring audio) and provides the following insights: labels (OCR), matched person (preview), named entities (OCR - brands, locations, people), OCR, observed people (preview), people, scenes (keyframes and shots), and topics (OCR). 

Audio and Video   

Standard - Indexes and extract insights by using audio and video and provides the following insights: transcription, translation, formatting of output captions and subtitles, audio effects (preview), emotions, keywords, named entities (brands, locations, people), OCR, people, sentiments, speakers, and topics.   

Advanced - Indexes and extract insights by using audio and video and provides the following insights: transcription, translation, formatting of output captions and subtitles, audio effects (preview), emotions, keywords, matched person (preview), named entities (brands, locations, people), OCR, observed people (preview), people, sentiments, speakers, and topics.   

Streaming quality options 

When indexing a video, you can decide if encoding of the file should occur which will enable streaming. The sequence is as follows: 

Upload > Encode (optional) > Index & Analysis > Publish for streaming (optional) 

 Encoding and streaming operations are performed by and billed by Azure Media Services. There are more operations associated with creation of a streaming video; a Streaming Endpoint and the egress traffic that depends on the number of video playbacks, video playback length, and the video quality (bitrate).  

There are several aspects that influence the total costs of the encoding job. The first is if the encoding is with single or adaptive streaming. This will create either a single output or multiple encoding quality outputs. Each output is billed separately and depends on the source quality of the video you uploaded to Video Indexer.  

See the Media Service pricing page for encoding pricing details. 

When indexing a video, default streaming settings are applied (see below for information on default settings). Below are the streaming type options that can be modified if you, select Advanced settings and go to Streaming quality. 

}Single bitrate|Adaptive bitrate| No streaming |

Single bitrate 

With Single Bitrate, the standard Media Services encoder cost will apply for the output. If the video height is greater than or equal to 720p HD, Azure Video Indexer encodes it with a resolution of 1280 x 720. Otherwise, it's encoded as 640 x 468. The default setting is content-aware encoding. 

Adaptive bitrate 

With Adaptive Bitrate, if you upload a video in 720p HD single bitrate to Video Indexer and select Adaptive Bitrate, the encoder will use AdaptiveStreaming preset. An output of 720p HD (no output exceeding 720p HD is created) and several lower quality outputs are created (for playback on smaller screens/low bandwidth environments). Each output will use the Media Encoder Standard base price and apply a multiplier for each output. The multiplier is 2x for HD, 1x for non-HD, and .25 for audio and billing is per minute of the input video. 

Example: If you index a video in the US East region that is 40 minutes in length and is 720p HP and have selecting the streaming option of Adaptive Bitrate, 3 outputs will be created - 1 HD (multiplied by 2), 1 SD (multiplied by 1) and 1 audio track (multiplied by 0.25). This will total to (2+1+0.25) * 40 = 130 billable output minutes.  

Output minutes (standard encoder): 130 x $0.015/minute = $1.95 

No streaming 

Insights are generated but no streaming operation is performed and the video isn't available on the Video Indexer website.  When No streaming is selected, you aren't billed for encoding. 

Customizing content models - People/Animated characters and Brand categories 

Azure Video Indexer allows you to customize some of its models to be adapted to your specific use case. These models include animated characters, brands, language, and person. If you have customized models, this section enables you to configure if one of the created models should be used for the indexing. 

Default Settings 

By default, Video Indexer is configured to a Video source language of English, Privacy of private, Standard audio and video setting, and Streaming quality of single bitrate. 

Below are a few examples of when using the default setting might not be a good fit: 

- If you need insights observed people or matched person that is only available through Advanced Video. 
- If you're only using Video Indexer for transcription and translation, indexing of both Audio & Video isn’t required, Basic audio should suffice. 
- If you're consuming Video Indexer insights but have no need to generate a new media file, streaming isn’t necessary and No streaming should be selected to avoid the encoding job and its associated cost.  
- If a video is primarily in a language that isn't English.  

## Next steps

Learn more about [language support and supported languages](language-support.md). 
---
title: Use the Video Indexer Language Identification model - Azure  
titlesuffix: Azure Media Services
description: This article describes the Video Indexer Language Identification model.
services: media-services
author: juliako
manager: femila

ms.service: media-services
ms.subservice: video-indexer
ms.topic: article
ms.date: 07/22/2019
ms.author: ellbe
---

# Language Identification model

Video Indexer supports automatic language identification (LID), which is the process of automatically identifying the spoken language content from audio and sending the media file to be transcribed in the dominant identified language. Currently LID supports English, Spanish, French, German, Italian, Chinese (Simplified), Japanese, Russian, and Portuguese (Brazilian). 

## Choosing auto language identification on indexing

When indexing or [re-indexing](https://api-portal.videoindexer.ai/docs/services/operations/operations/Re-Index-Video?) a video using the API, choose the *auto detect* option in the `sourceLanguage` parameter.

When using portal, go to your **Account videos** on the [Video Indexer](https://www.videoindexer.ai/) home page and hover over the name of the video that you want to re-index. On the right-bottom corner click the re-index button. In the **Re-index video** dialog choose *Auto detect* from the **Video source language** drop-down box/

![auto detect](./media/language-identification-model/auto-detect.png)

## Model output

Video Indexer will transcribe the video according to the most likely language only if the confidence for that language is `> 0.6`, otherwise it will fall back to assume the spoken language is English. 
Model dominant language is also available in the insights JSON as attribute `sourceLanguage` under root/videos/insights, with a corresponding confidence score available under attribute `sourceLanguageConfidence`

```json
"insights": {
}
```
 
In addition, a verbose response through the [Artifact auxiliary API](https://api-portal.videoindexer.ai/docs/services/operations/operations/get-video-artifact-download-url/) is available (set `languageDetection` as the type parameter value). The verbose response contains the dominant language and the confidence score of each supported language. The confidence for each segment detected as speech / non-speech and a detailed segmentation of the file to detected language intervals with corresponding confidence of each of the supported languages. 

## Guidelines and limitation

* Supported languages include English, Spanish, French, German, Italian, Chinese (Simplified), Japanese, Russian, and Brazilian Portuguese.
* If the audio contains languages other than the supported list above, the result is unexpected.
* In case no language is identified in high enough probability (`>0.6`), the fallback language will be English.
* There is no current support for file with mixed languages audio. If the audio contains mixed languages, the result is unexpected. 
* Low-quality audio caustic may impact the model results.
* The model requires at least X minutes of speech in the audio.
* The model is design for spontaneous conversational speech (as opposed to, for example, voice commands, singing, etc.).

## Next steps

[Overview](video-indexer-overview.md)

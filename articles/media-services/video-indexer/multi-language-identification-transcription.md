---
title: Automatically identify and transcribe multi-language content with Video Indexer - Azure
titlesuffix: Azure Media Services
description: This topic demonstrates how to automatically identify and transcribe multi-language content with Video Indexer.
services: media-services
author: Juliako
manager: femila

ms.service: media-services
ms.subservice: video-indexer
ms.topic: article
ms.date: 09/01/2019
ms.author: juliako
---

# Automatically identify and transcribe multi-language content (preview)

Video Indexer supports automatic language identification and transcription in multi-language content, which is the process of automatically identifying the spoken language in different segments from audio, sending each segment of the media file to be transcribed and combine the transcription back to one unified transcription. 

## Choosing multilingual identification on indexing

When indexing or [re-indexing](https://api-portal.videoindexer.ai/docs/services/operations/operations/Re-Index-Video?) a video using the API, choose the `multi-language detection` option in the `sourceLanguage` parameter.

When using portal, go to your **Library** on the [Video Indexer home page](https://vi.microsoft.com/) and hover over the name of the video that you want to re-index. On the right-bottom corner click the re-index button. In the **Re-index video** dialog, choose **multi-language detection**  from the **Video source language** drop-down box.

## Model output

The model will retrieve all of the languages detected in the video in one list


Additionally, each instance in the transcription section will include the language in which it was transcribed

### Portal experience

•	When a video was indexed as multi-language, the insight page will include that option, and an additional insight type will appear, enabling the user to view which segment is transcribed in which language “Spoken language”.
•	Translation to all languages is fully available from the multi-language transcript
•	All other insights will appear in the master language detected – that is the language that appeared most in the audio
•	Closed captioning on the player is available in multi-language as well

## Guidelines and limitations

•	Set of supported languages: English, French, German, Spanish 
•	Support for multi-language content with up to 3 supported languages.
•	If the audio contains languages other than the supported list above, the result is unexpected.
•	Minimal segment length to detect for each language – 15 seconds
•	Language detection offset is 3 seconds on average
•	Speech is expected to be continuous. Frequent alternations between languages may affect the models performance.
•	Speech of non-native speakers may affect the model performance (e.g. when speakers use their native tongue and they switch to another language) 
•	The model is designed to recognize a spontaneous conversational speech with reasonable audio acoustics (not voice commands, singing, etc.).
•	Project creation and editing is currently not available for multi-language videos
Custom language models are not available when using multi-language detection

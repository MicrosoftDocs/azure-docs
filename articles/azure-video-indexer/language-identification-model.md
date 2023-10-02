---
title: Use Azure AI Video Indexer to auto identify spoken languages 
description: This article describes how the Azure AI Video Indexer language identification model is used to automatically identifying the spoken language in a video.
ms.topic: how-to
ms.date: 08/28/2023
ms.author: ellbe
author: IngridAtMicrosoft
---

# Automatically identify the spoken language with language identification model

[!INCLUDE [AMS AVI retirement announcement](./includes/important-ams-retirement-avi-announcement.md)]

Azure AI Video Indexer supports automatic language identification (LID), which is the process of automatically identifying the spoken language from audio content. The media file is transcribed in the dominant identified language.

See the list of supported by Azure AI Video Indexer languages in [supported languages](language-support.md).

Make sure to review the [Guidelines and limitations](#guidelines-and-limitations) section.

## Choosing auto language identification on indexing

When indexing or [reindexing](https://api-portal.videoindexer.ai/api-details#api=Operations&operation=Re-Index-Video) a video using the API, choose the `auto detect` option in the `sourceLanguage` parameter.

When using portal, go to your **Account videos** on the [Azure AI Video Indexer](https://www.videoindexer.ai/) home page and hover over the name of the video that you want to reindex. On the right-bottom corner, select the **Re-index** button. In the **Re-index video** dialog, choose *Auto detect* from the **Video source language** drop-down box.

:::image type="content" source="./media/language-identification-model/auto-detect.png" alt-text="Screenshot showing where to select auto detect.":::

## Model output

Azure AI Video Indexer transcribes the video according to the most likely language if the confidence for that language is `> 0.6`. If the language can't be identified with confidence, it assumes the spoken language is English. 

Model dominant language is available in the insights JSON as the `sourceLanguage` attribute (under root/videos/insights). A corresponding confidence score is also available under the `sourceLanguageConfidence` attribute.

```json
"insights": {
        "version": "1.0.0.0",
        "duration": "0:05:30.902",
        "sourceLanguage": "fr-FR",
        "language": "fr-FR",
        "transcript": [...],
        . . .
        "sourceLanguageConfidence": 0.8563
      }
```

## Guidelines and limitations

Automatic language identification (LID) supports the following languages:

   See the list of supported by Azure AI Video Indexer languages in [supported languages](language-support.md).

- If the audio contains languages other than the [supported list](language-support.md), the result is unexpected.
- If Azure AI Video Indexer can't identify the language with a high enough confidence (greater than 0.6), the fallback language is English.
- Currently, there isn't support for files with mixed language audio. If the audio contains mixed languages, the result is unexpected. 
- Low-quality audio may affect the model results.
- The model requires at least one minute of speech in the audio.
- The model is designed to recognize a spontaneous conversational speech (not voice commands, singing, and so on).

## Next steps

- [Overview](video-indexer-overview.md)
- [Automatically identify and transcribe multi-language content](multi-language-identification-transcription.md)

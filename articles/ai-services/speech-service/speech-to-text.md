---
title: Speech to text overview - Speech service
titleSuffix: Azure AI services
description: Get an overview of the benefits and capabilities of the speech to text feature of the Speech service.
services: cognitive-services
author: eric-urban
manager: nitinme
ms.service: azure-ai-speech
ms.topic: overview
ms.date: 04/05/2023
ms.author: eur
ms.custom: cog-serv-seo-aug-2020
keywords: speech to text, speech to text software
---

# What is speech to text?

In this overview, you learn about the benefits and capabilities of the speech to text feature of the Speech service, which is part of Azure AI services. Speech to text can be used for [real-time](#real-time-speech-to-text) or [batch transcription](#batch-transcription) of audio streams into text. 

> [!NOTE]
> To compare pricing of [real-time](#real-time-speech-to-text) to [batch transcription](#batch-transcription), see [Speech service pricing](https://azure.microsoft.com/pricing/details/cognitive-services/speech-services/). 

For a full list of available speech to text languages, see [Language and voice support](language-support.md?tabs=stt).

## Real-time speech to text

With real-time speech to text, the audio is transcribed as speech is recognized from a microphone or file. Use real-time speech to text for applications that need to transcribe audio in real-time such as:
- Transcriptions, captions, or subtitles for live meetings
- [Diarization](get-started-stt-diarization.md)
- [Pronunciation assessment](how-to-pronunciation-assessment.md)
- Contact center agent assist
- Dictation
- Voice agents

Real-time speech to text is available via the [Speech SDK](speech-sdk.md) and the [Speech CLI](spx-overview.md). 

## Batch transcription

[Batch transcription](batch-transcription.md) is used to transcribe a large amount of audio in storage. You can point to audio files with a shared access signature (SAS) URI and asynchronously receive transcription results. Use batch transcription for applications that need to transcribe audio in bulk such as:
- Transcriptions, captions, or subtitles for pre-recorded audio
- Contact center post-call analytics
- Diarization

Batch transcription is available via:
- [Speech to text REST API](rest-speech-to-text.md): To get started, see [How to use batch transcription](batch-transcription.md) and [Batch transcription samples (REST)](https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/samples/batch).
- The [Speech CLI](spx-overview.md) supports both real-time and batch transcription. For Speech CLI help with batch transcriptions, run the following command:
    ```azurecli-interactive
    spx help batch transcription
    ```

## Custom Speech

With [Custom Speech](./custom-speech-overview.md), you can evaluate and improve the accuracy of speech recognition for your applications and products. A custom speech model can be used for [real-time speech to text](speech-to-text.md), [speech translation](speech-translation.md), and [batch transcription](batch-transcription.md).

> [!TIP]
> A [hosted deployment endpoint](how-to-custom-speech-deploy-model.md) isn't required to use Custom Speech with the [Batch transcription API](batch-transcription.md). You can conserve resources if the [custom speech model](how-to-custom-speech-train-model.md) is only used for batch transcription. For more information, see [Speech service pricing](https://azure.microsoft.com/pricing/details/cognitive-services/speech-services/).

Out of the box, speech recognition utilizes a Universal Language Model as a base model that is trained with Microsoft-owned data and reflects commonly used spoken language. The base model is pre-trained with dialects and phonetics representing a variety of common domains. When you make a speech recognition request, the most recent base model for each [supported language](language-support.md?tabs=stt) is used by default. The base model works very well in most speech recognition scenarios.

A custom model can be used to augment the base model to improve recognition of domain-specific vocabulary specific to the application by providing text data to train the model. It can also be used to improve recognition based for the specific audio conditions of the application by providing audio data with reference transcriptions. For more information, see [Custom Speech](./custom-speech-overview.md) and [Speech to text REST API](rest-speech-to-text.md).

Customization options vary by language or locale. To verify support, see [Language and voice support for the Speech service](./language-support.md?tabs=stt).

## Responsible AI 

An AI system includes not only the technology, but also the people who will use it, the people who will be affected by it, and the environment in which it is deployed. Read the transparency notes to learn about responsible AI use and deployment in your systems. 

* [Transparency note and use cases](/legal/cognitive-services/speech-service/speech-to-text/transparency-note?context=/azure/ai-services/speech-service/context/context)
* [Characteristics and limitations](/legal/cognitive-services/speech-service/speech-to-text/characteristics-and-limitations?context=/azure/ai-services/speech-service/context/context)
* [Integration and responsible use](/legal/cognitive-services/speech-service/speech-to-text/guidance-integration-responsible-use?context=/azure/ai-services/speech-service/context/context)
* [Data, privacy, and security](/legal/cognitive-services/speech-service/speech-to-text/data-privacy-security?context=/azure/ai-services/speech-service/context/context)

## Next steps

- [Get started with speech to text](get-started-speech-to-text.md)
- [Create a batch transcription](batch-transcription-create.md)

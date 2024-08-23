---
title: Speech to text overview - Speech service
titleSuffix: Azure AI services
description: Get an overview of the benefits and capabilities of the speech to text feature of the Speech service.
author: eric-urban
manager: nitinme
ms.service: azure-ai-speech
ms.topic: overview
ms.date: 8/20/2024
ms.author: eur
---

# What is speech to text?

Azure AI Speech service offers advanced speech to text capabilities. This feature supports both real-time and batch transcription, providing versatile solutions for converting audio streams into text. 

## Core Features 

The speech to text service offers the following core features: 
- [Real-time](#real-time-speech-to-text) transcription: Instant transcription with intermediate results for live audio inputs. 
- [Fast transcription](#fast-transcription-preview): Fastest synchronous output for situations with predictable latency. 
- [Batch transcription](#batch-transcription-api): Efficient processing for large volumes of prerecorded audio. 
- [Custom speech](#custom-speech): Models with enhanced accuracy for specific domains and conditions. 

## Real-time speech to text

Real-time speech to text transcribes audio as it's recognized from a microphone or file. It's ideal for applications requiring immediate transcription, such as: 
- **Transcriptions, captions, or subtitles for live meetings**: Real-time audio transcription for accessibility and record-keeping. 
- **Diarization**: Identifying and distinguishing between different speakers in the audio. 
- **Pronunciation assessment**: Evaluating and providing feedback on pronunciation accuracy. 
- **Call center agents assist**: Providing real-time transcription to assist customer service representatives. 
- **Dictation**: Transcribing spoken words into written text for documentation purposes. 
- **Voice agents**: Enabling interactive voice response systems to transcribe user queries and commands. 

Real-time speech to text can be accessed via the Speech SDK, Speech CLI, and REST API, allowing integration into various applications and workflows. 
Real-time speech to text is available via the [Speech SDK](speech-sdk.md), the [Speech CLI](spx-overview.md), and REST APIs such as the [Fast transcription API](fast-transcription-create.md). 

## Fast transcription (Preview)

Fast transcription API is used to transcribe audio files with returning results synchronously and faster than real-time audio. Use fast transcription in the scenarios that you need the transcript of an audio recording as quickly as possible with predictable latency, such as: 

- **Quick audio or video transcription and subtitles**: Quickly get a transcription of an entire video or audio file in one go.
- **Video translation**: Immediately get new subtitles for a video if you have audio in different languages. 

> [!NOTE]
> Fast transcription API is only available via the speech to text REST API version 2024-05-15-preview and later. 

To get started with fast transcription, see [use the fast transcription API (preview)](fast-transcription-create.md).

## Batch transcription API

[Batch transcription](batch-transcription.md) is designed for transcribing large amounts of audio stored in files. This method processes audio asynchronously and is suited for: 
- **Transcriptions, captions, or subtitles for prerecorded audio**: Converting stored audio content into text. 
- **Contact center post-call analytics**: Analyzing recorded calls to extract valuable insights.
- **Diarization**: Differentiating between speakers in recorded audio. 

Batch transcription is available via:
- [Speech to text REST API](rest-speech-to-text.md): Facilitates batch processing with the flexibility of RESTful calls. To get started, see [How to use batch transcription](batch-transcription.md) and [Batch transcription samples](https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/samples/batch).
- [Speech CLI](spx-overview.md): Supports both real-time and batch transcription, making it easy to manage transcription tasks. For Speech CLI help with batch transcriptions, run the following command:

    ```azurecli-interactive
    spx help batch transcription
    ```

## Custom speech

With [custom speech](./custom-speech-overview.md), you can evaluate and improve the accuracy of speech recognition for your applications and products. A custom speech model can be used for [real-time speech to text](speech-to-text.md), [speech translation](speech-translation.md), and [batch transcription](batch-transcription.md).

> [!TIP]
> A [hosted deployment endpoint](how-to-custom-speech-deploy-model.md) isn't required to use custom speech with the [Batch transcription API](batch-transcription.md). You can conserve resources if the [custom speech model](how-to-custom-speech-train-model.md) is only used for batch transcription. For more information, see [Speech service pricing](https://azure.microsoft.com/pricing/details/cognitive-services/speech-services/).

Out of the box, speech recognition utilizes a Universal Language Model as a base model that is trained with Microsoft-owned data and reflects commonly used spoken language. The base model is pretrained with dialects and phonetics representing various common domains. When you make a speech recognition request, the most recent base model for each [supported language](language-support.md?tabs=stt) is used by default. The base model works well in most speech recognition scenarios.

Custom speech allows you to tailor the speech recognition model to better suit your application's specific needs. This can be particularly useful for: 
- **Improving recognition of domain-specific vocabulary**: Train the model with text data relevant to your field. 
- **Enhancing accuracy for specific audio conditions**: Use audio data with reference transcriptions to refine the model. 

For more information about custom speech, see the [custom speech overview](./custom-speech-overview.md) and the [speech to text REST API](rest-speech-to-text.md) documentation.

For details about customization options per language and locale, see the [language and voice support for the Speech service](./language-support.md?tabs=stt) documentation.

## Usage Examples 

Here are some practical examples of how you can utilize Azure AI speech to text: 

| Use case | Scenario | Solution |
| --- | --- | --- |
| **Live meeting transcriptions and captions** | A virtual event platform needs to provide real-time captions for webinars. | Integrate real-time speech to text using the Speech SDK to transcribe spoken content into captions displayed live during the event. |
| **Customer service enhancement** | A call center wants to assist agents by providing real-time transcriptions of customer calls. | Use real-time speech to text via the Speech CLI to transcribe calls, enabling agents to better understand and respond to customer queries. |
| **Video subtitling** | A video-hosting platform wants to quickly generate a set of subtitles for a video. | Use fast transcription to quickly get a set of subtitles for the entire video. |
| **Educational tools** | An e-learning platform aims to provide transcriptions for video lectures. | Apply batch transcription through the speech to text REST API to process prerecorded lecture videos, generating text transcripts for students. |
| **Healthcare documentation** | A healthcare provider needs to document patient consultations. | Use real-time speech to text for dictation, allowing healthcare professionals to speak their notes and have them transcribed instantly. Use a custom model to enhance recognition of specific medical terms. |
| **Media and entertainment** | A media company wants to create subtitles for a large archive of videos. | Use batch transcription to process the video files in bulk, generating accurate subtitles for each video. |
| **Market research** | A market research firm needs to analyze customer feedback from audio recordings. | Employ batch transcription to convert audio feedback into text, enabling easier analysis and insights extraction. |

## Responsible AI 

An AI system includes not only the technology, but also the people who use it, the people who are affected by it, and the environment in which it's deployed. Read the transparency notes to learn about responsible AI use and deployment in your systems. 

* [Transparency note and use cases](/legal/cognitive-services/speech-service/speech-to-text/transparency-note?context=/azure/ai-services/speech-service/context/context)
* [Characteristics and limitations](/legal/cognitive-services/speech-service/speech-to-text/characteristics-and-limitations?context=/azure/ai-services/speech-service/context/context)
* [Integration and responsible use](/legal/cognitive-services/speech-service/speech-to-text/guidance-integration-responsible-use?context=/azure/ai-services/speech-service/context/context)
* [Data, privacy, and security](/legal/cognitive-services/speech-service/speech-to-text/data-privacy-security?context=/azure/ai-services/speech-service/context/context)

## Related content

- [Get started with speech to text](get-started-speech-to-text.md)
- [Create a batch transcription](batch-transcription-create.md)
- For detailed pricing information, visit the [Speech service pricing](https://azure.microsoft.com/pricing/details/cognitive-services/speech-services/) page. 

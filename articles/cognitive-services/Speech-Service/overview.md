---
title: What is the Speech service?
titleSuffix: Azure Cognitive Services
description: The Speech service provides speech-to-text, text-to-speech, and speech translation capabilities with an Azure resource. Add speech to your applications, tools, and devices with the Speech SDK, Speech Studio, or REST APIs.
services: cognitive-services
author: eric-urban
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: overview
ms.date: 03/09/2022
ms.author: eur
---

# What is the Speech service?

The Speech service provides speech-to-text, text-to-speech, and speech translation capabilities with an Azure resource. It's easy to speech enable your applications, tools, and devices with the [Speech CLI](spx-overview.md), [Speech SDK](./speech-sdk.md), [Speech Studio](speech-studio-overview.md), or [REST APIs](#use-speech-in-your-application).

## Speech capabilities

Speech feature summaries are provided below with links for more information.

### Speech-to-text

[Speech-to-text](speech-to-text.md) transcribes or translates audio streams or local files to text in real time that your applications, tools, or devices can consume or display. 

- [Batch speech-to-text](batch-transcription.md): Batch speech-to-text enables asynchronous speech-to-text transcription of large volumes of speech audio data stored in Azure Blob Storage. In addition to converting speech audio to text, batch speech-to-text allows for diarization and sentiment analysis.
- [Create custom speech models](custom-speech-overview.md): If you're using speech-to-text for recognition and transcription in a unique environment, you can create and train custom acoustic, language, and pronunciation models to address ambient noise or industry-specific vocabulary. Custom speech models are private and can offer a competitive advantage.
- [Pronunciation assessment](./how-to-pronunciation-assessment.md): Pronunciation assessment evaluates speech pronunciation and gives speakers feedback on the accuracy and fluency of spoken audio. With pronunciation assessment, language learners can practice, get instant feedback, and improve their pronunciation so that they can speak and present with confidence.
- [Multidevice conversation](multi-device-conversation.md): Connect multiple devices or clients in a conversation to send speech- or text-based messages, with easy support for transcription and translation.
- [Conversation transcription](./conversation-transcription.md): Enables real-time speech recognition, speaker identification, and diarization. It's perfect for transcribing in-person meetings with the ability to distinguish speakers.
- [Intent recognition](./intent-recognition.md): Use speech-to-text with [Language Understanding (LUIS)](../luis/index.yml) to derive user intents from transcribed speech and act on voice commands. 

### Text-to-speech

[Text-to-speech](text-to-speech.md) converts input text into humanlike synthesized speech by using the [Speech Synthesis Markup Language (SSML)](speech-synthesis-markup.md). Use neural voices, which are humanlike voices powered by deep neural networks. 

Besides the pre-built neural voices that come out of the box, you can also create a [custom neural voice](custom-neural-voice.md) that is recognizable and unique to your brand or product. Custom neural voices are private and can offer a competitive advantage.

### Speech translation

[Speech translation](speech-translation.md) enables real-time, multilanguage translation of speech to your applications, tools, and devices. Use this feature for speech-to-speech and speech-to-text translation.

### Language identification

[Language identification](language-identification.md) is used to identify languages spoken in audio when compared against a list of [supported languages](language-support.md). Use language identification by itself, with speech-to-text recognition, or with speech translation.

### Speaker recognition
[Speaker recognition](speaker-recognition-overview.md) provides algorithms that verify and identify speakers by their unique voice characteristics. Speaker recognition is used to answer the question, "Who is speaking?". 

[Voice assistants](voice-assistants.md) using the Speech service empower developers to create natural, humanlike conversational interfaces for their applications and experiences. The voice assistant feature provides fast, reliable interaction between a device and an assistant implementation that uses the Bot Framework's Direct Line Speech channel or the integrated custom commands service for task completion.

## Speech Studio

The [Speech Studio](speech-studio-overview.md) is a set of UI-based tools for building and integrating features from Azure Cognitive Services Speech service in your applications. You create projects in Speech Studio by using a no-code approach, and then reference those assets in your applications by using the [Speech SDK](speech-sdk.md), the [Speech CLI](spx-overview.md), or the REST APIs.

## Delivery and presence

You can deploy Azure Cognitive Services Speech features in the cloud or on-premises. 

With [containers](speech-container-howto.md), you can bring the service closer to your data for compliance, security, or other operational reasons. 

Speech service deployment in sovereign clouds is available for some government entities and their partners. For example, the Azure Government cloud is available to US government entities and their partners. Azure China cloud is available to organizations with a business presence in China. For more information, see [sovereign clouds](sovereign-clouds.md). 

:::image type="content" source="media/overview/speech-delivery-presence.png" alt-text="Diagram showing where Speech service can be deployed and accessed.":::

## Use Speech in your application

The [Speech CLI](spx-overview.md) is a command-line tool for using Speech service without having to write any code. Most features in the Speech SDK are available in the Speech CLI, and some advanced features and customizations are simplified in the Speech CLI. 

The [Speech SDK](./speech-sdk.md) exposes many of the Speech service capabilities you can use to develop speech-enabled applications. The Speech SDK is available in many programming languages and across all platforms.

In some cases, you can't or shouldn't use the [Speech SDK](speech-sdk.md). In those cases, you can use REST APIs to access the Speech service:
- [Conversation transcription REST API](https://signature.centralus.cts.speech.microsoft.com/UI/index.html)
- [Speech-to-text REST API v3.0](rest-speech-to-text.md)
- [Speech-to-text REST API for short audio](rest-speech-to-text-short.md)
- [Text-to-speech REST API](rest-text-to-speech.md)
- [Speaker Recognition REST API](/rest/api/speakerrecognition/)

## Get started

We offer quickstarts in many popular programming languages. Each quickstart is designed to teach you basic design patterns and have you running code in less than 10 minutes. See the following list for the quickstart for each feature:

* [Speech-to-text quickstart](get-started-speech-to-text.md)
* [Text-to-speech quickstart](get-started-text-to-speech.md)
* [Speech translation quickstart](./get-started-speech-translation.md)
* [Intent recognition quickstart](./get-started-intent-recognition.md)
* [Speaker recognition quickstart](./get-started-speaker-recognition.md)

## Code samples

Sample code for the Speech service is available on GitHub. These samples cover common scenarios like reading audio from a file or stream, continuous and single-shot recognition, and working with custom models. Use these links to view SDK and REST samples:

- [Speech-to-text, text-to-speech, and speech translation samples (SDK)](https://github.com/Azure-Samples/cognitive-services-speech-sdk)
- [Batch transcription samples (REST)](https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/samples/batch)
- [Text-to-speech samples (REST)](https://github.com/Azure-Samples/Cognitive-Speech-TTS)
- [Voice assistant samples (SDK)](https://aka.ms/csspeech/samples)

## Next steps

* [Get started with speech-to-text](get-started-speech-to-text.md)
* [Get started with text-to-speech](get-started-text-to-speech.md)

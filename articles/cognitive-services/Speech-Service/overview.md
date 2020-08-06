---
title: What is the Speech service?
titleSuffix: Azure Cognitive Services
description: The Speech service is the unification of speech-to-text, text-to-speech, and speech translation into a single Azure subscription. Add speech to your applications, tools, and devices with the Speech SDK, Speech Devices SDK, or REST APIs.
services: cognitive-services
author: trevorbye
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: overview
ms.date: 06/25/2020
ms.author: trbye
---

# What is the Speech service?

The Speech service is the unification of speech-to-text, text-to-speech, and speech-translation into a single Azure subscription. It's easy to speech enable your applications, tools, and devices with the [Speech SDK](speech-sdk-reference.md), [Speech Devices SDK](https://aka.ms/sdsdk-quickstart), or [REST APIs](rest-apis.md).

> [!IMPORTANT]
> The Speech service has replaced Bing Speech API and Translator Speech. See _How-to guides > Migration_ for migration instructions.

These features make up the Speech service. Use the links in this table to learn more about common use cases for each feature or browse the API reference.

| Service | Feature | Description | SDK | REST |
|---------|---------|-------------|-----|------|
| [Speech-to-Text](speech-to-text.md) | Real-time Speech-to-text | Speech-to-text transcribes or translates audio streams or local files to text in real time that your applications, tools, or devices can consume or display. Use speech-to-text with [Language Understanding (LUIS)](https://docs.microsoft.com/azure/cognitive-services/luis/) to derive user intents from transcribed speech and act on voice commands. | [Yes](https://docs.microsoft.com/azure/cognitive-services/speech-service/speech-sdk-reference) | [Yes](https://docs.microsoft.com/azure/cognitive-services/speech-service/rest-apis) |
| | [Batch Speech-to-Text](batch-transcription.md) | Batch Speech-to-text enables asynchronous speech-to-text transcription of large volumes of speech audio data stored in Azure Blob Storage. In addition to converting speech audio to text, Batch Speech-to-text also allows for diarization and sentiment-analysis. | No | [Yes](https://westus.cris.ai/swagger/ui/index) |
| | [Multi-device Conversation](multi-device-conversation.md) | Connect multiple devices or clients in a conversation to send speech- or text-based messages, with easy support for transcription and translation| Yes | No |
| | [Conversation Transcription](conversation-transcription-service.md) | Enables real-time speech recognition, speaker identification, and diarization. It's perfect for transcribing in-person meetings with the ability to distinguish speakers. | Yes | No |
| | [Create Custom Speech Models](#customize-your-speech-experience) | If you are using speech-to-text for recognition and transcription in a unique environment, you can create and train custom acoustic, language, and pronunciation models to address ambient noise or industry-specific vocabulary. | No | [Yes](https://westus.cris.ai/swagger/ui/index) |
| [Text-to-Speech](text-to-speech.md) | Text-to-speech | Text-to-speech converts input text into human-like synthesized speech using [Speech Synthesis Markup Language (SSML)](speech-synthesis-markup.md). Choose from standard voices and neural voices (see [Language support](language-support.md)). | [Yes](https://docs.microsoft.com/azure/cognitive-services/speech-service/speech-sdk-reference) | [Yes](https://docs.microsoft.com/azure/cognitive-services/speech-service/rest-apis) |
| | [Create Custom Voices](#customize-your-speech-experience) | Create custom voice fonts unique to your brand or product. | No | [Yes](https://docs.microsoft.com/azure/cognitive-services/speech-service/rest-apis) |
| [Speech Translation](speech-translation.md) | Speech translation | Speech translation enables real-time, multi-language translation of speech to your applications, tools, and devices. Use this service for speech-to-speech and speech-to-text translation. | [Yes](https://docs.microsoft.com/azure/cognitive-services/speech-service/speech-sdk-reference) | No |
| [Voice assistants](voice-assistants.md) | Voice assistants | Voice assistants using the Speech service empower developers to create natural, human-like conversational interfaces for their applications and experiences. The voice assistant service provides fast, reliable interaction between a device and an assistant implementation that uses the Bot Framework's Direct Line Speech channel or the integrated Custom Commands (Preview) service for task completion. | [Yes](voice-assistants.md) | No |
| [Speaker Recognition](speaker-recognition-overview.md) | Speaker verification & identification | The Speaker Recognition service provides algorithms that verify and identify speakers by their unique voice characteristics. Speaker Recognition is used to answer the question “who is speaking?”. | Yes | [Yes](https://docs.microsoft.com/rest/api/speakerrecognition/) |


[!INCLUDE [TLS 1.2 enforcement](../../../includes/cognitive-services-tls-announcement.md)]

## Try the Speech service

We offer quickstarts in most popular programming languages, each designed to have you running code in less than 10 minutes. This table contains the most popular quickstarts for each feature. Use the left-hand navigation to explore additional languages and platforms.

| Speech-to-text (SDK) | Text-to-Speech (SDK) | Translation (SDK) |
|----------------------|----------------------|-------------------|
| [Recognize speech from an audio file](quickstarts/speech-to-text-from-file.md) | [Synthesize speech into an audio file](quickstarts/text-to-speech-audio-file.md) | [Translate speech to text](quickstarts/translate-speech-to-text.md) |
| [Recognize speech with a microphone](quickstarts/speech-to-text-from-microphone.md) | [Synthesize speech to a speaker](quickstarts/text-to-speech.md) | [Translate speech to multiple target languages](quickstarts/translate-speech-to-text-multiple-languages.md) |
| [Recognize speech stored in blob storage](quickstarts/from-blob.md) | [Async synthesis for long-form audio](quickstarts/text-to-speech/async-synthesis-long-form-audio.md) | [Translate speech-to-speech](quickstarts/translate-speech-to-speech.md) |

> [!NOTE]
> Speech-to-text and text-to-speech also have REST endpoints and associated quickstarts.

After you've had a chance to use the Speech service, try our tutorials that teach you how to solve various scenarios.

- [Tutorial: Recognize intents from speech with the Speech SDK and LUIS, C#](how-to-recognize-intents-from-speech-csharp.md)
- [Tutorial: Voice enable your bot with the Speech SDK, C#](tutorial-voice-enable-your-bot-speech-sdk.md)
- [Tutorial: Build a Flask app to translate text, analyze sentiment, and synthesize translated text to speech, REST](https://docs.microsoft.com/azure/cognitive-services/translator/tutorial-build-flask-app-translation-synthesis?toc=%2fazure%2fcognitive-services%2fspeech-service%2ftoc.json&bc=%2fazure%2fcognitive-services%2fspeech-service%2fbreadcrumb%2ftoc.json&toc=%2Fen-us%2Fazure%2Fcognitive-services%2Fspeech-service%2Ftoc.json&bc=%2Fen-us%2Fazure%2Fbread%2Ftoc.json)

## Get sample code

Sample code is available on GitHub for the Speech service. These samples cover common scenarios like reading audio from a file or stream, continuous and single-shot recognition, and working with custom models. Use these links to view SDK and REST samples:

- [Speech-to-text, text-to-speech, and speech translation samples (SDK)](https://github.com/Azure-Samples/cognitive-services-speech-sdk)
- [Batch transcription samples (REST)](https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/samples/batch)
- [Text-to-speech samples (REST)](https://github.com/Azure-Samples/Cognitive-Speech-TTS)
- [Voice assistant samples (SDK)](https://aka.ms/csspeech/samples)

## Customize your speech experience

The Speech service works well with built-in models, however, you may want to further customize and tune the experience for your product or environment. Customization options range from acoustic model tuning to unique voice fonts for your brand.

| Speech Service | Platform | Description |
| -------------- | -------- | ----------- |
| Speech-to-Text | [Custom Speech](https://aka.ms/customspeech) | Customize speech recognition models to your needs and available data. Overcome speech recognition barriers such as speaking style, vocabulary and background noise. |
| Text-to-Speech | [Custom Voice](https://aka.ms/customvoice) | Build a recognizable, one-of-a-kind voice for your Text-to-Speech apps with your speaking data available. You can further fine-tune the voice outputs by adjusting a set of voice parameters. |

## Reference docs

- [Speech SDK](speech-sdk-reference.md)
- [Speech Devices SDK](speech-devices-sdk.md)
- [REST API: Speech-to-text](rest-speech-to-text.md)
- [REST API: Text-to-speech](rest-text-to-speech.md)
- [REST API: Batch transcription and customization](https://westus.cris.ai/swagger/ui/index)

## Next steps

> [!div class="nextstepaction"]
> [Get a Speech service subscription key for free](get-started.md)

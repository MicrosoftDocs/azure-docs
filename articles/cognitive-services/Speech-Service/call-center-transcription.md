---
title: Call Center Transcription - Speech Services
titleSuffix: Azure Cognitive Services
description: A common scenario for speech-to-text is transcribing large volumes of telephony data that may come from various systems, such as Interactive Voice Response (IVR). The audio can be stereo or mono, and raw with little-to-no post processing performed on the signal. Using Speech Services and the Unified speech model, a business can get high-quality transcriptions, with many audio capture systems.
services: cognitive-services
author: erhopf
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: overview
ms.date: 05/02/2019
ms.author: erhopf
---

# Speech-to-text for telephony data

Telephony data that is generated through landlines, mobile phones, and radios are typically low quality, and narrowband in the range of 8 KHz, which creates challenges when converting speech-to-text. The latest speech recognition models from Azure Speech Services excel at transcribing this telephony data, even in cases when the data is difficult for a human to understand. These models are trained with large volumes of telephony data, and have best in market recognition accuracy, even in noisy environments.

A common scenario for speech-to-text is transcribing large volumes of telephony data that may come from various systems, such as Interactive Voice Response (IVR). The audio these systems provide can be stereo or mono, and raw with little-to-no post processing performed on the signal. Using Speech Services and the Unified speech model, a business can get high-quality transcriptions, regardless of the systems used to capture audio.

The telephony data can be used to better understand your customers' needs, identify new marketing opportunities, or evaluate the performance of call center agents. After the data is transcribed, a business can use the output for improved telemetry, identifying key phrases, or analyzing customer sentiment.

Let's review core scenarios that highlight the features of Azure Speech Services that can help address this space.

> [!IMPORTANT]
> Speech Services Unified model is trained with diverse data and offers a single model solution to a number of scenario from Dictation to Telephony analytics.

## Batch transcription of call center data

The Batch Transcription API was developed to transcribe large amounts of audio data asynchronously. With regards to transcribing call center data, our solution is based on these pillars:

* **Accuracy**: With fourth-generation Unified models, we offer unsurpassed transcription quality.
* **Latency**: We understand that when doing bulk transcriptions, the transcriptions are needed quickly. The transcription jobs initiated via the [Batch Transcription API]((batch-transcription.md) will be queued immediately, and once the job is executed it's performed faster than real-time transcription.
* **Security**: We understand that calls may contain sensitive data. Rest assured that security is one of our highest priorities. Our service has obtained ISO, SOC, HIPAA, PCI certifications.

Call Centers generate large volumes of audio data on a daily basis. If your business stores telephony data in a central location, such as Azure Storage, you can use the [Batch Transcription API]((batch-transcription.md) to asynchronously request and receive transcriptions.

A typical solution uses these services:

* Azure Speech Services are used to transcribe speech-to-text. A standard subscription (SO) for the Speech Services is required to use the Batch Transcription API. Free subscriptions (F0) will not work.
* [Azure Storage](https://azure.microsoft.com/services/storage/) is used to store telephony data, and the transcripts returned by the Batch Transcription API. This storage account should use notifications, specifically for when new files are added. These notifications are used to trigger the transcription process.
* [Azure Functions](https://docs.microsoft.com/azure/azure-functions/) is used to create the shared access signatures (SAS) URI for each recording, and trigger the HTTP POST request to initiate a transcription. Additionally, Azure Functions is used to create requests to retrieve and delete transcriptions using the Batch Transcription API.
* [WebHooks](webhooks.md) are used to get notifications when transcriptions are completed.

A typical architecture diagram of the implementation of a batch scenario is depicted in the picture below
 ![Call center transcription architecture](media/scenarios/call-center-transcription-architecture.png)

## Real-time transcription for call center data

Some businesses need the ability to transcribe conversations in real time. Real-time transcription can be used to identify key words and trigger searches for content and resources relevant to the conversation, for monitoring sentiment, to improve accessibility, or to provide translations for customers and/or agents who aren't native speakers.

For scenarios that require real-time transcription, we recommend using the [Speech SDK](speech-sdk.md). Currently, speech-to-text is available in [more than 20 languages](language-support.md), and the SDK is available in C++, C#, Java, Python, Node.js, and Javascript. Samples are available in each language on [GitHub](https://github.com/Azure-Samples/cognitive-services-speech-sdk). For the latest news and updates, see [Release notes](releasenotes.md).

## End-to-end solutions

Speech Services can be easily integrated in any solution by using either the [Speech SDK](speech-sdk.md) or the [REST API](rest-apis.md). However, call center transcription may require additional technologies. Typically, a connection between an IVR system and Azure is required. Although we do not offer such components, we would like to describe what a connection to an IVR entails.

Several IVR or telephony service products (such as Genesys or AudioCodes) offer integration capabilities that can be leveraged to enable inbound and outbound audio passthrough to an Azure Service. Basically, a custom Azure service might provide a specific interface to define phone call sessions (such as Call Start or Call End) and expose a WebSocket API to receive inbound stream audio that is used with the Speech Services. Outbound responses, such as conversation transcription or connections with the Bot Framework, can be synthesized with Microsoft's text-to-speech service and returned to the IVR for playback.

Another scenario is Direct SIP integration. An Azure service connects to a SIP Server, thus getting an inbound stream as well as an outbound stream, which are used for the speech-to-text and text-to-speech phases. To connect to a SIP Server there are commercial software offerings, such as Ozieki SDK, or [The Teams calling and meetings API](https://docs.microsoft.com/graph/api/resources/calls-api-overview?view=graph-rest-beta) (currently in beta), that are designed to support this type of scenario for audio calls.

## Customize existing experiences

Azure Speech Services works well with built-in models, however, you may want to further customize and tune the experience for your product or environment. Customization options range from acoustic model tuning to unique voice fonts for your brand. After you've built a custom model, you can use it with any of the Azure Speech Services.

| Speech service | Model | Description |
|----------------|-------|-------------|
| Speech-to-text | [Acoustic model](how-to-customize-acoustic-models.md) | Create a custom acoustic model for applications, tools, or devices that are used in particular environments like in a car or on a factory floor, each with specific recording conditions. Examples include accented speech, specific background noises, or using a specific microphone for recording. |
| | [Language model](how-to-customize-language-model.md) | Create a custom language model to improve transcription of industry-specific vocabulary and grammar, such as medical terminology, or IT jargon. |
| | [Pronunciation model](how-to-customize-pronunciation.md) | With a custom pronunciation model, you can define the phonetic form and display of a word or term. It's useful for handling customized terms, such as product names or acronyms. All you need to get started is a pronunciation file -- a simple .txt file. |
| Text-to-speech | [Voice font](how-to-customize-voice-font.md) | Custom voice fonts allow you to create a recognizable, one-of-a-kind voice for your brand. It only takes a small amount of data to get started. The more data that you provide, the more natural and human-like your voice font will sound. |

## Sample code

Sample code is available on GitHub for each of the Azure Speech Services. These samples cover common scenarios like reading audio from a file or stream, continuous and single-shot recognition, and working with custom models. Use these links to view SDK and REST samples:

* [Speech-to-text and speech translation samples (SDK)](https://github.com/Azure-Samples/cognitive-services-speech-sdk)
* [Batch transcription samples (REST)](https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/samples/batch)
* [Text-to-speech samples (REST)](https://github.com/Azure-Samples/Cognitive-Speech-TTS)

## Reference docs

* [Speech SDK](speech-sdk-reference.md)
* [Speech Devices SDK](speech-devices-sdk.md)
* [REST API: Speech-to-text](rest-speech-to-text.md)
* [REST API: Text-to-speech](rest-text-to-speech.md)
* [REST API: Batch transcription and customization](https://westus.cris.ai/swagger/ui/index)

## Next steps

> [!div class="nextstepaction"]
> [Get a Speech Services subscription key for free](get-started.md)

---
title: Call Center Transcription - Speech service
titleSuffix: Azure Cognitive Services
description: A common scenario for speech-to-text is transcribing large volumes of telephony data that come from various systems, such as interactive voice response (IVR). By using Speech service and the Unified speech model, a business can get high-quality transcriptions with audio capture systems.
services: cognitive-services
author: eric-urban
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 01/23/2022
ms.author: eur
---

# Speech service for telephony data

Telephony data that's generated through landlines, mobile phones, and radios is ordinarily of low quality. This data is also narrowband, in the range of 8 KHz, which can create challenges when you're converting speech to text. 

The latest Speech service speech-recognition models excel at transcribing this telephony data, even when the data is difficult for a human to understand. These models are trained with large volumes of telephony data, and they have best-in-market recognition accuracy, even in noisy environments.

A common scenario for speech-to-text is the transcription of large volumes of telephony data that comes from a variety of systems, such as interactive voice response (IVR). The audio that these systems provide can be stereo or mono, and raw, with little to no post-processing done on the signal. By using Speech service and the Unified speech model, your business can get high-quality transcriptions, whatever systems you use to capture audio.

You can use telephony data to better understand your customers' needs, identify new marketing opportunities, or evaluate the performance of call center agents. After the data is transcribed, your business can use the output for improving telemetry, identifying key phrases, analyzing customer *sentiment*, and other purposes.

The technologies outlined in this article are from Microsoft internally for various support-call processing services, both in real-time and batch mode.

This article discusses some of the technology and related features that Speech service offers.

> [!IMPORTANT]
> The Speech service Unified model is trained with diverse data and offers a single-model solution to many scenarios, from dictation to telephony analytics.

## Azure technology for call centers

Beyond the functional aspect of the Speech service features, their primary purpose, as applied to the call center, is to improve the customer experience in three separate domains:

- Post-call analytics, which is essentially the batch processing of call recordings after the call.
- Real-time analytics, which is the processing of an audio signal to extract various insights as the call is taking place (with sentiment as a prominent use case).
- Voice assistants (bots), which either drive the dialogue between customers and the bot in an attempt to solve their issues, without agent participation, or apply AI protocols to assist the agent.

Here is an architecture diagram showing a typical implementation of a batch scenario:
![Diagram of call center transcription architecture.](media/scenarios/call-center-transcription-architecture.png)

## Components of speech analytics technology

Whether the domain is post-call or real-time, Azure offers a set of mature and emerging technologies to help improve the customer experience.

### Speech-to-text

[Speech-to-text](speech-to-text.md) is the most sought-after feature in any call center solution. Because many of the downstream analytics processes rely on transcribed text, the word error rate (WER) metric is of utmost importance. One of the key challenges in call center transcription is the noise that’s prevalent in the call center (for example, other agents speaking in the background), the rich variety of language locales and dialects, and the low quality of the actual telephone signal. 

WER is highly correlated with how well the acoustic and language models are trained for a specific locale. Therefore, it's important to be able to customize the model to your locale. Our latest Unified version 4.x models are the solution to both transcription accuracy and latency. Because they're trained with tens of thousands of hours of acoustic data and billions of bits of lexical information, Unified models are the most accurate in the market for transcribing call center data.

### Sentiment

In the call center space, the ability to gauge whether customers have had a good experience is one of the most important areas of Speech analytics. The Microsoft [Batch Transcription API](batch-transcription.md) offers sentiment analysis per utterance. You can aggregate the set of values that are obtained as part of a call transcript to determine the sentiment of the call for both your agents and the customer.

### Silence (non-talk)

It's not uncommon for as much as 35 percent of a support call to be what's called *non-talk time*. Some scenarios during which non-talk occurs might include: 
* Agents taking time to look up prior case history with a customer.
* Agents using tools that allow them to access the customer's desktop and perform certain functions.
* Customers waiting on hold for a call transfer. 

It's important to gauge when silence is occurring in a call, because critical customer sensitivities can result from these types of scenarios and where they occur in the call.

### Translation

Some companies are experimenting with providing translated transcripts from foreign-language support calls, so that delivery managers can understand the world-wide experience of their customers. Speech service's [translation](./speech-translation.md) capabilities are excellent, featuring the audio-to-audio or audio-to-text translation for a large number of locales.

### Text-to-speech

[Text-to-speech](text-to-speech.md) is another important technology where bots interact with customers. The typical pathway is that a customer speaks, the voice is transcribed to text, the text is analyzed for intents, a response is synthesized based on the recognized intent, and then an asset is either surfaced to the customer or a synthesized voice response is generated. Because this entire process must occur quickly, low latency is an important component in the success of these systems.

Speech service's end-to-end latency is considerably low for the various technologies involved, such as [speech-to-text](speech-to-text.md), [Language Understanding (LUIS)](https://azure.microsoft.com/services/cognitive-services/language-understanding-intelligent-service/), [Bot Framework](https://dev.botframework.com/), and [text-to-speech](text-to-speech.md).

Our new synthesized voices are also nearly indistinguishable from human voices. You can use them to give your bot its unique personality.

### Search

Another staple of analytics is to identify interactions where a specific event or experience has occurred. You would ordinarily do this with either of two approaches: 
* An ad hoc search, where users simply type a phrase and the system responds.
* A more structured query where an analyst can create a set of logical statements that identify a scenario in a call, and then each call can be indexed against that set of queries. 

A good search example is the ubiquitous compliance statement, "This call will be recorded for quality purposes." Many companies want to make sure that their agents are providing this disclaimer to customers before the call is actually recorded. Most analytics systems have the ability to trend the behaviors found by query or search algorithms, and this reporting of trends is ultimately one of the most important functions of an analytics system. Through the [Cognitive Services directory](https://azure.microsoft.com/services/cognitive-services/directory/search/), your end-to-end solution can be significantly enhanced with indexing and search capabilities.

### Key phrase extraction

This area is one of the more challenging analytics applications, and one that benefits from the application of AI and machine learning. The primary scenario in this case is to infer customer intent. Why is the customer calling? What is the customer's problem? Why did the customer have a negative experience? [Cognitive Service for Language](https://azure.microsoft.com/services/cognitive-services/text-analytics/) provides a set of analytics out of the box for quickly upgrading your end-to-end solution for extracting those important keywords or phrases.

The next sections cover batch processing and the real-time pipelines for speech recognition in a bit more detail.

## Batch transcription of call center data

To transcribe audio in bulk, Microsoft developed the [Batch Transcription API](batch-transcription.md), which transcribes large amounts of audio data asynchronously. For transcribing call center data specifically, this solution is based on three pillars:

- **Accuracy**: By applying fourth-generation Unified models, we offer high-quality transcription.
- **Latency**: Bulk transcriptions must be performed quickly. The transcription jobs that are initiated via the [Batch Transcription API](batch-transcription.md) are queued immediately, and when the job starts running, it's performed faster than real-time transcription.
- **Security**: We understand that calls might contain sensitive data, so security is our highest priority. To this end, our service has obtained (ISO), SOC, HIPAA, and PCI certifications.

Call centers generate large volumes of audio data on a daily basis. If your business stores telephony data in a central location, such as an Azure storage account, you can use the [Batch Transcription API](batch-transcription.md) to asynchronously request and receive transcriptions.

A typical solution uses these products and services:

- **Speech service**: For transcribing speech-to-text. A standard subscription for Speech service is required to use the Batch Transcription API. Free subscriptions will not work.
- **[Azure storage account](https://azure.microsoft.com/services/storage/)**: For storing telephony data and the transcripts that are returned by the Batch Transcription API. This storage account should use notifications, specifically for when new files are added. These notifications are used to trigger the transcription process.
- **[Azure Functions](../../azure-functions/index.yml)**: For creating the shared access signature (SAS) URI for each recording, and triggering the HTTP POST request to start a transcription. Additionally, you use Azure Functions to create requests to retrieve and delete transcriptions by using the Batch Transcription API.

Internally, Microsoft uses these technologies to support Microsoft customer calls in batch mode, as shown in the following diagram:

:::image type="content" source="media/scenarios/call-center-batch-pipeline.png" alt-text="Diagram showing the technologies that are used to support Microsoft customer calls in batch mode.":::

## Real-time transcription for call center data

Some businesses are required to transcribe conversations in real time. You can use real-time transcription to identify keywords and trigger searches for content and resources that are relevant to the conversation, to monitor sentiment, to improve accessibility, or to provide translations for customers and agents who aren't native speakers.

For scenarios that require real-time transcription, we recommend using the [Speech SDK](speech-sdk.md). Currently, speech-to-text is available in [more than 20 languages](language-support.md), and the SDK is available in C++, C#, Java, Python, JavaScript, Objective-C, and Go. Samples are available in each language on [GitHub](https://github.com/Azure-Samples/cognitive-services-speech-sdk). For the latest news and updates, see [Release notes](releasenotes.md).

Internally, Microsoft uses the previously mentioned technologies to analyze Microsoft customer calls in real time, as shown in the following diagram:

![Diagram showing the technologies that are used to support Microsoft customer calls in real time.](media/scenarios/call-center-reatime-pipeline.png)

## About interactive voice responses

You can easily integrate Speech service into any solution by using either the [Speech SDK](speech-sdk.md) or the [REST API](https://signature.centralus.cts.speech.microsoft.com/UI/index.html). However, call center transcription might require additional technologies. Ordinarily, a connection between an IVR system and Azure is required. Although we don't offer such components, the next paragraph describes what a connection to an IVR entails.

Several IVR or telephony service products (such as Genesys or AudioCodes) offer integration capabilities that can be applied to enable an inbound and outbound audio pass-through to an Azure service. Basically, a custom Azure service might provide a specific interface to define phone call sessions (such as Call Start or Call End) and expose a WebSocket API to receive inbound stream audio that's used with Speech service. Outbound responses, such as a conversation transcription or connections with the Bot Framework, can be synthesized with the Microsoft text-to-speech service and returned to the IVR for playback.

Another scenario is direct integration with the Session Initiation Protocol (SIP). An Azure service connects to a SIP server to get an inbound and outbound stream, which is used for the speech-to-text and text-to-speech phases. To connect to a SIP server there are commercial software offerings, such as Ozeki SDK, or the [Microsoft Graph Communications API](/graph/api/resources/communications-api-overview), that are designed to support this type of scenario for audio calls.

## Customize existing experiences

The Speech service works well with built-in models. However, you might want to further customize and tune the experience for your product or environment. Customization options range from acoustic model tuning to unique voice fonts for your brand. After you've built a custom model, you can use it with any of the Speech service features in real-time or batch mode.

| Speech feature | Model | Description |
| -------------- | ----- | ----------- |
| Speech-to-text | [Acoustic model](./how-to-custom-speech-train-model.md) | Create a custom acoustic model for applications, tools, or devices that are used in particular environments, such as in a car or on a factory floor, each with its own recording conditions. Examples include accented speech, background noises, or using a specific microphone for recording. |
|                | [Language model](./how-to-custom-speech-train-model.md) | Create a custom language model to improve transcription of industry-specific vocabulary and grammar, such as medical terminology or IT jargon. |
|                | [Pronunciation model](./how-to-custom-speech-train-model.md) | With a custom pronunciation model, you can define the phonetic form and display for a word or term. It's useful for handling customized terms, such as product names or acronyms. All you need to get started is a pronunciation file, which is a simple .txt file. |
| Text-to-speech | [Voice font](./how-to-custom-voice-create-voice.md) | with custom voice fonts, you can create a recognizable, one-of-a-kind voice for your brand. It takes only a small amount of data to get started. The more data you provide, the more natural and human-like your voice font will sound. |

## Sample code

Sample code is available on GitHub for each of the Speech service features. These samples cover common scenarios, such as reading audio from a file or stream, continuous and single-shot recognition, and working with custom models. To view SDK and REST samples, see:

- [Speech-to-text and speech translation samples (SDK)](https://github.com/Azure-Samples/cognitive-services-speech-sdk)
- [Batch transcription samples (REST)](https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/samples/batch)
- [Text-to-speech samples (REST)](https://github.com/Azure-Samples/Cognitive-Speech-TTS)

## Reference docs

- [Speech SDK](./speech-sdk.md)
- [REST API: Speech-to-text](rest-speech-to-text.md)
- [REST API: Text-to-speech](rest-text-to-speech.md)
- [REST API: Batch transcription and customization](https://westus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0)

## Next steps

> [!div class="nextstepaction"]
> [Learn about batch transcription](./batch-transcription.md)

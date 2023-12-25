---
title: Azure AI services for Call Center Overview
titleSuffix: Azure AI services
description: Azure AI services for Language and Speech can help you realize partial or full automation of telephony-based customer interactions, and provide accessibility across multiple channels.
author: goergenj
ms.author: jagoerge
ms.service: azure-ai-speech
ms.topic: overview
ms.date: 09/18/2022
---

# Call Center Overview

Azure AI services for Language and Speech can help you realize partial or full automation of telephony-based customer interactions, and provide accessibility across multiple channels. With the Language and Speech services, you can further analyze call center transcriptions, extract and redact conversation personally identifiable information (PII), summarize the transcription, and detect the sentiment.

Some example scenarios for the implementation of Azure AI services in call and contact centers are:
- Virtual agents: Conversational AI-based telephony-integrated voicebots and voice-enabled chatbots
- Agent-assist: Real-time transcription and analysis of a call to improve the customer experience by providing insights and suggest actions to agents
- Post-call analytics: Post-call analysis to create insights into customer conversations to improve understanding and support continuous improvement of call handling, optimization of quality assurance and compliance control as well as other insight driven optimizations.

> [!TIP]
> Try the [Language Studio](https://language.cognitive.azure.com) or [Speech Studio](https://aka.ms/speechstudio/callcenter) for a demonstration on how to use the Language and Speech services to analyze call center conversations. 
> 
> To deploy a call center transcription solution to Azure with a no-code approach, try the [Ingestion Client](./ingestion-client.md).

## Azure AI services features for call centers

A holistic call center implementation typically incorporates technologies from the Language and Speech services. 

Audio data typically used in call centers generated through landlines, mobile phones, and radios is often narrowband, in the range of 8 KHz, which can create challenges when you're converting speech to text. The Speech service recognition models are trained to ensure that you can get high-quality transcriptions, however you choose to capture the audio.

Once you've transcribed your audio with the Speech service, you can use the Language service to perform analytics on your call center data such as: sentiment analysis, summarizing the reason for customer calls, how they were resolved, extracting and redacting conversation PII, and more.

### Speech service

The Speech service offers the following features that can be used for call center use cases:

- [Real-time speech to text](./how-to-recognize-speech.md): Recognize and transcribe audio in real-time from multiple inputs. For example, with virtual agents or agent-assist, you can continuously recognize audio input and control how to process results based on multiple events.
- [Batch speech to text](./batch-transcription.md): Transcribe large amounts of audio files asynchronously including speaker diarization and is typically used in post-call analytics scenarios. Diarization is the process of recognizing and separating speakers in mono channel audio data.
- [Text to speech](./text-to-speech.md): Text to speech enables your applications, tools, or devices to convert text into humanlike synthesized speech.
- [Speaker identification](./speaker-recognition-overview.md): Helps you determine an unknown speaker’s identity within a group of enrolled speakers and is typically used for call center customer verification scenarios or fraud detection.
- [Language Identification](./language-identification.md): Identify languages spoken in audio and can be used in real-time and post-call analysis for insights or to control the environment (such as output language of a virtual agent).

The Speech service works well with prebuilt models. However, you might want to further customize and tune the experience for your product or environment. Typical examples for Speech customization include:

| Speech customization | Description |
| -------------- | ----------- |
| [Custom Speech](./custom-speech-overview.md) | A speech to text feature used evaluate and improve the speech recognition accuracy of use-case specific entities (such as alpha-numeric customer, case, and contract IDs, license plates, and names). You can also train a custom model with your own product names and industry terminology. |
| [Custom neural voice](./custom-neural-voice.md) | A text to speech feature that lets you create a one-of-a-kind, customized, synthetic voice for your applications. |

### Language service

The Language service offers the following features that can be used for call center use cases:

- [Personally Identifiable Information (PII) extraction and redaction](../language-service/personally-identifiable-information/how-to-call-for-conversations.md): Identify, categorize, and redact sensitive information in conversation transcription.
- [Conversation summarization](../language-service/summarization/overview.md?tabs=conversation-summarization): Summarize in abstract text what each conversation participant said about the issues and resolutions. For example, a call center can group product issues that have a high volume.
- [Sentiment analysis and opinion mining](../language-service/sentiment-opinion-mining/overview.md): Analyze transcriptions and associate positive, neutral, or negative sentiment at the utterance and conversation-level.

While the Language service works well with prebuilt models, you might want to further customize and tune models to extract more information from your data. Typical examples for Language customization include:

| Language customization | Description |
| -------------- | ----------- |
| [Custom NER (named entity recognition)](../language-service/custom-named-entity-recognition/overview.md) | Improve the detection and extraction of entities in transcriptions. |
| [Custom text classification](../language-service/custom-text-classification/overview.md) | Classify and label transcribed utterances with either single or multiple classifications. |

You can find an overview of all Language service features and customization options [here](../language-service/overview.md#available-features).

## Next steps

* [Post-call transcription and analytics quickstart](./call-center-quickstart.md)
* [Try out the Language Studio](https://language.cognitive.azure.com)
* [Try out the Speech Studio](https://aka.ms/speechstudio/callcenter)

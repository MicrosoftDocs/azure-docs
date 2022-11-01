---
title: Azure Cognitive Services for Call Center Overview
titleSuffix: Azure Cognitive Services
description: Azure Cognitive Services for Language and Speech can help you realize partial or full automation of telephony-based customer interactions, and provide accessibility across multiple channels.
services: cognitive-services
author: goergenj
ms.author: jagoerge
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 08/10/2022
---

# Call Center Overview

Azure Cognitive Services for Language and Speech can help you realize partial or full automation of telephony-based customer interactions, and provide accessibility across multiple channels. With the Language and Speech services, you can further analyze call center transcriptions, extract and redact conversation personally identifiable information (PII), summarize the transcription, and detect the sentiment.

Some example scenarios for the implementation of Azure Cognitive Services in call and contact centers are:
- Virtual agents: Conversational AI-based telephony-integrated voicebots and voice-enabled chatbots
- Agent-assist: Real-time transcription and analysis of a call to improve the customer experience by providing insights and suggest actions to agents
- Post-call analytics: Post-call analysis to create insights into customer conversations to improve understanding and support continuous improvement of call handling, optimization of quality assurance and compliance control as well as other insight driven optimizations.

> [!TIP]
> To deploy a call center transcription solution to Azure with a no-code approach, try the [Ingestion Client](/azure/cognitive-services/speech-service/ingestion-client).

## Cognitive Services features for call centers

A holistic call center implementation typically incorporates technologies from the Language and Speech services. 

Audio data typically used in call centers generated through landlines, mobile phones, and radios is often narrowband, in the range of 8 KHz, which can create challenges when you're converting speech to text. The Speech service recognition models are trained to ensure that you can get high-quality transcriptions, however you choose to capture the audio.

Once you've transcribed your audio with the Speech service, you can use the Language service to perform analytics on your call center data such as: sentiment analysis, summarizing the reason for customer calls, how they were resolved, extracting and redacting conversation PII, and more.

### Speech service

The Speech service offers the following features that can be used for call center use cases:

- [Real-time speech-to-text](/azure/cognitive-services/speech-service/how-to-recognize-speech): Recognize and transcribe audio in real-time from multiple inputs. For example, with virtual agents or agent-assist, you can continuously recognize audio input and control how to process results based on multiple events.
- [Batch speech-to-text](/azure/cognitive-services/speech-service/batch-transcription): Transcribe large amounts of audio files asynchronously including speaker diarization and is typically used in post-call analytics scenarios. Diarization is the process of recognizing and separating speakers in mono channel audio data.
- [Text-to-speech](/azure/cognitive-services/speech-service/text-to-speech): Text-to-speech enables your applications, tools, or devices to convert text into humanlike synthesized speech.
- [Speaker identification](/azure/cognitive-services/speech-service/speaker-recognition-overview): Helps you determine an unknown speaker’s identity within a group of enrolled speakers and is typically used for call center customer verification scenarios or fraud detection.
- [Language Identification](/azure/cognitive-services/speech-service/language-identification): Identify languages spoken in audio and can be used in real-time and post-call analysis for insights or to control the environment (such as output language of a virtual agent).

The Speech service works well with prebuilt models. However, you might want to further customize and tune the experience for your product or environment. Typical examples for Speech customization include:

| Speech customization | Description |
| -------------- | ----------- |
| [Custom Speech](/azure/cognitive-services/speech-service/custom-speech-overview) | A speech-to-text feature used evaluate and improve the speech recognition accuracy of use-case specific entities (such as alpha-numeric customer, case, and contract IDs, license plates, and names). You can also train a custom model with your own product names and industry terminology. |
| [Custom Neural Voice](/azure/cognitive-services/speech-service/custom-neural-voice) | A text-to-speech feature that lets you create a one-of-a-kind, customized, synthetic voice for your applications. |

### Language service

The Language service offers the following features that can be used for call center use cases:

- [Personally Identifiable Information (PII) extraction and redaction](/azure/cognitive-services/language-service/personally-identifiable-information/how-to-call-for-conversations): Identify, categorize, and redact sensitive information in conversation transcription.
- [Conversation summarization](/azure/cognitive-services/language-service/summarization/overview?tabs=conversation-summarization): Summarize in abstract text what each conversation participant said about the issues and resolutions. For example, a call center can group product issues that have a high volume.
- [Sentiment analysis and opinion mining](/azure/cognitive-services/language-service/sentiment-opinion-mining/overview): Analyze transcriptions and associate positive, neutral, or negative sentiment at the utterance and conversation-level.

While the Language service works well with prebuilt models, you might want to further customize and tune models to extract more information from your data. Typical examples for Language customization include:

| Language customization | Description |
| -------------- | ----------- |
| [Custom NER (named entity recognition)](/azure/cognitive-services/language-service/custom-named-entity-recognition/overview) | Improve the detection and extraction of entities in transcriptions. |
| [Custom text classification](/azure/cognitive-services/language-service/custom-text-classification/overview) | Classify and label transcribed utterances with either single or multiple classifications. |

You can find an overview of all Language service features and customization options [here](/azure/cognitive-services/language-service/overview#available-features).

## Next steps

* [Try out the Language Studio](https://language.cognitive.azure.com)
* [Explore the Language service features](/azure/cognitive-services/language-service/overview#available-features)
* [Try out the Speech Studio](https://speech.microsoft.com)
* [Explore the Speech service features](/azure/cognitive-services/speech-service/overview)

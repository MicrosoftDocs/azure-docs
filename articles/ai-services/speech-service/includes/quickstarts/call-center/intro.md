---
author: eric-urban
ms.service: cognitive-services
ms.topic: include
ms.date: 09/29/2022
ms.author: eur
---

In this C# quickstart, you perform sentiment analysis and conversation summarization of [call center](../../../call-center-overview.md) transcriptions. The sample will automatically identify, categorize, and redact sensitive information. The quickstart implements a cross-service scenario that uses features of the [Azure Cognitive Speech](../../../index.yml) and [Azure Cognitive Language](../../../../language-service/index.yml) services.

> [!TIP]
> Try the [Language Studio](https://language.cognitive.azure.com) or [Speech Studio](https://aka.ms/speechstudio/callcenter) for a demonstration on how to use the Language and Speech services to analyze call center conversations. 
> 
> To deploy a call center transcription solution to Azure with a no-code approach, try the [Ingestion Client](../../../ingestion-client.md).

The following Azure AI services for Speech features are used in the quickstart:
- [Batch transcription](../../../batch-transcription.md): Submit a batch of audio files for transcription.
- [Speaker separation](../../../batch-transcription.md): Separate multiple speakers through diarization of mono 16khz 16 bit PCM wav files. 

The Language service offers the following features that are used:

- [Personally Identifiable Information (PII) extraction and redaction](../../../../language-service/personally-identifiable-information/how-to-call-for-conversations.md): Identify, categorize, and redact sensitive information in conversation transcription.
- [Conversation summarization](../../../../language-service/summarization/overview.md?tabs=conversation-summarization): Summarize in abstract text what each conversation participant said about the issues and resolutions. For example, a call center can group product issues that have a high volume.
- [Sentiment analysis and opinion mining](../../../../language-service/sentiment-opinion-mining/overview.md): Analyze transcriptions and associate positive, neutral, or negative sentiment at the utterance and conversation-level.

---
author: eric-urban
ms.service: cognitive-services
ms.topic: include
ms.date: 09/29/2022
ms.author: eur
---

In this C# quickstart, you perform sentiment analysis and conversation summarization of [call center](/azure/cognitive-services/speech-service/call-center-overview) transcriptions. The sample will automatically identify, categorize, and redact sensitive information. The quickstart implements a cross-service scenario that uses features of the [Azure Cognitive Speech](/azure/cognitive-services/speech-service/) and [Azure Cognitive Language](/azure/cognitive-services/language-service/) services.

> [!TIP]
> To deploy a call center transcription solution to Azure with a no-code approach, try the [Ingestion Client](/azure/cognitive-services/speech-service/ingestion-client).

The following Azure Cognitive Services for Speech features are used:
- [Batch transcription](/azure/cognitive-services/speech-service/batch-transcription): Submit a batch of audio files for transcription.
- [Speaker separation](/azure/cognitive-services/speech-service/batch-transcription): Separate multiple speakers through diarization of mono 16khz 16 bit PCM wav files. 

The Language service offers the following features that are used in the quickstart:

- [Personally Identifiable Information (PII) extraction and redaction](/azure/cognitive-services/language-service/personally-identifiable-information/how-to-call-for-conversations): Identify, categorize, and redact sensitive information in conversation transcription.
- [Conversation summarization](/azure/cognitive-services/language-service/summarization/overview?tabs=conversation-summarization): Summarize in abstract text what each conversation participant said about the issues and resolutions. For example, a call center can group product issues that have a high volume.
- [Sentiment analysis and opinion mining](/azure/cognitive-services/language-service/sentiment-opinion-mining/overview): Analyze transcriptions and associate positive, neutral, or negative sentiment at the utterance and conversation-level.

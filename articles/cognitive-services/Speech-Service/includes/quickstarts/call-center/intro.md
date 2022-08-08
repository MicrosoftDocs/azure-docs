---
author: eric-urban
ms.service: cognitive-services
ms.topic: include
ms.date: 08/02/2022
ms.author: eur
---

In this quickstart, you perform sentiment analysis and conversation summarization of call center transcriptions.

The following Azure Cognitive Service for Speech features are used:
- [Batch transcription](/azure/cognitive-services/speech-service/batch-transcription): Submit a batch of audio files for transcription.
- [Speaker separation](/azure/cognitive-services/speech-service/batch-transcription): Separate multiple speakers through diarization of mono 16khz 16 bit PCM wav files. 

The following Azure Cognitive Service for Language features are used:
- [Personally Identifiable Information (PII) detection](/azure/cognitive-services/language-service/personally-identifiable-information/overview): Identify, categorize, and redact sensitive information in unstructured text.
- [Sentiment analysis and opinion mining](/azure/cognitive-services/language-service/sentiment-opinion-mining/overview): Analyze and associate positive or negative sentiment with specific aspects of the transcriptions.
- [Conversation summarization](/azure/cognitive-services/language-service/summarization/overview?tabs=conversation-summarization): Summarize what each conversation participant said about the predefined issues and resolutions.

> [!TIP]
> To deploy a call center transcription solution to Azure with a no-code approach, try the [Ingestion Client](/azure/cognitive-services/speech-service/ingestion-client).
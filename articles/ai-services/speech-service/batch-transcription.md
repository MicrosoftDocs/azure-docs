---
title: Batch transcription overview - Speech service
titleSuffix: Azure AI services
description: Batch transcription is ideal if you want to transcribe a large quantity of audio in storage, such as Azure blobs. Then you can asynchronously retrieve transcriptions.
services: cognitive-services
manager: nitinme
author: eric-urban
ms.author: eur
ms.service: azure-ai-speech
ms.topic: overview
ms.date: 09/15/2023
ms.devlang: csharp
ms.custom: devx-track-csharp
---

# What is batch transcription?

> [!IMPORTANT]
> New pricing is in effect for batch transcription via [Speech to text REST API v3.2](./migrate-v3-1-to-v3-2.md). For more information, see the [pricing guide](https://azure.microsoft.com/pricing/details/cognitive-services/speech-services). 

Batch transcription is used to transcribe a large amount of audio data in storage. Both the [Speech to text REST API](rest-speech-to-text.md#transcriptions) and [Speech CLI](spx-basics.md) support batch transcription. 

You should provide multiple files per request or point to an Azure Blob Storage container with the audio files to transcribe. The batch transcription service can handle a large number of submitted transcriptions. The service transcribes the files concurrently, which reduces the turnaround time.

## How does it work?

With batch transcriptions, you submit the audio data, and then retrieve transcription results asynchronously. The service transcribes the audio data and stores the results in a storage container. You can then retrieve the results from the storage container.

> [!TIP]
> For a low or no-code solution, you can use the [Batch Speech to text Connector](/connectors/cognitiveservicesspe/) in Power Platform applications such as Power Automate, Power Apps, and Logic Apps. See the [Power automate batch transcription](power-automate-batch-transcription.md) guide to get started.

To use the batch transcription REST API:

1. [Locate audio files for batch transcription](batch-transcription-audio-data.md) - You can upload your own data or use existing audio files via public URI or [shared access signature (SAS)](../../storage/common/storage-sas-overview.md) URI. 
1. [Create a batch transcription](batch-transcription-create.md) - Submit the transcription job with parameters such as the audio files, the transcription language, and the transcription model.
1. [Get batch transcription results](batch-transcription-get.md) - Check transcription status and retrieve transcription results asynchronously. 

> [!IMPORTANT]
> Batch transcription jobs are scheduled on a best-effort basis. At pick hours it may take up to 30 minutes or longer for a transcription job to start processing. See how to check the current status of a batch transcription job in [this section](batch-transcription-get.md#get-transcription-status).

## Next steps

- [Locate audio files for batch transcription](batch-transcription-audio-data.md)
- [Create a batch transcription](batch-transcription-create.md)
- [Get batch transcription results](batch-transcription-get.md)
- [See batch transcription code samples at GitHub](https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/samples/batch/)

---
title: Ingestion Client - Speech service
titleSuffix: Azure Cognitive Services
description: In this article we describe a tool released on GitHub that enables customers push audio files to Speech Service easily and quickly 
services: cognitive-services
author: eric-urban
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 08/29/2022
ms.author: eur
---

# Ingestion Client with Azure Cognitive Services

The Ingestion Client is a tool released by Microsoft on [GitHub](/azure/cognitive-services/speech-service/ingestion-client) that helps you quickly deploy a call center transcription solution to Azure with a no-code approach. 

> [!TIP]
> You can use the tool and resulting solution in production to process a high volume of audio.

Ingestion Client uses the [Azure Cognitive Service for Language](/azure/cognitive-services/language-service/), [Azure Cognitive Service for Speech](/azure/cognitive-services/speech-service/), [Azure storage](https://azure.microsoft.com/product-categories/storage/), and [Azure Functions](https://azure.microsoft.com/services/functions/). 

## Get started with the Ingestion Client

An Azure Account and an Azure Cognitive Services resource are needed to run the Ingestion Client.
* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services)
* <a href="https://portal.azure.com/#create/Microsoft.CognitiveServicesAllInOne"  title="Create a Cognitive Services resource"  target="_blank">Create a Cognitive Services resource</a> in the Azure portal.
* Get the resource key and region. After your Cognitive Services resource is deployed, select **Go to resource** to view and manage keys. For more information about Cognitive Services resources, see [Get the keys for your resource](~/articles/cognitive-services/cognitive-services-apis-create-account.md#get-the-keys-for-your-resource). 

See the [Getting Started Guide for the Ingestion Client](https://github.com/Azure-Samples/cognitive-services-speech-sdk/blob/master/samples/ingestion/ingestion-client/Setup/guide.md) on GitHub to learn how to setup and use the tool.

## Ingestion Client Features

The Ingestion Client works by connecting a dedicated [Azure storage](https://azure.microsoft.com/product-categories/storage/) account to custom [Azure Functions](https://azure.microsoft.com/services/functions/) in a serverless fashion to pass transcription requests to the service. The transcribed audio files land in the dedicated [Azure Storage container](https://azure.microsoft.com/product-categories/storage/). 

> [!IMPORTANT]
> Pricing varies depending on the mode of operation (batch vs real time) as well as the Azure Function SKU selected. By default the tool will create a Premium Azure Function SKU to handle large volume. Visit the [Pricing](https://azure.microsoft.com/pricing/details/functions/) page for more information.

Internally, the tool uses Speech and Language services, and follows best practices to handle scale-up, retries and failover. The following schematic describes the resources and connections.

:::image type="content" source="media/ingestion-client/architecture-1.png" alt-text="Diagram that shows the Ingestion Client Architecture.":::

The following Speech service features are used by the Ingestion Client:

- [Batch speech-to-text](/azure/cognitive-services/speech-service/batch-transcription): Transcribe large amounts of audio files asynchronously including speaker diarization and is typically used in post-call analytics scenarios. Diarization is the process of recognizing and separating speakers in mono channel audio data.
- [Speaker identification](/azure/cognitive-services/speech-service/speaker-recognition-overview): Helps you determine an unknown speaker’s identity within a group of enrolled speakers and is typically used for call center customer verification scenarios or fraud detection.

Language service features used by the Ingestion Client:

- [Personally Identifiable Information (PII) extraction and redaction](/azure/cognitive-services/language-service/personally-identifiable-information/how-to-call-for-conversations): Identify, categorize, and redact sensitive information in conversation transcription.
- [Sentiment analysis and opinion mining](/azure/cognitive-services/language-service/sentiment-opinion-mining/overview): Analyze transcriptions and associate positive, neutral, or negative sentiment at the utterance and conversation-level.

Besides Cognitive Services, these Azure products are used to complete the solution:

- [Azure storage](https://azure.microsoft.com/product-categories/storage/): For storing telephony data and the transcripts that are returned by the Batch Transcription API. This storage account should use notifications, specifically for when new files are added. These notifications are used to trigger the transcription process.
- [Azure Functions](https://azure.microsoft.com/services/functions/): For creating the shared access signature (SAS) URI for each recording, and triggering the HTTP POST request to start a transcription. Additionally, you use Azure Functions to create requests to retrieve and delete transcriptions by using the Batch Transcription API.

## Tool customization

The tool is built to show customers results quickly. You can customize the tool to your preferred SKUs and setup. The SKUs can be edited from the [Azure portal](https://portal.azure.com) and [the code itself is available on GitHub](https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/samples/batch).

> [!NOTE]
> We suggest creating the resources in the same dedicated resource group to understand and track costs more easily.

## Next steps

* [Learn more about Cognitive Services features for call center](/azure/cognitive-services/speech-service/call-center-overview)
* [Explore the Language service features](/azure/cognitive-services/language-service/overview#available-features)
* [Explore the Speech service features](/azure/cognitive-services/speech-service/overview)

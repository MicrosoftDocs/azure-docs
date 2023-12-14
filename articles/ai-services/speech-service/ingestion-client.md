---
title: Ingestion Client - Speech service
titleSuffix: Azure AI services
description: In this article we describe a tool released on GitHub that enables customers push audio files to Speech service easily and quickly 
#services: cognitive-services
author: eric-urban
manager: nitinme
ms.service: azure-ai-speech
ms.topic: conceptual
ms.date: 08/29/2022
ms.author: eur
---

# Ingestion Client with Azure AI services

The Ingestion Client is a tool released by Microsoft on GitHub that helps you quickly deploy a call center transcription solution to Azure with a no-code approach. 

> [!TIP]
> You can use the tool and resulting solution in production to process a high volume of audio.

Ingestion Client uses the [Azure AI Language](../language-service/index.yml), [Azure AI Speech](./index.yml), [Azure storage](https://azure.microsoft.com/product-categories/storage/), and [Azure Functions](https://azure.microsoft.com/services/functions/). 

## Get started with the Ingestion Client

An Azure account and a multi-service Azure AI services resource are needed to run the Ingestion Client.
* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services)
* <a href="https://portal.azure.com/#create/Microsoft.CognitiveServicesAllInOne"  title="Create an Azure AI services resource"  target="_blank">Create an Azure AI services resource</a> in the Azure portal.
* Get the resource key and region. After your resource is deployed, select **Go to resource** to view and manage keys. For more information about Azure AI services resources, see [Get the keys for your resource](~/articles/ai-services/multi-service-resource.md?pivots=azportal#get-the-keys-for-your-resource). 

See the [Getting Started Guide for the Ingestion Client](https://github.com/Azure-Samples/cognitive-services-speech-sdk/blob/master/samples/ingestion/ingestion-client/Setup/guide.md) on GitHub to learn how to setup and use the tool.

## Ingestion Client Features

The Ingestion Client works by connecting a dedicated [Azure storage](https://azure.microsoft.com/product-categories/storage/) account to custom [Azure Functions](https://azure.microsoft.com/services/functions/) in a serverless fashion to pass transcription requests to the service. The transcribed audio files land in the dedicated [Azure Storage container](https://azure.microsoft.com/product-categories/storage/). 

> [!IMPORTANT]
> Pricing varies depending on the mode of operation (batch vs real-time) as well as the Azure Function SKU selected. By default the tool will create a Premium Azure Function SKU to handle large volume. Visit the [Pricing](https://azure.microsoft.com/pricing/details/functions/) page for more information.

Internally, the tool uses Speech and Language services, and follows best practices to handle scale-up, retries and failover. The following schematic describes the resources and connections.

:::image type="content" source="media/ingestion-client/architecture-1.png" alt-text="Diagram that shows the Ingestion Client Architecture.":::

The following Speech service feature is used by the Ingestion Client:

- [Batch speech to text](./batch-transcription.md): Transcribe large amounts of audio files asynchronously including speaker diarization and is typically used in post-call analytics scenarios. Diarization is the process of recognizing and separating speakers in mono channel audio data.

Here are some Language service features that are used by the Ingestion Client:

- [Personally Identifiable Information (PII) extraction and redaction](../language-service/personally-identifiable-information/how-to-call-for-conversations.md): Identify, categorize, and redact sensitive information in conversation transcription.
- [Sentiment analysis and opinion mining](../language-service/sentiment-opinion-mining/overview.md): Analyze transcriptions and associate positive, neutral, or negative sentiment at the utterance and conversation-level.

Besides Azure AI services, these Azure products are used to complete the solution:

- [Azure storage](https://azure.microsoft.com/product-categories/storage/): For storing telephony data and the transcripts that are returned by the Batch Transcription API. This storage account should use notifications, specifically for when new files are added. These notifications are used to trigger the transcription process.
- [Azure Functions](https://azure.microsoft.com/services/functions/): For creating the shared access signature (SAS) URI for each recording, and triggering the HTTP POST request to start a transcription. Additionally, you use Azure Functions to create requests to retrieve and delete transcriptions by using the Batch Transcription API.

## Tool customization

The tool is built to show customers results quickly. You can customize the tool to your preferred SKUs and setup. The SKUs can be edited from the [Azure portal](https://portal.azure.com) and [the code itself is available on GitHub](https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/samples/batch).

> [!NOTE]
> We suggest creating the resources in the same dedicated resource group to understand and track costs more easily.

## Next steps

* [Learn more about Azure AI services features for call center](./call-center-overview.md)
* [Explore the Language service features](../language-service/overview.md#available-features)
* [Explore the Speech service features](./overview.md)

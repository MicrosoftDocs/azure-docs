---
title: Ingestion Client - Speech service
titleSuffix: Azure Cognitive Services
description: In this article we describe a tool released on GitHub that enables customers push audio files to Speech Service easily and quickly 
services: cognitive-services
author: panosperiorellis, HenryvanderVegte
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 06/17/2021
ms.author: panosper
ms.custom: seodec18
---

# Ingestion Client for the Speech service

The Ingestion Client is a tool released on [GitHub](https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/samples/batch) that enables customers to transcribe audio files through Speech Services quickly without -or very little- development effort. It works by wiring up a dedicated [Azure storage](https://azure.microsoft.com/en-us/product-categories/storage/) account to custom [Azure Functions](https://azure.microsoft.com/en-gb/services/functions/) that use either the [REST API](rest-speech-to-text.md) or the [SDK](speech-sdk.md) in a serverless fashion to raise transcription requests to the service.  

## Architecture

The tool is targeting those customers that want to get an idea of the quality of the transcript without making any development investments up front. The tool creates a few resources and wires together to transcribe audio files landing in the dedicated [Azure Storage container](https://azure.microsoft.com/en-us/product-categories/storage/).

Under the hood, the tool is using our V3.0 Batch API or SDK (a choice made by the customer) and in addition, implements best practices relating to handling scale up, retries and failover. The following schematic describes the resources created and the basic wiring.

:::image type="content" source="media/ingestion-client/architecture.png" alt-text="Ingestion Client Architecture.":::

The tool is accompanied by a comprehensive [guide](https://github.com/Azure-Samples/cognitive-services-speech-sdk/blob/master/samples/batch/batch-ingestion-client/Setup/guide.md) that describes how to setup the tool and get it going within minutes.

> [!IMPORTANT]
> Pricing varies depending on the mode of operation (batch vs real time) as well as the Azure Function SKU selected. By default the tool will create a Premium Azure Function SKU to handle large volume. Please visit the [Pricing](https://azure.microsoft.com/en-gb/pricing/details/functions/) page for additional information.

Both, the Microsoft Speech SDK and the REST API, can be used to obtain transcripts. The decision does impact overall costs as it is explained in the guide. 

> [!TIP]
> You can indeed use the tool and resulting solution in production to process high volume of audio.

## Tool Customization

The tool is built to offer convenience to customers that want to get results quickly. You can however customize the tool to your prefered SKUs and set up. The SKUs can be edited from the [Azure Portal](https://portal.azure.com) and the code itself is available on [GitHub](https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/samples/batch).

> [!NOTE]
> We suggest creating the resources in the same dedicated resource group to better control costs.

## Next steps

* [Get your Speech service trial subscription](https://azure.microsoft.com/try/cognitive-services/)
* [Learn more about Speech SDK](~/articles/cognitive-services/Speech-Service/speech-sdk.md)
* [Learn about our SPX tool](~/articles/cognitive-services/Speech-Service/spx-overview.md)

---
title: Ingestion Client - Speech service
titleSuffix: Azure Cognitive Services
description: In this article we describe a tool released on GitHub that enables customers push audio files to Speech Service easily and quickly 
services: cognitive-services
author: panosperiorellis
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 06/17/2021
ms.author: panosper
ms.custom: seodec18
---

# Ingestion Client for the Speech service

The Ingestion Client is a tool released on [GitHub](https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/samples/ingestion) that enables customers to transcribe audio files through Speech services quickly with little or no development effort. It works by wiring up a dedicated [Azure storage](https://azure.microsoft.com/product-categories/storage/) account to custom [Azure Functions](https://azure.microsoft.com/services/functions/) that use either the [REST API](rest-speech-to-text.md) or the [SDK](speech-sdk.md) in a serverless fashion to pass transcription requests to the service.  

## Architecture

The tool helps those customers that want to get an idea of the quality of the transcript without making development investments up front. The tool connects a few resources to transcribe audio files that land in the dedicated [Azure Storage container](https://azure.microsoft.com/product-categories/storage/).

Internally, the tool uses our V3.0 Batch API or SDK, and follows best practices to handle scale-up, retries and failover. The following schematic describes the resources and connections.

:::image type="content" source="media/ingestion-client/architecture-1.png" alt-text="Ingestion Client Architecture.":::

The [Getting Started Guide for the Ingestion Client](https://github.com/Azure-Samples/cognitive-services-speech-sdk/blob/master/samples/ingestion/ingestion-client/Setup/guide.md) describes how to setup and use the tool.

> [!IMPORTANT]
> Pricing varies depending on the mode of operation (batch vs real time) as well as the Azure Function SKU selected. By default the tool will create a Premium Azure Function SKU to handle large volume. Visit the [Pricing](https://azure.microsoft.com/pricing/details/functions/) page for more information.

Both, the Microsoft [Speech SDK](speech-sdk.md) and the [Speech-to-text REST API v3.0](rest-speech-to-text.md#speech-to-text-rest-api-v30), can be used to obtain transcripts. The decision does impact overall costs as it is explained in the guide. 

> [!TIP]
> You can use the tool and resulting solution in production to process a high volume of audio.

## Tool customization

The tool is built to show customers results quickly. You can customize the tool to your preferred SKUs and setup. The SKUs can be edited from the [Azure portal](https://portal.azure.com) and [the code itself is available on GitHub](https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/samples/batch).

> [!NOTE]
> We suggest creating the resources in the same dedicated resource group to understand and track costs more easily.

## Next steps

* [Get your Speech service trial subscription](https://azure.microsoft.com/try/cognitive-services/)
* [Learn more about Speech SDK](./speech-sdk.md)
* [Learn about the Speech CLI tool](./spx-overview.md)

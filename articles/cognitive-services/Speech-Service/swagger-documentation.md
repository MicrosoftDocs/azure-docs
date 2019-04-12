---
title: Swagger documentation - Speech Services 
titleSuffix: Azure Cognitive Services
description: The Swagger documentation can be used to auto-generate SDks for a number of programming languages. All operations in our service are supported by Swagger
services: cognitive-services
author: panosper
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: overview
ms.date: 04/12/2019
ms.author: erhopf
---

# Swagger documentation

The Speech Services offer a Swagger specification to interact with a handful of REST APIs used to import data, create models, test model accuracy, create custom endpoints, queue up batch transcriptions, and manage subscriptions. Most operations available through the Custom Speech portal can be completed programmatically using these APIs. 

> [!NOTE]
> Both Speech-to-Text and Text-to-Speech operations are supported available as REST APIs, which are in turn documented in the Swagger specification.

## Generating code from the Swagger specification

The [Swager specification](https://cris.ai/swagger/ui/index) has options that allow you to quickly test for various path. However, sometimes it's desirable to generate code fo all paths, creating a single library of calls that you can base future solutions on. Let's take a look at the process to generate a Python library.

You'll need to set Swagger to the same region as your Speech Service subscription. You can confirm your region in the Azure portal under your Speech Services resource. For a complete list of supported regions, see [Regions](regions.md).

1. Go to https://editor.swagger.io
2. Click **File**, then click **Import**
3. Enter the swagger URL including the region for your Speech Services subscription `https://<your-region>.cris.ai/docs/v2.0/swagger`
4. Click **Generate Client** and select Python
5. Save the client library

You can use the Python library that you generated with the Batch Transcription sample on GitHub. Samples, including Batch Transcription, can be explored in our [samples](https://aka.ms/csspeech/samples) repository. 

## Reference docs

* [REST (Swagger): Batch transcription and customization](https://westus.cris.ai/swagger/ui/index)
* [REST API: Speech-to-text](rest-speech-to-text.md)
* [REST API: Text-to-speech](rest-text-to-speech.md)

## Next steps

* [Explore C# samples on GitHub](https://aka.ms/csspeech/samples)
* [Get a Speech Services subscription key for free](get-started.md)

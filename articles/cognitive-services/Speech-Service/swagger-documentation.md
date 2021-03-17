---
title: Swagger documentation - Speech service
titleSuffix: Azure Cognitive Services
description: The Swagger documentation can be used to auto-generate SDKs for a number of programming languages. All operations in our service are supported by Swagger
services: cognitive-services
author: alexeyo26
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: reference
ms.date: 02/16/2021
ms.author: alexeyo
---

# Swagger documentation

Speech service offers a Swagger specification to interact with a handful of REST APIs used to import data, create models, test model accuracy, create custom endpoints, queue up batch transcriptions, and manage subscriptions. Most operations available through [the Custom Speech area of the Speech Studio](https://aka.ms/customspeech) can be completed programmatically using these APIs.

> [!NOTE]
> Speech service has several REST APIs for [Speech-to-text](rest-speech-to-text.md) and [Text-to-speech](rest-text-to-speech.md).  
>
> However only [Speech-to-text REST API v3.0](rest-speech-to-text.md#speech-to-text-rest-api-v30) and v2.0 are documented in the Swagger specification. See the documents referenced in the previous paragraph for the information on all other Speech Services REST APIs.

## Generating code from the Swagger specification

The [Swagger specification](https://westus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0) has options that allow you to quickly test for various paths. However, sometimes it's desirable to generate code for all paths, creating a single library of calls that you can base future solutions on. Let's take a look at the process to generate a Python library.

You'll need to set Swagger to the region of your Speech resource. You can confirm the region in the **Overview** part of your Speech resource settings in Azure portal. The complete list of supported regions is available [here](regions.md#speech-to-text).

1. In a browser, go to the Swagger specification for your [region](regions.md#speech-to-text):  
       `https://<your-region>.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0`
1. On that page, click **API definition**, and click **Swagger**. Copy the URL of the page that appears.
1. In a new browser, go to [https://editor.swagger.io](https://editor.swagger.io)
1. Click **File**, click **Import URL**, paste the URL, and click **OK**.
1. Click **Generate Client** and select **python**. The client library downloads to your computer in a `.zip` file.
1. Extract everything from the download. You might use `tar -xf` to extract everything.
1. Install the extracted module into your Python environment:  
      `pip install path/to/package/python-client`
1. The installed package is named `swagger_client`. Check that the installation has worked:  
       `python -c "import swagger_client"`

You can use the Python library that you generated with the [Speech service samples on GitHub](https://aka.ms/csspeech/samples).

## Reference documents

* [Swagger: Speech-to-text REST API v3.0](https://westus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0)
* [Speech-to-text REST API](rest-speech-to-text.md)
* [Text-to-speech REST API](rest-text-to-speech.md)

## Next steps

* [Speech service samples on GitHub](https://aka.ms/csspeech/samples).
* [Get a Speech service subscription key for free](overview.md#try-the-speech-service-for-free)

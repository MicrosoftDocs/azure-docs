---
title: Generate a REST API client library - Speech service
titleSuffix: Azure AI services
description: The Swagger documentation can be used to auto-generate SDKs for many programming languages. 
author: eric-urban
ms.author: eur
manager: nitinme
ms.service: azure-ai-speech
ms.topic: how-to
ms.date: 4/15/2024
---

# Generate a REST API client library for the Speech to text REST API

The Speech service offers a Swagger specification to interact with a handful of REST APIs used to import data, create models, test model accuracy, create custom endpoints, queue up batch transcriptions, and manage subscriptions. Most operations available through the [custom speech area of the Speech Studio](https://aka.ms/speechstudio/customspeech) can be completed programmatically using these APIs.

> [!NOTE]
> Speech service has several REST APIs for [Speech to text](rest-speech-to-text.md) and [Text to speech](rest-text-to-speech.md).  
>
> However only the [speech to text REST API](rest-speech-to-text.md) and [custom voice REST API](/rest/api/speech/) are documented in the Swagger specification. See the documents referenced in the previous paragraph for the information on all other Speech service REST APIs.

## Generating code from the Swagger specification

The [Swagger specification](https://github.com/Azure/azure-rest-api-specs/blob/master/specification/cognitiveservices/data-plane/Speech/SpeechToText/stable/v3.1/speechtotext.json) has options that allow you to quickly test for various paths. However, sometimes it's desirable to generate code for all paths, creating a single library of calls that you can base future solutions on. Let's take a look at the process to generate a Python library for the Speech to text REST API version 3.1.

You need to set Swagger to the region of your Speech resource. You can confirm the region in the **Overview** part of your Speech resource settings in Azure portal. The complete list of supported regions is available [here](regions.md#speech-service).

1. In a browser, go to [https://editor.swagger.io](https://editor.swagger.io)
1. Select **File**, select **Import URL**, 
1. Enter the URL `https://github.com/Azure/azure-rest-api-specs/blob/master/specification/cognitiveservices/data-plane/Speech/SpeechToText/stable/v3.1/speechtotext.json` and select **OK**.
1. Select **Generate Client** and select **python**. The client library downloads to your computer in a `.zip` file.
1. Extract everything from the download. You might use `tar -xf` to extract everything.
1. Install the extracted module into your Python environment:  
      `pip install path/to/package/python-client`
1. The installed package is named `swagger_client`. Check that the installation succeeded:  
       `python -c "import swagger_client"`

You can use the Python library that you generated with the [Speech service samples on GitHub](https://aka.ms/csspeech/samples).

## Next steps

* [Speech service samples on GitHub](https://aka.ms/csspeech/samples).
* [Speech to text REST API](rest-speech-to-text.md)

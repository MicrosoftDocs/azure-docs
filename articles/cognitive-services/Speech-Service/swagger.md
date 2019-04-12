---
title: What are the Azure Speech Services?
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

# Swagger Documentation
 
Swagger documentation is a specification of the Speech REST Apis. It helps users build solutions that use our REST APIs quickly and effortlessly. All operations that can be typically carried out through our [portal](https://cris.ai) can also be done programmatically. Our swagger documents describe the details of those operations which include:

* Data Imports
* Model Creation
* Accuracy Tests
* Endpoints creation
* Subscription management

In addition all the management operations related to the above operations are also supported including deleting any of the assets created. 

> [!NOTE]
> Both Speech-to-Text and Text-to-Speech operations are supported by REST APIs which are in turn documented in our Swagger docs.

## Generating Code from Swgger docs

Although the [Swager documents](https://cris.ai/swagger/ui/index) contain options to quickly test the various paths, it is sometimes desirable to generate code for all the paths, creating a library of calls that future solutions can be based on.

Let us look into how such a library can be created for Python.

You will need to swagger reference for the region for which you created the 'Speech' resource in the portal. If not sure please check the list of [regions](regions.md). Then follow the steps:

1. Go to https://editor.swagger.io
2. Click on 'File' and then Import
3. Enter the swagger URL 'https://<region>.cris.ai/docs/v2.0/swagger'
4. Click on 'Generate Client' and select the language you want
5. Save the client library.

The generated python library is used is a sample to demonstrate our Batch Transcription API.

All samples including the aforementioned can be explored in our [samples](https://aka.ms/csspeech/samples) repository. 

## Reference docs

* [Speech Swagger](https://cris.ai/swagger/ui/index)
* [REST API: Speech-to-text](rest-speech-to-text.md)
* [REST API: Text-to-speech](rest-text-to-speech.md)
* [REST API: Batch transcription and customization](https://westus.cris.ai/swagger/ui/index)

## Next steps

> [!div class="nextstepaction"]
> [Explore C# samples on GitHub](https://aka.ms/csspeech/samples)

> [!div class="nextstepaction"]
> [Get a Speech Services subscription key for free](get-started.md)
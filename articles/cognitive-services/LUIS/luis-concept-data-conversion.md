---
title: Data conversion concepts in LUIS - Language Understanding
titleSuffix: Azure Cognitive Services
description: Learn how utterances can be changed before predictions in Language Understanding (LUIS)
services: cognitive-services
author: diberry
manager: cgronlun

ms.service: cognitive-services
ms.component: language-understanding
ms.topic: article
ms.date: 09/10/2018
ms.author: diberry
---

# Data conversion concepts in LUIS
LUIS uses Cognitive Services Speech service to convert utterances from spoken utterances to text utterances before prediction. 

## Speech to intent conversion concepts
Conversion of speech to text in LUIS allows you to send spoken utterances to an endpoint and receive a LUIS prediction response. The process is an integration of the [Speech](https://docs.microsoft.com/azure/cognitive-services/Speech) service with LUIS. 

### Key requirements
You do not need to create a **Bing Speech API** key for this integration. A **Language Understanding** key created in the Azure portal works for this integration. Do not use the LUIS starter key, it will not work for this integration.

### New endpoint 
This integration creates a new endpoint and [pricing](luis-boundaries.md#key-limits) model. The endpoint, via the [Speech SDK](https://github.com/Azure-Samples/cognitive-services-speech-sdk), is able to receive both spoken and text utterances allowing you to use it as a single endpoint. 

### Quota usage
See [Key limits](luis-boundaries.md#key-limits) for information. 

### Data retention
The data sent to the endpoint, via the Speech SDK, regardless if it is speech or text, is only used to enhance your speech model. It is not used beyond your model to enhance either Speech or LUIS in a general capacity. When the LUIS app is deleted, the retained data is also deleted.

<!-- TBD: Machine translation conversion concepts -->

## Next steps

> [!div class="nextstepaction"]
> [Use speech to text](luis-tutorial-speech-to-intent.md)


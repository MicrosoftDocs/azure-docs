---
title: Understand data conversion concepts in LUIS - Azure | Microsoft Docs
description: Learn how utterances can be changed before predictions in Language Understanding (LUIS)
services: cognitive-services
author: v-geberr
manager: kaiqb

ms.service: cognitive-services
ms.technology: luis
ms.topic: article
ms.date: 05/8/2018
ms.author: v-geberr;
---

# Data conversion concepts in LUIS
LUIS provides a way to convert utterances from spoken utterances to text utterances before prediction. 

## Speech to intent conversion concepts
Conversion of speech to text in LUIS allows you to send spoken utterances to an endpoint and receive a LUIS prediction response. The process is a coordination of the [Speech](https://docs.microsoft.com/azure/cognitive-services/Speech) service with LUIS. 

### New Speech-to-intent key
In order to make the integration between Speech and LUIS easy for the user, a new Azure key is available: **Speech-to-intent**. This key combines Speech and LUIS, providing a new endpoint and pricing model. The endpoint is able to receive both spoken and text utterances allowing you to use it as a single endpoint. 

### Quota usage
The new key pricing combines usage quota for both Speech and LUIS at $5 per one thousand utterances. If you send a text utterance to the new endpoint, you are only charged for the LUIS portion at $1. 

### Data retention
The data sent to the endpoint, regardless if it is speech or text, is only used to enhance your speech model. It is not used beyond your model to enhance either Speech or LUIS in a general capacity. When the LUIS app is deleted, the retained data is also deleted.

<!-- TBD: Machine translation conversion concepts -->

## Next steps

> [!div class="nextstepaction"]
> [Correct spelling mistakes with this tutorial](luis-tutorial-bing-spellcheck.md)

[LUIS]:luis-reference-regions.md
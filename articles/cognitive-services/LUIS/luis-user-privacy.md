---
title: Export & delete data
titleSuffix: Azure Cognitive Services 
description: Delete customer data to ensure privacy and compliance. 
services: cognitive-services
author: diberry
manager: nitinme
ms.custom: seodec18
ms.service: cognitive-services
ms.subservice: language-understanding
ms.topic: conceptual
ms.date: 04/02/2019
ms.author: diberry
---

# Export and delete your customer data in Language Understanding (LUIS) in Cognitive Services

Delete customer data to ensure privacy and compliance. 

## Summary of customer data request features​
Language Understanding Intelligent Service (LUIS) preserves customer content to operate the service, but the LUIS user has full control over viewing, exporting, and deleting their data. This can be done through the LUIS web [portal](luis-reference-regions.md) or the [LUIS Authoring (also known as Programmatic) APIs](https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5890b47c39e2bb052c5b9c2f).

[!INCLUDE [GDPR-related guidance](../../../includes/gdpr-intro-sentence.md)]

Customer content is stored encrypted in Microsoft regional Azure storage and includes:

- User account content collected at registration
- Training data required to build the models
- Logged user queries used by [active learning](luis-concept-review-endpoint-utterances.md) to help improve the model
  - Users can turn off query logging by appending `&log=false` to the request, details [here](troubleshooting.md#how-can-i-disable-the-logging-of-utterances)

## Deleting customer data
LUIS users have full control to delete any user content, either through the LUIS web portal or the LUIS Authoring (also known as Programmatic) APIs. The following table displays links assisting with both:

| | **User Account** | **Application** | **Example Utterance(s)** | **End-user queries** |
| --- | --- | --- | --- | --- |
| **Portal** | [Link](luis-concept-data-storage.md#delete-an-account) | [Link](luis-how-to-start-new-app.md#delete-app) | [Link](luis-concept-data-storage.md#utterances-in-an-intent) | [Active learning utterances](luis-how-to-review-endpoint-utterances.md#disable-active-learning)<br>[Logged Utterances](luis-concept-data-storage.md#disable-logging-utterances) |
| **APIs** | [Link](https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5890b47c39e2bb052c5b9c4c) | [Link](https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5890b47c39e2bb052c5b9c39) | [Link](https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5890b47c39e2bb052c5b9c0b) | [Link](https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/58b6f32139e2bb139ce823c9) |


## Exporting customer data
LUIS users have full control to view the data on the portal, however it must be exported through the LUIS Authoring (also known as Programmatic) APIs. The following table displays links assisting with data exports via the LUIS Authoring (also known as Programmatic) APIs:

| | **User Account** | **Application** | **Utterance(s)** | **End-user queries** |
| --- | --- | --- | --- | --- |
| **APIs** | [Link](https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5890b47c39e2bb052c5b9c48) | [Link](https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5890b47c39e2bb052c5b9c40) | [Link](https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5890b47c39e2bb052c5b9c0a) | [Link](https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5890b47c39e2bb052c5b9c36) |

## Location of active learning

To enable [active learning](luis-how-to-review-endpoint-utterances.md#enable-active-learning), users' logged utterances, received at the published LUIS endpoints, are stored in the following Azure geographies:

* [Europe](#europe)
* [Australia](#australia)
* [United States](#united-states)

With the exception of active learning data (detailed below), LUIS follows the [data storage practices for regional services](https://azuredatacentermap.azurewebsites.net/). 

### Europe

The [eu.luis.ai](https://eu.luis.ai) portal and Europe Authoring (also known as Programmatic APIs ) are hosted in Azure's Europe geography. The eu.luis.ai portal and Europe Authoring (also known as Programmatic APIs)  support deployment of endpoints to the following Azure geographies:

* Europe
* France
* United Kingdom

When deploying to these Azure geographies, the utterances received by the endpoint from end users of your app will be stored in Azure's Europe geography for active learning. You can disable active learning, see [Disable active learning](luis-how-to-review-endpoint-utterances.md#disable-active-learning). To manage stored utterances, see [Delete utterance](luis-how-to-review-endpoint-utterances.md#delete-utterance). 

### Australia

The [au.luis.ai](https://au.luis.ai) portal and Australia Authoring (also known as Programmatic APIs) are hosted in Azure's Australia geography. The au.luis.ai portal and Australia Authoring (also known as Programmatic  APIs) support deployment of endpoints to the following Azure geographies:

* Australia

When deploying to these Azure geographies, the utterances received by the endpoint from end users of your app will be stored in Azure's Australia geography for active learning. You can disable active learning, see [Disable active learning](luis-how-to-review-endpoint-utterances.md#disable-active-learning). To manage stored utterances, see [Delete utterance](luis-how-to-review-endpoint-utterances.md#delete-utterance). 

### United States

The [luis.ai](https://www.luis.ai) portal and United States Authoring (also known as Programmatic APIs) are hosted in Azure's United States geography. The luis.ai portal and United States Authoring (also known as Programmatic APIs) support deployment of endpoints to the following Azure geographies:

* Azure geographies not supported by the Europe or Australia authoring regions

When deploying to these Azure geographies, the utterances received by the endpoint from end users of your app will be stored in Azure's United States geography for active learning. You can disable active learning, see [Disable active learning](luis-how-to-review-endpoint-utterances.md#disable-active-learning). To manage stored utterances, see [Delete utterance](luis-how-to-review-endpoint-utterances.md#delete-utterance). 


## Next steps

> [!div class="nextstepaction"]
> [LUIS regions reference](./luis-reference-regions.md)

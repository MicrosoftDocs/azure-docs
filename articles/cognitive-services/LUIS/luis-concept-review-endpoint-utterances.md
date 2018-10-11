---
title: Review endpoint utterances to use active learning in Language Understanding (LUIS)
titleSuffix: Azure Cognitive Services
description: Active learning is one of three strategies to improve prediction accuracy and the easiest to implement. With active learning, your review endpoint utterances for correct intent and entity. LUIS chooses endpoint utterances it is unsure of.
services: cognitive-services
author: diberry
manager: cgronlun

ms.service: cognitive-services
ms.component: language-understanding
ms.topic: article
ms.date: 10/07/2018
ms.author: diberry
---
# Enable active learning by reviewing endpoint utterances
Active learning is one of three strategies to improve prediction accuracy and the easiest to implement. With active learning, your review endpoint utterances for correct intent and entity. LUIS chooses endpoint utterances it is unsure of.

## What is active learning
Active learning is a two-step process. First, LUIS selects utterances it receives at the app's endpoint that need validation. The second step is performed by the app owner or collaborator to validate the selected utterances for [review](luis-how-to-review-endoint-utt.md), including the correct intent and any entities within the intent. After reviewing the utterances, train and publish the app again. 

## Which utterances are on the review list
LUIS adds utterances to the review list when the top firing intent has a low score or the top two intents' scores are too close. 

## Single pool for utterances per app
The **Review endpoint utterances** list doesn't change based on the version. There is a single pool of utterances to review, regardless of which version the utterance you are actively editing or which version of the app was published at the endpoint. 

## Where are the utterances from
Endpoint utterances are taken from end-user queries on the application’s HTTP endpoint. If your app is not published or has not received hits yet, you do not have any utterances to review. If no endpoint hits are received for a specific intent or entity, you do not have utterances to review that contain them. 

## Schedule review periodically
Reviewing suggested utterances doesn't need to be done every day but should be part of your regular maintenance of LUIS. 

## Delete review items programmatically
Use the **[delete unlabelled utterances](https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/58b6f32139e2bb139ce823c9)** API. Back up these utterances before deletion by **[exporting the log files](https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5890b47c39e2bb052c5b9c36)**.

## Next steps

* Learn how to [review](luis-how-to-review-endoint-utt.md) endpoint utterances

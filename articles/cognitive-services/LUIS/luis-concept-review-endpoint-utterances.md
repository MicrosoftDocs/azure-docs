---
title: Review user utterance - LUIS
description:  With active learning, your review endpoint utterances for correct intent and entity. LUIS chooses endpoint utterances it is unsure of.
ms.topic: conceptual
ms.date: 04/01/2020
---
# Concepts for enabling active learning by reviewing endpoint utterances
Active learning is one of three strategies to improve prediction accuracy and the easiest to implement. With active learning, your review endpoint utterances for correct intent and entity. LUIS chooses endpoint utterances it is unsure of.

## What is active learning
Active learning is a two-step process. First, LUIS selects utterances it receives at the app's endpoint that need validation. The second step is performed by the app owner or collaborator to validate the selected utterances for [review](luis-how-to-review-endpoint-utterances.md), including the correct intent and any entities within the intent. After reviewing the utterances, train and publish the app again.

## Which utterances are on the review list
LUIS adds utterances to the review list when the top firing intent has a low score or the top two intents' scores are too close.

## Single pool for utterances per app
The **Review endpoint utterances** list doesn't change based on the version. There is a single pool of utterances to review, regardless of which version the utterance you are actively editing or which version of the app was published at the endpoint.

In the [REST API](https://westus.dev.cognitive.microsoft.com/docs/services/luis-programmatic-apis-v3-0-preview/operations/58b6f32139e2bb139ce823c9), the version name is required and has to exist in the application but isn't used beyond that validation. The review utterances apply to an entire application. If you remove utterances from one _version_, all versions are affected.

## Where are the utterances from
Endpoint utterances are taken from end-user queries on the application's HTTP endpoint. If your app is not published or has not received hits yet, you do not have any utterances to review. If no endpoint hits are received for a specific intent or entity, you do not have utterances to review that contain them.

## Schedule review periodically
Reviewing suggested utterances doesn't need to be done every day but should be part of your regular maintenance of LUIS.

## Delete review items programmatically
Use the **[delete unlabeled utterances](https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/58b6f32139e2bb139ce823c9)** API. Back up these utterances before deletion by **[exporting the log files](https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5890b47c39e2bb052c5b9c36)**.

## Enable active learning

To enable active learning, you must log user queries. This is accomplished by calling the [endpoint query](luis-get-started-create-app.md#query-the-v3-api-prediction-endpoint) with the `log=true` querystring parameter and value.

## Next steps

* Learn how to [review](luis-how-to-review-endpoint-utterances.md) endpoint utterances

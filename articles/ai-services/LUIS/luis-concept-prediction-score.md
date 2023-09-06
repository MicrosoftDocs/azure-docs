---
title: Prediction scores - LUIS
description: A prediction score indicates the degree of confidence the LUIS API service has for prediction results, based on a user utterance.
ms.service: cognitive-services
ms.subservice: language-understanding
ms.author: aahi
author: aahill
manager: nitinme
ms.topic: conceptual
ms.date: 04/14/2020
---

# Prediction scores indicate prediction accuracy for intent and entities

[!INCLUDE [deprecation notice](./includes/deprecation-notice.md)]


A prediction score indicates the degree of confidence LUIS has for prediction results of a user utterance.

A prediction score is between zero (0) and one (1). An example of a highly confident LUIS score is 0.99. An example of a score of low confidence is 0.01.

|Score value|Confidence|
|--|--|
|1|definite match|
|0.99|high confidence|
|0.01|low confidence|
|0|definite failure to match|

## Top-scoring intent

Every utterance prediction returns a top-scoring intent. This prediction is a numerical comparison of prediction scores.

## Proximity of scores to each other

The top 2 scores can have a very small difference between them. LUIS doesn't indicate this proximity other than returning the top score.

## Return prediction score for all intents

A test or endpoint result can include all intents. This configuration is set on the endpoint using the correct querystring name/value pair.

|Prediction API|Querystring name|
|--|--|
|V3|`show-all-intents=true`|
|V2|`verbose=true`|

## Review intents with similar scores

Reviewing the score for all intents is a good way to verify that not only is the correct intent identified, but that the next identified intent's score is significantly and consistently lower for utterances.

If multiple intents have close prediction scores, based on the context of an utterance, LUIS may switch between the intents. To fix this situation, continue to add utterances to each intent with a wider variety of contextual differences or you can have the client application, such as a chat bot, make programmatic choices about how to handle the 2 top intents.

The 2 intents, which are too-closely scored, may invert due to **non-deterministic training**. The top score could become the second top and the second top score could become the first top score. In order to prevent this situation, add example utterances to each of the top two intents for that utterance with word choice and context that differentiates the 2 intents. The two intents should have about the same number of example utterances. A rule of thumb for separation to prevent inversion due to training, is a 15% difference in scores.

You can turn off the **non-deterministic training** by [training with all data](how-to/train-test.md).

## Differences with predictions between different training sessions

When you train the same model in a different app, and the scores are not the same, this difference is because there is **non-deterministic training** (an element of randomness). Secondly, any overlap of an utterance to more than one intent means the top intent for the same utterance can change based on training.

If your chat bot requires a specific LUIS score to indicate confidence in an intent, you should use the score difference between the top two intents. This situation provides flexibility for variations in training.

You can turn off the **non-deterministic training** by [training with all data](how-to/train-test.md).

## E (exponent) notation

Prediction scores can use exponent notation, _appearing_ above the 0-1 range, such as `9.910309E-07`. This score is an indication of a very **small** number.

|E notation score |Actual score|
|--|--|
|9.910309E-07|.0000009910309|

<a name="punctuation"></a>

## Application settings

Use [application settings](luis-reference-application-settings.md) to control how diacritics and punctuation impact prediction scores.

## Next steps

See [Add entities](how-to/entities.md) to learn more about how to add entities to your LUIS app.

---
#services: cognitive-services
author: jboback
manager: nitinme
ms.service: azure-ai-language
ms.topic: include
ms.date: 12/19/2023
ms.author: jboback
---

## Balance training data

When it comes to training data, try to keep your schema well balanced. Including large quantities of one intent and very few of another results in a model that's biased toward particular intents.

To address this scenario, you might need to downsample your training set. Or you might need to add to it. To downsample, you can:

* Get rid of a certain percentage of the training data randomly.
* Analyze the dataset and remove overrepresented duplicate entries, which is a more systematic manner.

To add to the training set, in Language Studio, on the **Data labeling** tab, select **Suggest utterances**. Conversational Language Understanding sends a call to [Azure OpenAI](../../../openai/overview.md) to generate similar utterances.

:::image type="content" source="../media/suggest-utterances.png" alt-text="Screenshot that shows an utterance suggestion in Language Studio." lightbox="../media/suggest-utterances.png":::

You should also look for unintended "patterns" in the training set. For example, look to see if the training set for a particular intent is all lowercase or starts with a particular phrase. In such cases, the model you train might learn these unintended biases in the training set instead of being able to generalize.

We recommend that you introduce casing and punctuation diversity in the training set. If your model is expected to handle variations, be sure to have a training set that also reflects that diversity. For example, include some utterances in proper casing and some in all lowercase.
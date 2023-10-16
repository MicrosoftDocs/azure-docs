---
services: cognitive-services
author: aahill
manager: nitinme
ms.service: azure-ai-language
ms.topic: include
ms.date: 08/30/2023
ms.author: aahi
---

## Balance training data

You should try to keep your schema well balanced when it comes to training data. Including large quantities of one intent, and very few of another will result in a model that is heavily biased towards particular intents.

To address this, you can you may need to downsample your training set, or add to it. Downsampling can be done either by:
* Getting rid of a certain percentage of the training data randomly. 
* In a more systematic manner by analyzing the dataset, and removing overrepresented duplicate entries.

You can also add to the training set by selecting **Suggest Utterances** in **Data labeling** tab in Language studio. Conversational Language Understanding will send a call to [Azure OpenAI](../../../openai/overview.md) to generate similar utterances. 


:::image type="content" source="../media/suggest-utterances.png" alt-text="A screenshot showing utterance suggestion in Language Studio." lightbox="../media/suggest-utterances.png":::

You should also look for unintended "patterns" in the training set. For example, if the training set for a particular intent is all lowercase, or starts with a particular phrase. In such cases, the model you train might learn these unintended biases in the training set instead of being able to generalize.

We recommend introducing casing and punctuation diversity in the training set. If your model is expected to handle variations, be sure to have a training set that also reflects that diversity. For example, include some utterances in proper casing, and some in all lowercase.


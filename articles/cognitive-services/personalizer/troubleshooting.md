---
title: Troubleshooting - Personalizer
titleSuffix: Azure Cognitive Services
description: Troubleshooting questions about Personalizer can be found in this article.
author: diberry
manager: nitinme
services: cognitive-services
ms.service: cognitive-services
ms.subservice: personalizer
ms.topic: conceptual
ms.date: 06/15/2019
ms.author: diberry
---
# Personalizer Troubleshooting

This article contains answers to frequently asked troubleshooting questions about Personalizer.

## Personalizer loop

### The Personalizer loop doesn't seem to learn at all. How do I fix this?

Symptoms of the Personalizer loop not learning effectively may include:
* The Rank API call response includes the same exact number as the probability of each action

This is caused by Personalizer using a "blank" model. This happens just after you create a loop, and the probabilities will stay the same until you:
1) Send a few hundred calls to Rank and Reward to provide some training data
2) An amount of time has gone by since then that is larger than the Model Update Frequency setting.

The default Model Update Frequency is 5 minutes, so unless you've changed that setting you'll only see an improved model become active after at least 6.

### The Personalizer loop doesn't seem to learn well and hits a "cieling" of effectiveness. How do I fix this?

Symptoms of the Personalizer loop not learning effectively may include:
* Over time, Personalizer's recommendations don't seem to get any better.
* Even obvious feature correlations aren't being picked up (e.g. umbrellas get sold during rainy times but only during daytime).

To solve this, you can run an [offline evaluation](concepts-offline-evaluation.md), with "Optimization Discovery" set to Yes, and apply the best learning policy discovered in the results.

## Next steps

[Configure the model update frequency](how-to-settings.md#model-update-frequency)
[Run an Evaluation](how-to-offline-evaluation)

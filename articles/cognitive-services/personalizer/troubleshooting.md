---
title: Troubleshooting - Personalizer
titleSuffix: Azure Cognitive Services
description: Troubleshooting questions about Personalizer can be found in this article.
author: edjez
manager: nitinme
services: cognitive-services
ms.service: cognitive-services
ms.subservice: personalizer
ms.topic: article
ms.date: 06/15/2019
ms.author: edjez
---
# Personalizer Troubleshooting

This article contains answers to frequently asked troubleshooting questions about Personalizer.

## Learning loop

### The learning loop doesn't seem to learn. How do I fix this?

The learning loop needs a few thousand Reward calls before Rank calls prioritize effectively. 

If you are unsure about how your learning loop is currently behaving, run an [offline evaluation](concepts-offline-evaluation.md), and apply the corrected learning policy. 

## Next steps

[Configure the model update frequency](how-to-settings.md#model-update-frequency)
---
title: Troubleshooting - Personalizer
titleSuffix: Azure Cognitive Services
description: This article contains answers to frequently asked troubleshooting questions about Personalizer.
author: diberry
manager: nitinme
services: cognitive-services
ms.service: cognitive-services
ms.subservice: personalizer
ms.topic: conceptual
ms.date: 01/08/2019
ms.author: diberry
---
# Personalizer Troubleshooting

This article contains answers to frequently asked troubleshooting questions about Personalizer.

## Transaction errors

### I get a HTTP 429 (Too many requests) response from the service. What can I do?

If you picked a free price tier when you created the Personalizer instance, there is a quota limit on the number of Rank requests that are allowed. Please review your api call rate for the Rank api calls (in the Metrics pane) and adjust the pricing tier (in the Pricing Tier pane) if your call volume is expected to increase beyond the threshold for chosen pricing tier.

### I'm getting a 5xx error on Rank or Reward APIs. What should I do?

These issues should be transparent. If they continue, please contact support.


## Learning loop

### The learning loop doesn't seem to learn. How do I fix this?

The learning loop needs a few thousand Reward calls before Rank calls prioritize effectively.

If you are unsure about how your learning loop is currently behaving, run an [offline evaluation](concepts-offline-evaluation.md), and apply the corrected learning policy.
<!--
### I keep getting rank results with all the same probabilities for all items. How do I know Personalizer is learning?

Personalizer returns the same probabilities in a rank result when …. This is usually happening because …. You can avoid it by…..
-->
### The learning loop was learning but seems to not learn any more, and the quality of the Rank results isn't that good. What should I do?

* Make sure you've completed and applied one evaluation in the Azure portal.
* Make sure all rewards are sent and processed.

### How do I know that the learning loop is getting updated regularly and is used to score my data?

You can find the time when the model was last updated in the **Model and Learning Settings** page of the Azure portal. If you see an old timestamp, it is likely because you are not sending the Rank and Reward calls. If the service has no incoming data, it does not update the learning. If you see the learning loop is not updating frequently enough, you can edit the loop's **Model Update frequency**.


## Offline evaluations

### An offline evaluation's feature importance returns a long list with hundreds or thousands of items. What happened?

This is typically due to timestamps, user IDs or some other fine grained features sent in.

## Security

### The API key for my loop has been compromised. What can I do?

You can regenerate one key after swapping your clients to use the other key. Having two keys allows you to propagate the key in a lazy manner without having to have any downtime. We recommend doing this on a regular cycle as a security measure.


## Next steps

[Configure the model update frequency](how-to-settings.md#model-update-frequency)
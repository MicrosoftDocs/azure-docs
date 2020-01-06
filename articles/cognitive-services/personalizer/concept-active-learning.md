---
title: Active and inactive events - Personalizer
titleSuffix: Azure Cognitive Services
description: This article discusses the use of active and inactive events, learning settings, and learning policies within the Personalizer service.
services: cognitive-services
author: diberry
manager: nitinme
ms.service: cognitive-services
ms.subservice: personalizer
ms.topic: conceptual
ms.date: 05/30/2019
ms.author: diberry
---

# Active and inactive events

When your application calls the Rank API, you receive the action the application should show in the **rewardActionId** field.  From that moment, Personalizer expects a Reward call that has the same eventId. The reward score will be used to train the model for future Rank calls. If no Reward call is received for the eventId, a default reward is applied. Default rewards are set in the Azure portal.

In some scenarios, the application might need to call Rank before it even knows if the result will be used or displayed to the user. This might happen in situations where, for example, the page rendering of promoted content is overwritten by a marketing campaign. If the result of the Rank call was never used and the user never saw it, don't send a corresponding Reward call.

Typically, these scenarios happen when:

* You're prerendering UI that the user might or might not get to see. 
* Your application is doing predictive personalization in which Rank calls are made with little real-time context and the application might or might not use the output. 

In these cases, use Personalizer to call Rank, requesting the event to be _inactive_. Personalizer won't expect a reward for this event, and it won't apply a default reward. 
Later in your business logic, if the application uses the information from the Rank call, just _activate_ the event. As soon as the event is active, Personalizer expects an event reward. If no explicit call is made to the Reward API, Personalizer applies a default reward.

## Inactive events

To disable training for an event, call Rank by using `learningEnabled = False`. For an inactive event, learning is implicitly activated if you send a reward for the eventId or call the `activate` API for that eventId.

## Learning settings

Learning settings determine the *hyperparameters* of the model training. Two models of the same data that are trained on different learning settings will end up different.

### Import and export learning policies

You can import and export learning-policy files from the Azure portal. Use this method to save existing policies, test them, replace them, and archive them in your source code control as artifacts for future reference and audit.

### Understand learning policy settings

The settings in the learning policy aren't intended to be changed. Change settings only if you understand how they affect Personalizer. Without this knowledge, you could cause problems, including invalidating Personalizer models.

### Compare learning policies

You can compare how different learning policies perform against past data in Personalizer logs by doing [offline evaluations](concepts-offline-evaluation.md).

[Upload your own learning policies](how-to-offline-evaluation.md) to compare them with the current learning policy.

### Optimize learning policies

Personalizer can create an optimized learning policy in an [offline evaluation](how-to-offline-evaluation.md). An optimized learning policy that has better rewards in an offline evaluation will yield better results when it's used online in Personalizer.

After you optimize a learning policy, you can apply it directly to Personalizer so it immediately replaces the current policy. Or you can save the optimized policy for further evaluation and later decide whether to discard, save, or apply it.

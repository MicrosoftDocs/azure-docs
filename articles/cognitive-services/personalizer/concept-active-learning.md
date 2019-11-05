---
title: Active and inactive events - Personalizer
titleSuffix: Azure Cognitive Services
description: 
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

When your application calls the Rank API, you receive which Action the application should show in the rewardActionId field.  From that moment, Personalizer will be expecting a Reward call with the same eventId. The reward score will be used to train the model that will be used for future Rank calls. If no Reward call is received for the eventId, a defaul reward will be applied. Default rewards are established in the Azure Portal.

In some cases, the application may need to call Rank before it even knows if the result will be used or displayed to the user. This may happen in situations where, for example, the page render of promoted content gets overwritten with a marketing campaign. If the result of the Rank call was never used and the user never got to see it, it would be incorrect to train it with any reward at all, zero or otherwise.
Typically this happens when:

* You may be pre-rendering some UI that the user may or may not get to see. 
* Your application may be doing predictive personalization in which Rank calls are made with less real-time context and their output may or may not be used by the application. 

In these cases, the correct way to use Personalizer is by calling Rank requesting the event to be _inactive_. Personalizer will not expect a reward for this event, and will not apply a default reward either. 
Later in your business logic, if the application uses the information from the rank call, all you need to do is _activate_ the event. From the moment the event is active, Personalizer will expect a reward for the event or apply a default reward if no explicit call gets made to the Reward API.

## Get inactive events

To disable training for an event, call Rank with `learningEnabled = False`.

Learning for an inactive event is implicitly activated if you send a reward for the eventId, or call the `activate` API for that eventId.

## Learning settings

Learning settings determines the specific *hyperparameters* of the model training. Two models of the same data, trained on different learning settings, will end up being different.

### Import and export learning policies

You can import and export learning policy files from the Azure portal. This allows you to save existing policies, test them, replace them, and archive them in your source code control as artifacts for future reference and audit.

### Learning policy settings

The settings in the **Learning Policy** are not intended to be changed. Only change the settings when you understand how they impact Personalizer. Changing settings without this knowledge will cause side effects, including invalidating Personalizer models.

### Comparing effectiveness of learning policies

You can compare how different Learning Policies would have performed against past data in Personalizer logs by doing [offline evaluations](concepts-offline-evaluation.md).

[Upload your own Learning Policies](how-to-offline-evaluation.md) to compare with the current learning policy.

### Discovery of optimized learning policies

Personalizer can create a more optimized learning policy when doing an [offline evaluation](how-to-offline-evaluation.md). 
A more optimized learning policy, which is shown to have better rewards in an offline evaluation, will yield better results when used online in Personalizer.

After an optimized learning policy has been created, you can apply it directly to Personalizer so it replaces the current policy immediately, or you can save it for further evaluation and decide in the future whether to discard, save, or apply it later.

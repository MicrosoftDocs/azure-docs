---
title: Active learning - Personalizer
titleSuffix: Azure Cognitive Services
description: 
services: cognitive-services
author: edjez
manager: nitinme
ms.service: cognitive-services
ms.subservice: personalizer
ms.topic: conceptual
ms.date: 05/30/2019
ms.author: edjez
---

# Active learning and learning policies 

When your application calls the Rank API, you receive a rank of the content. Business logic can use this rank to determine if the content should be display to the user. When you display the ranked content, that is an _active_ rank event. When your application does not display that ranked content, that is an _inactive_ rank event. 

Active rank event information is returned to Personalizer. This information is used to continue training the model through the current learning policy.

## Active events

Active events should always be shown to the user and the reward call should be returned to close the learning loop. 

### Inactive events 

Inactive events shouldn't change the underlying model because the user wasn't given a chance to choose from the ranked content.

## Don't train with inactive rank events 

For some applications, you may need to call the Rank API without knowing yet if your application will display the results to the user. 

This happens when:

* You may be pre-rendering some UI that the user may or may not get to see. 
* Your application may be doing predictive personalization in which Rank calls are made with less real-time context and their output may or may not be used by the application. 

### Disable active learning for inactive rank events during Rank call

To disabling automatic learning, call Rank with `learningEnabled = False`.

Learning for an inactive event is implicitly activated if you send a reward for the Rank.

## Learning policies

Learning policy determines the specific *hyperparameters* of the model training. Two models of the same data, trained on different learning policies, will behave differently.

### Importing and exporting Learning Policies

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
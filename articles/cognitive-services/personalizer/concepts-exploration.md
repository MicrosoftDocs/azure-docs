---
title: Exploration - Personalizer
titleSuffix: Azure Cognitive Services
description: 
services: cognitive-services
author: edjez
manager: nitinme
ms.service: cognitive-services
ms.subservice: personalizer
ms.topic: overview
ms.date: 05/13/2019
ms.author: edjez
---

# Exploration and experimentation values

Thanks to exploration, Personalizer is able to continue delivering good results, even as user behavior changes.

When Personalizer receives a Rank call, it returns a RewardActionID that either:
* Uses experimentaiton to match the most probable user behavior based on the current machine learning model.
* Uses exploitation, which does not match the action that has the highest probability in the rank.

Returning the most probable action is called *exploit* behavior. Returning a different action is called *exploration*.

Personalizer currently uses an algorithm called *epsilon greedy* to explore. 

## Choosing a Exploration Setting

You can configure the amount of traffic to use for exploration in the Azure Portal. This setting determines the percentage of Rank calls that perform exploration. 

Personalizer determines whether to explore or exploit with this probability on each rank call. 

Note this is different than the behavior in some A/B frameworks that "lock" a treatment on specific user IDs.


## Best Practices for Choosing an Exploration Setting

Choosing an exploration setting is a business decision about the proportion of user interactions to explore with, in order to improve the rest. 

Choosing a exploration setting of zero will negate many of the benefits of Personalizer. In other words, you are using no user interactions to discover better user interactions. This leads to model stagnation, drift and ultimately lower performance.

Likewise, a setting that is too high will negate the benefits of learning from user behavior. Setting it to 100% would imply a constant randomization, and any learned behavior from users would not influence the outcome.

It is important not to change the application behavior based on whether you see if Personalizer is exploring or exploiting. This would lead to learning biases that ultimately would decrease the potential performance.

## Next steps

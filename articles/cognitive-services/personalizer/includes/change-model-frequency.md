---
title: include file
description: include file
services: cognitive-services
author: diberry
manager: nitinme
ms.service: cognitive-services
ms.subservice: personalizer
ms.topic: include
ms.custom: include file
ms.date: 01/15/2020
ms.author: diberry
---
## Change the model update frequency

In the Azure portal, in the Personalizer resource on the **Configuration** page, change the **Model update frequency** to 10 seconds. This short duration will train the service rapidly, allowing you to see how the top action changes for each iteration.

![Change model update frequency](../media/settings/configure-model-update-frequency-settings.png)

When a Personalizer loop is first instantiated, there is no model since there has been no Reward API calls to train from. Rank calls will return equal probabilities for each item. Your application should still always rank content using the output of RewardActionId.
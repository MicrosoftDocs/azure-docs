---
title: include file
description: include file
#services: cognitive-services
manager: nitinme
ms.service: azure-ai-personalizer
ms.topic: include
ms.custom: include file
ms.date: 07/04/2022
---
### Change the reward wait time

In the Azure portal, go to your Personalizer resource's **Configuration** page, and change the **Reward wait time** to 10 minutes. This determines how long the model will wait after sending a recommendation, to receive the reward feedback from that recommendation. Training won't occur until the reward wait time has passed.

![Change reward wait time](../media/settings/configure-reward-wait-time.png)

---
ms.service: azure-logic-apps
ms.topic: include
author: ecfan
ms.author: estfan
ms.date: 10/15/2022
---

> [!IMPORTANT]
> Use caution when you select both a trigger and action that have the same connector type 
> and use them to work with the same entity, such as a messaging queue or topic subscription. 
> This combination can create an infinite loop, which results in a logic app that never ends.
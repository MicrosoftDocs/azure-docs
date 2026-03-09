---
ms.service: azure-logic-apps
ms.topic: include
author: ecfan
ms.author: estfan
ms.date: 01/15/2026
---

> [!IMPORTANT]
>
> Make sure your workflow doesn't create an infinite loop when you use a trigger and action with the same connector type to work with the same entity, such as a message queue or topic subscription. This loop results in a workflow that never completes.

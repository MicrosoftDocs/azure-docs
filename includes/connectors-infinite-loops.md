---
title: include file
description: include file
services: logic-apps
ms.service: logic-apps
author: ecfan
ms.author: estfan
ms.topic: include
ms.date: 09/18/2019
ms.custom: include file
---

> [!IMPORTANT]
> Use caution when you process messages by using a trigger and action that have the same connector type. 
> This combination can create an infinite loop, which results in a logic app that never ends.
>
> For example, if you use a trigger that receives messages and an action that sends messages to a 
> messaging entity, such as a queue, this combination creates a loop.

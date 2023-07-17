---
title: include file
description: include file
services: azure-communication-services
author: memontic-ms
manager: 
ms.service: azure-communication-services
ms.subservice: messages
ms.date: 07/12/2023
ms.topic: include
ms.custom: include file
ms.author: memontic
---

```csharp
AsyncPageable<MessageTemplateItem> templates = messageTemplateClient.GetTemplatesAsync(channelId);
``````

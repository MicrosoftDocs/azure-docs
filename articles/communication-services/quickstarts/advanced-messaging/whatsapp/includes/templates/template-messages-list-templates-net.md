---
title: include file
description: include file
services: azure-communication-services
author: memontic-ms
ms.service: azure-communication-services
ms.subservice: advanced-messaging
ms.date: 07/12/2023
ms.topic: include
ms.custom: include file
ms.author: memontic
---
```csharp
MessageTemplateClient messageTemplateClient = new MessageTemplateClient(connectionString);
Pageable<MessageTemplateItem> templates = messageTemplateClient.GetTemplates(channelRegistrationId);
``````

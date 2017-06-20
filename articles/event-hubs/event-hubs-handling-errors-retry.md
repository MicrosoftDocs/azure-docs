---
title: Azure Event Hubs best practices for handling errors | Microsoft Docs
description: Azure Event Hubs handling errors and retry
services: event-hubs
documentationcenter: .net
author: sethmanheim
manager: timlt
editor: ''

ms.assetid: 
ms.service: event-hubs
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: multiple
ms.topic: article
ms.date: 04/09/2017
ms.author: sethm
---

# 🔧 Event Hubs best practices for handling errors and retry

> [!NOTE]
> 
> This topic hasn’t been written yet! 
>
> We welcome your input to help shape the scope and approach of this content. You can
> track the status and provide input on this
> [issue in GitHub](https://github.com/Azure/azure-event-hubs/issues/305).
> 
> Learn more about how you can contribute on
> [GitHub](https://github.com/Microsoft/azure-docs/blob/master/contributor-guide/contributor-guide-index.md).

This article will cover:

- What different kinds of errors are there?
- What happens when I get an error?
- What kinds of errors should be retried? Which shouldn't?
- Custom retry policy

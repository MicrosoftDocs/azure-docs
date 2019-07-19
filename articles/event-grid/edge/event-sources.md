---
title: Event Sources - Azure Event Grid IoT Edge | Microsoft Docs 
description: Event Sources in Event Grid on IoT Edge.  
author: vkukke
manager: rajarv
ms.author: vkukke
ms.reviewer: 
ms.date: 07/18/2019
ms.topic: article
ms.service: event-grid-on-edge
services: event-grid-on-edge
---

Event sources refer to entities that publish events to Event Grid module. Any entity that can do HTTP POST could be an event source publisher. It can be both IoT Edge modules as well as non-IoT applications.

## Possible Source(s)

* IoT Edge Modules (on the same device, different device)
* Non-IoT applications

>[!IMPORTANT]

[Security and Authentication](security-authentication.md) documentation describes the various options available to securely expose Event Grid functionality to Non-IoT Applications. 
---
title: include file
description: include file
services: event-hubs
author: spelluru
ms.service: event-hubs
ms.topic: include
ms.date: 08/07/2020
ms.author: spelluru
ms.custom: "include file"

---

## Trusted Microsoft services
When you enable the **Allow trusted Microsoft services to bypass this firewall** setting, the following services are granted access to your Event Hubs resources.

| Trusted service | Supported usage scenarios | 
| --------------- | ------------------------- | 
| Azure Event Grid | Allows Azure Event Grid to send events to event hubs in your Event Hubs namespace. You also need to do the following steps: <ul><li>Enable system-assigned identity for a topic or a domain</li><li>Add the identity to the Azure Event Hubs Data Sender role on the Event Hubs namespace</li><li>Then, configure the event subscription that uses an event hub as an endpoint to use the system-assigned identity.</li></ul> <p>For more information, see [Event delivery with a managed identity](../articles/event-grid/managed-service-identity.md)</p>|
| Azure Monitor (Diagnostic Settings) | Allows Azure Monitor to send diagnostic information to event hubs in your Event Hubs namespace. |
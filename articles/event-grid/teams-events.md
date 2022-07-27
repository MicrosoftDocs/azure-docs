---
title: Microsoft Teams events in Azure Event Grid
description: This article describes Microsoft Teams events in Azure Event Grid.
ms.topic: conceptual
ms.date: 06/06/2022
---

# Microsoft Teams events in Azure Event Grid

This article provides the list of available event types for Microsoft Teams events, which are published by Microsoft Graph API. For an introduction to event schemas, see [CloudEvents schema](cloud-event-schema.md). 

## Available event types
These events are triggered when a call record is created or updated, and chat message is created, updated or deleted or by operating over those resources using Microsoft Graph API. 

 | Event name | Description |
 | ---------- | ----------- |
 | **Microsoft.Graph.CallRecordCreated** | Triggered when a call or meeting is produced in Microsoft Teams. |
 | **Microsoft.Graph.CallRecordUpdated** | Triggered when a call or meeting is updated in Microsoft Teams.  |
 | **Microsoft.Graph.ChatMessageCreated** | Triggered when a chat message is sent via teams or channels in Microsoft Teams. |
 | **Microsoft.Graph.ChatMessageUpdated** | Triggered when a chat message is edited via teams or channels in Microsoft Teams.  |
 | **Microsoft.Graph.ChatMessageDeleted** | Triggered when a chat message is deleted via Teams or channels in Teams. |


## Next steps

* For an introduction to Azure Event Grid's Partner Events, see [Partner Events overview](partner-events-overview.md)
* For information on how to subscribe to Microsoft Graph API events, see [subscribe to Azure Graph API events](subscribe-to-graph-api-events.md).
* For information about Azure Event Grid event handlers, see [event handlers](event-handlers.md).
* For more information about creating an Azure Event Grid subscription, see [create event subscription](subscribe-through-portal.md#create-event-subscriptions) and [Event Grid subscription schema](subscription-creation-schema.md).
* For information about how to configure an event subscription to select specific events to be delivered, consult [event filtering](event-filtering.md). You may also want to refer to [filter events](how-to-filter-events.md).

---
title: Microsoft 365 Group Conversations events
description: This article describes Microsoft 365 Group Conversations event types and provides event samples.
ms.topic: conceptual
ms.date: 12/6/2023
---

# Microsoft 365 Group Conversation events

This article provides the properties and schema for Microsoft 365 Group Conversation events, which are published by Microsoft Graph API. For an introduction to event schemas, see [CloudEvents schema](cloud-event-schema.md). 

## Available event types
These events are triggered when a [conversation](/graph/api/resources/conversation) is created, updated, or deleted by operating over those resources using Microsoft Graph API. Note that you can only subscribe to changes from a specific group.

 | Event name | Description |
 | ---------- | ----------- |
 | **Microsoft.Graph.ConversationCreated** | Triggered when a conversation in a Microsoft 365 group is created.|
 | **Microsoft.Graph.ConversationUpdated** | Triggered when a conversation in a Microsoft 365 group is updated.|
 | **Microsoft.Graph.ConversationDeleted** | Triggered when a conversation in a Microsoft 365 group is deleted.|


## Next steps

* For an introduction to Azure Event Grid's Partner Events, see [Partner Events overview](partner-events-overview.md)
* For information on how to subscribe to Microsoft Graph API to receive events, see [subscribe to Microsoft Graph API events](subscribe-to-graph-api-events.md).
* For information about Azure Event Grid event handlers, see [event handlers](event-handlers.md).
* For more information about creating an Azure Event Grid subscription, see [create event subscription](subscribe-through-portal.md#create-event-subscriptions) and [Event Grid subscription schema](subscription-creation-schema.md).
* For information about how to configure an event subscription to select specific events to be delivered, see [event filtering](event-filtering.md). You might also want to refer to [filter events](how-to-filter-events.md).
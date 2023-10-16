---
title: Microsoft Graph API events in Azure Event Grid
description: This article describes events published by Microsoft Graph API.
ms.topic: conceptual
ms.date: 06/09/2022
---

# Microsoft Graph API events

Microsoft Graph API provides a unified programmable model that you can use to receive events about state changes of resources in Microsoft Outlook, Teams, SharePoint, Microsoft Entra ID, Microsoft Conversations, and security alerts. For every resource in the following table, events for create, update and delete state changes are supported. 

## Graph API event sources

|Microsoft event source |Resource(s) | Available event types | 
|:--- | :--- | :----|
|Microsoft Entra ID| [User](/graph/api/resources/user), [Group](/graph/api/resources/group) | [Microsoft Entra event types](azure-active-directory-events.md) |
|Microsoft Outlook|[Event](/graph/api/resources/event) (calendar meeting), [Message](/graph/api/resources/message) (email), [Contact](/graph/api/resources/contact) | [Microsoft Outlook event types](outlook-events.md) |
|Microsoft Teams|[ChatMessage](/graph/api/resources/callrecords-callrecord), [CallRecord](/graph/api/resources/callrecords-callrecord) (meeting) | [Microsoft Teams event types](teams-events.md) |
|Microsoft SharePoint and OneDrive| [DriveItem](/graph/api/resources/driveitem)| |
|Microsoft SharePoint| [List](/graph/api/resources/list)|
|Security alerts| [Alert](/graph/api/resources/alert)|
|Microsoft Conversations| [Conversation](/graph/api/resources/conversation)| |

You create a Microsoft Graph API subscription to enable Graph API events to flow into a partner topic. The partner topic is automatically created for you as part of the Graph API subscription creation. You use that partner topic to [create event subscriptions](event-filtering.md) to send your events to any of the supported [event handlers](event-handlers.md) that best meets your requirements to process the events.


## Next steps

* [Partner Events overview](partner-events-overview.md).
* [subscribe to partner events](subscribe-to-partner-events.md), which includes instructions on how to subscribe to Microsoft Graph API events.

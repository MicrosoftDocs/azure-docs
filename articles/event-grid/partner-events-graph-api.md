---
title: Microsoft Graph API events in Azure Event Grid
description: This article describes events published by Microsoft Graph API.
ms.topic: conceptual
ms.date: 05/22/2024
---

# Microsoft Graph API events

Microsoft Graph API provides a unified programmable model that you can use to receive events about state changes of resources in Microsoft Outlook, Teams, SharePoint, Microsoft Entra ID, Microsoft Conversations, and security alerts. For every resource in the following table, events for create, update, and delete state changes are supported. 

## Graph API event sources


|Microsoft event source |Resources | Available event types | 
|:--- | :--- | :----|
| Microsoft Entra ID | [User](/graph/api/resources/user), [Group](/graph/api/resources/group) | [Microsoft Entra event types](microsoft-entra-events.md) |
| Microsoft Outlook|[Event](/graph/api/resources/event) (calendar meeting), [Message](/graph/api/resources/message) (email), [Contact](/graph/api/resources/contact) | [Microsoft Outlook event types](outlook-events.md) |
| Microsoft Teams |[ChatMessage](/graph/api/resources/callrecords-callrecord), [CallRecord](/graph/api/resources/callrecords-callrecord) (meeting) | [Microsoft Teams event types](teams-events.md) |
| OneDrive | [DriveItem](/graph/api/resources/driveitem)| [Microsoft OneDrive events](one-drive-events.md) |
| Microsoft SharePoint | [List](/graph/api/resources/list) | [Microsoft SharePoint events](share-point-events.md) |
| To Do | [To Do Task](/graph/api/resources/todotask) | [Microsoft ToDo events](to-do-events.md) |
| Security alerts | [Alert](/graph/api/resources/alert)| [Microsoft Security Alert events](security-alert-events.md) |
| Cloud printing | [Printer](/graph/api/resources/printer), [Print Task Definition](/graph/api/resources/printtaskdefinition) | [Microsoft Cloud Printing events](cloud-printing-events.md) |
| Microsoft Conversations | [Conversation](/graph/api/resources/conversation) | [Microsoft 365 Group Conversation events](conversation-events.md) |

You create a Microsoft Graph API subscription to enable Graph API events to flow into a partner topic. The partner topic is automatically created for you as part of the Graph API subscription creation. You use that partner topic to [create event subscriptions](event-filtering.md) to send your events to any of the supported [event handlers](event-handlers.md) that best meets your requirements to process the events.


## Next steps

* [Partner Events overview](partner-events-overview.md).
* [subscribe to partner events](subscribe-to-partner-events.md), which includes instructions on how to subscribe to Microsoft Graph API events.

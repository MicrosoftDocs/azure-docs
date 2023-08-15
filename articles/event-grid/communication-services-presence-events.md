---
title: Azure Communication Services - Presence events
description: This article describes how to use Azure Communication Services as an Event Grid event source for user presence Events.
ms.topic: conceptual
ms.date: 10/15/2021
author: VikramDhumal
ms.author: vikramdh
---

# Azure Communication Services - Presence events

This article provides the properties and schema for communication services presence events. For an introduction to event schemas, see [Azure Event Grid event schema](event-schema.md).

## Events types

Azure Communication Services emits the following user presence event types:

| Event type                                                  | Description                                                                                    |
| ----------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| Microsoft.Communication.UserDisconnected | Published after a Communication Services user is designated as having disconnected from the Communication Services |

## Event responses

When an event is triggered, the Event Grid service sends data about that event to subscribing endpoints.

This section contains an example of what that data would look like for each event.

> [!IMPORTANT]
> The logs associated to the user disconnected state may be replicated globally. You can get the disconnected state by subscribing to this event through Event Grid.

> [!NOTE]
> Microsoft.Communication.UserDisconnected event is applicable only in the context of chat.
 
### Microsoft.Communication.UserDisconnected

```json
[
 {
  "id": "8f60490d-0719-4d9d-a1a6-835362fb752e",
  "topic": "/subscriptions/{subscription-id}/resourcegroups/}{group-name}/providers/microsoft.communication/communicationservices/{communication-services-resource-name}",
  "subject": "user/{rawId}",
  "data": {
    "userCommunicationIdentifier": {
      "rawId": "8:acs:3d703c91-9657-4b3f-b19c-ef9d53f99710_0000000b-d198-0d50-84f5-084822008d40",
      "communicationUser": {
        "id": "8:acs:3d703c91-9657-4b3f-b19c-ef9d53f99710_0000000b-d198-0d50-84f5-084822008d40"
      }
    }
  },
  "eventType": "Microsoft.Communication.UserDisconnected",
  "dataVersion": "1.0",
  "metadataVersion": "1",
  "eventTime": "2021-08-10T20:25:38Z"
 }
]
```

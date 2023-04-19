---
title: Azure Communication Services - Email events
description: This article describes how to use Azure Communication Services as an Event Grid event source for Email Events.
ms.topic: conceptual
ms.date: 09/30/2022
ms.author: anmolbohra
---

# Azure Communication Services - Email events

This article provides the properties and schema for communication services telephony and SMS events. For an introduction to event schemas, see [Azure Event Grid event schema](event-schema.md).

## Events types

Azure Communication Services emits the following telephony and SMS event types:

| Event type                                                  | Description                                                                                    |
| ----------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| Microsoft.Communication.EmailDeliveryReportReceived                         | Published when a delivery report is received for an Email sent by the Communication Service. |
| Microsoft.Communication.EmailEngagementTrackingReportReceived           |    Published when the Email sent is either opened or the link, if applicable is clicked.  |

## Event responses

When an event is triggered, the Event Grid service sends data about that event to subscribing endpoints.

This section contains an example of what that data would look like for each event.

### Microsoft.Communication.EmailDeliveryReportReceived event

```json
[{
  "id": "00000000-0000-0000-0000-000000000000",
  "topic": "/subscriptions/{subscription-id}/resourceGroups/{group-name}/providers/microsoft.communication/communicationservices/{communication-services-resource-name}",
  "subject": "sender/senderid@azure.com/message/00000000-0000-0000-0000-000000000000",
  "data": {
    "sender": "senderid@azure.com", 
    "recipient": "receiver@azure.com",
    "messageId": "00000000-0000-0000-0000-000000000000",
    "status": "Delivered",
    "deliveryAttemptTimeStamp": "2020-09-18T00:22:20.2855749Z",
  },
  "eventType": "Microsoft.Communication.EmailDeliveryReportReceived",
  "dataVersion": "1.0",
  "metadataVersion": "1",
  "eventTime": "2020-09-18T00:22:20Z"
}]
```

> [!NOTE]
> Possible values for `Status` are `Delivered`, `Expanded` and `Failed`.

### Microsoft.Communication.EmailEngagementTrackingReportReceived event

```json
[{
  "id": "00000000-0000-0000-0000-000000000000",
  "topic": "/subscriptions/{subscription-id}/resourceGroups/{group-name}/providers/microsoft.communication/communicationservices/{communication-services-resource-name}",
  "subject": "sender/senderid@azure.com/message/00000000-0000-0000-0000-000000000000",
  "data": {
    "sender": "senderid@azure.com", 
    "messageId": "00000000-0000-0000-0000-000000000000",
    "userActionTimeStamp": "2022-09-06T22:34:52.1303595+00:00",
    "engagementContext": "",
    "userAgent": "",
    "engagementType": "view"
  },
  "eventType": "Microsoft.Communication.EmailEngagementTrackingReportReceived",
  "dataVersion": "1.0",
  "metadataVersion": "1",
  "eventTime": "2022-09-06T22:34:52.1303612Z"
}]
```

> [!NOTE]
> Possible values for `engagementType` are `View`, and `Click`. When the `engagementType` is `Click`, `engagementContext` is the link in the Email sent which was clicked.

## Tutorial
For a tutorial that shows how to subscribe for email events using web hooks, see [Quickstart: Handle email events](../communication-services/quickstarts/email/handle-email-events.md). 

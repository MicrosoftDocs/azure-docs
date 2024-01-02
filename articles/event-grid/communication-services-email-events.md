---
title: Azure Communication Services - Email events
description: This article describes how to use Azure Communication Services as an Event Grid event source for Email Events.
ms.topic: conceptual
ms.date: 09/30/2022
author: anmolbohra97
ms.author: anmolbohra
---

# Azure Communication Services - Email events

This article provides the properties and schema for communication services email events. For an introduction to event schemas, see [Azure Event Grid event schema](event-schema.md).

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
    "deliveryStatusDetails": {
      "statusMessage": "Status Message"
    },
    "deliveryAttemptTimeStamp": "2020-09-18T00:22:20.2855749+00:00",
  },
  "eventType": "Microsoft.Communication.EmailDeliveryReportReceived",
  "dataVersion": "1.0",
  "metadataVersion": "1",
  "eventTime": "2020-09-18T00:22:20.822Z"
}]
```

> [!NOTE]
> Possible values for `Status` are:
> - `Delivered`: The message was successfully handed over to the intended destination (recipient Mail Transfer Agent).
> - `Suppressed`: The recipient email had hard bounced previously, and all subsequent emails to this recipient are being temporarily suppressed as a result.
> - `Bounced`: The email hard bounced, which may have happened because the email address does not exist or the domain is invalid.
> - `Quarantined`: The message was quarantined (as spam, bulk mail, or phishing).
> - `FilteredSpam`: The message was identified as spam, and was rejected or blocked (not quarantined).
> - `Expanded`: A distribution group recipient was expanded before delivery to the individual members of the group.
> - `Failed`: The message wasn't delivered.

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
  "eventTime": "2022-09-06T22:34:52.688Z"
}]
```

> [!NOTE]
> Possible values for `engagementType` are `View` and `Click`. When the `engagementType` is `Click`, `engagementContext` is the link in the Email sent which was clicked.

## Tutorial
For a tutorial that shows how to subscribe for email events using web hooks, see [Quickstart: Handle email events](../communication-services/quickstarts/email/handle-email-events.md). 

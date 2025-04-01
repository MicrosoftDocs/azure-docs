---
title: Azure Communication Services - SMS events
description: This article describes how to use Azure Communication Services as an Event Grid event source for SMS Events.
ms.topic: conceptual
ms.date: 01/29/2025
author: VikramDhumal
ms.author: vikramdh
---

# Azure Communication Services - SMS events

This article provides the properties and schema for communication services SMS events. For an introduction to event schemas, see [Azure Event Grid event schema](event-schema.md).

## Events types

Azure Communication Services emits the following SMS event types:

| Event type                                                  | Description                                                                                    |
| ----------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| Microsoft.Communication.SMSReceived                         | Published when an SMS is received by a phone number associated with the Communication Service. |
| Microsoft.Communication.SMSDeliveryReportReceived           | Published when a delivery report is received for an SMS sent by the Communication Service.     |

## Event responses

When an event is triggered, the Event Grid service sends data about that event to subscribing endpoints.

This section contains an example of what that data would look like for each event.

### Microsoft.Communication.SMSDeliveryReportReceived event

```json
[{
  "id": "Outgoing_202009180022138813a09b-0cbf-4304-9b03-1546683bb910",
  "topic": "/subscriptions/{subscription-id}/resourceGroups/{group-name}/providers/microsoft.communication/communicationservices/{communication-services-resource-name}",
  "subject": "/phonenumber/15555555555",
  "data": {
    "messageId": "Outgoing_202009180022138813a09b-0cbf-4304-9b03-1546683bb910",
    "from": "15555555555",
    "to": "+15555555555",
    "deliveryStatus": "Delivered",
    "deliveryStatusDetails": "No error.",
    "receivedTimestamp": "2020-09-18T00:22:20.2855749Z",
    "deliveryAttempts": [
      {
        "timestamp": "2020-09-18T00:22:14.9315918Z",
        "segmentsSucceeded": 1,
        "segmentsFailed": 0
      }
    ],
    "Tag": "Optional customer-tag set in the original message"
  },
  "eventType": "Microsoft.Communication.SMSDeliveryReportReceived",
  "dataVersion": "1.0",
  "metadataVersion": "1",
  "eventTime": "2020-09-18T00:22:20Z"
}]
```

> [!NOTE]
> Possible values for `DeliveryStatus` are `Delivered` and `Failed`.  

### Microsoft.Communication.SMSReceived event

```json
[{
  "id": "Incoming_20200918002745d29ebbea-3341-4466-9690-0a03af35228e",
  "topic": "/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourcegroups/acse2e/providers/microsoft.communication/communicationservices/{communication-services-resource-name}",
  "subject": "/phonenumber/15555555555",
  "data": {
    "messageId": "Incoming_20200918002745d29ebbea-3341-4466-9690-0a03af35228e",
    "from": "15555555555",
    "to": "15555555555",
    "message": "Great to connect with Azure Communication Services events",
    "receivedTimestamp": "2020-09-18T00:27:45.32Z",
    "segmentCount": 1
  },
  "eventType": "Microsoft.Communication.SMSReceived",
  "dataVersion": "1.0",
  "metadataVersion": "1",
  "eventTime": "2020-09-18T00:27:47Z"
}]
```

## Next steps
See the following tutorial:[Quickstart: Handle SMS and delivery report events](../communication-services/quickstarts/sms/handle-sms-events.md).

---
title: Azure Event Grid - Diagnostic logs for topics or domains
description: This article provides conceptual information about diagnostic logs for an Azure event grid topic or a domain.
services: event-grid
author: spelluru

ms.service: event-grid
ms.topic: conceptual
ms.date: 04/29/2020
ms.author: spelluru
---

#  Diagnostic logs for Azure Event Grid topics/domains
Diagnostic settings allow Event Grid users to capture and view **publish and delivery failure** logs in either a Storage account, an event hub, or a Log Analytics Workspace. This article provides schema for the logs and an example log entry.


## Schema for publish/delivery failure logs

| Property name | Data type | Description |
| ------------- | --------- | ----------- | 
| Time | DateTime | The time when the log entry was generated <p>**Example value:**  01-29-2020 09:52:02.700</p> |
| EventSubscriptionName | String | The name of the event subscription <p>**Example value:** "EVENTSUB1"</p> <p>This property exists only for delivery failure logs.</p>  |
| Category | String | The log category name. <p>**Example values:** "DeliveryFailures" or "PublishFailures" | 
| OperationName | String | The name of the operation performed while encountering the failure.<p>**Example Values:** "Deliver" for delivery failures. |
| Message | String | The log message for the user explaining the reason for the failure and other additional details. |
| ResourceId | String | The resource ID for the topic/domain resource<p>**Example Values:** `/SUBSCRIPTIONS/SAMPLE-SUBSCRIPTION-ID/RESOURCEGROUPS/SAMPLE-RESOURCEGROUP/PROVIDERS/MICROSOFT.EVENTGRID/TOPICS/TOPIC1` |

## Example

```json
{
    "time": "2019-11-01T00:17:13.4389048Z",
    "resourceId": "/SUBSCRIPTIONS/SAMPLE-SUBSCTIPTION-ID /RESOURCEGROUPS/SAMPLE-RESOURCEGROUP-NAME/PROVIDERS/MICROSOFT.EVENTGRID/TOPICS/SAMPLE-TOPIC-NAME ",
    "eventSubscriptionName": "SAMPLEDESTINATION",
    "category": "DeliveryFailures",
    "operationName": "Deliver",
    "message": "Message:outcome=NotFound, latencyInMs=2635, systemId=17284f7c-0044-46fb-84b7-59fda5776017, state=FilteredFailingDelivery, deliveryTime=11/1/2019 12:17:10 AM, deliveryCount=0, probationCount=0, deliverySchema=EventGridEvent, eventSubscriptionDeliverySchema=EventGridEvent, fields=InputEvent, EventSubscriptionId, DeliveryTime, State, Id, DeliverySchema, LastDeliveryAttemptTime, SystemId, fieldCount=, requestExpiration=1/1/0001 12:00:00 AM, delivered=False publishTime=11/1/2019 12:17:10 AM, eventTime=11/1/2019 12:17:09 AM, eventType=Type, deliveryTime=11/1/2019 12:17:10 AM, filteringState=FilteredWithRpc, inputSchema=EventGridEvent, publisher=DIAGNOSTICLOGSTEST-EASTUS.EASTUS-1.EVENTGRID.AZURE.NET, size=363, fields=Id, PublishTime, SerializedBody, EventType, Topic, Subject, FilteringHashCode, SystemId, Publisher, FilteringTopic, TopicCategory, DataVersion, MetadataVersion, InputSchema, EventTime, fieldCount=15, url=sb://diagnosticlogstesting-eastus.servicebus.windows.net/, deliveryResponse=NotFound: The messaging entity 'sb://diagnosticlogstesting-eastus.servicebus.windows.net/eh-diagnosticlogstest' could not be found. TrackingId:c98c5af6-11f0-400b-8f56-c605662fb849_G14, SystemTracker:diagnosticlogstesting-eastus.servicebus.windows.net:eh-diagnosticlogstest, Timestamp:2019-11-01T00:17:13, referenceId: ac141738a9a54451b12b4cc31a10dedc_G14:"
}
```

## Next steps
To learn how to enable diagnostic logs for topics or domains, see [Enable diagnostic logs](enable-diagnostic-logs-topic.md).

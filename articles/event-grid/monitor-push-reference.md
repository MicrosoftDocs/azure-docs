---
title: Azure Event Grid - Monitor data reference (push delivery)
description: This article provides reference documentation for metrics and diagnostic logs for Azure Event Grid's push delivery of events.
ms.topic: conceptual
ms.custom:
  - build-2023
  - ignite-2023
ms.date: 11/15/2023
---

# Monitor data reference for Azure Event Grid's push event delivery
This article provides a reference of log and metric data collected to analyze the performance and availability of Azure Event Grid's push delivery. 

[!INCLUDE [simple-preview-note](./includes/simple-preview-note.md)]

## Metrics

### Microsoft.EventGrid/domains  

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|AdvancedFilterEvaluationCount |Yes |Advanced Filter Evaluations |Count |Total |Total advanced filters evaluated across event subscriptions for this topic. |Topic, EventSubscriptionName, DomainEventSubscriptionName |
|DeadLetteredCount |Yes |Dead Lettered Events |Count |Total |Total dead lettered events matching to this event subscription |Topic, EventSubscriptionName, DomainEventSubscriptionName, DeadLetterReason |
|DeliveryAttemptFailCount |No |Delivery Failed Events |Count |Total |Total events failed to deliver to this event subscription |Topic, EventSubscriptionName, DomainEventSubscriptionName, Error, ErrorType |
|DeliverySuccessCount |Yes |Delivered Events |Count |Total |Total events delivered to this event subscription |Topic, EventSubscriptionName, DomainEventSubscriptionName |
|DestinationProcessingDurationInMs |No |Destination Processing Duration |MilliSeconds |Average |Destination processing duration in milliseconds |Topic, EventSubscriptionName, DomainEventSubscriptionName |
|DroppedEventCount |Yes |Dropped Events |Count |Total |Total dropped events matching to this event subscription |Topic, EventSubscriptionName, DomainEventSubscriptionName, DropReason |
|MatchedEventCount |Yes |Matched Events |Count |Total |Total events matched to this event subscription |Topic, EventSubscriptionName, DomainEventSubscriptionName |
|PublishFailCount |Yes |Publish Failed Events |Count |Total |Total events failed to publish to this topic |Topic, ErrorType, Error |
|PublishSuccessCount |Yes |Published Events |Count |Total |Total events published to this topic |Topic |
|PublishSuccessLatencyInMs |Yes |Publish Success Latency |MilliSeconds |Total |Publish success latency in milliseconds |No Dimensions |

### Microsoft.EventGrid/eventSubscriptions  

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|DeadLetteredCount |Yes |Dead Lettered Events |Count |Total |Total dead lettered events matching to this event subscription |DeadLetterReason |
|DeliveryAttemptFailCount |No |Delivery Failed Events |Count |Total |Total events failed to deliver to this event subscription |Error, ErrorType |
|DeliverySuccessCount |Yes |Delivered Events |Count |Total |Total events delivered to this event subscription |No Dimensions |
|DestinationProcessingDurationInMs |No |Destination Processing Duration |Milliseconds |Average |Destination processing duration in milliseconds |No Dimensions |
|DroppedEventCount |Yes |Dropped Events |Count |Total |Total dropped events matching to this event subscription |DropReason |
|MatchedEventCount |Yes |Matched Events |Count |Total |Total events matched to this event subscription |No Dimensions |

### Microsoft.EventGrid/extensionTopics  

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|PublishFailCount |Yes |Publish Failed Events |Count |Total |Total events failed to publish to this topic |ErrorType, Error |
|PublishSuccessCount |Yes |Published Events |Count |Total |Total events published to this topic |No Dimensions |
|PublishSuccessLatencyInMs |Yes |Publish Success Latency |Milliseconds |Total |Publish success latency in milliseconds |No Dimensions |
|UnmatchedEventCount |Yes |Unmatched Events |Count |Total |Total events not matching any of the event subscriptions for this topic |No Dimensions |

### Microsoft.EventGrid/partnerNamespaces  
<!-- Data source : naam-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|PublishFailCount |Yes |Publish Failed Events |Count |Total |Total events failed to publish to this partner namespace |ErrorType, Error |
|PublishSuccessCount |Yes |Published Events |Count |Total |Total events published to this partner namespace |No Dimensions |
|PublishSuccessLatencyInMs |Yes |Publish Success Latency |MilliSeconds |Total |Publish success latency in milliseconds |No Dimensions |
|UnmatchedEventCount |Yes |Unmatched Events |Count |Total |Total events not matching any of the partner topics |No Dimensions |

### Microsoft.EventGrid/partnerTopics  

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|AdvancedFilterEvaluationCount |Yes |Advanced Filter Evaluations |Count |Total |Total advanced filters evaluated across event subscriptions for this partner topic. |EventSubscriptionName |
|DeadLetteredCount |Yes |Dead Lettered Events |Count |Total |Total dead lettered events matching to this event subscription |DeadLetterReason, EventSubscriptionName |
|DeliveryAttemptFailCount |No |Delivery Failed Events |Count |Total |Total events failed to deliver to this event subscription |Error, ErrorType, EventSubscriptionName |
|DeliverySuccessCount |Yes |Delivered Events |Count |Total |Total events delivered to this event subscription |EventSubscriptionName |
|DestinationProcessingDurationInMs |No |Destination Processing Duration |MilliSeconds |Average |Destination processing duration in milliseconds |EventSubscriptionName |
|DroppedEventCount |Yes |Dropped Events |Count |Total |Total dropped events matching to this event subscription |DropReason, EventSubscriptionName |
|MatchedEventCount |Yes |Matched Events |Count |Total |Total events matched to this event subscription |EventSubscriptionName |
|PublishSuccessCount |Yes |Published Events |Count |Total |Total events published to this partner topic |No Dimensions |
|UnmatchedEventCount |Yes |Unmatched Events |Count |Total |Total events not matching any of the event subscriptions for this partner topic |No Dimensions |

### Microsoft.EventGrid/systemTopics  

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|AdvancedFilterEvaluationCount |Yes |Advanced Filter Evaluations |Count |Total |Total advanced filters evaluated across event subscriptions for this topic. |EventSubscriptionName |
|DeadLetteredCount |Yes |Dead Lettered Events |Count |Total |Total dead lettered events matching to this event subscription |DeadLetterReason, EventSubscriptionName |
|DeliveryAttemptFailCount |No |Delivery Failed Events |Count |Total |Total events failed to deliver to this event subscription |Error, ErrorType, EventSubscriptionName |
|DeliverySuccessCount |Yes |Delivered Events |Count |Total |Total events delivered to this event subscription |EventSubscriptionName |
|DestinationProcessingDurationInMs |No |Destination Processing Duration |Milliseconds |Average |Destination processing duration in milliseconds |EventSubscriptionName |
|DroppedEventCount |Yes |Dropped Events |Count |Total |Total dropped events matching to this event subscription |DropReason, EventSubscriptionName |
|MatchedEventCount |Yes |Matched Events |Count |Total |Total events matched to this event subscription |EventSubscriptionName |
|PublishFailCount |Yes |Publish Failed Events |Count |Total |Total events failed to publish to this topic |ErrorType, Error |
|PublishSuccessCount |Yes |Published Events |Count |Total |Total events published to this topic |No Dimensions |
|PublishSuccessLatencyInMs |Yes |Publish Success Latency |Milliseconds |Total |Publish success latency in milliseconds |No Dimensions |
|UnmatchedEventCount |Yes |Unmatched Events |Count |Total |Total events not matching any of the event subscriptions for this topic |No Dimensions |

### Microsoft.EventGrid/topics  

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|AdvancedFilterEvaluationCount |Yes |Advanced Filter Evaluations |Count |Total |Total advanced filters evaluated across event subscriptions for this topic. |EventSubscriptionName |
|DeadLetteredCount |Yes |Dead Lettered Events |Count |Total |Total dead lettered events matching to this event subscription |DeadLetterReason, EventSubscriptionName |
|DeliveryAttemptFailCount |No |Delivery Failed Events |Count |Total |Total events failed to deliver to this event subscription |Error, ErrorType, EventSubscriptionName |
|DeliverySuccessCount |Yes |Delivered Events |Count |Total |Total events delivered to this event subscription |EventSubscriptionName |
|DestinationProcessingDurationInMs |No |Destination Processing Duration |MilliSeconds |Average |Destination processing duration in milliseconds |EventSubscriptionName |
|DroppedEventCount |Yes |Dropped Events |Count |Total |Total dropped events matching to this event subscription |DropReason, EventSubscriptionName |
|MatchedEventCount |Yes |Matched Events |Count |Total |Total events matched to this event subscription |EventSubscriptionName |
|PublishFailCount |Yes |Publish Failed Events |Count |Total |Total events failed to publish to this topic |ErrorType, Error |
|PublishSuccessCount |Yes |Published Events |Count |Total |Total events published to this topic |No Dimensions |
|PublishSuccessLatencyInMs |Yes |Publish Success Latency |MilliSeconds |Total |Publish success latency in milliseconds |No Dimensions |
|UnmatchedEventCount |Yes |Unmatched Events |Count |Total |Total events not matching any of the event subscriptions for this topic |No Dimensions |

## Resource logs
Diagnostic settings allow Event Grid users to capture and view **publish and delivery failure** logs in either a Storage account, an event hub, or a Log Analytics Workspace. This article provides schema for the logs and an example log entry.

### Schema for publish/delivery failure logs

| Property name | Data type | Description |
| ------------- | --------- | ----------- |
| Time | DateTime | The time when the log entry was generated <p>**Example value:**  01-29-2020 09:52:02.700</p> |
| EventSubscriptionName | String | The name of the event subscription <p>**Example value:** "EVENTSUB1"</p> <p>This property exists only for delivery failure logs.</p>  |
| Category | String | The log category name. <p>**Example values:** "DeliveryFailures" or "PublishFailures" | 
| OperationName | String | The name of the operation caused the failure.<p>**Example Values:** "Deliver" for delivery failures. |
| Message | String | The log message for the user explaining the reason for the failure and more details. |
| ResourceId | String | The resource ID for the topic/domain resource<p>**Example Values:** `/SUBSCRIPTIONS/SAMPLE-SUBSCRIPTION-ID/RESOURCEGROUPS/SAMPLE-RESOURCEGROUP/PROVIDERS/MICROSOFT.EVENTGRID/TOPICS/TOPIC1` |

#### Example - Schema for publish/delivery failure logs

```json
{
    "time": "2019-11-01T00:17:13.4389048Z",
    "resourceId": "/SUBSCRIPTIONS/SAMPLE-SUBSCTIPTION-ID /RESOURCEGROUPS/SAMPLE-RESOURCEGROUP-NAME/PROVIDERS/MICROSOFT.EVENTGRID/TOPICS/SAMPLE-TOPIC-NAME ",
    "eventSubscriptionName": "SAMPLEDESTINATION",
    "category": "DeliveryFailures",
    "operationName": "Deliver",
    "message": "Message:outcome=NotFound, latencyInMs=2635, id=xxxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxx, systemId=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx, state=FilteredFailingDelivery, deliveryTime=11/1/2019 12:17:10 AM, deliveryCount=0, probationCount=0, deliverySchema=EventGridEvent, eventSubscriptionDeliverySchema=EventGridEvent, fields=InputEvent, EventSubscriptionId, DeliveryTime, State, Id, DeliverySchema, LastDeliveryAttemptTime, SystemId, fieldCount=, requestExpiration=1/1/0001 12:00:00 AM, delivered=False publishTime=11/1/2019 12:17:10 AM, eventTime=11/1/2019 12:17:09 AM, eventType=Type, deliveryTime=11/1/2019 12:17:10 AM, filteringState=FilteredWithRpc, inputSchema=EventGridEvent, publisher=DIAGNOSTICLOGSTEST-EASTUS.EASTUS-1.EVENTGRID.AZURE.NET, size=363, fields=Id, PublishTime, SerializedBody, EventType, Topic, Subject, FilteringHashCode, SystemId, Publisher, FilteringTopic, TopicCategory, DataVersion, MetadataVersion, InputSchema, EventTime, fieldCount=15, url=sb://diagnosticlogstesting-eastus.servicebus.windows.net/, deliveryResponse=NotFound: The messaging entity 'sb://diagnosticlogstesting-eastus.servicebus.windows.net/eh-diagnosticlogstest' could not be found. TrackingId:c98c5af6-11f0-400b-8f56-c605662fb849_G14, SystemTracker:diagnosticlogstesting-eastus.servicebus.windows.net:eh-diagnosticlogstest, Timestamp:2019-11-01T00:17:13, referenceId: ac141738a9a54451b12b4cc31a10dedc_G14:"
}
```

The possible values of `Outcome` are `NotFound`, `Aborted`, `TimedOut`, `GenericError`, and `Busy`. Event Grid logs any information it receives from the event handler in the `message`. For example, for `GenericError`, it logs the HTTP status code, error code, and the error message.

### Schema for data plane operations logs

| Property name | Data type | Description |
| ------------- | --------- | ----------- |
| NetworkAccess | String | Allowed values are: <br>- `PublicAccess` - when connecting via public IP<br>- `PrivateAccess` - when connecting via private link |
| ClientIpAddress | String | Source IP of incoming requests |
| TlsVersion | String | The transport layer security (TLS) version used by the client connection. Possible values are: **1.0**, **1.1** and **1.2** |
| Authentication/Type | String | The type of secret used for authentication when publishing messages. <br>-`Key` – request uses the SAS key<br>- `SASToken` – request uses a SAS token generated from SAS key<br>- `AADAccessToken` – Microsoft Entra ID issued JSON Web Token (JWT) token<br>- `Unknown` – None of the above authentication types. OPTIONS requests have this authentication type |
| Authentication/ObjectId | String | ObjectId of the service principal used when the authentication type is set to `AADAccessToken` |
| OperationResult | String | Result of the publish. Possible values are: <br>- Success<br>- Unauthorized<br>- Forbidden<br>- RequestEntityTooLarge<br>- BadRequest<br>- InternalServerError |
| TotalOperations | String | These traces aren't emitted for each publish request. An aggregate for each unique combination of above values is emitted every minute |

#### Example - Schema for data plane requests

```json
{
    "time": "2021-10-26T21:44:16.8117322Z",
    "resourceId": "/SUBSCRIPTIONS/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx/RESOURCEGROUPS/BMT-TEST/PROVIDERS/MICROSOFT.EVENTGRID/DOMAINS/BMTAUDITLOGDOMAIN",
    "operationName": "Microsoft.EventGrid/events/send",
    "category": "DataPlaneRequests",
    "level": "Information",
    "region": "CENTRALUSEUAP",
    "properties": {
        "aggregatedRequests": [
            {
                "networkAccess": "PublicAccess",
                "clientIpAddress": "xx.xx.xx.xxx",
                "tlsVersion": "1.2",
                "authentication": {
                            "type": "AADAccessToken",
                            "objectId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx"
                },
                "operationResult": "Success",
                "totalOperations": 1
            }
        ]
    }
}
```

Once the `DataPlaneRequests` diagnostic setting is selected, Event Grid resources start publishing audit traces for data plane operations including public and private access operations. This trace may log one or more requests if needed.

## Next steps

To learn how to enable diagnostic logs for topics or domains, see [Enable diagnostic logs](enable-diagnostic-logs-topic.md).

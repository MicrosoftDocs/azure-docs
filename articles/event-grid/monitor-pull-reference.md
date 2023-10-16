---
title: Azure Event Grid - Monitor data reference (pull delivery)
description: This article provides reference documentation for metrics and diagnostic logs for Azure Event Grid's push and pull delivery of events. 
ms.topic: conceptual
ms.custom: build-2023
ms.date: 04/28/2023
---

# Monitor data reference for Azure Event Grid's pull delivery (Preview)

This article provides a reference of log and metric data collected to analyze the performance and availability of Azure Event Grid's pull delivery. 

[!INCLUDE [pull-preview-note](./includes/pull-preview-note.md)]

## Metrics

### Microsoft.EventGrid/namespaces 

| Metric name | Display name | Description | 
| ----------- | ------------ | ----------- | 
| SuccessfulPublishedEvents | Successful published events | Number of published events to a topic or topic space in a namespace. |
| FailedPublishedEvents | Failed to publish events | Number of events that failed because Event Grid didn't accept them. This count doesn't include events that were published but failed to reach Event Grid due to a network issue. | 
| SuccessfulReceivedEvents | Successful received event | Number of events that were successfully returned to (received by) clients. |
| FailedReceivedEvents | Failed to receive event | Number of events requested by clients that Event Grid couldn't deliver successfully. |
| SuccessfulAcknowlegedEvents | Successful acknowledged events | Number of events acknowledged by clients. |
| FailedAcknowledgedEvents | Failed to acknowledge events | Number of events that clients didn't acknowledge. |
| SuccessfulReleasedEvents | Successful released events | Number of events released by queue subscriber clients. |
| FailedReleasedEvents | Failed to release event counts | Number of events that failed to be released back to Event Grid. |
| DeadLetteredEvents | Dead-lettered events | Number of events sent to a dead-letter location. |
| DroppedEvents | Dropped events | Number of events successfully received by Event Grid but later dropped (deleted) due to one of the following reasons: <br>- The maximum delivery count of a queue or push subscription has been reached and a dead-letter destination hasn't been configured or isn't available<br> - Events have been rejected by queue subscription clients and there's no dead-letter destination configured or isn't available. <br> -The time-to-live configured for the event subscription has been reached and there's no dead-letter destination configured or isn't available. |
| ReceiveLatencyInMilliseconds | Receive operations latency in milliseconds | Latency in milliseconds for receive message operations |
| PublishLatencyInMilliseconds | Publish operations latency in milliseconds | Latency in milliseconds for publish event operations |
| AcknowledgeLatencyInMilliseconds | Acknowledge operations latency in milliseconds | Latency in milliseconds for acknowledge event operations |
| ReleaseLatencyInMilliseconds | Release operations latency in milliseconds | Latency in milliseconds for release event operations |
| RejectLatencyInMilliseconds | Reject operations latency in milliseconds | Latency in milliseconds for reject event operations |
| MatchedEvents | Matched events | Number of events that were successfully published to the service and met all the filtering criteria specified in event subscriptions. |
| UnMatchedEvents | Unmatched events | Number of events that were successfully published to the service, but didn't meet all filtering criteria specified in  event subscriptions. |

## Next steps

To learn how to enable diagnostic logs for topics or domains, see [Enable diagnostic logs](enable-diagnostic-logs-topic.md).

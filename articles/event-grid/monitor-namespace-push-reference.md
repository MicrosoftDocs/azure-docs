---
title: Azure Event Grid - Monitor data reference (push delivery)
description: This article provides reference documentation for metrics and diagnostic logs for Azure Event Grid's push and pull delivery of events. 
ms.topic: conceptual
ms.custom: build-2023
ms.date: 10/11/2023
---

# Monitor data reference for Azure Event Grid's push event delivery (preview)

This article provides a reference of log and metric data collected to analyze the performance and availability of Azure Event Grid's push delivery on namespaces.

## Metrics

### Microsoft.EventGrid/namespaces

| Metric name | Display name | Description |
| ----------- | ------------ | ----------- |
| SuccessfulReceivedEvents | Successful received events | Total events delivered to this event subscription. |
| FailedReceivedEvents | Failed received events | Total events failed to deliver to this event subscription. |
| SuccessfulDeadLetteredEvents | Successful dead lettered events | Number of events successfully sent to a dead-letter location. |
| FailedDeadLetteredEvents | Failed dead lettered events | Number of events failed to sent to a dead-letter location. |
| DestinationProcessingDurationMs | Destination processing duration in milliseconds | Destination processing duration in milliseconds. |
| DroppedEvents | Dropped events | Number of events successfully received by Event Grid but later dropped (deleted) due to one of the following reasons: <br>- The maximum delivery count of a queue or push subscription has been reached and a dead-letter destination hasn't been configured or isn't available<br> - Events have been rejected by queue subscription clients and there's no dead-letter destination configured or isn't available. <br> -The time-to-live configured for the event subscription has been reached and there's no dead-letter destination configured or isn't available. |

## Next steps

To learn how to enable diagnostic logs for topics or domains, see [Enable diagnostic logs](enable-diagnostic-logs-topic.md).

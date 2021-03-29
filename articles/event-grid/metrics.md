---
title: Metrics supported by Azure Event Grid
description: This article provides Azure Monitor metrics supported by the Azure Event Grid service. 
ms.topic: conceptual
ms.date: 03/17/2021
---

# Metrics supported by Azure Event Grid
This article provides lists of Event Grid metrics that are categorized by namespaces. 

## System topics

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|AdvancedFilterEvaluationCount|Yes|Advanced Filter Evaluations|Count|Total|Total advanced filters evaluated across event subscriptions for this topic.|EventSubscriptionName|
|DeadLetteredCount|Yes|Dead Lettered Events|Count|Total|Total dead lettered events matching to this event subscription|DeadLetterReason, EventSubscriptionName|
|DeliveryAttemptFailCount|No|Delivery Failed Events|Count|Total|Total events failed to deliver to this event subscription|Error, ErrorType, EventSubscriptionName|
|DeliverySuccessCount|Yes|Delivered Events|Count|Total|Total events delivered to this event subscription|EventSubscriptionName|
|DestinationProcessingDurationInMs|No|Destination Processing Duration|Milliseconds|Average|Destination processing duration in milliseconds|EventSubscriptionName|
|DroppedEventCount|Yes|Dropped Events|Count|Total|Total dropped events matching to this event subscription|DropReason, EventSubscriptionName|
|MatchedEventCount|Yes|Matched Events|Count|Total|Total events matched to this event subscription|EventSubscriptionName|
|PublishFailCount|Yes|Publish Failed Events|Count|Total|Total events failed to publish to this topic|ErrorType, Error|
|PublishSuccessCount|Yes|Published Events|Count|Total|Total events published to this topic|No Dimensions|
|PublishSuccessLatencyInMs|Yes|Publish Success Latency|Milliseconds|Total|Publish success latency in milliseconds|No Dimensions|
|UnmatchedEventCount|Yes|Unmatched Events|Count|Total|Total events not matching any of the event subscriptions for this topic|No Dimensions|


## Custom topics

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|AdvancedFilterEvaluationCount|Yes|Advanced Filter Evaluations|Count|Total|Total advanced filters evaluated across event subscriptions for this topic.|EventSubscriptionName|
|DeadLetteredCount|Yes|Dead Lettered Events|Count|Total|Total dead lettered events matching to this event subscription|DeadLetterReason, EventSubscriptionName|
|DeliveryAttemptFailCount|No|Delivery Failed Events|Count|Total|Total events failed to deliver to this event subscription|Error, ErrorType, EventSubscriptionName|
|DeliverySuccessCount|Yes|Delivered Events|Count|Total|Total events delivered to this event subscription|EventSubscriptionName|
|DestinationProcessingDurationInMs|No|Destination Processing Duration|Milliseconds|Average|Destination processing duration in milliseconds|EventSubscriptionName|
|DroppedEventCount|Yes|Dropped Events|Count|Total|Total dropped events matching to this event subscription|DropReason, EventSubscriptionName|
|MatchedEventCount|Yes|Matched Events|Count|Total|Total events matched to this event subscription|EventSubscriptionName|
|PublishFailCount|Yes|Publish Failed Events|Count|Total|Total events failed to publish to this topic|ErrorType, Error|
|PublishSuccessCount|Yes|Published Events|Count|Total|Total events published to this topic|No Dimensions|
|PublishSuccessLatencyInMs|Yes|Publish Success Latency|Milliseconds|Total|Publish success latency in milliseconds|No Dimensions|
|UnmatchedEventCount|Yes|Unmatched Events|Count|Total|Total events not matching any of the event subscriptions for this topic|No Dimensions|

## Domains

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|AdvancedFilterEvaluationCount|Yes|Advanced Filter Evaluations|Count|Total|Total advanced filters evaluated across event subscriptions for this topic.|Topic, EventSubscriptionName, DomainEventSubscriptionName|
|DeadLetteredCount|Yes|Dead Lettered Events|Count|Total|Total dead lettered events matching to this event subscription|Topic, EventSubscriptionName, DomainEventSubscriptionName, DeadLetterReason|
|DeliveryAttemptFailCount|No|Delivery Failed Events|Count|Total|Total events failed to deliver to this event subscription|Topic, EventSubscriptionName, DomainEventSubscriptionName, Error, ErrorType|
|DeliverySuccessCount|Yes|Delivered Events|Count|Total|Total events delivered to this event subscription|Topic, EventSubscriptionName, DomainEventSubscriptionName|
|DestinationProcessingDurationInMs|No|Destination Processing Duration|Milliseconds|Average|Destination processing duration in milliseconds|Topic, EventSubscriptionName, DomainEventSubscriptionName|
|DroppedEventCount|Yes|Dropped Events|Count|Total|Total dropped events matching to this event subscription|Topic, EventSubscriptionName, DomainEventSubscriptionName, DropReason|
|MatchedEventCount|Yes|Matched Events|Count|Total|Total events matched to this event subscription|Topic, EventSubscriptionName, DomainEventSubscriptionName|
|PublishFailCount|Yes|Publish Failed Events|Count|Total|Total events failed to publish to this topic|Topic, ErrorType, Error|
|PublishSuccessCount|Yes|Published Events|Count|Total|Total events published to this topic|Topic|
|PublishSuccessLatencyInMs|Yes|Publish Success Latency|Milliseconds|Total|Publish success latency in milliseconds|No Dimensions|

## Event subscriptions

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|DeadLetteredCount|Yes|Dead Lettered Events|Count|Total|Total dead lettered events matching to this event subscription|DeadLetterReason|
|DeliveryAttemptFailCount|No|Delivery Failed Events|Count|Total|Total events failed to deliver to this event subscription|Error, ErrorType|
|DeliverySuccessCount|Yes|Delivered Events|Count|Total|Total events delivered to this event subscription|No Dimensions|
|DestinationProcessingDurationInMs|No|Destination Processing Duration|Milliseconds|Average|Destination processing duration in milliseconds|No Dimensions|
|DroppedEventCount|Yes|Dropped Events|Count|Total|Total dropped events matching to this event subscription|DropReason|
|MatchedEventCount|Yes|Matched Events|Count|Total|Total events matched to this event subscription|No Dimensions|


## Extension topics

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|PublishFailCount|Yes|Publish Failed Events|Count|Total|Total events failed to publish to this topic|ErrorType, Error|
|PublishSuccessCount|Yes|Published Events|Count|Total|Total events published to this topic|No Dimensions|
|PublishSuccessLatencyInMs|Yes|Publish Success Latency|Milliseconds|Total|Publish success latency in milliseconds|No Dimensions|
|UnmatchedEventCount|Yes|Unmatched Events|Count|Total|Total events not matching any of the event subscriptions for this topic|No Dimensions|

## Partner namespaces

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|DeadLetteredCount|Yes|Dead Lettered Events|Count|Total|Total dead lettered events matching to this event subscription|DeadLetterReason, EventSubscriptionName|
|DeliveryAttemptFailCount|No|Delivery Failed Events|Count|Total|Total events failed to deliver to this event subscription|Error, ErrorType, EventSubscriptionName|
|DeliverySuccessCount|Yes|Delivered Events|Count|Total|Total events delivered to this event subscription|EventSubscriptionName|
|DestinationProcessingDurationInMs|No|Destination Processing Duration|Milliseconds|Average|Destination processing duration in milliseconds|EventSubscriptionName|
|DroppedEventCount|Yes|Dropped Events|Count|Total|Total dropped events matching to this event subscription|DropReason, EventSubscriptionName|
|MatchedEventCount|Yes|Matched Events|Count|Total|Total events matched to this event subscription|EventSubscriptionName|
|PublishFailCount|Yes|Publish Failed Events|Count|Total|Total events failed to publish to this topic|ErrorType, Error|
|PublishSuccessCount|Yes|Published Events|Count|Total|Total events published to this topic|No Dimensions|
|PublishSuccessLatencyInMs|Yes|Publish Success Latency|Milliseconds|Total|Publish success latency in milliseconds|No Dimensions|
|UnmatchedEventCount|Yes|Unmatched Events|Count|Total|Total events not matching any of the event subscriptions for this topic|No Dimensions|


## Partner topics

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|AdvancedFilterEvaluationCount|Yes|Advanced Filter Evaluations|Count|Total|Total advanced filters evaluated across event subscriptions for this topic.|EventSubscriptionName|
|DeadLetteredCount|Yes|Dead Lettered Events|Count|Total|Total dead lettered events matching to this event subscription|DeadLetterReason, EventSubscriptionName|
|DeliveryAttemptFailCount|No|Delivery Failed Events|Count|Total|Total events failed to deliver to this event subscription|Error, ErrorType, EventSubscriptionName|
|DeliverySuccessCount|Yes|Delivered Events|Count|Total|Total events delivered to this event subscription|EventSubscriptionName|
|DestinationProcessingDurationInMs|No|Destination Processing Duration|Milliseconds|Average|Destination processing duration in milliseconds|EventSubscriptionName|
|DroppedEventCount|Yes|Dropped Events|Count|Total|Total dropped events matching to this event subscription|DropReason, EventSubscriptionName|
|MatchedEventCount|Yes|Matched Events|Count|Total|Total events matched to this event subscription|EventSubscriptionName|
|PublishFailCount|Yes|Publish Failed Events|Count|Total|Total events failed to publish to this topic|ErrorType, Error|
|PublishSuccessCount|Yes|Published Events|Count|Total|Total events published to this topic|No Dimensions|
|UnmatchedEventCount|Yes|Unmatched Events|Count|Total|Total events not matching any of the event subscriptions for this topic|No Dimensions|


## Next steps
See the following article: [Diagnostic logs](diagnostic-logs.md)

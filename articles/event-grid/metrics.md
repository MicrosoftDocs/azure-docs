---
title: Metrics supported by Azure Event Grid
description: This article provides Azure Monitor metrics supported by the Azure Event Grid service. 
services: event-grid
author: spelluru

ms.service: event-grid
ms.topic: conceptual
ms.date: 04/29/2020
ms.author: spelluru
---

# Metrics supported by Azure Event Grid
This article provides lists of Event Grid metrics that are categorized by namespaces. 

## Microsoft.EventGrid/domains

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|PublishSuccessCount|Published Events|Count|Total|Total events published to this topic|Topic|
|PublishFailCount|Publish Failed Events|Count|Total|Total events failed to publish to this topic|Topic,ErrorType,Error|
|PublishSuccessLatencyInMs|Publish Success Latency|Milliseconds|Total|Publish success latency in milliseconds|None|
|MatchedEventCount|Matched Events|Count|Total|Total events matched to this event subscription|Topic,EventSubscriptionName,DomainEventSubscriptionName|
|DeliveryAttemptFailCount|Delivery Failed Events|Count|Total|Total events failed to deliver to this event subscription|Topic,EventSubscriptionName,DomainEventSubscriptionName,Error,ErrorType|
|DeliverySuccessCount|Delivered Events|Count|Total|Total events delivered to this event subscription|Topic,EventSubscriptionName,DomainEventSubscriptionName|
|DestinationProcessingDurationInMs|Destination Processing Duration|Milliseconds|Average|Destination processing duration in milliseconds|Topic,EventSubscriptionName,DomainEventSubscriptionName|
|DroppedEventCount|Dropped Events|Count|Total|Total dropped events matching to this event subscription|Topic,EventSubscriptionName,DomainEventSubscriptionName,DropReason|
|DeadLetteredCount|Dead Lettered Events|Count|Total|Total dead lettered events matching to this event subscription|Topic,EventSubscriptionName,DomainEventSubscriptionName,DeadLetterReason|

## Microsoft.EventGrid/topics

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|PublishSuccessCount|Published Events|Count|Total|Total events published to this topic|None|
|PublishFailCount|Publish Failed Events|Count|Total|Total events failed to publish to this topic|ErrorType,Error|
|UnmatchedEventCount|Unmatched Events|Count|Total|Total events not matching any of the event subscriptions for this topic|None|
|PublishSuccessLatencyInMs|Publish Success Latency|Milliseconds|Total|Publish success latency in milliseconds|None|
|MatchedEventCount|Matched Events|Count|Total|Total events matched to this event subscription|EventSubscriptionName|
|DeliveryAttemptFailCount|Delivery Failed Events|Count|Total|Total events failed to deliver to this event subscription|Error,ErrorType,EventSubscriptionName|
|DeliverySuccessCount|Delivered Events|Count|Total|Total events delivered to this event subscription|EventSubscriptionName|
|DestinationProcessingDurationInMs|Destination Processing Duration|Milliseconds|Average|Destination processing duration in milliseconds|EventSubscriptionName|
|DroppedEventCount|Dropped Events|Count|Total|Total dropped events matching to this event subscription|DropReason, EventSubscriptionName|
|DeadLetteredCount|Dead Lettered Events|Count|Total|Total dead lettered events matching to this event subscription|DeadLetterReason, EventSubscriptionName|

## Microsoft.EventGrid/systemTopics

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|PublishSuccessCount|Published Events|Count|Total|Total events published to this topic|None|
|PublishFailCount|Publish Failed Events|Count|Total|Total events failed to publish to this topic|ErrorType, Error|
|UnmatchedEventCount|Unmatched Events|Count|Total|Total events not matching any of the event subscriptions for this topic|None|
|PublishSuccessLatencyInMs|Publish Success Latency|Milliseconds|Total|Publish success latency in milliseconds|None|
|MatchedEventCount|Matched Events|Count|Total|Total events matched to this event subscription|EventSubscriptionName|
|DeliveryAttemptFailCount|Delivery Failed Events|Count|Total|Total events failed to deliver to this event subscription|Error,ErrorType,EventSubscriptionName|
|DeliverySuccessCount|Delivered Events|Count|Total|Total events delivered to this event subscription|EventSubscriptionName|
|DestinationProcessingDurationInMs|Destination Processing Duration|Milliseconds|Average|Destination processing duration in milliseconds|EventSubscriptionName|
|DroppedEventCount|Dropped Events|Count|Total|Total dropped events matching to this event subscription|DropReason, EventSubscriptionName|
|DeadLetteredCount|Dead Lettered Events|Count|Total|Total dead lettered events matching to this event subscription|DeadLetterReason, EventSubscriptionName|

## Microsoft.EventGrid/eventSubscriptions

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|MatchedEventCount|Matched Events|Count|Total|Total events matched to this event subscription|None|
|DeliveryAttemptFailCount|Delivery Failed Events|Count|Total|Total events failed to deliver to this event subscription|Error, ErrorType|
|DeliverySuccessCount|Delivered Events|Count|Total|Total events delivered to this event subscription|None|
|DestinationProcessingDurationInMs|Destination Processing Duration|Milliseconds|Average|Destination processing duration in milliseconds|None|
|DroppedEventCount|Dropped Events|Count|Total|Total dropped events matching to this event subscription|DropReason|
|DeadLetteredCount|Dead Lettered Events|Count|Total|Total dead lettered events matching to this event subscription|DeadLetterReason|

## Microsoft.EventGrid/extensionTopics

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|PublishSuccessCount|Published Events|Count|Total|Total events published to this topic|None|
|PublishFailCount|Publish Failed Events|Count|Total|Total events failed to publish to this topic|ErrorType, Error|
|UnmatchedEventCount|Unmatched Events|Count|Total|Total events not matching any of the event subscriptions for this topic|None|
|PublishSuccessLatencyInMs|Publish Success Latency|Milliseconds|Total|Publish success latency in milliseconds|None|

## Next steps
See the following article: [Diagnostic logs](diagnostic-logs.md)

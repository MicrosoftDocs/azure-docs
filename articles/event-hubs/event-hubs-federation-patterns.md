---
title: Event replication task patterns - Azure Event Hubs | Microsoft Docs
description: This article provides detail guidance for implementing specific event replication task patterns
ms.topic: article
ms.date: 12/01/2020
---

# Event replication tasks patterns

The [federation overview](event-hubs-federation-overview.md) and the [replicator
functions overview](event-hubs-federation-replicator-functions.md) explain the
rationale for and the basic elements of replication tasks, and it's recommended
that you familiarize yourself with them before continuing with this article.

In this article, we detail implementation guidance for several of the patterns
highlighted in the overview section. 

- [Replication](#replication)
- [Merge](#merge)
- [Editor](#editor)
- [Routing](#routing)
- [Log projection](#log-projection) 

## Replication 

The Replication pattern copies events from one Event Hub to the next, or from an
Event Hub to some other destination like a Service Bus queue. The events are
forwarded without making any modifications to the event payload. 

The implementation of this pattern is covered by the [Event replication between
Event Hubs](event-hubs-federation-event-hubs.md) and [Event replication between
Event Hubs and Service Bus](event-hubs-federation-service-bus.md) articles.

### Sequences and order preservation

The replication model does not aim to assure the creation of an exact 1:1 clone
of a source Event Hub into a target Event Hub, but focuses on preserving the
relative order of events where the application requires it. The application
communicates this by grouping related events with the same partition key and
[Event Hubs arranges messages with the same partition key sequentially in the
same partition](event-hubs-features.md#partitions).

The pre-built replication functions ensure that event sequences with the same
partition key (streams) retrieved from a source partition are submitted
as a batch in the original sequence and with the same partition key into the
target Event Hub. 

If the partition count of the source and target Event Hub is identical, all
streams in the target will map to the same partitions as they did in the source.
If the partition count is different, which matters in some of the further
patterns described in the following, the mapping will obviously differ, but
streams are always kept together and in order. 

The relative order of events belonging to different streams or of independent
events without a partition key in a target partition may differ from the
source partition. 

### Service-assigned metadata 

The service-assigned metadata of an event obtained from the source Event Hub,
the original enqueue time, sequence number, and offset, are replaced by new
service-assigned values in the target Event Hub, but with the default
replication tasks that are provided in our samples, they are preserved in user
properties: `repl-enqueue-time` (ISO8601 string), `repl-sequence`,
`repl-offset`. 

Those properties are of type string and contain the stringified
value of the respective original properties.  If the event is forwarded multiple
times, the service-assigned metadata of the immediate source is appended to the
already existing properties, with values separated by semicolons. 

### Failover

If you are using replication for disaster recovery purposes, to protect against
regional availability events in the Event Hubs service, or against network
interruptions and will you want to perform a failover from one Event Hub to the
next, telling producers and consumers to use the prepared replica.

For producers, this is trivial if you keep the Event Hub endpoint information in
a central configuration location (which might be as simple as returning the
endpoint DNS name or even a connection string from a HTTP GET endpoint) and
restart the producers. 

For consumers, the failover strategy depends on the needs of the event
processor. 

If there is a disaster that requires rebuilding a system, including
databases, from backup data, and the databases are fed directly or via
intermediate processing from the events held in the Event Hub, you will restore
the backup and then want to start replaying events into the system from the
moment at which the backup was created and not from the moment the original
system was destroyed.

If a failure only affects a slice of a system or indeed only a single Event Hub
which has become unreachable, you will likely want to continue processing events
from about the same position where processing was interrupted. 

To realize either scenario and using the event processor of your respective
Azure SDK, [you will create a new checkpoint
store](event-processor-balance-partition-load.md#checkpointing) and provide an
initial partition position, based on the timestamp that you want to resume
processing from. 

If you still have access to the checkpoint store of the Event Hub you're
switching away from, the [propagated metadata](#service-assigned-metadata)
discussed above will help you to skip events that were already handled and
resume precisely from where you last left off.

## Merge

The merge pattern has one or more replication tasks pointing to one target,
while regular producers might also send event to the target at the same time. 

Variations of this patters are:
- Two or more replication functions concurrently acquiring events from separate sources and
  sending them to the same target.
- One more replication function acquiring events from a source while the target
  is also used directly by producers. 
- The prior pattern, but mirrored between two or more Event Hubs, resulting in
  those Event Hubs containing the same streams, no matter where events are produced.

The first two pattern variations are trivial and do not differ from plain
replication tasks.

The last scenario requires excluding already replicated events from being
replicated again. The technique is demonstrated and explained in the
[EventHubToEventHubMerge](https://github.com/Azure-Samples/azure-messaging-replication-dotnet/main/code/EventHubToEventHubMerge)
sample.

## Editor

The editor pattern builds on the [replication](#replication) pattern, but you
don't forward messages unchanged, but modify them before forwarding. Examples
for such modifications are:

- *Transcoding* - If the event content (also referred to as "body" or "payload")
  arrives from the source encoded using the Apache Avro format or some
  proprietary serialization format, but the expectation of the system owning the
  target is for the content to be JSON encoded, a transcoding replication task
  will first deserialize the payload from Apache Avro into an in-memory object
  graph and then serialize that graph into the JSON format for the event that is
  being forwarded. Transcoding also includes content compression and
  decompression tasks.
- *Transformation* - Events that contain structured data may require reshaping
  of that data for easier consumption by downstream consumers. This may involve
  work like flattening nested structures, pruning extraneous data elements, or
  reshaping the payload to exactly fit a given schema.
- *Batching* - Events may be received in batches (multiple events in a single
  transfer) from a source, but have to be forwarded singly to a target, or vice
  versa. A task may therefore forward multiple events based on a single input
  event transfer or aggregate a set of events that are then transferred
  together. 
- *Validation* - Event data from external sources often need to be checked for
  whether they are in compliance with a set of rules before they may be
  forwarded. The rules may be expressed using schemas or code. Events that are
  found not to be in compliance may be dropped, with the issue noted in logs, or
  may be forwarded to a special target destination to handle them further.   
- *Enrichment* - Event data coming from some sources may require enrichment with
  further context for it to be usable in target systems. This may involve
  looking up reference data and embedding that data with the event, or adding
  information about the source that is known to the replication task, but not
  contained in the events. 
- *Filtering* - Some events arriving from a source might have to be withheld
  from the target based on some rule. A filter tests the event against a rule
  and drops the event if the event does not match the rule. Filtering out
  duplicate events by observing certain criteria and dropping subsequent events
  with the same values is a form of filtering.
- *Routing and Partitioning* - Some replication tasks may allow for two or more
  alternative targets, and define rules for which replication target is chosen
  for any particular event based on the metadata or content of the event. A
  special form of routing is partitioning, where the task explicitly assigns
  partitions in one replication target based on rules.
- *Cryptography* - A replication task may have to decrypt content arriving from
  the source and/or encrypt content forwarded onwards to a target, and/or it may
  have to verify the integrity of content and metadata relative to a signature
  carried in the event, or attach such a signature. 
- *Attestation* - A replication task may attach metadata, potentially protected
  by a digital signature, to an event that attests that the event has been
  received through a specific channel or at a specific time.     
- *Chaining* - A replication task may apply signatures to sequences of events
  such that the integrity of the sequence is protected and missing events can be
  detected.

All those patterns can be implemented using Azure Functions, using the [Event
Hubs Trigger](../azure-functions/functions-bindings-event-hubs-trigger.md) for
acquiring events and the [Event Hub output
binding](../azure-functions/functions-bindings-event-hubs-output.md) for delivering
them. 

## Routing

The routing pattern builds on the [replication](#replication) pattern, but
instead of having one source and one target, the replication task has multiple
targets, illustrated here in C#:

``` csharp
[FunctionName("EH2EH")]
public static async Task Run(
    [EventHubTrigger("source", Connection = "EventHubConnectionAppSetting")] EventData[] events,
    [EventHub("dest1", Connection = "EventHubConnectionAppSetting")] EventHubClient output1,
    [EventHub("dest2", Connection = "EventHubConnectionAppSetting")] EventHubClient output2,
    ILogger log)
{
    foreach (EventData eventData in events)
    {
        // send to output1 or output2 based on criteria 
    }
}
```

The routing function will consider the message metadata and/or the message
payload and then pick one of the available destinations to send to. 

## Log projection


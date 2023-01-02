---
title: Event replication task patterns - Azure Event Hubs | Microsoft Docs
description:
  This article provides detail guidance for implementing specific event
  replication task patterns
ms.topic: article
ms.date: 09/28/2021
ms.custom: ignite-2022
---

# Event replication tasks patterns

The [federation overview](event-hubs-federation-overview.md) and the
[replicator functions overview](event-hubs-federation-replicator-functions.md)
explain the rationale for and the basic elements of replication tasks, and it's
recommended that you familiarize yourself with them before continuing with this
article.

In this article, we detail implementation guidance for several of the patterns
highlighted in the overview section.

## Replication

The Replication pattern copies events from one Event Hub to the next, or from an
Event Hub to some other destination like a Service Bus queue. The events are
forwarded without making any modifications to the event payload.

The implementation of this pattern is covered by the
[Event replication between Event Hubs](https://github.com/Azure-Samples/azure-messaging-replication-dotnet/tree/main/functions/config/EventHubCopy) and
[Event replication between Event Hubs and Service Bus](https://github.com/Azure-Samples/azure-messaging-replication-dotnet/tree/main/functions/config/EventHubCopyToServiceBus)
samples and the [Use Apache Kafka MirrorMaker with Event Hubs](event-hubs-kafka-mirror-maker-tutorial.md) tutorial for the specific case of replicating data from an Apache Kafka broker into Event Hubs.

### Streams and order preservation

Replication, either through Azure Functions or Azure Stream Analytics, doesn't
aim to assure the creation of exact 1:1 clones of a source Event Hub into a
target Event Hub, but focuses on preserving the relative order of events where
the application requires it. The application communicates this by grouping
related events with the same partition key and [Event Hubs arranges messages
with the same partition key sequentially in the same
partition](event-hubs-features.md#partitions).

> [!IMPORTANT] 
> The "offset" information is unique for each Event Hub and offsets
> for the same events will differ across Event Hub instances. To locate a
> position in a copied event stream, use time-based offsets and refer to the
> [propagated service-assigned metadata](#service-assigned-metadata).
>
> Time-based offsets start your receiver at a specific point in time:
> - *EventPosition.FromStart()* - Read all retained data again.
> - *EventPosition.FromEnd()* - Read all new data from the time of connection.
> - *EventPosition.FromEnqueuedTime(dateTime)* - All data starting from a given date and time.
>
> In the EventProcessor, you set the position through the InitialOffsetProvider
> on the EventProcessorOptions. With the other receiver APIs, the position is
> passed through the constructor. 


The pre-built replication function helpers [provided as
samples](https://github.com/Azure-Samples/azure-messaging-replication-dotnet/tree/main/src/Azure.Messaging.Replication)
that are used in the Azure Functions based guidance ensure that event streams
with the same partition key retrieved from a source partition are submitted into
the target Event Hub as a batch in the original stream and with the same
partition key.

If the partition count of the source and target Event Hub is identical, all
streams in the target will map to the same partitions as they did in the source.
If the partition count is different, which matters in some of the further
patterns described in the following, the mapping will differ, but streams are
always kept together and in order.

The relative order of events belonging to different streams or of independent
events without a partition key in a target partition may always differ from the
source partition.

### Service-assigned metadata

The service-assigned metadata of an event obtained from the source Event Hub,
the original enqueue time, sequence number, and offset, are replaced by new
service-assigned values in the target Event Hub, but with the [helper functions](https://github.com/Azure-Samples/azure-messaging-replication-dotnet/tree/main/src/Azure.Messaging.Replication),
replication tasks that are provided in our samples, the original values are
preserved in user properties: `repl-enqueue-time` (ISO8601 string),
`repl-sequence`, `repl-offset`.

Those properties are of type string and contain the stringified value of the
respective original properties. If the event is forwarded multiple times, the
service-assigned metadata of the immediate source is appended to the already
existing properties, with values separated by semicolons.

### Failover

If you're using replication for disaster recovery purposes, to protect against
regional availability events in the Event Hubs service, or against network
interruptions, any such failure scenario will require performing a failover from
one Event Hub to the next, telling producers and/or consumers to use the
secondary endpoint.

For all failover scenarios, it's assumed that the required elements of the
namespaces are structurally identical, meaning that Event Hubs and Consumer
Groups are identically named and that shared access signature rules and/or
role-based access control rules are set up in the same way. You can create (and
update) a secondary namespace by following the
[guidance for moving namespaces](move-across-regions.md) and omitting the
cleanup step.

To force producers and consumers to switch, you need to make the information
about which namespace to use available for lookup in a location that is easy to
reach and update. If producers or consumers encounter frequent or persistent
errors, they should consult that location and adjust their configuration. There
are numerous ways to share that configuration, but we point out two in the
following: DNS and file shares.

#### DNS-based failover configuration

One candidate approach is to hold the information in DNS SRV records in a DNS
you control and point to the respective Event Hub endpoints. 

> [!IMPORTANT] 
> Mind that Event Hubs doesn't allow for its endpoints to be
> directly aliased with CNAME records, which means you'll use DNS as a
> resilient lookup mechanism for endpoint addresses and not to directly resolve
> IP address information.

Assume you own the domain `example.com` and, for your application, a zone
`test.example.com`. For two alternate Event Hubs, you'll now create two
further nested zones, and an SRV record in each.

The SRV records are, following common convention, prefixed with
`_azure_eventhubs._amqp` and hold two endpoint records: One for AMQP-over-TLS on
port 5671 and one for AMQP-over-WebSockets on port 443, both pointing to the
Event Hubs endpoint of the namespace corresponding to the zone.

| Zone                   | SRV record                                                                                                                                                            |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `eh1.test.example.com` | **`_azure_servicebus._amqp.eh1.test.example.com`**<br>`1 1 5671 eh1-test-example-com.servicebus.windows.net`<br>`2 2 443 eh1-test-example-com.servicebus.windows.net` |
| `eh2.test.example.com` | **`_azure_servicebus._amqp.eh2.test.example.com`**<br>`1 1 5671 eh2-test-example-com.servicebus.windows.net`<br>`2 2 443 eh2-test-example-com.servicebus.windows.net` |

In your application's zone, you will then create a CNAME entry that points to
the subordinate zone corresponding to your primary Event Hub:

| CNAME record                | Alias                    |
| --------------------------- | ------------------------ |
| `eventhub.test.example.com` | `eh1.test.example.com`   |

Using a DNS client that allows for querying CNAME and SRV records explicitly
(the built-in clients of Java and .NET only allow for simple resolution of names
to IP addresses), you can then resolve the desired endpoint. With
[DnsClient.NET](https://dnsclient.michaco.net/), for instance, the lookup
function is:

```C#
static string GetEventHubName(string aliasName)
{
    const string SrvRecordPrefix = "_azure_eventhub._amqp.";
    LookupClient lookup = new LookupClient();

    return (from CNameRecord alias in (lookup.Query(aliasName, QueryType.CNAME).Answers)
            from SrvRecord srv in lookup.Query(SrvRecordPrefix + alias.CanonicalName, QueryType.SRV).Answers
            where srv.Port == 5671
            select srv.Target).FirstOrDefault()?.Value.TrimEnd('.');
}
```

The function returns the target host name registered for port 5671 of the zone
currently aliased with the CNAME as shown above.

Performing a failover requires editing the CNAME record and pointing it to the
alternate zone.

The advantage of using DNS, and specifically
[Azure DNS](../dns/dns-overview.md), is that Azure DNS information is globally
replicated and therefore resilient against single-region outages.

This procedure is similar to how the [Event Hubs Geo-DR](event-hubs-geo-dr.md)
works, but fully under your own control and also works with active/active
scenarios.

#### File-share based failover configuration

The simplest alternative to using DNS for sharing endpoint information is to put
the name of the primary endpoint into a plain-text file and serve the file from
an infrastructure that is robust against outages and still allows updates.

If you already run a highly available web site infrastructure with global
availability and content replication, adding such a file there and republish the
file if a switch is needed.

> [!CAUTION]
> You should only publish the endpoint name in this way, not a full connection string including secrets.

#### Extra considerations for failing over consumers

For Event Hub consumers, further considerations for the failover strategy depend on the needs of the event processor.

If there is a disaster that requires rebuilding a system, including databases,
from backup data, and the databases are fed directly or via intermediate
processing from the events held in the Event Hub, you will restore the backup
and then want to start replaying events into the system from the moment at which
the database backup was created and not from the moment the original system was
destroyed.

If a failure only affects a slice of a system or indeed only a single Event Hub, which has become unreachable, you will likely want to continue processing events
from about the same position where processing was interrupted.

To realize either scenario and using the event processor of your respective
Azure SDK,
[you will create a new checkpoint store](event-processor-balance-partition-load.md#checkpoint)
and provide an initial partition position, based on the _timestamp_ that you
want to resume processing from.

If you still have access to the checkpoint store of the Event Hub you're
switching away from, the [propagated metadata](#service-assigned-metadata)
discussed above will help you to skip events that were already handled and
resume precisely from where you last left off.

## Merge

The merge pattern has one or more replication tasks pointing to one target,
possibly concurrently with regular producers also sending events to the same
target.

Variations of these patters are:

- Two or more replication functions concurrently acquiring events from separate
  sources and sending them to the same target.
- One more replication function acquiring events from a source while the target
  is also used directly by producers.
- The prior pattern, but mirrored between two or more Event Hubs, resulting in
  those Event Hubs containing the same streams, no matter where events are
  produced.

The first two pattern variations are trivial and don't differ from plain
replication tasks.

The last scenario requires excluding already replicated events from being
replicated again. The technique is demonstrated and explained in the
[EventHubToEventHubMerge](https://github.com/Azure-Samples/azure-messaging-replication-dotnet/tree/main/functions/code/EventHubMerge)
sample.

## Editor

The editor pattern builds on the [replication](#replication) pattern, but
messages are modified before they are forwarded. 

Examples for such modifications are:

- **_Transcoding_** - If the event content (also referred to as "body" or
  "payload") arrives from the source encoded using the _Apache Avro_ format or
  some proprietary serialization format, but the expectation of the system
  owning the target is for the content to be _JSON_ encoded, a transcoding
  replication task will first deserialize the payload from _Apache Avro_ into an
  in-memory object graph and then serialize that graph into the _JSON_ format
  for the event that is being forwarded. Transcoding also includes **content
  compression** and decompression tasks.
- **_Transformation_** - Events that contain structured data may require
  reshaping of that data for easier consumption by downstream consumers. This
  may involve work like flattening nested structures, pruning extraneous data
  elements, or reshaping the payload to exactly fit a given schema.
- **_Batching_** - Events may be received in batches (multiple events in a
  single transfer) from a source, but have to be forwarded singly to a target,
  or vice versa. A task may therefore forward multiple events based on a single
  input event transfer or aggregate a set of events that are then transferred
  together.
- **_Validation_** - Event data from external sources often need to be checked
  for whether they're in compliance with a set of rules before they may be
  forwarded. The rules may be expressed using schemas or code. Events that are
  found not to be in compliance may be dropped, with the issue noted in logs, or
  may be forwarded to a special target destination to handle them further.
- **_Enrichment_** - Event data coming from some sources may require enrichment
  with further context for it to be usable in target systems. This may involve
  looking up reference data and embedding that data with the event, or adding
  information about the source that is known to the replication task, but not
  contained in the events.
- **_Filtering_** - Some events arriving from a source might have to be withheld
  from the target based on some rule. A filter tests the event against a rule
  and drops the event if the event doesn't match the rule. Filtering out
  duplicate events by observing certain criteria and dropping subsequent events
  with the same values is a form of filtering.
- **_Cryptography_** - A replication task may have to decrypt content arriving
  from the source and/or encrypt content forwarded onwards to a target, and/or
  it may have to verify the integrity of content and metadata relative to a
  signature carried in the event, or attach such a signature.
- **_Attestation_** - A replication task may attach metadata, potentially
  protected by a digital signature, to an event that attests that the event has
  been received through a specific channel or at a specific time.
- **_Chaining_** - A replication task may apply signatures to streams of events
  such that the integrity of the stream is protected and missing events can be
  detected.

The transformation, batching, and enrichment patterns are generally best
implemented with [Azure Stream
Analytics](../stream-analytics/stream-analytics-introduction.md) jobs. 

All those patterns can be implemented using Azure Functions, using the
[Event Hubs Trigger](../azure-functions/functions-bindings-event-hubs-trigger.md)
for acquiring events and the
[Event Hub output binding](../azure-functions/functions-bindings-event-hubs-output.md)
for delivering them.

## Routing

The routing pattern builds on the [replication](#replication) pattern, but
instead of having one source and one target, the replication task has multiple
targets, illustrated here in C#:

```csharp
[FunctionName("EH2EH")]
public static async Task Run(
    [EventHubTrigger("source", Connection = "EventHubConnectionAppSetting")] EventData[] events,
    [EventHub("dest1", Connection = "EventHubConnectionAppSetting")] EventHubClient output1,
    [EventHub("dest2", Connection = "EventHubConnectionAppSetting")] EventHubClient output2,
    ILogger log)
{
    foreach (EventData eventData in events)
    {
        // send to output1 and/or output2 based on criteria
        EventHubReplicationTasks.ConditionalForwardToEventHub(input, output1, log, (eventData) => {
            return ( inputEvent.SystemProperties.SequenceNumber%2==0 ) ? inputEvent : null;
        });
        EventHubReplicationTasks.ConditionalForwardToEventHub(input, output2, log, (eventData) => {
            return ( inputEvent.SystemProperties.SequenceNumber%2!=0 ) ? inputEvent : null;
        });
    }
}
```

The routing function will consider the message metadata and/or the message
payload and then pick one of the available destinations to send to.

In Azure Stream Analytics, you can achieve the same with defining multiple outputs and 
then executing a query per output.

```sql
select * into dest1Output from inputSource where Info = 1
select * into dest2Output from inputSource where Info = 2
```


## Log projection

The log projection pattern flattens the event stream onto an indexed database,
with events becoming records in the database. Typically, events are added to the
same collection or table, and the Event Hub partition key becomes part of the
primary key looking for making the record unique.

Log projection can produce a time-series historian of your event data or a
compacted view, whereby only the latest event is retained for each partition
key. The shape of the target database is ultimately up to you and your
application's needs. This pattern is also referred to as "event sourcing".

> [!TIP]
> You can easily create log projections into [Azure SQL Database](../stream-analytics/sql-database-output.md) and [Azure Cosmos DB](../stream-analytics/azure-cosmos-db-output.md) in Azure Stream Analytics, and you should prefer that option.

The following Azure Function projects the contents of an Event Hub compacted into an Azure Cosmos DB collection.

```C#
[FunctionName("Eh1ToCosmosDb1Json")]
[ExponentialBackoffRetry(-1, "00:00:05", "00:05:00")]
public static async Task Eh1ToCosmosDb1Json(
    [EventHubTrigger("eh1", ConsumerGroup = "Eh1ToCosmosDb1", Connection = "Eh1ToCosmosDb1-source-connection")] EventData[] input,
    [CosmosDB(databaseName: "SampleDb", collectionName: "foo", ConnectionStringSetting = "CosmosDBConnection")] IAsyncCollector<object> output,
    ILogger log)
{
    foreach (var ev in input)
    {
        if (!string.IsNullOrEmpty(ev.SystemProperties.PartitionKey))
        {
            var record = new
            {
                id = ev.SystemProperties.PartitionKey,
                data = JsonDocument.Parse(ev.Body),
                properties = ev.Properties
            };
            await output.AddAsync(record);
        }
    }
}
```

## Next steps

- [Event replicator applications in Azure Functions][1]
- [Replicating events between Event Hubs][2]
- [Replicating events to Azure Service Bus][3]

[1]: event-hubs-federation-replicator-functions.md
[2]: https://github.com/Azure-Samples/azure-messaging-replication-dotnet/tree/main/functions/config/EventHubCopy
[3]: https://github.com/Azure-Samples/azure-messaging-replication-dotnet/tree/main/functions/config/EventHubCopyToServiceBus

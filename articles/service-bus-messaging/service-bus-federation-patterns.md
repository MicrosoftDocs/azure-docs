---
title: Message replication task patterns - Azure Service Bus | Microsoft Docs
description: This article provides detail guidance for implementing specific message replication task patterns
ms.topic: article
ms.date: 09/28/2021
ms.devlang: csharp
---

# Message replication tasks patterns

The [federation overview](service-bus-federation-overview.md) and the [replicator
functions overview](service-bus-federation-replicator-functions.md) explain the
rationale for and the basic elements of replication tasks, and it's recommended
that you familiarize yourself with them before continuing with this article.

In this article, we detail implementation guidance for several of the patterns
highlighted in the overview section. 

## Replication 

The Replication pattern copies messages from one queue or topic to the next, or
from a queue or topic to some other destination like an Event Hub. The messages
are forwarded without making any modifications to the message payload. 

The implementation of this pattern is covered by the [message replication to and
from Azure Service Bus](https://github.com/Azure-Samples/azure-messaging-replication-dotnet/tree/main/functions/config/ServiceBusCopy) sample.

### Sequences and order preservation

The replication model does not aim to preserve the absolute order of messages of
a source queue or topic into a target queue or topic, but focuses, whenever
required, on preserving the relative order of messages where the application
requires it. The application enables this by enabling session support for the
source entity and grouping related messages with the same [session
key](message-sessions.md).

The session-aware pre-built replication functions ensure that message sequences
with the same session-id retrieved from a source entity are submitted into the
target queue or topic as a batch in the original sequence and with the same
session-id. 

### Service-assigned metadata 

The service-assigned metadata of a message obtained from the source queue or topic,
the original enqueue time and sequence number, are replaced by new
service-assigned values in the target queue or topic, but with the default
replication tasks that are provided in our samples, the original values are
preserved in user properties: `repl-enqueue-time` (ISO8601 string) and
`repl-sequence`.

Those properties are of type string and contain the stringified
value of the respective original properties.  If the message is forwarded multiple
times, the service-assigned metadata of the immediate source is appended to the
already existing properties, with values separated by semicolons. 

### Failover

If you are using replication for disaster recovery purposes, to protect against
regional availability messages in the Service Bus service, or against network
interruptions, any such failure scenario will require performing a failover from
one queue or topic to the next, telling producers and/or consumers to use the
secondary endpoint.

For all failover scenarios, it is assumed that the required elements of the
namespaces are structurally identical, meaning that queues and topics are
identically named and that shared access signature rules and/or role-based
access control rules are set up in the same way. You can create (and update) a
secondary namespace by following the [guidance for moving
namespaces](move-across-regions.md) and omitting the cleanup step.

To force producers and consumers to switch, you need to make the information
about which namespace to use available for lookup in a location that is easy to
reach and update. If producers or consumers encounter frequent or persistent
errors, they should consult that location and adjust their configuration. There
are numerous ways to share that configuration, but we point out two in the
following: DNS and file shares.

#### DNS-based failover configuration

One candidate approach is to hold the information in DNS SRV records in a DNS
you control and point to the respective queue or topic endpoints. Mind that message
Hubs does not allow for its endpoints to be directly aliased with CNAME records,
which means you will use DNS as a resilient lookup mechanism for endpoint
addresses and not to directly resolve IP address information. 

Assume you own the domain `example.com` and, for your application, a zone
`test.example.com`. For two alternate Service Bus, you will now create two
further nested zones, and an SRV record in each. 

The SRV records are, following common convention, prefixed with
`_azure_servicebus._amqp` and hold two endpoint records: One for AMQP-over-TLS on
port 5671 and one for AMQP-over-WebSockets on port 443, both pointing to the
Service Bus endpoint of the namespace corresponding to the zone.

| Zone                 | SRV record
|----------------------|-------------------------------------------------------------
| `sb1.test.example.com` | **`_azure_servicebus._amqp.sb1.test.example.com`**<br>`1 1 5671 sb1-test-example-com.servicebus.windows.net`<br>`2 2 443 sb1-test-example-com.servicebus.windows.net`
| `sb2.test.example.com` | **`_azure_servicebus._amqp.sb1.test.example.com`**<br>`1 1 5671 sb2-test-example-com.servicebus.windows.net`<br>`2 2 443 sb2-test-example-com.servicebus.windows.net`

In your application's zone, you will then create a CNAME entry that points to
the subordinate zone corresponding to your primary queue or topic:

| CNAME record                 | Alias
|------------------------------|-------------------------------------------------------------
| `servicebus.test.example.com`  | `sb1.test.example.com`

Using a DNS client that allows for querying CNAME and SRV records explicitly
(the built-in clients of Java and .NET only allow for simple resolution of names
to IP addresses), you can then resolve the desired endpoint. With
[DnsClient.NET](https://dnsclient.michaco.net/), for instance, the lookup
function is:

``` C#
static string GetServiceBusName(string aliasName)
{
    const string SrvRecordPrefix = "_azure_servicebus._amqp.";
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

The advantage of using DNS, and specifically [Azure
DNS](../dns/dns-overview.md), is that Azure DNS information is globally
replicated and therefore resilient against single-region outages.

This procedure is similar to how the [Service Bus Geo-DR](service-bus-geo-dr.md)
works, but fully under your own control and also works with active/active scenarios.

#### File share-based failover configuration

The simplest alternative to using DNS for sharing endpoint information is to put
the name of the primary endpoint into a plain-text file and serve the file from
an infrastructure that is robust against outages and still allows updates. 

If you already run a highly available web site infrastructure with global
availability and content replication, adding such a file there and republish the
file if a switch is needed.

## Merge

The merge pattern has one or more replication tasks pointing to one target,
possibly concurrently with regular producers also sending messages to the same
target. 

Variations of this pattern are:
- Two or more replication functions concurrently acquiring messages from
  separate sources and sending them to the same target.
- One more replication function acquiring messages from a source while the
  target is also used directly by producers. 
- The prior pattern, but messages mirrored between two or more topics, resulting
  in those topics containing the same messages, no matter where messages are
  produced.

The first two pattern variations are trivial and do not differ from plain
replication tasks.

The last scenario requires excluding already replicated messages from being
replicated again. The technique is demonstrated and explained in the
active/active sample.

## Editor

The editor pattern builds on the [replication](#replication) pattern, but
messages are modified before they are forwarded. Examples for such modifications
are:

- ***Transcoding*** - If the message content (also referred to as "body" or "payload")
  arrives from the source encoded using the *Apache Avro* format or some
  proprietary serialization format, but the expectation of the system owning the
  target is for the content to be *JSON* encoded, a transcoding replication task
  will first deserialize the payload from *Apache Avro* into an in-memory object
  graph and then serialize that graph into the *JSON* format for the message that is
  being forwarded. Transcoding also includes **content compression** and
  decompression tasks.
- ***Transformation*** - messages that contain structured data may require reshaping
  of that data for easier consumption by downstream consumers. This may involve
  work like flattening nested structures, pruning extraneous data elements, or
  reshaping the payload to exactly fit a given schema.
- ***Batching*** - messages may be received in batches (multiple messages in a single
  transfer) from a source, but have to be forwarded singly to a target, or vice
  versa. A task may therefore forward multiple messages based on a single input
  message transfer or aggregate a set of messages that are then transferred
  together. 
- ***Validation*** - message data from external sources often need to be checked for
  whether they are in compliance with a set of rules before they may be
  forwarded. The rules may be expressed using schemas or code. messages that are
  found not to be in compliance may be dropped, with the issue noted in logs, or
  may be forwarded to a special target destination to handle them further.   
- ***Enrichment*** - message data coming from some sources may require enrichment with
  further context for it to be usable in target systems. This may involve
  looking up reference data and embedding that data with the message, or adding
  information about the source that is known to the replication task, but not
  contained in the messages. 
- ***Filtering*** - Some messages arriving from a source might have to be withheld
  from the target based on some rule. A filter tests the message against a rule
  and drops the message if the message does not match the rule. Filtering out
  duplicate messages by observing certain criteria and dropping subsequent messages
  with the same values is a form of filtering.
- ***Routing and Partitioning*** - Some replication tasks may allow for two or more
  alternative targets, and define rules for which replication target is chosen
  for any particular message based on the metadata or content of the message. A
  special form of routing is partitioning, where the task explicitly assigns
  partitions in one replication target based on rules.
- ***Cryptography*** - A replication task may have to decrypt content arriving from
  the source and/or encrypt content forwarded onwards to a target, and/or it may
  have to verify the integrity of content and metadata relative to a signature
  carried in the message, or attach such a signature. 
- ***Attestation*** - A replication task may attach metadata, potentially protected
  by a digital signature, to a message that attests that the message has been
  received through a specific channel or at a specific time.     
- ***Chaining*** - A replication task may apply signatures to sequences of messages
  such that the integrity of the sequence is protected and missing messages can be
  detected.

All those patterns can be implemented using Azure Functions, using the [message
Hubs Trigger](../azure-functions/functions-bindings-service-bus-trigger.md) for
acquiring messages and the [queue or topic output
binding](../azure-functions/functions-bindings-service-bus-output.md) for delivering
them. 

## Routing

The routing pattern builds on the [replication](#replication) pattern, but
instead of having one source and one target, the replication task has multiple
targets, illustrated here in C#:

``` csharp
[FunctionName("SBRouter")]
public static async Task Run(
    [ServiceBusTrigger("source", Connection = "serviceBusConnectionAppSetting")] Message[] messages,
    [ServiceBus("dest1", Connection = "serviceBusConnectionAppSetting")] QueueClient output1,
    [ServiceBus("dest2", Connection = "serviceBusConnectionAppSetting")] QueueClient output2,
    ILogger log)
{
    foreach (Message messageData in messages)
    {
        // send to output1 or output2 based on criteria 
    }
}
```

The routing function will consider the message metadata and/or the message
payload and then pick one of the available destinations to send to.

## Next steps

- [message replicator applications in Azure Functions][1]
- [Replicating messages between Service Bus][2]
- [Replicating messages to Azure Event Hubs][3]

[1]: service-bus-federation-replicator-functions.md
[2]: https://github.com/Azure-Samples/azure-messaging-replication-dotnet/tree/main/functions/config/ServiceBusCopy
[3]: https://github.com/Azure-Samples/azure-messaging-replication-dotnet/tree/main/functions/config/ServiceBusCopyToEventHub

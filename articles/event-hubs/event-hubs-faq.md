---
title: Frequently asked questions - Azure Event Hubs | Microsoft Docs
description: This article provides a list of frequently asked questions (FAQ) for Azure Event Hubs and their answers. 
ms.topic: article
ms.date: 06/23/2020
---

# Event Hubs frequently asked questions

## General

### What is an Event Hubs namespace?
A namespace is a scoping container for Event Hub/Kafka Topics. It gives you a unique [FQDN](https://en.wikipedia.org/wiki/Fully_qualified_domain_name). A namespace serves as an application container that can house multiple Event Hub/Kafka Topics. 

### When do I create a new namespace vs. use an existing namespace?
Capacity allocations ([throughput units (TUs)](#throughput-units)) are billed at the namespace level. A namespace is also associated with a region.

You may want to create a new namespace instead of using an existing one in one of the following scenarios: 

- You need an Event Hub associated with a new region.
- You need an Event Hub associated with a different subscription.
- You need an Event Hub with a distinct capacity allocation (that is, the capacity need for the namespace with the added event hub would exceed the 40 TU threshold and you don't want to go for the dedicated cluster)  

### What is the difference between Event Hubs Basic and Standard tiers?

The Standard tier of Azure Event Hubs provides features beyond what is available in the Basic tier. The following features are included with Standard:

* Longer event retention
* Additional brokered connections, with an overage charge for more than the number included
* More than a single [consumer group](event-hubs-features.md#consumer-groups)
* [Capture](event-hubs-capture-overview.md)
* [Kafka integration](event-hubs-for-kafka-ecosystem-overview.md)

For more information about pricing tiers, including Event Hubs Dedicated, see the [Event Hubs pricing details](https://azure.microsoft.com/pricing/details/event-hubs/).

### Where is Azure Event Hubs available?

Azure Event Hubs is available in all supported Azure regions. For a list, visit the [Azure regions](https://azure.microsoft.com/regions/) page.  

### Can I use a single AMQP connection to send and receive from multiple event hubs?

Yes, as long as all the event hubs are in the same namespace.

### What is the maximum retention period for events?

Event Hubs Standard tier currently supports a maximum retention period of seven days. Event hubs aren't intended as a permanent data store. Retention periods greater than 24 hours are intended for scenarios in which it's convenient to replay an event stream into the same systems; for example, to train or verify a new machine learning model on existing data. If you need message retention beyond seven days, enabling [Event Hubs Capture](event-hubs-capture-overview.md) on your event hub pulls the data from your event hub into the Storage account or Azure Data Lake Service account of your choosing. Enabling Capture incurs a charge based on your purchased throughput units.

You can configure the retention period for the captured data on your storage account. The **lifecycle management** feature of Azure Storage offers a rich, rule-based policy for general purpose v2 and blob storage accounts. Use the policy to transition your data to the appropriate access tiers or expire at the end of the data's lifecycle. For more information, see [Manage the Azure Blob storage lifecycle](../storage/blobs/storage-lifecycle-management-concepts.md). 

### How do I monitor my Event Hubs?
Event Hubs emits exhaustive metrics that provide the state of your resources to [Azure Monitor](../azure-monitor/overview.md). They also let you assess the overall health of the Event Hubs service not only at the namespace level but also at the entity level. Learn about what monitoring is offered for [Azure Event Hubs](event-hubs-metrics-azure-monitor.md).

### What ports do I need to open on the firewall? 
You can use the following protocols with Azure Service Bus to send and receive messages:

- Advanced Message Queuing Protocol (AMQP)
- HTTP
- Apache Kafka

See the following table for the outbound ports you need to open to use these protocols to communicate with Azure Event Hubs. 

| Protocol | Ports | Details | 
| -------- | ----- | ------- | 
| AMQP | 5671 and 5672 | See [AMQP protocol guide](../service-bus-messaging/service-bus-amqp-protocol-guide.md) | 
| HTTP, HTTPS | 80, 443 |  |
| Kafka | 9093 | See [Use Event Hubs from Kafka applications](event-hubs-for-kafka-ecosystem-overview.md)

### What IP addresses do I need to whitelist?
To find the right IP addresses to white list for your connections, follow these steps:

1. Run the following command from a command prompt: 

    ```
    nslookup <YourNamespaceName>.servicebus.windows.net
    ```
2. Note down the IP address returned in `Non-authoritative answer`. The only time it would change is if you restore the namespace on to a different cluster.

If you use the zone redundancy for your namespace, you need to do a few additional steps: 

1. First, you run nslookup on the namespace.

    ```
    nslookup <yournamespace>.servicebus.windows.net
    ```
2. Note down the name in the **non-authoritative answer** section, which is in one of the following formats: 

    ```
    <name>-s1.cloudapp.net
    <name>-s2.cloudapp.net
    <name>-s3.cloudapp.net
    ```
3. Run nslookup for each one with suffixes s1, s2, and s3 to get the IP addresses of all three instances running in three availability zones, 

### Where can I find client IP sending or receiving msgs to my namespace?
First, enable [IP filtering](event-hubs-ip-filtering.md) on the namespace. 

Then, Enable diagnostic logs for [Event Hubs virtual network connection events](event-hubs-diagnostic-logs.md#event-hubs-virtual-network-connection-event-schema) by following instructions in the [Enable diagnostic logs](event-hubs-diagnostic-logs.md#enable-diagnostic-logs). You will see the IP address for which connection is denied.

```json
{
    "SubscriptionId": "0000000-0000-0000-0000-000000000000",
    "NamespaceName": "namespace-name",
    "IPAddress": "1.2.3.4",
    "Action": "Deny Connection",
    "Reason": "IPAddress doesn't belong to a subnet with Service Endpoint enabled.",
    "Count": "65",
    "ResourceId": "/subscriptions/0000000-0000-0000-0000-000000000000/resourcegroups/testrg/providers/microsoft.eventhub/namespaces/namespace-name",
    "Category": "EventHubVNetConnectionEvent"
}
```

## Apache Kafka integration

### How do I integrate my existing Kafka application with Event Hubs?
Event Hubs provides a Kafka endpoint that can be used by your existing Apache Kafka based applications. A configuration change is all that is required to have the PaaS Kafka experience. It provides an alternative to running your own Kafka cluster. Event Hubs supports Apache Kafka 1.0 and newer client versions and works with your existing Kafka applications, tools, and frameworks. For more information, see [Event Hubs for Kafka repo](https://github.com/Azure/azure-event-hubs-for-kafka).

### What configuration changes need to be done for my existing application to talk to Event Hubs?
To connect to an event hub, you'll need to update the Kafka client configs. It's done by creating an Event Hubs namespace and obtaining the [connection string](event-hubs-get-connection-string.md). Change the bootstrap.servers to point the Event Hubs FQDN and the port to 9093. Update the sasl.jaas.config to direct the Kafka client to your Event Hubs endpoint (which is the connection string you've obtained), with correct authentication as shown below:

bootstrap.servers={YOUR.EVENTHUBS.FQDN}:9093
request.timeout.ms=60000
security.protocol=SASL_SSL
sasl.mechanism=PLAIN
sasl.jaas.config=org.apache.kafka.common.security.plain.PlainLoginModule required username="$ConnectionString" password="{YOUR.EVENTHUBS.CONNECTION.STRING}";

Example:

bootstrap.servers=dummynamespace.servicebus.windows.net:9093
request.timeout.ms=60000
security.protocol=SASL_SSL
sasl.mechanism=PLAIN
sasl.jaas.config=org.apache.kafka.common.security.plain.PlainLoginModule required username="$ConnectionString" password="Endpoint=sb://dummynamespace.servicebus.windows.net/;SharedAccessKeyName=DummyAccessKeyName;SharedAccessKey=5dOntTRytoC24opYThisAsit3is2B+OGY1US/fuL3ly=";

Note: If sasl.jaas.config isn't a supported configuration in your framework, find the configurations that are used to set the SASL username and password and use those instead. Set the username to $ConnectionString and the password to your Event Hubs connection string.

### What is the message/event size for Event Hubs?
The maximum message size allowed for Event Hubs is 1 MB.

## Throughput units

### What are Event Hubs throughput units?
Throughput in Event Hubs defines the amount of data in mega bytes or the number (in thousands) of 1-KB events that ingress and egress through Event Hubs. This throughput is measured in throughput units (TUs). Purchase TUs before you can start using the Event Hubs service. You can explicitly select Event Hubs TUs either by using portal or Event Hubs Resource Manager templates. 


### Do throughput units apply to all event hubs in a namespace?
Yes, throughput units (TUs) apply to all event hubs in an Event Hubs namespace. It means that you purchase TUs at the namespace level and are shared among the event hubs under that namespace. Each TU entitles the namespace to the following capabilities:

- Up to 1 MB per second of ingress events (events sent into an event hub), but no more than 1000 ingress events, management operations, or control API calls per second.
- Up to 2 MB per second of egress events (events consumed from an event hub), but no more than 4096 egress events.
- Up to 84 GB of event storage (enough for the default 24-hour retention period).

### How are throughput units billed?
Throughput units (TUs) are billed on an hourly basis. The billing is based on the maximum number of units that was selected during the given hour. 

### How can I optimize the usage on my throughput units?
You can start as low as one throughput unit (TU), and turn on [auto-inflate](event-hubs-auto-inflate.md). The auto-inflate feature lets you grow your TUs as your traffic/payload increases. You can also set an upper limit on the number of TUs.

### How does Auto-inflate feature of Event Hubs work?
The auto-inflate feature lets you scale up your throughput units (TUs). It means that you can start by purchasing low TUs and auto-inflate scales up your TUs as your ingress increases. It gives you a cost-effective option and complete control of the number of TUs to manage. This feature is a **scale-up only** feature, and you can completely control the scaling down of the number of TUs by updating it. 

You may want to start with low throughput units (TUs), for example, 2 TUs. If you predict that your traffic may grow to 15 TUs, turn-on the auto-inflate feature on your namespace, and set the max limit to 15 TUs. You can now grow your TUs automatically as your traffic grows.

### Is there a cost associated when I turn on the auto-inflate feature?
There's **no cost** associated with this feature. 

### How are throughput limits enforced?
If the total **ingress** throughput or the total ingress event rate across all event hubs in a namespace exceeds the aggregate throughput unit allowances, senders are throttled and receive errors indicating that the ingress quota has been exceeded.

If the total **egress** throughput or the total event egress rate across all event hubs in a namespace exceeds the aggregate throughput unit allowances, receivers are throttled but no throttling errors are generated. 

Ingress and egress quotas are enforced separately, so that no sender can cause event consumption to slow down, nor can a receiver prevent events from being sent into an event hub.

### Is there a limit on the number of throughput units (TUs) that can be reserved/selected?
On a multi-tenant offering, throughput units can grow up to 40 TUs (you can select up to 20 TUs in the portal, and raise a support ticket to raise it to 40 TUs on the same namespace). Beyond 40 TUs, Event Hubs offers the resource/capacity-based model called the **Event Hubs Dedicated clusters**. Dedicated clusters are sold in Capacity Units (CUs).

## Dedicated clusters

### What are Event Hubs Dedicated clusters?
Event Hubs Dedicated clusters offer single-tenant deployments for customers with most demanding requirements. This offering builds a capacity-based cluster that is not bound by throughput units. It means that you could use the cluster to ingest and stream your data as dictated by the CPU and memory usage of the cluster. For more information, see [Event Hubs Dedicated clusters](event-hubs-dedicated-overview.md).

### How much does a single capacity unit let me achieve?
For a dedicated cluster, how much you can ingest and stream depends on various factors such as your producers, consumers, the rate at which you're ingesting and processing, and much more. 

Following table shows the benchmark results that we achieved during our testing:

| Payload shape | Receivers | Ingress bandwidth| Ingress messages | Egress bandwidth | Egress messages | Total TUs | TUs per CU |
| ------------- | --------- | ---------------- | ------------------ | ----------------- | ------------------- | --------- | ---------- |
| Batches of 100x1KB | 2 | 400 MB/sec | 400k messages/sec | 800 MB/sec | 800k messages/sec | 400 TUs | 100 TUs | 
| Batches of 10x10KB | 2 | 666 MB/sec | 66.6k messages/sec | 1.33 GB/sec | 133k messages/sec | 666 TUs | 166 TUs |
| Batches of 6x32KB | 1 | 1.05 GB/sec | 34k messages / sec | 1.05 GB/sec | 34k messages/sec | 1000 TUs | 250 TUs |

In the testing, the following criteria was used:

- A dedicated Event Hubs cluster with four capacity units (CUs) was used. 
- The event hub used for ingestion had 200 partitions. 
- The data that was ingested was received by two receiver applications receiving from all partitions.

The results give you an idea of what can be achieved with a dedicated Event Hubs cluster. In addition, a dedicate cluster comes with the Event Hubs Capture enabled for your micro-batch and long-term retention scenarios.

### How do I create an Event Hubs Dedicated cluster?
You create an Event Hubs dedicated cluster by submitting a [quota increase support request](https://portal.azure.com/#create/Microsoft.Support) or by contacting the [Event Hubs team](mailto:askeventhubs@microsoft.com). It typically takes about two weeks to get the cluster deployed and handed over to be used by you. This process is temporary until a complete self-serve is made available through the Azure portal.

## Best practices

### How many partitions do I need?
The number of partitions is specified at creation and must be between 2 and 32. The partition count isn't changeable, so you should consider long-term scale when setting partition count. Partitions are a data organization mechanism that relates to the downstream parallelism required in consuming applications. The number of partitions in an event hub directly relates to the number of concurrent readers you expect to have. For more information on partitions, see [Partitions](event-hubs-features.md#partitions).

You may want to set it to be the highest possible value, which is 32, at the time of creation. Remember that having more than one partition will result in events sent to multiple partitions without retaining the order, unless you configure senders to only send to a single partition out of the 32 leaving the remaining 31 partitions redundant. In the former case, you'll have to read events across all 32 partitions. In the latter case, there's no obvious additional cost apart from the extra configuration you have to make on Event Processor Host.

Event Hubs is designed to allow a single partition reader per consumer group. In most use cases, the default setting of four partitions is sufficient. If you're looking to scale your event processing, you may want to consider adding additional partitions. There's no specific throughput limit on a partition, however the aggregate throughput in your namespace is limited by the number of throughput units. As you increase the number of throughput units in your namespace, you may want additional partitions to allow concurrent readers to achieve their own maximum throughput.

However, if you have a model in which your application has an affinity to a particular partition, increasing the number of partitions may not be of any benefit to you. For more information, see [availability and consistency](event-hubs-availability-and-consistency.md).

## Pricing

### Where can I find more pricing information?

For complete information about Event Hubs pricing, see the [Event Hubs pricing details](https://azure.microsoft.com/pricing/details/event-hubs/).

### Is there a charge for retaining Event Hubs events for more than 24 hours?

The Event Hubs Standard tier does allow message retention periods longer than 24 hours, for a maximum of seven days. If the size of the total number of stored events exceeds the storage allowance for the number of selected throughput units (84 GB per throughput unit), the size that exceeds the allowance is charged at the published Azure Blob storage rate. The storage allowance in each throughput unit covers all storage costs for retention periods of 24 hours (the default) even if the throughput unit is used up to the maximum ingress allowance.

### How is the Event Hubs storage size calculated and charged?

The total size of all stored events, including any internal overhead for event headers or on disk storage structures in all event hubs, is measured throughout the day. At the end of the day, the peak storage size is calculated. The daily storage allowance is calculated based on the minimum number of throughput units that were selected during the day (each throughput unit provides an allowance of 84 GB). If the total size exceeds the calculated daily storage allowance, the excess storage is billed using Azure Blob storage rates (at the **Locally Redundant Storage** rate).

### How are Event Hubs ingress events calculated?

Each event sent to an event hub counts as a billable message. An *ingress event* is defined as a unit of data that is less than or equal to 64 KB. Any event that is less than or equal to 64 KB in size is considered to be one billable event. If the event is greater than 64 KB, the number of billable events is calculated according to the event size, in multiples of 64 KB. For example, an 8-KB event sent to the event hub is billed as one event, but a 96-KB message sent to the event hub is billed as two events.

Events consumed from an event hub, as well as management operations and control calls such as checkpoints, are not counted as billable ingress events, but accrue up to the throughput unit allowance.

### Do brokered connection charges apply to Event Hubs?

Connection charges apply only when the AMQP protocol is used. There are no connection charges for sending events using HTTP, regardless of the number of sending systems or devices. If you plan to use AMQP (for example, to achieve more efficient event streaming or to enable bi-directional communication in IoT command and control scenarios), see the [Event Hubs pricing information](https://azure.microsoft.com/pricing/details/event-hubs/) page for details about how many connections are included in each service tier.

### How is Event Hubs Capture billed?

Capture is enabled when any event hub in the namespace has the Capture option enabled. Event Hubs Capture is billed hourly per purchased throughput unit. As the throughput unit count is increased or decreased, Event Hubs Capture billing reflects these changes in whole hour increments. For more information about Event Hubs Capture billing, see [Event Hubs pricing information](https://azure.microsoft.com/pricing/details/event-hubs/).

### Do I get billed for the storage account I select for Event Hubs Capture?

Capture uses a storage account you provide when enabled on an event hub. As it is your storage account, any changes for this configuration are billed to your Azure subscription.

## Quotas

### Are there any quotas associated with Event Hubs?

For a list of all Event Hubs quotas, see [quotas](event-hubs-quotas.md).

## Troubleshooting

### Why am I not able to create a namespace after deleting it from another subscription? 
When you delete a namespace from a subscription, wait for 4 hours before recreating it with the same name in another subscription. Otherwise, you may receive the following error message: `Namespace already exists`. 

### What are some of the exceptions generated by Event Hubs and their suggested actions?

For a list of possible Event Hubs exceptions, see [Exceptions overview](event-hubs-messaging-exceptions.md).

### Diagnostic logs

Event Hubs supports two types of [diagnostics logs](event-hubs-diagnostic-logs.md) - Capture error logs and operational logs - both of which are represented in json and can be turned on through the Azure portal.

### Support and SLA

Technical support for Event Hubs is available through the [Microsoft Q&A question page for Azure Service Bus](https://docs.microsoft.com/answers/topics/azure-service-bus.html). Billing and subscription management support is provided at no cost.

To learn more about our SLA, see the [Service Level Agreements](https://azure.microsoft.com/support/legal/sla/) page.

## Next steps

You can learn more about Event Hubs by visiting the following links:

* [Event Hubs overview](event-hubs-what-is-event-hubs.md)
* [Create an Event Hub](event-hubs-create.md)
* [Event Hubs Auto-inflate](event-hubs-auto-inflate.md)

---
title: Frequently asked questions - Azure Event Hubs | Microsoft Docs
description: This article provides a list of frequently asked questions (FAQ) for Azure Event Hubs and their answers. 
ms.topic: article
ms.date: 01/20/2021
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

### Can I use a single Advanced Message Queuing Protocol (AMQP) connection to send and receive from multiple event hubs?

Yes, as long as all the event hubs are in the same namespace.

### What is the maximum retention period for events?

Event Hubs Standard tier currently supports a maximum retention period of seven days. Event hubs aren't intended as a permanent data store. Retention periods greater than 24 hours are intended for scenarios in which it's convenient to replay an event stream into the same systems. For example, to train or verify a new machine learning model on existing data. If you need message retention beyond seven days, enabling [Event Hubs Capture](event-hubs-capture-overview.md) on your event hub pulls the data from your event hub into the Storage account or Azure Data Lake Service account of your choosing. Enabling Capture incurs a charge based on your purchased throughput units.

You can configure the retention period for the captured data on your storage account. The **lifecycle management** feature of Azure Storage offers a rich, rule-based policy for general purpose v2 and blob storage accounts. Use the policy to transition your data to the appropriate access tiers or expire at the end of the data's lifecycle. For more information, see [Manage the Azure Blob storage lifecycle](../storage/blobs/storage-lifecycle-management-concepts.md). 

### How do I monitor my Event Hubs?
Event Hubs emits exhaustive metrics that provide the state of your resources to [Azure Monitor](../azure-monitor/overview.md). They also let you assess the overall health of the Event Hubs service not only at the namespace level but also at the entity level. Learn about what monitoring is offered for [Azure Event Hubs](event-hubs-metrics-azure-monitor.md).

### <a name="in-region-data-residency"></a>Where does Azure Event Hubs store data?
Azure Event Hubs standard and dedicated tiers store metadata and data in regions that you select. When geo-disaster recovery is set up for an Azure Event Hubs namespace, metadata is copied over to the secondary region that you select. Therefore, this service automatically satisfies the region data residency requirements including the ones specified in the [Trust Center](https://azuredatacentermap.azurewebsites.net/).

[!INCLUDE [event-hubs-connectivity](../../includes/event-hubs-connectivity.md)]

## Apache Kafka integration

### How do I integrate my existing Kafka application with Event Hubs?
Event Hubs provides a Kafka endpoint that can be used by your existing Apache Kafka based applications. A configuration change is all that is required to have the PaaS Kafka experience. It provides an alternative to running your own Kafka cluster. Event Hubs supports Apache Kafka 1.0 and newer client versions and works with your existing Kafka applications, tools, and frameworks. For more information, see [Event Hubs for Kafka repo](https://github.com/Azure/azure-event-hubs-for-kafka).

### What configuration changes need to be done for my existing application to talk to Event Hubs?
To connect to an event hub, you'll need to update the Kafka client configs. It's done by creating an Event Hubs namespace and obtaining the [connection string](event-hubs-get-connection-string.md). Change the bootstrap.servers to point the Event Hubs FQDN and the port to 9093. Update the sasl.jaas.config to direct the Kafka client to your Event Hubs endpoint (which is the connection string you've obtained), with correct authentication as shown below:

```properties
bootstrap.servers={YOUR.EVENTHUBS.FQDN}:9093
request.timeout.ms=60000
security.protocol=SASL_SSL
sasl.mechanism=PLAIN
sasl.jaas.config=org.apache.kafka.common.security.plain.PlainLoginModule required username="$ConnectionString" password="{YOUR.EVENTHUBS.CONNECTION.STRING}";
```

Example:

```properties
bootstrap.servers=dummynamespace.servicebus.windows.net:9093
request.timeout.ms=60000
security.protocol=SASL_SSL
sasl.mechanism=PLAIN
sasl.jaas.config=org.apache.kafka.common.security.plain.PlainLoginModule required username="$ConnectionString" password="Endpoint=sb://dummynamespace.servicebus.windows.net/;SharedAccessKeyName=DummyAccessKeyName;SharedAccessKey=XXXXXXXXXXXXXXXXXXXXX";
```
Note: If sasl.jaas.config isn't a supported configuration in your framework, find the configurations that are used to set the SASL username and password and use them instead. Set the username to $ConnectionString and the password to your Event Hubs connection string.

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

### Is there a limit on the number of throughput units that can be reserved/selected?

When creating a basic or a standard tier namespace in the Azure portal, you can select up to 20 TUs for the namespace. To raise it to **exactly** 40 TUs, submit a  [support request](../azure-portal/supportability/how-to-create-azure-support-request.md).  

1. On the **Event Bus Namespace** page, select **New support request** on the left menu. 
1. On the **New support request** page, follow these steps:
    1. For **Summary**, describe the issue in a few words. 
    1. For **Problem type**, select **Quota**. 
    1. For **Problem subtype**, select **Request for throughput unit increase or decrease**. 
    
        :::image type="content" source="./media/event-hubs-faq/support-request-throughput-units.png" alt-text="Support request page":::

Beyond 40 TUs, Event Hubs offers the resource/capacity-based model called the Event Hubs Dedicated clusters. Dedicated clusters are sold in Capacity Units (CUs). For more information, see [Event Hubs Dedicated - overview](event-hubs-dedicated-overview.md).

## Dedicated clusters

### What are Event Hubs Dedicated clusters?
Event Hubs Dedicated clusters offer single-tenant deployments for customers with most demanding requirements. This offering builds a capacity-based cluster that is not bound by throughput units. It means that you could use the cluster to ingest and stream your data as dictated by the CPU and memory usage of the cluster. For more information, see [Event Hubs Dedicated clusters](event-hubs-dedicated-overview.md).

### How do I create an Event Hubs Dedicated cluster?
For step-by-step instructions and more information on setting up an Event Hubs dedicated cluster, see the [Quickstart: Create a dedicated Event Hubs cluster using Azure portal](event-hubs-dedicated-cluster-create-portal.md). 


[!INCLUDE [event-hubs-dedicated-clusters-faq](../../includes/event-hubs-dedicated-clusters-faq.md)]


## Partitions

### How many partitions do I need?
The number of partitions is specified at creation and must be between 1 and 32. The partition count isn't changeable in all tiers except the [dedicated tier](event-hubs-dedicated-overview.md), so you should consider long-term scale when setting partition count. Partitions are a data organization mechanism that relates to the downstream parallelism required in consuming applications. The number of partitions in an event hub directly relates to the number of concurrent readers you expect to have. For more information on partitions, see [Partitions](event-hubs-features.md#partitions).

You may want to set it to be the highest possible value, which is 32, at the time of creation. Remember that having more than one partition will result in events sent to multiple partitions without retaining the order, unless you configure senders to only send to a single partition out of the 32 leaving the remaining 31 partitions redundant. In the former case, you'll have to read events across all 32 partitions. In the latter case, there's no obvious additional cost apart from the extra configuration you have to make on Event Processor Host.

Event Hubs is designed to allow a single partition reader per consumer group. In most use cases, the default setting of four partitions is sufficient. If you're looking to scale your event processing, you may want to consider adding additional partitions. There's no specific throughput limit on a partition, however the aggregate throughput in your namespace is limited by the number of throughput units. As you increase the number of throughput units in your namespace, you may want additional partitions to allow concurrent readers to achieve their own maximum throughput.

However, if you have a model in which your application has an affinity to a particular partition, increasing the number of partitions may not be of any benefit to you. For more information, see [availability and consistency](event-hubs-availability-and-consistency.md).

### Increase partitions
You can request for the partition count to be increased to 40 (exact) by submitting a support request. 

1. On the **Event Bus Namespace** page, select **New support request** on the left menu. 
1. On the **New support request** page, follow these steps:
    1. For **Summary**, describe the issue in a few words. 
    1. For **Problem type**, select **Quota**. 
    1. For **Problem subtype**, select **Request for partition change**. 
    
        :::image type="content" source="./media/event-hubs-faq/support-request-increase-partitions.png" alt-text="Increase partition count":::

The partition count can be increased to exactly 40. In this case, number of TUs also have to be increased to 40. If you decide later to lower the TU limit back to <= 20, the maximum partition limit is also decreased to 32. 

The decrease in partitions doesn't affect existing event hubs because partitions are applied at the event hub level and they're immutable after creation of the hub. 

## Pricing

### Where can I find more pricing information?

For complete information about Event Hubs pricing, see the [Event Hubs pricing details](https://azure.microsoft.com/pricing/details/event-hubs/).

### Is there a charge for retaining Event Hubs events for more than 24 hours?

The Event Hubs Standard tier does allow message retention periods longer than 24 hours, for a maximum of seven days. If the size of the total number of stored events exceeds the storage allowance for the number of selected throughput units (84 GB per throughput unit), the size that exceeds the allowance is charged at the published Azure Blob storage rate. The storage allowance in each throughput unit covers all storage costs for retention periods of 24 hours (the default) even if the throughput unit is used up to the maximum ingress allowance.

### How is the Event Hubs storage size calculated and charged?

The total size of all stored events, including any internal overhead for event headers or on disk storage structures in all event hubs, is measured throughout the day. At the end of the day, the peak storage size is calculated. The daily storage allowance is calculated based on the minimum number of throughput units that were selected during the day (each throughput unit provides an allowance of 84 GB). If the total size exceeds the calculated daily storage allowance, the excess storage is billed using Azure Blob storage rates (at the **Locally Redundant Storage** rate).

### How are Event Hubs ingress events calculated?

Each event sent to an event hub counts as a billable message. An *ingress event* is defined as a unit of data that is less than or equal to 64 KB. Any event that is less than or equal to 64 KB in size is considered to be one billable event. If the event is greater than 64 KB, the number of billable events is calculated according to the event size, in multiples of 64 KB. For example, an 8-KB event sent to the event hub is billed as one event, but a 96-KB message sent to the event hub is billed as two events.

Events consumed from an event hub, and management operations and control calls such as checkpoints, aren't counted as billable ingress events, but accrue up to the throughput unit allowance.

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

Technical support for Event Hubs is available through the [Microsoft Q&A question page for Azure Service Bus](/answers/topics/azure-service-bus.html). Billing and subscription management support is provided at no cost.

To learn more about our SLA, see the [Service Level Agreements](https://azure.microsoft.com/support/legal/sla/) page.

## Azure Stack Hub

### How can I target a specific version of Azure Storage SDK when using Azure Blob Storage as a checkpoint store?
If you run this code on Azure Stack Hub, you'll experience runtime errors unless you target a specific Storage API version. That's because the Event Hubs SDK uses the latest available Azure Storage API available in  Azure that may not be available on your Azure Stack Hub platform. Azure Stack Hub may support a different version of Storage Blob SDK than that are typically available on Azure. If you're using Azure Blog Storage as a checkpoint store, check the [supported Azure Storage API version for your Azure Stack Hub build](/azure-stack/user/azure-stack-acs-differences?#api-version) and target that version in your code. 

For example, If you're running on Azure Stack Hub version 2005, the highest available version for the Storage service is version 2019-02-02. By default, the Event Hubs SDK client library uses the highest available version on Azure (2019-07-07 at the time of the release of the SDK). In this case, besides following steps in this section, you'll also need to add code to target the Storage service API version 2019-02-02. For an example on how to target a specific Storage API version, see the following samples for C#, Java, Python, and JavaScript/TypeScript.  

For an example on how to target a specific Storage API version from your code, see the following samples on GitHub: 

- [.NET](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/eventhub/Azure.Messaging.EventHubs.Processor/samples/)
- [Java](https://github.com/Azure/azure-sdk-for-java/blob/master/sdk/eventhubs/azure-messaging-eventhubs-checkpointstore-blob/src/samples/java/com/azure/messaging/eventhubs/checkpointstore/blob/EventProcessorWithCustomStorageVersion.java)
- Python - [Synchronous](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/eventhub/azure-eventhub-checkpointstoreblob/samples/receive_events_using_checkpoint_store_storage_api_version.py), [Asynchronous](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/eventhub/azure-eventhub-checkpointstoreblob-aio/samples/receive_events_using_checkpoint_store_storage_api_version_async.py)
- [JavaScript](https://github.com/Azure/azure-sdk-for-js/blob/master/sdk/eventhub/eventhubs-checkpointstore-blob/samples/javascript/receiveEventsWithApiSpecificStorage.js) and [TypeScript](https://github.com/Azure/azure-sdk-for-js/blob/master/sdk/eventhub/eventhubs-checkpointstore-blob/samples/typescript/src/receiveEventsWithApiSpecificStorage.ts)

## Next steps

You can learn more about Event Hubs by visiting the following links:

* [Event Hubs overview](./event-hubs-about.md)
* [Create an Event Hub](event-hubs-create.md)
* [Event Hubs Auto-inflate](event-hubs-auto-inflate.md)

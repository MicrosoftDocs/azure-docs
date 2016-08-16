<properties 
    pageTitle="Event Hubs availability and support | Microsoft Azure"
    description="Event Hubs availability and support FAQ."
    services="event-hubs"
    documentationCenter="na"
    authors="sethmanheim"
    manager="timlt"
    editor="" />
<tags 
    ms.service="event-hubs"
    ms.devlang="na"
    ms.topic="article"
    ms.tgt_pltfrm="na"
    ms.workload="na"
    ms.date="04/14/2016"
    ms.author="sethm" />

# Event Hubs availability and support FAQ

Event Hubs provides large-scale intake, persistence and processing of data events from high-throughput data sources and/or millions of devices. When paired with Service Bus queues and topics, Event Hubs enables persistent command and control deployments for [Internet of Things (IoT)](https://azure.microsoft.com/services/iot-hub/) scenarios.

This article discusses Event Hubs availability information and answers some frequently-asked questions:

## Pricing information

For complete information about Event Hubs pricing, see the [Event Hubs pricing details](https://azure.microsoft.com/pricing/details/event-hubs/).

## How are Event Hubs ingress events calculated?

Each event sent to an Event Hub counts as a billable message. An *ingress event* is defined as a unit of data that is less than or equal to 64KB. Any event that is less than or equal to 64KB in size is considered to be one billable event. If the event is greater than 64KB, the number of billable events is calculated according to the event size, in multiples of 64KB. For example, an 8 KB event sent to the Event Hub is billed as one event, but a 96 KB message sent to the Event Hub is billed as two events.

Events consumed from an Event Hub, as well as management operations and control calls such as checkpoints, are not counted as billable ingress events, but accrue up to the throughput unit allowance.

## What are Event Hubs throughput units?

Event Hubs throughput units are explicitly selected by the user, either through the Azure classic portal or Event Hubs resource manager templates. Throughput units apply to all Event Hubs in a Service Bus namespace, and each throughput unit entitles the namespace to the following capabilities:

- Up to 1 MB per second of ingress events (events sent into an Event Hub), but no more than 1000 ingress events, management operations or control API calls per second.

- Up to 2 MB per second of egress events (events consumed from an Event Hub).

- Up to 84 GB of event storage (sufficient for the default 24-hour retention period).

Event Hubs throughput units are billed hourly, based on the maximum number of units selected during the given hour.

## How are Event Hubs throughput unit limits enforced?

If the total ingress throughput or the total ingress event rate across all Event Hubs in a namespace exceeds the aggregate throughput unit allowances, senders will be throttled and receive errors indicating that the ingress quota has been exceeded.

If the total egress throughput or the total event egress rate across all Event Hubs in a namespace exceeds the aggregate throughput unit allowances, receivers are throttled and receive errors indicating that the egress quota has been exceeded. Ingress and egress quotas are enforced separately, so that no sender can cause event consumption to slow down, nor can a receiver prevent events from being sent into an Event Hub.

Note that the throughput unit selection is independent of the number of Event Hubs partitions. While each partition offers a maximum throughput of 1 MB per second ingress (with a maximum of 1000 events per second), and 2 MB per second egress, there is no fixed charge for the partitions themselves. The charge is for the aggregated throughput units on all Event Hubs in a Service Bus namespace. With this pattern, you can create enough partitions to support the anticipated maximum load for their systems, without incurring any throughput unit charges until the event load on the system actually requires higher throughput numbers, and without having to change the structure and architecture of your systems as the load on the system increases.

## Is there a limit on the number of throughput units that can be selected?

There is a default quota of 20 throughput units per namespace. You can request a larger quota of throughput units by filing a support ticket. Beyond the 20 throughput unit limit, bundles are available in 20 and 100 throughput units. Note that using more than 20 throughput units removes the ability to change the number of throughput units without filing a support ticket.

## Is there a charge for retaining Event Hubs events for more than 24 hours?

The Event Hubs Standard tier does allow message retention periods longer than 24 hours, for a maximum of 30 days. If the size of the total amount of stored events exceeds the storage allowance for the number of selected throughput units (84GB per throughput unit), the size that exceeds the allowance is charged at the published Azure Blob storage rate. The storage allowance in each throughput unit covers all storage costs for retention periods of 24 hours (the default) even if the throughput unit is used up to the maximum ingress allowance.

## What is the maximum retention period?

Event Hubs Standard tier currently supports a maximum retention period of 7 days. Note that Event Hubs are not intended as a permanent data store. Retention periods greater than 24 hours are intended for scenarios in which it is convenient to replay an event stream into the same systems; for example, to train or verify a new machine learning model on existing data.

## How is the Event Hubs storage size calculated and charged?

The total size of all stored events, including any internal overhead for event headers or on disk storage structures in all Event Hubs, is measured throughout the day. At the end of the day, the peak storage size is calculated. The daily storage allowance is calculated based on the minimum number of throughput units that were selected during the day (each throughput unit provides an allowance of 84 GB). If the total size exceeds the calculated daily storage allowance, the excess storage is billed using Azure Blob storage rates (at the **Locally Redundant Storage** rate).

## Can I use a single AMQP connection to send and receive from Event Hubs and Service Bus queues/topics?

Yes, as long as all the Event Hubs, queues, and topics are in the same Service Bus namespace. As such, you can implement bi-directional, brokered connectivity to many devices, with sub-second latencies, in a cost-effective and highly scalable way.

## Do brokered connection charges apply to Event Hubs?

For senders, connection charges apply only when the AMQP protocol is used. There are no connection charges for sending events using HTTP, regardless of the number of sending systems or devices. If you plan to use AMQP (for example, to achieve more efficient event streaming or to enable bi-directional communication in IoT command and control scenarios), please refer to the [Service Bus pricing information](https://azure.microsoft.com/pricing/details/service-bus/) page for information about what constitutes a brokered connection, and how they are metered.

## What is the difference between Event Hubs Basic and Standard tiers?

Event Hubs Standard tier provides features beyond what is available in Event Hubs Basic, as well as in some competitive systems. These features include retention periods of more than 24 hours, and the ability to use a single AMQP connection to send commands to large numbers of devices with sub-second latencies, as well as to send telemetry from those devices into Event Hubs. For the list of features, see the [Event Hubs pricing details](https://azure.microsoft.com/pricing/details/event-hubs/).

## Geographic availability

Event Hubs is available in the following regions:

|Geo|Regions|
|---|---|
|United States|Central US, East US, East US 2, South Central US, West US|
|Europe|North Europe, West Europe|
|Asia Pacific|East Asia, Southeast Asia|
|Japan|Japan East, Japan West|
|Brazil|Brazil South|
|Australia|Australia East, Australia Southeast|

## Support and SLA

Technical support for Event Hubs is available through the [community forums](https://social.msdn.microsoft.com/forums/azure/home). Billing and subscription management support is provided at no cost.

To learn more about our SLA, please visit the [Service Level Agreements](https://azure.microsoft.com/support/legal/sla/) page.

## Next steps

To learn more about Event Hubs, see the following articles:

- [Event Hubs overview][].
- A complete [sample application that uses Event Hubs][].
- A [queued messaging solution][] using Service Bus queues.

[Event Hubs overview]: event-hubs-overview.md
[sample application that uses Event Hubs]: https://code.msdn.microsoft.com/Service-Bus-Event-Hub-286fd097
[queued messaging solution]: ../service-bus/service-bus-dotnet-multi-tier-app-using-service-bus-queues.md

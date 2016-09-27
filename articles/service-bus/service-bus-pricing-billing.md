<properties 
    pageTitle="Service Bus pricing and billing | Microsoft Azure"
    description="Overview of Service Bus pricing structure."
    services="service-bus"
    documentationCenter="na"
    authors="sethmanheim"
    manager="timlt"
    editor="" />
<tags 
    ms.service="service-bus"
    ms.devlang="na"
    ms.topic="article"
    ms.tgt_pltfrm="na"
    ms.workload="na"
    ms.date="06/13/2016"
    ms.author="sethm" />

# Service Bus pricing and billing

Service Bus is offered in Basic, Standard, and [Premium](service-bus-premium-messaging.md) tiers. You can choose a service tier for each Service Bus service namespace that you create, and this tier selection applies across all queues, topics/subscriptions, relays, and Event Hubs created within that namespace.

>[AZURE.NOTE] For detailed information about current Service Bus pricing, see the [Azure Service Bus pricing page](https://azure.microsoft.com/pricing/details/service-bus/), and the [Service Bus FAQ](service-bus-faq.md#service-bus-pricing).

Service Bus uses the following two meters for queues and topics/subscriptions:

1. **Messaging Operations**: Defined as API calls against queue or topic/subscription service endpoints. This meter will replace messages sent or received as the primary unit of billable usage for queues and topics/subscriptions.

2. **Brokered Connections**: Defined as the peak number of persistent connections open against queues, topics/subscriptions, or Event Hubs during a given one-hour sampling period. This meter will only apply in the Standard tier, in which you can open additional connections (previously, connections were limited to 100 per queue/topic/subscription) for a nominal per-connection fee.

The **Standard** tier introduces graduated pricing for operations performed with queues and topics/subscriptions, resulting in volume-based discounts of up to 80% at the highest usage levels. There is also a Standard tier base charge of $10 per month, which enables you to perform up to 12.5 million operations per month at no additional cost.

The **Premium** tier provides resource isolation at the CPU and memory layer so that each customer workload runs in isolation. This resource container is called a *messaging unit*. Each premium namespace is allocated at least one messaging unit. You can purchase 1, 2, or 4 messaging units for each Service Bus Premium namespace. A single workload or entity can span multiple messaging units and the number of messaging units can be changed at will, although billing is in 24-hour or daily rate charges. The result is predictable and repeatable performance for your Service Bus-based solution. Not only is this performance more predictable and available, but it is also faster. Azure Service Bus Premium messaging builds on the storage engine introduced in Azure Event Hubs. With Premium messaging, peak performance is much faster than the Standard tier.

Note that the standard base charge is charged only once per month per Azure subscription. This means that after you create a single Standard or Premium tier Service Bus namespace, you will be able to create as many additional Standard or Premium tier namespaces as you want under that same Azure subscription, without incurring additional base charges.

All existing Service Bus namespaces created prior to November 1, 2014 were automatically placed into the Standard tier. This ensures that you continue to have access to all features currently available with Service Bus. Subsequently, you can use the [Azure classic portal][] to downgrade to the Basic tier if desired.

The following table summarizes the functional differences between the Basic and Standard/Premium tiers.

|Capability|Basic|Standard/Premium|
|---|---|---|
|Event Hubs|Yes|Yes|
|Queues|Yes|Yes|
|Scheduled messages|Yes|Yes|
|Topics/Subscriptions|No|Yes|
|Relays|No|Yes|
|Transactions|No|Yes|
|De-Duplication|No|Yes|
|Sessions|No|Yes|
|Large messages|No|Yes|
|ForwardTo|No|Yes|
|SendVia|No|Yes|
|Brokered connections (included)|100 per Service Bus namespace|1,000 per Azure subscription|
|Brokered connections (overage allowed)|No|Yes (billable)|

## Messaging operations

As part of the new pricing model, billing for queues and topics/subscriptions is changing. These entities are transitioning from billing per message to billing per operation. An "operation" refers to any API call made against a queue or topic/subscription service endpoint. This includes management, send/receive, and session state operations.

|Operation Type|Description|
|---|---|
|Management|Create, Read, Update, Delete (CRUD) against queues or topics/subscriptions.|
|Messaging|Sending and receiving messages with queues or topics/subscriptions.|
|Session state|Getting or setting session state on a queue or topic/subscription.|

The following prices were effective starting November 1, 2014:

|Basic|Cost|
|---|---|
|Operations|$0.05 per million operations|

|Standard|Cost|
|---|---|
|Base charge|$10/month|
|First 12.5 million operations/month|Included|
|12.5-100 million operations/month|$0.80 per million operations|
|100 million-2,500 million operations/month|$0.50 per million operations|
|Over 2,500 million operations/month|$0.20 per million operations|

>[AZURE.NOTE] Premium tier is currently in preview and the following price reflects a 50% preview discount.

|Premium|Cost|
|---|---|
|Daily|$11.13 fixed rate per Message Unit|

## Brokered connections

*Brokered connections* accommodate customer usage patterns that involve a large number of "persistently connected" senders/receivers against queues, topics/subscriptions or Event Hubs. Persistently connected senders/receivers are those that connect using either AMQP or HTTP with a non-zero receive timeout (for example, HTTP long polling). HTTP senders and receivers with an immediate timeout do not generate brokered connections.

Previously, queues and topics/subscriptions had a limit of 100 concurrent connections per URL. The current billing scheme removes the per-URL limit for queues and topics/subscriptions, and implements quotas and metering on brokered connections at the Service Bus namespace and Azure subscription levels.

The Basic tier includes, and is strictly limited to, 100 brokered connections per Service Bus namespace. Connections above this number will be rejected in the Basic tier. The Standard tier removes the per-namespace limit and counts aggregate brokered connection usage across the Azure subscription. In the Standard tier, 1,000 brokered connections per Azure subscription will be allowed at no extra cost (beyond the base charge). Using more than a total of 1,000 brokered connections across Standard-tier Service Bus namespaces in an Azure subscription will be billed on a graduated schedule, as shown in the following table.

|Brokered connections (Standard tier)|Cost|
|---|---|
|First 1,000/month|Included with base charge|
|1,000-100,000/month|$0.03 per connection/month|
|100,000-500,000/month|$0.025 per connection/month|
|Over 500,000/month|$0.015 per connection/month|

>[AZURE.NOTE] 1,000 brokered connections are included with the Standard messaging tier (via the base charge) and can be shared across all queues, topics/subscriptions and Event Hubs within the associated Azure subscription.

>[AZURE.NOTE] Billing is based on the peak number of concurrent connections and is prorated hourly based on 744 hours per month.

|Premium Tier
|---|
|Brokered connections are not charged in the Premium tier.|

For more information about brokered connections, see the [FAQ](#faq) section later in this topic.

## Relay

Relays are available only in Standard tier namespaces. Otherwise, pricing and connection quotas for relays remain unchanged. This means that relays will continue to be charged on the number of messages (not operations), and relay hours.

|Relay pricing|Cost|
|---|---|
|Relay hours|$0.10 for every 100 relay hours|
|Messages|$0.01 for every 10,000 messages|

## FAQ

### How is the Relay Hours meter calculated?

See [this topic](service-bus-faq.md#how-is-the-relay-hours-meter-calculated).

### What are brokered connections and how do I get charged for them?

A brokered connection is defined as one of the following:

1. An AMQP connection from a client to a Service Bus topic/subscription, queue, or Event Hub.

2. An HTTP call to receive a message from a Service Bus topic or queue that has a receive timeout value greater than zero.

Service Bus charges for the peak number of concurrent brokered connections that exceed the included quantity (1,000 in the Standard tier). Peaks are measured on an hourly basis, prorated by dividing by 744 hours in a month, and added up over the monthly billing period. The included quantity (1,000 brokered connections per month) is applied at the end of the billing period against the sum of the prorated hourly peaks.

For example:

1. Each of 10,000 devices connect via a single AMQP connection, and receive commands from a Service Bus topic. The devices send telemetry events to an Event Hub. If all devices connect for 12 hours each day, the following connection charges apply (in addition to any other Service Bus topic charges): 10,000 connections * 12 hours * 31 days / 744 = 5,000 brokered connections. After the monthly allowance of 1,000 brokered connections, you would be charged for 4,000 brokered connections, at the rate of $0.03 per brokered connection, for a total of $120.

2. 10,000 devices receive messages from a Service Bus queue via HTTP, specifying a non-zero timeout. If all devices connect for 12 hours every day, you will see the following connection charges (in addition to any other Service Bus charges): 10,000 HTTP Receive connections * 12 hours per day * 31 days / 744 hours = 5,000 brokered connections.

### Do brokered connection charges apply to queues and topics/subscriptions?

Yes. There are no connection charges for sending events using HTTP, regardless of the number of sending systems or devices. Receiving events with HTTP using a timeout greater than zero, sometimes called "long polling," generates brokered connection charges. AMQP connections generate brokered connection charges regardless of whether the connections are being used to send or receive. Note that 100 brokered connections are allowed at no charge in a Basic namespace. This is also the maximum number of brokered connections allowed for the Azure subscription. The first 1,000 brokered connections across all Standard namespaces in an Azure subscription are included at no extra charge (beyond the base charge). Because these allowances are enough to cover many service-to-service messaging scenarios, brokered connection charges usually only become relevant if you plan to use AMQP or HTTP long-polling with a large number of clients; for example, to achieve more efficient event streaming or enable bi-directional communication with many devices or application instances.

## Next steps

- For more details about Service Bus pricing, see the [Azure Service Bus pricing page](https://azure.microsoft.com/pricing/details/service-bus/).

- See the [Service Bus FAQ](service-bus-faq.md#service-bus-pricing) for some common FAQs around Service bus pricing and billing.

[Azure classic portal]: http://manage.windowsazure.com
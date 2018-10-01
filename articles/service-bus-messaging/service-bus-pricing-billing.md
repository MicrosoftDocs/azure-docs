---
title: Service Bus pricing and billing | Microsoft Docs
description: Overview of Service Bus pricing structure.
services: service-bus-messaging
documentationcenter: na
author: spelluru
manager: timlt
editor: ''

ms.assetid: 7c45b112-e911-45ab-9203-a2e5abccd6e0
ms.service: service-bus-messaging
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 09/21/2018
ms.author: spelluru

---
# Service Bus pricing and billing

Azure Service Bus is offered in Standard and [Premium](service-bus-premium-messaging.md) tiers. You can choose a service tier for each Service Bus service namespace that you create, and this tier selection applies across all entities created within that namespace.

> [!NOTE]
> For detailed information about current Service Bus pricing, see the [Azure Service Bus pricing page](https://azure.microsoft.com/pricing/details/service-bus/), and the [Service Bus FAQ](service-bus-faq.md#pricing).
>
>

Service Bus uses the following 2 meters for queues and topics/subscriptions:

1. **Messaging Operations**: Defined as API calls against queue or topic/subscription service endpoints. This meter replaces messages sent or received as the primary unit of billable usage for queues and topics/subscriptions.
2. **Brokered Connections**: Defined as the peak number of persistent connections open against queues, topics, or subscriptions during a given one-hour sampling period. This meter only applies in the Standard tier, in which you can open additional connections (previously, connections were limited to 100 per queue/topic/subscription) for a nominal per-connection fee.

The **Standard** tier introduces graduated pricing for operations performed with queues and topics/subscriptions, resulting in volume-based discounts of up to 80% at the highest usage levels. There is also a Standard tier base charge of $10 per month, which enables you to perform up to 12.5 million operations per month at no additional cost.

The **Premium** tier provides resource isolation at the CPU and memory layer so that each customer workload runs in isolation. This resource container is called a *messaging unit*. Each premium namespace is allocated at least one messaging unit. You can purchase 1, 2, or 4 messaging units for each Service Bus Premium namespace. A single workload or entity can span multiple messaging units and the number of messaging units can be changed at will, although billing is in 24-hour or daily rate charges. The result is predictable and repeatable performance for your Service Bus-based solution. Not only is this performance more predictable and available, but it is also faster.

> [!NOTE]
> Topics and subscriptions are only available in the Standard or Premium pricing tiers; the Basic tier supports only queues.

The Standard tier base charge is charged only once per month per Azure subscription. This means that after you create a single Standard tier Service Bus namespace, you can create as many additional Standard namespaces as you want under that same Azure subscription, without incurring additional base charges.

The [Service Bus pricing](https://azure.microsoft.com/pricing/details/service-bus/) table summarizes the functional differences between the Standard and Premium tiers.

## Messaging operations

Queues and topics/subscriptions are billed per "operation," not per message. An operation refers to any API call made against a queue or topic/subscription service endpoint. This includes management, send/receive, and session state operations.

| Operation Type | Description |
| --- | --- |
| Management |Create, Read, Update, Delete (CRUD) against queues or topics/subscriptions. |
| Messaging |Send and receive messages with queues or topics/subscriptions. |
| Session state |Get or set session state on a queue or topic/subscription. |

For cost details, see the prices listed on the [Service Bus pricing](https://azure.microsoft.com/pricing/details/service-bus/) page.

## Brokered connections

*Brokered connections* accommodate usage patterns that involve a large number of "persistently connected" senders/receivers against queues, topics, or subscriptions. Persistently connected senders/receivers are those that connect using either AMQP or HTTP with a non-zero receive timeout (for example, HTTP long polling). HTTP senders and receivers with an immediate timeout do not generate brokered connections.

For connection quotas and other service limits, see the [Service Bus quotas](service-bus-quotas.md) article. For more information about brokered connections, see the [FAQ](#faq) section later in this article.

The Standard tier removes the per-namespace brokered connection limit and counts aggregate brokered connection usage across the Azure subscription. For more information, see the [Brokered connections](https://azure.microsoft.com/pricing/details/service-bus/) table.

> [!NOTE]
> 1,000 brokered connections are included with the Standard messaging tier (via the base charge) and can be shared across all queues, topics, and subscriptions within the associated Azure subscription.
>
>

<br />

> [!NOTE]
> Billing is based on the peak number of concurrent connections and is prorated hourly based on 744 hours per month.
>
>

### Premium Tier

Brokered connections are not charged in the Premium tier.

## FAQ

### What are brokered connections and how do I get charged for them?

A brokered connection is defined as one of the following:

1. An AMQP connection from a client to a Service Bus queue or topic/subscription.
2. An HTTP call to receive a message from a Service Bus topic or queue that has a receive timeout value greater than zero.

Service Bus charges for the peak number of concurrent brokered connections that exceed the included quantity (1,000 in the Standard tier). Peaks are measured on an hourly basis, prorated by dividing by 744 hours in a month, and added up over the monthly billing period. The included quantity (1,000 brokered connections per month) is applied at the end of the billing period against the sum of the prorated hourly peaks.

For example:

1. Each of 10,000 devices connects via a single AMQP connection, and receives commands from a Service Bus topic. The devices send telemetry events to an Event Hub. If all devices connect for 12 hours each day, the following connection charges apply (in addition to any other Service Bus topic charges): 10,000 connections * 12 hours * 31 days / 744 = 5,000 brokered connections. After the monthly allowance of 1,000 brokered connections, you would be charged for 4,000 brokered connections, at the rate of $0.03 per brokered connection, for a total of $120.
2. 10,000 devices receive messages from a Service Bus queue via HTTP, specifying a non-zero timeout. If all devices connect for 12 hours every day, you will see the following connection charges (in addition to any other Service Bus charges): 10,000 HTTP Receive connections * 12 hours per day * 31 days / 744 hours = 5,000 brokered connections.

### Do brokered connection charges apply to queues and topics/subscriptions?

Yes. There are no connection charges for sending events using HTTP, regardless of the number of sending systems or devices. Receiving events with HTTP using a timeout greater than zero, sometimes called "long polling," generates brokered connection charges. AMQP connections generate brokered connection charges regardless of whether the connections are being used to send or receive. The first 1,000 brokered connections across all Standard namespaces in an Azure subscription are included at no extra charge (beyond the base charge). Because these allowances are enough to cover many service-to-service messaging scenarios, brokered connection charges usually only become relevant if you plan to use AMQP or HTTP long-polling with a large number of clients; for example, to achieve more efficient event streaming or enable bi-directional communication with many devices or application instances.

## Next steps

* For complete details about Service Bus pricing, see the [Service Bus pricing page](https://azure.microsoft.com/pricing/details/service-bus/).
* See the [Service Bus FAQ](service-bus-faq.md#pricing) for some common FAQs about Service bus pricing and billing.

[Azure portal]: https://portal.azure.com

---
title: Overview of Azure Service Bus throttling | Microsoft Docs
description: Overview of Service Bus throttling - Standard and Premium tiers.
services: service-bus-messaging
author: axisc
manager: timlt
editor: spelluru

ms.service: service-bus-messaging
ms.topic: article
ms.date: 10/01/2019
ms.author: aschhab

---

# Throttling operations on Azure Service Bus

Cloud native solutions give a notion of *virtually* unlimited resources that can scale with your workload. While this is more true in the cloud than it is with on-premise systems, there are still limitations that exist in the cloud.

This article touches on these limitations and what can be done to work around them.

## Throttling in Azure Service Bus Standard tier

The Azure Service Bus Standard tier operates as a multi-tenant setup with a pay-as-you-go pricing model where customers may share the resources for their namespace with other namespaces that are setup in the same region. It is the recommended choice for developer, testing and QA environments along with low throughput production systems.

In the past, we've had coarse throttling limits, dependent on resource utilization, which in turn depends on the number of requests that are processed by the resources. However, there is an opportunity to refine this and provide predictable throttling behavior to all namespaces that are sharing these resources.

In an attempt to ensure fair usage and distribution of resources across all the Azure Service Bus Standard namespaces that use the same resources, we've recently polished our throttling logic to be token-based.

> [!NOTE]
> It is important to note that throttling is ***not new*** to Azure Service Bus, or any cloud native service.
>
> Token based throttling is simply refining the way various namespaces share resources in a multi-tenant Standard tier environment and thus enabling fair usage by all namespaces sharing the resources.

### What is token based throttling?

Token based throttling limits the number of operations that can be performed on a given namespace in a specific time period. 

This is the workflow - 

  * At the start of each time period, we provide a certain number of tokens to each namespace.
  * Any operations performed by the sender or receiver client applications will be counted against these tokens (and subtracted from the available tokens).
  * If the tokens are depleted, any subsequent operations will be throttled until the start of the next time period.
  * Tokens are replenished at the start of the next time period.

### What are the token limits?

The token limits are currently set to '1000' tokens every second (per namespace).

Not all operations are created equal. Here are the token costs of each of the operations - 

| Operation | Token cost|
|-----------|-----------|
| Data operations (Send, SendAsync, Receive, ReceiveAsync, Peek) |1 token per message |
| Management operations (Create, Read, Update, Delete on Queues, Topics, Subscriptions, Filters) | 10 tokens |

> [!IMPORTANT]
> While the current token limits are large, we will eventually be reducing the limits to ***30 credits per 1 second*** in a phased manner.
>
> It is recommended that when designing new solutions and architectures, the Azure Service Bus Standard tier throughput expectations should be ***30 operations/second***.

### How will I know that I'm being throttled?

When the client application requests are being throttled, the below server response will be received by your application and logged.

```
The request was terminated because the entity is being throttled. Error code: 50009. Please wait 2 seconds and try again.
```

### How can I avoid being throttled ?

## Throttling in Azure Service Bus Premium tier

The [Azure Service Bus Premium](service-bus-premium-messaging.md) tier allocates dedicated resources, in terms of messaging units, to each namespace setup by the customer. These dedicated resources provide predictable throughput and latency and is recommended for high throughput or sensitive production grade systems.

Additionally, it also enables customers to scale up their throughput capacity when they experience spikes in the workload.

### How does throttling work in Service Bus Premium ?

With exclusive resource allocation for Service Bus Premium, throttling is purely driven by the limitations of the resources allocated to the namespace.

If the number of requests is more than the namespace can handle, then the requests will be throttled.

### How will I know that I'm being throttled ?

There are various ways to identifying throttling in Azure Service Bus Premium - 
  * **Throttled Requests** show up on the [Azure Monitor Request metrics](service-bus-metrics-azure-monitor.md#request-metrics) to identify how many requests were throttled.
  * High **CPU Usage** indicates that current resource allocation is high and requests may get throttled if the current workload doesn't reduce.
  * High **Memory Usage** indicates that current resource allocation is high and requests may get throttled if the current workload doesn't reduce.

### How can I avoid being throttled ?

Since the Service Bus Premium namespace already has dedicated resources, you can reduce the possibility of getting throttled by scaling up the number of Messaging Units allocated to your namespace in the event of a spike in the workload.

Scaling up/down can be achieved by creating  [runbooks](../automation/automation-create-alert-triggered-runbook.md) that can be triggered by changes in the above metrics.

## FAQs

### How does throttling affect my application ?

### Does throttling result in data loss ?

## Next steps

For more information and examples of using Service Bus messaging, see the following advanced topics:

* [Service Bus messaging overview](service-bus-messaging-overview.md)
* [Quickstart: Send and receive messages using the Azure portal and .NET](service-bus-quickstart-portal.md)
* [Tutorial: Update inventory using Azure portal and topics/subscriptions](service-bus-tutorial-topics-subscriptions-portal.md)


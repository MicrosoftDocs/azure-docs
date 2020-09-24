---
title: Overview of Azure Service Bus throttling | Microsoft Docs
description: Overview of Service Bus throttling - Standard and Premium tiers.
ms.topic: article
ms.date: 06/23/2020
---

# Throttling operations on Azure Service Bus

Cloud native solutions give a notion of unlimited resources that can scale with your workload. While this notion is more true in the cloud than it is with on-premises systems, there are still limitations that exist in the cloud.

These limitations may cause throttling of client application requests in both Standard and Premium tiers as discussed in this article. 

## Throttling in Azure Service Bus Standard tier

The Azure Service Bus Standard tier operates as a multi-tenant setup with a pay-as-you-go pricing model. Here multiple namespaces in the same cluster share the allocated resources. Standard tier is the recommended choice for developer, testing, and QA environments along with low throughput production systems.

In the past, Azure Service Bus had coarse throttling limits strictly dependent on resource utilization. However, there is an opportunity to refine the throttling logic and provide predictable throttling behavior to all namespaces that are sharing these resources.

In an attempt to ensure fair usage and distribution of resources across all the Azure Service Bus Standard namespaces that use the same resources, the throttling logic has been modified to be credit-based.

> [!NOTE]
> It is important to note that throttling is ***not new*** to Azure Service Bus, or any cloud native service.
>
> Credit based throttling is simply refining the way various namespaces share resources in a multi-tenant Standard tier environment and thus enabling fair usage by all namespaces sharing the resources.

### What is credit-based throttling?

Credit-based throttling limits the number of operations that can be performed on a given namespace in a specific time period. 

Below is the workflow for credit-based throttling - 

  * At the start of each time period, we provide a certain number of credits to each namespace.
  * Any operations performed by the sender or receiver client applications will be counted against these credits (and subtracted from the available credits).
  * If the credits are depleted, subsequent operations will be throttled until the start of the next time period.
  * Credits are replenished at the start of the next time period.

### What are the credit limits?

The credit limits are currently set to '1000' credits every second (per namespace).

Not all operations are created equal. Here are the credit costs of each of the operations - 

| Operation | Credit cost|
|-----------|-----------|
| Data operations (Send, SendAsync, Receive, ReceiveAsync, Peek) |1 credit per message |
| Management operations (Create, Read, Update, Delete on Queues, Topics, Subscriptions, Filters) | 10 credits |

> [!NOTE]
> Please note that when sending to a Topic, each message is evaluated against filter(s) before being made available on the Subscription.
> Each filter evaluation also counts against the credit limit (i.e. 1 credit per filter evaluation).
>

### How will I know that I'm being throttled?

When the client application requests are being throttled, the below server response will be received by your application and logged.

```
The request was terminated because the entity is being throttled. Error code: 50009. Please wait 2 seconds and try again.
```

### How can I avoid being throttled?

With shared resources, it is important to enforce some sort of fair usage across various Service Bus namespaces that share those resources. Throttling ensures that any spike in a single workload does not cause other workloads on the same resources to be throttled.

As mentioned later in the article, there is no risk in being throttled because the client SDKs (and other Azure PaaS offerings) have the default retry policy built into them. Any throttled requests will be retried with exponential backoff and will eventually go through when the credits are replenished.

Understandably, some applications may be sensitive to being throttled. In that case, it is recommended to [migrate your current Service Bus Standard namespace to Premium](service-bus-migrate-standard-premium.md). 

On migration, you can allocate dedicated resources to your Service Bus namespace and appropriately scale up the resources if there is a spike in your workload and reduce the likelihood of being throttled. Additionally, when your workload reduces to normal levels, you can scale down the resources allocated to your namespace.

## Throttling in Azure Service Bus Premium tier

The [Azure Service Bus Premium](service-bus-premium-messaging.md) tier allocates dedicated resources, in terms of messaging units, to each namespace setup by the customer. These dedicated resources provide predictable throughput and latency and are recommended for high throughput or sensitive production grade systems.

Additionally, the Premium tier also enables customers to scale up their throughput capacity when they experience spikes in the workload.

### How does throttling work in Service Bus Premium?

With exclusive resource allocation for Service Bus Premium, throttling is purely driven by the limitations of the resources allocated to the namespace.

If the number of requests are more than the current resources can service, then the requests will be throttled.

### How will I know that I'm being throttled?

There are various ways to identifying throttling in Azure Service Bus Premium - 
  * **Throttled Requests** show up on the [Azure Monitor Request metrics](service-bus-metrics-azure-monitor.md#request-metrics) to identify how many requests were throttled.
  * High **CPU Usage** indicates that current resource allocation is high and requests may get throttled if the current workload doesn't reduce.
  * High **Memory Usage** indicates that current resource allocation is high and requests may get throttled if the current workload doesn't reduce.

### How can I avoid being throttled?

Since the Service Bus Premium namespace already has dedicated resources, you can reduce the possibility of getting throttled by scaling up the number of Messaging Units allocated to your namespace in the event (or anticipation) of a spike in the workload.

Scaling up/down can be achieved by creating [runbooks](../automation/automation-create-alert-triggered-runbook.md) that can be triggered by changes in the above metrics.

## FAQs

### How does throttling affect my application?

When a request is throttled, it implies that the service is busy because it is facing more requests than the resources allow. If the same operation is tried again after a few moments, once the service has worked through its current workload, then the request can be honored.

Since throttling is the expected behavior of any cloud native service, we have built the retry logic into the Azure Service Bus SDK itself. The default is set to auto retry with an exponential back-off to ensure that we don't have the same request being throttled each time.

The default retry logic will apply to every operation.

### Does throttling result in data loss?

Azure Service Bus is optimized for persistence, we ensure that all the data sent to Service Bus is committed to storage before the service acknowledges the success of the request.

Once the request is successfully 'ACK' (acknowledged) by Service Bus, it implies that Service Bus has successfully processed the request. If Service Bus returns a 'NACK' (failure), then it implies that Service Bus has not been able to process the request and the client application must retry the request.

However, when a request is throttled, the service is implying that it cannot accept and process the request right now because of resource limitations. This **does not** imply any sort of data loss because Service Bus simply hasn't looked at the request. In this case, relying on the default retry policy of the Service Bus SDK ensures that the request is eventually processed.

## Next steps

For more information and examples of using Service Bus messaging, see the following advanced topics:

* [Service Bus messaging overview](service-bus-messaging-overview.md)
* [Quickstart: Send and receive messages using the Azure portal and .NET](service-bus-quickstart-portal.md)
* [Tutorial: Update inventory using Azure portal and topics/subscriptions](service-bus-tutorial-topics-subscriptions-portal.md)


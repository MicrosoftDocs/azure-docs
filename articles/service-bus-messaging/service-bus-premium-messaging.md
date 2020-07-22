---
title: Azure Service Bus premium and standard tiers
description: This article describes standard and premium tiers of Azure Service Bus. Compares these tiers and provides technical differences.
ms.topic: conceptual
ms.date: 06/23/2020
---

# Service Bus Premium and Standard messaging tiers

Service Bus Messaging, which includes entities such as queues and topics, combines enterprise messaging capabilities with rich publish-subscribe semantics at cloud scale. Service Bus Messaging is used as the communication backbone for many sophisticated cloud solutions.

The *Premium* tier of Service Bus Messaging addresses common customer requests around scale, performance, and availability for mission-critical applications. The Premium tier is recommended for production scenarios. Although the feature sets are nearly identical, these two tiers of Service Bus Messaging are designed to serve different use cases.

Some high-level differences are highlighted in the following table.

| Premium | Standard |
| --- | --- |
| High throughput |Variable throughput |
| Predictable performance |Variable latency |
| Fixed pricing |Pay as you go variable pricing |
| Ability to scale workload up and down |N/A |
| Message size up to 1 MB |Message size up to 256 KB |

**Service Bus Premium Messaging** provides resource isolation at the CPU and memory level so that each customer workload runs in isolation. This resource container is called a *messaging unit*. Each premium namespace is allocated at least one messaging unit. You can purchase 1, 2, 4 or 8 messaging units for each Service Bus Premium namespace. A single workload or entity can span multiple messaging units and the number of messaging units can be changed at will. The result is predictable and repeatable performance for your Service Bus-based solution.

Not only is this performance more predictable and available, but it is also faster. Service Bus Premium Messaging builds on the storage engine introduced in [Azure Event Hubs](https://azure.microsoft.com/services/event-hubs/). With Premium Messaging, peak performance is much faster than with the Standard tier.

## Premium Messaging technical differences

The following sections discuss a few differences between Premium and Standard messaging tiers.

### Partitioned queues and topics

Partitioned queues and topics are not supported in Premium Messaging. For more information about partitioning, see [Partitioned queues and topics](service-bus-partitioning.md).

### Express entities

Because Premium messaging runs in a completely isolated run-time environment, express entities are not supported in Premium namespaces. For more information about the express feature, see the [QueueDescription.EnableExpress](/dotnet/api/microsoft.servicebus.messaging.queuedescription.enableexpress#Microsoft_ServiceBus_Messaging_QueueDescription_EnableExpress) property.

If you have code running under Standard messaging and want to port it to the Premium tier, make sure the [EnableExpress](/dotnet/api/microsoft.servicebus.messaging.queuedescription.enableexpress#Microsoft_ServiceBus_Messaging_QueueDescription_EnableExpress) property is set to **false** (the default value).

## Premium Messaging resource usage
In general, any operation on an entity may cause CPU and memory usage. Here are some of these operations: 

- Management operations such as CRUD (Create, Retrieve, Update, and Delete) operations on queues, topics, and subscriptions.
- Runtime operations (send and receive messages)
- Monitoring operations and alerts

The additional CPU And memory usage is not priced additionally though. For the Premium Messaging tier, there is a single price for the message unit.

The CPU and memory usage are tracked and displayed to the you for the following reasons: 

- Provide transparency into the system internals
- Understand the capacity of resources purchased.
- Capacity planning that helps you decide to scale up/down.

## Messaging unit - How many are needed?

When provisioning an Azure Service Bus Premium namespace, the number of messaging units allocated must be specified. These messaging units are dedicated resources that are allocated to the namespace.

The number of messaging units allocated to the Service Bus Premium namespace can be **dynamically adjusted** to factor in the change (increase or decrease) in workloads.

There are a number of factors to take into consideration when deciding the number of messaging units for your architecture:

- Start with ***1 or 2 messaging units*** allocated to your namespace.
- Study the CPU usage metrics within the [Resource usage metrics](service-bus-metrics-azure-monitor.md#resource-usage-metrics) for your namespace.
    - If CPU usage is ***below 20%***, you might be able to ***scale down*** the number of messaging units allocated to your namespace.
    - If CPU usage is ***above 70%***, your application will benefit from ***scaling up*** the number of messaging units allocated to your namespace.

The process of scaling the resources allocated to a Service Bus namespaces can be automated by using [Azure Automation Runbooks](../automation/automation-quickstart-create-runbook.md).

> [!NOTE]
> **Scaling** of the resources allocated to the namespace can be either preemptive or reactive.
>
>  * **Preemptive**: If additional workload is expected (due to seasonality or trends), you can proceed to allocate more messaging units to the namespace before the workloads hit.
>
>  * **Reactive**: If additional workloads are identified by studying the resource usage metrics, then additional resources can be allocated to the namespace to incorporate increasing demand.
>
> The billing meters for Service Bus are hourly. In the case of scaling up, you only pay for the additional resources for the hours that these were used.
>

## Get started with Premium Messaging

Getting started with Premium Messaging is straightforward and the process is similar to that of Standard Messaging. Begin by [creating a namespace](service-bus-create-namespace-portal.md) in the [Azure portal](https://portal.azure.com). Make sure you select **Premium** under **Pricing tier**. Click **View full pricing details** to see more information about each tier.

![create-premium-namespace][create-premium-namespace]

You can also create [Premium namespaces using Azure Resource Manager templates](https://azure.microsoft.com/resources/templates/101-servicebus-pn-ar/).

## Next steps

To learn more about Service Bus Messaging, see the following links:

* [Introducing Azure Service Bus Premium Messaging (blog post)](https://azure.microsoft.com/blog/introducing-azure-service-bus-premium-messaging/)
* [Introducing Azure Service Bus Premium Messaging (Channel9)](https://channel9.msdn.com/Blogs/Subscribe/Introducing-Azure-Service-Bus-Premium-Messaging)
* [Service Bus Messaging overview](service-bus-messaging-overview.md)
* [Get started with Service Bus queues](service-bus-dotnet-get-started-with-queues.md)

<!--Image references-->

[create-premium-namespace]: ./media/service-bus-premium-messaging/select-premium-tier.png

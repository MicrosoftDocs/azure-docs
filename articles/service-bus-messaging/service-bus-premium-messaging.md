---
title: Azure Service Bus premium and standard tiers
description: This article describes standard and premium tiers of Azure Service Bus. Compares these tiers and provides technical differences.
ms.topic: conceptual
ms.custom: ignite-2022
ms.date: 05/02/2023
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
| Message size up to 100 MB. For more information, see [Large message support](#large-messages-support). |Message size up to 256 KB |

**Service Bus Premium Messaging** provides resource isolation at the CPU and memory level so that each customer workload runs in isolation. This resource container is called a *messaging unit*. Each premium namespace is allocated at least one messaging unit. You can purchase 1, 2, 4, 8 or 16 messaging units for each Service Bus Premium namespace. A single workload or entity can span multiple messaging units and the number of messaging units can be changed at will. The result is predictable and repeatable performance for your Service Bus-based solution.

Not only is this performance more predictable and available, but it's also faster. With Premium Messaging, peak performance is much faster than with the Standard tier.

## Premium Messaging technical differences

The following sections discuss a few differences between Premium and Standard messaging tiers.

### Express entities

Because Premium messaging runs in an isolated run-time environment, express entities aren't supported in Premium namespaces. An express entity holds a message in memory temporarily before writing it to persistent storage. If you have code running under Standard messaging and want to port it to the Premium tier, ensure that the express entity feature is disabled.

## Premium Messaging resource usage
In general, any operation on an entity may cause CPU and memory usage. Here are some of these operations: 

- Management operations such as CRUD (Create, Retrieve, Update, and Delete) operations on queues, topics, and subscriptions.
- Runtime operations (send and receive messages)
- Monitoring operations and alerts

The additional CPU And memory usage isn't priced additionally though. For the Premium Messaging tier, there's a single price for the message unit.

The CPU and memory usage are tracked and displayed to you for the following reasons: 

- Provide transparency into the system internals
- Understand the capacity of resources purchased.
- Capacity planning that helps you decide to scale up/down.

## How many messaging units are needed? 

You specify the number of messaging units when provisioning an Azure Service Bus Premium namespace. These messaging units are dedicated resources that are allocated to the namespace. When partitioning has been enabled on the namespace, the messaging units are equally distributed across the partitions.

The number of messaging units allocated to the Service Bus Premium namespace can be **dynamically adjusted** to factor in the change (increase or decrease) in workloads.

There are a few factors to take into consideration when deciding the number of messaging units for your architecture:

- Start with ***1 or 2 messaging units*** allocated to your namespace, or ***1 message unit per partition***.
- Study the CPU usage metrics within the [Resource usage metrics](monitor-service-bus-reference.md#resource-usage-metrics) for your namespace.
    - If CPU usage is ***below 20%***, you might be able to ***scale down*** the number of messaging units allocated to your namespace.
    - If CPU usage is ***above 70%***, your application will benefit from ***scaling up*** the number of messaging units allocated to your namespace.

To learn how to configure a Service Bus namespace to automatically scale (increase or decrease messaging units), see [Automatically update messaging units](automate-update-messaging-units.md).

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

Getting started with Premium Messaging is straightforward and the process is similar to that of Standard Messaging. Begin by [creating a namespace](service-bus-quickstart-portal.md#create-a-namespace-in-the-azure-portal) in the [Azure portal](https://portal.azure.com). Make sure you select **Premium** under **Pricing tier**. Select **View full pricing details** to see more information about each tier.

:::image type="content" source="./media/service-bus-premium-messaging/select-premium-tier.png" alt-text="Screenshot that shows the selection of premium tier when creating a namespace.":::

You can also create [Premium namespaces using Azure Resource Manager templates](https://azure.microsoft.com/resources/templates/servicebus-pn-ar/).

## Large messages support
Azure Service Bus premium tier namespaces support the ability to send large message payloads up to 100 MB. This feature is primarily targeted towards legacy workloads that have used larger message payloads on other enterprise messaging brokers and are looking to seamlessly migrate to Azure Service Bus.

Here are some considerations when sending large messages on Azure Service Bus -

- Supported on Azure Service Bus premium tier namespaces only.
- Supported only when using the AMQP protocol. Not supported when using SBMP or HTTP protocols, in the premium tier the maximum message size for these protocols is 1MB.
- Supported when using [Java Message Service (JMS) 2.0 client SDK](how-to-use-java-message-service-20.md) and other language client SDKs.
- Sending large messages will result in decreased throughput and increased latency.
- While 100 MB message payloads are supported, it's recommended to keep the message payloads as small as possible to ensure reliable performance from the Service Bus namespace.
- The max message size is enforced only for messages sent to the queue or topic. The size limit isn't enforced for the receive operation. It allows you to update the max message size for a given queue (or topic).
- Batching isn't supported. 
- Service Bus Explorer doesn't support sending or receiving large messages. 



### Enabling large messages support for a new queue (or topic)

To enable support for large messages, set the max message size when creating a new queue (or topic) as shown below. 

:::image type="content" source="./media/service-bus-premium-messaging/large-message-preview.png" alt-text="Screenshot that shows how to enable large message support for an existing queue.":::

### Enabling large messages support for an existing queue (or topic)

You can also enable support for large message for existing queues (or topics), by updating the **Max message size** on the ***Overview*** for that specific queue (or topic) as below.

:::image type="content" source="./media/service-bus-premium-messaging/large-message-preview-update.png" alt-text="Screenshot of the Create queue page with large message support enabled.":::

## Next steps

To learn more about Service Bus Messaging, see the following links:

- [Automatically update messaging units](automate-update-messaging-units.md).
- [Introducing Azure Service Bus Premium Messaging (blog post)](https://azure.microsoft.com/blog/introducing-azure-service-bus-premium-messaging/)

---
title: Overview of Event Hubs Premium
description: This article provides an overview of Azure Event Hubs Premium, which offers multitenant deployments of Event Hubs for high-end streaming needs.
ms.topic: article
ms.date: 02/15/2024
---

# Overview of Event Hubs Premium

Azure Event Hubs Premium (Premium tier) is designed for high-end streaming scenarios that require elastic, superior performance with predictable latency. The Premium tier provides reserved compute, memory, and storage resources, which minimize cross-tenant interference in a managed multitenant platform-as-a-service (PaaS) environment.

Event Hubs Premium replicates events to three replicas, which are distributed across Azure availability zones where available. All replicas are synchronously flushed to the underlying fast storage before the send operation is reported as completed. Events that aren't read immediately or that need to be reread later can be retained for up to 90 days. They're transparently held in an availability-zone-redundant storage tier.

In addition to these storage-related features and all capabilities and protocol support of the Standard tier, the isolation model of the Premium tier enables features like [dynamic partition scale-up](dynamically-add-partitions.md). You also get far more generous [quota allocations](event-hubs-quotas.md). Event Hubs Capture is included at no extra cost.

> [!NOTE]
> - Event Hubs Premium supports TLS 1.2 or greater.
> - The Premium tier isn't available in all regions. Try to create a namespace in the Azure portal. See the supported regions in the **Location** dropdown list on the **Create Namespace** page.

You can purchase 1, 2, 4, 8, and 16 processing units (PUs) for each namespace. Because the Premium tier is a capacity-based offering, the achievable throughput isn't set by a throttle like it is in the Standard tier. The throughput depends on the work you ask Event Hubs to do, which is similar to the Dedicated tier. The effective ingest and stream throughput per PU depends on various factors, such as the:

* Number of producers and consumers.
* Payload size.
* Partition count.
* Egress request rate.
* Use of Event Hubs Capture, Schema Registry, and other advanced features.

For more information, see [Comparison between Event Hubs SKUs](event-hubs-quotas.md).

## Why Premium?

The Premium tier offers three compelling benefits for customers who require better isolation in a multitenant environment with low latency and high-throughput data ingestion needs.

### Superior performance with the new two-tier storage engine

The Premium tier uses a new two-tier log storage engine that drastically improves the data ingress performance with substantially reduced overall latency without compromising the durability guarantees.

### Better isolation and predictability

The Premium tier offers an isolated compute and memory capacity to achieve more predictable latency and far reduced *noisy neighbor* impact risk in a multitenant deployment.

It implements a *cluster in cluster* model in its multitenant clusters to provide predictability and performance while retaining all the benefits of a managed multitenant PaaS environment.

### Cost savings and scalability

The Premium tier is a multitenant offering, so it can dynamically scale flexibly and quickly. Capacity is allocated in PUs that allocate isolated pods of CPU and memory inside the cluster. The number of those pods can be scaled up or down per namespace. For this reason, the Premium tier is a low-cost option for messaging scenarios with the overall throughput range that's less than 120 MB/sec but higher than what you can achieve with the Standard tier.

## Encryption of events

Event Hubs provides encryption of data at rest with Azure Storage Service Encryption. The Event Hubs service uses Azure Storage to store the data. All the data that's stored with Azure Storage is encrypted by using Microsoft-managed keys. If you use your own key (also referred to as Bring Your Own Key [BYOK] or customer-managed key), the data is still encrypted by using the Microsoft-managed key.

In addition, the Microsoft-managed key is encrypted by using the customer-managed key. This feature enables you to create, rotate, disable, and revoke access to customer-managed keys that are used for encrypting Microsoft-managed keys. Enabling the BYOK feature is a one-time setup process on your namespace. For more information, see [Configure customer-managed keys for encrypting Azure Event Hubs data at rest](configure-customer-managed-key.md).

> [!NOTE]
> All Event Hubs namespaces enabled for the Apache Kafka RPC protocol by default can be used by your existing Kafka-based applications. Having Kafka enabled on your cluster doesn't affect your non-Kafka use cases. There's no option or need to disable Kafka on a cluster.

## Quotas and limits

The Premium tier offers all the features of the Standard plan but with better performance, isolation, and more generous quotas. For more information on quotas and limits, see [Event Hubs quotas and limits](event-hubs-quotas.md).

## High availability with availability zones

Event Hubs Standard, Premium, and Dedicated tiers offer [availability zones](../availability-zones/az-overview.md#availability-zones) support with no extra cost. By using availability zones, you can run event streaming workloads in physically separate locations within each Azure region that are tolerant to local failures.

> [!IMPORTANT]
> - Availability zone support is only available in [Azure regions with availability zones](../availability-zones/az-overview.md#azure-regions-with-availability-zones).
> - In certain regions, the Premium tier's support for availability zones is limited even though the region supports availability zones.

## Premium vs. Dedicated tiers

In comparison to the Dedicated offering, the Premium tier provides the following benefits:

- Isolation inside a large multitenant environment can shift resources quickly.
- Scaling is far more elastic and quick.
- PUs can be dynamically adjusted.

When compared to the Dedicated tier, the Premium tier is often a more cost-effective option for event streaming workloads up to 160 MB/sec (per namespace), especially with changing loads throughout the day or week.

> [!NOTE]
> For the extra robustness gained by availability zone support, the minimal deployment scale for the Dedicated tier is eight capacity units (CUs). You have availability zone support in the Premium tier from the first PU in all availability zone regions.

## Pricing

The Premium offering is billed by [PUs](event-hubs-scalability.md#processing-units), which correspond to a share of isolated resources (CPU, memory, and storage) in the underlying infrastructure.

## FAQs

[!INCLUDE [event-hubs-dedicated-clusters-faq](./includes/event-hubs-premium-faq.md)]

## Related content

See the following articles:

- [Create an event hub](event-hubs-create.md). Select **Premium** for **Pricing tier**.
- [Event Hubs Premium pricing](https://azure.microsoft.com/pricing/details/event-hubs/) for more details on pricing.
- [Event Hubs FAQ](event-hubs-faq.yml) to find answers to some frequently asked questions about Event Hubs.

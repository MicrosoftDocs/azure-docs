---
title: Overview of dedicated event hubs - Azure Event Hubs | Microsoft Docs
description: This article provides an overview of dedicated Azure Event Hubs, which offers single-tenant deployments of event hubs.  
ms.topic: article
ms.date: 06/23/2020
---

# Overview of Event Hubs Dedicated

*Event Hubs clusters* offer single-tenant deployments for customers with the most demanding streaming needs. This single-tenant offering has a guaranteed 99.99% SLA and is available only on our Dedicated pricing tier. An Event Hubs cluster can ingress millions of events per second with guaranteed capacity and sub-second latency. Namespaces and event hubs created within the Dedicated cluster include all features of the Standard offering and more, but without any ingress limits. It also includes the popular [Event Hubs Capture](event-hubs-capture-overview.md) feature at no additional cost, allowing you to automatically batch and log data streams to Azure Storage or Azure Data Lake. 

Clusters are provisioned and billed by **Capacity Units (CUs)**, a pre-allocated amount of CPU and memory resources. You can purchase 1, 2, 4, 8, 12, 16 or 20 CUs for each cluster. How much you can ingest and stream per CU depends on a variety of factors, such as the number of producers and consumers, payload shape, egress rate (see benchmark results below for more details). 

> [!NOTE]
> All Event Hubs clusters are Kafka-enabled by default and support Kafka endpoints that can be used by your existing Kafka based applications. Having Kafka enabled on your cluster does not affect your non-Kafka use cases; there is no option or need to disable Kafka on a cluster.

## Why Dedicated?

Dedicated Event Hubs offers three compelling benefits for customers who need enterprise-level capacity:

#### Single-tenancy guarantees capacity for better performance

A Dedicated cluster guarantees capacity at full scale, and can ingress up to gigabytes of streaming data with fully durable storage and sub-second latency to accommodate any burst in traffic. 

#### Inclusive and exclusive access to features 
The Dedicated offering includes features like Capture at no additional cost, as well as exclusive access to upcoming features like Bring Your Own Key (BYOK). The service also manages load balancing, OS updates, security patches and partitioning for the customer, so that you can spend less time on infrastructure maintenance and more time on building client-side features.  

#### Cost Savings
At high ingress volumes (>100 TUs), a cluster costs significantly less per hour than purchasing a comparable quantity of throughput units in the Standard offering.


## Event Hubs Dedicated Quotas and Limits

The Event Hubs Dedicated offering is billed at a fixed monthly price, with a minimum of 4 hours of usage. The Dedicated tier offers all the features of the Standard plan, but with enterprise scale capacity and limits for customers with demanding workloads. 

| Feature | Standard | Dedicated |
| --- |:---:|:---:|
| Bandwidth | 20 TUs (up to 40 TUs)	| 20 CUs |
| Namespaces |  1 | 50 per CU |
| Event Hubs |  10 per namespace | 1000 per namespace |
| Ingress events | Pay per million events | Included |
| Message Size | 1 Million Bytes | 1 Million Bytes |
| Partitions | 32 per Event Hub | 1024 per Event Hub |
| Consumer groups | 20 per Event Hub | No limit per CU, 1000 per event hub |
| Brokered connections | 1,000 included, 5,000 max | 100 K included and max |
| Message Retention | 7 days, 84 GB included per TU | 90 days, 10 TB included per CU |
| Capture | Pay per hour | Included |

## How to onboard

The self-serve experience to [create an Event Hubs cluster](event-hubs-dedicated-cluster-create-portal.md) through the [Azure Portal](https://aka.ms/eventhubsclusterquickstart) is now in Preview. If you have any questions or need help onboarding to Event Hubs Dedicated, please contact the [Event Hubs team](mailto:askeventhubs@microsoft.com).

## FAQs

#### What can I achieve with a cluster?

For an Event Hubs cluster, how much you can ingest and stream depends on various factors such as your producers, consumers, the rate at which you are ingesting and processing, and much more. 

Following table shows the benchmark results that we achieved during our testing:

| Payload shape | Receivers | Ingress bandwidth| Ingress messages | Egress bandwidth | Egress messages | Total TUs | TUs per CU |
| ------------- | --------- | ---------------- | ------------------ | ----------------- | ------------------- | --------- | ---------- |
| Batches of 100x1KB | 2 | 400 MB/sec | 400k messages/sec | 800 MB/sec | 800k messages/sec | 400 TUs | 100 TUs | 
| Batches of 10x10KB | 2 | 666 MB/sec | 66.6k messages/sec | 1.33 GB/sec | 133k messages/sec | 666 TUs | 166 TUs |
| Batches of 6x32KB | 1 | 1.05 GB/sec | 34k messages / sec | 1.05 GB/sec | 34k messages/sec | 1000 TUs | 250 TUs |

In the testing, the following criteria was used:

- A dedicated-tier Event Hubs cluster with four capacity units (CUs) was used. 
- The event hub used for ingestion had 200 partitions. 
- The data that was ingested was received by two receiver applications receiving from all partitions.

#### Can I scale up/down my cluster?

After creation, clusters are billed for a minimum of 4 hours of usage. In the Preview release of the self-serve experience, you can submit a [support request](https://ms.portal.azure.com/#create/Microsoft.Support) to the Event Hubs team under *Technical > Quota > Request to Scale Up or Scale Down Dedicated Cluster* to scale your cluster up or down. It may take up to 7 days to complete the request to scale down your cluster. 

#### How will Geo-DR work with my cluster?

You can geo-pair a namespace under a Dedicated-tier cluster with another namespace under a Dedicated-tier cluster. We do not encourage pairing a Dedicated-tier namespace with a namespace in our Standard offering, since the throughput limit will be incompatible which will result in errors. 

#### Can I migrate my Standard namespaces to belong to a Dedicated-tier cluster?
We do not currently support an automated migration process for migrating your event hubs data from a Standard namespace to a Dedicated one. 

## Next steps

Contact your Microsoft sales representative or Microsoft Support to get additional details about Event Hubs Dedicated. You can also create a cluster or learn more about Event Hubs pricing tiers by visiting the following links:

- [Create an Event Hubs cluster through the Azure Portal](https://aka.ms/eventhubsclusterquickstart) 
- [Event Hubs Dedicated pricing](https://azure.microsoft.com/pricing/details/event-hubs/). You can also contact your Microsoft sales representative or Microsoft Support to get additional details about Event Hubs Dedicated capacity.
- The [Event Hubs FAQ](event-hubs-faq.md) contains pricing information and answers some frequently asked questions about Event Hubs.

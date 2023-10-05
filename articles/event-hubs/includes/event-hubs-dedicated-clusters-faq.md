---
title: include file
description: include file
services: event-hubs
author: spelluru
ms.service: event-hubs
ms.topic: include
ms.date: 02/07/2023
ms.author: spelluru
ms.custom: "include file"

---

### What can I achieve with a cluster?

For an Event Hubs cluster, how much you can ingest and stream depends on various factors such as your producers, consumers, the rate at which you're ingesting and processing, and much more. 

The following table shows the benchmark results that we achieved during our testing a Legacy dedicated cluster:

| Payload shape | Receivers | Ingress bandwidth| Ingress messages | Egress bandwidth | Egress messages | Total TUs | TUs per CU |
| ------------- | --------- | ---------------- | ------------------ | ----------------- | ------------------- | --------- | ---------- |
| Batches of 100x1KB | 2 | 400 MB/sec | 400k messages/sec | 800 MB/sec | 800k messages/sec | 400 TUs | 100 TUs | 
| Batches of 10x10KB | 2 | 666 MB/sec | 66.6k messages/sec | 1.33 GB/sec | 133k messages/sec | 666 TUs | 166 TUs |
| Batches of 6x32KB | 1 | 1.05 GB/sec | 34k messages / sec | 1.05 GB/sec | 34k messages/sec | 1000 TUs | 250 TUs |

In the testing, the following criteria were used:

- A dedicated-tier Event Hubs cluster with 4 capacity units (CUs) was used. 
- The event hub used for ingestion had 200 partitions. 
- The data that was ingested was received by two receiver applications receiving from all partitions.

### Can I scale up/down my cluster?
If you created the cluster with the **Support Scaling** option set, you can use the [self-serve experience](../event-hubs-dedicated-cluster-create-portal.md#scale-a-dedicated-cluster) to scale out and scale in as needed. You can scale up to 10 CUs with self-serve scalable clusters. As self-serve scalable dedicated clusters are based out of new infrastructure, they're bound to be performant over dedicated clusters that don't support self-serve scaling. As the performance of dedicated clusters depends on various factors such as resource allocation, number of partitions, storage, and so on, we recommend you to determine the required number of CUs after testing with a real workload. 

[Submit a support request](../event-hubs-dedicated-cluster-create-portal.md#submit-a-support-request) in the following scenarios to scale out or scale in your dedicated cluster.

- You need more than 10 CUs for a self-serve scalable dedicated cluster (a cluster that was created with the **Support scaling** option set).
- You need to scale out or scale in a cluster that was created without selecting the **Support scaling** option 
- You need to scale out or scale in a dedicated cluster that was created before the self-serve experience was released


> [!WARNING]
> You won't be able to delete the cluster for at least 4 hours after you create it. Therefore, you will be charged for a minimum 4 hours of usage of the cluster. For more information on pricing, see [Event Hubs - Pricing](https://azure.microsoft.com/pricing/details/event-hubs/). 


### Can I migrate from a Legacy cluster to a Self-Serve Scalable cluster?
Due to difference in the underlying hardware and software infrastructure, we don't currently support migration of clusters that don't support self-serve scaling to self-serve scalable dedicated clusters. If you would wish to use self-serve scaling, you must recreate the cluster. To learn how to create scalable cluster, see [Create an Event Hubs dedicated cluster](../event-hubs-dedicated-cluster-create-portal.md). 



### When to scale my dedicated cluster? 
CPU consumption is the key indicator of the resource consumption of your dedicated cluster. When the overall CPU consumption is reaching 70% (without observing any abnormal conditions such as high number of server errors or low successful requests), that means your cluster is moving towards its maximum capacity.  Therefore you can use this as an indicator to consider whether you need to scale up your dedicated cluster or not.

To monitor the CPU usage of the dedicated cluster, you need to follow these steps. 
- In the metrics page of your Event Hubs Dedicated cluster, select **Add metric**.
- Select `CPU` as the metric and use the `Max` as the aggregation. 

    :::image type="content" source="./media/event-hubs-dedicated-clusters-faq/metrics-cpu-max.png" alt-text="Screenshot showing the Metrics page with the CPU metric." lightbox="./media/event-hubs-dedicated-clusters-faq/metrics-cpu-max.png":::
- Then, select **Add filter**, and add a filter for the property type `Role`, use the equal operator and select all three values(`Backend`, `Gateway`) from the dropdown.  

    :::image type="content" source="./media/event-hubs-dedicated-clusters-faq/monitoring-dedicated-cluster.png" alt-text="Screeshot showing the metrics page with CPU consumption metric and roles." lightbox="./media/event-hubs-dedicated-clusters-faq/monitoring-dedicated-cluster.png":::


    Then you can monitor this metric to determine when you should scale your dedicated cluster. You can also set up [alerts](../../azure-monitor/alerts/alerts-overview.md) against this metric to get notified when CPU usage reaches the thresholds you set.  


### How does Geo-DR work with my cluster?
You can geo-pair a namespace under a dedicated-tier cluster with another namespace under a dedicated-tier cluster. We don't encourage pairing a dedicated-tier namespace with a namespace in our standard offering because the throughput limit will be incompatible and result in errors. 

### Can I migrate my standard or premium namespaces to a Dedicated-tier cluster?
We don't currently support an automated migration process for migrating your event hubs data from a standard or premium namespace to a dedicated one.

### Why does a zone redundant dedicated cluster have a minimum of 8 CU?
In order to provide zone redundancy for the dedicated offering, all compute resources must have 3 replicas across 3 datacenters in the same region. This is the minimum requirement to support zone redundancy (so that the service can still function when 2 zones/datacenters are down) and results in a compute capacity equivalent to 8 CUs.

So this is not a quota that we can change but rather a restriction of the current architecture with a dedicated tier.

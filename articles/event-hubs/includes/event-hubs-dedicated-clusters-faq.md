---
title: include file
description: include file
author: spelluru
ms.service: event-hubs
ms.topic: include
ms.date: 02/07/2023
ms.author: spelluru
ms.custom: "include file"

---

### What can I achieve with a cluster?

For an Event Hubs cluster, how much you can ingest and stream depends on factors such as your producers, consumers, and the rate at which you're ingesting and processing.

The following table shows the benchmark results that we achieved during our testing with a legacy Dedicated cluster.

| Payload shape | Receivers | Ingress bandwidth| Ingress messages | Egress bandwidth | Egress messages | Total TUs | TUs per CU |
| ------------- | --------- | ---------------- | ------------------ | ----------------- | ------------------- | --------- | ---------- |
| Batches of 100x1KB | 2 | 400 MB/sec | 400k messages/sec | 800 MB/sec | 800k messages/sec | 400 TUs | 100 TUs | 
| Batches of 10x10KB | 2 | 666 MB/sec | 66.6k messages/sec | 1.33 GB/sec | 133k messages/sec | 666 TUs | 166 TUs |
| Batches of 6x32KB | 1 | 1.05 GB/sec | 34k messages/sec | 1.05 GB/sec | 34k messages/sec | 1,000 TUs | 250 TUs |

In the testing, the following criteria were used:

- A Dedicated-tier Event Hubs cluster with 4 CUs was used.
- The event hub used for ingestion had 200 partitions.
- The data that was ingested was received by two receiver applications receiving from all partitions.

### Can I scale up or scale down my cluster?

If you create the cluster with the **Support Scaling** option set, you can use the [self-serve experience](../event-hubs-dedicated-cluster-create-portal.md#scale-a-dedicated-cluster) to scale out and scale in, as needed. You can scale up to 10 CUs with self-serve scalable clusters. Self-serve scalable Dedicated clusters are based out of new infrastructure, so they're bound to perform better than Dedicated clusters that don't support self-serve scaling. The performance of Dedicated clusters depends on various factors, such as resource allocation, number of partitions, and storage. We recommend that you determine the required number of CUs after you test with a real workload.

[Submit a support request](../event-hubs-dedicated-cluster-create-portal.md#submit-a-support-request) to scale out or scale in your Dedicated cluster in the following scenarios:

- You need more than 10 CUs for a self-serve scalable Dedicated cluster (a cluster that was created with the **Support scaling** option set).
- You need to scale out or scale in a cluster that was created without selecting the **Support scaling** option.
- You need to scale out or scale in a Dedicated cluster that was created before the self-serve experience was released.

> [!WARNING]
> You won't be able to delete the cluster for at least 4 hours after you create it. You'll be charged for a minimum of 4 hours of usage of the cluster. For more information on pricing, see [Event Hubs - Pricing](https://azure.microsoft.com/pricing/details/event-hubs/).

### Can I migrate from a legacy cluster to a self-serve scalable cluster?

Because of the difference in the underlying hardware and software infrastructure, we don't currently support migration of clusters that don't support self-serve scaling to self-serve scalable Dedicated clusters. If you want to use self-serve scaling, you must re-create the cluster. To learn how to create a scalable cluster, see [Create an Event Hubs Dedicated cluster](../event-hubs-dedicated-cluster-create-portal.md).

### When should I scale my Dedicated cluster?

CPU consumption is the key indicator of the resource consumption of your Dedicated cluster. When the overall CPU consumption begins to reach 70% (without observing any abnormal conditions, such as a high number of server errors or a low number of successful requests), that means your cluster is moving toward its maximum capacity. You can use this information as an indicator to consider whether you need to scale up your Dedicated cluster or not.

To monitor the CPU usage of the Dedicated cluster, follow these steps:

- On the **Metrics** page of your Event Hubs Dedicated cluster, select **Add metric**.
- Select **CPU** as the metric and use **Max** as the aggregation.

    :::image type="content" source="./media/event-hubs-dedicated-clusters-faq/metrics-cpu-max.png" alt-text="Screenshot that shows the Metrics page with the CPU metric." lightbox="./media/event-hubs-dedicated-clusters-faq/metrics-cpu-max.png":::

- Then, select **Add filter** and add a filter for the **Property** type **Role**. Use the equal operator and select all the values (**Backend** and **Gateway**) from the dropdown list.

    :::image type="content" source="./media/event-hubs-dedicated-clusters-faq/monitoring-dedicated-cluster.png" alt-text="Screenshot that shows the Metrics page with CPU consumption metric and roles." lightbox="./media/event-hubs-dedicated-clusters-faq/monitoring-dedicated-cluster.png":::

    Then you can monitor this metric to determine when you should scale your Dedicated cluster. You can also set up [alerts](../../azure-monitor/alerts/alerts-overview.md) against this metric to get notified when CPU usage reaches the thresholds you set.

### How does geo-disaster recovery work with my cluster?

You can geo-pair a namespace under a Dedicated-tier cluster with another namespace under a Dedicated-tier cluster. We don't encourage pairing a Dedicated-tier namespace with a namespace in the Standard offering because the throughput limit is incompatible and results in errors.

### Can I migrate my Standard or Premium namespaces to a Dedicated-tier cluster?

We don't currently support an automated migration process for migrating your Event Hubs data from a Standard or Premium namespace to a Dedicated one.

### Why does a zone-redundant Dedicated cluster have a minimum of 8 CUs?

To provide zone redundancy for the Dedicated offering, all compute resources must have three replicas across three datacenters in the same region. This minimum requirement supports zone redundancy (so that the service can still function when two zones or datacenters are down) and results in a compute capacity equivalent to 8 CUs.

We can't change this quota. It's a restriction of the current architecture with a Dedicated tier.

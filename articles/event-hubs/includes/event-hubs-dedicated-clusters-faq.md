---
title: include file
description: include file
author: spelluru
ms.service: azure-event-hubs
ms.topic: include
ms.date: 02/07/2023
ms.author: spelluru
ms.custom: "include file"

---

### What can I achieve with a cluster?

For an Event Hubs cluster, how much you can ingest and stream depends on factors such as your producers, consumers, and the rate at which you're ingesting and processing.

The following table shows the benchmark results that we achieved during our testing with a legacy dedicated cluster.

| Payload shape | Receivers | Ingress bandwidth| Ingress messages | Egress bandwidth | Egress messages | Total TUs | TUs per CU |
| ------------- | --------- | ---------------- | ------------------ | ----------------- | ------------------- | --------- | ---------- |
| Batches of 100x1KB | 2 | 400 MB/sec | 400k messages/sec | 800 MB/sec | 800k messages/sec | 400 TUs | 100 TUs | 
| Batches of 10x10KB | 2 | 666 MB/sec | 66.6k messages/sec | 1.33 GB/sec | 133k messages/sec | 666 TUs | 166 TUs |
| Batches of 6x32KB | 1 | 1.05 GB/sec | 34k messages/sec | 1.05 GB/sec | 34k messages/sec | 1,000 TUs | 250 TUs |

In the testing, the following criteria were used:

- A Dedicated-tier Event Hubs cluster with four CUs was used.
- The event hub used for ingestion had 200 partitions.
- The data that was ingested was received by two receiver applications receiving from all partitions.

### Can I scale up or scale down my cluster?

If you create the cluster with the **Support scaling** option set, you can use the [self-serve experience](../event-hubs-dedicated-cluster-create-portal.md#scale-a-dedicated-cluster) to scale out and scale in, as needed. You can scale up to 10 CUs with self-serve scalable clusters. Self-serve scalable dedicated clusters are based on new infrastructure, so they perform better than dedicated clusters that don't support self-serve scaling. The performance of dedicated clusters depends on factors such as resource allocation, number of partitions, and storage. We recommend that you determine the required number of CUs after you test with a real workload.

[Submit a support request](../event-hubs-dedicated-cluster-create-portal.md#submit-a-support-request) to scale out or scale in your dedicated cluster in the following scenarios:

- You need more than 10 CUs for a self-serve scalable dedicated cluster (a cluster that was created with the **Support scaling** option set).
- You need to scale out or scale in a cluster that was created without selecting the **Support scaling** option.
- You need to scale out or scale in a dedicated cluster that was created before the self-serve experience was released.

> [!WARNING]
> You won't be able to delete the cluster for at least four hours after you create it. You're charged for a minimum of four hours of usage of the cluster. For more information on pricing, see [Event Hubs pricing](https://azure.microsoft.com/pricing/details/event-hubs/).

### Can I migrate from a legacy cluster to a self-serve scalable cluster?

Because of the difference in the underlying hardware and software infrastructure, we don't currently support migration of clusters that don't support self-serve scaling to self-serve scalable dedicated clusters. If you want to use self-serve scaling, you must re-create the cluster. To learn how to create a scalable cluster, see [Create an Event Hubs dedicated cluster](../event-hubs-dedicated-cluster-create-portal.md).

### When should I scale my dedicated cluster?

CPU consumption is the key indicator of the resource consumption of your dedicated cluster. When the overall CPU consumption begins to reach 70% (without observing any abnormal conditions, such as a high number of server errors or a low number of successful requests), that means your cluster is moving toward its maximum capacity. You can use this information as an indicator to consider whether you need to scale up your dedicated cluster or not.

To monitor the CPU usage of the dedicated cluster, follow these steps:

1. On the **Metrics** page of your Event Hubs dedicated cluster, select **Add metric**.
1. Select **CPU** as the metric and use **Max** as the aggregation.

    :::image type="content" source="./media/event-hubs-dedicated-clusters-faq/metrics-cpu-max.png" alt-text="Screenshot that shows the Metrics page with the CPU metric." lightbox="./media/event-hubs-dedicated-clusters-faq/metrics-cpu-max.png":::

1. Select **Add filter** and add a filter for the **Property** type **Role**. Use the equal operator and select all the values (**Backend** and **Gateway**) from the dropdown list.

    :::image type="content" source="./media/event-hubs-dedicated-clusters-faq/monitoring-dedicated-cluster.png" alt-text="Screenshot that shows the Metrics page with CPU consumption metric and roles." lightbox="./media/event-hubs-dedicated-clusters-faq/monitoring-dedicated-cluster.png":::

    Then you can monitor this metric to determine when you should scale your dedicated cluster. You can also set up [alerts](../../azure-monitor/alerts/alerts-overview.md) against this metric to get notified when CPU usage reaches the thresholds you set.

### How does geo-disaster recovery work with my cluster?

You can geo-pair a namespace under a Dedicated-tier cluster with another namespace under a Dedicated-tier cluster. We don't encourage pairing a Dedicated-tier namespace with a namespace in the Standard offering because the throughput limit is incompatible and results in errors.

### Can I migrate my Standard or Premium namespaces to a Dedicated-tier cluster?

We don't currently support an automated migration process for migrating your Event Hubs data from a Standard or Premium namespace to a dedicated one.

### Why does a zone-redundant dedicated cluster have a minimum of eight CUs?

To provide zone redundancy for the Dedicated offering, all compute resources must have three replicas across three datacenters in the same region. This minimum requirement supports zone redundancy (so that the service can still function when two zones or datacenters are down) and results in a compute capacity equivalent to eight CUs.

We can't change this quota. It's a restriction of the current architecture with a Dedicated tier.

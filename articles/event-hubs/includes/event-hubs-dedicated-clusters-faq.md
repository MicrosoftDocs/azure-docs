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

### Can I scale up or scale down my cluster?

Use the [self-serve experience](../event-hubs-dedicated-cluster-create-portal.md#scale-a-dedicated-cluster) to scale out and scale in your dedicated cluster, as needed. You can scale up to 10 CUs. The performance of dedicated clusters depends on factors such as resource allocation, number of partitions, and storage. Test with a real workload to determine the required number of CUs.

If you need more than 10 CUs for your dedicated cluster, [submit a support request](../event-hubs-dedicated-cluster-create-portal.md#submit-a-support-request) to scale out your cluster.

> [!WARNING]
> You won't be able to delete the cluster for at least four hours after you create it. You're charged for a minimum of four hours of usage of the cluster. For more information on pricing, see [Event Hubs pricing](https://azure.microsoft.com/pricing/details/event-hubs/).

### When should I scale my dedicated cluster?

CPU consumption is the key indicator of the resource consumption of your dedicated cluster. When the overall CPU consumption begins to reach 70% (without observing any abnormal conditions, such as a high number of server errors or a low number of successful requests), that means your cluster is moving toward its maximum capacity. You can use this information as an indicator to consider whether you need to scale up your dedicated cluster or not.

To monitor the CPU usage of the dedicated cluster, follow these steps:

1. On the **Metrics** page of your Event Hubs dedicated cluster, select **Add metric**.
1. Select **CPU** as the metric and use **Max** as the aggregation.

    :::image type="content" source="./media/event-hubs-dedicated-clusters-faq/metrics-cpu-max.png" alt-text="Screenshot that shows the Metrics page with the CPU metric." lightbox="./media/event-hubs-dedicated-clusters-faq/metrics-cpu-max.png":::

1. Select **Add filter** and add a filter for the **Property** type **Role**. Use the equal operator and select all the values (**Backend** and **Gateway**) from the dropdown list.

    :::image type="content" source="./media/event-hubs-dedicated-clusters-faq/monitoring-dedicated-cluster.png" alt-text="Screenshot that shows the Metrics page with CPU consumption metric and roles." lightbox="./media/event-hubs-dedicated-clusters-faq/monitoring-dedicated-cluster.png":::

    Then you can monitor this metric to determine when you should scale your dedicated cluster. You can also set up [alerts](/azure/azure-monitor/alerts/alerts-overview) against this metric to get notified when CPU usage reaches the thresholds you set.

### How does geo-disaster recovery work with my cluster?

You can geo-pair a namespace under a Dedicated-tier cluster with another namespace under a Dedicated-tier cluster. We don't encourage pairing a Dedicated-tier namespace with a namespace in the Standard offering because the throughput limit is incompatible and results in errors.

### Can I migrate my Standard or Premium namespaces to a Dedicated-tier cluster?

We don't currently support an automated migration process for migrating your Event Hubs data from a Standard or Premium namespace to a dedicated one.

### How do I create a zone-redundant dedicated cluster?

To provide zone redundancy for the Dedicated offering, all compute resources must have replicas across three datacenters in the same region.

You can't currently create zone-redundant dedicated clusters through the Azure portal or ARM templates. [Submit a support request](../event-hubs-dedicated-cluster-create-portal.md#submit-a-support-request) to create one. Once a zone-redundant cluster is created, you can't scale it below 3 CUs.

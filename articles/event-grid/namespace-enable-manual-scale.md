---
title: Configure manual scale for an Azure Event Grid namespace
description: Learn how to manually configure throughput units (TUs) for an Azure Event Grid namespace by using the Azure portal.
ms.topic: how-to
ms.date: 05/20/2026
author: robece
ms.author: robece
# Customer intent: As an Azure developer or administrator, I want to manually configure throughput units on my Event Grid namespace so that I can control the ingress and egress event rate capacity.
---

# Configure manual scale for an Azure Event Grid namespace

This article shows you how to manually configure throughput units (TUs) for an Azure Event Grid namespace. Throughput units define the ingress and egress event rate capacity in a namespace. If you want the namespace to automatically adjust TUs based on workload demand instead, see [Enable autoscale for an Event Grid namespace](namespace-enable-autoscale.md).

## Configure throughput units (TUs) for a namespace

If you already created a namespace and want to increase or decrease TUs, follow the next steps:

1. Go to the Azure portal.
1. In the search bar, search for **Event Grid Namespaces**, and then select **Event Grid Namespaces** from the results.
1. On the **Event Grid Namespaces** page, select the namespace you want to configure TUs for.
1. On the **Event Grid Namespace** page, select **Scale** in the left navigation menu.
1. In the right pane, select **Manual scale** if not already selected.
1. Enter the number of **throughput units** in the edit box or use the scroller to increase or decrease the number.
1. Select **Apply** to apply the changes.

    :::image type="content" source="media/create-view-manage-namespaces/namespace-scale.png" alt-text="Screenshot showing Event Grid scale page." lightbox="media/create-view-manage-namespaces/namespace-scale.png":::

    > [!NOTE]
    > For quotas and limits for resources in a namespace including maximum TUs in a namespace, see [Azure Event Grid quotas and limits](quotas-limits.md).

## Related content

- [Enable autoscale for an Event Grid namespace](namespace-enable-autoscale.md)
- [Create, view, and manage namespaces](create-view-manage-namespaces.md)
- [Azure Event Grid quotas and limits](quotas-limits.md)
- [Azure Event Grid namespace concepts](concepts-event-grid-namespaces.md)

---
title: Enable Change Tracking and Inventory at Scale with the Azure Portal - Machines Pane
description: This article describes how to enable Azure Change Tracking and Inventory at scale for Windows and Linux VMs by using the Machines pane in the Azure portal.
#customer intent: As a customer, I want to enable Azure Change Tracking and Inventory for multiple virtual machines at once so that I can monitor changes efficiently across my environment.
services: automation
ms.date: 11/06/2025
ms.topic: how-to
ms.service: azure-change-tracking-inventory
author: RochakSingh-blr
ms.author: v-rochak2
ms.custom: sfi-image-nochange
---

# Enable Change Tracking and Inventory at scale by using the Azure portal

**Applies to:** :heavy_check_mark: Windows VMs :heavy_check_mark: Linux VMs :heavy_check_mark: Windows Registry :heavy_check_mark: Windows Files :heavy_check_mark: Linux Files :heavy_check_mark: Windows Software

This article provides procedures that show how you can enable Azure Change Tracking and Inventory at scale by using the Azure portal **Machines** pane.

## At-scale deployment

1. In the Azure portal, search for **Change Tracking and Inventory**.

    :::image type="content" source="media/enable-change-tracking-at-scale-machines-blade/portal-discoverability.png" alt-text="Screenshot that shows selecting Change Tracking and Inventory in the Azure portal." lightbox="media/enable-change-tracking-at-scale-machines-blade/portal-discoverability.png":::

1. On the **Resources** tab, select **Machines**. Based on the selected subscription, the machines that are enabled for Change Tracking and Inventory appear in the **Enabled** column.

     :::image type="content" source="media/enable-change-tracking-at-scale-machines-blade/select-subscription.png" alt-text="Screenshot that shows the Machines pane and subscriptions." lightbox="media/enable-change-tracking-at-scale-machines-blade/select-subscription.png":::

    At the top of the pane, you also see a banner that shows the total number of machines in the selected subscription that are enabled for Change Tracking and Inventory.

1. In the filters, select **Enabled** to view the options:
   - Select **Yes** to view the machines that are enabled with Change Tracking and Inventory.
   - Select **No** to view the machines that aren't enabled with Change Tracking and Inventory.
   - Choose **Select all** to view all the machines in the selected subscription with or without Change Tracking and Inventory enabled.

     :::image type="content" source="media/enable-change-tracking-at-scale-machines-blade/filters-enabled.png" alt-text="Screenshot that shows selecting the Enabled filter." lightbox="media/enable-change-tracking-at-scale-machines-blade/filters-enabled.png":::

1. To enable Change Tracking and Inventory at scale, do the following steps:

    1. In the **Enabled** filters column, select **No**.
    1. In the **Machine Status** filters column, select **VM running** and **Connected**.
    1. In the **Name** column, select all the machines to view which ones are ready to be enabled.
    1. Select all the machines for which you intend to enable Change Tracking and Inventory, and then select **Enable Change Tracking and Inventory**.

    :::image type="content" source="media/enable-change-tracking-at-scale-machines-blade/bulk-deployment.png" alt-text="Screenshot that shows selecting machines to enable Change Tracking and Inventory at scale." lightbox="media/enable-change-tracking-at-scale-machines-blade/bulk-deployment.png":::

## Related content

- Learn how to [enable Change Tracking and Inventory at scale by using an Azure policy](enable-change-tracking-at-scale-policy.md).

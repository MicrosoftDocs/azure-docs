---
title: Enable Change Tracking and Inventory at Scale with Azure portal - Machines pane
description: This article describes how to enable change tracking and inventory at scale for Windows and Linux VMs using the Machines pane in the Azure portal.
#customer intent: As a customer, I want to enable Azure Change Tracking and Inventory for multiple virtual machines at once so that I can monitor changes efficiently across my environment.
services: automation
ms.date: 11/06/2025
ms.topic: how-to
ms.service: azure-change-tracking-inventory
author: RochakSingh-blr
ms.author: v-rochak2
ms.custom: sfi-image-nochange
---

# Enable Change Tracking and Inventory at scale using Azure portal

**Applies to:** :heavy_check_mark: Windows VMs :heavy_check_mark: Linux VMs :heavy_check_mark: Windows Registry :heavy_check_mark: Windows Files :heavy_check_mark: Linux Files :heavy_check_mark: Windows Software

This article provides detailed procedure on how you can enable Azure CTI at scale using Azure portal - Machines pane.

## At scale deployment

1. In the Azure portal, search for **Change Tracking and Inventory**.

    :::image type="content" source="media/enable-change-tracking-at-scale-machines-blade/portal-discoverability.png" alt-text="Screenshot showing the selection Change Tracking and Inventory from Azure portal." lightbox="media/enable-change-tracking-at-scale-machines-blade/portal-discoverability.png":::

1. Select **Machines** from the **Resources**. As per the selected subscription, the machines are listed which will confirm if they are enabled for Azure CTI under the **Enabled** column.

     :::image type="content" source="media/enable-change-tracking-at-scale-machines-blade/select-subscription.png" alt-text="Screenshot showing the selection of Machines pane and subscription." lightbox="media/enable-change-tracking-at-scale-machines-blade/select-subscription.png":::

    On the top of the pane, you will also see a banner which displays the total number of machines in the selected subscription that are enabled for Azure CTI.

1. In the filters, select **Enabled** to view the options. 
   - Select **Yes** to view the machines enabled with Azure CTI.
   - Select **No** to view the machines that aren't enabled with Azure CTI.
   - Select **Select all** to view all the machines in the selected subscription with or without Azure CTI enabled.

     :::image type="content" source="media/enable-change-tracking-at-scale-machines-blade/filters-enabled.png" alt-text="Screenshot showing the selection of Enabled filter." lightbox="media/enable-change-tracking-at-scale-machines-blade/filters-enabled.png":::

1. To enable Azure CTI at scale, do the following:

    1. In the **Enabled** filters column, select *No*.
    1. In the **Machine status** filters column, select *VM running* and *Connected*.
    1. Select all in the **Name** column to view the list of machines that are ready to be enabled.
    1. Select all the machines for which you intend to enable the CTI and then select **Enable Change Tracking and Inventory**.

    :::image type="content" source="media/enable-change-tracking-at-scale-machines-blade/bulk-deployment.png" alt-text="Screenshot showing the selection to enable Change Tracking and Inventory at scale." lightbox="media/enable-change-tracking-at-scale-machines-blade/bulk-deployment.png":::


## Next steps

Learn [how to enable Azure CTI at scale using Azure policy](enable-change-tracking-at-scale-policy.md).

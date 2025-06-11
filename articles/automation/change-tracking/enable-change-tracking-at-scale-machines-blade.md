---
title: Enable Change Tracking and Inventory at Scale Using Azure Portal - Machines Blade
description: Learn how to enable change tracking and inventory at scale for Windows and Linux VMs using the Machines blade in the Azure portal.
services: automation
ms.subservice: change-inventory-management
ms.date: 04/03/2025
ms.topic: how-to
ms.service: azure-automation
author: jasminemehndir
ms.author: v-jasmineme
---

# Enable Change Tracking at scale using Azure portal - Machines blade

**Applies to:** :heavy_check_mark: Windows VMs :heavy_check_mark: Linux VMs :heavy_check_mark: Windows Registry :heavy_check_mark: Windows Files :heavy_check_mark: Linux Files :heavy_check_mark: Windows Software

This article provides detailed procedure on how you can enable change tracking and inventory at scale using Azure portal - Machines blade.

## At scale deployment

1. In Azure portal, search for  **Change Tracking and Inventory**.

    :::image type="content" source="media/enable-change-tracking-at-scale-machines-blade/portal-discoverability.png" alt-text="Screenshot showing the selection Change Tracking and Inventory from Azure portal." lightbox="media/enable-change-tracking-at-scale-machines-blade/portal-discoverability.png":::

1. As per the selected subscription, the machines are listed which will confirm if they are enabled for Change Tracking and Inventory under the **Enabled** column.

     :::image type="content" source="media/enable-change-tracking-at-scale-machines-blade/select-subscription.png" alt-text="Screenshot showing the selection of Machines blade and subscription." lightbox="media/enable-change-tracking-at-scale-machines-blade/select-subscription.png":::

    On the top of the page, you will also see a banner which displays the total number of machines in the selected subscription that are enabled for Change Tracking and Inventory.

1. In the filters, select **Enabled** to view the options. 
   - Select Yes to view the machines enabled with Change Tracking and Inventory.
   - Select No to view the machines that aren't enabled with Change Tracking and Inventory.
   - Select All to view all the machines in the selected subscription with or without Change Tracking and Inventory enabled.
   
     :::image type="content" source="media/enable-change-tracking-at-scale-machines-blade/filters-enabled.png" alt-text="Screenshot showing the selection of Enabled filter." lightbox="media/enable-change-tracking-at-scale-machines-blade/filters-enabled.png":::

1. To enable Change Tracking and Inventory at scale:

    1. In the **Enabled** filters column, select *No*.
    1. In the **Machine status** filters column, select *VM running* and *Connected*.
    1. Select all in the **Name** column to view the list of machines that are ready to be enabled.
    1. Select all the machines and then select **Enable Change Tracking and Inventory**.

    :::image type="content" source="media/enable-change-tracking-at-scale-machines-blade/bulk-deployment.png" alt-text="Screenshot showing the selection to enable Change Tracking and Inventory at scale." lightbox="media/enable-change-tracking-at-scale-machines-blade/bulk-deployment.png":::


## Next steps

Learn on [how to enable Change Tracking at scale using policy](enable-change-tracking-at-scale-policy.md).

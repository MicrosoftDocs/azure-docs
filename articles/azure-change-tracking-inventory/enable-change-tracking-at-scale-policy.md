---
title: Enable Change Tracking and Inventory at Scale for Azure VMs using Azure Policy
description: Learn how to use Azure Policy to enable change tracking and inventory at scale for Windows and Linux VMs, including the Arc-enabled VMs and Azure Virtual Machine Scale Sets.
#customer intent: As a customer, I want to enable Azure change tracking and inventory for Azure VMs at scale so that I can monitor configuration changes efficiently.
services: automation
ms.date: 12/03/2025
ms.topic: how-to
ms.service: azure-change-tracking-inventory
author: RochakSingh-blr
ms.author: v-rochak2
---

# Enable Change Tracking and Inventory at scale for Azure VMs using Azure policy

**Applies to:** :heavy_check_mark: Windows VMs :heavy_check_mark: Linux VMs :heavy_check_mark: Windows Registry :heavy_check_mark: Windows Files :heavy_check_mark: Linux Files :heavy_check_mark: Windows Software

This article provides detailed procedure on how to enable Azure Change Tracking and Inventory (CTI) at scale using Azure policy.

## Prerequisite

Before you enable Azure CTI, ensure you [Create a data collection rule (DCR)](create-data-collection-rule.md) or use an existing one.

## Enable Azure Change Tracking and Inventory at scale

Using the Deploy if not exist (DINE) policy, you can enable Change tracking with Azure Monitor Agent at scale and in the most efficient manner.

1. Sign in to the [Azure portal](https://portal.azure.com) and select **Change Tracking and Inventory**.

   :::image type="content" source="media/enable-change-tracking-at-scale-machines-blade/portal-discoverability.png" alt-text="Screenshot showing the selection Change Tracking and Inventory from Azure portal." lightbox="media/enable-change-tracking-at-scale-machines-blade/portal-discoverability.png":::

1. On the **Change Tracking and Inventory Center | Machines** pane, under **Manage**, select **Policy**.

    :::image type="content" source="media/enable-change-tracking-at-scale-policy/select-policy.png" alt-text="Screenshot showing the selection policy from Azure portal." lightbox="media/enable-change-tracking-at-scale-policy/select-policy.png":::


1. On the **Change Tracking and Inventory Center | Policy** pane, under the filter **Definition Type**, select **Initiative** and in **Category** filter, select **Change Tracking and Inventory**. You'll see a list of three policies:

    #### Arc-enabled virtual machines

     - Select *Enable Change Tracking and Inventory for Arc-enabled virtual machines*.
 
       :::image type="content" source="media/create-data-collection-rule/enable-for-arc-virtual-machine-manager-inline.png" alt-text="Screenshot showing the selection of Arc-enabled virtual machines." lightbox="media/create-data-collection-rule/enable-for-arc-virtual-machine-manager-expanded.png":::

    #### Virtual machines scale sets

     - Select *[Preview]: Enable Change Tracking and Inventory for Virtual Machine Scale Sets*.
     
       :::image type="content" source="media/create-data-collection-rule/enable-for-virtual-machine-scale-set-inline.png" alt-text="Screenshot showing the selection of virtual machines scale sets." lightbox="media/create-data-collection-rule/enable-for-virtual-machine-scale-set-expanded.png":::

    #### Virtual machines

     - Select *Enable Change Tracking and Inventory for virtual machines*.

       :::image type="content" source="media/create-data-collection-rule/enable-for-virtual-machine-inline.png" alt-text="Screenshot showing the selection of virtual machines." lightbox="media/create-data-collection-rule/enable-for-virtual-machine-expanded.png":::


1. Select **Enable Change Tracking and Inventory for virtual machines** to enable the change tracking on Azure virtual machines.
   This step includes three policies, each determined by the operating system type of the selected machine:

   - Assign Built in User-Assigned Managed identity to Virtual machines
   - Configure ChangeTracking Extension for Windows virtual machines
   - Configure ChangeTracking Extension for Linux virtual machines

     :::image type="content" source="media/create-data-collection-rule/enable-change-tracking-virtual-machines-inline.png" alt-text="Screenshot showing the selection of three policies." lightbox="media/create-data-collection-rule/enable-change-tracking-virtual-machines-expanded.png":::

1. Select **Assign initiative** to assign the policy to a resource group. For example, *Assign Built in User-Assigned Managed identity to virtual machines*.

   > [!NOTE]
   > The Resource group contains virtual machines and when you assign the policy, it will enable change tracking at scale to a resource group. The virtual machines that are on-boarded to the same resource group will automatically have the change tracking feature enabled.

1. On the **Enable Change Tracking and Inventory for virtual machines** pane, enter the following options:
   1. On the **Basics** tab, you can define the scope. Select the three dots to configure a scope.
   1. On the **Scope** pane, provide the **Subscription** and **Resource Group**.
   1. On the **Parameters** tab, select the option in the **Bring Your Own User-Assigned Managed Identity**.
   1. Provide the **Data Collection Rule Resource Id**. Learn more on [how to obtain the Data Collection Rule Resource ID after you create the Data collection rule](create-data-collection-rule.md).
   1. Select **Review + create**.

## Next steps

Learn more on [how to enable Azure CTI at scale using Azure portal](enable-change-tracking-at-scale-machines-blade.md).

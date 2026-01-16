---
title: Enable Change Tracking and Inventory at Scale for Azure VMs by Using Azure Policy
description: Learn how to use Azure Policy to enable Azure Change Tracking and Inventory at scale for Windows and Linux VMs, including Azure Arc-enabled VMs and Azure Virtual Machine Scale Sets.
#customer intent: As a customer, I want to enable Azure Change Tracking and Inventory for Azure VMs at scale so that I can monitor configuration changes efficiently.
services: automation
ms.date: 12/03/2025
ms.topic: how-to
ms.service: azure-change-tracking-inventory
author: RochakSingh-blr
ms.author: v-rochak2
---

# Enable Azure Change Tracking and Inventory at scale for Azure VMs by using Azure Policy

**Applies to:** :heavy_check_mark: Windows VMs :heavy_check_mark: Linux VMs :heavy_check_mark: Windows Registry :heavy_check_mark: Windows Files :heavy_check_mark: Linux Files :heavy_check_mark: Windows Software

This article provides detailed procedures on how to enable Azure Change Tracking and Inventory at scale by using Azure Policy.

## Prerequisite

Before you enable Change Tracking and Inventory, ensure that you [create a data collection rule (DCR)](create-data-collection-rule.md) or use an existing one.

## Enable Azure Change Tracking and Inventory at scale

By using the deploy-if-not-exists (DINE) policy, you can enable Change Tracking with the Azure Monitor Agent at scale and in the most efficient manner.

1. Sign in to the [Azure portal](https://portal.azure.com) and select **Change Tracking and Inventory**.

   :::image type="content" source="media/enable-change-tracking-at-scale-machines-blade/portal-discoverability.png" alt-text="Screenshot that shows selecting Change Tracking and Inventory in the Azure portal." lightbox="media/enable-change-tracking-at-scale-machines-blade/portal-discoverability.png":::

1. On the **Change Tracking and Inventory Center | Machines** pane, under **Manage**, select **Policy**.

    :::image type="content" source="media/enable-change-tracking-at-scale-policy/select-policy.png" alt-text="Screenshot that shows selecting Policy in the Azure portal." lightbox="media/enable-change-tracking-at-scale-policy/select-policy.png":::

1. On the **Change Tracking and Inventory Center | Policy** pane, under the filter **Definition Type**, select **Initiative**. In the **Category** filter, select **Change Tracking and Inventory** to see three policies:

   - Azure Arc-enabled virtual machines

     - Select **Enable ChangeTracking and Inventory for Arc-enabled virtual machines**.
 
       :::image type="content" source="media/create-data-collection-rule/enable-for-arc-virtual-machine-manager-inline.png" alt-text="Screenshot that shows selecting Azure Arc-enabled virtual machines." lightbox="media/create-data-collection-rule/enable-for-arc-virtual-machine-manager-expanded.png":::

   - Azure Virtual Machine Scale Sets

     - Select **Enable ChangeTracking and Inventory for virtual machine scale sets**.
     
       :::image type="content" source="media/create-data-collection-rule/enable-for-virtual-machine-scale-set-inline.png" alt-text="Screenshot that shows selecting Virtual Machine Scale Sets." lightbox="media/create-data-collection-rule/enable-for-virtual-machine-scale-set-expanded.png":::

   - Virtual machines

     - Select **Enable ChangeTracking and Inventory for virtual machines**.

       :::image type="content" source="media/create-data-collection-rule/enable-for-virtual-machine-inline.png" alt-text="Screenshot that shows selecting virtual machines." lightbox="media/create-data-collection-rule/enable-for-virtual-machine-expanded.png":::

1. Select **Enable ChangeTracking and Inventory for virtual machines** to enable Change Tracking on Azure VMs. This step includes three policies. Each policy is determined by the operating system type of the selected machine:

   - **Assign Built-In User-Assigned Managed Identity to Virtual Machines**
   - **Configure ChangeTracking extension for Windows virtual machines**
   - **Configure ChangeTracking extension for Linux virtual machines**

     :::image type="content" source="media/create-data-collection-rule/enable-change-tracking-virtual-machines-inline.png" alt-text="Screenshot that shows selecting three policies." lightbox="media/create-data-collection-rule/enable-change-tracking-virtual-machines-expanded.png":::

1. Select **Assign initiative** to assign the policy to a resource group. An example policy is **Assign Built-In User-Assigned Managed Identity to Virtual Machines**.

   > [!NOTE]
   > The resource group contains VMs. When you assign the policy, it enables Change Tracking at scale to a resource group. The VMs that are onboarded to the same resource group automatically have Change Tracking enabled.

1. On the **Enable ChangeTracking and Inventory for virtual machines** pane, enter the following options:

   1. On the **Basics** tab, you can define the scope. Select the ellipsis to configure a scope.
   1. On the **Scope** pane, enter **Subscription** and **Resource Group** values.
   1. On the **Parameters** tab, select the option in **Bring Your Own User-Assigned Managed Identity**.
   1. Enter the **Data Collection Rule Resource Id** value. Learn more about how to [obtain the data collection rule resource ID after you create the data collection rule](create-data-collection-rule.md).
   1. Select **Review + create**.

## Related content

- Learn more about how to [enable Change Tracking and Inventory at scale by using the Azure portal](enable-change-tracking-at-scale-machines-blade.md).

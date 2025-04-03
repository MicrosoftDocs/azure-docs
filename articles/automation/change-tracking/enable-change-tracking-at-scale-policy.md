---
title: Enable Change Tracking and Inventory at Scale with Azure Policy
description: Learn how to use Azure Policy to enable change tracking and inventory at scale for Windows and Linux VMs, including Arc-enabled VMs and VM Scale Sets.
services: automation
ms.subservice: change-inventory-management
ms.date: 04/03/2025
ms.topic: how-to
ms.service: azure-automation
---

# Enable Change Tracking at scale using policy

**Applies to:** :heavy_check_mark: Windows VMs :heavy_check_mark: Linux VMs :heavy_check_mark: Windows Registry :heavy_check_mark: Windows Files :heavy_check_mark: Linux Files :heavy_check_mark: Windows Software

This article provides detailed procedure on how you can enable change tracking and inventory at scale using Azure policy.

## Prerequisite

- You must [create the Data collection rule](enable-vms-monitoring-agent.md#create-data-collection-rule).

## Enable Change tracking

Using the Deploy if not exist (DINE) policy, you can enable Change tracking with Azure Monitoring Agent at scale and in the most efficient manner.

1. In Azure portal, select **Change Tracking and Inventory**.

   :::image type="content" source="media/enable-change-tracking-at-scale-machines-blade/portal-discoverability.png" alt-text="Screenshot showing the selection Change Tracking and Inventory from Azure portal." lightbox="media/enable-change-tracking-at-scale-machines-blade/portal-discoverability.png":::

1. In the **Change Tracking and Inventory Center | Machines, page**,  under **Manage**, select **Policy**.

    :::image type="content" source="media/enable-change-tracking-at-scale-policy/select-policy.png" alt-text="Screenshot showing the selection policy from Azure portal." lightbox="media/enable-change-tracking-at-scale-policy/select-policy.png":::


1. In **Change Tracking and Inventory Center | Policy** page, under the filter **Definition Type**, select **Initiative** and in **Category** filter, select **Change Tracking and Inventory**. You'll see a list of three policies:

    #### [Arc-enabled virtual machines](#tab/arcvm)

     - Select *Enable Change Tracking and Inventory for Arc-enabled virtual machines*.
 
       :::image type="content" source="media/enable-vms-monitoring-agent/enable-for-arc-virtual-machine-manager-inline.png" alt-text="Screenshot showing the selection of Arc-enabled virtual machines." lightbox="media/enable-vms-monitoring-agent/enable-for-arc-virtual-machine-manager-expanded.png":::

    #### [Virtual Machines Scale Sets](#tab/vmss)

     - Select *[Preview]: Enable Change Tracking and inventory for Virtual Machine Scale Sets*.
     
       :::image type="content" source="media/enable-vms-monitoring-agent/enable-for-virtual-machine-scale-set-inline.png" alt-text="Screenshot showing the selection of virtual machines scale sets." lightbox="media/enable-vms-monitoring-agent/enable-for-virtual-machine-scale-set-expanded.png":::

    #### [Virtual machines](#tab/vm)

     - Select *Enable Change Tracking and inventory for virtual machines*.
 
       :::image type="content" source="media/enable-vms-monitoring-agent/enable-for-vm-inline.png" alt-text="Screenshot showing the selection of virtual machines." lightbox="media/enable-vms-monitoring-agent/enable-for-vm-expanded.png"::: 
    

1. Select *Enable Change Tracking and Inventory for virtual machines* to enable the change tracking on Azure virtual machines.
   This initiative consists of three policies:

   - Assign Built in User-Assigned Managed identity to Virtual machines
   - Configure ChangeTracking Extension for Windows virtual machines
   - Configure ChangeTracking Extension for Linux virtual machines

     :::image type="content" source="media/enable-vms-monitoring-agent/enable-change-tracking-virtual-machines-inline.png" alt-text="Screenshot showing the selection of three policies." lightbox="media/enable-vms-monitoring-agent/enable-change-tracking-virtual-machines-expanded.png":::

1. Select **Assign** to assign the policy to a resource group. For example, *Assign Built in User-Assigned Managed identity to virtual machines*.

   > [!NOTE]
   > The Resource group contains virtual machines and when you assign the policy, it will enable change tracking at scale to a resource group. The virtual machines that are on-boarded to the same resource group will automatically have the change tracking feature enabled.

1. In the **Enable Change Tracking and Inventory for virtual machines** page, enter the following options:
   1. In **Basics**, you can define the scope. Select the three dots to configure a scope. In the **Scope** page, provide the **Subscription** and **Resource group**.
   1. In **Parameters**, select the option in the **Bring your own user assigned managed identity**.
   1. Provide the **Data Collection Rule Resource id**. Learn more on [how to obtain the Data Collection Rule Resource ID after you create the Data collection rule](enable-vms-monitoring-agent.md#create-data-collection-rule).
   1. Select **Review + create**.

## Next steps

* Learn more on [how to enable Change Tracking and Inventory at scale using Azure portal - Machines blade](enable-change-tracking-at-scale-machines-blade.md).

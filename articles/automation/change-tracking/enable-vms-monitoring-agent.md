---
title: Enable Azure Automation Change Tracking for single machine and multiple machines from the portal.
description: This article tells how to enable the Change Tracking feature for single machine and multiple machines at scale from the Azure portal.
services: automation
ms.subservice: change-inventory-management
ms.date: 11/24/2022
ms.topic: conceptual
---

# Enable Change Tracking and Inventory using Azure Monitoring Agent (Preview)  

**Applies to:** :heavy_check_mark: Windows VMs :heavy_check_mark: Linux VMs :heavy_check_mark: Windows Registry :heavy_check_mark: Windows Files :heavy_check_mark: Linux Files :heavy_check_mark: Windows Software

This article describes how you can enable [Change Tracking and Inventory](overview.md) for single and multiple Azure Virtual Machines (VMs) from the Azure portal. 

## Prerequisites

- An Azure subscription. If you don't have one yet, you can [activate your MSDN subscriber benefits](https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/) or sign up for a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- A [virtual machine](../../virtual-machines/windows/quick-create-portal.md) configured in the specified region.

## Enable Change Tracking and Inventory

This section provides detailed procedure on how you can enable change tracking on a single VM and multiple VMs.

#### [For a single VM](#tab/singlevm)

1. Sign in to [Azure portal](https://portal.azure.com) and navigate to **Virtual machines**.

   :::image type="content" source="media/enable-vms-monitoring-agent/select-vm-portal-inline.png" alt-text="Screenshot showing how to select virtual machine from the portal." lightbox="media/enable-vms-monitoring-agent/select-vm-portal-expanded.png":::

1. Select the virtual machine for which you want to enable Change Tracking.
1. In the search enter **Change tracking** to view the change tracking and inventory page.

   :::image type="content" source="media/enable-vms-monitoring-agent/select-change-tracking-vm-inline.png" alt-text="Screenshot showing to select change tracking option for a single virtual machine from the portal." lightbox="media/enable-vms-monitoring-agent/select-change-tracking-vm-expanded.png":::

1. In the **Stay up-to-date with all changes** layout, select **Enable using AMA agent (Recommended)** option and **Enable**. 

   This will initiate the deployment and the notification appears on the top right corner of the screen. You can also [change the workspace](manage-change-tracking-monitoring-agent.md#change-a-workspace) from this screen.
   
   :::image type="content" source="media/enable-vms-monitoring-agent/deployment-success-inline.png" alt-text="Screenshot showing the notification of deployment." lightbox="media/enable-vms-monitoring-agent/deployment-success-expanded.png":::


#### [For multiple VMs](#tab/multiplevms)

1. Sign in to [Azure portal](https://portal.azure.com) and navigate to **Virtual machines**.

   :::image type="content" source="media/enable-vms-monitoring-agent/select-vm-portal-inline.png" alt-text="Screenshot showing how to select virtual machine from the portal." lightbox="media/enable-vms-monitoring-agent/select-vm-portal-expanded.png":::

1. Select the virtual machines to which you intend to enable change tracking and select **Services** > **Change Tracking**. 

   :::image type="content" source="media/enable-vms-monitoring-agent/select-change-tracking-multiple-vms-inline.png" alt-text="Screenshot showing how to select multiple virtual machines from the portal." lightbox="media/enable-vms-monitoring-agent/select-change-tracking-multiple-vms-expanded.png":::

   > [!NOTE]
   > You can select upto 250 virtual machines at a time to enable this feature.

1. In **Enable Change Tracking** page, select the banner at the top of the page, **Click here to try new change tracking and inventory with Azure Monitoring Agent (AMA) experience**.

   :::image type="content" source="media/enable-vms-monitoring-agent/enable-change-tracking-multiple-vms-inline.png" alt-text="Screenshot showing how to select enable change tracking for multiple vms from the portal." lightbox="media/enable-vms-monitoring-agent/enable-change-tracking-multiple-vms-expanded.png":::

1. In **Enable Change Tracking** page, you can view the list of machines that are enabled, ready to be enabled and the ones that you can't enable. You can use the filters to select the **Subscription**, **Location**, and **Resource groups**. You can select a maximum of three resource groups.

   :::image type="content" source="media/enable-vms-monitoring-agent/change-tracking-status-inline.png" alt-text="Screenshot showing the status of multiple vm." lightbox="media/enable-vms-monitoring-agent/change-tracking-status-expanded.png":::

1. Select **Enable** to initiate the deployment.
1. A notification appears on the top right corner of the screen indicating the status of deployment.
--- 

> [!NOTE]
> It usually takes up to two to three minutes to successfully onboard and enable the virtual machine(s). After you enable a virtual machine for change tracking, you can make changes to the files, registries, or software for the specific VM. For more information, see [Configure data collection rule](manage-change-tracking-monitoring-agent.md#configure-data-collection-rule).

 
## Next steps

- For details of working with the feature, see [Manage Change Tracking](../change-tracking/manage-change-tracking-monitoring-agent.md).
- To troubleshoot general problems with the feature, see [Troubleshoot Change Tracking and Inventory issues](../troubleshoot/change-tracking.md).
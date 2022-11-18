---
title: Enable Azure Automation Change Tracking for single machine and multiple machines from the portal.
description: This article tells how to enable the Change Tracking feature for single machine and multiple machines at scale from the Azure portal.
services: automation
ms.subservice: change-inventory-management
ms.date: 11/17/2022
ms.topic: conceptual
---

# Enable Change Tracking and Inventory for virtual machines from Azure portal

**Applies to:** :heavy_check_mark: Windows VMs :heavy_check_mark: Linux VMs :heavy_check_mark: Windows Registry

This article describes how you can enable [Change Tracking and Inventory](overview.md) for single and multiple Azure Virtual Machines (VMs) from the Azure portal. 

## Prerequisites

- An Azure subscription. If you don't have one yet, you can [activate your MSDN subscriber benefits](https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/) or sign up for a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- A [virtual machine](../../virtual-machines/windows/quick-create-portal.md) and ensure that your virtual machine(s) are configured in the specified region.

## Enable Change Tracking and Inventory

#### [For a single VM](#tab/singlevm)

1. Sign in to [Azure portal](https://portal.azure.com) and navigate to **Virtual machines**.

   :::image type="content" source="media/enable-vms-ama/select-vm-portal-inline.png" alt-text="Screenshot showing how to select virtual machine from the portal." lightbox="media/enable-vms-ama/select-vm-portal-expanded.png":::

1. Select the virtual machine to which you want to configure the changes and in the search enter **Change tracking**.

   :::image type="content" source="media/enable-vms-ama/select-change-tracking-vm-inline.png" alt-text="Screenshot showing to select change tracking option for a single virtual machine from the portal." lightbox="media/enable-vms-ama/select-change-tracking-vm-expanded.png":::

1. Select **Enable using AMA agent (Recommended)** option and **Enable**. This will inititate the deployment and the notification appears on the top right corner of the screen. You can also [change the workspace](#change-a-workspace) from this screen.
   
    :::image type="content" source="media/enable-vms-ama/deployment-success-inline.png" alt-text="Screenshot showing the notification of deployment." lightbox="media/enable-vms-ama/deployment-success-expanded.png":::


#### [For multiple VMs](#tab/multiplevms)

1. Sign in to [Azure portal](https://portal.azure.com) and navigate to **Virtual machines**.

   :::image type="content" source="media/enable-vms-ama/select-vm-portal-inline.png" alt-text="Screenshot showing how to select virtual machine from the portal." lightbox="media/enable-vms-ama/select-vm-portal-expanded.png":::

1. Select the machines to which you intend to enable change tracking and select **Services** > **Change Tracking**. You can select upto 250 virtual machines at a time to enable this feature.

   :::image type="content" source="media/enable-vms-ama/select-change-tracking-multiple-vms-inline.png" alt-text="Screenshot showing how to select multiple virtual machine from the portal." lightbox="media/enable-vms-ama/select-change-tracking-multiple-vms-expanded.png":::

1. In **Enable Change Tracking**, select the banner on the top of the page, **Click to try new change tracking and inventory v2 experience**.

   :::image type="content" source="media/enable-vms-ama/enable-change-tracking-multiple-vms-inline.png" alt-text="Screenshot showing how to select enable change tracking for multiple vms from the portal." lightbox="media/enable-vms-ama/enable-change-tracking-multiple-vms-expanded.png":::

1. In **Enable Change Tracking** page, you can view the list of machines that are enabled, ready to be enabled and the ones that you can't enable. You can use the filters to select the **Subscription**, **Location**, and **Resource groups**. You can select a maximum of three resource groups.

   :::image type="content" source="media/enable-vms-ama/change-tracking-status-inline.png" alt-text="Screenshot showing the status of multiple vms." lightbox="media/enable-vms-ama/change-tracking-status-expanded.png":::

1. Select **Enable** to inititate the deployment and a notification appears on the top right corner of the screen.
--- 

It usually takes upto two to three minutes to successfully onboard and enable the machine(s). After you enable a machine for change tracking, you can make changes to the files, registries, or software for the specific VM. For more information, see [Configure data collection rule](#configure-data-collection-rule).

## Change a workspace

#### [For single VMs](#tab/workspace-singlevm)

1. Select the virtual machine, in search, enter **change tracking**.
1. Select **Open change and inventory center**.
    
    :::image type="content" source="media/enable-vms-ama/select-change-and-inventory-center-inline.png" alt-text="Screenshot showing how to select change and inventory center from the portal." lightbox="media/enable-vms-ama/select-change-and-inventory-center-expanded.png":::

1. Select the workspace from the filter, and **Apply** and select **Settings** to configure the data collection rule at the workspace level.


#### [For multiple VMs](#tab/workspace-multiplevms)

1. Select the virtual machine, in search, enter **change tracking**.
1. In the **Stay up-to-date with all changes** layout, in **Log analytics workspace**, select **Change**.
1. In **Custom Configuration** screen, provide the **Subscription**, **Location**, and **Workspace**. and select **OK**.

   :::image type="content" source="media/enable-vms-ama/custom-configuration-inline.png" alt-text="Screenshot showing how change a workspace." lightbox="media/enable-vms-ama/custom-configuration-expanded.png":::
---

### Configure data collection rule

1. Select your virtual machine and in the search, enter **Change tracking**.

1. Select **Settings** to view the **Data Collection Rule Configuration**. This allows you to configure changes on a VM at a granular level. 

1. Select **+Add** to enter the file settings. Enter the **Name**, **Group**, **File path**, **Path Type** which can be either a file or folder and select **Add**.

   :::image type="content" source="media/enable-vms-ama/add-windows-file-setting.png" alt-text="Screenshot showing how to enter file settings for a single virtual machine.":::

1. You can further select the filter to choose a specific data collection rule to configure changes to specific virtual machine.

   :::image type="content" source="media/enable-vms-ama/select-data-collection-rule-inline.png" alt-text="Screenshot showing to select data collection rule to further configure a virtual machine." lightbox="media/enable-vms-ama/select-data-collection-rule-expanded.png":::

1. In the **Edit windows file setting**, you can make changes to the existing rule and select **Save**.

> [!NOTE]
> A single virtual machine will have one data collection rule. However, in a workspace, as there are many virtual machines, there will be multiple data collection rules but you will see the default data collection rule which is primarily the first data collection rule that you have created.
 
## Next steps

- For details of working with the feature, see [Manage Change Tracking](manage-change-tracking.md) and [Manage Inventory](manage-inventory-vms.md).
- To troubleshoot general problems with the feature, see [Troubleshoot Change Tracking and Inventory issues](../troubleshoot/change-tracking.md).
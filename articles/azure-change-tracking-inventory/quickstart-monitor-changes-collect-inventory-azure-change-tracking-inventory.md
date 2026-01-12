---
title: 'Quickstart: Enable Azure Change Tracking and Inventory for Single and Multiple Machines from the Portal'
description: In this quickstart, learn how to enable Azure Change Tracking and Inventory for single and multiple machines from the portal.
services: automation
ms.date: 12/09/2025
ms.topic: quickstart
#Customer intent: As a customer, I want to enable Azure Change Tracking and Inventory so that I can further use Azure Change Tracking and Inventory.
ms.service: azure-change-tracking-inventory
ms.author: v-rochak2
author: RochakSingh-blr
zone_pivot_groups: enable-change-tracking-inventory-using-monitoring-agent
ms.custom: sfi-image-nochange
---

# Quickstart: Enable Azure Change Tracking and Inventory by using the Azure portal

**Applies to:** :heavy_check_mark: Windows VMs :heavy_check_mark: Linux VMs :heavy_check_mark: Windows Registry :heavy_check_mark: Windows Files :heavy_check_mark: Linux Files :heavy_check_mark: Windows Software :heavy_check_mark: File Content Changes

This article describes how you can enable [Azure Change Tracking and Inventory](overview-monitoring-agent.md) for single and multiple Azure virtual machines (VMs) from the Azure portal.

## Prerequisites

- An Azure subscription. If you don't have one yet, you can [activate your MSDN subscriber benefits](https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/) or sign up for a [free account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- A [VM](/azure/virtual-machines/windows/quick-create-portal) configured in the specified region.

## Enable Change Tracking and Inventory for single and multiple Azure VMs and Azure Arc-enabled VMs from the Azure portal

The following sections show how you can enable Change Tracking and Inventory on single and multiple Azure VMs and Azure Arc-enabled VMs from the Azure portal.

### Enable Change Tracking and Inventory for single Azure VMs and Azure Arc-enabled VMs from the Azure portal

The next section provides detailed procedures on how you can enable Change Tracking on a single Azure VM and a single Azure Arc-enabled VM.

::: zone pivot="single-portal"

#### Enable Change Tracking and Inventory for a single Azure VM by using the portal

To enable Change Tracking and Inventory for a single Azure VM by using the portal, follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com), and go to **Virtual machines**.

   :::image type="content" source="media/create-data-collection-rule/select-virtual-machine-portal-inline.png" alt-text="Screenshot that shows how to select a VM from the portal." lightbox="media/create-data-collection-rule/select-virtual-machine-portal-expanded.png":::

   Select the VM for which you want to enable Change Tracking.

1. In the search bar, enter **Change tracking**. Select **Change tracking** to view the **Change Tracking and Inventory** pane.

   :::image type="content" source="media/create-data-collection-rule/select-change-tracking-virtual-machine-inline.png" alt-text="Screenshot that shows how to select the Change tracking option for a single VM from the portal." lightbox="media/create-data-collection-rule/select-change-tracking-virtual-machine-expanded.png":::

1. In the **Stay up-to-date with all changes** pane, select the **Enable change tracking and inventory feature with AMA** option, and select **Enable**.

   Deployment of Change Tracking and Inventory gets initiated with a notification in the upper-right corner of the pane.

   :::image type="content" source="media/create-data-collection-rule/deployment-success-inline.png" alt-text="Screenshot that shows the notification of deployment." lightbox="media/create-data-collection-rule/deployment-success-expanded.png":::

> [!NOTE]
> It usually takes up to two to three minutes to successfully onboard and enable the VMs. After you enable a VM for Change Tracking, you can make changes to the files, registries, or software for the specific VM.

#### Enable Change Tracking and Inventory for a single Azure Arc-enabled VM by using the portal

To enable Change Tracking and Inventory for a single Azure Arc-enabled VM by using the portal, follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com). Search for **Machines-Azure Arc**.

   :::image type="content" source="media/create-data-collection-rule/select-arc-machines-portal.png" alt-text="Screenshot that shows how to select Azure Arc machines from the portal." lightbox="media/create-data-collection-rule/select-arc-machines-portal.png":::

1. Select the Azure Arc machine for which you want to enable Change Tracking.
1. Under **Operations**, select **Change tracking** to view the **Change Tracking and Inventory** pane.
1. In the **Stay up-to-date with all changes** pane, select the **Enable change tracking and inventory feature with AMA** option, and select **Enable**.

   :::image type="content" source="media/create-data-collection-rule/select-change-tracking-arc-virtual-machine.png" alt-text="Screenshot that shows how to select the Change Tracking option for a single Azure Arc VM from the portal." lightbox="media/create-data-collection-rule/select-change-tracking-arc-virtual-machine.png":::

   Deployment of Change Tracking and Inventory gets initiated with a notification in the upper-right corner of the pane.

:::zone-end

::: zone pivot="multiple-portal-cli"

### Enable Change Tracking and Inventory for multiple VMs by using the Azure portal and the Azure CLI

This section provides detailed procedures on how you can enable Change Tracking and Inventory on multiple Azure VMs and Azure Arc-enabled VMs.

#### Enable Change Tracking and Inventory for multiple Azure VMs by using the portal

To enable Change Tracking and Inventory for multiple Azure VMs by using the portal, follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com), and go to **Virtual machines**.

   :::image type="content" source="media/create-data-collection-rule/select-virtual-machine-portal-inline.png" alt-text="Screenshot that shows how to select a VM from the portal." lightbox="media/create-data-collection-rule/select-virtual-machine-portal-expanded.png":::

1. Select the VMs to which you intend to enable Change Tracking, and select **Services** > **Change Tracking**.

   :::image type="content" source="media/create-data-collection-rule/select-change-tracking-multiple-virtual-machines-inline.png" alt-text="Screenshot that shows how to select multiple VMs from the portal." lightbox="media/create-data-collection-rule/select-change-tracking-multiple-virtual-machines-expanded.png":::

   > [!NOTE]
   > You can enable Change Tracking and Inventory on up to 250 VMs at a time.

1. In the **Enable Change Tracking** pane, you can view the list of VMs that are enabled, the VMs that are ready to be enabled, and the VMs that you can't enable. You can use the filters to select the subscription, location, and resource groups. You can select a maximum of three resource groups.

   :::image type="content" source="media/create-data-collection-rule/change-tracking-status-inline.png" alt-text="Screenshot that shows the status of multiple VMs." lightbox="media/create-data-collection-rule/change-tracking-status-expanded.png":::

1. Select **Enable** to initiate the deployment. This step initiates the setup because, during enablement, the customer assigns a data collection rule (DCR). The DCR defines the logging rules that are required to begin data collection.

A notification appears in the upper-right corner of the pane that indicates the status of the Change Tracking and Inventory deployment.

#### Enable Change Tracking and Inventory for multiple Azure Arc-enabled VMs by using the CLI

To enable Change Tracking and Inventory on Azure Arc-enabled servers, ensure that the custom Change Tracking DCR is associated to the Azure Arc-enabled VMs.

To associate the DCR to the Azure Arc-enabled VMs, follow these steps:

1. [Create a Change Tracking DCR](create-data-collection-rule.md). You can also use an existing DCR that collects data for Change Tracking and Inventory. These rules are part of Azure Monitor, which helps you manage and monitor your systems.
1. Sign in to the [Azure portal](https://portal.azure.com), and go to **Monitor**. Under **Settings**, select **Data Collection Rules**.
      
   :::image type="content" source="media/create-data-collection-rule/monitor-menu-data-collection-rules.png" alt-text="Screenshot that shows the menu option to access data collection rules from Azure Monitor." lightbox="media/create-data-collection-rule/monitor-menu-data-collection-rules.png":::

1. Select the DCR from the listing pane.
1. On the **Data Collection Rules** pane, under **Configuration**, select **Resources**, and then select **+ Add**.
    
   :::image type="content" source="media/create-data-collection-rule/select-resources.png" alt-text="Screenshot that shows the menu option to select resources from the data collection rule pane." lightbox="media/create-data-collection-rule/select-resources.png":::
    
   On the **Select a scope** pane, from **Resource types**, select **Machines-Azure Arc**, which is connected to the subscription. Then select **Apply** to associate the Change Tracking DCR to the Azure Arc-enabled machine.
    
   :::image type="content" source="media/create-data-collection-rule/scope-select-arc-machines.png" alt-text="Screenshot that shows the selection of Azure Arc-enabled machines from the scope." lightbox="media/create-data-collection-rule/scope-select-arc-machines.png":::

1. Install the Change Tracking extension based on the operating system type for the Azure Arc-enabled VM by running the following commands:

   - **Linux**:

       To enable Change Tracking on a Linux machine by using the Azure Connected Machine extension, use Azure CLI syntax for the following command:
    
       ```azurecli
       az connectedmachine extension create  --name ChangeTracking-Linux  --publisher Microsoft.Azure.ChangeTrackingAndInventory --type-handler-version 2.20  --type ChangeTracking-Linux  --machine-name XYZ --resource-group XYZ-RG  --location X --enable-auto-upgrade
       ```
    
   - **Windows**:

       To enable Change Tracking on a Windows machine by using the Azure Connected Machine extension, use Azure CLI syntax for the following command:
    
       ```azurecli
       az connectedmachine extension create  --name ChangeTracking-Windows  --publisher Microsoft.Azure.ChangeTrackingAndInventory --type-handler-version 2.20  --type ChangeTracking-Windows  --machine-name XYZ --resource-group XYZ-RG  --location X --enable-auto-upgrade
       ```   
 
:::zone-end

## Related content

* To create a DCR, see [Create data collection rules](create-data-collection-rule.md).
* To track changes on both Windows and Linux, see [Support matrix and regions](../azure-change-tracking-inventory/change-tracking-inventory-support-matrix.md).

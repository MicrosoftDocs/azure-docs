---
title: Quickstart - Enable Azure Change Tracking and Inventory for single and multiple machines from the portal
description: In this quickstart, learn how to enable Azure Change Tracking and Inventory for single and multiple machines from the portal.
services: automation
ms.date: 12/09/2025
ms.topic: quickstart
#Customer intent: As a customer, I want to enable Azure Change Tracking and Inventory so that I can further use the CTI services.
ms.service: azure-change-tracking-inventory
ms.author: v-jasmineme
author: jasminemehndir
zone_pivot_groups: enable-change-tracking-inventory-using-monitoring-agent
ms.custom: sfi-image-nochange
---

# Quickstart: Enable Azure Change Tracking and Inventory using Azure portal

**Applies to:** :heavy_check_mark: Windows VMs :heavy_check_mark: Linux VMs :heavy_check_mark: Windows Registry :heavy_check_mark: Windows Files :heavy_check_mark: Linux Files :heavy_check_mark: Windows Software :heavy_check_mark: File Content Changes


This article describes how you can enable [Azure Change Tracking and Inventory](overview-monitoring-agent.md) for single and multiple Azure Virtual Machines (VMs) from the Azure portal.

## Prerequisites

Before you enable Azure Change Tracking and Inventory (CTI), ensure you meet these prerequisites:

- An Azure subscription. If you don't have one yet, you can [activate your MSDN subscriber benefits](https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/) or sign up for a [free account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- A [virtual machine](/azure/virtual-machines/windows/quick-create-portal) configured in the specified region.

## Enable Azure CTI for single and multiple Arc-enabled VMs from Azure portal

This section provides detailed procedure on how you can enable change tracking on a single Azure VM and Arc-enabled VM.

::: zone pivot="single-portal"

### Enable Azure CTI for a single Azure VM using portal

This section provides detailed procedure on how you can enable change tracking on a single Azure VM and Arc-enabled VM.

#### Enable Azure CTI for a single Azure VM using portal

To enable Azure CTI for a single Azure VM using Azure portal, follow these steps: 

1. Sign in to the [Azure portal](https://portal.azure.com) and go to **Virtual machines**.

   :::image type="content" source="media/create-data-collection-rule/select-virtual-machine-portal-inline.png" alt-text="Screenshot showing how to select virtual machine from the portal." lightbox="media/create-data-collection-rule/select-virtual-machine-portal-expanded.png":::

   Select the virtual machine for which you want to enable Change Tracking.

1. In the search bar, enter **Change tracking**. Select **Change tracking** to view the **Change Tracking and Inventory** pane.

   :::image type="content" source="media/create-data-collection-rule/select-change-tracking-virtual-machine-inline.png" alt-text="Screenshot showing to select change tracking option for a single virtual machine from the portal." lightbox="media/create-data-collection-rule/select-change-tracking-virtual-machine-expanded.png":::

1. In the **Stay up-to-date with all changes** pane, select **Enable using AMA agent (Recommended)** option and **Enable**. 

   Deployment of Azure CTI gets initiated with a notification at the top right corner of the pane.
   
   :::image type="content" source="media/create-data-collection-rule/deployment-success-inline.png" alt-text="Screenshot showing the notification of deployment." lightbox="media/create-data-collection-rule/deployment-success-expanded.png":::
    
> [!NOTE]
> It usually takes up to two to three minutes to successfully onboard and enable the virtual machine(s). After you enable a virtual machine for change tracking, you can make changes to the files, registries, or software for the specific VM.

#### Enable Azure CTI for a single Azure Arc-enabled VM using portal

To enable Azure CTI for a single Azure Arc-enabled VM using portal, follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com). Search for **Machines-Azure Arc**.

   :::image type="content" source="media/create-data-collection-rule/select-arc-machines-portal.png" alt-text="Screenshot showing how to select Azure Arc machines from the portal." lightbox="media/create-data-collection-rule/select-arc-machines-portal.png":::

1. Select the Azure-Arc machine for which you want to enable Change Tracking.
1. Under **Operations**, select **Change tracking** to view the **Change Tracking and Inventory** pane.
1. In the **Stay up-to-date with all changes** pane, select **Enable using AMA agent (Recommended)** option and select **Enable**. 

   :::image type="content" source="media/create-data-collection-rule/select-change-tracking-arc-virtual-machine.png" alt-text="Screenshot showing to select change tracking option for a single Azure arc virtual machine from the portal." lightbox="media/create-data-collection-rule/select-change-tracking-arc-virtual-machine.png":::

   Deployment of Azure CTI gets initiated with a notification at the top right corner of the pane.

:::zone-end

::: zone pivot="multiple-portal-cli"

### Enable Azure CTI for multiple VMs using Azure portal and Azure CLI

This section provides detailed procedure on how you can enable Azure CTI on multiple Azure VMs and Azure Arc-enabled VMs.

#### Multiple Azure VMs using portal

To enable Azure CTI for multiple Azure VMs using portal, follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com) and go to **Virtual machines**.

   :::image type="content" source="media/create-data-collection-rule/select-virtual-machine-portal-inline.png" alt-text="Screenshot showing how to select virtual machine from the portal." lightbox="media/create-data-collection-rule/select-virtual-machine-portal-expanded.png":::

1. Select the virtual machines to which you intend to enable change tracking, and select **Services** > **Change Tracking**. 

   :::image type="content" source="media/create-data-collection-rule/select-change-tracking-multiple-virtual-machines-inline.png" alt-text="Screenshot showing how to select multiple virtual machines from the portal." lightbox="media/create-data-collection-rule/select-change-tracking-multiple-virtual-machines-expanded.png":::

   > [!NOTE]
   > You can enable CTI on up to 250 virtual machines at a time.

1. On the **Enable Change Tracking** pane, you can view the list of machines that are enabled, ready to be enabled and the ones that you can't enable. You can use the filters to select the **Subscription**, **Location**, and **Resource groups**. You can select a maximum of three resource groups.

   :::image type="content" source="media/create-data-collection-rule/change-tracking-status-inline.png" alt-text="Screenshot showing the status of multiple VMs." lightbox="media/create-data-collection-rule/change-tracking-status-expanded.png":::

1. Select **Enable** to initiate the deployment. This step initiates the setup because, during enablement, the customer assigns a DCR, which defines the logging rules required to begin data collection.

A notification appears on the top right corner of the pane indicating the status of Azure CTI deployment.

#### Multiple Arc-enabled VMs using CLI

To enable the Azure CTI on Arc-enabled servers, ensure that the custom Change Tracking Data collection rule is associated to the Arc-enabled VMs. 

To associate the data collection rule to the Arc-enabled VMs, follow these steps:

1. [Create Change Tracking Data collection rule](create-data-collection-rule.md). You can also use an existing DCR that collects data for Change Tracking and Inventory. These rules are part of Azure Monitor, which helps you manage and monitor your systems.
1. Sign in to the [Azure portal](https://portal.azure.com) and go to **Monitor** and under **Settings**, select **Data Collection Rules**.
      
   :::image type="content" source="media/create-data-collection-rule/monitor-menu-data-collection-rules.png" alt-text="Screenshot showing the menu option to access data collection rules from Azure Monitor." lightbox="media/create-data-collection-rule/monitor-menu-data-collection-rules.png":::

1. Select the data collection rule from the listing pane.
1. On the **Data Collection Rules** pane, under **Configurations**, select **Resources** and then select **+ Add**.
    
   :::image type="content" source="media/create-data-collection-rule/select-resources.png" alt-text="Screenshot showing the menu option to select resources from the data collection rule pane." lightbox="media/create-data-collection-rule/select-resources.png":::
    
   On the **Select a scope**, from **Resource types**, select *Machines-Azure Arc* that is connected to the subscription and then select **Apply** to associate the *ctdcr* to the Arc-enabled machine.
    
   :::image type="content" source="media/create-data-collection-rule/scope-select-arc-machines.png" alt-text="Screenshot showing the selection of Arc-enabled machines from the scope." lightbox="media/create-data-collection-rule/scope-select-arc-machines.png":::
    
1. Install the Change Tracking extension based on the OS type for the Arc-enabled VM by running the following commands:        
    
   **Linux**

   To enable Change Tracking on a Linux machine using Azure Connected Machine extension, use Azure CLI syntax for the below command:
       
   ```azurecli
   az connectedmachine extension create  --name ChangeTracking-Linux  --publisher Microsoft.Azure.ChangeTrackingAndInventory --type-handler-version 2.20  --type ChangeTracking-Linux  --machine-name XYZ --resource-group XYZ-RG  --location X --enable-auto-upgrade
   ```

   **Windows**

   To enable Change Tracking on a Windows machine using Azure Connected Machine extension, use Azure CLI syntax for the below command:

   ```azurecli
   az connectedmachine extension create  --name ChangeTracking-Windows  --publisher Microsoft.Azure.ChangeTrackingAndInventory --type-handler-version 2.20  --type ChangeTracking-Windows  --machine-name XYZ --resource-group XYZ-RG  --location X --enable-auto-upgrade
   ```   
 
:::zone-end

## Next steps

* To create data collection rule (DCR), see [Create data collection rule](create-data-collection-rule.md).
* To track changes on both Windows and Linux, see [support matrix and regions](../azure-change-tracking-inventory/change-tracking-inventory-support-matrix.md).
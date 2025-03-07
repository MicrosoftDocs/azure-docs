---
title: Enable Azure Automation Change Tracking for single machine and multiple machines from the portal.
description: This article tells how to enable the Change Tracking feature for single machine and multiple machines at scale from the Azure portal.
services: automation
ms.subservice: change-inventory-management
ms.date: 02/18/2025
ms.topic: how-to
ms.service: azure-automation
ms.author: sudhirsneha
author: SnehaSudhirG
zone_pivot_groups: enable-change-tracking-inventory-using-monitoring-agent
---

# Enable Change Tracking and Inventory using Azure Monitoring Agent

**Applies to:** :heavy_check_mark: Windows VMs :heavy_check_mark: Linux VMs :heavy_check_mark: Windows Registry :heavy_check_mark: Windows Files :heavy_check_mark: Linux Files :heavy_check_mark: Windows Software :heavy_check_mark: File Content Changes


This article describes how you can enable [Change Tracking and Inventory](overview.md) for single and multiple Azure Virtual Machines (VMs) from the Azure portal. 

## Prerequisites

- An Azure subscription. If you don't have one yet, you can [activate your MSDN subscriber benefits](https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/) or sign up for a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- A [virtual machine](/azure/virtual-machines/windows/quick-create-portal) configured in the specified region.

## Enable Change Tracking and Inventory

::: zone pivot="single-portal"

### Enable change tracking and inventory for single VM from Azure portal

This section provides detailed procedure on how you can enable change tracking on a single Azure VM and Arc-enabled VM.

#### [Single Azure VM -portal](#tab/singlevm)

1. Sign in to [Azure portal](https://portal.azure.com) and navigate to **Virtual machines**.

   :::image type="content" source="media/enable-vms-monitoring-agent/select-vm-portal-inline.png" alt-text="Screenshot showing how to select virtual machine from the portal." lightbox="media/enable-vms-monitoring-agent/select-vm-portal-expanded.png":::

1. Select the virtual machine for which you want to enable Change Tracking.
1. In the search, enter **Change tracking** to view the change tracking and inventory page.

   :::image type="content" source="media/enable-vms-monitoring-agent/select-change-tracking-vm-inline.png" alt-text="Screenshot showing to select change tracking option for a single virtual machine from the portal." lightbox="media/enable-vms-monitoring-agent/select-change-tracking-vm-expanded.png":::

1. In the **Stay up-to-date with all changes** layout, select **Enable using AMA agent (Recommended)** option and **Enable**. 

   It will initiate the deployment and the notification appears on the top right corner of the screen.
   
   :::image type="content" source="media/enable-vms-monitoring-agent/deployment-success-inline.png" alt-text="Screenshot showing the notification of deployment." lightbox="media/enable-vms-monitoring-agent/deployment-success-expanded.png":::
    
> [!NOTE]
> - When you enable Change Tracking in the Azure portal using the Azure Monitoring Agent, the process automatically creates a Data Collection Rule (DCR). This rule will appear in the resource group with a name in the format ct-dcr-aaaaaaaaa. After the rule is created, add the required resources.
> - It usually takes up to two to three minutes to successfully onboard and enable the virtual machine(s). After you enable a virtual machine for change tracking, you can make changes to the files, registries, or software for the specific VM.

#### [Single Azure Arc VM - portal](#tab/singlearcvm)

1. Sign in to [Azure portal](https://portal.azure.com). Search for and select **Machines-Azure Arc**.

   :::image type="content" source="media/enable-vms-monitoring-agent/select-arc-machines-portal.png" alt-text="Screenshot showing how to select Azure Arc machines from the portal." lightbox="media/enable-vms-monitoring-agent/select-arc-machines-portal.png":::

1. Select the Azure-Arc machine for which you want to enable Change Tracking.
1. Under **Operations**, select **Change tracking** to view the change tracking and inventory page.
1. In the **Stay up-to-date with all changes** layout, select **Enable using AMA agent (Recommended)** option and **Enable**. 

   :::image type="content" source="media/enable-vms-monitoring-agent/select-change-tracking-arc-vm.png" alt-text="Screenshot showing to select change tracking option for a single Azure arc virtual machine from the portal." lightbox="media/enable-vms-monitoring-agent/select-change-tracking-arc-vm.png":::

   It will initiate the deployment and the notification appears on the top right corner of the screen.

---

:::zone-end

::: zone pivot="multiple-portal-cli"

### Enable change tracking and inventory for multiple VMs using Azure portal and Azure CLI

This section provides detailed procedure on how you can enable change tracking and inventory on multiple Azure VMs and Azure Arc-enabled VMs.

#### [Multiple Azure VMs - portal](#tab/multiplevms)

1. Sign in to [Azure portal](https://portal.azure.com) and navigate to **Virtual machines**.

   :::image type="content" source="media/enable-vms-monitoring-agent/select-vm-portal-inline.png" alt-text="Screenshot showing how to select virtual machine from the portal." lightbox="media/enable-vms-monitoring-agent/select-vm-portal-expanded.png":::

1. Select the virtual machines to which you intend to enable change tracking and select **Services** > **Change Tracking**. 

   :::image type="content" source="media/enable-vms-monitoring-agent/select-change-tracking-multiple-vms-inline.png" alt-text="Screenshot showing how to select multiple virtual machines from the portal." lightbox="media/enable-vms-monitoring-agent/select-change-tracking-multiple-vms-expanded.png":::

   > [!NOTE]
   > You can select up to 250 virtual machines at a time to enable this feature.

1. In **Enable Change Tracking** page, select the banner at the top of the page, **Click here to try new change tracking and inventory with Azure Monitoring Agent (AMA) experience**.

   :::image type="content" source="media/enable-vms-monitoring-agent/enable-change-tracking-multiple-vms-inline.png" alt-text="Screenshot showing how to select enable change tracking for multiple vms from the portal." lightbox="media/enable-vms-monitoring-agent/enable-change-tracking-multiple-vms-expanded.png":::

1. In **Enable Change Tracking** page, you can view the list of machines that are enabled, ready to be enabled and the ones that you can't enable. You can use the filters to select the **Subscription**, **Location**, and **Resource groups**. You can select a maximum of three resource groups.

   :::image type="content" source="media/enable-vms-monitoring-agent/change-tracking-status-inline.png" alt-text="Screenshot showing the status of multiple vm." lightbox="media/enable-vms-monitoring-agent/change-tracking-status-expanded.png":::

1. Select **Enable** to initiate the deployment.
1. A notification appears on the top right corner of the screen indicating the status of deployment.

#### [Arc-enabled VMs - portal/CLI](#tab/arcvms)

To enable the Change Tracking and Inventory on Arc-enabled servers, ensure that the custom Change Tracking Data collection rule is associated to the Arc-enabled VMs. 

Follow these steps to associate the data collection rule to the Arc-enabled VMs:

1. [Create Change Tracking Data collection rule](#create-data-collection-rule).
1. Sign in to [Azure portal](https://portal.azure.com) and go to **Monitor** and under **Settings**, select **Data Collection Rules**.
      
   :::image type="content" source="media/enable-vms-monitoring-agent/monitor-menu-data-collection-rules.png" alt-text="Screenshot showing the menu option to access data collection rules from Azure Monitor." lightbox="media/enable-vms-monitoring-agent/monitor-menu-data-collection-rules.png":::

1. Select the data collection rule that you have created in Step 1 from the listing page.
1. In the data collection rule page, under **Configurations**, select **Resources** and then select **Add**.
    
   :::image type="content" source="media/enable-vms-monitoring-agent/select-resources.png" alt-text="Screenshot showing the menu option to select resources from the data collection rule page." lightbox="media/enable-vms-monitoring-agent/select-resources.png":::
    
1. In the **Select a scope**, from **Resource types**, select *Machines-Azure Arc* that is connected to the subscription and then select **Apply** to associate the *ctdcr* created in Step 1 to the Arc-enabled machine and it will also install the Azure Monitoring Agent extension.
    
   :::image type="content" source="media/enable-vms-monitoring-agent/scope-select-arc-machines.png" alt-text="Screenshot showing the selection of Arc-enabled machines from the scope." lightbox="media/enable-vms-monitoring-agent/scope-select-arc-machines.png":::
    
1. Install the Change Tracking extension as per the OS type for the Arc-enabled VM.
    
   **Linux**
       
   ```azurecli
   az connectedmachine extension create  --name ChangeTracking-Linux  --publisher Microsoft.Azure.ChangeTrackingAndInventory --type-handler-version 2.20  --type ChangeTracking-Linux  --machine-name XYZ --resource-group XYZ-RG  --location X --enable-auto-upgrade
   ```

   **Windows**

   ```azurecli
   az connectedmachine extension create  --name ChangeTracking-Windows  --publisher Microsoft.Azure.ChangeTrackingAndInventory --type-handler-version 2.20  --type ChangeTracking-Windows  --machine-name XYZ --resource-group XYZ-RG  --location X --enable-auto-upgrade
   ```   
--- 
:::zone-end

::: zone pivot="at-scale-policy"

### Enable Change Tracking at scale using policy

This section provides detailed procedure on how you can enable change tracking and inventory at scale using policy.

### Prerequisite
- You must [create the Data collection rule](#create-data-collection-rule).

### Enable Change tracking

Using the Deploy if not exist (DINE) policy, you can enable Change tracking with Azure Monitoring Agent at scale and in the most efficient manner.

1. In Azure portal, select **Policy**.
1. In the **Policy** page, under **Authoring**, select **Definitions**
1. In **Policy | Definitions** page, under the **Definition Type** category, select **Initiative** and in **Category**, select **Change Tracking and Inventory**. You'll see a list of three policies:

    #### [Arc-enabled virtual machines](#tab/arcvm)

     - Select *Enable Change Tracking and Inventory for Arc-enabled virtual machines*.
 
       :::image type="content" source="media/enable-vms-monitoring-agent/enable-for-arc-virtual-machine-manager-inline.png" alt-text="Screenshot showing the selection of Arc-enabled virtual machines." lightbox="media/enable-vms-monitoring-agent/enable-for-arc-virtual-machine-manager-expanded.png":::

    #### [Virtual machines Scale Sets](#tab/vmss)

     - Select *Enable Change Tracking and inventory for Virtual Machine Scale Sets*.
     
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
   1. Provide the **Data Collection Rule Resource id**. Learn more on [how to obtain the Data Collection Rule Resource ID after you create the Data collection rule](#create-data-collection-rule).
   1. Select **Review + create**.

:::zone-end

### Create data collection rule

1. Download [CtDcrCreation.json](change-tracking-data-collection-rule-creation.md) file on your machine.
1. Go to Azure portal and in the search, enter *Deploy a custom template*.
1. In the **Custom deployment** page > **select a template**, select **Build your own template in the editor**.
   :::image type="content" source="media/enable-vms-monitoring-agent/build-template.png" alt-text="Screenshot to get started with building a template.":::
1. In the **Edit template**, select **Load file** to upload the *CtDcrCreation.json* file.
1. Select **Save**.
1. In the **Custom deployment** > **Basics** tab, provide **Subscription** and **Resource group** where you want to deploy the Data Collection Rule. The **Data Collection Rule Name** is optional. The resource group must be same as the resource group associated with the Log Analytic workspace ID chosen here.

   :::image type="content" source="media/enable-vms-monitoring-agent/build-template-basics.png" alt-text="Screenshot to provide subscription and resource group details to deploy data collection rule.":::
   
   >[!NOTE]
   >- Ensure that the name of your Data Collection Rule is unique in that resource group, else the deployment will overwrite the existing Data Collection Rule.
   >- The Log Analytics Workspace Resource Id specifies the Azure resource ID of the Log Analytics workspace used to store change tracking data. Ensure that location of workspace is from the [Change tracking supported regions](../how-to/region-mappings.md)

1. Select **Review+create** > **Create** to initiate the deployment of *CtDcrCreation*.
1. After the deployment is complete, select **CtDcr-Deployment** to see the DCR Name. Use the **Resource ID** of the newly created Data Collection Rule for Change tracking and inventory deployment through policy.
 
   :::image type="content" source="media/enable-vms-monitoring-agent/deployment-confirmation.png" alt-text="Screenshot of deployment notification.":::

> [!NOTE]
> After creating the Data Collection Rule (DCR) using the Azure Monitoring Agent's change tracking schema, ensure that you don't add any Data Sources to this rule. This can cause Change Tracking and Inventory to fail. You must only add new Resources in this section.

## Next steps

- For details of working with the feature, see [Manage Change Tracking](../change-tracking/manage-change-tracking-monitoring-agent.md).
- To troubleshoot general problems with the feature, see [Troubleshoot Change Tracking and Inventory issues](../troubleshoot/change-tracking.md).

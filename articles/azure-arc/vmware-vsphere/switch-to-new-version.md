---
title: Switch to the new version
description: Learn to switch to the new version of VMware vSphere and use its capabilities
ms.topic: how-to 
ms.date: 11/15/2023
ms.service: azure-arc
ms.subservice: azure-arc-vmware-vsphere
author: Farha-Bano
ms.author: v-farhabano
manager: jsuri

# Customer intent: As a VI admin, I want to switch to the new version of Arc-enabled VMware vSphere and leverage the associated capabilities.
---

# Switch to the new version

On August 21, 2023, we rolled out major changes to **Azure Arc-enabled VMware vSphere**. By switching to the new version, you can use all the Azure management services that are available for Arc-enabled Servers.

> [!NOTE]
> If you're new to Arc-enabled VMware vSphere, you'll be able to leverage the new capabilities by default. To get started with the new version, see [Quickstart: Connect VMware vCenter Server to Azure Arc by using the helper script](quick-start-connect-vcenter-to-arc-using-script.md). 


## Switch to the new version (Existing customer)

If you've onboarded to **Azure Arc-enabled VMware** before August 21, 2023, for VMs that are Azure-enabled, follow these steps to switch to the new version: 

>[!Note]
>If you had enabled guest management on any of the VMs, remove [VM extensions](/azure/azure-arc/vmware-vsphere/remove-vcenter-from-arc-vmware#step-1-remove-vm-extensions) and [disconnect agents](/azure/azure-arc/vmware-vsphere/remove-vcenter-from-arc-vmware#step-2-disconnect-the-agent-from-azure-arc).

1. From your browser, go to the vCenters blade on [Azure Arc Center](https://ms.portal.azure.com/#view/Microsoft_Azure_HybridCompute/AzureArcCenterBlade/~/overview) and select the vCenter resource. 

2. Select all the virtual machines that are Azure enabled with the older version.  

3. Select **Remove from Azure**.  

    :::image type="VM Inventory view" source="media/switch-to-new-version/vm-inventory-view-inline.png" alt-text="Screenshot of VM Inventory view." lightbox="media/switch-to-new-version/vm-inventory-view-expanded.png":::

4. After successful removal from Azure, enable the same resources again in Azure.

5. Once the resources are re-enabled, the VMs are auto switched to the new version. The VM resources will now be represented as **Machine - Azure Arc (VMware)**.

    :::image type=" New VM browse view" source="media/switch-to-new-version/new-vm-browse-view-inline.png" alt-text="Screenshot of New VM browse view." lightbox="media/switch-to-new-version/new-vm-browse-view-expanded.png":::
 
## Next steps

[Create a virtual machine on VMware vCenter using Azure Arc](/azure/azure-arc/vmware-vsphere/quick-start-create-a-vm).
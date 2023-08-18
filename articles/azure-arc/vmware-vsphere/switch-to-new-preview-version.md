---
title: Switch to the new previous version
description: Learn to switch to the new preview version and use its capabilities
ms.topic: how-to 
ms.date: 08/17/2023
# Customer intent: As a VI admin, I want to switch to the new preview version of Arc-enabled VMware vSphere (preview) and leverage the associated capabilities
---

# Switch to the new preview version

On August 21, 2023, we rolled out major changes to Azure Arc-enabled VMware vSphere preview. By switching to the new preview version, you can use all the Azure management services that are available for Arc-enabled Servers.  

> [!NOTE]
> If you're a new to Arc-enabled VMware vSphere (preview), you will be able to leverage the new capabilities by default. To get started, see [Quickstart: Connect VMware vCenter Server to Azure Arc by using the helper script](quick-start-connect-vcenter-to-arc-using-script.md). 

## Existing preview customer  

If you are already using Azure Arc-enabled VMware, for VMs that are Azure-enabled, follow these steps to switch to the new preview version: 

>[!Note]
>If you had enabled guest management on any of the VMs, remove [VM extensions](/azure/azure-arc/vmware-vsphere/remove-vcenter-from-arc-vmware#step-1-remove-vm-extensions) and [disconnect agents](/azure/azure-arc/vmware-vsphere/remove-vcenter-from-arc-vmware#step-2-disconnect-the-agent-from-azure-arc).

1. From your browser, go to the vCenters blade on [Azure Arc Center](https://ms.portal.azure.com/#view/Microsoft_Azure_HybridCompute/AzureArcCenterBlade/~/overview) and select the vCenter resource. 

2. Select all the virtual machines that are Azure enabled with the older preview version.  

3. Select **Remove from Azure**.  

    ![VM Inventory view](./media/vm-inventory-view.png)

4. After the successful removal from Azure, enable the same resources again in Azure.

5. Once the resources are re-enabled, the VMs are auto switched to the new preview version. The VM resources will now be represented as **Machine - Azure Arc (VMware)**.

    ![New VM browser view](./media/new-vm-browse-view.png)

 
## Next steps

[Quickstart: Connect VMware vCenter Server to Azure Arc by using the helper script.](/azure/azure-arc/vmware-vsphere/quick-start-connect-vcenter-to-arc-using-script).
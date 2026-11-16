---
title: Install Arc agent and extensions on discovered VMs
description: Learn how to install Arc agent extensions on discovered VMs.
ms.topic: how-to 
ms.service: azure-vmware
ms.date: 11/16/2026
ms.custom: references_regions, devx-track-azurecli, engagement-fy23
---

# Onboard discovered VMs to Azure Arc and install extensions

In this article, you learn how to onboard and install extensions on discovered virtual machines (VMs) in Azure VMware Solution.

## Prerequisite

By using Arc-enabled VMware vSphere, you can [install the Arc connected machine agent on VMs at scale](/azure/azure-arc/vmware-vsphere/enable-guest-management-at-scale?tabs=azure-portal) and use Azure management services on the VMs which are enabled through specific extensions. There are more requirements for this capability. Before you can install an extension, ensure your target machine meets the following conditions:

- Is running a [supported operating system](/azure/azure-arc/servers/prerequisites#supported-operating-systems).
- Is able to connect through the firewall to communicate over the internet and these [URLs](/azure/azure-arc/servers/network-requirements?tabs=azure-cloud#urls) aren't blocked.
- Has VMware tools installed and running.
- Is powered on and the resource bridge has network connectivity to the vCenter managing the VM.
- Has the [Arc agent](/azure/azure-arc/servers/agent-overview) installed.

## Install Arc agent on the discovered VMs

You need to install the Arc agent on the VMware VM before you can install an extension. Use the following steps to install the Arc agent.

1. Navigate to [Azure portal](https://portal.azure.com/).
1. From the left navigation, locate **vCenter Server Inventory** and choose **Virtual Machines** to view the list of VMs.
1. Select the VM you want to install the Arc agent on.
1. Select **Arc agent with virtual hardware management** and provide the administrator username and password to install Arc agent then select **Onboard**. For Linux VMs, there's an option to use SSH key-based authentication. 
1. Locate the VMware vSphere VM you want to install extensions on, and select the name of the VM.
1. Select **Configuration** from the left navigation for a VMware VM.
1. Verify **Arc agent status** is now **Enabled**.

From the **Extensions** pane in the left navigation, you can install more extensions. See the [VM extensions Overview](/azure/azure-arc/servers/manage-vm-extensions) for a list of current extensions.

## Manually integrate an Arc-enabled Server machine into Arc-enabled Azure VMware Solution

When you enable Azure Arc on a VM in Azure VMware Solution private cloud by using a method different from the one described in this document, use the following steps to refresh the integration between the Arc-enabled Server machines and Azure VMware Solution.

These steps change the VM machine type from _Machine – Azure Arc_ to type _Machine – Azure Arc (AVS),_ which has the necessary integrations with Azure VMware Solution. By doing so, the VM will have the CRUD operational ability from Azure.

You can refresh the integration between the Arc-enabled Server machines and Azure VMware Solution by using either of the following methods:  

1. In the Azure VMware Solution private cloud, go to the vCenter Server inventory and the Virtual Machines section within the portal. Locate the virtual machine that needs updating by looking for the **Action needed** mark under **Virtual hardware management**. Follow the process to enable CRUD capabilities on the VM. 

2. Run the [**az connectedvmware vm create**](/cli/azure/connectedvmware/vm?view=azure-cli-latest%22%20\l%20%22az-connectedvmware-vm-create&preserve-view=true) Azure CLI command on the VM in Azure VMware Solution to update the machine type. 

```azurecli
az connectedvmware vm create --subscription <subscription-id> --location <Azure region of the machine> --resource-group <resource-group-name> --custom-location /providers/microsoft.extendedlocation/customlocations/<custom-location-name> --name <machine-name> --inventory-item /subscriptions/<subscription-id>/resourceGroups/<resource-group-name>/providers/Microsoft.ConnectedVMwarevSphere/VCenters/<vcenter-name>/InventoryItems/<machine-name>
```

## Next steps
- To manage Arc-enabled Azure VMware Solution, see [Manage Arc-enabled Azure VMware private cloud - Azure VMware Solution](/azure/azure-vmware/manage-arc-enabled-azure-vmware-solution).
- To remove Arc-enabled Azure VMware Solution resources from Azure, see [Remove Arc-enabled Azure VMware Solution vSphere resources from Azure - Azure VMware Solution.](/azure/azure-vmware/remove-arc-enabled-azure-vmware-solution-vsphere-resources-from-azure)

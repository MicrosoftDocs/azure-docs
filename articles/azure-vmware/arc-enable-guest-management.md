---
title: Enable guest management and extension installation for Arc-enabled VMs
description: Learn how to set up and enable guest management and extension installation for Arc-enabled VMs.
ms.topic: how-to 
ms.service: azure-vmware
ms.date: 05/15/2024
ms.custom: references_regions, devx-track-azurecli, engagement-fy23
---

# Enable guest management and extension installation for Arc-enabled VMware VMs
In this article, you learn how to enable guest management and install extensions on Arc-enabled VMware VMs in Azure VMware Solution. Use guest management empowers you to manage the guest operating system of your VM, including installing and managing extensions. This feature is available for Arc-enabled VMware VMs in Azure VMware Solution private clouds.

## Prerequisite

With Arc-enabled VMware vSphere, you can [install the Arc connected machine agent on VMs at scale](/azure/azure-arc/vmware-vsphere/enable-guest-management-at-scale?tabs=azure-portal) and use Azure management services on the VMs. There are more requirements for this capability. Before you can install an extension, ensure your target machine meets the following conditions:

- Is running a [supported operating system](/azure/azure-arc/servers/prerequisites#supported-operating-systems).
- Is able to connect through the firewall to communicate over the internet and these [URLs](/azure/azure-arc/servers/network-requirements?tabs=azure-cloud#urls) aren't blocked.
- Has VMware tools installed and running.
- Is powered on and the resource bridge has network connectivity to the host running the VM.
- Is Enabled in Azure.

## Enable guest management

You need to enable guest management on the VMware VM before you can install an extension. Use the following steps to enable guest management.

1. Navigate to [Azure portal](https://portal.azure.com/).
1. From the left navigation, locate **vCenter Server Inventory** and choose **Virtual Machines** to view the list of VMs.
1. Select the VM you want to install the guest management agent on.
1. Select **Enable guest management** and provide the administrator username and password to enable guest management then select **Apply**.
1. Locate the VMware vSphere VM you want to check for guest management and install extensions on, and select the name of the VM.
1. Select **Configuration** from the left navigation for a VMware VM.
1. Verify **Enable guest management** is now checked.

From here more extensions can be installed. See the [VM extensions Overview](/azure/azure-arc/servers/manage-vm-extensions) for a list of current extensions.   

## Manually integrate an Arc-enabled VM into Azure VMware Solutions

When a VM in Azure VMware Solution private cloud is Arc-enabled using a method distinct from the one outlined in this document, the following steps are provided to refresh the integration between the Arc-enabled VMs and Azure VMware Solution.

These steps change the VM machine type from _Machine – Azure Arc_ to type _Machine – Azure Arc (AVS),_ which has the necessary integrations with Azure VMware Solution. 

There are two ways to refresh the integration between the Arc-enabled VMs and Azure VMware Solution:  

1. In the Azure VMware Solution private cloud, navigate to the vCenter Server inventory and Virtual Machines section within the portal. Locate the virtual machine that requires updating and follow the process to 'Enable in Azure'. If the option is grayed out, you must first **Remove from Azure** and then proceed to **Enable in Azure**

2. Run the [az connectedvmware vm create](/cli/azure/connectedvmware/vm?view=azure-cli-latest%22%20\l%20%22az-connectedvmware-vm-create&preserve-view=true) Azure CLI command on the VM in Azure VMware Solution to update the machine type. 

```azurecli
az connectedvmware vm create --subscription <subscription-id> --location <Azure region of the machine> --resource-group <resource-group-name> --custom-location /providers/microsoft.extendedlocation/customlocations/<custom-location-name> --name <machine-name> --inventory-item /subscriptions/<subscription-id>/resourceGroups/<resource-group-name>/providers/Microsoft.ConnectedVMwarevSphere/VCenters/<vcenter-name>/InventoryItems/<machine-name>
```

## Next Steps
- To manage Arc-enabled Azure VMware Solution, see [Manage Arc-enabled Azure VMware private cloud - Azure VMware Solution](/azure/azure-vmware/manage-arc-enabled-azure-vmware-solution)
- To remove Arc-enabled  Azure VMware Solution resources from Azure, see [Remove Arc-enabled Azure VMware Solution vSphere resources from Azure - Azure VMware Solution.](/azure/azure-vmware/remove-arc-enabled-azure-vmware-solution-vsphere-resources-from-azure)

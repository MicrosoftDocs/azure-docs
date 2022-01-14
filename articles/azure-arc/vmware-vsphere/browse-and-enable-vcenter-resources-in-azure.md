---
title: Enable your VMware vCenter resources in Azure
description: Learn how to browse your vCenter inventory and represent a subset of your VMware vCenter resources in Azure to enable self-service.
ms.topic: how-to
ms.date: 09/28/2021

# Customer intent: As a VI admin, I want to represent a subset of my vCenter resources in Azure to enable self-service.
---

# Enable your VMware vCenter resources in Azure

After you've connected your VMware vCenter to Azure, you'll represent it in Azure. Representing your vCenter in Azure allows you to browse your vCenter inventory from the Azure portal.

:::image type="content" source="media/browse-vmware-inventory.png" alt-text="Screenshot of where to browse your VMware Inventory from the Azure portal." lightbox="media/browse-vmware-inventory.png":::

You can visit the VMware vCenter blade in Azure arc to view all the connected vCenters. From here, you'll browse your virtual machines (VMs), resource pools, templates, and networks. From the inventory of your vCenter resources, you can select and enable one or more resources in Azure.  When you enable a vCenter resource in Azure, it creates an Azure resource that represents your vCenter resource. You can use this Azure resource to assign permissions or conduct management operations.

> [!IMPORTANT]
> In the interest of ensuring new features are documented no later than their release, this page may include documentation for features that may not yet be publicly available.

## Create a representation of VMware resources in Azure

In this section, you'll enable resource pools, networks, and VM templates in Azure.

>[!NOTE]
>Enabling Azure Arc on a VMware vSphere resource is a read-only operation on vCenter. That is, it doesn't make changes to your resource in vCenter.

1. From your browser, go to the [vCenters blade on Azure Arc Center](https://portal.azure.com/?microsoft_azure_hybridcompute_assettypeoptions=%7B%22VMwarevCenter%22%3A%7B%22options%22%3A%22%22%7D%7D&feature.customportal=false&feature.canmodifystamps=true&feature.azurestackhci=true&feature.scvmmdisktoc=true&feature.scvmmnettoc=true&feature.scvmmsizetoc=true&feature.scvmmvmnetworkingtab=true&feature.scvmmvmdiskstab=true&feature.vmwarearcvm=true&feature.vmwarevmnetworktab=true&feature.vmwarevmdiskstab=true&feature.appliances=true&feature.customlocations=true&feature.arcvmguestmanagement=true&feature.vmwareExtensionToc=true&feature.arcvmextensions=true&feature.vcenters=true&feature.vcenterguestmanagement=true&feature.hideassettypes=Microsoft_Azure_Compute_VirtualMachine&feature.showassettypes=Microsoft_Azure_Compute_AllVirtualMachine#blade/Microsoft_Azure_HybridCompute/AzureArcCenterBlade/vCenter) and navigate to your inventory resources blade.

1. Select the resource or resources you want to enable and then select **Enable in Azure**.

1. Select your Azure Subscription and Resource Group and then select **Enable**.

   This starts a deployment and creates a resource in Azure, creating representations for your VMware vSphere resources. It allows you to manage who can access those resources through Azure role-based access control (RBAC) granularly.

1. Repeat these steps for one or more network, resource pool, and VM template resources.

## Enable existing virtual machines in Azure

1. From your browser, go to the [vCenters blade on Azure Arc Center](https://portal.azure.com/?microsoft_azure_hybridcompute_assettypeoptions=%7B%22VMwarevCenter%22%3A%7B%22options%22%3A%22%22%7D%7D&feature.customportal=false&feature.canmodifystamps=true&feature.azurestackhci=true&feature.scvmmdisktoc=true&feature.scvmmnettoc=true&feature.scvmmsizetoc=true&feature.scvmmvmnetworkingtab=true&feature.scvmmvmdiskstab=true&feature.vmwarearcvm=true&feature.vmwarevmnetworktab=true&feature.vmwarevmdiskstab=true&feature.appliances=true&feature.customlocations=true&feature.arcvmguestmanagement=true&feature.vmwareExtensionToc=true&feature.arcvmextensions=true&feature.vcenters=true&feature.vcenterguestmanagement=true&feature.hideassettypes=Microsoft_Azure_Compute_VirtualMachine&feature.showassettypes=Microsoft_Azure_Compute_AllVirtualMachine#blade/Microsoft_Azure_HybridCompute/AzureArcCenterBlade/vCenter) and navigate to your vCenter.

   :::image type="content" source="media/enable-guest-management.png" alt-text="Screenshot of how to enable an existing virtual machine in the Azure portal." lightbox="media/enable-guest-management.png":::

1. Navigate to the VM inventory resource blade, select the VMs you want to enable, and then select **Enable in Azure**.

1. Select your Azure Subscription and Resource Group.

1. (Optional) Select **Install guest agent** and then provide the Administrator username and password of the guest operating system.

   The [guest agent](../servers/agent-overview.md) is the connected machine agent. You can install this agent later by selecting the VM in the virtual machine inventory resource blade on your vCenter and selecting **Enable guest management**. For information on the prerequisites of enabling guest management, see [Manage VMware VMs through Arc enabled VMware vSphere](manage-vmware-vms-in-azure.md).

1. Select **Enable** to start the deployment of the VM represented in Azure.

For information on the capabilities enabled by a guest agent, see [Manage access to VMware resources through Azure RBAC](manage-access-to-arc-vmware-resources.md).

## Next steps

[Manage access to VMware resources through Azure RBAC](manage-access-to-arc-vmware-resources.md).
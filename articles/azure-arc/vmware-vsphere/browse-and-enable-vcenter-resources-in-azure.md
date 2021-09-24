---
title: Browse and enable your VMware vCenter resources in Azure
description: This article will help you understand how to browse your vCenter inventory and represent your VMware vCenter resources in Azure
author: ShubhamJain1992
ms.author: shuj
ms.service: arc
ms.topic: how-to
ms.date: 08/20/2021
ms.custom: template-how-to
#Customer intent: As a VI admin, I want to represent a subset of  my vCenter resources in Azure so that I can enable self-service
---

# Browse and enable your VMware vCenter resources in Azure

Once you have connected your VMware vCenter to Azure, your vCenter will get a representation in Azure and you can browse your vCenter inventory in Azure portal. 

![Browse your VMware Inventory ](../docs/media/browse-vmware-inventory.png)

You can visiting the VMware vCenter blade in Azure arc and view all the connected vCenters. In your vCenter you can browse all your virtual machines, resource pools, templates and networks. From the inventory of your vCenter resources, you can select one or more resources to enable them in Azure. Enabling a vCenter resource in Azure creates an Azure resource that represents your vCenter resource. Such Azure resources can then be used to assign permissions or perform management operations.

## Enable resource pools, networks and VM templates in Azure
In this section we will be creating a representation of few VMware resources in Azure.

1. Visit the [vCenters blade on Azure Arc Center](https://portal.azure.com/?microsoft_azure_hybridcompute_assettypeoptions=%7B%22VMwarevCenter%22%3A%7B%22options%22%3A%22%22%7D%7D&feature.customportal=false&feature.canmodifystamps=true&feature.azurestackhci=true&feature.scvmmdisktoc=true&feature.scvmmnettoc=true&feature.scvmmsizetoc=true&feature.scvmmvmnetworkingtab=true&feature.scvmmvmdiskstab=true&feature.vmwarearcvm=true&feature.vmwarevmnetworktab=true&feature.vmwarevmdiskstab=true&feature.appliances=true&feature.customlocations=true&feature.arcvmguestmanagement=true&feature.vmwareExtensionToc=true&feature.arcvmextensions=true&feature.vcenters=true&feature.vcenterguestmanagement=true&feature.hideassettypes=Microsoft_Azure_Compute_VirtualMachine&feature.showassettypes=Microsoft_Azure_Compute_AllVirtualMachine#blade/Microsoft_Azure_HybridCompute/AzureArcCenterBlade/vCenter).

2. Select and navigate to your vCenter

3. Navigate to appropriate inventory resources blade, select the resource(s) you want to enable.

4. Click on **Enable in Azure**

5. Select your Azure Subscription and Resource Group in the right pane and click on **Enable**

This will start a deployment and create a resource in Azure. Creating representations for your VMware vSphere resources in Azure allows you to granularly manage who can access those resources through Azure Arc.

6. Perform steps 3,4,5 for one or more network, resource pool and VM template resources.

> [!NOTE]
> Enabling Arc on a VMware vSphere resource is a read-only operation on vCenter i.e. it doesn't make any changes to your resource in vCenter.

## Enable existing virtual machines in Azure

![Enable Guest Management](../docs/media/enable-guest-management.png)

1. Visit the [vCenters blade on Azure Arc Center](https://portal.azure.com/?microsoft_azure_hybridcompute_assettypeoptions=%7B%22VMwarevCenter%22%3A%7B%22options%22%3A%22%22%7D%7D&feature.customportal=false&feature.canmodifystamps=true&feature.azurestackhci=true&feature.scvmmdisktoc=true&feature.scvmmnettoc=true&feature.scvmmsizetoc=true&feature.scvmmvmnetworkingtab=true&feature.scvmmvmdiskstab=true&feature.vmwarearcvm=true&feature.vmwarevmnetworktab=true&feature.vmwarevmdiskstab=true&feature.appliances=true&feature.customlocations=true&feature.arcvmguestmanagement=true&feature.vmwareExtensionToc=true&feature.arcvmextensions=true&feature.vcenters=true&feature.vcenterguestmanagement=true&feature.hideassettypes=Microsoft_Azure_Compute_VirtualMachine&feature.showassettypes=Microsoft_Azure_Compute_AllVirtualMachine#blade/Microsoft_Azure_HybridCompute/AzureArcCenterBlade/vCenter).

2. Select and navigate to your vCenter

3. Navigate to virtual machine inventory resource blade, select the virtual machine(s) you want to enable.

3. Click on **Enable in Azure**

4. Select your Azure Subscription and Resource Group in the right pane

5. [Optional] Tick on **Install guest agent** 

6. [Optional] Provide Administrator username and password of the guest OS 

Guest agent is the Connected Machine agent. You can read more about it [here](https://docs.microsoft.com/en-us/azure/azure-arc/servers/agent-overview). You can install this agent later as well by selecting the virtual machine in the virtual machine inventory resource blade on your vCenter and clicking **Enable guest managemement**. The pre-requisites of enabling guest management are listed [here](../docs/manage-vmware-vms-in-azure.md)
 
7. Click **Enable**

This will start a deployment and on completion, you will have the VM represented in Azure. We will talk about the capabilities enabled by Guest agent in [later](../docs/perform-vm-operations.md) section.

## Next Steps

- [Manage access to VMware resources through Azure Role Based Access Control](../docs/manage-access-to-arc-vmware-resources.md)
<properties
	pageTitle="Designing Virtual Machine Scale Sets For Scale | Microsoft Azure"
	description="Learn about how to design your Virtual Machine Scale Sets for scale"
	keywords="linux virtual machine,virtual machine scale sets" 
	services="virtual-machine-scale-sets"
	documentationCenter=""
	authors="gatneil"
	manager="madhana"
	editor="tysonn"
	tags="azure-resource-manager" />

<tags
	ms.service="virtual-machine-scale-sets"
	ms.workload="na"
	ms.tgt_pltfrm="vm-linux"
	ms.devlang="na"
	ms.topic="article"
	ms.date="07/28/2016"
	ms.author="gatneil"/>

# Designing VM Scale Sets For Scale

This topic will discuss design considerations for Virtual Machine Scale Sets. For information about what Virtual Machine Scale Sets are, please refer to [Virtual Machine Scale Sets Overview](virtual-machine-scale-sets-overview.md).


## Storage

A scale set uses storage accounts to store the OS disks of the VMs in the set. We recommend a ratio of 20 VMs per storage account or less. We also recommend that you spread across the alphabet the beginning characters of the storage account names. This helps spread load across different internal systems. For instance, in the following template, we use the uniqueString ARM Template function to generate prefix hashes that are prepended to storage account names: [https://github.com/Azure/azure-quickstart-templates/tree/master/201-vmss-linux-nat](https://github.com/Azure/azure-quickstart-templates/tree/master/201-vmss-linux-nat).


## Overprovisioning

Starting with the 2016-03-30 API version, VM Scale Sets defaults to "overprovisioning" VMs. This means that the scale set will actually spin up more VMs than you asked for, then delete the extra VMs which spun up last. This improves provisioning success rates because if even one VM does not provision successfully, the entire deployment is considered "Failed" by Azure Resource Manager. You will not be billed for these extra VMs, and they will not count toward your quota limits.

While this does improve provisioning success rates, it can cause confusing behavior for an application that is not designed to handle VMs disappearing unannounced. In order to turn overprovisioning off, please ensure you have the following string in your template: "overprovision": "false". More details can be found in the [VM Scale Set REST API documentation](https://msdn.microsoft.com/en-us/library/azure/mt589035.aspx).

If you turn off overprovisioning, you can get away with a larger ratio of VMs per storage account, but we do not recommend going above 40.


## Limits
A scale set built on a custom image (one built by you) must create all OS disk VHDs within one storage account. As a result, the maximum recommended number of VMs in a scale set built on a custom image is 20. If you turn off overprovisioning, you can go up to 40.

A scale set built on a platform image is currently limited to 100 VMs (we recommend 5 storage accounts for this scale).

For more VMs than these limits allow, you will need to deploy multiple scale sets. [For an example of how to do this, please see this template.](https://github.com/Azure/azure-quickstart-templates/tree/master/301-custom-images-at-scale)

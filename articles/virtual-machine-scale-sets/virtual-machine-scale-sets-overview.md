---
title: Virtual Machine Scale Sets Overview | Microsoft Docs
description: Learn more about Virtual Machine Scale Sets
services: virtual-machine-scale-sets
documentationcenter: ''
author: gbowerman
manager: timlt
editor: ''
tags: azure-resource-manager

ms.assetid: 76ac7fd7-2e05-4762-88ca-3b499e87906e
ms.service: virtual-machine-scale-sets
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: get-started-article
ms.date: 03/08/2017
ms.author: guybo
ms.custom: H1Hack27Feb2017

---
# What are Virtual Machine Scale Sets in Azure?
Virtual machine scale sets are an Azure Compute resource you can use to deploy and manage a set of identical VMs. With all VMs configured the same, VM scale sets are designed to support true autoscale – no pre-provisioning of VMs is required – making it easier to build large-scale services targeting big compute, big data, and containerized workloads.

For applications that need to scale compute resources out and in, scale operations are implicitly balanced across fault and update domains. For an introduction to VM scale sets refer to the [Azure blog announcement](https://azure.microsoft.com/blog/azure-virtual-machine-scale-sets-ga/).

Take a look at these videos for more about VM scale sets:

* [Mark Russinovich talks Azure Scale Sets](https://channel9.msdn.com/Blogs/Regular-IT-Guy/Mark-Russinovich-Talks-Azure-Scale-Sets/)  
* [Virtual Machine Scale Sets with Guy Bowerman](https://channel9.msdn.com/Shows/Cloud+Cover/Episode-191-Virtual-Machine-Scale-Sets-with-Guy-Bowerman)

## Creating and managing VM scale sets
You can create a VM Scale Set in the [Azure portal](https://portal.azure.com) by selecting *new* and typing in "scale" in the search bar. You will see "Virtual machine scale set" in the results. From there you can fill in the required fields to customize and deploy your scale set. Note there are also options in the portal to set up basic autoscale rules based on CPU usage.

VM scale sets can also be defined and deployed using JSON templates and [REST APIs](https://msdn.microsoft.com/library/mt589023.aspx) just like individual Azure Resource Manager VMs. Therefore, any standard Azure Resource Manager deployment methods can be used. For more information about templates, see [Authoring Azure Resource Manager templates](../azure-resource-manager/resource-group-authoring-templates.md).

A set of example templates for VM scale sets can be found in the Azure Quickstart templates GitHub repository [here.](https://github.com/Azure/azure-quickstart-templates) (look for templates with *vmss* in the title)

In the detail pages for these templates you will see a button that links to the portal deployment feature. To deploy the VM scale set, click on the button and then fill in any parameters that are required in the portal. If you are not sure whether a resource supports upper or mixed case it is safer to always use lower case letters and numbers in parameter values. There is also a handy video dissection of a VM scale set template here:

[VM Scale Set Template Dissection](https://channel9.msdn.com/Blogs/Azure/VM-Scale-Set-Template-Dissection/player)

## Scaling a VM scale set out and in
To increase or decrease the number of virtual machines in a VM scale set, simply change the *capacity* property and redeploy the template. This simplicity makes it easy to write your own custom scaling layer if you want to define custom scale events that are not supported by Azure autoscale. You can also change the capacity of a scale set in the Azure portal by clicking on the _Scaling_ section under _Settings_, or use the [Azure CLI](../cli/azure/overview) command _az vmss scale_. 

If you are redeploying an Azure Resource Manager template to change the capacity, you could define a much smaller template which only includes the 'SKU' property packet with the updated capacity. An example of this is shown [here.](https://github.com/Azure/azure-quickstart-templates/tree/master/201-vmss-scale-existing)

## Monitoring your VM scale set
The [Azure portal](https://portal.azure.com) lists scale sets, shows their properties and supports management operations which can be performed both on scale sets, and on individual VMs within a scale set. The portal also provides a customizable resource usage graph. If you need to see or edit the underlying JSON definition of an Azure resoruce you can also use the [Azure Resource Explorer](https://resources.azure.com). VM scale sets are a resource under Microsoft.Compute, so from this site you can see them by expanding the following links:

**Subscriptions -> your subscription -> resourceGroups -> providers -> Microsoft.Compute -> virtualMachineScaleSets -> your VM scale set -> etc.**

## VM scale set scenarios
This section lists some typical VM scale set scenarios. Some higher level Azure services (like Batch, Service Fabric, Azure Container Service) will use these scenarios.

* **RDP / SSH to VM scale set instances** - A VM scale set is created inside a VNET and individual VMs in the scale set are not allocated public IP addresses. This avoids the expense and management overhead of allocating separate public IP addresses to all the nodes in your compute grid, and you can easily connect to these VMs from other resources in your VNET, including ones which have public IP addresses like load balancers or standalone virtual machines.
* **Connect to VMs using NAT rules** - You can create a public IP address, assign it to a load balancer, and define an inbound NAT pool which will map ports on the IP address to a port on a VM in the VM scale set. For example:
  
  | Source | Source Port | Destination | Destination Port |
  | --- | --- | --- | --- |
  |  Public IP |Port 50000 |vmss\_0 |Port 22 |
  |  Public IP |Port 50001 |vmss\_1 |Port 22 |
  |  Public IP |Port 50002 |vmss\_2 |Port 22 |
  
   Here's an example of creating a VM scale set which uses NAT rules to enable SSH connection to every VM in a scale set using a single public IP: [https://github.com/Azure/azure-quickstart-templates/tree/master/201-vmss-linux-nat](https://github.com/Azure/azure-quickstart-templates/tree/master/201-vmss-linux-nat)
  
   Here's an example of doing the same with RDP and Windows: [https://github.com/Azure/azure-quickstart-templates/tree/master/201-vmss-windows-nat](https://github.com/Azure/azure-quickstart-templates/tree/master/201-vmss-windows-nat)
* **Connect to VMs using a "jumpbox"** - If you create a VM scale set and a standalone VM in the same VNET, the standalone VM and the VM scale set VMs can connect to one another using their internal IP addresses as defined by the VNET/Subnet. If you create a public IP address and assign it to the standalone VM you can RDP or SSH to the standalone VM and then connect from that machine to your VM scale set instances. You may notice at this point that a simple VM scale set is inherently more secure than a simple standalone VM with a public IP address in its default configuration.
  
   For example, this template deploys a simple scale set with a standalone VM: [https://github.com/Azure/azure-quickstart-templates/tree/master/201-vmss-linux-jumpbox](https://github.com/Azure/azure-quickstart-templates/tree/master/201-vmss-linux-jumpbox)
* **Load balancing to VM scale set instances** - If you want to deliver work to a compute cluster of VMs using a "round-robin" approach, you can configure an Azure load balancer with layer-4 load-balancing rules accordingly. You can define probes to verify your application is running by pinging ports with a specified protocol, interval and request path. The Azure [Application Gateway](https://azure.microsoft.com/services/application-gateway/) also supports scale sets, along with layer-7 and more sophisticated load balancing scenarios.
  
   Here is an example which creates a VM scale set running Apache web servers, and uses a load balancer to balance the load that each VM receives: [https://github.com/Azure/azure-quickstart-templates/tree/master/201-vmss-ubuntu-web-ssl](https://github.com/Azure/azure-quickstart-templates/tree/master/201-vmss-ubuntu-web-ssl) (look at the Microsoft.Network/loadBalancers resource type and the networkProfile and extensionProfile in the virtualMachineScaleSet)

   Here is an example VM scale set deployment which uses an Application Gateway. Linux:
   [https://github.com/Azure/azure-quickstart-templates/tree/master/201-vmss-ubuntu-app-gateway](https://github.com/Azure/azure-quickstart-templates/tree/master/201-vmss-ubuntu-app-gateway). Windows: [https://github.com/Azure/azure-quickstart-templates/tree/master/201-vmss-windows-app-gateway](https://github.com/Azure/azure-quickstart-templates/tree/master/201-vmss-windows-app-gateway) 

* **Deploying a VM scale set as a compute cluster in a PaaS cluster manager** - VM scale sets are sometimes described as a next-generation worker role. That is a valid description, but does run the risk of confusing scale set features with PaaS v1 Worker role features. In a sense VM scale sets provide a true "worker role" or worker resource in that they are a generalized compute resource which is platform/runtime independent, customizable and integrates into Azure Resource Manager IaaS.
  
   A PaaS v1 worker role, while limited in terms of platform/runtime support (Windows platform images only) also includes services such as VIP swap, configurable upgrade settings, runtime/app deployment specific settings which are either not *yet* available in VM scale sets, or will be delivered by other higher level PaaS services like Service Fabric. With this in mind you can look at VM scale sets as an infrastructure which supports PaaS. I.e. PaaS solutions like [Azure Service Fabric](https://azure.microsoft.com/services/service-fabric/) can build on top of VM scale sets as a scalable compute layer.
  
   For an example of this approach, the [Azure Container Service](https://azure.microsoft.com/services/container-service/) deploys a cluster based on scale sets with a container orchestrator: [https://github.com/Azure/azure-quickstart-templates/tree/master/101-acs-dcos](https://github.com/Azure/azure-quickstart-templates/tree/master/101-acs-dcos).

## VM scale set performance and scale guidance
* VM scale sets support up to 1,000 VMs in a scale set. If you create and upload your own custom VM images, the limit is 100. See [Working with large virtual machine scale sets](virtual-machine-scale-sets-placement-groups.md) for considerations when using very large scale sets.
* You do not have to pre-create Azure storage accounts in order to use scale sets. Scale sets support Azure Managed Disks, which removes performance concerns about the number of disks per storage account. See [Azure VM scale sets and managed disks](virtual-machine-scale-sets-managed-disks.md) for more details.
* The number of VMs you can create is limited by the core quota in the region in which you are deploying. You may need to contact Customer Support to increase your Compute quota limit increased even if you have a high limit of cores for use with cloud services or IaaS v1 today. To query your quota you can run the following Azure CLI command: `azure vm list-usage`, and the following PowerShell command: `Get-AzureRmVMUsage` (if using a version of PowerShell below 1.0 use `Get-AzureVMUsage`).

## VM scale set frequently asked questions
**Q.** How many VMs can you have in a VM scale set?

**A.** A scale set can have between 0 and 1,000 VMs based on platform images, or 0-100 VMs based on custom images. 

**Q.** Are Data Disks Supported within VM scale sets?

**A.** Yes. A scale set can define an attached data drives configuration that will apply to all VMs in the set. See (Azure VM scale sets and attached data disks)[virtual-machine-scale-sets-attached-disks.md] for more information. Other options for storing data include:

* Azure files (SMB shared drives)
* OS drive
* Temp drive (local, not backed by Azure storage)
* Azure data service (e.g. Azure tables, Azure blobs)
* External data service (e.g. remote DB)

**Q.** Which Azure regions support VM scale sets?

**A.** All regions support VM scale sets.

**Q.** How do you create a VM scale set using a custom image?

**A.** Create a Managed Disk based on your custom image VHD and reference it in your scale set template. Here is an example: [https://github.com/chagarw/MDPP/tree/master/101-vmss-custom-os](https://github.com/chagarw/MDPP/tree/master/101-vmss-custom-os).

**Q.** If I reduce my VM scale set capacity from 20 to 15, which VMs will be removed?

**A.** Virtual machines are removed from the scale set evenly across upgrade domains and fault domains to maximize availability. VMs with the highest id's are removed first.

**Q.** How about it if I then increase the capacity from 15 to 18?

**A.** If you increase capacity to 18, then 3 new VMs will be created. Each time the VM instance id will be incremented from the previous highest value (e.g. 20, 21, 22). VMs are balanced across FDs and UDs.

**Q.** When using multiple extensions in a VM scale set, can I enforce an execution sequence?

**A.** Not directly, but for the customScript extension, your script could wait for another extension to complete ([for example by monitoring the extension log](https://github.com/Azure/azure-quickstart-templates/blob/master/201-vmss-lapstack-autoscale/install_lap.sh)). Additional guidance on extension sequencing can be found in this blog post: [Extension Sequencing in Azure VM Scale Sets](https://msftstack.wordpress.com/2016/05/12/extension-sequencing-in-azure-vm-scale-sets/).

**Q.** Do VM scale sets work with Azure availability sets?

**A.** Yes. A VM scale set is an implicit availability set with 5 FDs and 5 UDs. You don't need to configure anything under virtualMachineProfile. VM scale sets of more than 100 VMs span multiple 'placement groups' which are equivalent to multiple availability sets. An availability set of VMs can exist in the same VNET as a scale set of VMs. A common configuration is to put control node VMs which often require unique configuration in the availability set, and data nodes in the scale set.

<properties
	pageTitle="Virtual Machine Scale Sets Overview | Microsoft Azure"
	description="Learn more about Virtual Machine Scale Sets"
	services="virtual-machine-scale-sets"
	documentationCenter=""
	authors="gbowerman"
	manager="timlt"
	editor=""
	tags="azure-resource-manager"/>

<tags
	ms.service="virtual-machine-scale-sets"
	ms.workload="na"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="07/12/2016"
	ms.author="guybo"/>

# Virtual Machine Scale Sets Overview

Virtual machine scale sets are an Azure Compute resource you can use to deploy and manage a set of identical VMs. With all VMs configured the same, VM scale sets are designed to support true autoscale – no pre-provisioning of VMs is required – and as such makes it easier to build large-scale services targeting big compute, big data, and containerized workloads.

For applications that need to scale compute resources out and in, scale operations are implicitly balanced across fault and update domains. For an introduction to VM scale sets refer to the recent [Azure blog announcement](https://azure.microsoft.com/blog/azure-virtual-machine-scale-sets-ga/).

Take a look at these videos for more about VM scale sets:

 - [Mark Russinovich talks Azure Scale Sets](https://channel9.msdn.com/Blogs/Regular-IT-Guy/Mark-Russinovich-Talks-Azure-Scale-Sets/)  

 - [Virtual Machine Scale Sets with Guy Bowerman](https://channel9.msdn.com/Shows/Cloud+Cover/Episode-191-Virtual-Machine-Scale-Sets-with-Guy-Bowerman)

## Creating and managing VM scale sets

VM scale sets can be defined and deployed using JSON templates and [REST APIs](https://msdn.microsoft.com/library/mt589023.aspx) just like individual Azure Resource Manager VMs. Therefore, any standard Azure Resource Manager deployment methods can be used. For more information about templates, see [Authoring Azure Resource Manager templates](../resource-group-authoring-templates.md).

A set of example templates for VM scale sets can be found in the Azure Quickstart templates GitHub repository [here.](https://github.com/Azure/azure-quickstart-templates) (look for templates with _vmss_ in the title)

In the detail pages for these templates you'll see a button that links to the portal deployment feature. To deploy the VM scale set, click on the button and then fill in any parameters that are required in the portal. If you're not sure whether a resource supports upper or mixed case it is safer to always use lower case parameter values. There is also a handy video dissection of a VM scale set template here:

[VM Scale Set Template Dissection](https://channel9.msdn.com/Blogs/Windows-Azure/VM-Scale-Set-Template-Dissection/player)

## Scaling a VM scale set out and in

To increase or decrease the number of virtual machines in a VM scale set, simply change the _capacity_ property and redeploy the template. This simplicity makes it easy to write your own custom scaling layer if you want to define custom scale events that are not supported by Azure autoscale.

If you are redeploying a template to change the capacity, you could define a much smaller template which only includes the SKU and the updated capacity. An example of this is shown [here.](https://github.com/Azure/azure-quickstart-templates/tree/master/201-vmss-scale-existing)

To walk through the steps that create a scale set that is automatically scaled, see [Automatically Scale Machines in a Virtual Machine Scale Set](virtual-machine-scale-sets-windows-autoscale.md)

## Monitoring your VM scale set

The [Azure portal](https://portal.azure.com) lists scale sets and shows basic properties, as well as listing VMs in the set. For more detail you can use the [Azure Resource Explorer](https://resources.azure.com) to view VM scale sets. VM scale sets are a resource under Microsoft.Compute, so from this site you can see them by expanding the following links:

	subscriptions -> your subscription -> resourceGroups -> providers -> Microsoft.Compute -> virtualMachineScaleSets -> your VM scale set -> etc.

## VM scale set scenarios

This section lists some typical VM scale set scenarios. Some higher level Azure services (like Batch, Service Fabric, Azure Container Service) will use these scenarios.

 - **RDP / SSH to VM scale set instances** - A VM scale set is created inside a VNET and individual VMs in the scale set are not allocated public IP addresses. This is a good thing because you don't generally want the expense and management overhead of allocating separate public IP addresses to all the stateless resources in your compute grid, and you can easily connect to these VMs from other resources in your VNET including ones which have public IP addresses like load balancers or standalone virtual machines.

 - **Connect to VMs using NAT rules** - You can create a public IP address, assign it to a load balancer, and define inbound NAT rules which map a port on the IP address to a port on a VM in the VM scale set. For example:
 
	Source | Source Port | Destination | Destination Port
	--- | --- | --- | ---
	Public IP | Port 50000 | vmss\_0 | Port 22
	Public IP | Port 50001 | vmss\_1 | Port 22
	Public IP | Port 50002 | vmss\_2 | Port 22

	Here's an example of creating a VM scale set which uses NAT rules to enable SSH connection to every VM in a scale set using a single public IP: [https://github.com/Azure/azure-quickstart-templates/tree/master/201-vmss-linux-nat](https://github.com/Azure/azure-quickstart-templates/tree/master/201-vmss-linux-nat)

	Here's an example of doing the same with RDP and Windows: [https://github.com/Azure/azure-quickstart-templates/tree/master/201-vmss-windows-nat](https://github.com/Azure/azure-quickstart-templates/tree/master/201-vmss-windows-nat)

 - **Connect to VMs using a "jumpbox"** - If you create a VM scale set and a standalone VM in the same VNET, the standalone VM and the VM scale set VMs can connect to one another using their internal IP addresses as defined by the VNET/Subnet. If you create a public IP address and assign it to the standalone VM you can RDP or SSH to the standalone VM and then connect from that machine to your VM scale set instances. You may notice at this point that a simple VM scale set is inherently more secure than a simple standalone VM with a public IP address in its default configuration.

	[For an example of this approach, this template creates a simple Mesos cluster consisting of a standalone Master VM which manages a VM scale-set based cluster of VMs.](https://github.com/gbowerman/azure-myriad/blob/master/mesos-vmss-simple-cluster.json)

 - **Load balancing to VM scale set instances** - If you want to deliver work to a compute cluster of VMs using a "round-robin" approach, you can configure an Azure load balancer with load-balancing rules accordingly. You can define probes to verify your application is running by pinging ports with a specified protocol, interval and request path. The Azure [Application Gateway](https://azure.microsoft.com/services/application-gateway/) also supports scale sets, along with more sophisticated load balancing scenarios.

	[Here is an example which creates a VM scale set of VMs running IIS web server, and uses a load balancer to balance the load that each VM receives. It also uses the HTTP protocol to ping a specific URL on each VM.](https://github.com/gbowerman/azure-myriad/blob/master/vmss-win-iis-vnet-storage-lb.json) (look at the Microsoft.Network/loadBalancers resource type and the networkProfile and extensionProfile in the virtualMachineScaleSet)

 - **Deploying a VM scale set as a compute cluster in a PaaS cluster manager** - VM scale sets are sometimes described as a next-generation worker role. It's a valid description but it also runs the risk of confusing scale set features with PaaS v1 Worker role features. In a sense VM scale sets provide a true "worker role" or worker resource, in that they provide a generalized compute resource which is platform/runtime independent, customizable and integrates into Azure Resource Manager IaaS.

	A PaaS v1 worker role, while limited in terms of platform/runtime support (Windows platform images only) also includes services such as VIP swap, configurable upgrade settings, runtime/app deployment specific settings which are either not _yet_ available in VM scale sets, or will be delivered by other higher level PaaS services like Service Fabric. With this in mind you can look at VM scale sets as an infrastructure which supports PaaS. I.e. PaaS solutions like Service Fabric or cluster managers like Mesos can build on top of VM scale sets as a scalable compute layer.

	[For an example of this approach, this template creates a simple Mesos cluster consisting of a standalone Master VM which manages a VM scale-set based cluster of VMs.](https://github.com/gbowerman/azure-myriad/blob/master/mesos-vmss-simple-cluster.json) Future versions of the [Azure Container Service](https://azure.microsoft.com/blog/azure-container-service-now-and-the-future/) will deploy more complex/hardened versions of this scenario based on VM scale sets.

## VM scale set performance and scale guidance

- Do not create more than 500 VMs in multiple VM Scale Sets at a time.
- Plan for no more than 20 VMs per storage account (unless you set the _overprovision_ property to "false", in which case you can go up to 40).
- Spread out the first letters of storage account names as much as possible.  The example VMSS templates in [Azure Quickstart templates](https://github.com/Azure/azure-quickstart-templates/) provide examples of how to do this.
- If using custom VMs, plan for no more than 40 VMs per VM scale set, in a single storage account.  You will need the image pre-copied into the storage account before you can begin VM scale set deployment. See the FAQ for more information.
- Plan for no more than 4096 VMs per VNET.
- The number of VMs you can create is limited by the core quota in the region in which you are deploying. You may need to contact Customer Support to increase your Compute quota limit increased even if you have a high limit of cores for use with cloud services or IaaS v1 today. To query your quota you can run the following Azure CLI command: `azure vm list-usage`, and the following PowerShell command: `Get-AzureRmVMUsage` (if using a version of PowerShell below 1.0 use `Get-AzureVMUsage`).

## VM scale set frequently asked questions

**Q.** How many VMs can you have in a VM scale set?

**A.** 100 if you use platform images which can be distributed across multiple storage accounts. If you use custom images, up to 40 (if the _overprovision_ property is set to "false", 20 by default), since custom images are currently limited to a single storage account.

**Q** What other resource limits exist for VM scale sets?

**A.** You are limited to creating no more than 500 VMs in multiple scale sets per region during a 10 minute period. The existing [Azure Subscription Service Limits/](../azure-subscription-service-limits.md) apply.

**Q.** Are Data Disks Supported within VM scale sets?

**A.** Not in the initial release. Your options for storing data are:

- Azure files (SMB shared drives)

- OS drive

- Temp drive (local, not backed by Azure storage)

- Azure data service (e.g. Azure tables, Azure blobs)

- External data service (e.g. remote DB)

**Q.** Which Azure regions support VM scale sets?

**A.** Any region which supports Azure Resource Manager supports VM Scale Sets.

**Q.** How do you create a VM scale set using a custom image?

**A.** Leave the vhdContainers property blank, for example:

	"storageProfile": {
		"osDisk": {
			"name": "vmssosdisk",
			"caching": "ReadOnly",
			"createOption": "FromImage",
			"image": {
				"uri": "https://mycustomimage.blob.core.windows.net/system/Microsoft.Compute/Images/mytemplates/template-osDisk.vhd"
			},
			"osType": "Windows"
		}
	},


**Q.** If I reduce my VM scale set capacity from 20 to 15, which VMs will be removed?

**A.** Virtual machines are removed from the scale set evenly across upgrade domains and fault domains to maximize availability. VMs with the highest id's are removed first.

**Q.** How about it if I then increase the capacity from 15 to 18?

**A.** If you increase capacity to 18, then 3 new VMs will be created. Each time the VM instance id will be incremented from the previous highest value (e.g. 20, 21, 22). VMs are balanced across FDs and UDs.

**Q.** When using multiple extensions in a VM scale set, can I enforce an execution sequence?

**A.** Not directly, but for the customScript extension, your script could wait for another extension to complete ([for example by monitoring the extension log](https://github.com/Azure/azure-quickstart-templates/blob/master/201-vmss-lapstack-autoscale/install_lap.sh)). Additional guidance on extension sequencing can be found in this blog post: [Extension Sequencing in Azure VM Scale Sets](https://msftstack.wordpress.com/2016/05/12/extension-sequencing-in-azure-vm-scale-sets/).

**Q.** Do VM scale sets work with Azure availability sets?

**A.** Yes. A VM scale set is an implicit availability set with 5 FDs and 5 UDs. You don't need to configure anything under virtualMachineProfile. In future releases, VM scale sets are likely to span multiple tenants but for now a scale set is a single availability set.

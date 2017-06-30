---
title: Azure virtual machine scale sets overview | Microsoft Docs
description: Learn more about Azure virtual machine scale sets
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
ms.date: 05/30/2017
ms.author: guybo
ms.custom: H1Hack27Feb2017

---
# What are virtual machine scale sets in Azure?
Virtual machine scale sets are an Azure compute resource that you can use to deploy and manage a set of identical VMs. With all VMs configured the same, scale sets are designed to support true autoscale, and no pre-provisioning of VMs is required. So it's easier to build large-scale services that target big compute, big data, and containerized workloads.

For applications that need to scale compute resources out and in, scale operations are implicitly balanced across fault and update domains. For a further introduction to scale sets, refer to the [Azure blog announcement](https://azure.microsoft.com/blog/azure-virtual-machine-scale-sets-ga/).

For more information about scale sets, watch these videos:

* [Mark Russinovich talks Azure scale sets](https://channel9.msdn.com/Blogs/Regular-IT-Guy/Mark-Russinovich-Talks-Azure-Scale-Sets/)  
* [Virtual Machine Scale Sets with Guy Bowerman](https://channel9.msdn.com/Shows/Cloud+Cover/Episode-191-Virtual-Machine-Scale-Sets-with-Guy-Bowerman)

## Creating and managing scale sets
You can create a scale set in the [Azure portal](https://portal.azure.com) by selecting **new** and typing **scale** on the search bar. **Virtual machine scale set** is listed in the results. From there, you can fill in the required fields to customize and deploy your scale set. You also have options to set up basic autoscale rules based on CPU usage in the portal.

You can define and deploy scale sets by using JSON templates and [REST APIs](https://msdn.microsoft.com/library/mt589023.aspx), just like individual Azure Resource Manager VMs. Therefore, you can use any standard Azure Resource Manager deployment methods. For more information about templates, see [Authoring Azure Resource Manager templates](../azure-resource-manager/resource-group-authoring-templates.md).

You can find a set of example templates for virtual machine scale sets in the [Azure Quickstart templates GitHub repository](https://github.com/Azure/azure-quickstart-templates). (Look for templates with **vmss** in the title.)

A button links to the portal deployment feature in the detail pages for these templates. To deploy the scale set, click the button and then fill in any parameters that are required in the portal. If you are not sure whether a resource supports uppercase or mixed case, it's safer to use lowercase letters and numbers in parameter values. [VM Scale Set Template Dissection](https://channel9.msdn.com/Blogs/Azure/VM-Scale-Set-Template-Dissection/player) is a handy video dissection of a scale set template.

## Scaling a scale set out and in
You can change the capacity of a scale set in the Azure portal by clicking the **Scaling** section under **Settings**. 

To change scale set capacity on the command line, use the **scale** command in [Azure CLI](https://github.com/Azure/azure-cli). For example, use this command to set a scale set to a capacity of 10 VMs:

```bash
az vmss scale -g resourcegroupname -n scalesetname --new-capacity 10 
```

To set the number of VMs in a scale set by using PowerShell, use the **Update-AzureRmVmss** command:

```PowerShell
$vmss = Get-AzureRmVmss -ResourceGroupName resourcegroupname -VMScaleSetName scalesetname  
$vmss.Sku.Capacity = 10
Update-AzureRmVmss -ResourceGroupName resourcegroupname -Name scalesetname -VirtualMachineScaleSet $vmss
```

To increase or decrease the number of virtual machines in a scale set by using an Azure Resource Manager template, change the **capacity** property and redeploy the template. This simplicity makes it easy to integrate scale sets with Azure Autoscale, or to write your own custom scaling layer if you need to define custom scale events that Azure Autoscale does not support. 

If you are redeploying an Azure Resource Manager template to change the capacity, you can define a much smaller template that includes only the **SKU** property packet with the updated capacity. [Here's an example](https://github.com/Azure/azure-quickstart-templates/tree/master/201-vmss-scale-existing).

## Autoscale

A scale set can be optionally configured with autoscale settings when it's created in the Azure portal. The number of VMs can then be increased or decreased based on average CPU usage. 

Many of the scale set templates in the [Azure Quickstart templates](https://github.com/Azure/azure-quickstart-templates) define autoscale settings. You can also add autoscale settings to an existing scale set. For example, this Azure PowerShell script adds CPU-based autoscale to a scale set:

```PowerShell

$subid = "yoursubscriptionid"
$rgname = "yourresourcegroup"
$vmssname = "yourscalesetname"
$location = "yourlocation" # e.g. southcentralus

$rule1 = New-AzureRmAutoscaleRule -MetricName "Percentage CPU" -MetricResourceId /subscriptions/$subid/resourceGroups/$rgname/providers/Microsoft.Compute/virtualMachineScaleSets/$vmssname -Operator GreaterThan -MetricStatistic Average -Threshold 60 -TimeGrain 00:01:00 -TimeWindow 00:05:00 -ScaleActionCooldown 00:05:00 -ScaleActionDirection Increase -ScaleActionValue 1
$rule2 = New-AzureRmAutoscaleRule -MetricName "Percentage CPU" -MetricResourceId /subscriptions/$subid/resourceGroups/$rgname/providers/Microsoft.Compute/virtualMachineScaleSets/$vmssname -Operator LessThan -MetricStatistic Average -Threshold 30 -TimeGrain 00:01:00 -TimeWindow 00:05:00 -ScaleActionCooldown 00:05:00 -ScaleActionDirection Decrease -ScaleActionValue 1
$profile1 = New-AzureRmAutoscaleProfile -DefaultCapacity 2 -MaximumCapacity 10 -MinimumCapacity 2 -Rules $rule1,$rule2 -Name "autoprofile1"
Add-AzureRmAutoscaleSetting -Location $location -Name "autosetting1" -ResourceGroup $rgname -TargetResourceId /subscriptions/$subid/resourceGroups/$rgname/providers/Microsoft.Compute/virtualMachineScaleSets/$vmssname -AutoscaleProfiles $profile1
```

 You can find a list of valid metrics to scale on in [Supported metrics with Azure Monitor](../monitoring-and-diagnostics/monitoring-supported-metrics.md) under the heading "Microsoft.Compute/virtualMachineScaleSets." More advanced autoscale options are also available, including schedule-based autoscale and using webhooks to integrate with alert systems.

## Monitoring your scale set
The [Azure portal](https://portal.azure.com) lists scale sets and shows their properties. The portal also supports management operations. You can perform management operations on both scale sets and individual VMs within a scale set. The portal also provides a customizable resource usage graph. 

If you need to see or edit the underlying JSON definition of an Azure resource, you can also use [Azure Resource Explorer](https://resources.azure.com). Scale sets are a resource under the Microsoft.Compute Azure resource provider. From this site, you can see them by expanding the following links:

**Subscriptions** > **your subscription** > **resourceGroups** > **providers** > **Microsoft.Compute** > **virtualMachineScaleSets** > **your scale set** > etc.

## Scale set scenarios
This section lists some typical scale set scenarios. Some higher-level Azure services (like Batch, Service Fabric, and Container Service) use these scenarios.

* **Use RDP or SSH to connect to scale set instances**: A scale set is created inside a virtual network, and individual VMs in the scale set are not allocated public IP addresses. This policy avoids the expense and management overhead of allocating separate public IP addresses to all the nodes in your compute grid. You can connect to these VMs from other resources in your virtual network--for example, load balancers and standalone virtual machines--that can be allocated public IP addresses.
* **Connect to VMs by using NAT rules**: You can create a public IP address, assign it to a load balancer, and define an inbound NAT pool. These actions map ports on the IP address to a port on a VM in the scale set. For example:
  
  | Source | Source port | Destination | Destination port |
  | --- | --- | --- | --- |
  |  Public IP |Port 50000 |vmss\_0 |Port 22 |
  |  Public IP |Port 50001 |vmss\_1 |Port 22 |
  |  Public IP |Port 50002 |vmss\_2 |Port 22 |
  
   In [this example](https://github.com/Azure/azure-quickstart-templates/tree/master/201-vmss-linux-nat), NAT rules are defined to enable an SSH connection to every VM in a scale set, by using a single public IP address.
  
   [This example](https://github.com/Azure/azure-quickstart-templates/tree/master/201-vmss-windows-nat) does the same with RDP and Windows.
* **Connect to VMs by using a "jumpbox"**: If you create a scale set and a standalone VM in the same virtual network, the standalone VM and the scale set VM can connect to one another by using their internal IP addresses, as defined by the virtual network or subnet. If you create a public IP address and assign it to the standalone VM, you can use RDP or SSH to connect to the standalone VM. You can then connect from that machine to your scale set instances. You might notice at this point that a simple scale set is inherently more secure than a simple standalone VM with a public IP address in its default configuration.
  
   For example, [this template](https://github.com/Azure/azure-quickstart-templates/tree/master/201-vmss-linux-jumpbox) deploys a simple scale set with a standalone VM. 
* **Load balancing to scale set instances**: If you want to deliver work to a compute cluster of VMs by using a round-robin approach, you can configure an Azure load balancer with layer-4 load-balancing rules accordingly. You can define probes to verify that your application is running by pinging ports with a specified protocol, interval, and request path. [Azure Application Gateway](https://azure.microsoft.com/services/application-gateway/) also supports scale sets, along with layer-7 and more sophisticated load-balancing scenarios.
  
   [This example](https://github.com/Azure/azure-quickstart-templates/tree/master/201-vmss-ubuntu-web-ssl) creates a scale set that runs Apache web servers, and it uses a load balancer to balance the load that each VM receives. (Look at the Microsoft.Network/loadBalancers resource type and networkProfile and extensionProfile in virtualMachineScaleSet.)

   [This Linux example](https://github.com/Azure/azure-quickstart-templates/tree/master/201-vmss-ubuntu-app-gateway) and [this Windows example](https://github.com/Azure/azure-quickstart-templates/tree/master/201-vmss-windows-app-gateway) use Application Gateway.  

* **Deploying a scale set as a compute cluster in a PaaS cluster manager**: Scale sets are sometimes described as a next-generation worker role. Though a valid description, it does run the risk of confusing scale set features with Azure Cloud Services features. In a sense, scale sets provide a true worker role or worker resource. They are a generalized compute resource that is platform/runtime independent, is customizable, and integrates into Azure Resource Manager IaaS.
  
   A Cloud Services worker role is limited in terms of platform/runtime support (Windows platform images only). But it also includes services such as VIP swap, configurable upgrade settings, and runtime/app deployment-specific settings. These services are not *yet* available in scale sets, or they're delivered by other higher-level PaaS services like Azure Service Fabric. You can look at scale sets as an infrastructure that supports PaaS. PaaS solutions like [Service Fabric](https://azure.microsoft.com/services/service-fabric/) build on this infrastructure.
  
   In [this example](https://github.com/Azure/azure-quickstart-templates/tree/master/101-acs-dcos) of this approach, [Azure Container Service](https://azure.microsoft.com/services/container-service/) deploys a cluster based on scale sets with a container orchestrator.

## Scale set performance and scale guidance
* A scale set supports up to 1,000 VMs. If you create and upload your own custom VM images, the limit is 100. For considerations in using large scale sets, see [Working with large virtual machine scale sets](virtual-machine-scale-sets-placement-groups.md).
* You do not have to pre-create Azure storage accounts to use scale sets. Scale sets support Azure managed disks, which negate performance concerns about the number of disks per storage account. For more information, see [Azure virtual machine scale sets and managed disks](virtual-machine-scale-sets-managed-disks.md).
* Consider using Azure Premium Storage instead of Azure Storage for faster, more predictable VM provisioning times and improved I/O performance.
* The core quota in the region in which you are deploying limits the number of VMs you can create. You might need to contact Customer Support to increase your compute quota limit, even if you have a high limit of cores for use with Azure Cloud Services today. To query your quota, run this Azure CLI command: `azure vm list-usage`. Or, run this PowerShell command: `Get-AzureRmVMUsage`.

## Frequently asked questions for scale sets
**Q.** How many VMs can I have in a scale set?

**A.** A scale set can have 0 to 1,000 VMs based on platform images, or 0 to 100 VMs based on custom images. 

**Q.** Are data disks supported within scale sets?

**A.** Yes. A scale set can define an attached data disks configuration that applies to all VMs in the set. For more information, see [Azure scale sets and attached data disks](virtual-machine-scale-sets-attached-disks.md). Other options for storing data include:

* Azure files (SMB shared drives)
* OS drive
* Temp drive (local, not backed by Azure Storage)
* Azure data service (for example, Azure tables, Azure blobs)
* External data service (for example, remote database)

**Q.** Which Azure regions support scale sets?

**A.** All regions support scale sets.

**Q.** How do I create a scale set by using a custom image?

**A.** Create a managed disk based on your custom image VHD and reference it in your scale set template. [Here's an example](https://github.com/chagarw/MDPP/tree/master/101-vmss-custom-os).

**Q.** If I reduce my scale set capacity from 20 to 15, which VMs are removed?

**A.** Virtual machines are removed from the scale set evenly across update domains and fault domains to maximize availability. VMs with the highest IDs are removed first.

**Q.** What if I then increase the capacity from 15 to 18?

**A.** If you increase capacity to 18, then 3 new VMs are created. Each time, the VM instance ID is incremented from the previous highest value (for example, 20, 21, 22). VMs are balanced across fault domains and update domains.

**Q.** When I'm using multiple extensions in a scale set, can I enforce an execution sequence?

**A.** Not directly, but for the customScript extension, your script can wait for another extension to finish. You can get additional guidance on extension sequencing in the blog post [Extension Sequencing in Azure VM Scale Sets](https://msftstack.wordpress.com/2016/05/12/extension-sequencing-in-azure-vm-scale-sets/).

**Q.** Do scale sets work with Azure availability sets?

**A.** Yes. A scale set is an implicit availability set with 5 fault domains and 5 update domains. Scale sets of more than 100 VMs span multiple *placement groups*, which are equivalent to multiple availability sets. For more information about placement groups, see [Working with large virtual machine scale sets](virtual-machine-scale-sets-placement-groups.md). An availability set of VMs can exist in the same virtual network as a scale set of VMs. A common configuration is to put control node VMs (which often require unique configuration) in an availability set and put data nodes in the scale set.

You can find more answers to questions about scale sets in the [Azure virtual machine scale sets FAQ](virtual-machine-scale-sets-faq.md).

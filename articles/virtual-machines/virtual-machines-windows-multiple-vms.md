<properties
	pageTitle="Create multiple virtual machines | Microsoft Azure"
	description="Options for creating multiple virtual machines on Windows"
	services="virtual-machines-windows"
	documentationCenter=""
	authors="gbowerman"
	manager="timlt"
	editor=""
	tags="azure-resource-manager"/>

<tags
	ms.service="virtual-machines-windows"
	ms.workload="na"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="05/02/2016"
	ms.author="guybo"/>

# Create multiple Azure virtual machines

There are many scenarios where you need to create a large number of similar virtual machines (VMs). Some examples include high-performance computing (HPC), large-scale data analysis, scalable and often stateless middle-tier or backend servers (such as webservers), and distributed databases.

This article discusses the available options to create multiple VMs in Azure. These options go beyond the simple cases where you manually create a series of VMs. To create many VMs, the processes that you typically use don't scale well if you need to create more than a handful of VMs.

One way to create many similar VMs is to use the Azure Resource Manager construct of _resource loops_.

## Resource loops

Resource loops are a syntactical shorthand in Azure Resource Manager templates. Resource loops can create a set of similarly configured resources in a loop. You can use resource loops to create multiple storage accounts, network interfaces, or virtual machines. For more information about resource loops, refer to [Create VMs in availability sets using resource loops](https://azure.microsoft.com/documentation/templates/201-vm-copy-index-loops/).

## Challenges of scale

Although resource loops make it easier to build out a cloud infrastructure at scale and produce more concise templates, certain challenges remain. For example, if you use a resource loop to create 100 virtual machines, you need to correlate network interface controllers (NICs) with corresponding VMs and storage accounts. Because the number of VMs is likely to be different from the number of storage accounts, you'll have to deal with different resource loop sizes, too. These are solvable problems, but the complexity increases significantly with scale.

Another challenge occurs when you need an infrastructure that scales elastically. For example, you might want an autoscale infrastructure that automatically increases or decreases the number of VMs in response to workload. VMs don't provide an integrated mechanism to vary in number (scale out and scale in). If you scale in by removing VMs, it's difficult to guarantee high availability by making sure that VMs are balanced across update and fault domains.

Finally, when you use a resource loop, multiple calls to create resources go to the underlying fabric. When multiple calls create similar resources, Azure has an implicit opportunity to improve upon this design and optimize deployment reliability and performance. This is where _virtual machine scale sets_ come in.

## Virtual machine scale sets

Virtual machine scale sets are an Azure Cloud Services resource to deploy and manage a set of identical VMs. With all VMs configured the same, VM scale sets are easy to scale in and scale out. You simply change the number of VMs in the set. You can also configure VM scale sets to autoscale based on the demands of the workload.

For applications that need to scale compute resources out and in, scale operations are implicitly balanced across fault and update domains.

Instead of correlating multiple resources such as NICs and VMs, a VM scale set has network, storage, virtual machine, and extension properties that you can configure centrally.

For an introduction to VM scale sets, refer to the [Virtual machine scale sets product page](https://azure.microsoft.com/services/virtual-machine-scale-sets/). For more detailed information, go to the [Virtual machines scale sets documentation](https://azure.microsoft.com/documentation/services/virtual-machine-scale-sets/).

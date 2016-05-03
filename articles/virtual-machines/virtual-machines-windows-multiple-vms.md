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

# Creating multiple Azure virtual machines

There are many scenarios where you need to create a large number of similar virtual machines, e.g. high-performance computing (HPC), large scale data analysis, scalable and often stateless middle-tier or backend servers (such as webservers) and distributed databases. 

This article discusses the options available to create multiple VMs in Azure which go beyond the simple cases of manually creating a series of VMs, which doesn't scale well if you need to create more than a handful of VMs. 

One way to optimize creating many similar VMs is to use the Azure Resource Manager construct of _Resource Loops_.

## Resource loops

Resource loops are a syntactical shorthand in Azure Resource Manager templates which allow you to create a set of similarly configured resources in a loop. You can use resource loops to create multiple storage accounts, network interfaces, virtual machines for example. For more information about resource loops refer to [Create VMs in Availability Sets using Resource Loops](https://azure.microsoft.com/documentation/templates/201-vm-copy-index-loops/).

## Challenges of Scale

Though resource loops make building out cloud infrastructure at scale easier and allow for more concise templates, certain challenges remain. For example when creating 100 virtual machines using a resource loop, when defining the VMs, you would need to correlate the NICs with the VMs and storage accounts. There are likely to be a different number of VMs to the number of storage accounts, and hence different resource loop sizes. These are solvable problems, but the complexity increases significantly with scale.

Another challenge occurs when you need an elastically scaling infrastructure, for example autoscale - automatically increasing or decreasing the number of VMs in response to workload. VMs don't provide an integrated mechanism to vary in number (scale out and scale in). If you scale in by removing VMs, ensuring high availability by making sure VMs are balanced across update and fault domains is another difficult task.

Lastly though resource loops are a syntactical shorthand, when you use one, multiple calls to create resources go to the underlying fabric. When multiple calls are creating similar resources, there is an implicit opportunity for Azure to improve upon this design and make optimizations to improve deployment reliability and performance. This is where _Virtual Machine Scale Sets_ come in.

## Virtual machine scale sets

Virtual Machine Scale Sets are an Azure Compute resource to deploy and manage a set of identical VMs. With all VMs configured the same, VM Scale Sets are easy to scale in and out by simply changing the number of VMs in the set, and can be configured to autoscale based on the demands of the workload.

For applications that need to scale compute resources out and in, scale operations are implicitly balanced across fault and update domains. 

Instead of correlating multiple resources such as NICs and VMs, a scale set has network, storage, virtual machine and extension properties which you can configure centrally.

For an introduction to VM scale sets refer to the [product page](https://azure.microsoft.com/services/virtual-machine-scale-sets/), and for more detailed information go to the [documentation](https://azure.microsoft.com/documentation/services/virtual-machine-scale-sets/).
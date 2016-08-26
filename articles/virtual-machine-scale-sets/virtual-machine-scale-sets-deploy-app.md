<properties
	pageTitle="Deploy an App on Virtual Machine Scale Sets| Microsoft Azure"
	description="Deploy an app on Virtual Machine Scale Sets"
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
	ms.date="08/26/2016"
	ms.author="guybo"/>

# Deploy Virtual Machine Scale Set using Visual Studio

An application running on a VM Scale Set is typically deployed in one of three ways:

- Installing new software on a Platform image at deployment time. A platform image in this context is a operating system image from the Azure Marketplace, like Ubuntu 16.04, Windows Server 2012 R2 etc.

You can install new software on a platform image using a [VM Extension](../virtual-machines/virtual-machines-windows-extensions-features.md). A VM extension is software that runs when a VM is deployed. You can run any code you like at deployment time using a custom script extension. [Here](https://github.com/Azure/azure-quickstart-templates/tree/master/201-vmss-lapstack-autoscale) is an example Azure Resource Manager Template with two VM extensions, a linux custom script extension to install Apache and PHP, and a diagnostic extension to emit performance data which can be used by Azure Autoscale.

An advantage of this approach is you have a level of separation between your application code and the OS, and can maintain your application separately. Of course that means there are also more moving parts, and depending on how much needs to download and configure when the extension runs, it could add to the VM deployment time.

- Create a custom VM image which includes both the OS and the application in a single VHD. Here the scale set consists of a set of VMs copied from an image created by you, which you have to maintain. This means no extra configuration is required at VM deployment time, but there are some limitations with custom images in the current version of VM Scale Sets – you are limited to a single storage account, and hence a maximum of 40 VMs in a scale set (as opposed to 100 VMs in a scale set which uses platform images).

- Deploy a platform or a custom image which is basically a container host, and install your application as one or more containers which you can manage with an orchestrator or config management tool. This nice thing about this approach is that you have completely abstracted your cloud infrastructure from the application layer and can maintain them separately.

## What happens when a VM Scale Set Scales Out?

When you add one or more VMs to a scale set by increasing the capacity – whether manually or through autoscale – the application is automatically installed. For example if the scale set has extensions defined, they run on a new VM each time it is created. If the scale set is based on a custom image, any new VM will be a copy of the source custom image. If the scale set VMs are container hosts, then you might have startup code to load the containers in a custom script extension, or an extension might install an agent which registers with a cluster orchestrator (e.g. Azure Container Service).

## How do you manage application updates in VM Scale Sets?

For application updates in VM Scale Sets, three main approaches follow from the three application deployment methods outlined above:

1. Updating with Extensions. Any VM extensions which are defined for a VM Scale Set are executed each time a new VM is deployed, an existing VM is reimaged, or a VM extension is updated. If you need to update your application, Directly updating an application through extensions is a viable approach – you can update the extension definition, or the extension code can point to a location which contains updateable software.

The hard problems there are:

– Security – how to maintain certificates/shared access signatures.

– Scaling – how the application updates, how long it takes, when you scale out.

2. The immutable approach. When you bake the application (or app components) into a VM image you can focus on building a reliable pipeline to automate build, test, deployment of the images (e.g. Jenkins based). You can design infrastructure architecture to facilitate rapid swapping of a stage scale set into production. A good example of this approach is the Azure Spinnaker driver work: https://github.com/spinnaker/deck/tree/master/app/scripts/modules/azure – http://www.spinnaker.io/

Packer and Terraform support Azure Resource Manager, so you can also define your images “as code” and build them in Azure, then use the VHD in your scale set. Where this would become problematic is for Marketplace images, where extensions/custom scripts become more important as you don’t directly manipulate bits from Marketplace.

3. Update Containers. Abstract the application lifecycle management to a level above the cloud infrastructure, e.g. by encapsulating applications, and app components into containers and manage these through container orchestrators and app managers like chef/puppet.

The scale set VMs then become a stable substrate for the containers and only require occasional security and OS related updates. As mentioned, the Azure Container Service is a good example of taking this approach and building a service around it.

## How do you roll out an OS update across update domains?

Suppose you want to update your OS image while keeping the VM Scale Set running. One way to do this is to update the VM images one VM at a time. You can do this with PowerShell or Azure CLI. There are separate commands to update the VM Scale Set model (how its configuration is defined), and to issue “manual upgrade” calls on individual VMs.

Here’s an example Python script which automates this to update a VM Scale Set one update domain at a time: https://github.com/gbowerman/vmsstools. (Caveat: it’s more of a proof of concept than a hardened production-ready solution – you might want to add some error checking etc.).
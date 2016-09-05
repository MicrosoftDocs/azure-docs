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

# Deploy an App on Virtual Machine Scale Sets

An application running on a VM Scale Set is typically deployed in one of three ways:

- Installing new software on a platform image at deployment time. A platform image in this context is an operating system image from the Azure Marketplace, like Ubuntu 16.04, Windows Server 2012 R2, etc.

You can install new software on a platform image using a [VM Extension](../virtual-machines/virtual-machines-windows-extensions-features.md). A VM extension is software that runs when a VM is deployed. You can run any code you like at deployment time using a custom script extension. [Here](https://github.com/Azure/azure-quickstart-templates/tree/master/201-vmss-lapstack-autoscale) is an example Azure Resource Manager Template with two VM extensions: a Linux Custom Script Extension to install Apache and PHP, and a Diagnostic Extension to emit performance data used by Azure Autoscale.

An advantage of this approach is you have a level of separation between your application code and the OS, and can maintain your application separately. Of course that means there are also more moving parts, and VM deployment time could be longer if there is a lot for the script to download and configure.

**If you pass sensitive information in your Custom Script Extension command (such as a password), be sure to specify the `commandToExecute` in the `protectedSettings` attribute of the Custom Script Extension instead of the `settings` attribute.**

- Create a custom VM image that includes both the OS and the application in a single VHD. Here the scale set consists of a set of VMs copied from an image created by you, which you have to maintain. This approach requires no extra configuration at VM deployment time. However, in the `2016-03-30` version of VM Scale Sets (and earlier versions), the OS disks for the VMs in the scale set are limited to a single storage account. Thus, you can have a maximum of 40 VMs in a scale set, as opposed to the 100 VM per scale set limit with platform images. See [Scale Set Design Overview](./virtual-machine-scale-sets-design-overview.md) for more details.

- Deploy a platform or a custom image which is basically a container host, and install your application as one or more containers that you manage with an orchestrator or configuration management tool. The nice thing about this approach is that you have abstracted your cloud infrastructure from the application layer and can maintain them separately.

## What happens when a VM Scale Set scales out?

When you add one or more VMs to a scale set by increasing the capacity – whether manually or through autoscale – the application is automatically installed. For example if the scale set has extensions defined, they run on a new VM each time it is created. If the scale set is based on a custom image, any new VM is a copy of the source custom image. If the scale set VMs are container hosts, then you might have startup code to load the containers in a Custom Script Extension, or an extension might install an agent that registers with a cluster orchestrator (such as Azure Container Service).

## How do you manage application updates in VM Scale Sets?

For application updates in VM Scale Sets, three main approaches follow from the three preceding application deployment methods:

* Updating with VM extensions. Any VM extensions that are defined for a VM Scale Set are executed each time a new VM is deployed, an existing VM is reimaged, or a VM extension is updated. If you need to update your application, directly updating an application through extensions is a viable approach – you simply update the extension definition. One simple way to do so is by changing the fileUris to point to the new software.

* The immutable custom image approach. When you bake the application (or app components) into a VM image you can focus on building a reliable pipeline to automate build, test, and deployment of the images. You can design your architecture to facilitate rapid swapping of a staged scale set into production. A good example of this approach is the [Azure Spinnaker driver work](https://github.com/spinnaker/deck/tree/master/app/scripts/modules/azure) - [http://www.spinnaker.io/](http://www.spinnaker.io/).

Packer and Terraform also support Azure Resource Manager, so you can also define your images “as code” and build them in Azure, then use the VHD in your scale set. However, doing so would become problematic for Marketplace images, where extensions/custom scripts become more important since you don’t directly manipulate bits from Marketplace.

* Update containers. Abstract the application lifecycle management to a level above the cloud infrastructure, for example by encapsulating applications, and app components into containers and manage these containers through container orchestrators and configuration managers like Chef/Puppet.

The scale set VMs then become a stable substrate for the containers and only require occasional security and OS-related updates. As mentioned, the Azure Container Service is a good example of taking this approach and building a service around it.

## How do you roll out an OS update across update domains?

Suppose you want to update your OS image while keeping the VM Scale Set running. One way to do so is to update the VM images one VM at a time. You can do so with PowerShell or Azure CLI. There are separate commands to update the VM Scale Set model (how its configuration is defined), and to issue “manual upgrade” calls on individual VMs.

[Here](https://github.com/gbowerman/vmsstools) is an example Python script that automates the process of updating a VM Scale Set one update domain at a time. (Caveat: it’s more of a proof of concept than a hardened production-ready solution – you might want to add some error checking etc.).

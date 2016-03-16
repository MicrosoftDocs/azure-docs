<properties
	pageTitle="Different ways to create a Linux VM | Microsoft Azure"
	description="Lists the different ways to create a Linux virtual machine on Azure and gives links to further instructions"
	services="virtual-machines-linux"
	documentationCenter=""
	authors="dsk-2015"
	manager="timlt"
	editor=""
	tags="azure-resource-manager"/>

<tags
	ms.service="virtual-machines-linux"
	ms.devlang="na"
	ms.topic="get-started-article"
	ms.tgt_pltfrm="vm-linux"
	ms.workload="infrastructure-services"
	ms.date="03/07/2016"
	ms.author="dkshir"/>

# Different ways to create a Linux virtual machine with Resource Manager

[AZURE.INCLUDE [learn-about-deployment-models](../../includes/learn-about-deployment-models-rm-include.md)] classic deployment model.

Azure offers different ways to create a VM, to suit different users and purposes. This article summarizes these differences and the choices you can make for creating your Linux virtual machines.

Azure Resource Manager templates were recently introduced as a way to create and manage a virtual machine and its different resources as one logical deployment unit. Instructions for this approach are included below, where available. To learn more about Azure Resource Manager and how to manage resources as one unit, see the [overview](../resource-group-overview.md).

## Tool choices

### GUI: Azure portal

The graphical user interface of the [Azure portal](https://portal.azure.com) is an easy way to try out a virtual machine, especially if you're just starting out with Azure. Use the Azure portal to create the VM:

* [Create a virtual machine running Linux using the Azure portal](virtual-machines-linux-portal-create.md) 

### Command shell: Azure CLI 

If you prefer working in a command shell, use the Azure command-line interface (CLI) for Mac, Linux and Windows users.

For Azure CLI, see these tutorials:

* [Create a Linux VM from the CLI for dev and test](virtual-machines-linux-quick-create-cli.md) 

* [Create a secured Linux VM using an Azure template](virtual-machines-linux-create-ssh-secured-vm-from-template.md)

## Operating system and image choices

Choose an image based on the operating system you want to run. Azure and its partners offer many images, some of which include applications and tools. Or, use one of your own images.

### Azure images

In all of the above articles, you can easily use an existing Azure image to create a virtual machine and customize it for networking, load balancing, and more. The portal provides the Azure Marketplace for Azure supplied images. You can get similar lists using the command line. For example, in Azure CLI, run `azure vm image list` to get a list of all available images, by location and publisher. See [Navigate and select Azure virtual machine images with the Azure CLI](virtual-machines-linux-cli-ps-findimage.md).

### Use your own image

Use an image based on an existing Azure virtual machine by *capturing* that VM, or upload an image of your own, stored in a virtual hard disk (VHD). For more information, see:

* [Azure endorsed distributions](virtual-machines-linux-endorsed-distros.md)

* [Information for non-endorsed distributions](virtual-machines-linux-create-upload-generic.md)

* [How to capture a Linux virtual machine as a Resource Manager template](virtual-machines-linux-capture-image.md). 

## Next steps

* Try one of the tutorials to create a Linux VM from the [portal](virtual-machines-linux-portal-create.md), with the [CLI](virtual-machines-linux-quick-create-cli.md), or using an Azure Resource Manager [template](virtual-machines-linux-cli-deploy-templates.md).

* After creating a Linux VM, you can easily [add a data disk](virtual-machines-linux-add-disk.md).
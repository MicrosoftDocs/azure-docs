<properties
	pageTitle="Different ways to create a Windows VM | Microsoft Azure"
	description="Lists the different ways to create a Windows virtual machine with Resource Manager."
	services="virtual-machines"
	documentationCenter=""
	authors="cynthn"
	manager="timlt"
	editor=""
	tags="azure-resource-manager"/>

<tags
	ms.service="virtual-machines"
	ms.devlang="na"
	ms.topic="index-page"
	ms.tgt_pltfrm="vm-windows"
	ms.workload="infrastructure-services"
	ms.date="10/22/2015"
	ms.author="cynthn"/>

# Different ways to create a Windows virtual machine with Resource Manager

Azure offers different ways to create a virtual machine because virtual machines are suited for different users and purposes. This means that you need to make some choices about the virtual machine and how to create it. This article gives you a summary of these choices and links to instructions.

[AZURE.INCLUDE [learn-about-deployment-models](../../includes/learn-about-deployment-models-rm-include.md)]

Azure Resource Manager templates were recently introduced as a way to create and manage a virtual machine and its different resources as one logical deployment unit. Instructions for this approach are included below, where available. To learn more about Azure Resource Manager and how to manage resources as one unit, see the [Overview][].

## Tool choices

### GUI: Azure preview portal

The graphical user interface of the Azure portal is an easy way to try out a virtual machine, especially if you're just starting out with Azure. Use the Azure preview portal to create the virtual machine:

[Create a virtual machine running Windows][]

### Command shell: Azure CLI or Azure PowerShell

If you prefer working in a command shell, choose between the Azure command-line interface (CLI) for Mac and Linux users, or Azure PowerShell, which has cmdlets for Azure and a custom console.

For Azure CLI, see:

- [Equivalent Resource Manager and Service Management commands for virtual machine operations with the Azure CLI for Mac, Linux, and Windows][]
- [Deploy and manage virtual machines using Azure Resource Manager templates and the Azure CLI][].

For Azure PowerShell, see:

- [Create a Windows VM with Resource Manager and PowerShell][]
- [Create and preconfigure a Windows virtual machine with Resource Manager and Azure PowerShell][]
- [Deploy and manage virtual machines using Azure Resource Manager templates and PowerShell][]
- [Create a Windows virtual machine with a Resource Manager template and PowerShell][]

### Development environment: Visual Studio

[Deploy Azure resources using the Compute, Network, and Storage .NET libraries][]

## Operating system and image choices

Choose an image based on the operating system you want to run. Azure and its partners offer many images, some of which include applications and tools. Or, use one of your own images. Find the platform image that you need for your application by using the information in: [Navigate and select Azure virtual machine images with Windows PowerShell and the Azure CLI][].

<!-- LINKS -->
[overview]: ../resource-group-overview.md

[Create a virtual machine running Windows]: virtual-machines-windows-tutorial.md

[Equivalent Resource Manager and Service Management commands for virtual machine operations with the Azure CLI for Mac, Linux, and Windows]:xplat-cli-azure-manage-vm-asm-arm.md
[Deploy and manage virtual machines using Azure Resource Manager templates and the Azure CLI]: virtual-machines-deploy-rmtemplates-azure-cli.md
[Create and preconfigure a Windows virtual machine with Resource Manager and Azure PowerShell]:  virtual-machines-ps-create-preconfigure-windows-resource-manager-vms.md
[Deploy and manage virtual machines using Azure Resource Manager templates and PowerShell]: virtual-machines-deploy-rmtemplates-powershell.md
[Create a Windows VM with Resource Manager and PowerShell]: virtual-machines-create-windows-powershell-resource-manager.md
[Create a Windows virtual machine with a Resource Manager template and PowerShell]: virtual-machines-create-windows-powershell-resource-manager-template-simple.md


[Navigate and select Azure virtual machine images with Windows PowerShell and the Azure CLI]: resource-groups-vm-searching.md
[Deploy Azure resources using the Compute, Network, and Storage .NET libraries]: virtual-machines-arm-deployment.md

[Sign in to the virtual machine]: virtual-machines-log-on-windows-server.md

[Base configuration test environment]: virtual-machines-base-configuration-test-environment.md

[Azure hybrid cloud test environments]: virtual-machines-hybrid-cloud-test-environments.md

<properties
	pageTitle="Different ways to create a Windows VM | Microsoft Azure"
	description="Lists the different ways to create a Windows virtual machine with Resource Manager."
	services="virtual-machines-windows"
	documentationCenter=""
	authors="cynthn"
	manager="timlt"
	editor=""
	tags="azure-resource-manager,azure-service-management"/>

<tags
	ms.service="virtual-machines-windows"
	ms.devlang="na"
	ms.topic="article"
	ms.tgt_pltfrm="vm-windows"
	ms.workload="infrastructure-services"
	ms.date="03/11/2016"
	ms.author="cynthn"/>

# Different ways to create a Windows virtual machine with Resource Manager

Azure offers different ways to create a virtual machine because virtual machines are suited for different users and purposes. This means that you need to make some choices about the virtual machine and how to create it. This article gives you a summary of these choices and links to instructions.

[AZURE.INCLUDE [learn-about-deployment-models](../../includes/learn-about-deployment-models-rm-include.md)] classic deployment model.


## Azure portal

Using the Azure portal is a simple way to try out a virtual machine, especially if you're just starting out with Azure. 

[Create a virtual machine running Windows using the portal](virtual-machines-windows-hero-tutorial.md)

## Azure PowerShell

If you prefer working in a command shell, you can use Azure PowerShell.

- [Create a Windows VM using PowerShell](virtual-machines-windows-ps-create.md)
- [Create a Windows virtual machine with a Resource Manager template](virtual-machines-windows-ps-template.md)

## Template

Virtual machines require a combination of resources (such as a availability sets and storage accounts). Rather than deploying and managing each resource separately, you can create an Azure Resource Manager template that deploys and provisions all of the resources in a single, coordinated operation.

- [Create a Windows virtual machine with a Resource Manager template](virtual-machines-windows-ps-template.md)

## Visual Studio

[Deploy Azure resources using the Compute, Network, and Storage .NET libraries](virtual-machines-windows-csharp.md)


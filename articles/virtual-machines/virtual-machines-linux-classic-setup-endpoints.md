<properties
	pageTitle="Set up endpoints on a classic Linux VM | Microsoft Azure"
	description="Learn to set up endpoints for a Linux VM in the Azure classic portal to allow communication with a Linux virtual machine in Azure"
	services="virtual-machines-linux"
	documentationCenter=""
	authors="cynthn"
	manager="timlt"
	editor=""
	tags="azure-service-management"/>

<tags
	ms.service="virtual-machines-linux"
	ms.workload="infrastructure-services"
	ms.tgt_pltfrm="vm-linux"
	ms.devlang="na"
	ms.topic="article"
	ms.date="07/13/2016"
	ms.author="cynthn"/>

# How to set up endpoints on a Linux classic virtual machine in Azure

All Linux virtual machines that you create in Azure using the classic deployment model can automatically communicate over a private network channel with other virtual machines in the same cloud service or virtual network. However, computers on the Internet or other virtual networks require endpoints to direct the inbound network traffic to a virtual machine. This article is also available for [Windows virtual machines](virtual-machines-windows-classic-setup-endpoints.md).

[AZURE.INCLUDE [learn-about-deployment-models](../../includes/learn-about-deployment-models-classic-include.md)] In the **Resource Manager** deployment model, endpoints are configured using **Network Security Groups (NSGs)**. For more information, see [Opening ports and endpoints] (virtual-machines-linux-nsg-quickstart.md).

When you create a Linux virtual machine in the Azure classic portal, an endpoint for Secure Shell (SSH) is typically created for you automatically. You can configure additional endpoints while creating the virtual machine or afterwards as needed.
 

[AZURE.INCLUDE [virtual-machines-common-classic-setup-endpoints](../../includes/virtual-machines-common-classic-setup-endpoints.md)]

## Next steps

* You can also create a VM endpoint by using the [Azure Command-Line Interface](../virtual-machines-command-line-tools.md). Run the **azure vm endpoint create** command.

* If you created a virtual machine in the Resource Manager deployment model, you can use the Azure CLI in Resource Manager mode to [create network security groups](../virtual-network/virtual-networks-create-nsg-arm-cli.md) to control traffic to the VM.
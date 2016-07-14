<properties
	pageTitle="Set up endpoints on a classic Windows VM | Microsoft Azure"
	description="Learn to set up endpoints for a Windows VM in the Azure classic portal to allow communication with a Windows virtual machine in Azure."
	services="virtual-machines-windows"
	documentationCenter=""
	authors="cynthn"
	manager="timlt"
	editor=""
	tags="azure-service-management"/>

<tags
	ms.service="virtual-machines-windows"
	ms.workload="infrastructure-services"
	ms.tgt_pltfrm="vm-windows"
	ms.devlang="na"
	ms.topic="article"
	ms.date="07/13/2016"
	ms.author="cynthn"/>

# How to set up endpoints on a classic Windows virtual machine in Azure


All Windows virtual machines that you create in Azure using the classic deployment model can automatically communicate over a private network channel with other virtual machines in the same cloud service or virtual network. However, computers on the Internet or other virtual networks require endpoints to direct the inbound network traffic to a virtual machine. This article is also available for [Linux virtual machines](virtual-machines-linux-classic-setup-endpoints.md).

[AZURE.INCLUDE [learn-about-deployment-models](../../includes/learn-about-deployment-models-classic-include.md)] In the **Resource Manager** deployment model, endpoints are configured using **Network Security Groups (NSGs)**. For more information, see [Allow external access to your VM using the Azure Portal] (virtual-machines-windows-nsg-quickstart-portal.md).

When you create a Windows virtual machine in the Azure classic portal, common endpoints like those for Remote Desktop and Windows PowerShell Remoting are typically created for you automatically. You can configure additional endpoints while creating the virtual machine or afterwards as needed.



[AZURE.INCLUDE [virtual-machines-common-classic-setup-endpoints](../../includes/virtual-machines-common-classic-setup-endpoints.md)]

## Next steps

* To use an Azure PowerShell cmdlet to set up a VM endpoint, see [Add-AzureEndpoint](https://msdn.microsoft.com/library/azure/dn495300.aspx).

* To use an Azure PowerShell cmdlet to manage an ACL on an endpoint, see [Managing access control lists (ACLs) for endpoints by using PowerShell](../virtual-network/virtual-networks-acl-powershell.md).

* If you created a virtual machine in the Resource Manager deployment model, you can use Azure PowerShell to [create network security groups](../virtual-network/virtual-networks-create-nsg-arm-ps.md) to control traffic to the VM.

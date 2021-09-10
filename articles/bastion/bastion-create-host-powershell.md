---
title: 'Create a Bastion host using Azure PowerShell | Microsoft Docs'
description: Learn how to create an Azure Bastion host using PowerShell.
services: bastion
author: cherylmc

ms.service: bastion
ms.topic: how-to
ms.date: 07/12/2021
ms.author: cherylmc
# Customer intent: As someone with a networking background, I want to create an Azure Bastion host.

---

# Create an Azure Bastion host using Azure PowerShell

This article shows you how to create an Azure Bastion host using PowerShell. Once you provision the Azure Bastion service in your virtual network, the seamless RDP/SSH experience is available to all of the VMs in the same virtual network. Azure Bastion deployment is per virtual network, not per subscription/account or virtual machine.

Optionally, you can create an Azure Bastion host by using the following methods:
* [Azure portal](./tutorial-create-host-portal.md)
* [Azure CLI](create-host-cli.md)

[!INCLUDE [Note about SKU limitations for preview.](../../includes/bastion-preview-sku-note.md)]

## Prerequisites

Verify that you have an Azure subscription. If you don't already have an Azure subscription, you can activate your [MSDN subscriber benefits](https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details) or sign up for a [free account](https://azure.microsoft.com/pricing/free-trial).

[!INCLUDE [PowerShell](../../includes/vpn-gateway-cloud-shell-powershell-about.md)]

 > [!NOTE]
 > The use of Azure Bastion with Azure Private DNS Zones is not supported at this time. Before you begin, please make sure that the virtual network where you plan to deploy your Bastion resource is not linked to a private DNS zone.
 >

## <a name="createhost"></a>Create a bastion host

This section helps you create a new Azure Bastion resource using Azure PowerShell.

1. Create a virtual network and an Azure Bastion subnet. You must create the Azure Bastion subnet using the name value **AzureBastionSubnet**. This value lets Azure know which subnet to deploy the Bastion resources to. This is different than a VPN gateway subnet.

   [!INCLUDE [Note about BastionSubnet size.](../../includes/bastion-subnet-size.md)]

   ```azurepowershell-interactive
   $subnetName = "AzureBastionSubnet"
   $subnet = New-AzVirtualNetworkSubnetConfig -Name $subnetName -AddressPrefix 10.0.0.0/24
   $vnet = New-AzVirtualNetwork -Name "myVnet" -ResourceGroupName "myBastionRG" -Location "westeurope" -AddressPrefix 10.0.0.0/16 -Subnet $subnet
   ```

2. Create a public IP address for Azure Bastion. The public IP is the public IP address the Bastion resource on which RDP/SSH will be accessed (over port 443). The public IP address must be in the same region as the Bastion resource you are creating.

   ```azurepowershell-interactive
   $publicip = New-AzPublicIpAddress -ResourceGroupName "myBastionRG" -name "myPublicIP" -location "westeurope" -AllocationMethod Static -Sku Standard
   ```

3. Create a new Azure Bastion resource in the AzureBastionSubnet of your virtual network. It takes about 5 minutes for the Bastion resource to create and deploy.

   ```azurepowershell-interactive
   $bastion = New-AzBastion -ResourceGroupName "myBastionRG" -Name "myBastion" -PublicIpAddress $publicip -VirtualNetwork $vnet
   ```

## Next steps

* Read the [Bastion FAQ](bastion-faq.md) for additional information.
* To use Network Security Groups with the Azure Bastion subnet, see [Work with NSGs](bastion-nsg.md).

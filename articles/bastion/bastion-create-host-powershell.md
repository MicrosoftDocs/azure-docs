---
title: 'Create a Bastion host using Azure Powershell | Microsoft Docs'
description: In this article, learn how to create an Azure Bastion host
services: bastion
author: cherylmc

ms.service: bastion
ms.topic: conceptual
ms.date: 10/14/2019
ms.author: cherylmc
# Customer intent: As someone with a networking background, I want to create an Azure Bastion host.

---

# Create an Azure Bastion host using Azure PowerShell

This article shows you how to create an Azure Bastion host. Once you provision the Azure Bastion service in your virtual network, the seamless RDP/SSH experience is available to all your VMs in the same virtual network. This deployment is per virtual network, not per subscription/account or virtual machine.

## Before you begin

Verify that you have an Azure subscription. If you don't already have an Azure subscription, you can activate your [MSDN subscriber benefits](https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details) or sign up for a [free account](https://azure.microsoft.com/pricing/free-trial).

[!INCLUDE [powershell](../../includes/vpn-gateway-cloud-shell-powershell-about.md)]

## <a name="createhost"></a>Create a bastion host

This section helps you create a new Azure Bastion resource using Azure PowerShell.

1. Create a virtual network and an Azure Bastion subnet. You must create the Azure Bastion subnet using the name value **AzureBastionSubnet**. This value lets Azure know which subnet to deploy the Bastion resources to. This is different than a Gateway subnet. You must use a subnet of at least a /27 or larger subnet (/27, /26, and so on). Create the **AzureBastionSubnet** without any route tables or delegations. When you use Network Security Groups on the **AzureBastionSubnet**, refer to [Work with NSGs](bastion-nsg.md).

   ```azurepowershell-interactive
   $subnetName = "AzureBastionSubnet"
   $subnet = New-AzVirtualNetworkSubnetConfig -Name $subnetName -AddressPrefix 10.0.0.0/24
   $vnet = New-AzVirtualNetwork -Name "myVnet" -ResourceGroupName " myBastionRG " -Location "westeurope" -AddressPrefix 10.0.0.0/16 -Subnet $subnet
   ```

2. Create a public IP address for Azure Bastion. The public IP is the public IP address the Bastion resource on which RDP/SSH will be accessed (over port 443). The public IP address must be in the same region as the Bastion resource you are creating.

   ```azurepowershell-interactive
   $publicip = New-AzPublicIpAddress -ResourceGroupName "myBastionRG" -name "myPublicIP" -location "westeurope" -AllocationMethod Dynamic -Sku Standard
   ```

3. Create a new Azure Bastion resource in the AzureBastionSubnet of your virtual network. It takes about 5 mins for the Bastion resource to be created and deployed.

   ```azurepowershell-interactive
   $bastion = New-AzBastion -ResourceGroupName " myBastionRG " -Name "myBastion" -PublicIpAddress $publicip -VirtualNetwork $vnet
   ```

## Next steps

Read the [Bastion FAQ](bastion-faq.md).
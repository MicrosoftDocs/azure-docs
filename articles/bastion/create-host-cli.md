---
title: 'Deploy Bastion:CLI'
titleSuffix: Azure Bastion
description: Learn how to deploy Azure Bastion using CLI
author: cherylmc
ms.service: bastion
ms.topic: how-to
ms.date: 03/14/2022
ms.author: cherylmc
# Customer intent: As someone with a networking background, I want to deploy Bastion and connect to a VM.
ms.custom: ignite-fall-2021, devx-track-azurecli 
ms.devlang: azurecli
---

# Deploy Bastion using Azure CLI

This article shows you how to deploy Azure Bastion using CLI. Azure Bastion is a PaaS service that's maintained for you, not a bastion host that you install on your VM and maintain yourself. An Azure Bastion deployment is per virtual network, not per subscription/account or virtual machine. For more information about Azure Bastion, see [What is Azure Bastion?](bastion-overview.md) 

Once you deploy Bastion to your virtual network, you can connect to your VMs via private IP address. This seamless RDP/SSH experience is available to all the VMs in the same virtual network. If your VM has a public IP address that you don't need for anything else, you can remove it.

You can also deploy Bastion by using the following other  methods:

* [Azure portal](./tutorial-create-host-portal.md)
* [Azure PowerShell](bastion-create-host-powershell.md)
* [Quickstart - deploy with default settings](quickstart-host-portal.md)

## Prerequisites

### Azure subscription

Verify that you have an Azure subscription. If you don't already have an Azure subscription, you can activate your [MSDN subscriber benefits](https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details) or sign up for a [free account](https://azure.microsoft.com/pricing/free-trial).

### Azure CLI

[!INCLUDE [Cloud Shell CLI](../../includes/vpn-gateway-cloud-shell-cli.md)]

> [!NOTE]
> The use of Azure Bastion with Azure Private DNS Zones is not supported at this time. Before you begin, please make sure that the virtual network where you plan to deploy your Bastion resource is not linked to a private DNS zone.
>

## <a name="createhost"></a>Deploy Bastion

This section helps you deploy Azure Bastion using Azure CLI.

> [!NOTE]
> As shown in the examples, use the `--location` parameter with `--resource-group` for every command to ensure that the resources are deployed together.

1. Create a virtual network and an Azure Bastion subnet. You must create the Azure Bastion subnet using the name value **AzureBastionSubnet**. This value lets Azure know which subnet to deploy the Bastion resources to. This is different than a VPN gateway subnet.

   [!INCLUDE [Note about BastionSubnet size.](../../includes/bastion-subnet-size.md)]

   ```azurecli-interactive
   az network vnet create --resource-group MyResourceGroup --name MyVnet --address-prefix 10.0.0.0/16 --subnet-name AzureBastionSubnet --subnet-prefix 10.0.0.0/24 --location northeurope
   ```

1. Create a public IP address for Azure Bastion. The public IP is the public IP address the Bastion resource on which RDP/SSH will be accessed (over port 443). The public IP address must be in the same region as the Bastion resource you're creating.

   The following example uses the **Standard SKU**. The Standard SKU lets you configure more Bastion features and connect to VMs using more connection types. For more information, see [Bastion SKUs](configuration-settings.md#skus).

   ```azurecli-interactive
   az network public-ip create --resource-group MyResourceGroup --name MyIp --sku Standard --location northeurope
   ```

1. Create a new Azure Bastion resource in the AzureBastionSubnet of your virtual network. It takes about 10 minutes for the Bastion resource to create and deploy.

   ```azurecli-interactive
   az network bastion create --name MyBastion --public-ip-address MyIp --resource-group MyResourceGroup --vnet-name MyVnet --location northeurope
   ```

## <a name="connect"></a>Connect to a VM

You can use the [Connection steps](#steps) in the section below to connect to your VM. You can also use any of the following articles to connect to a VM. Some connection types require the Bastion [Standard SKU](configuration-settings.md#skus).

[!INCLUDE [Links to Connect to VM articles](../../includes/bastion-vm-connect-article-list.md)]

### <a name="steps"></a>Connection steps

[!INCLUDE [Connection steps](../../includes/bastion-vm-connect.md)]

### <a name="audio"></a>To enable audio output

[!INCLUDE [Enable VM audio output](../../includes/bastion-vm-audio.md)]

## <a name="ip"></a>Remove VM public IP address

Azure Bastion doesn't use the public IP address to connect to the client VM. If you don't need the public IP address for your VM, you can disassociate the public IP address. See [Dissociate a public IP address from an Azure VM](../virtual-network/ip-services/remove-public-ip-address-vm.md).

## Next steps

* To use Network Security Groups with the Azure Bastion subnet, see [Work with NSGs](bastion-nsg.md).
* To understand VNet peering, see [VNet peering and Azure Bastion](vnet-peering.md).

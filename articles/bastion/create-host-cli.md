---
title: 'Deploy Bastion: CLI'
titleSuffix: Azure Bastion
description: Learn how to deploy Azure Bastion using CLI
author: cherylmc
ms.service: bastion
ms.topic: how-to
ms.date: 06/08/2023
ms.author: cherylmc
# Customer intent: As someone with a networking background, I want to deploy Bastion and connect to a VM.
ms.custom: ignite-fall-2021, devx-track-azurecli 
ms.devlang: azurecli
---

# Deploy Bastion using Azure CLI

This article shows you how to deploy Azure Bastion using CLI. Azure Bastion is a PaaS service that's maintained for you, not a bastion host that you install on your VM and maintain yourself. An Azure Bastion deployment is per virtual network, not per subscription/account or virtual machine. For more information about Azure Bastion, see [What is Azure Bastion?](bastion-overview.md) 

Once you deploy Bastion to your virtual network, you can connect to your VMs via private IP address. This seamless RDP/SSH experience is available to all the VMs in the same virtual network. If your VM has a public IP address that you don't need for anything else, you can remove it. 

:::image type="content" source="./media/create-host/host-architecture.png" alt-text="Diagram showing Azure Bastion architecture." lightbox="./media/create-host/host-architecture.png":::

In this article, you create a virtual network (if you don't already have one), deploy Azure Bastion using CLI, and connect to a VM. You can also deploy Bastion by using the following other methods:

* [Azure portal](./tutorial-create-host-portal.md)
* [Azure PowerShell](bastion-create-host-powershell.md)
* [Quickstart - deploy with default settings](quickstart-host-portal.md)

[!INCLUDE [DNS private zone](../../includes/bastion-private-dns-zones-non-support.md)]

## Before beginning

### Azure subscription

Verify that you have an Azure subscription. If you don't already have an Azure subscription, you can activate your [MSDN subscriber benefits](https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details) or sign up for a [free account](https://azure.microsoft.com/pricing/free-trial).

### Azure CLI

[!INCLUDE [Cloud Shell CLI](../../includes/vpn-gateway-cloud-shell-cli.md)]

## <a name="createhost"></a>Deploy Bastion

This section helps you deploy Azure Bastion using Azure CLI.

> [!IMPORTANT]
> [!INCLUDE [Pricing](../../includes/bastion-pricing.md)]
>

1. If you don't already have a virtual network, create a resource group and a virtual network using [az group create](/cli/azure/group#az-group-create) and [az network vnet create](/cli/azure/network/vnet#az-network-vnet-create).

   ```azurecli-interactive
   az group create --name TestRG1 --location eastus
   ```

   ```azurecli-interactive
   az network vnet create --resource-group TestRG1 --name VNet1 --address-prefix 10.1.0.0/16 --subnet-name default --subnet-prefix 10.1.0.0/24
   ```

1. Use [az network vnet subnet create](/cli/azure/network/vnet/subnet#az-network-vnet-subnet-create) to create the subnet to which Bastion will be deployed. The subnet you create must be named **AzureBastionSubnet**. This subnet is reserve exclusively for Azure Bastion resources. If you don't have a subnet with the naming value **AzureBastionSubnet**, Bastion won't deploy.

   [!INCLUDE [Note about BastionSubnet size.](../../includes/bastion-subnet-size.md)]

   ```azurecli-interactive
   az network vnet subnet create --name AzureBastionSubnet --resource-group TestRG1 --vnet-name VNet1 --address-prefix 10.1.1.0/26
   ```

1. Create a public IP address for Azure Bastion. The public IP is the public IP address the Bastion resource on which RDP/SSH will be accessed (over port 443). The public IP address must be in the same region as the Bastion resource you're creating. For this reason, pay particular attention to the `--location` value that you specify.

   ```azurecli-interactive
   az network public-ip create --resource-group TestRG1 --name VNet1-ip --sku Standard --location eastus
   ```

1. Use [az network bastion create](/cli/azure/network/bastion#az-network-bastion-create) to create a new Azure Bastion resource for your virtual network. It takes about 10 minutes for the Bastion resource to create and deploy.

   The following example deploys Bastion using the **Basic** SKU tier. The SKU determines the features that your Bastion deployment supports. You can also deploy using the **Standard** SKU. If you don't specify a SKU in your command, the SKU defaults to Standard.  For more information, see [Bastion SKUs](configuration-settings.md#skus).

   ```azurecli-interactive
   az network bastion create --name VNet1-bastion --public-ip-address VNet1-ip --resource-group TestRG1 --vnet-name VNet1 --location eastus --sku Basic
   ```
   
## <a name="connect"></a>Connect to a VM

If you don't already have VMs in your virtual network, you can create a VM using [Quickstart: Create a Windows VM](../virtual-machines/windows/quick-create-portal.md), or [Quickstart: Create a Linux VM](../virtual-machines/linux/quick-create-portal.md) 

You can use any of the following articles, or the steps in the following section, to help you connect to a VM. Some connection types require the Bastion [Standard SKU](configuration-settings.md#skus).

[!INCLUDE [Links to Connect to VM articles](../../includes/bastion-vm-connect-article-list.md)]

### <a name="steps"></a>Connect using the portal

The following steps walk you through one type of connection using the Azure portal.

[!INCLUDE [Connection steps](../../includes/bastion-vm-connect.md)]

### <a name="audio"></a>To enable audio output

[!INCLUDE [Enable VM audio output](../../includes/bastion-vm-audio.md)]

## <a name="ip"></a>Remove VM public IP address

Azure Bastion doesn't use the public IP address to connect to the client VM. If you don't need the public IP address for your VM, you can disassociate the public IP address. See [Dissociate a public IP address from an Azure VM](../virtual-network/ip-services/remove-public-ip-address-vm.md).

## Next steps

* To use Network Security Groups with the Azure Bastion subnet, see [Work with NSGs](bastion-nsg.md).
* To understand VNet peering, see [VNet peering and Azure Bastion](vnet-peering.md).
